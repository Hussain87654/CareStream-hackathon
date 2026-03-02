import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Calendar, Clock, ShieldCheck, Activity } from 'lucide-react';

const AppointmentTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      const querySnapshot = await getDocs(collection(db, "appointments"));
      setAppointments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchAppointments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-3xl border border-emerald-500/10">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-emerald-500/5 border-b border-emerald-500/10">
              <th className="p-5 font-black uppercase tracking-widest text-emerald-500 italic underline decoration-emerald-500/20">Subject / Patient</th>
              <th className="p-5 font-black uppercase tracking-widest text-emerald-500">Temporal Data (Date/Time)</th>
              <th className="p-5 font-black uppercase tracking-widest text-emerald-500">System Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-500/5">
            {loading ? (
              <tr><td colSpan="3" className="p-20 text-center font-black text-slate-700 uppercase animate-pulse">Syncing Scheduled Uplinks...</td></tr>
            ) : appointments.map((appt) => (
              <tr key={appt.id} className="hover:bg-emerald-500/5 transition-colors">
                <td className="p-5">
                  <p className="font-black text-white uppercase italic tracking-tighter">{appt.patientName}</p>
                  <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">ID-NODE: {appt.id.slice(0,6)}</p>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-3 text-slate-300 font-bold italic underline decoration-emerald-500/10">
                    <Calendar size={14} className="text-emerald-500"/> {appt.date}
                    <Clock size={14} className="text-emerald-500 ml-2"/> {appt.time}
                  </div>
                </td>
                <td className="p-5">
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                    {appt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentTable;