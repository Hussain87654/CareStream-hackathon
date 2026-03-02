import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { summarizeHistory } from '../services/aiService';
import { User, Activity, Clock, Sparkles, Loader2 } from 'lucide-react';

const PatientProfile = ({ patientId }) => {
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [aiSummary, setAiSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const pDoc = await getDoc(doc(db, "patients", patientId));
      if (pDoc.exists()) setPatient(pDoc.data());

      const q = query(collection(db, "prescriptions"), where("patientId", "==", patientId));
      const qSnap = await getDocs(q);
      setHistory(qSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    if (patientId) fetchData();
  }, [patientId]);

  const handleAISummary = async () => {
    if (history.length === 0) return;
    setIsSummarizing(true);
    const text = history.map(h => `${h.date}: ${h.diagnosis}`).join(", ");
    const result = await summarizeHistory(text);
    setAiSummary(result);
    setIsSummarizing(false);
  };

  if (!patient) return <div className="p-10 text-emerald-500 animate-pulse font-black uppercase text-xs">Syncing Subject Profile...</div>;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]"><User size={32}/></div>
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">{patient.name}</h2>
          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Age: {patient.age}y // {patient.gender}</p>
        </div>
      </div>

      {/* AI Summary Section */}
      <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-4xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={14}/> AI Profile Summary
          </h3>
          <button onClick={handleAISummary} disabled={isSummarizing} className="text-[8px] font-black bg-emerald-500 text-black px-3 py-1 rounded-full uppercase tracking-tighter hover:bg-emerald-400 transition-all">
            {isSummarizing ? "Processing..." : "Generate AI Summary"}
          </button>
        </div>
        <p className="text-xs text-slate-400 italic">
          {aiSummary || "No summary generated. Click the button to synthesize patient history."}
        </p>
      </div>

      {/* History List */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Clock size={14}/> Neural History Logs</h3>
        {history.map((log) => (
          <div key={log.id} className="bg-black/40 border border-emerald-500/5 p-4 rounded-2xl">
            <p className="text-[9px] text-emerald-500/50 font-black mb-1">{log.date}</p>
            <h4 className="text-white text-xs font-black uppercase italic">{log.diagnosis}</h4>
            <p className="text-[10px] text-slate-500 mt-1 italic">{log.medicines}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientProfile;