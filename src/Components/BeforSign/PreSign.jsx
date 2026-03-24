import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Beaker, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

// Assets
import madampeImage from '../../assets/hey.jpg';
import colomboImage from '../../assets/colombo.webp';
import badalgamaImage from '../../assets/madampe.webp';

const BranchSelection = () => {
  const [loadingBranch, setLoadingBranch] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [notification, setNotification] = useState("");
  const timerRef = useRef();

  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        setLoadingBranch(null);
        setSelectedBranch(null);
        setNotification("");
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const handleBranchSelect = (branchId) => {
    setLoadingBranch(branchId);
    setSelectedBranch(branchId);
    setNotification(`Initializing session for ${branchId}...`);

    timerRef.current = setTimeout(() => {
      setNotification("Secure redirecting...");
      window.location.href = '/sign';
    }, 2200);
  };

  const branches = [
    {
      id: 'madampe',
      name: 'Madampe Lab',
      location: 'Main Street, Madampe',
      description: 'Advanced diagnostic facility specializing in rapid molecular testing and clinical pathology.',
      image: madampeImage,
    },
    {
      id: 'colombo',
      name: 'Colombo Central',
      location: 'Union Place, Colombo 02',
      description: 'Our flagship high-capacity laboratory equipped with state-of-the-art robotic processing.',
      image: colomboImage,
    },
    {
      id: 'badalgama',
      name: 'Badalgama Lab',
      location: 'Negombo Rd, Badalgama',
      description: 'Community-integrated testing center focused on outpatient care and wellness screenings.',
      image: badalgamaImage,
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfdfe] font-sans text-slate-800 selection:bg-blue-100">
      
      {/* Modern Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-8 left-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-full shadow-2xl backdrop-blur-md bg-opacity-90 border border-slate-700/50"
          >
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span className="text-sm font-medium tracking-wide">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-4"
        >
          <span className="text-blue-600 font-bold text-xs uppercase tracking-[0.2em]">HayCarb Network</span>
          <h1 className="text-4xl md:text-5xl font-light text-slate-900 tracking-tight">
            Select <span className="font-semibold text-blue-600">Laboratory</span>
          </h1>
          <p className="text-slate-500 max-w-md mx-auto text-lg">
            Please choose a facility to Lboratory with your digital credential to proceed.
          </p>
          
          <div className="pt-4">
            <a 
              href="/location" 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 rounded-full text-sm font-semibold hover:bg-rose-100 transition-colors border border-rose-100"
            >
              <MapPin className="w-4 h-4" />
              View Live Sample Locations
            </a>
          </div>
        </motion.div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {branches.map((branch, index) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className={`relative group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-500 overflow-hidden ${
                selectedBranch === branch.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {/* Image Area */}
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img 
                  src={branch.image} 
                  alt={branch.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Beaker className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Certified Lab</span>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-8">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{branch.name}</h3>
                  <div className="flex items-center gap-1 text-slate-400 text-xs italic">
                    <MapPin className="w-3 h-3" />
                    {branch.location}
                  </div>
                </div>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3">
                  {branch.description}
                </p>

                <button
                  onClick={() => handleBranchSelect(branch.id)}
                  disabled={!!loadingBranch}
                  className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                    loadingBranch === branch.id
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-900 text-white hover:bg-blue-600 shadow-lg shadow-slate-200 hover:shadow-blue-200'
                  }`}
                >
                  {loadingBranch === branch.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      SECURE CONNECTING...
                    </>
                  ) : (
                    <>
                      SELECT THIS BRANCH
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              {/* Selection Indicator */}
              {selectedBranch === branch.id && (
                <motion.div 
                  layoutId="activeGlow"
                  className="absolute inset-0 border-2 border-blue-500 rounded-3xl pointer-events-none"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <p className="mt-16 text-slate-400 text-xs font-medium tracking-widest uppercase">
          HayCarb  Systems &bull; Secure Laboratory Access
        </p>
      </main>
    </div>
  );
};

export default BranchSelection;