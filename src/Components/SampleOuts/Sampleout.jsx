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
      setMessage(`Reference ${res.data.reference.refNumber} successfully finalized.`);
      setMessageType("success");
      setShowMessage(true);
      fetchReferences();
    } catch (error) {
      setMessage("Finalization failed. Please verify connection.");
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
        backgroundColor: ["#020202", "#fc1f1f"],
        hoverBackgroundColor: ["#000000", "#df6d0f"],
        borderWidth: 0,
        cutout: "80%",
      },
    ],
  };

  return (
    <div className="op-container">
      {/* Top Header Section */}
      <header className="op-header">
        <div className="header-text">
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            Dispatch Terminal
          </motion.h1>
          <p>Reference Finalization & Output Management</p>
        </div>
        <div className="header-stats">
          <div className="stat-pill">
            <span className="label">Total</span>
            <span className="value">{references.length}</span>
          </div>
          <div className="stat-pill success">
            <span className="label">Done</span>
            <span className="value">{completedCount}</span>
          </div>
        </div>
      </header>

      <div className="op-grid">
        {/* Analytics Side-Card */}
        <aside className="analytics-card">
          <h3>Progress Overview</h3>
          <div className="chart-box">
            <Doughnut 
              data={chartData} 
              options={{ 
                plugins: { legend: { display: false } },
                maintainAspectRatio: true
              }} 
            />
            <div className="chart-center">
              <span className="pct">
                {references.length > 0 ? Math.round((completedCount/references.length)*100) : 0}%
              </span>
              <span className="sub">Complete</span>
            </div>
          </div>
          <div className="legend">
            <div className="leg-item"><span className="dot p"></span> Pending ({pendingCount})</div>
            <div className="leg-item"><span className="dot c"></span> Finalized ({completedCount})</div>
          </div>
        </aside>

        {/* Action List */}
        <main className="records-area">
          <div className="list-controls">
            <h3>Active Queue</h3>
            {loading && <div className="pulse-loader">Syncing...</div>}
          </div>

          <div className="scroll-feed">
            {loading && references.length === 0 ? (
              [1, 2, 3].map(i => <div key={i} className="skeleton-row" />)
            ) : (
              references.map((ref, index) => (
                <motion.div
                  key={ref._id}
                  className={`record-card ${ref.sampleOut ? "is-final" : ""}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="record-main">
                    <div className="ref-tag">#{ref.refNumber}</div>
                    <div className="ref-meta">
                      Created {new Date(ref.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="record-action">
                    <label className="finalize-toggle">
                      <input
                        type="checkbox"
                        checked={ref.sampleOut}
                        disabled={ref.sampleOut || loading}
                        onChange={(e) => handleFinalize(ref._id, e.target.checked)}
                      />
                      <div className="toggle-ui">
                        {ref.sampleOut ? "FINALIZED" : "MARK AS OUT"}
                      </div>
                    </label>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Global Notification */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            className={`op-toast ${messageType}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <span className="t-icon">{messageType === "success" ? "✓" : "!"}</span>
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .op-container {
          max-width: 1100px;
          margin: 2rem auto;
          padding: 0 1.5rem;
          font-family: 'Inter', sans-serif;
          color: #1e293b;
        }

        .op-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          background: #fff;
          padding: 1.5rem 2rem;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
        }

        .header-text h1 { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0; }
        .header-text p { font-size: 0.875rem; color: #64748b; margin: 4px 0 0; }
        
        .header-stats { display: flex; gap: 12px; }
        .stat-pill { background: #f1f5f9; padding: 8px 16px; border-radius: 10px; display: flex; flex-direction: column; align-items: flex-end; }
        .stat-pill.success { background: #ecfdf5; color: #059669; }
        .stat-pill .label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; opacity: 0.7; }
        .stat-pill .value { font-size: 1.1rem; font-weight: 800; }

        .op-grid { display: grid; grid-template-columns: 320px 1fr; gap: 2rem; }

        /* Analytics Card */
        .analytics-card {
          background: #fff;
          padding: 2rem;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          height: fit-content;
          position: sticky;
          top: 2rem;
        }
        .analytics-card h3 { font-size: 1rem; margin-bottom: 2rem; font-weight: 700; }
        .chart-box { position: relative; margin-bottom: 2rem; }
        .chart-center {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          pointer-events: none;
        }
        .chart-center .pct { display: block; font-size: 1.5rem; font-weight: 800; color: #0f172a; }
        .chart-center .sub { font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: 600; }

        .legend { display: flex; flex-direction: column; gap: 10px; }
        .leg-item { font-size: 0.85rem; font-weight: 500; color: #64748b; display: flex; align-items: center; gap: 8px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot.p { background: #000000; }
        .dot.c { background: #f42020; }

        /* Records Area */
        .records-area { background: #fff; border-radius: 20px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; min-height: 500px; }
        .list-controls { padding: 1.5rem 2rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .list-controls h3 { font-size: 1rem; font-weight: 700; }
        .pulse-loader { font-size: 0.75rem; color: #6366f1; font-weight: 700; }

        .scroll-feed { padding: 1rem 2rem; }
        .record-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 0;
          border-bottom: 1px solid #f1f5f9;
          transition: 0.2s;
        }
        .record-card.is-final { opacity: 0.6; }
        .ref-tag { font-weight: 700; color: #0f172a; font-size: 1rem; }
        .ref-meta { font-size: 0.75rem; color: #94a3b8; margin-top: 4px; }

        /* Custom Toggle UI */
        .finalize-toggle { cursor: pointer; }
        .finalize-toggle input { display: none; }
        .toggle-ui {
          background: #f1f5f9;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 800;
          color: #64748b;
          transition: 0.2s;
          border: 1px solid transparent;
        }
        .finalize-toggle:hover .toggle-ui { background: #e2e8f0; color: #0f172a; }
        input:checked + .toggle-ui {
          background: #ff0000;
          color: #ffffff;
          border-color: #e42323;
        }

        .op-toast {
          position: fixed; bottom: 2rem; right: 2rem;
          padding: 1rem 1.5rem; border-radius: 12px;
          color: white; font-weight: 600; font-size: 0.9rem;
          display: flex; align-items: center; gap: 12px;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2);
        }
        .op-toast.success { background: #1e293b; }
        .op-toast.error { background: #ef4444; }
        .t-icon { background: rgba(255,255,255,0.2); width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }

        .skeleton-row { height: 60px; background: #f1f5f9; border-radius: 8px; margin-bottom: 1rem; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }

        @media (max-width: 850px) {
          .op-grid { grid-template-columns: 1fr; }
          .analytics-card { position: relative; top: 0; }
        }
      `}</style>
    </div>
  );
}