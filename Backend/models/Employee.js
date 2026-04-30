const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "Employee" },
  salary: { type: Number, default: 0 },
  department: { type: String, default: "" },
  password: { type: String },  // hashed, for employee login
  joinDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Employee", employeeSchema);
