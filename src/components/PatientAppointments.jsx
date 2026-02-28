import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const PatientAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    // Sirf is specific logged-in patient ki appointments lana
   const q = query(
  collection(db, "appointments"),
  where("patientId", "==", user.uid), // Ye user.uid logged-in patient ki hai
  orderBy("createdAt", "desc")
);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointments(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) return <div className="p-10 text-center text-slate-400 font-bold animate-pulse">SYNCING APPOINTMENTS...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">MY APPOINTMENTS</h3>
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
          {appointments.length} Total
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {appointments.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-4xl p-12 text-center">
            <Calendar className="mx-auto text-slate-300 mb-4" size={40} />
            <p className="text-slate-500 font-bold">No appointments found.</p>
            <p className="text-slate-400 text-xs">Your scheduled visits will appear here.</p>
          </div>
        ) : (
          appointments.map((app, index) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={app.id} 
              className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="bg-slate-50 p-4 rounded-2xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Doctor</p>
                  <p className="font-black text-slate-800">{app.doctorName}</p>
                  <p className="text-xs font-bold text-slate-500 mt-1 flex items-center gap-1">
                    <Calendar size={12} /> {app.date}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm ${
                  app.status === 'confirmed' 
                  ? 'bg-emerald-100 text-emerald-600' 
                  : 'bg-orange-100 text-orange-600'
                }`}>
                  {app.status || 'Scheduled'}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientAppointments;