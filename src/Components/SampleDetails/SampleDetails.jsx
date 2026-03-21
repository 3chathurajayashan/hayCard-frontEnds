import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
        // Ensure always a safe object
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

  if (loading) return <div style={{ padding: 30 }}>Loading...</div>;
  if (!data || Object.keys(data).length === 0) return <div style={{ padding: 30 }}>Gate Pass not found.</div>;

  // Safe handling for arrays / undefined
  const from = Array.isArray(data.from) ? data.from.join(", ") : (data.from ?? "N/A");
  const to = Array.isArray(data.to) ? data.to.join(", ") : (data.to ?? "N/A");
  const samples = Array.isArray(data.samples) ? data.samples : [];

  return (
    <div style={{
      padding: 30,
      fontFamily: "Poppins, sans-serif",
      maxWidth: 900,
      margin: "40px auto",
      background: "#f7f9fc",
      borderRadius: 12,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ color: "#00796b", marginBottom: 20 }}>
        Gate Pass {data.gatePassNo ?? "N/A"}
      </h2>

      <p><b>Request Ref No:</b> {data.requestRefNo ?? "N/A"}</p>
      <p><b>Date:</b> {data.sampleInDate ?? "N/A"}</p>
      <p><b>From:</b> {from}</p>
      <p><b>To:</b> {to}</p>
      <p><b>Created By:</b> {data.createdBy?.name ?? "N/A"} ({data.createdBy?.email ?? "N/A"})</p>
      <p><b>Assigned To:</b> {data.assignedTo?.name ?? "N/A"} ({data.assignedTo?.email ?? "N/A"})</p>

      <h3 style={{ marginTop: 30, color: "#004d40" }}>Samples</h3>
      {samples.length > 0 ? (
        samples.map((s, i) => (
          <div key={i} style={{
            padding: 12,
            marginBottom: 12,
            background: "#ffffff",
            borderRadius: 8,
            border: "1px solid #e0e0e0"
          }}>
            <p><b>Sample ID:</b> {s?.sampleId ?? "N/A"}</p>
            <p><b>Test Method:</b> {s?.testMethod ?? "N/A"}</p>
            <p><b>Remarks:</b> {s?.remarks ?? "N/A"}</p>
          </div>
        ))
      ) : (
        <p>No samples available.</p>
      )}
    </div>
  );
}