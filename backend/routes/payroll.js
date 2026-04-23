// routes/payroll.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { Payroll, Employee } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const { month, year, employeeId } = req.query;
  let query = {};
  if (month) query.month = month;
  if (year) query.year = Number(year);
  if (employeeId) query.employeeId = employeeId;
  const data = await Payroll.find(query).lean();
  const enriched = await Promise.all(data.map(async p => {
    const emp = await Employee.findOne({ id: p.employeeId }).lean();
    return { ...p, employeeName: emp ? emp.name : p.employeeName || 'Unknown', role: emp ? emp.role : '', department: emp ? emp.department : '' };
  }));
  const totalGross = enriched.reduce((s, p) => s + p.gross, 0);
  const totalNet = enriched.reduce((s, p) => s + p.net, 0);
  res.json({ data: enriched, total: enriched.length, totalGross, totalNet });
});

router.get('/:id', auth, async (req, res) => {
  const p = await Payroll.findOne({ id: req.params.id }).lean();
  if (!p) return res.status(404).json({ error: 'Payslip not found' });
  const emp = await Employee.findOne({ id: p.employeeId }).lean();
  res.json({ data: { ...p, employeeName: emp ? emp.name : 'Unknown', role: emp ? emp.role : '' } });
});

router.post('/generate', auth, async (req, res) => {
  const { month, year } = req.body;
  if (!month || !year) return res.status(400).json({ error: 'month and year required' });
  const employees = await Employee.find().lean();
  const generated = [];
  for (const emp of employees) {
    const exists = await Payroll.findOne({ employeeId: emp.id, month, year: Number(year) });
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
    const slip = await Payroll.create({ id: uuidv4(), employeeId: emp.id, employeeName: emp.name, month, year: Number(year), basic, hra, conveyance, special, gross, pf, pt, tds, deductions, net, status: 'Generated' });
    generated.push(slip);
  }
  res.status(201).json({ message: `Generated ${generated.length} payslips`, data: generated });
});

router.put('/:id/disburse', auth, async (req, res) => {
  const p = await Payroll.findOneAndUpdate({ id: req.params.id }, { status: 'Paid', disbursedOn: new Date().toISOString().split('T')[0] }, { new: true });
  if (!p) return res.status(404).json({ error: 'Payslip not found' });
  res.json({ data: p, message: 'Marked as paid' });
});

module.exports = router;
