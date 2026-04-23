// routes/jobs.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { Job } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const data = await Job.find().lean();
  res.json({ data, total: data.length });
});

router.post('/', auth, async (req, res) => {
  const job = await Job.create({ id: uuidv4(), ...req.body, applicants: 0, postedOn: new Date().toISOString().split('T')[0], status: 'Active' });
  res.status(201).json({ data: job, message: 'Job posted' });
});

router.put('/:id', auth, async (req, res) => {
  const job = await Job.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json({ data: job, message: 'Job updated' });
});

router.delete('/:id', auth, async (req, res) => {
  const job = await Job.findOneAndDelete({ id: req.params.id });
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json({ message: 'Job deleted' });
});

module.exports = router;
