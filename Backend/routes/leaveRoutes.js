const express = require("express");
const router = express.Router();
const Leave = require("../models/Leave");

// Apply for leave
router.post("/", async (req, res) => {
  try {
    const { employeeId, employeeName, leaveType, fromDate, toDate, reason } = req.body;
    const leave = new Leave({ employeeId, employeeName, leaveType, fromDate, toDate, reason });
    await leave.save();
    res.json(leave);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get leaves for one employee
router.get("/employee/:id", async (req, res) => {
  try {
    const leaves = await Leave.find({ employeeId: req.params.id }).sort({ appliedAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all leaves (admin)
router.get("/", async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ appliedAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve / Reject leave (admin)
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(leave);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
