// routes/announcements.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { Announcement } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const data = await Announcement.find().sort({ date: -1 }).lean();
  res.json({ data, total: data.length });
});

router.post('/', auth, async (req, res) => {
  const ann = await Announcement.create({ id: uuidv4(), ...req.body, author: 'HR Admin', date: new Date().toISOString().split('T')[0] });
  res.status(201).json({ data: ann, message: 'Announcement posted' });
});

router.delete('/:id', auth, async (req, res) => {
  const ann = await Announcement.findOneAndDelete({ id: req.params.id });
  if (!ann) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;
