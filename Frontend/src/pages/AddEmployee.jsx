import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function AddEmployee() {
  const [form, setForm] = useState({
    name: "", email: "", role: "", salary: "", department: "", password: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      setMessage({ type: "error", text: "Name and Email are required." });
      return;
    }
    setLoading(true);
    try {
      await API.post("/api/employees", form);
      setMessage({ type: "success", text: "Employee added successfully!" });
      setForm({ name: "", email: "", role: "", salary: "", department: "", password: "" });
      setTimeout(() => navigate("/employees"), 1200);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.error || "Failed to add employee." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "520px" }}>
      <h2 style={{ color: "#333", marginBottom: "20px" }}>Add New Employee</h2>

      {message.text && (
        <div style={{
          padding: "10px 14px", borderRadius: "8px", marginBottom: "16px",
          background: message.type === "error" ? "#fff0f0" : "#e8f5e9",
          color: message.type === "error" ? "#cc0000" : "#2e7d32",
          border: `1px solid ${message.type === "error" ? "#ffcccc" : "#c8e6c9"}`
        }}>
          {message.text}
        </div>
      )}

      <div style={styles.form}>
        {[
          { name: "name", placeholder: "Full Name", type: "text" },
          { name: "email", placeholder: "Email Address", type: "email" },
          { name: "role", placeholder: "Role (e.g. Developer)", type: "text" },
          { name: "department", placeholder: "Department", type: "text" },
          { name: "salary", placeholder: "Salary (₹)", type: "number" },
          { name: "password", placeholder: "Password (default: Employee@123)", type: "password" },
        ].map((field) => (
          <input
            key={field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={form[field.name]}
            onChange={handleChange}
            style={styles.input}
          />
        ))}

        <button onClick={handleSubmit} disabled={loading} style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Adding..." : "Add Employee"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  input: {
    padding: "12px 14px",
    border: "1.5px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none"
  },
  btn: {
    padding: "13px",
    background: "#0d6efd",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer"
  }
};
