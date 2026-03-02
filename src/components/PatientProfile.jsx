import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { User, Activity, Clock, FileText, ChevronRight, Zap } from 'lucide-react';

const PatientProfile = ({ patientId }) => {
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchFullProfile = async () => {
      // Fetch Basic Info
      const pDoc = await getDoc(doc(db, "patients", patientId));
      if (pDoc.exists()) setPatient(pDoc.data());

      // Fetch Prescription History
      const q = query(collection(db, "prescriptions"), where("patientId", "==", patientId));
      const qSnap = await getDocs(q);
      setHistory(qSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    if (patientId) fetchFullProfile();
  }, [patientId]);

  if (!patient) return <div className="p-20 text-center font-black text-emerald-500 animate-pulse uppercase tracking-[0.3em]">Accessing Profile Node...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Profile Header Card */}
      <div className="bg-linear-to-r from-emerald-500/20 to-transparent p-8 rounded-[3rem] border border-emerald-500/20 backdrop-blur-md flex items-center gap-8">
        <div className="w-24 h-24 bg-emerald-500 rounded-4xl flex items-center justify-center text-black shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <User size={48} />
        </div>
        <div>
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">{patient.name}</h2>
          <div className="flex gap-4 mt-3">
            <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest bg-black/40 px-3 py-1 rounded-full border border-emerald-500/10">Age: {patient.age}y</span>
            <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest bg-black/40 px-3 py-1 rounded-full border border-emerald-500/10">Gender: {patient.gender}</span>
          </div>
        </div>
      </div>

      {/* History Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xs font-black text-emerald-500 uppercase tracking-[0.4em] flex items-center gap-2">
            <Clock size={14}/> Neural History Logs
          </h3>
          <div className="space-y-4">
            {history.length > 0 ? history.map((log) => (
              <div key={log.id} className="bg-slate-900/40 border border-emerald-500/5 p-6 rounded-3xl hover:border-emerald-500/20 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{log.date}</p>
                  <Zap size={14} className="text-emerald-500 animate-pulse" />
                </div>
                <h4 className="text-white font-black uppercase text-sm tracking-tight mb-2 underline decoration-emerald-500/10 italic">Diagnosis: {log.diagnosis}</h4>
                <p className="text-slate-400 text-xs font-medium leading-relaxed italic">Medication: {log.medicines}</p>
              </div>
            )) : (
              <div className="p-10 border-2 border-dashed border-emerald-500/5 rounded-4xl text-center text-slate-600 font-black uppercase text-[10px] tracking-widest">No previous data found.</div>
            )}
          </div>
        </div>

        {/* Vital Stats Sidebar */}
        <div className="bg-slate-900/60 p-8 rounded-[3rem] border border-emerald-500/10 h-fit">
          <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-6 italic underline">Primary Bio-Markers</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Ailment Vector:</span>
              <span className="text-xs font-black text-white italic uppercase">{patient.ailment}</span>
            </div>
            <div className="w-full h-px bg-emerald-500/10"></div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Identity Uplink:</span>
              <span className="text-xs font-black text-white italic uppercase">{patient.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;