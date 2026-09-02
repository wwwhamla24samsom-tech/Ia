
import React, { useState, useEffect } from 'react';
import { forgeRemoteWebsite } from '../services/geminiService';
import { RemoteSite, Language } from '../types';

export const RemoteForge: React.FC<{ language: Language }> = ({ language }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState<RemoteSite[]>([]);
  const [activeSite, setActiveSite] = useState<RemoteSite | null>(null);
  const [rotation, setRotation] = useState({ x: -25, y: 45 });
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'3d' | 'code' | 'control'>('3d');

  const handleForge = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] INITIATING_REMOTE_FORGE_PROTOCOL...`, ...prev]);
    
    try {
      const site = await forgeRemoteWebsite(prompt, language);
      setSites([site, ...sites]);
      setActiveSite(site);
      setLogs(prev => [
        `[${new Date().toLocaleTimeString()}] SITE_FORGED: ${site.name}`,
        `[${new Date().toLocaleTimeString()}] NEURAL_ADDRESS_ASSIGNED: ${site.neuralAddress}`,
        ...prev
      ]);
      setPrompt('');
    } catch (err) {
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] ERROR: FORGE_TIMEOUT_OR_PROTOCOL_BREACH`, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-full mx-auto bg-[#020202] text-white p-0 overflow-hidden min-h-screen font-arabic">
      
      {/* Forge Header */}
      <header className="px-10 py-8 border-b border-white/5 bg-black/40 backdrop-blur-3xl z-50 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-8">
           <div className="flex flex-col">
              <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-blue-500">Neural_Remote_Forge</h2>
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest mt-1">Remote_Injection_Matrix_v9.0</span>
           </div>
        </div>
        <div className="flex gap-4">
           {loading && (
             <div className="flex items-center gap-3 px-6 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full animate-pulse">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
                <span className="text-[9px] font-black text-blue-400 uppercase">Forging_In_Progress</span>
             </div>
           )}
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row relative">
        
        {/* Left Side: Creation & Stacks */}
        <div className="lg:w-[480px] border-l border-white/5 bg-black/60 backdrop-blur-3xl p-10 flex flex-col gap-10 z-[60] shadow-2xl overflow-y-auto no-scrollbar">
           <div className="space-y-6">
              <h3 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">Command_Input</h3>
              <div className="relative group">
                 <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="صف الموقع الذي تريد تجسيده عن بعد... (مثلاً: نظام مبيعات ذكي بميزة الرد التلقائي)"
                    className="w-full bg-[#050505] border border-white/10 rounded-[2.5rem] p-8 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none h-44 shadow-inner text-right"
                 />
              </div>
              <button 
                onClick={handleForge}
                disabled={loading || !prompt.trim()}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-3xl font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 group"
              >
                {loading ? 'جاري الصهر النوروني...' : 'بدء التجسيد والارتباط'}
                <svg className="w-6 h-6 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </button>
           </div>

           <div className="space-y-6 flex-1">
              <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Active_Neural_Sites</h3>
              <div className="grid grid-cols-1 gap-4">
                 {sites.map(site => (
                   <button 
                     key={site.id} 
                     onClick={() => setActiveSite(site)}
                     className={`p-6 rounded-[2.5rem] border transition-all text-right group ${activeSite?.id === site.id ? 'bg-white text-black border-white shadow-[0_0_40px_white]' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}
                   >
                     <div className="flex justify-between items-start mb-2">
                        <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full ${activeSite?.id === site.id ? 'bg-black text-white' : 'bg-blue-600/20 text-blue-400'}`}>{site.status}</span>
                        <h4 className="font-black text-lg">{site.name}</h4>
                     </div>
                     <p className="text-[10px] font-mono opacity-50">{site.neuralAddress}</p>
                   </button>
                 ))}
                 {sites.length === 0 && <div className="py-20 text-center text-slate-800 italic text-sm">المصفوفة فارغة، بانتظار التجسيد الأول...</div>}
              </div>
           </div>

           {/* Logs Overlay Mini */}
           <div className="bg-black/80 p-6 rounded-3xl border border-white/5 h-40 overflow-y-auto no-scrollbar font-mono text-[9px] text-blue-900">
              {logs.map((log, i) => <div key={i} className="mb-1">{log}</div>)}
           </div>
        </div>

        {/* Right Side: 3D Structure & Memory Control */}
        <div className="flex-1 relative bg-[#020202]">
           {/* Visual Tabs */}
           <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[70] flex bg-white/5 backdrop-blur-2xl p-1.5 rounded-full border border-white/10">
              {[
                { id: '3d', label: 'البنية 3D', icon: '💎' },
                { id: 'code', label: 'كود النواة', icon: '💻' },
                { id: 'control', label: 'التحكم العصبوني', icon: '🧠' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-8 py-2.5 rounded-full text-[11px] font-black flex items-center gap-3 transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-2xl' : 'text-white/30 hover:text-white'}`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
           </div>

           {activeSite ? (
             <div className="h-full w-full animate-fadeIn">
                {activeTab === '3d' && (
                  <div className="h-full w-full relative flex items-center justify-center overflow-hidden">
                     {/* 3D Scene Simulation */}
                     <div className="absolute top-10 left-10 z-[80] flex gap-4">
                        <button onClick={() => setRotation(r => ({...r, y: r.y - 15}))} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">↺</button>
                        <button onClick={() => setRotation(r => ({...r, y: r.y + 15}))} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">↻</button>
                     </div>

                     <div 
                        className="w-[1200px] h-[900px] transition-transform duration-1000 ease-out"
                        style={{ perspective: '2000px', transformStyle: 'preserve-3d' }}
                     >
                        <div 
                          className="w-full h-full relative transition-transform duration-1000"
                          style={{ transformStyle: 'preserve-3d', transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
                        >
                           {/* Floor Grid */}
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1800px] h-[1800px] bg-[radial-gradient(circle,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [transform:rotateX(90deg)_translateZ(-400px)] border border-blue-500/5"></div>

                           {/* Central Core */}
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-600 rounded-[3rem] shadow-[0_0_100px_rgba(59,130,246,0.6)] animate-pulse border-4 border-white/20 flex items-center justify-center">
                              <span className="text-2xl font-black text-white">CORE</span>
                           </div>

                           {/* Branches (Nodes) */}
                           {activeSite.structure.map((node, i) => (
                             <div 
                                key={node.id}
                                className="absolute transition-all duration-1000"
                                style={{ 
                                  left: `calc(50% + ${node.pos.x}px)`, 
                                  top: `calc(50% + ${node.pos.y}px)`, 
                                  transform: `translateZ(${node.pos.z}px)`,
                                  transformStyle: 'preserve-3d'
                                }}
                             >
                                <div className="w-20 h-20 relative animate-float" style={{ animationDelay: `${i*0.2}s` }}>
                                   <div className={`absolute inset-0 rounded-2xl border-2 shadow-2xl transition-all duration-500 ${node.type === 'logic' ? 'bg-purple-600 border-purple-400' : node.type === 'view' ? 'bg-cyan-600 border-cyan-400' : 'bg-emerald-600 border-emerald-400'}`}></div>
                                   <div className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 border border-white/10 px-5 py-2 rounded-2xl text-[10px] font-black text-white shadow-2xl backdrop-blur-xl">
                                      {node.label}
                                   </div>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
                )}

                {activeTab === 'code' && (
                  <div className="h-full p-24 pt-40 overflow-auto no-scrollbar animate-fadeIn">
                     <div className="max-w-5xl mx-auto space-y-10">
                        <div className="flex justify-between items-center border-b border-white/5 pb-8">
                           <h3 className="text-4xl font-black text-white tracking-tighter">كود النواة النورونية</h3>
                           <button onClick={() => navigator.clipboard.writeText(activeSite.code)} className="px-8 py-3 bg-white text-black rounded-2xl font-black text-xs uppercase hover:bg-blue-500 hover:text-white transition-all">Copy_Matrix_Code</button>
                        </div>
                        <div className="bg-[#050505] p-12 rounded-[4rem] border border-white/5 font-mono text-sm text-blue-400 leading-relaxed dir-ltr text-left shadow-inner h-[600px] overflow-y-auto no-scrollbar selection:bg-blue-600/30">
                           {activeSite.code}
                        </div>
                     </div>
                  </div>
                )}

                {activeTab === 'control' && (
                  <div className="h-full flex items-center justify-center p-20 animate-fadeIn">
                     <div className="grid grid-cols-2 gap-10 w-full max-w-4xl">
                        <div className="bg-white/5 border border-white/10 p-12 rounded-[4rem] backdrop-blur-3xl space-y-8">
                           <h4 className="text-3xl font-black text-white">التحكم الذاكراتي</h4>
                           <p className="text-slate-500 leading-relaxed italic">يتم التحكم في هذا الموقع مباشرة من ذاكرة صارة النورونية دون الحاجة لسيرفرات خارجية تقليدية.</p>
                           <div className="space-y-4 pt-6">
                              <button className="w-full py-5 rounded-3xl bg-blue-600 text-white font-black text-lg shadow-xl hover:bg-blue-500 transition-all">تحديث المنطق الحي ✨</button>
                              <button className="w-full py-5 rounded-3xl bg-white/5 border border-white/10 text-white font-black text-lg hover:bg-white/10 transition-all">إعادة بناء الهيكل 🧩</button>
                           </div>
                        </div>
                        <div className="bg-blue-950/20 border border-blue-500/20 p-12 rounded-[4rem] space-y-8">
                           <h4 className="text-3xl font-black text-blue-400 uppercase tracking-tighter">Site_Metrics</h4>
                           <div className="space-y-6">
                              <div>
                                 <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-2">Neural_Integrity</div>
                                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[99.9%]"></div>
                                 </div>
                              </div>
                              <div>
                                 <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-2">Defense_Shield</div>
                                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[100%]"></div>
                                 </div>
                              </div>
                           </div>
                           <div className="pt-10 flex flex-col items-center text-center opacity-40">
                              <div className="text-6xl mb-4">📡</div>
                              <span className="text-[10px] font-black uppercase tracking-widest">Broadcast: Stable</span>
                           </div>
                        </div>
                     </div>
                  </div>
                )}
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center opacity-5 grayscale pointer-events-none">
                <div className="text-[18rem] font-black tracking-tighter leading-none animate-pulse">FORGE</div>
                <p className="text-4xl font-black uppercase tracking-[1em] mt-10">Neural_Injection_Awaited</p>
             </div>
           )}

           {/* Metrics Footer Layer */}
           <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center px-10 py-6 bg-white/5 backdrop-blur-3xl rounded-full border border-white/5 opacity-40 z-[100] pointer-events-none">
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Remote_Sync: Verified</span>
              <div className="flex gap-10">
                 <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Memory_Forge: 100TB</span>
                 <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">State: STABLE</span>
                 <span className="text-[9px] font-black text-white/20 uppercase">Forge_Delay: 0ms</span>
              </div>
           </div>
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes float { 0%, 100% { transform: translateY(0) rotateY(0deg); } 50% { transform: translateY(-30px) rotateY(15deg); } }
        .animate-float { animation: float 5s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
