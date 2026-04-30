import { useEffect, useState } from "react";
import API from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, departments: 0, totalSalary: 0, byDept: {} });
  const emp = JSON.parse(localStorage.getItem("hrm_employee") || "{}");
  const isAdmin = emp.role === "Admin";

  useEffect(() => {
    API.get("/api/employees").then((res) => {
      const data = res.data;
      const depts = {};
      let totalSalary = 0;
      data.forEach(e => {
        totalSalary += e.salary || 0;
        if (e.department) depts[e.department] = (depts[e.department] || 0) + 1;
      });
      setStats({ total: data.length, departments: Object.keys(depts).length, totalSalary, byDept: depts });
    }).catch(() => {});
  }, []);

  const cards = isAdmin ? [
    { label: "Total Employees", value: stats.total, color: "#0d6efd", bg: "#e3f2fd" },
    { label: "Departments", value: stats.departments, color: "#2e7d32", bg: "#e8f5e9" },
    { label: "Monthly Salary", value: `₹${stats.totalSalary.toLocaleString()}`, color: "#e65100", bg: "#fff3e0" },
    { label: "System Status", value: "Active ✅", color: "#6a1b9a", bg: "#f3e5f5" },
  ] : [
    { label: "My Role", value: emp.role, color: "#0d6efd", bg: "#e3f2fd" },
    { label: "Department", value: emp.department || "—", color: "#2e7d32", bg: "#e8f5e9" },
    { label: "Status", value: "Active ✅", color: "#e65100", bg: "#fff3e0" },
  ];

  return (
    <div>
      <h2 style={{ color: "#1a1a2e", marginBottom: "4px" }}>Welcome back, {emp.name} 👋</h2>
      <p style={{ color: "#666", marginBottom: "28px" }}>
        {isAdmin ? "Admin Dashboard — Full Access" : `Role: ${emp.role} | Department: ${emp.department}`}
      </p>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "32px" }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: c.bg, borderRadius: "14px", padding: "24px 28px", minWidth: "180px", flex: 1 }}>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: c.color }}>{c.value}</div>
            <div style={{ fontSize: "13px", color: "#555", marginTop: "6px" }}>{c.label}</div>
          </div>
        ))}
      </div>

      {isAdmin && Object.keys(stats.byDept).length > 0 && (
        <div style={{ background: "white", borderRadius: "14px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin: "0 0 16px", color: "#333" }}>👥 Employees by Department</h3>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {Object.entries(stats.byDept).map(([dept, count]) => (
              <div key={dept} style={{ background: "#f0f4ff", border: "1px solid #c5d3f6", borderRadius: "10px", padding: "12px 20px", textAlign: "center" }}>
                <div style={{ fontWeight: "bold", fontSize: "22px", color: "#0d6efd" }}>{count}</div>
                <div style={{ fontSize: "12px", color: "#555" }}>{dept}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
