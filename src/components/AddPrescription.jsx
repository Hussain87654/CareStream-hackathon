import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { FilePlus, Edit3, Pill, Save, Zap } from 'lucide-react';

const AddPrescription = ({ patientId, patientName }) => {
  const [data, setData] = useState({ diagnosis: '', medicines: '', instructions: '' });
  const [loading, setLoading] = useState(false);

  const handlePrescribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "prescriptions"), {
        patientId,
        patientName,
        ...data,
        date: new Date().toLocaleDateString(),
        timestamp: new Date().toISOString()
      });
      alert("PRESCRIPTION ENCRYPTED & SAVED.");
      setData({ diagnosis: '', medicines: '', instructions: '' });
    } catch (err) {
      alert("Link Error: Transmission Interrupted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-emerald-500/20 backdrop-blur-xl relative overflow-hidden group">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-all duration-700"></div>

      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500">
          <Edit3 size={20} />
        </div>
        <div>
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Prescription <span className="text-emerald-500">Pad</span></h3>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Patient: {patientName}</p>
        </div>
      </div>

      <form onSubmit={handlePrescribe} className="space-y-6">
        <div className="space-y-1">
          <label className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] ml-2 italic">Neural Diagnosis</label>
          <input 
            type="text" required placeholder="Fever / Critical Condition"
            className="w-full bg-black/60 border border-emerald-500/10 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-700"
            value={data.diagnosis} onChange={(e) => setData({...data, diagnosis: e.target.value})}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] ml-2 italic">Active Medication List</label>
          <textarea 
            rows="3" required placeholder="1. Panadol (2x daily)&#10;2. Antibiotics"
            className="w-full bg-black/60 border border-emerald-500/10 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-700 resize-none"
            value={data.medicines} onChange={(e) => setData({...data, medicines: e.target.value})}
          ></textarea>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] ml-2 italic">Uplink Instructions</label>
          <input 
            type="text" placeholder="Bed rest for 3 days"
            className="w-full bg-black/60 border border-emerald-500/10 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-700"
            value={data.instructions} onChange={(e) => setData({...data, instructions: e.target.value})}
          />
        </div>

        <button 
          type="submit" disabled={loading}
          className="w-full py-5 bg-emerald-500 text-black rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3 mt-4"
        >
          {loading ? "ENCRYPTING..." : <><Save size={16}/> COMMIT PRESCRIPTION</>}
        </button>
      </form>
    </div>
  );
};

export default AddPrescription;