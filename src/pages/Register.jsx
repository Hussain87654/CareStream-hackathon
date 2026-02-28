import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Stethoscope, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'patient' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const roles = [
    { id: 'patient', title: 'Patient', icon: <User size={24} />, color: 'bg-blue-100 text-blue-600' },
    { id: 'doctor', title: 'Doctor', icon: <Stethoscope size={24} />, color: 'bg-green-100 text-green-600' },
    { id: 'receptionist', title: 'Staff', icon: <Briefcase size={24} />, color: 'bg-purple-100 text-purple-600' },
  ];

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await setDoc(doc(db, "users", res.user.uid), {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        uid: res.user.uid,
        createdAt: new Date().toISOString()
      });
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-125 h-125 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 relative z-10"
      >
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Left Side: Form */}
          <div className="flex-1">
            <header className="mb-8">
              <h2 className="text-4xl font-black text-slate-800 tracking-tight">Join Us.</h2>
              <p className="text-slate-500 mt-2 font-medium">Create your healthcare ID today.</p>
            </header>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="group border-b-2 border-slate-100 focus-within:border-blue-600 transition-all py-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                <div className="flex items-center gap-3">
                  <User size={18} className="text-slate-400" />
                  <input type="text" placeholder="John Doe" className="w-full bg-transparent outline-none font-semibold text-slate-700" 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
              </div>

              <div className="group border-b-2 border-slate-100 focus-within:border-blue-600 transition-all py-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-slate-400" />
                  <input type="email" placeholder="john@example.com" className="w-full bg-transparent outline-none font-semibold text-slate-700" 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>
              </div>

              <div className="group border-b-2 border-slate-100 focus-within:border-blue-600 transition-all py-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Security Password</label>
                <div className="flex items-center gap-3">
                  <Lock size={18} className="text-slate-400" />
                  <input type="password" placeholder="••••••••" className="w-full bg-transparent outline-none font-semibold text-slate-700" 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                </div>
              </div>

              <button disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 mt-4 shadow-xl shadow-slate-200">
                {loading ? "Creating Account..." : "Confirm & Register"}
                <ArrowRight size={20} />
              </button>
            </form>
          </div>

          {/* Right Side: Role Selection Overlay */}
          <div className="w-full md:w-64 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Select Your Role</h3>
            <div className="grid grid-cols-1 gap-3">
              {roles.map((role) => (
                <div 
                  key={role.id}
                  onClick={() => setFormData({...formData, role: role.id})}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                    formData.role === role.id 
                    ? 'border-blue-600 bg-blue-50/50 shadow-inner' 
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50/30'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${role.color}`}>{role.icon}</div>
                  <div className="flex flex-1 justify-between items-center">
                    <span className={`font-bold text-sm ${formData.role === role.id ? 'text-blue-700' : 'text-slate-600'}`}>{role.title}</span>
                    {formData.role === role.id && <CheckCircle2 size={16} className="text-blue-600" />}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-slate-50 p-4 rounded-2xl mt-6">
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-tight">Already a member?</p>
              <Link to="/login" className="text-blue-600 font-black text-sm hover:underline">SIGN IN HERE</Link>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Register;