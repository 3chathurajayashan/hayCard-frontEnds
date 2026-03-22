import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FiCheckCircle, FiGrid, FiLogOut, FiSearch, FiLayers,
  FiLoader, FiDatabase, FiActivity, FiClock, FiPackage,
  FiChevronRight, FiRefreshCw, FiDownload, FiLock,
} from "react-icons/fi";

const API_BASE = "https://hay-card-back-end-iota.vercel.app/api/samples";

/* ─── Global CSS ─── */
const keyframes = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
* { box-sizing:border-box; margin:0; padding:0; }

@keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
@keyframes spin    { to{transform:rotate(360deg)} }
@keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.45} }

.spin  { animation:spin  0.9s linear infinite; }
.pulse { animation:pulse 1.5s ease-in-out infinite; }

.card-row { animation:fadeUp 0.38s ease both; }
.card-row:nth-child(1){animation-delay:.04s}
.card-row:nth-child(2){animation-delay:.08s}
.card-row:nth-child(3){animation-delay:.12s}
.card-row:nth-child(4){animation-delay:.16s}
.card-row:nth-child(5){animation-delay:.20s}

.stat-card { animation:fadeUp 0.38s ease both; }
.stat-card:nth-child(1){animation-delay:.00s}
.stat-card:nth-child(2){animation-delay:.06s}
.stat-card:nth-child(3){animation-delay:.12s}
.stat-card:nth-child(4){animation-delay:.18s}

