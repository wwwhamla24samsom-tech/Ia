
import React, { useState } from 'react';
import { runTrinityProtocol } from '../services/geminiService';
import { TrinityResult, Language } from '../types';

export const TrinityCouncil: React.FC<{ language: Language }> = ({ language }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrinityResult | null>(null);

  const handleTrinity = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const data = await runTrinityProtocol(input, language);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-12 animate-fadeIn text-right">
      <div className="bg-[#050505] border border-white/10 p-12 rounded-[4rem] shadow-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.05),transparent)]"></div>
        <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-8">بروتوكول <span className="text-purple-500">ترينيتي</span></h2>
        <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto">أرسل معضلتك وسيقوم المجلس الأعلى (نيو، ترينيتي، ومورفيوس) بتحليلها بالتوازي.</p>
        
        <div className="relative max-w-4xl mx-auto">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="أدخل القضية للتحليل الشامل..."
            className="w-full bg-black/60 border border-white/10 rounded-[3rem] p-10 text-xl text-white focus:ring-4 focus:ring-purple-500/20 h-40 resize-none shadow-inner"
          />
          <button 
            onClick={handleTrinity}
            disabled={loading}
            className="absolute left-6 bottom-6 bg-purple-600 hover:bg-purple-500 text-white px-12 py-4 rounded-2xl font-black transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Consulting Matrix...' : 'تفعيل المجلس ⚡'}
          </button>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slideUp">
           {result.perspectives.map((p, i) => (
             <div key={i} className={`p-10 rounded-[3.5rem] border backdrop-blur-2xl transition-all ${p.agent === 'NEO' ? 'bg-blue-900/10 border-blue-500/30' : p.agent === 'TRINITY' ? 'bg-red-900/10 border-red-500/30' : 'bg-emerald-900/10 border-emerald-500/30'}`}>
                <div className="flex justify-between items-center mb-6">
                   <h4 className="text-2xl font-black text-white">{p.agent}</h4>
                   <span className="text-[10px] font-mono opacity-40">{p.confidence}% CONFIDENCE</span>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed italic mb-8">"{p.insight}"</p>
                <div className="bg-black/40 p-4 rounded-xl font-mono text-[9px] text-slate-500 break-all">
                   KEY_ENCRYPT: {p.encryptionKey}
                </div>
             </div>
           ))}

           <div className="lg:col-span-3 bg-white/[0.03] border border-white/10 p-16 rounded-[4rem] shadow-3xl text-center space-y-8">
              <h3 className="text-4xl font-black text-white tracking-tighter uppercase">القرار السيادي الموحد</h3>
              <div className="text-3xl text-slate-200 leading-[1.8] max-w-5xl mx-auto font-medium">
                 {result.unifiedVerdict}
              </div>
              <div className="flex justify-center gap-4 pt-10">
                 <div className="px-8 py-3 bg-purple-600/20 border border-purple-500/30 rounded-full text-xs font-black text-purple-400 uppercase tracking-widest">
                    Matrix_Stability: {result.matrixStability}%
                 </div>
              </div>
           </div>
        </div>
      )}

      {loading && (
        <div className="py-40 flex flex-col items-center gap-12">
           <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 border-8 border-purple-500/10 rounded-full"></div>
              <div className="absolute inset-0 border-t-8 border-purple-500 rounded-full animate-spin"></div>
              <div className="text-4xl">👑</div>
           </div>
           <p className="text-2xl font-black text-purple-500 uppercase tracking-[1em] animate-pulse">Synchronizing_The_Trinity</p>
        </div>
      )}
    </div>
  );
};
