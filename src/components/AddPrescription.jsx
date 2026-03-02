import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { checkMedicationSafety } from '../services/aiService';
import { FilePlus, ShieldAlert, Brain, Save, Loader2 } from 'lucide-react';

const AddPrescription = ({ patientId, patientName, patientHistory }) => {
  const [data, setData] = useState({ diagnosis: '', medicines: '', instructions: '' });
  const [loading, setLoading] = useState(false);
  const [aiWarning, setAiWarning] = useState(null);
  const [checking, setChecking] = useState(false);

  const runSafetyCheck = async () => {
    if (!data.medicines) return alert("Enter medicines first.");
    setChecking(true);
    const result = await checkMedicationSafety(data.medicines, patientHistory || "General History");
    setAiWarning(result);
    setChecking(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "prescriptions"), {
        patientId,
        patientName,
        ...data,
        aiSafetyNote: aiWarning,
        date: new Date().toLocaleDateString(),
      });
      alert("PRESCRIPTION SAVED TO GRID.");
      setData({ diagnosis: '', medicines: '', instructions: '' });
      setAiWarning(null);
    } catch (err) {
      alert("Uplink Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 p-8 rounded-[2.5rem] border border-emerald-500/20 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500"><FilePlus size={20}/></div>
        <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">AI Prescription Pad</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input 
          type="text" required placeholder="Diagnosis"
          className="w-full bg-black/40 border border-emerald-500/10 rounded-xl p-4 text-xs font-bold text-white outline-none focus:border-emerald-500/40 transition-all"
          value={data.diagnosis} onChange={(e) => setData({...data, diagnosis: e.target.value})}
        />

        <textarea 
          rows="3" required placeholder="Medicines (e.g. Paracetamol 500mg)"
          className="w-full bg-black/40 border border-emerald-500/10 rounded-xl p-4 text-xs font-bold text-white outline-none focus:border-emerald-500/40 h-24 resize-none"
          value={data.medicines} onChange={(e) => setData({...data, medicines: e.target.value})}
        />

        {/* AI Safety Button */}
        <button 
          type="button" onClick={runSafetyCheck}
          className="w-full py-2 bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2"
        >
          {checking ? <Loader2 size={12} className="animate-spin"/> : <Brain size={12}/>}
          {checking ? "Scanning Bio-Data..." : "Run AI Safety Protocol"}
        </button>

        {aiWarning && (
          <div className={`p-4 rounded-xl border text-[10px] italic ${aiWarning.includes('Nominal') ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/5 border-rose-500/20 text-rose-400'}`}>
            <p className="font-black mb-1 uppercase tracking-tighter">Analysis Response:</p>
            {aiWarning}
          </div>
        )}

        <button 
          type="submit" disabled={loading}
          className="w-full py-4 bg-emerald-500 text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10"
        >
          {loading ? "COMMITTING..." : "SAVE PRESCRIPTION"}
        </button>
      </form>
    </div>
  );
};

export default AddPrescription;