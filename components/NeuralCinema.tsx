
import React, { useState, useRef, useEffect } from 'react';
import { GeneratedVideo } from '../types';

export const NeuralCinema: React.FC = () => {
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [library, setLibrary] = useState<{id: string, url: string, name: string}[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [glowColor, setGlowColor] = useState('rgba(59, 130, 246, 0.5)');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newNode = { id: Math.random().toString(), url, name: file.name };
      setLibrary([newNode, ...library]);
      setActiveVideoUrl(url);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const time = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
    videoRef.current.currentTime = time;
  };

  // ميزة Ambilight: محاكاة تفاعل الإضاءة مع الفيديو
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const colors = ['rgba(59,130,246,0.4)', 'rgba(16,185,129,0.4)', 'rgba(139,92,246,0.4)', 'rgba(239,68,68,0.4)'];
        setGlowColor(colors[Math.floor(Math.random() * colors.length)]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div className="flex flex-col h-full space-y-12 animate-fadeIn font-arabic text-right pb-40">
      
      {/* Search & Upload Header */}
      <div className="bg-slate-900 border border-white/5 p-8 rounded-[3rem] flex justify-between items-center shadow-2xl">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-4xl shadow-xl border border-blue-500/20">📽️</div>
            <div>
               <h2 className="text-3xl font-black text-white">سينما <span className="text-blue-500">صارة</span> الموحدة</h2>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural_Cinema_Engine // ACTIVE_CORE</p>
            </div>
         </div>
         <button 
           onClick={() => fileRef.current?.click()}
           className="bg-white text-black px-10 py-4 rounded-2xl font-black text-sm uppercase hover:bg-blue-500 hover:text-white transition-all shadow-xl"
         >
           حقن ملف فيديو 📥
         </button>
         <input type="file" ref={fileRef} className="hidden" accept="video/*" onChange={handleFileUpload} />
      </div>

      {/* Cinematic Viewport */}
      <div className="relative w-full aspect-video bg-black rounded-[4rem] overflow-hidden border-8 border-white/5 transition-shadow duration-1000 group"
           style={{ boxShadow: `0 0 100px ${glowColor}` }}>
        {activeVideoUrl ? (
          <>
            <video 
              ref={videoRef}
              src={activeVideoUrl}
              className="w-full h-full object-contain"
              onTimeUpdate={(e) => setProgress((e.currentTarget.currentTime / e.currentTarget.duration) * 100)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              autoPlay
            />
            
            {/* Custom Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-12 space-y-8">
               <div className="space-y-4">
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={progress} 
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-white/10 accent-blue-500 rounded-full appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between items-center text-white">
                     <div className="flex items-center gap-8">
                        <button onClick={togglePlay} className="text-4xl hover:scale-110 transition-transform">
                           {isPlaying ? '⏸' : '▶'}
                        </button>
                        <div className="flex items-center gap-3">
                           <span className="text-lg">🔊</span>
                           <input 
                              type="range" min="0" max="1" step="0.1" 
                              value={volume}
                              onChange={(e) => {
                                 const v = parseFloat(e.target.value);
                                 setVolume(v);
                                 if(videoRef.current) videoRef.current.volume = v;
                              }}
                              className="w-24 h-1 bg-white/20 accent-white rounded-full appearance-none"
                           />
                        </div>
                     </div>
                     <button 
                       onClick={() => videoRef.current?.requestFullscreen()}
                       className="text-2xl opacity-50 hover:opacity-100 transition-opacity"
                     >⛶</button>
                  </div>
               </div>
               <h3 className="text-2xl font-black text-white">{library.find(v => v.url === activeVideoUrl)?.name}</h3>
            </div>
          </>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center gap-8 opacity-20 text-center">
             <div className="text-[15rem] animate-pulse grayscale">🎬</div>
             <p className="text-4xl font-black uppercase tracking-[0.5em]">Awaiting_Neural_Stream</p>
          </div>
        )}
      </div>

      {/* Media Library */}
      <div className="space-y-8">
         <h3 className="text-2xl font-black text-white mr-4">الأرشيف المحلي <span className="text-blue-500">({library.length})</span></h3>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {library.map(video => (
               <button 
                 key={video.id}
                 onClick={() => setActiveVideoUrl(video.url)}
                 className={`aspect-video rounded-[2.5rem] bg-slate-900 border-4 transition-all hover:scale-105 overflow-hidden flex items-center justify-center relative group ${activeVideoUrl === video.url ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'border-white/5'}`}
               >
                  <span className="text-3xl">🎞️</span>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                     <p className="text-[10px] text-white font-black truncate">{video.name}</p>
                  </div>
               </button>
            ))}
            <div 
              onClick={() => fileRef.current?.click()}
              className="aspect-video rounded-[2.5rem] border-4 border-dashed border-white/5 flex flex-col items-center justify-center text-slate-700 hover:border-blue-500 hover:text-blue-500 cursor-pointer transition-all"
            >
               <span className="text-3xl">➕</span>
               <span className="text-[9px] font-black uppercase mt-2">New_Buffer</span>
            </div>
         </div>
      </div>
    </div>
  );
};
