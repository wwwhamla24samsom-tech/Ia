
import React, { useState, useEffect, useRef } from 'react';
import { runIntelligenceFusion } from '../services/geminiService';
import { FusedResponse, Language } from '../types';

export const IntelligenceFusion: React.FC<{ language: Language }> = ({ language }) => {
  const [prompt, setPrompt] = useState('');
  const [targetLogic, setTargetLogic] = useState('OpenAI GPT-4 Omni');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FusedResponse | null>(null);
  const [internalPower, setInternalPower] = useState(88.4);
  const [copiedData, setCopiedData] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const models = [
    { id: 'gpt4', name: 'OpenAI GPT-4 Omni', icon: '🧠' },
    { id: 'claude', name: 'Claude 3.5 Sonnet', icon: '🎨' },
    { id: 'deepseek', name: 'DeepSeek Coder V2', icon: '💻' },
    { id: 'llama', name: 'Meta Llama 3', icon: '🦙' }
  ];

  const handleFusion = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await runIntelligenceFusion(prompt, targetLogic, language);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("❌ فشل بروتوكول الاندماج: تداخل في الموجات النورونية.");
    } finally {
      setLoading(false);
    }
  };

  const absorbKnowledge = async () => {
    if (!result) return;
    setIsSyncing(true);
    // Simulate internal system strengthening
    for (const info of result.extractedKnowledge) {
      await new Promise(r => setTimeout(r, 800));
      setCopiedData(prev => [info, ...prev]);
      setInternalPower(p => Math.min(100, p + 0.5));
    }
    setIsSyncing(false);
    alert("✅ تم نسخ المعلومات وتطوير كفاءة صارة الداخلية بنجاح!");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fadeIn font-arabic pb-40">
      
      {/* Fusion Dashboard Header */}
      <div className="bg-slate-950/80 backdrop-blur-3xl border border-purple-500/30 p-12 rounded-[4rem] shadow-[0_0_120px_rgba(168,85,247,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
          <div className="flex items-center gap-10">
            <div className={`w-24 h-24 rounded-[2.5rem] border-2 flex items-center justify-center text-5xl transition-all duration-1000 ${loading ? 'bg-purple-600 animate-spin border-purple-400 shadow-[0_0_60px_rgba(168,85,247,0.6)]' : 'bg-slate-900 border-white/10 shadow-2xl'}`}>
               ⚛️
            </div>
            <div>
              <h2 className="text-5xl font-black text-white tracking-tighter uppercase">الاندماج <span className="text-purple-500">الاستخباري</span></h2>
              <p className="text-slate-500 font-bold uppercase tracking-[0.4em] mt-2">Intelligence_Unity_Protocol_v13.0</p>
            </div>
          </div>
          
          <div className="bg-black/60 p-8 rounded-[3rem] border border-white/5 flex items-center gap-10">
             <div className="text-right">
                <span className="text-[10px] font-black text-slate-600 uppercase block mb-1">Internal_Core_Power</span>
                <div className="text-3xl font-black text-white">{internalPower.toFixed(1)}%</div>
             </div>
             <div className="w-1.5 h-12 bg-purple-600/20 rounded-full">
                <div className="w-full bg-purple-500 shadow-[0_0_15px_purple] transition-all duration-1000" style={{ height: `${internalPower}%` }}></div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Input & Model Selection */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-black/40 border border-white/5 p-10 rounded-[3.5rem] space-y-8 shadow-2xl">
              <h3 className="text-xs font-black text-purple-500 uppercase tracking-widest">Select_Fusion_Target</h3>
              <div className="grid grid-cols-1 gap-3">
                 {models.map(m => (
                   <button
                     key={m.id}
                     onClick={() => setTargetLogic(m.name)}
                     className={`p-6 rounded-[2rem] border transition-all text-right flex items-center justify-between group ${targetLogic === m.name ? 'bg-white text-black border-white shadow-xl scale-105' : 'bg-slate-900 border-white/5 text-white/40 hover:border-purple-500/30'}`}
                   >
                     <span className="text-2xl">{m.icon}</span>
                     <span className="font-black text-sm uppercase tracking-widest">{m.name}</span>
                   </button>
                 ))}
              </div>

              <div className="space-y-4">
                 <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Complex_Mission_Parameters</h3>
                 <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="أدخل المهمة المعقدة التي تتطلب اندماجاً بين الأنظمة..."
                    className="w-full bg-black/60 border border-white/10 rounded-[2.5rem] p-6 text-white h-40 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none text-right shadow-inner"
                 />
              </div>

              <button 
                onClick={handleFusion}
                disabled={loading || !prompt.trim()}
                className="w-full py-6 bg-purple-600 hover:bg-purple-500 text-white rounded-[2.5rem] font-black text-xl transition-all shadow-2xl active:scale-95 disabled:opacity-50"
              >
                {loading ? 'جاري سحب المنطق...' : 'بدء الاندماج النوروني 🚀'}
              </button>
           </div>
        </div>

        {/* Right: Output & Internal Absorption */}
        <div className="lg:col-span-8 space-y-8">
           {result ? (
             <div className="space-y-8 animate-fadeIn">
                <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[4rem] border border-purple-500/20 p-12 space-y-10 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-2 h-full bg-purple-500/40"></div>
                   
                   <div className="flex justify-between items-center">
                      <span className="px-6 py-2 bg-purple-600/10 border border-purple-500/20 rounded-full text-[10px] font-black text-purple-400">STATUS: FUSED_STABLE</span>
                      <h3 className="text-3xl font-black text-white">الاستجابة المندمجة الفائقة</h3>
                   </div>

                   <p className="text-2xl leading-[1.8] text-slate-100 font-medium text-right selection:bg-purple-500/30">
                      {result.content}
                   </p>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5">
                      <div className="space-y-4">
                         <h4 className="text-xs font-black text-purple-400 uppercase tracking-widest">محاكاة منطق: {targetLogic}</h4>
                         <p className="text-sm text-slate-400 leading-relaxed italic">"{result.mimickedLogic}"</p>
                      </div>
                      <div className="flex flex-col justify-center items-center bg-purple-900/10 rounded-[2.5rem] p-8 border border-purple-500/10">
                         <div className="text-4xl font-black text-purple-500">+{result.efficiencyBoost}%</div>
                         <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Efficiency_Added</div>
                      </div>
                   </div>

                   <button 
                      onClick={absorbKnowledge}
                      disabled={isSyncing}
                      className="w-full py-8 bg-white text-black rounded-[2.5rem] font-black text-2xl hover:bg-purple-500 hover:text-white transition-all shadow-3xl flex items-center justify-center gap-4 group"
                   >
                      {isSyncing ? 'جاري التغذية النورونية...' : 'نسخ المعلومات وتطوير صارة داخلياً 🧬'}
                      {!isSyncing && <svg className="w-8 h-8 group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
                   </button>
                </div>

                {/* Internal Knowledge Archive (What was copied) */}
                <div className="bg-black/60 rounded-[3.5rem] p-10 border border-white/5 h-80 flex flex-col shadow-inner">
                   <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] mb-6">Internal_Update_Registry (Copied_Data)</h3>
                   <div className="flex-1 overflow-y-auto font-mono text-[11px] text-purple-400 space-y-3 no-scrollbar text-left dir-ltr">
                      {copiedData.map((info, i) => (
                        <div key={i} className="animate-slideInRight flex gap-4 border-l-2 border-purple-500/20 pl-4 py-2 bg-white/[0.02] rounded-r-xl">
                           <span className="text-purple-900 font-black">#COPY</span>
                           <span className="opacity-80">{info}</span>
                        </div>
                      ))}
                      {copiedData.length === 0 && <div className="text-slate-800 italic">SYSTEM_AWAITING_ABSORPTION...</div>}
                   </div>
                </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center opacity-5 grayscale pointer-events-none gap-12 py-40">
                <div className="text-[16rem] animate-float">⚛️</div>
                <p className="text-5xl font-black uppercase tracking-[1em] text-center">Awaiting_Intelligence_Link</p>
             </div>
           )}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slideInRight { animation: slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};
