import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import cv1 from '../../assets/ch5.jpg';
import cv2 from '../../assets/ch6.jpg';
import cv3 from '../../assets/ch1.jpg';
import labTechIcon from '../../assets/nm.png'; // Lab tech image

export default function Dashboard() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleProceed = (section) => {
    setLoading(true);
    setMessage(`Processing ${section} section...`);

    setTimeout(() => {
      setLoading(false);
      setMessage("");

      if (section === "Chemicals") {
        navigate("/chemHome");
      } else if(section ==="Customer"){
         navigate("/cushome");
      } else if(section === "Samples"){
        navigate("/preSign")
      } else {
        setMessage(`Proceeding to ${section} section...`);
        setTimeout(() => setMessage(""), 2500);
      }
    }, 2000);
  };

  const handleChatClick = () => {
    navigate("/chatbot");
  };

  return (
    <div className="page">
      {/* Header */}
     <header 
  className="header" 
  style={{ background: "#8dc63f" }}
>
  <div className="header-content">
    <div className="header-decoration">
      <span className="decoration-line left"></span>
      <span className="decoration-dot"></span>
      <span className="decoration-line right"></span>
    </div>
    <h1>
      <span className="word word-1">Haycarb</span>
      <span className="word word-2">Laboratory</span>
      <span className="word word-3">System</span>
    </h1>
    <p style={{color:"white"}}>Your centralized platform for chemical, login, and sample management</p>
    <div className="header-underline"></div>
  </div>
</header>


      {/* Custom Notification */}
      {message && (
        <div className="notification-container">
          <div className="notification">
            <div className="notification-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
                <path d="M10 6V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="10" cy="14" r="1" fill="currentColor"/>
              </svg>
            </div>
            <span>{message}</span>
          </div>
        </div>
      )}

      {/* Advanced Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner-container">
              <div className="spinner"></div>
              <div className="spinner-inner"></div>
            </div>
            <p className="loading-text">Authenticating</p>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}

      {/* Cards Section */}
      <div className="cards">
        {[
          { 
            title: "Chemicals", 
            desc: "Manage and track all chemical inventory details.",
            image:  cv1
          },
          { 
            title: "Samples", 
            desc: "Analyze, record, and manage lab sample data easily.",
            image:  cv2
          },
          { 
            title: "Customer", 
            desc: "The process of receiving samples per shipment for the customer",
            image: cv3
          },
        ].map((item, i) => (
          <div key={i} className="card" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="card-image-wrapper">
              <img src={item.image} alt={item.title} className="card-image" />
              <div className="card-overlay"></div>
            </div>
            <div className="card-content">
              <h2>{item.title}</h2>
              <p>{item.desc}</p>
              <button onClick={() => handleProceed(item.title)}>
                <span>Proceed</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Assistant Icon */}
      <div className="chat-assistant" onClick={handleChatClick}>
        <img src={labTechIcon} alt="Chat AI" />
        <span>Chat with AI Assistant</span>
      </div>

      {/* Inline CSS */}
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; }

        .page { min-height: 100vh; background: linear-gradient(135deg, #f5f7fa 0%, #e8edf2 100%); display: flex; flex-direction: column; align-items: center; position: relative; overflow-x: hidden; }

        /* Header */
        .header { width: 100%; padding: 60px 20px 40px; background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); position: relative; overflow: hidden; }
        .header::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); animation: headerShine 3s ease-in-out infinite; }
        @keyframes headerShine { 0% { left: -100%; } 50% { left: 100%; } 100% { left: 100%; } }

        .header-content { max-width: 1200px; margin: 0 auto; text-align: center; position: relative; z-index: 1; }

        .header-decoration { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 24px; animation: decorationFade 1s ease 0.5s backwards; }
        @keyframes decorationFade { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }

        .decoration-line { height: 2px; width: 60px; background: linear-gradient(90deg, transparent, #ffffff, transparent); animation: lineGrow 1.2s ease 0.6s backwards; }
        @keyframes lineGrow { from { width: 0; } to { width: 60px; } }

        .decoration-dot { width: 8px; height: 8px; background: #ffffff; border-radius: 50%; animation: dotPulseHeader 2s ease-in-out infinite; }
        @keyframes dotPulseHeader { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.7; } }

        .header h1 { font-size: 3rem; font-weight: 700; color: #ffffff; margin-bottom: 16px; letter-spacing: -0.02em; display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }
        .word { display: inline-block; opacity: 0; transform: translateY(-40px) rotateX(-90deg); animation: wordDrop 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .word-1 { animation-delay: 0.2s; }
        .word-2 { animation-delay: 0.4s; }
        .word-3 { animation-delay: 0.6s; }
        @keyframes wordDrop { to { opacity: 1; transform: translateY(0) rotateX(0); } }

        .header p { color: #bdc3c7; font-size: 1.1rem; line-height: 1.6; animation: subtitleFade 1s ease 0.8s backwards; }
        @keyframes subtitleFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .header-underline { width: 80px; height: 3px; background: linear-gradient(90deg, transparent, #ffffff, transparent); margin: 20px auto 0; animation: underlineGrow 1s ease 1s backwards; }
        @keyframes underlineGrow { from { width: 0; opacity: 0; } to { width: 80px; opacity: 1; } }

        /* Cards Container */
        .cards { display: flex; justify-content: center; flex-wrap: wrap; gap: 40px; margin-top: 80px; padding: 0 20px 80px; max-width: 1400px; }

        /* Card (kept original styles unchanged) */
        .card { background: #ffffff; width: 380px; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12); transition: all 0.5s cubic-bezier(0.16,1,0.3,1); animation: cardEntry 0.8s cubic-bezier(0.16,1,0.3,1) backwards; position: relative; border: 1px solid rgba(0,0,0,0.05); }
        @keyframes cardEntry { from { opacity: 0; transform: translateY(60px) scale(0.9) rotateX(20deg); } to { opacity: 1; transform: translateY(0) scale(1) rotateX(0); } }
        .card:hover { transform: translateY(-16px) scale(1.03); box-shadow: 0 25px 60px rgba(0,0,0,0.2); border-color: rgba(44,62,80,0.15); }
        .card::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #2c3e50, #3498db, #2c3e50); transform: scaleX(0); transition: transform 0.5s ease; }
        .card:hover::after { transform: scaleX(1); }
        .card-image-wrapper { height: 220px; position: relative; overflow: hidden; background: linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%); }
        .card-image-wrapper::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent); z-index: 1; transition: left 0.6s ease; }
        .card:hover .card-image-wrapper::before { left: 100%; }
        .card-image { width: 100%; height: 100%; object-fit: cover; transition: all 0.7s cubic-bezier(0.16,1,0.3,1); }
        .card:hover .card-image { transform: scale(1.2); filter: brightness(1.1) contrast(1.1); }
        .card-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 30%, rgba(44,62,80,0.9) 100%); opacity: 0; transition: opacity 0.5s ease; z-index: 1; }
        .card:hover .card-overlay { opacity: 1; }
        .card-content { padding: 32px 28px 36px; position: relative; background: #ffffff; }
        .card-content h2 { position: relative; display: inline-block; color: #2c3e50; font-size: 1.75rem; margin-bottom: 12px; font-weight: 700; letter-spacing: -0.01em; }
        .card-content h2::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px; background: linear-gradient(90deg, #2c3e50, #3498db); transition: width 0.4s ease; }
        .card:hover .card-content h2::after { width: 100%; }
        .card-content p { color: #7f8c8d; font-size: 0.95rem; line-height: 1.6; margin-bottom: 24px; }
        .card-content button { width: 100%; background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); color: white; border: none; padding: 16px 24px; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.4s cubic-bezier(0.16,1,0.3,1); box-shadow: 0 4px 15px rgba(44,62,80,0.2); position: relative; overflow: hidden; }
        .card-content button::before { content: ''; position: absolute; top: 50%; left: 50%; width: 0; height: 0; border-radius: 50%; background: rgba(255,255,255,0.2); transform: translate(-50%,-50%); transition: width 0.5s ease, height 0.5s ease; }
        .card-content button:hover::before { width: 300px; height: 300px; }
        .card-content button:hover { background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%); transform: translateY(-3px); box-shadow: 0 8px 25px rgba(44,62,80,0.35); }
        .card-content button span { position: relative; z-index: 1; }
        .card-content button svg { transition: transform 0.3s ease; position: relative; z-index: 1; }
        .card-content button:hover svg { transform: translateX(6px); }

        /* Custom Notification */
        .notification-container { position: fixed; top: 24px; right: 24px; z-index: 3000; animation: notificationSlide 0.5s cubic-bezier(0.16,1,0.3,1); }
        @keyframes notificationSlide { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
        .notification { background: #ffffff; color: #2c3e50; padding: 16px 24px; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.15); border: 1px solid #ecf0f1; display: flex; align-items: center; gap: 12px; min-width: 320px; }
        .notification-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #2c3e50, #34495e); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; }
        .notification span { font-size: 0.95rem; font-weight: 500; }

        /* Advanced Loading Overlay */
        .loading-overlay { position: fixed; inset: 0; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 4000; animation: overlayFade 0.3s ease; }
        @keyframes overlayFade { from { opacity: 0; } to { opacity: 1; } }
        .loading-content { text-align: center; }
        .spinner-container { position: relative; width: 100px; height: 100px; margin: 0 auto; }
        .spinner { width: 100px; height: 100px; border: 4px solid #ecf0f1; border-top: 4px solid #2c3e50; border-radius: 50%; animation: spin 1s linear infinite; }
        .spinner-inner { position: absolute; top: 12px; left: 12px; width: 76px; height: 76px; border: 4px solid #ecf0f1; border-top: 4px solid #34495e; border-radius: 50%; animation: spin 0.8s linear infinite reverse; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .loading-text { margin-top: 28px; color: #2c3e50; font-size: 1.2rem; font-weight: 600; letter-spacing: 0.03em; }
        .loading-dots { display: flex; gap: 8px; justify-content: center; margin-top: 16px; }
        .loading-dots span { width: 8px; height: 8px; background: #2c3e50; border-radius: 50%; animation: dotPulse 1.2s infinite ease-in-out; }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dotPulse { 0%, 80%, 100% { transform: scale(0); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }
.chat-assistant {
  position: fixed;
  right: 20px;
  bottom: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  z-index: 5000;
  animation: fadeInUp 0.8s ease forwards, floatUpDown 3s ease-in-out infinite;
}

.chat-assistant img {
  width: 150px;   /* bigger image */
  height: 150px;  /* bigger image */
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.chat-assistant span {
  color: #2c3e50; /* dark text */
  font-weight: 600;
  font-size: 1rem;
  text-align: center;
  animation: textPulse 2s infinite;
}

.chat-assistant:hover img {
  transform: scale(1.1);
}

/* Slide in animation */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Floating up and down */
@keyframes floatUpDown {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Text subtle pulse */
@keyframes textPulse {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.05); opacity: 1; }
}


        /* Responsive */
        @media (max-width: 768px) { .chat-assistant { right: 15px; bottom: 30px; } .cards { gap: 24px; } .card { width: 100%; max-width: 340px; } }
      `}</style>
    </div>
  );
}
