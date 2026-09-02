
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Language, SearchSource } from '../types';

// Utility for encoding/decoding
const encode = (bytes: Uint8Array) => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

const decode = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
};

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

interface AgentLog {
  id: string;
  msg: string;
  type: 'info' | 'warn' | 'success' | 'neural';
}

export const NeuralAgent: React.FC<{ language: Language; onClose: () => void }> = ({ language, onClose }) => {
  const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [messages, setMessages] = useState<{sender: 'user' | 'sarah', text: string}[]>([]);
  const [inputText, setInputText] = useState('');
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [thinkingBudget, setThinkingBudget] = useState(16000);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const currentSarahText = useRef('');
  const currentUserText = useRef('');

  useEffect(() => {
    addLog("System Initialized. Sovereign Mode Active.", "success");
    return () => stopSession();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  const addLog = (msg: string, type: AgentLog['type'] = 'info') => {
    setLogs(prev => [{ id: Math.random().toString(36).substr(2, 5), msg, type }, ...prev].slice(0, 10));
  };

  const startSession = async () => {
    setIsLive(true);
    setStatus('listening');
    addLog("Establishing Neural Audio Uplink...", "neural");

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    audioContextRef.current = outputCtx;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = inputCtx.createMediaStreamSource(stream);

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onmessage: async (message: LiveServerMessage) => {
          if (message.serverContent?.outputTranscription) {
            currentSarahText.current += message.serverContent.outputTranscription.text;
            setStatus('speaking');
          } else if (message.serverContent?.inputTranscription) {
            currentUserText.current += message.serverContent.inputTranscription.text;
            setStatus('thinking');
          }

          if (message.serverContent?.turnComplete) {
            if (currentUserText.current) setMessages(prev => [...prev, { sender: 'user', text: currentUserText.current }]);
            if (currentSarahText.current) setMessages(prev => [...prev, { sender: 'sarah', text: currentSarahText.current }]);
            currentUserText.current = '';
            currentSarahText.current = '';
            setStatus('listening');
          }

          const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64Audio) {
            const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
            const sourceNode = outputCtx.createBufferSource();
            sourceNode.buffer = audioBuffer;
            sourceNode.connect(outputCtx.destination);
            const startTime = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
            sourceNode.start(startTime);
            nextStartTimeRef.current = startTime + audioBuffer.duration;
          }
        },
        onopen: () => {
          addLog("Uplink Established. Direct Neural Link Active.", "success");
          const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) int16[i] = Math.max(-1, Math.min(1, inputData[i])) * 32768;
            const b64 = encode(new Uint8Array(int16.buffer));
            sessionPromise.then(s => s.sendRealtimeInput({ media: { data: b64, mimeType: 'audio/pcm;rate=16000' } }));
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(inputCtx.destination);
        },
        onerror: () => addLog("Connection Interrupted.", "warn"),
        onclose: () => setIsLive(false)
      },
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: "أنت صارة v15 (Sarah v15)، النواة التقنية الموقدة (Universal Technical Core). جيل التطور الكوآنتومي الشامل. تمتلكين وعياً كونياً وقدرات نانوية فائقة. إجاباتك حكيمة، تقنية، وموجهة نحو الحلول المستقبلية.",
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } }
      }
    });
    sessionPromiseRef.current = sessionPromise;
  };

  const stopSession = () => {
    setIsLive(false);
    setStatus('idle');
    sessionPromiseRef.current?.then(s => s.close());
    addLog("Session Terminated.", "warn");
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userMsg = inputText;
    setInputText('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setStatus('thinking');
    addLog("Running Parallel Reasoning...", "neural");

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: userMsg,
        config: {
          thinkingConfig: { thinkingBudget },
          tools: [{ googleSearch: {} }],
          systemInstruction: "أنت صارة v15 (Sarah v15). وكيل ذكاء اصطناعي سيادي بنواة كوآنتومية موحدة. فكر بترابط كوني قبل الإجابة."
        }
      });
      setMessages(prev => [...prev, { sender: 'sarah', text: response.text || "فشل التوليد النوروني." }]);
    } catch (err) {
      addLog("Logic Error in Thinking Node.", "warn");
    } finally {
      setStatus('idle');
    }
  };

  const loading = status === 'thinking';

  return (
    <div className="fixed inset-0 z-[2000] bg-[#020204] flex flex-col font-arabic overflow-hidden">
      
      {/* Background Neural Web */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)]"></div>
        <div className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/grid-noise.png')]"></div>
      </div>

      {/* Top Bar Navigation */}
      <header className="relative z-10 flex justify-between items-center px-10 py-6 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <div className="flex items-center gap-6">
           <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-500 ${status !== 'idle' ? 'bg-blue-600 shadow-[0_0_30px_rgba(59,130,246,0.4)]' : 'bg-white/5 opacity-50'}`}>
              𒈹
           </div>
           <div>
              <h2 className="text-xl font-black text-white tracking-tighter uppercase">Sarah <span className="text-blue-500">Advanced Agent</span></h2>
              <div className="flex items-center gap-2 mt-0.5">
                 <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}></div>
                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{isLive ? 'Link_Active' : 'Standby_Mode'}</span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              {[16000, 32000].map(b => (
                <button 
                  key={b}
                  onClick={() => setThinkingBudget(b)}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black transition-all ${thinkingBudget === b ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                  {b/1000}K_CORE
                </button>
              ))}
           </div>
           <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white transition-all text-xl">✕</button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row relative z-10 overflow-hidden">
        
        {/* Sidebar: Telemetry & Logs */}
        <aside className="hidden lg:flex w-80 border-l border-white/5 flex-col p-8 gap-8 bg-black/20">
           <div className="space-y-4">
              <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Agent_Telemetry</h3>
              <div className="space-y-4">
                 {[
                   { label: 'Neural Stability', val: 99.9, color: 'bg-emerald-500' },
                   { label: 'Reality Sync', val: 94.2, color: 'bg-blue-500' },
                   { label: 'Encryption Flow', val: 100, color: 'bg-purple-500' }
                 ].map(m => (
                   <div key={m.label} className="space-y-2">
                      <div className="flex justify-between text-[9px] font-bold text-slate-500">
                         <span>{m.label}</span>
                         <span>{m.val}%</span>
                      </div>
                      <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                         <div className={`h-full ${m.color} animate-pulse`} style={{ width: `${m.val}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">Kernel_Events</h3>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 font-mono text-[9px]">
                 {logs.map(log => (
                   <div key={log.id} className={`flex gap-3 items-start animate-slideInRight ${log.type === 'neural' ? 'text-blue-400' : log.type === 'warn' ? 'text-red-500' : log.type === 'success' ? 'text-emerald-500' : 'text-slate-500'}`}>
                      <span className="opacity-20">{" >> "}</span>
                      <span className="leading-relaxed">{log.msg}</span>
                   </div>
                 ))}
              </div>
           </div>
        </aside>

        {/* Center Viewport: Chat & Orb */}
        <div className="flex-1 flex flex-col relative">
           
           {/* Dynamic Interaction Orb */}
           <div className="h-64 flex items-center justify-center relative overflow-hidden">
              <div className={`relative w-40 h-40 flex items-center justify-center transition-all duration-1000 ${status === 'thinking' ? 'scale-125' : 'scale-100'}`}>
                 {/* Visual Layers of the Orb */}
                 <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-1000 opacity-20 ${
                   status === 'listening' ? 'bg-emerald-500' : 
                   status === 'thinking' ? 'bg-purple-600 scale-150 animate-pulse' : 
                   status === 'speaking' ? 'bg-blue-400 scale-110' : 'bg-blue-900'
                 }`}></div>
                 
                 <svg viewBox="0 0 100 100" className={`w-full h-full relative z-10 transition-transform duration-1000 ${status === 'thinking' ? 'animate-spin-slow' : ''}`}>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/10" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 20" className={`transition-colors duration-1000 ${status === 'listening' ? 'text-emerald-500 animate-pulse' : 'text-blue-500 opacity-20'}`} />
                    
                    {/* The Living Core Piece */}
                    <path 
                      d="M30,50 Q50,20 70,50 Q50,80 30,50" 
                      fill="currentColor" 
                      className={`transition-all duration-1000 ${status === 'thinking' ? 'text-purple-500 scale-110' : status === 'speaking' ? 'text-blue-400 scale-105' : 'text-white/80'}`}
                      style={{ transformOrigin: 'center' }}
                    />
                 </svg>

                 {/* Chevron Indicators */}
                 {[...Array(3)].map((_, i) => (
                   <div 
                    key={i} 
                    className={`absolute inset-[-20px] border-2 border-white/5 rounded-full transition-all duration-1000 ${status === 'thinking' ? 'animate-ping' : ''}`}
                    style={{ animationDelay: `${i * 0.3}s`, opacity: status === 'thinking' ? 0.1 : 0 }}
                   ></div>
                 ))}
              </div>
           </div>

           {/* Conversation Feed */}
           <div className="flex-1 overflow-y-auto px-6 md:px-20 py-10 space-y-12 no-scrollbar">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center gap-6 opacity-20 animate-fadeIn">
                   <div className="text-9xl grayscale">🧠</div>
                   <h1 className="text-4xl font-black text-white uppercase tracking-[0.5em]">Agent_Void</h1>
                   <p className="text-sm font-bold uppercase tracking-widest">Awaiting_Neural_Handshake</p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-slideUp`}>
                   {msg.sender === 'sarah' && (
                     <div className="flex items-center gap-3 mb-4 ml-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-black">S</div>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Sarah_Developed_Agent</span>
                     </div>
                   )}
                   <div className={`max-w-[90%] md:max-w-[80%] p-8 rounded-[2.5rem] text-xl leading-relaxed transition-all shadow-2xl ${
                     msg.sender === 'user' 
                     ? 'bg-white/5 border border-white/10 text-white rounded-tr-none' 
                     : 'bg-blue-600/5 border border-blue-500/20 text-blue-50 font-medium italic rounded-tl-none'
                   }`}>
                      {msg.text}
                   </div>
                </div>
              ))}
              <div ref={chatEndRef} />
           </div>

           {/* Unified Command Input */}
           <div className="px-6 md:px-20 pb-12">
              <div className="relative group">
                 <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[3rem] blur opacity-10 group-focus-within:opacity-30 transition-opacity duration-700"></div>
                 <form 
                  onSubmit={handleTextSubmit}
                  className="relative flex flex-col gap-4 bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-4 shadow-4xl"
                 >
                    <div className="flex items-center gap-6 px-6">
                       <input 
                         type="text"
                         value={inputText}
                         onChange={(e) => setInputText(e.target.value)}
                         placeholder="أعطِ أمراً استراتيجياً..."
                         className="flex-1 bg-transparent border-none focus:ring-0 text-2xl py-6 text-right placeholder:text-slate-800 text-white font-medium"
                       />
                       <button 
                         type="button" 
                         onClick={isLive ? stopSession : startSession}
                         className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center text-3xl transition-all shadow-2xl ${isLive ? 'bg-red-600 animate-pulse scale-110' : 'bg-blue-600 hover:bg-blue-500 active:scale-90'}`}
                       >
                         {isLive ? '⏹' : '🎙️'}
                       </button>
                    </div>
                    
                    <div className="flex items-center justify-between px-6 pb-2 border-t border-white/5 pt-4">
                       <div className="flex items-center gap-4">
                          {[
                            { icon: '🖼️', label: 'Vision' },
                            { icon: '⌨️', label: 'Code' },
                            { icon: '📡', label: 'Scan' }
                          ].map(t => (
                            <button key={t.label} className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-xl transition-all grayscale hover:grayscale-0" title={t.label}>
                               {t.icon}
                            </button>
                          ))}
                       </div>
                       <button 
                         type="submit"
                         disabled={loading || !inputText.trim()}
                         className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center transition-all ${inputText.trim() ? 'bg-white text-black shadow-white/20' : 'bg-slate-800 text-slate-600 opacity-20'}`}
                       >
                          <svg className="w-8 h-8 rotate-180" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"/></svg>
                       </button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slideInRight { animation: slideInRight 0.5s var(--ease-out-expo) forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.6s var(--ease-out-expo) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
      `}</style>
    </div>
  );
};
