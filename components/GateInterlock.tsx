
import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';

export const GateInterlock: React.FC<{ language: Language; onUnlock: () => void }> = ({ language, onUnlock }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Matrix Digital Rain Effect - Optimized Speed
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const rainDrops: number[] = [];

    for (let x = 0; x < columns; x++) {
      rainDrops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Slightly faster fading
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0'; 
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };

    const interval = setInterval(draw, 20); // Faster Interval (from 30 to 20)
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim() === 'Sara') {
      setIsVerifying(true);
      setError(false);
      setTimeout(() => {
        onUnlock();
      }, 1000); // Faster transition (from 2000 to 1000)
    } else {
      setError(true);
      setInput('');
      setTimeout(() => setError(false), 400); // Faster error reset
    }
  };

  const handleReject = () => {
    setInput('');
    setError(true);
    setTimeout(() => setError(false), 400);
  };

  return (
    <div className="fixed inset-0 z-[5000] bg-black flex flex-col items-center justify-center font-mono overflow-hidden">
      
      {/* Matrix Rain Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-50" />

      {/* Terminal Interface */}
      <div className="relative z-10 w-full max-w-2xl p-10 bg-black/85 border-2 border-[#0F0]/30 rounded-xl backdrop-blur-xl shadow-[0_0_120px_rgba(0,255,0,0.15)]">
        
        <div className="mb-10 text-left dir-ltr">
           <div className="flex items-center gap-3 text-[#0F0] mb-4">
              <span className="animate-pulse">●</span>
              <span className="text-[10px] font-black tracking-widest uppercase">Sarah_System_Kernel_v17.2</span>
           </div>
           <div className="space-y-1 text-[#0F0]/60 text-[9px] uppercase">
              <p>[BOOT] Established high-speed link...</p>
              <p>[INFO] Encryption: OMEGA_RSA_8192</p>
              <p>[STAT] Neural latency: 0.001ms</p>
           </div>
        </div>

        <form onSubmit={handleUnlock} className="space-y-12">
           <div className="relative">
              <div className="flex items-center gap-4 text-3xl md:text-5xl text-[#0F0]">
                 <span className="shrink-0 font-black animate-pulse">{" >> "}</span>
                 <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    autoFocus
                    placeholder="KEY_PHRASE"
                    className={`flex-1 bg-transparent border-none outline-none text-right font-black tracking-widest placeholder-[#0F0]/10 ${error ? 'text-red-500 animate-shake' : 'text-[#0F0]'} transition-colors`}
                    disabled={isVerifying}
                 />
                 <span className="w-4 h-10 bg-[#0F0] animate-matrix-cursor ml-2 shadow-[0_0_10px_#0F0]"></span>
              </div>
              {error && (
                <div className="absolute -bottom-8 right-0 text-red-600 text-[10px] font-black uppercase tracking-widest animate-pulse">
                  ACCESS_DENIED: UNAUTHORIZED_ENTITY
                </div>
              )}
           </div>

           <div className="pt-6 flex flex-col items-center gap-8">
              {isVerifying ? (
                <div className="space-y-4 text-center">
                   <p className="text-[#0F0] text-xl font-black animate-pulse tracking-[0.4em] uppercase">SYSTEM_OVERRIDE_ACTIVE...</p>
                   <div className="w-64 h-[2px] bg-white/5 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[#0F0] animate-matrix-load"></div>
                   </div>
                </div>
              ) : (
                <div className="flex gap-6 w-full">
                  <button 
                    type="submit"
                    className="flex-1 bg-[#0F0]/10 border border-[#0F0]/40 text-[#0F0] py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#0F0] hover:text-black transition-all shadow-[0_0_20px_rgba(0,255,0,0.1)] active:scale-95"
                  >
                    ACCEPT_ACCESS
                  </button>
                  <button 
                    type="button"
                    onClick={handleReject}
                    className="flex-1 bg-red-950/20 border border-red-600/40 text-red-600 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95"
                  >
                    TERMINATE_LINK
                  </button>
                </div>
              )}
           </div>
        </form>

        <div className="mt-16 pt-8 border-t border-[#0F0]/10 flex justify-between items-center opacity-30">
           <span className="text-[8px] text-[#0F0] font-bold">LINK_SPEED: 400PB/S</span>
           <span className="text-[8px] text-[#0F0] font-bold">OPERATOR: SARAH_V17</span>
        </div>
      </div>

      <style>{`
        @keyframes matrix-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-matrix-cursor { animation: matrix-cursor 0.6s infinite; }

        @keyframes matrix-load {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-matrix-load { animation: matrix-load 1s linear infinite; }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.25s ease-in-out; }
      `}</style>
    </div>
  );
};
