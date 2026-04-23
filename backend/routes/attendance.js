// routes/attendance.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { Attendance, Employee } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const { date, employeeId, month, year } = req.query;
  let query = {};
  if (date) query.date = date;
  if (employeeId) query.employeeId = employeeId;
  if (month && year) {
    const m = String(month).padStart(2, '0');
    query.date = { $regex: `^${year}-${m}` };
  }
  const data = await Attendance.find(query).lean();
  const enriched = await Promise.all(data.map(async a => {
    const emp = await Employee.findOne({ id: a.employeeId }).lean();
    return { ...a, employeeName: emp ? emp.name : 'Unknown' };
  }));
  res.json({ data: enriched, total: enriched.length });
});

router.post('/', auth, async (req, res) => {
  const record = await Attendance.create({ id: uuidv4(), ...req.body });
  res.status(201).json({ data: record, message: 'Attendance marked' });
});

router.post('/checkin', auth, async (req, res) => {
  const { employeeId } = req.body;
  const today = new Date().toISOString().split('T')[0];
  const existing = await Attendance.findOne({ employeeId, date: today });
  if (existing) return res.status(400).json({ error: 'Already checked in today' });
  const checkIn = new Date().toTimeString().slice(0, 5);
  const record = await Attendance.create({ id: uuidv4(), employeeId, date: today, checkIn, status: 'Present' });
  res.status(201).json({ data: record, message: 'Checked in successfully' });
});

router.put('/checkout/:id', auth, async (req, res) => {
  const checkOut = new Date().toTimeString().slice(0, 5);
  const record = await Attendance.findOneAndUpdate({ id: req.params.id }, { checkOut }, { new: true });
  if (!record) return res.status(404).json({ error: 'Record not found' });
  res.json({ data: record, message: 'Checked out successfully' });
});

router.get('/summary/:employeeId', auth, async (req, res) => {
  const { month, year } = req.query;
  const m = String(month).padStart(2, '0');
  const records = await Attendance.find({ employeeId: req.params.employeeId, date: { $regex: `^${year}-${m}` } }).lean();
  const present = records.filter(r => r.status === 'Present').length;
  const absent = records.filter(r => r.status === 'Absent').length;
  const leave = records.filter(r => r.status === 'Leave').length;
  res.json({ data: { present, absent, leave, total: records.length } });
});

module.exports = router;
