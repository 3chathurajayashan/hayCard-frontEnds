"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowLeft,
  FaFlask,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";

// 📌 IMPORT CHART LIBRARIES
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

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
    "Hydrochloric Acid",
    "Sulfuric Acid",
    "Ethanol",
    "Sodium Hydroxide",
    "Ammonia Solution",
    "Acetone",
    "Other",
  ];

  const handoverOptions = [
    "Within 1 Week",
    "Within 2 Weeks",
    "Within 3 Weeks",
    "Within 1 Month",
    "Fixed Date",
  ];

  useEffect(() => {
    fetchChemicals();
  }, []);

  const fetchChemicals = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://hay-card-back-end-iota.vercel.app/api/chemicals/all"
      );
      const data = await response.json();
      setChemicals(data);
    } catch (error) {
      console.error("Error fetching chemicals:", error);
      showCustomNotification("Failed to load data. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      ...(name === "chemicalName" && value !== "Other" && { customChemical: "" }),
    });
  };

  const showCustomNotification = (msg, type = "success") => {
    setMessage(msg);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    showCustomNotification("Submitting your chemical request...", "info");

    try {
      const submissionData = {
        chemicalName: formData.chemicalName,
        customChemical:
          formData.chemicalName === "Other" ? formData.customChemical : "",
        quantity: formData.quantity,
        handOverRange: formData.handOverRange,
      };

      await fetch(
        "https://hay-card-back-end-iota.vercel.app/api/chemicals/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        }
      );

      showCustomNotification(
        "Your sample request has been sent successfully!",
        "success"
      );
      fetchChemicals();

      setFormData({
        chemicalName: "",
        quantity: "",
        handOverRange: "",
        customChemical: "",
      });
    } catch (error) {
      showCustomNotification(
        "Error submitting your request. Please try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => window.history.back();

  const getNotificationIcon = () => {
    switch (notificationType) {
      case "success":
        return <FaCheckCircle size={20} />;
      case "error":
        return <FaExclamationCircle size={20} />;
      case "info":
        return <FaInfoCircle size={20} />;
      default:
        return null;
    }
  };

  // ---------------------------------------------------------
  // 📌 CHART DATA PROCESSING
  // ---------------------------------------------------------
  const chemicalCounts = chemicals.reduce((acc, item) => {
    const name = item.chemicalName;
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(chemicalCounts),
    datasets: [
      {
        label: "Requests",
        data: Object.values(chemicalCounts),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const pieData = {
    labels: Object.keys(chemicalCounts),
    datasets: [
      {
        data: Object.values(chemicalCounts),
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#14b8a6",
        ],
      },
    ],
  };

  // ---------------------------------------------------------

  // -------------------- INLINE STYLES --------------------
  const styles = {
    pageContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "start",
      minHeight: "100vh",
      padding: "40px 20px",
      position: "relative",
      fontFamily: "'Inter', sans-serif",
      background: "#FF9720",
    },
    formContainer: {
      background: "white",
      padding: "40px",
      borderRadius: "16px",
      maxWidth: "500px",
      width: "100%",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      border: "1px solid #e2e8f0",
      marginBottom: "40px",
      position: "relative",
    },
    backBtn: {
      position: "absolute",
      top: "20px",
      left: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#3b82f6",
      border: "none",
      borderRadius: "8px",
      width: "40px",
      height: "40px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      color: "white",
    },
    headerIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "60px",
      height: "60px",
      background: "#3b82f6",
      borderRadius: "12px",
      margin: "0 auto 20px",
    },
    title: { fontSize: "28px", fontWeight: 700, color: "#1e293b", textAlign: "center", marginBottom: "8px" },
    subtitle: { color: "#64748b", fontSize: "14px", textAlign: "center", marginBottom: "30px" },
    input: {
      width: "100%",
      padding: "12px 14px",
      fontSize: "14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      marginBottom: "20px",
      outline: "none",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
    },
    select: {
      width: "100%",
      padding: "12px 14px",
      fontSize: "14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      marginBottom: "20px",
      outline: "none",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
      background: "white",
    },
    submitBtn: {
      width: "100%",
      background: "#3b82f6",
      color: "white",
      fontWeight: 600,
      fontSize: "15px",
      padding: "14px 0",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    tableContainer: {
      width: "100%",
      maxWidth: "900px",
      background: "white",
      borderRadius: "16px",
      padding: "30px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      border: "1px solid #e2e8f0",
      marginBottom: "40px",
    },
    tableHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" },
    chartSection: {
      marginTop: "40px",
      width: "100%",
      maxWidth: "900px",
      background: "white",
      padding: "30px",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      border: "1px solid #e2e8f0",
      marginBottom: "40px",
    },
    chartTitle: { fontSize: "20px", fontWeight: 700, color: "#1e293b", marginBottom: "20px", textAlign: "center" },
  };

  return (
    <div style={styles.pageContainer}>
      {loading && (
        <div className="page-loader">
          <div className="loader-spinner"></div>
          <div className="loader-text">Loading...</div>
        </div>
      )}

      {/* FORM */}
      <div style={styles.formContainer}>
        <button style={styles.backBtn} onClick={goBack}>
          <FaArrowLeft size={16} />
        </button>
        <div style={styles.headerIcon}>
          <FaFlask size={24} color="white" />
        </div>
        <h1 style={styles.title}>Chemical Request Form</h1>
        <p style={styles.subtitle}>Submit your chemical requirement below</p>

        <div>
          <label className="required">Chemical Name</label>
          <select
            name="chemicalName"
            value={formData.chemicalName}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="">Select Chemical</option>
            {chemicalOptions.map((chem, i) => (
              <option key={i} value={chem}>
                {chem}
              </option>
            ))}
          </select>

          <AnimatePresence>
            {formData.chemicalName === "Other" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <input
                  type="text"
                  name="customChemical"
                  placeholder="Enter specific chemical name"
                  value={formData.customChemical}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          <label className="required">Quantity</label>
          <input
            type="text"
            name="quantity"
            placeholder="Example: 25 L, 10 kg, 500 mL"
            value={formData.quantity}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <label className="required">Hand Over Timeline</label>
          <select
            name="handOverRange"
            value={formData.handOverRange}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="">Select Timeline</option>
            {handoverOptions.map((range, i) => (
              <option key={i} value={range}>
                {range}
              </option>
            ))}
          </select>

          <button type="button" style={styles.submitBtn} disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <FaFlask size={20} color="#3b82f6" />
          <h2>Requested Chemicals</h2>
        </div>
        {!loading && chemicals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🧪</div>
            <p>No chemical requests available yet.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
              <tr>
                <th style={{ padding: "12px 16px", color: "#475569", fontWeight: 600, fontSize: "12px" }}>Chemical</th>
                <th style={{ padding: "12px 16px", color: "#475569", fontWeight: 600, fontSize: "12px" }}>Quantity</th>
                <th style={{ padding: "12px 16px", color: "#475569", fontWeight: 600, fontSize: "12px" }}>Hand Over</th>
                <th style={{ padding: "12px 16px", color: "#475569", fontWeight: 600, fontSize: "12px" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {chemicals.map((chem, index) => (
                <motion.tr
                  key={chem._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  style={{ borderBottom: "1px solid #f1f5f9" }}
                >
                  <td style={{ padding: "16px", color: "#475569", fontSize: "14px", fontWeight: 500 }}>{chem.chemicalName}</td>
                  <td style={{ padding: "16px", color: "#475569", fontSize: "14px", fontWeight: 500 }}>{chem.quantity}</td>
                  <td style={{ padding: "16px", color: "#475569", fontSize: "14px", fontWeight: 500 }}>{chem.handOverRange}</td>
                  <td style={{ padding: "16px", color: "#475569", fontSize: "14px", fontWeight: 500 }}>{new Date(chem.createdAt).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CHARTS */}
      <div style={styles.chartSection}>
        <h2 style={styles.chartTitle}>Chemical Request Statistics</h2>
        <Bar data={barData} />
      </div>

      <div style={styles.chartSection}>
        <h2 style={styles.chartTitle}>Chemical Distribution</h2>
        <Pie data={pieData} />
      </div>

      {/* NOTIFICATION */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            className={`notification ${notificationType}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            style={{
              position: "fixed",
              top: 20,
              right: 20,
              background: "white",
              padding: "16px 20px",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              fontSize: "14px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "12px",
              zIndex: 1000,
              borderLeft: `4px solid ${notificationType === "success" ? "#10b981" : notificationType === "error" ? "#ef4444" : "#3b82f6"}`,
              color: `${notificationType === "success" ? "#065f46" : notificationType === "error" ? "#991b1b" : "#1e40af"}`,
              backgroundColor: `${notificationType === "success" ? "#f0fdf4" : notificationType === "error" ? "#fef2f2" : "#eff6ff"}`
            }}
          >
            {getNotificationIcon()}
            <span>{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
