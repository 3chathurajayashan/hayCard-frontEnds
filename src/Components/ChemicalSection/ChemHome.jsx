import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { FaPlus } from "react-icons/fa";

// Import your images
import storageImg from "../../assets/str1.jpg";
import purchasingImg from "../../assets/str2.jpg";
import purchasingImgs from "../../assets/ec.jpg";

function ChemHome() {
  const [message, setMessage] = useState("");
  const [loadingCard, setLoadingCard] = useState(null);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");

  const navigate = useNavigate();

  const handleNext = (section) => {
    setLoadingCard(section);
    setMessage(`Navigating to ${section}...`);

    setTimeout(() => {
      setMessage("");
      setLoadingCard(null);
      if (section === "Chemical Storage") navigate("/storage");
      if (section === "Chemical Purchasing") navigate("/purchasing");
      if (section === "Chemical Industry") navigate("/future");
    }, 2000);
  };

  const cards = [
    {
      title: "Chemical Storage",
      desc: "Safely manage and monitor chemical stock levels.",
      image: storageImg,
    },
    {
      title: "Chemical Purchasing",
      desc: "Track and record purchasing details efficiently.",
      image: purchasingImg,
    },
     {
      title: "Chemical Industry",
      desc: "Track and record purchasing details efficiently.",
      image: purchasingImgs,
    },
  ];

  useEffect(() => {
    // Fetch or fallback dummy calendar data
    setEvents([
      {
        id: "CHEM-01",
        title: "Acid Stock Check – Technician: Kavindu",
        start: "2025-12-02",
        end: "2025-12-03",
      },
      {
        id: "CHEM-02",
        title: "Solvent Refill – Technician: Sandun",
        start: "2025-12-05",
      },
      {
        id: "CHEM-03",
        title: "Base Titration Prep – Technician: Tharaka",
        start: "2025-12-08",
        end: "2025-12-09",
      },
    ]);
  }, []);

  const handleAddTask = () => {
    if (!newTaskTitle || !newTaskDate)
      return alert("Please enter both title and date!");
    const newEvent = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      start: newTaskDate,
    };
    setEvents((prev) => [...prev, newEvent]);
    setShowModal(false);
    setNewTaskTitle("");
    setNewTaskDate("");
  };

  return (
    <div className="chem-page">
      {/* Header */}
      <header className="chem-header">
        <h1>Chemical Management Portal</h1>
        <p>Manage, monitor, and organize all laboratory chemical operations</p>
      </header>

      {/* Notification */}
      {message && <div className="notification">{message}</div>}

      {/* Cards Section */}
      <div className="chem-card-container">
        {cards.map((item, i) => (
          <div key={i} className="chem-card">
            <div className="chem-card-image">
              <img src={item.image} alt={item.title} />
            </div>
            <div className="chem-card-content">
              <h2>{item.title}</h2>
              <p>{item.desc}</p>
              <button onClick={() => handleNext(item.title)}>
                {loadingCard === item.title ? "Loading..." : "Next"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Section */}
      <div
        style={{
          width: "90%",
          maxWidth: "1200px",
          marginTop: "120px",
          marginBottom: "40px",
          background: "#ffffff",
          padding: "25px",
          borderRadius: "20px",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
          animation: "fadeUp 0.9s ease",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            color: "#1d2d50",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Sample Scheduling Calendar
        </h2>

        {/* Add Task Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "15px",
          }}
        >
          <button
            style={{
              backgroundColor: "#00796b",
              color: "white",
              padding: "10px 16px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
              gap: "8px",
            }}
            onClick={() => setShowModal(true)}
          >
            <FaPlus />
            Add Task
          </button>
        </div>

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="700px"
          events={events}
          eventColor="#1d2d50"
          eventClick={(info) =>
            alert(`Event: ${info.event.title}\nStart: ${info.event.start}`)
          }
        />
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "12px",
              width: "400px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <h3 style={{ marginBottom: "10px", color: "#1d2d50" }}>
              Add New Task
            </h3>
            <input
              type="text"
              placeholder="Task Title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="date"
              value={newTaskDate}
              onChange={(e) => setNewTaskDate(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#ccc",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                style={{
                  padding: "10px 16px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#00796b",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        .chem-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: linear-gradient(135deg, #eaf0f9, #f6f9fc);
        }

        .chem-header {
          width: 100%;
          text-align: center;
          padding: 70px 20px 40px;
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border-bottom: 3px solid #e1e7f0;
          animation: fadeDown 0.8s ease;
        }

        .chem-header h1 {
          font-size: 2.8rem;
          color: #1d2d50;
        }

        .chem-header p {
          margin-top: 10px;
          color: #5c6475;
          font-size: 1.1rem;
        }

        .chem-card-container {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 80px;
          margin-top: 100px;
          animation: fadeUp 0.9s ease;
        }

        .chem-card {
          width: 420px;
          background: #ffffff;
          border-radius: 25px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: all 0.4s ease;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .chem-card:hover {
          transform: translateY(-15px) scale(1.03);
          box-shadow: 0 15px 45px rgba(0,0,0,0.15);
        }

        .chem-card-image {
          width: 100%;
          height: 180px;
          overflow: hidden;
        }

        .chem-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .chem-card-content {
          padding: 30px;
          text-align: center;
        }

        .chem-card-content h2 {
          font-size: 2rem;
          color: #1d2d50;
          margin-bottom: 15px;
        }

        .chem-card-content p {
          color: #5c6475;
          font-size: 1.05rem;
          margin-bottom: 25px;
          line-height: 1.5;
        }

        .chem-card-content button {
          background: #1d2d50;
          color: #fff;
          border: none;
          padding: 14px 34px;
          border-radius: 10px;
          font-size: 1.05rem;
          font-weight: 500;
          cursor: pointer;
          transition: 0.3s ease;
        }

        .notification {
          position: fixed;
          top: 25px;
          right: 25px;
          background: #1d2d50;
          color: white;
          padding: 16px 30px;
          border-radius: 12px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.25);
          font-weight: 500;
          animation: slideIn 0.4s ease forwards, fadeOut 2.6s ease forwards 0.5s;
        }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-50px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(70px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fadeOut {
          0%, 80% { opacity: 1; }
          100% { opacity: 0; transform: translateX(100px); }
        }
      `}</style>
    </div>
  );
}

export default ChemHome;
