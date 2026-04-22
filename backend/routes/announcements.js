// routes/announcements.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  res.json({ data: db.announcements, total: db.announcements.length });
});

router.post('/', auth, (req, res) => {
  const { title, body, category } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'title and body are required' });

  const ann = {
    id: uuidv4(),
    title,
    body,
    category: category || 'General',
    author: req.user.name,
    date: new Date().toISOString().split('T')[0]
  };
  db.announcements.unshift(ann);
  res.status(201).json({ data: ann, message: 'Announcement posted' });
});

router.delete('/:id', auth, (req, res) => {
  const idx = db.announcements.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.announcements.splice(idx, 1);
  res.json({ message: 'Deleted' });
});

module.exports = router;
