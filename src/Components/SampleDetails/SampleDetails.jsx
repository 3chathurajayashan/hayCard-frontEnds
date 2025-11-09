import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useSearchParams } from "react-router-dom";

const BACKEND_URL = "https://hay-card-back-end.vercel.app";

export default function SampleDetails() {
  const [sample, setSample] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Get ID from query params (for QR scan or manual access)
  const id = searchParams.get("id") || location.pathname.split("/").pop();

  useEffect(() => {
    const fetchSample = async () => {
      if (!id) {
        setError("Sample ID not provided");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`https://hay-card-back-end-iota.vercel.app/api/samples/public/${id}`);
        setSample(res.data);
      } catch (err) {
        console.error("Error fetching sample:", err);
        setError("Failed to fetch sample data.");
        setSample(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSample();
  }, [id]);

  if (loading) return <p>Loading sample details...</p>;
  if (error) return <p>{error}</p>;
  if (!sample) return <p>Sample not found.</p>;

  const formatDate = (dateStr) => (dateStr ? new Date(dateStr).toLocaleString() : "-");

  return (
    <div>
      <h2>Sample Details</h2>
      <p><strong>Sample Reference Nos:</strong> {sample.sampleRefNo || "-"}</p>
      <p><strong>Request Reference No:</strong> {sample.requestRefNo || "-"}</p>
      <p><strong>From:</strong> {Array.isArray(sample.from) ? sample.from.join(", ") : sample.from || "-"}</p>
      <p><strong>To:</strong> {sample.to || "-"}</p>
      <p><strong>Route:</strong> {sample.sampleRoute || "-"}</p>
      <p><strong>Test Method:</strong> {sample.testMethod || "-"}</p>
      <p><strong>Remarks:</strong> {sample.remarks || "-"}</p>
      <p><strong>Analysed By:</strong> {sample.analysedBy || "-"}</p>

      {/* ✅ Added completion date and time fields */}
      <p><strong>Completion Date:</strong> {sample.completedDate || "-"}</p>
      <p><strong>Completion Time:</strong> {sample.completedTime || "-"}</p>

      <p><strong>Created At:</strong> {formatDate(sample.createdAt)}</p>
      <p><strong>Received:</strong> {sample.received ? "Yes" : "No"}</p>

      {sample.received && (
        <>
          <p><strong>Received Date:</strong> {sample.receivedDate || sample.sampleReceivedDate || "-"}</p>
          <p><strong>Received Time:</strong> {sample.receivedTime || sample.sampleReceivedTime || "-"}</p>
        </>
      )}

      {sample.status && <p><strong>Status:</strong> {sample.status}</p>}
      {sample.assignedLab && <p><strong>Assigned Lab:</strong> {sample.assignedLab}</p>}

      <h3>Results</h3>
      {sample.results && sample.results.length > 0 ? (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>#</th>
              <th>As (ppb)</th>
              <th>Sb (ppb)</th>
              <th>Al (ppb)</th>
            </tr>
          </thead>
          <tbody>
            {sample.results.map((r, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{r.As_ppb ?? "-"}</td>
                <td>{r.Sb_ppb ?? "-"}</td>
                <td>{r.Al_ppb ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}
