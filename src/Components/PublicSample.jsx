import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BACKEND_URL = "https://hay-card-back-end-iota.vercel.app";

export default function PublicSample() {
  const { id } = useParams();
  const [sample, setSample] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSample = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/samples/public/${id}`);
        setSample(res.data);
      } catch (err) {
        console.error(err);
        setSample(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSample();
  }, [id]);

  if (loading) {
    return (
      <div style={{
        fontFamily: 'Poppins, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #e0f7fa, #ffffff)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
          @keyframes wave {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
        `}</style>
        
        <div style={{
          position: 'relative',
          animation: 'float 3s ease-in-out infinite'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '8px solid #e0f7fa',
            borderTop: '8px solid #00796b',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            position: 'relative',
            boxShadow: '0 0 30px rgba(0, 121, 107, 0.3)'
          }} />
          
          <div style={{
            width: '60px',
            height: '60px',
            border: '6px solid transparent',
            borderTop: '6px solid #00897b',
            borderRadius: '50%',
            animation: 'spin 1.5s linear infinite reverse',
            position: 'absolute',
            top: '10px',
            left: '10px'
          }} />
        </div>
        
        <div style={{
          marginTop: '30px',
          fontSize: '18px',
          color: '#00796b',
          fontWeight: '600',
          animation: 'pulse 2s ease-in-out infinite',
          textShadow: '1px 1px 3px rgba(0,0,0,0.1)'
        }}>
          Loading Sample Details
        </div>
        
        <div style={{
          marginTop: '15px',
          width: '200px',
          height: '4px',
          background: '#e0f7fa',
          borderRadius: '2px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, #00796b, transparent)',
            animation: 'wave 1.5s ease-in-out infinite'
          }} />
        </div>
      </div>
    );
  }

  if (!sample) {
    return (
      <div style={{
        fontFamily: 'Poppins, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #e0f7fa, #ffffff)'
      }}>
        <p style={{
          textAlign: 'center',
          fontSize: '20px',
          color: '#d32f2f',
          fontWeight: '600',
          padding: '30px',
          background: '#fff',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
          Sample not found.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'Poppins, sans-serif',
      background: 'linear-gradient(135deg, #e0f7fa, #ffffff)',
      padding: '20px',
      minHeight: '100vh',
      color: '#333',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      animation: 'fadeIn 0.8s ease-in-out'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.15);
        }
        .row-hover:hover {
          background: #b2dfdb !important;
          transform: scale(1.02);
        }
      `}</style>

      <h2 style={{
        color: '#00796b',
        marginBottom: '20px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
        fontSize: '32px',
        fontWeight: '700',
        animation: 'scaleIn 0.6s ease-in-out',
        background: 'linear-gradient(135deg, #00796b, #00897b)',
        backgroundSize: '200% 200%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Sample Details - {sample.sampleId}
      </h2>

      <div className="card-hover" style={{
        background: '#fff',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '650px',
        marginBottom: '40px',
        transition: 'all 0.3s ease-in-out',
        animation: 'fadeIn 0.8s ease-in-out',
        border: '1px solid rgba(0, 121, 107, 0.1)'
      }}>
        {[
          ["Request Ref No", sample.requestRefNo],
          ["Sample Ref No", sample.sampleRefNo],
          ["From", sample.from.join(", ")],
          ["To", sample.to],
          ["Route", sample.sampleRoute],
          ["Test Method", sample.testMethod],
          ["Remarks", sample.remarks],
          ["Analysed By", sample.analysedBy],
          ["Created At", new Date(sample.createdAt).toLocaleString()],
          ["Completed Date", sample.completedDate],
          ["Completed Time", sample.completedTime]
        ].map(([label, value], i) => (
          <p key={i} style={{
            margin: '12px 0',
            fontSize: '16px',
            animation: `slideIn 0.5s ease ${(i + 1) * 0.08}s backwards`,
            padding: '10px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            borderLeft: '4px solid #00796b'
          }}>
            <strong style={{ color: '#00796b' }}>{label}:</strong>{' '}
            <span style={{ color: '#555' }}>{value || "-"}</span>
          </p>
        ))}
      </div>

      <h3 style={{
        marginBottom: '20px',
        color: '#00796b',
        textShadow: '1px 1px 3px rgba(0,0,0,0.2)',
        fontSize: '26px',
        fontWeight: '700',
        animation: 'scaleIn 0.8s ease-in-out'
      }}>
        Results
      </h3>

      {sample.results && sample.results.length > 0 ? (
        <div style={{
          width: '100%',
          maxWidth: '650px',
          animation: 'fadeIn 1s ease-in-out',
          overflowX: 'auto'
        }}>
          <table style={{
            borderCollapse: 'collapse',
            width: '100%',
            boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
            borderRadius: '15px',
            overflow: 'hidden',
            background: '#fff'
          }}>
            <thead>
              <tr style={{
                background: 'linear-gradient(135deg, #00796b, #00897b)',
                color: '#fff',
                textAlign: 'center'
              }}>
                <th style={{ padding: '15px', fontSize: '16px', fontWeight: '700' }}>#</th>
                <th style={{ padding: '15px', fontSize: '16px', fontWeight: '700' }}>As (ppb)</th>
                <th style={{ padding: '15px', fontSize: '16px', fontWeight: '700' }}>Sb (ppb)</th>
                <th style={{ padding: '15px', fontSize: '16px', fontWeight: '700' }}>Al (ppb)</th>
              </tr>
            </thead>
            <tbody>
              {sample.results.map((r, i) => (
                <tr key={i} className="row-hover" style={{
                  background: i % 2 === 0 ? '#e0f7fa' : '#ffffff',
                  transition: 'all 0.3s ease',
                  animation: `slideIn 0.4s ease ${(i + 1) * 0.1}s backwards`
                }}>
                  <td style={{
                    textAlign: 'center',
                    padding: '12px',
                    border: '1px solid #b2dfdb',
                    fontWeight: '600',
                    color: '#00796b'
                  }}>
                    {i + 1}
                  </td>
                  <td style={{
                    textAlign: 'center',
                    padding: '12px',
                    border: '1px solid #b2dfdb',
                    color: '#555'
                  }}>
                    {r.As_ppb}
                  </td>
                  <td style={{
                    textAlign: 'center',
                    padding: '12px',
                    border: '1px solid #b2dfdb',
                    color: '#555'
                  }}>
                    {r.Sb_ppb}
                  </td>
                  <td style={{
                    textAlign: 'center',
                    padding: '12px',
                    border: '1px solid #b2dfdb',
                    color: '#555'
                  }}>
                    {r.Al_ppb}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{
          fontSize: '18px',
          color: '#666',
          padding: '20px',
          background: '#fff',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          animation: 'fadeIn 0.8s ease-in-out'
        }}>
          No results found.
        </p>
      )}
    </div>
  );
}