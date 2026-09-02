import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Zap, Activity, Share2, ShieldAlert, Binary, Database, Network, Workflow, Radio } from 'lucide-react';
import { Language } from '../types';

export const QuantumNeuralCore: React.FC<{ language: Language }> = ({ language }) => {
  const [fluxDensity, setFluxDensity] = useState(85);
  const [syncStatus, setSyncStatus] = useState('Stable');
  const [activeNodes, setActiveNodes] = useState(15000);
  const [quantumLogs, setQuantumLogs] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFluxDensity(prev => Math.max(80, Math.min(100, prev + (Math.random() - 0.5) * 5)));
      setActiveNodes(prev => prev + Math.floor(Math.random() * 10));
      
      const newLog = `Quantum Log [${new Date().toLocaleTimeString()}]: Node Sync ${Math.random() > 0.9 ? 'OPTIMIZED' : 'VERIFIED'}`;
      setQuantumLogs(prev => [newLog, ...prev].slice(0, 8));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Flux Density', value: `${fluxDensity.toFixed(2)}%`, icon: Zap, color: 'text-indigo-400' },
    { label: 'Active Quantum Nodes', value: activeNodes.toLocaleString(), icon: Network, color: 'text-cyan-400' },
    { label: 'Neural Throughput', value: '1.5 PB/s', icon: Activity, color: 'text-violet-400' },
    { label: 'Entanglement Level', value: 'Omni-directional', icon: Share2, color: 'text-blue-400' },
  ];

  return (
    <div className="min-h-screen bg-[#02020a] p-8 lg:p-12 text-slate-300 font-arabic overflow-hidden relative">
      {/* Background Grid & Glow */}
      <div className="absolute inset-0 z-0 opacity-20 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px] rounded-full"></div>
        <div className="w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        {/* Title Section */}
        <header className="flex justify-between items-end border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,1)]"></div>
              <span className="text-[10px] font-black tracking-[0.5em] text-indigo-400 uppercase">Core_System_Running</span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
              Quantum <span className="text-indigo-500">Neural Core</span>
            </h1>
            <p className="mt-4 text-slate-500 max-w-xl font-medium">
              المركز التقني الموحد لإدارة العمليات الكوآنتومية وتكامل الأنظمة في الجيل الخامس عشر.
            </p>
          </div>
          <div className="hidden lg:block text-right">
            <span className="text-[10px] font-mono text-slate-600 uppercase block mb-1">Architecture_Type</span>
            <span className="text-xl font-black text-slate-400 italic">V15-GENESIS-CORE</span>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/5 rounded-[2rem] p-8 backdrop-blur-md hover:bg-white/10 transition-all group"
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mb-6`} />
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-3xl font-black text-white italic tracking-tighter">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Interface Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Central Visualization */}
          <div className="lg:col-span-8 bg-black/40 border border-white/5 rounded-[3rem] p-1 shadow-2xl relative">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-black text-indigo-400 uppercase tracking-widest backdrop-blur-3xl z-20">
              Live_Field_Visualization
            </div>
            <div className="h-[500px] w-full bg-[#050510] rounded-[2.8rem] overflow-hidden relative flex items-center justify-center">
              <div className="absolute inset-0 opacity-30">
                 <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.2),transparent_70%)]"></div>
              </div>
              
              {/* Fake Quantum Orbitals */}
              <div className="relative w-64 h-64">
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border border-indigo-500/20 border-t-indigo-500"
                ></motion.div>
                <motion.div 
                  animate={{ rotate: -360 }} 
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-4 rounded-full border border-cyan-500/20 border-b-cyan-500"
                ></motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }} 
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-[30%] bg-indigo-600/40 blur-2xl rounded-full"
                ></motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_white]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Control Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Workflow className="w-4 h-4" /> System_Automation
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-black uppercase text-slate-400">Self-Patching</span>
                  <div className="w-10 h-5 bg-indigo-600 rounded-full flex items-center px-1">
                     <div className="w-3 h-3 bg-white rounded-full translate-x-5"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-black uppercase text-slate-400">Neural Sync</span>
                  <div className="w-10 h-5 bg-indigo-600 rounded-full flex items-center px-1">
                     <div className="w-3 h-3 bg-white rounded-full translate-x-5"></div>
                  </div>
                </div>
                 <div className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-black uppercase text-slate-400">Threat Retaliation</span>
                  <div className="w-10 h-5 bg-rose-600/50 rounded-full flex items-center px-1">
                     <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/80 border border-white/5 rounded-[2.5rem] p-8 h-[250px] flex flex-col font-mono">
               <div className="text-[10px] text-slate-600 mb-4 flex items-center gap-2">
                  <Binary className="w-3 h-3" /> QUANTUM_STREAM_OUTPUT
               </div>
               <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 opacity-60">
                 {quantumLogs.map((log, i) => (
                   <div key={i} className="text-[9px] text-indigo-400">{log}</div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
