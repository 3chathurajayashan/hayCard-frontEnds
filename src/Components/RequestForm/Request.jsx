"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowLeft,
  FaFlask,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaPlus,
  FaHistory,
  FaChartPie,
} from "react-icons/fa";

// 📌 CHART LIBRARIES
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function ChemicalRequestPage() {
  const [formData, setFormData] = useState({
    chemicalName: "",
    quantity: "",
    handOverRange: "",
    customChemical: "",
  });

  const [chemicals, setChemicals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("success");

  const chemicalOptions = [
    "Hydrochloric Acid", "Sulfuric Acid", "Ethanol", 
    "Sodium Hydroxide", "Ammonia Solution", "Acetone", "Other",
  ];

  const handoverOptions = [
    "Within 1 Week", "Within 2 Weeks", "Within 3 Weeks", 
    "Within 1 Month", "Fixed Date",
  ];

  useEffect(() => {
    fetchChemicals();
  }, []);

  const fetchChemicals = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://hay-card-back-end-iota.vercel.app/api/chemicals/all");
      const data = await response.json();
      setChemicals(data);
    } catch (error) {
      showCustomNotification("Failed to load data.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "chemicalName" && value !== "Other" && { customChemical: "" }),
    }));
  };

  const showCustomNotification = (msg, type = "success") => {
    setMessage(msg);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.chemicalName || !formData.quantity) return;
    
    setIsSubmitting(true);
    try {
      const submissionData = {
        chemicalName: formData.chemicalName,
        customChemical: formData.chemicalName === "Other" ? formData.customChemical : "",
        quantity: formData.quantity,
        handOverRange: formData.handOverRange,
      };

      await fetch("https://hay-card-back-end-iota.vercel.app/api/chemicals/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      showCustomNotification("Request submitted successfully!", "success");
      fetchChemicals();
      setFormData({ chemicalName: "", quantity: "", handOverRange: "", customChemical: "" });
    } catch (error) {
      showCustomNotification("Submission failed.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 📊 Chart Data Logic
  const chemicalCounts = chemicals.reduce((acc, item) => {
    const name = item.chemicalName === "Other" ? item.customChemical : item.chemicalName;
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(chemicalCounts),
    datasets: [{
      label: "Requests",
      data: Object.values(chemicalCounts),
      backgroundColor: "#3b82f6",
      borderRadius: 6,
    }],
  };

  // -------------------- DESIGN SYSTEM --------------------
  const theme = {
    bg: "#f8fafc",
    card: "#ffffff",
    primary: "#2563eb",
    textMain: "#1e293b",
    textMuted: "#64748b",
    border: "#e2e8f0",
  };

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", padding: "20px", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Top Navigation Bar */}
      <nav style={{ maxWidth: "1200px", margin: "0 auto 30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => window.history.back()} style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: theme.textMuted, cursor: "pointer", fontWeight: 500 }}>
          <FaArrowLeft size={14} /> Back to Dashboard
        </button>
        <div style={{ textAlign: "right" }}>
          <h2 style={{ margin: 0, fontSize: "18px", color: theme.textMain }}>Haycarb PLC</h2>
          <p style={{ margin: 0, fontSize: "12px", color: theme.textMuted }}>Laboratory Management System</p>
        </div>
      </nav>

      <main style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
        
        {/* LEFT COLUMN: FORM */}
        <section>
          <div style={{ background: theme.card, padding: "32px", borderRadius: "16px", border: `1px solid ${theme.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div style={{ background: "#eff6ff", padding: "10px", borderRadius: "10px" }}>
                <FaPlus color={theme.primary} />
              </div>
              <h3 style={{ margin: 0, fontSize: "20px" }}>New Request</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: theme.textMain }}>Chemical Name</label>
                <select name="chemicalName" value={formData.chemicalName} onChange={handleChange} style={inputStyle(theme)}>
                  <option value="">Select chemical...</option>
                  {chemicalOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <AnimatePresence>
                {formData.chemicalName === "Other" && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <input type="text" name="customChemical" placeholder="Specify chemical name" value={formData.customChemical} onChange={handleChange} style={inputStyle(theme)} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: theme.textMain }}>Quantity</label>
                <input type="text" name="quantity" placeholder="e.g. 500ml, 2kg" value={formData.quantity} onChange={handleChange} style={inputStyle(theme)} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: theme.textMain }}>Timeline</label>
                <select name="handOverRange" value={formData.handOverRange} onChange={handleChange} style={inputStyle(theme)}>
                  <option value="">Select timeline...</option>
                  {handoverOptions.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <button onClick={handleSubmit} disabled={isSubmitting} style={buttonStyle(theme, isSubmitting)}>
                {isSubmitting ? "Processing..." : "Submit Request"}
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: DATA & VISUALS */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* STATS SUMMARY */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div style={statCard(theme)}>
              <FaHistory color={theme.textMuted} />
              <div>
                <span style={{ display: "block", fontSize: "12px", color: theme.textMuted }}>Total Requests</span>
                <b style={{ fontSize: "20px" }}>{chemicals.length}</b>
              </div>
            </div>
            <div style={statCard(theme)}>
              <FaChartPie color={theme.textMuted} />
              <div>
                <span style={{ display: "block", fontSize: "12px", color: theme.textMuted }}>Unique Chemicals</span>
                <b style={{ fontSize: "20px" }}>{Object.keys(chemicalCounts).length}</b>
              </div>
            </div>
          </div>

          {/* TABLE CARD */}
          <div style={{ background: theme.card, borderRadius: "16px", border: `1px solid ${theme.border}`, overflow: "hidden" }}>
            <div style={{ padding: "20px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ margin: 0 }}>Recent Activity</h4>
              {loading && <span style={{ fontSize: "12px", color: theme.primary }}>Syncing...</span>}
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "#fcfcfd" }}>
                  <tr>
                    {["Chemical", "Quantity", "Timeline", "Date"].map(h => (
                      <th key={h} style={thStyle(theme)}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chemicals.slice(0, 5).map((item, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={tdStyle(theme)}>{item.chemicalName === "Other" ? item.customChemical : item.chemicalName}</td>
                      <td style={tdStyle(theme)}>{item.quantity}</td>
                      <td style={tdStyle(theme)}><span style={badgeStyle()}>{item.handOverRange}</span></td>
                      <td style={tdStyle(theme)}>{new Date(item.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CHART CARD */}
          <div style={{ background: theme.card, padding: "24px", borderRadius: "16px", border: `1px solid ${theme.border}` }}>
            <h4 style={{ margin: "0 0 20px 0" }}>Demand Analysis</h4>
            <div style={{ height: "250px" }}>
              <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </div>

        </section>
      </main>

      {/* NOTIFICATION */}
      <AnimatePresence>
        {showNotification && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            style={notificationStyle(notificationType)}>
            {notificationType === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 📌 Helper Styles
const inputStyle = (theme) => ({
  width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1px solid ${theme.border}`,
  fontSize: "14px", outline: "none", transition: "border 0.2s", marginTop: "4px"
});

const buttonStyle = (theme, loading) => ({
  marginTop: "10px", padding: "12px", borderRadius: "8px", border: "none",
  background: loading ? theme.textMuted : theme.primary, color: "white",
  fontWeight: 600, cursor: "pointer", transition: "opacity 0.2s"
});

const statCard = (theme) => ({
  background: theme.card, padding: "20px", borderRadius: "16px", border: `1px solid ${theme.border}`,
  display: "flex", alignItems: "center", gap: "15px"
});

const thStyle = (theme) => ({
  padding: "12px 20px", textAlign: "left", fontSize: "12px", textTransform: "uppercase",
  letterSpacing: "0.05em", color: theme.textMuted, fontWeight: 700
});

const tdStyle = (theme) => ({
  padding: "14px 20px", fontSize: "14px", color: theme.textMain
});

const badgeStyle = () => ({
  background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: 500
});

const notificationStyle = (type) => ({
  position: "fixed", bottom: "30px", right: "30px", padding: "16px 24px", borderRadius: "12px",
  display: "flex", alignItems: "center", gap: "12px", color: "white", fontWeight: 500,
  background: type === "success" ? "#10b981" : "#ef4444", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)"
});