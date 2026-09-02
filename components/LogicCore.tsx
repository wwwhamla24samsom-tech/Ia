
import React, { useState } from 'react';
import { executeSuperReasoning } from '../services/geminiService';
import { Language, LogicalOutput } from '../types';
import { GeminiResponse } from './GeminiResponse';

export const LogicCore: React.FC<{ language: Language }> = ({ language }) => {
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LogicalOutput | null>(null);

  const handleReasoning = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await executeSuperReasoning(problem, language);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full mx-auto bg-[#050505] text-white overflow-hidden font-arabic relative">
      
      {/* Background Pulse Effect */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${loading ? 'opacity-20' : 'opacity-5'}`}>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(16,185,129,0.2)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-6 pt-24 pb-8 z-10">
        <div className="text-center mb-16 space-y-6">
           <h2 className="text-7xl font-black text-white tracking-tighter uppercase">أوراكل <span className="text-emerald-500">الحقيقة</span></h2>
           <p className="text-slate-500 font-black uppercase tracking-[0.5em] text-[10px]">Ultra_Deep_Reasoning_Matrix // Gemini_3_Pro</p>
        </div>

        <form onSubmit={handleReasoning} className="relative group">
          <div className="bg-[#0f0f0f] border-2 border-white/5 rounded-[3rem] p-6 flex flex-col gap-6 shadow-[0_0_100px_rgba(0,0,0,1)] transition-all group-focus-within:border-emerald-500/40">
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="اطرح معضلة فلسفية، استراتيجية، أو تقنية تتطلب تفكيراً فائقاً..."
              className="w-full bg-transparent p-6 text-2xl focus:outline-none text-right resize-none h-48 placeholder:text-slate-900 leading-relaxed"
            />
            <div className="flex justify-between items-center px-6 pb-4">
               <div className="flex gap-6 text-slate-700">
                  <div className="flex flex-col items-center">
                     <span className="text-[8px] font-black uppercase mb-1">Compute</span>
                     <span className="text-xs font-mono text-emerald-500">MAX</span>
                  </div>
                  <div className="flex flex-col items-center">
                     <span className="text-[8px] font-black uppercase mb-1">Thinking</span>
                     <span className="text-xs font-mono text-blue-500">32K</span>
                  </div>
               </div>
               <button
                 type="submit"
                 disabled={loading || !problem.trim()}
                 className="bg-emerald-600 text-black px-16 py-5 rounded-full font-black text-xl hover:bg-emerald-400 transition-all shadow-[0_0_50px_rgba(16,185,129,0.3)] active:scale-95 disabled:opacity-30"
               >
                 {loading ? "جاري التأمل النوروني..." : "استخلاص الحقيقة 👁️"}
               </button>
            </div>
          </div>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-12 z-10">
        <div className="max-w-4xl mx-auto">
          {loading ? (
             <div className="space-y-12 animate-pulse">
                <div className="flex justify-end gap-6 items-center">
                   <div className="h-4 w-64 bg-white/5 rounded-full"></div>
                   <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40"></div>
                </div>
                <div className="space-y-6">
                   <div className="h-12 w-full bg-white/5 rounded-[2rem]"></div>
                   <div className="h-12 w-4/5 bg-white/5 rounded-[2rem] mr-auto"></div>
                   <div className="h-12 w-3/5 bg-white/5 rounded-[2rem] mr-auto"></div>
                </div>
             </div>
          ) : result ? (
            <div className="space-y-16 animate-fadeIn">
               {/* Thoughts Cascade */}
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-emerald-900 uppercase tracking-widest mr-6">Stream_of_Consciousness</h4>
                  <div className="grid grid-cols-1 gap-3">
                     {result.thoughtSteps.map((step, i) => (
                       <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] text-sm text-slate-400 italic text-right animate-slideInRight" style={{ animationDelay: `${i*0.1}s` }}>
                          <span className="text-emerald-600 font-black ml-2">#Step_{i+1}:</span> {step}
                       </div>
                     ))}
                  </div>
               </div>

               <GeminiResponse 
                 title="النتيجة السيادية المستخلصة"
                 content={result.conclusion}
                 sources={result.sources}
               />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale py-20">
              <div className="text-[15rem] animate-float">⚖️</div>
              <p className="text-4xl font-black tracking-[1em] uppercase mt-10">Oracle_Standby</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
