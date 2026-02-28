import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';
import { Clock, Calendar, User, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AppointmentTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (id, newStatus) => {
    const docRef = doc(db, "appointments", id);
    await updateDoc(docRef, { status: newStatus });
  };

  if (loading) return <div className="text-center py-10 font-bold text-slate-400">LOADING SCHEDULE...</div>;

  return (
    <div className="overflow-x-auto rounded-4xl border border-slate-100 bg-white">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.2em]">
            <th className="p-5 font-black">Patient & Doctor</th>
            <th className="p-5 font-black">Date & Time</th>
            <th className="p-5 font-black">Reason</th>
            <th className="p-5 font-black">Status</th>
            <th className="p-5 font-black text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          <AnimatePresence>
            {appointments.map((app) => (
              <motion.tr 
                key={app.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-blue-50/30 transition-all"
              >
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-xl text-orange-600"><User size={18}/></div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm italic">Dr. {app.doctorName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Patient ID: {app.patientId?.slice(0,6)}</p>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1"><Calendar size={12}/> {app.date}</span>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1"><Clock size={12}/> {app.time || "Morning"}</span>
                  </div>
                </td>
                <td className="p-5">
                  <p className="text-xs text-slate-500 font-medium truncate max-w-37.5">{app.reason || "General Checkup"}</p>
                </td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {app.status || 'Pending'}
                  </span>
                </td>
                <td className="p-5">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => updateStatus(app.id, 'confirmed')} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg"><CheckCircle size={18}/></button>
                    <button onClick={() => updateStatus(app.id, 'cancelled')} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><XCircle size={18}/></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;