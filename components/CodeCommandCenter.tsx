
import React, { useState, useRef, useEffect } from 'react';
import { executeHyperScript } from '../services/geminiService';
import { HyperScriptResult, Language } from '../types';

export const CodeCommandCenter: React.FC<{ language: Language }> = ({ language }) => {
  const [code, setCode] = useState('// Sarah Hyper-Script v1.0\n// Command: Auto_Optimize_Network\n\nfunc main() {\n  connect(NEURAL_CORE);\n  await sync_protocols();\n  return "SYSTEM_OPTIMIZED";\n}');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HyperScriptResult | null>(null);
  const [mode, setMode] = useState<'manual' | 'auto_genesis'>('manual');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [metrics, setMetrics] = useState({ cpu: 12, ram: 4096, ops: 0 });
  const terminalRef = useRef<HTMLDivElement>(null);

  // Simulated Vitals
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.min(100, Math.max(5, prev.cpu + (Math.random() * 10 - 5))),
        ram: Math.min(64000, Math.max(4000, prev.ram + (Math.random() * 500 - 250))),
        ops: loading ? Math.floor(Math.random() * 5000000) + 1000000 : 0
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [terminalLogs]);

  const handleExecute = async () => {
    if (!code.trim() || loading) return;
    setLoading(true);
    setTerminalLogs([]);
    setResult(null);

    // Initial Logs
    const bootLogs = [
      `[KERNEL] Initializing Hyper-Engine...`,
      `[MEM] Allocating ${metrics.ram}MB Direct Memory...`,
      `[LINK] Connecting to Sovereign Core...`,
      `[MODE] ${mode === 'auto_genesis' ? 'GENESIS_WRITER_ACTIVE' : 'MANUAL_EXECUTION'}`
    ];
    
    for (const log of bootLogs) {
      setTerminalLogs(prev => [...prev, log]);
      await new Promise(r => setTimeout(r, 200));
    }

    try {
      const data = await executeHyperScript(code, mode, language);
      setResult(data);
      
      // Stream result logs
      if (data.generatedCode) setCode(data.generatedCode);
      
      data.logs.forEach((log, i) => {
        setTimeout(() => {
          setTerminalLogs(prev => [...prev, `[OUT] ${log}`]);
        }, i * 100);
      });

    } catch (err) {
      setTerminalLogs(prev => [...prev, `❌ [CRITICAL] ENGINE_HALT: UNKNOWN_ERROR`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-full mx-auto bg-[#030303] text-white p-0 overflow-hidden min-h-screen font-mono text-left dir-ltr">
      
      {/* Hyper-Header */}
      <header className="px-8 py-6 bg-[#0a0a0a] border-b border-green-500/20 flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse"></div>
        
        <div className="flex items-center gap-8 relative z-10">
           <div className="flex flex-col">
              <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-green-500 flex items-center gap-3">
                <span className="text-4xl animate-pulse">⚡</span> HYPER_TERMINAL
              </h2>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 pl-12">Source_Command_Engine_v1.0</span>
           </div>
           
           <div className="flex gap-4">
              <div className="px-4 py-2 bg-green-900/10 border border-green-500/20 rounded-lg flex flex-col items-center min-w-[80px]">
                 <span className="text-[8px] text-green-700 font-black uppercase">CPU_LOAD</span>
                 <span className="text-lg font-black text-green-400">{metrics.cpu.toFixed(0)}%</span>
              </div>
              <div className="px-4 py-2 bg-green-900/10 border border-green-500/20 rounded-lg flex flex-col items-center min-w-[80px]">
                 <span className="text-[8px] text-green-700 font-black uppercase">MEM_ALLOC</span>
                 <span className="text-lg font-black text-green-400">{(metrics.ram / 1024).toFixed(1)}GB</span>
              </div>
              {loading && (
                <div className="px-4 py-2 bg-green-500 text-black border border-green-400 rounded-lg flex flex-col items-center min-w-[100px] shadow-[0_0_20px_#22c55e]">
                   <span className="text-[8px] font-black uppercase">N/OPS</span>
                   <span className="text-lg font-black">{metrics.ops.toLocaleString()}</span>
                </div>
              )}
           </div>
        </div>

        <div className="flex gap-4 relative z-10">
           <div className="flex bg-[#111] p-1 rounded-xl border border-white/10">
              <button 
                onClick={() => setMode('manual')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${mode === 'manual' ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}
              >
                Manual_Code
              </button>
              <button 
                onClick={() => setMode('auto_genesis')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${mode === 'auto_genesis' ? 'bg-green-600 text-black shadow-[0_0_15px_#16a34a]' : 'text-slate-500 hover:text-white'}`}
              >
                Auto_Genesis (AI)
              </button>
           </div>
           <button 
             onClick={handleExecute}
             disabled={loading}
             className="px-10 py-3 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-green-400 hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:scale-100"
           >
             {loading ? 'EXECUTING...' : mode === 'auto_genesis' ? 'WRITE & RUN 🚀' : 'RUN_SOURCE ▶'}
           </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Source Editor */}
        <div className="flex-1 flex flex-col bg-[#050505] relative group">
           <div className="flex-1 flex relative">
              {/* Line Numbers */}
              <div className="w-12 bg-[#080808] border-r border-white/5 flex flex-col items-end pr-3 py-6 text-[10px] text-slate-700 font-mono select-none">
                 {[...Array(50)].map((_, i) => <div key={i} className="leading-relaxed">{i + 1}</div>)}
              </div>
              
              <textarea 
                 value={code}
                 onChange={(e) => setCode(e.target.value)}
                 className={`flex-1 bg-transparent p-6 font-mono text-sm outline-none resize-none leading-relaxed border-none focus:ring-0 no-scrollbar ${mode === 'auto_genesis' ? 'text-green-300 placeholder-green-900/50' : 'text-blue-300 placeholder-slate-700'}`}
                 spellCheck={false}
                 placeholder={mode === 'auto_genesis' ? "// Describe your command here...\n// Example: Create a secure firewall for port 8080 and log all traffic." : "// Write sovereign source code here..."}
              />
           </div>
           
           <div className="h-8 bg-[#0a0a0a] border-t border-white/5 flex items-center px-4 justify-between text-[9px] text-slate-500 font-black uppercase tracking-widest">
              <span>Ln {code.split('\n').length}, Col {code.length}</span>
              <span>UTF-8 // UNIX // SARAH_LANG</span>
           </div>
        </div>

        {/* Execution Terminal */}
        <div className="lg:w-[500px] bg-[#020202] border-l border-white/10 flex flex-col relative shadow-2xl">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
           
           <div className="p-4 border-b border-white/10 bg-[#080808] flex justify-between items-center">
              <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em]">Live_Output_Stream</span>
              <div className="flex gap-2">
                 <div className="w-2 h-2 rounded-full bg-red-500 opacity-50"></div>
                 <div className="w-2 h-2 rounded-full bg-yellow-500 opacity-50"></div>
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
           </div>

           <div ref={terminalRef} className="flex-1 overflow-y-auto p-6 font-mono text-xs space-y-2 no-scrollbar relative z-10">
              {terminalLogs.map((log, i) => (
                <div key={i} className={`animate-fadeIn break-all ${log.includes('[CRITICAL]') ? 'text-red-500 font-bold' : log.includes('[KERNEL]') ? 'text-blue-500' : 'text-green-400 opacity-80'}`}>
                   <span className="opacity-30 mr-2">[{new Date().toLocaleTimeString()}]</span>
                   {log}
                </div>
              ))}
              {loading && (
                 <div className="text-green-500 animate-pulse">_</div>
              )}
           </div>

           {result && (
             <div className="p-6 bg-[#0a0a0a] border-t border-white/10 space-y-4 relative z-10">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black text-slate-500 uppercase">Execution_Time</span>
                   <span className="text-sm font-black text-white">{result.executionTime}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black text-slate-500 uppercase">Status</span>
                   <span className={`text-xs font-black uppercase px-2 py-1 rounded ${result.status === 'success' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>{result.status}</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-green-500 animate-scanline"></div>
                </div>
             </div>
           )}
        </div>

      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-fadeIn { animation: fadeIn 0.1s ease-out forwards; }
        @keyframes scanline { 0% { width: 0%; } 100% { width: 100%; } }
        .animate-scanline { animation: scanline 1s ease-out forwards; }
      `}</style>
    </div>
  );
};
