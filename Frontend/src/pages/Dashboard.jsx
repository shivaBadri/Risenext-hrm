import { useEffect, useState } from "react";
import API from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, departments: 0 });
  const emp = JSON.parse(localStorage.getItem("hrm_employee") || "{}");

  useEffect(() => {
    API.get("/api/employees").then((res) => {
      const data = res.data;
      const depts = new Set(data.map((e) => e.department).filter(Boolean));
      setStats({ total: data.length, departments: depts.size });
    }).catch(() => {});
  }, []);

  return (
    <div>
      <h2 style={{ color: "#333", marginBottom: "8px" }}>
        Welcome back, {emp.name || "User"} 👋
      </h2>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        Role: <strong>{emp.role}</strong> | Department: <strong>{emp.department || "—"}</strong>
      </p>

      <div style={styles.cards}>
        <div style={styles.card}>
          <div style={styles.cardNum}>{stats.total}</div>
          <div style={styles.cardLabel}>Total Employees</div>
        </div>
        <div style={{ ...styles.card, background: "#e8f5e9" }}>
          <div style={{ ...styles.cardNum, color: "#2e7d32" }}>{stats.departments}</div>
          <div style={styles.cardLabel}>Departments</div>
        </div>
        <div style={{ ...styles.card, background: "#fff3e0" }}>
          <div style={{ ...styles.cardNum, color: "#e65100" }}>Active</div>
          <div style={styles.cardLabel}>System Status</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  cards: { display: "flex", gap: "20px", flexWrap: "wrap" },
  card: {
    background: "#e3f2fd",
    borderRadius: "12px",
    padding: "24px 32px",
    minWidth: "160px",
    textAlign: "center"
  },
  cardNum: { fontSize: "36px", fontWeight: "bold", color: "#0d6efd" },
  cardLabel: { fontSize: "14px", color: "#555", marginTop: "6px" }
};
