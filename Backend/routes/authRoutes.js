const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");

const JWT_SECRET = process.env.JWT_SECRET || "risenext_hrm_secret_2024";
const DEFAULT_PASSWORD = "Employee@123";

// Employee Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const emp = await Employee.findOne({ email });
    if (!emp)
      return res.status(401).json({ error: "Invalid email or password" });

    // If employee has no password set (old records), assign default password
    if (!emp.password) {
      emp.password = await bcrypt.hash(DEFAULT_PASSWORD, 10);
      await emp.save();
    }

    const isMatch = await bcrypt.compare(password, emp.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: emp._id, email: emp.email, role: emp.role },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      employee: {
        id: emp._id,
        name: emp.name,
        email: emp.email,
        role: emp.role,
        department: emp.department
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify token (for frontend auth check)
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });
    const decoded = jwt.verify(token, JWT_SECRET);
    const emp = await Employee.findById(decoded.id).select("-password");
    res.json(emp);
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Forgot Password — resets employee password to default
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ error: "Email is required" });

    const emp = await Employee.findOne({ email });
    if (!emp)
      return res.status(404).json({ error: "No employee found with this email" });

    // Reset to default password
    emp.password = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    await emp.save();

    res.json({
      message: `Password has been reset. You can now log in with the default password: ${DEFAULT_PASSWORD}`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin utility — reset ALL employees to default password (fixes old/missing passwords)
router.post("/reset-all-passwords", async (req, res) => {
  try {
    const { adminKey } = req.body;
    if (adminKey !== (process.env.ADMIN_KEY || "risenext_admin_2024"))
      return res.status(403).json({ error: "Unauthorized" });

    const employees = await Employee.find();
    const hashed = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    let updated = 0;

    for (const emp of employees) {
      emp.password = hashed;
      await emp.save();
      updated++;
    }

    res.json({ message: `Reset passwords for ${updated} employees to default: ${DEFAULT_PASSWORD}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
