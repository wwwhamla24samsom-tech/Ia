
import React, { useState, useEffect } from 'react';
import { runArchitectSingularity } from '../services/geminiService';
import { SingularityResult, Language } from '../types';

export const ArchitectSingularity: React.FC<{ language: Language }> = ({ language }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SingularityResult | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const handleAscend = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await runArchitectSingularity(query, language);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-12 animate-fadeIn text-right font-arabic">
      
      {/* Sovereign Input Hub */}
      <div className="bg-[#050505] border-t-4 border-amber-500 rounded-[4rem] p-16 shadow-[0_0_100px_rgba(245,158,11,0.1)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05),transparent)] pointer-events-none"></div>
        <div className="relative z-10 text-center space-y-8">
           <h2 className="text-7xl font-black text-white tracking-tighter uppercase leading-none">بروتوكول <span className="text-amber-500">التفرد</span></h2>
           <p className="text-slate-400 text-2xl max-w-3xl mx-auto italic">"أنت لا تطلب معلومة الآن، أنت تعيد صياغة أبعاد الواقع البرمجي."</p>
           
           <div className="relative max-w-5xl mx-auto mt-12">
              <textarea 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="أدخل المعضلة الكلية للتحليل المتفرد..."
                className="w-full bg-black/80 border-2 border-white/5 rounded-[3.5rem] p-10 text-2xl text-white focus:border-amber-500/50 focus:ring-8 focus:ring-amber-500/5 transition-all resize-none h-48 shadow-inner text-center"
              />
              <button 
                onClick={handleAscend}
                disabled={loading}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-amber-500 hover:bg-white text-black px-16 py-6 rounded-full font-black text-xl shadow-3xl transition-all active:scale-95 disabled:opacity-50 group/btn overflow-hidden"
              >
                 <span className="relative z-10">{loading ? 'جاري الصعود...' : 'بدء التفرد النوروني ⚡'}</span>
                 <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-white to-amber-400 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
           </div>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-slideUp">
           
           {/* Center Piece: The Logic Swarm Visualizer */}
           <div className="lg:col-span-8 bg-black/60 rounded-[5rem] border border-white/5 p-12 min-h-[700px] relative overflow-hidden flex flex-col items-center justify-center shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.02),transparent)]"></div>
              <h3 className="absolute top-12 left-12 text-[10px] font-black text-amber-500 uppercase tracking-[1em]">Logical_Swarm_Positioning</h3>
              
              {/* Dynamic Nodes Visualization */}
              <div className="relative w-full h-full flex items-center justify-center">
                 {result.logicSwarm.map((node, i) => (
                   <div 
                     key={node.id}
                     className="absolute transition-all duration-1000 animate-float"
                     style={{ 
                       left: `${50 + (Math.cos(i) * 35)}%`, 
                       top: `${50 + (Math.sin(i) * 35)}%`,
                       animationDelay: `${i * 0.5}s`
                     }}
                   >
                      <div className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 backdrop-blur-3xl shadow-2xl transition-all hover:scale-110 ${node.type === 'core' ? 'bg-amber-500 border-white text-black' : 'bg-black/80 border-amber-500 text-amber-500'}`}>
                         <span className="text-xl font-black">{node.label}</span>
                         <div className="w-12 h-1 bg-current opacity-20 rounded-full"></div>
                         <span className="text-[8px] font-mono opacity-60">STR: {node.strength}%</span>
                      </div>
                   </div>
                 ))}
                 {/* Central Core Connection Lines */}
                 <div className="w-32 h-32 bg-white rounded-full shadow-[0_0_100px_white] flex items-center justify-center z-10 animate-pulse">
                    <span className="text-black font-black text-xs">KERNEL</span>
                 </div>
              </div>

              <div className="absolute bottom-12 right-12 text-right">
                 <span className="text-[10px] font-black text-slate-500 uppercase block mb-2">Evolution_Rate</span>
                 <div className="text-5xl font-black text-amber-500">+{result.evolutionRate}%</div>
              </div>
           </div>

           {/* Right: The Architect's Verdict */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-[#0c0c0c] border border-amber-500/20 p-12 rounded-[4rem] shadow-3xl space-y-8 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-2 h-full bg-amber-500 opacity-20 group-hover:opacity-100 transition-opacity"></div>
                 <h4 className="text-xs font-black text-amber-500 uppercase tracking-[0.5em]">The_Architect_Verdict</h4>
                 <p className="text-3xl font-black text-white leading-tight">{result.architectVerdict}</p>
                 <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                    <h5 className="text-[10px] font-black text-slate-500 uppercase mb-4">Immediate_Reality_Anchor</h5>
                    <p className="text-lg text-slate-300 italic">"{result.realityAnchor}"</p>
                 </div>
              </div>

              <div className="bg-black/40 border border-white/5 p-10 rounded-[4rem] h-full flex flex-col shadow-2xl">
                 <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-10 border-b border-white/5 pb-6">Temporal_Simulation_Paths</h4>
                 <div className="space-y-10 overflow-y-auto no-scrollbar">
                    {result.temporalSimulation.map((path, i) => (
                      <div key={i} className="flex gap-6 items-start animate-slideInRight" style={{ animationDelay: `${i * 0.3}s` }}>
                         <div className="w-1.5 h-12 bg-amber-500/20 rounded-full shrink-0"></div>
                         <div className="text-right">
                            <span className="text-[9px] font-black text-amber-900 uppercase tracking-widest">TIMELINE_0{i+1}</span>
                            <p className="text-sm text-slate-400 italic leading-relaxed">"{path}"</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

        </div>
      )}

      {loading && (
        <div className="py-48 flex flex-col items-center gap-12">
           <div className="relative w-48 h-48">
              <div className="absolute inset-0 border-[15px] border-amber-500/10 rounded-full"></div>
              <div className="absolute inset-0 border-t-[15px] border-amber-500 rounded-full animate-spin shadow-[0_0_100px_rgba(245,158,11,0.3)]"></div>
              <div className="absolute inset-12 bg-amber-500/10 rounded-full animate-pulse flex items-center justify-center text-6xl">🏺</div>
           </div>
           <div className="space-y-4 text-center">
              <h3 className="text-4xl font-black text-white uppercase tracking-[0.4em] animate-pulse">Singularity_Rising</h3>
              <p className="text-amber-900 font-black text-xs uppercase tracking-widest">Compressing_Multiversal_Data_Nodes</p>
           </div>
        </div>
      )}

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};
