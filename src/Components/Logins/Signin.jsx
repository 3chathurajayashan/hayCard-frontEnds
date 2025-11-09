import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo.webp';

function Signin() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 5000);
  };

  // Handle input change
  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    setError("");
  };

  // Handle submit
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
      const res = await axios.post("https://hay-card-back-end-iota.vercel.app/api/users/login", {
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
    <div style={styles.container}>
      {/* Animated Background */}
      <div style={styles.backgroundAnimation}>
        <div style={styles.circle1}></div>
        <div style={styles.circle2}></div>
        <div style={styles.circle3}></div>
      </div>

      {/* Custom Notification */}
      {notification.show && (
        <div style={{
          ...styles.notification,
          ...(notification.type === "success" ? styles.notificationSuccess : styles.notificationError)
        }}>
          <div style={styles.notificationIconContainer}>
            {notification.type === "success" ? (
              <div style={styles.successIconWrapper}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
            ) : (
              <div style={styles.errorIconWrapper}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </div>
            )}
          </div>
          <div style={styles.notificationContent}>
            <div style={styles.notificationTitle}>
              {notification.type === "success" ? "Success!" : "Error"}
            </div>
            <div style={styles.notificationMessage}>{notification.message}</div>
          </div>
          <button 
            onClick={() => setNotification({ show: false, message: "", type: "" })}
            style={styles.notificationClose}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
          <div style={styles.notificationProgressBar}>
            <div style={{
              ...styles.notificationProgress,
              backgroundColor: notification.type === "success" ? '#10b981' : '#ef4444'
            }}></div>
          </div>
        </div>
      )}

      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          {/* Header with Logo Animation */}
          <div style={styles.header}>
            <div style={styles.logoContainer}>
              <div style={styles.logoWrapper}>
                <img src={logo} alt="Company Logo" style={styles.logoImage} />
                <div style={styles.logoPulse}></div>
              </div>
            </div>
            <h1 style={styles.title}>
              <span style={styles.titleWord}>Welcome</span>
              <span style={{...styles.titleWord, animationDelay: '0.1s'}}>Back</span>
            </h1>
            <p style={styles.subtitle}>Sign in to continue to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {error && (
              <div style={styles.errorBox}>
                <div style={styles.errorIconBounce}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                </div>
                <span>{error}</span>
              </div>
            )}

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={{
                ...styles.inputContainer,
                ...(emailFocused ? styles.inputContainerFocused : {})
              }}>
                <div style={styles.inputIconLeft}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill={emailFocused ? "#8dc63f" : "#94a3b8"}>
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={inputs.email}
                  onChange={handleChange}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  style={styles.input}
                  required
                  disabled={loading}
                />
                {inputs.email && (
                  <div style={styles.inputIconRight}>
                    <div style={styles.checkmarkAnimation}>✓</div>
                  </div>
                )}
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={{
                ...styles.inputContainer,
                ...(passwordFocused ? styles.inputContainerFocused : {})
              }}>
                <div style={styles.inputIconLeft}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill={passwordFocused ? "#8dc63f" : "#94a3b8"}>
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={inputs.password}
                  onChange={handleChange}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  style={styles.input}
                  required
                  disabled={loading}
                />
                {inputs.password && (
                  <div style={styles.inputIconRight}>
                    <div style={styles.checkmarkAnimation}>✓</div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              style={{
                ...styles.submitButton,
                ...(loading ? styles.submitButtonLoading : {})
              }}
              disabled={loading}
            >
              {loading ? (
                <div style={styles.loadingContainer}>
                  <div style={styles.spinnerContainer}>
                    <div style={styles.spinner}></div>
                    <div style={styles.spinnerCore}></div>
                  </div>
                  <span style={styles.loadingText}>Authenticating</span>
                  <div style={styles.loadingDots}>
                    <span style={styles.dot1}>.</span>
                    <span style={styles.dot2}>.</span>
                    <span style={styles.dot3}>.</span>
                  </div>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="white" style={styles.buttonArrow}>
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                  </svg>
                </>
              )}
              <div style={styles.buttonRipple}></div>
            </button>
          </form>

          {/* Footer */}
          <div style={styles.footer}>
            <div style={styles.securityBadge}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#8dc63f">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
              <span>Secure SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  backgroundAnimation: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    zIndex: 0,
  },
  circle1: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.05)",
    top: "-250px",
    right: "-100px",
    animation: "float 20s ease-in-out infinite",
  },
  circle2: {
    position: "absolute",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.03)",
    bottom: "-150px",
    left: "-50px",
    animation: "float 15s ease-in-out infinite reverse",
  },
  circle3: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.04)",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    animation: "pulse 10s ease-in-out infinite",
  },
  loginContainer: {
    width: "100%",
    maxWidth: "460px",
    position: "relative",
    zIndex: 1,
  },
  loginCard: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(102, 126, 234, 0.2)",
    padding: "48px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    animation: "slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "24px",
  },
  logoWrapper: {
    position: "relative",
    display: "inline-block",
  },
  logoImage: {
    width: "158px",
    height: "108px",
    objectFit: "contain",
    position: "relative",
    zIndex: 2,
    animation: "logoFloat 3s ease-in-out infinite",
  },
  logoPulse: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "rgba(141, 198, 63, 0.2)",
    animation: "logoPulse 2s ease-in-out infinite",
    zIndex: 1,
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    margin: "0 0 12px 0",
    letterSpacing: "-1px",
    display: "flex",
    justifyContent: "center",
    gap: "12px",
  },
  titleWord: {
    display: "inline-block",
    animation: "fadeInUp 0.6s ease-out forwards",
    opacity: 0,
  },
  subtitle: {
    fontSize: "15px",
    color: "#64748b",
    margin: 0,
    fontWeight: "400",
    animation: "fadeIn 0.8s ease-out 0.3s forwards",
    opacity: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  errorBox: {
    background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
    color: "#991b1b",
    padding: "14px 18px",
    borderRadius: "12px",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    border: "1px solid #fca5a5",
    animation: "shake 0.5s ease-in-out",
  },
  errorIconBounce: {
    animation: "bounce 0.6s ease-in-out",
    display: "flex",
    alignItems: "center",
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
    marginBottom: "4px",
    transition: "all 0.3s ease",
  },
  inputContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    background: "#f8fafc",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  inputContainerFocused: {
    border: "2px solid #8dc63f",
    background: "#ffffff",
    boxShadow: "0 0 0 4px rgba(141, 198, 63, 0.1), 0 8px 16px rgba(141, 198, 63, 0.1)",
    transform: "translateY(-2px)",
  },
  inputIconLeft: {
    position: "absolute",
    left: "16px",
    display: "flex",
    alignItems: "center",
    transition: "all 0.3s ease",
  },
  inputIconRight: {
    position: "absolute",
    right: "16px",
    display: "flex",
    alignItems: "center",
  },
  checkmarkAnimation: {
    color: "#10b981",
    fontSize: "18px",
    fontWeight: "bold",
    animation: "checkmark 0.4s ease-in-out",
  },
  input: {
    width: "100%",
    padding: "16px 50px",
    borderRadius: "12px",
    border: "none",
    fontSize: "15px",
    background: "transparent",
    outline: "none",
    fontFamily: "inherit",
    color: "#1e293b",
    transition: "all 0.3s ease",
  },
  submitButton: {
    width: "100%",
    padding: "18px 32px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #8dc63f 0%, #7cb32e 100%)",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: "8px",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    boxShadow: "0 10px 30px rgba(141, 198, 63, 0.3)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  submitButtonLoading: {
    background: "linear-gradient(135deg, #7cb32e 0%, #6aa127 100%)",
    cursor: "not-allowed",
  },
  buttonArrow: {
    transition: "transform 0.3s ease",
  },
  buttonRipple: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "0",
    height: "0",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.3)",
    transform: "translate(-50%, -50%)",
    transition: "width 0.6s ease, height 0.6s ease",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  },
  spinnerContainer: {
    position: "relative",
    width: "24px",
    height: "24px",
  },
  spinner: {
    position: "absolute",
    width: "24px",
    height: "24px",
    border: "3px solid rgba(255, 255, 255, 0.3)",
    borderTop: "3px solid white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  spinnerCore: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "12px",
    height: "12px",
    background: "white",
    borderRadius: "50%",
    animation: "pulse 1s ease-in-out infinite",
  },
  loadingText: {
    fontWeight: "600",
  },
  loadingDots: {
    display: "flex",
    gap: "2px",
  },
  dot1: {
    animation: "dotBounce 1.4s ease-in-out infinite",
  },
  dot2: {
    animation: "dotBounce 1.4s ease-in-out 0.2s infinite",
  },
  dot3: {
    animation: "dotBounce 1.4s ease-in-out 0.4s infinite",
  },
  footer: {
    marginTop: "40px",
    textAlign: "center",
  },
  securityBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    background: "rgba(141, 198, 63, 0.1)",
    borderRadius: "50px",
    fontSize: "13px",
    color: "#475569",
    fontWeight: "500",
    border: "1px solid rgba(141, 198, 63, 0.2)",
  },
  // Notification Styles
  notification: {
    position: "fixed",
    top: "24px",
    right: "24px",
    width: "400px",
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2), 0 0 100px rgba(0, 0, 0, 0.1)",
    zIndex: 10000,
    animation: "notificationSlide 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
    overflow: "hidden",
    display: "flex",
    alignItems: "flex-start",
    padding: "20px",
    gap: "16px",
    position: "relative",
  },
  notificationSuccess: {
    borderLeft: "4px solid #10b981",
  },
  notificationError: {
    borderLeft: "4px solid #ef4444",
  },
  notificationIconContainer: {
    flexShrink: 0,
  },
  successIconWrapper: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
    boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
  },
  errorIconWrapper: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
    boxShadow: "0 8px 20px rgba(239, 68, 68, 0.3)",
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "4px",
  },
  notificationMessage: {
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.5",
  },
  notificationClose: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "8px",
    transition: "all 0.2s ease",
    flexShrink: 0,
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationProgressBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "4px",
    background: "rgba(0, 0, 0, 0.05)",
  },
  notificationProgress: {
    height: "100%",
    width: "100%",
    transformOrigin: "left",
    animation: "progress 5s linear forwards",
  },
};

// Add keyframe animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-30px); }
  }
  
  @keyframes slideUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes fadeInUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes checkmark {
    0% { transform: scale(0) rotate(45deg); opacity: 0; }
    50% { transform: scale(1.2) rotate(45deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  
  @keyframes dotBounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-8px); }
  }
  
  @keyframes logoFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes logoPulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
    50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.1; }
  }
  
  @keyframes notificationSlide {
    from { transform: translateX(120%) rotate(10deg); opacity: 0; }
    to { transform: translateX(0) rotate(0); opacity: 1; }
  }
  
  @keyframes scaleIn {
    from { transform: scale(0) rotate(-180deg); opacity: 0; }
    to { transform: scale(1) rotate(0); opacity: 1; }
  }
  
  @keyframes progress {
    0% { transform: scaleX(1); }
    100% { transform: scaleX(0); }
  }
  
  /* Hover effects */
  button:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(141, 198, 63, 0.4) !important;
  }
  
  button:not(:disabled):hover svg {
    transform: translateX(5px);
  }
  
  button:not(:disabled):active {
    transform: translateY(0);
  }
  
  input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* Responsive */
  @media (max-width: 480px) {
    .notification {
      width: calc(100% - 32px);
      right: 16px;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Signin;