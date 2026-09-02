
import React, { useState, useEffect, useRef } from 'react';

export const AuraAudio: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackName, setTrackName] = useState('Neural_Symphony_01');
  const [library, setLibrary] = useState<{name: string, url: string}[]>([]);
  const [bars, setBars] = useState<number[]>(Array(64).fill(10));
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLibrary([{ name: file.name, url }, ...library]);
      setTrackName(file.name);
      if(audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
        initAudioContext();
      }
    }
  };

  const initAudioContext = () => {
    if (audioContextRef.current) return;
    
    const audio = audioRef.current;
    if (!audio) return;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = ctx.createAnalyser();
    const source = ctx.createMediaElementSource(audio);
    
    source.connect(analyser);
    analyser.connect(ctx.destination);
    
    analyser.fftSize = 128;
    audioContextRef.current = ctx;
    analyserRef.current = analyser;
    
    animate();
  };

  const animate = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // تحويل البيانات إلى نسب مئوية للأشرطة
    const processed = Array.from(dataArray).map(val => (val / 255) * 100);
    setBars(processed);
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else {
      audioRef.current.play();
      initAudioContext();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col h-full space-y-12 animate-fadeIn font-arabic text-right pb-40">
      
      {/* Audio Hub Main Panel */}
      <div className="bg-[#020202] rounded-[5rem] p-16 shadow-4xl border border-cyan-500/20 relative overflow-hidden flex flex-col items-center gap-12">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05),transparent)]"></div>
         
         {/* The REAL Visualizer */}
         <div className="flex items-end gap-1 h-72 w-full px-10">
            {bars.map((h, i) => (
              <div 
                key={i} 
                className="flex-1 rounded-t-full bg-gradient-to-t from-cyan-950 via-cyan-500 to-white transition-all duration-75 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                style={{ height: `${Math.max(5, h)}%` }}
              ></div>
            ))}
         </div>

         <div className="text-center space-y-4">
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase truncate max-w-3xl">{trackName}</h2>
            <div className="flex items-center justify-center gap-4 text-cyan-500 font-bold uppercase tracking-[0.3em] text-xs">
               <span className="animate-pulse">● LIVE_SPECTRUM</span>
               <span>//</span>
               <span>V8_AUDIO_CORE</span>
            </div>
         </div>

         {/* Hidden Audio Element */}
         <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

         {/* Professional Controls */}
         <div className="flex items-center gap-16">
            <button className="text-4xl text-slate-800 hover:text-white transition-colors">⏮</button>
            <button 
              onClick={togglePlay}
              className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-5xl text-black shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:scale-110 active:scale-95 transition-all"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button className="text-4xl text-slate-800 hover:text-white transition-colors">⏭</button>
         </div>

         <div className="w-full max-w-xl flex items-center gap-8">
            <button 
              onClick={() => fileRef.current?.click()}
              className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl text-[10px] font-black text-cyan-500 uppercase tracking-widest hover:bg-cyan-600 hover:text-black transition-all"
            >
              تحميل مقطع صوتي 🎧
            </button>
            <input type="file" ref={fileRef} className="hidden" accept="audio/*" onChange={handleFileUpload} />
         </div>
      </div>

      {/* Recent Tracks List */}
      <div className="space-y-6">
         <h3 className="text-2xl font-black text-white mr-6 uppercase tracking-widest">Sovereign_Records</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {library.map((track, i) => (
              <button 
                key={i} 
                onClick={() => {
                  setTrackName(track.name);
                  if(audioRef.current) {
                    audioRef.current.src = track.url;
                    audioRef.current.play();
                    setIsPlaying(true);
                  }
                }}
                className={`p-6 rounded-[2.5rem] border flex items-center justify-between transition-all group ${trackName === track.name ? 'bg-cyan-600 border-cyan-400' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
              >
                <span className={`text-[10px] font-black ${trackName === track.name ? 'text-black' : 'text-slate-500'}`}>0{i+1}_LINK</span>
                <div className="text-right flex-1 px-8">
                   <div className={`font-black truncate ${trackName === track.name ? 'text-black' : 'text-white'}`}>{track.name}</div>
                   <div className={`text-[8px] font-bold ${trackName === track.name ? 'text-cyan-900' : 'text-slate-600'}`}>SARAH_VAULT_DECRYPTED</div>
                </div>
                <div className="text-2xl">🎵</div>
              </button>
            ))}
         </div>
      </div>
    </div>
  );
};
