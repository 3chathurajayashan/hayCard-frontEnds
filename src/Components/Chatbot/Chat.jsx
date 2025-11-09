import React, { useState } from "react";
import is from '../../assets/po.jpg'
export default function AIChatBotPage() {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      type: "bot",
      text: "Hello there! I am Praveen. Send me a reference number to check its availability."
    }
  ]);

  const handleChatSubmit = (e) => {
    e.preventDefault();
    const trimmedInput = chatInput.trim();
    if (!trimmedInput) return;

    setChatMessages(prev => [...prev, { type: "user", text: trimmedInput }]);
    setChatInput("");

    setTimeout(() => {
      let botResponse = trimmedInput === "7676" 
        ? "Your 7676 customer sample is already check out!" 
        : "This sample is not found. May be its not in yet!";
      setChatMessages(prev => [...prev, { type: "bot", text: botResponse }]);
    }, 800);
  };

  return (
    <div className="chatbot-page">
      <div className="chat-container">
        <header className="chat-header">
          <img 
            src={is}
            alt="Lab Assistant" 
            className="header-avatar"
          />
          <div className="header-info">
            <h2>Lab Assistant AI</h2>
            <p>Praveen - Sample Tracker</p>
          </div>
        </header>

        <div className="messages-container">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`message ${msg.type}`}>
              {msg.type === "bot" && (
                <img 
                  src={is}
                  alt="Bot" 
                  className="msg-avatar"
                />
              )}
              <div className="message-bubble">
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="input-container">
          <input
            type="text"
            value={chatInput}
            placeholder="Enter reference number..."
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit(e)}
          />
          <button onClick={handleChatSubmit}>
            Send
          </button>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(to bottom, #e3f2fd, #bbdefb);
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chatbot-page {
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .chat-container {
          width: 100%;
          max-width: 600px;
          height: 700px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-header {
          background: linear-gradient(135deg, #1e88e5, #1565c0);
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .header-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 3px solid white;
          object-fit: cover;
        }

        .header-info h2 {
          color: white;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .header-info p {
          color: rgba(255,255,255,0.85);
          font-size: 13px;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          background: #f8f9fa;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          animation: messageSlide 0.3s ease;
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .msg-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .message-bubble {
          padding: 12px 16px;
          border-radius: 18px;
          max-width: 75%;
          font-size: 15px;
          line-height: 1.5;
          word-wrap: break-word;
        }

        .message.bot .message-bubble {
          background: white;
          color: #333;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .message.user .message-bubble {
          background: #1e88e5;
          color: white;
        }

        .input-container {
          padding: 16px 20px;
          background: white;
          border-top: 1px solid #e0e0e0;
          display: flex;
          gap: 12px;
        }

        .input-container input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 25px;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s;
        }

        .input-container input:focus {
          border-color: #1e88e5;
        }

        .input-container button {
          padding: 12px 28px;
          background: #1e88e5;
          color: white;
          border: none;
          border-radius: 25px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .input-container button:hover {
          background: #1565c0;
        }

        .input-container button:active {
          transform: scale(0.98);
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .messages-container::-webkit-scrollbar {
          width: 8px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: #bdbdbd;
          border-radius: 4px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
          background: #9e9e9e;
        }
      `}</style>
    </div>
  );
}