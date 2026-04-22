// routes/dashboard.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// GET /api/dashboard/summary
router.get('/summary', auth, (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = db.attendance.filter(a => a.date === today);

  const summary = {
    totalEmployees: db.employees.length,
    activeEmployees: db.employees.filter(e => e.status === 'Active').length,
    presentToday: todayAttendance.filter(a => a.status === 'Present' || a.status === 'WFH').length,
    onLeaveToday: todayAttendance.filter(a => a.status === 'Leave').length,
    pendingLeaves: db.leaves.filter(l => l.status === 'Pending').length,
    openJobs: db.jobs.filter(j => j.status === 'Active').length,
    monthlyPayroll: db.employees.reduce((s, e) => s + e.salary, 0),
    departments: [...new Set(db.employees.map(e => e.department))].map(dept => ({
      name: dept,
      count: db.employees.filter(e => e.department === dept).length
    })),
    recentEmployees: db.employees.slice(-4).reverse()
  };

  res.json({ data: summary });
});

module.exports = router;
