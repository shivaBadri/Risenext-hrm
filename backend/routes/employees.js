// routes/employees.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const auth = require('../middleware/auth');

// GET /api/employees
router.get('/', auth, (req, res) => {
  const { department, status, search } = req.query;
  let list = [...db.employees];

  if (department && department !== 'All') {
    list = list.filter(e => e.department === department);
  }
  if (status && status !== 'All') {
    list = list.filter(e => e.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.role.toLowerCase().includes(q)
    );
  }

  res.json({ data: list, total: list.length });
});

// GET /api/employees/:id
router.get('/:id', auth, (req, res) => {
  const emp = db.employees.find(e => e.id === req.params.id);
  if (!emp) return res.status(404).json({ error: 'Employee not found' });
  res.json({ data: emp });
});

// POST /api/employees
router.post('/', auth, (req, res) => {
  const { name, email, role, department, salary, phone, address } = req.body;

  if (!name || !email || !role || !department || !salary) {
    return res.status(400).json({ error: 'name, email, role, department and salary are required' });
  }

  const exists = db.employees.find(e => e.email === email);
  if (exists) return res.status(409).json({ error: 'Employee with this email already exists' });

  const newEmp = {
    id: 'RN-' + String(db.employees.length + 1001).padStart(4, '0'),
    name,
    email,
    role,
    department,
    salary: Number(salary),
    joinDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    phone: phone || '',
    address: address || 'Hyderabad, Telangana'
  };

  db.employees.push(newEmp);
  res.status(201).json({ data: newEmp, message: 'Employee added successfully' });
});

// PUT /api/employees/:id
router.put('/:id', auth, (req, res) => {
  const idx = db.employees.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Employee not found' });

  const allowed = ['name', 'email', 'role', 'department', 'salary', 'status', 'phone', 'address'];
  allowed.forEach(field => {
    if (req.body[field] !== undefined) {
      db.employees[idx][field] = field === 'salary' ? Number(req.body[field]) : req.body[field];
    }
  });

  res.json({ data: db.employees[idx], message: 'Employee updated successfully' });
});

// DELETE /api/employees/:id
router.delete('/:id', auth, (req, res) => {
  const idx = db.employees.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Employee not found' });

  db.employees.splice(idx, 1);
  res.json({ message: 'Employee deleted successfully' });
});

module.exports = router;
