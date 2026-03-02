import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Activity, Eye, EyeOff, UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        name: formData.name,
        email: formData.email,
        role: 'patient',
        createdAt: new Date().toISOString()
      });
      navigate('/dashboard');
    } catch (err) {
      alert("Registration Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute bottom-0 right-0 w-100 h-100 bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-slate-900/40 border border-emerald-500/20 backdrop-blur-xl rounded-[3rem] p-10 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 mb-4 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Create <span className="text-emerald-500">Identity</span></h1>
          <p className="text-emerald-500/50 font-black text-[9px] uppercase tracking-[0.3em] mt-2">Joining the Neural Grid</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-emerald-500 uppercase ml-2 tracking-widest">Full Alias (Name)</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/40 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type="text" required placeholder="Enter Full Name"
                className="w-full pl-12 pr-4 py-4 bg-black/40 border border-emerald-500/10 rounded-2xl outline-none focus:border-emerald-500/50 font-bold text-white placeholder:text-slate-700 transition-all"
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-emerald-500 uppercase ml-2 tracking-widest">Uplink Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/40 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type="email" required placeholder="email@example.com"
                className="w-full pl-12 pr-4 py-4 bg-black/40 border border-emerald-500/10 rounded-2xl outline-none focus:border-emerald-500/50 font-bold text-white placeholder:text-slate-700 transition-all"
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-emerald-500 uppercase ml-2 tracking-widest">New Security Key</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/40 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type={showPassword ? "text" : "password"} required placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-black/40 border border-emerald-500/10 rounded-2xl outline-none focus:border-emerald-500/50 font-bold text-white placeholder:text-slate-700 transition-all"
                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500/40">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-emerald-500 text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all mt-4">
            {loading ? "Encrypting..." : <>Establish Identity <ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="text-center mt-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
          Already Active? <Link to="/login" className="text-emerald-500 hover:underline">Return to Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;