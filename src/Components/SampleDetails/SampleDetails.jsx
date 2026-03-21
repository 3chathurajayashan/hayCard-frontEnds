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
      maxWidth: 1000,
      margin: "40px auto",
      background: "#f7f9fc",
      borderRadius: 12,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ color: "#00796b", marginBottom: 20 }}>
        Gate Pass {data.gatePassNo ?? "N/A"}
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <p><b>Request Ref No:</b> {data.requestRefNo ?? "N/A"}</p>
        <p><b>Sample Ref No:</b> {data.sampleRefNo ?? "N/A"}</p>
        <p><b>Date In:</b> {data.sampleInDate ?? "N/A"} {data.sampleInTime ?? ""}</p>
        <p><b>Received:</b> {data.received ? "Yes" : "No"}</p>
        <p><b>From:</b> {from}</p>
        <p><b>To:</b> {to}</p>
        <p><b>Sample Route:</b> {data.sampleRoute ?? "N/A"}</p>
        <p><b>Remarks:</b> {data.remarks ?? "N/A"}</p>
        <p><b>Created By:</b> {data.createdBy?.name ?? "N/A"} ({data.createdBy?.email ?? "N/A"})</p>
        <p><b>Assigned To:</b> {data.assignedTo?.name ?? "N/A"} ({data.assignedTo?.email ?? "N/A"})</p>
        <p><b>Finalized:</b> {data.isFinalized ? "Yes" : "No"}</p>
        <p><b>Received Date/Time:</b> {data.receivedDate ?? "N/A"} {data.receivedTime ?? ""}</p>
      </div>

      <h3 style={{ marginTop: 30, color: "#004d40" }}>Samples</h3>
      {samples.length > 0 ? (
        samples.map((s, i) => (
          <div key={i} style={{
            padding: 16,
            marginBottom: 16,
            background: "#ffffff",
            borderRadius: 8,
            border: "1px solid #e0e0e0"
          }}>
            <p><b>Sample ID:</b> {s?.sampleId ?? "N/A"}</p>
            <p><b>Test Method:</b> {s?.testMethod ?? "N/A"}</p>
            <p><b>Unit Number:</b> {s?.unitNumber ?? "N/A"}</p>
            <p><b>Analysed By:</b> {s?.analysedBy ?? "N/A"}</p>
            <p><b>Completed:</b> {s?.completedDate ?? "N/A"} {s?.completedTime ?? ""}</p>
            <p><b>Remarks:</b> {s?.remarks ?? "N/A"}</p>

            {s?.results && Object.keys(s.results).length > 0 && (
              <div style={{ marginTop: 8, padding: 8, background: "#f0f0f0", borderRadius: 6 }}>
                <p style={{ fontWeight: 600 }}>Results:</p>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                  {Object.entries(s.results).map(([key, value], idx) => (
                    <li key={idx}><b>{key}:</b> {value}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No samples available.</p>
      )}
    </div>
  );
}