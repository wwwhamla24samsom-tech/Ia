import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cpu, Zap, Activity, Shield, Database, Globe, Server, Terminal, RefreshCw, Power, Search } from 'lucide-react';
import { Language } from '../types';

export const CPU10GCore: React.FC<{ language: Language }> = ({ language }) => {
  const [clockSpeed, setClockSpeed] = useState(10.00);
  const [latency, setLatency] = useState(0.0001);
  const [temperature, setTemperature] = useState(32.5);
  const [isOverclocked, setIsOverclocked] = useState(false);
  const [activeThreads, setActiveThreads] = useState(1024);
  const [deepSearchActive, setDeepSearchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setClockSpeed(prev => {
        const base = isOverclocked ? 12.50 : 10.00;
        return base + (Math.random() * 0.05 - 0.025);
      });
      setLatency(prev => {
        const base = isOverclocked ? 0.00005 : 0.0001;
        return base + (Math.random() * 0.00001 - 0.000005);
      });
      setTemperature(prev => {
        const target = isOverclocked ? 45.0 : 32.5;
        return prev + (target - prev) * 0.1 + (Math.random() * 0.5 - 0.25);
      });
      setActiveThreads(prev => {
        const base = deepSearchActive ? 4096 : 1024;
        return Math.floor(base + (Math.random() * 100 - 50));
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isOverclocked, deepSearchActive]);

  const toggleOverclock = () => setIsOverclocked(!isOverclocked);
  const toggleDeepSearch = () => setDeepSearchActive(!deepSearchActive);

  return (
    <div className="min-h-screen bg-[#010204] text-slate-200 font-arabic p-8 lg:p-12 overflow-hidden relative flex flex-col">
      
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] transition-all duration-1000 ${isOverclocked ? 'bg-rose-600/20' : 'bg-purple-600/10'}`}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col space-y-8 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className={`px-3 py-1 text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-colors ${isOverclocked ? 'bg-rose-600' : 'bg-purple-600'}`}>
                {isOverclocked ? 'Overclock_Active' : 'Standard_Mode'}
              </div>
              <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Zero_Latency_Architecture</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-white uppercase leading-none">
              10G <span className={isOverclocked ? 'text-rose-500' : 'text-purple-500'}>CPU Core</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg mt-4 max-w-2xl">
              نظام المعالجة الفائقة بسرعة 10 جيجاهرتز. استجابة لحظية (أقل من ثانية) وبحث عميق مدمج مع المصفوفة.
            </p>
          </div>
          
          <div className="flex gap-4">
             <button 
               onClick={toggleOverclock}
               className={`px-8 py-4 border rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 shadow-2xl ${isOverclocked ? 'bg-rose-600/20 border-rose-500/50 text-rose-400 hover:bg-rose-600/30' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
             >
               <Zap className={`w-4 h-4 ${isOverclocked ? 'animate-pulse' : ''}`} />
               {isOverclocked ? 'Disable_Overclock' : 'Enable_Overclock'}
             </button>
          </div>
        </header>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
          
          {/* Left: CPU Metrics */}
          <div className="lg:col-span-4 space-y-6 flex flex-col">
            <div className="bg-black/40 border border-white/5 rounded-[3rem] p-8 flex-1 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
              
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Core_Telemetry</h3>
                <Activity className={`w-5 h-5 ${isOverclocked ? 'text-rose-500' : 'text-purple-500'}`} />
              </div>

              <div className="space-y-8">
                {/* Clock Speed */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Clock_Speed</span>
                    <span className={`text-3xl font-black font-mono ${isOverclocked ? 'text-rose-400' : 'text-purple-400'}`}>
                      {clockSpeed.toFixed(2)} <span className="text-sm text-slate-600">GHz</span>
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-100 ${isOverclocked ? 'bg-rose-500' : 'bg-purple-500'}`} style={{ width: `${(clockSpeed / 15) * 100}%` }}></div>
                  </div>
                </div>

                {/* Latency */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System_Latency</span>
                    <span className="text-3xl font-black font-mono text-emerald-400">
                      {latency.toFixed(5)} <span className="text-sm text-slate-600">s</span>
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-100" style={{ width: `${(latency / 0.0002) * 100}%` }}></div>
                  </div>
                </div>

                {/* Temperature */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Thermal_State</span>
                    <span className={`text-3xl font-black font-mono ${temperature > 40 ? 'text-orange-400' : 'text-blue-400'}`}>
                      {temperature.toFixed(1)} <span className="text-sm text-slate-600">°C</span>
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-100 ${temperature > 40 ? 'bg-orange-500' : 'bg-blue-500'}`} style={{ width: `${(temperature / 100) * 100}%` }}></div>
                  </div>
                </div>

                {/* Threads */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active_Threads</span>
                    <span className="text-3xl font-black font-mono text-white">
                      {activeThreads}
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-white/40 transition-all duration-100" style={{ width: `${(activeThreads / 5000) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center: The CPU Core Visual */}
          <div className="lg:col-span-4 flex items-center justify-center relative">
            <div className="relative w-full aspect-square max-w-md flex items-center justify-center">
              {/* Outer Rings */}
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: isOverclocked ? 10 : 20, repeat: Infinity, ease: "linear" }}
                className={`absolute inset-0 border-[1px] border-dashed rounded-full ${isOverclocked ? 'border-rose-500/30' : 'border-purple-500/30'}`}
              ></motion.div>
              <motion.div 
                animate={{ rotate: -360 }} 
                transition={{ duration: isOverclocked ? 15 : 30, repeat: Infinity, ease: "linear" }}
                className={`absolute inset-8 border-[2px] rounded-full opacity-20 ${isOverclocked ? 'border-rose-500' : 'border-purple-500'}`}
              ></motion.div>
              
              {/* Core Processor */}
              <div className={`relative w-48 h-48 bg-black border-2 rounded-3xl flex items-center justify-center shadow-[0_0_100px_rgba(0,0,0,0.5)] z-10 transition-all duration-500 ${isOverclocked ? 'border-rose-500 shadow-rose-500/20' : 'border-purple-500 shadow-purple-500/20'}`}>
                <div className="absolute inset-2 border border-white/10 rounded-2xl"></div>
                <div className="absolute inset-4 border border-white/5 rounded-xl flex items-center justify-center bg-white/5 backdrop-blur-sm">
                  <Cpu className={`w-16 h-16 ${isOverclocked ? 'text-rose-500' : 'text-purple-500'}`} />
                </div>
                
                {/* Pins */}
                <div className="absolute -top-2 left-8 right-8 h-2 flex justify-between">
                  {[...Array(8)].map((_, i) => <div key={i} className="w-1 h-full bg-yellow-600/50"></div>)}
                </div>
                <div className="absolute -bottom-2 left-8 right-8 h-2 flex justify-between">
                  {[...Array(8)].map((_, i) => <div key={i} className="w-1 h-full bg-yellow-600/50"></div>)}
                </div>
                <div className="absolute -left-2 top-8 bottom-8 w-2 flex flex-col justify-between">
                  {[...Array(8)].map((_, i) => <div key={i} className="h-1 w-full bg-yellow-600/50"></div>)}
                </div>
                <div className="absolute -right-2 top-8 bottom-8 w-2 flex flex-col justify-between">
                  {[...Array(8)].map((_, i) => <div key={i} className="h-1 w-full bg-yellow-600/50"></div>)}
                </div>
              </div>

              {/* Data Streams */}
              {deepSearchActive && (
                <div className="absolute inset-0 z-0">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: [0, 0.5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border border-cyan-500/50"
                  ></motion.div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Deep Search & Matrix Integration */}
          <div className="lg:col-span-4 space-y-6 flex flex-col">
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 flex-1 flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Deep_Search_Matrix</h3>
                <Globe className="w-5 h-5 text-cyan-500" />
              </div>

              <div className="flex-1 flex flex-col justify-center gap-6">
                <button 
                  onClick={toggleDeepSearch}
                  className={`w-full p-8 rounded-[2.5rem] border transition-all flex flex-col items-center justify-center gap-4 group ${deepSearchActive ? 'bg-cyan-600/20 border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.2)]' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                >
                  <Search className={`w-12 h-12 ${deepSearchActive ? 'text-cyan-400 animate-pulse' : 'text-slate-600 group-hover:text-white transition-colors'}`} />
                  <div className="text-center">
                    <div className={`text-lg font-black uppercase tracking-widest ${deepSearchActive ? 'text-cyan-400' : 'text-white'}`}>
                      {deepSearchActive ? 'Deep_Search_Active' : 'Engage_Deep_Search'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold mt-2">
                      دمج قوة 10G CPU مع مصفوفة البحث للوصول لنتائج في أقل من ثانية.
                    </div>
                  </div>
                </button>

                <div className="bg-black/40 border border-white/5 p-6 rounded-[2rem] space-y-4">
                  <div className="flex items-center gap-4">
                    <Database className="w-4 h-4 text-slate-500" />
                    <div className="flex-1">
                      <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">
                        <span>Matrix_Sync</span>
                        <span className="text-emerald-500">Connected</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Server className="w-4 h-4 text-slate-500" />
                    <div className="flex-1">
                      <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">
                        <span>Global_Nodes</span>
                        <span className="text-blue-500">14,092 Active</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[92%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Terminal / Log Output */}
        <div className="bg-black/60 border border-white/5 rounded-[2.5rem] p-6 font-mono text-[10px] text-slate-500 h-48 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4 text-white/40 border-b border-white/5 pb-4">
            <Terminal className="w-4 h-4" />
            <span className="uppercase tracking-widest font-black">System_Log // 10G_Core_Events</span>
          </div>
          <div className="space-y-2">
            <p><span className="text-emerald-500">[{new Date().toISOString()}]</span> SYSTEM_INIT: 10G CPU Core Online.</p>
            <p><span className="text-emerald-500">[{new Date().toISOString()}]</span> LATENCY_CHECK: Response time locked at &lt; 1ms.</p>
            {isOverclocked && <p><span className="text-rose-500">[{new Date().toISOString()}]</span> WARNING: Overclocking engaged. Thermal limits expanded.</p>}
            {deepSearchActive && <p><span className="text-cyan-500">[{new Date().toISOString()}]</span> DEEP_SEARCH: Matrix integration complete. Querying global nodes...</p>}
            <p className="animate-pulse">_</p>
          </div>
        </div>

      </div>
    </div>
  );
};
