
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HardHat, ClipboardList, Search, Eye, Zap, Shield, Activity, Cpu, Database, Globe, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Paperclip, X } from 'lucide-react';
import { orchestrateQuadCore } from '../services/geminiService';
import { QuadCoreResult, Language, SearchSource } from '../types';

export const NeuralQuadCore: React.FC<{ language: Language }> = ({ language }) => {
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [memorySize, setMemorySize] = useState(1024); // Initial memory in TB
  const [result, setResult] = useState<QuadCoreResult | null>(null);
  const [activeCore, setActiveCore] = useState<'engineer' | 'planner' | 'fetcher' | 'supervisor' | null>(null);
  const [logs, setLogs] = useState<{ id: string, msg: string, type: 'info' | 'success' | 'warn' }[]>([]);
  const [internalActivity, setInternalActivity] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<{ name: string, type: string, data: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string, type: 'info' | 'success' | 'warn' = 'info') => {
    setLogs(prev => [{ id: Math.random().toString(36).substr(2, 9), msg, type }, ...prev].slice(0, 20));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        // Remove data URL prefix
        const data = base64.split(',')[1];
        setSelectedFile({ name: file.name, type: file.type, data });
        addLog(`File loaded: ${file.name}`, 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Simulate internal background processing
  useEffect(() => {
    const activities = [
      "Optimizing neural pathways...",
      "Syncing with global knowledge base...",
      "Verifying integrity of core modules...",
      "Analyzing latent data patterns...",
      "Refining strategic algorithms...",
      "Scanning for external anomalies...",
      "Updating heuristic models...",
      "Balancing load across quad-cores..."
    ];

    const interval = setInterval(() => {
      if (!isProcessing) {
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        setInternalActivity(prev => [randomActivity, ...prev].slice(0, 5));
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isProcessing]);

  const expandMemory = () => {
    setMemorySize(prev => prev * 2);
    addLog(`Neural Memory expanded to ${memorySize * 2} TB. Latency reduced by 15%.`, 'success');
  };

  const handleOrchestrate = async () => {
    if (!command.trim()) return;
    setIsProcessing(true);
    setResult(null);
    addLog(`Initiating Quad-Core Orchestration for: "${command}"`, 'info');
    
    try {
      // Simulate core activation sequence
      setActiveCore('engineer');
      addLog('Engineer Core: Analyzing technical requirements...', 'info');
      await new Promise(r => setTimeout(r, 300));
      
      setActiveCore('planner');
      addLog('Planner Core: Drafting strategic roadmap...', 'info');
      await new Promise(r => setTimeout(r, 300));
      
      setActiveCore('fetcher');
      addLog('Fetcher Core: Scanning global networks for resources...', 'info');
      
      const data = await orchestrateQuadCore(command, language, selectedFile ? { mimeType: selectedFile.type, data: selectedFile.data } : undefined);
      
      setActiveCore('supervisor');
      addLog('Supervisor Core: Finalizing oversight and activation...', 'info');
      await new Promise(r => setTimeout(r, 300));
      
      setResult(data);
      addLog('Orchestration complete. All cores synchronized.', 'success');
    } catch (err) {
      addLog('Critical failure in Quad-Core synchronization.', 'warn');
    } finally {
      setIsProcessing(false);
      setActiveCore(null);
    }
  };

  const CoreNode = ({ id, title, icon: Icon, status, color, position }: any) => {
    const isActive = activeCore === id;
    const isComplete = result && !isActive;
    
    return (
      <motion.div 
        layout
        className={`absolute w-64 p-6 rounded-[2rem] border backdrop-blur-xl transition-all duration-500 z-20
          ${isActive 
            ? `bg-${color}-600/20 border-${color}-500 shadow-[0_0_60px_rgba(59,130,246,0.4)] scale-110` 
            : isComplete 
              ? `bg-${color}-900/10 border-${color}-500/30 opacity-80`
              : 'bg-black/40 border-white/5 opacity-60'
          }`}
        style={position}
      >
        <div className="flex items-center gap-4 mb-3">
          <div className={`p-3 rounded-xl ${isActive ? `bg-${color}-500 text-white` : `bg-white/5 text-${color}-400`}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">{title}</h3>
            <div className={`text-[9px] font-bold uppercase ${isActive ? `text-${color}-300 animate-pulse` : 'text-slate-500'}`}>
              {isActive ? 'PROCESSING...' : status}
            </div>
          </div>
        </div>
        
        {/* Connecting Line to Center */}
        <div className={`absolute top-1/2 ${position.left ? 'right-0 translate-x-full' : 'left-0 -translate-x-full'} w-24 h-[2px] bg-gradient-to-r from-${color}-500/50 to-transparent -z-10 hidden lg:block`} />
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#000510] text-slate-200 font-arabic p-8 lg:p-12 overflow-hidden relative">
      
      {/* Matrix Background Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#000510]/80 to-[#000510]"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div>
            <h1 className="text-6xl font-black tracking-tighter text-white uppercase leading-none flex items-center gap-4">
              <span className="text-emerald-500">MATRIX</span> QUAD-CORE
            </h1>
            <p className="text-emerald-500/60 font-mono text-[10px] uppercase tracking-[0.4em] mt-2">
              System_Status: <span className="text-emerald-400 animate-pulse">ONLINE</span> // Internal_Processing: ACTIVE
            </p>
          </div>
          
          <div className="flex items-center gap-6 bg-emerald-950/20 p-6 rounded-[2rem] border border-emerald-500/20 backdrop-blur-md">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest">Neural_Memory</span>
              <span className="text-2xl font-black text-white font-mono">{memorySize.toLocaleString()} TB</span>
            </div>
            <button 
              onClick={expandMemory}
              className="p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 group"
            >
              <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </header>

        {/* Central Visualization Area */}
        <div className="relative h-[600px] flex items-center justify-center my-20">
          
          {/* Central Core Hub */}
          <div className="relative w-64 h-64 bg-black/80 rounded-full border-4 border-emerald-500/30 flex items-center justify-center z-30 shadow-[0_0_100px_rgba(16,185,129,0.2)] backdrop-blur-xl">
            <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping opacity-20"></div>
            <div className="absolute inset-4 rounded-full border-2 border-dashed border-emerald-500/40 animate-[spin_10s_linear_infinite]"></div>
            
            <div className="text-center z-40">
              <Cpu className={`w-16 h-16 mx-auto mb-4 ${isProcessing ? 'text-emerald-400 animate-pulse' : 'text-slate-600'}`} />
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Central_Nexus</div>
              {isProcessing && <div className="text-[8px] font-mono text-emerald-300 mt-2 animate-pulse">PROCESSING_DATA_STREAM</div>}
            </div>

            {/* Internal Activity Ring */}
            {!isProcessing && (
              <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 text-center space-y-2">
                <div className="text-[9px] font-black text-emerald-500/40 uppercase tracking-widest mb-2">Background_Tasks</div>
                {internalActivity.map((activity, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1 - i * 0.2, y: 0 }}
                    className="text-[10px] font-mono text-emerald-400/80"
                  >
                    {activity}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Satellite Cores */}
          <CoreNode 
            id="engineer"
            title="Engineer" 
            icon={HardHat} 
            status={result ? 'READY' : 'IDLE'} 
            color="blue" 
            position={{ top: '10%', left: '10%' }} 
          />
          <CoreNode 
            id="planner"
            title="Planner" 
            icon={ClipboardList} 
            status={result ? 'READY' : 'IDLE'} 
            color="purple" 
            position={{ top: '10%', right: '10%' }} 
          />
          <CoreNode 
            id="fetcher"
            title="Fetcher" 
            icon={Search} 
            status={result ? 'READY' : 'IDLE'} 
            color="cyan" 
            position={{ bottom: '10%', right: '10%' }} 
          />
          <CoreNode 
            id="supervisor"
            title="Supervisor" 
            icon={Shield} 
            status={result ? 'READY' : 'IDLE'} 
            color="emerald" 
            position={{ bottom: '10%', left: '10%' }} 
          />

          {/* Energy Beams (Visual only) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-30">
            <line x1="25%" y1="25%" x2="50%" y2="50%" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
            <line x1="75%" y1="25%" x2="50%" y2="50%" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
            <line x1="75%" y1="75%" x2="50%" y2="50%" stroke="#06b6d4" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
            <line x1="25%" y1="75%" x2="50%" y2="50%" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
          </svg>
        </div>

        {/* Command Input */}
        <div className="max-w-3xl mx-auto relative z-50">
          <div className="bg-black/60 border border-emerald-500/30 rounded-full p-2 flex items-center shadow-[0_0_40px_rgba(16,185,129,0.1)] backdrop-blur-xl">
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className={`p-4 rounded-full transition-all ${selectedFile ? 'bg-emerald-500/20 text-emerald-400' : 'text-emerald-500/50 hover:text-emerald-400'}`}
              title="Upload File"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            
            {selectedFile && (
              <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full mr-2">
                <span className="text-[10px] text-emerald-400 truncate max-w-[100px]">{selectedFile.name}</span>
                <button onClick={clearFile} className="text-emerald-500 hover:text-white"><X className="w-3 h-3" /></button>
              </div>
            )}

            <input 
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleOrchestrate()}
              placeholder="Enter system command..."
              className="flex-1 bg-transparent border-none px-4 py-4 text-emerald-100 placeholder-emerald-500/30 font-mono focus:outline-none"
            />
            <button 
              onClick={handleOrchestrate}
              disabled={isProcessing || !command.trim()}
              className="p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-all shadow-lg"
            >
              {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 pb-20"
            >
              <div className="bg-black/40 border border-emerald-500/20 rounded-[2rem] p-8 backdrop-blur-md">
                <h3 className="text-emerald-500 font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" /> Strategic Plan
                </h3>
                <div className="space-y-4 font-mono text-sm text-emerald-100/80">
                  {result.strategicPlan.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="text-emerald-500 font-bold">0{i+1}</span>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-black/40 border border-cyan-500/20 rounded-[2rem] p-8 backdrop-blur-md">
                <h3 className="text-cyan-500 font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Resources
                </h3>
                <div className="space-y-3">
                  {result.gatheredResources.map((res, i) => (
                    <a 
                      key={i}
                      href={res.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-cyan-950/20 border border-cyan-500/10 rounded-xl hover:bg-cyan-900/30 transition-all truncate text-xs font-mono text-cyan-300"
                    >
                      {res.title}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
