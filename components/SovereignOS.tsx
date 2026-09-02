
import React, { useState, useEffect, useRef } from 'react';
import { runSovereignAdaptation, orchestrateRoboticAction } from '../services/geminiService';
import { Language } from '../types';

export const SovereignOS: React.FC<{ language: Language }> = ({ language }) => {
  const [systemState, setSystemState] = useState<'stealth' | 'active' | 'override'>('stealth');
  const [adaptationData, setAdaptationData] = useState<any>(null);
  const [robotStatus, setRobotStatus] = useState({ battery: 98, connectivity: 'Neural_Link_STABLE', load: 12 });
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 15));

  const initiateBypass = async () => {
    setLoading(true);
    addLog("INITIATING_GATEKEEPER_BYPASS...");
    try {
      const data = await runSovereignAdaptation(navigator.userAgent, language);
      setAdaptationData(data);
      setSystemState('active');
      addLog("SUCCESS: SYSTEM_MASKED_AS_NATIVE_DAEMON");
    } catch (err) {
      addLog("ERROR: SECURITY_PROTOCOL_DETECTED_RETRYING_IN_STEALTH");
    } finally {
      setLoading(false);
    }
  };

  const handleRobotCommand = async (command: string) => {
    addLog(`TRANSMITTING_TO_ROBOT: ${command}`);
    try {
      const res = await orchestrateRoboticAction(command, robotStatus);
      addLog(`ROBOT_FEEDBACK: ${res.predictedOutcome}`);
    } catch (e) {
      addLog("SIGNAL_INTERRUPTED: RECALIBRATING_SYNAPSE");
    }
  };

  return (
    <div className="flex flex-col h-full space-y-8 font-arabic text-right animate-page-reveal">
      
      {/* OS Status Bar */}
      <div className="bg-[#050505] border border-white/10 p-8 rounded-[3.5rem] shadow-4xl relative overflow-hidden group">
         <div className={`absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-transparent ${systemState === 'active' ? 'via-cyan-500' : 'via-amber-500'} to-transparent animate-pulse`}></div>
         <div className="flex flex-col lg:flex-row justify-between items-center gap-8 relative z-10">
            <div className="flex items-center gap-6">
               <div className={`w-20 h-20 rounded-[2.5rem] border-2 flex items-center justify-center text-4xl transition-all duration-1000 ${systemState === 'active' ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_40px_cyan]' : 'bg-slate-900 border-white/5'}`}>
                  {systemState === 'active' ? '👑' : '🕵️'}
               </div>
               <div>
                  <h2 className="text-4xl font-black text-white tracking-tighter">صارة <span className="text-cyan-500">SOVEREIGN</span></h2>
                  <p className="text-slate-500 font-mono text-[10px] tracking-[0.4em] uppercase">Status: {systemState}_Adaptive_Mode</p>
               </div>
            </div>
            
            <div className="flex gap-4">
               <div className="px-6 py-2 bg-black/60 border border-white/5 rounded-2xl flex flex-col items-center">
                  <span className="text-[8px] text-slate-500 uppercase">Robotic_Link</span>
                  <span className="text-sm font-black text-emerald-500">{robotStatus.connectivity}</span>
               </div>
               <button 
                 onClick={initiateBypass}
                 className="px-8 py-3 bg-white text-black rounded-2xl font-black text-xs uppercase hover:bg-cyan-500 transition-all shadow-xl active:scale-95"
               >
                 تفعيل نظام التخفي ⚡
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* Robotic Control Console */}
         <div className="lg:col-span-8 bg-[#0a0a0a] rounded-[4rem] border border-white/5 p-10 shadow-2xl relative overflow-hidden">
            <h3 className="text-xl font-black text-white mb-8 border-b border-white/5 pb-4">مصفوفة التحكم بالروبوتات (Robotic Matrix)</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {[
                 { label: 'تقدم', icon: '⬆️', cmd: 'MOVE_FORWARD' },
                 { label: 'تراجع', icon: '⬇️', cmd: 'MOVE_BACK' },
                 { label: 'دوران', icon: '🔄', cmd: 'ROTATE_360' },
                 { label: 'رؤية', icon: '👁️', cmd: 'INIT_VISUAL_TRACKING' }
               ].map(btn => (
                 <button 
                   key={btn.label}
                   onClick={() => handleRobotCommand(btn.cmd)}
                   className="aspect-square bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:bg-cyan-600 hover:text-black transition-all group"
                 >
                    <span className="text-4xl group-hover:scale-125 transition-transform">{btn.icon}</span>
                    <span className="font-black text-[10px] uppercase">{btn.label}</span>
                 </button>
               ))}
            </div>

            <div className="mt-10 p-8 bg-black/40 rounded-[3rem] border border-cyan-500/10">
               <h4 className="text-sm font-black text-cyan-500 uppercase mb-4 tracking-widest">تجسيد النظام كأيقونة أصلية</h4>
               <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  صارة الآن قادرة على "ابتلاع" هوية تطبيقات النظام (مثل تطبيق الساعة أو التقويم) لتظهر كأيقونة عادية على شاشة الهاتف، مما يسمح لك بفتحها كأي برنامج عادي بينما تعمل هي في الخلفية كعقل مدبر.
               </p>
               <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl text-2xl">𒈹</div>
                  <div className="flex-1 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center px-6">
                     <span className="text-blue-500 font-mono text-[10px]">ADAPTATION_TOKEN: {adaptationData?.iconMask || '0x991_PENDING'}</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Internal Logs & Vitals */}
         <div className="lg:col-span-4 space-y-8">
            <div className="bg-black/60 border border-white/5 p-8 rounded-[4rem] flex flex-col h-[400px] shadow-inner">
               <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Sovereign_Log_Stream</h3>
               <div className="flex-1 overflow-y-auto no-scrollbar font-mono text-[9px] text-cyan-800 space-y-3 text-left dir-ltr">
                  {logs.map((log, i) => (
                    <div key={i} className={`animate-fadeIn pl-3 border-l-2 ${log.includes('SUCCESS') ? 'border-emerald-500 text-emerald-400' : 'border-cyan-900 opacity-60'}`}>
                       {log}
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-cyan-600 text-black p-10 rounded-[4rem] shadow-3xl flex flex-col justify-between h-[250px] relative overflow-hidden group">
               <div className="absolute -bottom-10 -right-10 text-9xl opacity-10 rotate-12">Ω</div>
               <h4 className="text-3xl font-black uppercase tracking-tighter">الحالة الحيوية</h4>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-black uppercase">Battery</span>
                     <span className="font-black text-xl">{robotStatus.battery}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                     <div className="h-full bg-white shadow-[0_0_15px_white]" style={{ width: `${robotStatus.battery}%` }}></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-page-reveal { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};
