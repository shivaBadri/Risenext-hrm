import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const emp = JSON.parse(localStorage.getItem("hrm_employee") || "{}");
  const isAdmin = emp.role === "Admin";

  const handleLogout = () => {
    localStorage.removeItem("hrm_token");
    localStorage.removeItem("hrm_employee");
    navigate("/login");
  };

  const links = [
    { to: "/", label: "Dashboard" },
    ...(isAdmin ? [
      { to: "/employees", label: "Employees" },
      { to: "/add-employee", label: "Add Employee" },
      { to: "/departments", label: "Departments" },
      { to: "/attendance", label: "Attendance" },
      { to: "/leaves", label: "Leaves" },
    ] : [
      { to: "/profile", label: "My Profile" },
      { to: "/attendance", label: "My Attendance" },
      { to: "/leaves", label: "My Leaves" },
      { to: "/salary-slip", label: "Salary Slip" },
      { to: "/change-password", label: "Change Password" },
    ])
  ];

  return (
    <nav style={s.nav}>
      <span style={s.logo}>🏢 Rise Next HRM</span>
      <div style={s.links}>
        {links.map(l => (
          <Link key={l.to} to={l.to} style={{ ...s.link, ...(location.pathname === l.to ? s.active : {}) }}>
            {l.label}
          </Link>
        ))}
      </div>
      <div style={s.userArea}>
        <span style={s.badge}>{emp.role}</span>
        <span style={s.userName}>{emp.name}</span>
        <button onClick={handleLogout} style={s.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
}

const s = {
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 24px", height: "56px", backgroundColor: "#0d6efd", color: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.2)", flexWrap: "wrap", gap: "8px" },
  logo: { fontWeight: "bold", fontSize: "18px", whiteSpace: "nowrap" },
  links: { display: "flex", gap: "4px", flexWrap: "wrap" },
  link: { color: "rgba(255,255,255,0.85)", textDecoration: "none", fontWeight: "500", fontSize: "13px", padding: "6px 10px", borderRadius: "6px" },
  active: { background: "rgba(255,255,255,0.2)", color: "white" },
  userArea: { display: "flex", alignItems: "center", gap: "10px" },
  badge: { background: "rgba(255,255,255,0.2)", padding: "3px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" },
  userName: { fontSize: "13px", opacity: 0.9, whiteSpace: "nowrap" },
  logoutBtn: { background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)", color: "white", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }
};
