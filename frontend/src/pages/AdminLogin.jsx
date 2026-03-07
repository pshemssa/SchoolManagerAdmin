import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAuthService } from "../services/api";
import { Mail, Lock, Shield } from "lucide-react";

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await adminAuthService.login(formData);

      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("admin", JSON.stringify(response.data.admin));

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at bottom left, #0f172a, #020617)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ width: "420px", textAlign: "center", color: "white" }}>
        {/* Header */}
        <div style={{ marginBottom: "25px" }}>
          <div
            style={{
              background: "#0f172a",
              width: "70px",
              height: "70px",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 10px auto",
            }}
          >
            <Shield size={30} color="#60a5fa" />
          </div>

          <h1 style={{ marginBottom: "5px" }}>SchoolSync Admin</h1>
          <p style={{ color: "#94a3b8" }}>Staff & Administration Portal</p>
        </div>

        {/* Login Card */}
        <div
          style={{
            background: "#111827",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: "18px", textAlign: "left" }}>
              <label style={{ fontSize: "14px", color: "#cbd5f5" }}>Email</label>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#020617",
                  padding: "10px",
                  borderRadius: "8px",
                  marginTop: "6px",
                }}
              >
                <Mail size={18} color="#94a3b8" />
                <input
                  type="email"
                  placeholder="admin@school.edu"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "white",
                    marginLeft: "10px",
                    width: "100%",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "20px", textAlign: "left" }}>
              <label style={{ fontSize: "14px", color: "#cbd5f5" }}>
                Password
              </label>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#020617",
                  padding: "10px",
                  borderRadius: "8px",
                  marginTop: "6px",
                }}
              >
                <Lock size={18} color="#94a3b8" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "white",
                    marginLeft: "10px",
                    width: "100%",
                  }}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ color: "#ef4444", marginBottom: "12px" }}>
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                background: "#4f79d8",
                color: "white",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Bottom link */}
        <p style={{ marginTop: "20px", color: "#94a3b8" }}>
          Parent/Student?{" "}
          <a href={import.meta.env.VITE_CLIENT_PORTAL_URL || "http://localhost:3000"} style={{ color: "#3b82f6", cursor: "pointer", textDecoration: "none" }}>
            Go to Client Portal
          </a>
        </p>
      </div>
    </div>
  );
}