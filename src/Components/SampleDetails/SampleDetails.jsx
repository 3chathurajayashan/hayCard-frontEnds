import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --blue-900: #0f2a4a;
    --blue-800: #1a3d6b;
    --blue-700: #1e4d88;
    --blue-600: #2563b0;
    --blue-500: #3478d4;
    --blue-400: #5b96e8;
    --blue-100: #dbeafe;
    --blue-50:  #eff6ff;
    --white:    #ffffff;
    --gray-50:  #f8fafc;
    --gray-100: #f1f5f9;
    --gray-200: #e2e8f0;
    --gray-300: #cbd5e1;
    --gray-400: #94a3b8;
    --gray-500: #64748b;
    --gray-700: #334155;
    --gray-900: #0f172a;
    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 16px;
    --shadow-sm: 0 1px 3px rgba(15,42,74,0.08), 0 1px 2px rgba(15,42,74,0.04);
    --shadow-md: 0 4px 16px rgba(15,42,74,0.10), 0 1px 4px rgba(15,42,74,0.06);
    --shadow-lg: 0 10px 40px rgba(15,42,74,0.12);
  }

  body { background: var(--gray-50); }

  .ps-root {
    font-family: 'DM Sans', sans-serif;
    color: var(--gray-900);
    min-height: 100vh;
    background: var(--gray-50);
  }

  /* ── Top bar ── */
  .ps-topbar {
    background: var(--white);
    border-bottom: 1px solid var(--gray-200);
    padding: 0 32px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .ps-topbar-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ps-logo-dot {
    width: 8px; height: 8px;
    background: var(--blue-500);
    border-radius: 50%;
  }
  .ps-topbar-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--blue-800);
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }
  .ps-badge {
    font-size: 11px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: 0.01em;
  }
  .ps-badge-blue {
    background: var(--blue-50);
    color: var(--blue-600);
    border: 1px solid var(--blue-100);
  }
  .ps-badge-green {
    background: #f0fdf4;
    color: #16a34a;
    border: 1px solid #bbf7d0;
  }
  .ps-badge-red {
    background: #fff1f2;
    color: #e11d48;
    border: 1px solid #fecdd3;
  }
  .ps-badge-gray {
    background: var(--gray-100);
    color: var(--gray-500);
    border: 1px solid var(--gray-200);
  }

  /* ── Page shell ── */
  .ps-page {
    max-width: 1080px;
    margin: 0 auto;
    padding: 28px 24px 60px;
  }

  /* ── Header card ── */
  .ps-header-card {
    background: var(--white);
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-lg);
    padding: 24px 28px;
    margin-bottom: 20px;
    box-shadow: var(--shadow-sm);
  }
  .ps-header-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  .ps-gp-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--blue-500);
    margin-bottom: 4px;
  }
  .ps-gp-number {
    font-family: 'DM Mono', monospace;
    font-size: 26px;
    font-weight: 500;
    color: var(--blue-900);
    line-height: 1;
  }
  .ps-header-badges {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }
  .ps-divider {
    border: none;
    border-top: 1px solid var(--gray-100);
    margin: 20px 0;
  }

  /* ── Info grid ── */
  .ps-info-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
  }
  .ps-info-cell {
    padding: 14px 0;
    border-bottom: 1px solid var(--gray-100);
    padding-right: 20px;
  }
  .ps-info-cell:nth-child(3n) { padding-right: 0; }
  .ps-info-label {
    font-size: 11px;
    font-weight: 500;
    color: var(--gray-400);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .ps-info-value {
    font-size: 13.5px;
    font-weight: 400;
    color: var(--gray-900);
    line-height: 1.4;
  }
  .ps-info-value.mono {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
  }
  .ps-info-value.muted { color: var(--gray-400); font-style: italic; }

  /* ── Section heading ── */
  .ps-section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 28px 0 14px;
  }
  .ps-section-title {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--blue-700);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ps-section-title::before {
    content: '';
    display: block;
    width: 3px;
    height: 14px;
    background: var(--blue-500);
    border-radius: 2px;
  }
  .ps-count-pill {
    font-size: 11px;
    font-weight: 600;
    background: var(--blue-50);
    color: var(--blue-600);
    border: 1px solid var(--blue-100);
    padding: 2px 9px;
    border-radius: 20px;
  }

  /* ── Sample card ── */
  .ps-sample-card {
    background: var(--white);
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-md);
    overflow: hidden;
    margin-bottom: 12px;
    box-shadow: var(--shadow-sm);
    transition: box-shadow 0.18s ease;
  }
  .ps-sample-card:hover { box-shadow: var(--shadow-md); }

  .ps-sample-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    background: var(--gray-50);
    border-bottom: 1px solid var(--gray-200);
    gap: 12px;
    flex-wrap: wrap;
  }
  .ps-sample-id {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    color: var(--blue-800);
  }
  .ps-sample-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .ps-sample-body {
    padding: 18px 20px;
  }
  .ps-sample-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px 20px;
    margin-bottom: 0;
  }
  .ps-field-label {
    font-size: 11px;
    font-weight: 500;
    color: var(--gray-400);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 3px;
  }
  .ps-field-value {
    font-size: 13px;
    color: var(--gray-900);
    line-height: 1.4;
  }
  .ps-field-value.muted { color: var(--gray-400); font-style: italic; }
  .ps-field-value.mono {
    font-family: 'DM Mono', monospace;
    font-size: 12.5px;
  }

  /* ── Results table ── */
  .ps-results-wrap {
    margin-top: 16px;
    border-top: 1px solid var(--gray-100);
    padding-top: 16px;
  }
  .ps-results-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--gray-500);
    margin-bottom: 10px;
  }
  .ps-results-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .ps-results-table th {
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    color: var(--gray-400);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 6px 12px;
    background: var(--gray-50);
    border: 1px solid var(--gray-200);
  }
  .ps-results-table td {
    padding: 8px 12px;
    border: 1px solid var(--gray-100);
    color: var(--gray-900);
    vertical-align: top;
  }
  .ps-results-table tr:nth-child(even) td {
    background: var(--gray-50);
  }
  .ps-result-key {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--blue-700);
    font-weight: 500;
    white-space: nowrap;
  }

  /* ── Empty state ── */
  .ps-empty {
    text-align: center;
    padding: 40px 20px;
    color: var(--gray-400);
    font-size: 13px;
    background: var(--white);
    border: 1px dashed var(--gray-200);
    border-radius: var(--radius-md);
  }

  /* ── Loading / error ── */
  .ps-loading {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    background: var(--gray-50);
    font-family: 'DM Sans', sans-serif;
  }
  .ps-spinner {
    width: 28px; height: 28px;
    border: 2.5px solid var(--blue-100);
    border-top-color: var(--blue-500);
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .ps-loading-text {
    font-size: 13px;
    color: var(--gray-400);
    font-weight: 400;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .ps-topbar { padding: 0 16px; }
    .ps-page { padding: 16px 14px 40px; }
    .ps-header-card { padding: 18px 16px; }
    .ps-gp-number { font-size: 20px; }
    .ps-info-grid { grid-template-columns: 1fr 1fr; }
    .ps-info-cell:nth-child(3n) { padding-right: 20px; }
    .ps-info-cell:nth-child(2n) { padding-right: 0; }
    .ps-sample-grid { grid-template-columns: 1fr 1fr; }
    .ps-sample-body { padding: 14px 14px; }
    .ps-sample-header { padding: 12px 14px; }
  }

  @media (max-width: 480px) {
    .ps-info-grid { grid-template-columns: 1fr; }
    .ps-info-cell { padding-right: 0 !important; }
    .ps-sample-grid { grid-template-columns: 1fr; gap: 12px; }
    .ps-header-top { flex-direction: column; gap: 10px; }
    .ps-gp-number { font-size: 18px; }
    .ps-results-table { font-size: 12px; }
    .ps-topbar-title { font-size: 11px; }
  }
`;

function Badge({ type = "gray", children }) {
  return <span className={`ps-badge ps-badge-${type}`}>{children}</span>;
}

function InfoCell({ label, value, mono, muted }) {
  return (
    <div className="ps-info-cell">
      <div className="ps-info-label">{label}</div>
      <div className={`ps-info-value${mono ? " mono" : ""}${muted ? " muted" : ""}`}>
        {value || <span className="muted" style={{ color: "var(--gray-300)", fontStyle: "italic" }}>—</span>}
      </div>
    </div>
  );
}

function FieldItem({ label, value, mono }) {
  const isEmpty = !value || value === "N/A" || value === "Pending" || value === "not yet" || value === "not received yet!" || value === "not assigned yet!";
  return (
    <div>
      <div className="ps-field-label">{label}</div>
      <div className={`ps-field-value${mono ? " mono" : ""}${isEmpty ? " muted" : ""}`}>
        {isEmpty ? "—" : value}
      </div>
    </div>
  );
}

export default function PublicSample() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`https://hay-card-back-end-iota.vercel.app/api/samples/public/${id}`);
        const json = await res.json();
        setData(json?.data || {});
      } catch (err) {
        console.error("Error fetching gate pass:", err);
        setData({});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="ps-loading">
        <div className="ps-spinner" />
        <div className="ps-loading-text">Fetching gate pass…</div>
      </div>
    </>
  );

  if (!data || Object.keys(data).length === 0) return (
    <>
      <style>{styles}</style>
      <div className="ps-loading">
        <div className="ps-loading-text" style={{ color: "var(--gray-500)" }}>Gate pass not found.</div>
      </div>
    </>
  );

  const from    = Array.isArray(data.from) ? data.from.join(", ") : (data.from ?? "N/A");
  const to      = Array.isArray(data.to)   ? data.to.join(", ")   : (data.to   ?? "N/A");
  const samples = Array.isArray(data.samples) ? data.samples : [];

  const isFinalized = data.isFinalized;
  const isReceived  = data.received;

  return (
    <>
      <style>{styles}</style>
      <div className="ps-root">

        {/* Top bar */}
        <div className="ps-topbar">
          <div className="ps-topbar-left">
            <div className="ps-logo-dot" />
            <span className="ps-topbar-title">Sample Tracker</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Badge type={isFinalized ? "green" : "gray"}>
              {isFinalized ? "Finalized" : "In Progress"}
            </Badge>
            <Badge type={isReceived ? "blue" : "gray"}>
              {isReceived ? "Received" : "Pending"}
            </Badge>
          </div>
        </div>

        {/* Page content */}
        <div className="ps-page">

          {/* Gate pass header */}
          <div className="ps-header-card">
            <div className="ps-header-top">
              <div>
                <div className="ps-gp-label">Gate Pass</div>
                <div className="ps-gp-number">{data.gatePassNo ?? "N/A"}</div>
              </div>
              <div className="ps-header-badges">
                {data.sampleRoute && <Badge type="blue">{data.sampleRoute}</Badge>}
              </div>
            </div>

            <hr className="ps-divider" />

            <div className="ps-info-grid">
              <InfoCell label="Request Ref No"  value={data.requestRefNo}  mono />
              <InfoCell label="Sample Ref No"   value={data.sampleRefNo}   mono />
              <InfoCell label="Date In"
                value={[data.sampleInDate, data.sampleInTime].filter(Boolean).join("  ") || null}
              />
              <InfoCell label="From" value={from} />
              <InfoCell label="To"   value={to}   />
              <InfoCell label="Remarks" value={data.remarks} />
              <InfoCell
                label="Assigned To"
                value={
                  data.assignedTo?.name
                    ? `${data.assignedTo.name}${data.assignedTo?.email ? ` · ${data.assignedTo.email}` : ""}`
                    : null
                }
                muted={!data.assignedTo?.name}
              />
              <InfoCell
                label="Received Date/Time"
                value={[data.receivedDate, data.receivedTime].filter(Boolean).join("  ") || null}
                muted={!data.receivedDate}
              />
              <InfoCell
                label="Finalized"
                value={isFinalized ? "Yes" : "No"}
              />
            </div>
          </div>

          {/* Samples section */}
          <div className="ps-section-head">
            <div className="ps-section-title">Samples</div>
            {samples.length > 0 && <span className="ps-count-pill">{samples.length}</span>}
          </div>

          {samples.length === 0 ? (
            <div className="ps-empty">No samples attached to this gate pass.</div>
          ) : (
            samples.map((s, i) => {
              const hasResults = s?.results && Object.keys(s.results).length > 0;
              const completed  = [s?.completedDate, s?.completedTime].filter(Boolean).join("  ");
              const isPending  = !s?.completedDate;

              return (
                <div className="ps-sample-card" key={i}>
                  {/* Sample card header */}
                  <div className="ps-sample-header">
                    <span className="ps-sample-id">
                      {s?.sampleId ?? `Sample ${i + 1}`}
                    </span>
                    <div className="ps-sample-meta">
                      {s?.testMethod && <Badge type="blue">{s.testMethod}</Badge>}
                      <Badge type={isPending ? "gray" : "green"}>
                        {isPending ? "Pending" : "Completed"}
                      </Badge>
                    </div>
                  </div>

                  {/* Sample card body */}
                  <div className="ps-sample-body">
                    <div className="ps-sample-grid">
                      <FieldItem label="Unit Number"  value={s?.unitNumber}   mono />
                      <FieldItem label="Analysed By"  value={s?.analysedBy}        />
                      <FieldItem label="Completed"    value={completed || null}     />
                      <FieldItem label="Remarks"      value={s?.remarks}            />
                    </div>

                    {hasResults && (
                      <div className="ps-results-wrap">
                        <div className="ps-results-label">Results</div>
                        <table className="ps-results-table">
                          <thead>
                            <tr>
                              <th style={{ width: "40%" }}>Parameter</th>
                              <th>Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(s.results).map(([key, val], idx) => (
                              <tr key={idx}>
                                <td className="ps-result-key">{key}</td>
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
            })
          )}
        </div>
      </div>
    </>
  );
}