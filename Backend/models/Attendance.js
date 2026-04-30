const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  status: { type: String, enum: ["Present", "Absent", "Half Day", "Leave"], default: "Present" },
  markedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Attendance", attendanceSchema);
