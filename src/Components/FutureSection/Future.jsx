"use client";
import React, { useEffect, useState } from "react";
import { Line, Bar, Doughnut, Radar } from "react-chartjs-2";
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
  RadialLinearScale,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

export default function Future() {
  const [carbonPrice, setCarbonPrice] = useState([50, 55, 60, 58, 62, 65, 70]);
  const [haycarbPerformance, setHaycarbPerformance] = useState([100, 110, 120, 115, 130, 125, 140]);
  const [competitors, setCompetitors] = useState([
    { name: "Charcoal Inc", value: 120, trend: 2.4, growth: 15 },
    { name: "CarbonX", value: 95, trend: -1.2, growth: -5 },
    { name: "EcoCarbon", value: 110, trend: 1.8, growth: 8 },
  ]);
  const [marketVolume, setMarketVolume] = useState(2450);
  const [tradingActivity, setTradingActivity] = useState([65, 72, 68, 75, 70, 78, 82]);
  const [priceVolatility, setPriceVolatility] = useState(4.2);
  const [regionalData, setRegionalData] = useState([42, 35, 28, 45, 38]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const [news] = useState([
    {
      title: "Global Carbon Prices Surge Amid Climate Policies",
      date: "2025-12-01",
      image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=450&q=80",
      description: "Carbon prices globally have surged due to new climate policies and emission reduction targets.",
      link: "https://www.reuters.com/business/environment/",
      source: "Reuters"
    },
    {
      title: "Haycarb PLC Reports Record Revenue in Q3 2025",
      date: "2025-11-28",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=450&q=80",
      description: "Haycarb PLC reports its highest revenue yet for Q3 2025, showing strong performance.",
      link: "https://www.haycarb.com/",
      source: "Business Times"
    },
    {
      title: "Competitors Invest in Eco-Friendly Carbon Production",
      date: "2025-11-25",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=450&q=80",
      description: "Leading carbon industry competitors investing in eco-friendly production.",
      link: "https://www.carbonnews.com/",
      source: "Carbon News"
    },
  ]);

  useEffect(() => {
    const priceInterval = setInterval(() => {
      setCarbonPrice((prev) => {
        const newPrice = prev[prev.length - 1] + (Math.random() * 4 - 2);
        return [...prev.slice(1), parseFloat(newPrice.toFixed(2))];
      });
      
      setHaycarbPerformance((prev) => {
        const newValue = prev[prev.length - 1] + (Math.random() * 10 - 4);
        return [...prev.slice(1), parseFloat(newValue.toFixed(2))];
      });

      setTradingActivity((prev) => {
        const newActivity = prev[prev.length - 1] + (Math.random() * 8 - 4);
        return [...prev.slice(1), Math.max(0, parseFloat(newActivity.toFixed(1)))];
      });

      setMarketVolume(prev => parseFloat((prev + (Math.random() * 100 - 50)).toFixed(0)));
      setPriceVolatility(parseFloat((Math.random() * 6 + 2).toFixed(1)));
      
      setCompetitors(prev => prev.map(c => ({
        ...c,
        value: parseFloat((c.value + (Math.random() * 4 - 2)).toFixed(1)),
        trend: parseFloat((Math.random() * 5 - 2.5).toFixed(1)),
      })));

      setRegionalData(prev => prev.map(val => 
        Math.max(0, parseFloat((val + (Math.random() * 6 - 3)).toFixed(1)))
      ));

      setLastUpdate(new Date());
    }, 2500);

    return () => clearInterval(priceInterval);
  }, []);

  const carbonData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [{
      label: "Carbon Price ($/ton)",
      data: carbonPrice,
      borderColor: "#10B981",
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      tension: 0.4,
      fill: true,
      pointBackgroundColor: "#059669",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
    }],
  };

  const haycarbData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [{
      label: "Haycarb PLC Performance",
      data: haycarbPerformance,
      backgroundColor: "rgba(251, 146, 60, 0.8)",
      borderColor: "#F97316",
      borderWidth: 2,
      borderRadius: 8,
      hoverBackgroundColor: "#EA580C",
    }],
  };

  const competitorsData = {
    labels: competitors.map((c) => c.name),
    datasets: [{
      label: "Market Value (USD)",
      data: competitors.map((c) => c.value),
      backgroundColor: [
        "rgba(59, 130, 246, 0.8)",
        "rgba(236, 72, 153, 0.8)",
        "rgba(168, 85, 247, 0.8)"
      ],
      borderColor: ["#3B82F6", "#EC4899", "#A855F7"],
      borderWidth: 2,
      hoverOffset: 12,
    }],
  };

  const tradingData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      label: "Trading Volume",
      data: tradingActivity,
      borderColor: "#8B5CF6",
      backgroundColor: "rgba(139, 92, 246, 0.2)",
      tension: 0.4,
      fill: true,
      pointBackgroundColor: "#7C3AED",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 4,
    }],
  };

  const regionalRadarData = {
    labels: ["North America", "Europe", "Asia Pacific", "Middle East", "Latin America"],
    datasets: [{
      label: "Market Share %",
      data: regionalData,
      backgroundColor: "rgba(34, 197, 94, 0.2)",
      borderColor: "#22C55E",
      borderWidth: 2,
      pointBackgroundColor: "#16A34A",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "#22C55E",
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 12, family: "'Inter', sans-serif" },
          padding: 15,
          usePointStyle: true,
          color: '#94A3B8',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { size: 13, family: "'Inter', sans-serif" },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { font: { size: 11 }, color: '#94A3B8' }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 }, color: '#94A3B8' }
      }
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 750, easing: 'easeInOutQuart' },
    plugins: { legend: { display: false } },
    scales: {
      r: {
        beginAtZero: true,
        max: 50,
        ticks: { stepSize: 10, font: { size: 10 }, color: '#94A3B8' },
        pointLabels: { font: { size: 11, family: "'Inter', sans-serif" }, color: '#94A3B8' },
        grid: { color: 'rgba(148, 163, 184, 0.2)' },
        angleLines: { color: 'rgba(148, 163, 184, 0.2)' }
      }
    }
  };

  return (
    <div style={{
      padding: "28px",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
      minHeight: "100vh",
      color: "#F8FAFC",
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "32px",
        padding: "20px 24px",
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}>
        <div>
          <h1 style={{ 
            fontSize: "32px", 
            fontWeight: "700", 
            color: "#F8FAFC",
            margin: "0 0 8px 0",
            background: "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Carbon Market Intelligence
          </h1>
          <p style={{
            margin: 0,
            fontSize: "14px",
            color: "#94A3B8",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <span style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              background: "#10B981",
              borderRadius: "50%",
              animation: "pulse 2s infinite",
            }}></span>
            Live Data - Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        
        <div style={{
          padding: "8px 16px",
          background: "rgba(16, 185, 129, 0.1)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          borderRadius: "8px",
          fontSize: "13px",
          color: "#10B981",
          fontWeight: "600",
        }}>
          Market Open
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "20px",
        marginBottom: "32px",
      }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)",
          padding: "24px",
          borderRadius: "16px",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          position: "relative",
          overflow: "hidden",
          transition: "transform 0.3s ease",
        }}>
          <div style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "100px",
            height: "100px",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}></div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "12px", position: "relative", zIndex: 1 }}>
            <div style={{
              width: "48px",
              height: "48px",
              background: "rgba(16, 185, 129, 0.15)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px",
              border: "1px solid rgba(16, 185, 129, 0.3)",
            }}>
              <span style={{ fontSize: "24px", color: "#10B981" }}>$</span>
            </div>
            <h3 style={{ margin: 0, fontSize: "15px", color: "#94A3B8", fontWeight: "500" }}>
              Current Carbon Price
            </h3>
          </div>
          <p style={{ fontSize: "36px", fontWeight: "700", color: "#F8FAFC", margin: "8px 0", position: "relative", zIndex: 1 }}>
            ${carbonPrice[carbonPrice.length - 1]?.toFixed(2) || 0}
            <span style={{ fontSize: "16px", color: "#64748B", fontWeight: "400", marginLeft: "6px" }}>/ton</span>
          </p>
          <p style={{ fontSize: "13px", color: "#10B981", margin: 0, fontWeight: "600", position: "relative", zIndex: 1 }}>
            +2.4% from last month
          </p>
        </div>

        <div style={{
          background: "linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(249, 115, 22, 0.05) 100%)",
          padding: "24px",
          borderRadius: "16px",
          border: "1px solid rgba(251, 146, 60, 0.2)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "100px",
            height: "100px",
            background: "radial-gradient(circle, rgba(251, 146, 60, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}></div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "12px", position: "relative", zIndex: 1 }}>
            <div style={{
              width: "48px",
              height: "48px",
              background: "rgba(251, 146, 60, 0.15)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px",
              border: "1px solid rgba(251, 146, 60, 0.3)",
            }}>
              <span style={{ fontSize: "24px", color: "#FB923C" }}>↑</span>
            </div>
            <h3 style={{ margin: 0, fontSize: "15px", color: "#94A3B8", fontWeight: "500" }}>
              Haycarb PLC Value
            </h3>
          </div>
          <p style={{ fontSize: "36px", fontWeight: "700", color: "#F8FAFC", margin: "8px 0", position: "relative", zIndex: 1 }}>
            {haycarbPerformance[haycarbPerformance.length - 1]?.toFixed(2) || 0}
            <span style={{ fontSize: "16px", color: "#64748B", fontWeight: "400", marginLeft: "6px" }}>USD</span>
          </p>
          <p style={{ fontSize: "13px", color: "#FB923C", margin: 0, fontWeight: "600", position: "relative", zIndex: 1 }}>
            +3.1% quarterly growth
          </p>
        </div>

        <div style={{
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)",
          padding: "24px",
          borderRadius: "16px",
          border: "1px solid rgba(139, 92, 246, 0.2)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "100px",
            height: "100px",
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}></div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "12px", position: "relative", zIndex: 1 }}>
            <div style={{
              width: "48px",
              height: "48px",
              background: "rgba(139, 92, 246, 0.15)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px",
              border: "1px solid rgba(139, 92, 246, 0.3)",
            }}>
              <span style={{ fontSize: "24px", color: "#8B5CF6" }}>≋</span>
            </div>
            <h3 style={{ margin: 0, fontSize: "15px", color: "#94A3B8", fontWeight: "500" }}>
              Market Volume
            </h3>
          </div>
          <p style={{ fontSize: "36px", fontWeight: "700", color: "#F8FAFC", margin: "8px 0", position: "relative", zIndex: 1 }}>
            {marketVolume}
            <span style={{ fontSize: "16px", color: "#64748B", fontWeight: "400", marginLeft: "6px" }}>M</span>
          </p>
          <p style={{ fontSize: "13px", color: "#8B5CF6", margin: 0, fontWeight: "600", position: "relative", zIndex: 1 }}>
            24h trading volume
          </p>
        </div>

        <div style={{
          background: "linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(219, 39, 119, 0.05) 100%)",
          padding: "24px",
          borderRadius: "16px",
          border: "1px solid rgba(236, 72, 153, 0.2)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "100px",
            height: "100px",
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}></div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "12px", position: "relative", zIndex: 1 }}>
            <div style={{
              width: "48px",
              height: "48px",
              background: "rgba(236, 72, 153, 0.15)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px",
              border: "1px solid rgba(236, 72, 153, 0.3)",
            }}>
              <span style={{ fontSize: "24px", color: "#EC4899" }}>~</span>
            </div>
            <h3 style={{ margin: 0, fontSize: "15px", color: "#94A3B8", fontWeight: "500" }}>
              Volatility Index
            </h3>
          </div>
          <p style={{ fontSize: "36px", fontWeight: "700", color: "#F8FAFC", margin: "8px 0", position: "relative", zIndex: 1 }}>
            {priceVolatility.toFixed(1)}
            <span style={{ fontSize: "16px", color: "#64748B", fontWeight: "400", marginLeft: "6px" }}>%</span>
          </p>
          <p style={{ fontSize: "13px", color: "#EC4899", margin: 0, fontWeight: "600", position: "relative", zIndex: 1 }}>
            Medium volatility
          </p>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
        gap: "24px",
        marginBottom: "32px",
      }}>
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          padding: "24px",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#F8FAFC" }}>
              Carbon Price Trend
            </h3>
            <div style={{
              padding: "6px 14px",
              background: "rgba(16, 185, 129, 0.15)",
              borderRadius: "20px",
              fontSize: "12px",
              color: "#10B981",
              fontWeight: "600",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
              <span style={{
                display: "inline-block",
                width: "6px",
                height: "6px",
                background: "#10B981",
                borderRadius: "50%",
                animation: "pulse 2s infinite",
              }}></span>
              Live
            </div>
          </div>
          <div style={{ height: "300px" }}>
            <Line data={carbonData} options={chartOptions} />
          </div>
        </div>

        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          padding: "24px",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}>
          <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600", color: "#F8FAFC" }}>
            Haycarb PLC Performance
          </h3>
          <div style={{ height: "300px" }}>
            <Bar data={haycarbData} options={chartOptions} />
          </div>
        </div>

        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          padding: "24px",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}>
          <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600", color: "#F8FAFC" }}>
            Weekly Trading Activity
          </h3>
          <div style={{ height: "300px" }}>
            <Line data={tradingData} options={chartOptions} />
          </div>
        </div>

        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          padding: "24px",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}>
          <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600", color: "#F8FAFC" }}>
            Regional Market Distribution
          </h3>
          <div style={{ height: "300px" }}>
            <Radar data={regionalRadarData} options={radarOptions} />
          </div>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "24px",
        marginBottom: "32px",
      }}>
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          padding: "24px",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}>
          <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600", color: "#F8FAFC" }}>
            Market Competitors Analysis
          </h3>
          <div>
            {competitors.map((c) => (
              <div key={c.name} style={{ 
                display: "flex", 
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                marginBottom: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                transition: "all 0.3s ease",
              }}>
                <div>
                  <h4 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "600", color: "#F8FAFC" }}>
                    {c.name}
                  </h4>
                  <p style={{ margin: 0, fontSize: "12px", color: "#94A3B8" }}>
                    Growth: <span style={{ color: c.growth > 0 ? "#10B981" : "#EF4444", fontWeight: "600" }}>
                      {c.growth > 0 ? "+" : ""}{c.growth}%
                    </span>
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "20px", fontWeight: "700", color: "#F8FAFC" }}>
                    ${c.value.toFixed(1)}M
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: c.trend > 0 ? "#10B981" : "#EF4444", fontWeight: "600" }}>
                    {c.trend > 0 ? "+" : ""}{c.trend}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          padding: "24px",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}>
          <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600", color: "#F8FAFC" }}>
            Market Share
          </h3>
          <div style={{ height: "280px" }}>
            <Doughnut data={competitorsData} options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                legend: { position: 'bottom', labels: { ...chartOptions.plugins.legend.labels, color: '#94A3B8' } }
              }
            }} />
          </div>
        </div>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#F8FAFC", margin: 0 }}>
            Industry News & Updates
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          {news.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                overflow: "hidden",
                transition: "transform 0.3s ease",
                cursor: "pointer",
              }}
              onClick={() => window.open(item.link, "_blank")}
            >
              <img src={item.image} alt={item.title} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
              <div style={{ padding: "20px" }}>
                <p style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "8px" }}>
                  {item.date} • {item.source}
                </p>
                <h3 style={{ fontSize: "17px", fontWeight: "600", marginBottom: "10px", color: "#F8FAFC" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#94A3B8", lineHeight: "1.6" }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}