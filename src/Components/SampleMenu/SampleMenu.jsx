import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sampleInImg from "../../assets/df1.jpg";
import sampleAssignImg from "../../assets/df2.jpg";
import sampleOutImg from "../../assets/df3.jpg";

export default function SampleMenu() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingCard, setLoadingCard] = useState(null);
  const [notification, setNotification] = useState(null);

  const cards = [
    {
      title: "Sample In",
      description: "Register new samples received for laboratory testing.",
      color: "#2563eb",
      link: "/samplein",
      img: sampleInImg,
    },
    {
      title: "Sample Assign",
      description: "Assign received samples to laboratory technicians.",
      color: "#059669",
      link: "/sampleassign",
      img: sampleAssignImg,
    },
    {
      title: "Sample Out",
      description: "Dispatch completed samples and finalize reports.",
      color: "#dc2626",
      link: "/sampleout",
      img: sampleOutImg,
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setIsLoaded(true), 100);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = (card, index) => {
    setLoadingCard(index);
    setNotification({
      message: `Navigating to ${card.title}...`,
      color: card.color
    });

    setTimeout(() => {
      setLoadingCard(null);
      setNotification(null);
      navigate(card.link);
    }, 1500);
  };

  return (
    <div className="sample-menu-container">
      {/* Notification */}
      {notification && (
        <div className="notification" style={{ borderLeft: `4px solid ${notification.color}` }}>
          <div className="notification-icon" style={{ background: notification.color }}>
            <span>✓</span>
          </div>
          <div className="notification-content">
            <p className="notification-title">Processing</p>
            <p className="notification-message">{notification.message}</p>
          </div>
          <div className="notification-progress" style={{ background: notification.color }}></div>
        </div>
      )}

      {loading ? (
        <div className="loading-screen">
          <div className="loader-container">
            <div className="floating-loader">
              <div className="loader-circle"></div>
              <div className="loader-circle"></div>
              <div className="loader-circle"></div>
            </div>
          </div>
          <p className="loading-text">Preparing your dashboard...</p>
        </div>
      ) : (
        <div className="content-wrapper">
          <div className={`header-section ${isLoaded ? 'loaded' : ''}`}>
            <h2 className="menu-title">Customer Sample Management</h2>
            <p className="menu-subtitle">Streamline your laboratory workflow with precision</p>
          </div>

          <div className={`card-grid ${isLoaded ? 'loaded' : ''}`}>
            {cards.map((card, index) => (
              <div
                key={index}
                className="menu-card"
                style={{ animationDelay: `${index * 0.15}s` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="card-glow" style={{ background: card.color }}></div>
                
                <div className="card-image">
                  <img src={card.img} alt={card.title} />
                  <div 
                    className="image-overlay"
                    style={{ background: `linear-gradient(135deg, ${card.color}40, ${card.color}60)` }}
                  ></div>
                </div>

                <div className="card-content">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <button
                    className={`menu-btn ${hoveredCard === index ? 'hovered' : ''} ${loadingCard === index ? 'loading' : ''}`}
                    style={{
                      background: `linear-gradient(135deg, ${card.color}, ${card.color}dd)`,
                      boxShadow: `0 5px 20px ${card.color}40`
                    }}
                    onClick={() => handleCardClick(card, index)}
                    disabled={loadingCard !== null}
                  >
                    {loadingCard === index ? (
                      <span className="btn-loader"></span>
                    ) : (
                      <>
                        <span>Explore</span>
                        <span className="btn-arrow">→</span>
                      </>
                    )}
                  </button>
                </div>

                <div 
                  className="card-border"
                  style={{ background: card.color }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Inter', 'Segoe UI', Tahoma, sans-serif;
        }

        .sample-menu-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #ffffffff 0%, #ffffffff 50%, #ffffffff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 60px 20px;
          overflow-x: hidden;
          position: relative;
        }

        .sample-menu-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(37, 99, 235, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(5, 150, 105, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 60%);
          pointer-events: none;
        }

        .sample-menu-container::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.3;
          pointer-events: none;
        }

        /* Notification Styles */
        .notification {
          position: fixed;
          top: 30px;
          right: 30px;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 320px;
          z-index: 1000;
          animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .notification-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .notification-content {
          flex: 1;
        }

        .notification-title {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.9rem;
          margin-bottom: 2px;
        }

        .notification-message {
          color: #64748b;
          font-size: 0.85rem;
        }

        .notification-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          width: 100%;
          animation: progress 1.5s linear;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .content-wrapper {
          width: 100%;
          max-width: 1300px;
          text-align: center;
        }

        .header-section {
          opacity: 0;
          transform: translateY(-30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .header-section.loaded {
          opacity: 1;
          transform: translateY(0);
        }

        .menu-title {
          font-size: 3rem;
          font-weight: 700;
          color: #000000ff;
          margin-bottom: 15px;
          letter-spacing: -0.5px;
          text-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }

        .menu-subtitle {
          font-size: 1.2rem;
          color: rgba(56, 56, 56, 0.85);
          margin-bottom: 70px;
          font-weight: 400;
          letter-spacing: 0.3px;
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 40px;
          width: 100%;
          padding: 20px;
        }

        .menu-card {
          background: rgba(255, 255, 255, 0.98);
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255,255,255,0.2);
          opacity: 0;
          transform: translateY(40px) scale(0.9);
          animation: cardFadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .menu-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }

        .card-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          opacity: 0.7;
          filter: blur(8px);
          transition: all 0.4s ease;
          z-index: 2;
        }

        .menu-card:hover .card-glow {
          opacity: 1;
          filter: blur(12px);
          height: 6px;
        }

        .card-image {
          position: relative;
          height: 220px;
          overflow: hidden;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .menu-card:hover .card-image img {
          transform: scale(1.15);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.3;
          transition: opacity 0.4s ease;
        }

        .menu-card:hover .image-overlay {
          opacity: 0.5;
        }

        .card-content {
          padding: 32px 28px;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .card-content h3 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 12px;
          letter-spacing: -0.3px;
        }

        .card-content p {
          color: #64748b;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 28px;
          font-weight: 400;
        }

        .menu-btn {
          padding: 14px 36px;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          min-width: 140px;
        }

        .menu-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .menu-btn:hover::before {
          left: 100%;
        }

        .menu-btn:hover:not(.loading) {
          transform: translateY(-2px);
        }

        .menu-btn:active:not(.loading) {
          transform: translateY(0);
        }

        .menu-btn.loading {
          pointer-events: none;
          opacity: 0.8;
        }

        .menu-btn:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .btn-loader {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .btn-arrow {
          display: inline-block;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .menu-btn.hovered .btn-arrow {
          transform: translateX(5px);
        }

        .card-border {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          transform: scaleX(0);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }

        .menu-card:hover .card-border {
          transform: scaleX(1);
        }

        /* Loading Screen */
        .loading-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          color: #fff;
        }

        .loader-container {
          margin-bottom: 30px;
        }

        .floating-loader {
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: center;
        }

        .loader-circle {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(0, 81, 255, 0.9);
          animation: float 2s ease-in-out infinite;
          box-shadow: 0 4px 12px rgba(255,255,255,0.4);
        }

        .loader-circle:nth-child(2) {
          animation-delay: 0.2s;
          background: rgba(235, 86, 0, 0.9);
        }

        .loader-circle:nth-child(3) {
          animation-delay: 0.4s;
          background: rgba(0, 0, 0, 0.9);
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0px);
            opacity: 0.9;
          }
          50% { 
            transform: translateY(-20px);
            opacity: 1;
          }
        }

        .loading-text {
          font-size: 1.2rem;
          font-weight: 500;
          color: rgba(41, 109, 187, 0.95);
          letter-spacing: 0.5px;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }

        @keyframes cardFadeIn {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .menu-title {
            font-size: 2.2rem;
          }
          
          .menu-subtitle {
            font-size: 1.1rem;
            margin-bottom: 50px;
          }
          
          .card-grid {
            grid-template-columns: 1fr;
            gap: 30px;
            padding: 10px;
          }
          
          .card-content h3 {
            font-size: 1.6rem;
          }

          .card-content {
            padding: 28px 24px;
          }

          .notification {
            min-width: 280px;
            right: 20px;
            top: 20px;
          }
        }

        @media (max-width: 480px) {
          .menu-title {
            font-size: 1.8rem;
          }
          
          .menu-subtitle {
            font-size: 1rem;
          }

          .card-grid {
            gap: 25px;
          }

          .card-image {
            height: 180px;
          }

          .notification {
            min-width: calc(100vw - 40px);
          }
        }
      `}</style>
    </div>
  );
}