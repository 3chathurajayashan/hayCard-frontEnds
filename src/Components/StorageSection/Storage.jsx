import React, { useState, useEffect, useMemo, useRef } from "react";

/**
 * ChemicalStorageAdvanced.jsx
 * Full Industrial Chemical Storage System (single-file, no external libs)
 *
 * Paste this component into your project and use <ChemicalStorageAdvanced /> where needed.
 *
 * NOTE: QR generator here draws a simple label on a canvas (not a real scannable QR).
 * All charts are SVG-based to avoid external dependencies.
 */

export default function ChemicalStorageAdvanced() {
  const initialChemicals = [
    { id: "C001", name: "Hydrochloric Acid", quantity: 25, unit: "L", location: "A1", expiry: "2026-05-15", hazard: "Corrosive", batch: "B-A1" },
    { id: "C002", name: "Sodium Chloride", quantity: 10, unit: "kg", location: "B2", expiry: "2030-01-20", hazard: "Low", batch: "B-B2" },
    { id: "C003", name: "Ethanol", quantity: 50, unit: "L", location: "C3", expiry: "2027-09-12", hazard: "Flammable", batch: "B-C3" },
    { id: "C004", name: "Sulfuric Acid", quantity: 30, unit: "L", location: "A2", expiry: "2026-08-19", hazard: "Highly Corrosive", batch: "B-A2" },
    { id: "C005", name: "Ammonia Solution", quantity: 15, unit: "L", location: "D1", expiry: "2025-11-30", hazard: "Toxic", batch: "B-D1" },
    { id: "C006", name: "Acetone", quantity: 20, unit: "L", location: "C4", expiry: "2027-04-22", hazard: "Flammable", batch: "B-C4" },
    { id: "C007", name: "Nitric Acid", quantity: 18, unit: "L", location: "A3", expiry: "2026-03-01", hazard: "Oxidizer", batch: "B-A3" },
    { id: "C008", name: "Potassium Permanganate", quantity: 12, unit: "kg", location: "B5", expiry: "2029-06-14", hazard: "Oxidizing", batch: "B-B5" },
    { id: "C009", name: "Sodium Hydroxide", quantity: 25, unit: "kg", location: "E2", expiry: "2028-02-28", hazard: "Corrosive", batch: "B-E2" },
    { id: "C010", name: "Formaldehyde", quantity: 8, unit: "L", location: "D3", expiry: "2025-09-09", hazard: "Toxic", batch: "B-D3" },
    { id: "C011", name: "Hydrogen Peroxide", quantity: 15, unit: "L", location: "C1", expiry: "2026-12-12", hazard: "Oxidizing Agent", batch: "B-C1" },
    { id: "C012", name: "Benzene", quantity: 10, unit: "L", location: "F2", expiry: "2027-10-01", hazard: "Carcinogenic", batch: "B-F2" },
    { id: "C013", name: "Methanol", quantity: 35, unit: "L", location: "C2", expiry: "2026-02-17", hazard: "Flammable", batch: "B-C2" },
    { id: "C014", name: "Phosphoric Acid", quantity: 20, unit: "L", location: "A4", expiry: "2027-08-08", hazard: "Corrosive", batch: "B-A4" },
    { id: "C015", name: "Acetic Acid", quantity: 22, unit: "L", location: "A5", expiry: "2026-11-25", hazard: "Irritant", batch: "B-A5" },
  ];

  // Storage layout template for heatmap / capacity visualization
  const layout = ["A1","A2","A3","A4","A5","B1","B2","B3","B4","B5","C1","C2","C3","C4","D1","D2","D3","E1","E2","F1","F2"];

  const [chemicals, setChemicals] = useState(initialChemicals);
  const [filter, setFilter] = useState({ q: "", hazard: "All", location: "All" });
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [newChem, setNewChem] = useState({ name: "", quantity: "", unit: "L", location: layout[0], expiry: "", hazard: "Low", batch: "" });
  const [selectedCell, setSelectedCell] = useState(null);
  const [env, setEnv] = useState({ temp: 22.5, humidity: 48, ventilation: "Good" });
  const canvasRef = useRef(null);

  // Interaction rules (simple)
  const incompatiblePairs = [
    ["Nitric Acid", "Acetone"],
    ["Nitric Acid", "Ethanol"],
    ["Hydrogen Peroxide", "Acetone"],
    ["Sodium Hydroxide", "Formaldehyde"],
    ["Hydrogen Peroxide", "Benzene"],
  ];

  // Mock environment updates
  useEffect(() => {
    const t = setInterval(() => {
      setEnv(prev => {
        // small random walk
        const nextTemp = Math.max(15, Math.min(30, +(prev.temp + (Math.random()-0.5)*1.2).toFixed(1)));
        const nextHum = Math.max(20, Math.min(80, Math.round(prev.humidity + (Math.random()-0.5)*3)));
        const vent = nextTemp > 26 || nextHum > 70 ? "Check Ventilation" : "Good";
        return { temp: nextTemp, humidity: nextHum, ventilation: vent };
      });
    }, 6000);

    return () => clearInterval(t);
  }, []);

  // Derived stats
  const hazardCounts = useMemo(() => {
    const map = {};
    chemicals.forEach(c => {
      const h = c.hazard || "Low";
      map[h] = (map[h] || 0) + 1;
    });
    return map;
  }, [chemicals]);

  const capacityUsage = useMemo(() => {
    // For demo, compute % usage per location by number of chemicals (or quantity normalized)
    const map = {};
    layout.forEach(loc => map[loc] = 0);
    chemicals.forEach(c => {
      if (map[c.location] !== undefined) map[c.location] += 1;
    });
    // compute percent (max occupancy considered 3 per slot in demo)
    const percent = {};
    Object.keys(map).forEach(k => percent[k] = Math.min(100, Math.round((map[k]/3)*100)));
    return percent;
  }, [chemicals]);

  const expirySorted = useMemo(() => {
    // convert expiry to Date and sort by closest expiry
    return [...chemicals].map(c => ({...c, expiryDate: new Date(c.expiry)}))
      .sort((a,b) => a.expiryDate - b.expiryDate);
  }, [chemicals]);

  const filtered = useMemo(() => {
    return chemicals.filter(c => {
      if (filter.hazard !== "All" && c.hazard !== filter.hazard) return false;
      if (filter.location !== "All" && c.location !== filter.location) return false;
      if (filter.q && !(`${c.name} ${c.location} ${c.hazard}`.toLowerCase().includes(filter.q.toLowerCase()))) return false;
      return true;
    });
  }, [chemicals, filter]);

  // helper: simple color mapping
  const hazardColor = (h) => {
    const key = (h || "").toLowerCase();
    if (key.includes("flamm")) return "#ff6b4a";
    if (key.includes("corros") || key.includes("corrosive")) return "#d9534f";
    if (key.includes("toxic")) return "#c0392b";
    if (key.includes("oxid") || key.includes("oxidizing")) return "#ff9800";
    if (key.includes("carcin")) return "#8e44ad";
    return "#5cb85c"; // low/other
  };

  // Add chemical with interaction check
  const handleAdd = (e) => {
    e.preventDefault();
    const { name, quantity, unit, location, expiry, hazard, batch } = newChem;
    if (!name || !quantity || !location || !expiry || !hazard) {
      setMessage("Please fill all required fields.");
      setTimeout(() => setMessage(""), 2500);
      return;
    }

    // check interactions with chemicals already in same location
    const collocated = chemicals.filter(c => c.location === location);
    const warnings = [];
    collocated.forEach(existing => {
      incompatiblePairs.forEach(pair => {
        if ((pair[0] === existing.name && pair[1] === name) || (pair[1] === existing.name && pair[0] === name)) {
          warnings.push(`Incompatible with ${existing.name} in ${location}`);
        }
      });
    });

    const id = "C" + String(Math.floor(1000 + Math.random()*9000));
    const chemToAdd = { id, name, quantity: Number(quantity), unit, location, expiry, hazard, batch: batch || id };

    setChemicals(prev => [...prev, chemToAdd]);
    setNewChem({ name: "", quantity: "", unit: "L", location: layout[0], expiry: "", hazard: "Low", batch: "" });
    setShowForm(false);

    if (warnings.length) {
      setMessage("Added with warnings: " + warnings.join("; "));
    } else {
      setMessage("Chemical added successfully.");
    }
    setTimeout(() => setMessage(""), 3500);
  };

  // click heatmap cell -> show chemicals in that location
  const handleCellClick = (loc) => {
    setSelectedCell(loc);
  };

  // generate "QR" label on canvas for selected chemical
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.strokeStyle = "#1d2d50";
    ctx.lineWidth = 3;
    ctx.strokeRect(8,8,canvas.width-16, canvas.height-16);

    // find first chemical to display (selectedCell chemicals or first overall)
    const target = selectedCell ? chemicals.find(c => c.location === selectedCell) || chemicals[0] : chemicals[0];
    if (!target) return;
    ctx.fillStyle = "#1d2d50";
    ctx.font = "16px Poppins, sans-serif";
    ctx.fillText("Lab Label", 22, 38);
    ctx.font = "bold 18px Poppins, sans-serif";
    ctx.fillText(target.name, 22, 70);
    ctx.font = "14px Poppins, sans-serif";
    ctx.fillText(`Batch: ${target.batch}`, 22, 100);
    ctx.fillText(`Loc: ${target.location}`, 22, 124);
    ctx.fillText(`Qty: ${target.quantity}${target.unit}`, 22, 148);
    ctx.fillText(`Expiry: ${target.expiry}`, 22, 172);

    // a simple block representing "QR"
    ctx.fillStyle = "#e6e6e6";
    ctx.fillRect(canvas.width - 110, 40, 80, 80);
    ctx.fillStyle = "#bdbdbd";
    ctx.fillRect(canvas.width - 100, 50, 20, 20);
    ctx.fillRect(canvas.width - 70, 50, 20, 20);
    ctx.fillRect(canvas.width - 40, 50, 20, 20);
    ctx.fillRect(canvas.width - 100, 80, 20, 20);
    ctx.fillRect(canvas.width - 70, 80, 20, 20);
  }, [selectedCell, chemicals]);

  // small UI components: Pie chart SVG for hazards
  const HazardPie = ({ data }) => {
    const entries = Object.entries(data);
    const total = entries.reduce((s,[k,v]) => s+v, 0) || 1;
    let angle = 0;
    const cx = 60, cy = 60, r = 50;
    return (
      <svg width="140" height="140" viewBox="0 0 140 140">
        <g transform={`translate(${cx},${cy})`}>
          {entries.map(([k,v], i) => {
            const slice = v / total;
            const startAngle = angle;
            const endAngle = angle + slice * Math.PI * 2;
            const x1 = Math.cos(startAngle) * r;
            const y1 = Math.sin(startAngle) * r;
            const x2 = Math.cos(endAngle) * r;
            const y2 = Math.sin(endAngle) * r;
            const large = slice > 0.5 ? 1 : 0;
            const d = `M 0 0 L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
            angle = endAngle;
            return <path key={k} d={d} fill={hazardColor(k)} stroke="#fff" strokeWidth="1" />;
          })}
        </g>
      </svg>
    );
  };

  // gauge component
  const Gauge = ({ value, max = 100, label }) => {
    const pct = Math.max(0, Math.min(100, Math.round((value/max)*100)));
    const angle = (pct / 100) * 180; // semicircle
    return (
      <div style={{ width: 140, textAlign: "center", margin: 8 }}>
        <svg width="140" height="80" viewBox="0 0 140 80">
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#5cb85c" />
              <stop offset="60%" stopColor="#ff9800" />
              <stop offset="100%" stopColor="#d9534f" />
            </linearGradient>
          </defs>
          <path d="M10 70 A60 60 0 0 1 130 70" fill="none" stroke="#e6e6e6" strokeWidth="14" strokeLinecap="round" />
          <path d={`M10 70 A60 60 0 0 1 ${10 + 120 * Math.cos(Math.PI * (1 - pct/100))} ${70 - 120 * Math.sin(Math.PI * (1 - pct/100))}`}
                fill="none" stroke="url(#g1)" strokeWidth="14" strokeLinecap="round" />
          <circle cx={70 + Math.cos(Math.PI*(1 - pct/100))*60} cy={70 - Math.sin(Math.PI*(1 - pct/100))*60} r="6" fill="#1d2d50" />
        </svg>
        <div style={{ fontSize: 14, color: "#1d2d50", fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 12, color: "#5c6475" }}>{value}{value && typeof value === "number" ? "%" : ""}</div>
      </div>
    );
  };

  return (
    <div className="storage-page-advanced">
      <button className="back-btn" onClick={() => window.history.back()}>← Back</button>

      <header className="storage-header">
        <h1>Chemical Storage </h1>
        <p>Manage, visualize and secure laboratory chemical storage</p>
      </header>

      {message && <div className="notification">{message}</div>}

      <div className="top-row">
        <div className="left-col">
          <div className="panel">
            <div className="panel-header">
              <h3>Environment Monitor</h3>
              <div className="panel-sub">Live mock readings</div>
            </div>
            <div className="env-grid">
              <div className="env-item">
                <div className="env-value">{env.temp}°C</div>
                <div className="env-label">Temperature</div>
              </div>
              <div className="env-item">
                <div className="env-value">{env.humidity}%</div>
                <div className="env-label">Humidity</div>
              </div>
              <div className="env-item">
                <div className="env-value">{env.ventilation}</div>
                <div className="env-label">Ventilation</div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Hazard Summary</h3>
              <div className="panel-sub">Counts by hazard category</div>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <HazardPie data={hazardCounts} />
              <div>
                {Object.entries(hazardCounts).map(([k,v]) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 12, height: 12, background: hazardColor(k), borderRadius: 4 }} />
                    <div style={{ fontWeight: 600, color: "#1d2d50" }}>{k}</div>
                    <div style={{ color: "#5c6475", marginLeft: 8 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Storage Capacity Map</h3>
              <div className="panel-sub">Percent used per slot (visual)</div>
            </div>
            <div className="capacity-grid">
              {layout.map(loc => (
                <div key={loc} className="capacity-cell" onClick={() => handleCellClick(loc)}>
                  <div className="cell-name">{loc}</div>
                  <div className="cell-bar">
                    <div className="cell-fill" style={{ width: `${capacityUsage[loc]}%`, background: capacityUsage[loc] > 75 ? "#d9534f" : "#1d2d50" }} />
                  </div>
                  <div className="cell-percent">{capacityUsage[loc]}%</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 13, color: "#5c6475" }}>Click any slot to view items in it.</div>
          </div>
        </div>

        <div className="right-col">
          <div className="panel">
            <div className="panel-header">
              <h3>Quantity Gauges</h3>
              <div className="panel-sub">Quick view of selected items (top 4)</div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "space-between", flexWrap: "wrap" }}>
              {chemicals.slice(0,4).map(c => {
                // For demo treat max as 50 for L or 50 for kg
                const max = c.unit === "L" ? 50 : 50;
                const val = Math.min(100, Math.round((c.quantity/max)*100));
                return <Gauge key={c.id} value={val} label={`${c.name} (${c.quantity}${c.unit})`} />;
              })}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Expiry Timeline</h3>
              <div className="panel-sub">Soonest expiries first</div>
            </div>
            <div className="timeline">
              {expirySorted.slice(0,8).map(c => {
                const daysToExpiry = Math.ceil((new Date(c.expiry) - new Date()) / (1000*60*60*24));
                const days = Math.max(0, Math.min(365, daysToExpiry));
                const widthPct = Math.max(6, Math.round((365 - days)/365*100));
                const color = daysToExpiry <= 30 ? "#d9534f" : daysToExpiry <= 90 ? "#ff9800" : "#5cb85c";
                return (
                  <div key={c.id} className="timeline-item">
                    <div className="timeline-left">
                      <div className="timeline-name">{c.name}</div>
                      <div className="timeline-meta">{c.location} • Exp: {c.expiry}</div>
                    </div>
                    <div className="timeline-bar">
                      <div className="timeline-fill" style={{ width: `${widthPct}%`, background: color }} />
                    </div>
                    <div className="timeline-days">{daysToExpiry}d</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Selected Slot Items</h3>
              <div className="panel-sub">Click a slot on map to inspect</div>
            </div>
            <div className="slot-items">
              {selectedCell ? (
                <>
                  <div style={{ marginBottom: 8, fontWeight: 700 }}>{selectedCell} contents</div>
                  {chemicals.filter(c => c.location === selectedCell).length === 0 && <div style={{ color: "#5c6475" }}>No items in this slot.</div>}
                  <table className="slot-table">
                    <thead>
                      <tr><th>Name</th><th>Qty</th><th>Hazard</th><th>Expiry</th></tr>
                    </thead>
                    <tbody>
                      {chemicals.filter(c => c.location === selectedCell).map(c => (
                        <tr key={c.id}>
                          <td>{c.name}</td>
                          <td>{c.quantity}{c.unit}</td>
                          <td style={{ color: hazardColor(c.hazard), fontWeight: 600 }}>{c.hazard}</td>
                          <td>{c.expiry}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <div style={{ color: "#5c6475" }}>Select a storage slot to inspect contents.</div>
              )}
              <div style={{ marginTop: 12 }}>
                <canvas ref={canvasRef} width={320} height={200} style={{ borderRadius: 8, boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }} />
                <div style={{ fontSize: 12, color: "#5c6475", marginTop: 6 }}>Label preview for selected item (printable)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="control-row">
        <div className="panel wide">
          <div className="panel-header">
            <h3>Advanced Search & Filters</h3>
            <div className="panel-sub">Search name, filter by hazard or location</div>
          </div>
          <div className="filters">
            <input className="input" placeholder="Search chemicals..." value={filter.q} onChange={(e) => setFilter(prev => ({...prev, q: e.target.value}))} />
            <select className="select" value={filter.hazard} onChange={(e) => setFilter(prev => ({...prev, hazard: e.target.value}))}>
              <option>All</option>
              <option>Low</option>
              <option>Flammable</option>
              <option>Corrosive</option>
              <option>Highly Corrosive</option>
              <option>Toxic</option>
              <option>Oxidizer</option>
              <option>Oxidizing</option>
              <option>Carcinogenic</option>
              <option>Irritant</option>
            </select>
            <select className="select" value={filter.location} onChange={(e) => setFilter(prev => ({...prev, location: e.target.value}))}>
              <option value="All">All locations</option>
              {layout.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <button className="add-btn" onClick={() => setShowForm(true)}>Add Chemical</button>
          </div>

          <div className="table-container">
            <table className="chem-table">
              <thead>
                <tr><th>Name</th><th>Qty</th><th>Location</th><th>Expiry</th><th>Hazard</th></tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.quantity}{c.unit}</td>
                    <td>{c.location}</td>
                    <td>{c.expiry}</td>
                    <td style={{ color: hazardColor(c.hazard), fontWeight: 700 }}>{c.hazard}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Chemical Modal */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Chemical</h2>
            <form onSubmit={handleAdd}>
              <input className="input" placeholder="Chemical Name" value={newChem.name} onChange={(e) => setNewChem({...newChem, name: e.target.value})} />
              <div style={{ display: "flex", gap: 8 }}>
                <input className="input" placeholder="Quantity" type="number" value={newChem.quantity} onChange={(e) => setNewChem({...newChem, quantity: e.target.value})} />
                <select className="select" value={newChem.unit} onChange={(e) => setNewChem({...newChem, unit: e.target.value})}>
                  <option>L</option>
                  <option>kg</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <select className="select" value={newChem.location} onChange={(e) => setNewChem({...newChem, location: e.target.value})}>
                  {layout.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <input className="input" type="date" value={newChem.expiry} onChange={(e) => setNewChem({...newChem, expiry: e.target.value})} />
              </div>
              <select className="select" value={newChem.hazard} onChange={(e) => setNewChem({...newChem, hazard: e.target.value})}>
                <option>Low</option>
                <option>Flammable</option>
                <option>Corrosive</option>
                <option>Highly Corrosive</option>
                <option>Toxic</option>
                <option>Oxidizer</option>
                <option>Oxidizing</option>
                <option>Carcinogenic</option>
                <option>Irritant</option>
              </select>
              <input className="input" placeholder="Batch (optional)" value={newChem.batch} onChange={(e) => setNewChem({...newChem, batch: e.target.value})} />
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        * { box-sizing: border-box; font-family: 'Poppins', sans-serif; }
        :root { --brand: #1d2d50; --muted: #5c6475; --bg: linear-gradient(135deg,#edf1f7,#f9fafc); }

        .storage-page-advanced { min-height: 100vh; background: var(--bg); padding-bottom: 60px; display: flex; flex-direction: column; align-items: center; }
        .back-btn { position: absolute; top: 20px; left: 20px; background: var(--brand); color: #fff; border: none; padding: 10px 14px; border-radius: 8px; cursor: pointer; }
        .storage-header { width: 100%; text-align: center; background: #fff; padding: 64px 20px 26px; box-shadow: 0 6px 20px rgba(0,0,0,0.08); border-bottom: 3px solid #e4e8f0; margin-bottom: 18px; }
        .storage-header h1 { color: var(--brand); font-size: 2.4rem; }
        .storage-header p { color: var(--muted); margin-top: 6px; }

        .notification { position: fixed; top: 18px; right: 18px; background: var(--brand); color: #fff; padding: 12px 20px; border-radius: 10px; box-shadow: 0 8px 30px rgba(0,0,0,0.1); }

        .top-row { width: 92%; max-width: 1200px; display: flex; gap: 18px; margin-top: 18px; align-items: flex-start; }
        .left-col { flex: 1.15; display: flex; flex-direction: column; gap: 14px; }
        .right-col { flex: 1; display: flex; flex-direction: column; gap: 14px; }

        .panel { background: #fff; border-radius: 14px; padding: 16px; box-shadow: 0 8px 28px rgba(0,0,0,0.06); }
        .panel-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 10px; }
        .panel-header h3 { margin: 0; color: var(--brand); }
        .panel-sub { color: var(--muted); font-size: 13px; margin-left: 8px; }

        .env-grid { display: flex; gap: 12px; }
        .env-item { flex: 1; background: #f7fafc; border-radius: 8px; padding: 12px; text-align: center; }
        .env-value { font-size: 20px; color: var(--brand); font-weight: 700; }
        .env-label { color: var(--muted); font-size: 13px; margin-top: 4px; }

        .capacity-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
        .capacity-cell { padding: 8px; border-radius: 8px; background: #fbfdff; cursor: pointer; border: 1px solid #f0f3f7; }
        .cell-name { font-weight: 700; color: var(--brand); margin-bottom: 6px; }
        .cell-bar { height: 8px; background: #e8eef6; border-radius: 6px; overflow: hidden; }
        .cell-fill { height: 100%; transition: width 0.4s ease; }
        .cell-percent { font-size: 12px; color: var(--muted); margin-top: 6px; }

        .timeline { display: flex; flex-direction: column; gap: 8px; }
        .timeline-item { display: flex; align-items: center; gap: 12px; }
        .timeline-left { width: 38%; }
        .timeline-name { font-weight: 700; color: var(--brand); font-size: 14px; }
        .timeline-meta { color: var(--muted); font-size: 12px; margin-top: 4px; }
        .timeline-bar { flex: 1; background: #eef4fb; height: 12px; border-radius: 8px; overflow: hidden; }
        .timeline-fill { height: 100%; width: 40%; transition: width 0.4s; }
        .timeline-days { width: 60px; text-align: right; color: var(--muted); font-weight: 700; }

        .slot-items { padding-top: 8px; }
        .slot-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        .slot-table th, .slot-table td { padding: 8px 10px; border-bottom: 1px solid #f0f3f7; text-align: left; font-size: 13px; }
        .slot-table th { color: var(--muted); font-weight: 700; }

        .control-row { width: 92%; max-width: 1200px; margin-top: 16px; }
        .panel.wide { padding: 14px; }

        .filters { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; }
        .input { padding: 10px 12px; border-radius: 8px; border: 1px solid #e6eef6; flex: 1; }
        .select { padding: 10px 12px; border-radius: 8px; border: 1px solid #e6eef6; background: #fff; }
        .add-btn { background: var(--brand); color: #fff; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; }

        .table-container { max-height: 320px; overflow: auto; border-radius: 8px; }
        .chem-table { width: 100%; border-collapse: collapse; }
        .chem-table th, .chem-table td { padding: 10px 12px; border-bottom: 1px solid #f0f3f7; text-align: left; }
        .chem-table th { background: #f8fbff; color: var(--muted); font-weight: 700; position: sticky; top: 0; }

        /* modal */
        .modal { position: fixed; inset: 0; display:flex; align-items:center; justify-content:center; background: rgba(0,0,0,0.45); z-index: 1800; }
        .modal-content { width: 520px; background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
        .modal-content h2 { color: var(--brand); margin-bottom: 12px; }
        .save-btn { background: var(--brand); color: #fff; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; }
        .cancel-btn { background: #e6e9ef; color: var(--brand); border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; }

        @media (max-width: 980px) {
          .top-row { flex-direction: column; width: 96%; gap: 12px; }
          .capacity-grid { grid-template-columns: repeat(4,1fr); }
        }
      `}</style>
    </div>
  );
}
