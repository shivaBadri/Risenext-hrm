import { useEffect, useState } from "react";
import API from "../api";

export default function Attendance() {
  const emp = JSON.parse(localStorage.getItem("hrm_employee") || "{}");
  const isAdmin = emp.role === "Admin";
  const today = new Date().toISOString().split("T")[0];
  const currentMonth = today.slice(0, 7);

  const [employees, setEmployees] = useState([]);
  const [date, setDate] = useState(today);
  const [attendance, setAttendance] = useState({});
  const [myRecords, setMyRecords] = useState([]);
  const [summary, setSummary] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (isAdmin) {
      API.get("/api/employees").then(r => setEmployees(r.data));
      fetchDateAttendance(date);
    } else {
      API.get(`/api/attendance/summary/${emp.id}/${currentMonth}`).then(r => {
        setMyRecords(r.data.records || []);
        setSummary(r.data.summary || {});
      });
    }
  }, []);

  const fetchDateAttendance = (d) => {
    API.get(`/api/attendance/date/${d}`).then(r => {
      const map = {};
      r.data.forEach(a => { map[a.employeeId?._id || a.employeeId] = a.status; });
      setAttendance(map);
    });
  };

  const handleDateChange = (d) => {
    setDate(d);
    fetchDateAttendance(d);
  };

  const handleStatus = (empId, status) => {
    setAttendance(prev => ({ ...prev, [empId]: status }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(employees.map(e =>
        API.post("/api/attendance", { employeeId: e._id, date, status: attendance[e._id] || "Absent" })
      ));
      setMsg("Attendance saved successfully! ✅");
      setTimeout(() => setMsg(""), 3000);
    } catch { setMsg("Failed to save."); }
    setSaving(false);
  };

  const statusColors = { Present: "#2e7d32", Absent: "#c62828", "Half Day": "#e65100", Leave: "#6a1b9a" };

  if (!isAdmin) return (
    <div>
      <h2 style={{ color: "#1a1a2e", marginBottom: "24px" }}>📅 My Attendance — {currentMonth}</h2>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "24px" }}>
        {Object.entries(summary).map(([s, c]) => (
          <div key={s} style={{ background: "white", borderRadius: "12px", padding: "16px 24px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: statusColors[s] || "#333" }}>{c}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "white", borderRadius: "14px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#f4f6fb" }}>
            <th style={th}>Date</th><th style={th}>Status</th>
          </tr></thead>
          <tbody>{myRecords.map(r => (
            <tr key={r._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
              <td style={td}>{r.date}</td>
              <td style={td}><span style={{ color: statusColors[r.status], fontWeight: "bold" }}>{r.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
        {myRecords.length === 0 && <p style={{ color: "#888", textAlign: "center" }}>No records this month</p>}
      </div>
    </div>
  );

  return (
    <div>
      <h2 style={{ color: "#1a1a2e", marginBottom: "24px" }}>📅 Mark Attendance</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <label style={{ fontWeight: "600" }}>Date:</label>
        <input type="date" value={date} onChange={e => handleDateChange(e.target.value)}
          style={{ padding: "8px 12px", border: "1.5px solid #ddd", borderRadius: "8px", fontSize: "14px" }} />
        {msg && <span style={{ color: "#2e7d32", fontWeight: "bold" }}>{msg}</span>}
      </div>
      <div style={{ background: "white", borderRadius: "14px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#0d6efd" }}>
            <th style={{ ...th, color: "white" }}>Employee</th>
            <th style={{ ...th, color: "white" }}>Department</th>
            {["Present", "Absent", "Half Day", "Leave"].map(s => (
              <th key={s} style={{ ...th, color: "white" }}>{s}</th>
            ))}
          </tr></thead>
          <tbody>{employees.map(e => (
            <tr key={e._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
              <td style={td}>{e.name}</td>
              <td style={td}>{e.department}</td>
              {["Present", "Absent", "Half Day", "Leave"].map(s => (
                <td key={s} style={{ ...td, textAlign: "center" }}>
                  <input type="radio" name={e._id} checked={attendance[e._id] === s}
                    onChange={() => handleStatus(e._id, s)} />
                </td>
              ))}
            </tr>
          ))}</tbody>
        </table>
        <button onClick={handleSave} disabled={saving}
          style={{ marginTop: "20px", padding: "10px 28px", background: "#0d6efd", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "15px" }}>
          {saving ? "Saving..." : "Save Attendance"}
        </button>
      </div>
    </div>
  );
}

const th = { padding: "12px 16px", textAlign: "left", fontWeight: "600", fontSize: "13px" };
const td = { padding: "12px 16px", fontSize: "14px", color: "#333" };
