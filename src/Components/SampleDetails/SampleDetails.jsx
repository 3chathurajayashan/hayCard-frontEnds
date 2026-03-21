import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#eef2f8;
  --surface:#fff;
  --border:#dde4ef;
  --b1:#1240b0;
  --b2:#2563eb;
  --b3:#60a5fa;
  --blt:#eff6ff;
  --bmd:#bfdbfe;
  --t1:#0c1a3a;
  --t2:#475569;
  --t3:#94a3b8;
  --grn:#15803d;
  --glt:#f0fdf4;
  --gbd:#86efac;
  --amb:#92400e;
  --alt:#fffbeb;
  --abd:#fcd34d;
  --r1:8px;--r2:14px;--r3:20px;
  --sh:0 1px 3px rgba(12,26,58,.07),0 6px 20px rgba(12,26,58,.08);
  --shh:0 4px 12px rgba(12,26,58,.10),0 16px 40px rgba(12,26,58,.12);
  font-family:'Plus Jakarta Sans',sans-serif;
}
html{-webkit-font-smoothing:antialiased}
body{background:var(--bg)}

@keyframes spin{to{transform:rotate(360deg)}}
@keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

.screen{
  min-height:100svh;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:14px;
  background:var(--bg);font-family:inherit;
}
.spin{
  width:30px;height:30px;border:2.5px solid var(--bmd);
  border-top-color:var(--b2);border-radius:50%;
  animation:spin .65s linear infinite;
}
.screen-msg{font-size:13.5px;color:var(--t3);font-weight:500}

/* shell */
.shell{min-height:100svh;background:var(--bg);font-family:inherit;color:var(--t1)}

/* navbar */
.nav{
  background:var(--b1);
  height:52px;padding:0 20px;
  display:flex;align-items:center;justify-content:space-between;
  position:sticky;top:0;z-index:300;
}
.nav-left{display:flex;align-items:center;gap:9px}
.nav-icon{
  width:30px;height:30px;border-radius:8px;
  background:rgba(255,255,255,.13);
  display:flex;align-items:center;justify-content:center;
}
.nav-name{font-size:14px;font-weight:700;color:#fff;letter-spacing:.01em}
.nav-sub{font-size:11px;font-weight:400;color:rgba(255,255,255,.5);margin-top:1px}
.nav-tag{
  font-size:11px;font-weight:700;padding:4px 11px;border-radius:20px;
  letter-spacing:.03em;
}
.nav-tag.fin{background:rgba(255,255,255,.2);color:#fff}
.nav-tag.pend{background:rgba(255,255,255,.09);color:rgba(255,255,255,.65)}

/* page */
.page{
  max-width:940px;margin:0 auto;
  padding:22px 16px 60px;
  animation:up .3s ease both;
}

/* hero card */
.hero{
  background:var(--surface);
  border-radius:var(--r3);
  box-shadow:var(--sh);
  overflow:hidden;
  margin-bottom:18px;
}
.hero-top{
  background:linear-gradient(115deg,#0f2d8a 0%,#2563eb 60%,#3b82f6 100%);
  padding:22px 22px 18px;
}
.hero-eye{
  font-size:10px;font-weight:800;letter-spacing:.13em;
  text-transform:uppercase;color:rgba(255,255,255,.55);margin-bottom:5px;
}
.hero-no{
  font-size:28px;font-weight:800;color:#fff;
  letter-spacing:-.4px;line-height:1.1;
}
.hero-route{
  display:inline-flex;align-items:center;
  margin-top:10px;gap:5px;
  background:rgba(255,255,255,.16);
  color:#fff;font-size:11px;font-weight:600;
  padding:4px 12px;border-radius:20px;letter-spacing:.04em;
}

/* status chips */
.chips{display:flex;flex-wrap:wrap;gap:8px;padding:18px 22px 0}
.chip{
  display:inline-flex;align-items:center;gap:6px;
  padding:6px 12px;border-radius:8px;
  font-size:12px;font-weight:600;border:1.5px solid transparent;
}
.dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.chip.grn{background:var(--glt);border-color:var(--gbd);color:var(--grn)}
.chip.grn .dot{background:var(--grn)}
.chip.amb{background:var(--alt);border-color:var(--abd);color:var(--amb)}
.chip.amb .dot{background:var(--amb)}
.chip.blu{background:var(--blt);border-color:var(--bmd);color:var(--b1)}
.chip.blu .dot{background:var(--b2)}

/* info grid */
.igrid{
  display:grid;grid-template-columns:1fr 1fr;
  gap:0;
  margin:18px 22px 22px;
  border:1px solid var(--border);border-radius:var(--r2);overflow:hidden;
}
.ic{
  padding:13px 15px;
  border-right:1px solid var(--border);
  border-bottom:1px solid var(--border);
  transition:background .15s;
}
.ic:nth-child(2n){border-right:none}
/* last row: remove bottom border */
.ic:nth-last-child(-n+2){border-bottom:none}
/* odd last child spans full */
.ic:last-child:nth-child(odd){grid-column:1/-1;border-right:none;border-bottom:none}
.ic:hover{background:var(--blt)}
.ic-lbl{
  font-size:10px;font-weight:700;text-transform:uppercase;
  letter-spacing:.08em;color:var(--t3);margin-bottom:3px;
}
.ic-val{font-size:13.5px;font-weight:500;color:var(--t1);line-height:1.4}
.ic-val.dim{color:var(--t3);font-weight:400}

/* section */
.sec-hd{
  display:flex;align-items:center;justify-content:space-between;
  margin:26px 0 12px;
}
.sec-title{
  font-size:11px;font-weight:800;text-transform:uppercase;
  letter-spacing:.1em;color:var(--b1);
  display:flex;align-items:center;gap:8px;
}
.sec-title::before{
  content:'';display:block;
  width:4px;height:15px;
  background:linear-gradient(180deg,var(--b1),var(--b3));
  border-radius:3px;
}
.sec-n{
  font-size:11px;font-weight:700;
  background:var(--blt);color:var(--b1);
  border:1px solid var(--bmd);padding:2px 9px;border-radius:20px;
}

/* sample card */
.sc{
  background:var(--surface);border-radius:var(--r2);
  box-shadow:var(--sh);margin-bottom:12px;overflow:hidden;
  transition:box-shadow .2s,transform .2s;
}
.sc:hover{box-shadow:var(--shh);transform:translateY(-1px)}

.sc-hd{
  display:flex;align-items:center;justify-content:space-between;
  flex-wrap:wrap;gap:8px;
  padding:12px 16px;
  border-bottom:1px solid var(--border);
  background:#f8fafc;
}
.sc-left{display:flex;align-items:center;gap:9px}
.sc-num{
  width:26px;height:26px;border-radius:7px;
  background:var(--blt);color:var(--b1);
  display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:800;flex-shrink:0;
}
.sc-id{font-size:13px;font-weight:700;color:var(--t1)}
.sc-tags{display:flex;gap:6px;flex-wrap:wrap}

.tag{
  font-size:11px;font-weight:600;padding:3px 10px;
  border-radius:6px;border:1px solid transparent;letter-spacing:.02em;
}
.tag.blu{background:var(--blt);border-color:var(--bmd);color:var(--b1)}
.tag.grn{background:var(--glt);border-color:var(--gbd);color:var(--grn)}
.tag.amb{background:var(--alt);border-color:var(--abd);color:var(--amb)}

.sc-body{padding:16px}
.sc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px 16px}
.sf-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--t3);margin-bottom:3px}
.sf-val{font-size:13px;font-weight:500;color:var(--t1);line-height:1.45}
.sf-val.dim{color:var(--t3);font-weight:400}

