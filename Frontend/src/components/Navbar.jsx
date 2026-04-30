import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const emp = JSON.parse(localStorage.getItem("hrm_employee") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("hrm_token");
    localStorage.removeItem("hrm_employee");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Rise Next HRM</h2>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Dashboard</Link>
        <Link to="/employees" style={styles.link}>Employees</Link>
        <Link to="/add-employee" style={styles.link}>Add Employee</Link>
      </div>
      <div style={styles.userArea}>
        <span style={styles.userName}>{emp.name || "User"}</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    backgroundColor: "#0d6efd",
    color: "white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
  },
  logo: { margin: 0, fontSize: "20px" },
  links: { display: "flex", gap: "20px" },
  link: { color: "white", textDecoration: "none", fontWeight: "bold", fontSize: "15px" },
  userArea: { display: "flex", alignItems: "center", gap: "12px" },
  userName: { fontSize: "14px", opacity: 0.9 },
  logoutBtn: {
    background: "rgba(255,255,255,0.2)",
    border: "1px solid rgba(255,255,255,0.5)",
    color: "white",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  }
};
