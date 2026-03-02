import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { UserCog, ShieldCheck, User, Search, Save, RefreshCw, Cpu } from 'lucide-react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch Users from Firestore
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Update User Role
  const handleRoleChange = async (userId, newRole) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });
      alert(`Protocol Updated: User assigned to ${newRole.toUpperCase()}`);
      fetchUsers(); // List refresh karein
    } catch (err) {
      alert("Encryption Error: Access denied to modify role.");
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* --- TOP BAR: SEARCH & REFRESH --- */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-slate-900/20 p-6 rounded-4xl border border-emerald-500/5 backdrop-blur-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/40" size={18} />
          <input 
            type="text" 
            placeholder="Search Identity..."
            className="w-full pl-12 pr-4 py-3 bg-black/40 border border-emerald-500/10 rounded-xl text-xs font-black uppercase tracking-widest text-emerald-400 outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={fetchUsers}
          className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all group"
        >
          <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
          Refresh Neural Grid
        </button>
      </div>

      {/* --- USER TABLE --- */}
      <div className="overflow-hidden rounded-[2.5rem] border border-emerald-500/10 bg-slate-900/20 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-emerald-500/10 bg-emerald-500/5">
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Identity</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Access Level</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-500/5">
            {loading ? (
              <tr><td colSpan="3" className="p-20 text-center font-black text-slate-600 animate-pulse tracking-widest uppercase text-xs">Decrypting User Data...</td></tr>
            ) : filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-emerald-500/5 transition-colors group">
                {/* User Info */}
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-black/50 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                      {user.role === 'admin' ? <ShieldCheck size={20}/> : <User size={20}/>}
                    </div>
                    <div>
                      <p className="font-black text-white text-sm tracking-tight">{user.name}</p>
                      <p className="text-[10px] text-slate-500 font-bold tracking-tighter">{user.email}</p>
                    </div>
                  </div>
                </td>

                {/* Role Badge */}
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                    user.role === 'admin' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]' :
                    user.role === 'doctor' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' :
                    user.role === 'receptionist' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                    'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {user.role || 'patient'}
                  </span>
                </td>

                {/* Role Actions */}
                <td className="p-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <select 
                      className="bg-black/60 border border-emerald-500/10 rounded-lg px-3 py-2 text-[9px] font-black uppercase text-emerald-500 outline-none focus:border-emerald-500/50 transition-all cursor-pointer"
                      value={user.role || 'patient'}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    >
                      <option value="patient">Set Patient</option>
                      <option value="receptionist">Set Receptionist</option>
                      <option value="doctor">Set Doctor</option>
                      <option value="admin">Set Admin</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER STATUS --- */}
      <div className="flex items-center justify-between px-6 py-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
        <div className="flex items-center gap-3">
          <Cpu size={14} className="text-emerald-500 animate-spin-slow" />
          <span className="text-[9px] font-black uppercase text-emerald-500/60 tracking-widest">Total Active Nodes: {users.length}</span>
        </div>
        <span className="text-[9px] font-black uppercase text-slate-600">Secure Environment Encrypted</span>
      </div>
    </div>
  );
};

export default AdminPanel;