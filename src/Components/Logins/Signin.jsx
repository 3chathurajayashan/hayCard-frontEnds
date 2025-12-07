import React, { useState, useRef, useEffect } from "react";
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
  const [showPassword, setShowPassword] = useState(false);
  const audioContextRef = useRef(null);

  useEffect(() => {
    // Initialize Web Audio API context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  // Play success sound
  const playSuccessSound = () => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    // Create oscillator for a pleasant success sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // First note (C6)
    oscillator.frequency.setValueAtTime(1046.5, audioContext.currentTime);
    // Second note (E6)
    oscillator.frequency.setValueAtTime(1318.5, audioContext.currentTime + 0.1);
    // Third note (G6)
    oscillator.frequency.setValueAtTime(1568, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

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

      // Store in memory instead of localStorage (as per artifact restrictions)
      const token = res.data.token;
      const user = res.data.user;
      const userRole = user.role;

      playSuccessSound();
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
      {/* Animated Background Gradient */}
      <div style={styles.backgroundGradient}></div>
      
      {/* Floating Particles */}
      <div style={styles.particlesContainer}>
        <div style={{...styles.particle, ...styles.particle1}}></div>
        <div style={{...styles.particle, ...styles.particle2}}></div>
        <div style={{...styles.particle, ...styles.particle3}}></div>
        <div style={{...styles.particle, ...styles.particle4}}></div>
        <div style={{...styles.particle, ...styles.particle5}}></div>
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
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              </div>
            )}
          </div>
          <div style={styles.notificationContent}>
            <div style={styles.notificationTitle}>
              {notification.type === "success" ? "Success" : "Error"}
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
          {/* Logo Section */}
          <div style={styles.logoSection}>
            <div style={styles.logoWrapper}>
              <img src={logo} alt="Company Logo" style={styles.logoImage} />
              <div style={styles.logoPulse1}></div>
              <div style={styles.logoPulse2}></div>
            </div>
          </div>

          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>Welcome Back</h1>
            <p style={styles.subtitle}>Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {error && (
              <div style={styles.errorBox}>
                <div style={styles.errorIcon}>
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
                  placeholder="you@example.com"
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
                    <div style={styles.checkmark}>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="#10b981">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
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
                  type={showPassword ? "text" : "password"}
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
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="#64748b">
                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="#64748b">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                    )}
                  </button>
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
                  <div style={styles.spinnerWrapper}>
                    <div style={styles.spinnerRing}></div>
                    <div style={styles.spinnerRing2}></div>
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
            </button>
          </form>

          {/* Footer */}
          <div style={styles.footer}>
            <div style={styles.securityBadge}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#8dc63f">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
              <span>256-bit SSL Encrypted Connection</span>
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
    background: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "radial-gradient(circle at 20% 50%, rgba(141, 198, 63, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(102, 126, 234, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%)",
    animation: "gradientShift 20s ease infinite",
    zIndex: 0,
  },
  particlesContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    zIndex: 0,
  },
  particle: {
    position: "absolute",
    borderRadius: "50%",
    background: "rgba(141, 198, 63, 0.1)",
    filter: "blur(2px)",
  },
  particle1: {
    width: "300px",
    height: "300px",
    top: "10%",
    left: "10%",
    animation: "float1 25s ease-in-out infinite",
  },
  particle2: {
    width: "200px",
    height: "200px",
    top: "60%",
    right: "15%",
    background: "rgba(102, 126, 234, 0.08)",
    animation: "float2 20s ease-in-out infinite",
  },
  particle3: {
    width: "150px",
    height: "150px",
    bottom: "20%",
    left: "20%",
    background: "rgba(118, 75, 162, 0.08)",
    animation: "float3 18s ease-in-out infinite",
  },
  particle4: {
    width: "100px",
    height: "100px",
    top: "30%",
    right: "30%",
    animation: "float1 22s ease-in-out infinite reverse",
  },
  particle5: {
    width: "180px",
    height: "180px",
    bottom: "10%",
    right: "10%",
    background: "rgba(141, 198, 63, 0.06)",
    animation: "float2 24s ease-in-out infinite reverse",
  },
  loginContainer: {
    width: "100%",
    maxWidth: "480px",
    position: "relative",
    zIndex: 1,
  },
  loginCard: {
    background: "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(40px)",
    borderRadius: "32px",
    boxShadow: "0 30px 80px rgba(0, 0, 0, 0.4), 0 0 1px rgba(255, 255, 255, 0.5) inset",
    padding: "56px 48px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    animation: "cardEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  logoSection: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "32px",
  },
  logoWrapper: {
    position: "relative",
    display: "inline-block",
  },
  logoImage: {
    width: "180px",
    height: "120px",
    objectFit: "contain",
    position: "relative",
    zIndex: 2,
    filter: "drop-shadow(0 4px 12px rgba(141, 198, 63, 0.3))",
    animation: "logoFloat 4s ease-in-out infinite",
  },
  logoPulse1: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(141, 198, 63, 0.2) 0%, transparent 70%)",
    animation: "pulse1 3s ease-in-out infinite",
    zIndex: 1,
  },
  logoPulse2: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(141, 198, 63, 0.15) 0%, transparent 70%)",
    animation: "pulse2 3s ease-in-out infinite",
    zIndex: 0,
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    fontSize: "36px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    margin: "0 0 12px 0",
    letterSpacing: "-1px",
    animation: "fadeInDown 0.6s ease-out",
  },
  subtitle: {
    fontSize: "15px",
    color: "#64748b",
    margin: 0,
    fontWeight: "400",
    animation: "fadeIn 0.8s ease-out 0.2s backwards",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  errorBox: {
    background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
    color: "#991b1b",
    padding: "16px 20px",
    borderRadius: "16px",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    border: "1px solid #fecaca",
    animation: "errorShake 0.5s ease-in-out",
    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.1)",
  },
  errorIcon: {
    animation: "errorBounce 0.6s ease-in-out",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "2px",
    transition: "color 0.3s ease",
  },
  inputContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    background: "#f8fafc",
    borderRadius: "16px",
    border: "2px solid #e2e8f0",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  inputContainerFocused: {
    border: "2px solid #8dc63f",
    background: "#ffffff",
    boxShadow: "0 0 0 4px rgba(141, 198, 63, 0.12), 0 12px 24px rgba(141, 198, 63, 0.15)",
    transform: "translateY(-2px)",
  },
  inputIconLeft: {
    position: "absolute",
    left: "18px",
    display: "flex",
    alignItems: "center",
    transition: "all 0.3s ease",
    pointerEvents: "none",
  },
  inputIconRight: {
    position: "absolute",
    right: "18px",
    display: "flex",
    alignItems: "center",
  },
  checkmark: {
    animation: "checkmarkPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  input: {
    width: "100%",
    padding: "18px 52px",
    borderRadius: "16px",
    border: "none",
    fontSize: "15px",
    background: "transparent",
    outline: "none",
    fontFamily: "inherit",
    color: "#1e293b",
    transition: "all 0.3s ease",
  },
  passwordToggle: {
    position: "absolute",
    right: "18px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  submitButton: {
    width: "100%",
    padding: "18px 32px",
    borderRadius: "16px",
    border: "none",
    background: "linear-gradient(135deg, #8dc63f 0%, #7cb32e 100%)",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: "12px",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    boxShadow: "0 12px 32px rgba(141, 198, 63, 0.35), 0 0 0 1px rgba(141, 198, 63, 0.1) inset",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  submitButtonLoading: {
    background: "linear-gradient(135deg, #7cb32e 0%, #6aa127 100%)",
    cursor: "not-allowed",
  },
  buttonArrow: {
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  },
  spinnerWrapper: {
    position: "relative",
    width: "24px",
    height: "24px",
  },
  spinnerRing: {
    position: "absolute",
    width: "24px",
    height: "24px",
    border: "3px solid rgba(255, 255, 255, 0.3)",
    borderTop: "3px solid white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  spinnerRing2: {
    position: "absolute",
    width: "24px",
    height: "24px",
    border: "3px solid transparent",
    borderBottom: "3px solid rgba(255, 255, 255, 0.6)",
    borderRadius: "50%",
    animation: "spin 1.2s linear infinite reverse",
  },
  spinnerCore: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "8px",
    height: "8px",
    background: "white",
    borderRadius: "50%",
    animation: "corePulse 0.8s ease-in-out infinite",
  },
  loadingText: {
    fontWeight: "600",
    letterSpacing: "0.3px",
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
    gap: "10px",
    padding: "12px 24px",
    background: "linear-gradient(135deg, rgba(141, 198, 63, 0.08) 0%, rgba(141, 198, 63, 0.12) 100%)",
    borderRadius: "50px",
    fontSize: "13px",
    color: "#475569",
    fontWeight: "500",
    border: "1px solid rgba(141, 198, 63, 0.2)",
    boxShadow: "0 2px 8px rgba(141, 198, 63, 0.1)",
  },
  // Notification Styles
  notification: {
    position: "fixed",
    top: "32px",
    right: "32px",
    width: "420px",
    maxWidth: "calc(100vw - 64px)",
    background: "white",
    borderRadius: "20px",
    boxShadow: "0 24px 60px rgba(0, 0, 0, 0.25), 0 0 1px rgba(0, 0, 0, 0.1)",
    zIndex: 10000,
    animation: "notificationSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
    overflow: "hidden",
    display: "flex",
    alignItems: "flex-start",
    padding: "24px",
    gap: "16px",
  },
  notificationSuccess: {
    borderLeft: "5px solid #10b981",
  },
  notificationError: {
    borderLeft: "5px solid #ef4444",
  },
  notificationIconContainer: {
    flexShrink: 0,
  },
  successIconWrapper: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "iconScaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
    boxShadow: "0 8px 24px rgba(16, 185, 129, 0.4)",
  },
  errorIconWrapper: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "iconScaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
    boxShadow: "0 8px 24px rgba(239, 68, 68, 0.4)",
  },
  notificationContent: {
    flex: 1,
    minWidth: 0,
  },
  notificationTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "6px",
    letterSpacing: "-0.2px",
  },
  notificationMessage: {
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.6",
  },
  notificationClose: {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "10px",
    transition: "all 0.2s ease",
    flexShrink: 0,
    width: "36px",
    height: "36px",
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
    animation: "progressShrink 5s linear forwards",
  },
};

