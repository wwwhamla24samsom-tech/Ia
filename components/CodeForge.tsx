import React, { useState, useRef, useEffect } from 'react';
import { forgeExpertCode } from '../services/geminiService';
import { Language } from '../types';
import { QuantumPredictivePanel } from './QuantumPredictivePanel';
import { Brain, Code2, Sparkles, Copy, Check, RefreshCw, Zap, Bug, Sliders } from 'lucide-react';

export const CodeForge: React.FC<{ language: Language }> = ({ language }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string, thoughts: string[] } | null>(null);
  const [activeCode, setActiveCode] = useState<string>(`// Quantum Predictive Forge Core
export interface QuantumMatrixNode {
  id: string;
  coherenceFrequency: number; // 528Hz
  stateVector: number[];
}

export async function processQuantumStream(node: QuantumMatrixNode) {
  // Direct state mutation & async hazard detector
  const cache = [];
  cache.push(node.id);
  
  const precision = 0.1 + 0.2 === 0.3; // Floating point precision check
  
  return {
    nodeId: node.id,
    resonance: node.coherenceFrequency,
    precisionValid: precision
  };
}
`);
  const [showThoughts, setShowThoughts] = useState(true);
  const [showPredictivePanel, setShowPredictivePanel] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleForge = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await forgeExpertCode(input, language);
      setResult(data);
      const codeMatch = data.text.match(/```(?:[a-z]+)?\n([\s\S]*?)```/);
      setActiveCode(codeMatch ? codeMatch[1] : data.text);
    } catch (err) {
      alert("❌ فشل الصهر البرمجي العميق.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full max-w-full mx-auto bg-[#020306] text-white p-0 overflow-hidden min-h-screen font-arabic">
      
      {/* Dynamic Header */}
      <header className="px-6 lg:px-10 py-5 border-b border-white/5 bg-black/40 backdrop-blur-3xl z-50 flex flex-wrap justify-between items-center gap-4 shadow-2xl">
        <div className="flex items-center gap-6">
           <div className="flex flex-col">
              <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-blue-500 shadow-[0_0_25px_#3b82f6] flex items-center gap-2">
                <Code2 className="w-7 h-7 text-blue-400" />
                <span>DEEP_<span className="text-cyan-400">CODE_FORGE</span></span>
              </h2>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Neural_Architect // Quantum_Predictive_Engine_v17</span>
           </div>
           <div className="hidden lg:flex items-center gap-4 bg-white/5 px-4 py-1.5 rounded-2xl border border-white/10">
              <div className={`w-2 h-2 rounded-full ${loading ? 'bg-blue-500 animate-ping' : 'bg-emerald-500 shadow-[0_0_10px_emerald]'}`}></div>
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Predictive_Coherence: 528Hz</span>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <button
             onClick={() => setShowPredictivePanel(!showPredictivePanel)}
             className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 shadow-sm ${
               showPredictivePanel 
                 ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]' 
                 : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
             }`}
             title="تفعيل/إخفاء التحليلات التنبؤية الكوانتومية"
           >
             <Brain className={`w-4 h-4 ${showPredictivePanel ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`} />
             <span>التحليلات التنبؤية</span>
             <span className="text-[9px] font-mono bg-cyan-950 px-1.5 py-0.5 rounded text-cyan-400 border border-cyan-500/30">
               Live
             </span>
           </button>

           <button 
              onClick={handleForge}
              disabled={loading || !input.trim()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all active:scale-95 disabled:opacity-30 flex items-center gap-2"
           >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>ANALYZING...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>EXECUTE_FORGE ⚡</span>
                </>
              )}
           </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Input & Thoughts Sidebar */}
        <div className="lg:w-[420px] xl:w-[460px] border-l border-white/5 bg-[#08090c] p-6 lg:p-8 flex flex-col gap-6 shadow-2xl overflow-y-auto no-scrollbar">
           <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-[11px] font-black text-blue-500 uppercase tracking-widest">Input_Requirements</h3>
                <span className="text-[10px] text-slate-500">Gemini 3 Pro + QPU</span>
              </div>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="صف النظام البرمجي المعقد الذي تريد بناءه أو تحسينه..."
                className="w-full p-5 text-sm h-52 bg-black/40 border border-white/10 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-blue-500/30 transition-all resize-none font-mono text-blue-100 placeholder:text-slate-700 text-right"
              />
           </div>

           {/* Quick Preset Generators for Predictive Testing */}
           <div className="space-y-2">
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">نماذج للاختبار التنبؤي السريع:</span>
             <div className="flex flex-wrap gap-1.5 text-xs">
               <button
                 onClick={() => {
                   setActiveCode(`// React State Direct Mutation Hazard Example
import React, { useState } from 'react';

export function UserListManager() {
  const [users, setUsers] = useState(['Sarah', 'Dragon', 'Quantum']);

  const addUser = (newUser) => {
    // ⚠️ Predictive Warning: Direct array push mutation!
    users.push(newUser);
    setUsers(users);
  };

  return (
    <div>
      {users.map(u => <p key={u}>{u}</p>)}
      <button onClick={() => addUser('Node-Alpha')}>Add User</button>
    </div>
  );
}
`);
                 }}
                 className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] text-slate-300 border border-white/5 transition-all"
               >
                 تجربة خطر تعديل State
               </button>

               <button
                 onClick={() => {
                   setActiveCode(`// Async Hazard without Await
export async function fetchSystemConfig(endpoint: string) {
  // ⚠️ Predictive Warning: redundant async without await!
  const defaultHeader = { authorization: 'Bearer SOVEREIGN_TOKEN' };
  const payload = { target: endpoint, timestamp: Date.now() };
  return { status: 200, payload };
}
`);
                 }}
                 className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] text-slate-300 border border-white/5 transition-all"
               >
                 تجربة خطر دالة Async
               </button>

               <button
                 onClick={() => {
                   setActiveCode(`// Pristine Clean TypeScript Quantum Architecture
export interface SovereignPayload<T> {
  data: T;
  quantumHash: string;
  resonanceHz: number;
}

export function validatePayload<T>(payload: SovereignPayload<T>): boolean {
  if (!payload?.quantumHash || payload?.resonanceHz !== 528) {
    return false;
  }
  return true;
}
`);
                 }}
                 className="px-2.5 py-1 bg-emerald-950/40 hover:bg-emerald-900/40 rounded-lg text-[10px] text-emerald-300 border border-emerald-500/20 transition-all"
               >
                 نموذج كود كوانتومي نقي (100%)
               </button>
             </div>
           </div>

           {result?.thoughts && result.thoughts.length > 0 && (
              <div className="space-y-4 animate-slideInRight">
                 <div className="flex justify-between items-center">
                    <h3 className="text-[11px] font-black text-purple-500 uppercase tracking-widest">Neural_Chain_of_Thought</h3>
                    <button onClick={() => setShowThoughts(!showThoughts)} className="text-[9px] text-slate-500 hover:text-white uppercase">{showThoughts ? 'Hide' : 'Show'}</button>
                 </div>
                 {showThoughts && (
                    <div className="space-y-3">
                       {result.thoughts.map((t, i) => (
                         <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] text-slate-400 italic leading-relaxed text-right">
                            <span className="text-purple-600 font-black ml-2">#Step_{i+1}:</span> {t}
                         </div>
                       ))}
                    </div>
                 )}
              </div>
           )}

           {!result && !loading && (
             <div className="flex-1 flex flex-col items-center justify-center opacity-20 grayscale py-12 text-center">
                <div className="text-6xl mb-3">🧠</div>
                <p className="text-[10px] font-black uppercase tracking-widest">Awaiting_Neural_Input</p>
             </div>
           )}
        </div>

        {/* Code Editor Surface & Quantum Predictive Analytics */}
        <div className="flex-1 flex flex-col relative bg-black overflow-y-auto no-scrollbar">
           <div className="sticky top-0 z-20 flex justify-between items-center px-6 py-2 bg-black/70 backdrop-blur-xl border-b border-white/5 text-[9px] font-black">
              <div className="flex items-center gap-3">
                 <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                 <span>REALTIME_EDITOR: ACTIVE (Editable)</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                 <span>TypeScript / JavaScript</span>
                 <span className="text-cyan-400">Predictive_Coherence: LIVE</span>
              </div>
           </div>

           <div className="flex-1 p-6 lg:p-8 font-mono text-sm lg:text-base min-h-[360px] relative">
              <textarea 
                value={activeCode}
                onChange={(e) => setActiveCode(e.target.value)}
                className="w-full min-h-[340px] bg-transparent border-none focus:ring-0 text-blue-200 selection:bg-blue-600/30 resize-none leading-relaxed text-left dir-ltr outline-none font-mono"
                placeholder="// السلسلة البرمجية ستظهر هنا بعد التحليل العميق أو اكتب الشيفرة لتشخيصها فوراً..."
                spellCheck={false}
              />
           </div>

           {/* Predictive Analytics Panel */}
           {showPredictivePanel && (
             <div className="p-4 lg:p-6 bg-[#030611] border-t border-cyan-500/20">
               <QuantumPredictivePanel
                 code={activeCode}
                 language="typescript"
                 onApplyFix={(newCode) => setActiveCode(newCode)}
                 onApplyFullRefactor={(fullCode) => setActiveCode(fullCode)}
               />
             </div>
           )}

           {/* Code Info Footer */}
           <div className="px-6 lg:px-10 py-4 bg-[#08090c] border-t border-white/5 flex justify-between items-center sticky bottom-0 z-10">
              <div className="flex gap-8 items-center">
                 <div className="flex flex-col">
                    <span className="text-[8px] text-slate-600 uppercase font-black">Lines</span>
                    <span className="text-xs font-black text-white">{activeCode ? activeCode.split('\n').length : 0}</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[8px] text-slate-600 uppercase font-black">Memory_Forge</span>
                    <span className="text-xs font-black text-blue-400">100TB_Sovereign</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[8px] text-slate-600 uppercase font-black">Quantum Resonance</span>
                    <span className="text-xs font-black text-cyan-400">528Hz Coherent</span>
                 </div>
              </div>
              <button 
                onClick={handleCopy}
                className="bg-white text-black px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl flex items-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ كود المصدر 📋'}</span>
              </button>
           </div>
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slideInRight { animation: slideInRight 0.5s var(--ease-out-expo) forwards; }
      `}</style>
    </div>
  );
};
