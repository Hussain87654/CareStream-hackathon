import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Trash2, Eye, User, MoreHorizontal, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PatientTable = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();
  // --- Real-time Data Fetching ---
  useEffect(() => {
    const q = query(collection(db, "patients"), orderBy("createdAt", "desc"));
    
    // onSnapshot use karne se data auto-update hoga bina refresh kiye
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const patientList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPatients(patientList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- Delete Function ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient record?")) {
      try {
        await deleteDoc(doc(db, "patients", id));
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
  };

  // --- Filter Logic ---
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-10 text-slate-500 font-bold tracking-widest animate-pulse">LOADING DATABASE...</div>;

  return (
    <div className="space-y-6">
      {/* Table Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800" size={18} />
          <input 
            type="text" 
            placeholder="Search by name..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition">
            <Filter size={16} /> <span className="text-sm font-bold">Filter</span>
          </button>
        </div>
      </div>

      {/* Actual Table */}
      <div className="overflow-x-auto rounded-3xl border border-slate-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.2em]">
              <th className="p-5 font-black">Patient Identity</th>
              <th className="p-5 font-black">Basic Info</th>
              <th className="p-5 font-black">Medical Status</th>
              <th className="p-5 font-black text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((p) => (
                  <motion.tr 
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="group hover:bg-blue-50/30 transition-all duration-300"
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm group-hover:scale-110 transition-transform">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm leading-none mb-1">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">ID: {p.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-600">{p.age} Years</span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase">{p.gender}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black rounded-full uppercase">
                        Stable
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => navigate(`/patient/${p.id}`)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm bg-white border border-slate-100">
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm bg-white border border-slate-100"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest">
                    No records found
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientTable;