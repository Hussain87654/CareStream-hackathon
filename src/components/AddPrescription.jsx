import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill, Plus, Trash2, Save, 
  FileText, Activity, AlertCircle, Check 
} from 'lucide-react';

const AddPrescription = ({ patientId, onComplete }) => {
  const [medicines, setMedicines] = useState([]);
  const [currentMed, setCurrentMed] = useState({ name: '', dosage: '', notes: '' });
  const [loading, setLoading] = useState(false);

  // Medicine list mein add karne ke liye
  const addMedicine = () => {
    if (currentMed.name && currentMed.dosage) {
      setMedicines([...medicines, currentMed]);
      setCurrentMed({ name: '', dosage: '', notes: '' });
    }
  };

  // Medicine remove karne ke liye
  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  // Final Save to Firestore
  const handleSave = async () => {
    if (medicines.length === 0) return alert("Please add at least one medicine");
    
    setLoading(true);
    try {
      await addDoc(collection(db, "prescriptions"), {
        patientId,
        medicines,
        date: new Date().toLocaleDateString(),
        createdAt: serverTimestamp()
      });
      alert("Prescription Saved Successfully!");
      if (onComplete) onComplete(); // Modal close karne ya refresh ke liye
      setMedicines([]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
          <FileText size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">DIGITAL PRESCRIPTION</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Add medication for patient</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Medicine Name (e.g. Panadol)" 
            className="p-4 bg-white rounded-2xl outline-none border border-slate-100 focus:ring-2 focus:ring-blue-500 font-bold text-sm transition-all"
            value={currentMed.name}
            onChange={(e) => setCurrentMed({...currentMed, name: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Dosage (e.g. 1-0-1 After Food)" 
            className="p-4 bg-white rounded-2xl outline-none border border-slate-100 focus:ring-2 focus:ring-blue-500 font-bold text-sm transition-all"
            value={currentMed.dosage}
            onChange={(e) => setCurrentMed({...currentMed, dosage: e.target.value})}
          />
        </div>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Additional Notes (Optional)" 
            className="flex-1 p-4 bg-white rounded-2xl outline-none border border-slate-100 focus:ring-2 focus:ring-blue-500 font-bold text-sm transition-all"
            value={currentMed.notes}
            onChange={(e) => setCurrentMed({...currentMed, notes: e.target.value})}
          />
          <button 
            onClick={addMedicine}
            className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-slate-900 transition-all shadow-lg shadow-blue-100"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* List of Added Medicines */}
      <div className="space-y-3 mb-10">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Medication List</h3>
        <AnimatePresence>
          {medicines.map((m, index) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={index} 
              className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Pill size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm leading-none">{m.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{m.dosage}</p>
                </div>
              </div>
              <button 
                onClick={() => removeMedicine(index)}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
          {medicines.length === 0 && (
            <div className="text-center py-8 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
               <p className="text-xs font-bold text-slate-400">NO MEDICINES ADDED YET</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Save Button */}
      {medicines.length > 0 && (
        <button 
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-2xl"
        >
          {loading ? "SAVING..." : <><Check size={20} /> FINALIZE & SAVE PRESCRIPTION</>}
        </button>
      )}
    </div>
  );
};

export default AddPrescription;