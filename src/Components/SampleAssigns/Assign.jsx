"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function ReferenceForm() {
  const [refNumber, setRefNumber] = useState("");
  const [file, setFile] = useState(null);
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingReferences, setFetchingReferences] = useState(true);
  const [notification, setNotification] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  const BASE_URL = "https://hay-card-back-end-iota.vercel.app/api/reference";

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchReferences = async () => {
    setFetchingReferences(true);
    try {
      const res = await axios.get(BASE_URL);
      setReferences(res.data);
    } catch (err) {
      console.error(err);
      showNotification("Failed to fetch references", "error");
    } finally {
      setFetchingReferences(false);
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchReferences();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!refNumber) {
      showNotification("Please enter a reference number", "error");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("refNumber", refNumber);
      if (file) formData.append("document", file);

      await axios.post(`${BASE_URL}/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setRefNumber("");
      setFile(null);
      fetchReferences();
      showNotification("Reference submitted successfully", "success");
    } catch (err) {
      console.error(err);
      showNotification("Submission failed. Please try again", "error");
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (fileData, fileName) => {
    const link = document.createElement("a");
    link.href = `data:application/octet-stream;base64,${fileData}`;
    link.download = fileName;
    link.click();
    showNotification("Download started", "info");
  };

  return (
    <div className="app-container">
      {/* Background Decor */}
      <div className="bg-blur-circle-1"></div>
      <div className="bg-blur-circle-2"></div>

      <nav className="top-nav">
        <div className="nav-inner">
          <span className="logo">HAYCARB <span>DOCS</span></span>
          <button className="back-link" onClick={() => window.history.back()}>
            ← Back Home
          </button>
        </div>
      </nav>

      <main className="content-wrapper">
        <header className="page-header">
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            Reference Management
          </motion.h1>
          <p>Secure document handling and sample reference tracking system</p>
        </header>

        {/* Notifications */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              className={`alert-banner ${notification.type}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="main-grid">
          {/* Action Card */}
          <motion.section 
            className="action-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="card-head">
              <h2>New Assignment</h2>
              <span>Fill in details to link reference</span>
            </div>

            <form onSubmit={handleSubmit} className="hub-form">
              <div className="input-box">
                <label>Reference Identity</label>
                <input
                  type="text"
                  placeholder="Enter Number"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                />
              </div>

              <div className="input-box">
                <label>Documentation</label>
                <div className="upload-zone">
                  <input
                    type="file"
                    id="file-input"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                  />
                  <label htmlFor="file-input" className="file-trigger">
                    {file ? "Replace File" : "Choose Document"}
                  </label>
                  {file && <span className="file-name">📎 {file.name}</span>}
                </div>
              </div>

              <button type="submit" className="submit-action" disabled={loading}>
                {loading ? <span className="mini-loader"></span> : "Save Reference"}
              </button>
            </form>
          </motion.section>

          {/* List Card */}
          <motion.section 
            className="list-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="card-head">
              <h2>Recent Submissions</h2>
              <div className="stats-tag">{references.length} Items</div>
            </div>

            <div className="table-container">
              {fetchingReferences ? (
                <div className="loading-state">Syncing database...</div>
              ) : (
                <div className="ref-list">
                  <AnimatePresence>
                    {references.length === 0 ? (
                      <div className="empty-msg">No active references found.</div>
                    ) : (
                      references.map((ref) => (
                        <motion.div key={ref._id} className="ref-row" layout>
                          <div className="ref-info">
                            <span className="ref-id">{ref.refNumber}</span>
                            <span className="ref-status">Verified</span>
                          </div>
                          {ref.fileData && (
                            <button
                              onClick={() => downloadFile(ref.fileData, ref.fileName)}
                              className="btn-download"
                            >
                              Download
                            </button>
                          )}
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </main>

      <style>{`
        :root {
          --primary: #e74e1c;
          --bg: #fdfdfd;
          --text: #1e293b;
          --text-muted: #64748b;
          --glass: rgba(255, 255, 255, 0.8);
          --border: #e2e8f0;
        }

        .app-container { 
          min-height: 100vh; 
          background: #f8fafc; 
          color: var(--text);
          font-family: 'Inter', -apple-system, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* Decorative circles */
        .bg-blur-circle-1 { position: absolute; top: -100px; right: -50px; width: 300px; height: 300px; background: #e0e7ff; filter: blur(100px); z-index: 0; }
        .bg-blur-circle-2 { position: absolute; bottom: -50px; left: -50px; width: 250px; height: 250px; background: #fef3c7; filter: blur(80px); z-index: 0; }

        .top-nav { height: 70px; border-bottom: 1px solid var(--border); background: var(--glass); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 50; }
        .nav-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; height: 100%; padding: 0 2rem; }
        .logo { font-weight: 800; font-size: 1.1rem; letter-spacing: -0.5px; }
        .logo span { color: var(--primary); }
        .back-link { font-size: 0.9rem; font-weight: 600; color: var(--text-muted); cursor: pointer; border: none; background: none; }
        .back-link:hover { color: var(--primary); }

        .content-wrapper { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem; position: relative; z-index: 10; }
        .page-header { margin-bottom: 2.5rem; }
        .page-header h1 { font-size: 2.2rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; }
        .page-header p { color: var(--text-muted); }

        .alert-banner { padding: 1rem; border-radius: 12px; margin-bottom: 2rem; font-weight: 600; text-align: center; }
        .alert-banner.success { background: #ecfdf5; color: #065f46; border: 1px solid #10b981; }
        .alert-banner.error { background: #fef2f2; color: #991b1b; border: 1px solid #ef4444; }

        .main-grid { display: grid; grid-template-columns: 400px 1fr; gap: 2.5rem; }

        .action-card, .list-card { 
          background: white; 
          border-radius: 20px; 
          padding: 2rem; 
          border: 1px solid var(--border); 
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.04);
        }

        .card-head { margin-bottom: 2rem; }
        .card-head h2 { font-size: 1.25rem; font-weight: 700; color: #0f172a; }
        .card-head span { font-size: 0.85rem; color: var(--text-muted); }

        .hub-form .input-box { margin-bottom: 1.5rem; }
        .hub-form label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; letter-spacing: 0.5px; }
        .hub-form input[type="text"] { width: 100%; padding: 14px; border-radius: 12px; border: 1.5px solid var(--border); font-size: 1rem; transition: 0.2s; }
        .hub-form input[type="text"]:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }

        .upload-zone { background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 1.5rem; text-align: center; }
        .file-trigger { color: var(--primary); font-weight: 700; cursor: pointer; font-size: 0.9rem; }
        .file-name { display: block; margin-top: 10px; font-size: 0.8rem; font-weight: 600; color: #10b981; }
        .hidden { display: none; }

        .submit-action { 
          width: 100%; 
          padding: 16px; 
          background: var(--primary); 
          color: white; 
          border: none; 
          border-radius: 12px; 
          font-weight: 700; 
          cursor: pointer; 
          transition: transform 0.2s, background 0.2s;
        }
        .submit-action:hover { background: #4338ca; transform: translateY(-2px); }
        .submit-action:disabled { opacity: 0.6; cursor: not-allowed; }

        .list-card { height: fit-content; max-height: 600px; display: flex; flex-direction: column; }
        .stats-tag { background: #e0e7ff; color: var(--primary); padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
        .table-container { flex: 1; overflow-y: auto; }

        .ref-row { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          padding: 1.25rem 0; 
          border-bottom: 1px solid #f1f5f9; 
        }
        .ref-id { display: block; font-weight: 700; font-size: 1rem; color: #334155; }
        .ref-status { font-size: 0.75rem; color: #10b981; font-weight: 600; text-transform: uppercase; }
        
        .btn-download { 
          padding: 8px 16px; 
          border-radius: 8px; 
          border: 1px solid var(--border); 
          background: white; 
          font-weight: 600; 
          font-size: 0.85rem; 
          cursor: pointer; 
          transition: 0.2s;
        }
        .btn-download:hover { background: #f1f5f9; border-color: #cbd5e1; }

        .mini-loader { width: 18px; height: 18px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}