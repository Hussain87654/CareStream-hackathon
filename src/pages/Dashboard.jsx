import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
// Saare icons yahan import hain (ShieldCheck bhi)
import { 
  LayoutDashboard, Users, Calendar, FileText, 
  LogOut, Plus, Activity, Bell, UserPlus, Clock, 
  ChevronRight, ShieldCheck, Shield, User 
} from 'lucide-react';

// Components
import AddPatient from '../components/AddPatient';
import BookAppointment from '../components/BookAppointment';
import PatientTable from '../components/PatientTable';
import PatientAppointments from '../components/PatientAppointments';
import AppointmentTable from '../components/AppointmentTable';
import AdminPanel from '../components/AdminPanel'; // Ensure ye file exist karti ho

const Dashboard = () => {
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const role = user?.role || 'patient'; 

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  // Menu items based on role
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} />, roles: ['doctor', 'receptionist', 'patient', 'admin'] },
    { id: 'patients', label: 'Patient List', icon: <Users size={20} />, roles: ['doctor', 'receptionist', 'admin'] },
    { id: 'appointments', label: 'Appointments', icon: <Calendar size={20} />, roles: ['doctor', 'receptionist', 'patient', 'admin'] },
    { id: 'admin-panel', label: 'Admin Panel', icon: <ShieldCheck size={20} />, roles: ['admin'] }, 
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 m-4 rounded-[2.5rem] flex flex-col p-6 text-white shadow-2xl">
        <div className="flex items-center gap-3 px-2 mb-10">
          <Activity className="text-blue-500" size={28} />
          <span className="text-xl font-black tracking-tighter italic">CareStream</span>
        </div>

        <nav className="flex-1 space-y-2">
          {filteredMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                {item.icon}
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </div>
              {activeTab === item.id && <ChevronRight size={14} />}
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} className="mt-auto flex items-center gap-4 px-4 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl font-bold text-sm">
          <LogOut size={20} /> Sign Out
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">{activeTab.replace('-', ' ')}</h1>
            <p className="text-slate-500 font-bold text-sm">Logged in as: <span className="text-blue-600 uppercase">{role}</span></p>
          </div>
          <div className="flex items-center gap-4 bg-white p-3 rounded-3xl shadow-sm border border-slate-100">
            <div className="text-right mr-2">
              <p className="font-black text-slate-800 leading-none">{user?.name}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Authorized</p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600"><User size={20}/></div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            
            {/* OVERVIEW SECTION */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {role === 'receptionist' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                      <h3 className="text-lg font-black mb-6 text-blue-600 flex items-center gap-2 tracking-tight underline decoration-blue-100 underline-offset-8">PATIENT REGISTRATION</h3>
                      <AddPatient />
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                      <h3 className="text-lg font-black mb-6 text-orange-500 flex items-center gap-2 tracking-tight underline decoration-orange-100 underline-offset-8">BOOKING PANEL</h3>
                      <BookAppointment />
                    </div>
                  </div>
                )}

                {role === 'doctor' && (
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                     <h3 className="text-xl font-black mb-6 italic underline decoration-blue-600 underline-offset-8">TODAY'S PATIENT QUEUE</h3>
                     <PatientTable />
                  </div>
                )}

                {role === 'patient' && (
                  <div className="bg-blue-600 p-12 rounded-[3.5rem] text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
                    <h2 className="text-4xl font-black mb-3">Welcome, {user?.name}!</h2>
                    <p className="opacity-80 font-bold text-lg">Your medical records are updated and secure.</p>
                    <Activity className="absolute right-[-20px] bottom-[-20px] text-white/10" size={240} />
                  </div>
                )}
                
                {role === 'admin' && (
                  <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl shadow-slate-400">
                    <h2 className="text-4xl font-black mb-3">Administrator Mode</h2>
                    <p className="opacity-80 font-bold text-lg italic">Control the system access and user roles from here.</p>
                  </div>
                )}
              </div>
            )}

            {/* PATIENTS LIST */}
            {activeTab === 'patients' && (
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <PatientTable />
              </div>
            )}

            {/* APPOINTMENTS SECTION */}
            {activeTab === 'appointments' && (
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                {role === 'patient' ? <PatientAppointments /> : <AppointmentTable />}
              </div>
            )}

            {/* ADMIN PANEL SECTION */}
            {activeTab === 'admin-panel' && (
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <AdminPanel />
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;