import React, { useState, useRef, useEffect } from 'react';
import { getChatbotResponse } from '../services/aiService';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

const AIChatbot = ({ patientData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Neural Link Established. I am CareStream AI. How can I assist you today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Gemini AI se response lena
      const response = await getChatbotResponse(input, patientData || "General Query");
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'System Error: Neural connection interrupted.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* --- CHAT BUTTON --- */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-black shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-110 transition-all group relative"
        >
          <div className="absolute -inset-1 bg-emerald-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
          <Bot size={28} className="relative z-10" />
        </button>
      )}

      {/* --- CHAT WINDOW --- */}
      {isOpen && (
        <div className="w-80 md:w-96 h-125 bg-slate-900 border border-emerald-500/20 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-in zoom-in-95 duration-300">
          
          {/* Header */}
          <div className="p-5 bg-emerald-500/10 border-b border-emerald-500/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-500"><Sparkles size={16}/></div>
              <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Uplink Bot</h4>
                <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-tighter">AI Assistant Active</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={20}/></button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-[11px] font-medium leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-emerald-500 text-black rounded-tr-none italic font-bold' 
                  : 'bg-black/40 border border-emerald-500/10 text-slate-300 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-[8px] font-black text-emerald-500 uppercase tracking-widest animate-pulse ml-2">AI is thinking...</div>}
            <div ref={scrollRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 bg-black/40 border-t border-emerald-500/10 flex gap-2">
            <input 
              type="text" 
              placeholder="Ask about vitals or health tips..."
              className="flex-1 bg-slate-900 border border-emerald-500/10 rounded-xl px-4 py-3 text-[10px] text-white outline-none focus:border-emerald-500/40 transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="p-3 bg-emerald-500 text-black rounded-xl hover:bg-emerald-400 transition-all">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;