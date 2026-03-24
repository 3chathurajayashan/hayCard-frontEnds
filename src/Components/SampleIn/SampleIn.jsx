"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// Keeping your original constants
const FRONTEND_URL = "https://hay-card-front-end.vercel.app/";
const BACKEND_URL = "https://hay-card-back-end.vercel.app/";

export default function SamplePage() {
  const [formData, setFormData] = useState({
    referenceNumber: "",
    quantity: "",
    grade: "A",
    date: "",
    time: "",
  });

  const [samples, setSamples] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const gradeOptions = ["A", "B", "C", "D", "Other"];

  const fetchSamples = async () => {
    setIsFetching(true);
    try {
      const res = await axios.get("https://hay-card-back-end-iota.vercel.app/api/cusSamples");
      setSamples(res.data);
    } catch (err) {
      console.log(err);
      setMessage({ text: "Error fetching samples", type: "error" });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchSamples();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await axios.post(
        "https://hay-card-back-end-iota.vercel.app/api/cusSamples/add",
        formData
      );
      setMessage({ text: res.data.message, type: "success" });
      setFormData({ referenceNumber: "", quantity: "", grade: "A", date: "", time: "" });
      fetchSamples();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Error submitting sample",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (ref) => {
    if (!window.confirm("Are you sure you want to delete this sample?")) return;
    try {
      const res = await axios.delete(`https://hay-card-back-end-iota.vercel.app/api/cusSamples/${ref}`);
      setMessage({ text: res.data.message, type: "success" });
      fetchSamples();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Error deleting sample",
        type: "error",
      });
    }
  };

  const handleBack = () => window.history.back();

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar Navigation (Visual Only) */}
      <aside className="sidebar">
        <div className="logo">HAYCARB Admin</div>
        <nav>
          <div className="nav-item active">Samples</div>
          <div className="nav-item" onClick={handleBack}>← Back to Home</div>
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <h1>Customer Sample Management</h1>
          <div className="user-profile">Admin</div>
        </header>

        {/* Notification */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              className={`notification ${message.type}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid-container">
          {/* Form Section */}
          <motion.div 
            className="card form-section"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3>Add New Sample</h3>
            <form className="minimal-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Reference</label>
                <input
                  type="text"
                  name="referenceNumber"
                  placeholder="REF-001"
                  value={formData.referenceNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Grade</label>
                <select name="grade" value={formData.grade} onChange={handleChange} required>
                  {gradeOptions.map((g, i) => (
                    <option key={i} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label>Time</label>
                  <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                </div>
              </div>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? <div className="spinner" /> : "Register Sample"}
              </button>
            </form>
          </motion.div>

          {/* Table Section */}
          <motion.div 
            className="card table-section"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="table-header">
              <h3>Inventory List</h3>
              <span className="count-badge">{samples.length} Samples</span>
            </div>

            {isFetching ? (
              <div className="skeleton-loader">
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
              </div>
            ) : (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Quantity</th>
                      <th>Grade</th>
                      <th>Timestamp</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {samples.length > 0 ? (
                      samples.map((s) => (
                        <tr key={s.referenceNumber}>
                          <td className="bold">{s.referenceNumber}</td>
                          <td>{s.quantity}</td>
                          <td><span className={`badge ${s.grade}`}>{s.grade}</span></td>
                          <td className="dim text-small">{s.date} <br/> {s.time}</td>
                          <td>
                            <button className="text-delete" onClick={() => handleDelete(s.referenceNumber)}>
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="empty-state">No samples found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <style>{`
        :root {
          --bg: #f8fafc;
          --sidebar: #0f3778;
          --accent: #6366f1;
          --text-main: #334155;
          --text-dim: #64748b;
          --border: #e2e8f0;
          --card-bg: #ffffff;
        }

        .dashboard-wrapper {
          display: flex;
          min-height: 100vh;
          background: var(--bg);
          font-family: 'Inter', system-ui, sans-serif;
          color: var(--text-main);
        }

        /* Sidebar */
        .sidebar {
          width: 240px;
          background: var(--sidebar);
          color: white;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
        }
        .logo { font-weight: 800; font-size: 1.2rem; letter-spacing: 1px; margin-bottom: 3rem; color: #ffffff; }
        .nav-item { 
          padding: 0.75rem 1rem; 
          border-radius: 8px; 
          margin-bottom: 0.5rem; 
          cursor: pointer; 
          transition: 0.2s;
          font-size: 0.9rem;
          color: #ffffff;
        }
        .nav-item.active { background: #334155; color: white; }
        .nav-item:hover { background: #334155; color: white; }

        /* Content */
        .main-content { flex: 1; padding: 2rem 3rem; overflow-y: auto; }
        .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
        .top-bar h1 { font-size: 1.5rem; font-weight: 700; color: #0f172a; }
        .user-profile { font-size: 0.85rem; background: var(--border); padding: 5px 12px; border-radius: 20px; font-weight: 600; }

        .grid-container { display: grid; grid-template-columns: 350px 1fr; gap: 2rem; }

        /* Cards */
        .card { background: var(--card-bg); border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 1px 3px rgba(0,0,0,0.02); padding: 1.5rem; }
        .card h3 { font-size: 1rem; margin-bottom: 1.5rem; font-weight: 600; color: #1e293b; }

        /* Form Styling */
        .input-group { margin-bottom: 1.2rem; display: flex; flex-direction: column; gap: 6px; }
        .input-group label { font-size: 0.8rem; font-weight: 600; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.5px; }
        .minimal-form input, .minimal-form select {
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid var(--border);
          font-size: 0.9rem;
          background: #fdfdfd;
          outline: none;
        }
        .minimal-form input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
        .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        .submit-btn {
          width: 100%;
          padding: 12px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1rem;
          transition: opacity 0.2s;
        }
        .submit-btn:hover { opacity: 0.9; }

        /* Table Styling */
        .table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .count-badge { font-size: 0.75rem; background: #eef2ff; color: var(--accent); padding: 4px 10px; border-radius: 12px; font-weight: 600; }
        .table-responsive { width: 100%; overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; text-align: left; }
        th { padding: 12px; border-bottom: 2px solid var(--bg); font-size: 0.75rem; text-transform: uppercase; color: var(--text-dim); }
        td { padding: 16px 12px; border-bottom: 1px solid var(--bg); font-size: 0.9rem; }
        .bold { font-weight: 600; color: #0f172a; }
        .dim { color: var(--text-dim); }
        .text-small { font-size: 0.8rem; }
        
        .badge { padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; }
        .badge.A { background: #dcfce7; color: #166534; }
        .badge.B { background: #fef9c3; color: #854d0e; }
        .badge.C { background: #ffedd5; color: #9a3412; }

        .text-delete { color: #ef4444; background: none; border: none; font-size: 0.85rem; font-weight: 500; cursor: pointer; }
        .text-delete:hover { text-decoration: underline; }

        /* Notifications */
        .notification {
          position: fixed; top: 2rem; right: 2rem; padding: 1rem 1.5rem; border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); z-index: 100; font-size: 0.9rem;
        }
        .notification.success { background: #10b981; color: white; }
        .notification.error { background: #ef4444; color: white; }

        /* Loaders */
        .spinner { width: 20px; height: 20px; border: 2px solid #fff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 0.8s linear infinite; margin: auto; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .skeleton-loader { display: flex; flex-direction: column; gap: 1rem; }
        .skeleton-line { height: 40px; background: #f1f5f9; border-radius: 8px; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }

        @media (max-width: 1024px) {
          .grid-container { grid-template-columns: 1fr; }
          .sidebar { display: none; }
        }
      `}</style>
    </div>
  );
}