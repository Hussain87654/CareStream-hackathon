import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { UserPlus, Fingerprint, Activity, Save } from 'lucide-react';

const AddPatient = () => {
  const [patient, setPatient] = useState({ name: '', age: '', gender: '', phone: '', ailment: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "patients"), {
        ...patient,
        registeredAt: new Date().toISOString(),
        status: 'waiting'
      });
      alert("Subject Identity Registered Successfully.");
      setPatient({ name: '', age: '', gender: '', phone: '', ailment: '' });
    } catch (err) {
      alert("Data Uplink Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest ml-1 italic">Subject Name</label>
          <input 
            type="text" required placeholder="John Doe"
            className="w-full bg-black/40 border border-emerald-500/10 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-700 shadow-inner"
            value={patient.name} onChange={(e) => setPatient({...patient, name: e.target.value})}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest ml-1 italic">Age Vector</label>
          <input 
            type="number" required placeholder="25"
            className="w-full bg-black/40 border border-emerald-500/10 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-emerald-500/40 transition-all"
            value={patient.age} onChange={(e) => setPatient({...patient, age: e.target.value})}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest ml-1 italic">Primary Ailment / Condition</label>
        <textarea 
          rows="2" required placeholder="Describe symptoms..."
          className="w-full bg-black/40 border border-emerald-500/10 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-emerald-500/40 transition-all resize-none shadow-inner"
          value={patient.ailment} onChange={(e) => setPatient({...patient, ailment: e.target.value})}
        ></textarea>
      </div>

      <button 
        type="submit" disabled={loading}
        className="w-full py-4 bg-emerald-500 text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
      >
        <Save size={14}/> {loading ? "ENCRYPTING DATA..." : "COMMIT TO RECORDS"}
      </button>
    </form>
  );
};

export default AddPatient;