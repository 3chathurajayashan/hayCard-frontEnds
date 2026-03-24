import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, CheckCircle, Fingerprint, Activity, Box } from "lucide-react";

// Assets
import sampleInImg from "../../assets/df1.jpg";
import sampleAssignImg from "../../assets/df2.jpg";
import sampleOutImg from "../../assets/df3.jpg";

export default function SampleMenu() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingCard, setLoadingCard] = useState(null);
  const [notification, setNotification] = useState(null);

  const cards = [
    {
      title: "Sample Intake",
      label: "Inbound",
      description: "Log and verify incoming laboratory specimens.",
      link: "/samplein",
      img: sampleInImg,
      icon: <Box size={16} />
    },
    {
      title: "Task Assignment",
      label: "Process",
      description: "Delegate samples to specialized technical teams.",
      link: "/sampleassign",
      img: sampleAssignImg,
      icon: <Fingerprint size={16} />
    },
    {
      title: "Sample Dispatch",
      label: "Outbound",
      description: "Finalize reports and release tested materials.",
      link: "/sampleout",
      img: sampleOutImg,
      icon: <Activity size={16} />
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = (card, index) => {
    setLoadingCard(index);
    setNotification(`Syncing ${card.title} module...`);

    setTimeout(() => {
      setLoadingCard(null);
      setNotification(null);
      navigate(card.link);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
        <Loader2 className="animate-spin text-slate-300" size={24} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1a1a1a] font-sans antialiased selection:bg-blue-100">
      
      {/* 1. MINIMAL TOAST */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-white border border-slate-200 px-5 py-3 rounded-full shadow-sm flex items-center gap-3"
          >
            <Loader2 className="animate-spin text-blue-600" size={14} />
            <span className="text-xs font-semibold text-slate-600 tracking-tight">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-[1200px] mx-auto px-8 py-24">
        
        {/* 2. REFINED HEADER */}
        <header className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Haycarb Operations</span>
            </div>
            <h1 className="text-4xl font-medium tracking-tight text-slate-900">
              Sample Workflow <span className="text-slate-400">Management</span>
            </h1>
            <p className="text-slate-500 text-base max-w-md leading-relaxed">
              Standardized laboratory protocols for specimen tracking and technical auditing.
            </p>
          </motion.div>
        </header>

        {/* 3. BENTO-STYLE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleCardClick(card, index)}
              className="group cursor-pointer relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-300"
            >
              {/* Card Image - Subtle height */}
              <div className="h-40 overflow-hidden bg-slate-50 border-b border-slate-100">
                <img 
                  src={card.img} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  alt=""
                />
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {card.label}
                  </span>
                  <div className="text-slate-300 group-hover:text-blue-600 transition-colors">
                    {card.icon}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-2">{card.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-8">
                  {card.description}
                </p>

                <div className="flex items-center text-xs font-bold text-slate-900 gap-2 group-hover:gap-4 transition-all uppercase tracking-widest">
                  {loadingCard === index ? (
                    <Loader2 className="animate-spin text-blue-600" size={14} />
                  ) : (
                    <>
                      Open Module <ArrowRight size={14} className="text-blue-600" />
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 4. UTILITY FOOTER */}
        <footer className="mt-32 pt-8 border-t border-slate-100 flex justify-between items-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">System v4.0.2</p>
          <div className="flex items-center gap-4 text-slate-400">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
             <span className="text-[10px] font-bold uppercase tracking-widest">Server: Colombo_HQ</span>
          </div>
        </footer>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }

        /* Subtle scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}