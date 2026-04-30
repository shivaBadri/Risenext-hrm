import { useEffect, useState } from "react";
import API from "../api";

export default function Departments() {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => { API.get("/api/employees").then(r => setEmployees(r.data)); }, []);

  const deptMap = {};
  employees.forEach(e => {
    const d = e.department || "Unassigned";
    if (!deptMap[d]) deptMap[d] = [];
    deptMap[d].push(e);
  });

  const colors = ["#e3f2fd", "#e8f5e9", "#fff3e0", "#f3e5f5", "#fce4ec", "#e0f2f1"];
  const textColors = ["#0d6efd", "#2e7d32", "#e65100", "#6a1b9a", "#c62828", "#00695c"];

  return (
    <div>
      <h2 style={{ color: "#1a1a2e", marginBottom: "24px" }}>🏬 Departments</h2>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "32px" }}>
        {Object.entries(deptMap).map(([dept, emps], i) => (
          <div key={dept} onClick={() => setSelected(selected === dept ? null : dept)}
            style={{ background: colors[i % colors.length], borderRadius: "14px", padding: "20px 28px", cursor: "pointer", minWidth: "160px", textAlign: "center", border: selected === dept ? `2px solid ${textColors[i % textColors.length]}` : "2px solid transparent", transition: "all 0.2s" }}>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: textColors[i % textColors.length] }}>{emps.length}</div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#333", marginTop: "4px" }}>{dept}</div>
            <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>Click to view</div>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ background: "white", borderRadius: "14px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin: "0 0 16px", color: "#333" }}>👥 {selected} — {deptMap[selected].length} Employees</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#0d6efd" }}>
              <th style={{ ...th, color: "white" }}>Name</th>
              <th style={{ ...th, color: "white" }}>Email</th>
              <th style={{ ...th, color: "white" }}>Role</th>
              <th style={{ ...th, color: "white" }}>Salary</th>
            </tr></thead>
            <tbody>{deptMap[selected].map(e => (
              <tr key={e._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={td}>{e.name}</td>
                <td style={td}>{e.email}</td>
                <td style={td}>{e.role}</td>
                <td style={td}>₹{(e.salary || 0).toLocaleString()}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th = { padding: "12px 16px", textAlign: "left", fontWeight: "600", fontSize: "13px" };
const td = { padding: "12px 16px", fontSize: "14px", color: "#333" };
