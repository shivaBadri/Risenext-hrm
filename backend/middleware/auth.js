// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Employee } = require('../models');
const auth = require('../middleware/auth');

// POST /api/auth/login — works for both admin and employees
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  // Check admin users first
  const user = await User.findOne({ email });
  if (user) {
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department } });
  }

  // Check employees
  const emp = await Employee.findOne({ email });
  if (emp) {
    // Employee password is their email prefix + @123 by default, or stored hash
    const defaultPass = emp.email.split('@')[0] + '@123';
    const storedPass = emp.password || null;
    const valid = storedPass
      ? await bcrypt.compare(password, storedPass)
      : password === defaultPass;
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: emp.id, email: emp.email, role: 'employee', empId: emp.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    return res.json({ token, user: { id: emp.id, name: emp.name, email: emp.email, role: 'employee', department: emp.department, empId: emp.id } });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
});

// POST /api/auth/change-password
router.post('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Both passwords required' });
  if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  if (req.user.role === 'admin') {
    const user = await User.findOne({ id: req.user.id });
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ error: 'Current password incorrect' });
    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();
  } else {
    const emp = await Employee.findOne({ id: req.user.id });
    const defaultPass = emp.email.split('@')[0] + '@123';
    const storedPass = emp.password || null;
    const valid = storedPass ? await bcrypt.compare(currentPassword, storedPass) : currentPassword === defaultPass;
    if (!valid) return res.status(401).json({ error: 'Current password incorrect' });
    emp.password = bcrypt.hashSync(newPassword, 10);
    await emp.save();
  }
  res.json({ message: 'Password changed successfully' });
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  if (req.user.role === 'admin') {
    const user = await User.findOne({ id: req.user.id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ data: { id: user.id, name: user.name, email: user.email, role: user.role } });
  }
  const emp = await Employee.findOne({ id: req.user.id });
  if (!emp) return res.status(404).json({ error: 'Employee not found' });
  res.json({ data: { id: emp.id, name: emp.name, email: emp.email, role: 'employee', department: emp.department, empId: emp.id } });
});

module.exports = router;
