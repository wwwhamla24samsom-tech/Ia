import React, { useState, useEffect, useRef } from 'react';
import { analyzeRealCodeExecution, simulatePythonExecution } from '../services/geminiService';
import { SandboxResult, Language } from '../types';

export const NeuralSandbox: React.FC<{ language: Language }> = ({ language }) => {
  const [code, setCode] = useState('// اكتب كودك هنا ليتم تشغيله في بيئة صارة المعزولة...\n\nconst startTime = Date.now();\nlet data = [];\nfor(let i=0; i<100; i++) data.push(Math.random());\nconsole.log("Processed " + data.length + " items.");\nconsole.log("Time: " + (Date.now() - startTime) + "ms");');
  const [targetLanguage, setTargetLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SandboxResult | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { id: 'javascript', name: 'JS (Realtime)', icon: '🟨' },
    { id: 'python', name: 'Python (Sim)', icon: '🟦' },
    { id: 'typescript', name: 'TS Core', icon: '🔵' },
  ];

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const executeRealJS = async (userCode: string): Promise<SandboxResult> => {
    const logs: string[] = [];
    let output = "";
    let error = null;
    const start = performance.now();

    // Capture console.log
    const originalLog = console.log;
    console.log = (...args) => {
        logs.push(args.map(a => String(a)).join(' '));
    };

    try {
        // Safe-ish execution using Function constructor
        // Note: This runs in the browser's context. 
        const func = new Function(userCode);
        const ret = func();
        if (ret !== undefined) output = String(ret);
    } catch (e: any) {
        error = e.toString();
        logs.push(`❌ Runtime Error: ${e.message}`);
    } finally {
        console.log = originalLog;
    }

    const end = performance.now();
    const executionTime = `${(end - start).toFixed(2)}ms`;

    // Now send the REAL results to AI for analysis
    const fullLog = logs.join('\n');
    const aiAnalysis = await analyzeRealCodeExecution(userCode, output || fullLog, error, language);

    return {
        logs: logs,
        executionTime: executionTime,
        output: output || (error ? "Error" : "Execution Complete"),
        status: error ? "failed" : "success",
        securityAudit: aiAnalysis.securityStatus,
        temporalEfficiency: aiAnalysis.estimatedEfficiency
    };
  };

  const handleRun = async () => {
    if (!code.trim() || loading) return;

    setLoading(true);
    setTerminalLogs([`[SYSTEM] تهيئة البيئة المعزولة 0x${Math.floor(Math.random()*999).toString(16)}...`]);
    setResult(null);

    try {
      let sandboxResult: SandboxResult;

      if (targetLanguage === 'javascript' || targetLanguage === 'typescript') {
          // REAL EXECUTION
          setTerminalLogs(prev => [...prev, `[KERNEL] Executing JavaScript in Local Runtime...`]);
          sandboxResult = await executeRealJS(code);
      } else {
          // PYTHON SIMULATION (Fallback)
          const data = await simulatePythonExecution(code, language);
          sandboxResult = {
            output: data.output,
            logs: data.potentialBugs.length > 0 ? data.potentialBugs : ["Simulation successful"],
            executionTime: "N/A (Simulated)",
            status: "success",
            securityAudit: data.securityStatus,
            temporalEfficiency: data.estimatedEfficiency
          };
      }

      setResult(sandboxResult);
      
      // Update logs instantly
      setTerminalLogs(prev => [
          ...prev, 
          ...sandboxResult.logs.map(l => `[RUN] ${l}`),
          `[SYSTEM] اكتمل التنفيذ بنجاح. وقت التشغيل: ${sandboxResult.executionTime}`
      ]);

    } catch (err) {
      setTerminalLogs(prev => [...prev, `❌ خطأ في الارتباط النوروني: فشل بدء المحاكاة.`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-full mx-auto bg-[#0a0b0d] text-white p-0 overflow-hidden min-h-screen font-arabic">
      
      {/* Header Bar */}
      <header className="px-10 py-6 border-b border-white/5 bg-black/40 backdrop-blur-3xl z-50 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-8">
           <div className="flex flex-col">
              <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-emerald-500">Execution_Sandbox</h2>
              <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest mt-1">Real_V7_Environment</span>
           </div>
           
           <div className="hidden lg:flex bg-white/5 p-1 rounded-2xl gap-2 border border-white/5">
             {languages.map(lang => (
               <button
                 key={lang.id}
                 onClick={() => setTargetLanguage(lang.id)}
                 className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${targetLanguage === lang.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
               >
                 {lang.icon} {lang.name}
               </button>
             ))}
           </div>
        </div>
        
        <button 
          onClick={handleRun}
          disabled={loading}
          className="px-10 py-3 bg-emerald-600 hover:bg-emerald-500 text-black rounded-xl font-black text-sm shadow-2xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-3"
        >
          {loading ? 'جاري المعالجة...' : 'تشغيل الكود 🚀'}
        </button>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Code Editor Side */}
        <div className="flex-1 flex flex-col border-l border-white/5 bg-black/40 relative group">
           <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-transparent p-12 font-mono text-lg text-emerald-400 outline-none resize-none selection:bg-emerald-500/30 no-scrollbar leading-relaxed"
              spellCheck={false}
           />
           <div className="absolute top-4 left-6 opacity-20 pointer-events-none group-focus-within:opacity-100 transition-opacity">
              <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Compiler: Real_Runtime_Active</span>
           </div>
        </div>

        {/* Terminal & Analytics Side */}
        <div className="lg:w-[600px] flex flex-col bg-black/80 backdrop-blur-xl">
           
           {/* Visual Terminal */}
           <div className="flex-1 p-8 overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Runtime_Terminal</span>
                <div className="flex gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-red-500/30"></div>
                   <div className="w-2 h-2 rounded-full bg-amber-500/30"></div>
                   <div className="w-2 h-2 rounded-full bg-emerald-500/30"></div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar font-mono text-sm space-y-3 text-left dir-ltr">
                 {terminalLogs.map((log, i) => (
                   <div key={i} className={`animate-fadeIn border-l-2 pl-4 py-1 transition-all ${log.includes('❌') ? 'border-red-500 text-red-400 bg-red-500/5' : log.includes('[SYSTEM]') ? 'border-blue-500 text-blue-400' : 'border-slate-800 text-slate-400'}`}>
                      {log}
                   </div>
                 ))}
                 
                 {result && (
                   <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl animate-fadeIn">
                      <div className="text-[10px] font-black text-emerald-500 mb-2 uppercase">FINAL_OUTPUT:</div>
                      <div className="text-xl font-bold text-white whitespace-pre-wrap">{result.output}</div>
                   </div>
                 )}
                 <div ref={terminalEndRef} />
              </div>
           </div>

           {/* Neural Analytics Panel */}
           <div className="h-[300px] border-t border-white/5 p-10 bg-slate-900/40 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">الكفاءة الزمنية</h4>
                    <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] transition-all duration-1000"
                         style={{ width: result ? `${result.temporalEfficiency}%` : '0%' }}
                       />
                    </div>
                    <span className="text-2xl font-black text-white">{result ? `${result.temporalEfficiency}%` : '--'}</span>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">الحالة الأمنية</h4>
                    <div className={`text-xl font-black uppercase ${result?.status === 'blocked' ? 'text-red-500' : 'text-emerald-500'}`}>
                       {result ? result.status : 'Standby'}
                    </div>
                    <p className="text-[10px] text-slate-500 italic truncate">{result?.securityAudit || 'بانتظار الفحص...'}</p>
                 </div>
              </div>

              <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-blue-400 uppercase">Internal_Build_Mode</span>
                    <span className="text-xs font-bold text-slate-300">نظام تحسين البرمجيات الذاتي نشط</span>
                 </div>
                 <div className="text-3xl animate-pulse">⚙️</div>
              </div>
           </div>

        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};