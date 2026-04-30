import { useEffect, useState } from "react";
import API from "../api";

export default function Leaves() {
  const emp = JSON.parse(localStorage.getItem("hrm_employee") || "{}");
  const isAdmin = emp.role === "Admin";
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ leaveType: "Casual", fromDate: "", toDate: "", reason: "" });
  const [msg, setMsg] = useState({ type: "", text: "" });

  const fetchLeaves = () => {
    const url = isAdmin ? "/api/leaves" : `/api/leaves/employee/${emp.id}`;
    API.get(url).then(r => setLeaves(r.data)).catch(() => {});
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleApply = async () => {
    if (!form.fromDate || !form.toDate) return setMsg({ type: "error", text: "Please fill all fields." });
    try {
      await API.post("/api/leaves", { ...form, employeeId: emp.id, employeeName: emp.name });
      setMsg({ type: "success", text: "Leave applied successfully!" });
      setForm({ leaveType: "Casual", fromDate: "", toDate: "", reason: "" });
      fetchLeaves();
    } catch { setMsg({ type: "error", text: "Failed to apply leave." }); }
    setTimeout(() => setMsg({ type: "", text: "" }), 3000);
  };

  const handleAction = async (id, status) => {
    try {
      await API.put(`/api/leaves/${id}`, { status });
      fetchLeaves();
    } catch {}
  };

  const statusColor = { Pending: "#e65100", Approved: "#2e7d32", Rejected: "#c62828" };
  const inp = { padding: "10px 12px", border: "1.5px solid #ddd", borderRadius: "8px", fontSize: "14px", width: "100%", boxSizing: "border-box" };

  return (
    <div>
      <h2 style={{ color: "#1a1a2e", marginBottom: "24px" }}>🗓️ {isAdmin ? "Leave Management" : "My Leaves"}</h2>

      {!isAdmin && (
        <div style={{ background: "white", borderRadius: "14px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: "28px", maxWidth: "520px" }}>
          <h3 style={{ margin: "0 0 16px" }}>Apply for Leave</h3>
          {msg.text && <div style={{ padding: "10px", borderRadius: "8px", marginBottom: "12px", background: msg.type === "success" ? "#f0fff4" : "#fff0f0", color: msg.type === "success" ? "#2e7d32" : "#c62828", fontSize: "14px" }}>{msg.text}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <select value={form.leaveType} onChange={e => setForm({ ...form, leaveType: e.target.value })} style={inp}>
              {["Casual", "Sick", "Earned", "Other"].map(t => <option key={t}>{t}</option>)}
            </select>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "13px", color: "#666" }}>From Date</label>
                <input type="date" value={form.fromDate} onChange={e => setForm({ ...form, fromDate: e.target.value })} style={inp} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "13px", color: "#666" }}>To Date</label>
                <input type="date" value={form.toDate} onChange={e => setForm({ ...form, toDate: e.target.value })} style={inp} />
              </div>
            </div>
            <textarea placeholder="Reason (optional)" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
              style={{ ...inp, resize: "vertical", minHeight: "80px" }} />
            <button onClick={handleApply} style={{ padding: "11px", background: "#0d6efd", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "15px" }}>
              Apply Leave
            </button>
          </div>
        </div>
      )}

      <div style={{ background: "white", borderRadius: "14px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <h3 style={{ margin: "0 0 16px" }}>{isAdmin ? "All Leave Requests" : "My Leave History"}</h3>
        {leaves.length === 0 ? <p style={{ color: "#888" }}>No leave records found.</p> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ background: "#0d6efd" }}>
                {isAdmin && <th style={{ ...th, color: "white" }}>Employee</th>}
                <th style={{ ...th, color: "white" }}>Type</th>
                <th style={{ ...th, color: "white" }}>From</th>
                <th style={{ ...th, color: "white" }}>To</th>
                <th style={{ ...th, color: "white" }}>Reason</th>
                <th style={{ ...th, color: "white" }}>Status</th>
                {isAdmin && <th style={{ ...th, color: "white" }}>Action</th>}
              </tr></thead>
              <tbody>{leaves.map(l => (
                <tr key={l._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  {isAdmin && <td style={td}>{l.employeeName}</td>}
                  <td style={td}>{l.leaveType}</td>
                  <td style={td}>{l.fromDate}</td>
                  <td style={td}>{l.toDate}</td>
                  <td style={td}>{l.reason || "—"}</td>
                  <td style={td}><span style={{ color: statusColor[l.status], fontWeight: "bold" }}>{l.status}</span></td>
                  {isAdmin && (
                    <td style={td}>
                      {l.status === "Pending" ? (
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button onClick={() => handleAction(l._id, "Approved")} style={{ padding: "4px 10px", background: "#2e7d32", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Approve</button>
                          <button onClick={() => handleAction(l._id, "Rejected")} style={{ padding: "4px 10px", background: "#c62828", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Reject</button>
                        </div>
                      ) : <span style={{ color: "#aaa", fontSize: "12px" }}>Done</span>}
                    </td>
                  )}
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const th = { padding: "12px 16px", textAlign: "left", fontWeight: "600", fontSize: "13px" };
const td = { padding: "12px 16px", fontSize: "14px", color: "#333" };
