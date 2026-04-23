// models/index.js — MongoDB Mongoose Models
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id:         { type: String, required: true, unique: true },
  name:       String,
  email:      { type: String, required: true, unique: true },
  password:   String,
  role:       String,
  department: String
}, { timestamps: true });

const EmployeeSchema = new mongoose.Schema({
  id:         { type: String, required: true, unique: true },
  name:       String,
  email:      { type: String, unique: true },
  password:   String,   // optional — defaults to email_prefix@123
  role:       String,
  department: String,
  salary:     Number,
  joinDate:   String,
  status:     { type: String, default: 'Active' },
  phone:      String,
  address:    String
}, { timestamps: true });

const AttendanceSchema = new mongoose.Schema({
  id:         { type: String, required: true, unique: true },
  employeeId: String,
  date:       String,
  checkIn:    String,
  checkOut:   String,
  status:     String
}, { timestamps: true });

const LeaveSchema = new mongoose.Schema({
  id:           { type: String, required: true, unique: true },
  employeeId:   String,
  employeeName: String,
  type:         String,
  fromDate:     String,
  toDate:       String,
  days:         Number,
  reason:       String,
  status:       { type: String, default: 'Pending' },
  appliedOn:    String
}, { timestamps: true });

const PayrollSchema = new mongoose.Schema({
  id:           { type: String, required: true, unique: true },
  employeeId:   String,
  employeeName: String,
  month:        String,
  year:         Number,
  basic:        Number,
  hra:          Number,
  conveyance:   Number,
  special:      Number,
  gross:        Number,
  pf:           Number,
  pt:           Number,
  tds:          Number,
  deductions:   Number,
  net:          Number,
  status:       { type: String, default: 'Generated' },
  disbursedOn:  String
}, { timestamps: true });

const AnnouncementSchema = new mongoose.Schema({
  id:       { type: String, required: true, unique: true },
  title:    String,
  body:     String,
  author:   String,
  date:     String,
  category: String
}, { timestamps: true });

const JobSchema = new mongoose.Schema({
  id:         { type: String, required: true, unique: true },
  title:      String,
  department: String,
  location:   String,
  applicants: { type: Number, default: 0 },
  stage:      String,
  status:     { type: String, default: 'Active' },
  postedOn:   String
}, { timestamps: true });

module.exports = {
  User:         mongoose.model('User', UserSchema),
  Employee:     mongoose.model('Employee', EmployeeSchema),
  Attendance:   mongoose.model('Attendance', AttendanceSchema),
  Leave:        mongoose.model('Leave', LeaveSchema),
  Payroll:      mongoose.model('Payroll', PayrollSchema),
  Announcement: mongoose.model('Announcement', AnnouncementSchema),
  Job:          mongoose.model('Job', JobSchema)
};
