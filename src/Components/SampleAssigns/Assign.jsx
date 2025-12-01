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
    <>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; font-family: 'Poppins', sans-serif; }
        body { background: #f8fafc; min-height:100vh; color:#1f2937; }

        .container { max-width: 900px; margin: 0 auto; padding: 50px 20px; display:flex; flex-direction:column; gap:30px; }

        /* Page loader */
        .page-loader { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(248,250,252,0.95);
          display:flex; align-items:center; justify-content:center; z-index:2000; }
        .page-loader .spinner { width:50px; height:50px; border:5px solid rgba(59,130,246,0.2); border-top-color:#3b82f6; border-radius:50%; animation:spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Card */
        .card {
          background: #fff;
          border-radius: 16px;
          padding: 35px 25px;
          box-shadow: 0 8px 28px rgba(0,0,0,0.08);
          position: relative;
          overflow: hidden;
          transition: all 0.4s ease;
        }
        .card:hover { transform: translateY(-4px); box-shadow:0 15px 40px rgba(59,130,246,0.15); }

        .header { margin-bottom: 25px; }
        .title { font-size:28px; font-weight:700; color:#1e3a8a; margin-bottom:5px; }
        .subtitle { font-size:14px; color:#475569; }

        /* Form */
        .form-group { margin-bottom:20px; display:flex; flex-direction:column; }
        .label { font-weight:600; color:#1e293b; margin-bottom:6px; display:flex; align-items:center; gap:6px; }
        .note-badge { font-size:11px; font-weight:600; background:#3b82f6; color:#fff; padding:2px 6px; border-radius:10px; }
        .input { padding:12px 16px; border-radius:10px; border:1.5px solid #cbd5e1; outline:none; transition: all 0.3s; font-size:14px; }
        .input:focus { border-color:#3b82f6; box-shadow:0 0 12px rgba(59,130,246,0.2); }

        /* File input */
        .file-input-wrapper { position:relative; }
        .file-input-label {
          display:flex; align-items:center; justify-content:center; padding:18px; border:2px dashed #3b82f6; border-radius:10px;
          background:#f1f5f9; cursor:pointer; font-weight:600; transition:all 0.3s; font-size:13px;
        }
        .file-input-label:hover { background:#e0f2fe; border-color:#2563eb; }
        .file-input { position:absolute; opacity:0; cursor:pointer; }
        .file-name { margin-top:8px; font-size:13px; color:#1e40af; font-weight:600; }

        /* Button */
        .submit-btn {
          width:100%; padding:14px; background: linear-gradient(135deg,#3b82f6,#60a5fa); color:#fff;
          border:none; border-radius:10px; font-weight:700; font-size:15px; cursor:pointer;
          display:flex; align-items:center; justify-content:center; gap:10px; transition:all 0.3s;
        }
        .submit-btn:disabled { opacity:0.7; cursor:not-allowed; }
        .submit-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 25px rgba(59,130,246,0.25); }

        .loader { width:16px; height:16px; border:3px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin 0.8s linear infinite; }

        /* Reference list */
        .section-title { font-size:20px; font-weight:700; color:#1e3a8a; margin-bottom:15px; display:flex; align-items:center; gap:8px; }
        .reference-list { list-style:none; display:flex; flex-direction:column; gap:12px; }

        .reference-item {
          background:#f1f5f9; padding:14px 18px; border-radius:14px; display:flex; justify-content:space-between; align-items:center;
          transition:all 0.3s; position:relative; overflow:hidden; border-left:4px solid #3b82f6;
        }
        .reference-item:hover { transform:translateX(2px); background:#fff; box-shadow:0 8px 22px rgba(59,130,246,0.12); }
        .reference-number { font-weight:600; color:#1e293b; }
        .download-btn { padding:6px 14px; background: linear-gradient(135deg,#3b82f6,#60a5fa); color:#fff; border:none; border-radius:10px; cursor:pointer; transition:all 0.3s; font-size:13px; font-weight:600; }
        .download-btn:hover { transform:scale(1.05); box-shadow:0 5px 20px rgba(59,130,246,0.2); }

        /* Skeleton loader */
        .skeleton-loader { background: linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%); background-size:200% 100%;
          animation: shimmer 1.5s infinite; border-radius:14px; height:60px; }
        @keyframes shimmer { 0%{ background-position:200% 0; } 100%{ background-position:-200% 0; } }

        /* Notifications */
        .notification { position:fixed; top:20px; right:20px; padding:14px 22px; border-radius:14px; font-weight:600; font-size:14px;
          box-shadow:0 10px 30px rgba(0,0,0,0.12); display:flex; align-items:center; gap:10px; border:2px solid; animation:slideIn 0.4s ease-out; z-index:1000;
        }
        @keyframes slideIn { from{opacity:0; transform:translateX(400px);} to{opacity:1; transform:translateX(0);} }
        .notification.success { background: #dbeafe; color:#1e40af; border-color:#3b82f6; }
        .notification.error { background: #fee2e2; color:#991b1b; border-color:#ef4444; }
        .notification.info { background:#e0f2fe; color:#1e40af; border-color:#3b82f6; }
        .notification-icon { width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; }
        .progress-bar { position:absolute; bottom:0; left:0; height:3px; background:currentColor; opacity:0.5; animation: shrink 4s linear; }
        @keyframes shrink { from{ width:100%; } to{ width:0%; } }
      `}</style>

      {pageLoading && (
        <div className="page-loader">
          <div className="spinner"></div>
        </div>
      )}

      <div className="container">
        {notification && (
          <div className={`notification ${notification.type}`}>
            <div className="notification-icon">
              {notification.type === "success" && "✓"}
              {notification.type === "error" && "✕"}
              {notification.type === "info" && "i"}
            </div>
            <span>{notification.message}</span>
            <div className="progress-bar"></div>
          </div>
        )}

        <motion.div className="card" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
          <div className="header">
            <h1 className="title">Assign Samples</h1>
            <p className="subtitle">Submit your reference documents securely and efficiently</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">
                Reference Number <span className="note-badge">Required</span>
              </label>
              <input
                type="text"
                placeholder="Enter reference number"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">
                Attach Document <span className="note-badge">Optional</span>
              </label>
              <div className="file-input-wrapper">
                <label className="file-input-label">
                  <span>Choose file or drag here</span>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="file-input"
                  />
                </label>
              </div>
              {file && <div className="file-name">{file.name}</div>}
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <>
                  <span className="loader"></span>
                  Processing
                </>
              ) : (
                "Submit Reference"
              )}
            </button>
          </form>
        </motion.div>

        <div className="card">
          <h2 className="section-title">
            Submitted Samples & References <span className="note-badge">Assign Samples</span>
          </h2>

          {fetchingReferences ? (
            <>
              <div className="skeleton-loader"></div>
              <div className="skeleton-loader"></div>
              <div className="skeleton-loader"></div>
            </>
          ) : (
            <ul className="reference-list">
              <AnimatePresence>
                {references.length === 0 ? (
                  <motion.li initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                    No references submitted yet
                  </motion.li>
                ) : (
                  references.map((ref) => (
                    <motion.li
                      key={ref._id}
                      className="reference-item"
                      initial={{ opacity:0, y:10 }}
                      animate={{ opacity:1, y:0 }}
                      exit={{ opacity:0 }}
                      transition={{ duration:0.3 }}
                    >
                      <span className="reference-number">{ref.refNumber}</span>
                      {ref.fileData && (
                        <button
                          onClick={() => downloadFile(ref.fileData, ref.fileName)}
                          className="download-btn"
                        >
                          Download
                        </button>
                      )}
                    </motion.li>
                  ))
                )}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
