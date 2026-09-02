
import React, { useState, useEffect, useRef } from 'react';
import { GeneratedVideo, GeneratedImage } from '../types';

interface CinematicPlayerProps {
  media: GeneratedVideo | GeneratedImage | { code: string, name: string } | null;
  onClose: () => void;
}

export const CinematicPlayer: React.FC<CinematicPlayerProps> = ({ media, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('4K_NEURAL');
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  const isVideo = (media: any): media is GeneratedVideo => media && 'uri' in media;
  const isImage = (media: any): media is GeneratedImage => media && 'url' in media;
  const isApp = (media: any): media is { code: string, name: string } => media && 'code' in media;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ' && isVideo(media)) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isPlaying, media]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!showSettings) setShowControls(false);
    }, 3000);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (!media) return null;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center font-arabic overflow-hidden animate-page-reveal select-none"
    >
      {/* Dynamic Ambient Aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] blur-[150px] transition-all duration-[3000ms] bg-gradient-to-tr ${isApp(media) ? 'from-emerald-600/20' : isImage(media) ? 'from-purple-600/20' : 'from-blue-600/20'} via-transparent to-transparent animate-pulse`}></div>
      </div>

      {/* Top Navigation HUD */}
      <div className={`absolute top-0 inset-x-0 p-12 flex justify-between items-start z-[110] transition-all duration-700 bg-gradient-to-b from-black/90 to-transparent ${showControls ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
         <div className="text-right">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] block mb-3">Sovereign_Preview_Engine // v12</span>
            <h3 className="text-4xl font-black text-white truncate max-w-2xl drop-shadow-2xl">
               {isApp(media) ? media.name : (media as any).prompt}
            </h3>
         </div>
         <div className="flex gap-6">
            <button onClick={toggleFullscreen} className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all text-xl">⛶</button>
            <button 
              onClick={onClose}
              className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-white hover:bg-red-600 transition-all shadow-3xl text-2xl"
            >✕</button>
         </div>
      </div>

      {/* Primary Viewport Component */}
      <div className={`relative z-10 w-full max-w-[90%] transition-all duration-1000 ${isFullscreen ? 'scale-110' : 'scale-100'}`}>
         <div className="relative aspect-video bg-[#050505] rounded-[4rem] overflow-hidden shadow-[0_0_150px_rgba(0,0,0,1)] border-4 border-white/5 group">
            
            {/* Case 1: App Preview (Iframe) */}
            {isApp(media) && (
               <iframe 
                 srcDoc={media.code} 
                 className="w-full h-full bg-white animate-fadeIn" 
                 title="App Preview"
                 sandbox="allow-scripts allow-modals"
               />
            )}

            {/* Case 2: Video Player */}
            {isVideo(media) && (
              <video 
                ref={videoRef}
                src={media.uri}
                autoPlay
                loop
                onTimeUpdate={(e) => setProgress((e.currentTarget.currentTime / e.currentTarget.duration) * 100)}
                className="w-full h-full object-contain"
              />
            )}

            {/* Case 3: High-Res Image Viewer */}
            {isImage(media) && (
              <img 
                src={media.url} 
                className="w-full h-full object-cover animate-kenBurns"
                alt="Cinematic"
              />
            )}

            {/* Sensitive Video Overlays */}
            {isVideo(media) && (
              <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent flex flex-col justify-end p-16 transition-opacity duration-700 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                 
                 <div className="group/progress relative h-2 w-full bg-white/5 rounded-full mb-10 cursor-pointer overflow-hidden"
                      onClick={(e) => {
                        if (!videoRef.current) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pos = (e.clientX - rect.left) / rect.width;
                        videoRef.current.currentTime = pos * videoRef.current.duration;
                      }}>
                    <div className="h-full bg-blue-500 shadow-[0_0_20px_#3b82f6] transition-all" style={{ width: `${progress}%` }}></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 group-hover/progress:opacity-100 transition-opacity"></div>
                 </div>

                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-10">
                       <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-all text-5xl active:scale-90">
                          {isPlaying ? '⏸' : '▶'}
                       </button>
                       <div className="flex items-center gap-6">
                          <span className="text-2xl opacity-40">🔈</span>
                          <input 
                            type="range" min="0" max="1" step="0.1" 
                            value={volume}
                            onChange={(e) => {
                              const v = parseFloat(e.target.value);
                              setVolume(v);
                              if(videoRef.current) videoRef.current.volume = v;
                            }}
                            className="w-32 h-1 accent-white bg-white/10 rounded-full appearance-none cursor-pointer"
                          />
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-10">
                       <button 
                         onClick={() => setShowSettings(!showSettings)}
                         className={`text-sm font-black transition-all ${showSettings ? 'text-blue-400' : 'text-white/50 hover:text-white'}`}
                       >
                         {quality} // {playbackRate}x
                       </button>
                    </div>
                 </div>
              </div>
            )}
         </div>
      </div>

      {/* Technical Data Bar */}
      <div className={`absolute bottom-0 inset-x-0 p-12 flex justify-between items-end z-[110] transition-all duration-700 bg-gradient-to-t from-black/90 to-transparent ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
         <div className="flex gap-6">
            <div className="px-8 py-4 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 flex flex-col items-center shadow-2xl">
               <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Neural_Sync</span>
               <span className="text-sm font-mono text-emerald-500 animate-pulse">OPTIMAL</span>
            </div>
            <div className="px-8 py-4 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 flex flex-col items-center shadow-2xl">
               <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Reality_Tier</span>
               <span className="text-sm font-mono text-blue-400">{isApp(media) ? 'EXEC_SANDBOX' : 'VEO_ENGINE'}</span>
            </div>
         </div>
         <div className="text-right space-y-4">
            <p className="text-white/30 font-mono text-[9px] uppercase tracking-[0.6em]">Secure_Link_Established_0x991</p>
            <button 
               onClick={() => {
                 const content = isApp(media) ? media.code : (isVideo(media) ? media.uri : (media as any).url);
                 const link = document.createElement('a');
                 link.href = content;
                 link.download = `Sovereign_Asset_${Date.now()}`;
                 link.click();
               }}
               className="bg-white text-black px-12 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-4xl active:scale-95"
            >
               {isApp(media) ? 'تصدير الكود المصدري' : 'تصدير الوسائط السيادية'} 📥
            </button>
         </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; filter: blur(20px); } to { opacity: 1; filter: blur(0); } }
        .animate-page-reveal { animation: fadeIn 0.8s var(--ease-out-expo) forwards; }
        @keyframes kenBurns { 0% { transform: scale(1) translate(0,0); } 100% { transform: scale(1.15) translate(-2%,-2%); } }
        .animate-kenBurns { animation: kenBurns 30s linear infinite alternate; }
      `}</style>
    </div>
  );
};
