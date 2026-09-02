
import React, { useState, useEffect, useRef } from 'react';
import { orchestrateOrbitalSystem } from '../services/geminiService';
import { OrbitalReport, SatelliteNode, Language } from '../types';

export const OrbitalStation: React.FC<{ language: Language }> = ({ language }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<OrbitalReport | null>(null);
  const [selectedSat, setSelectedSat] = useState<SatelliteNode | null>(null);
  const [mission, setMission] = useState('');
  const [radarAngle, setRadarAngle] = useState(0);
  const [dataStream, setDataStream] = useState<string[]>([]);
  const [matrixSync, setMatrixSync] = useState(85);
  
  // Systems Status for Integration
  const systems = [
    { id: 'defense', label: 'Defense_Grid', status: 'LOCKED', color: 'text-red-500' },
    { id: 'city', label: 'City_Metropolis', status: 'SYNCED', color: 'text-amber-500' },
    { id: 'logic', label: 'Logic_Core_V7', status: 'ACTIVE', color: 'text-blue-500' },
  ];

  // Radar Animation & Data Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle(a => (a + 3) % 360);
      
      // Simulate Incoming Data Packets
      if (Math.random() > 0.7) {
        const hex = Math.random().toString(16).substr(2, 8).toUpperCase();
        setDataStream(prev => [`[RX] PKT_${hex} >> MATRIX_BUFFER`, ...prev].slice(0, 8));
      }
      
      // Simulate Matrix Sync Fluctuation
      if (Math.random() > 0.8) {
        setMatrixSync(prev => Math.min(100, Math.max(80, prev + (Math.random() * 4 - 2))));
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const handleLaunch = async () => {
    if (!mission.trim()) return;
    setLoading(true);
    try {
      const data = await orchestrateOrbitalSystem(mission, language);
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto space-y-10 animate-fadeIn font-arabic pb-40 relative">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden bg-[#020408]">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1800px] h-[1800px] bg-[radial-gradient(circle,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:80px_80px] animate-pulse"></div>
         <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-900 to-transparent"></div>
         <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-900 to-transparent"></div>
      </div>

      {/* Control Tower Header */}
      <header className="bg-slate-950/80 backdrop-blur-3xl border border-cyan-500/20 p-10 rounded-[4rem] shadow-[0_0_150px_rgba(6,182,212,0.15)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-10">
          <div className="flex items-center gap-8">
            <div className={`w-28 h-28 rounded-[3rem] border-[3px] flex items-center justify-center text-6xl transition-all duration-1000 shadow-2xl ${loading ? 'bg-cyan-900/50 border-cyan-400 animate-spin' : 'bg-[#050505] border-cyan-500/30'}`}>
               📡
            </div>
            <div className="text-right">
              <h1 className="text-7xl font-black text-white tracking-tighter uppercase leading-none">برج <span className="text-cyan-500">المراقبة</span></h1>
              <div className="flex items-center gap-3 mt-3">
                 <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                 <p className="text-cyan-800 font-black uppercase tracking-[0.4em] text-xs">Live_Orbital_Broadcast_Active</p>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-xl flex flex-col gap-4">
             <div className="flex bg-black/60 border border-cyan-500/20 rounded-[2.5rem] p-2">
                <input 
                  type="text"
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  placeholder="إدخال كود المهمة أو نطاق التردد..."
                  className="flex-1 bg-transparent px-6 text-lg text-white focus:outline-none text-right placeholder:text-cyan-900/50 font-medium"
                />
                <button 
                  onClick={handleLaunch}
                  disabled={loading}
                  className="bg-cyan-600 hover:bg-cyan-500 text-black px-8 py-3 rounded-[2rem] font-black transition-all active:scale-95 shadow-xl uppercase text-sm"
                >
                  {loading ? 'UPLINK...' : 'INIT_SCAN'}
                </button>
             </div>
             <div className="flex justify-between px-4 text-[9px] font-black text-cyan-700 uppercase tracking-widest">
                <span>Encryption: AES-256_V12</span>
                <span>Latency: 0.04ms</span>
                <span>Signal: ULTRA_WIDE</span>
             </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left: Complex System Integration Panel */}
        <div className="lg:col-span-3 space-y-6">
           <div className="bg-[#050505] border border-cyan-900/30 p-8 rounded-[3.5rem] shadow-2xl h-full flex flex-col">
              <h3 className="text-xs font-black text-cyan-500 uppercase tracking-[0.3em] mb-8 border-b border-cyan-900/30 pb-4">Matrix_Integration_Hub</h3>
              
              <div className="space-y-6 flex-1">
                 {systems.map(sys => (
                   <div key={sys.id} className="bg-white/5 p-5 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:border-cyan-500/30 transition-all">
                      <div>
                         <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Target_System</div>
                         <div className="text-sm font-bold text-white">{sys.label}</div>
                      </div>
                      <div className="text-right">
                         <div className={`text-[9px] font-black ${sys.color} uppercase`}>{sys.status}</div>
                         <div className="w-16 h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-cyan-500 animate-pulse w-[80%]"></div>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="mt-8 pt-6 border-t border-cyan-900/30">
                 <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase mb-2">
                    <span>Core_Matrix_Sync</span>
                    <span className="text-cyan-400">{matrixSync.toFixed(1)}%</span>
                 </div>
                 <div className="w-full bg-black h-2 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-gradient-to-r from-cyan-900 via-cyan-500 to-white transition-all duration-300" style={{ width: `${matrixSync}%` }}></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Center: Live Radar View */}
        <div className="lg:col-span-6 bg-black rounded-[5rem] border-[8px] border-[#0c0c0c] p-6 relative overflow-hidden h-[700px] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex items-center justify-center group">
           <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
           
           {/* Radar Interface */}
           <div className="relative w-[550px] h-[550px] rounded-full border border-cyan-500/10 flex items-center justify-center">
              {/* Concentric Rings */}
              <div className="absolute inset-0 border border-cyan-500/10 rounded-full"></div>
              <div className="absolute inset-[15%] border border-cyan-500/5 rounded-full"></div>
              <div className="absolute inset-[30%] border border-cyan-500/5 rounded-full"></div>
              <div className="absolute inset-[45%] border border-cyan-500/5 rounded-full"></div>
              
              {/* Crosshairs */}
              <div className="absolute top-0 bottom-0 w-px bg-cyan-500/10"></div>
              <div className="absolute left-0 right-0 h-px bg-cyan-500/10"></div>

              {/* The Sweep */}
              <div 
                className="absolute w-1/2 h-[200px] bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent top-1/2 left-1/2 origin-top-left z-10"
                style={{ 
                   transform: `rotate(${radarAngle}deg)`,
                   clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)' 
                }}
              ></div>
              <div 
                 className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-cyan-400 shadow-[0_0_15px_cyan] origin-left z-20"
                 style={{ transform: `rotate(${radarAngle}deg)` }}
              ></div>

              {/* Central Hub */}
              <div className="w-24 h-24 bg-[#050505] rounded-full border-2 border-cyan-500/30 flex items-center justify-center relative z-30 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
                 <div className="w-3 h-3 bg-cyan-500 rounded-full animate-ping"></div>
              </div>

              {/* Satellites (Dynamic) */}
              {report?.activeSatellites.map((sat, i) => (
                <button
                  key={sat.id}
                  onClick={() => setSelectedSat(sat)}
                  className={`absolute p-2 transition-all duration-500 z-40 group/sat`}
                  style={{ 
                    transform: `rotate(${i * (360 / report.activeSatellites.length) + radarAngle * 0.1}deg) translateX(${140 + (i % 3) * 60}px) rotate(-${i * (360 / report.activeSatellites.length) + radarAngle * 0.1}deg)` 
                  }}
                >
                   <div className={`w-3 h-3 rounded-full ${selectedSat?.id === sat.id ? 'bg-white shadow-[0_0_20px_white] scale-150' : 'bg-cyan-500 shadow-[0_0_10px_cyan]'}`}></div>
                   <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 border border-cyan-500/30 px-3 py-1 rounded text-[8px] font-mono text-cyan-400 opacity-0 group-hover/sat:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {sat.name}
                   </div>
                </button>
              ))}
           </div>

           {/* Radar Telemetry Corners */}
           <div className="absolute top-10 left-10 font-mono text-[10px] text-cyan-700">
              <div className="mb-1">RADAR_SWEEP: {radarAngle}°</div>
              <div>TARGETS: {report?.activeSatellites.length || 0}</div>
           </div>
           <div className="absolute bottom-10 right-10 text-right font-mono text-[10px] text-cyan-700">
              <div className="mb-1">FREQ: 12.45 GHz</div>
              <div>MODE: ACTIVE_TRACKING</div>
           </div>
        </div>

        {/* Right: Data Stream & Satellite Info */}
        <div className="lg:col-span-3 space-y-6 flex flex-col">
           
           {/* Data Stream (Matrix Feed) */}
           <div className="bg-[#080a0f] border border-cyan-900/30 p-8 rounded-[3.5rem] shadow-2xl h-1/2 flex flex-col overflow-hidden relative">
              <h3 className="text-xs font-black text-cyan-500 uppercase tracking-[0.3em] mb-4 z-10 relative">Incoming_Telemetry</h3>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-noise.png')] opacity-5"></div>
              <div className="flex-1 overflow-y-auto no-scrollbar font-mono text-[9px] space-y-2 dir-ltr text-left relative z-10">
                 {dataStream.map((log, i) => (
                   <div key={i} className={`animate-fadeIn ${i === 0 ? 'text-white font-bold' : 'text-cyan-800'}`}>
                      {log}
                   </div>
                 ))}
              </div>
           </div>

           {/* Selected Satellite Details */}
           <div className="bg-cyan-900/10 border border-cyan-500/20 p-8 rounded-[3.5rem] flex-1 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-cyan-600/30"></div>
              {selectedSat ? (
                <div className="animate-fadeIn space-y-6 text-right">
                   <div>
                      <span className="text-[9px] font-black text-cyan-600 uppercase tracking-widest">Selected_Node</span>
                      <h3 className="text-2xl font-black text-white mt-1">{selectedSat.name}</h3>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                         <span className="text-[8px] text-slate-500 block uppercase">Altitude</span>
                         <span className="text-sm font-bold text-white">{selectedSat.altitude}km</span>
                      </div>
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                         <span className="text-[8px] text-slate-500 block uppercase">Signal</span>
                         <span className="text-sm font-bold text-cyan-400">{selectedSat.signalStrength}%</span>
                      </div>
                   </div>
                   <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase hover:bg-cyan-500 hover:text-white transition-all shadow-lg">
                      Establish_Direct_Link
                   </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center gap-4">
                   <div className="text-6xl animate-pulse">🛰️</div>
                   <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Select_Target_On_Radar</p>
                </div>
              )}
           </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};
