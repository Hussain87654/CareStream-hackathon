import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, User, Stethoscope, 
  ChevronRight, AlertCircle, CheckCircle2 
} from 'lucide-react';

const BookAppointment = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorName: '',
    date: '',
    time: '',
    reason: '',
    status: 'pending'
  });

  // Fetch Patients for Dropdown
  useEffect(() => {
    const fetchPatients = async () => {
      const q = query(collection(db, "patients"), orderBy("name", "asc"));
      const snapshot = await getDocs(q);
      setPatients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "appointments"), {
        ...formData,
        createdAt: serverTimestamp()
      });
      alert("Appointment Scheduled Successfully! 📅");
      setFormData({ patientId: '', doctorName: '', date: '', time: '', reason: '', status: 'pending' });
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2.5 rounded-2xl text-white shadow-lg shadow-orange-200">
            <Calendar size={22} />
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">SMART SCHEDULER</h2>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase">System Online</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Patient Selection */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Select Registered Patient</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
            <select 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-700 appearance-none transition-all"
              value={formData.patientId}
              onChange={(e) => setFormData({...formData, patientId: e.target.value})}
              required
            >
              <option value="">Choose a patient...</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} (Age: {p.age})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Doctor Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Assign Specialist</label>
            <div className="relative group">
              <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="e.g. Dr. Sarah"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-700 transition-all"
                value={formData.doctorName}
                onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Consultation Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="date" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-700 transition-all"
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>
          </div>
        </div>

        {/* Reason for Visit */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Reason / Symptoms</label>
          <div className="relative">
            <AlertCircle className="absolute left-4 top-4 text-slate-400" size={18} />
            <textarea 
              placeholder="Primary symptoms or checkup details..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-700 transition-all min-h-25"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
            />
          </div>
        </div>

        {/* Booking Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-orange-500 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl shadow-orange-100 group"
        >
          {loading ? "Processing..." : (
            <>
              Confirm Appointment <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default BookAppointment;