import { useEffect, useState } from "react";
import API from "../api";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await API.get("/api/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await API.delete(`/api/employees/${id}`);
      setEmployees(employees.filter((e) => e._id !== id));
    } catch (err) {
      alert("Failed to delete employee.");
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <p>Loading employees...</p>;

  return (
    <div>
      <h2 style={{ color: "#333", marginBottom: "16px" }}>All Employees</h2>
      {employees.length === 0 ? (
        <p style={{ color: "#888" }}>No employees found. Add some!</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Department</th>
                <th style={styles.th}>Salary (₹)</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id} style={styles.tr}>
                  <td style={styles.td}>{emp.name}</td>
                  <td style={styles.td}>{emp.email}</td>
                  <td style={styles.td}>{emp.role}</td>
                  <td style={styles.td}>{emp.department}</td>
                  <td style={styles.td}>₹{emp.salary?.toLocaleString()}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleDelete(emp._id)}
                      style={styles.delBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  table: { width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  thead: { background: "#0d6efd" },
  th: { padding: "12px 16px", color: "white", textAlign: "left", fontWeight: "600" },
  tr: { borderBottom: "1px solid #eee" },
  td: { padding: "12px 16px", color: "#333" },
  delBtn: { background: "#dc3545", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer" }
};
