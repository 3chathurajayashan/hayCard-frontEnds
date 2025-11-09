import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import emailjs from "emailjs-com";

const FRONTEND_URL = "https://hay-card-front-end.vercel.app/";

export default function LabAdminDashboard() {
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    results: [{ As_ppb: "", Sb_ppb: "", Al_ppb: "" }],
    analysedBy: "",
    completedDate: "",
    completedTime: "",
  });

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
      toast.error("Failed to fetch samples");
    } finally {
      setLoading(false);
    }
  };

  const handleAddResults = (sample) => {
    setSelectedSample(sample);
    setForm({
      results: sample.results?.length
        ? sample.results
        : [{ As_ppb: "", Sb_ppb: "", Al_ppb: "" }],
      analysedBy: sample.analysedBy || "",
      completedDate: sample.completedDate || "",
      completedTime: sample.completedTime || "",
    });
    setShowForm(true);
  };

  const handleResultChange = (index, field, value) => {
    const newResults = [...form.results];
    newResults[index][field] = value;
    setForm({ ...form, results: newResults });
  };

  const addMoreResultRow = () => {
    setForm({ ...form, results: [...form.results, { As_ppb: "", Sb_ppb: "", Al_ppb: "" }] });
  };

  const submitResults = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://hay-card-back-end.vercel.app/api/samples/${selectedSample._id}`,
        {
          results: form.results,
          analysedBy: form.analysedBy,
          completedDate: form.completedDate,
          completedTime: form.completedTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Results saved successfully!");
      setShowForm(false);
      fetchSamples();
    } catch (err) {
      console.error("Error adding results:", err);
      toast.error("Failed to save results");
    }
  };

  const generatePDF = (sample) => {
    const doc = new jsPDF();
    let y = 20; // starting y position

    doc.setFontSize(16);
    doc.text(`Sample Report - ${sample.sampleId}`, 20, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Request Ref: ${sample.requestRefNo}`, 20, y);
    y += 10;
    doc.text(`Sample Ref: ${sample.sampleRefNo}`, 20, y);
    y += 10;
    doc.text(`From: ${Array.isArray(sample.from) ? sample.from.join(", ") : sample.from}`, 20, y);
    y += 10;
    doc.text(`To: ${sample.to}`, 20, y);
    y += 10;
    doc.text(`Route: ${sample.sampleRoute}`, 20, y);
    y += 10;
    doc.text(`Test Method: ${sample.testMethod}`, 20, y);
    y += 10;
    doc.text(`Analysed By: ${sample.analysedBy || "-"}`, 20, y);
    y += 10;
    doc.text(`Completed Date: ${sample.completedDate || "-"}`, 20, y);
    y += 10;
    doc.text(`Completed Time: ${sample.completedTime || "-"}`, 20, y);
    y += 10;
    doc.text(`Created At: ${new Date(sample.createdAt).toLocaleString()}`, 20, y);
    y += 10;

    // Received info
    if (sample.received) {
      doc.text(`Received: Yes`, 20, y);
      y += 10;
      doc.text(`Received Date: ${sample.receivedDate || "-"}`, 20, y);
      y += 10;
      doc.text(`Received Time: ${sample.receivedTime || "-"}`, 20, y);
      y += 10;
    } else {
      doc.text(`Received: No`, 20, y);
      y += 10;
    }

    // Results section
    doc.text("Results:", 20, y);
    y += 10;
    if (sample.results && sample.results.length > 0) {
      sample.results.forEach((r, i) => {
        doc.text(
          `Row ${i + 1} - As: ${r.As_ppb || "-"}, Sb: ${r.Sb_ppb || "-"}, Al: ${r.Al_ppb || "-"}`,
          25,
          y
        );
        y += 10;
      });
    } else {
      doc.text("No results entered.", 25, y);
      y += 10;
    }

    return doc;
  };

  const finalizeSample = async (id) => {
  if (window.confirm("Are you sure you want to finalize this sample? This action cannot be undone.")) {
    try {
      // Get the sample data first
      const sample = samples.find(s => s._id === id);
      if (!sample) {
        toast.error("Sample not found");
        return;
      }

      // 1️⃣ Finalize sample in database
      await axios.put(
        `https://hay-card-back-end.vercel.app/api/samples/${id}`,
        { isFinalized: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2️⃣ Generate PDF and convert to base64
      const pdfDoc = generatePDF(sample);
      const pdfBlob = pdfDoc.output('blob');
      
      // Convert blob to base64 for EmailJS
      const pdfBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Remove data:application/pdf;base64, prefix
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(pdfBlob);
      });

      // 3️⃣ Prepare email parameters
      const templateParams = {
        to_email: "pcf@haycarb.com", // Replace with actual recipient email
        subject: `Sample Finalized - ${sample.sampleId}`,
        message: `
          Sample has been finalized successfully.
          
          Sample Details:
          - Sample ID: ${sample.sampleId}
          - Request Ref: ${sample.requestRefNo}
          - Sample Ref: ${sample.sampleRefNo}
          - From: ${Array.isArray(sample.from) ? sample.from.join(", ") : sample.from}
          - To: ${sample.to}
          - Route: ${sample.sampleRoute}
          - Test Method: ${sample.testMethod}
          - Analysed By: ${sample.analysedBy || "N/A"}
          - Completed Date: ${sample.completedDate || "N/A"}
          
          Please find the detailed report attached as PDF.
        `,
        sample_id: sample.sampleId,
        from_lab: "HayCarb Laboratory",
        attachment: pdfBase64,
        attachment_name: `Sample_${sample.sampleId}_Report.pdf`
      };

      // 4️⃣ Send email using EmailJS (without form data)
      await emailjs.send(
        'service_y3opwg9',
        'template_94e9por',
        templateParams,
        'cqdoVe_FZGHqgnpDW'
      );

      toast.success("Sample finalized and email with PDF sent successfully!");
      fetchSamples();
      
    } catch (err) {
      console.error("Error finalizing sample or sending email:", err);
      
      // More specific error messages
      if (err.response && err.response.status === 400) {
        toast.error("Failed to finalize sample: Invalid data");
      } else if (err.message && err.message.includes("Network Error")) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Failed to finalize sample or send email. Please try again.");
      }
    }
  }
};

  const generateQR = async (sample) => {
    try {
      const url = `https://hay-card-back-end.vercel.app/api/sample-details?id=${sample._id}`; 
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

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Logout successful!");
      setTimeout(() => (window.location.href = "/"), 1000);
    }
  };

  const handleReceivedChange = async (sample, checked) => {
    try {
      await axios.put(
        `https://hay-card-back-end.vercel.app/api/samples/samples/${sample._id}/received`,
        { received: checked },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Sample marked as ${checked ? "received" : "not received"}`);
      fetchSamples();
    } catch (err) {
      console.error("Error updating received status:", err);
      toast.error("Failed to update received status");
    }
  };

  // ... (rest of the component JSX remains exactly the same)
  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>Lab Admin Dashboard</h1>
            <p style={styles.subtitle}>Welcome, {user?.name || "Lab Admin"}</p>
          </div>
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Samples</h2>
            <button style={styles.refreshButton} onClick={fetchSamples} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {loading ? (
            <div style={styles.loading}>Loading samples...</div>
          ) : samples.length === 0 ? (
            <div style={styles.emptyState}>No samples found.</div>
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
                    <th style={styles.tableHeader}>Route</th>
                    <th style={styles.tableHeader}>Test Method</th>
                    <th style={styles.tableHeader}>Results</th>
                    <th style={styles.tableHeader}>Analysed By</th>
                    <th style={styles.tableHeader}>Created</th>
                    <th style={styles.tableHeader}>Received</th>
                    <th style={styles.tableHeader}>Status</th>
                    <th style={styles.tableHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {samples.map((sample) => (
                    <tr key={sample._id} style={styles.tableRow}>
                      <td style={styles.tableCell}>{sample.sampleId}</td>
                      <td style={styles.tableCell}>{sample.requestRefNo}</td>
                      <td style={styles.tableCell}>{sample.sampleRefNo}</td>
                      <td style={styles.tableCell}>
                        {Array.isArray(sample.from) ? sample.from.join(", ") : sample.from}
                      </td>
                      <td style={styles.tableCell}>{sample.to}</td>
                      <td style={styles.tableCell}>{sample.sampleRoute}</td>
                      <td style={styles.tableCell}>{sample.testMethod}</td>
                      <td style={styles.tableCell}>
                        {sample.results
                          ? sample.results.map((r, i) => `Row ${i + 1}: As:${r.As_ppb || "-"}, Sb:${r.Sb_ppb || "-"}, Al:${r.Al_ppb || "-"}`).join(" | ")
                          : "Not Entered"}
                      </td>
                      <td style={styles.tableCell}>{sample.analysedBy || "-"}</td>
                      <td style={styles.tableCell}>{new Date(sample.createdAt).toLocaleDateString()}</td>
                      <td style={styles.tableCell}>
                        <input
                          type="checkbox"
                          checked={sample.received || false}
                          onChange={(e) => handleReceivedChange(sample, e.target.checked)}
                          disabled={sample.isFinalized}
                          style={styles.checkbox}
                        />
                        {sample.received && (
                          <div style={styles.receivedInfo}>
                            {sample.receivedDate} {sample.receivedTime}
                          </div>
                        )}
                      </td>
                      <td style={styles.tableCell}>
                        <span style={sample.isFinalized ? styles.statusFinalized : styles.statusPending}>
                          {sample.isFinalized ? "Finalized" : "Pending"}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={styles.actionContainer}>
                          <button
                            style={{
                              ...styles.button,
                              ...styles.primaryButton,
                              ...(sample.isFinalized && styles.disabledButton)
                            }}
                            onClick={() => handleAddResults(sample)}
                            disabled={sample.isFinalized}
                          >
                            Add Results
                          </button>
                          <button
                            style={{
                              ...styles.button,
                              ...styles.successButton,
                              ...((sample.isFinalized || !sample.results) && styles.disabledButton)
                            }}
                            onClick={() => finalizeSample(sample._id)}
                            disabled={sample.isFinalized || !sample.results}
                          >
                            Finalize
                          </button>
                          <button
                            style={{
                              ...styles.button,
                              ...styles.infoButton,
                              ...(!sample.isFinalized && styles.disabledButton)
                            }}
                            onClick={() => generateQR(sample)}
                            disabled={!sample.isFinalized}
                          >
                            QR Code
                          </button>
                          <button
                            style={{
                              ...styles.button,
                              ...styles.primaryButton
                            }}
                            onClick={() => generatePDF(sample).save(`Sample_${sample.sampleId}.pdf`)}
                          >
                            PDF
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

      {/* Results Form Modal */}
      {showForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {selectedSample?.results ? "Edit Results" : "Add Results"}
              </h3>
              <button
                style={styles.closeButton}
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={submitResults} style={styles.form}>
              <div style={styles.formGrid}>
                {form.results.map((r, idx) => (
                  <React.Fragment key={idx}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>As (ppb) - Row {idx + 1}</label>
                      <input
                        type="number"
                        step="0.01"
                        value={r.As_ppb}
                        onChange={(e) => handleResultChange(idx, "As_ppb", e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Sb (ppb) - Row {idx + 1}</label>
                      <input
                        type="number"
                        step="0.01"
                        value={r.Sb_ppb}
                        onChange={(e) => handleResultChange(idx, "Sb_ppb", e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Al (ppb) - Row {idx + 1}</label>
                      <input
                        type="number"
                        step="0.01"
                        value={r.Al_ppb}
                        onChange={(e) => handleResultChange(idx, "Al_ppb", e.target.value)}
                        style={styles.input}
                      />
                    </div>
                  </React.Fragment>
                ))}
                <div style={{ gridColumn: "1 / -1" }}>
                  <button type="button" style={{ ...styles.submitButton, marginBottom: "1rem" }} onClick={addMoreResultRow}>
                    + Add More Result
                  </button>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Analysed By</label>
                  <input
                    type="text"
                    value={form.analysedBy}
                    onChange={(e) => setForm({ ...form, analysedBy: e.target.value })}
                    style={styles.input}
                    placeholder="Enter analyst name"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Completed Date</label>
                  <input
                    type="date"
                    value={form.completedDate}
                    onChange={(e) => setForm({ ...form, completedDate: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Completed Time</label>
                  <input
                    type="time"
                    value={form.completedTime}
                    onChange={(e) => setForm({ ...form, completedTime: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.formActions}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.submitButton}>
                  Save Results
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ... (styles remain exactly the same)
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    backgroundColor: " #8dc63f",
    color: "white",
    padding: "1rem 0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "600",
  },
  subtitle: {
    margin: "0.25rem 0 0 0",
    color: "#ffffffff",
    fontSize: "0.9rem",
  },
  logoutButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  content: {
    maxWidth: "1200px",
    margin: "2rem auto",
    padding: "0 1rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  cardHeader: {
    padding: "1.5rem",
    borderBottom: "1px solid #ecf0f1",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    margin: 0,
    fontSize: "1.25rem",
    color: "#2c3e50",
  },
  refreshButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  loading: {
    padding: "3rem",
    textAlign: "center",
    color: "#7f8c8d",
  },
  emptyState: {
    padding: "3rem",
    textAlign: "center",
    color: "#95a5a6",
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1000px",
  },
  tableHeader: {
    padding: "1rem",
    textAlign: "left",
    fontWeight: "600",
    color: "#2c3e50",
    fontSize: "0.8rem",
    borderBottom: "2px solid #ecf0f1",
    backgroundColor: "#f8f9fa",
    textTransform: "uppercase",
  },
  tableRow: {
    borderBottom: "1px solid #ecf0f1",
  },
  tableRowHover: {
    backgroundColor: "#f8f9fa",
  },
  tableCell: {
    padding: "1rem",
    fontSize: "0.85rem",
    color: "#2c3e50",
    verticalAlign: "middle",
  },
  checkbox: {
    margin: 0,
  },
  receivedInfo: {
    fontSize: "0.75rem",
    color: "#7f8c8d",
    marginTop: "0.25rem",
  },
  statusFinalized: {
    color: "#27ae60",
    fontWeight: "600",
    fontSize: "0.8rem",
  },
  statusPending: {
    color: "#e67e22",
    fontWeight: "600",
    fontSize: "0.8rem",
  },
  actionContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    minWidth: "120px",
  },
  button: {
    padding: "0.5rem 0.75rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: "500",
  },
  primaryButton: {
    backgroundColor: "#3498db",
    color: "white",
  },
  successButton: {
    backgroundColor: "#27ae60",
    color: "white",
  },
  infoButton: {
    backgroundColor: "#95a5a6",
    color: "white",
  },
  disabledButton: {
    backgroundColor: "#bdc3c7",
    color: "#7f8c8d",
    cursor: "not-allowed",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "1rem",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    width: "100%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflow: "auto",
  },
  modalHeader: {
    padding: "1.5rem",
    borderBottom: "1px solid #ecf0f1",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    margin: 0,
    fontSize: "1.25rem",
    color: "#2c3e50",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#7f8c8d",
    padding: 0,
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    padding: "1.5rem",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "0.5rem",
    fontWeight: "600",
    color: "#2c3e50",
    fontSize: "0.9rem",
  },
  input: {
    padding: "0.75rem",
    border: "1px solid #bdc3c7",
    borderRadius: "4px",
    fontSize: "0.9rem",
  },
  formActions: {
    display: "flex",
    gap: "1rem",
    justifyContent: "flex-end",
  },
  cancelButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "transparent",
    border: "1px solid #bdc3c7",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "500",
    color: "#7f8c8d",
  },
  submitButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "500",
  },
};