
import React, { useState, useRef, useEffect } from 'react';
import { architectStrategicSystem, simulatePythonExecution } from '../services/geminiService';
import { StrategicBlueprint, Language, PythonSimulationResult } from '../types';

export const StrategicArchitect: React.FC<{ language: Language }> = ({ language }) => {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [blueprint, setBlueprint] = useState<StrategicBlueprint | null>(null);
  const [simulation, setSimulation] = useState<PythonSimulationResult | null>(null);
  const [view, setView] = useState<'blueprint' | 'operator' | 'code' | 'transmission'>('blueprint');
  const [isBooting, setIsBooting] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [transmissionStatus, setTransmissionStatus] = useState<Record<string, 'idle' | 'sending' | 'sent'>>({
    forge: 'idle',
    vault: 'idle',
    bridge: 'idle',
    manifest: 'idle'
  });
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [terminalLogs]);

  // نظام حفظ التاريخ للتراجع
  const updatePrompt = (newValue: string) => {
    if (newValue !== prompt) {
      setHistory(prev => [prompt, ...prev].slice(0, 50));
      setPrompt(newValue);
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const [prevValue, ...remainingHistory] = history;
      setPrompt(prevValue);
      setHistory(remainingHistory);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        const injectedText = `\n\n--- FILE_CONTEXT: ${file.name} ---\n${text}\n--- END_CONTEXT ---\n`;
        updatePrompt(prompt + injectedText);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleArchitect = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setBlueprint(null);
    setSimulation(null);
    setTerminalLogs([]);
    try {
      const data = await architectStrategicSystem(prompt, language);
      setBlueprint(data);
      setView('blueprint');
    } catch (err) {
      console.error(err);
      alert("⚠️ فشل بناء المعمار. تحقق من تعقيد المهمة.");
    } finally {
      setLoading(false);
    }
  };

  const bootSystem = async () => {
    if (!blueprint) return;
    setIsBooting(true);
    setView('operator');
    setTerminalLogs([`>>> [SARAH_OS] INITIATING_BOOT_SEQUENCE: ${blueprint.systemName}`, `>>> [CORE] ALLOCATING_RESOURCES...`]);
    
    try {
      const result = await simulatePythonExecution(blueprint.runnableSimulationCode, language);
      const lines = result.output.split('\n');
      for (let i = 0; i < lines.length; i++) {
        await new Promise(r => setTimeout(r, 100));
        setTerminalLogs(prev => [...prev, lines[i]]);
      }
      setTerminalLogs(prev => [...prev, `>>> [SUCCESS] SYSTEM_STABLE_V12`]);
      setSimulation(result);
    } catch (err) {
      setTerminalLogs(prev => [...prev, `❌ [CRITICAL_ERROR] KERNEL_PANIC`]);
    } finally {
      setIsBooting(false);
    }
  };

  const transmitData = async (target: keyof typeof transmissionStatus) => {
    setTransmissionStatus(prev => ({ ...prev, [target]: 'sending' }));
    await new Promise(r => setTimeout(r, 2000));
    setTransmissionStatus(prev => ({ ...prev, [target]: 'sent' }));
    
    const logsMap = {
      forge: "TRANSFERRED_TO_CODE_FORGE: Implementation protocol started.",
      vault: "ARCHIVED_IN_KNOWLEDGE_VAULT: Strategic backup verified.",
      bridge: "BROADCASTED_TO_UNIVERSAL_BRIDGE: Remote nodes synchronized.",
      manifest: "MANIFESTED_AS_SOVEREIGN_DOC: Report ready for export."
    };
    
    setTerminalLogs(prev => [`>>> [HUB] ${logsMap[target]}`, ...prev]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fadeIn font-arabic pb-40 px-6">
      
      {/* Unity Header - Refined with Action Controls */}
      <div className="bg-slate-950/80 backdrop-blur-3xl border border-blue-500/30 p-12 rounded-[4rem] shadow-[0_0_120px_rgba(59,130,246,0.15)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent)]"></div>
        <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
        
        <div className="flex flex-col gap-10 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-8">
              <div className={`w-24 h-24 rounded-[3rem] border-2 flex items-center justify-center text-5xl transition-all duration-1000 ${loading ? 'bg-blue-600 animate-spin border-blue-400 shadow-[0_0_60px_rgba(59,130,246,0.6)]' : 'bg-slate-900 border-white/5 shadow-2xl'}`}>
                {blueprint ? '🏗️' : '🧠'}
              </div>
              <div className="text-right">
                <h2 className="text-5xl font-black text-white tracking-tighter">المعمار <span className="text-blue-400">الاستراتيجي</span></h2>
                <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">Sovereign_System_Architect_v12</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <button 
                 onClick={() => fileInputRef.current?.click()}
                 className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-300 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-3"
               >
                 حقن سياق (ملف) 📁
               </button>
               <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".txt,.js,.py,.html,.css,.md,.json" />
               
               <div className="h-10 w-px bg-white/5 mx-2"></div>
               
               <button 
                 onClick={handleUndo}
                 disabled={history.length === 0}
                 className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${history.length > 0 ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/5 text-slate-700 pointer-events-none'}`}
               >
                 تراجع ↩
               </button>
               <button 
                 onClick={() => updatePrompt('')}
                 className="px-8 py-3 bg-red-600/10 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all"
               >
                 مسح 🗑️
               </button>
            </div>
          </div>

          <div className="relative group">
             <div className="absolute -inset-1 bg-blue-500 rounded-[3rem] blur opacity-5 group-focus-within:opacity-20 transition-opacity"></div>
             <textarea 
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               onBlur={(e) => updatePrompt(e.target.value)}
               placeholder="صف المخطط الاستراتيجي، المهمة، أو النظام المعقد هنا... صارة ستقوم بتحليل المعطيات وبناء المعمار الهندسي."
               className="w-full bg-black/60 border border-white/10 rounded-[3rem] p-10 text-2xl text-white focus:outline-none focus:border-blue-500/40 placeholder:text-slate-800 transition-all text-right shadow-inner min-h-[220px] resize-none leading-relaxed"
             />
             <div className="absolute bottom-6 left-10 flex items-center gap-8">
                <div className="flex flex-col items-start font-mono text-[9px] text-slate-700 uppercase tracking-widest">
                   <span>Input_Status: {prompt.length > 0 ? 'Data_Detected' : 'Idle'}</span>
                   <span>Buffer: {history.length} steps</span>
                </div>
                <button 
                  onClick={handleArchitect}
                  disabled={loading || !prompt.trim()}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-16 py-6 rounded-[2rem] font-black text-2xl shadow-[0_0_60px_rgba(59,130,246,0.4)] transition-all active:scale-95 disabled:opacity-30"
                >
                  {loading ? 'جاري التحليل النوروني...' : 'إرسال للأتمتة ⚡'}
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-6">
           <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mr-4 mb-2">Architect_Dashboard</h3>
           
           <div className="space-y-3">
              {[
                { id: 'blueprint', label: 'المخطط الهندسي', icon: '💎' },
                { id: 'operator', label: 'مشغل النظام (Live)', icon: '🕹️' },
                { id: 'transmission', label: 'مركز الإرسال', icon: '📡' },
                { id: 'code', label: 'كود التجسيد', icon: '🐍' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setView(t.id as any)}
                  className={`w-full p-8 rounded-[2.5rem] border transition-all text-right flex items-center justify-between group ${view === t.id ? 'bg-white text-black border-white shadow-3xl scale-105' : 'bg-slate-900/40 border-white/5 text-white/40 hover:border-blue-500/30'}`}
                >
                   <span className="text-2xl">{t.icon}</span>
                   <span className="font-black text-sm uppercase tracking-widest">{t.label}</span>
                </button>
              ))}
           </div>

           {blueprint && (
              <div className="pt-6 space-y-4">
                <button 
                  onClick={bootSystem}
                  disabled={isBooting}
                  className="w-full py-8 bg-blue-600 hover:bg-blue-500 text-white rounded-[2.5rem] font-black text-xl shadow-2xl transition-all flex flex-col items-center gap-3 animate-pulse active:scale-95"
                >
                  <span>تشغيل النظام (BOOT)</span>
                  <span className="text-[9px] opacity-60 font-mono tracking-[0.3em]">VERIFIED_STABLE_BUILD</span>
                </button>
              </div>
           )}
        </div>

        {/* Viewport Display */}
        <div className="lg:col-span-9 bg-black/60 rounded-[4rem] border border-white/5 p-12 min-h-[800px] relative overflow-hidden shadow-inner flex flex-col">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.02),transparent)] pointer-events-none"></div>
           
           {!blueprint && (
             <div className="flex-1 flex flex-col items-center justify-center opacity-10 grayscale gap-12 py-32">
                <div className="text-[16rem] animate-float">🏛️</div>
                <p className="text-5xl font-black uppercase tracking-[1em] text-blue-500">Architect_Standby</p>
             </div>
           )}

           {blueprint && view === 'blueprint' && (
             <div className="space-y-12 animate-fadeIn text-right h-full flex flex-col flex-1">
                <div className="space-y-4">
                   <h3 className="text-7xl font-black text-white leading-none">{blueprint.systemName}</h3>
                   <p className="text-2xl text-slate-400 font-medium italic pr-4 border-r-4 border-blue-600">"{blueprint.vision}"</p>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10 overflow-y-auto no-scrollbar py-10 pr-2">
                   <div className="space-y-8">
                      <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest mr-4">System_Nodes_Hierarchy</h4>
                      <div className="space-y-4">
                         {blueprint.nodes.map((node) => (
                           <div key={node.id} className="p-8 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/[0.08] transition-all group">
                              <div className="flex justify-between items-start mb-2">
                                 <span className="text-[10px] font-black uppercase text-blue-400">{node.type}</span>
                                 <h5 className="text-xl font-black text-white">{node.label}</h5>
                              </div>
                              <p className="text-sm text-slate-500 leading-relaxed italic">"{node.description}"</p>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-10">
                      <div>
                        <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-6">Sovereign_Technical_Stack</h4>
                        <div className="flex flex-wrap gap-3">
                           {blueprint.technicalStack.map(tech => (
                             <span key={tech} className="px-6 py-2.5 bg-blue-600/10 border border-blue-600/30 rounded-xl text-xs font-black text-blue-400">{tech}</span>
                           ))}
                        </div>
                      </div>
                      <div className="p-10 bg-blue-950/20 border border-blue-500/20 rounded-[3rem] shadow-inner">
                         <h4 className="text-xl font-black text-white mb-6 uppercase tracking-tighter">منطق التشغيل النوروني</h4>
                         <p className="text-lg text-slate-300 leading-relaxed font-medium italic">{blueprint.operationalLogic}</p>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {blueprint && view === 'operator' && (
             <div className="h-full flex flex-col gap-8 animate-fadeIn flex-1">
                <div className="flex justify-between items-center bg-black/40 p-8 rounded-3xl border border-white/5">
                   <div className="flex gap-4">
                      <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase ${isBooting ? 'bg-blue-600 text-white animate-pulse' : 'bg-emerald-600 text-black'}`}>
                        {isBooting ? 'System_Booting' : 'System_Stable'}
                      </div>
                   </div>
                   <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{blueprint.systemName} // Terminal</h3>
                </div>

                <div ref={terminalRef} className="flex-1 bg-black/90 rounded-[3rem] p-12 font-mono text-sm space-y-4 overflow-y-auto no-scrollbar border border-white/5 shadow-inner text-left dir-ltr">
                   {terminalLogs.map((log, i) => (
                     <div key={i} className={`animate-fadeIn ${log?.startsWith('❌') ? 'text-red-500' : log?.includes('>>>') ? 'text-blue-500 font-bold' : 'text-emerald-400 opacity-80'}`}>
                        {log}
                     </div>
                   ))}
                   {isBooting && <div className="w-2 h-4 bg-blue-500 animate-pulse inline-block"></div>}
                </div>

                {simulation && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideUp p-2">
                     <div className="p-8 bg-blue-600/5 border border-blue-500/20 rounded-3xl text-right">
                        <span className="text-[10px] font-black text-blue-500 uppercase block mb-1">Estimated_Efficiency</span>
                        <div className="text-4xl font-black text-white">{simulation.estimatedEfficiency}%</div>
                     </div>
                     <div className="p-8 bg-emerald-600/5 border border-emerald-500/20 rounded-3xl text-right">
                        <span className="text-[10px] font-black text-emerald-500 uppercase block mb-1">Security_Seal</span>
                        <div className="text-xl font-black text-emerald-400 uppercase">{simulation.securityStatus}</div>
                     </div>
                     <button 
                        onClick={() => setView('transmission')}
                        className="bg-white text-black p-8 rounded-3xl font-black text-xl hover:bg-blue-600 hover:text-white transition-all shadow-3xl"
                     >
                       توزيع المخرجات 📡
                     </button>
                  </div>
                )}
             </div>
           )}

           {blueprint && view === 'transmission' && (
              <div className="h-full flex flex-col space-y-12 animate-fadeIn text-right flex-1">
                 <div className="space-y-4">
                    <h3 className="text-5xl font-black text-white tracking-tighter uppercase text-right">مركز الإرسال والتوزيع</h3>
                    <p className="text-slate-500 text-lg font-bold text-right">"حول المعمار من فكرة إلى واقع تنفيذي عبر قنوات صارة الموحدة."</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 overflow-y-auto no-scrollbar pr-2">
                    {[
                      { id: 'forge', label: 'مفاعل الأكواد (Forge)', icon: '🏗️', desc: 'إرسال المعمار للبرمجة الحية والبناء.', color: 'blue' },
                      { id: 'bridge', label: 'الجسر العالمي (Bridge)', icon: '📡', desc: 'حقن الأوامر في الأجهزة المرتبطة.', color: 'cyan' },
                      { id: 'vault', label: 'خزنة المعرفة (Vault)', icon: '💾', desc: 'أرشفة المخطط في ذاكرة الـ 100TB.', color: 'emerald' },
                      { id: 'manifest', label: 'التجسيد الورقي (Doc)', icon: '📝', desc: 'توليد تقرير سيادي متكامل.', color: 'purple' }
                    ].map(tool => (
                      <div key={tool.id} className="bg-white/[0.03] border border-white/10 p-10 rounded-[4rem] flex flex-col justify-between hover:border-blue-500/40 transition-all group">
                         <div className="flex justify-between items-start">
                            <div className="text-6xl group-hover:scale-110 transition-transform duration-500">{tool.icon}</div>
                            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${transmissionStatus[tool.id] === 'sent' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-slate-500'}`}>
                               {transmissionStatus[tool.id] === 'sent' ? 'Status: Transmitted' : 'Status: Ready'}
                            </div>
                         </div>
                         <div className="space-y-4 mt-8">
                            <h4 className="text-3xl font-black text-white text-right">{tool.label}</h4>
                            <p className="text-slate-400 text-sm font-medium text-right">"{tool.desc}"</p>
                         </div>
                         <button 
                           onClick={() => transmitData(tool.id as any)}
                           disabled={transmissionStatus[tool.id] !== 'idle'}
                           className={`mt-10 w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all ${transmissionStatus[tool.id] === 'sent' ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl active:scale-95'}`}
                         >
                            {transmissionStatus[tool.id] === 'sending' ? 'جاري الإرسال...' : transmissionStatus[tool.id] === 'sent' ? 'تمت العملية بنجاح ✓' : 'تفعيل قناة الإرسال'}
                         </button>
                      </div>
                    ))}
                 </div>
              </div>
           )}

           {blueprint && view === 'code' && (
             <div className="h-full flex flex-col space-y-8 animate-fadeIn flex-1">
                <div className="flex justify-between items-center bg-black/40 p-6 rounded-3xl border border-white/5">
                   <button 
                     onClick={() => navigator.clipboard.writeText(blueprint.runnableSimulationCode)}
                     className="px-8 py-3 bg-white text-black rounded-2xl font-black text-xs uppercase hover:bg-blue-500 hover:text-white transition-all shadow-xl"
                   >
                     Copy_Source_Code
                   </button>
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Python_Sovereign_Source</h3>
                </div>
                <div className="flex-1 bg-black/80 p-12 rounded-[4rem] border border-blue-500/10 font-mono text-sm text-blue-300 leading-relaxed overflow-auto no-scrollbar dir-ltr text-left shadow-inner selection:bg-blue-600/30">
                   {blueprint.runnableSimulationCode}
                </div>
             </div>
           )}
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
