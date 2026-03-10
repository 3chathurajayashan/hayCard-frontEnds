import { useState, useEffect } from "react";

const ROUTES = ["Direct from Madampe", "Direct from Badalgama", "Through Wewalduwa"];
const ORIGINS = ["HCM", "HCB", "HCM HCB"];

function Toast({ message, type = "success", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  const colors = { success: "#16a34a", error: "#dc2626", info: "#2563eb" };
  const icons = { success: "✓", error: "✕", info: "i" };
  return (
    <div style={{
      position: "fixed", top: 20, right: 20, zIndex: 999,
      background: "#fff", border: "1px solid #e5e7eb",
      borderLeft: `4px solid ${colors[type]}`,
      borderRadius: 8, padding: "12px 18px", minWidth: 290,
      boxShadow: "0 8px 28px rgba(0,0,0,0.10)",
      display: "flex", alignItems: "center", gap: 10,
      animation: "slideIn 0.22s ease",
    }}>
      <span style={{ width: 22, height: 22, borderRadius: "50%", background: colors[type], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{icons[type]}</span>
      <span style={{ fontSize: 13, color: "#111827", fontWeight: 500, flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 5, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {label}{required && <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, required, readOnly, type = "text" }) {
  const [f, setF] = useState(false);
  return (
    <Field label={label} required={required}>
      <input type={type} value={value} readOnly={readOnly} required={required} placeholder={placeholder}
        onChange={e => !readOnly && onChange(e.target.value)}
        onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{
          width: "100%", boxSizing: "border-box", border: `1px solid ${f && !readOnly ? "#2563eb" : "#e5e7eb"}`,
          borderRadius: 7, padding: "8px 12px", fontSize: 13, color: readOnly ? "#9ca3af" : "#111827",
          outline: "none", background: readOnly ? "#f9fafb" : "#fff", fontFamily: "inherit",
          transition: "border-color 0.15s, box-shadow 0.15s", cursor: readOnly ? "not-allowed" : "text",
          boxShadow: f && !readOnly ? "0 0 0 3px rgba(37,99,235,0.10)" : "none",
        }} />
    </Field>
  );
}

function SelectInput({ label, value, options, onChange }) {
  const [f, setF] = useState(false);
  return (
    <Field label={label}>
      <select value={value} onChange={e => onChange(e.target.value)} onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{
          width: "100%", boxSizing: "border-box", border: `1px solid ${f ? "#2563eb" : "#e5e7eb"}`,
          borderRadius: 7, padding: "8px 12px", fontSize: 13, color: "#111827",
          outline: "none", background: "#fff", cursor: "pointer", fontFamily: "inherit",
          appearance: "none", transition: "border-color 0.15s, box-shadow 0.15s",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%236b7280' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 32,
          boxShadow: f ? "0 0 0 3px rgba(37,99,235,0.10)" : "none",
        }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </Field>
  );
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "16px 20px", borderTop: `3px solid ${accent}` }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>{sub}</div>
    </div>
  );
}

function Steps({ current }) {
  const steps = ["Logistics", "Samples", "Complete"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginRight: 8 }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700,
              background: i < current ? "#fdfdfd" : i === current ? "#fff" : "#f3f4f6",
              color: i < current ? "#fff" : i === current ? "#2563eb" : "#9ca3af",
              border: i === current ? "2px solid #2563eb" : i < current ? "2px solid #2563eb" : "2px solid #e5e7eb",
            }}>{i < current ? "✓" : i + 1}</div>
            <span style={{ fontSize: 9, fontWeight: 600, color: i <= current ? "#2563eb" : "#9ca3af", letterSpacing: "0.04em" }}>{s}</span>
          </div>
          {i < steps.length - 1 && <div style={{ width: 40, height: 2, background: i < current ? "#2563eb" : "#e5e7eb", margin: "0 4px", marginBottom: 14 }} />}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("gatepass");
  const [step, setStep] = useState(0);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tempKey, setTempKey] = useState("");
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [history, setHistory] = useState([]);
  const [editIdx, setEditIdx] = useState(null);

  const [gp, setGP] = useState({
    requestRefNo: "", sampleRefNo: "", from: ["HCM"],
    sampleRoute: "Direct from Madampe", gatePassNo: "",
    remarks: "", sampleInDate: "", sampleInTime: "", samples: [],
  });

  const [sForm, setSForm] = useState({ sampleId: "", testMethod: "", unitNumber: "", results: {} });

  useEffect(() => {
    const now = new Date();
    setGP(p => ({ ...p, sampleInDate: now.toISOString().split("T")[0], sampleInTime: now.toTimeString().substring(0, 5) }));
  }, []);

  const setField = (f, v) => setGP(p => ({ ...p, [f]: v }));

  const addSample = () => {
    if (!sForm.sampleId.trim()) { setToast({ message: "Sample ID is required.", type: "error" }); return; }
    if (editIdx !== null) {
      setGP(p => { const s = [...p.samples]; s[editIdx] = sForm; return { ...p, samples: s }; });
      setToast({ message: `Sample "${sForm.sampleId}" updated.`, type: "info" });
      setEditIdx(null);
    } else {
      setGP(p => ({ ...p, samples: [...p.samples, sForm] }));
      setToast({ message: `Sample "${sForm.sampleId}" added.`, type: "success" });
      setStep(s => Math.max(s, 1));
    }
    setSForm({ sampleId: "", testMethod: "", unitNumber: "", results: {} });
  };

  const editSample = i => { setSForm({ ...gp.samples[i] }); setEditIdx(i); };

  const removeSample = i => {
    const id = gp.samples[i].sampleId;
    setGP(p => ({ ...p, samples: p.samples.filter((_, j) => j !== i) }));
    setToast({ message: `Sample "${id}" removed.`, type: "info" });
  };

  const addKey = () => {
    if (!tempKey.trim()) return;
    setSForm(p => ({ ...p, results: { ...p.results, [tempKey.trim()]: "" } }));
    setTempKey(""); setShowModal(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!gp.requestRefNo || !gp.gatePassNo) { setToast({ message: "Fill all required fields.", type: "error" }); return; }
    if (gp.samples.length === 0) { setToast({ message: "Add at least one sample.", type: "error" }); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    setHistory(h => [{ ...gp, savedAt: new Date().toLocaleString() }, ...h]);
    setToast({ message: "Gate Pass synchronized successfully.", type: "success" });
    setSubmitting(false);
    setStep(2);
    const now = new Date();
    setTimeout(() => {
      setGP({ requestRefNo: "", sampleRefNo: "", from: ["HCM"], sampleRoute: "Direct from Madampe", gatePassNo: "", remarks: "", sampleInDate: now.toISOString().split("T")[0], sampleInTime: now.toTimeString().substring(0, 5), samples: [] });
      setSForm({ sampleId: "", testMethod: "", unitNumber: "", results: {} });
      setStep(0); setEditIdx(null);
    }, 2200);
  };

  const filtered = gp.samples.filter(s =>
    s.sampleId.toLowerCase().includes(search.toLowerCase()) ||
    s.testMethod.toLowerCase().includes(search.toLowerCase())
  );
  const sorted = sortCol ? [...filtered].sort((a, b) => {
    const av = a[sortCol] || ""; const bv = b[sortCol] || "";
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  }) : filtered;

  const toggleSort = col => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f3f4f6", fontFamily: "'Segoe UI', system-ui, sans-serif", fontSize: 13, color: "#111827" }}>
      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateX(16px) } to { opacity:1; transform:translateX(0) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        tr.rh:hover td { background: #f9fafb; }
        button.bpri:hover { background: #1d4ed8 !important; }
        button.bghost:hover { background: #f3f4f6 !important; }
        .navbtn:hover { background: #f3f4f6 !important; }
        th.sortable:hover { background: #f3f4f6 !important; cursor: pointer; }
      `}</style>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Modal */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: "fixed", inset: 0, zIndex: 99, background: "rgba(17,24,39,0.25)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 12, width: 360, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", overflow: "hidden" }}>
            <div style={{ padding: "18px 22px", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>New Analysis Parameter</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3 }}>Add a custom key-value pair to this sample</div>
            </div>
            <div style={{ padding: 22 }}>
              <TextInput label="Parameter Name" value={tempKey} onChange={setTempKey} placeholder="e.g. pH Level, Viscosity, Temperature" />
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button onClick={() => setShowModal(false)} className="bghost" style={{ flex: 1, padding: 9, border: "1px solid #e5e7eb", borderRadius: 7, cursor: "pointer", background: "#fff", fontSize: 13, fontFamily: "inherit", color: "#374151" }}>Cancel</button>
                <button onClick={addKey} className="bpri" style={{ flex: 1, padding: 9, border: "none", borderRadius: 7, cursor: "pointer", background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>Add Parameter</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside style={{ width: 228, background: "#121832", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 18px 18px", borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div  ></div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 24, color: "#ffffff" ,letterSpacing:"2px"}}>HAYCARB</div>
              <div style={{ fontSize: 12, color: "#dadada" }}>Factory Laboratory System </div>
            </div>
          </div>
        </div>

        <nav style={{ padding: "12px 10px", flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#d1d5db", textTransform: "uppercase", letterSpacing: "0.1em", padding: "4px 8px 8px" }}>Navigation</div>
          {[
            { id: "gatepass", label: "Sample Creation", dot: null },
            { id: "history", label: "View All Samples", dot: history.length > 0 ? history.length : null },
          ].map(item => (
            <button key={item.id} className="navbtn" onClick={() => setTab(item.id)} style={{
              display: "flex", alignItems: "center", gap: 9, width: "100%",
              padding: "9px 12px", borderRadius: 7, border: "none",
              background: tab === item.id ? "#ffffff" : "transparent",
              color: tab === item.id ? "#000000" : "#6b7280",
              fontWeight: tab === item.id ? 600 : 400,
              fontSize: 13, cursor: "pointer", textAlign: "left", fontFamily: "inherit",
              marginBottom: 2, transition: "background 0.12s",
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: tab === item.id ? "#eb2525" : "#95afd5", flexShrink: 0 }} />
              {item.label}
              {item.dot && <span style={{ marginLeft: "auto", background: "#ff0000", color: "#fff", borderRadius: 10, fontSize: 10, fontWeight: 700, padding: "1px 7px" }}>{item.dot}</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: "14px 18px", borderTop: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ffffff", boxShadow: "0 0 0 2px #dcfce7" }} />
            <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>System Satus :Online</span>
          </div>
          <div style={{ fontSize: 10, color: "#d1d5db", marginTop: 4 }}>HAYCARB PLC</div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ height: 58, background: "#fff", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", flexShrink: 0 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 19, color: "#0b2b08" }}>
              {tab === "gatepass" ? "Create a New Sample" : "Submission History"}
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>
              {tab === "gatepass" ? `${gp.samples.length} sample${gp.samples.length !== 1 ? "s" : ""} queued` : `${history.length} total submission${history.length !== 1 ? "s" : ""}`}
            </div>
          </div>
          {tab === "gatepass" && (
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <Steps current={step} />
              <button form="gp-form" type="submit" className="bpri" disabled={submitting} style={{
                background: submitting ? "#93c5fd" : "rgb(141, 198, 63)", border: "none", borderRadius: 8,
                padding: "9px 22px", color: "#fff", fontSize: 13, fontWeight: 600,
                cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit",
                boxShadow: submitting ? "none" : "0 2px 10px rgba(37,99,235,0.28)",
                display: "flex", alignItems: "center", gap: 8, transition: "background 0.15s",
              }}>
                {submitting ? "Saving..." : "Create Sample"}
              </button>
            </div>
          )}
        </header>

        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {tab === "gatepass" && (
            <form id="gp-form" onSubmit={handleSubmit} style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Stats Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                <StatCard label="Total Samples" value={gp.samples.length} sub="In current gate pass" accent="#ffffff" />
                <StatCard label="Origin Node" value={gp.from[0] || "—"} sub="Source location" accent="#ffffff" color="#2563eb"/>
                <StatCard label="Active Parameters" value={Object.keys(sForm.results).length} sub="On current sample form" accent="#ffffff" />
                <StatCard label="Session Start" value={gp.sampleInTime || "—"} sub="Auto-stamped on load" accent="#ffffff" />
              </div>

              {/* Logistics Card */}
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "14px 22px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 19, color: "#0f4ed7" }}>Logistics Declaration</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Reference identifiers, origin, and routing metadata</div>
                  </div>
                  
                </div>
                <div style={{ padding: 22, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px 24px" }}>
                  <TextInput label="Request Ref No" value={gp.requestRefNo} onChange={v => setField("requestRefNo", v)} required placeholder="REQ-0001" />
                  <TextInput label="Sample Ref No" value={gp.sampleRefNo} onChange={v => setField("sampleRefNo", v)} required placeholder="SMP-0001" />
                  <TextInput label="Gate Pass No" value={gp.gatePassNo} onChange={v => setField("gatePassNo", v)} required placeholder="GP-0001" />
                  <TextInput label="Internal Remarks" value={gp.remarks} onChange={v => setField("remarks", v)} placeholder="Optional notes" />
                  <SelectInput label="Origin Location" value={gp.from[0]} options={ORIGINS} onChange={v => setField("from", [v])} />
                  <SelectInput label="Dispatch Route" value={gp.sampleRoute} options={ROUTES} onChange={v => setField("sampleRoute", v)} />
                  <TextInput label="Sample In Date" type="date" value={gp.sampleInDate} readOnly />
                  <TextInput label="Sample In Time" type="time" value={gp.sampleInTime} readOnly />
                </div>
              </div>

              {/* Bottom Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "310px 1fr", gap: 18 }}>

                {/* Add Sample */}
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", alignSelf: "start" }}>
                  <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", background: editIdx !== null ? "#fffbeb" : "#fff" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{editIdx !== null ? "Edit Sample" : "Add Sample"}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{editIdx !== null ? "Modify entry and update" : "Fill fields and include in register"}</div>
                  </div>
                  <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 13 }}>
                    <TextInput label="Sample ID" value={sForm.sampleId} onChange={v => setSForm(p => ({ ...p, sampleId: v }))} placeholder="S-001" />
                    <TextInput label="Test Method" value={sForm.testMethod} onChange={v => setSForm(p => ({ ...p, testMethod: v }))} placeholder="ISO 4406" />
                    <TextInput label="Unit Number" value={sForm.unitNumber} onChange={v => setSForm(p => ({ ...p, unitNumber: v }))} placeholder="UNT-001" />

                    <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 13 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Parameters</span>
                        <button type="button" onClick={() => setShowModal(true)} style={{ fontSize: 11, fontWeight: 600, color: "#2563eb", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>+ Add Key</button>
                      </div>
                      {Object.entries(sForm.results).length === 0 ? (
                        <div onClick={() => setShowModal(true)} style={{ border: "1.5px dashed #e5e7eb", borderRadius: 7, padding: 14, textAlign: "center", color: "#d1d5db", fontSize: 12, cursor: "pointer" }}>
                          Click to add analysis keys
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 160, overflowY: "auto" }}>
                          {Object.entries(sForm.results).map(([k, v]) => (
                            <div key={k} style={{ display: "flex", gap: 5, alignItems: "center" }}>
                              <div style={{ flex: "0 0 38%", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 5, padding: "5px 8px", fontSize: 11, fontWeight: 600, color: "#2563eb", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={k}>{k}</div>
                              <input value={v} onChange={e => setSForm(p => ({ ...p, results: { ...p.results, [k]: e.target.value } }))}
                                placeholder="Value"
                                style={{ flex: 1, border: "1px solid #e5e7eb", borderRadius: 5, padding: "5px 8px", fontSize: 12, outline: "none", fontFamily: "inherit", color: "#111827" }} />
                              <button type="button" onClick={() => { const r = { ...sForm.results }; delete r[k]; setSForm(p => ({ ...p, results: r })); }}
                                style={{ background: "none", border: "none", cursor: "pointer", color: "#d1d5db", fontSize: 16, padding: 0, lineHeight: 1 }}>×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                      {editIdx !== null && (
                        <button type="button" className="bghost" onClick={() => { setEditIdx(null); setSForm({ sampleId: "", testMethod: "", unitNumber: "", results: {} }); }}
                          style={{ flex: 1, padding: 9, border: "1px solid #e5e7eb", borderRadius: 7, cursor: "pointer", background: "#fff", fontSize: 12, fontFamily: "inherit", color: "#374151" }}>
                          Cancel
                        </button>
                      )}
                      <button type="button" onClick={addSample} className="bpri" style={{
                        flex: 1, padding: 10, border: "none", borderRadius: 7, cursor: "pointer",
                        background: editIdx !== null ? "#d97706" : "#111827",
                        color: "#fff", fontSize: 12, fontWeight: 600, fontFamily: "inherit",
                      }}>
                        {editIdx !== null ? "Update Sample" : "Include in Register"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Registry */}
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={{ padding: "14px 22px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>Sample Registry</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{gp.samples.length} {gp.samples.length === 1 ? "entry" : "entries"} · {gp.sampleRoute}</div>
                    </div>
                    <div style={{ position: "relative" }}>
                      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                        style={{ border: "1px solid #e5e7eb", borderRadius: 7, padding: "7px 12px 7px 30px", fontSize: 12, outline: "none", fontFamily: "inherit", color: "#111827", width: 180 }} />
                      <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 14 }}>⌕</span>
                    </div>
                    {gp.samples.length > 0 && (
                      <button type="button" onClick={() => { if (window.confirm("Clear all samples from registry?")) { setGP(p => ({ ...p, samples: [] })); setToast({ message: "Registry cleared.", type: "info" }); } }}
                        style={{ fontSize: 11, fontWeight: 600, color: "#ef4444", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}>
                        Clear All
                      </button>
                    )}
                  </div>

                  <div style={{ overflowX: "auto", flex: 1 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                          {[
                            { label: "Number", col: null },
                            { label: "Sample ID", col: "sampleId" },
                            { label: "Test Method", col: "testMethod" },
                            { label: "Unit", col: "unitNumber" },
                            { label: "Parameters", col: null },
                            { label: "Actions", col: null, right: true },
                          ].map((h, i) => (
                            <th key={i} className={h.col ? "sortable" : ""} onClick={h.col ? () => toggleSort(h.col) : undefined}
                              style={{ padding: "10px 18px", textAlign: h.right ? "right" : "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#9ca3af", whiteSpace: "nowrap", userSelect: "none", transition: "background 0.1s" }}>
                              {h.label}{h.col && sortCol === h.col && <span style={{ marginLeft: 4, color: "#2563eb" }}>{sortDir === "asc" ? "↑" : "↓"}</span>}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sorted.length === 0 ? (
                          <tr><td colSpan={6} style={{ padding: "56px 20px", textAlign: "center" }}>
                             
                            <div style={{ fontWeight: 600, color: "#6b7280", fontSize: 14 }}>Registry is empty</div>
                            <div style={{ fontSize: 12, color: "#d1d5db", marginTop: 5 }}>Add samples using the panel on the left</div>
                          </td></tr>
                        ) : sorted.map((s, i) => (
                          <tr key={i} className="rh" style={{ borderBottom: "1px solid #f3f4f6", animation: `fadeUp 0.18s ease ${i * 0.025}s both` }}>
                            <td style={{ padding: "13px 18px" }}>
                              <span style={{ background: "#f3f4f6", color: "#6b7280", borderRadius: 5, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{String(i + 1).padStart(2, "0")}</span>
                            </td>
                            <td style={{ padding: "13px 18px" }}>
                              <div style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{s.sampleId}</div>
                            </td>
                            <td style={{ padding: "13px 18px", fontSize: 12, color: "#374151" }}>{s.testMethod || <span style={{ color: "#d1d5db" }}>—</span>}</td>
                            <td style={{ padding: "13px 18px", fontSize: 12, color: "#374151" }}>{s.unitNumber || <span style={{ color: "#d1d5db" }}>—</span>}</td>
                            <td style={{ padding: "13px 18px" }}>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                {Object.entries(s.results).length === 0
                                  ? <span style={{ fontSize: 11, color: "#d1d5db" }}>None</span>
                                  : Object.entries(s.results).map(([k, v]) => (
                                    <span key={k} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8", borderRadius: 5, fontSize: 11, fontWeight: 600, padding: "2px 8px" }}>
                                      {k}: {v || "—"}
                                    </span>
                                  ))}
                              </div>
                            </td>
                            <td style={{ padding: "13px 18px", textAlign: "right" }}>
                              <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                                <button type="button" onClick={() => editSample(i)} style={{ fontSize: 11, fontWeight: 600, color: "#2563eb", background: "#ffffff", border: "1px solid #000000", borderRadius: 5, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
                                <button type="button" onClick={() => removeSample(i)} style={{ fontSize: 11, fontWeight: 600, color: "#ef4444", background: "#ffffff", border: "1px solid #000000", borderRadius: 5, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}>Remove</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {gp.samples.length > 0 && (
                    <div style={{ padding: "10px 22px", borderTop: "1px solid #f3f4f6", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, color: "#6b7280" }}>Showing <b style={{ color: "#111827" }}>{sorted.length}</b> of <b style={{ color: "#111827" }}>{gp.samples.length}</b> entries</span>
                      <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#6b7280" }}>
                        <span>Route: <b style={{ color: "#111827" }}>{gp.sampleRoute}</b></span>
                        <span>Origin: <b style={{ color: "#111827" }}>{gp.from[0]}</b></span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          )}

          {/* History Tab */}
          {tab === "history" && (
            <div style={{ maxWidth: 960, margin: "0 auto" }}>
              {history.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 20px" }}>
                   
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#374151" }}>No submissions yet</div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>Submitted gate passes will appear here</div>
                </div>
              ) : history.map((h, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 14, overflow: "hidden", animation: `fadeUp 0.18s ease ${i * 0.04}s both` }}>
                  <div style={{ padding: "14px 22px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>Gate Pass — {h.gatePassNo || "N/A"}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{h.savedAt} · {h.samples.length} sample{h.samples.length !== 1 ? "s" : ""} · {h.from[0]}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "rgb(141, 198, 63)", background: "#f0fdf4", border: "1px solid rgb(141, 198, 63)", borderRadius: 6, padding: "3px 10px" }}>Submitted</span>
                  </div>
                  <div style={{ padding: "14px 22px", display: "flex", flexWrap: "wrap", gap: "8px 24px", fontSize: 12 }}>
                    <span style={{ color: "#6b7280" }}>Request Ref: <b style={{ color: "#111827" }}>{h.requestRefNo || "—"}</b></span>
                    <span style={{ color: "#6b7280" }}>Sample Ref: <b style={{ color: "#111827" }}>{h.sampleRefNo || "—"}</b></span>
                    <span style={{ color: "#6b7280" }}>Route: <b style={{ color: "#111827" }}>{h.sampleRoute}</b></span>
                    <span style={{ color: "#6b7280" }}>Date: <b style={{ color: "#111827" }}>{h.sampleInDate}</b></span>
                    {h.remarks && <span style={{ color: "#6b7280" }}>Remarks: <b style={{ color: "#111827" }}>{h.remarks}</b></span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}