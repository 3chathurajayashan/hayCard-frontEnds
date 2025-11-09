import React, { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "qrcode"; // Add this import
  import { jsPDF } from "jspdf";
const FRONTEND_URL = "https://hay-card-front-end.vercel.app";

export default function FactoryDashboard() {
  const [samples, setSamples] = useState([]);
  const [form, setForm] = useState({
    requestRefNo: "",
    sampleRefNo: "",
    to: "Haycarb Colombo Lab",
    from: "",
    remarks: "",
    sampleInTime: "",
    sampleInDate: "",
    gatePassNo: "",
    sampleReceivedTime: "",
    sampleReceivedDate: "",
    sampleRoute: "",
    testMethod: "",
    results: { As_ppb: "", Sb_ppb: "", Al_ppb: "" },
    analysedBy: "",
    completedTime: "",
    completedDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://hay-card-back-end-iota.vercel.app/api/samples", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSamples(res.data);
    } catch (err) {
      console.error("Error fetching samples:", err);
    } finally {
      setLoading(false);
    }
  };

 

// ... your other imports
const generatePDF = (sample) => {
  const doc = new jsPDF();

  // Add company header
  doc.setFillColor(141, 198, 63); // Haycarb green
  doc.rect(0, 0, 210, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('HAYCARB PLC', 105, 15, { align: 'center' });
  doc.setFontSize(14);
  doc.text('SAMPLE ANALYSIS REPORT', 105, 25, { align: 'center' });

  // Reset text color for content
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  let yPosition = 40;

  // Sample Information
  doc.setFont('helvetica', 'bold');
  doc.text('SAMPLE INFORMATION', 14, yPosition);
  doc.setFont('helvetica', 'normal');
  yPosition += 8;

  const sampleInfo = [
    `Request Reference No: ${sample.requestRefNo || 'N/A'}`,
    `Sample Reference No: ${sample.sampleRefNo || 'N/A'}`,
    `From: ${sample.from || 'N/A'}`,
    `To: ${sample.to || 'N/A'}`,
    `Remarks: ${sample.remarks || 'N/A'}`,
    `Sample IN Date: ${sample.sampleInDate || 'N/A'}`,
    `Sample IN Time: ${sample.sampleInTime || 'N/A'}`,
    `Gate Pass No: ${sample.gatePassNo || 'N/A'}`
  ];

  sampleInfo.forEach(info => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(info, 16, yPosition);
    yPosition += 6;
  });

  yPosition += 4;

  // Laboratory Information
  doc.setFont('helvetica', 'bold');
  doc.text('LABORATORY INFORMATION', 14, yPosition);
  doc.setFont('helvetica', 'normal');
  yPosition += 8;

  const labInfo = [
    `Sample Received Date: ${sample.sampleReceivedDate || sample.receivedDate || 'N/A'}`,
    `Sample Received Time: ${sample.sampleReceivedTime || sample.receivedTime || 'N/A'}`,
    `Sample Route: ${sample.sampleRoute || 'N/A'}`,
    `Test Method: ${sample.testMethod || 'N/A'}`,
    `Analysed By: ${sample.analysedBy || 'N/A'}`
  ];

  labInfo.forEach(info => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(info, 16, yPosition);
    yPosition += 6;
  });

  yPosition += 4;

  // Results Section
  doc.setFont('helvetica', 'bold');
  doc.text('ANALYSIS RESULTS (PPB)', 14, yPosition);
  doc.setFont('helvetica', 'normal');
  yPosition += 8;

  const results = sample.results;

  if (results && results.length > 0) {
    // Table header
    doc.setFont('helvetica', 'bold');
    doc.text('Row', 16, yPosition);
    doc.text('As', 36, yPosition);
    doc.text('Sb', 56, yPosition);
    doc.text('Al', 76, yPosition);
    doc.text('Analysed By', 96, yPosition);
    doc.text('Completed Date', 136, yPosition);
    doc.setFont('helvetica', 'normal');
    yPosition += 6;

    results.forEach((result, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`${index + 1}`, 16, yPosition);
      doc.text(`${result.As_ppb || '-'}`, 36, yPosition);
      doc.text(`${result.Sb_ppb || '-'}`, 56, yPosition);
      doc.text(`${result.Al_ppb || '-'}`, 76, yPosition);
      doc.text(`${sample.analysedBy || '-'}`, 96, yPosition);
      doc.text(`${sample.completedDate || '-'}`, 136, yPosition);
      yPosition += 6;
    });
  } else {
    doc.text('No results available', 16, yPosition);
    yPosition += 6;
  }

  yPosition += 8;

  // Completion Information
  doc.setFont('helvetica', 'bold');
  doc.text('COMPLETION DETAILS', 14, yPosition);
  doc.setFont('helvetica', 'normal');
  yPosition += 8;

  const completionInfo = [
    `Completion Date: ${sample.completedDate || 'N/A'}`,
    `Completion Time: ${sample.completedTime || 'N/A'}`,
    `Status: ${sample.isFinalized ? 'FINALIZED' : 'PENDING'}`
  ];

  completionInfo.forEach(info => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(info, 16, yPosition);
    yPosition += 6;
  });

  // Footer
  const currentDate = new Date().toLocaleDateString();
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(`Generated on: ${currentDate}`, 14, 285);
  doc.text(`Sample ID: ${sample.sampleId || sample._id}`, 105, 285, { align: 'center' });
  doc.text('Haycarb PLC - Laboratory Division', 196, 285, { align: 'right' });

  // Save PDF
  const fileName = `Sample_Report_${sample.sampleRefNo || sample.requestRefNo || sample._id}.pdf`;
  doc.save(fileName); // This triggers the download
};


  const generateQR = async (sample) => {
    try {
      // Append sample ID only (public access for QR)
      // QR points to public route
    const url = `https://hay-card-front-ends-nine.vercel.app/samples/public/${sample._id}`;

  
      const qrDataUrl = await QRCode.toDataURL(url);

      const win = window.open();
      win.document.write(`
        <div style="
          font-family: 'Poppins', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #e0f7fa, #ffffff);
          margin: 0;
          padding: 20px;
          color: #333;
          text-align: center;
        ">
          <h3 style="
            font-size: 24px;
            margin-bottom: 20px;
            color: #00796b;
          ">Scan this QR to view sample details:</h3>
          <img src="${qrDataUrl}" alt="QR Code" style="
            width: 250px;
            height: 250px;
            border: 8px solid #00796b;
            border-radius: 20px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            margin-bottom: 25px;
          " />
          <p style="
            font-size: 16px;
            max-width: 80%;
            word-break: break-word;
          ">
            Or open this link: <br>
            <a href="${url}" target="_blank" style="
              color: #00695c;
              text-decoration: none;
              font-weight: bold;
            ">${url}</a>
          </p>
        </div>
      `);
      win.document.close();
    } catch (err) {
      console.error("QR generation error:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["As_ppb", "Sb_ppb", "Al_ppb"].includes(name)) {
      setForm({ ...form, results: { ...form.results, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCreateSample = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      await axios.post("https://hay-card-back-end-iota.vercel.app/api/samples", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setForm({
        requestRefNo: "",
        sampleRefNo: "",
        to: "Haycarb Colombo Lab",
        from: "",
        remarks: "",
        sampleInTime: "",
        sampleInDate: "",
        gatePassNo: "",
        sampleReceivedTime: "",
        sampleReceivedDate: "",
        sampleRoute: "",
        testMethod: "",
        results: { As_ppb: "", Sb_ppb: "", Al_ppb: "" },
        analysedBy: "",
        completedTime: "",
        completedDate: "",
      });
      await fetchSamples();
      alert("Sample created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create sample");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sample?")) return;
    try {
      await axios.delete(`https://hay-card-back-end-iota.vercel.app/api/samples/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchSamples();
    } catch (err) {
      console.error(err);
      alert("Failed to delete sample");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerText}>
            <h2 style={styles.title}>Hay Carb Factory Dashboard</h2>
            <p style={styles.subtitle}>Welcome, {user?.name || "Factory User"}</p>
          </div>
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Create New Sample */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Create New Sample</h3>
        </div>
        <form onSubmit={handleCreateSample} style={styles.form}>
          <div style={styles.columnsContainer}>
            {/* Column 1 - Basic Information */}
            <div style={styles.column}>
              <h4 style={styles.columnTitle}>Basic Information</h4>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Request Reference No *</label>
                <input
                  type="text"
                  name="requestRefNo"
                  value={form.requestRefNo}
                  onChange={handleChange}
                  placeholder="Enter Request Ref No"
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Sample Ref No *</label>
                <input
                  type="text"
                  name="sampleRefNo"
                  value={form.sampleRefNo}
                  onChange={handleChange}
                  placeholder="Enter Sample Ref No"
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>To</label>
                <input 
                  type="text" 
                  name="to" 
                  value="Haycarb Colombo Lab" 
                  disabled 
                  style={styles.input} 
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>From *</label>
                <select name="from" value={form.from} onChange={handleChange} required style={styles.input}>
                  <option value="">Select From</option>
                  <option value="HCM">HCM</option>
                  <option value="HCB">HCB</option>
                  <option value="HCM HCB">HCM & HCB</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Remarks</label>
                <input
                  type="text"
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  placeholder="Any remarks"
                  style={styles.input}
                />
              </div>
            </div>

            {/* Column 2 - Sample Timing */}
            <div style={styles.column}>
              <h4 style={styles.columnTitle}>Sample Timing</h4>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Sample IN Date</label>
                <input
                  type="date"
                  name="sampleInDate"
                  value={form.sampleInDate}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Sample IN Time</label>
                <input
                  type="time"
                  name="sampleInTime"
                  value={form.sampleInTime}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Gate Pass No</label>
                <input
                  type="text"
                  name="gatePassNo"
                  value={form.gatePassNo}
                  onChange={handleChange}
                  placeholder="Enter Gate Pass No"
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Sample Received Date (HO Lab)</label>
                <input
                  type="date"
                  name="sampleReceivedDate"
                  value={form.sampleReceivedDate}
                  onChange={handleChange}
                  readOnly={user.role === "factory"}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Sample Received Time (HO Lab)</label>
                <input
                  type="time"
                  name="sampleReceivedTime"
                  value={form.sampleReceivedTime}
                  onChange={handleChange}
                  readOnly={user.role === "factory"}
                  style={styles.input}
                />
              </div>
            </div>

            {/* Column 3 - Analysis Details */}
            <div style={styles.column}>
              <h4 style={styles.columnTitle}>Analysis Details</h4>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Sample Route *</label>
                <select
                  name="sampleRoute"
                  value={form.sampleRoute}
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  <option value="">Select Route</option>
                  <option value="Direct from Madampe">Direct from Madampe</option>
                  <option value="Direct from Badalgama">Direct from Badalgama</option>
                  <option value="Through Wewalduwa">Through Wewalduwa</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Test Method</label>
                <input
                  type="text"
                  name="testMethod"
                  value={form.testMethod}
                  onChange={handleChange}
                  placeholder="Enter Test Method"
                  style={styles.input}
                />
              </div>
              
              <div style={styles.resultsSection}>
                <h5 style={styles.sectionSubtitle}>Results (PPb)</h5>
                <div style={styles.resultsGrid}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>As (Arsenic)</label>
                    <input
                      type="number"
                      name="As_ppb"
                      placeholder="As value"
                      value={form.results.As_ppb}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Sb (Antimony)</label>
                    <input
                      type="number"
                      name="Sb_ppb"
                      placeholder="Sb value"
                      value={form.results.Sb_ppb}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Al (Aluminum)</label>
                    <input
                      type="number"
                      name="Al_ppb"
                      placeholder="Al value"
                      value={form.results.Al_ppb}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </div>
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Analysed By</label>
                <input
                  type="text"
                  name="analysedBy"
                  value={form.analysedBy}
                  onChange={handleChange}
                  placeholder="Enter Analyst Name"
                  style={styles.input}
                />
              </div>
            </div>

            {/* Column 4 - Completion */}
            <div style={styles.column}>
              <h4 style={styles.columnTitle}>Completion</h4>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Completion Date</label>
                <input
                  type="date"
                  name="completedDate"
                  value={form.completedDate}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Completion Time</label>
                <input
                  type="time"
                  name="completedTime"
                  value={form.completedTime}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.submitSection}>
                <button type="submit" style={styles.button} disabled={creating}>
                  {creating ? "Creating..." : "Create Sample"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Sample List */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Your Samples</h3>
        </div>
        {loading ? (
          <div style={styles.loading}>Loading samples...</div>
        ) : samples.length === 0 ? (
          <div style={styles.emptyState}>No samples created yet.</div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Sample ID</th>
                  <th style={styles.tableHeader}>Request Ref</th>
                  <th style={styles.tableHeader}>Sample Ref</th>
                  <th style={styles.tableHeader}>From</th>
                  <th style={styles.tableHeader}>To</th>
                  <th style={styles.tableHeader}>Remarks</th>
                  <th style={styles.tableHeader}>Sample IN Date</th>
                  <th style={styles.tableHeader}>Sample IN Time</th>
                  <th style={styles.tableHeader}>Gate Pass No</th>
                  <th style={styles.tableHeader}>Sample Received Date</th>
                  <th style={styles.tableHeader}>Sample Received Time</th>
                  <th style={styles.tableHeader}>Route</th>
                  <th style={styles.tableHeader}>Test Method</th>
                  <th style={styles.tableHeader}>Results (As/Sb/Al)</th>
                  <th style={styles.tableHeader}>Analysed By</th>
                  <th style={styles.tableHeader}>Completion Date</th>
                  <th style={styles.tableHeader}>Completion Time</th>
                  <th style={styles.tableHeader}>Status</th>
                  <th style={styles.tableHeader}>QR Code</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {samples.map((s) => (
                  <tr key={s._id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{s.sampleId}</td>
                    <td style={styles.tableCell}>{s.requestRefNo}</td>
                    <td style={styles.tableCell}>{s.sampleRefNo}</td>
                    <td style={styles.tableCell}>{s.from}</td>
                    <td style={styles.tableCell}>{s.to}</td>
                    <td style={styles.tableCell}>{s.remarks}</td>
                    <td style={styles.tableCell}>{s.sampleInDate}</td>
                    <td style={styles.tableCell}>{s.sampleInTime}</td>
                    <td style={styles.tableCell}>{s.gatePassNo}</td>
                    <td style={styles.tableCell}>{s.sampleReceivedDate || s.receivedDate}</td>
                    <td style={styles.tableCell}>{s.sampleReceivedTime || s.receivedTime}</td>
                    <td style={styles.tableCell}>{s.sampleRoute}</td>
                    <td style={styles.tableCell}>{s.testMethod}</td>
                    <td style={styles.tableCell}>
                      {s.results ? (
                        Array.isArray(s.results) ? (
                          s.results.map((r, i) => (
                            <div key={i}>
                              Row {i + 1}: As: {r.As_ppb || "-"}, Sb: {r.Sb_ppb || "-"}, Al: {r.Al_ppb || "-"}
                            </div>
                          ))
                        ) : (
                          <>As: {s.results.As_ppb || "-"}, Sb: {s.results.Sb_ppb || "-"}, Al: {s.results.Al_ppb || "-"}</>
                        )
                      ) : (
                        "-"
                      )}
                    </td>
                    <td style={styles.tableCell}>{s.analysedBy}</td>
                    <td style={styles.tableCell}>{s.completedDate}</td>
                    <td style={styles.tableCell}>{s.completedTime}</td>
                    <td style={styles.tableCell}>
                      <span style={s.isFinalized ? styles.statusFinalized : styles.statusPending}>
                        {s.isFinalized ? "Finalized" : "Pending"}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <button 
                        style={styles.qrButton} 
                        onClick={() => generateQR(s)}
                      >
                        View QR
                      </button>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.actionContainer}>
                        {s.isFinalized && (
                          <button 
                            style={styles.pdfButton} 
                            onClick={() => generatePDF(s)}
                          >
                            Download PDF
                          </button>
                        )}
                        <button style={styles.deleteBtn} onClick={() => handleDelete(s._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { 
    padding: 30, 
    background: "#f8fafc", 
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: { marginBottom: 30 },
  headerContent: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 },
  headerText: { flex: 1 },
  title: { fontSize: 32, marginBottom: 8, color: "#1e293b", fontWeight: "600" },
  subtitle: { color: "#64748b", fontSize: 16, margin: 0 },
  logoutButton: { background: "#dc2626", color: "#ffffff", border: "none", padding: "10px 20px", borderRadius: 6, fontSize: 14, fontWeight: "600", cursor: "pointer", transition: "background 0.2s ease", minWidth: 100, height: "fit-content" },
  card: { background: "#ffffff", borderRadius: 12, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)", marginBottom: 30, overflow: "hidden" },
  cardHeader: { background: "#8dc63f", padding: "20px 24px" },
  cardTitle: { color: "#ffffff", margin: 0, fontSize: 20, fontWeight: "600" },
  form: { padding: 24 },
  columnsContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 30, alignItems: "flex-start" },
  column: { display: "flex", flexDirection: "column", gap: 16 },
  columnTitle: { fontSize: 16, fontWeight: "600", color: "#334155" },
  inputGroup: { display: "flex", flexDirection: "column" },
  label: { fontSize: 14, color: "#475569", marginBottom: 4 },
  input: { padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 14 },
  button: { background: "#3b82f6", color: "#ffffff", padding: "10px 20px", borderRadius: 6, fontWeight: "600", cursor: "pointer", border: "none", fontSize: 14 },
  resultsSection: { marginTop: 12 },
  resultsGrid: { display: "flex", gap: 10, flexWrap: "wrap" },
  submitSection: { marginTop: 16 },
  tableContainer: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 1200 },
  tableHeader: { background: "#334155", color: "#ffffff", padding: "10px 12px", fontWeight: "600", fontSize: 13, whiteSpace: "nowrap" },
  tableCell: { borderBottom: "1px solid #e2e8f0", padding: "8px 12px", fontSize: 13, verticalAlign: "top" },
  tableRow: {},
  loading: { padding: 20 },
  emptyState: { padding: 20 },
  statusFinalized: { background: "#16a34a", color: "#ffffff", padding: "4px 8px", borderRadius: 4, fontSize: 12 },
  statusPending: { background: "#facc15", color: "#1e293b", padding: "4px 8px", borderRadius: 4, fontSize: 12 },
  qrButton: { 
    background: "#8dc63f", 
    color: "#ffffff", 
    border: "none", 
    padding: "6px 12px", 
    borderRadius: 4, 
    cursor: "pointer", 
    fontSize: 12,
    fontWeight: "600"
  },
  pdfButton: { 
    background: "#dc2626", 
    color: "#ffffff", 
    border: "none", 
    padding: "6px 12px", 
    borderRadius: 4, 
    cursor: "pointer", 
    fontSize: 12,
    fontWeight: "600",
    marginBottom: "4px"
  },
  actionContainer: { display: "flex", flexDirection: "column", gap: 4 },
  deleteBtn: { background: "#6b7280", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontSize: 12 },
};