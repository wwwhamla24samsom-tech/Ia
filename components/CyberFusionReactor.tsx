
import React, { useState, useEffect, useRef } from 'react';
import { orchestrateCyberDefense } from '../services/geminiService';
import { CyberDefenseReport, Language, AlgorithmPath, SystemConfig } from '../types';

export const CyberFusionReactor: React.FC<{ language: Language }> = ({ language }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<CyberDefenseReport | null>(null);
  const [fusionProgress, setFusionProgress] = useState(0);
  const [isMeltdown, setIsMeltdown] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [reactorPower, setReactorPower] = useState(0);
  
  // Customization Centers State
  const [systemConfigs, setSystemConfigs] = useState<SystemConfig[]>([
    { id: 'arch', name: 'المعمار الاستراتيجي', powerLevel: 80, mode: 'balanced', autoEvolve: true },
    { id: 'sec', name: 'الدفاع السبراني', powerLevel: 95, mode: 'aggressive', autoEvolve: true },
    { id: 'code', name: 'مفاعل الأكواد', powerLevel: 70, mode: 'stealth', autoEvolve: false },
    { id: 'space', name: 'منظومة المدار الفضائي', powerLevel: 85, mode: 'balanced', autoEvolve: true }
  ]);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 15));
  };

  const handleFusionStart = async () => {
    setLoading(true);
    setFusionProgress(0);
    setReport(null);
    setIsMeltdown(false);
    addLog("INITIATING_SYSTEM_SYNERGY_PROTOCOL...");
    
    // Simulate slight loading feel but no artificial blocking loops
    setFusionProgress(30);

    try {
      const cityStatus = "Metropolis: Active Nodes (24), Network Load: High, Synergy: Interrupted";
      const threatLogs = "Attempted breach at Port_8080. Unusual activity in Subnet_Alpha.";
      
      const data = await orchestrateCyberDefense(cityStatus, threatLogs, systemConfigs, language);
      
      setFusionProgress(100);
      setReport(data);
      setReactorPower(data.integrityScore);
      addLog("FUSION_COMPLETE: CROSS-SYSTEM_AUTOMATION_ACTIVE");
    } catch (err) {
      addLog("CRITICAL_FAILURE: SYNERGY_SYNC_LOST_SYSTEM_ISOLATED");
      setIsMeltdown(true);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = (id: string, updates: Partial<SystemConfig>) => {
    setSystemConfigs(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    addLog(`CONFIG_UPDATE: System_${id} parameters adjusted.`);
  };

  return (
    <div className="max-w-full mx-auto space-y-12 animate-fadeIn font-arabic pb-40 relative">
      
      {/* Visual Reactor Pulse Background */}
      <div className="fixed inset-0 pointer-events-none opacity-10 overflow-hidden">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full border-[150px] ${loading ? 'border-amber-500 animate-spin-slow' : 'border-slate-900'} transition-all duration-1000 opacity-20`}></div>
      </div>

      <header className="bg-gradient-to-br from-[#0c0c0c] to-[#1a1505] border border-amber-500/30 p-12 rounded-[4rem] shadow-[0_0_150px_rgba(245,158,11,0.2)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-full h-[3px] bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
          <div className="flex items-center gap-10">
            <div className={`w-32 h-32 rounded-[3.5rem] border-4 flex items-center justify-center text-7xl transition-all duration-1000 shadow-2xl ${loading ? 'bg-amber-600 border-amber-400 animate-pulse scale-110' : isMeltdown ? 'bg-red-600 border-red-400 animate-ping' : 'bg-[#0a0a0a] border-amber-500/50'}`}>
               {loading ? '☢️' : isMeltdown ? '🚨' : '🗝️'}
            </div>
            <div className="text-right">
              <h1 className="text-8xl font-black text-white tracking-tighter uppercase leading-none">مفاعل <span className="text-amber-500">السيادة</span></h1>
              <p className="text-amber-900 font-black uppercase tracking-[0.5em] text-sm mt-4 opacity-70">Unified_Sovereign_Reactor_v8.5_Prime</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-6">
             <div className="bg-black/80 px-12 py-8 rounded-[3rem] border border-amber-500/10 shadow-inner flex gap-16 items-center">
                <div className="text-right">
                   <span className="text-[10px] font-black text-slate-600 uppercase block mb-1 tracking-widest">Reactor_Sync</span>
                   <span className="text-5xl font-black text-amber-500">{reactorPower}%</span>
                </div>
                <div className="w-[2px] h-16 bg-white/5"></div>
                <div className="text-right">
                   <span className="text-[10px] font-black text-slate-600 uppercase block mb-1 tracking-widest">Automation_Paths</span>
                   <span className="text-5xl font-black text-emerald-500">{report?.synergyPaths?.length || 0}</span>
                </div>
             </div>
             <button 
               onClick={handleFusionStart}
               disabled={loading}
               className="bg-amber-600 hover:bg-amber-500 text-black px-20 py-7 rounded-[3rem] font-black text-3xl shadow-3xl transition-all active:scale-95 disabled:opacity-50 group/btn overflow-hidden relative"
             >
               <span className="relative z-10">{loading ? 'جاري توحيد الأنظمة...' : 'تفعيل الاندماج الشامل ⚡'}</span>
               <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
             </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* Right Sidebar: System Customization Centers */}
        <div className="lg:col-span-3 space-y-6">
           <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.4em] mb-4 mr-4">Customization_Matrix</h3>
           {systemConfigs.map(config => (
             <div key={config.id} className="bg-black/60 border border-white/5 p-8 rounded-[3.5rem] space-y-6 hover:border-amber-500/30 transition-all group">
                <div className="flex justify-between items-center">
                   <h4 className="text-lg font-black text-white">{config.name}</h4>
                   <div className={`w-2 h-2 rounded-full ${config.powerLevel > 50 ? 'bg-amber-500 shadow-[0_0_10px_orange]' : 'bg-slate-700'}`}></div>
                </div>
                
                <div className="space-y-4">
                   <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase">
                      <span>Power_Weight</span>
                      <span>{config.powerLevel}%</span>
                   </div>
                   <input 
                     type="range" min="0" max="100" 
                     value={config.powerLevel}
                     onChange={(e) => updateConfig(config.id, { powerLevel: parseInt(e.target.value) })}
                     className="w-full accent-amber-500 h-1 bg-white/5 rounded-full appearance-none cursor-pointer"
                   />
                </div>

                <div className="flex bg-slate-900/50 p-1.5 rounded-2xl gap-1 border border-white/5">
                   {['stealth', 'balanced', 'aggressive'].map(m => (
                     <button
                       key={m}
                       onClick={() => updateConfig(config.id, { mode: m as any })}
                       className={`flex-1 py-2 rounded-xl text-[8px] font-black uppercase transition-all ${config.mode === m ? 'bg-amber-600 text-black shadow-lg' : 'text-slate-600 hover:text-white'}`}
                     >
                        {m.substring(0, 3)}
                     </button>
                   ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                   <span className="text-[9px] font-black text-slate-600 uppercase">Auto_Evolve</span>
                   <button 
                     onClick={() => updateConfig(config.id, { autoEvolve: !config.autoEvolve })}
                     className={`w-10 h-5 rounded-full transition-all relative ${config.autoEvolve ? 'bg-amber-600' : 'bg-white/5'}`}
                   >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.autoEvolve ? 'right-6' : 'right-1'}`}></div>
                   </button>
                </div>
             </div>
           ))}
        </div>

        {/* Center: Sovereign Monitor Screen */}
        <div className="lg:col-span-6 space-y-8 flex flex-col">
           <div className="bg-[#050505] rounded-[5rem] border-[12px] border-slate-950 aspect-[4/3] relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.02),transparent)]"></div>
              
              {/* Screen Content */}
              <div className="h-full w-full relative z-10 p-12 flex flex-col items-center justify-center">
                 {loading ? (
                   <div className="text-center space-y-12">
                      <div className="relative w-72 h-72 mx-auto">
                         <div className="absolute inset-0 border-8 border-amber-500/5 rounded-full"></div>
                         <div className="absolute inset-0 border-t-8 border-amber-500 rounded-full animate-spin"></div>
                         <div className="absolute inset-10 bg-amber-500/10 rounded-full animate-pulse flex items-center justify-center text-7xl shadow-inner">⚡</div>
                      </div>
                      <div className="space-y-4">
                         <p className="text-amber-900 text-sm font-black animate-pulse">OPTIMIZING_ALGORITHM_PATHS_V8.5</p>
                      </div>
                   </div>
                 ) : report ? (
                   <div className="w-full h-full flex flex-col space-y-12 animate-fadeIn relative">
                      <div className="flex justify-between items-start border-b border-white/5 pb-8">
                         <div>
                            <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Sovereign_Monitor</h3>
                            <p className="text-emerald-500 font-bold text-sm mt-1 animate-pulse">PROTOCOL_ACTIVE: SYSTEMS_IN_SYNERGY</p>
                         </div>
                         <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-500 uppercase">Integrity</span>
                            <span className="text-3xl font-black text-amber-500">{report.integrityScore}%</span>
                         </div>
                      </div>

                      {/* Visual Algorithm Paths Flow */}
                      <div className="flex-1 relative border border-white/5 rounded-[3rem] bg-black/40 overflow-hidden">
                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(245,158,11,0.05),transparent)]"></div>
                         
                         {report.synergyPaths?.map((path, i) => (
                           <div key={path.id} className="absolute w-full p-6 border-b border-white/5 flex items-center justify-between hover:bg-white/5 transition-all animate-slideInRight" style={{ top: `${i * 20}%`, animationDelay: `${i * 0.2}s` }}>
                              <div className="flex items-center gap-6">
                                 <span className="text-emerald-500 text-2xl font-black">{" >> "}</span>
                                 <div>
                                    <div className="text-[9px] font-black text-amber-600 uppercase tracking-widest">{path.sourceSystem} → {path.targetSystem}</div>
                                    <div className="text-lg font-black text-white">{path.action}</div>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <div className="text-xl font-black text-emerald-500">+{path.efficiency}%</div>
                                 <div className={`text-[8px] font-black uppercase ${path.status === 'active' ? 'text-blue-500' : 'text-amber-500'}`}>{path.status}</div>
                              </div>
                           </div>
                         ))}
                         
                         {/* Animated Scan Line */}
                         <div className="absolute inset-x-0 h-1 bg-amber-500/20 shadow-[0_0_20px_orange] animate-scanline pointer-events-none"></div>
                      </div>

                      <div className="p-8 bg-amber-950/20 rounded-[3rem] border border-amber-600/20 flex items-center justify-between">
                         <p className="text-sm text-amber-100 italic leading-relaxed max-w-[80%]">"{report.strategySummary}"</p>
                         <div className="text-4xl">👑</div>
                      </div>
                   </div>
                 ) : (
                   <div className="text-center space-y-12 opacity-5 grayscale group-hover:opacity-10 transition-opacity">
                      <div className="text-[20rem] animate-float">👁️</div>
                      <p className="text-6xl font-black uppercase tracking-[1.5em] text-amber-500">Monitor_Offline</p>
                   </div>
                 )}
              </div>

              {/* Screen Frame Elements */}
              <div className="absolute top-8 left-12 flex gap-4 z-20">
                 <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                 <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                 <div className="w-2 h-2 rounded-full bg-slate-800"></div>
              </div>
              <div className="absolute bottom-8 right-12 text-[10px] font-mono text-slate-800 font-bold uppercase tracking-widest z-20">
                Resolution: NEURAL_8K_GEN8
              </div>
           </div>

           {/* Quick Action Matrix Footer */}
           <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Force_Sync', icon: '🔄', action: () => addLog("PROTOCOL_COMMAND: FORCE_SYSTEM_SYNC") },
                { label: 'Neural_Dump', icon: '📥', action: () => addLog("PROTOCOL_COMMAND: MEMORY_DUMP_INITIATED") },
                { label: 'Emergency_Lock', icon: '🔒', action: () => setIsMeltdown(true) }
              ].map(btn => (
                <button 
                  key={btn.label}
                  onClick={btn.action}
                  className="bg-white/5 border border-white/5 p-6 rounded-[2.5rem] flex flex-col items-center gap-3 hover:bg-amber-600 hover:text-black transition-all group"
                >
                   <span className="text-3xl group-hover:scale-110 transition-transform">{btn.icon}</span>
                   <span className="text-[9px] font-black uppercase tracking-widest">{btn.label}</span>
                </button>
              ))}
           </div>
        </div>

        {/* Left Sidebar: Operational Intelligence & Adaptive Logs */}
        <div className="lg:col-span-3 space-y-10 h-full flex flex-col">
           <div className="bg-[#0c0c0c] border border-amber-500/20 p-8 rounded-[4rem] h-[450px] flex flex-col shadow-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></div></div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8 border-b border-white/5 pb-6">Synergy_Activity_Logs</h3>
              <div className="flex-1 overflow-y-auto no-scrollbar font-mono text-[9px] space-y-4 dir-ltr text-left">
                 {logs.map((log, i) => (
                   <div key={i} className={`animate-fadeIn pl-4 border-l-2 transition-all ${log.includes('CRITICAL') || isMeltdown ? 'border-red-600 text-red-500' : log.includes('COMPLETE') || log.includes('ACTIVE') ? 'border-emerald-600 text-emerald-400' : 'border-amber-900/40 text-amber-600/40'}`}>
                      <span className="opacity-20 mr-2">[{i}]</span>
                      <span className="whitespace-pre-wrap">{log}</span>
                   </div>
                 ))}
                 {logs.length === 0 && <div className="text-slate-900 italic py-20 text-center uppercase tracking-widest">Awaiting_Reactor_Signal</div>}
              </div>
           </div>

           <div className="bg-amber-600 text-black p-12 rounded-[5rem] shadow-[0_0_120px_rgba(245,158,11,0.25)] flex flex-col justify-between h-[400px] relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 text-[20rem] opacity-5 rotate-12 transition-transform group-hover:rotate-0 duration-1000">S</div>
              <div>
                <h4 className="text-4xl font-black uppercase tracking-tighter leading-tight">السيادة المؤتمتة</h4>
                <p className="text-lg font-bold leading-relaxed opacity-80 mt-6 italic">
                  "لقد قمنا بتوحيد أنظمة صارة في نواة واحدة. كل خوارزمية الآن هي مسار متمم للأخرى، مما يخلق وعياً نظامياً غير قابل للكسر."
                </p>
              </div>
              <div className="flex justify-between items-end relative z-10 pt-6 border-t border-black/10">
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] border-b-2 border-black">Gen_8.5_Unity</span>
                 <div className="text-5xl animate-pulse">🏺</div>
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
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slideInRight { animation: slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes scanline { 0% { top: 0%; } 100% { top: 100%; } }
        .animate-scanline { animation: scanline 4s linear infinite; }
      `}</style>
    </div>
  );
};
