
import React, { useState } from 'react';
import { runSystemDiagnostics, neuralSelfHealing, mimicGlobalModel, analyzeSiteLogic } from '../services/geminiService';
import { DiagnosticResult } from '../types';

export const SystemCore: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'diagnose' | 'heal' | 'mimic' | 'site-analyzer'>('diagnose');
  
  const [targetModel, setTargetModel] = useState('OpenAI GPT-4o');
  const [taskPrompt, setTaskPrompt] = useState('');
  const [mimicResult, setMimicResult] = useState<any>(null);
  const [siteUrl, setSiteUrl] = useState('');
  const [siteData, setSiteData] = useState<any>(null);
  const [issue, setIssue] = useState('');
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [dirtyCode, setDirtyCode] = useState('');
  const [healedResult, setHealedResult] = useState<any>(null);

  const handleMimic = async () => {
    if (!taskPrompt.trim()) return;
    setLoading(true);
    try {
      const res = await mimicGlobalModel(targetModel, taskPrompt, 'ar');
      setMimicResult(res);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSiteAnalysis = async () => {
    if (!siteUrl.trim()) return;
    setLoading(true);
    try {
      const res = await analyzeSiteLogic(siteUrl, 'ar');
      setSiteData(res);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-full space-y-6 px-4 font-mono pb-40 text-right">
      {/* OS Feature Navigation */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 border-b border-white/5">
        {[
          { id: 'diagnose', label: 'التشخيص', color: 'bg-cyan-500' },
          { id: 'heal', label: 'التعافي', color: 'bg-emerald-500' },
          { id: 'mimic', label: 'المحاكاة', color: 'bg-purple-600' },
          { id: 'site-analyzer', label: 'تحليل المنطق', color: 'bg-blue-600' }
        ].map(mode => (
          <button 
            key={mode.id}
            onClick={() => setActiveMode(mode.id as any)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeMode === mode.id ? `${mode.color} text-black` : 'bg-slate-900 text-slate-500'}`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {activeMode === 'mimic' && (
        <div className="animate-fadeIn space-y-6">
          <div className="bg-[#0a0a0a] rounded-3xl p-8 border border-purple-500/20 shadow-2xl relative overflow-hidden">
             <h2 className="text-2xl font-black text-white mb-6">محاكاة الأنظمة ⚛️</h2>
             
             <div className="grid grid-cols-2 gap-3 mb-6">
                {['OpenAI GPT-4o', 'Claude 3.5', 'Llama 3.1'].map(m => (
                  <button 
                    key={m}
                    onClick={() => setTargetModel(m)}
                    className={`p-3 rounded-xl border transition-all text-[10px] font-bold ${targetModel === m ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-900 border-white/5 text-slate-500'}`}
                  >
                    {m}
                  </button>
                ))}
             </div>

             <textarea 
               value={taskPrompt}
               onChange={(e) => setTaskPrompt(e.target.value)}
               placeholder="صف المهمة البرمجية..."
               className="w-full bg-black border border-purple-500/30 rounded-2xl p-5 text-white h-32 text-sm focus:outline-none"
             />

             <button 
               onClick={handleMimic}
               disabled={loading}
               className="w-full mt-4 bg-purple-600 text-white py-4 rounded-xl font-black text-sm transition-all"
             >
               {loading ? 'جاري التحليل...' : 'تنفيذ الأمر ⚡'}
             </button>
          </div>

          {mimicResult && (
            <div className="space-y-4 animate-fadeIn">
               <div className="bg-slate-900 p-6 rounded-3xl border border-purple-500/10">
                  <h3 className="text-purple-400 font-black mb-3 uppercase text-[10px]">Source_Code</h3>
                  <div className="bg-black p-4 rounded-xl h-64 overflow-auto font-mono text-xs text-blue-300 dir-ltr text-left">
                     {mimicResult.mimicCode}
                  </div>
               </div>
               <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                  <p className="text-xs text-slate-300 leading-relaxed italic">{mimicResult.analysis}</p>
               </div>
            </div>
          )}
        </div>
      )}

      {activeMode === 'diagnose' && (
        <div className="animate-fadeIn space-y-6">
           <div className="bg-[#0a0a0a] text-cyan-400 rounded-3xl p-8 border border-cyan-900/30">
            <h2 className="text-2xl font-black mb-6">تشخيص الأنظمة 🧠</h2>
            <div className="space-y-4">
              <textarea
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="أدخل تفاصيل الخلل..."
                className="w-full bg-black border border-cyan-900/50 rounded-2xl p-5 text-cyan-300 h-32 resize-none"
              />
              <button
                onClick={async () => {
                   setLoading(true);
                   const res = await runSystemDiagnostics(issue || "فحص شامل");
                   setResults(res);
                   setLoading(false);
                }}
                disabled={loading}
                className="w-full bg-cyan-600 text-black py-4 rounded-xl font-black text-sm"
              >
                {loading ? "جاري الفحص..." : "بدء الفحص ⚡"}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 pb-32">
            {results.map((res, idx) => (
              <div key={idx} className="bg-slate-900 border border-cyan-900/20 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-[9px] uppercase font-black">{res.status}</span>
                  <h3 className="font-black text-white">{res.module}</h3>
                </div>
                <p className="text-[11px] italic text-cyan-100">{res.fixSuggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modes Heal & Site-analyzer follow similar simplified phone structure */}
    </div>
  );
};
