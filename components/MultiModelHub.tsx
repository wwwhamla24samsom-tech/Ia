
import React, { useState } from 'react';
import { fusedAIIntelligence } from '../services/geminiService';
import { Language } from '../types';

interface MultiModelHubProps {
  language: Language;
}

export const MultiModelHub: React.FC<MultiModelHubProps> = ({ language }) => {
  const [prompt, setPrompt] = useState('');
  const [fusionMode, setFusionMode] = useState('Sarah + GPT Logic');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; thoughtProcess: string } | null>(null);

  const modes = [
    { name: 'Sarah + GPT Logic', icon: '🧠', desc: 'دمج المنطق الرياضي والبرمجي' },
    { name: 'Sarah + Claude Creative', icon: '🎨', desc: 'دمج الإبداع الأدبي والأسلوب' },
    { name: 'Sarah + Real-time Ingest', icon: '🌐', desc: 'دمج البيانات المباشرة مع التحليل' },
    { name: 'Universal Fusion', icon: '🌌', desc: 'اندماج كامل لكافة أنماط الذكاء' },
  ];

  const handleFusion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await fusedAIIntelligence(prompt, fusionMode, language);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto space-y-8 px-6 pb-40 text-right">
      <div className="bg-slate-950 rounded-[3.5rem] p-12 shadow-2xl border border-blue-500/20 -mt-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
        
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center border border-cyan-500/30 text-4xl animate-pulse">⚛️</div>
            <div>
              <h2 className="text-4xl font-black text-white">مركز الاندماج النوروني</h2>
              <p className="text-cyan-500 font-mono text-sm tracking-widest uppercase mt-1">Multi-System Fusion Hub v1.0</p>
            </div>
          </div>

          <p className="text-slate-400 text-lg max-w-3xl">
            هنا يمكنك دمج منطق أنظمة ذكاء عالمية أخرى مع صارة v15. اختر وضع الاندماج وسيقوم النظام بتنسيق الاستجابة عبر عدة طبقات من المعالجة.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {modes.map(mode => (
              <button
                key={mode.name}
                onClick={() => setFusionMode(mode.name)}
                className={`p-6 rounded-3xl border-2 transition-all text-right group ${fusionMode === mode.name ? 'bg-cyan-600 border-cyan-500 text-slate-950 shadow-[0_0_30px_rgba(6,182,212,0.4)]' : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20'}`}
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{mode.icon}</div>
                <div className="font-black text-sm mb-1">{mode.name}</div>
                <div className="text-[10px] opacity-60 font-medium">{mode.desc}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleFusion} className="space-y-6">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="أدخل المهمة المعقدة التي تتطلب اندماجاً عصبياً..."
              className="w-full bg-slate-900 border border-white/5 rounded-[2.5rem] px-8 py-6 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 text-white h-40 resize-none text-xl font-medium placeholder-slate-700 shadow-inner"
            />
            <button
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 py-6 rounded-[2.5rem] font-black text-2xl transition-all shadow-2xl flex items-center justify-center gap-4 group"
            >
              {loading ? (
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-slate-950 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-slate-950 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-3 h-3 bg-slate-950 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              ) : (
                <>
                  <span>بدء الاندماج النوروني</span>
                  <svg className="w-8 h-8 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {result && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-cyan-500/20 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500 shadow-[0_0_20px_cyan]"></div>
             <h3 className="text-xl font-black text-cyan-400 mb-6 flex items-center gap-3">
               <span>🧠</span> الاستجابة المندمجة (Fused Output)
             </h3>
             <div className="prose prose-invert max-w-none text-xl text-slate-100 leading-relaxed whitespace-pre-wrap">
               {result.text}
             </div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5">
             <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">مسار التفكير الهجين (Multi-Core Thought)</h4>
             <p className="text-sm text-slate-400 italic leading-relaxed">
               {result.thoughtProcess}
             </p>
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="py-20 text-center text-slate-800 opacity-20 flex flex-col items-center gap-6">
           <div className="text-9xl mb-4">🧬</div>
           <p className="text-2xl font-black uppercase tracking-[0.5em]">Fusion_Core_Ready</p>
           <p className="text-sm font-bold">النظام جاهز لمزج أنماط الذكاء المختلفة لخدمة أهدافك</p>
        </div>
      )}
    </div>
  );
};
