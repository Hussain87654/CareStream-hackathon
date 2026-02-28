import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, User, Phone, MapPin, 
  Droplet, Activity, Calendar, FileText, 
  Download, Plus, HeartPulse
} from 'lucide-react';
import PatientProfile from '../components/PatientProfile'; // Jo pehle banaya tha

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      const docRef = doc(db, "patients", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPatient(docSnap.data());
      }
      setLoading(false);
    };
    fetchPatientData();
  }, [id]);

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-blue-600">LOADING PATIENT FILE...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10">
      {/* Top Navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-all mb-8 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100"
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Patient Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden"
          >
            {/* Design Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[5rem] -z-0"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white mb-4 shadow-xl shadow-blue-200">
                <User size={48} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{patient?.name}</h2>
              <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-6">Patient ID: {id.slice(0, 8)}</p>
              
              <div className="w-full space-y-4 text-left">
                <InfoRow icon={<Calendar size={18}/>} label="Age" value={`${patient?.age} Years`} />
                <InfoRow icon={<User size={18}/>} label="Gender" value={patient?.gender} />
                <InfoRow icon={<Droplet size={18} className="text-red-500"/>} label="Blood Group" value={patient?.bloodGroup} />
                <InfoRow icon={<Phone size={18}/>} label="Contact" value={patient?.phone} />
                <InfoRow icon={<MapPin size={18}/>} label="Address" value={patient?.address} />
              </div>
            </div>
          </motion.div>

          {/* Medical History Summary */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <HeartPulse className="text-blue-400" />
              <h3 className="font-bold uppercase tracking-widest text-sm">Medical Notes</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed italic">
              "{patient?.history || "No chronic medical history recorded for this patient."}"
            </p>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Timeline & Prescriptions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickStat label="Last Visit" value="2 Days Ago" color="bg-blue-500" />
            <QuickStat label="Status" value="Stable" color="bg-emerald-500" />
            <QuickStat label="Reports" value="12 Total" color="bg-purple-500" />
            <QuickStat label="Pending" value="None" color="bg-orange-500" />
          </div>

          {/* The Timeline Component we built earlier */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
             <PatientProfile patientId={id} patientData={patient} />
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper Components
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
    <div className="text-slate-400">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-700">{value}</p>
    </div>
  </div>
);

const QuickStat = ({ label, value, color }) => (
  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{label}</p>
    <p className={`text-sm font-black text-white px-3 py-1 rounded-full ${color}`}>{value}</p>
  </div>
);

export default PatientDetails;