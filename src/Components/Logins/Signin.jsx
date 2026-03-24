import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ShieldCheck, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

// Assets
import logo from '../../assets/logo.webp';
import w1 from '../../assets/w3.jpg';

function Signin() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 4000);
  };

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputs.email.includes("@")) return showNotification("Invalid email format", "error");
    
    setLoading(true);
    try {
      const res = await axios.post("https://hay-card-back-end.vercel.app/api/users/login", {
        email: inputs.email,
        password: inputs.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      showNotification("Success! Initializing Lab Portal...", "success");
      setTimeout(() => {
        const role = res.data.user.role;
        if (role === "factory") navigate("/addDashboard");
        else if (role === "tester") navigate("/tester");
        else if (role === "labadmin") navigate("/editDashboard");
        else navigate("/dashboard");
      }, 1500);
    } catch (err) {
      showNotification(err.response?.data?.message || "Authentication failed", "error");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc] overflow-hidden font-sans">
      
      {/* 1. CINEMATIC LEFT PANEL (50%) - UNCHANGED */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${w1})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-10" />

        <div className="relative z-20 h-full flex flex-col justify-between p-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <img src={logo} alt="Haycarb" className="w-36 brightness-0 invert mb-6" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="max-w-xl">
            <h1 className="text-6xl font-black text-white tracking-tighter mb-4 leading-none">
              HAYCARB <span className="text-[#8dc63f]">PLC</span>
            </h1>
            <h2 className="text-xl text-[#8dc63f] font-semibold tracking-widest uppercase mb-6">
              Laboratory Management
            </h2>
            <div className="w-20 h-1.5 bg-[#8dc63f] mb-8 rounded-full" />
            <p className="text-lg text-slate-200 leading-relaxed font-light">
              Streamlining carbon analysis and sample tracking with precision and real-time data integrity.
            </p>
          </motion.div>

          <p className="text-white/40 text-xs font-medium tracking-[0.3em] uppercase">
            © 2026 Haycarb PLC • Enterprise Security
          </p>
        </div>
      </div>

      {/* 2. MODERN MINIMAL FORM PANEL (50%) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative bg-white">
        
        <AnimatePresence>
          {notification.show && (
            <motion.div 
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className={`fixed top-8 z-50 flex items-center gap-3 px-8 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-l-4 font-bold ${
                notification.type === 'success' ? 'bg-white border-[#8dc63f] text-slate-800' : 'bg-white border-rose-500 text-slate-800'
              }`}
            >
              {notification.type === 'success' ? <CheckCircle2 className="text-[#8dc63f]" /> : <AlertCircle className="text-rose-500" />}
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Welcome Back!</h3>
            <p className="text-slate-400 font-medium">Authorized personnel access only.</p>
          </div>

          {/* Social Sign In Options */}
          <div className="flex flex-col gap-3 mb-8">
            <button className="w-full py-3 px-4 border border-slate-200 rounded-xl flex items-center justify-center gap-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-[0.98]">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>
            <button className="w-full py-3 px-4 border border-slate-200 rounded-xl flex items-center justify-center gap-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-[0.98]">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" className="w-4 h-4" />
              Sign in with Office 365
            </button>
          </div>

          <div className="relative mb-8 flex items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Or use Credentials</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="group space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#8dc63f]">
                your email
              </label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#8dc63f] transition-colors" size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="name@haycarb.com"
                  value={inputs.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-3 bg-transparent border-b-2 border-slate-100 outline-none focus:border-[#8dc63f] transition-all text-slate-800 font-medium placeholder:text-slate-300"
                  required
                />
              </div>
            </div>

            <div className="group space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#8dc63f]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#8dc63f] transition-colors" size={20} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={inputs.password}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-3 bg-transparent border-b-2 border-slate-100 outline-none focus:border-[#8dc63f] transition-all text-slate-800 font-medium placeholder:text-slate-300"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-black transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  SIGN IN
                  <ArrowRight size={18} className="text-[#8dc63f]" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 tracking-[0.15em] uppercase">
              <ShieldCheck size={14} className="text-[#8dc63f]" />
              Secure Enterprise Encryption Active
            </div>
            <img src={logo} alt="Logo" className="lg:hidden w-24 grayscale opacity-30 mt-4" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Signin;