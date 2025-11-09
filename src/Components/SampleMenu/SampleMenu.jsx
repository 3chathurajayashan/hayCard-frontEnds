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
  const [redirecting, setRedirecting] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");

  const cards = [
    {
      title: "Sample In",
      description: "Register new samples received for laboratory testing.",
      color: "#4F46E5",
      link: "/samplein",
      img: sampleInImg,
    },
    {
      title: "Sample Assign",
      description: "Assign received samples to laboratory technicians.",
      color: "#0EA5E9",
      link: "/sampleassign",
      img: sampleAssignImg,
    },
    {
      title: "Sample Out",
      description: "Dispatch completed samples and finalize reports.",
      color: "#8B5CF6",
      link: "/sampleout",
      img: sampleOutImg,
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigation = (path) => {
    setRedirectPath(path);
    setRedirecting(true);
    
    setTimeout(() => {
      navigate(path);
    }, 1200);
  };

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
      y: 50,
      scale: 0.92
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const pulseVariants = {
    initial: { scale: 1, opacity: 1 },
    pulse: {
      scale: [1, 1.02, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const progressVariants = {
    initial: { width: "0%" },
    animate: {
      width: "100%",
      transition: {
        duration: 1.8,
        ease: [0.65, 0, 0.35, 1]
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
            exit={{ 
              opacity: 0,
              transition: { duration: 0.5 }
            }}
            className="loading-screen"
          >
            <motion.div className="loading-content">
              <motion.div
                className="logo-container"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <motion.div
                  className="logo"
                  variants={pulseVariants}
                  initial="initial"
                  animate="pulse"
                >
                  <div className="logo-inner" />
                </motion.div>
              </motion.div>
              
              <motion.div
                className="progress-bar-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  className="progress-bar"
                  variants={progressVariants}
                  initial="initial"
                  animate="animate"
                />
              </motion.div>
              
              <motion.div
                className="loading-dots"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                />
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                />
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        ) : redirecting ? (
          <motion.div
            key="redirecting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="redirect-notification"
          >
            <motion.div
              className="notification-content"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
            >
              <motion.div
                className="notification-icon"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                  scale: { duration: 0.6, repeat: Infinity }
                }}
              >
                <div className="icon-ring">
                  <div className="icon-core" />
                </div>
              </motion.div>
              
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Redirecting
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Taking you to {redirectPath.replace("/", "")}...
              </motion.p>
              
              <motion.div
                className="redirect-loader"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="content-wrapper"
          >
            <motion.div
              className="header-section"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.9,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <motion.h1 
                className="page-title"
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                Sample Management
              </motion.h1>
              <motion.p 
                className="page-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.7 }}
              >
                Manage your laboratory samples efficiently
              </motion.p>
            </motion.div>

            <motion.div
              className="cards-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {cards.map((card, index) => (
                <motion.div
                  key={index}
                  className="card"
                  variants={cardVariants}
                  whileHover={{ 
                    y: -12,
                    transition: { 
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }
                  }}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <div className="card-inner">
                    <motion.div 
                      className="card-image-wrapper"
                      animate={{
                        scale: hoveredCard === index ? 1.08 : 1
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <img src={card.img} alt={card.title} className="card-image" />
                      <motion.div 
                        className="image-overlay"
                        animate={{
                          opacity: hoveredCard === index ? 0.25 : 0
                        }}
                        transition={{ duration: 0.4 }}
                        style={{ backgroundColor: card.color }}
                      />
                      <motion.div 
                        className="image-shine"
                        animate={{
                          x: hoveredCard === index ? "100%" : "-100%"
                        }}
                        transition={{ duration: 0.8 }}
                      />
                    </motion.div>

                    <div className="card-body">
                      <motion.div
                        className="color-bar"
                        style={{ backgroundColor: card.color }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.6 + index * 0.15, duration: 0.7 }}
                      />
                      
                      <h3 className="card-title">{card.title}</h3>
                      <p className="card-description">{card.description}</p>

                      <motion.button
                        className="card-button"
                        style={{ backgroundColor: card.color }}
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: `0 12px 32px ${card.color}60`
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleNavigation(card.link)}
                      >
                        <span>Get Started</span>
                        <motion.span
                          className="button-icon"
                          animate={{
                            x: hoveredCard === index ? 6 : 0
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          →
                        </motion.span>
                      </motion.button>
                    </div>
                  </div>
                  
                  <motion.div 
                    className="card-glow"
                    style={{ backgroundColor: card.color }}
                    animate={{
                      opacity: hoveredCard === index ? 0.15 : 0
                    }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        }

        .sample-menu-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
          position: relative;
          overflow: hidden;
        }

        /* Loading Screen */
        .loading-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          position: relative;
        }

        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
        }

        .logo-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .logo {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          background: linear-gradient(135deg, #4F46E5 0%, #8B5CF6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 8px 32px rgba(79, 70, 229, 0.3);
        }

        .logo-inner {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #ffffff;
          opacity: 0.9;
        }

        .progress-bar-container {
          width: 200px;
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #4F46E5, #8B5CF6);
          border-radius: 2px;
        }

        .loading-dots {
          display: flex;
          gap: 8px;
        }

        .loading-dots span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #64748b;
        }

        /* Redirect Notification */
        .redirect-notification {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .notification-content {
          background: #ffffff;
          padding: 48px;
          border-radius: 24px;
          text-align: center;
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2);
          max-width: 400px;
          width: 90%;
          position: relative;
          overflow: hidden;
        }

        .notification-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-ring {
          width: 60px;
          height: 60px;
          border: 3px solid #4F46E5;
          border-top-color: transparent;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-core {
          width: 8px;
          height: 8px;
          background: #4F46E5;
          border-radius: 50%;
        }

        .notification-content h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .notification-content p {
          color: #64748b;
          margin-bottom: 24px;
        }

        .redirect-loader {
          height: 3px;
          background: linear-gradient(90deg, #4F46E5, #8B5CF6);
          border-radius: 2px;
          position: absolute;
          bottom: 0;
          left: 0;
        }

        /* Content */
        .content-wrapper {
          width: 100%;
          max-width: 1400px;
        }

        .header-section {
          text-align: center;
          margin-bottom: 80px;
        }

        .page-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #0f172a 0%, #475569 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .page-subtitle {
          font-size: 1.25rem;
          color: #64748b;
          font-weight: 400;
          letter-spacing: -0.01em;
        }

        /* Cards Grid */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 40px;
          padding: 0 20px;
        }

        .card {
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 
            0 2px 8px rgba(0, 0, 0, 0.04),
            0 8px 32px rgba(0, 0, 0, 0.08);
          transition: all 0.4s ease;
          border: 1px solid #f1f5f9;
          position: relative;
        }

        .card:hover {
          box-shadow: 
            0 8px 24px rgba(0, 0, 0, 0.12),
            0 20px 60px rgba(0, 0, 0, 0.15);
          border-color: #e2e8f0;
        }

        .card-inner {
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 2;
        }

        .card-image-wrapper {
          position: relative;
          width: 100%;
          height: 260px;
          overflow: hidden;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .image-shine {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transform: skewX(-20deg);
        }

        .card-body {
          padding: 36px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .color-bar {
          width: 56px;
          height: 4px;
          border-radius: 2px;
          margin-bottom: 28px;
          transform-origin: left;
        }

        .card-title {
          font-size: 1.625rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 16px;
          letter-spacing: -0.01em;
        }

        .card-description {
          font-size: 1.05rem;
          color: #64748b;
          line-height: 1.7;
          margin-bottom: 32px;
          flex: 1;
        }

        .card-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px 32px;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.3s ease;
          align-self: flex-start;
          position: relative;
          overflow: hidden;
        }

        .card-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .card-button:hover::before {
          left: 100%;
        }

        .button-icon {
          font-size: 1.3rem;
          display: inline-block;
          line-height: 1;
          font-weight: 300;
        }

        .card-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 24px;
          filter: blur(20px);
          opacity: 0;
          z-index: 1;
        }

        @media (max-width: 1200px) {
          .cards-grid {
            grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
            gap: 32px;
          }
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 2.5rem;
          }

          .page-subtitle {
            font-size: 1.125rem;
          }

          .header-section {
            margin-bottom: 60px;
          }

          .cards-grid {
            grid-template-columns: 1fr;
            gap: 28px;
            padding: 0;
          }

          .card-body {
            padding: 28px;
          }

          .card-image-wrapper {
            height: 220px;
          }
        }

        @media (max-width: 480px) {
          .sample-menu-container {
            padding: 40px 16px;
          }

          .page-title {
            font-size: 2.25rem;
          }

          .card-title {
            font-size: 1.375rem;
          }

          .card-description {
            font-size: 1rem;
          }

          .cards-grid {
            grid-template-columns: 1fr;
          }

          .notification-content {
            padding: 32px 24px;
            margin: 20px;
          }
        }
      `}</style>
    </div>
  );
}