const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

// Mark attendance (admin marks for employee)
router.post("/", async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;
    const existing = await Attendance.findOne({ employeeId, date });
    if (existing) {
      existing.status = status;
      await existing.save();
      return res.json(existing);
    }
    const record = new Attendance({ employeeId, date, status });
    await record.save();
    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get attendance for one employee
router.get("/employee/:id", async (req, res) => {
  try {
    const records = await Attendance.find({ employeeId: req.params.id }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all attendance for a date (admin)
router.get("/date/:date", async (req, res) => {
  try {
    const records = await Attendance.find({ date: req.params.date }).populate("employeeId", "name department role");
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get monthly attendance summary for employee
router.get("/summary/:id/:month", async (req, res) => {
  try {
    const { id, month } = req.params; // month = YYYY-MM
    const records = await Attendance.find({ employeeId: id, date: { $regex: `^${month}` } });
    const summary = { Present: 0, Absent: 0, "Half Day": 0, Leave: 0 };
    records.forEach(r => { if (summary[r.status] !== undefined) summary[r.status]++; });
    res.json({ summary, records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
