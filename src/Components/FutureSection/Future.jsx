"use client";
import React, { useEffect, useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useNavigate } from "react-router-dom";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Future() {
  const navigate = useNavigate();
  const [carbonPrice, setCarbonPrice] = useState([50, 55, 60, 58, 62, 65, 70]);
  const [haycarbPerformance, setHaycarbPerformance] = useState([100, 110, 120, 115, 130, 125, 140]);
  const [competitors, setCompetitors] = useState([
    { name: "Charcoal Inc", value: 120 },
    { name: "CarbonX", value: 95 },
    { name: "EcoCarbon", value: 110 },
  ]);

  const [news, setNews] = useState([
    {
      title: "Global Carbon Prices Surge Amid Climate Policies",
      date: "2025-12-01",
      image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=450&q=80",
      description: "Carbon prices globally have surged due to new climate policies and emission reduction targets set by governments worldwide.",
      link: "https://www.reuters.com/business/environment/global-carbon-prices-surge-2025-12-01/",
      source: "Reuters"
    },
    {
      title: "Haycarb PLC Reports Record Revenue in Q3 2025",
      date: "2025-11-28",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=450&q=80",
      description: "Haycarb PLC reports its highest revenue yet for Q3 2025, showing strong performance in the carbon industry sector.",
      link: "https://www.haycarb.com/news/q3-2025-results",
      source: "Business Times"
    },
    {
      title: "Competitors Invest in Eco-Friendly Carbon Production",
      date: "2025-11-25",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=450&q=80",
      description: "Leading carbon industry competitors are investing heavily in eco-friendly carbon production to meet global sustainability goals.",
      link: "https://www.carbonnews.com/competitors-eco-investments-2025",
      source: "Carbon News"
    },
  ]);

  // Simulate real-time carbon price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCarbonPrice((prev) => {
        const newPrice = prev[prev.length - 1] + (Math.random() * 4 - 2);
        return [...prev.slice(1), parseFloat(newPrice.toFixed(2))];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Chart data
  const carbonData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Carbon Price ($/ton)",
        data: carbonPrice,
        borderColor: "#2E7D32",
        backgroundColor: "rgba(46, 125, 50, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#1B5E20",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const haycarbData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Haycarb PLC Performance",
        data: haycarbPerformance,
        backgroundColor: "#FF9800",
        borderColor: "#F57C00",
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: "#F57C00",
      },
    ],
  };

  const competitorsData = {
    labels: competitors.map((c) => c.name),
    datasets: [
      {
        label: "Market Value (USD)",
        data: competitors.map((c) => c.value),
        backgroundColor: [
          "rgba(33, 150, 243, 0.8)",
          "rgba(233, 30, 99, 0.8)",
          "rgba(156, 39, 176, 0.8)"
        ],
        borderColor: [
          "#2196F3",
          "#E91E63",
          "#9C27B0"
        ],
        borderWidth: 1,
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top', // fixed here
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          size: 12
        },
        bodyFont: {
          size: 11
        }
      }
    }
  };

  return (
    <div
      style={{
        padding: "24px",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        background: "#F8FAFC",
        minHeight: "100vh",
        color: "#1E293B",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "10px 20px",
            background: "#1E293B",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "background 0.2s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#334155"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#1E293B"}
        >
          <span style={{ fontSize: "18px" }}>←</span> Back to Dashboard
        </button>
        
        <h1 style={{ 
          fontSize: "28px", 
          fontWeight: "600", 
          color: "#1E293B",
          margin: 0 
        }}>
          Carbon Market Intelligence
        </h1>
        
        <div style={{ width: "120px" }}></div>
      </div>

      {/* Key Metrics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        {/* Current Carbon Price */}
        <div
          style={{
            background: "#FFFFFF",
            padding: "24px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            borderLeft: "4px solid #2E7D32",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              background: "#E8F5E9",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px"
            }}>
              <span style={{ fontSize: "20px", color: "#2E7D32" }}>$</span>
            </div>
            <h3 style={{ margin: 0, fontSize: "16px", color: "#64748B", fontWeight: "500" }}>
              Current Carbon Price
            </h3>
          </div>
          <p style={{ fontSize: "32px", fontWeight: "600", color: "#1E293B", margin: "4px 0" }}>
            ${carbonPrice[carbonPrice.length - 1] || 0}
            <span style={{ fontSize: "14px", color: "#64748B", fontWeight: "400", marginLeft: "4px" }}>
              /ton
            </span>
          </p>
          <p style={{ fontSize: "12px", color: "#2E7D32", margin: 0 }}>
            ▲ 2.4% from last month
          </p>
        </div>

        {/* Haycarb PLC Value */}
        <div
          style={{
            background: "#FFFFFF",
            padding: "24px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            borderLeft: "4px solid #FF9800",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              background: "#FFF3E0",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px"
            }}>
              <span style={{ fontSize: "20px", color: "#FF9800" }}>↑</span>
            </div>
            <h3 style={{ margin: 0, fontSize: "16px", color: "#64748B", fontWeight: "500" }}>
              Haycarb PLC Value
            </h3>
          </div>
          <p style={{ fontSize: "32px", fontWeight: "600", color: "#1E293B", margin: "4px 0" }}>
            {haycarbPerformance[haycarbPerformance.length - 1] || 0}
            <span style={{ fontSize: "14px", color: "#64748B", fontWeight: "400", marginLeft: "4px" }}>
              USD
            </span>
          </p>
          <p style={{ fontSize: "12px", color: "#FF9800", margin: 0 }}>
            ▲ 3.1% quarterly growth
          </p>
        </div>

        {/* Competitors */}
        <div
          style={{
            background: "#FFFFFF",
            padding: "24px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            borderLeft: "4px solid #2196F3",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              background: "#E3F2FD",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px"
            }}>
              <span style={{ fontSize: "20px", color: "#2196F3" }}>▼</span>
            </div>
            <h3 style={{ margin: 0, fontSize: "16px", color: "#64748B", fontWeight: "500" }}>
              Market Competitors
            </h3>
          </div>
          <div style={{ marginTop: "8px" }}>
            {competitors.map((c) => (
              <div key={c.name} style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                margin: "6px 0",
                paddingBottom: "6px",
                borderBottom: "1px solid #F1F5F9"
              }}>
                <span style={{ fontSize: "14px", color: "#475569" }}>{c.name}</span>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#1E293B" }}>${c.value}M</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "24px",
          marginBottom: "40px",
        }}
      >
        {/* Carbon Price Chart */}
        <div
          style={{
            background: "#FFFFFF",
            padding: "24px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#1E293B" }}>
              Carbon Price Trend (Live)
            </h3>
            <div style={{
              padding: "4px 12px",
              background: "#E8F5E9",
              borderRadius: "12px",
              fontSize: "12px",
              color: "#2E7D32",
              fontWeight: "500"
            }}>
              Live
            </div>
          </div>
          <div style={{ height: "280px" }}>
            <Line data={carbonData} options={chartOptions} />
          </div>
        </div>

        {/* Haycarb Performance Chart */}
        <div
          style={{
            background: "#FFFFFF",
            padding: "24px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600", color: "#1E293B" }}>
            Haycarb PLC Performance
          </h3>
          <div style={{ height: "280px" }}>
            <Bar data={haycarbData} options={chartOptions} />
          </div>
        </div>

        {/* Competitors Doughnut */}
        <div
          style={{
            background: "#FFFFFF",
            padding: "24px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600", color: "#1E293B" }}>
            Competitors Market Share
          </h3>
          <div style={{ height: "280px", position: "relative" }}>
            <Doughnut 
              data={competitorsData} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    position: 'right',
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* News Section */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#1E293B", margin: 0 }}>
            Industry News & Updates
          </h2>
          <button
            style={{
              padding: "8px 16px",
              background: "transparent",
              color: "#475569",
              border: "1px solid #E2E8F0",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#F8FAFC";
              e.currentTarget.style.borderColor = "#CBD5E1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "#E2E8F0";
            }}
          >
            View All News →
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          {news.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "#FFFFFF",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                overflow: "hidden",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
              }}
              onClick={() => window.open(item.link, "_blank")}
            >
              <img src={item.image} alt={item.title} style={{ width: "100%", height: "160px", objectFit: "cover" }} />
              <div style={{ padding: "16px" }}>
                <p style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "6px" }}>{item.date} • {item.source}</p>
                <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "#1E293B" }}>{item.title}</h3>
                <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.5" }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
