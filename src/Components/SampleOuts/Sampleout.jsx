"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = "https://hay-card-back-end-iota.vercel.app";

export default function ReferenceFinalize() {
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState("success"); // "success" or "error"

  // ✅ Fetch all references
  const fetchReferences = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/reference`);
      setReferences(res.data);
    } catch (error) {
      console.error("Error fetching references:", error);
    }
  };

  // ✅ Handle finalize checkbox
  const handleFinalize = async (id, checked) => {
    if (!checked) return;
    try {
      setLoading(true);
      const res = await axios.post(`${BACKEND_URL}/api/reference/sample-out`, { id });
      setMessage(`Reference ${res.data.reference.refNumber} finalized successfully!`);
      setMessageType("success");
      setShowMessage(true);
      fetchReferences();
    } catch (error) {
      console.error("Error finalizing sample:", error);
      setMessage("Failed to finalize reference. Please try again.");
      setMessageType("error");
      setShowMessage(true);
    } finally {
      setLoading(false);
      setTimeout(() => setShowMessage(false), 4000);
    }
  };

  useEffect(() => {
    fetchReferences();
  }, []);

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={styles.heading}>Finalize References</h2>
        <p style={styles.subtitle}>Manage and track sample processing status</p>
      </motion.div>

      {/* ✅ Enhanced Notification */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            style={{
              ...styles.toast,
              background: messageType === "success" 
                ? "linear-gradient(135deg, #00b894, #00a085)" 
                : "linear-gradient(135deg, #ff7675, #d63031)"
            }}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div style={styles.toastContent}>
              <span style={styles.toastIcon}>
                {messageType === "success" ? "✓" : "⚠"}
              </span>
              {message}
            </div>
            <button 
              onClick={() => setShowMessage(false)}
              style={styles.toastClose}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Enhanced Loading Animation */}
      <AnimatePresence>
        {loading && (
          <motion.div
            style={styles.loaderOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div style={styles.loaderContainer}>
              <motion.div
                style={styles.spinner}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={styles.loadingText}
              >
                Processing your request...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Enhanced Reference List */}
      <div style={styles.list}>
        {references.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.emptyState}
          >
            <div style={styles.emptyIcon}>📋</div>
            <p style={styles.emptyText}>No references found</p>
            <p style={styles.emptySubtext}>All references will appear here once created</p>
          </motion.div>
        ) : (
          references.map((ref, index) => (
            <motion.div
              key={ref._id}
              style={{
                ...styles.card,
                borderLeft: ref.sampleOut 
                  ? "4px solid #00b894" 
                  : "4px solid #0984e3",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div style={styles.cardContent}>
                <div style={styles.info}>
                  <div style={styles.refHeader}>
                    <p style={styles.refNo}>Reference #{ref.refNumber}</p>
                    <motion.div
                      style={{
                        ...styles.statusBadge,
                        background: ref.sampleOut 
                          ? "rgba(0, 184, 148, 0.1)" 
                          : "rgba(233, 112, 85, 0.1)"
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <span style={{
                        ...styles.statusDot,
                        background: ref.sampleOut ? "#00b894" : "#e97055"
                      }} />
                      <span style={{
                        ...styles.statusText,
                        color: ref.sampleOut ? "#00b894" : "#e97055"
                      }}>
                        {ref.sampleOut ? "Completed" : "Pending"}
                      </span>
                    </motion.div>
                  </div>
                  <p style={styles.date}>
                    Created: {new Date(ref.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>

                <motion.label
                  style={styles.checkboxContainer}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <input
                    type="checkbox"
                    checked={ref.sampleOut}
                    disabled={ref.sampleOut || loading}
                    onChange={(e) => handleFinalize(ref._id, e.target.checked)}
                    style={styles.checkbox}
                  />
                  <motion.div
                    style={styles.customCheckbox}
                    animate={{
                      background: ref.sampleOut ? "#00b894" : "#fff",
                      borderColor: ref.sampleOut ? "#00b894" : "#ddd"
                    }}
                    whileHover={{
                      borderColor: ref.sampleOut ? "#00b894" : "#0984e3"
                    }}
                  >
                    {ref.sampleOut && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={styles.checkmark}
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.div>
                  <span style={styles.checkboxLabel}>
                    {ref.sampleOut ? "Finalized" : "Mark as Complete"}
                  </span>
                </motion.label>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

// ✅ Enhanced Styles
const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    background: "rgba(255, 255, 255, 0.95)",
    padding: "40px",
    borderRadius: "20px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    position: "relative",
    overflow: "hidden",
  },
  heading: {
    textAlign: "center",
    marginBottom: "8px",
    fontSize: "2rem",
    fontWeight: 700,
    color: "#2d3436",
    background: "linear-gradient(135deg, #2d3436, #636e72)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: "40px",
    color: "#636e72",
    fontSize: "1rem",
    fontWeight: 400,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  card: {
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
    padding: "0",
    borderRadius: "16px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    overflow: "hidden",
  },
  cardContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px",
  },
  info: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
  },
  refHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  refNo: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#2d3436",
    margin: 0,
  },
  date: {
    fontSize: "0.9rem",
    color: "#636e72",
    margin: 0,
  },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "20px",
    border: "1px solid rgba(0,0,0,0.1)",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
  statusText: {
    fontSize: "0.8rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    padding: "12px",
    borderRadius: "8px",
    transition: "background 0.2s ease",
  },
  checkbox: {
    display: "none",
  },
  customCheckbox: {
    width: "20px",
    height: "20px",
    borderRadius: "6px",
    border: "2px solid #ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    position: "relative",
  },
  checkmark: {
    color: "white",
    fontSize: "12px",
    fontWeight: "bold",
  },
  checkboxLabel: {
    fontSize: "0.9rem",
    fontWeight: 500,
    color: "#2d3436",
    whiteSpace: "nowrap",
  },
  toast: {
    position: "fixed",
    top: "30px",
    right: "30px",
    color: "white",
    padding: "0",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    fontWeight: 500,
    zIndex: 1000,
    overflow: "hidden",
    minWidth: "300px",
  },
  toastContent: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 20px",
  },
  toastIcon: {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  toastClose: {
    background: "rgba(255,255,255,0.2)",
    border: "none",
    color: "white",
    fontSize: "1.5rem",
    cursor: "pointer",
    padding: "4px 12px",
    height: "100%",
    transition: "background 0.2s ease",
  },
  loaderOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(255, 255, 255, 0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    backdropFilter: "blur(5px)",
  },
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    background: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #f1f3f4",
    borderTop: "4px solid #00b894",
    borderRadius: "50%",
  },
  loadingText: {
    color: "#636e72",
    fontWeight: 500,
    fontSize: "1rem",
    margin: 0,
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 40px",
    background: "rgba(248, 249, 250, 0.8)",
    borderRadius: "16px",
    border: "2px dashed #dee2e6",
  },
  emptyIcon: {
    fontSize: "3rem",
    marginBottom: "16px",
    opacity: 0.5,
  },
  emptyText: {
    fontSize: "1.2rem",
    fontWeight: 600,
    color: "#636e72",
    margin: "0 0 8px 0",
  },
  emptySubtext: {
    fontSize: "0.9rem",
    color: "#adb5bd",
    margin: 0,
  },
};