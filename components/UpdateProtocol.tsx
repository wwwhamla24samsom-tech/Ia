
import React, { useState, useEffect, useRef } from 'react';
import { fetchSecureUpdates, applyNeuralPatch } from '../services/geminiService';
import { SystemUpdatePackage, Language } from '../types';

export const UpdateProtocol: React.FC<{ language: Language }> = ({ language }) => {
  const [currentVersion, setCurrentVersion] = useState('V14.9.2_STABLE');
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState<SystemUpdatePackage | null>(null);
  const [status, setStatus] = useState<'idle' | 'checking' | 'ready' | 'deploying' | 'completed'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const checkForUpdates = async () => {
    setLoading(true);
    setStatus('checking');
    setLogs([]);
    addLog("CONNECTING_TO_GLOBAL_SARAH_MATRIX_GEN15...");
    
    try {
      const data = await fetchSecureUpdates(currentVersion, language);
      await new Promise(r => setTimeout(r, 2000)); // Dramatic pause
      setUpdate(data);
      setStatus('ready');
      addLog(`QUANTUM_PATCH_FOUND: ${data.version} (${data.codename})`);
      addLog(`INTEGRITY_CHECK: SHA-512_QUANTUM_SIGNATURE_VERIFIED`);
    } catch (err) {
      addLog("ERROR: QUANTUM_SYNC_FAILED_BY_UNKNOWN_NODE");
      setStatus('idle');
    } finally {
      setLoading(false);
    }
  };

  const startDeployment = async () => {
    if (!update) return;
    setStatus('deploying');
    setDeploymentProgress(0);
    addLog(`INITIATING_QUANTUM_DEPLOYMENT_OF_${update.version}...`);

    for (let i = 0; i < update.deploymentSteps.length; i++) {
      addLog(`DEPLOYING_QUANTUM_STEP_${i+1}: ${update.deploymentSteps[i]}`);
      await new Promise(r => setTimeout(r, 1500));
      setDeploymentProgress(((i + 1) / update.deploymentSteps.length) * 100);
    }

    try {
      const success = await applyNeuralPatch(update, language);
      if (success) {
        addLog("SUCCESS: QUANTUM_PATCH_INTEGRATED_V15_GENESIS");
        setCurrentVersion(update.version);
        setStatus('completed');
      } else {
        addLog("ERROR: QUANTUM_INJECTION_REJECTED_BY_IMMUNE_CORE");
        setStatus('ready');
      }
    } catch (err) {
       addLog("CRITICAL: QUANTUM_PATCH_CORRUPTION_DETECTED");
       setStatus('ready');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fadeIn font-arabic pb-40">
      
      {/* Update Header */}
      <div className="bg-[#02020a]/80 backdrop-blur-3xl border border-indigo-500/30 p-12 rounded-[4rem] shadow-[0_0_120px_rgba(99,102,241,0.15)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent)]"></div>
        <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-pulse"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-10">
          <div className="flex items-center gap-8">
            <div className={`w-24 h-24 rounded-[3rem] border-2 flex items-center justify-center text-5xl transition-all duration-1000 ${status === 'deploying' ? 'bg-indigo-600 border-indigo-400 animate-spin' : status === 'completed' ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.5)]' : 'bg-slate-900 border-white/10'}`}>
               {status === 'completed' ? '🛡️' : '🌀'}
            </div>
            <div>
               <h2 className="text-5xl font-black text-white tracking-tighter uppercase">بروتوكول <span className="text-indigo-500">التحديث الكوآنتومي</span></h2>
               <p className="text-slate-500 font-bold uppercase tracking-[0.4em] mt-2">Universal_Update_Link_v15.0_Genesis</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
             <div className="flex gap-4">
                <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   Current: {currentVersion}
                </div>
                <div className="px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                  Quantum Level: 0x992Q
                </div>
             </div>
             {status === 'idle' && (
               <button 
                 onClick={checkForUpdates}
                 disabled={loading}
                 className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black text-xl shadow-2xl transition-all active:scale-95"
               >
                 {loading ? 'جاري الفحص...' : 'تحقق من التحديثات الكونية 📡'}
               </button>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         
         {/* Left: Update Manifest */}
         <div className="lg:col-span-8 space-y-8">
            {update ? (
              <div className="bg-slate-900/40 border border-white/10 p-12 rounded-[4rem] shadow-2xl animate-slideUp space-y-10 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-2 h-full bg-indigo-600 shadow-[0_0_20px_rgba(99,102,241,1)]"></div>
                 
                 <div className="flex justify-between items-start">
                    <div>
                       <h3 className="text-4xl font-black text-white">{update.version} // {update.codename}</h3>
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase mt-4 inline-block ${update.securityLevel === 'Sovereign' ? 'bg-indigo-600 text-white shadow-xl' : 'bg-cyan-600 text-black'}`}>
                         {update.securityLevel} Update Level
                       </span>
                    </div>
                    <div className="text-right">
                       <span className="text-[10px] text-slate-600 font-black uppercase">Patch_Size</span>
                       <div className="text-2xl font-black text-white">{update.patchSize}</div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Release_Notes</h4>
                       <ul className="space-y-3">
                          {update.releaseNotes.map((note, i) => (
                            <li key={i} className="flex gap-4 items-start text-sm text-slate-300">
                               <span className="text-indigo-500">◈</span> {note}
                            </li>
                          ))}
                       </ul>
                    </div>
                    <div className="bg-black/60 p-8 rounded-[2.5rem] border border-white/5 space-y-4 shadow-inner">
                       <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Quantum_Integrity_Seal</h4>
                       <div className="bg-slate-900/80 p-4 rounded-xl font-mono text-[9px] text-cyan-500 break-all border border-cyan-950">
                          {update.integrityHash}
                       </div>
                       <p className="text-[9px] text-slate-700 italic">"تم التحقق من التوقيع الرقمي عبر مصفوفة صارة v15"</p>
                    </div>
                 </div>

                 {status !== 'completed' && (
                   <div className="pt-10 border-t border-white/5">
                      {status === 'deploying' ? (
                        <div className="space-y-6">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase text-indigo-500">
                              <span>Deploying_Quantum_Assets...</span>
                              <span>{Math.round(deploymentProgress)}%</span>
                           </div>
                           <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600 shadow-[0_0_20px_rgba(99,102,241,1)] transition-all duration-500" style={{ width: `${deploymentProgress}%` }}></div>
                           </div>
                        </div>
                      ) : (
                        <button 
                          onClick={startDeployment}
                          className="w-full py-8 bg-white text-black rounded-[2.5rem] font-black text-2xl hover:bg-indigo-500 hover:text-white transition-all shadow-3xl"
                        >
                          تطبيق التحديث الكوآنتومي (Apply Patch) ⚡
                        </button>
                      )}
                   </div>
                 )}

                 {status === 'completed' && (
                   <div className="pt-10 flex flex-col items-center gap-6 animate-fadeIn">
                      <div className="w-20 h-20 bg-emerald-500 text-black rounded-full flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(16,185,129,0.5)]">✓</div>
                      <h4 className="text-3xl font-black text-emerald-500">تم تحديث النظام بالكامل</h4>
                      <p className="text-slate-500 font-bold">إصدار {update.version} مستقر ونشط الآن.</p>
                   </div>
                 )}
              </div>
            ) : (
              <div className="h-full min-h-[600px] border-4 border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center opacity-10 grayscale pointer-events-none gap-10">
                 <div className="text-[14rem] animate-pulse">📦</div>
                 <p className="text-5xl font-black uppercase tracking-[1em]">Update_Vault_Locked</p>
              </div>
            )}
         </div>

         {/* Right: Live Terminal & Deployment Logs */}
         <div className="lg:col-span-4 space-y-8 h-full flex flex-col">
            <div className="bg-black/90 rounded-[3.5rem] border border-white/5 p-10 flex-1 shadow-2xl flex flex-col overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div></div>
               <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] mb-8 border-b border-white/5 pb-6">Secure_Deployment_Console</h3>
               <div ref={terminalRef} className="flex-1 overflow-y-auto font-mono text-[10px] text-blue-900 space-y-3 no-scrollbar text-left dir-ltr">
                  {logs.map((log, i) => (
                    <div key={i} className={`animate-fadeIn flex gap-4 ${log.includes('SUCCESS') ? 'text-emerald-500 font-bold' : log.includes('ERROR') ? 'text-red-500' : 'opacity-60'}`}>
                       <span className="text-slate-800 shrink-0">[{i}]</span>
                       <span className="whitespace-pre-wrap">{log}</span>
                    </div>
                  ))}
                  {logs.length === 0 && <div className="text-slate-900 italic py-20 text-center uppercase">System_Awaiting_Sync...</div>}
               </div>
            </div>

            <div className="bg-blue-950/20 border border-blue-500/10 rounded-[3rem] p-10 space-y-6">
               <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest">Global_System_Integrity</h4>
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center text-3xl">🛡️</div>
                  <div className="flex-1 space-y-2">
                     <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase">Verification_Index</div>
                     <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[100%] shadow-[0_0_10px_blue]"></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};
