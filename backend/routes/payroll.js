// routes/payroll.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const auth = require('../middleware/auth');

// GET /api/payroll
router.get('/', auth, (req, res) => {
  const { month, year, employeeId } = req.query;
  let list = [...db.payroll];

  if (month) list = list.filter(p => p.month === month);
  if (year) list = list.filter(p => p.year === Number(year));
  if (employeeId) list = list.filter(p => p.employeeId === employeeId);

  const enriched = list.map(p => {
    const emp = db.employees.find(e => e.id === p.employeeId);
    return { ...p, employeeName: emp ? emp.name : 'Unknown', role: emp ? emp.role : '', department: emp ? emp.department : '' };
  });

  const totalGross = enriched.reduce((s, p) => s + p.gross, 0);
  const totalNet = enriched.reduce((s, p) => s + p.net, 0);

  res.json({ data: enriched, total: enriched.length, totalGross, totalNet });
});

// GET /api/payroll/:id
router.get('/:id', auth, (req, res) => {
  const payslip = db.payroll.find(p => p.id === req.params.id);
  if (!payslip) return res.status(404).json({ error: 'Payslip not found' });

  const emp = db.employees.find(e => e.id === payslip.employeeId);
  res.json({ data: { ...payslip, employeeName: emp ? emp.name : 'Unknown', role: emp ? emp.role : '' } });
});

// POST /api/payroll/generate
router.post('/generate', auth, (req, res) => {
  const { month, year } = req.body;
  if (!month || !year) return res.status(400).json({ error: 'month and year are required' });

  const generated = [];
  for (const emp of db.employees) {
    const exists = db.payroll.find(p => p.employeeId === emp.id && p.month === month && p.year === Number(year));
    if (exists) continue;

    const gross = emp.salary;
    const basic = Math.round(gross * 0.56);
    const hra = Math.round(gross * 0.224);
    const conveyance = Math.round(gross * 0.064);
    const special = gross - basic - hra - conveyance;
    const pf = Math.round(basic * 0.12);
    const pt = 200;
    const tds = gross > 50000 ? Math.round((gross - 50000) * 0.1) : 0;
    const deductions = pf + pt + tds;
    const net = gross - deductions;

    const slip = { id: uuidv4(), employeeId: emp.id, month, year: Number(year), basic, hra, conveyance, special, gross, pf, pt, tds, deductions, net, status: 'Generated' };
    db.payroll.push(slip);
    generated.push(slip);
  }

  res.status(201).json({ message: `Generated ${generated.length} payslips`, data: generated });
});

// PUT /api/payroll/:id/disburse
router.put('/:id/disburse', auth, (req, res) => {
  const idx = db.payroll.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Payslip not found' });

  db.payroll[idx].status = 'Paid';
  db.payroll[idx].disbursedOn = new Date().toISOString().split('T')[0];
  res.json({ data: db.payroll[idx], message: 'Payslip marked as paid' });
});

module.exports = router;
