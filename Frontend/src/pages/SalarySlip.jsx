import { useEffect, useState } from "react";
import API from "../api";

export default function SalarySlip() {
  const emp = JSON.parse(localStorage.getItem("hrm_employee") || "{}");
  const [empData, setEmpData] = useState(null);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [attendance, setAttendance] = useState({ Present: 0, "Half Day": 0, Absent: 0, Leave: 0 });

  useEffect(() => {
    API.get(`/api/employees/${emp.id}`).then(r => setEmpData(r.data)).catch(() => setEmpData(emp));
    API.get(`/api/attendance/summary/${emp.id}/${month}`).then(r => setAttendance(r.data.summary || attendance)).catch(() => {});
  }, [month]);

  const handlePrint = () => window.print();

  if (!empData) return <p>Loading...</p>;

  const grossSalary = empData.salary || 0;
  const workingDays = 26;
  const presentDays = (attendance.Present || 0) + (attendance["Half Day"] || 0) * 0.5;
  const perDay = grossSalary / workingDays;
  const earned = Math.round(perDay * presentDays);
  const pf = Math.round(grossSalary * 0.12);
  const tax = Math.round(grossSalary * 0.05);
  const netSalary = earned - pf - tax;
  const monthLabel = new Date(month + "-01").toLocaleString("en-IN", { month: "long", year: "numeric" });

  return (
    <div>
      <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ color: "#1a1a2e", margin: 0 }}>💰 Salary Slip</h2>
        <input type="month" value={month} onChange={e => setMonth(e.target.value)}
          style={{ padding: "8px 12px", border: "1.5px solid #ddd", borderRadius: "8px", fontSize: "14px" }} />
        <button onClick={handlePrint}
          style={{ padding: "8px 20px", background: "#0d6efd", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
          🖨️ Print / Download
        </button>
      </div>

      <div id="slip" style={{ background: "white", borderRadius: "14px", padding: "36px", maxWidth: "680px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", borderBottom: "2px solid #0d6efd", paddingBottom: "16px", marginBottom: "24px" }}>
          <h2 style={{ color: "#0d6efd", margin: "0 0 4px" }}>🏢 Rise Next</h2>
          <p style={{ margin: 0, color: "#666" }}>Salary Slip — {monthLabel}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
          {[
            ["Employee Name", empData.name],
            ["Email", empData.email],
            ["Role", empData.role],
            ["Department", empData.department],
            ["Join Date", empData.joinDate ? new Date(empData.joinDate).toLocaleDateString("en-IN") : "—"],
            ["Month", monthLabel],
          ].map(([l, v]) => (
            <div key={l} style={{ background: "#f8f9ff", borderRadius: "8px", padding: "10px 14px" }}>
              <div style={{ fontSize: "11px", color: "#888" }}>{l}</div>
              <div style={{ fontWeight: "600", color: "#333" }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          <div style={{ background: "#f0f4ff", borderRadius: "10px", padding: "16px" }}>
            <h4 style={{ margin: "0 0 12px", color: "#0d6efd" }}>Earnings</h4>
            {[["Gross Salary", `₹${grossSalary.toLocaleString()}`], ["Present Days", presentDays], ["Earned Salary", `₹${earned.toLocaleString()}`]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
                <span style={{ color: "#555" }}>{l}</span><span style={{ fontWeight: "600" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "#fff5f5", borderRadius: "10px", padding: "16px" }}>
            <h4 style={{ margin: "0 0 12px", color: "#c62828" }}>Deductions</h4>
            {[["PF (12%)", `₹${pf.toLocaleString()}`], ["Tax (5%)", `₹${tax.toLocaleString()}`], ["Total Deductions", `₹${(pf + tax).toLocaleString()}`]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
                <span style={{ color: "#555" }}>{l}</span><span style={{ fontWeight: "600", color: "#c62828" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#e8f5e9", borderRadius: "10px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: "bold", fontSize: "16px", color: "#2e7d32" }}>Net Salary</span>
          <span style={{ fontWeight: "bold", fontSize: "22px", color: "#2e7d32" }}>₹{netSalary.toLocaleString()}</span>
        </div>

        <p style={{ textAlign: "center", fontSize: "11px", color: "#aaa", marginTop: "20px" }}>
          This is a computer-generated salary slip. — Rise Next HRM
        </p>
      </div>
    </div>
  );
}
