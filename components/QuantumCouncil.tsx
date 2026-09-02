
import React, { useState } from 'react';
import { runQuantumCouncil } from '../services/geminiService';
import { CouncilResult, Language } from '../types';

export const QuantumCouncil: React.FC<{ language: Language }> = ({ language }) => {
  const [dilemma, setDilemma] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CouncilResult | null>(null);
  
  const handleConsult = async () => {
    if (!dilemma.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await runQuantumCouncil(dilemma, language);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-full mx-auto bg-[#030303] text-white p-0 overflow-hidden min-h-screen font-arabic">
      
      {/* Header */}
      <header className="px-10 py-8 border-b border-white/5 bg-black/40 backdrop-blur-3xl z-50 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-8">
           <div className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center text-4xl shadow-[0_0_40px_white] animate-pulse">
              ⚖️
           </div>
           <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter text-white">مجلس الشورى <span className="text-purple-500">الكمومي</span></h2>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Real-Time_Parallel_Agents_v21.0</span>
           </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(168,85,247,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

        {!result && !loading && (
          <div className="z-10 w-full max-w-3xl space-y-8 text-center animate-fadeIn">
             <div className="text-[8rem] mb-4 opacity-10 animate-float">🏛️</div>
             <h3 className="text-3xl font-black text-white">اطرح معضلتك على المجلس الأعلى</h3>
             <p className="text-slate-400 max-w-xl mx-auto">سيقوم 3 وكلاء ذكاء مستقلين بتحليل طلبك بالتوازي، ثم يقوم الحاكم السيادي باتخاذ القرار النهائي.</p>
             
             <div className="relative group">
                <textarea 
                  value={dilemma}
                  onChange={(e) => setDilemma(e.target.value)}
                  placeholder="أدخل القضية أو القرار الصعب هنا..."
                  className="w-full bg-white/5 border border-white/10 rounded-[3rem] p-8 text-xl text-white focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all resize-none h-40 text-right shadow-2xl"
                />
                <button 
                  onClick={handleConsult}
                  className="absolute bottom-6 left-6 px-10 py-4 bg-purple-600 text-white rounded-[2rem] font-black hover:bg-purple-500 transition-all shadow-xl active:scale-95"
                >
                  استدعاء المجلس (Parallel Exec)
                </button>
             </div>
          </div>
        )}

        {loading && (
          <div className="z-10 flex flex-col items-center gap-12">
             <div className="relative w-96 h-96">
                <div className="absolute inset-0 border-[1px] border-white/5 rounded-full animate-[spin_3s_linear_infinite]"></div>
                
                {/* Agent Nodes Visualized */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-pulse">
                   <div className="w-20 h-20 bg-blue-900/20 rounded-full border border-blue-500 flex items-center justify-center text-3xl shadow-[0_0_50px_blue]">🧠</div>
                   <span className="text-[10px] font-black text-blue-500 mt-2">LOGIC_AGENT</span>
                </div>

                <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 flex flex-col items-center animate-pulse" style={{animationDelay: '0.1s'}}>
                   <div className="w-20 h-20 bg-purple-900/20 rounded-full border border-purple-500 flex items-center justify-center text-3xl shadow-[0_0_50px_purple]">🎨</div>
                   <span className="text-[10px] font-black text-purple-500 mt-2">CREATIVE_AGENT</span>
                </div>

                <div className="absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/4 flex flex-col items-center animate-pulse" style={{animationDelay: '0.2s'}}>
                   <div className="w-20 h-20 bg-emerald-900/20 rounded-full border border-emerald-500 flex items-center justify-center text-3xl shadow-[0_0_50px_emerald]">♟️</div>
                   <span className="text-[10px] font-black text-emerald-500 mt-2">STRATEGY_AGENT</span>
                </div>

                {/* Central Core */}
                <div className="absolute inset-0 m-auto w-32 h-32 bg-white rounded-full shadow-[0_0_100px_white] animate-pulse flex items-center justify-center">
                   <span className="text-black font-black text-xs">SYNTHESIZING</span>
                </div>
                
                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                   <line x1="50%" y1="0%" x2="50%" y2="50%" stroke="rgba(59,130,246,0.5)" strokeWidth="2" />
                   <line x1="100%" y1="100%" x2="50%" y2="50%" stroke="rgba(168,85,247,0.5)" strokeWidth="2" />
                   <line x1="0%" y1="100%" x2="50%" y2="50%" stroke="rgba(16,185,129,0.5)" strokeWidth="2" />
                </svg>
             </div>
             <p className="text-2xl font-black text-white uppercase tracking-[0.5em] animate-pulse">Running_Parallel_Inference...</p>
          </div>
        )}

        {result && (
          <div className="z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-10 animate-slideUp">
             
             {/* The Opinions */}
             <div className="lg:col-span-1 space-y-6">
                <div className="flex justify-between items-center text-slate-500 text-xs font-black uppercase tracking-widest mb-4">
                   <span>Agent_Analysis</span>
                   <span>{result.processingTime}</span>
                </div>
                {result.opinions.map((op, i) => (
                  <div key={i} className={`p-8 rounded-[2.5rem] border backdrop-blur-md transition-all hover:scale-105 ${op.node === 'Logic' ? 'bg-blue-900/10 border-blue-500/30' : op.node === 'Creative' ? 'bg-purple-900/10 border-purple-500/30' : 'bg-emerald-900/10 border-emerald-500/30'}`}>
                     <div className="flex justify-between items-center mb-6">
                        <span className={`text-xs font-black uppercase tracking-widest ${op.node === 'Logic' ? 'text-blue-400' : op.node === 'Creative' ? 'text-purple-400' : 'text-emerald-400'}`}>{op.node}_Node</span>
                        <div className="flex items-center gap-2">
                           <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                              <div className={`h-full ${op.node === 'Logic' ? 'bg-blue-500' : op.node === 'Creative' ? 'bg-purple-500' : 'bg-emerald-500'}`} style={{width: `${op.confidence}%`}}></div>
                           </div>
                           <span className="text-[9px] font-mono opacity-60">{op.confidence}%</span>
                        </div>
                     </div>
                     <p className="text-sm font-bold text-white mb-6 leading-relaxed">"{op.verdict}"</p>
                     <div className="text-[10px] bg-black/40 p-4 rounded-2xl text-slate-300 border border-white/5 flex gap-2">
                        <span className="opacity-50 uppercase font-black">Key_Point:</span> 
                        <span className="font-mono text-white">{op.keyPoint}</span>
                     </div>
                  </div>
                ))}
             </div>

             {/* The Synthesis */}
             <div className="lg:col-span-2 space-y-8 flex flex-col">
                <div className="flex-1 bg-white/[0.03] border border-white/10 p-16 rounded-[4rem] relative overflow-hidden shadow-3xl flex flex-col justify-center">
                   <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500"></div>
                   <div className="mb-10">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Sovereign_Verdict_ID: {result.id}</span>
                      <h3 className="text-5xl font-black text-white mt-4 leading-tight">القرار السيادي النهائي</h3>
                   </div>
                   <div className="prose prose-invert max-w-none text-2xl leading-relaxed text-slate-100 font-medium">
                      {result.sovereignDecision}
                   </div>
                </div>

                <div className="bg-black/60 border border-white/5 p-10 rounded-[3rem] flex items-center gap-8">
                   <div className="text-4xl">⚖️</div>
                   <div>
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Synthesis_Reasoning</h4>
                      <p className="text-sm text-slate-400 italic leading-relaxed">"{result.finalSynthesis}"</p>
                   </div>
                </div>
             </div>
          </div>
        )}

      </main>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};
