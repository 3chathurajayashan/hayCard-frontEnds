import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo.webp';
import w1 from '../../assets/w3.jpg'

function Signin() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 5000);
  };

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!inputs.email.includes("@") || !inputs.email.includes(".")) {
      setError("Please enter a valid email address");
      showNotification("Please enter a valid email address", "error");
      return;
    }
    if (inputs.password.length < 6) {
      setError("Password must be at least 6 characters");
      showNotification("Password must be at least 6 characters", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("https://hay-card-back-end.vercel.app/api/users/login", {
        email: inputs.email,
        password: inputs.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const userRole = res.data.user.role;
      showNotification("Login successful! Redirecting...", "success");

      setTimeout(() => {
        if (userRole === "factory") navigate("/addDashboard");
        else if (userRole === "tester") navigate("/tester");
        else if (userRole === "labadmin") navigate("/editDashboard");
        else navigate("/dashboard");
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errorMsg);
      showNotification(errorMsg, "error");
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* 1. LEFT SIDE - WALLPAPER & TEXT */}
      <div style={styles.visualSide}>
        <div style={styles.overlay}></div>
        <div style={styles.visualContent}>
          <img src={logo} alt="Logo" style={styles.heroLogo} />
          <h1 style={styles.heroTitle}>Haycarb PLC</h1>
          <p style={styles.heroSubtitle}>Factory Laboratory Management System</p>
          <div style={styles.heroLine}></div>
          <p style={styles.heroDescription}>
            Streamlining carbon analysis and sample tracking with precision and real-time data integrity.
          </p>
        </div>
        <div style={styles.visualFooter}>
          © 2026 Haycarb PLC. All rights reserved.
        </div>
      </div>

      {/* 2. RIGHT SIDE - LOGIN COMPONENT */}
      <div style={styles.formSide}>
        {/* Custom Notification */}
        {notification.show && (
          <div style={{
            ...styles.notification,
            ...(notification.type === "success" ? styles.notificationSuccess : styles.notificationError)
          }}>
             <span style={{ fontSize: "14px", fontWeight: "600" }}>{notification.message}</span>
          </div>
        )}

        <div style={styles.loginBox}>
          <div style={styles.header}>
            <h2 style={styles.title}>Sign In</h2>
            <p style={styles.subtitle}>Enter your credentials to access the laboratory portal</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {error && <div style={styles.errorBox}>{error}</div>}

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="name@haycarb.com"
                value={inputs.email}
                onChange={handleChange}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                style={{
                  ...styles.input,
                  borderColor: emailFocused ? "#8dc63f" : "#e2e8f0",
                  boxShadow: emailFocused ? "0 0 0 4px rgba(141, 198, 63, 0.1)" : "none"
                }}
                required
                disabled={loading}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={inputs.password}
                onChange={handleChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                style={{
                  ...styles.input,
                  borderColor: passwordFocused ? "#8dc63f" : "#e2e8f0",
                  boxShadow: passwordFocused ? "0 0 0 4px rgba(141, 198, 63, 0.1)" : "none"
                }}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer"
              }}
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Login to System"}
            </button>
          </form>

          <div style={styles.securityText}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="#64748b" style={{ marginRight: 6 }}>
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
            Secure Enterprise Encryption Active
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#fff",
  },
  /* Left Side */
  visualSide: {
  flex: 1,
  position: "relative",
  backgroundImage: `url(${w1})`, // w1 should be the imported image or string URL
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "60px",
  color: "#fff",
  // optionally hide on mobile
},
  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, rgba(0, 0, 0, 0.42) 0%, rgba(15, 23, 42, 0.05) 100%)",
    zIndex: 1,
  },
  visualContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "500px",
  },
  heroLogo: {
    width: "120px",
    marginBottom: "40px",
    filter: "brightness(0) invert(1)", // Makes logo white
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "800",
    marginBottom: "10px",
    letterSpacing: "-1px",
  },
  heroSubtitle: {
    fontSize: "20px",
    color: "#8dc63f", // Brand Green
    fontWeight: "500",
    marginBottom: "30px",
  },
  heroLine: {
    width: "60px",
    height: "4px",
    background: "#8dc63f",
    marginBottom: "30px",
  },
  heroDescription: {
    fontSize: "19px",
    lineHeight: "1.6",
    color: "#ffffff",
  },
  visualFooter: {
    position: "absolute",
    bottom: "40px",
    left: "60px",
    zIndex: 2,
    fontSize: "13px",
    color: "#64748b",
  },
  /* Right Side */
  formSide: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    backgroundColor: "#fff",
  },
  loginBox: {
    width: "100%",
    maxWidth: "400px",
  },
  header: {
    marginBottom: "40px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#64748b",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
  },
  input: {
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.2s ease",
    backgroundColor: "#f8fafc",
  },
  submitButton: {
    padding: "16px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#1e293b", // Professional dark button
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "10px",
    transition: "all 0.2s ease",
  },
  errorBox: {
    padding: "12px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fee2e2",
    color: "#dc2626",
    borderRadius: "8px",
    fontSize: "14px",
  },
  securityText: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "30px",
    fontSize: "12px",
    color: "#94a3b8",
  },
  notification: {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "16px 24px",
    borderRadius: "12px",
    color: "#fff",
    zIndex: 1000,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    animation: "slideIn 0.3s ease-out",
  },
  notificationSuccess: { backgroundColor: "#10b981" },
  notificationError: { backgroundColor: "#ef4444" },
};

// Global animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @media (max-width: 960px) {
    .visualSide { display: none !important; }
  }
`;
document.head.appendChild(styleSheet);

export default Signin;