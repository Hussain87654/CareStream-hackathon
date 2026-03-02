import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Activity, Shield, Zap, Users, CheckCircle2, 
  Mail, Phone, MapPin, ArrowRight, Instagram, Twitter, Linkedin, Globe
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="bg-[#020617] text-white font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* --- GLOW BACKGROUND EFFECTS --- */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-emerald-500/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-emerald-500 p-1.5 rounded-lg group-hover:rotate-180 transition-transform duration-500">
              <Activity className="text-black" size={22} />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">Care<span className="text-emerald-500">Stream</span></span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <a href="#about" className="hover:text-emerald-400 transition-colors">Vision</a>
            <a href="#plans" className="hover:text-emerald-400 transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">Connect</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-6 py-2 font-black text-[10px] uppercase tracking-widest text-emerald-500 hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="px-6 py-3 bg-emerald-500 text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-48 pb-32 px-6 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-8 inline-block bg-emerald-500/5">
              Protocol v3.0 Active
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-10">
              MODERN CARE. <br /> 
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-emerald-600 italic">CYBER SECURITY.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-slate-400 font-medium text-lg mb-12">
              The next evolution of Hospital Management. Secure, encrypted, and blazing fast performance for the digital age.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/register" className="px-12 py-6 bg-emerald-500 text-black rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_20px_40px_rgba(16,185,129,0.2)] flex items-center gap-3 text-xs">
                Initialize System <ArrowRight size={18}/>
              </Link>
              <button className="px-12 py-6 border border-emerald-500/20 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500/5 transition-all text-xs text-emerald-500">Documentation</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- ABOUT / FEATURES --- */}
      <section id="about" className="py-32 relative z-10 border-y border-emerald-500/5 bg-[#020617]/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Shield/>, title: "Neural Link Security", desc: "Military-grade encryption for patient data and records." },
              { icon: <Zap/>, title: "Instant Sync", desc: "Zero-latency updates between Doctor and Receptionist portals." },
              { icon: <Globe/>, title: "Remote Access", desc: "Manage your clinic from anywhere in the world, securely." }
            ].map((feat, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-slate-900/40 border border-emerald-500/10 hover:border-emerald-500/40 transition-all group">
                <div className="text-emerald-500 mb-6 group-hover:scale-110 transition-transform">{feat.icon}</div>
                <h3 className="text-xl font-black mb-4 tracking-tight uppercase">{feat.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING PLANS --- */}
      <section id="plans" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black tracking-tighter uppercase">Service <span className="text-emerald-500">Tiers</span></h2>
            <div className="h-1 w-20 bg-emerald-500 mx-auto mt-4 shadow-[0_0_10px_#10b981]"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Standard Card */}
            <div className="bg-slate-900/50 p-12 rounded-[3rem] border border-emerald-500/10 flex flex-col">
              <span className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.3em] mb-4 inline-block">Basic Node</span>
              <h4 className="text-5xl font-black mb-8 italic">$0</h4>
              <ul className="space-y-5 mb-12 flex-1">
                <li className="flex items-center gap-3 text-slate-400 font-bold text-sm"><CheckCircle2 size={16} className="text-emerald-500"/> 50 Patient Capacity</li>
                <li className="flex items-center gap-3 text-slate-400 font-bold text-sm"><CheckCircle2 size={16} className="text-emerald-500"/> Standard Bookings</li>
                <li className="flex items-center gap-3 text-slate-400 font-bold text-sm"><CheckCircle2 size={16} className="text-emerald-500"/> Email Support</li>
              </ul>
              <button className="w-full py-4 border border-emerald-500/20 rounded-xl font-black uppercase text-[10px] tracking-widest text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all">Initiate Free</button>
            </div>

            {/* Premium Card (Glowing) */}
            <div className="bg-emerald-500 p-12 rounded-[3rem] border border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.2)] flex flex-col scale-105 relative">
              <div className="absolute top-8 right-8 bg-black text-emerald-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse">Core Active</div>
              <span className="text-[10px] font-black uppercase text-black/60 tracking-[0.3em] mb-4 inline-block">Professional</span>
              <h4 className="text-5xl font-black mb-8 text-black italic">$49</h4>
              <ul className="space-y-5 mb-12 flex-1 text-black font-black">
                <li className="flex items-center gap-3 text-sm"><CheckCircle2 size={16}/> Unlimited Patients</li>
                <li className="flex items-center gap-3 text-sm"><CheckCircle2 size={16}/> Admin Power Control</li>
                <li className="flex items-center gap-3 text-sm"><CheckCircle2 size={16}/> Neural Analytics</li>
                <li className="flex items-center gap-3 text-sm"><CheckCircle2 size={16}/> 24/7 Priority Uplink</li>
              </ul>
              <button className="w-full py-4 bg-black text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all">Get Premium Access</button>
            </div>

            {/* Enterprise Card */}
            <div className="bg-slate-900/50 p-12 rounded-[3rem] border border-emerald-500/10 flex flex-col">
              <span className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.3em] mb-4 inline-block">Enterprise</span>
              <h4 className="text-5xl font-black mb-8 italic">$199</h4>
              <ul className="space-y-5 mb-12 flex-1">
                <li className="flex items-center gap-3 text-slate-400 font-bold text-sm"><CheckCircle2 size={16} className="text-emerald-500"/> Multi-Clinic Sync</li>
                <li className="flex items-center gap-3 text-slate-400 font-bold text-sm"><CheckCircle2 size={16} className="text-emerald-500"/> Custom API Node</li>
                <li className="flex items-center gap-3 text-slate-400 font-bold text-sm"><CheckCircle2 size={16} className="text-emerald-500"/> Dedicated Server</li>
              </ul>
              <button className="w-full py-4 border border-emerald-500/20 rounded-xl font-black uppercase text-[10px] tracking-widest text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all">Contact Ops</button>
            </div>
          </div>
        </div>
      </section>
      {/* --- CONTACT / UPLINK SECTION --- */}
      <section id="contact" className="py-32 bg-[#020617] relative z-10 px-6">
        {/* Decorative Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Left Side: Contact Info */}
            <div className="space-y-10">
              <div>
                <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Communication Protocol</span>
                <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">
                  Establish <br /> <span className="text-emerald-500 italic">Connection.</span>
                </h2>
                <p className="text-slate-500 font-medium mt-6 max-w-sm">
                  Need technical support or enterprise deployment? Our ops team is active 24/7 on the secure grid.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                    <Mail size={20}/>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secure Mail</p>
                    <p className="font-bold text-slate-200">ops@carestream.io</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                    <Phone size={20}/>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Line</p>
                    <p className="font-bold text-slate-200">+92 312 345 6789</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                    <MapPin size={20}/>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Station</p>
                    <p className="font-bold text-slate-200">Karachi, Sector-7, Pakistan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Matrix Form */}
            <div className="bg-slate-900/30 border border-emerald-500/10 p-10 rounded-[3rem] backdrop-blur-md relative">
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest ml-1">Identity</label>
                    <input type="text" placeholder="Your Name" className="w-full bg-black/50 border border-emerald-500/10 rounded-xl p-4 text-sm font-bold text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-700 shadow-inner"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest ml-1">Uplink Address</label>
                    <input type="email" placeholder="Email" className="w-full bg-black/50 border border-emerald-500/10 rounded-xl p-4 text-sm font-bold text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-700 shadow-inner"/>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest ml-1">Transmission Data</label>
                  <textarea rows="4" placeholder="Briefly describe your query..." className="w-full bg-black/50 border border-emerald-500/10 rounded-xl p-4 text-sm font-bold text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-700 resize-none shadow-inner"></textarea>
                </div>

                <button className="w-full py-5 bg-emerald-500 text-black rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3">
                  Transmit Signal <ArrowRight size={14}/>
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-emerald-500/10 px-6 bg-[#020617]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <Activity className="text-emerald-500" size={24} />
            <span className="text-lg font-black tracking-tighter uppercase italic">Care<span className="text-emerald-500">Stream</span></span>
          </div>
          <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
            System Node: Karachi, Pakistan // © 2026 CS-MED-PROTOCOLS
          </div>
          <div className="flex items-center gap-6 text-emerald-500/50">
            <Instagram size={18} className="hover:text-emerald-400 cursor-pointer"/>
            <Twitter size={18} className="hover:text-emerald-400 cursor-pointer"/>
            <Linkedin size={18} className="hover:text-emerald-400 cursor-pointer"/>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;