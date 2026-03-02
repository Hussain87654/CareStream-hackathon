import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Calendar, Clock, User, Zap, Save } from 'lucide-react';

const BookAppointment = () => {
  const [booking, setBooking] = useState({ patientName: '', doctorName: '', date: '', time: '' });
  const [loading, setLoading] = useState(false);

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "appointments"), {
        ...booking,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      });
      alert("Uplink Successful: Appointment Scheduled.");
      setBooking({ patientName: '', doctorName: '', date: '', time: '' });
    } catch (err) {
      alert("Scheduling Conflict: Data Rejection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleBooking} className="space-y-4">
      <div className="space-y-1">
        <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest ml-1 italic">Subject Identity</label>
        <div className="relative group">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500/30 group-focus-within:text-emerald-500" size={14} />
          <input 
            type="text" required placeholder="Patient Name"
            className="w-full pl-10 pr-4 py-3 bg-black/40 border border-emerald-500/10 rounded-xl text-xs font-bold text-white outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-700 shadow-inner"
            value={booking.patientName} onChange={(e) => setBooking({...booking, patientName: e.target.value})}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest ml-1 italic">Date Vector</label>
          <input 
            type="date" required
            className="w-full bg-black/40 border border-emerald-500/10 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-emerald-500/40 transition-all"
            value={booking.date} onChange={(e) => setBooking({...booking, date: e.target.value})}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest ml-1 italic">Time Slot</label>
          <input 
            type="time" required
            className="w-full bg-black/40 border border-emerald-500/10 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-emerald-500/40 transition-all"
            value={booking.time} onChange={(e) => setBooking({...booking, time: e.target.value})}
          />
        </div>
      </div>

      <button 
        type="submit" disabled={loading}
        className="w-full py-4 bg-emerald-500 text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
      >
        <Zap size={14}/> {loading ? "PROCESSING..." : "FINALIZE UPLINK"}
      </button>
    </form>
  );
};

export default BookAppointment;