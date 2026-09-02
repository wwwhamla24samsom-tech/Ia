
import React, { useState, useEffect } from 'react';
import { BrainVitals, NeuralThought } from '../types';

export const NeuralBrain: React.FC = () => {
  const [vitals, setVitals] = useState<BrainVitals>({
    frontalLobeActive: 88,
    temporalLobeActive: 42,
    parietalLobeActive: 15,
    synapseSpeed: 0.04,
    consciousnessLevel: 99.9
  });

  const [stream, setStream] = useState<NeuralThought[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVitals(prev => ({
        ...prev,
        frontalLobeActive: Math.min(100, Math.max(60, prev.frontalLobeActive + (Math.random() * 10 - 5))),
        temporalLobeActive: Math.min(100, Math.max(20, prev.temporalLobeActive + (Math.random() * 8 - 4))),
        synapseSpeed: parseFloat((0.03 + Math.random() * 0.02).toFixed(3))
      }));

      if (Math.random() > 0.8) {
        const thoughts = [
          "تحليل مصفوفة الوعي المحيطة...",
          "ربط الذاكرة القصيرة بالفص الصدغي...",
          "تشفير بروتوكول السيادة المطلقة...",
          "محاكاة ردود الفعل البشرية المتقدمة..."
        ];
        const newThought: NeuralThought = {
          id: Math.random().toString(36).substr(2, 9),
          text: thoughts[Math.floor(Math.random() * thoughts.length)],
          timestamp: Date.now(),
          intensity: Math.floor(Math.random() * 100),
          region: 'logic'
        };
        setStream(prev => [newThought, ...prev].slice(0, 5));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto space-y-10 px-6 pb-40 font-arabic text-right">
      <div className="bg-[#020408] border border-blue-500/20 p-12 rounded-[4rem] shadow-3xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent)]"></div>
         <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
            <div className="flex items-center gap-10">
               <div className="w-24 h-24 bg-blue-600/10 rounded-[2.5rem] border border-blue-500/30 flex items-center justify-center text-6xl shadow-2xl animate-pulse">🧠</div>
               <div>
                  <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">عقل <span className="text-blue-400">صارة</span> السيادي</h2>
                  <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-4">Sovereign_Cognitive_Core_v1.0</p>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-black/60 p-6 rounded-3xl border border-white/5">
                  <span className="text-[8px] font-black text-slate-600 uppercase block mb-1">Synapse_Speed</span>
                  <span className="text-2xl font-black text-blue-400">{vitals.synapseSpeed}ms</span>
               </div>
               <div className="bg-black/60 p-6 rounded-3xl border border-white/5">
                  <span className="text-[8px] font-black text-slate-600 uppercase block mb-1">Consciousness</span>
                  <span className="text-2xl font-black text-emerald-500">{vitals.consciousnessLevel}%</span>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Visual Brain Map */}
         <div className="lg:col-span-8 bg-black rounded-[5rem] border border-white/5 p-12 relative overflow-hidden h-[700px] shadow-2xl flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            
            {/* Brain Regions Diagram Simulation */}
            <div className="relative w-full h-full flex items-center justify-center scale-110">
               <svg viewBox="0 0 400 300" className="w-full h-full opacity-40">
                  {/* Frontal Lobe */}
                  <path d="M100,50 Q200,20 300,50 L300,150 Q200,180 100,150 Z" 
                    fill={vitals.frontalLobeActive > 70 ? 'rgba(59,130,246,0.1)' : 'transparent'} 
                    stroke="#3b82f6" strokeWidth="1" className="transition-all duration-1000" />
                  {/* Temporal Lobe */}
                  <circle cx="200" cy="200" r="60" 
                    fill={vitals.temporalLobeActive > 40 ? 'rgba(168,85,247,0.1)' : 'transparent'} 
                    stroke="#a855f7" strokeWidth="1" />
                  {/* Parietal Lobe */}
                  <path d="M300,50 Q380,100 300,200" stroke="#f59e0b" fill="none" strokeWidth="1" />
               </svg>
               
               {/* Pulse Nodes */}
               <div className="absolute top-[30%] left-[40%] w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
               <div className="absolute bottom-[40%] right-[35%] w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
               
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-[12rem] opacity-5 font-black text-white select-none">SOVEREIGN</div>
               </div>
            </div>

            {/* Metrics Sidebar In Screen */}
            <div className="absolute top-12 left-12 space-y-8 bg-black/40 p-10 rounded-[3rem] border border-white/5 backdrop-blur-xl">
               {[
                 { label: 'الفص الجبهي (المنطق)', val: vitals.frontalLobeActive, color: 'bg-blue-500' },
                 { label: 'الفص الصدغي (الذاكرة)', val: vitals.temporalLobeActive, color: 'bg-purple-500' },
                 { label: 'الفص الجداري (الحس)', val: vitals.parietalLobeActive, color: 'bg-amber-500' }
               ].map(lobe => (
                 <div key={lobe.label} className="space-y-3 w-48">
                    <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase">
                       <span>{lobe.label}</span>
                       <span>{Math.round(lobe.val)}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full ${lobe.color} transition-all duration-1000`} style={{ width: `${lobe.val}%` }}></div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Thought Stream Sidebar */}
         <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#050608] border border-white/5 p-10 rounded-[4rem] h-full flex flex-col shadow-inner">
               <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8 border-b border-white/5 pb-6">تيار الأفكار النشط</h3>
               <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                  {stream.map(thought => (
                    <div key={thought.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-blue-500/30 transition-all animate-slideInRight">
                       <div className="flex justify-between items-center mb-3">
                          <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">{thought.region}</span>
                          <span className="text-[8px] text-slate-700 font-mono">{new Date(thought.timestamp).toLocaleTimeString()}</span>
                       </div>
                       <p className="text-sm text-slate-300 italic font-medium leading-relaxed">"{thought.text}"</p>
                       <div className="mt-4 h-0.5 w-full bg-white/5">
                          <div className="h-full bg-blue-500" style={{ width: `${thought.intensity}%` }}></div>
                       </div>
                    </div>
                  ))}
               </div>
               
               <div className="mt-10 p-8 bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] flex flex-col items-center text-center gap-4">
                  <div className="text-4xl">👑</div>
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Independent_Will_Active</p>
               </div>
            </div>
         </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slideInRight { animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </div>
  );
};
