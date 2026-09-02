
import React, { useState, useEffect, useRef } from 'react';
import { analyzeBioData } from '../services/geminiService';
import { BioMetrics, Language } from '../types';

export const BioInterface: React.FC<{ language: Language }> = ({ language }) => {
  const [metrics, setMetrics] = useState<BioMetrics | null>(null);
  const [isSensing, setIsSensing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) { console.warn("Camera blocked"); }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsSensing(true);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    
    const base64 = canvas.toDataURL('image/jpeg').split(',')[1];
    
    try {
      const data = await analyzeBioData(base64, language);
      setMetrics({
        ...data,
        gestures: ['Hand_Wave', 'Eye_Focus'] // Mocked detected gestures
      });
      
      // Broadcast logic: In a real app, this would update a global store or context
      // for the HoloMatrix to "see" and react to.
      localStorage.setItem('sarah_last_bio_sync', JSON.stringify({
        humanDetected: data.humanDetected,
        mood: data.mood,
        timestamp: Date.now()
      }));

    } catch (err) {
      console.error(err);
    } finally {
      setIsSensing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn font-arabic pb-40">
      <div className="bg-[#050505] rounded-[4rem] p-12 border border-emerald-500/20 shadow-[0_0_120px_rgba(16,185,129,0.1)] relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-pulse"></div>
         <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
            <div className="flex items-center gap-8">
               <div className="w-24 h-24 bg-emerald-600/10 rounded-[2.5rem] flex items-center justify-center text-5xl border border-emerald-500/20 shadow-2xl">🧬</div>
               <div>
                  <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">الاستشعار <span className="text-emerald-500">الحيوي</span></h2>
                  <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-4">Bio_Digital_Sync_Protocol_v1.0</p>
               </div>
            </div>
            <button 
              onClick={captureAndAnalyze}
              disabled={isSensing}
              className="bg-emerald-600 hover:bg-emerald-500 text-black px-16 py-6 rounded-[2.5rem] font-black text-2xl shadow-3xl transition-all active:scale-95"
            >
              {isSensing ? 'جاري الاستشعار...' : 'بدء المسح الحيوي ⚡'}
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-7 bg-black rounded-[4rem] border border-white/5 relative overflow-hidden h-[600px] shadow-2xl flex items-center justify-center">
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 border-[30px] border-black/80 pointer-events-none"></div>
            <div className="absolute top-10 left-10 text-[9px] font-black text-emerald-500 uppercase tracking-[0.5em] animate-pulse">Live_Bio_Feed</div>
         </div>

         <div className="lg:col-span-5 space-y-8">
            {metrics ? (
              <div className="bg-white/5 backdrop-blur-3xl border border-emerald-500/20 p-12 rounded-[4rem] shadow-2xl h-full flex flex-col space-y-12 animate-slideInRight">
                 <div className="space-y-4">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Detected_Emotional_State</span>
                    <h3 className="text-6xl font-black text-white uppercase">{metrics.mood}</h3>
                 </div>
                 
                 <div className="space-y-10">
                    {[
                      { label: 'Attention_Level', val: metrics.attentionLevel, color: 'bg-blue-500' },
                      { label: 'Environment_Noise', val: metrics.noiseLevel, color: 'bg-amber-500' }
                    ].map(m => (
                      <div key={m.label} className="space-y-4">
                         <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                            <span>{m.label}</span>
                            <span>{m.val}%</span>
                         </div>
                         <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${m.color} shadow-[0_0_15px_currentColor]`} style={{ width: `${m.val}%` }}></div>
                         </div>
                      </div>
                    ))}
                 </div>

                 {metrics.gestures && (
                   <div className="flex flex-wrap gap-2">
                     {metrics.gestures.map(g => (
                       <span key={g} className="px-4 py-1.5 bg-blue-600/10 border border-blue-600/30 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest">{g}</span>
                     ))}
                   </div>
                 )}

                 <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 flex items-center justify-between">
                    <div>
                       <span className="text-[10px] font-black text-slate-600 uppercase block mb-1">Human_Presence</span>
                       <span className="text-xl font-black text-emerald-500">{metrics.humanDetected ? 'VERIFIED' : 'NONE'}</span>
                    </div>
                    <div className="text-5xl">{metrics.humanDetected ? '👤' : '🌑'}</div>
                 </div>
              </div>
            ) : (
              <div className="h-full bg-black/40 border border-white/5 rounded-[4rem] flex flex-col items-center justify-center opacity-10 grayscale gap-10">
                 <div className="text-9xl animate-float">🧬</div>
                 <p className="text-2xl font-black uppercase tracking-[0.5em]">Awaiting_Bio_Link</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};
