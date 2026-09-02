
import React, { useState, useEffect, useRef } from 'react';
import { architectTVApp, searchTVContent, getTVDialogueResponse, generateCastSession } from '../services/geminiService';
import { Language, TVAppConfig, BroadcastProtocol, TVDialogueResponse, SignalAnalysis, DetectedSignal, CastPacket } from '../types';

export const TVControl: React.FC<{ language: Language }> = ({ language }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'remote' | 'architect' | 'dialogue' | 'signal_radar' | 'phone_mirror'>('dialogue');
  const [protocol, setProtocol] = useState<BroadcastProtocol>('wifi');
  const [dialogueHistory, setDialogueHistory] = useState<TVDialogueResponse[]>([]);
  
  // Radar & Cast States
  const [isScanning, setIsScanning] = useState(false);
  const [detectedSignals, setDetectedSignals] = useState<DetectedSignal[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<DetectedSignal | null>(null);
  const [signalAnalysis, setSignalAnalysis] = useState<SignalAnalysis | null>(null);
  const [packets, setPackets] = useState<CastPacket[]>([]);
  const [radarRotation, setRadarRotation] = useState(0);
  const [isEstablishing, setIsEstablishing] = useState(false);
  const [bitrate, setBitrate] = useState(0);
  const [latency, setLatency] = useState(0);
  const [castMode, setCastMode] = useState<'video' | 'app' | 'mirror' | 'code'>('video');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const radarIntervalRef = useRef<number | null>(null);
  const packetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isScanning) {
      radarIntervalRef.current = window.setInterval(() => {
        setRadarRotation(prev => (prev + 5) % 360);
      }, 30);
    } else {
      if (radarIntervalRef.current) clearInterval(radarIntervalRef.current);
    }
    return () => {
      if (radarIntervalRef.current) clearInterval(radarIntervalRef.current);
    };
  }, [isScanning]);

  useEffect(() => {
    if (isStreaming && selectedSignal) {
      packetTimerRef.current = window.setInterval(() => {
        const newPacket: CastPacket = {
          timestamp: Date.now(),
          bytes: Array.from({length: 8}, () => Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0')).join(' '),
          status: Math.random() > 0.05 ? 'sent' : 'error',
          type: 'stream'
        };
        setPackets(prev => [newPacket, ...prev].slice(0, 15));
        setBitrate(Math.floor(Math.random() * 100) + 400); // 400-500 Mbps
        setLatency(parseFloat((Math.random() * 3 + 1.5).toFixed(1))); // 1.5 - 4.5 ms
      }, 200);
    } else {
      if (packetTimerRef.current) clearInterval(packetTimerRef.current);
      setBitrate(0);
      setLatency(0);
    }
    return () => {
      if (packetTimerRef.current) clearInterval(packetTimerRef.current);
    };
  }, [isStreaming, selectedSignal]);

  const startScan = () => {
    setIsScanning(true);
    setDetectedSignals([]);
    setSelectedSignal(null);
    setSignalAnalysis(null);

    const mockSignals: DetectedSignal[] = [
      { id: 'TV-1', name: 'Samsung Neo QLED 8K', protocol: 'wifi', strength: 98, security: 'wpa3', macAddress: 'AA:BB:CC:DD:EE:01', distance: '1.2m', coordinates: { x: 50, y: 40 } },
      { id: 'TV-2', name: 'LG OLED evo C3', protocol: 'wifi', strength: 85, security: 'wpa3', macAddress: '11:22:33:44:55:66', distance: '3.5m', coordinates: { x: -70, y: -20 } },
      { id: 'SARAH-CORE', name: 'Sarah Neural Interface', protocol: 'neural_link', strength: 100, security: 'proprietary', macAddress: 'DE:AD:BE:EF:CA:FE', distance: '0.1m', coordinates: { x: 0, y: 0 } },
    ];

    setTimeout(() => {
      setDetectedSignals(mockSignals);
      setIsScanning(false);
    }, 2500);
  };

  const handleConnect = async (signal: DetectedSignal) => {
    setSelectedSignal(signal);
    setIsEstablishing(true);
    setPackets([{ timestamp: Date.now(), bytes: 'INIT_HANDSHAKE', status: 'sent', type: 'handshake' }]);
    
    try {
      await new Promise(r => setTimeout(r, 2000));
      const result = await generateCastSession(signal, language);
      setSignalAnalysis(result);
      setView('phone_mirror');
    } catch (err) {
      console.error(err);
    } finally {
      setIsEstablishing(false);
    }
  };

  const handleDisconnect = () => {
    setIsStreaming(false);
    setSelectedSignal(null);
    setSignalAnalysis(null);
    setPackets([]);
    setShowDetails(false);
    setView('signal_radar');
  };

  const startCasting = () => {
    setIsStreaming(true);
  };

  const stopCasting = () => {
    setIsStreaming(false);
    setPackets([]);
  };

  const handleDialogue = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const result = await getTVDialogueResponse(query, language);
      setDialogueHistory([result, ...dialogueHistory]);
      setQuery('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto space-y-8 px-6 pb-40 text-right animate-fadeIn selection:bg-cyan-500 selection:text-black font-arabic">
      
      {/* Sarah Neural Hub Header */}
      <div className="bg-slate-950/80 backdrop-blur-3xl rounded-[3.5rem] p-10 shadow-2xl border border-cyan-500/20 -mt-10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.1),transparent)]"></div>
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent group-hover:via-white transition-all duration-1000"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-10">
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-[2rem] border-2 flex items-center justify-center text-4xl transition-all duration-700 ${view === 'phone_mirror' || selectedSignal ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.4)] animate-pulse' : 'bg-slate-900 border-white/5'}`}>
               {selectedSignal ? '📱' : '📡'}
            </div>
            <div>
               <h2 className="text-4xl font-black text-white tracking-tighter">صارة <span className="text-cyan-400">Cast</span></h2>
               <div className="flex items-center gap-3 mt-1">
                 <div className={`w-2 h-2 rounded-full ${selectedSignal ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
                 <p className="text-cyan-800 font-mono text-[10px] tracking-[0.3em] uppercase">
                   {selectedSignal ? `Streaming_to: ${selectedSignal.name}` : 'Awaiting_Neural_Broadcast'}
                 </p>
               </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {selectedSignal && (
              <div className="flex bg-black/40 border border-white/5 rounded-2xl p-1 gap-2">
                 <button onClick={() => setShowDetails(!showDetails)} className="px-4 py-2 text-[10px] font-black text-cyan-400 hover:bg-white/5 rounded-xl transition-all">DETAILS</button>
                 <button onClick={handleDisconnect} className="px-4 py-2 text-[10px] font-black text-red-500 hover:bg-red-500/10 rounded-xl transition-all">DISCONNECT</button>
              </div>
            )}
            <div className="flex bg-slate-900/50 p-2 rounded-3xl gap-2 border border-white/5 backdrop-blur-md">
              {['wifi', 'neural_link', 'bluetooth'].map(p => (
                <button
                  key={p}
                  onClick={() => setProtocol(p as any)}
                  className={`px-6 py-3 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${protocol === p ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {p.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-10">
            {[
              { id: 'dialogue', label: 'المساعد الذكي 💬' },
              { id: 'signal_radar', label: 'رادار الاكتشاف 🛰️' },
              { id: 'phone_mirror', label: 'بث الهاتف (Cast) 📱' },
              { id: 'remote', label: 'التحكم 🎮' }
            ].map(v => (
              <button
                key={v.id}
                onClick={() => setView(v.id as any)}
                className={`px-8 py-3 rounded-2xl text-[11px] font-black transition-all border ${view === v.id ? 'bg-white text-black border-white shadow-xl' : 'text-slate-500 border-white/5 hover:border-white/20'}`}
              >
                {v.label}
              </button>
            ))}
        </div>
      </div>

      {/* Connection Detail Overlay */}
      {showDetails && selectedSignal && (
        <div className="bg-cyan-500/10 border border-cyan-500/30 p-8 rounded-[3rem] animate-fadeIn grid grid-cols-1 md:grid-cols-3 gap-8 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4"><button onClick={() => setShowDetails(false)} className="text-cyan-500 hover:text-white">✕</button></div>
           <div>
              <span className="text-[10px] font-black text-cyan-500 uppercase block mb-2">Device_Specs</span>
              <p className="text-white font-bold">{selectedSignal.name}</p>
              <p className="text-slate-500 text-xs font-mono">{selectedSignal.macAddress}</p>
           </div>
           <div>
              <span className="text-[10px] font-black text-cyan-500 uppercase block mb-2">Security_Protocol</span>
              <p className="text-white font-bold uppercase">{selectedSignal.security}</p>
              <p className="text-slate-500 text-xs font-mono">Hash: {signalAnalysis?.securityHash.substring(0, 12)}...</p>
           </div>
           <div>
              <span className="text-[10px] font-black text-cyan-500 uppercase block mb-2">Link_Stability</span>
              <div className="flex items-center gap-4">
                 <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500" style={{ width: `${signalAnalysis?.protocolStability || 95}%` }}></div>
                 </div>
                 <span className="text-white font-black">{signalAnalysis?.protocolStability || 95}%</span>
              </div>
           </div>
        </div>
      )}

      <div className="flex-1">
        {isEstablishing && (
          <div className="py-24 flex flex-col items-center gap-8 animate-fadeIn">
            <div className="relative w-32 h-32">
               <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
               <div className="absolute inset-0 border-t-4 border-cyan-400 rounded-full animate-spin"></div>
               <div className="absolute inset-4 bg-cyan-500/10 rounded-full animate-pulse flex items-center justify-center text-4xl">🔐</div>
            </div>
            <div className="text-center space-y-2">
               <h3 className="text-3xl font-black text-white">جاري مزامنة النواة النورونية...</h3>
               <p className="text-cyan-800 font-mono text-xs uppercase tracking-[0.4em]">Handshaking with {selectedSignal?.name}</p>
            </div>
          </div>
        )}

        {view === 'signal_radar' && !isEstablishing && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fadeIn">
            <div className="bg-slate-900/40 rounded-[3.5rem] p-12 border border-cyan-500/20 flex flex-col items-center justify-center relative overflow-hidden h-[650px] shadow-2xl backdrop-blur-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1),transparent_70%)]"></div>
              
              <div className="relative w-96 h-96 flex items-center justify-center">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="absolute border border-cyan-500/5 rounded-full" style={{ inset: `${i * 40}px` }}></div>
                ))}
                
                <div 
                  className="absolute top-1/2 left-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-white origin-left z-20 shadow-[0_0_20px_cyan]"
                  style={{ transform: `rotate(${radarRotation}deg)` }}
                ></div>

                {detectedSignals.map((sig) => (
                  <button
                    key={sig.id}
                    onClick={() => handleConnect(sig)}
                    className="absolute p-3 transition-all hover:scale-150 z-30 group"
                    style={{ transform: `translate(${sig.coordinates.x}px, ${sig.coordinates.y}px)` }}
                  >
                    <div className={`w-6 h-6 rounded-xl rotate-45 border-2 transition-all ${selectedSignal?.id === sig.id ? 'bg-white border-white animate-ping shadow-[0_0_30px_white]' : 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]'}`}></div>
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 border border-white/10 px-5 py-2 rounded-2xl text-[10px] text-cyan-400 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all font-black shadow-2xl">
                      {sig.name} • {sig.strength}%
                    </div>
                  </button>
                ))}

                <div className="w-14 h-14 bg-white rounded-[1.5rem] shadow-[0_0_50px_white] z-40 flex items-center justify-center rotate-45">
                   <div className="rotate-[-45deg] text-[10px] font-black text-black">OS</div>
                </div>
              </div>

              <div className="mt-16 w-full max-w-sm space-y-6">
                <button 
                  onClick={startScan}
                  disabled={isScanning}
                  className="w-full py-6 rounded-[2.5rem] bg-cyan-600 hover:bg-cyan-500 text-black font-black text-xl transition-all shadow-[0_0_40px_rgba(6,182,212,0.4)] active:scale-95"
                >
                  {isScanning ? 'جاري تمشيط المحيط...' : 'بدء اكتشاف الأجهزة'}
                </button>
              </div>
            </div>

            <div className="bg-slate-950/50 rounded-[3.5rem] p-12 border border-white/5 flex flex-col items-center justify-center text-center gap-8 opacity-20">
               <div className="text-[10rem] animate-pulse">🛰️</div>
               <div className="space-y-2">
                 <p className="text-3xl font-black text-white uppercase tracking-[0.5em]">System_Standby</p>
                 <p className="text-sm font-bold text-cyan-800">صارة جاهزة لاختراق حواجز البث والاقتران.</p>
               </div>
            </div>
          </div>
        )}

        {view === 'phone_mirror' && selectedSignal && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 animate-fadeIn h-full">
            {/* The "Virtual Phone" Controller */}
            <div className="lg:col-span-1 flex flex-col items-center">
               <div className="w-full max-w-[280px] bg-slate-900 rounded-[3.5rem] border-[12px] border-slate-950 p-6 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden h-[580px] flex flex-col">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-white/10 rounded-full"></div>
                  
                  <div className="flex justify-between items-center mb-8 pt-4">
                     <span className="text-[11px] font-black text-white">9:41</span>
                     <div className="flex gap-1.5">
                        <div className="w-4 h-4 bg-white/10 rounded-full flex items-center justify-center text-[8px]">📶</div>
                        <div className="w-4 h-4 bg-cyan-500 rounded-full"></div>
                     </div>
                  </div>

                  <div className="text-center mb-8">
                    <h4 className="text-xl font-black text-white tracking-tighter uppercase">Sarah_Handheld</h4>
                    <p className="text-[9px] text-cyan-500 font-mono mt-1">Status: Handshaked</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 flex-1">
                     {[
                       { id: 'video', label: 'Video Feed', icon: '🎬', color: 'bg-red-500' },
                       { id: 'app', label: 'App Inject', icon: '🏗️', color: 'bg-blue-600' },
                       { id: 'mirror', label: 'Screen Mirror', icon: '🖥️', color: 'bg-emerald-500' },
                       { id: 'code', label: 'Console', icon: '⌨️', color: 'bg-purple-600' }
                     ].map(app => (
                       <button 
                          key={app.id} 
                          onClick={() => setCastMode(app.id as any)}
                          className={`p-5 rounded-3xl border transition-all flex flex-col items-center gap-3 ${castMode === app.id ? 'bg-white border-white scale-110 shadow-2xl' : 'bg-slate-800/50 border-white/5 hover:bg-slate-800'}`}
                       >
                          <span className="text-3xl">{app.icon}</span>
                          <span className={`text-[9px] font-black uppercase tracking-widest ${castMode === app.id ? 'text-black' : 'text-slate-500'}`}>{app.label}</span>
                       </button>
                     ))}
                  </div>

                  <button 
                    onClick={isStreaming ? stopCasting : startCasting}
                    className={`w-full py-5 rounded-2xl font-black text-xs shadow-2xl transition-all ${isStreaming ? 'bg-red-600 text-white' : 'bg-cyan-600 text-black shadow-cyan-500/20'} mb-4`}
                  >
                    {isStreaming ? 'STOP STREAMING' : 'START NEURAL CAST'}
                  </button>
               </div>
            </div>

            {/* The "TV Preview" & Stream Logs */}
            <div className="lg:col-span-3 space-y-8 h-full">
               {/* Global Status Bar */}
               <div className="bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/5 px-10 py-4 flex justify-between items-center animate-slideDown">
                  <div className="flex gap-10">
                     <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Network_Speed</span>
                        <span className="text-xl font-black text-cyan-400">{isStreaming ? bitrate : 0} <span className="text-[10px]">Mbps</span></span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Neural_Delay</span>
                        <span className="text-xl font-black text-emerald-400">{isStreaming ? latency : 0} <span className="text-[10px]">ms</span></span>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${isStreaming ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
                        {isStreaming ? 'STREAMING_LIVE' : 'LINK_STANDBY'}
                     </div>
                  </div>
               </div>

               <div className="bg-slate-900 rounded-[4rem] border-[15px] border-slate-950 aspect-video relative overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.2)]">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                  
                  {isStreaming ? (
                    <div className="h-full w-full flex flex-col items-center justify-center gap-8 relative z-10 p-12 animate-fadeIn">
                       {castMode === 'video' ? (
                         <div className="flex flex-col items-center gap-6 animate-pulse">
                            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-4xl shadow-[0_0_50px_rgba(239,68,68,0.8)]">▶</div>
                            <h3 className="text-4xl font-black text-white uppercase tracking-[0.2em]">Live_Neural_Video_Feed</h3>
                         </div>
                       ) : castMode === 'app' ? (
                         <div className="w-full max-w-2xl grid grid-cols-2 gap-8">
                            {[...Array(4)].map((_, i) => (
                              <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col gap-4 animate-fadeIn" style={{ animationDelay: `${i*0.1}s` }}>
                                 <div className="w-12 h-2 bg-cyan-500 rounded-full"></div>
                                 <div className="h-20 bg-white/5 rounded-2xl"></div>
                              </div>
                            ))}
                         </div>
                       ) : (
                         <div className="text-center space-y-10">
                            <div className="text-[10rem] animate-float">📱</div>
                            <h3 className="text-5xl font-black text-white uppercase tracking-widest">Active Mirroring</h3>
                         </div>
                       )}

                       <div className="absolute bottom-10 flex gap-6">
                          <div className="px-10 py-4 bg-black/60 backdrop-blur-2xl rounded-full border border-white/10 text-[11px] font-black flex items-center gap-3">
                             <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                             AES_SECURE_TUNNEL
                          </div>
                          <div className="px-10 py-4 bg-black/60 backdrop-blur-2xl rounded-full border border-white/10 text-[11px] font-black flex items-center gap-3">
                             <span className="w-3 h-3 bg-cyan-500 rounded-full animate-ping"></span>
                             LATENCY: {latency}ms
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center opacity-30 gap-6">
                       <div className="text-8xl">📽️</div>
                       <p className="text-xl font-black uppercase tracking-widest">Awaiting_Neural_Stream</p>
                    </div>
                  )}

                  <div className="absolute top-10 right-12 bg-cyan-500 text-black px-8 py-3 rounded-2xl font-black text-xs shadow-2xl">
                     SYNC: {signalAnalysis?.pairingCode || '000-000'}
                  </div>
               </div>

               {/* Live Stream Terminal */}
               <div className="bg-black/90 rounded-[3rem] border border-cyan-500/10 p-10 font-mono shadow-2xl">
                  <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-6">
                     <span className="text-sm text-cyan-600 font-black uppercase tracking-[0.4em]">Neural_Packet_Traffic</span>
                     <span className="text-xs text-slate-500 uppercase font-black">{bitrate} Mbps Bitrate</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-40 overflow-y-auto no-scrollbar text-[10px]">
                     {packets.map((p, i) => (
                       <div key={i} className={`flex gap-4 ${p.status === 'error' ? 'text-red-500' : 'text-cyan-400 opacity-60'}`}>
                          <span className="opacity-20">[{new Date(p.timestamp).toLocaleTimeString()}]</span>
                          <span className="font-bold">TX_BYTE:</span>
                          <span className="truncate">{p.bytes}</span>
                          <span className="font-black">[{p.status.toUpperCase()}]</span>
                       </div>
                     ))}
                     {packets.length === 0 && <div className="text-slate-800 italic">SYSTEM_IDLE: AWAITING_STREAM_START</div>}
                  </div>
               </div>
            </div>
          </div>
        )}

        {view === 'dialogue' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl"></div>
               <div className="flex gap-6 relative z-10">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="بماذا يمكن لصارة مساعدتك في نظام التلفاز اليوم؟"
                    className="flex-1 bg-transparent border-none focus:ring-0 text-white p-6 text-2xl font-medium text-right placeholder-slate-800"
                    onKeyPress={(e) => e.key === 'Enter' && handleDialogue()}
                  />
                  <button onClick={handleDialogue} className="bg-cyan-600 px-10 py-6 rounded-3xl hover:bg-cyan-500 transition-all text-black font-black text-xl shadow-2xl shadow-cyan-500/20">تواصل</button>
               </div>
            </div>

            <div className="space-y-8">
               {dialogueHistory.map((msg, i) => (
                 <div key={i} className="bg-white/5 border border-white/10 p-12 rounded-[4rem] backdrop-blur-3xl animate-fadeIn space-y-10 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-500/20 group-hover:bg-cyan-400 transition-all duration-500"></div>
                    <p className="text-3xl text-slate-100 font-medium leading-relaxed text-right">{msg.message}</p>
                    <div className="flex flex-wrap gap-4 justify-end">
                       {msg.suggestions.map(s => (
                         <button 
                            key={s} 
                            onClick={() => { setQuery(s); handleDialogue(); }}
                            className="px-8 py-4 bg-cyan-500/5 border border-cyan-500/20 rounded-full text-sm font-black text-cyan-400 hover:bg-cyan-600 hover:text-white transition-all shadow-xl"
                         >
                            {s}
                         </button>
                       ))}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {view === 'remote' && (
          <div className="flex flex-col items-center py-10 animate-fadeIn">
             <div className="bg-slate-900/60 p-14 rounded-[6rem] border border-white/10 shadow-[0_0_120px_rgba(0,0,0,0.6)] max-w-sm w-full space-y-14 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white/5 to-transparent"></div>
                
                <div className="flex justify-center relative z-10">
                   <div className="w-64 h-64 rounded-full border-[15px] border-slate-950 flex items-center justify-center relative p-10 shadow-inner bg-slate-900 group">
                      <div className="absolute inset-0 bg-cyan-500/5 rounded-full animate-ping group-active:animate-none"></div>
                      <button className="absolute top-8 hover:text-cyan-400 text-4xl transition-all active:scale-90">▲</button>
                      <button className="absolute bottom-8 hover:text-cyan-400 text-4xl transition-all active:scale-90">▼</button>
                      <button className="absolute left-8 hover:text-cyan-400 text-4xl transition-all active:scale-90">◀</button>
                      <button className="absolute right-8 hover:text-cyan-400 text-4xl transition-all active:scale-90">▶</button>
                      <div className="w-28 h-28 bg-cyan-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-[0_0_50px_rgba(6,182,212,0.8)] cursor-pointer active:scale-90 transition-transform">OK</div>
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-8 relative z-10">
                   {[
                     { label: '🏠', color: 'bg-slate-800' },
                     { label: '↩', color: 'bg-slate-800' },
                     { label: '🎙️', color: 'bg-cyan-900 text-cyan-400' },
                     { label: 'MUTE', color: 'bg-slate-800 text-[10px]' },
                     { label: 'VOL+', color: 'bg-slate-800 text-[10px]' },
                     { label: 'VOL-', color: 'bg-slate-800 text-[10px]' }
                   ].map(btn => (
                     <button key={btn.label} className={`h-20 rounded-[2.5rem] hover:bg-white hover:text-black transition-all flex items-center justify-center shadow-2xl active:scale-95 font-black ${btn.color}`}>
                       {btn.label}
                     </button>
                   ))}
                </div>
             </div>
          </div>
        )}
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-40px) scale(1.05); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};
