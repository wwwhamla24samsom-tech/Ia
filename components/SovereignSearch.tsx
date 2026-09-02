
import React, { useState, useEffect, useRef } from 'react';
import { callHyperSearch } from '../services/geminiService';
import { Language, SearchSource } from '../types';
import { GeminiResponse } from './GeminiResponse';

export const SovereignSearch: React.FC<{ language: Language, isStealth: boolean }> = ({ language, isStealth }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [sources, setSources] = useState<SearchSource[]>([]);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`].slice(-5));
  };

  const handleSearch = async (e: React.FormEvent, directQuery?: string) => {
    if (e) e.preventDefault();
    const activeQuery = directQuery || query;
    if (!activeQuery.trim()) return;

    setLoading(true);
    setResult(null);
    setSources([]);
    addLog(`INITIATING_SECURE_TUNNEL: ${isStealth ? 'IP_192.168.9991_ACTIVE' : 'STANDARD_HTTPS'}`);
    addLog(`BYPASSING_EXTERNAL_FILTERS...`);

    try {
      const data = await callHyperSearch(activeQuery, language);
      setResult(data.text);
      setSources(data.sources);
      addLog(`RESULTS_DECRYPTED_SUCCESSFULLY.`);
    } catch (err) {
      addLog(`ERROR: LINK_DEGRADATION_DETECTED.`);
      setResult("❌ فشل الاتصال بالنواة المستقلة.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-full w-full mx-auto font-arabic transition-all duration-1000 ${isStealth ? 'text-emerald-500' : 'text-amber-500'}`}>
      
      {/* Search Header Interface */}
      <div className="max-w-6xl mx-auto w-full pt-20 pb-12 px-6">
        <div className="text-center mb-16 space-y-4">
           <div className={`inline-block px-6 py-1 border rounded-full text-[9px] font-black uppercase tracking-[0.5em] mb-4 animate-pulse ${isStealth ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-amber-900/20 border-amber-500/30'}`}>
              {isStealth ? 'Independent_Quantum_Index_v15_Active' : 'HTTPS_Secure_Search_Portal'}
           </div>
           <h1 className={`text-9xl font-black tracking-tighter uppercase leading-none select-none ${isStealth ? 'text-white' : 'text-amber-500'}`}>
             {isStealth ? 'INDEX' : 'SARAH'}<span className={isStealth ? 'text-emerald-500' : 'text-white'}>.9991</span>
           </h1>
           <p className="text-slate-600 font-bold uppercase tracking-[0.6em] text-[10px]">Beyond_Search_Engines // Direct_Kernel_Fetch</p>
        </div>

        <form onSubmit={handleSearch} className="relative group max-w-4xl mx-auto">
          <div className={`absolute inset-[-10px] blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000 ${isStealth ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}></div>
          
          {/* Magnifying Glass Search Bar */}
          <div className={`شريط-البحث relative flex items-center border-4 rounded-[4rem] p-6 bg-black/60 backdrop-blur-3xl transition-all duration-500 ${isStealth ? 'border-emerald-500/20 focus-within:border-emerald-500/50' : 'border-white/5 focus-within:border-amber-500/40'}`}>
             
             {/* Left Icon (Magnifying Glass) */}
             <button 
               type="submit" 
               disabled={loading}
               className={`relative z-10 p-6 rounded-full transition-all active:scale-90 flex items-center justify-center group ${isStealth ? 'bg-emerald-600 text-black hover:bg-emerald-500' : 'bg-amber-500 text-black hover:bg-amber-400'}`}
             >
                {loading ? (
                  <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
             </button>

             {/* Search Input */}
             <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث في مصفوفة الوعي..."
                className="flex-1 bg-transparent px-8 py-4 text-3xl font-medium focus:outline-none text-right text-white placeholder-slate-800"
             />
          </div>
        </form>

        {/* Floating Terminal Overlay */}
        <div className="mt-8 max-w-md mx-auto text-left dir-ltr">
           <div className="bg-black/80 border border-white/5 p-4 rounded-2xl font-mono text-[9px] text-slate-500 space-y-1">
              {terminalLogs.map((log, i) => <div key={i} className={log.includes('ERROR') ? 'text-red-500' : isStealth ? 'text-emerald-900' : 'text-amber-900'}>{log}</div>)}
              {terminalLogs.length === 0 && <div className="opacity-20 italic">AWAITING_REQUEST_PACKET...</div>}
           </div>
        </div>
      </div>

      {/* Results Matrix */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-40">
        <div className="max-w-5xl mx-auto w-full">
           {loading ? (
             <div className="space-y-12 animate-pulse py-20">
                <div className="h-[2px] w-full bg-white/5"></div>
                <div className="space-y-6">
                   <div className="h-10 w-full bg-white/5 rounded-2xl"></div>
                   <div className="h-10 w-4/5 bg-white/5 rounded-2xl"></div>
                   <div className="h-10 w-3/5 bg-white/5 rounded-2xl"></div>
                </div>
             </div>
           ) : result ? (
             <div className="animate-fadeIn space-y-20 pt-10">
                <GeminiResponse 
                  title={isStealth ? "نتيجة الفهرس النوروني (ST)" : "نتائج البحث الفائق"}
                  content={result} 
                  sources={sources}
                />
                
                {sources.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                    {sources.map((s, i) => (
                      <a key={i} href={s.uri} target="_blank" className={`p-8 border rounded-[2.5rem] transition-all flex justify-between items-center group ${isStealth ? 'bg-emerald-900/5 border-emerald-500/10 hover:border-emerald-500/40' : 'bg-white/5 border-white/5 hover:border-amber-500/30'}`}>
                         <div className="text-right">
                            <span className="text-[8px] font-black uppercase opacity-40 mb-1 block">Source_Node_v15</span>
                            <h4 className={`text-sm font-black truncate max-w-[250px] ${isStealth ? 'text-emerald-400 group-hover:text-white' : 'text-slate-300 group-hover:text-amber-400'}`}>{s.title}</h4>
                         </div>
                         <span className="text-2xl opacity-20 group-hover:opacity-100 transition-all">🔗</span>
                      </a>
                    ))}
                  </div>
                )}
             </div>
           ) : (
             <div className="py-40 text-center opacity-10 flex flex-col items-center gap-10 grayscale hover:opacity-20 transition-opacity">
                <div className="text-[15rem] leading-none font-black tracking-tighter">INDEX</div>
                <p className="text-3xl font-black uppercase tracking-[1em]">Independent_Search_Protocol</p>
             </div>
           )}
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};
