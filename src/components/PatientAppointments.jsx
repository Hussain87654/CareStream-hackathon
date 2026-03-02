import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, CalendarCheck, Clock } from 'lucide-react';

const PatientAppointments = () => {
  const { user } = useAuth();
  const [myAppts, setMyAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyAppts = async () => {
      // Logic: Apne name se match hone wali appointments filter karo
      const q = query(collection(db, "appointments"), where("patientName", "==", user?.name));
      const querySnapshot = await getDocs(q);
      setMyAppts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    if(user?.name) fetchMyAppts();
  }, [user]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        <div className="col-span-full p-20 text-center font-black text-slate-700 uppercase animate-pulse">Scanning Neural Network...</div>
      ) : myAppts.length > 0 ? (
        myAppts.map((appt) => (
          <div key={appt.id} className="bg-slate-900/40 border border-emerald-500/10 p-6 rounded-4xl hover:border-emerald-500/40 transition-all shadow-xl backdrop-blur-sm group">
             <div className="flex items-center justify-between mb-6">
               <CalendarCheck className="text-emerald-500 group-hover:scale-110 transition-transform" size={24}/>
               <span className="text-[8px] font-black uppercase text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full">Active Schedule</span>
             </div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Appointment On</p>
             <h4 className="text-xl font-black text-white italic tracking-tighter mb-4 underline decoration-emerald-500/20">{appt.date}</h4>
             <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase">
               <Clock size={14} className="text-emerald-500"/> {appt.time}
             </div>
          </div>
        ))
      ) : (
        <div className="col-span-full bg-slate-900/20 border-2 border-dashed border-emerald-500/10 p-20 rounded-[3rem] text-center">
          <ShieldAlert className="mx-auto text-emerald-500/20 mb-4" size={48}/>
          <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No Active Uplinks Found For Your Identity.</p>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;