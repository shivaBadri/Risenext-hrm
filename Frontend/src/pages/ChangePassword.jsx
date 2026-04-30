import { useState } from "react";
import API from "../api";

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword)
      return setMsg({ type: "error", text: "Please fill all fields." });
    if (form.newPassword !== form.confirmPassword)
      return setMsg({ type: "error", text: "New passwords do not match." });
    if (form.newPassword.length < 6)
      return setMsg({ type: "error", text: "Password must be at least 6 characters." });

    setLoading(true);
    try {
      await API.post("/api/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      setMsg({ type: "success", text: "Password changed successfully! ✅" });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.error || "Failed to change password." });
    }
    setLoading(false);
  };

  const inp = { padding: "11px 14px", border: "1.5px solid #ddd", borderRadius: "8px", fontSize: "15px", width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ maxWidth: "440px" }}>
      <h2 style={{ color: "#1a1a2e", marginBottom: "24px" }}>🔑 Change Password</h2>
      <div style={{ background: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        {msg.text && (
          <div style={{ padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", background: msg.type === "success" ? "#f0fff4" : "#fff0f0", color: msg.type === "success" ? "#2e7d32" : "#c62828", fontSize: "14px" }}>
            {msg.text}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { name: "currentPassword", label: "Current Password" },
            { name: "newPassword", label: "New Password" },
            { name: "confirmPassword", label: "Confirm New Password" },
          ].map(f => (
            <div key={f.name}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#555", display: "block", marginBottom: "6px" }}>{f.label}</label>
              <input name={f.name} type="password" value={form[f.name]} onChange={handleChange} style={inp} />
            </div>
          ))}
          <button onClick={handleSubmit} disabled={loading}
            style={{ padding: "12px", background: "#0d6efd", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "15px", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Changing..." : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
