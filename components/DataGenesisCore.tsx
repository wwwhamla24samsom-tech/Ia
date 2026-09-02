
import React, { useState, useEffect, useRef } from 'react';
import { orchestrateDataGenesis } from '../services/geminiService';
import { GenesisDataPacket, GenesisReport, Language } from '../types';

export const DataGenesisCore: React.FC<{ language: Language }> = ({ language }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<GenesisReport | null>(null);
  const [activePacket, setActivePacket] = useState<GenesisDataPacket | null>(null);
  const [isAssembling, setIsAssembling] = useState(false);
  const [assemblyProgress, setAssemblyProgress] = useState(0);
  
  // Genesis Config
  const [config, setConfig] = useState({
    type: 'super' as 'natural' | 'super' | 'synthetic',
    visibility: 'private' as 'public' | 'private' | 'restricted',
    priority: 'medium' as 'low' | 'medium' | 'critical'
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setReport(null);
    setActivePacket(null);
    try {
      const data = await orchestrateDataGenesis(prompt, config, language);
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startAssembly = async () => {
    if (!report) return;
    setIsAssembling(true);
    setAssemblyProgress(0);
    
    // Simulate complex neural assembly
    const interval = setInterval(() => {
      setAssemblyProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    await new Promise(r => setTimeout(r, 4000));
    setIsAssembling(false);
    alert(`تم دمج ${report.generatedPackets.length} حزم بيانات بنجاح. تعزيز النظام: +${report.systemEnhancementRatio}%`);
  };

  return (
    <div className="max-w-full mx-auto space-y-12 animate-fadeIn font-arabic pb-40 relative">
      
      {/* Visual Genesis Aura */}
      <div className="fixed inset-0 pointer-events-none opacity-10 overflow-hidden">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1500px] h-[1500px] bg-[radial-gradient(circle,rgba(245,158,11,0.05)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse`}></div>
      </div>

      <header className="bg-gradient-to-br from-[#0c0c0c] to-[#1a1a1a] border border-amber-500/20 p-12 rounded-[4rem] shadow-3xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
          <div className="flex items-center gap-8">
            <div className={`w-32 h-32 rounded-[3.5rem] border-4 flex items-center justify-center text-7xl transition-all duration-1000 shadow-2xl ${loading ? 'bg-amber-600 border-amber-400 animate-spin' : 'bg-[#0a0a0a] border-amber-500/30 shadow-amber-500/10'}`}>
               🧬
            </div>
            <div className="text-right">
              <h1 className="text-7xl font-black text-white tracking-tighter uppercase leading-none">نواة <span className="text-amber-500">التخليق</span></h1>
              <p className="text-amber-900 font-black uppercase tracking-[0.5em] text-xs mt-4 opacity-70">Sovereign_Data_Genesis_v8.5</p>
            </div>
          </div>

          <div className="flex-1 w-full max-w-2xl space-y-6">
             <div className="relative group">
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="صف البيانات التي تريد تخليقها (مثلاً: محاكاة لأسواق الطاقة، بيانات تشفير خارقة)..."
                  className="w-full bg-black/60 border border-white/10 rounded-[3rem] p-8 text-xl text-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all text-right shadow-inner min-h-[150px] resize-none"
                />
                <button 
                  onClick={handleGenerate}
                  disabled={loading}
                  className="absolute left-6 bottom-6 bg-amber-600 hover:bg-amber-500 text-black px-12 py-4 rounded-2xl font-black text-xl transition-all active:scale-95 shadow-2xl disabled:opacity-50"
                >
                  {loading ? 'جاري التخليق...' : 'توليد البيانات ✨'}
                </button>
             </div>
          </div>
        </div>

        {/* Quick Settings Bar */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 relative z-10">
           <div className="flex bg-black/40 p-2 rounded-2xl border border-white/5 gap-2">
              {['natural', 'super', 'synthetic'].map(t => (
                <button key={t} onClick={() => setConfig({...config, type: t as any})} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${config.type === t ? 'bg-amber-600 text-black' : 'text-slate-500 hover:text-white'}`}>{t}</button>
              ))}
           </div>
           <div className="flex bg-black/40 p-2 rounded-2xl border border-white/5 gap-2">
              {['public', 'private', 'restricted'].map(v => (
                <button key={v} onClick={() => setConfig({...config, visibility: v as any})} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${config.visibility === v ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}>{v}</button>
              ))}
           </div>
           <div className="flex bg-black/40 p-2 rounded-2xl border border-white/5 gap-2">
              {['low', 'medium', 'critical'].map(p => (
                <button key={p} onClick={() => setConfig({...config, priority: p as any})} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${config.priority === p ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-white'}`}>{p}</button>
              ))}
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* Left: Packets & Environment */}
        <div className="lg:col-span-8 space-y-10">
           <div className="bg-[#0a0a0a]/80 backdrop-blur-3xl rounded-[5rem] border border-white/5 p-12 min-h-[650px] relative overflow-hidden shadow-2xl flex flex-col">
              <div className="flex justify-between items-center mb-12">
                 <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Genesis_Vault</h3>
                 {report && (
                   <button 
                     onClick={startAssembly}
                     disabled={isAssembling}
                     className="bg-emerald-600 hover:bg-emerald-500 text-black px-10 py-4 rounded-2xl font-black text-sm uppercase shadow-2xl transition-all"
                   >
                     {isAssembling ? 'Assembling...' : 'بدء التركيب والدمج 🧩'}
                   </button>
                 )}
              </div>

              {isAssembling && (
                <div className="absolute inset-0 bg-black/90 z-40 flex flex-col items-center justify-center gap-10 p-20 animate-fadeIn">
                   <div className="relative w-64 h-64 flex items-center justify-center">
                      <div className="absolute inset-0 border-8 border-emerald-500/10 rounded-full"></div>
                      <div className="absolute inset-0 border-t-8 border-emerald-500 rounded-full animate-spin"></div>
                      <div className="text-6xl font-black text-emerald-500">{assemblyProgress}%</div>
                   </div>
                   <div className="text-center space-y-4">
                      <p className="text-4xl font-black text-white uppercase tracking-widest">Neural_Assembly_Active</p>
                      <p className="text-emerald-900 font-mono text-xs animate-pulse">Splicing_Data_Into_Core_v12</p>
                   </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-2 gap-8">
                 {report?.generatedPackets.map(packet => (
                   <button
                     key={packet.id}
                     onClick={() => setActivePacket(packet)}
                     className={`p-10 rounded-[3.5rem] border-2 transition-all text-right flex flex-col gap-6 group relative ${activePacket?.id === packet.id ? 'bg-white text-black border-white shadow-3xl scale-105' : 'bg-white/5 border-white/5 hover:border-amber-500/40'}`}
                   >
                      <div className="flex justify-between items-center">
                         <span className={`text-[8px] font-black uppercase px-4 py-1.5 rounded-full ${activePacket?.id === packet.id ? 'bg-black text-amber-500' : 'bg-amber-500/10 text-amber-500'}`}>{packet.type}</span>
                         <div className={`w-2 h-2 rounded-full ${packet.priority === 'critical' ? 'bg-red-500 animate-ping' : packet.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                      </div>
                      <h4 className="text-2xl font-black">{packet.label}</h4>
                      <p className="text-xs opacity-50 line-clamp-2 italic">"{packet.content}"</p>
                      <div className="flex justify-between items-center pt-4 border-t border-current border-opacity-10 text-[9px] font-black uppercase opacity-40">
                         <span>Utility: +{packet.integrationScore}%</span>
                         <span>ID: {packet.id}</span>
                      </div>
                   </button>
                 ))}

                 {!report && !loading && (
                   <div className="col-span-full h-full flex flex-col items-center justify-center opacity-10 grayscale gap-10 py-20">
                      <div className="text-[14rem] animate-float">📦</div>
                      <p className="text-4xl font-black uppercase tracking-[1em] text-amber-500">Genesis_Standby</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Right: Detailed Inspection & Assembly Log */}
        <div className="lg:col-span-4 space-y-10">
           
           <div className="bg-[#0c0c0c] border border-amber-500/20 p-10 rounded-[4rem] shadow-3xl min-h-[450px] flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-amber-600/20"></div>
              {activePacket ? (
                <div className="animate-fadeIn space-y-8 text-right">
                   <div>
                      <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{activePacket.priority}_PRIORITY_PACKET</span>
                      <h3 className="text-4xl font-black text-white">{activePacket.label}</h3>
                   </div>
                   <div className="p-8 bg-black/60 rounded-[2.5rem] border border-white/5 font-medium text-slate-300 leading-relaxed italic text-lg">
                      "{activePacket.content}"
                   </div>
                   <div className="p-6 bg-amber-600/10 border border-amber-600/20 rounded-3xl">
                      <span className="text-[9px] font-black text-slate-500 uppercase block mb-2 tracking-widest">Metadata_Signature</span>
                      <p className="text-[10px] font-mono text-amber-300">{activePacket.metadata}</p>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-white/5 rounded-3xl text-center">
                         <span className="text-[8px] text-slate-600 block uppercase mb-1">Visibility</span>
                         <span className="text-xs font-black text-white uppercase">{activePacket.visibility}</span>
                      </div>
                      <div className="p-6 bg-white/5 rounded-3xl text-center">
                         <span className="text-[8px] text-slate-600 block uppercase mb-1">Status</span>
                         <span className="text-xs font-black text-emerald-500 uppercase">READY</span>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="text-center opacity-10 flex flex-col items-center gap-6 grayscale">
                   <div className="text-8xl">🔬</div>
                   <p className="text-xl font-black uppercase tracking-widest">Select_Data_Packet</p>
                </div>
              )}
           </div>

           <div className="bg-[#080808] border border-white/5 p-8 rounded-[3.5rem] h-[350px] flex flex-col shadow-2xl relative overflow-hidden">
              <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] mb-6 border-b border-white/5 pb-4">Assembly_Process_Logs</h3>
              <div className="flex-1 overflow-y-auto no-scrollbar font-mono text-[9px] space-y-3 dir-ltr text-left">
                 {report?.assemblyLog.map((log, i) => (
                   <div key={i} className="animate-fadeIn pl-4 border-l border-amber-900/40 text-amber-700">
                      <span className="opacity-20 mr-2">[{i}]</span> {log}
                   </div>
                 ))}
                 {!report && <div className="text-slate-900 italic py-10 text-center uppercase tracking-widest">System_Awaiting_Genesis</div>}
              </div>
           </div>

           <div className="bg-amber-600 text-black p-10 rounded-[4rem] shadow-[0_0_120px_rgba(245,158,11,0.2)] flex flex-col justify-between h-[300px] relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 text-[20rem] opacity-5 rotate-12">G</div>
              <h4 className="text-3xl font-black uppercase tracking-tighter leading-tight">السيادة المعلوماتية</h4>
              <p className="text-sm font-bold opacity-80 leading-relaxed italic">
                 "نحن لا نبحث عن المعلومات، نحن نخلقها لتناسب أهدافنا السيادية تماماً. صارة أصبحت المنبع والمصب."
              </p>
              <div className="flex justify-between items-end relative z-10 border-t border-black/10 pt-4">
                 <span className="text-[9px] font-black uppercase tracking-[0.5em]">Genesis_Active</span>
                 <div className="text-5xl">🍯</div>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
