import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { ChevronLeft, Activity, ShieldCheck, Zap, User } from 'lucide-react';

// Components
import PatientProfile from '../components/PatientProfile';
import AddPrescription from '../components/AddPrescription';

const PatientDetail = () => {
  const { id } = useParams(); // URL se ID uthayega
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const docRef = doc(db, "patients", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPatient({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        console.error("Error fetching patient:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Activity className="text-emerald-500 animate-spin" size={40} />
        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em]">Decrypting Subject Data...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-6 lg:p-10 font-sans relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* --- HEADER NAVIGATION --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/40 border border-emerald-500/10 p-6 rounded-[2.5rem] backdrop-blur-md">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)}
              className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                Patient // <span className="text-emerald-500">{patient?.name}</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                <p className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest">Live Neural Uplink Active</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6 py-3 bg-black/40 border border-emerald-500/5 rounded-2xl">
            <ShieldCheck className="text-emerald-500" size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Identity Verified</span>
          </div>
        </header>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Profile & History (Scrollable) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="xl:col-span-7 space-y-8"
          >
            <div className="bg-slate-900/40 rounded-[3rem] border border-emerald-500/10 overflow-hidden shadow-2xl backdrop-blur-sm">
              <PatientProfile patientId={id} />
            </div>

            <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap size={16} className="text-emerald-500" />
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System Status: All Vitals Nominal</p>
              </div>
              <span className="text-[8px] font-black text-emerald-500/30 uppercase">CareStream OS v2.0</span>
            </div>
          </motion.div>

          {/* RIGHT: Add Prescription (Sticky) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="xl:col-span-5 xl:sticky xl:top-10"
          >
            <div className="relative group">
              {/* Outer Glow behind the form */}
              <div className="absolute -inset-1 bg-emerald-500/10 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              
              <div className="relative">
                <AddPrescription patientId={id} patientName={patient?.name} />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default PatientDetail;