
import React, { useState, useEffect, useRef } from 'react';
import { orchestrateVRSpace } from '../services/geminiService';
import { VRSystemState, Language } from '../types';

export const NeuralVROS: React.FC<{ language: Language }> = ({ language }) => {
  const [directive, setDirective] = useState('');
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<VRSystemState | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImmerse = async () => {
    if (!directive.trim()) return;
    setLoading(true);
    try {
      const data = await orchestrateVRSpace(directive, language);
      setState(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left - rect.width / 2) / 25,
      y: (e.clientY - rect.top - rect.height / 2) / 25
    });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-[100] bg-[#010205] flex flex-col font-arabic overflow-hidden"
    >
      {/* 3D Space Background Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
             backgroundSize: '100px 100px',
             transform: `perspective(1000px) rotateX(60deg) translateY(${mousePos.y * 2}px) translateZ(-200px)`,
             transition: 'transform 0.1s ease-out'
           }}>
      </div>

      {/* Control Overlay */}
      <header className="relative z-[200] p-10 flex justify-between items-center bg-gradient-to-b from-black to-transparent">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-cyan-600 rounded-2xl flex items-center justify-center text-4xl shadow-[0_0_30px_cyan] animate-pulse">🌌</div>
           <div>
              <h2 className="text-4xl font-black text-white tracking-tighter">نظام <span className="text-cyan-400">صارة VR</span></h2>
              <p className="text-cyan-900 font-mono text-[10px] tracking-[0.4em] uppercase">Neural_Spatial_Environment_v1.0</p>
           </div>
        </div>
        <div className="flex gap-4">
           <input 
             type="text" 
             value={directive}
             onChange={(e) => setDirective(e.target.value)}
             placeholder="أدخل الأمر لتشكيل الفضاء..."
             className="bg-white/5 border border-cyan-500/30 rounded-2xl px-8 py-3 text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 w-96 text-right"
           />
           <button 
             onClick={handleImmerse}
             disabled={loading}
             className="bg-cyan-600 hover:bg-cyan-500 text-black px-10 py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl transition-all active:scale-95"
           >
             {loading ? 'تكوين...' : 'تجسيد الفضاء ⚡'}
           </button>
        </div>
      </header>

      {/* VR Main Workspace */}
      <main className="flex-1 relative flex items-center justify-center" style={{ perspective: '1200px' }}>
        {state ? (
          <div 
            className="relative w-full h-full transition-transform duration-500 ease-out"
            style={{ transform: `rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)` }}
          >
            {state.spatialNodes.map((node, i) => (
              <div 
                key={node.id}
                className="absolute transition-all duration-1000 group cursor-pointer"
                style={{ 
                  left: `calc(50% + ${Math.cos(i) * 300}px)`, 
                  top: `calc(50% + ${Math.sin(i) * 200}px)`,
                  transform: `translateZ(${node.depth}px) rotate(${node.rotation}deg) scale(${node.scale})`,
                }}
              >
                <div className={`p-8 rounded-[2rem] border-2 backdrop-blur-xl flex flex-col items-center gap-4 shadow-2xl group-hover:scale-110 transition-all ${node.type === 'logic' ? 'bg-purple-600/20 border-purple-400' : 'bg-cyan-600/20 border-cyan-400'}`}>
                   <div className="text-4xl">{node.type === 'logic' ? '🧠' : '🛡️'}</div>
                   <span className="text-white font-black text-xs uppercase tracking-widest whitespace-nowrap">{node.label}</span>
                   <div className="w-12 h-0.5 bg-current opacity-20"></div>
                   <span className="text-[8px] font-mono opacity-40">DEPTH: {node.depth}u</span>
                </div>
                {/* Visual Connection Lines */}
                <div className="absolute top-1/2 left-1/2 w-[500px] h-px bg-cyan-500/10 origin-left -z-10"></div>
              </div>
            ))}

            {/* Central Sovereign Core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
               <div className="w-48 h-48 bg-white/5 border border-white/20 rounded-full flex items-center justify-center animate-spin-slow">
                  <div className="w-32 h-32 bg-cyan-500 rounded-full shadow-[0_0_100px_cyan] flex items-center justify-center animate-pulse">
                     <span className="text-black font-black text-2xl">CORE</span>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-8 opacity-20 grayscale pointer-events-none">
             <div className="text-[15rem] animate-float">👁️</div>
             <h3 className="text-5xl font-black text-white uppercase tracking-[1em]">Awaiting_Dive</h3>
          </div>
        )}
      </main>

      {/* Footer Vitals */}
      <footer className="p-10 flex justify-between items-end relative z-[200]">
         <div className="space-y-4">
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Immersion_Sync</span>
               <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 animate-pulse" style={{ width: state ? '98%' : '0%' }}></div>
               </div>
            </div>
            <p className="text-[9px] font-mono text-slate-700">NODE_ID: SARAH_VR_0x991</p>
         </div>
         <div className="text-right">
            <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Sector_Active</span>
            <span className="text-2xl font-black text-white uppercase tracking-tighter">{state?.activeSector || '---'}</span>
         </div>
      </footer>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        .animate-scanline { animation: scanline 4s linear infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
