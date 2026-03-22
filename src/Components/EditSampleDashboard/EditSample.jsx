import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiCheckCircle,
  FiGrid,
  FiLogOut,
  FiSearch,
  FiLayers,
  FiLoader,
  FiDatabase,
  FiPackage
} from "react-icons/fi";

const API_BASE = "https://hay-card-back-end-iota.vercel.app/api/samples";

export default function LabAdminDashboard() {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [receivingGpId, setReceivingGpId] = useState(null); // State for receiving logic

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSamples();
    const interval = setInterval(fetchSamples, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSamples = async () => {
    try {
      const res = await axios.get(API_BASE);
      setSamples(res.data.data);
    } catch (err) {
      toast.error("Failed to sync with server");
    } finally {
      setLoading(false);
    }
  };

  /* ================= MARK AS RECEIVED ================= */
/* ================= MARK AS RECEIVED ================= */
  const markAsReceived = async (gatePassId) => {
    if (!window.confirm("Confirm sample receipt? This cannot be undone.")) return;

    setReceivingGpId(gatePassId);
    try {
      // Backend expects PUT /api/samples/:id/received
      await axios.put(
        `${API_BASE}/${gatePassId}/received`,
        {}, // Sending empty body because backend now sets isReceived to true automatically
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state so it doesn't wait for the 30s interval
      setSamples(prev => 
        prev.map(gp => gp._id === gatePassId ? { ...gp, isReceived: true } : gp)
      );
      toast.success("Gate pass marked as Received");
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setReceivingGpId(null);
    }
  };

  const handleInlineChange = (gatePassId, sampleId, key, value) => {
    setSamples(prev =>
      prev.map(gp => gp._id === gatePassId ? {
        ...gp,
        samples: gp.samples.map(s => s.sampleId === sampleId ? {
          ...s,
          results: { ...s.results, [key]: value }
        } : s)
      } : gp)
    );
  };

  const saveInlineSample = async (gatePassId, sample) => {
    setSavingId(sample.sampleId);
    try {
      await axios.put(
        `${API_BASE}/${gatePassId}/sample/${sample.sampleId}`,
        { results: sample.results, analysedBy: "Lab Admin" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Sample ${sample.sampleId} updated`);
    } catch {
      toast.error("Save failed");
    } finally {
      setSavingId(null);
    }
  };

  const filteredSamples = useMemo(() => {
    return samples.filter(gp =>
      gp.samples?.some(s =>
        s.sampleId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gp.sampleRefNo?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [samples, searchTerm]);

  return (
    <div style={styles.dashboardContainer}>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <FiDatabase style={{ color: "#60a5fa" }} />
          <span>HAYCARB <small style={{fontWeight: 300, fontSize: '0.6em'}}>LAB</small></span>
        </div>
        <nav style={styles.nav}>
          <div style={{ ...styles.navItem, background: "rgba(59, 130, 246, 0.1)", color: "#60a5fa" }}>
            <FiGrid size={18} /> Dashboard
          </div>
          <div style={styles.navItem}>
            <FiLayers size={18} /> Lab Reports
          </div>
        </nav>
        <button style={styles.logoutBtn} onClick={() => { localStorage.clear(); window.location.href = "/"; }}>
          <FiLogOut /> Logout
        </button>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h2 style={styles.title}>Laboratory Analysis</h2>
            <p style={styles.subtitle}>Gate Pass Receipt & Sample Testing</p>
          </div>
          <div style={styles.searchContainer}>
            <FiSearch color="#94a3b8" />
            <input
              style={styles.searchInput}
              placeholder="Search Sample ID..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div style={styles.loaderArea}><FiLoader className="spin" /> Syncing Laboratory Database...</div>
        ) : (
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Sample Details</th>
                  <th style={styles.th}>Route</th>
                  <th style={styles.th}>Analysis Parameters</th>
                  <th style={styles.th}>Approval</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSamples.map(gp => (
                  <React.Fragment key={gp._id}>
                    {/* GATE PASS HEADER WITH RECEIVED CHECKBOX */}
                    <tr style={styles.groupHeader}>
                      <td colSpan="5" style={styles.groupTd}>
                        <div style={styles.gpHeaderContent}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={styles.gpBadge}>GP</span> 
                            <span style={{fontWeight: 700}}>{gp.sampleRefNo}</span>
                            <span style={{color: '#94a3b8'}}>|</span>
                            <span>{gp.sampleRoute}</span>
                          </div>

                          <div style={styles.receiveControl}>
                            <span style={{fontSize: '11px', fontWeight: 600, color: gp.isReceived ? '#10b981' : '#64748b'}}>
                              {gp.isReceived ? "RECEIVED AT LAB" : "MARK AS RECEIVED"}
                            </span>
                            <input 
                              type="checkbox" 
                              checked={gp.isReceived || false}
                              disabled={gp.isReceived || receivingGpId === gp._id}
                              onChange={() => markAsReceived(gp._id)}
                              style={styles.checkbox}
                            />
                            {receivingGpId === gp._id && <FiLoader className="spin" size={14} />}
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* CHILD SAMPLES */}
                    {gp.samples.map(s => (
                      <tr key={s.sampleId} style={{...styles.tr, opacity: gp.isReceived ? 1 : 0.6}}>
                        <td style={styles.td}>
                          <div style={{ fontWeight: 600 }}>{s.sampleId}</div>
                        </td>
                        <td style={styles.td}>{gp.sampleRoute}</td>
                        <td style={styles.td}>
                          <div style={styles.paramsGrid}>
                            {Object.entries(s.results || {}).map(([k, v]) => (
                              <div key={k} style={styles.inputGroup}>
                                <label style={styles.inputLabel}>{k}</label>
                                <input
                                  value={v}
                                  disabled={!gp.isReceived} // Only editable if received
                                  onChange={(e) => handleInlineChange(gp._id, s.sampleId, k, e.target.value)}
                                  style={styles.inlineInput}
                                />
                              </div>
                            ))}
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span style={gp.isFinalized ? styles.badgeSuccess : styles.badgePending}>
                            {gp.isFinalized ? "Finalized" : "Pending"}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <button
                            onClick={() => saveInlineSample(gp._id, s)}
                            style={!gp.isReceived ? styles.btnDisabled : (savingId === s.sampleId ? styles.btnLoading : styles.saveBtn)}
                            disabled={savingId === s.sampleId || !gp.isReceived}
                          >
                            {savingId === s.sampleId ? "..." : <FiCheckCircle size={18}/>}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  dashboardContainer: { display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif", color: "#334155" },
  sidebar: { width: 260, background: "#0f172a", color: "white", display: "flex", flexDirection: "column", padding: "32px 20px" },
  logo: { fontSize: 22, fontWeight: 800, marginBottom: 48, display: "flex", alignItems: "center", gap: 12 },
  nav: { flex: 1 },
  navItem: { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, cursor: "pointer", marginBottom: 8, fontWeight: 500 },
  main: { flex: 1, padding: "40px", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 700, margin: 0 },
  subtitle: { color: "#64748b" },
  searchContainer: { background: "white", padding: "10px 16px", borderRadius: 12, display: "flex", alignItems: "center", gap: 12, border: "1px solid #e2e8f0", width: 300 },
  searchInput: { border: "none", outline: "none", fontSize: 14, width: "100%" },
  tableCard: { background: "white", borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "16px 24px", textAlign: "left", fontSize: "11px", textTransform: "uppercase", color: "#94a3b8", borderBottom: "1px solid #f1f5f9" },
  groupHeader: { background: "#f8fafc" },
  groupTd: { padding: "12px 24px", borderBottom: "2px solid #e2e8f0" },
  gpHeaderContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  receiveControl: { display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' },
  checkbox: { width: '18px', height: '18px', cursor: 'pointer' },
  gpBadge: { background: "#3b82f6", color: "white", padding: "2px 6px", borderRadius: 4, fontSize: 10 },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "20px 24px", fontSize: "14px" },
  paramsGrid: { display: "flex", flexWrap: "wrap", gap: 12 },
  inputGroup: { display: "flex", flexDirection: "column", gap: 4 },
  inputLabel: { fontSize: 10, fontWeight: 700, color: "#94a3b8" },
  inlineInput: { padding: "6px 10px", border: "1px solid #e2e8f0", borderRadius: 6, width: "80px", fontSize: 13 },
  badgeSuccess: { background: "#dcfce7", color: "#15803d", padding: "6px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 },
  badgePending: { background: "#fef3c7", color: "#b45309", padding: "6px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 },
  saveBtn: { background: "#3b82f6", color: "white", border: "none", padding: "8px", borderRadius: "8px", cursor: "pointer" },
  btnDisabled: { background: "#e2e8f0", color: "#94a3b8", border: "none", padding: "8px", borderRadius: "8px", cursor: "not-allowed" },
  btnLoading: { background: "#94a3b8", color: "white", border: "none", padding: "8px", borderRadius: "8px" },
  logoutBtn: { background: "rgba(239, 68, 68, 0.1)", color: "#f87171", border: "none", padding: "12px", borderRadius: "10px", cursor: "pointer", marginTop: "auto" },
  loaderArea: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginTop: 100, color: "#64748b" }
};