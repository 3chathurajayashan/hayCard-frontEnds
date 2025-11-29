import React, { useState, useEffect, useRef } from 'react';

// Import your images
import madampeImage from '../../assets/hey.jpg';
import colomboImage from '../../assets/colombo.webp';
import badalgamaImage from '../../assets/madampe.webp';

function BranchSelection() {
  const [loadingBranch, setLoadingBranch] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [notification, setNotification] = useState("");
  const timerRef = useRef(); // For clearing redirect timeout

  // Reset state on initial mount
  useEffect(() => {
    setLoadingBranch(null);
    setSelectedBranch(null);
    setNotification("");
  }, []);

  // Reset state when page comes back from bfcache (Vercel / browser back)
  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        setLoadingBranch(null);
        setSelectedBranch(null);
        setNotification("");
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  const handleBranchSelect = (branch) => {
    setLoadingBranch(branch);
    setSelectedBranch(branch);
    setNotification(`Processing your selection for ${branch.toUpperCase()}...`);

    // Simulate API call or processing
    timerRef.current = setTimeout(() => {
      setNotification("Redirecting...");
      window.location.href = '/sign';
    }, 2500);
  };

  // Notification fade-out effect
  useEffect(() => {
    if (notification) {
      const fadeTimer = setTimeout(() => setNotification(""), 3000);
      return () => clearTimeout(fadeTimer);
    }
  }, [notification]);

  // Clear any pending timers on unmount
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const branches = [
    {
      id: 'madampe',
      name: 'Madampe Lab',
      description: 'Modern banking services with personalized customer care in the heart of Madampe.',
      src: madampeImage,
    },
    {
      id: 'colombo',
      name: 'Colombo Lab',
      description: 'Our flagship branch offering comprehensive financial solutions in the capital city.',
      src: colomboImage,
    },
    {
      id: 'badalgama',
      name: 'Badalgama Lab',
      description: 'Community-focused banking with friendly service in the Badalgama area.',
      src: badalgamaImage,
    }
  ];

  return (
    <div className="branch-container">
      {notification && <div className="custom-notification">{notification}</div>}

      <div className="header">
        <h1>Select Your Laboratory</h1>
        <p>Choose your preferred branch location to continue</p>
      </div>

      <div className="branches-grid">
        {branches.map((branch) => (
          <div 
            key={branch.id} 
            className={`branch-card ${branch.id} ${selectedBranch === branch.id ? 'pulse' : ''}`}
          >
            <div className="image-container">
              {branch.src ? (
                <img 
                  src={branch.src} 
                  alt={branch.name}
                  className="branch-image"
                />
              ) : (
                <div className="image-placeholder">{branch.icon}</div>
              )}
            </div>
            
            <div className="branch-content">
              <h3 className="branch-name">{branch.name}</h3>
              <p className="branch-description">{branch.description}</p>

              <button
                className="select-btn"
                onClick={() => handleBranchSelect(branch.id)}
                disabled={loadingBranch && loadingBranch !== branch.id}
              >
                {loadingBranch === branch.id ? (
                  <div className="spinner-container">
                    <div className="spinner"></div>
                    <span className="loading-text">Processing...</span>
                  </div>
                ) : (
                  'Select Branch'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Styles remain the same */}
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .branch-container { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); position: relative; }
        .custom-notification { position: fixed; top: 20px; right: 20px; background: #2c3e50; color: #fff; padding: 14px 26px; border-radius: 12px; font-weight: 500; box-shadow: 0 5px 20px rgba(0,0,0,0.25); animation: slideIn 0.4s ease forwards, fadeOut 3s ease forwards 0.5s; z-index: 100; }
        @keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeOut { 0%, 70% { opacity: 1; } 100% { opacity: 0; } }
        .header { text-align: center; margin-bottom: 60px; }
        .header h1 { font-size: 2.8rem; font-weight: 300; color: #2c3e50; margin-bottom: 15px; letter-spacing: -0.5px; }
        .header p { font-size: 1.1rem; color: #6c757d; font-weight: 400; }
        .branches-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; width: 100%; max-width: 1100px; margin: 0 auto; }
        .branch-card { background: white; border-radius: 16px; padding: 0; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s; border: 1px solid #e9ecef; overflow: hidden; position: relative; cursor: pointer; }
        .branch-card:hover { transform: translateY(-12px); box-shadow: 0 12px 45px rgba(0,0,0,0.15); }
        .branch-card.pulse { animation: pulse 2s ease-in-out infinite; }
        .branch-image { width: 100%; height: 200px; object-fit: cover; border-bottom: 1px solid #e9ecef; transition: transform 0.4s ease, filter 0.4s ease; }
        .branch-card:hover .branch-image { transform: scale(1.06) rotate(0.5deg); filter: brightness(1.05); }
        .branch-content { padding: 30px 25px; text-align: center; animation: fadeUp 0.8s ease; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .branch-name { font-size: 1.5rem; font-weight: 600; margin-bottom: 12px; color: #2c3e50; letter-spacing: 0.5px; }
        .branch-description { color: #6c757d; font-size: 0.95rem; line-height: 1.6; margin-bottom: 25px; }
        .select-btn { width: 100%; padding: 14px 24px; border: none; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.4s ease; text-transform: uppercase; letter-spacing: 0.5px; position: relative; overflow: hidden; }
        .branch-card.madampe .select-btn { background: white; color: #2c3e50; border: 2px solid #e9ecef; }
        .branch-card.madampe .select-btn:hover:not(:disabled) { background: #f8f9fa; border-color: #8dc63f; color: #8dc63f; }
        .branch-card.colombo .select-btn { background: #8dc63f; color: white; border: 2px solid #8dc63f; }
        .branch-card.colombo .select-btn:hover:not(:disabled) { background: #7cb32e; border-color: #7cb32e; }
        .branch-card.badalgama .select-btn { background: black; color: white; border: 2px solid black; }
        .branch-card.badalgama .select-btn:hover:not(:disabled) { background: #333; border-color: #333; }
        .select-btn:disabled { cursor: not-allowed; opacity: 0.7; }
        .spinner-container { display: flex; align-items: center; justify-content: center; gap: 10px; }
        .spinner { width: 22px; height: 22px; border: 3px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; }
        .branch-card.madampe .spinner { border-top: 3px solid #8dc63f; }
        .branch-card.colombo .spinner, .branch-card.badalgama .spinner { border-top: 3px solid white; }
        .loading-text { font-weight: 500; font-size: 0.95rem; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
        @media (max-width: 768px) { .branches-grid { grid-template-columns: 1fr; max-width: 400px; } .branch-image { height: 180px; } }
        @media (max-width: 480px) { .branch-image { height: 160px; } }
      `}</style>
    </div>
  );
}

export default BranchSelection;
