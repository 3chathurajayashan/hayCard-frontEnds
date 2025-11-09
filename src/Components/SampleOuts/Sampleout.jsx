import React, { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = "https://hay-card-back-end.vercel.app"; // <-- your backend hosted link

export default function ReferenceFinalize() {
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch all references
  const fetchReferences = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/reference`);
      setReferences(res.data);
    } catch (error) {
      console.error("Error fetching references:", error);
    }
  };

  // ✅ Handle finalize checkbox
  const handleFinalize = async (id, checked) => {
    if (!checked) return; // only finalize when checked
    try {
      setLoading(true);
      const res = await axios.post(`${BACKEND_URL}/api/reference/sample-out`, { id });
      setMessage(`✅ Reference ${res.data.reference.refNumber} finalized successfully.`);
      fetchReferences(); // refresh list
    } catch (error) {
      console.error("Error finalizing sample:", error);
      setMessage("❌ Failed to finalize reference.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  useEffect(() => {
    fetchReferences();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Finalize References</h2>

      {message && <p style={styles.message}>{message}</p>}

      {loading && <p style={styles.loading}>Processing...</p>}

      <div style={styles.list}>
        {references.length === 0 ? (
          <p>No references found.</p>
        ) : (
          references.map((ref) => (
            <div key={ref._id} style={styles.card}>
              <div style={styles.info}>
                <p><strong>Reference No:</strong> {ref.refNumber}</p>
                <p><strong>Status:</strong> {ref.sampleOut ? "✅ Finalized" : "Pending"}</p>
              </div>

              <input
                type="checkbox"
                checked={ref.sampleOut}
                disabled={ref.sampleOut}
                onChange={(e) => handleFinalize(ref._id, e.target.checked)}
                style={styles.checkbox}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Simple CSS styles
const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    background: "#f8f9fa",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  info: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  checkbox: {
    width: "20px",
    height: "20px",
  },
  message: {
    textAlign: "center",
    color: "green",
    fontWeight: "bold",
  },
  loading: {
    textAlign: "center",
    color: "#555",
  },
};
