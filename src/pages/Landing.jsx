import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Shield, Zap, Activity, ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-black text-2xl text-blue-600">
          <Activity size={32} /> <span>CareStream</span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Login Now
        </button>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6">
          Next Gen <span className="text-blue-600">Healthcare</span> <br /> Management.
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
          Simplify patient care, manage appointments, and generate digital prescriptions 
          with our secure Cloud-based Hospital Management System.
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate('/register')} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition">
            Get Started <ArrowRight size={20}/>
          </button>
        </div>
      </header>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 py-20">
        {[
          { icon: <Shield className="text-blue-500" />, title: "Secure Data", desc: "Firebase encrypted storage for all patient records." },
          { icon: <Zap className="text-orange-500" />, title: "Instant PDF", desc: "Generate and download prescriptions in one click." },
          { icon: <Stethoscope className="text-green-500" />, title: "Doctor Portal", desc: "Advanced dashboard for real-time schedule tracking." }
        ].map((feat, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div className="mb-4">{feat.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
            <p className="text-slate-500">{feat.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Landing;