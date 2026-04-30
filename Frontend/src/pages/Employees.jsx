import { useEffect, useState } from "react";
import API from "../api";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchData = async () => {
    try { const res = await API.get("/api/employees"); setEmployees(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try { await API.delete(`/api/employees/${id}`); setEmployees(employees.filter(e => e._id !== id)); }
    catch { alert("Failed to delete."); }
  };

  const handleEdit = (emp) => { setEditing(emp._id); setEditForm({ name: emp.name, role: emp.role, department: emp.department, salary: emp.salary }); };

  const handleSave = async (id) => {
    try { const res = await API.put(`/api/employees/${id}`, editForm); setEmployees(employees.map(e => e._id === id ? { ...e, ...res.data } : e)); setEditing(null); }
    catch { alert("Failed to update."); }
  };

  const depts = [...new Set(employees.map(e => e.department).filter(Boolean))];
  const filtered = employees.filter(e =>
    (e.name?.toLowerCase().includes(search.toLowerCase()) || e.email?.toLowerCase().includes(search.toLowerCase())) &&
    (deptFilter ? e.department === deptFilter : true)
  );

  if (loading) return <p>Loading employees...</p>;

  return (
    <div>
      <h2 style={{ color: "#1a1a2e", marginBottom: "16px" }}>👥 All Employees ({employees.length})</h2>
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input placeholder="🔍 Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: "9px 14px", border: "1.5px solid #ddd", borderRadius: "8px", fontSize: "14px", minWidth: "240px" }} />
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
          style={{ padding: "9px 14px", border: "1.5px solid #ddd", borderRadius: "8px", fontSize: "14px" }}>
          <option value="">All Departments</option>
          {depts.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#0d6efd" }}>
            {["Name", "Email", "Role", "Department", "Salary (₹)", "Actions"].map(h => (
              <th key={h} style={{ padding: "13px 16px", color: "white", textAlign: "left", fontWeight: "600", fontSize: "13px" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{filtered.map(emp => (
            <tr key={emp._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
              {editing === emp._id ? (
                <>
                  <td style={td}><input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={inp} /></td>
                  <td style={td}>{emp.email}</td>
                  <td style={td}><input value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} style={inp} /></td>
                  <td style={td}><input value={editForm.department} onChange={e => setEditForm({ ...editForm, department: e.target.value })} style={inp} /></td>
                  <td style={td}><input type="number" value={editForm.salary} onChange={e => setEditForm({ ...editForm, salary: e.target.value })} style={inp} /></td>
                  <td style={td}>
                    <button onClick={() => handleSave(emp._id)} style={{ ...btn, background: "#2e7d32", marginRight: "6px" }}>Save</button>
                    <button onClick={() => setEditing(null)} style={{ ...btn, background: "#888" }}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td style={td}><strong>{emp.name}</strong></td>
                  <td style={td}>{emp.email}</td>
                  <td style={td}><span style={{ background: "#e3f2fd", color: "#0d6efd", padding: "3px 8px", borderRadius: "12px", fontSize: "12px" }}>{emp.role}</span></td>
                  <td style={td}>{emp.department}</td>
                  <td style={td}>₹{(emp.salary || 0).toLocaleString()}</td>
                  <td style={td}>
                    <button onClick={() => handleEdit(emp)} style={{ ...btn, background: "#0d6efd", marginRight: "6px" }}>Edit</button>
                    <button onClick={() => handleDelete(emp._id)} style={{ ...btn, background: "#dc3545" }}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}</tbody>
        </table>
        {filtered.length === 0 && <p style={{ textAlign: "center", color: "#888", padding: "24px" }}>No employees found.</p>}
      </div>
    </div>
  );
}

const td = { padding: "12px 16px", color: "#333", fontSize: "14px" };
const btn = { color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" };
const inp = { padding: "6px 8px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "13px", width: "100px" };
