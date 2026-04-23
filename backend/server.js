// server.js — Rise Next HRM Portal Backend
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const seedDatabase = require('./seed');

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Serve Frontend ───────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../frontend')));

// ── API Routes ──────────────────────────────────────────────────────────
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/employees',     require('./routes/employees'));
app.use('/api/attendance',    require('./routes/attendance'));
app.use('/api/leaves',        require('./routes/leaves'));
app.use('/api/payroll',       require('./routes/payroll'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/jobs',          require('./routes/jobs'));
app.use('/api/dashboard',     require('./routes/dashboard'));

app.get('/api/health', (req, res) => res.json({ status: 'OK', app: 'Rise Next HRM Portal', time: new Date().toISOString() }));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Connect MongoDB & Start ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`\n🚀 Rise Next HRM Portal running on http://localhost:${PORT}`);
      console.log(`   Login: admin@risenext.com / admin@123\n`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
