import React, { useState } from "react";
import labTechIcon from "../../assets/labTec.jpg"; // replace with your icon

export default function AIChatBot() {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { type: "bot", text: "Hello there! I am Praveen. Send me a reference number to check its availability." }
  ]);

  const handleChatSubmit = (e) => {
    e.preventDefault();
    const trimmedInput = chatInput.trim();
    if (!trimmedInput) return;

    // Add user message
    setChatMessages(prev => [...prev, { type: "user", text: trimmedInput }]);
    setChatInput("");

    // Simulate bot response
    setTimeout(() => {
      let botResponse = "";
      if (trimmedInput === "7676") {
        botResponse = "This sample is already finalized!";
      } else {
        botResponse = "This sample is not found.";
      }
      setChatMessages(prev => [...prev, { type: "bot", text: botResponse }]);
    }, 800); // simulate typing delay
  };

  return (
    <div className="chatbot">
      <div className="chatbot-header">
        <img src={labTechIcon} alt="Lab Assistant" className="chatbot-icon" />
        <span>Lab Assistant</span>
      </div>

      <div className="chatbot-messages">
        {chatMessages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${msg.type === "bot" ? "bot" : "user"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleChatSubmit} className="chatbot-input">
        <input
          type="text"
          value={chatInput}
          placeholder="Enter reference number..."
          onChange={(e) => setChatInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>

      {/* Styles */}
      <style>{`
        .chatbot {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 320px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          animation: slideIn 0.8s ease forwards;
          z-index: 5000;
        }

        @keyframes slideIn {
          from { transform: translateY(40px) scale(0.9); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        .chatbot-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: linear-gradient(135deg, #2c3e50, #34495e);
          color: white;
          font-weight: 600;
          font-size: 1rem;
        }

        .chatbot-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid white;
        }

        .chatbot-messages {
          flex: 1;
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 280px;
          overflow-y: auto;
          background: #f5f6fa;
        }

        .chat-message {
          padding: 10px 14px;
          border-radius: 14px;
          max-width: 80%;
          animation: fadeIn 0.5s ease;
        }

        .chat-message.bot {
          background: #ecf0f1;
          align-self: flex-start;
        }

        .chat-message.user {
          background: #2c3e50;
          color: white;
          align-self: flex-end;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .chatbot-input {
          display: flex;
          border-top: 1px solid #ddd;
        }

        .chatbot-input input {
          flex: 1;
          padding: 10px 12px;
          border: none;
          outline: none;
          font-size: 0.95rem;
        }

        .chatbot-input button {
          padding: 10px 16px;
          background: #2c3e50;
          color: white;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s ease;
        }

        .chatbot-input button:hover {
          background: #34495e;
        }

        .chatbot-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chatbot-messages::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.2);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}
