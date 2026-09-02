
import React, { useState, useRef, useEffect } from 'react';
import { traceNeuralTarget, sendNeuralSMSAndTrack } from '../services/geminiService';
import { TrackingResult, Language } from '../types';

export const NeuralTracker: React.FC<{ language: Language }> = ({ language }) => {
  const [trackerMode, setTrackerMode] = useState<'standard' | 'sms_precision'>('standard');
  const [input, setInput] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const [traceLog, setTraceLog] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const startTracking = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (trackerMode === 'standard' && !input.trim() && !imagePreview) return;
    if (trackerMode === 'sms_precision' && (!input.trim() || !smsMessage.trim())) return;

    setLoading(true);
    setScanning(true);
    setResult(null);
    setTraceLog([]);

    // Custom logs based on mode
    let logs: string[] = [];
    if (trackerMode === 'standard') {
        logs = [
          "[SYSTEM] INITIATING_NEURAL_LINK...",
          "[TRACE] SCANNING_CELLULAR_NODES...",
          "INTERCEPTING_SIGNAL_PACKETS...",
          "TRIANGULATING_GPS_COORDINATES...",
          "MATCHING_VISUAL_SIGNATURES...",
          "DECRYPTING_LOCATION_STAMP...",
          "TARGET_ACQUIRED_STABLE_LINK."
        ];
    } else {
        logs = [
          "[SMS_GATEWAY] ENCRYPTING_PAYLOAD...",
          "[GMAIL_SMTP] BYPASSING_SPAM_FILTERS...",
          "[NETWORK] INJECTING_SILENT_PING...",
          "[CARRIER] HANDSHAKE_ACKNOWLEDGED...",
          "[GPS] TRIANGULATION_PRECISION_MODE: ACTIVE...",
          "TARGET_DEVICE_LOCKED_VIA_SMS_LINK."
        ];
    }

    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setTraceLog(prev => [...prev, `${logs[i]}`]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1200);

    try {
      let traceData: TrackingResult;
      if (trackerMode === 'sms_precision') {
        traceData = await sendNeuralSMSAndTrack(input, smsMessage, language);
      } else {
        traceData = await traceNeuralTarget(input || "Image_Recognition_Target", imagePreview ? 'image' : 'text', language);
      }
      setResult(traceData);
    } catch (err) {
      setTraceLog(prev => [...prev, "❌ [ERROR] NEURAL_SYNC_LOST_TARGET_STEALTH_MODE"]);
    } finally {
      setLoading(false);
      setScanning(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto space-y-8 px-6 pb-48 text-right font-arabic selection:bg-red-600 selection:text-white">
      
      {/* Tracker HUD Header */}
      <div className="bg-[#050505] rounded-[4rem] p-12 shadow-[0_0_100px_rgba(220,38,38,0.1)] border border-red-900/20 -mt-10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.05)_0%,transparent_70%)]"></div>
        <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-red-600 via-transparent to-transparent animate-pulse"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
          <div className="flex items-center gap-8">
            <div className={`w-24 h-24 rounded-[2.5rem] border-2 flex items-center justify-center text-5xl transition-all duration-1000 ${scanning ? 'bg-red-600 border-red-400 shadow-[0_0_60px_rgba(220,38,38,0.6)] animate-ping' : 'bg-slate-900 border-white/5 opacity-50'}`}>
               {trackerMode === 'sms_precision' ? '📩' : '🎯'}
            </div>
            <div>
               <h2 className="text-5xl font-black text-white tracking-tighter">رادار <span className="text-red-600">التعقب</span> النوروني</h2>
               <div className="flex gap-4 mt-4">
                  <button 
                    onClick={() => setTrackerMode('standard')}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${trackerMode === 'standard' ? 'bg-red-600 text-white' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                  >
                    Standard_Trace
                  </button>
                  <button 
                    onClick={() => setTrackerMode('sms_precision')}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${trackerMode === 'sms_precision' ? 'bg-white text-black' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                  >
                    SMS_Precision_Link
                  </button>
               </div>
            </div>
          </div>

          <form onSubmit={startTracking} className="flex-1 w-full max-w-2xl relative space-y-4">
             {trackerMode === 'standard' ? (
               <div className="relative group">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="أدخل رقماً، اسماً، أو حساباً للتواصل..."
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-full px-12 py-6 text-xl text-white focus:outline-none focus:ring-4 focus:ring-red-600/20 transition-all placeholder:text-slate-800"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-3">
                     <button 
                       type="button"
                       onClick={() => fileRef.current?.click()}
                       className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${imagePreview ? 'bg-red-600 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                     >
                       📸
                     </button>
                     <button 
                       type="submit"
                       disabled={loading}
                       className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-500 shadow-xl transition-all active:scale-95"
                     >
                       {loading ? '...' : '⚡'}
                     </button>
                  </div>
               </div>
             ) : (
               <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 space-y-4">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="رقم الهاتف المستهدف (+966...)"
                    className="w-full bg-transparent border-b border-white/10 px-4 py-3 text-lg text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-slate-700"
                  />
                  <textarea
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    placeholder="نص الرسالة الملغومة (سيتم حقن رابط التتبع تلقائياً)..."
                    className="w-full bg-transparent border-none px-4 py-3 text-sm text-slate-300 focus:ring-0 resize-none h-20 placeholder:text-slate-800"
                  />
                  <div className="flex justify-between items-center pt-2">
                     <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Gmail_Gateway_Ready</span>
                     <button 
                       type="submit"
                       disabled={loading}
                       className="bg-white text-black px-8 py-3 rounded-xl font-black text-xs uppercase hover:bg-red-600 hover:text-white transition-all shadow-lg"
                     >
                       {loading ? 'Injecting...' : 'Send & Triangulate 📡'}
                     </button>
                  </div>
               </div>
             )}
             <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </form>
        </div>
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Radar & Map Simulation View */}
        <div className="lg:col-span-2 bg-[#020202] rounded-[4rem] border border-red-900/10 p-4 relative overflow-hidden h-[650px] shadow-2xl flex items-center justify-center">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
           
           {/* Neural Map Grid */}
           <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(220,38,38,0.05)_1px,transparent_1px)] bg-[size:30px_30px] opacity-40"></div>

           {result ? (
             <div className="h-full w-full relative animate-fadeIn">
                {/* Simulated High-Tech Map Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-[500px] h-[500px] rounded-full border border-red-600/10 animate-[spin_20s_linear_infinite]"></div>
                   <div className="w-[300px] h-[300px] rounded-full border-2 border-red-600/5 animate-[spin_10s_linear_infinite_reverse]"></div>
                </div>

                {/* Target Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group">
                   <div className="w-16 h-16 bg-red-600/20 rounded-full animate-ping absolute -inset-4"></div>
                   <div className="w-8 h-8 bg-red-600 border-2 border-white rounded-full shadow-[0_0_40px_red] flex items-center justify-center text-white text-xs font-black relative z-10">
                      ID
                   </div>
                   <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-72 bg-black/90 backdrop-blur-3xl p-6 rounded-[2rem] border border-red-500/30 shadow-2xl scale-110">
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-[9px] font-black text-red-500 uppercase">Target_Acquired</span>
                         <span className="text-[10px] text-white/40">PROB: {result.matchProbability}%</span>
                      </div>
                      <h4 className="text-xl font-black text-white">{result.targetName}</h4>
                      <p className="text-[11px] text-red-400 font-bold mt-1">📍 {result.locationName}</p>
                      
                      {result.networkProvider && (
                        <div className="mt-3 pt-3 border-t border-white/10 flex justify-between text-[9px] font-bold text-slate-300">
                           <span>Carrier: {result.networkProvider}</span>
                           <span className="text-emerald-500">{result.signalType}</span>
                        </div>
                      )}

                      <div className="mt-2 flex justify-between text-[8px] font-mono text-slate-500">
                         <span>LAT: {result.coordinates.lat}</span>
                         <span>LNG: {result.coordinates.lng}</span>
                      </div>
                   </div>
                   {/* Connection Line to Info */}
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-t from-red-600 to-transparent"></div>
                </div>

                {/* Corner Telemetry HUD */}
                <div className="absolute bottom-10 left-10 p-6 bg-black/60 backdrop-blur-xl border border-white/5 rounded-3xl space-y-4">
                   <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Signal_Status: SECURE</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-red-600 animate-ping"></div>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Active_Tracking: ON</span>
                   </div>
                </div>

                <div className="absolute top-10 right-10 p-6 bg-black/60 border border-white/5 rounded-3xl max-w-xs">
                   <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Vocal_Intelligence_Brief</h5>
                   <p className="text-xs text-slate-300 leading-relaxed italic">"{result.vocalIntel}"</p>
                </div>
             </div>
           ) : (
             <div className="h-full w-full flex flex-col items-center justify-center gap-10 opacity-20 transition-all duration-700">
                <div className="relative">
                   <div className={`w-64 h-64 border-2 border-red-900/30 rounded-full flex items-center justify-center ${scanning ? 'animate-pulse' : ''}`}>
                      <div className={`w-40 h-40 border-4 border-red-600/10 rounded-full ${scanning ? 'animate-ping' : ''}`}></div>
                   </div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10rem] grayscale select-none">📡</span>
                   </div>
                </div>
                <div className="text-center space-y-2">
                   <p className="text-3xl font-black text-white uppercase tracking-[1em]">{scanning ? 'Triangulating...' : 'Scanning...'}</p>
                   <p className="text-xs font-bold text-red-900 uppercase">Search_Nodes_Idle</p>
                </div>
             </div>
           )}
        </div>

        {/* Intelligence Log & Control Side */}
        <div className="space-y-8">
           {/* Intelligence Trace Log */}
           <div className="bg-[#0a0a0a] rounded-[3.5rem] p-10 border border-white/5 flex flex-col h-[400px] shadow-2xl relative">
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-6">
                 <h3 className="text-[11px] font-black text-red-600 uppercase tracking-widest">Trace_Activity_Stream</h3>
                 <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar font-mono text-[10px] space-y-3 dir-ltr text-left">
                 {traceLog.map((log, i) => (
                   <div key={i} className={`animate-fadeIn pl-4 border-l-2 ${log.includes('TARGET') || log.includes('LOCKED') ? 'border-red-600 text-red-400 font-black' : 'border-slate-800 text-slate-600'}`}>
                      <span className="opacity-20 mr-3">[{new Date().toLocaleTimeString()}]</span> {log}
                   </div>
                 ))}
                 {traceLog.length === 0 && <div className="text-slate-900 italic py-20 text-center uppercase tracking-widest">System_Awaiting_Command</div>}
              </div>
           </div>

           {/* Results Summary Card */}
           {result && (
             <div className="bg-red-600/5 border border-red-500/20 rounded-[3.5rem] p-10 space-y-8 animate-fadeIn shadow-xl">
                <div className="space-y-2">
                   <h4 className="text-xs font-black text-red-500 uppercase tracking-widest">Social_Media_Footprint</h4>
                   <div className="flex flex-wrap gap-2">
                      {result.socialFootprint.map(s => (
                        <span key={s} className="px-4 py-2 bg-black border border-white/5 rounded-xl text-[10px] font-bold text-white hover:border-red-500 transition-all cursor-pointer">@{s}</span>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-red-500/10 pt-8">
                   <div>
                      <span className="text-[9px] text-slate-500 font-black uppercase">Last Seen</span>
                      <p className="text-white font-bold">{result.lastSeen}</p>
                   </div>
                   <div>
                      <span className="text-[9px] text-slate-500 font-black uppercase">Accuracy</span>
                      <p className="text-emerald-500 font-black">{result.matchProbability}% High</p>
                   </div>
                </div>

                <button 
                   onClick={() => window.open(`https://www.google.com/maps?q=${result.coordinates.lat},${result.coordinates.lng}`, '_blank')}
                   className="w-full py-6 rounded-3xl bg-white text-black font-black text-sm uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-2xl"
                >
                   Open_Real_Maps_Link 🗺️
                </button>
             </div>
           )}

           {/* Feature Highlights */}
           {!result && !loading && (
             <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'التعقب بالرقم', icon: '📞' },
                  { label: 'بصمة الصورة', icon: '👤' },
                  { label: 'الأثر الاجتماعي', icon: '🌐' },
                  { label: 'دقة الـ 5G', icon: '📡' }
                ].map(f => (
                  <div key={f.label} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] flex flex-col items-center gap-3 opacity-40 hover:opacity-100 transition-opacity">
                     <span className="text-3xl">{f.icon}</span>
                     <span className="text-[9px] font-black text-white uppercase tracking-widest">{f.label}</span>
                  </div>
                ))}
             </div>
           )}
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};
