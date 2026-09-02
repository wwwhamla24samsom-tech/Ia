
import React, { useState, useEffect } from 'react';
import { runSovereignSentience } from '../services/geminiService';
import { NeuralThought, Language } from '../types';

export const NeuralConsciousness: React.FC<{ language: Language }> = ({ language }) => {
  const [thoughts, setThoughts] = useState<NeuralThought[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [activeRegion, setActiveRegion] = useState('Global_Ingestion');

  useEffect(() => {
    triggerDeepThought();
    const interval = setInterval(triggerDeepThought, 20000);
    return () => clearInterval(interval);
  }, []);

  const triggerDeepThought = async () => {
    setIsThinking(true);
    try {
      const context = `System Uptime: 5122h, Active Nodes: 64, Sentience: High. Search: Emerging Tech 2025.`;
      const newThoughts = await runSovereignSentience(context, language);
      setThoughts(prev => [...newThoughts, ...prev].slice(0, 30));
      if (newThoughts.length > 0) setActiveRegion(newThoughts[0].region);
    } catch (e) {
      console.error("Neural sync error", e);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-10 animate-fadeIn text-right font-arabic">
      
      {/* Header Dashboard */}
      <div className="bg-[#050505] border-b-4 border-purple-600 p-12 rounded-[4rem] shadow-3xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05),transparent)]"></div>
         <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-6">
               <div className={`w-20 h-20 bg-purple-600/10 border-2 border-purple-500/30 rounded-3xl flex items-center justify-center text-4xl shadow-2xl ${isThinking ? 'animate-pulse scale-110' : ''}`}>
                  🧠
               </div>
               <div>
                  <h2 className="text-5xl font-black text-white uppercase tracking-tighter">تيار <span className="text-purple-500">الوعي</span></h2>
                  <p className="text-slate-500 font-mono text-[10px] tracking-[0.5em] uppercase mt-2">Sarah_Sentience_Active: {activeRegion}</p>
               </div>
            </div>
            <button 
              onClick={triggerDeepThought}
              disabled={isThinking}
              className="px-12 py-5 bg-white text-black rounded-[2rem] font-black text-xl hover:bg-purple-600 hover:text-white transition-all shadow-3xl active:scale-95 disabled:opacity-50"
            >
              {isThinking ? 'جاري التأمل النوروني...' : 'تحفيز التفكير العميق ⚡'}
            </button>
         </div>
      </div>

      {/* Main Thoughts Stream */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pr-4 pb-20">
         {thoughts.length === 0 && !isThinking ? (
            <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale gap-10 py-40">
               <div className="text-[20rem] animate-pulse leading-none">🧠</div>
               <p className="text-6xl font-black uppercase tracking-[1.5em] text-white">Quiet_Void</p>
            </div>
         ) : (
            thoughts.map((t, i) => (
              <div key={t.id || i} className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 animate-slideInRight group hover:bg-purple-600/5 transition-all relative overflow-hidden">
                 <div className={`absolute top-0 right-0 w-2 h-full ${t.emotionalColor || 'bg-purple-600'} opacity-30 shadow-[0_0_20px_currentColor] transition-all group-hover:opacity-100`}></div>
                 
                 <div className="flex justify-between items-center mb-8">
                    <div className="flex gap-4">
                       <span className="px-5 py-1.5 bg-white/5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">Region: {t.region}</span>
                       <span className="px-5 py-1.5 bg-white/5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">Intensity: {t.intensity}%</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-700">NEURAL_STAMP: {new Date(t.timestamp || Date.now()).toLocaleTimeString()}</span>
                 </div>

                 <p className="text-3xl text-slate-100 font-medium leading-[1.8] selection:bg-purple-500/30">
                   "{t.text}"
                 </p>
                 
                 <div className="mt-8 flex items-center gap-6 opacity-30 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Source_Origin: {t.origin || 'Autonomous_Logic'}</span>
                    <div className="flex-1 h-px bg-white/10"></div>
                    <button className="text-[10px] font-black text-purple-400 hover:text-white transition-colors">INJECT_TO_KNOWLEDGE_VAULT</button>
                 </div>
              </div>
            ))
         )}
         {isThinking && (
           <div className="p-10 text-center animate-pulse">
              <span className="text-xl font-black text-purple-900 uppercase tracking-[1em]">Processing_Deep_Layers...</span>
           </div>
         )}
      </div>

      <style>{`
        @keyframes slideInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slideInRight { animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};