.nav-item:hover                    { background:rgba(37,99,235,.07)!important; color:#2563eb!important; }
.save-btn:hover:not(:disabled)     { background:#1d4ed8!important; transform:scale(1.05); }
.dl-btn:hover                      { opacity:.88!important; }
.logout-btn:hover                  { background:rgba(239,68,68,.12)!important; }
.row-hover:hover                   { background:#f8fafc!important; }
.refresh-btn:hover                 { background:#eff6ff!important; color:#2563eb!important; }
.finalize-btn:hover:not(:disabled) { background:#1e293b!important; }
.gp-checkbox { cursor:pointer; accent-color:#2563eb; width:17px; height:17px; }
.gp-checkbox:disabled { cursor:not-allowed; }

input[type="text"]:focus,
input[type="search"]:focus,
.inline-input:focus {
  outline:none;
  border-color:#2563eb!important;
  box-shadow:0 0 0 3px rgba(37,99,235,.1);
}
`;

/* ─── PDF generator ─── */
function downloadGatePassPDF(gp) {
  const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
  const W = doc.internal.pageSize.getWidth();
  const margin = 18;

  // Header bar
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, W, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("HAYCARB LABORATORY", margin, 12);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text("Laboratory Analysis Report", margin, 19);
  doc.setFontSize(7.5);
  doc.text(`Generated: ${new Date().toLocaleString()}`, W - margin, 19, { align:"right" });

  // Status pill top-right
  const statusLabel = gp.isFinalized ? "FINALIZED" : "PENDING";
  const pillColor   = gp.isFinalized ? [16,185,129] : [217,119,6];
  doc.setFillColor(...pillColor);
  doc.roundedRect(W - margin - 28, 3, 28, 8, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text(statusLabel, W - margin - 14, 8.2, { align:"center" });

  // Gate pass meta
  let y = 40;
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`Gate Pass: GP-${gp.sampleRefNo}`, margin, y);

  y += 7;
  const metaRows = [
    ["Sample Route", gp.sampleRoute  || "—"],
    ["Date / Time",  `${gp.sampleInDate || "—"} ${gp.sampleInTime || ""}`.trim()],
    ["Delivered To", gp.to            || "—"],
    ["Received",     gp.received      ? "Yes" : "No"],
    ["Remarks",      gp.remarks       || "—"],
  ];
  metaRows.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`${label}:`, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(String(value), margin + 34, y);
    y += 6;
  });

  // Divider
  y += 4;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin, y, W - margin, y);
  y += 8;

  // Section heading
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(37, 99, 235);
  doc.text("SAMPLE TEST RESULTS", margin, y);
  y += 6;

  // One block per sample
  gp.samples?.forEach((s, idx) => {
    const resultEntries = Object.entries(s.results || {});

    // Sample sub-header
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, W - margin * 2, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`Sample ${idx + 1}:  ${s.sampleId}`, margin + 3, y + 5.5);

    if (s.testMethod) {
      doc.setFillColor(219, 234, 254);
      doc.roundedRect(W - margin - 46, y + 1, 46, 6, 1.5, 1.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(29, 78, 216);
      doc.text(`Method: ${s.testMethod}`, W - margin - 23, y + 5, { align:"center" });
    }
    y += 11;

    if (resultEntries.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("No results recorded.", margin + 3, y + 4);
      y += 10;
    } else {
      autoTable(doc, {
        startY: y,
        margin: { left: margin, right: margin },
        head: [["Parameter", "Result / Value"]],
        body: resultEntries.map(([k, v]) => [k, v ?? "—"]),
        styles: {
          font:"helvetica", fontSize:8.5, cellPadding:3.5,
          textColor:[15,23,42], lineColor:[226,232,240], lineWidth:0.3,
        },
        headStyles: {
          fillColor:[37,99,235], textColor:255, fontStyle:"bold", fontSize:8,
        },
        alternateRowStyles: { fillColor:[248,250,252] },
        tableLineColor:[226,232,240], tableLineWidth:0.3,
      });
      y = doc.lastAutoTable.finalY + 8;
    }
  });

  // Footer
  const pageH = doc.internal.pageSize.getHeight();
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, pageH - 14, W - margin, pageH - 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("HAYCARB Laboratory — Confidential Document", margin, pageH - 8);
  doc.text(`GP-${gp.sampleRefNo}`, W - margin, pageH - 8, { align:"right" });

  doc.save(`GP-${gp.sampleRefNo}_LabReport.pdf`);
}

/* ─── Root component ─── */
export default function LabAdminDashboard() {
  const [samples, setSamples]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [searchTerm, setSearchTerm]         = useState("");
  const [savingId, setSavingId]             = useState(null);
  const [receivingGpId, setReceivingGpId]   = useState(null);
  const [finalizingId, setFinalizingId]     = useState(null);
  const [lastSync, setLastSync]             = useState(null);
  const [syncing, setSyncing]               = useState(false);
  const [activeNav, setActiveNav]           = useState("dashboard");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSamples();
    const interval = setInterval(fetchSamples, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSamples = async (manual = false) => {
    if (manual) setSyncing(true);
    try {
      const res = await axios.get(API_BASE);
      setSamples(res.data.data);
      setLastSync(new Date());
    } catch {
      toast.error("Failed to sync with server");
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  const markAsReceived = async (gatePassId) => {
    if (!window.confirm("Confirm sample receipt? This cannot be undone.")) return;
    setReceivingGpId(gatePassId);
    try {
      await axios.put(`${API_BASE}/${gatePassId}/received`, {}, {
        headers: { Authorization:`Bearer ${token}` },
      });
      setSamples(prev => prev.map(gp =>
        gp._id === gatePassId ? { ...gp, received:true } : gp
      ));
      toast.success("Gate pass marked as Received");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setReceivingGpId(null);
    }
  };

  const finalizeGatePass = async (gatePassId) => {
    if (!window.confirm(
      "Finalize this gate pass?\n\nAll results will be permanently locked and cannot be edited."
    )) return;
    setFinalizingId(gatePassId);
    try {
      await axios.put(`${API_BASE}/${gatePassId}/finalize`, {}, {
        headers: { Authorization:`Bearer ${token}` },
      });
      setSamples(prev => prev.map(gp =>
        gp._id === gatePassId ? { ...gp, isFinalized:true } : gp
      ));
      toast.success("Gate pass finalized — results are now locked");
    } catch {
      toast.error("Finalize failed");
    } finally {
      setFinalizingId(null);
    }
  };

  const handleInlineChange = (gatePassId, sampleId, key, value) => {
    setSamples(prev => prev.map(gp =>
      gp._id === gatePassId ? {
        ...gp,
        samples: gp.samples.map(s =>
          s.sampleId === sampleId
            ? { ...s, results:{ ...s.results, [key]:value } }
            : s
        ),
      } : gp
    ));
  };

  const saveInlineSample = async (gatePassId, sample) => {
    setSavingId(sample.sampleId);
    try {
      await axios.put(
        `${API_BASE}/${gatePassId}/sample/${sample.sampleId}`,
        { results:sample.results, analysedBy:"Lab Admin" },
        { headers: { Authorization:`Bearer ${token}` } }
      );
      toast.success(`Sample ${sample.sampleId} saved`);
    } catch {
      toast.error("Save failed");
    } finally {
      setSavingId(null);
    }
  };

  const filteredSamples = useMemo(() => {
    if (!searchTerm) return samples;
    return samples.filter(gp =>
      gp.samples?.some(s =>
        s.sampleId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gp.sampleRefNo?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [samples, searchTerm]);

  const stats = useMemo(() => {
    const total     = samples.length;
    const received  = samples.filter(g => g.received).length;
    const finalized = samples.filter(g => g.isFinalized).length;
    const pending   = total - received;
    return { total, received, pending, finalized };
  }, [samples]);

  const formatTime = (d) =>
    d ? d.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", second:"2-digit" }) : "—";

  return (
    <>
      <style>{keyframes}</style>
      <ToastContainer position="top-right" autoClose={2200} hideProgressBar theme="light"/>

      <div style={S.root}>
        {/* SIDEBAR */}
        <aside style={S.sidebar}>
          <div style={S.brand}>
            <div style={S.brandIcon}><FiDatabase size={16}/></div>
            <div>
              <div style={S.brandName}>HAYCARB</div>
              <div style={S.brandSub}>Laboratory</div>
            </div>
          </div>

          <div style={S.sideSection}>MENU</div>
          <nav>
            {[
              { id:"dashboard", icon:<FiGrid size={16}/>,   label:"Dashboard" },
              { id:"reports",   icon:<FiLayers size={16}/>, label:"Lab Reports" },
            ].map(n => (
              <div key={n.id} className="nav-item"
                onClick={() => setActiveNav(n.id)}
                style={{ ...S.navItem, ...(activeNav===n.id ? S.navItemActive : {}) }}
              >
                {n.icon}
                <span>{n.label}</span>
                {activeNav===n.id && <FiChevronRight size={13} style={{ marginLeft:"auto", opacity:.5 }}/>}
              </div>
            ))}
          </nav>

          <div style={S.sideSection}>SYNC</div>
          <div style={S.syncBox}>
            <FiClock size={12} style={{ flexShrink:0, color:"#94a3b8" }}/>
            <span style={{ fontSize:11, color:"#64748b", lineHeight:1.4 }}>
              Last sync<br/>
              <strong style={{ color:"#1e293b" }}>{formatTime(lastSync)}</strong>
            </span>
          </div>

          <button className="logout-btn" style={S.logoutBtn}
            onClick={() => { localStorage.clear(); window.location.href="/"; }}>
            <FiLogOut size={15}/> Sign Out
          </button>
        </aside>

        {/* MAIN */}
        <main style={S.main}>
          <div style={S.header}>
            <div>
              <h1 style={S.pageTitle}>Laboratory Analysis</h1>
              <p style={S.pageSubtitle}>Gate pass receipt, sample testing &amp; reporting</p>
            </div>
            <div style={S.headerActions}>
              <div style={S.searchWrap}>
                <FiSearch size={14} color="#94a3b8"/>
                <input style={S.searchInput} placeholder="Search sample ID or ref…"
                  onChange={e => setSearchTerm(e.target.value)}/>
              </div>
              <button className="refresh-btn" style={S.refreshBtn}
                onClick={() => fetchSamples(true)} title="Sync now">
                <FiRefreshCw size={14} className={syncing ? "spin" : ""}/>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={S.statsGrid}>
            {[
              { label:"Total Gate Passes", value:stats.total,     icon:<FiPackage size={18}/>,     color:"#2563eb", bg:"#eff6ff" },
              { label:"Received",          value:stats.received,  icon:<FiCheckCircle size={18}/>, color:"#059669", bg:"#ecfdf5" },
              { label:"Pending Receipt",   value:stats.pending,   icon:<FiClock size={18}/>,       color:"#d97706", bg:"#fffbeb" },
              { label:"Finalized",         value:stats.finalized, icon:<FiActivity size={18}/>,    color:"#7c3aed", bg:"#f5f3ff" },
            ].map((s,i) => (
              <div key={i} className="stat-card" style={S.statCard}>
                <div style={{ ...S.statIcon, background:s.bg, color:s.color }}>{s.icon}</div>
                <div>
                  <div style={S.statValue}>{loading ? "—" : s.value}</div>
                  <div style={S.statLabel}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Cards */}
          {loading ? (
            <div style={S.loader}>
              <div className="spin" style={{ display:"flex" }}><FiLoader size={22} color="#2563eb"/></div>
              <span style={{ color:"#64748b", fontSize:14 }}>Syncing laboratory database…</span>
            </div>
          ) : filteredSamples.length === 0 ? (
            <div style={S.loader}>
              <FiDatabase size={28} color="#cbd5e1"/>
              <span style={{ color:"#94a3b8", fontSize:14 }}>No gate passes found</span>
            </div>
          ) : (
            <div style={S.cardList}>
              {filteredSamples.map((gp, idx) => (
                <div key={gp._id} className="card-row" style={{ animationDelay:`${idx*0.05}s` }}>
                  <GatePassCard
                    gp={gp}
                    receivingGpId={receivingGpId}
                    finalizingId={finalizingId}
                    savingId={savingId}
                    onMarkReceived={markAsReceived}
                    onFinalize={finalizeGatePass}
                    onInlineChange={handleInlineChange}
                    onSave={saveInlineSample}
                    onDownloadPDF={downloadGatePassPDF}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

/* ─── Gate Pass Card ─── */
function GatePassCard({ gp, receivingGpId, finalizingId, savingId,
  onMarkReceived, onFinalize, onInlineChange, onSave, onDownloadPDF }) {

  const isReceiving  = receivingGpId === gp._id;
  const isFinalizing = finalizingId  === gp._id;
  const finalized    = gp.isFinalized;
  const received     = gp.received;

  return (
    <div style={{
      ...S.gpCard,
      borderLeft:`3px solid ${finalized ? "#2563eb" : received ? "#10b981" : "#e2e8f0"}`,
    }}>
      {/* Header */}
      <div style={S.gpHead}>
        <div style={S.gpHeadLeft}>
          <span style={{
            ...S.refBadge,
            background: finalized ? "#eff6ff" : received ? "#ecfdf5" : "#f1f5f9",
            color:      finalized ? "#2563eb" : received ? "#059669" : "#475569",
            border:`1px solid ${finalized ? "#bfdbfe" : received ? "#a7f3d0" : "#e2e8f0"}`,
          }}>
            {finalized ? "🔒 " : received ? "✓ " : ""}GP-{gp.sampleRefNo}
          </span>
          <div style={S.gpMeta}>
            <span style={S.gpRoute}>{gp.sampleRoute}</span>
            <span style={S.gpDot}>·</span>
            <span style={S.gpTime}>{gp.sampleInDate} {gp.sampleInTime}</span>
            {gp.to      && <><span style={S.gpDot}>·</span><span style={S.gpTime}>To: {gp.to}</span></>}
            {gp.remarks && <><span style={S.gpDot}>·</span><span style={S.gpTime}>{gp.remarks}</span></>}
          </div>
        </div>

        <div style={S.headActions}>
          {/* Mark received */}
          <div style={{
            ...S.receiveToggle,
            background:  received ? "#f0fdf4" : "#f8fafc",
            borderColor: received ? "#bbf7d0" : "#e2e8f0",
          }}>
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:.5,
              color: received ? "#059669" : "#94a3b8" }}>
              {received ? "RECEIVED" : "MARK RECEIVED"}
            </span>
            {isReceiving
              ? <FiLoader size={15} className="spin" color="#2563eb"/>
              : <input type="checkbox" className="gp-checkbox"
                  checked={received || false} disabled={received}
                  onChange={() => onMarkReceived(gp._id)}/>
            }
          </div>

          {/* Finalize — only shown after received */}
          {received && (
            <button
              className={!finalized && !isFinalizing ? "finalize-btn" : ""}
              disabled={finalized || isFinalizing}
              onClick={() => onFinalize(gp._id)}
              title={finalized ? "Already finalized" : "Lock all results permanently"}
              style={finalized ? S.finalizedBadge : S.finalizeBtn}
            >
              {isFinalizing
                ? <FiLoader size={12} className="spin"/>
                : <FiLock size={12}/>
              }
              <span>{finalized ? "Finalized" : isFinalizing ? "Finalizing…" : "Finalize"}</span>
            </button>
          )}

          {/* Download PDF */}
          <button className="dl-btn" onClick={() => onDownloadPDF(gp)}
            title="Download lab report as PDF"
            style={{ ...S.dlBtn, background: finalized ? "#2563eb" : "#0f172a" }}>
            <FiDownload size={13}/>
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Finalized banner */}
      {finalized && (
        <div style={S.finalizedBanner}>
          <FiLock size={12}/>
          This gate pass has been finalized. All results are locked and read-only.
        </div>
      )}

      {/* Sample table */}
      <div style={{ overflowX:"auto" }}>
        <table style={S.table}>
          <thead>
            <tr>
              {["Sample ID","Parameters","Status","Test Method","Save"].map(h => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gp.samples?.map(s => {
              const editable = received && !finalized;
              const saving   = savingId === s.sampleId;
              return (
                <tr key={s.sampleId} className="row-hover" style={S.tr}>
                  <td style={{ ...S.td, ...S.monoCell }}>{s.sampleId}</td>

                  <td style={S.td}>
                    <div style={S.paramsRow}>
                      {Object.entries(s.results || {}).map(([key, val]) => (
                        <div key={key} style={S.paramCell}>
                          <label style={S.paramLabel}>{key}</label>
                          <input
                            className={editable ? "inline-input" : ""}
                            value={val}
                            disabled={!editable}
                            onChange={e => onInlineChange(gp._id, s.sampleId, key, e.target.value)}
                            style={editable ? S.inputActive : S.inputDisabled}
                          />
                        </div>
                      ))}
                      {finalized && (
                        <div style={S.lockedChip}><FiLock size={9}/> Locked</div>
                      )}
                    </div>
                  </td>

                  <td style={S.td}>
                    <span style={finalized ? S.badgeBlue : S.badgeAmber}>
                      {finalized ? "Finalized" : "Pending"}
                    </span>
                  </td>

                  <td style={S.td}>
                    <span style={s.testMethod ? S.badgeGreen : S.badgeGray}>
                      {s.testMethod || "No Method"}
                    </span>
                  </td>

                  <td style={S.td}>
                    <button
                      className={editable && !saving ? "save-btn" : ""}
                      onClick={() => onSave(gp._id, s)}
                      disabled={saving || !editable}
                      title={!received ? "Mark received first" : finalized ? "Results locked" : "Save results"}
                      style={saving ? S.btnSaving : editable ? S.btnSave : S.btnOff}
                    >
                      {saving
                        ? <FiLoader size={14} className="spin"/>
                        : finalized
                          ? <FiLock size={13}/>
                          : <FiCheckCircle size={14}/>
                      }
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Styles ─── */
const S = {
  root:{ display:"flex", minHeight:"100vh", background:"#f8fafc", fontFamily:"'DM Sans',sans-serif", color:"#0f172a" },

  sidebar:{ width:220, background:"#fff", borderRight:"1px solid #e2e8f0", display:"flex", flexDirection:"column", padding:"28px 16px", position:"fixed", height:"100vh", zIndex:10 },
  brand:    { display:"flex", alignItems:"center", gap:12, marginBottom:36 },
  brandIcon:{ width:34, height:34, borderRadius:10, background:"#2563eb", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" },
  brandName:{ fontSize:14, fontWeight:700, letterSpacing:.5, color:"#0f172a" },
  brandSub: { fontSize:11, color:"#94a3b8" },
  sideSection:{ fontSize:9, fontWeight:700, letterSpacing:1.2, color:"#cbd5e1", margin:"16px 0 8px 8px" },
  navItem:{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:8, cursor:"pointer", fontSize:13.5, fontWeight:500, color:"#64748b", marginBottom:2, transition:"all .15s" },
  navItemActive:{ background:"#eff6ff", color:"#2563eb", fontWeight:600 },
  syncBox:{ display:"flex", alignItems:"flex-start", gap:8, background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:8, padding:"10px 12px" },
  logoutBtn:{ display:"flex", alignItems:"center", gap:8, padding:"10px 12px", borderRadius:8, border:"none", cursor:"pointer", background:"transparent", color:"#ef4444", fontSize:13, fontWeight:500, marginTop:"auto", transition:"all .15s" },

  main:{ flex:1, marginLeft:220, padding:"36px 40px", minHeight:"100vh" },
  header:{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 },
  pageTitle:{ fontSize:22, fontWeight:700, color:"#0f172a", letterSpacing:-.3 },
  pageSubtitle:{ fontSize:13, color:"#94a3b8", marginTop:3 },
  headerActions:{ display:"flex", alignItems:"center", gap:8 },
  searchWrap:{ display:"flex", alignItems:"center", gap:8, background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"8px 14px", boxShadow:"0 1px 2px rgba(0,0,0,.04)", width:270 },
  searchInput:{ border:"none", outline:"none", fontSize:13, width:"100%", background:"transparent", color:"#0f172a" },
  refreshBtn:{ width:36, height:36, border:"1px solid #e2e8f0", borderRadius:8, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#64748b", transition:"all .15s" },

  statsGrid:{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 },
  statCard:{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"18px 20px", display:"flex", alignItems:"center", gap:14, boxShadow:"0 1px 3px rgba(0,0,0,.04)" },
  statIcon:{ width:40, height:40, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  statValue:{ fontSize:22, fontWeight:700, color:"#0f172a", lineHeight:1 },
  statLabel:{ fontSize:12, color:"#94a3b8", marginTop:3, fontWeight:500 },

  loader:{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, minHeight:200 },
  cardList:{ display:"flex", flexDirection:"column", gap:16 },

  gpCard:{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", boxShadow:"0 1px 3px rgba(0,0,0,.04)", overflow:"hidden" },
  gpHead:{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 20px", borderBottom:"1px solid #f1f5f9", flexWrap:"wrap", gap:10 },
  gpHeadLeft:{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" },
  refBadge:{ fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:6, fontFamily:"'DM Mono',monospace", letterSpacing:.3, whiteSpace:"nowrap" },
  gpMeta:{ display:"flex", alignItems:"center", flexWrap:"wrap" },
  gpRoute:{ fontSize:13, fontWeight:600, color:"#1e293b" },
  gpTime: { fontSize:12, color:"#94a3b8" },
  gpDot:  { fontSize:12, color:"#cbd5e1", margin:"0 6px" },

  headActions:{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" },
  receiveToggle:{ display:"flex", alignItems:"center", gap:8, padding:"6px 12px", borderRadius:8, border:"1px solid", transition:"all .15s" },

  finalizeBtn:{ display:"flex", alignItems:"center", gap:5, padding:"6px 13px", borderRadius:8, border:"none", background:"#0f172a", color:"#fff", fontSize:11, fontWeight:600, cursor:"pointer", transition:"all .15s" },
  finalizedBadge:{ display:"flex", alignItems:"center", gap:5, padding:"6px 13px", borderRadius:8, border:"1px solid #bfdbfe", background:"#eff6ff", color:"#2563eb", fontSize:11, fontWeight:600, cursor:"default" },

  dlBtn:{ display:"flex", alignItems:"center", gap:5, padding:"6px 13px", borderRadius:8, border:"none", color:"#fff", fontSize:11, fontWeight:600, cursor:"pointer", transition:"opacity .15s" },

  finalizedBanner:{ display:"flex", alignItems:"center", gap:7, padding:"8px 20px", background:"#eff6ff", borderBottom:"1px solid #bfdbfe", color:"#1d4ed8", fontSize:12, fontWeight:500 },

  table:{ width:"100%", borderCollapse:"collapse" },
  th:{ padding:"9px 20px", textAlign:"left", fontSize:10, fontWeight:700, letterSpacing:.8, color:"#94a3b8", textTransform:"uppercase", borderBottom:"1px solid #f1f5f9", whiteSpace:"nowrap" },
  tr:{ borderBottom:"1px solid #f8fafc", transition:"background .1s" },
  td:{ padding:"11px 20px", fontSize:13, verticalAlign:"middle" },
  monoCell:{ fontFamily:"'DM Mono',monospace", fontSize:12, fontWeight:500, color:"#1e293b" },

  paramsRow:{ display:"flex", flexWrap:"wrap", gap:8, alignItems:"center" },
  paramCell:{ display:"flex", flexDirection:"column", gap:2 },
  paramLabel:{ fontSize:9, fontWeight:700, color:"#94a3b8", letterSpacing:.8, textTransform:"uppercase" },
  inputActive:  { width:80, padding:"5px 8px", border:"1px solid #e2e8f0", borderRadius:6, fontSize:12, color:"#0f172a", background:"#fff", transition:"all .15s", fontFamily:"'DM Mono',monospace" },
  inputDisabled:{ width:80, padding:"5px 8px", border:"1px solid #f1f5f9", borderRadius:6, fontSize:12, color:"#94a3b8", background:"#f8fafc", fontFamily:"'DM Mono',monospace" },

  lockedChip:{ display:"flex", alignItems:"center", gap:4, fontSize:10, color:"#64748b", fontWeight:600, padding:"3px 8px", background:"#f1f5f9", borderRadius:5 },

  badgeGreen:{ background:"#dcfce7", color:"#15803d", padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:600 },
  badgeAmber:{ background:"#fef3c7", color:"#b45309", padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:600 },
  badgeBlue: { background:"#dbeafe", color:"#1d4ed8", padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:600 },
  badgeGray: { background:"#f1f5f9", color:"#64748b", padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:600 },

  btnSave:  { width:32, height:32, border:"none", borderRadius:7, background:"#2563eb", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" },
  btnSaving:{ width:32, height:32, border:"none", borderRadius:7, background:"#93c5fd", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" },
  btnOff:   { width:32, height:32, border:"none", borderRadius:7, background:"#f1f5f9", color:"#cbd5e1", cursor:"not-allowed", display:"flex", alignItems:"center", justifyContent:"center" },
};