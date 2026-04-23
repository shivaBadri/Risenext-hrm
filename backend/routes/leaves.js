// routes/leaves.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { Leave, Employee } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const { status, employeeId } = req.query;
  let query = {};
  if (status) query.status = status;
  if (employeeId) query.employeeId = employeeId;
  const data = await Leave.find(query).sort({ appliedOn: -1 }).lean();
  const enriched = await Promise.all(data.map(async l => {
    const emp = await Employee.findOne({ id: l.employeeId }).lean();
    return { ...l, employeeName: emp ? emp.name : l.employeeName };
  }));
  res.json({ data: enriched, total: enriched.length });
});

router.post('/', auth, async (req, res) => {
  const { employeeId, fromDate, toDate } = req.body;
  const emp = await Employee.findOne({ id: employeeId }).lean();
  const from = new Date(fromDate), to = new Date(toDate);
  const days = Math.ceil((to - from) / (1000*60*60*24)) + 1;
  const leave = await Leave.create({
    id: uuidv4(), ...req.body,
    employeeName: emp ? emp.name : 'Unknown',
    days, status: 'Pending',
    appliedOn: new Date().toISOString().split('T')[0]
  });
  res.status(201).json({ data: leave, message: 'Leave applied' });
});

router.put('/:id/approve', auth, async (req, res) => {
  const leave = await Leave.findOneAndUpdate({ id: req.params.id }, { status: 'Approved' }, { new: true });
  if (!leave) return res.status(404).json({ error: 'Leave not found' });
  res.json({ data: leave, message: 'Leave approved' });
});

router.put('/:id/reject', auth, async (req, res) => {
  const leave = await Leave.findOneAndUpdate({ id: req.params.id }, { status: 'Rejected' }, { new: true });
  if (!leave) return res.status(404).json({ error: 'Leave not found' });
  res.json({ data: leave, message: 'Leave rejected' });
});

router.delete('/:id', auth, async (req, res) => {
  const leave = await Leave.findOneAndDelete({ id: req.params.id });
  if (!leave) return res.status(404).json({ error: 'Leave not found' });
  res.json({ message: 'Leave cancelled' });
});

module.exports = router;
