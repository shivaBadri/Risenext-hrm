// routes/attendance.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const auth = require('../middleware/auth');

// GET /api/attendance?date=YYYY-MM-DD
router.get('/', auth, (req, res) => {
  const { date, employeeId, month, year } = req.query;
  let list = [...db.attendance];

  if (date) list = list.filter(a => a.date === date);
  if (employeeId) list = list.filter(a => a.employeeId === employeeId);
  if (month && year) {
    list = list.filter(a => {
      const d = new Date(a.date);
      return d.getMonth() + 1 === Number(month) && d.getFullYear() === Number(year);
    });
  }

  // Enrich with employee name
  const enriched = list.map(a => {
    const emp = db.employees.find(e => e.id === a.employeeId);
    return { ...a, employeeName: emp ? emp.name : 'Unknown', department: emp ? emp.department : '' };
  });

  res.json({ data: enriched, total: enriched.length });
});

// POST /api/attendance/checkin
router.post('/checkin', auth, (req, res) => {
  const { employeeId } = req.body;
  const today = new Date().toISOString().split('T')[0];
  const time = new Date().toTimeString().slice(0, 5);

  const exists = db.attendance.find(a => a.employeeId === employeeId && a.date === today);
  if (exists) return res.status(409).json({ error: 'Already checked in today' });

  const record = { id: uuidv4(), employeeId, date: today, checkIn: time, checkOut: null, status: 'Present' };
  db.attendance.push(record);
  res.status(201).json({ data: record, message: 'Checked in successfully' });
});

// PUT /api/attendance/checkout/:id
router.put('/checkout/:id', auth, (req, res) => {
  const idx = db.attendance.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Attendance record not found' });

  const time = new Date().toTimeString().slice(0, 5);
  db.attendance[idx].checkOut = time;
  res.json({ data: db.attendance[idx], message: 'Checked out successfully' });
});

// POST /api/attendance (manual mark)
router.post('/', auth, (req, res) => {
  const { employeeId, date, checkIn, checkOut, status } = req.body;
  if (!employeeId || !date || !status) {
    return res.status(400).json({ error: 'employeeId, date and status are required' });
  }

  const exists = db.attendance.find(a => a.employeeId === employeeId && a.date === date);
  if (exists) return res.status(409).json({ error: 'Record already exists for this date' });

  const record = { id: uuidv4(), employeeId, date, checkIn: checkIn || null, checkOut: checkOut || null, status };
  db.attendance.push(record);
  res.status(201).json({ data: record, message: 'Attendance marked' });
});

// GET /api/attendance/summary/:employeeId
router.get('/summary/:employeeId', auth, (req, res) => {
  const { month, year } = req.query;
  let records = db.attendance.filter(a => a.employeeId === req.params.employeeId);

  if (month && year) {
    records = records.filter(a => {
      const d = new Date(a.date);
      return d.getMonth() + 1 === Number(month) && d.getFullYear() === Number(year);
    });
  }

  const summary = {
    present: records.filter(r => r.status === 'Present').length,
    absent: records.filter(r => r.status === 'Absent').length,
    leave: records.filter(r => r.status === 'Leave').length,
    wfh: records.filter(r => r.status === 'WFH').length,
    total: records.length
  };
  summary.percentage = summary.total > 0
    ? Math.round((summary.present / summary.total) * 100)
    : 0;

  res.json({ data: summary, records });
});

module.exports = router;