// Add keyframe animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes corePulse {
    0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.6); }
  }
  
  @keyframes gradientShift {
    0%, 100% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.2) rotate(5deg); }
  }
  
  @keyframes float1 {
    0%, 100% { transform: translate(0, 0); }
    33% { transform: translate(30px, -30px); }
    66% { transform: translate(-20px, 20px); }
  }
  
  @keyframes float2 {
    0%, 100% { transform: translate(0, 0); }
    33% { transform: translate(-25px, 25px); }
    66% { transform: translate(20px, -20px); }
  }
  
  @keyframes float3 {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(15px, -25px); }
  }
  
  @keyframes cardEntrance {
    0% { transform: translateY(50px) scale(0.95); opacity: 0; }
    100% { transform: translateY(0) scale(1); opacity: 1; }
  }
  
  @keyframes fadeInDown {
    0% { transform: translateY(-20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  @keyframes errorShake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-12px); }
    75% { transform: translateX(12px); }
  }
  
  @keyframes errorBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  
  @keyframes checkmarkPop {
    0% { transform: scale(0) rotate(-45deg); opacity: 0; }
    50% { transform: scale(1.3) rotate(10deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  
  @keyframes dotBounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 1; }
    40% { transform: translateY(-10px); opacity: 0.7; }
  }
  
  @keyframes logoFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }
  
  @keyframes pulse1 {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
    50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
  }
  
  @keyframes pulse2 {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
    50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
  }
  
  @keyframes notificationSlideIn {
    0% { transform: translateX(150%) rotate(15deg); opacity: 0; }
    100% { transform: translateX(0) rotate(0); opacity: 1; }
  }
  
  @keyframes iconScaleIn {
    0% { transform: scale(0) rotate(-180deg); opacity: 0; }
    60% { transform: scale(1.15) rotate(10deg); }
    100% { transform: scale(1) rotate(0); opacity: 1; }
  }
  
  @keyframes progressShrink {
    0% { transform: scaleX(1); }
    100% { transform: scaleX(0); }
  }
  
  button:not(:disabled):hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(141, 198, 63, 0.45), 0 0 0 1px rgba(141, 198, 63, 0.1) inset !important;
  }
  
  button:not(:disabled):hover svg {
    transform: translateX(6px);
  }
  
  button:not(:disabled):active {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(141, 198, 63, 0.35) !important;
  }
  
  input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  input::placeholder {
    color: #94a3b8;
  }
  
  input:focus::placeholder {
    opacity: 0.5;
  }
  
  .notification button:hover {
    background: rgba(0, 0, 0, 0.05) !important;
    color: #475569 !important;
    transform: none !important;
    box-shadow: none !important;
  }
  
  @media (max-width: 640px) {
    .notification {
      width: calc(100vw - 32px);
      right: 16px;
      top: 16px;
    }
  }
  
  @media (max-width: 480px) {
    input {
      font-size: 16px;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Signin;