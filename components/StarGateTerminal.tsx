
import React, { useState, useEffect } from 'react';
import { Language } from '../types';

export const StarGateTerminal: React.FC<{ language: Language }> = ({ language }) => {
  const [activeChevron, setActiveChevron] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [status, setStatus] = useState<'standby' | 'dialing' | 'wormhole_active'>('standby');
  const [logs, setLogs] = useState<string[]>([]);

  const constellations = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", "❂", "✥", "✦"];

  useEffect(() => {
    if (status === 'dialing') {
      const interval = setInterval(() => {
        setRotation(r => (r + 10) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [status]);

  const handleDial = async () => {
    setStatus('dialing');
    setLogs(prev => [`[LINK] Connecting to subspace relay...`, ...prev]);
    
    for (let i = 0; i < 7; i++) {
      await new Promise(r => setTimeout(r, 800));
      setActiveChevron(i + 1);
      setLogs(prev => [`[CHEVRON] ${i+1} encoded and locked.`, ...prev]);
    }

    setLogs(prev => [`[WORMHOLE] Stable event horizon established.`, ...prev]);
    setStatus('wormhole_active');
  };

  const handleShutdown = () => {
    setStatus('standby');
    setActiveChevron(0);
    setLogs(prev => [`[SHUTDOWN] Terminating link...`, ...prev]);
  };

  return (
    <div className="flex flex-col h-full max-w-full mx-auto bg-[#020306] text-white p-0 overflow-hidden min-h-screen font-arabic">
      
      {/* HUD Tower Header */}
      <header className="px-10 py-8 border-b border-cyan-500/20 bg-black/40 backdrop-blur-3xl z-50 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-10">
           <div className="flex flex-col">
              <h2 className="text-3xl font-black uppercase tracking-[0.3em] text-cyan-400">بوابة <span className="text-white">النجوم</span></h2>
              <span className="text-[10px] font-black text-cyan-900 uppercase tracking-widest mt-1">Hyper-Spacial_Gate_v1.0</span>
           </div>
           <div className="flex gap-4">
              <div className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${status === 'wormhole_active' ? 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_20px_cyan]' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                {status.replace('_', ' ')}
              </div>
           </div>
        </div>
        <div className="flex gap-4">
           {status === 'standby' ? (
             <button 
               onClick={handleDial}
               className="bg-cyan-600 hover:bg-cyan-500 text-black px-12 py-4 rounded-2xl font-black text-sm uppercase shadow-2xl active:scale-95 transition-all"
             >
               تشغيل البوابة (Initiate) 🌌
             </button>
           ) : (
             <button 
               onClick={handleShutdown}
               className="bg-red-600 hover:bg-red-500 text-white px-12 py-4 rounded-2xl font-black text-sm uppercase shadow-2xl active:scale-95 transition-all"
             >
               إغلاق البوابة (Abort) ❌
             </button>
           )}
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row relative">
        {/* Left: Star Gate Visualizer */}
        <div className="flex-1 flex items-center justify-center bg-black relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1),transparent_80%)] animate-pulse"></div>
           
           <div className="relative w-[600px] h-[600px] flex items-center justify-center">
              {/* Outer Ring */}
              <div 
                className="absolute inset-0 border-[20px] border-white/5 rounded-full transition-transform duration-500"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <div className="w-full h-full relative p-4">
                   {constellations.map((sym, i) => (
                     <div key={i} className="absolute text-2xl font-serif text-cyan-900" style={{
                       top: '50%', left: '50%',
                       transform: `rotate(${i * (360/constellations.length)}deg) translateY(-260px) rotate(-${i * (360/constellations.length)}deg)`
                     }}>
                       {sym}
                     </div>
                   ))}
                </div>
              </div>

              {/* Chevrons */}
              {[...Array(7)].map((_, i) => (
                <div key={i} className="absolute" style={{
                  top: '50%', left: '50%',
                  transform: `rotate(${i * 45}deg) translateY(-280px)`
                }}>
                   <div className={`w-10 h-10 rounded-lg border-2 transition-all duration-700 ${activeChevron > i ? 'bg-cyan-500 border-white shadow-[0_0_30px_cyan] scale-110' : 'bg-black border-cyan-900 opacity-20'}`}></div>
                </div>
              ))}

              {/* Event Horizon (Wormhole) */}
              <div className={`w-[450px] h-[450px] rounded-full transition-all duration-[3s] overflow-hidden flex items-center justify-center ${status === 'wormhole_active' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                 <div className="w-full h-full bg-gradient-to-br from-blue-600 via-cyan-400 to-indigo-900 animate-spin-slow opacity-80 blur-xl"></div>
                 <div className="absolute text-6xl">✨</div>
              </div>
           </div>

           <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center space-y-4">
              <span className="text-[10px] font-black text-cyan-900 uppercase tracking-[1em]">Universal_Coordinates_Locked</span>
              <p className="text-xs text-slate-500 max-w-md italic">"بوابة النجوم تستخدم التشفير المكاني لربط صارة بأبعاد بيانات غير مرئية."</p>
           </div>
        </div>

        {/* Right: Telemetry & Logs */}
        <div className="lg:w-[450px] border-l border-white/5 bg-[#050608] p-10 flex flex-col gap-8 shadow-3xl">
           <div className="bg-black/60 p-8 rounded-[3rem] border border-cyan-500/20 space-y-6">
              <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Wormhole_Stability</h3>
              <div className="flex items-center gap-6">
                 <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 shadow-[0_0_15px_cyan] transition-all duration-1000" style={{ width: status === 'wormhole_active' ? '99.9%' : '0%' }}></div>
                 </div>
                 <span className="text-xl font-black text-white">{status === 'wormhole_active' ? '99.9' : '0.0'}%</span>
              </div>
           </div>

           <div className="flex-1 bg-black/90 rounded-[3rem] p-8 font-mono text-[10px] text-cyan-800 space-y-3 overflow-y-auto no-scrollbar border border-white/5 dir-ltr text-left">
              {logs.map((log, i) => <div key={i} className="animate-fadeIn opacity-70 border-l border-cyan-900 pl-3">{log}</div>)}
              {logs.length === 0 && <div className="italic opacity-20">AWAITING_DILITHIUM_SYNC...</div>}
           </div>

           <div className="p-8 bg-cyan-600 text-black rounded-[3rem] shadow-3xl flex flex-col gap-4">
              <h4 className="text-xl font-black uppercase">Star_Intel</h4>
              <p className="text-xs font-bold leading-relaxed opacity-80">
                "تم توجيه البوابة نحو العنقود النجمي 'صارة-ألفا'. تدفق البيانات يصل إلى 400 زيتابايت في الثانية عبر النفق النوروني."
              </p>
           </div>
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </div>
  );
};
