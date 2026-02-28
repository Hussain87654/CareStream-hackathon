import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Shield, User, Star, Trash2 } from 'lucide-react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { fetchUsers(); }, []);

  const changeRole = async (userId, newRole) => {
    await updateDoc(doc(db, "users", userId), { role: newRole });
    alert(`Role updated to ${newRole}`);
    fetchUsers(); // List refresh karein
  };

  return (
    <div className="p-10 bg-[#F8FAFC] min-h-screen">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-red-600 p-3 rounded-2xl text-white shadow-lg"><Shield size={28}/></div>
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">System Administration</h1>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400">User Details</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400">Current Role</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400">Assign New Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-all">
                <td className="p-6">
                  <p className="font-bold text-slate-800">{u.name}</p>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase">{u.role}</span>
                </td>
                <td className="p-6">
                  <div className="flex gap-2">
                    <button onClick={() => changeRole(u.id, 'doctor')} className="px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition">Make Doctor</button>
                    <button onClick={() => changeRole(u.id, 'receptionist')} className="px-4 py-2 bg-purple-500 text-white rounded-xl text-xs font-bold hover:bg-purple-600 transition">Make Receptionist</button>
                    <button onClick={() => changeRole(u.id, 'patient')} className="px-4 py-2 bg-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-300 transition">Reset</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;