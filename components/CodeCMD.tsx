
import React, { useState, useRef, useEffect } from 'react';
import { executeCodeCMD, generateSpeechWithDialect } from '../services/geminiService';

export const CodeCMD: React.FC = () => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<{ type: 'cmd' | 'res' | 'log', text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSinging, setIsSinging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [history]);

  const playSingingUpdate = async (text: string) => {
    setIsSinging(true);
    try {
      const audioData = await generateSpeechWithDialect(text, 'Zephyr', 'ar');
      const ctx = audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = ctx;
      
      const dataInt16 = new Int16Array(audioData.buffer);
      const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }
      
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => setIsSinging(false);
      source.start();
    } catch (err) {
      console.error(err);
      setIsSinging(false);
    }
  };

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || loading) return;

    const currentCmd = command;
    setCommand('');
    setHistory(prev => [...prev, { type: 'cmd', text: `> sarah-ultra --exec "${currentCmd}"` }]);
    setLoading(true);

    try {
      const result = await executeCodeCMD(currentCmd, 'ar');
      
      setHistory(prev => [
        ...prev, 
        { type: 'log', text: result.terminalOutput },
        { type: 'res', text: result.generatedCode }
      ]);

      // غناء التحديث
      await playSingingUpdate(result.singingUpdate);
      
    } catch (err) {
      setHistory(prev => [...prev, { type: 'log', text: "❌ CRITICAL_ERROR: NEURAL_LINK_INTERRUPTED" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto p-4 lg:p-10 font-mono">
      {/* Melodic Indicator */}
      {isSinging && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 bg-purple-600 px-6 py-3 rounded-full shadow-[0_0_30px_rgba(147,51,234,0.5)] animate-bounce">
          <div className="flex gap-1">
             <div className="w-1 h-4 bg-white animate-voice-bar"></div>
             <div className="w-1 h-6 bg-white animate-voice-bar [animation-delay:0.2s]"></div>
             <div className="w-1 h-3 bg-white animate-voice-bar [animation-delay:0.4s]"></div>
          </div>
          <span className="text-white text-xs font-black uppercase tracking-widest">Sarah is Singing the Update...</span>
        </div>
      )}

      <div className="bg-slate-950 border border-emerald-500/30 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[75vh]">
        {/* Terminal Header */}
        <div className="bg-slate-900 px-6 py-3 flex justify-between items-center border-b border-white/5">
           <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
           </div>
           <div className="text-[10px] text-emerald-500 font-black tracking-[0.4em] uppercase">Sarah_Ultra_Terminal_v6.2</div>
        </div>

        {/* History Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-4 no-scrollbar">
           <div className="text-emerald-900 text-[10px] mb-8">
             [BOOT_SEQUENCE_COMPLETE] <br/>
             [NEURAL_ID: SARAH_101_ULTRA] <br/>
             [STATUS: STANDBY_FOR_CODE_INJECTION]
           </div>

           {history.map((h, i) => (
             <div key={i} className={`animate-fadeIn text-sm ${
               h.type === 'cmd' ? 'text-white font-bold' : 
               h.type === 'res' ? 'text-blue-300 bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 whitespace-pre-wrap' : 
               'text-emerald-500 opacity-60'
             }`}>
               {h.text}
             </div>
           ))}

           {loading && (
             <div className="flex items-center gap-3 text-emerald-500 animate-pulse">
                <span>█</span>
                <span className="text-xs">جاري تحليل الأنماط البرمجية...</span>
             </div>
           )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleExecute} className="p-6 bg-slate-900/50 border-t border-white/5">
           <div className="flex items-center gap-4">
              <span className="text-emerald-500 font-black">λ</span>
              <input 
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="أدخل أمر التطوير (مثلاً: build auth_system --secure)"
                className="flex-1 bg-transparent border-none focus:ring-0 text-emerald-400 font-mono text-lg"
                autoFocus
              />
              <button type="submit" className="hidden"></button>
           </div>
        </form>
      </div>

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
         {[
           { cmd: 'update --all', label: 'تحديث النواة' },
           { cmd: 'build webapp', label: 'بناء موقع' },
           { cmd: 'fix bugs', label: 'إصلاح الأخطاء' },
           { cmd: 'evolve logic', label: 'تطوير المنطق' }
         ].map(btn => (
           <button 
             key={btn.cmd}
             onClick={() => { setCommand(btn.cmd); }}
             className="p-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] text-white/40 hover:text-emerald-400 hover:border-emerald-500/30 transition-all uppercase tracking-widest font-black"
           >
             {btn.label}
           </button>
         ))}
      </div>

      <style>{`
        @keyframes voice-bar {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(2); }
        }
        .animate-voice-bar { animation: voice-bar 0.4s ease-in-out infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};