/* results */
.res-wrap{margin-top:15px;padding-top:13px;border-top:1px solid var(--border)}
.res-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--t3);margin-bottom:9px}
.res-tbl{width:100%;border-collapse:collapse;border:1px solid var(--border);border-radius:var(--r1);overflow:hidden;font-size:13px}
.res-tbl th{
  text-align:left;padding:8px 12px;
  font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;
  color:var(--t3);background:#f8fafc;border-bottom:1px solid var(--border);
}
.res-tbl td{padding:9px 12px;border-bottom:1px solid #f0f4f9;color:var(--t1);font-weight:500}
.res-tbl tr:last-child td{border-bottom:none}
.res-tbl tr:hover td{background:var(--blt)}
.rk{color:var(--b1);font-weight:600;font-size:12.5px}

/* empty */
.empty{
  text-align:center;padding:36px 20px;
  background:var(--surface);border-radius:var(--r2);
  border:1.5px dashed var(--border);
  color:var(--t3);font-size:13.5px;font-weight:500;
}

/* ── responsive ── */
@media(max-width:640px){
  .nav{padding:0 14px}
  .nav-sub{display:none}
  .page{padding:14px 12px 48px}
  .hero-top{padding:18px 16px 16px}
  .hero-no{font-size:21px}
  .chips{padding:14px 16px 0;gap:7px}
  .igrid{margin:14px 16px 18px;grid-template-columns:1fr}
  .ic{border-right:none!important}
  .ic:nth-last-child(-n+2){border-bottom:1px solid var(--border)!important}
  .ic:last-child{border-bottom:none!important}
  .ic:last-child:nth-child(odd){grid-column:auto}
  .sc-grid{grid-template-columns:1fr 1fr;gap:13px 13px}
  .sc-hd{padding:11px 13px}
  .sc-body{padding:13px 13px}
  .res-tbl th,.res-tbl td{padding:8px 10px;font-size:12px}
}
@media(max-width:380px){
  .sc-grid{grid-template-columns:1fr}
  .hero-no{font-size:18px}
}
`;

const v = (x) =>
  x && x !== "N/A" && x !== "not assigned yet!" && x !== "not received yet!" && x !== "not yet"
    ? x : null;

function IC({ label, value }) {
  return (
    <div className="ic">
      <div className="ic-lbl">{label}</div>
      <div className={`ic-val${value ? "" : " dim"}`}>{value ?? "—"}</div>
    </div>
  );
}

function SF({ label, value }) {
  return (
    <div>
      <div className="sf-lbl">{label}</div>
      <div className={`sf-val${value ? "" : " dim"}`}>{value ?? "—"}</div>
    </div>
  );
}

export default function PublicSample() {
  const { id } = useParams();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const r = await fetch(`https://hay-card-back-end-iota.vercel.app/api/samples/public/${id}`);
        const j = await r.json();
        setData(j?.data || {});
      } catch (e) {
        console.error(e); setData({});
      } finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return (
    <><style>{css}</style>
    <div className="screen"><div className="spin"/><p className="screen-msg">Loading gate pass…</p></div></>
  );

  if (!data || !Object.keys(data).length) return (
    <><style>{css}</style>
    <div className="screen"><p className="screen-msg">Gate pass not found.</p></div></>
  );

  const from    = Array.isArray(data.from) ? data.from.join(", ") : v(data.from);
  const to      = Array.isArray(data.to)   ? data.to.join(", ")   : v(data.to);
  const samples = Array.isArray(data.samples) ? data.samples : [];
  const fin     = !!data.isFinalized;
  const recv    = !!data.received;
  const dateIn  = [data.sampleInDate, data.sampleInTime].filter(Boolean).join("  ") || null;
  const recvAt  = [v(data.receivedDate), v(data.receivedTime)].filter(Boolean).join("  ") || null;
  const assignee = data.assignedTo?.name
    ? `${data.assignedTo.name}${data.assignedTo?.email ? ` · ${data.assignedTo.email}` : ""}`
    : null;

  return (
    <><style>{css}</style>
    <div className="shell">

      {/* nav */}
      <nav className="nav">
        <div className="nav-left">
          <div className="nav-icon">
            <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white"/>
              <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white" opacity=".6"/>
              <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white" opacity=".6"/>
              <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" opacity=".3"/>
            </svg>
          </div>
          <div>
            <div className="nav-name">Sample Tracker</div>
            <div className="nav-sub">Gate Pass Portal</div>
          </div>
        </div>
        <span className={`nav-tag ${fin ? "fin" : "pend"}`}>{fin ? "Finalized" : "In Progress"}</span>
      </nav>

      <div className="page">

        {/* hero */}
        <div className="hero">
          <div className="hero-top">
            <div className="hero-eye">Gate Pass</div>
            <div className="hero-no">{data.gatePassNo ?? "—"}</div>
            {data.sampleRoute && <span className="hero-route">{data.sampleRoute}</span>}
          </div>

          <div className="chips">
            <span className={`chip ${fin  ? "grn" : "amb"}`}><span className="dot"/>{fin  ? "Finalized"  : "Pending Finalization"}</span>
            <span className={`chip ${recv ? "grn" : "amb"}`}><span className="dot"/>{recv ? "Received"   : "Not Yet Received"}</span>
          </div>

          <div className="igrid">
            <IC label="Request Ref No"  value={v(data.requestRefNo)} />
            <IC label="Sample Ref No"   value={v(data.sampleRefNo)} />
            <IC label="Date In"         value={dateIn} />
            <IC label="Received At"     value={recvAt} />
            <IC label="From"            value={from} />
            <IC label="To"              value={to} />
            <IC label="Remarks"         value={v(data.remarks)} />
            <IC label="Assigned To"     value={assignee} />
          </div>
        </div>

        {/* samples */}
        <div className="sec-hd">
          <div className="sec-title">Samples</div>
          {samples.length > 0 && <span className="sec-n">{samples.length}</span>}
        </div>

        {samples.length === 0
          ? <div className="empty">No samples attached to this gate pass.</div>
          : samples.map((s, i) => {
              const done = !!s?.completedDate;
              const completed = [s?.completedDate, s?.completedTime].filter(Boolean).join("  ") || null;
              const hasR = s?.results && Object.keys(s.results).length > 0;
              return (
                <div className="sc" key={i}>
                  <div className="sc-hd">
                    <div className="sc-left">
                      <div className="sc-num">{i + 1}</div>
                      <span className="sc-id">{v(s?.sampleId) ?? `Sample ${i + 1}`}</span>
                    </div>
                    <div className="sc-tags">
                      {s?.testMethod && <span className="tag blu">{s.testMethod}</span>}
                      <span className={`tag ${done ? "grn" : "amb"}`}>{done ? "Completed" : "Pending"}</span>
                    </div>
                  </div>
                  <div className="sc-body">
                    <div className="sc-grid">
                      <SF label="Unit No"     value={v(s?.unitNumber)} />
                      <SF label="Analysed By" value={v(s?.analysedBy)} />
                      <SF label="Completed"   value={completed} />
                      <SF label="Remarks"     value={v(s?.remarks)} />
                    </div>
                    {hasR && (
                      <div className="res-wrap">
                        <div className="res-lbl">Test Results</div>
                        <table className="res-tbl">
                          <thead><tr><th style={{width:"42%"}}>Parameter</th><th>Value</th></tr></thead>
                          <tbody>
                            {Object.entries(s.results).map(([k, val], idx) => (
                              <tr key={idx}>
                                <td className="rk">{k}</td>
                                <td>{val}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
      </div>
    </div></>
  );
}