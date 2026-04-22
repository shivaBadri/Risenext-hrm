// db.js — In-memory datastore (replace with MongoDB/PostgreSQL for production)
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const db = {
  users: [
    {
      id: 'admin-001',
      name: 'HR Admin',
      email: 'admin@risenext.com',
      password: bcrypt.hashSync('admin@123', 10),
      role: 'admin',
      department: 'HR'
    }
  ],

  employees: [
    {
      id: 'RN-1001',
      name: 'Badri Shiva',
      email: 'shivabadri19@gmail.com',
      role: 'Web Developer',
      department: 'IT',
      salary: 25000,
      joinDate: '2026-01-15',
      status: 'Active',
      phone: '+91-9876543210',
      address: 'Hyderabad, Telangana'
    },
    {
      id: 'RN-1002',
      name: 'Upender',
      email: 'upender@risenext.com',
      role: 'Director',
      department: 'IT',
      salary: 75000,
      joinDate: '2025-06-01',
      status: 'Active',
      phone: '+91-9876543211',
      address: 'Hyderabad, Telangana'
    },
    {
      id: 'RN-1003',
      name: 'Vinay',
      email: 'vinay@risenext.com',
      role: 'Director',
      department: 'IT',
      salary: 75000,
      joinDate: '2025-06-01',
      status: 'Active',
      phone: '+91-9876543212',
      address: 'Hyderabad, Telangana'
    },
    {
      id: 'RN-1004',
      name: 'Purushottam',
      email: 'purushottam@risenext.com',
      role: 'Tele Caller',
      department: 'AR',
      salary: 12000,
      joinDate: '2026-02-01',
      status: 'Active',
      phone: '+91-9876543213',
      address: 'Hyderabad, Telangana'
    },
    {
      id: 'RN-1005',
      name: 'Navya Bairu',
      email: 'navyabairu@risenext.com',
      role: 'Tele Caller',
      department: 'AR',
      salary: 12000,
      joinDate: '2026-02-01',
      status: 'Active',
      phone: '+91-9876543214',
      address: 'Hyderabad, Telangana'
    },
    {
      id: 'RN-1006',
      name: 'Sruthi',
      email: 'sruthi@risenext.com',
      role: 'Tele Caller',
      department: 'AR',
      salary: 12000,
      joinDate: '2026-02-01',
      status: 'Active',
      phone: '+91-9876543215',
      address: 'Hyderabad, Telangana'
    }
  ],

  attendance: [
    { id: uuidv4(), employeeId: 'RN-1001', date: '2026-04-20', checkIn: '09:05', checkOut: '18:15', status: 'Present' },
    { id: uuidv4(), employeeId: 'RN-1002', date: '2026-04-20', checkIn: '09:30', checkOut: '18:30', status: 'Present' },
    { id: uuidv4(), employeeId: 'RN-1003', date: '2026-04-20', checkIn: '09:15', checkOut: '18:45', status: 'Present' },
    { id: uuidv4(), employeeId: 'RN-1004', date: '2026-04-20', checkIn: '09:00', checkOut: '18:00', status: 'Present' },
    { id: uuidv4(), employeeId: 'RN-1005', date: '2026-04-20', checkIn: null, checkOut: null, status: 'Leave' },
    { id: uuidv4(), employeeId: 'RN-1006', date: '2026-04-20', checkIn: '09:10', checkOut: '18:10', status: 'Present' }
  ],

  leaves: [
    { id: uuidv4(), employeeId: 'RN-1005', employeeName: 'Navya Bairu', type: 'Casual Leave', fromDate: '2026-04-20', toDate: '2026-04-20', days: 1, reason: 'Personal work', status: 'Pending', appliedOn: '2026-04-19' },
    { id: uuidv4(), employeeId: 'RN-1001', employeeName: 'Badri Shiva', type: 'Earned Leave', fromDate: '2026-03-10', toDate: '2026-03-12', days: 3, reason: 'Family travel', status: 'Approved', appliedOn: '2026-03-05' },
    { id: uuidv4(), employeeId: 'RN-1006', employeeName: 'Sruthi', type: 'Sick Leave', fromDate: '2026-02-05', toDate: '2026-02-05', days: 1, reason: 'Fever', status: 'Approved', appliedOn: '2026-02-05' },
    { id: uuidv4(), employeeId: 'RN-1004', employeeName: 'Purushottam', type: 'Casual Leave', fromDate: '2026-01-20', toDate: '2026-01-20', days: 1, reason: 'Personal', status: 'Approved', appliedOn: '2026-01-19' }
  ],

  payroll: [
    { id: uuidv4(), employeeId: 'RN-1001', month: 'April', year: 2026, basic: 14000, hra: 5600, conveyance: 1600, special: 3800, gross: 25000, pf: 1800, pt: 200, tds: 0, deductions: 2000, net: 23000, status: 'Paid' },
    { id: uuidv4(), employeeId: 'RN-1002', month: 'April', year: 2026, basic: 42000, hra: 16800, conveyance: 2400, special: 13800, gross: 75000, pf: 5400, pt: 200, tds: 5000, deductions: 10600, net: 64400, status: 'Paid' },
    { id: uuidv4(), employeeId: 'RN-1003', month: 'April', year: 2026, basic: 42000, hra: 16800, conveyance: 2400, special: 13800, gross: 75000, pf: 5400, pt: 200, tds: 5000, deductions: 10600, net: 64400, status: 'Paid' },
    { id: uuidv4(), employeeId: 'RN-1004', month: 'April', year: 2026, basic: 6720, hra: 2688, conveyance: 960, special: 1632, gross: 12000, pf: 864, pt: 200, tds: 0, deductions: 1064, net: 10936, status: 'Paid' },
    { id: uuidv4(), employeeId: 'RN-1005', month: 'April', year: 2026, basic: 6720, hra: 2688, conveyance: 960, special: 1632, gross: 12000, pf: 864, pt: 200, tds: 0, deductions: 1064, net: 10936, status: 'Paid' },
    { id: uuidv4(), employeeId: 'RN-1006', month: 'April', year: 2026, basic: 6720, hra: 2688, conveyance: 960, special: 1632, gross: 12000, pf: 864, pt: 200, tds: 0, deductions: 1064, net: 10936, status: 'Paid' }
  ],

  announcements: [
    { id: uuidv4(), title: 'Q2 Appraisal Cycle — Submissions Due Today', body: 'All managers must submit performance scores by EOD. Self-assessments must be completed before 5 PM.', author: 'HR Team', date: '2026-04-20', category: 'HR' },
    { id: uuidv4(), title: 'Tax Declaration Deadline — 30 April 2026', body: 'All employees please submit investment declarations by April 30 to avoid higher TDS deductions.', author: 'Finance', date: '2026-04-14', category: 'Finance' },
    { id: uuidv4(), title: 'Welcome to Rise Next!', body: 'We are excited to have our growing team onboard. Connect with your colleagues and make it a great place to work!', author: 'HR Team', date: '2026-04-10', category: 'General' }
  ],

  jobs: [
    { id: uuidv4(), title: 'Full Stack Developer', department: 'IT', location: 'Hyderabad / Remote', applicants: 11, stage: 'Interview', status: 'Active', postedOn: '2026-04-01' },
    { id: uuidv4(), title: 'Tele Caller', department: 'AR', location: 'Hyderabad', applicants: 8, stage: 'Shortlisting', status: 'Active', postedOn: '2026-04-05' },
    { id: uuidv4(), title: 'AR Team Lead', department: 'AR', location: 'Hyderabad', applicants: 2, stage: 'Yet to open', status: 'Draft', postedOn: '2026-04-10' }
  ]
};

module.exports = db;
