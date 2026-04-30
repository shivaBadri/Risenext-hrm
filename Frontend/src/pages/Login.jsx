import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("login"); // "login" | "forgot"
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState({ type: "", msg: "" });
  const [forgotLoading, setForgotLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/api/auth/login", form);
      localStorage.setItem("hrm_token", res.data.token);
      localStorage.setItem("hrm_employee", JSON.stringify(res.data.employee));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setForgotStatus({ type: "error", msg: "Please enter your email address." });
      return;
    }
    setForgotLoading(true);
    setForgotStatus({ type: "", msg: "" });
    try {
      const res = await API.post("/api/auth/forgot-password", { email: forgotEmail });
      setForgotStatus({ type: "success", msg: res.data.message });
    } catch (err) {
      setForgotStatus({
        type: "error",
        msg: err.response?.data?.error || "Something went wrong. Please try again."
      });
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Rise Next HRM</h1>
          <p style={styles.subtitle}>Employee Portal {view === "login" ? "Login" : "Password Reset"}</p>
        </div>

        {view === "login" ? (
          <>
            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Email Address</label>
                <input
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  style={styles.input}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  style={styles.input}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>

              <div style={styles.forgotRow}>
                <span
                  style={styles.forgotLink}
                  onClick={() => { setView("forgot"); setError(""); }}
                >
                  Forgot Password?
                </span>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>

            <p style={styles.hint}>
              Default password for new employees: <strong>Employee@123</strong>
            </p>
          </>
        ) : (
          <>
            <p style={styles.forgotDesc}>
              Enter your registered email address. Your password will be reset to the default: <strong>Employee@123</strong>
            </p>

            {forgotStatus.msg && (
              <div style={forgotStatus.type === "success" ? styles.success : styles.error}>
                {forgotStatus.msg}
              </div>
            )}

            <div style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={forgotEmail}
                  onChange={(e) => { setForgotEmail(e.target.value); setForgotStatus({ type: "", msg: "" }); }}
                  style={styles.input}
                  onKeyDown={(e) => e.key === "Enter" && handleForgotPassword()}
                />
              </div>

              <button
                onClick={handleForgotPassword}
                disabled={forgotLoading}
                style={{ ...styles.btn, opacity: forgotLoading ? 0.7 : 1 }}
              >
                {forgotLoading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                onClick={() => { setView("login"); setForgotStatus({ type: "", msg: "" }); setForgotEmail(""); }}
                style={styles.backBtn}
              >
                ← Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0d6efd 0%, #0056d3 100%)",
    fontFamily: "sans-serif"
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
  },
  header: { textAlign: "center", marginBottom: "28px" },
  title: { margin: "0 0 6px", fontSize: "28px", color: "#0d6efd" },
  subtitle: { margin: 0, color: "#666", fontSize: "15px" },
  error: {
    background: "#fff0f0",
    border: "1px solid #ffcccc",
    color: "#cc0000",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px"
  },
  success: {
    background: "#f0fff4",
    border: "1px solid #b2dfdb",
    color: "#1b7a4a",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px"
  },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontWeight: "600", fontSize: "14px", color: "#333" },
  input: {
    padding: "12px 14px",
    border: "1.5px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s"
  },
  forgotRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "-8px"
  },
  forgotLink: {
    fontSize: "13px",
    color: "#0d6efd",
    cursor: "pointer",
    textDecoration: "underline"
  },
  btn: {
    padding: "13px",
    background: "#0d6efd",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "4px"
  },
  backBtn: {
    padding: "11px",
    background: "transparent",
    color: "#0d6efd",
    border: "1.5px solid #0d6efd",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer"
  },
  forgotDesc: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "20px",
    lineHeight: "1.5"
  },
  hint: { textAlign: "center", fontSize: "12px", color: "#888", marginTop: "20px" }
};
