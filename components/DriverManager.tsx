
import React, { useState, useEffect } from 'react';
import { orchestrateDrivers, monitorCoreUpdates } from '../services/geminiService';
import { SystemDriver, SystemUpdateHistory, AppTab, Language } from '../types';

export const DriverManager: React.FC<{ language: Language }> = ({ language }) => {
  const [drivers, setDrivers] = useState<SystemDriver[]>([]);
  const [updates, setUpdates] = useState<SystemUpdateHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState<SystemDriver | null>(null);

  useEffect(() => {
    initiateControlMatrix();
  }, []);

  const initiateControlMatrix = async () => {
    setLoading(true);
    try {
      const systemTabs = Object.values(AppTab).slice(0, 12);
      const fetchedDrivers = await orchestrateDrivers(systemTabs, language);
      setDrivers(fetchedDrivers);
      
      const latestUpdate = await monitorCoreUpdates([], language);
      setUpdates(prev => [latestUpdate, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeDriver = (id: string) => {
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, isOptimized: true, load: Math.max(5, d.load - 20) } : d));
    alert('تم تحسين استجابة التعريف بنجاح. معدل استهلاك الموارد انخفض بنسبة 20%.');
  };

  const handleRollback = (targetVersion: string) => {
    if (confirm(`هل أنت متأكد من العودة إلى الإصدار ${targetVersion}؟ سيتم إعادة تهيئة كافة الدرايفرات.`)) {
      alert(`جاري الرجوع للحالة ${targetVersion}... تم استعادة استقرار النواة.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fadeIn font-arabic pb-40">
      
      {/* Header Panel */}
      <div className="bg-slate-950 border border-amber-500/20 p-12 rounded-[4rem] shadow-3xl relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-pulse"></div>
         <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
            <div className="flex items-center gap-8 text-right">
               <div className="w-24 h-24 bg-amber-600/10 border-2 border-amber-500/30 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-[0_0_50px_rgba(245,158,11,0.2)] animate-pulse">⚙️</div>
               <div className="text-right">
                  <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">إدارة <span className="text-amber-500">الكفاءة</span></h2>
                  <p className="text-slate-500 font-bold uppercase tracking-[0.4em] mt-2">Neural_Efficiency_Control_v13.1</p>
               </div>
            </div>
            <div className="flex gap-4">
               <button onClick={initiateControlMatrix} className="px-10 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-all shadow-xl">Re-Sync_Global_Matrix</button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Driver List (Optimized Grid) */}
        <div className="lg:col-span-8 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-white/5 rounded-[2.5rem] animate-pulse"></div>
                ))
              ) : (
                drivers.map(driver => (
                  <div 
                    key={driver.id}
                    onClick={() => setSelectedDriver(driver)}
                    className={`p-8 rounded-[3rem] border-2 transition-all cursor-pointer relative overflow-hidden group ${selectedDriver?.id === driver.id ? 'bg-amber-500 border-amber-400 shadow-3xl scale-[1.02]' : 'bg-black/40 border-white/5 hover:border-amber-500/30'}`}
                  >
                     <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-2">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${selectedDriver?.id === driver.id ? 'bg-black text-amber-500' : 'bg-white/5 text-slate-500'}`}>{driver.status}</span>
                           {driver.isOptimized && <span className="px-4 py-1.5 bg-emerald-500 text-black rounded-full text-[9px] font-black uppercase">TURBO_ON</span>}
                        </div>
                        <div className={`w-3 h-3 rounded-full ${driver.status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500 shadow-[0_0_10px_red]'}`}></div>
                     </div>
                     <h4 className={`text-2xl font-black mb-2 ${selectedDriver?.id === driver.id ? 'text-black' : 'text-white'}`}>{driver.name}</h4>
                     
                     <div className="space-y-3 mt-6">
                        <div className="flex justify-between text-[8px] font-black uppercase opacity-60">
                           <span>System_Load</span>
                           <span>{driver.load.toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                           <div className={`h-full transition-all duration-1000 ${selectedDriver?.id === driver.id ? 'bg-black' : 'bg-amber-500'}`} style={{ width: `${driver.load}%` }}></div>
                        </div>
                     </div>

                     {selectedDriver?.id === driver.id && !driver.isOptimized && (
                       <button 
                         onClick={(e) => { e.stopPropagation(); handleOptimizeDriver(driver.id); }}
                         className="mt-6 w-full py-3 bg-black text-amber-500 rounded-2xl text-[9px] font-black uppercase hover:bg-amber-900 hover:text-white transition-all"
                       >
                         Overclock_Driver ⚡
                       </button>
                     )}
                  </div>
                ))
              )}
           </div>
        </div>

        {/* Temporal Performance Monitor */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-black/60 rounded-[3.5rem] border border-white/10 p-10 flex flex-col shadow-inner relative">
              <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.4em] mb-8 border-b border-white/5 pb-6">Performance_Timeline</h3>
              <div className="space-y-8 overflow-y-auto max-h-[500px] no-scrollbar pr-4">
                 {updates.map((upd, i) => (
                   <div key={i} className="relative pr-8 border-r-2 border-white/5 pb-8 group">
                      <div className="absolute right-[-5px] top-0 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_orange]"></div>
                      <div className="text-[10px] font-black text-slate-500 mb-1">{new Date(upd.timestamp).toLocaleString()}</div>
                      <h5 className="text-white font-black text-lg mb-2">Build: {upd.version}</h5>
                      {upd.performanceGain && (
                        <div className="text-[10px] font-black text-emerald-500 mb-4 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                          🚀 Performance Gain: {upd.performanceGain}
                        </div>
                      )}
                      <ul className="space-y-1 mb-4">
                         {upd.changes.map((c, j) => (
                           <li key={j} className="text-[10px] text-slate-400 italic">{" >> "} {c}</li>
                         ))}
                      </ul>
                      <button 
                        onClick={() => handleRollback(upd.version)}
                        className="text-[9px] font-black text-amber-500 uppercase underline decoration-2 underline-offset-4 hover:text-white transition-colors"
                      >
                        Rollback_State
                      </button>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-amber-600 text-black p-10 rounded-[4rem] shadow-3xl">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-6">Master_Sync_Status</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between bg-black/10 p-4 rounded-2xl">
                    <span className="text-[10px] font-black uppercase">Global_Efficiency</span>
                    <span className="text-xl font-black">99.2%</span>
                 </div>
                 <div className="flex items-center justify-between bg-black/10 p-4 rounded-2xl">
                    <span className="text-[10px] font-black uppercase">Input_Latency</span>
                    <span className="text-xl font-black">0.08ms</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
