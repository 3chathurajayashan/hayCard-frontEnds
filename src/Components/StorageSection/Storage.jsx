import React, { useState } from "react";

export default function ChemicalStorage() {
  const [chemicals, setChemicals] = useState([
    { name: "Hydrochloric Acid", quantity: "25 L", location: "Shelf A1", expiry: "2026-05-15", hazard: "Corrosive" },
    { name: "Sodium Chloride", quantity: "10 kg", location: "Shelf B2", expiry: "2030-01-20", hazard: "Low" },
    { name: "Ethanol", quantity: "50 L", location: "Cabinet C3", expiry: "2027-09-12", hazard: "Flammable" },
    { name: "Sulfuric Acid", quantity: "30 L", location: "Shelf A2", expiry: "2026-08-19", hazard: "Highly Corrosive" },
    { name: "Ammonia Solution", quantity: "15 L", location: "Shelf D1", expiry: "2025-11-30", hazard: "Toxic" },
    { name: "Acetone", quantity: "20 L", location: "Cabinet C4", expiry: "2027-04-22", hazard: "Flammable" },
    { name: "Nitric Acid", quantity: "18 L", location: "Shelf A3", expiry: "2026-03-01", hazard: "Strong Oxidizer" },
    { name: "Potassium Permanganate", quantity: "12 kg", location: "Shelf B5", expiry: "2029-06-14", hazard: "Oxidizing" },
    { name: "Sodium Hydroxide", quantity: "25 kg", location: "Shelf E2", expiry: "2028-02-28", hazard: "Corrosive" },
    { name: "Formaldehyde", quantity: "8 L", location: "Cabinet D3", expiry: "2025-09-09", hazard: "Toxic" },
    { name: "Hydrogen Peroxide", quantity: "15 L", location: "Shelf C1", expiry: "2026-12-12", hazard: "Oxidizing Agent" },
    { name: "Benzene", quantity: "10 L", location: "Cabinet F2", expiry: "2027-10-01", hazard: "Carcinogenic" },
    { name: "Methanol", quantity: "35 L", location: "Cabinet C2", expiry: "2026-02-17", hazard: "Flammable" },
    { name: "Phosphoric Acid", quantity: "20 L", location: "Shelf A4", expiry: "2027-08-08", hazard: "Corrosive" },
    { name: "Acetic Acid", quantity: "22 L", location: "Shelf A5", expiry: "2026-11-25", hazard: "Irritant" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [newChem, setNewChem] = useState({
    name: "",
    quantity: "",
    location: "",
    expiry: "",
    hazard: "",
    emailReminder: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewChem({ ...newChem, [name]: type === "checkbox" ? checked : value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newChem.name || !newChem.quantity || !newChem.location || !newChem.expiry || !newChem.hazard) {
      setMessage("⚠️ Please fill all fields!");
      setTimeout(() => setMessage(""), 2500);
      return;
    }

    setChemicals([...chemicals, newChem]);
    setNewChem({ name: "", quantity: "", location: "", expiry: "", hazard: "", emailReminder: false });
    setShowForm(false);

    if (newChem.emailReminder) {
      setMessage(`📧 Reminder set! You’ll get expiry alerts at chathurachamod88@gmail.com`);
    } else {
      setMessage("✅ Chemical added successfully!");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="storage-page">
      <button className="back-btn" onClick={() => window.history.back()}>
        ← Back
      </button>

      <header className="storage-header">
        <h1>Chemical Storage</h1>
        <p>Manage and track all chemicals stored in the laboratory</p>
      </header>

      {message && <div className="notification">{message}</div>}

      <div className="add-btn-container">
        <button className="add-btn" onClick={() => setShowForm(true)}>+ Add Chemical</button>
      </div>

      <div className="table-container">
        <table className="chem-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Location</th>
              <th>Expiry</th>
              <th>Hazard</th>
              <th>Email Reminder</th>
            </tr>
          </thead>
          <tbody>
            {chemicals.map((chem, i) => (
              <tr key={i}>
                <td>{chem.name}</td>
                <td>{chem.quantity}</td>
                <td>{chem.location}</td>
                <td>{chem.expiry}</td>
                <td className={`hazard ${chem.hazard.toLowerCase()}`}>{chem.hazard}</td>
                <td>{chem.emailReminder ? "✔️" : "✖️"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Chemical</h2>
            <form onSubmit={handleAdd}>
              <input type="text" name="name" placeholder="Chemical Name" value={newChem.name} onChange={handleChange} />
              <input type="text" name="quantity" placeholder="Quantity (e.g., 25L, 10kg)" value={newChem.quantity} onChange={handleChange} />
              <input type="text" name="location" placeholder="Storage Location (e.g., Shelf A1)" value={newChem.location} onChange={handleChange} />
              <input type="date" name="expiry" value={newChem.expiry} onChange={handleChange} />
              <select name="hazard" value={newChem.hazard} onChange={handleChange}>
                <option value="">Select Hazard Level</option>
                <option value="Low">Low</option>
                <option value="Flammable">Flammable</option>
                <option value="Corrosive">Corrosive</option>
                <option value="Toxic">Toxic</option>
              </select>

              <label className="reminder-check">
                <input type="checkbox" name="emailReminder" checked={newChem.emailReminder} onChange={handleChange} />
                Remind me by email (pcf@haycarb.com)
              </label>

              <div className="form-buttons">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }

        .storage-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #edf1f7, #f9fafc);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .back-btn {
          position: absolute;
          top: 25px;
          left: 25px;
          background: #1d2d50;
          color: white;
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: 0.3s;
        }

        .back-btn:hover { background: #2a3c6a; transform: scale(1.05); }

        .storage-header {
          text-align: center;
          background: #fff;
          width: 100%;
          padding: 70px 20px 40px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border-bottom: 3px solid #e4e8f0;
        }

        .storage-header h1 { color: #1d2d50; font-size: 2.6rem; }
        .storage-header p { color: #5c6475; margin-top: 10px; }

        .add-btn-container { margin-top: 40px; }
        .add-btn { background: #1d2d50; color: #fff; border: none; padding: 14px 30px; border-radius: 10px; cursor: pointer; }
        .add-btn:hover { background: #2a3c6a; transform: scale(1.05); }

        .table-container { margin-top: 40px; width: 90%; overflow-x: auto; }
        .chem-table { width: 100%; border-collapse: collapse; background: white; border-radius: 15px; box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        .chem-table th, .chem-table td { padding: 16px 20px; border-bottom: 1px solid #eaeaea; text-align: left; }
        .chem-table th { background: #1d2d50; color: white; font-weight: 600; }
        .chem-table tr:hover { background: #f6f8fc; }

        .hazard.flammable { color: #ff4500; font-weight: 600; }
        .hazard.corrosive { color: #d9534f; font-weight: 600; }
        .hazard.low { color: #5cb85c; font-weight: 600; }
        .hazard.toxic { color: #c0392b; font-weight: 600; }

        .reminder-check {
          font-size: 0.95rem;
          color: #333;
          margin-top: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center; z-index: 1000; }

        .modal-content {
          background: white; width: 420px; border-radius: 20px; padding: 30px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }

        .modal-content h2 { text-align: center; margin-bottom: 20px; color: #1d2d50; }

        .modal-content form { display: flex; flex-direction: column; gap: 15px; }
        .modal-content input, .modal-content select {
          padding: 10px 14px; border: 1px solid #ccc; border-radius: 8px; font-size: 1rem;
        }

        .form-buttons { display: flex; justify-content: space-between; margin-top: 10px; }

        .save-btn { background: #1d2d50; color: white; border: none; padding: 10px 25px; border-radius: 8px; cursor: pointer; }
        .cancel-btn { background: #ccc; border: none; padding: 10px 25px; border-radius: 8px; cursor: pointer; }

        .notification {
          position: fixed; top: 20px; right: 20px; background: #1d2d50; color: white;
          padding: 15px 28px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.3);
          animation: slideIn 0.4s ease forwards, fadeOut 2.5s ease forwards 0.5s;
        }

        @keyframes slideIn { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeOut { 0%, 80% { opacity: 1; } 100% { opacity: 0; transform: translateX(100px); } }
      `}</style>
    </div>
  );
}
