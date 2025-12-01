"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const BACKEND_URL = "https://hay-card-back-end-iota.vercel.app";

export default function ReferenceFinalize() {
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState("success");

  const fetchReferences = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/reference`);
      // Add a small delay for smooth skeleton effect
      setTimeout(() => {
        setReferences(res.data);
        setLoading(false);
      }, 600);
    } catch (error) {
      console.error("Error fetching references:", error);
      setLoading(false);
    }
  };

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
      setLoading(false);
    } finally {
      setTimeout(() => setShowMessage(false), 4000);
    }
  };

  useEffect(() => {
    fetchReferences();
  }, []);

  const completedCount = references.filter(r => r.sampleOut).length;
  const pendingCount = references.length - completedCount;

  const chartData = {
    labels: ["Pending", "Completed"],
    datasets: [
      {
        data: [pendingCount, completedCount],
        backgroundColor: ["#0984e3", "#00b894"],
        borderColor: ["#0984e3", "#00b894"],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const chartOptions = {
    cutout: "70%",
    plugins: {
      legend: { position: "bottom", labels: { color: "#2d3436", font: { weight: 600 } } },
      tooltip: { enabled: true },
    },
    animation: { duration: 800, easing: "easeInOutQuad" },
  };

  return (
    <div style={styles.container}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 style={styles.heading}>Finalize References</h2>
        <p style={styles.subtitle}>Track and manage your sample processing</p>
      </motion.div>

      {/* Charts */}
      <motion.div
        style={styles.chartWrapper}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Doughnut data={chartData} options={chartOptions} />
      </motion.div>

      {/* Notification */}
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
              <span style={styles.toastIcon}>{messageType === "success" ? "✓" : "⚠"}</span>
              {message}
            </div>
            <button onClick={() => setShowMessage(false)} style={styles.toastClose}>×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reference List */}
      <div style={styles.list}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                style={styles.skeletonCard}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            ))
          : references.map((ref, index) => (
              <motion.div
                key={ref._id}
                style={{
                  ...styles.card,
                  borderLeft: ref.sampleOut ? "6px solid #00b894" : "6px solid #0984e3",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 28px rgba(0,0,0,0.12)" }}
              >
                <div style={styles.cardContent}>
                  <div style={styles.info}>
                    <div style={styles.refHeader}>
                      <p style={styles.refNo}>Reference #{ref.refNumber}</p>
                      <motion.div
                        style={{
                          ...styles.statusBadge,
                          background: ref.sampleOut ? "rgba(0, 184, 148, 0.15)" : "rgba(9, 132, 227, 0.15)"
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <span style={{
                          ...styles.statusDot,
                          background: ref.sampleOut ? "#00b894" : "#0984e3"
                        }} />
                        <span style={{
                          ...styles.statusText,
                          color: ref.sampleOut ? "#00b894" : "#0984e3"
                        }}>
                          {ref.sampleOut ? "Completed" : "Pending"}
                        </span>
                      </motion.div>
                    </div>
                    <p style={styles.date}>Created: {new Date(ref.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>

                  <motion.label style={styles.checkboxContainer} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                    >
                      {ref.sampleOut && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={styles.checkmark}>✓</motion.span>
                      )}
                    </motion.div>
                    <span style={styles.checkboxLabel}>{ref.sampleOut ? "Finalized" : "Mark as Complete"}</span>
                  </motion.label>
                </div>
              </motion.div>
            ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "850px", margin: "40px auto", padding: "40px", borderRadius: "24px", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", boxShadow: "0 12px 40px rgba(0,0,0,0.08)" },
  heading: { textAlign: "center", fontSize: "2.2rem", fontWeight: 700, marginBottom: "6px", color: "#2d3436", background: "linear-gradient(135deg, #2d3436, #636e72)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  subtitle: { textAlign: "center", color: "#636e72", marginBottom: "30px" },
  chartWrapper: { maxWidth: "350px", margin: "0 auto 30px" },
  list: { display: "flex", flexDirection: "column", gap: "20px" },
  card: { borderRadius: "16px", boxShadow: "0 6px 22px rgba(0,0,0,0.08)", overflow: "hidden", transition: "all 0.3s ease", background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)" },
  cardContent: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px" },
  info: { display: "flex", flexDirection: "column", gap: "6px", flex: 1 },
  refHeader: { display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" },
  refNo: { fontSize: "1.1rem", fontWeight: 600, color: "#2d3436", margin: 0 },
  date: { fontSize: "0.9rem", color: "#636e72", margin: 0 },
  statusBadge: { display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "20px" },
  statusDot: { width: "8px", height: "8px", borderRadius: "50%" },
  statusText: { fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase" },
  checkboxContainer: { display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" },
  checkbox: { display: "none" },
  customCheckbox: { width: "20px", height: "20px", borderRadius: "6px", border: "2px solid #ddd", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" },
  checkmark: { color: "white", fontSize: "12px", fontWeight: "bold" },
  checkboxLabel: { fontSize: "0.9rem", fontWeight: 500, color: "#2d3436" },
  toast: { position: "fixed", top: "30px", right: "30px", color: "white", padding: "0", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", fontWeight: 500, zIndex: 1000, overflow: "hidden", minWidth: "300px" },
  toastContent: { display: "flex", alignItems: "center", gap: "12px", padding: "16px 20px" },
  toastIcon: { fontSize: "1.2rem", fontWeight: "bold" },
  toastClose: { background: "rgba(255,255,255,0.2)", border: "none", color: "white", fontSize: "1.5rem", cursor: "pointer", padding: "4px 12px" },
  skeletonCard: { height: "80px", borderRadius: "16px", background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)", backgroundSize: "200% 100%" }
};
