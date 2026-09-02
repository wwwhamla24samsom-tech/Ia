
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, Wifi, Send, Download, Zap, Activity, Shield, Cpu, Terminal, RefreshCw, Layers, Share2, Search, Target, XCircle, Link, Bluetooth, Tv } from 'lucide-react';
import { Language } from '../types';

interface Signal {
  id: string;
  name: string;
  type: 'wifi' | 'bluetooth' | 'radio' | 'tv' | 'complex_code';
  strength: number;
  frequency: string;
  source: string;
  status: 'detected' | 'connected' | 'jammed' | 'disconnected';
  coordinates: { x: number, y: number };
}

interface Packet {
  id: string;
  type: 'sent' | 'received';
  content: string;
  timestamp: number;
  protocol: string;
  status: 'delivered' | 'processing' | 'intercepted';
}

export const NeuralBroadcast: React.FC<{ language: Language }> = ({ language }) => {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [activeFrequency, setActiveFrequency] = useState(433.92);
  const [logs, setLogs] = useState<{ id: string, msg: string, type: 'info' | 'success' | 'warn' | 'error' }[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);

  const addLog = (msg: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    setLogs(prev => [{ id: Math.random().toString(36).substr(2, 9), msg, type }, ...prev].slice(0, 30));
  };

  const startScan = async () => {
    setIsScanning(true);
    addLog('Initiating wide-spectrum signal scan...', 'info');
    
    // Simulate finding signals
    setTimeout(() => {
      const newSignals: Signal[] = [
        { id: 'sig-1', name: 'Digital_Sarah_TV_Link', type: 'tv', strength: 85, frequency: '550 MHz', source: 'Local_Broadcast_Tower', status: 'detected', coordinates: { x: 30, y: 40 } },
        { id: 'sig-2', name: 'Sovereign_Radio_Node', type: 'radio', strength: 60, frequency: '104.2 MHz', source: 'Remote_Relay_09', status: 'detected', coordinates: { x: 70, y: 20 } },
        { id: 'sig-3', name: 'Jawwab_Fi_Core', type: 'wifi', strength: 95, frequency: '5.4 GHz', source: 'Central_Hub', status: 'detected', coordinates: { x: 50, y: 50 } },
        { id: 'sig-4', name: 'Neural_BLE_Mesh', type: 'bluetooth', strength: 40, frequency: '2.4 GHz', source: 'Nearby_Device_X', status: 'detected', coordinates: { x: 45, y: 60 } },
        { id: 'sig-5', name: 'Complex_Cipher_Stream', type: 'complex_code', strength: 75, frequency: 'Quantum_Band', source: 'Unknown_Origin', status: 'detected', coordinates: { x: 10, y: 80 } },
      ];
      setSignals(newSignals);
      addLog(`Scan complete. Detected ${newSignals.length} active digital signatures.`, 'success');
      setIsScanning(false);
    }, 3000);
  };

  const handleAction = (signalId: string, action: 'connect' | 'jam' | 'cut') => {
    setSignals(prev => prev.map(s => {
      if (s.id === signalId) {
        let newStatus = s.status;
        if (action === 'connect') {
          newStatus = 'connected';
          addLog(`Established secure link with ${s.name}.`, 'success');
        } else if (action === 'jam') {
          newStatus = 'jammed';
          addLog(`Interference protocol active on ${s.name}. Signal neutralized.`, 'warn');
        } else if (action === 'cut') {
          newStatus = 'disconnected';
          addLog(`Connection terminated with ${s.name}.`, 'error');
        }
        return { ...s, status: newStatus as any };
      }
      return s;
    }));
  };

  const handleBroadcast = () => {
    if (!inputMessage.trim()) return;
    setIsTransmitting(true);
    addLog(`Broadcasting: ${inputMessage}`, 'info');

    setTimeout(() => {
      const newPacket: Packet = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'sent',
        content: inputMessage,
        timestamp: Date.now(),
        protocol: 'Neural_Link_v4',
        status: 'delivered'
      };
      setPackets(prev => [newPacket, ...prev]);
      addLog(`Packet Transmitted Successfully.`, 'success');
      setIsTransmitting(false);
      setInputMessage('');
    }, 2000);
  };

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'wifi': return <Wifi className="w-5 h-5" />;
      case 'bluetooth': return <Bluetooth className="w-5 h-5" />;
      case 'radio': return <Radio className="w-5 h-5" />;
      case 'tv': return <Tv className="w-5 h-5" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#010204] text-slate-200 font-arabic p-8 lg:p-12 overflow-hidden relative">
      
      {/* Background Pulse Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h1 className="text-6xl font-black tracking-tighter text-white uppercase leading-none flex items-center gap-4">
              <Share2 className="w-16 h-16 text-blue-500" />
              Neural <span className="text-blue-500">Broadcast</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.4em] mt-2 text-xs">
              Signal_Scanner_&_Interference_Node_v13.5
            </p>
          </div>
          
          <div className="flex gap-4">
             <button 
               onClick={startScan}
               disabled={isScanning}
               className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl shadow-blue-900/20"
             >
               {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
               Scan_Spectrum
             </button>
             <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-4">
                <div className="flex flex-col items-end">
                   <span className="text-[8px] font-black text-slate-500 uppercase">Frequency</span>
                   <span className="text-xl font-black text-blue-400 font-mono">{activeFrequency} MHz</span>
                </div>
                <RefreshCw className="w-5 h-5 text-blue-500 animate-spin-slow" />
             </div>
          </div>
        </header>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Signal Scanner & Tracker */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Radar/Map Visualization */}
            <div className="bg-black/40 border border-white/10 rounded-[3.5rem] p-10 h-[400px] relative overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
               
               {/* Radar Grid */}
               <div className="absolute w-[600px] h-[600px] border border-blue-500/10 rounded-full"></div>
               <div className="absolute w-[400px] h-[400px] border border-blue-500/10 rounded-full"></div>
               <div className="absolute w-[200px] h-[200px] border border-blue-500/10 rounded-full"></div>
               <div className="absolute w-full h-px bg-blue-500/10"></div>
               <div className="absolute h-full w-px bg-blue-500/10"></div>

               {/* Scanning Sweep */}
               {isScanning && (
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                   className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full origin-center"
                 />
               )}

               {/* Signal Points */}
               {signals.map((sig) => (
                 <motion.button
                   key={sig.id}
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   onClick={() => setSelectedSignal(sig)}
                   className={`absolute p-3 rounded-full border-2 transition-all z-20 group
                     ${selectedSignal?.id === sig.id ? 'bg-blue-500 border-white shadow-[0_0_20px_#3b82f6]' : 'bg-black/60 border-blue-500/50 hover:bg-blue-500/20'}`}
                   style={{ 
                     top: `${sig.coordinates.y}%`, 
                     left: `${sig.coordinates.x}%` 
                   }}
                 >
                   <div className={`w-2 h-2 rounded-full ${
                     sig.status === 'connected' ? 'bg-emerald-400 animate-pulse' : 
                     sig.status === 'jammed' ? 'bg-red-500' : 'bg-blue-400'
                   }`}></div>
                   
                   {/* Tooltip */}
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 border border-blue-500/30 rounded-lg text-[8px] font-black uppercase tracking-widest text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                     {sig.name}
                   </div>
                 </motion.button>
               ))}
            </div>

            {/* Signal List & Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <AnimatePresence>
                 {signals.map((sig) => (
                   <motion.div 
                     key={sig.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className={`bg-white/5 border rounded-[2.5rem] p-8 transition-all ${selectedSignal?.id === sig.id ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10'}`}
                   >
                     <div className="flex justify-between items-start mb-6">
                        <div className={`p-4 rounded-2xl ${sig.status === 'connected' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-600/10 text-blue-400'}`}>
                           {getSignalIcon(sig.type)}
                        </div>
                        <div className="text-right">
                           <div className={`text-[9px] font-black uppercase px-3 py-1 rounded-full inline-block ${
                             sig.status === 'connected' ? 'bg-emerald-500/10 text-emerald-500' : 
                             sig.status === 'jammed' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                           }`}>
                              {sig.status}
                           </div>
                           <div className="text-[8px] font-mono text-slate-600 mt-2">{sig.frequency}</div>
                        </div>
                     </div>
                     <h4 className="text-xl font-black text-white mb-1">{sig.name}</h4>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">{sig.source}</p>
                     
                     <div className="flex gap-2">
                        <button 
                          onClick={() => handleAction(sig.id, 'connect')}
                          className="flex-1 py-3 bg-emerald-600/10 border border-emerald-500/20 rounded-xl text-[9px] font-black uppercase text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                           <Link className="w-3 h-3" /> Connect
                        </button>
                        <button 
                          onClick={() => handleAction(sig.id, 'jam')}
                          className="flex-1 py-3 bg-amber-600/10 border border-amber-500/20 rounded-xl text-[9px] font-black uppercase text-amber-500 hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                           <Zap className="w-3 h-3" /> Jam
                        </button>
                        <button 
                          onClick={() => handleAction(sig.id, 'cut')}
                          className="flex-1 py-3 bg-red-600/10 border border-red-500/20 rounded-xl text-[9px] font-black uppercase text-red-500 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                           <XCircle className="w-3 h-3" /> Cut
                        </button>
                     </div>
                   </motion.div>
                 ))}
               </AnimatePresence>
               {signals.length === 0 && !isScanning && (
                 <div className="col-span-2 p-12 border border-dashed border-white/10 rounded-[3rem] text-center text-slate-600 font-mono text-xs">
                   NO_SIGNALS_DETECTED. INITIATE_SPECTRUM_SCAN.
                 </div>
               )}
            </div>
          </div>

          {/* Right: Logs & Transmitter */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Transmitter Area */}
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent"></div>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Transmitter</h3>
                <Send className={`w-5 h-5 ${isTransmitting ? 'text-blue-500 animate-bounce' : 'text-slate-600'}`} />
              </div>
              
              <div className="space-y-4">
                <textarea 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Enter data to broadcast..."
                  className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl p-6 text-sm font-medium focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                />
                <button 
                  onClick={handleBroadcast}
                  disabled={isTransmitting || !inputMessage.trim()}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20"
                >
                  {isTransmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  Initiate Broadcast
                </button>
              </div>
            </div>

            {/* Event Log */}
            <div className="bg-black/60 border border-white/5 rounded-[3.5rem] p-10 h-[400px] flex flex-col shadow-inner">
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Spectrum_Log</h3>
                <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 font-mono text-[10px]">
                {logs.map((log) => (
                  <div key={log.id} className={`flex gap-3 items-start ${
                    log.type === 'success' ? 'text-emerald-500' : 
                    log.type === 'error' ? 'text-red-500' : 
                    log.type === 'warn' ? 'text-amber-500' : 'text-slate-500'
                  }`}>
                    <span className="opacity-30">{" >> "}</span>
                    <span className="leading-relaxed">{log.msg}</span>
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="h-full flex items-center justify-center text-slate-800 italic">
                    Waiting for signal activity...
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};
