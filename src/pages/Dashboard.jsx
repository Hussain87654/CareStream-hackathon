import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Calendar, FileText, 
  LogOut, Plus, Activity, Bell, UserPlus, Clock, 
  ChevronRight, ShieldCheck, Shield
  
} from 'lucide-react';

// Components - Ensure these files exist in src/components/
import AddPatient from '../components/AddPatient';
import BookAppointment from '../components/BookAppointment';
import PatientTable from '../components/PatientTable';
import PatientAppointments from '../components/PatientAppointments';
import AppointmentTable from '../components/AppointmentTable';
import AdminPanel from './AdminPanel';
const Dashboard = () => {
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Role identify karna
  const role = user?.role || 'patient'; 

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  // Sidebar Menu based on Role
  // Sidebar menu items ke paas ye condition check karo
const menuItems = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} />, roles: ['doctor', 'receptionist', 'patient', 'admin'] },
  { id: 'patients', label: 'Patient List', icon: <Users size={20} />, roles: ['doctor', 'receptionist', 'admin'] },
  { id: 'appointments', label: 'Appointments', icon: <Calendar size={20} />, roles: ['doctor', 'receptionist', 'patient', 'admin'] },
  // Admin Panel ka option sirf admin ko dikhega
  { id: 'admin-panel', label: 'Admin Panel', icon: <ShieldCheck size={20} />, roles: ['admin'] }, 
];

  const filteredMenu = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-slate-900 m-4 rounded-[2.5rem] flex flex-col p-6 text-white shadow-2xl">
        <div className="flex items-center gap-3 px-2 mb-10">
          <Activity className="text-blue-500" size={28} />
          <span className="text-xl font-black tracking-tighter">CareStream</span>
        </div>

        <nav className="flex-1 space-y-2">
          {filteredMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-4">
                {item.icon}
                <span className="font-bold text-sm">{item.label}</span>
              </div>
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} className="mt-auto flex items-center gap-4 px-4 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl">
          <LogOut size={20} /> <span className="font-bold text-sm">Sign Out</span>
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">{activeTab}</h1>
            <p className="text-slate-500 font-bold text-sm">Role: <span className="text-blue-600 uppercase">{role}</span></p>
          </div>
          <div className="text-right">
            <p className="font-black text-slate-800">{user?.name}</p>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Receptionist: Add Patient & Book Forms */}
                {role === 'receptionist' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                      <h3 className="text-lg font-black mb-6 text-blue-600 flex items-center gap-2"><UserPlus size={18}/> Register Patient</h3>
                      <AddPatient />
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                      <h3 className="text-lg font-black mb-6 text-orange-500 flex items-center gap-2"><Clock size={18}/> Schedule Appointment</h3>
                      <BookAppointment />
                    </div>
                  </div>
                )}

                {/* Doctor: Stats & Quick Patient Table */}
                {role === 'doctor' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 italic">Dr. Stats: 12 Patients Today</div>
                      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 italic">5 New Appointments</div>
                      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 italic">8 Completed</div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                       <h3 className="text-xl font-black mb-6">Patient Queue</h3>
                       <PatientTable />
                    </div>
                  </div>
                )}

                {/* Patient: Personalized Health Banner & List */}
                {role === 'patient' && (
                  <div className="space-y-8">
                    <div className="bg-blue-600 p-12 rounded-[3rem] text-white shadow-xl">
                      <h2 className="text-4xl font-black mb-2 tracking-tight">Health Dashboard</h2>
                      <p className="opacity-80">Track your upcoming checkups and medical history.</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                      <PatientAppointments />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. PATIENTS LIST TAB (Only Staff) */}
            {activeTab === 'patients' && (role === 'doctor' || role === 'receptionist') && (
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <PatientTable />
              </div>
            )}

            {/* 3. APPOINTMENTS TAB (Role-Based Display) */}
            {activeTab === 'appointments' && (
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                {role === 'patient' ? (
                  <PatientAppointments /> // Patient ko sirf apni dikhegi
                ) : (
                  <AppointmentTable /> // Staff ko sab ki dikhegi
                )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;