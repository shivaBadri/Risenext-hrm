// routes/leaves.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const auth = require('../middleware/auth');

// GET /api/leaves
router.get('/', auth, (req, res) => {
  const { employeeId, status } = req.query;
  let list = [...db.leaves];

  if (employeeId) list = list.filter(l => l.employeeId === employeeId);
  if (status && status !== 'All') list = list.filter(l => l.status === status);

  res.json({ data: list, total: list.length });
});

// GET /api/leaves/:id
router.get('/:id', auth, (req, res) => {
  const leave = db.leaves.find(l => l.id === req.params.id);
  if (!leave) return res.status(404).json({ error: 'Leave not found' });
  res.json({ data: leave });
});

// POST /api/leaves
router.post('/', auth, (req, res) => {
  const { employeeId, type, fromDate, toDate, reason } = req.body;

  if (!employeeId || !type || !fromDate || !toDate || !reason) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const emp = db.employees.find(e => e.id === employeeId);
  if (!emp) return res.status(404).json({ error: 'Employee not found' });

  const from = new Date(fromDate);
  const to = new Date(toDate);
  const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;

  const leave = {
    id: uuidv4(),
    employeeId,
    employeeName: emp.name,
    type,
    fromDate,
    toDate,
    days,
    reason,
    status: 'Pending',
    appliedOn: new Date().toISOString().split('T')[0]
  };

  db.leaves.push(leave);
  res.status(201).json({ data: leave, message: 'Leave applied successfully' });
});

// PUT /api/leaves/:id/approve
router.put('/:id/approve', auth, (req, res) => {
  const idx = db.leaves.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Leave not found' });

  db.leaves[idx].status = 'Approved';
  db.leaves[idx].approvedBy = req.user.name;
  db.leaves[idx].approvedOn = new Date().toISOString().split('T')[0];

  // Mark attendance as Leave for those dates
  const leave = db.leaves[idx];
  const from = new Date(leave.fromDate);
  const to = new Date(leave.toDate);
  for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const exists = db.attendance.find(a => a.employeeId === leave.employeeId && a.date === dateStr);
    if (!exists) {
      db.attendance.push({ id: uuidv4(), employeeId: leave.employeeId, date: dateStr, checkIn: null, checkOut: null, status: 'Leave' });
    }
  }

  res.json({ data: db.leaves[idx], message: 'Leave approved' });
});

// PUT /api/leaves/:id/reject
router.put('/:id/reject', auth, (req, res) => {
  const idx = db.leaves.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Leave not found' });

  db.leaves[idx].status = 'Rejected';
  db.leaves[idx].rejectedBy = req.user.name;
  res.json({ data: db.leaves[idx], message: 'Leave rejected' });
});

// DELETE /api/leaves/:id
router.delete('/:id', auth, (req, res) => {
  const idx = db.leaves.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Leave not found' });

  if (db.leaves[idx].status !== 'Pending') {
    return res.status(400).json({ error: 'Only pending leaves can be cancelled' });
  }

  db.leaves.splice(idx, 1);
  res.json({ message: 'Leave cancelled' });
});

module.exports = router;
