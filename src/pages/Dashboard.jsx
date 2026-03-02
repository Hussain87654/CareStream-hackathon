import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Calendar, LogOut, 
  Activity, ShieldCheck, User, Zap, X, PlusCircle
} from 'lucide-react';

// Components (Inhein check kar lein ke path sahi hai)
import AddPatient from '../components/AddPatient';
import BookAppointment from '../components/BookAppointment';
import PatientTable from '../components/PatientTable';
import AppointmentTable from '../components/AppointmentTable';
import AdminPanel from '../components/AdminPanel';
import PatientProfile from '../components/PatientProfile';
import AddPrescription from '../components/AddPrescription';

const Dashboard = () => {
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const role = user?.role || 'patient'; 

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-300 overflow-hidden font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-slate-900/60 border-r border-emerald-500/10 backdrop-blur-xl flex flex-col p-6 z-20">
        <div className="flex items-center gap-3 px-2 mb-12">
          <div className="p-2 bg-emerald-500 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <Activity className="text-black" size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic text-white">CareStream</span>
        </div>

        <nav className="flex-1 space-y-3">
          <button 
            onClick={() => {setActiveTab('overview'); setSelectedPatient(null);}} 
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'overview' ? 'bg-emerald-500 text-black font-black shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:bg-emerald-500/5'}`}
          >
            <LayoutDashboard size={20} /> <span className="text-xs uppercase tracking-widest">Dashboard</span>
          </button>
          
          {(role === 'admin' || role === 'doctor' || role === 'receptionist') && (
            <button 
              onClick={() => {setActiveTab('patients'); setSelectedPatient(null);}} 
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'patients' ? 'bg-emerald-500 text-black font-black' : 'text-slate-500 hover:bg-emerald-500/5'}`}
            >
              <Users size={20} /> <span className="text-xs uppercase tracking-widest">All Patients</span>
            </button>
          )}

          {role === 'admin' && (
            <button 
              onClick={() => setActiveTab('admin-panel')} 
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'admin-panel' ? 'bg-emerald-500 text-black font-black' : 'text-slate-500 hover:bg-emerald-500/5'}`}
            >
              <ShieldCheck size={20} /> <span className="text-xs uppercase tracking-widest">Control Room</span>
            </button>
          )}
        </nav>

        <button onClick={handleLogout} className="mt-auto flex items-center gap-4 px-4 py-4 text-rose-500 hover:bg-rose-500/10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
          <LogOut size={20} /> Logout System
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto p-10 relative">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">System // <span className="text-emerald-500">{activeTab}</span></h1>
            <p className="text-[10px] text-emerald-500/50 font-black uppercase tracking-[0.3em] mt-1">Node Status: Online & Encrypted</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/50 border border-emerald-500/10 p-2 pl-6 rounded-2xl backdrop-blur-md">
            <div className="text-right">
              <p className="font-black text-white text-sm">{user?.name || "User"}</p>
              <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest italic">{role}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-black"><User size={24}/></div>
          </div>
        </header>

        {/* --- TABS LOGIC --- */}
        <div className="relative z-10">
          
          {/* 1. OVERVIEW TAB: Yahan sab kuch dikhega */}
          {activeTab === 'overview' && !selectedPatient && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              
              {/* Top Cards for Receptionist */}
              {(role === 'receptionist' || role === 'admin') && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-slate-900/40 p-8 rounded-[3rem] border border-emerald-500/10 backdrop-blur-sm">
                    <h3 className="text-[10px] font-black mb-6 text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-2"><PlusCircle size={14}/> Register New Subject</h3>
                    <AddPatient />
                  </div>
                  <div className="bg-slate-900/40 p-8 rounded-[3rem] border border-emerald-500/10 backdrop-blur-sm">
                    <h3 className="text-[10px] font-black mb-6 text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-2"><Calendar size={14}/> Schedule Uplink</h3>
                    <BookAppointment />
                  </div>
                </div>
              )}

              {/* Table section for everyone */}
              <div className="bg-slate-900/40 p-8 rounded-[3rem] border border-emerald-500/10">
                <h3 className="text-[10px] font-black mb-6 text-emerald-500 uppercase tracking-[0.4em] italic underline underline-offset-8 decoration-emerald-500/20">Active Records // Select for Detail</h3>
                <PatientTable onPatientSelect={(p) => setSelectedPatient(p)} />
              </div>
            </motion.div>
          )}

          {/* 2. PATIENT DETAIL VIEW: Jab click ho */}
          {selectedPatient && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
              <button 
                onClick={() => setSelectedPatient(null)} 
                className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all bg-emerald-500/5 px-4 py-2 rounded-lg border border-emerald-500/10"
              >
                <X size={14}/> Close File & Return to List
              </button>
              
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-7 bg-slate-900/40 rounded-[3rem] border border-emerald-500/10 overflow-hidden shadow-2xl">
                  <PatientProfile patientId={selectedPatient.id} />
                </div>
                <div className="xl:col-span-5 sticky top-4">
                  <AddPrescription patientId={selectedPatient.id} patientName={selectedPatient.name} />
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. OTHER TABS */}
          {activeTab === 'patients' && !selectedPatient && (
             <div className="bg-slate-900/40 p-8 rounded-[3rem] border border-emerald-500/10">
                <PatientTable onPatientSelect={(p) => setSelectedPatient(p)} />
             </div>
          )}

          {activeTab === 'admin-panel' && <AdminPanel />}
          
        </div>
      </main>
    </div>
  );
};

export default Dashboard;