const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  employeeName: { type: String },
  leaveType: { type: String, enum: ["Casual", "Sick", "Earned", "Other"], default: "Casual" },
  fromDate: { type: String, required: true },
  toDate: { type: String, required: true },
  reason: { type: String },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Leave", leaveSchema);
