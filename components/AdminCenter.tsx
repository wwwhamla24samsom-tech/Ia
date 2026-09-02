
import React, { useState, useEffect, useRef } from 'react';
import { executeUniversalCommand, verifySystemTruth } from '../services/geminiService';
import { CoreHealth, Language, TruthAuditReport } from '../types';
import { QuantumStabilityDashboard } from './QuantumStabilityDashboard';

export const AdminCenter: React.FC<{ language: Language }> = ({ language }) => {
  const [activeTab, setActiveTab] = useState<'quantum' | 'sovereign' | 'oracle' | 'terminal'>('quantum');
  const [health, setHealth] = useState<CoreHealth>({
    cpuLoad: 5,
    memoryUsage: 18,
    neuralStability: 99.99,
    activeTunnels: 64,
    uptime: '5,122h'
  });
  
  const [truthReport, setTruthReport] = useState<TruthAuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [logs, setLogs] = useState<{t: string, m: string, s: 'info'|'warn'|'err'|'truth'}[]>([]);
  const [command, setCommand] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setHealth(prev => ({
        ...prev,
        cpuLoad: Math.min(100, Math.max(2, prev.cpuLoad + (Math.random() * 4 - 2))),
        neuralStability: Math.min(100, Math.max(99.95, prev.neuralStability + (Math.random() * 0.01 - 0.005)))
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [logs]);

  const addLog = (m: string, s: 'info'|'warn'|'err'|'truth' = 'info') => {
    setLogs(prev => [...prev, { t: new Date().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}), m, s }].slice(-50));
  };

  const runTruthOracle = async () => {
    setIsAuditing(true);
    addLog("إطلاق أوراكل الحقيقة.. مزامنة الواقع", "truth");
    try {
      const report = await verifySystemTruth("Admin_State_Verification", language);
      setTruthReport(report);
      addLog(`اكتمل التدقيق: النزاهة ${report.integrityScore}%`, "truth");
    } catch (e) {
      addLog("فشل التدقيق: تداخل في المصفوفة", "err");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    const cmd = command;
    setCommand('');
    addLog(`> حقن: ${cmd}`, 'info');
    try {
      const res = await executeUniversalCommand(cmd, 'SARAH_CORE', language);
      addLog(`النواة: ${res.vocalResponse}`, 'info');
    } catch {
      addLog("تم رفض الوصول للمستوى 17", "err");
    }
  };

  return (
    <div className="flex flex-col h-full space-y-8 font-arabic animate-fadeIn pb-32 text-white">
      
      {/* Sovereign HUD Header */}
      <div className="bg-black/80 backdrop-blur-xl border border-emerald-500/30 p-10 rounded-[3rem] shadow-[0_0_50px_rgba(16,185,129,0.1)] relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent"></div>
         <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-6">
               <div className="w-20 h-20 bg-emerald-600/10 rounded-[2rem] flex items-center justify-center text-4xl border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-pulse">🏛️</div>
               <div>
                  <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">نواة <span className="text-emerald-500 shadow-emerald-500/50">السيادة</span></h2>
                  <p className="text-emerald-900 font-mono text-[10px] tracking-[0.6em] uppercase mt-3">Admin_Override_Active</p>
               </div>
            </div>
            <div className="flex gap-4">
               <div className="px-6 py-3 bg-black/60 border border-emerald-500/20 rounded-2xl text-center">
                  <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Reality_Sync</span>
                  <span className="text-2xl font-black text-emerald-500">{health.neuralStability}%</span>
               </div>
            </div>
         </div>
      </div>

      {/* Matrix Navigation Tabs */}
      <div className="flex flex-wrap bg-black/40 p-2 rounded-3xl border border-white/5 gap-2 backdrop-blur-xl">
         {[
           { id: 'quantum', label: 'استقرار النواة الكوآنتومية (D3)', icon: '⚛️' },
           { id: 'sovereign', label: 'المؤشرات الحيوية', icon: '📊' },
           { id: 'oracle', label: 'أوراكل الحقيقة', icon: '⚖️' },
           { id: 'terminal', label: 'حقن النواة', icon: 'λ' }
         ].map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`flex-1 min-w-[140px] py-4 rounded-2xl text-[11px] font-black transition-all flex items-center justify-center gap-3 border ${activeTab === tab.id ? 'bg-emerald-600 border-emerald-400 text-black shadow-xl scale-105' : 'bg-transparent border-white/5 text-slate-500 hover:text-white'}`}
           >
             <span>{tab.icon}</span>
             {tab.label}
           </button>
         ))}
      </div>

      <main className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'quantum' && (
          <QuantumStabilityDashboard language={language} />
        )}

        {activeTab === 'sovereign' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
             <div className="bg-black/60 border border-emerald-500/10 p-12 rounded-[4rem] flex flex-col items-center justify-center text-center space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-[150px] pointer-events-none rotate-12">𒈹</div>
                <div className="relative w-64 h-64">
                   <svg className="w-full h-full -rotate-90">
                     <circle cx="128" cy="128" r="115" fill="transparent" stroke="rgba(16,185,129,0.05)" strokeWidth="15" />
                     <circle cx="128" cy="128" r="115" fill="transparent" stroke="#10b981" strokeWidth="15" strokeDasharray="722" strokeDashoffset={722 - (722 * (truthReport?.integrityScore || 99.9)) / 100} className="transition-all duration-[3s]" strokeLinecap="round" />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-7xl font-black text-white">{truthReport?.integrityScore?.toFixed(0) || '99'}%</span>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mt-2">Matrix_Index</span>
                   </div>
                </div>
                <button 
                  onClick={runTruthOracle}
                  className="w-full py-6 bg-emerald-600 text-black rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-3xl hover:bg-white transition-all active:scale-95"
                >
                  {isAuditing ? 'Auditing Matrix...' : 'بدء فحص النزاهة النورونية 👁️'}
                </button>
             </div>

             <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                   <div className="bg-black/60 p-10 rounded-[3rem] border border-emerald-500/20">
                      <span className="text-[10px] font-black text-slate-500 uppercase block mb-2">Neural_Load</span>
                      <div className="text-4xl font-black text-emerald-500">{health.cpuLoad.toFixed(1)}%</div>
                   </div>
                   <div className="bg-black/60 p-10 rounded-[3rem] border border-blue-500/20">
                      <span className="text-[10px] font-black text-slate-500 uppercase block mb-2">Sync_Stability</span>
                      <div className="text-4xl font-black text-blue-500">{health.neuralStability}%</div>
                   </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-950/40 to-black border border-emerald-500/20 p-10 rounded-[4rem] h-[340px] flex flex-col justify-between">
                   <h4 className="text-xl font-black uppercase tracking-widest text-emerald-600">Core_Status</h4>
                   <p className="text-3xl text-slate-300 font-medium italic leading-relaxed">"النظام في حالة تأهب سيادي كامل. كافة العقد النورونية تعمل بكفاءة V17 المستقرة."</p>
                   <div className="flex justify-between items-end border-t border-white/5 pt-6 text-[10px] font-mono text-slate-700">
                      <span>UPTIME: {health.uptime}</span>
                      <span>TUNNELS: {health.activeTunnels} ACTIVE</span>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'oracle' && (
          <div className="animate-fadeIn space-y-8">
             <div className="bg-black/80 border border-emerald-500/30 p-12 rounded-[4rem] space-y-10 shadow-[0_0_100px_rgba(16,185,129,0.1)]">
                <div className="text-center space-y-4">
                   <h3 className="text-4xl font-black text-white uppercase tracking-widest">أوراكل الحقيقة</h3>
                   <div className="h-1 w-24 bg-emerald-500 mx-auto rounded-full"></div>
                </div>
                
                {truthReport ? (
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-slideUp">
                      <div className="space-y-6">
                         <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-between">
                            <span className="text-xl font-black text-slate-300">مخاطر الهلوسة</span>
                            <span className="text-emerald-500 font-black text-3xl">ZERO_RISK</span>
                         </div>
                         <div className="space-y-4">
                            <span className="text-[10px] font-black text-emerald-500 uppercase ml-4 block">Truth_Anchors</span>
                            {truthReport.verifiedAnchors.map((a, i) => (
                              <div key={i} className="p-6 bg-black/60 border border-white/10 rounded-2xl text-xs text-slate-300 flex items-center gap-4 group hover:border-emerald-500 transition-all">
                                 <span className="text-emerald-500 text-xl font-black">✓</span> {a}
                              </div>
                            ))}
                         </div>
                      </div>
                      <div className="flex flex-col gap-6">
                         <div className="p-8 bg-emerald-900/10 border border-emerald-500/20 rounded-[3rem] flex-1">
                            <span className="text-[10px] font-black text-emerald-500 uppercase block mb-4">Neural_Seal_Verification</span>
                            <p className="text-[10px] font-mono text-emerald-500/60 break-all leading-relaxed bg-black/40 p-6 rounded-2xl shadow-inner">{truthReport.neuralSeal}</p>
                         </div>
                         <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem] text-center italic text-slate-400">
                           "الواقع الرقمي متطابق بنسبة 100% مع معايير السيادة المحددة."
                         </div>
                      </div>
                   </div>
                ) : (
                   <div className="py-40 text-center opacity-10 grayscale">
                      <div className="text-[15rem] leading-none animate-pulse">⚖️</div>
                      <p className="text-3xl font-black uppercase tracking-[1.5em] mt-10">Audit_Ready</p>
                   </div>
                )}
             </div>
          </div>
        )}

        {activeTab === 'terminal' && (
          <div className="bg-black border-2 border-emerald-500/30 rounded-[4rem] flex flex-col h-[75vh] overflow-hidden shadow-4xl relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-noise.png')] opacity-10 pointer-events-none"></div>
             <div className="bg-black/80 px-10 py-6 border-b border-emerald-500/20 flex items-center justify-between z-10">
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-600"></div>
                   <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                   <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-[0.6em]">Sovereign_Kernel_v101_Shell</span>
             </div>
             
             <div ref={terminalRef} className="flex-1 overflow-y-auto p-12 font-mono text-xs space-y-4 dir-ltr text-left no-scrollbar relative z-10">
                <div className="text-emerald-900 opacity-60 mb-8">
                   [BOOTING_INCORRUPTIBLE_REALITY_LAYER] <br/>
                   [ENCRYPTION: AES_8192_ACTIVE] <br/>
                   [AWAITING_SOVEREIGN_COMMANDS...]
                </div>
                {logs.map((log, i) => (
                  <div key={i} className={`animate-fadeIn flex gap-6 p-4 rounded-2xl bg-white/5 border border-white/5 ${log.s === 'err' ? 'border-red-500/20 text-red-500' : log.s === 'truth' ? 'border-amber-500/20 text-amber-500' : 'text-emerald-400'}`}>
                     <span className="opacity-20 shrink-0 font-bold">[{log.t}]</span>
                     <span className="whitespace-pre-wrap flex-1 leading-relaxed">{log.m}</span>
                  </div>
                ))}
             </div>

             <form onSubmit={handleCommand} className="p-8 bg-black border-t border-emerald-500/20 relative z-10">
                <div className="flex items-center gap-6">
                   <span className="text-emerald-500 font-black text-3xl">λ</span>
                   <input 
                     type="text"
                     value={command}
                     onChange={(e) => setCommand(e.target.value)}
                     placeholder="حقن أمر النواة المباشر..."
                     className="flex-1 bg-transparent border-none focus:ring-0 text-emerald-500 text-2xl font-mono uppercase placeholder:text-emerald-900/30"
                   />
                </div>
             </form>
          </div>
        )}
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};
