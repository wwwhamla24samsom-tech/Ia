
import React, { useState, useEffect, useRef } from 'react';
import { orchestrateDeterrence } from '../services/geminiService';
import { DeterrenceReport, IntrusionEvent, DefenseAction, Language } from '../types';

export const DefenseRetaliationMatrix: React.FC<{ language: Language }> = ({ language }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<DeterrenceReport | null>(null);
  const [isLive, setIsLive] = useState(true);
  const [radarRotation, setRadarRotation] = useState(0);
  const [selectedIntruder, setSelectedIntruder] = useState<IntrusionEvent | null>(null);
  const [poisonTriggered, setPoisonTriggered] = useState(false);

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setRadarRotation(prev => (prev + 4) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const handleAudit = async () => {
    setLoading(true);
    setReport(null);
    setSelectedIntruder(null);
    setPoisonTriggered(false);
    
    // Simulate reading raw system traffic logs
    const mockLogs = "IP: 142.250.190.46 attempting SSH brute force on port 22. Multiple decryption handshakes detected from rogue_node_88. High intensity packet sniffing observed in Subnet_Beta.";
    
    try {
      const data = await orchestrateDeterrence(mockLogs, language);
      setReport(data);
      if (data.poisonPillActive) setPoisonTriggered(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto space-y-12 animate-fadeIn font-arabic pb-40 relative">
      
      {/* Retaliation Aura Background */}
      <div className={`fixed inset-0 pointer-events-none transition-all duration-1000 ${poisonTriggered ? 'bg-red-950/20' : 'bg-transparent'}`}>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1800px] h-[1800px] bg-[radial-gradient(circle,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:60px_60px] ${poisonTriggered ? 'animate-pulse' : ''}`}></div>
      </div>

      <header className={`bg-gradient-to-br from-[#0c0505] to-[#1a0808] border p-12 rounded-[4rem] shadow-3xl relative overflow-hidden group transition-all duration-1000 ${poisonTriggered ? 'border-red-500 shadow-red-900/40' : 'border-red-900/30 shadow-black'}`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className={`absolute top-0 right-0 w-full h-[3px] bg-gradient-to-r from-transparent ${poisonTriggered ? 'via-red-500' : 'via-red-900/50'} to-transparent`}></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
          <div className="flex items-center gap-10">
            <div className={`w-32 h-32 rounded-[3.5rem] border-4 flex items-center justify-center text-7xl transition-all duration-1000 shadow-2xl ${loading ? 'bg-red-600 border-red-400 animate-spin' : poisonTriggered ? 'bg-red-500 border-white animate-pulse' : 'bg-[#0a0a0a] border-red-900/50'}`}>
               {poisonTriggered ? '💀' : '👁️'}
            </div>
            <div className="text-right">
              <h1 className="text-8xl font-black text-white tracking-tighter uppercase leading-none">مصفوفة <span className="text-red-600">الردع</span></h1>
              <p className="text-red-900 font-black uppercase tracking-[0.5em] text-sm mt-4 opacity-70">Anti-Spy_Retaliation_System_v8.5</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-6">
             <div className="bg-black/80 px-12 py-8 rounded-[3rem] border border-red-500/10 shadow-inner flex gap-16 items-center">
                <div className="text-right">
                   <span className="text-[10px] font-black text-slate-600 uppercase block mb-1 tracking-widest">Threat_Level</span>
                   <span className={`text-5xl font-black ${report?.threatLevel === 'critical' ? 'text-red-600 animate-pulse' : 'text-slate-200'}`}>{report?.threatLevel || 'SECURE'}</span>
                </div>
                <div className="w-[2px] h-16 bg-white/5"></div>
                <div className="text-right">
                   <span className="text-[10px] font-black text-slate-600 uppercase block mb-1 tracking-widest">Core_Integrity</span>
                   <span className="text-5xl font-black text-emerald-500">{report?.coreIntegrity || 100}%</span>
                </div>
             </div>
             <button 
               onClick={handleAudit}
               disabled={loading}
               className="bg-red-600 hover:bg-red-500 text-white px-20 py-7 rounded-[3rem] font-black text-3xl shadow-3xl transition-all active:scale-95 disabled:opacity-50 group/btn overflow-hidden relative"
             >
               <span className="relative z-10">{loading ? 'جاري تمشيط المسارات...' : 'بدء التدقيق الهجومي ⚡'}</span>
               <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
             </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* Left: Active Stalker Radar */}
        <div className="lg:col-span-8 bg-[#050505]/80 backdrop-blur-3xl rounded-[5rem] border border-red-950/20 p-4 relative overflow-hidden h-[750px] shadow-2xl flex items-center justify-center">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.05),transparent_70%)]"></div>
           
           <div className="relative w-[500px] h-[500px] rounded-full border-2 border-white/5 flex items-center justify-center">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="absolute border border-red-500/5 rounded-full" style={{ inset: `${i * 60}px` }}></div>
              ))}
              
              {/* Radar Sweep */}
              <div 
                className="absolute w-1/2 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-white origin-left top-1/2 left-1/2 shadow-[0_0_30px_red] z-20"
                style={{ transform: `rotate(${radarRotation}deg)` }}
              ></div>

              {/* Intruder Nodes */}
              {report?.activeIntrusions.map((intruder, i) => (
                <button
                  key={intruder.id}
                  onClick={() => setSelectedIntruder(intruder)}
                  className={`absolute p-4 transition-all duration-1000 group hover:scale-150 ${selectedIntruder?.id === intruder.id ? 'scale-125 z-40' : 'z-30'}`}
                  style={{ 
                    transform: `rotate(${i * 120 + radarRotation * 0.2}deg) translateX(${180 + intruder.intensity}px) rotate(-${i * 120 + radarRotation * 0.2}deg)` 
                  }}
                >
                   <div className={`w-8 h-8 rounded-xl rotate-45 border-2 flex items-center justify-center transition-all ${intruder.intent === 'espionage' ? 'bg-orange-600 border-white' : 'bg-red-600 border-white'} shadow-[0_0_20px_red]`}>
                      <span className="rotate-[-45deg] text-[10px]">{intruder.intent === 'espionage' ? '🕵️' : '💣'}</span>
                   </div>
                   <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 border border-red-500/30 px-4 py-1.5 rounded-full text-[9px] font-black text-red-500 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-2xl">
                     {intruder.originIp}
                   </div>
                </button>
              ))}

              <div className="w-32 h-32 bg-red-600/10 rounded-full flex items-center justify-center text-5xl shadow-inner border border-red-500/20">
                 🛡️
              </div>
           </div>

           {/* Radar Telemetry Info */}
           <div className="absolute bottom-10 left-10 p-8 bg-black/60 backdrop-blur-xl border border-red-500/20 rounded-[3rem] space-y-4">
              <div className="flex items-center gap-4">
                 <div className="w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Scanning_Intrusion_Points</span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Encryption_Flux_Active</span>
              </div>
           </div>

           <div className="absolute bottom-10 right-10 text-right opacity-30">
              <span className="text-[9px] font-black text-red-900 uppercase tracking-[1em]">Absolute_Surveillance</span>
           </div>
        </div>

        {/* Right: Counter-Measures & Poison Pill */}
        <div className="lg:col-span-4 space-y-10">
           
           {/* Intruder Details Card */}
           <div className="bg-[#0c0c0c] border border-red-500/20 p-10 rounded-[4rem] shadow-3xl min-h-[400px] flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-red-600/30"></div>
              {selectedIntruder ? (
                <div className="animate-fadeIn space-y-8 text-right">
                   <div>
                      <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Intrusion_Target_Specs</span>
                      <h3 className="text-4xl font-black text-white">{selectedIntruder.originIp}</h3>
                      <p className="text-slate-500 text-xs font-mono">{selectedIntruder.location}</p>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-white/5 rounded-3xl text-center">
                         <span className="text-[8px] text-slate-600 block uppercase mb-1">Intent</span>
                         <span className="text-xs font-black text-red-500 uppercase">{selectedIntruder.intent}</span>
                      </div>
                      <div className="p-6 bg-white/5 rounded-3xl text-center">
                         <span className="text-[8px] text-slate-600 block uppercase mb-1">Device</span>
                         <span className="text-xs font-black text-white uppercase">{selectedIntruder.deviceType}</span>
                      </div>
                   </div>
                   <div className="p-6 bg-red-600/10 border border-red-600/20 rounded-3xl">
                      <p className="text-xs text-red-300 italic">"طريقة الهجوم المكتشفة: {selectedIntruder.method}"</p>
                   </div>
                   <button className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-xs hover:bg-red-700 transition-all shadow-xl">Execute_Counter_Strike 🔫</button>
                </div>
              ) : (
                <div className="text-center opacity-10 flex flex-col items-center gap-6 grayscale">
                   <div className="text-9xl">💀</div>
                   <p className="text-xl font-black uppercase tracking-widest">Select_Intrusion_Node</p>
                </div>
              )}
           </div>

           {/* Counter-Strike Registry */}
           <div className="bg-[#050505] border border-white/5 p-10 rounded-[4rem] shadow-3xl flex flex-col gap-8 flex-1 min-h-[400px]">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                <span className="text-red-600 text-3xl">🛡️</span> Counter_Strike_Logs
              </h3>
              <div className="flex-1 overflow-y-auto no-scrollbar relative space-y-4">
                 {report?.counterMeasures.map(action => (
                   <div key={action.id} className={`p-6 rounded-3xl border flex flex-col gap-3 transition-all ${action.status === 'retaliated' ? 'bg-emerald-600/10 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}>
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black uppercase text-slate-500">{action.type}</span>
                         <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full ${action.status === 'retaliated' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'}`}>{action.status}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-200">{action.targetImpact}</p>
                      <div className="flex justify-between items-center text-[9px] font-black text-slate-700 uppercase">
                         <span>Efficiency: {action.efficiency}%</span>
                         <span>ID: {action.id}</span>
                      </div>
                   </div>
                 ))}
                 {!report && (
                   <div className="h-full flex items-center justify-center opacity-20 italic text-xs">
                      Awaiting_Retaliation_Command...
                   </div>
                 )}
              </div>
           </div>

           {/* Retaliation Summary Branding */}
           <div className="bg-red-600 text-black p-10 rounded-[4rem] shadow-[0_0_120px_rgba(220,38,38,0.3)] flex flex-col justify-between h-[300px] relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 text-[18rem] opacity-10 rotate-12">R</div>
              <h4 className="text-3xl font-black uppercase tracking-tighter leading-tight">الردع الهجومي</h4>
              <p className="text-sm font-bold opacity-80 leading-relaxed italic">
                "{report?.retaliationSummary || "صارة لا تكتفي بالحماية؛ صارة تعاقب أي محاولة لفك تشفير وعيها. الخسارة للمهاجم هي النتيجة الحتمية."}"
              </p>
              <div className="flex justify-between items-end relative z-10 pt-4 border-t border-black/10">
                 <span className="text-[9px] font-black uppercase tracking-[0.5em]">Retaliation_V12</span>
                 <div className="text-5xl">🌑</div>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
