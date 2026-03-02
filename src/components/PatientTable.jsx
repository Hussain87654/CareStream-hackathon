import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Database, User, Activity, Search, ShieldCheck } from 'lucide-react';

const PatientTable = ({ onPatientSelect }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch Patients from Firestore
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "patients"));
        const patientsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPatients(patientsList);
      } catch (err) {
        console.error("Database Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  // 2. Filter Search
  const filteredPatients = patients.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.ailment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* --- SEARCH BAR --- */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/30 group-focus-within:text-emerald-500 transition-colors" size={16} />
        <input 
          type="text" 
          placeholder="Filter Subject by Name or Ailment..."
          className="w-full pl-12 pr-4 py-4 bg-black/40 border border-emerald-500/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 outline-none focus:border-emerald-500/30 transition-all placeholder:text-slate-700 shadow-inner"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- DATA TABLE --- */}
      <div className="overflow-hidden rounded-[2.5rem] border border-emerald-500/10 bg-slate-900/20 backdrop-blur-md shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-500/5 border-b border-emerald-500/10">
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 italic">Subject Identity</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 italic">Biological Ailment</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 italic text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-500/5">
            {loading ? (
              <tr>
                <td colSpan="3" className="p-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Activity className="text-emerald-500 animate-pulse" size={32} />
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] animate-pulse">Syncing Neural Database...</p>
                  </div>
                </td>
              </tr>
            ) : filteredPatients.length > 0 ? (
              filteredPatients.map((p) => (
                <tr 
                  key={p.id} 
                  // YE CLICK LOGIC HAI: Dashboard ko batata hai kaunsa patient select hua
                  onClick={() => onPatientSelect && onPatientSelect(p)}
                  className="hover:bg-emerald-500/5 cursor-pointer transition-all group border-l-4 border-transparent hover:border-emerald-500"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-black/50 border border-emerald-500/10 flex items-center justify-center text-emerald-500/40 group-hover:text-emerald-500 group-hover:border-emerald-500/40 transition-all">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="font-black text-white text-sm tracking-tighter uppercase italic group-hover:text-emerald-400 transition-colors">{p.name}</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Age: {p.age}y // Node: {p.id.slice(0,6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="text-xs font-bold text-slate-400 italic uppercase tracking-tight group-hover:text-slate-200 transition-colors">
                      {p.ailment}
                    </p>
                  </td>
                  <td className="p-6 text-right">
                    <span className="px-4 py-1.5 bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(16,185,129,0.05)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all">
                      {p.status || 'Verified'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-20 text-center font-black text-slate-700 uppercase tracking-widest text-[10px]">
                  No Matching Identity Found in Grid.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER STATUS --- */}
      <div className="flex items-center justify-between px-8 py-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Database size={14} className="text-emerald-500" />
          <span className="text-[9px] font-black uppercase text-emerald-500/60 tracking-[0.3em]">Secure Grid Connections: {filteredPatients.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
          <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest italic">Live Uplink Active</span>
        </div>
      </div>
    </div>
  );
};

export default PatientTable;