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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          background-attachment: fixed;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(240, 147, 251, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(102, 126, 234, 0.3) 0%, transparent 50%);
          animation: bgShift 15s ease infinite;
          pointer-events: none;
        }

        @keyframes bgShift {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        .page-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: start;
          min-height: 100vh;
          padding: 50px 20px;
          position: relative;
          z-index: 1;
        }

        .form-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          padding: 45px;
          border-radius: 24px;
          max-width: 580px;
          width: 100%;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(255, 255, 255, 0.5) inset;
          border: 1px solid rgba(255, 255, 255, 0.3);
          position: relative;
          margin-bottom: 40px;
          animation: floatIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transform-origin: center;
        }

        @keyframes floatIn {
          from { 
            opacity: 0; 
            transform: translateY(40px) scale(0.95);
            filter: blur(10px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        .back-btn {
          position: absolute;
          top: 20px;
          left: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 50%;
          width: 42px;
          height: 42px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          color: white;
        }

        .back-btn:hover {
          transform: translateX(-3px) scale(1.05);
          box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
        }

        .back-btn:active {
          transform: translateX(-3px) scale(0.95);
        }

        .header-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          margin: 0 auto 20px;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .title {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .subtitle {
          color: #64748b;
          font-size: 15px;
          text-align: center;
          margin-bottom: 30px;
          font-weight: 500;
        }

        label {
          font-weight: 600;
          color: #374151;
          display: block;
          margin-bottom: 10px;
          font-size: 14px;
          letter-spacing: 0.3px;
        }

        .required::after {
          content: " *";
          color: #ef4444;
          font-weight: 700;
        }

        input, select {
          width: 100%;
          padding: 14px 16px;
          font-size: 15px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          margin-bottom: 22px;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: white;
          font-family: inherit;
        }

        input:hover, select:hover {
          border-color: #c7d2fe;
        }

        input:focus, select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
          transform: translateY(-1px);
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 700;
          font-size: 16px;
          padding: 16px 0;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
          letter-spacing: 0.5px;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }

        .submit-btn:hover:not(:disabled)::before {
          left: 100%;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.5);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(-1px);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loading-spinner {
          width: 18px;
          height: 18px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top: 3px solid #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
          vertical-align: middle;
          margin-right: 10px;
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
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 100;
          backdrop-filter: blur(10px);
        }

        .loader-content {
          text-align: center;
        }

        .loader-spinner {
          width: 60px;
          height: 60px;
          border: 5px solid rgba(255,255,255,0.2);
          border-top: 5px solid #fff;
          border-radius: 50%;
          animation: spin 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
          margin: 0 auto 20px;
        }

        .loader-text {
          color: white;
          font-size: 16px;
          font-weight: 600;
          animation: fadeInOut 1.5s ease-in-out infinite;
        }

        @keyframes fadeInOut {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .table-container {
          width: 100%;
          max-width: 950px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 30px;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(255, 255, 255, 0.5) inset;
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: floatIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
          opacity: 0;
        }

        .table-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .table-header h2 {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 24px;
          font-weight: 800;
          margin: 0;
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 8px;
          text-align: left;
        }

        thead tr {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
        }

        th {
          padding: 16px 14px;
          color: white;
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        th:first-child {
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
        }

        th:last-child {
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
        }

        tbody tr {
          background: white;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        tbody tr:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
        }

        td {
          padding: 16px 14px;
          color: #475569;
          font-size: 14px;
          font-weight: 500;
        }

        td:first-child {
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
          font-weight: 600;
          color: #1e293b;
        }

        td:last-child {
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
          font-size: 15px;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.4;
        }

        .notification {
          position: fixed;
          top: 30px;
          right: 30px;
          background: white;
          padding: 18px 24px;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          font-size: 15px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 1000;
          animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          min-width: 300px;
          border-left: 5px solid;
        }

        @keyframes slideInRight {
          from { 
            opacity: 0; 
            transform: translateX(100px);
          }
          to { 
            opacity: 1; 
            transform: translateX(0);
          }
        }

        .notification.success {
          border-left-color: #10b981;
          color: #065f46;
          background: linear-gradient(to right, #d1fae5, white);
        }

        .notification.error {
          border-left-color: #ef4444;
          color: #991b1b;
          background: linear-gradient(to right, #fee2e2, white);
        }

        .notification.info {
          border-left-color: #3b82f6;
          color: #1e40af;
          background: linear-gradient(to right, #dbeafe, white);
        }

        @media (max-width: 768px) {
          .form-container, .table-container {
            padding: 30px 20px;
          }

          .title {
            font-size: 26px;
          }

          .notification {
            right: 15px;
            left: 15px;
            min-width: auto;
          }
        }

        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }
      `}</style>

      {loading && (
        <div className="page-loader">
          <div className="loader-content">
            <div className="loader-spinner"></div>
            <div className="loader-text">Loading your data...</div>
          </div>
        </div>
      )}

      <div className="page-container">
        <motion.div 
          className="form-container"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <button className="back-btn" onClick={goBack} title="Go Back">
            <FaArrowLeft size={18} />
          </button>

          <div className="header-icon">
            <FaFlask size={34} color="white" />
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
                  transition={{ duration: 0.3 }}
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
        </motion.div>

        <motion.div 
          className="table-container"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <div className="table-header">
            <FaFlask size={24} color="#667eea" />
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
                <AnimatePresence>
                  {chemicals.map((chem, index) => (
                    <motion.tr
                      key={chem._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.05,
                        ease: "easeOut" 
                      }}
                    >
                      <td>{chem.chemicalName}</td>
                      <td>{chem.quantity}</td>
                      <td>{chem.handOverRange}</td>
                      <td>{new Date(chem.createdAt).toLocaleDateString()}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </motion.div>

        <AnimatePresence>
          {showNotification && (
            <motion.div 
              className={`notification ${notificationType}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
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