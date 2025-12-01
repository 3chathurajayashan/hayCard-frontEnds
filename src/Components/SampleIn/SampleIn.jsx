"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="container">
      <motion.button
        className="back-btn"
        onClick={handleBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back
      </motion.button>

      <h1>Customer Sample Management</h1>

      {/* Notification */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            className={`notification ${message.type}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <motion.form
        className="sample-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <input
          type="text"
          name="referenceNumber"
          placeholder="Reference Number"
          value={formData.referenceNumber}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
        <select name="grade" value={formData.grade} onChange={handleChange} required>
          {gradeOptions.map((g, i) => (
            <option key={i} value={g}>{g}</option>
          ))}
        </select>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        <input type="time" name="time" value={formData.time} onChange={handleChange} required />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <motion.div
              className="form-loader"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          ) : "Add Sample"}
        </button>
      </motion.form>

      {/* Table */}
      <motion.div
        className="sample-table"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>All Samples</h2>

        {isFetching ? (
          <div className="fetch-loader">
            <motion.div className="dot" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.6 }}/>
            <motion.div className="dot" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}/>
            <motion.div className="dot" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}/>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Quantity</th>
                <th>Grade</th>
                <th>Date</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {samples.length > 0 ? (
                samples.map((s) => (
                  <motion.tr
                    key={s.referenceNumber}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td>{s.referenceNumber}</td>
                    <td>{s.quantity}</td>
                    <td>{s.grade}</td>
                    <td>{s.date}</td>
                    <td>{s.time}</td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDelete(s.referenceNumber)}>
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", color: "#777" }}>
                    No samples found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </motion.div>

      {/* Inline CSS */}
      <style>{`
        .container {
          max-width: 950px;
          margin: auto;
          padding: 50px 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f4f6f8;
        }
        h1 { text-align: center; margin-bottom: 30px; color: #1f2937; font-weight: 700; }
        .back-btn {
          padding: 10px 18px;
          margin-bottom: 25px;
          border: none;
          border-radius: 8px;
          background: #374151;
          color: #fff;
          cursor: pointer;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.3s;
        }
        .back-btn:hover { background: #1f2937; }

        .notification {
          padding: 15px 22px;
          border-radius: 10px;
          margin-bottom: 25px;
          font-weight: 500;
          text-align: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.08);
        }
        .notification.success { background: #d1fae5; color: #065f46; }
        .notification.error { background: #fee2e2; color: #b91c1c; }

        .sample-form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
          margin-bottom: 45px;
          padding: 25px;
          background: #ffffff;
          border-radius: 14px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
        }
        .sample-form input,
        .sample-form select {
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          outline: none;
          transition: all 0.3s;
          font-size: 15px;
        }
        .sample-form input:focus,
        .sample-form select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 10px rgba(37,99,235,0.25);
        }
        .sample-form button {
          grid-column: 1 / -1;
          padding: 14px;
          border-radius: 10px;
          border: none;
          background: #2563eb;
          color: white;
          font-weight: 600;
          cursor: pointer;
          min-height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          transition: all 0.3s;
        }
        .sample-form button:hover { background: #1d4ed8; }

        .form-loader {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top: 3px solid #fff;
          border-radius: 50%;
        }

        .sample-table h2 {
          margin-bottom: 20px;
          color: #1f2937;
          font-weight: 700;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: #ffffff;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
        }
        th, td {
          padding: 16px 20px;
          text-align: center;
          border-bottom: 1px solid #e5e7eb;
          font-size: 15px;
        }
        th {
          background: #f3f4f6;
          font-weight: 600;
          color: #374151;
        }
        tr:hover td { background: #f9fafb; transition: 0.2s; }

        .delete-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          background: #ef4444;
          color: #fff;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s;
        }
        .delete-btn:hover { background: #dc2626; }

        /* Fetch loader */
        .fetch-loader {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin: 30px 0;
        }
        .fetch-loader .dot {
          width: 12px;
          height: 12px;
          background: #2563eb;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}
