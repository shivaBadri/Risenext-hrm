// routes/employees.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { Employee } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const { department, status, search } = req.query;
  let query = {};
  if (department) query.department = department;
  if (status) query.status = status;
  if (search) query.name = { $regex: search, $options: 'i' };
  const data = await Employee.find(query).lean();
  res.json({ data, total: data.length });
});

router.get('/:id', auth, async (req, res) => {
  const emp = await Employee.findOne({ id: req.params.id }).lean();
  if (!emp) return res.status(404).json({ error: 'Employee not found' });
  res.json({ data: emp });
});

router.post('/', auth, async (req, res) => {
  const existing = await Employee.find().lean();
  const lastNum = existing.reduce((max, e) => {
    const n = parseInt(e.id.split('-')[1]) || 0;
    return n > max ? n : max;
  }, 1000);
  const id = 'RN-' + (lastNum + 1);
  const emp = await Employee.create({ id, ...req.body, joinDate: new Date().toISOString().split('T')[0], status: req.body.status || 'Active' });
  res.status(201).json({ data: emp, message: 'Employee added' });
});

router.put('/:id', auth, async (req, res) => {
  const emp = await Employee.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  if (!emp) return res.status(404).json({ error: 'Employee not found' });
  res.json({ data: emp, message: 'Employee updated' });
});

router.delete('/:id', auth, async (req, res) => {
  const emp = await Employee.findOneAndDelete({ id: req.params.id });
  if (!emp) return res.status(404).json({ error: 'Employee not found' });
  res.json({ message: 'Employee deleted' });
});

module.exports = router;
