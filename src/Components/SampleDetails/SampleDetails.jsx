import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ViewGatePass() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`https://hay-card-back-end-iota.vercel.app/api/samples/public/${id}`)
      .then(res => res.json())
      .then(res => setData(res.data));
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return (
    <div style={{ padding: 30 }}>
      <h2>Gate Pass {data.gatePassNo}</h2>

      <p><b>Request:</b> {data.requestRefNo}</p>
      <p><b>Date:</b> {data.sampleInDate}</p>

      {data.samples.map((s,i)=>(
        <div key={i}>
          {s.sampleId} - {s.testMethod}
        </div>
      ))}
    </div>
  );
}