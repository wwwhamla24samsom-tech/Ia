
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Shield, Cpu, Globe, Activity, BarChart3, Layers, Terminal, Lock, Unlock, RefreshCw, Send, Brain, Sparkles, Rocket, Fingerprint } from 'lucide-react';
import { Language } from '../types';

export const Generation15: React.FC<{ language: Language }> = ({ language }) => {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [logs, setLogs] = useState<{ id: string, msg: string, type: 'info' | 'success' | 'warn' }[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [progress, setProgress] = useState(0);

  const addLog = (msg: string, type: 'info' | 'success' | 'warn' = 'info') => {
    setLogs(prev => [{ id: Math.random().toString(36).substr(2, 9), msg, type }, ...prev].slice(0, 50));
  };

  const startUpdate = () => {
    setIsUpdating(true);
    setProgress(0);
    addLog('Initiating Generation 15 Quantum Core Transition...', 'info');
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUpdating(false);
          addLog('Generation 15 Quantum Genesis Complete. Universal Sync Established.', 'success');
          return 100;
        }
        const next = prev + Math.random() * 5;
        if (Math.floor(next / 20) > Math.floor(prev / 20)) {
          addLog(`Syncing Quantum-15 Module: ${Math.floor(next/20)}/5...`, 'info');
        }
        return next;
      });
    }, 200);
  };

  const capabilities = [
    { title: 'بنية النانو-كوآنتوم (Nano-Quantum)', desc: 'تحسّن ثوري في معالجة البيانات باستخدام تراكب الحالات الكوآنتومية.', icon: Zap, color: 'indigo' },
    { title: 'تكامل تقني فائق (Unified Core)', desc: 'نظام عالمي يربط بين جميع الأنظمة التقنية في بنية واحدة موحدة.', icon: Lock, color: 'cyan' },
    { title: 'Universal Sync Matrix', desc: 'Instant feedback loops between virtual and physical realms.', icon: Globe, color: 'violet' },
    { title: 'Hyper-Evolutionary AI', desc: 'Continuous self-improvement at the speed of light.', icon: Brain, color: 'blue' },
    { title: 'Quantum Encryption', desc: 'Unbreakable security using entanglement technology.', icon: Shield, color: 'emerald' },
    { title: 'Neural Singularity', desc: 'Direct neural link for collective intelligence processing.', icon: Fingerprint, color: 'sky' },
    { title: 'Cosmic Calculation', desc: 'Predictive modeling based on universal data patterns.', icon: Cpu, color: 'fuchsia' }
  ];

  return (
    <div className="min-h-screen bg-[#010108] text-slate-200 font-arabic p-8 lg:p-12 overflow-hidden relative">
      
      {/* Background Quantum Flux */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse">
                Generation 15 Active
              </div>
              <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Quantum_Version_Alpha_15.0</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-white uppercase leading-none">
              Sarah <span className="text-indigo-400">v15</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg mt-4 max-w-2xl">
              الانتقال إلى الجيل الخامس عشر: نظام تقني شامل ومطور يعتمد على خوارزميات التطور الكوآنتومي والتكامل الكوني.
            </p>
          </div>
          <button 
            onClick={startUpdate}
            disabled={isUpdating}
            className="group relative px-10 py-5 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-indigo-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <span className="relative z-10 group-hover:text-white transition-colors">
              {isUpdating ? `Initializing... ${Math.round(progress)}%` : 'Quantum Sync'}
            </span>
          </button>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Capabilities Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((cap, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 hover:border-indigo-500/30 transition-all group relative overflow-hidden backdrop-blur-md"
              >
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:border-indigo-500/50 transition-colors`}>
                    <cap.icon className="w-8 h-8 text-white group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 uppercase">{cap.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{cap.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-8 shadow-2xl backdrop-blur-xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Gen_15_Vitals</h3>
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-2">
                    <span>Quantum_Stability</span>
                    <span className="text-indigo-400">100%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-full shadow-[0_0_15px_rgba(99,102,241,0.8)]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-2">
                    <span>Reality_Sync</span>
                    <span className="text-cyan-400">SYNCED</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 w-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/60 border border-white/5 rounded-[3rem] p-10 h-[400px] flex flex-col shadow-inner">
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 font-mono text-[10px]">
                {logs.map((log) => (
                  <div key={log.id} className={`flex gap-3 items-start animate-fadeIn ${log.type === 'success' ? 'text-cyan-400' : 'text-slate-500'}`}>
                    <span className="opacity-30">#</span>
                    <span className="leading-relaxed">{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Universal Stats */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-1 bg-white rounded-[4rem]">
          <div className="bg-black rounded-[3.8rem] p-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-4xl shadow-[0_0_50px_rgba(79,70,229,0.4)]">🌀</div>
              <div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Quantum_Genesis_v15</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Universal Technical Infrastructure Active</p>
              </div>
            </div>
            <div className="flex gap-12 text-center text-white">
              <div>
                <span className="text-[10px] font-black uppercase block mb-1 opacity-60">Calculations_Sec</span>
                <span className="text-3xl font-black italic text-indigo-400">15.0Q</span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase block mb-1 opacity-60">Sync_Nodes</span>
                <span className="text-3xl font-black italic text-cyan-400">ALL</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
