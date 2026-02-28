import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { 
  Clock, FileDown, Activity, Calendar, 
  User, Clipboard, Pill, ChevronRight 
} from 'lucide-react';
import { motion } from 'framer-motion';

const PatientProfile = ({ patientId, patientData }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!patientId) return;
    
    // Real-time prescription history fetching
    const q = query(
      collection(db, "prescriptions"),
      where("patientId", "==", patientId),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [patientId]);

  const downloadPDF = (data) => {
    const doc = new jsPDF();
    // Professional Header
    doc.setFillColor(30, 64, 175); // Dark Blue
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("CARESTREAM MEDICAL REPORT", 105, 25, { align: "center" });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Patient Name: ${patientData?.name}`, 20, 55);
    doc.text(`Report Date: ${data.date}`, 20, 63);
    doc.text(`Patient ID: ${patientId.slice(0, 8)}`, 20, 71);

    // Prescription Table
    const tableColumn = ["Medicine Name", "Dosage", "Notes"];
    const tableRows = data.medicines.map(m => [m.name, m.dosage, m.notes || "As directed"]);

    doc.autoTable({
      startY: 80,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [30, 64, 175] }
    });

    doc.save(`Report_${patientData?.name}_${data.date}.pdf`);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Patient Summary Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center gap-8"
      >
        <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <User size={48} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">{patientData?.name}</h2>
          <div className="flex gap-4 mt-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-widest">
              Age: {patientData?.age}
            </span>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest">
              {patientData?.gender}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Medical History Timeline */}
      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-10">
          <Activity className="text-red-500" />
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Medical History Timeline</h3>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
          {history.length === 0 ? (
            <div className="ml-12 text-slate-400 font-bold italic py-4 tracking-widest uppercase text-sm">
              No medical records found.
            </div>
          ) : (
            history.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-8"
              >
                {/* Timeline Circle */}
                <div className="absolute left-0 w-10 h-10 rounded-full bg-white border-4 border-blue-500 flex items-center justify-center shadow-lg z-10">
                  <Calendar size={14} className="text-blue-500" />
                </div>
                
                {/* Timeline Content */}
                <div className="ml-14 flex-1 bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all group">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{item.date}</span>
                    <button 
                      onClick={() => downloadPDF(item)}
                      className="bg-white p-2 rounded-xl text-blue-600 shadow-sm hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 text-xs font-bold"
                    >
                      <FileDown size={16} /> PDF
                    </button>
                  </div>

                  <div className="space-y-3">
                    {item.medicines.map((m, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm">
                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Pill size={16} /></div>
                        <div>
                          <p className="text-sm font-bold text-slate-700 leading-none">{m.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{m.dosage}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;