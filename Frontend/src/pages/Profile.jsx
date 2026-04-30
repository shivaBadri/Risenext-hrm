import { useEffect, useState } from "react";
import API from "../api";

export default function Profile() {
  const [emp, setEmp] = useState(null);
  const stored = JSON.parse(localStorage.getItem("hrm_employee") || "{}");

  useEffect(() => {
    API.get(`/api/employees/${stored.id}`).then(r => setEmp(r.data)).catch(() => setEmp(stored));
  }, []);

  if (!emp) return <p>Loading...</p>;

  const fields = [
    { label: "Full Name", value: emp.name },
    { label: "Email", value: emp.email },
    { label: "Role", value: emp.role },
    { label: "Department", value: emp.department },
    { label: "Salary", value: `₹${(emp.salary || 0).toLocaleString()}` },
    { label: "Join Date", value: emp.joinDate ? new Date(emp.joinDate).toLocaleDateString("en-IN") : "—" },
  ];

  return (
    <div style={{ maxWidth: "600px" }}>
      <h2 style={{ color: "#1a1a2e", marginBottom: "24px" }}>👤 My Profile</h2>
      <div style={{ background: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#0d6efd", color: "white", fontSize: "32px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            {emp.name?.charAt(0).toUpperCase()}
          </div>
          <h3 style={{ margin: "0 0 4px" }}>{emp.name}</h3>
          <span style={{ background: "#e3f2fd", color: "#0d6efd", padding: "4px 12px", borderRadius: "12px", fontSize: "13px", fontWeight: "bold" }}>{emp.role}</span>
        </div>
        {fields.map(f => (
          <div key={f.label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
            <span style={{ color: "#888", fontSize: "14px" }}>{f.label}</span>
            <span style={{ fontWeight: "600", color: "#333" }}>{f.value || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
