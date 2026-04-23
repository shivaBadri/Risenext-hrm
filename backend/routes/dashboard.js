// routes/dashboard.js
const express = require('express');
const router = express.Router();
const { Employee, Attendance, Leave, Payroll } = require('../models');
const auth = require('../middleware/auth');

router.get('/summary', auth, async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const [totalEmployees, todayAtt, pendingLeaves, payroll] = await Promise.all([
    Employee.countDocuments({ status: 'Active' }),
    Attendance.find({ date: today }).lean(),
    Leave.countDocuments({ status: 'Pending' }),
    Payroll.find({ month: 'April', year: 2026 }).lean()
  ]);
  const presentToday = todayAtt.filter(a => a.status === 'Present').length;
  const onLeaveToday = todayAtt.filter(a => a.status === 'Leave').length;
  const totalPayroll = payroll.reduce((s, p) => s + p.gross, 0);
  res.json({ data: { totalEmployees, presentToday, onLeaveToday, pendingLeaves, totalPayroll } });
});

module.exports = router;
