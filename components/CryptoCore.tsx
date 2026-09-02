
import React, { useState } from 'react';
import { runCryptoProtocol } from '../services/geminiService';
import { CryptoAnalysis, Language } from '../types';

export const CryptoCore: React.FC<{ language: Language }> = ({ language }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CryptoAnalysis | null>(null);
  const [mode, setMode] = useState<'build' | 'crack'>('build');

  const handleExecute = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const data = await runCryptoProtocol(input, mode, language);
      setResult(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-full space-y-10 animate-fadeIn text-right font-arabic pb-40">
      <div className="bg-[#080808] border-b-4 border-amber-600 p-12 rounded-[4rem] shadow-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.05),transparent)]"></div>
        <h2 className="text-6xl font-black text-white tracking-tighter">مفاعل <span className="text-amber-500">التشفير</span> النوروني</h2>
        <p className="text-slate-500 text-xl mt-4">"بناء، محاكاة، وتفكيك أنظمة الحماية المطلقة."</p>
        
        <div className="flex gap-4 mt-10">
           <button onClick={() => setMode('build')} className={`px-10 py-3 rounded-2xl text-xs font-black transition-all ${mode === 'build' ? 'bg-amber-600 text-black shadow-xl' : 'bg-white/5 text-slate-500'}`}>توليد نظام حماية (Build)</button>
           <button onClick={() => setMode('crack')} className={`px-10 py-3 rounded-2xl text-xs font-black transition-all ${mode === 'crack' ? 'bg-red-600 text-white shadow-xl' : 'bg-white/5 text-slate-500'}`}>هندسة عكسية (Reverse)</button>
        </div>

        <div className="mt-10 relative">
           <textarea 
             value={input}
             onChange={(e) => setInput(e.target.value)}
             placeholder={mode === 'build' ? "وصف النظام المطلوب تشفيره..." : "ألصق كود التشفير أو الخوارزمية لتحليلها..."}
             className="w-full bg-black/80 border border-white/10 rounded-[3rem] p-8 text-xl text-white focus:ring-4 focus:ring-amber-500/10 transition-all resize-none h-48 shadow-inner"
           />
           <button onClick={handleExecute} disabled={loading} className="absolute bottom-6 left-6 bg-amber-600 text-black px-12 py-4 rounded-2xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all">
             {loading ? 'Processing...' : 'تنفيذ المهمة ⚡'}
           </button>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-slideUp">
           <div className="lg:col-span-8 bg-black/60 rounded-[4rem] border border-white/5 p-12 space-y-8 shadow-2xl overflow-hidden relative">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter">نواة الكود (Generated_Source)</h3>
                 <span className="text-[10px] font-mono text-amber-500">{result.algorithmType}</span>
              </div>
              <div className="bg-[#050505] p-10 rounded-[3rem] font-mono text-sm text-blue-400 overflow-auto h-[500px] shadow-inner text-left dir-ltr selection:bg-blue-500/30">
                 {result.generatedCode}
              </div>
           </div>

           <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#0c0c0c] border border-amber-500/20 p-10 rounded-[4rem] shadow-3xl text-right">
                 <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-6">Security_Audit</h4>
                 <div className="text-7xl font-black text-white">{result.securityLevel}%</div>
                 <p className="text-slate-500 text-sm mt-2">مستوى الحماية السيادي</p>
                 <div className="mt-10 space-y-4">
                    {result.vulnerabilities.map((v, i) => (
                      <div key={i} className="flex gap-4 items-start text-xs text-red-400 italic">
                         <span>⚠</span> {v}
                      </div>
                    ))}
                 </div>
              </div>
              
              <div className="bg-amber-600 text-black p-10 rounded-[4rem] shadow-3xl">
                 <h4 className="text-xs font-black uppercase tracking-widest mb-4">Neural_Seal</h4>
                 <p className="text-[9px] font-mono break-all opacity-80">{result.neuralSeal}</p>
                 <div className="mt-8 text-xl font-black">STABLE_INTEGRITY</div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
