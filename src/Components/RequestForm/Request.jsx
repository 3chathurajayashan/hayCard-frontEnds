"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaFlask, FaCheckCircle, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";

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
      const response = await fetch("https://hay-card-back-end-iota.vercel.app/api/chemicals/all");
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

      await fetch("https://hay-card-back-end-iota.vercel.app/api/chemicals/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      showCustomNotification("Your sample request has been sent successfully!", "success");
      fetchChemicals();

      setFormData({
        chemicalName: "",
        quantity: "",
        handOverRange: "",
        customChemical: "",
      });
    } catch (error) {
      showCustomNotification("Error submitting your request. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => window.history.back();

  const getNotificationIcon = () => {
    switch(notificationType) {
      case "success": return <FaCheckCircle size={20} />;
      case "error": return <FaExclamationCircle size={20} />;
      case "info": return <FaInfoCircle size={20} />;
      default: return null;
    }
  };

  return (
    <>
      <style>{`
        * { 
          box-sizing: border-box; 
          margin: 0; 
          padding: 0; 
        }
        
        body {
          font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #FF9720;
          min-height: 100vh;
        }

        .page-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: start;
          min-height: 100vh;
          padding: 40px 20px;
          position: relative;
        }

        .form-container {
          background: white;
          padding: 40px;
          border-radius: 16px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          margin-bottom: 40px;
        }

        .back-btn {
          position: absolute;
          top: 20px;
          left: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #3b82f6;
          border: none;
          border-radius: 8px;
          width: 40px;
          height: 40px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: white;
        }

        .back-btn:hover {
          background: #2563eb;
          transform: translateX(-2px);
        }

        .header-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          background: #3b82f6;
          border-radius: 12px;
          margin: 0 auto 20px;
        }

        .title {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          text-align: center;
          margin-bottom: 8px;
        }

        .subtitle {
          color: #64748b;
          font-size: 14px;
          text-align: center;
          margin-bottom: 30px;
        }

        label {
          font-weight: 600;
          color: #374151;
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .required::after {
          content: " *";
          color: #ef4444;
        }

        input, select {
          width: 100%;
          padding: 12px 14px;
          font-size: 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          margin-bottom: 20px;
          outline: none;
          transition: all 0.2s ease;
          background: white;
          font-family: inherit;
        }

        input:hover, select:hover {
          border-color: #9ca3af;
        }

        input:focus, select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .submit-btn {
          width: 100%;
          background: #3b82f6;
          color: white;
          font-weight: 600;
          font-size: 15px;
          padding: 14px 0;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .submit-btn:hover:not(:disabled) {
          background: #2563eb;
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top: 2px solid #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .page-loader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .loader-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f1f5f9;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        .loader-text {
          color: #64748b;
          font-size: 14px;
        }

        .table-container {
          width: 100%;
          max-width: 900px;
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
        }

        .table-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .table-header h2 {
          color: #1e293b;
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        thead {
          background: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
        }

        th {
          padding: 12px 16px;
          color: #475569;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        tbody tr {
          border-bottom: 1px solid #f1f5f9;
          transition: background-color 0.2s ease;
        }

        tbody tr:hover {
          background: #f8fafc;
        }

        td {
          padding: 16px;
          color: #475569;
          font-size: 14px;
          font-weight: 500;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
          font-size: 14px;
        }

        .empty-icon {
          font-size: 40px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          padding: 16px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 1000;
          border-left: 4px solid;
        }

        .notification.success {
          border-left-color: #10b981;
          color: #065f46;
          background: #f0fdf4;
        }

        .notification.error {
          border-left-color: #ef4444;
          color: #991b1b;
          background: #fef2f2;
        }

        .notification.info {
          border-left-color: #3b82f6;
          color: #1e40af;
          background: #eff6ff;
        }

        @media (max-width: 768px) {
          .form-container, .table-container {
            padding: 24px 20px;
          }

          .title {
            font-size: 24px;
          }

          .notification {
            right: 15px;
            left: 15px;
          }
        }
      `}</style>

      {loading && (
        <div className="page-loader">
          <div className="loader-spinner"></div>
          <div className="loader-text">Loading...</div>
        </div>
      )}

      <div className="page-container">
        <div className="form-container">
          <button className="back-btn" onClick={goBack} title="Go Back">
            <FaArrowLeft size={16} />
          </button>

          <div className="header-icon">
            <FaFlask size={24} color="white" />
          </div>

          <h1 className="title">Chemical Request Form</h1>
          <p className="subtitle">Submit your chemical requirement below</p>

          <div>
            <label className="required">Chemical Name</label>
            <select
              name="chemicalName"
              value={formData.chemicalName}
              onChange={handleChange}
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
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="text"
                    name="customChemical"
                    placeholder="Enter specific chemical name"
                    value={formData.customChemical}
                    onChange={handleChange}
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
              required
            />

            <label className="required">Hand Over Timeline</label>
            <select
              name="handOverRange"
              value={formData.handOverRange}
              onChange={handleChange}
              required
            >
              <option value="">Select Timeline</option>
              {handoverOptions.map((range, i) => (
                <option key={i} value={range}>
                  {range}
                </option>
              ))}
            </select>

            <button 
              type="button" 
              className="submit-btn" 
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
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

        <div className="table-container">
          <div className="table-header">
            <FaFlask size={20} color="#3b82f6" />
            <h2>Requested Chemicals</h2>
          </div>

          {!loading && chemicals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🧪</div>
              <p>No chemical requests available yet.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Chemical</th>
                  <th>Quantity</th>
                  <th>Hand Over</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {chemicals.map((chem, index) => (
                  <motion.tr
                    key={chem._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td>{chem.chemicalName}</td>
                    <td>{chem.quantity}</td>
                    <td>{chem.handOverRange}</td>
                    <td>{new Date(chem.createdAt).toLocaleDateString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <AnimatePresence>
          {showNotification && (
            <motion.div 
              className={`notification ${notificationType}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.2 }}
            >
              {getNotificationIcon()}
              <span>{message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}