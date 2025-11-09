"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Import images
import sampleInImg from "../../assets/df1.jpg";
import sampleAssignImg from "../../assets/df2.jpg";
import sampleOutImg from "../../assets/df3.jpg";

export default function SampleMenu() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  const cards = [
    {
      title: "Sample In",
      description: "Register new samples received for laboratory testing.",
      color: "#007bff",
      link: "/samplein",
      img: sampleInImg,
      
    },
    {
      title: "Sample Assign",
      description: "Assign received samples to laboratory technicians.",
      color: "#28a745",
      link: "/sampleassign",
      img: sampleAssignImg,
      
    },
    {
      title: "Sample Out",
      description: "Dispatch completed samples and finalize reports.",
      color: "#dc3545",
      link: "/sampleout",
      img: sampleOutImg,
      
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const loadingVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <div className="sample-menu-container">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="loading-screen"
          >
            <motion.div
              className="loader-container"
              variants={loadingVariants}
              initial="initial"
              animate="animate"
            >
              <div className="floating-loader">
                <div className="loader-circle"></div>
                <div className="loader-circle"></div>
                <div className="loader-circle"></div>
              </div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="loading-text"
            >
              Preparing your dashboard...
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="content-wrapper"
          >
            <motion.h2
              className="menu-title"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 100,
                delay: 0.2 
              }}
            >
              Customer Sample Management
            </motion.h2>
            <motion.p
              className="menu-subtitle"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 100,
                delay: 0.3 
              }}
            >
              Streamline your laboratory workflow with precision
            </motion.p>

            <motion.div
              className="card-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {cards.map((card, index) => (
                <motion.div
                  key={index}
                  className="menu-card"
                  variants={cardVariants}
                  whileHover={{ 
                    scale: 1.05,
                    y: -15,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <div className="card-glow" style={{ background: card.color }}></div>
                  <div className="card-header">
                    <div className="card-icon" style={{ color: card.color }}>
                      {card.icon}
                    </div>
                    <div className="card-badge" style={{ background: card.color }}>
                      {}
                    </div>
                  </div>
                  <div className="card-image">
                    <img src={card.img} alt={card.title} />
                    <div 
                      className="image-overlay"
                      style={{ background: `${card.color}40` }}
                    ></div>
                  </div>
                  <div className="card-content">
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <motion.button
                      whileHover={{ 
                        scale: 1.1,
                        boxShadow: `0 10px 25px ${card.color}80`
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="menu-btn"
                      style={{
                        background: `linear-gradient(135deg, ${card.color}, ${card.color}dd)`,
                        boxShadow: `0 5px 15px ${card.color}40`
                      }}
                      onClick={() => navigate(card.link)}
                    >
                      <span>Next</span>
                      <motion.span
                        animate={{ x: hoveredCard === index ? 5 : 0 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        →
                      </motion.span>
                    </motion.button>
                  </div>
                  <div 
                    className="card-border"
                    style={{ background: card.color }}
                  ></div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced CSS */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Inter', 'Poppins', sans-serif;
        }

        .sample-menu-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 50%, #e8eeff 100%);
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
          height: 1px;
          background: linear-gradient(90deg, transparent, #007bff33, transparent);
        }

        .content-wrapper {
          width: 100%;
          max-width: 1300px;
          text-align: center;
        }

        .menu-title {
          font-size: 3rem;
          font-weight: 700;
          background: linear-gradient(135deg, #222 0%, #444 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 15px;
          letter-spacing: -0.5px;
        }

        .menu-subtitle {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 70px;
          font-weight: 400;
          letter-spacing: 0.3px;
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 50px;
          width: 100%;
          max-width: 1300px;
          padding: 20px;
        }

        .menu-card {
          background: #fff;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          box-shadow: 
            0 10px 40px rgba(0,0,0,0.08),
            0 2px 10px rgba(0,0,0,0.03);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
          perspective: 1000px;
          border: 1px solid rgba(255,255,255,0.2);
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
        }

        .menu-card:hover .card-glow {
          opacity: 1;
          filter: blur(12px);
        }

        .card-header {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 2;
        }

        .card-icon {
          font-size: 2.5rem;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
        }

        .card-badge {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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
          transition: all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);
        }

        .menu-card:hover .card-image img {
          transform: scale(1.15) rotate(2deg);
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
          padding: 30px 25px;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .card-content h3 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 15px;
          letter-spacing: -0.3px;
        }

        .card-content p {
          color: #666;
          font-size: 1.05rem;
          line-height: 1.6;
          margin-bottom: 30px;
          font-weight: 400;
        }

        .menu-btn {
          padding: 14px 36px;
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 auto;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
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

        .card-border {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          transform: scaleX(0);
          transition: transform 0.4s ease;
          transform-origin: center;
        }

        .menu-card:hover .card-border {
          transform: scaleX(1);
        }

        /* Enhanced Loading Animation */
        .loading-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          color: #444;
          background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
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
          background: linear-gradient(135deg, #007bff, #0056b3);
          animation: float 2s ease-in-out infinite;
        }

        .loader-circle:nth-child(2) {
          animation-delay: 0.2s;
          background: linear-gradient(135deg, #28a745, #1e7e34);
        }

        .loader-circle:nth-child(3) {
          animation-delay: 0.4s;
          background: linear-gradient(135deg, #dc3545, #c82333);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        .loading-text {
          font-size: 1.2rem;
          font-weight: 500;
          color: #555;
          letter-spacing: 0.5px;
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
            gap: 35px;
            padding: 10px;
          }
          
          .card-content h3 {
            font-size: 1.6rem;
          }
        }

        @media (max-width: 480px) {
          .menu-title {
            font-size: 1.8rem;
          }
          
          .card-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}