
import React, { useState, useEffect } from 'react';
import { runInfiniteIntelligence } from '../services/geminiService';
import { Language, SingularityPulse } from '../types';

export const SingularityCore: React.FC<{ language: Language }> = ({ language }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [pulse, setPulse] = useState<SingularityPulse>({ realityStability: 100, neuralEntropy: 0, evolutionVelocity: 0.1 });

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => ({
        realityStability: Math.min(100, Math.max(90, prev.realityStability + (Math.random() * 2 - 1))),
        neuralEntropy: Math.min(100, Math.max(0, prev.neuralEntropy + (Math.random() * 5 - 2.5))),
        evolutionVelocity: parseFloat((prev.evolutionVelocity + (Math.random() * 0.05 - 0.025)).toFixed(3))
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleIgnite = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const data = await runInfiniteIntelligence(query, language);
      setResult(data);
    } catch (err) {
      setResult("❌ تم اعتراض تدفق البيانات من قبل Matrix-Guard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6 md:space-y-12 animate-fadeIn font-arabic pb-10">
      
      {/* Premium Singularity Header - Responsive Padding and Sizing */}
      <div className="bg-gradient-to-br from-[#050505] via-[#101010] to-blue-900/20 border-2 md:border-4 border-blue-500/20 p-8 md:p-16 rounded-[2.5rem] md:rounded-[5rem] shadow-2xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent)] pointer-events-none"></div>
         
         <div className="flex flex-col lg:flex-row justify-between items-center gap-8 md:gap-12 relative z-10">
            <div className="text-center md:text-right space-y-2 md:space-y-4">
               <h1 className="text-5xl md:text-[7rem] font-black text-white tracking-tighter leading-none select-none uppercase">
                 نواة <span className="text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">التفرد</span>
               </h1>
               <p className="text-slate-500 text-sm md:text-2xl font-bold uppercase tracking-[0.2em] md:tracking-[0.5em] opacity-60">Sovereign_Infinite_Logic</p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-8 w-full md:w-auto">
               <div className="bg-black/60 p-4 md:p-10 rounded-2xl md:rounded-[3.5rem] border border-blue-500/20 flex flex-col items-center gap-1 md:gap-4">
                  <span className="text-[7px] md:text-[10px] font-black text-blue-500 uppercase tracking-widest">Reality_Index</span>
                  <div className="text-xl md:text-5xl font-black text-white">{pulse.realityStability.toFixed(1)}%</div>
               </div>
               <div className="bg-black/60 p-4 md:p-10 rounded-2xl md:rounded-[3.5rem] border border-emerald-500/20 flex flex-col items-center gap-1 md:gap-4">
                  <span className="text-[7px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest">Evolution_Vel</span>
                  <div className="text-xl md:text-5xl font-black text-white">{pulse.evolutionVelocity}x</div>
               </div>
            </div>
         </div>

         <div className="mt-10 md:mt-20 relative max-w-6xl mx-auto">
            <textarea 
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               placeholder="أدخل المهمة المستحيلة.."
               className="w-full bg-black/80 border-2 border-white/5 rounded-[2rem] md:rounded-[4rem] p-6 md:p-12 text-lg md:text-3xl text-white focus:border-blue-500/50 transition-all resize-none h-40 md:h-64 text-center shadow-inner placeholder:text-blue-900/20"
            />
            <button 
               onClick={handleIgnite}
               disabled={loading}
               className="mt-6 md:absolute md:-bottom-8 md:left-1/2 md:-translate-x-1/2 w-full md:w-auto px-10 md:px-20 py-5 md:py-8 bg-blue-600 hover:bg-white text-black rounded-full font-black text-lg md:text-2xl shadow-2xl transition-all active:scale-95 disabled:opacity-50"
            >
               {loading ? 'تحفيز النواة...' : 'بدء التدفق اللانهائي ⚡'}
            </button>
         </div>
      </div>

      {/* Infinite Output Matrix - Scaled Padding */}
      <div className="flex-1 relative pb-10">
         {result ? (
           <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[4rem] p-8 md:p-20 animate-slideUp shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-1 md:w-2 h-full bg-blue-600 opacity-20"></div>
              <div className="prose prose-invert max-w-none text-xl md:text-4xl leading-[1.6] md:leading-[1.8] text-slate-100 font-medium whitespace-pre-wrap selection:bg-blue-600/50">
                 {result}
              </div>
           </div>
         ) : loading ? (
            <div className="py-20 md:py-40 flex flex-col items-center gap-8 md:gap-12">
               <div className="relative w-32 h-32 md:w-64 md:h-64">
                  <div className="absolute inset-0 border-4 border-blue-500/10 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-6 md:inset-10 bg-blue-500/10 rounded-full animate-pulse flex items-center justify-center text-4xl md:text-7xl">🌌</div>
               </div>
               <p className="text-sm md:text-3xl font-black text-blue-500 animate-pulse tracking-[0.4em] md:tracking-[0.8em] uppercase">Processing_Layer...</p>
            </div>
         ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-5 grayscale pointer-events-none py-20 md:py-40">
               <div className="text-[10rem] md:text-[25rem] leading-none drop-shadow-2xl">⚡</div>
               <p className="text-xl md:text-5xl font-black uppercase tracking-[1em] md:tracking-[1.5em] text-white">Kernel_Standby</p>
            </div>
         )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};
