import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore'; // Check your firebase import path
import { UserPlus, Activity, ShieldCheck, Zap, Brain, Loader2 } from 'lucide-react';
// Humne jo aiService banayi thi wahan se function import kar rahe hain
import { analyzeSymptoms } from '../services/aiService';

const AddPatient = () => {
  const [patient, setPatient] = useState({ name: '', age: '', gender: '', phone: '', ailment: '' });
  const [loading, setLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // AI Analysis Logic: Jab user ailment likh kar ruka hai tab trigger hoga
  const runAIAnalysis = async () => {
    if (patient.ailment.length < 5) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeSymptoms(patient.ailment);
      setAiSuggestion(result);
    } catch (err) {
      console.error("AI Node Error:", err);
      setAiSuggestion("Neural link failed. Please retry.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "patients"), {
        ...patient,
        status: 'Verified',
        createdAt: new Date().toISOString(),
        aiInitialNote: aiSuggestion // AI ki suggestion bhi save kar rahe hain
      });
      alert("Subject Uplink Successful: Patient Registered.");
      setPatient({ name: '', age: '', gender: '', phone: '', ailment: '' });
      setAiSuggestion('');
    } catch (err) {
      alert("Data Corruption: Registration Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest ml-1 italic">Identity Name</label>
          <input 
            type="text" required placeholder="Full Name"
            className="w-full bg-black/40 border border-emerald-500/10 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-700"
            value={patient.name} onChange={(e) => setPatient({...patient, name: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest ml-1 italic">Age (Years)</label>
            <input 
              type="number" required placeholder="24"
              className="w-full bg-black/40 border border-emerald-500/10 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-emerald-500/40 transition-all"
              value={patient.age} onChange={(e) => setPatient({...patient, age: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest ml-1 italic">Gender Node</label>
            <select 
              className="w-full bg-black/40 border border-emerald-500/10 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-emerald-500/40 transition-all"
              value={patient.gender} onChange={(e) => setPatient({...patient, gender: e.target.value})}
            >
              <option value="" className="bg-slate-900">Select</option>
              <option value="Male" className="bg-slate-900">Male</option>
              <option value="Female" className="bg-slate-900">Female</option>
            </select>
          </div>
        </div>

        {/* Symptoms / Ailment with AI Trigger */}
        <div className="space-y-1">
          <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest ml-1 italic flex justify-between">
            Biological Symptoms
            {patient.ailment.length > 5 && (
              <button 
                type="button" onClick={runAIAnalysis}
                className="text-[8px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 hover:bg-emerald-500 hover:text-black transition-all"
              >
                {isAnalyzing ? "Analyzing..." : "Run AI Diagnostic"}
              </button>
            )}
          </label>
          <textarea 
            required placeholder="Describe symptoms (e.g. High fever with dry cough)"
            className="w-full bg-black/40 border border-emerald-500/10 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-700 h-20 resize-none"
            value={patient.ailment} onChange={(e) => setPatient({...patient, ailment: e.target.value})}
          />
        </div>

        {/* AI Suggestion Box */}
        {aiSuggestion && (
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={14} className="text-emerald-500" />
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Neural Diagnostic Suggestions</span>
            </div>
            <div className="text-[10px] text-slate-400 italic leading-relaxed" dangerouslySetInnerHTML={{ __html: aiSuggestion }} />
          </div>
        )}

        <button 
          type="submit" disabled={loading}
          className="w-full py-4 bg-emerald-500 text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={16}/> : <UserPlus size={16}/>}
          {loading ? "COMMITTING DATA..." : "INITIALIZE UPLINK"}
        </button>
      </form>
    </div>
  );
};

export default AddPatient;