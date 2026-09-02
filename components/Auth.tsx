
import React, { useState, useEffect, useRef } from 'react';

interface AuthProps {
  onLoginSuccess: (isAdmin: boolean, stealth: boolean) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [booting, setBooting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('AWAITING_NEURAL_LINK');
  const [passphrase, setPassphrase] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const [error, setError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const rainDrops: number[] = Array.from({ length: columns }).map(() => 1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
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

    const interval = setInterval(draw, 30);
    return () => clearInterval(interval);
  }, []);

  const bootLogs = [
    "INITIALIZING_V12_CORE...",
    "ESTABLISHING_ENCRYPTED_TUNNELS...",
    "SYNCHRONIZING_ORBITAL_SATELLITES...",
    "CALIBRATING_NEURAL_LOGIC_MATRIX...",
    "SARAH_OS_V12_READY_FOR_COMMAND."
  ];

  const handleStartBoot = (e: React.FormEvent) => {
    e.preventDefault();
    if (passphrase.trim().toLowerCase() === 'sara' || passphrase === '9991') {
      setIsLocked(false);
      setBooting(true);
      setError(false);
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 1;
        setProgress(currentProgress);
        if (currentProgress % 20 === 0) {
          setStatus(bootLogs[Math.floor(currentProgress / 20) % bootLogs.length]);
        }
        if (currentProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => onLoginSuccess(true, false), 500);
        }
      }, 40);
    } else {
      setError(true);
      setPassphrase('');
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-[5000] bg-black flex items-center justify-center p-6 overflow-hidden font-arabic">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-20 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-lg">
        {!booting ? (
          <div className="bg-black/80 backdrop-blur-3xl border-2 border-blue-500/20 p-10 rounded-[3rem] shadow-[0_0_100px_rgba(59,130,246,0.2)] animate-fadeIn space-y-10 text-center">
            <div className="space-y-6">
              <div className="w-24 h-24 bg-blue-600/10 border-2 border-blue-500/30 rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto shadow-2xl animate-float">
                👑
              </div>
              <h1 className="text-5xl font-black text-white tracking-tighter uppercase">صارة <span className="text-indigo-500">v15</span></h1>
              <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[9px]">Sovereign_Control_Matrix_V12</p>
            </div>

            <form onSubmit={handleStartBoot} className="space-y-6">
               <div className="relative group">
                  <input 
                    type="password"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="أدخل رمز الوصول السيادي..."
                    className={`w-full bg-black/60 border-2 rounded-2xl px-6 py-4 text-center text-2xl text-white focus:outline-none transition-all placeholder:text-slate-800 ${error ? 'border-red-600 animate-shake' : 'border-white/5 focus:border-blue-500/50'}`}
                    autoFocus
                  />
                  {error && <p className="absolute -bottom-6 left-0 right-0 text-[10px] text-red-500 font-black uppercase tracking-widest">ACCESS_DENIED</p>}
               </div>

               <button 
                 type="submit"
                 className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4"
               >
                 تنشيط البروتوكول السيادي
                 <span className="text-2xl">⚡</span>
               </button>
            </form>

            <div className="pt-4 opacity-30">
               <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-relaxed">
                 Authorized biometric patterns only. <br/>
                 System Version: 101.Ultra.Stable
               </p>
            </div>
          </div>
        ) : (
          <div className="space-y-10 animate-fadeIn text-center">
            <div className="relative w-40 h-40 mx-auto">
              <div className="absolute inset-0 border-4 border-blue-500/10 rounded-[2.5rem] rotate-45"></div>
              <div className="absolute inset-0 border-t-4 border-blue-500 rounded-[2.5rem] rotate-45 animate-spin shadow-[0_0_30px_rgba(59,130,246,0.5)]"></div>
              <div className="absolute inset-6 flex items-center justify-center text-5xl">🧠</div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-white tracking-[0.3em] uppercase">Booting_{progress}%</h2>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-100 shadow-[0_0_15px_#3b82f6]" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-blue-900 font-mono text-[10px] uppercase tracking-widest animate-pulse">{status}</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
