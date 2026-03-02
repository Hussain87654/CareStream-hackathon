import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Activity, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", res.user.uid));
      if (userDoc.exists()) {
        navigate('/dashboard');
      }
    } catch (err) {
      alert("Access Denied: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-slate-900/40 border border-emerald-500/20 backdrop-blur-xl rounded-[3rem] p-10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl text-black mb-4 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">System <span className="text-emerald-500">Access</span></h1>
          <p className="text-emerald-500/50 font-black text-[9px] uppercase tracking-[0.3em] mt-2">Authorization Required</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-emerald-500 uppercase ml-2 tracking-widest">Uplink ID (Email)</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/40 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type="email" required placeholder="name@domain.com"
                className="w-full pl-12 pr-4 py-4 bg-black/40 border border-emerald-500/10 rounded-2xl outline-none focus:border-emerald-500/50 font-bold text-white placeholder:text-slate-700 transition-all shadow-inner"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-emerald-500 uppercase ml-2 tracking-widest">Security Key (Password)</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/40 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type={showPassword ? "text" : "password"} required placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-black/40 border border-emerald-500/10 rounded-2xl outline-none focus:border-emerald-500/50 font-bold text-white placeholder:text-slate-700 transition-all shadow-inner"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500/40 hover:text-emerald-400 transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-emerald-500 text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all mt-4 disabled:opacity-50">
            {loading ? "Decrypting..." : <>Initialize Login <ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="text-center mt-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
          New Node? <Link to="/register" className="text-emerald-500 hover:underline">Register Identity</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;