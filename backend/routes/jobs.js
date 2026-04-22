// routes/jobs.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  res.json({ data: db.jobs, total: db.jobs.length });
});

router.post('/', auth, (req, res) => {
  const { title, department, location } = req.body;
  if (!title || !department) return res.status(400).json({ error: 'title and department are required' });

  const job = {
    id: uuidv4(),
    title,
    department,
    location: location || 'Hyderabad',
    applicants: 0,
    stage: 'Yet to open',
    status: 'Active',
    postedOn: new Date().toISOString().split('T')[0]
  };
  db.jobs.push(job);
  res.status(201).json({ data: job, message: 'Job posted' });
});

router.put('/:id', auth, (req, res) => {
  const idx = db.jobs.findIndex(j => j.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Job not found' });

  ['title', 'department', 'location', 'stage', 'status', 'applicants'].forEach(f => {
    if (req.body[f] !== undefined) db.jobs[idx][f] = req.body[f];
  });
  res.json({ data: db.jobs[idx], message: 'Job updated' });
});

router.delete('/:id', auth, (req, res) => {
  const idx = db.jobs.findIndex(j => j.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Job not found' });
  db.jobs.splice(idx, 1);
  res.json({ message: 'Job deleted' });
});

module.exports = router;
