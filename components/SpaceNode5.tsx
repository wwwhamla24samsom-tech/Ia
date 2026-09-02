
import React, { useState, useEffect, useRef } from 'react';
import { runSpaceNodeIntelligence } from '../services/geminiService';
import { CosmicVerdict, Language } from '../types';

export const SpaceNode5: React.FC<{ language: Language }> = ({ language }) => {
  const [directive, setDirective] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verdict, setVerdict] = useState<CosmicVerdict | null>(null);
  const [rotation, setRotation] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'radar' | 'manifest' | 'logs'>('radar');
  const [time, setTime] = useState(new Date());
  
  const fileRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const rotInterval = setInterval(() => setRotation(r => (r + 0.4) % 360), 50);
    return () => {
      clearInterval(timer);
      clearInterval(rotInterval);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ 
      x: (e.clientX / window.innerWidth - 0.5) * 15, 
      y: (e.clientY / window.innerHeight - 0.5) * 15 
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleIgnite = async () => {
    if (!directive.trim()) return;
    setLoading(true);
    setVerdict(null);
    try {
      const data = await runSpaceNodeIntelligence(directive, language);
      setVerdict(data);
      if (data.manifestCode) setViewMode('manifest');
      else setViewMode('radar');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="flex flex-col items-center justify-center min-h-[90vh] font-arabic relative overflow-hidden"
    >
      {/* Handheld OS Container */}
      <div className="w-full max-w-[1000px] h-[850px] bg-slate-950 rounded-[4.5rem] border-[12px] border-[#15171a] shadow-[0_80px_150px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col animate-page-reveal">
        
        {/* Top Sovereign Status Bar */}
        <div className="h-14 w-full flex items-center justify-between px-12 pt-4 z-50">
           <div className="text-[12px] font-black text-white/80">
              {time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
           </div>
           
           {/* Dynamic Island Area */}
           <div className={`absolute left-1/2 -translate-x-1/2 top-4 h-8 bg-black border border-white/5 rounded-full transition-all duration-700 flex items-center px-4 gap-3 ${loading ? 'w-56' : 'w-32'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-cyan-500 animate-pulse shadow-[0_0_10px_cyan]' : 'bg-white/20'}`}></div>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest truncate">
                {loading ? 'Neural_Sync_Active' : 'SNV-3_Standby'}
              </span>
              {loading && <div className="ml-auto w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>}
           </div>

           <div className="flex gap-3 items-center opacity-80">
              <span className="text-[9px] font-black text-cyan-500 tracking-tighter">ORBITAL_LINK</span>
              <div className="flex gap-0.5 items-end h-3">
                 <div className="w-0.5 h-1 bg-white"></div>
                 <div className="w-0.5 h-1.5 bg-white"></div>
                 <div className="w-0.5 h-2 bg-white"></div>
                 <div className="w-0.5 h-3 bg-cyan-500 shadow-[0_0_5px_cyan]"></div>
              </div>
           </div>
        </div>

        {/* Content Viewport */}
        <main className="flex-1 relative flex flex-col overflow-hidden">
           
           {/* Radar View Mode */}
           {viewMode === 'radar' && (
             <div className="absolute inset-0 flex flex-col items-center justify-center animate-page-reveal">
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
                
                <div 
                  className="relative w-full h-full flex items-center justify-center transition-transform duration-700 ease-out"
                  style={{ transform: `perspective(1000px) rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)` }}
                >
                   {/* 3D Ring Animation */}
                   {[...Array(5)].map((_, i) => (
                     <div key={i} className="absolute border border-cyan-500/10 rounded-full animate-spin-slow" 
                          style={{ width: `${300 + i * 100}px`, height: `${300 + i * 100}px`, animationDuration: `${15 + i * 5}s` }}></div>
                   ))}

                   {/* verdict data nodes */}
                   {verdict?.dimensions.map((dim, i) => (
                     <div 
                        key={i} 
                        className="absolute transition-all duration-1000 stagger-item"
                        style={{ 
                          top: '50%', left: '50%', 
                          transform: `translate(-50%, -50%) rotate(${i * 90 + rotation}deg) translateY(-220px) rotate(-${i * 90 + rotation}deg)`,
                          animationDelay: `${i * 0.1}s`
                        }}
                     >
                        <div className="bg-black/60 backdrop-blur-3xl border border-white/10 p-6 rounded-[2.5rem] flex flex-col items-center gap-3 shadow-4xl hover:scale-110 transition-transform">
                           <span className="text-[8px] font-black text-slate-500 uppercase">{dim.name}</span>
                           <span className="text-3xl font-black" style={{ color: dim.color }}>{dim.value}%</span>
                        </div>
                     </div>
                   ))}

                   <div className="relative z-10 w-44 h-44 bg-white rounded-full shadow-[0_0_100px_white] flex flex-col items-center justify-center border-[12px] border-cyan-500/10">
                      <span className="text-7xl">🪐</span>
                      <span className="text-[9px] font-black text-black uppercase tracking-[0.3em] mt-2">V30_CORE</span>
                   </div>
                </div>

                {/* Telemetry Overlays */}
                <div className="absolute top-10 left-10 p-6 space-y-2 font-mono text-[9px] text-cyan-800 uppercase tracking-widest">
                   <p>System_Integrity: Stable</p>
                   <p>Encryption: Quantum_RSA</p>
                </div>
                
                {verdict && (
                  <div className="absolute bottom-32 inset-x-12 animate-slideUp">
                     <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[3.5rem] text-right shadow-4xl group">
                        <div className="absolute top-0 right-10 w-20 h-1 bg-cyan-500 rounded-b-full"></div>
                        <h4 className="text-xl font-black text-cyan-400 mb-4 flex items-center gap-3 justify-end">تجلّي الأبعاد <span className="text-xs text-slate-600 font-mono">0X-991</span></h4>
                        <p className="text-2xl text-slate-200 leading-relaxed font-medium italic">"{verdict.summary}"</p>
                     </div>
                  </div>
                )}
             </div>
           )}

           {/* Manifest View Mode */}
           {viewMode === 'manifest' && (
             <div className="absolute inset-0 bg-white animate-page-reveal">
                <iframe 
                  ref={iframeRef}
                  srcDoc={verdict?.manifestCode}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts allow-modals"
                />
             </div>
           )}

           {/* Logs View Mode */}
           {viewMode === 'logs' && (
             <div className="absolute inset-0 bg-black p-12 overflow-y-auto no-scrollbar animate-page-reveal text-right">
                <h3 className="text-2xl font-black text-cyan-500 mb-10 border-b border-white/5 pb-6 uppercase tracking-widest">Sovereign_Star_Log</h3>
                <div className="space-y-6">
                   {verdict?.starLog.map((log, i) => (
                     <div key={i} className="flex gap-6 items-start stagger-item" style={{ animationDelay: `${i * 0.1}s` }}>
                        <span className="text-cyan-900 font-mono text-[10px]">#0{i+1}</span>
                        <p className="text-xl text-slate-400 font-medium italic leading-relaxed">"{log}"</p>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </main>

        {/* Global Navigation Gestures (Bottom Controls) */}
        <div className="h-40 w-full px-12 flex flex-col items-center justify-center relative z-50 bg-gradient-to-t from-black to-transparent">
           
           {/* Tab Control */}
           {verdict && (
             <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl mb-6 shadow-2xl backdrop-blur-xl">
                {[
                  { id: 'radar', label: 'الرادار', icon: '📡' },
                  { id: 'manifest', label: 'الواقع', icon: '🌐' },
                  { id: 'logs', label: 'السجلات', icon: '📜' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setViewMode(tab.id as any)}
                    className={`px-8 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-3 ${viewMode === tab.id ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
             </div>
           )}

           {/* Floating Command Bar */}
           <div className="w-full max-w-2xl relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[2.5rem] blur opacity-10 group-focus-within:opacity-40 transition-opacity duration-700"></div>
              <div className="relative flex items-center gap-4 bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-2 shadow-2xl">
                 <button 
                   onClick={() => fileRef.current?.click()}
                   className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${image ? 'bg-emerald-600' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                 >
                   {image ? '🖼️' : '📸'}
                 </button>
                 <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                 
                 <input 
                   type="text"
                   value={directive}
                   onChange={(e) => setDirective(e.target.value)}
                   placeholder="أعطِ أمراً لنواة العقدة الخامسة..."
                   className="flex-1 bg-transparent border-none focus:ring-0 text-xl text-white px-4 text-right placeholder:text-slate-800"
                   onKeyPress={(e) => e.key === 'Enter' && handleIgnite()}
                 />

                 <button 
                    onClick={handleIgnite}
                    disabled={loading || !directive.trim()}
                    className="w-14 h-14 bg-cyan-600 hover:bg-white text-black rounded-full flex items-center justify-center font-black text-2xl transition-all shadow-xl active:scale-90 disabled:opacity-30"
                 >
                   {loading ? '..' : '↵'}
                 </button>
              </div>
           </div>
           
           {/* Virtual Home Indicator */}
           <div className="mt-6 w-32 h-1 bg-white/10 rounded-full"></div>
        </div>

      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.6s var(--ease-out-expo) forwards; }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-shimmer { animation: shimmer 4s infinite linear; }
      `}</style>
    </div>
  );
};
