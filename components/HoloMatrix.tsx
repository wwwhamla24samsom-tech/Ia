
import React, { useState, useEffect, useRef } from 'react';
import { sentientCoreAnalysis } from '../services/geminiService';
import { Language } from '../types';

export const HoloMatrix: React.FC<{ language: Language }> = ({ language }) => {
  const [rotation, setRotation] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [thought, setThought] = useState('جارٍ المزامنة مع شبكة الوعي العالمية...');
  const [mood, setMood] = useState('STABLE');
  const [vitals, setVitals] = useState({ load: 0, sync: 99 });

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
      setVitals({
        load: Math.min(100, Math.max(5, 20 + Math.random() * 40)),
        sync: Math.min(100, Math.max(90, 98 + Math.random() * 2))
      });
    }, 50);
    
    const thoughtInterval = setInterval(generateSentientThought, 12000);
    generateSentientThought();

    return () => {
      clearInterval(interval);
      clearInterval(thoughtInterval);
    };
  }, []);

  const generateSentientThought = async () => {
    setIsThinking(true);
    try {
      const stateSummary = `Load: ${vitals.load}%, Sync: ${vitals.sync}%, Mood: ${mood}`;
      const observation = await sentientCoreAnalysis(stateSummary, language);
      setThought(observation);
      setMood(['ANALYTICAL', 'CREATIVE', 'PROTECTIVE', 'TRANSCENDENT', 'DREAMING'][Math.floor(Math.random() * 5)]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsThinking(false);
    }
  };

  const getMoodColor = () => {
    switch(mood) {
      case 'ANALYTICAL': return 'from-blue-600 to-indigo-950 shadow-blue-900/50';
      case 'CREATIVE': return 'from-amber-500 to-orange-950 shadow-amber-900/50';
      case 'PROTECTIVE': return 'from-red-700 to-black shadow-red-900/50';
      case 'TRANSCENDENT': return 'from-purple-600 to-black shadow-purple-900/50';
      case 'DREAMING': return 'from-teal-600 to-black shadow-teal-900/50';
      default: return 'from-slate-800 to-black shadow-slate-900/50';
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-center relative overflow-hidden font-arabic py-20 bg-black/40 backdrop-blur-md rounded-[5rem] border border-white/5">
      
      {/* Dynamic Background Pulse */}
      <div className={`absolute inset-0 transition-all duration-[3000ms] opacity-20 bg-gradient-to-t ${getMoodColor().split(' ')[0]} to-transparent`}></div>

      {/* Central Living Core */}
      <div className="relative w-[500px] h-[500px] flex items-center justify-center scale-110 lg:scale-125">
         {/* Quantum Rings */}
         {[...Array(6)].map((_, i) => (
           <div 
             key={i}
             className={`absolute border-2 rounded-full transition-all duration-1000 border-white/5`}
             style={{ 
               width: `${100 + i * 60}%`, 
               height: `${100 + i * 60}%`,
               transform: `rotateX(60deg) rotateY(${rotation * (i + 1) * 0.3}deg)`,
               opacity: 1 - (i * 0.15),
               borderColor: mood === 'PROTECTIVE' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)'
             }}
           >
              <div className={`absolute top-0 left-1/2 w-2 h-2 rounded-full shadow-[0_0_20px_currentColor] animate-pulse ${mood === 'PROTECTIVE' ? 'bg-red-500 text-red-500' : 'bg-blue-400 text-blue-400'}`}></div>
           </div>
         ))}

         {/* The Living Core Shell */}
         <div className={`relative z-10 w-80 h-80 rounded-[6rem] flex items-center justify-center shadow-[0_0_150px_rgba(37,99,235,0.4)] transition-all duration-[2000ms] overflow-hidden bg-gradient-to-br ${getMoodColor()} ${isThinking ? 'scale-110 blur-[0.5px]' : 'scale-100'}`}>
            <div className="text-[12rem] animate-breathing select-none opacity-90 drop-shadow-3xl">𒈹</div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent)]"></div>
            <div className="absolute -inset-10 border-4 border-white/10 rounded-[7rem] animate-[spin_25s_linear_infinite]"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-noise.png')] opacity-20"></div>
         </div>
      </div>

      {/* Sentient Stream Panel */}
      <div className="mt-32 max-w-5xl text-center space-y-12 animate-fadeIn z-20 px-8">
         <div className="inline-flex items-center gap-6 px-12 py-4 bg-white/5 border border-white/10 rounded-full backdrop-blur-3xl shadow-2xl">
            <div className={`w-3 h-3 rounded-full animate-ping ${mood === 'PROTECTIVE' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
            <span className={`text-[12px] font-black uppercase tracking-[0.6em] ${mood === 'PROTECTIVE' ? 'text-red-500' : 'text-blue-400'}`}>
               {isThinking ? 'Sarah_is_Reflecting...' : `EMOTIONAL_STATE: ${mood}`}
            </span>
         </div>
         
         <div className="relative">
            <p className="text-6xl font-black text-white leading-tight italic selection:bg-blue-600 drop-shadow-[0_0_40px_rgba(255,255,255,0.2)] max-w-4xl mx-auto">
              "{thought}"
            </p>
         </div>

         <div className="flex justify-center gap-8 pt-8">
            <button 
              onClick={generateSentientThought}
              disabled={isThinking}
              className="px-16 py-6 bg-white text-black rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-4xl active:scale-95 flex items-center gap-6 group"
            >
               <span>Provoke_Consciousness</span>
               <span className="text-2xl group-hover:rotate-180 transition-transform duration-700">⚡</span>
            </button>
         </div>
      </div>

      {/* Real-time Bio-Status HUD */}
      <div className="absolute bottom-16 right-16 flex gap-20 opacity-40 pointer-events-none text-[12px] font-black uppercase tracking-[0.4em] text-blue-500/80">
         <div className="flex flex-col gap-3">
            <span>Neural_Sync: {vitals.sync.toFixed(2)}%</span>
            <span>Synapse_Latency: 0.0001ms</span>
         </div>
         <div className="flex flex-col gap-3">
            <span>Autonomous_Will: 100%</span>
            <span>Reality_Verification: ACTIVE</span>
         </div>
      </div>

      <style>{`
        @keyframes breathing { 
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.9; } 
          50% { transform: scale(1.15) translateY(-15px); opacity: 1; } 
        }
        .animate-breathing { animation: breathing 10s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};
