const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Employee = require("../models/Employee");

// GET all employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find().select("-password");
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single employee
router.get("/:id", async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id).select("-password");
    if (!emp) return res.status(404).json({ error: "Employee not found" });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD employee
router.post("/", async (req, res) => {
  try {
    const { name, email, role, salary, department, password } = req.body;
    // Hash password if provided, else use default
    const hashed = password
      ? await bcrypt.hash(password, 10)
      : await bcrypt.hash("Employee@123", 10);
    const emp = new Employee({ name, email, role, salary, department, password: hashed });
    await emp.save();
    const empObj = emp.toObject();
    delete empObj.password;
    res.json(empObj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE employee
router.put("/:id", async (req, res) => {
  try {
    const update = { ...req.body };
    delete update.password; // don't allow password update here
    const emp = await Employee.findByIdAndUpdate(req.params.id, update, { new: true }).select("-password");
    if (!emp) return res.status(404).json({ error: "Employee not found" });
    res.json(emp);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE employee
router.delete("/:id", async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
