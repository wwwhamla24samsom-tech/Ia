
import React, { useState, useEffect, useRef } from 'react';
import { runNeuralMerge, executeUniversalCommand, orchestrateGlobalFusion } from '../services/geminiService';
import { DeviceControl, NeuralMergeResult, Language, FusionConfig } from '../types';

export const UniversalBridge: React.FC<{ language: Language }> = ({ language }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedDevices, setScannedDevices] = useState<DeviceControl[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<DeviceControl | null>(null);
  const [mergeStatus, setMergeStatus] = useState<'idle' | 'merging' | 'merged'>('idle');
  const [mergeResult, setMergeResult] = useState<NeuralMergeResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [command, setCommand] = useState('');
  const [radarRotation, setRadarRotation] = useState(0);
  
  // Quantitative Settings
  const [fusionConfig, setFusionConfig] = useState<FusionConfig>({
    intensity: 85,
    frequency: 440,
    bandwidth: 1.2,
    encryptionLevel: 'AES-256'
  });

  // External Link Input
  const [externalIp, setExternalIp] = useState('');

  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => setRadarRotation(r => (r + 5) % 360), 50);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const scanForDevices = () => {
    setIsScanning(true);
    setScannedDevices([]);
    addLog("INITIATING_PERIPHERAL_SCAN_PROTOCOL...");

    // Simulated scan for demo purposes, but faster
    setTimeout(() => {
      const mockDevices: DeviceControl[] = [
        { id: 'EXT_01', name: 'MacBook Pro M2', type: 'PC', status: 'online', ip: '192.168.1.42', os: 'macOS 14', protocol: 'wifi' },
        { id: 'EXT_02', name: 'iPhone 15 Pro', type: 'PHONE', status: 'online', ip: '192.168.1.15', os: 'iOS 17', protocol: 'bluetooth' },
        { id: 'EXT_03', name: 'Tesla Matrix V4', type: 'IOT', status: 'online', ip: '10.0.0.8', os: 'TeslaOS', protocol: 'wifi' },
        { id: 'EXT_04', name: 'Sony Bravia 8K', type: 'TV', status: 'online', ip: '192.168.1.99', os: 'Android TV', protocol: 'wifi' }
      ];
      setScannedDevices(mockDevices);
      setIsScanning(false);
      addLog("SCAN_COMPLETE: 04_TARGETS_ACQUIRED_STABLE.");
    }, 1500);
  };

  const handleExternalLink = () => {
    if (!externalIp.trim()) return;
    const newDevice: DeviceControl = {
      id: `EXT_${Math.random().toString(36).substr(2, 5)}`,
      name: `External_Neural_Node`,
      type: 'CLOUD_RELAY',
      status: 'online',
      ip: externalIp,
      os: 'Sarah_Core_Remote',
      protocol: 'external_ip'
    };
    setScannedDevices([newDevice, ...scannedDevices]);
    setSelectedDevice(newDevice);
    addLog(`EXTERNAL_HANDSHAKE_INITIALIZED: ${externalIp}`);
  };

  const initiateMerge = async () => {
    if (!selectedDevice) return;
    setMergeStatus('merging');
    addLog(`STARTING_NEURAL_MERGE: Target ${selectedDevice.name}...`);
    
    try {
      const result = await orchestrateGlobalFusion(selectedDevice.name, fusionConfig, language);
      
      setMergeResult(result);
      setMergeStatus('merged');
      addLog(`MERGE_SUCCESSFUL: SARAH_V12_CORE_INTEGRATED`);
      addLog(`SECURITY_AUDIT: ${result.vulnerabilitiesFound.length} VULNERABILITIES_PATCHED`);
    } catch (err) {
      setMergeStatus('idle');
      addLog(`ERROR: MERGE_REJECTED_BY_TARGET_SECURITY`);
    }
  };

  const sendOverride = async () => {
    if (!command.trim() || !selectedDevice) return;
    addLog(`> OVERRIDE_INJECT: ${command}`);
    try {
      const res = await executeUniversalCommand(command, selectedDevice.type, language);
      addLog(`🗣️ SARAH_RESPONSE: ${res.vocalResponse}`);
      setCommand('');
    } catch (err) {
      addLog(`❌ OVERRIDE_FAILED: PROTOCOL_BREACH`);
    }
  };

  return (
    <div className="max-w-full mx-auto space-y-10 animate-fadeIn font-arabic pb-40">
      
      {/* Unified Control Header */}
      <div className="bg-slate-950/80 backdrop-blur-3xl border border-blue-500/30 p-12 rounded-[4rem] shadow-[0_0_120px_rgba(59,130,246,0.15)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent)]"></div>
        <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
          <div className="flex items-center gap-10">
            <div className={`w-24 h-24 rounded-[3rem] border-2 flex items-center justify-center text-5xl transition-all duration-1000 ${mergeStatus === 'merged' ? 'bg-blue-600 border-blue-400 shadow-[0_0_60px_rgba(59,130,246,0.6)] scale-110' : isScanning ? 'bg-blue-900 border-blue-500 animate-spin shadow-2xl' : 'bg-slate-900 border-white/5'}`}>
               {mergeStatus === 'merged' ? '🛡️' : isScanning ? '📡' : '🔗'}
            </div>
            <div>
              <h2 className="text-6xl font-black text-white tracking-tighter">الجسر <span className="text-blue-500">العالمي</span></h2>
              <p className="text-slate-500 font-bold uppercase tracking-[0.4em] mt-2">Universal_Neural_Bridge_V12.4_Stable</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-4">
             <div className="flex gap-4">
               <input 
                 type="text" 
                 value={externalIp}
                 onChange={(e) => setExternalIp(e.target.value)}
                 placeholder=" Neural Address (IP/ID)..."
                 className="bg-black/60 border border-white/10 rounded-2xl px-6 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-all text-right w-64"
               />
               <button 
                 onClick={handleExternalLink}
                 className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
               >
                 Connect_Remote
               </button>
             </div>
             <button 
               onClick={scanForDevices}
               disabled={isScanning || mergeStatus === 'merging'}
               className="px-10 py-4 bg-white/5 border border-white/10 rounded-[2rem] text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-4 group"
             >
               {isScanning ? 'جاري تمشيط المحيط...' : 'بدء مسح الرادار الطبقي'}
               <span className={`w-2 h-2 rounded-full ${isScanning ? 'bg-blue-500 animate-ping' : 'bg-slate-700'}`}></span>
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: System Operator Controls */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-black/40 rounded-[3.5rem] border border-white/5 p-10 space-y-10 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.02),transparent)] pointer-events-none"></div>
              <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest border-b border-white/5 pb-8">المشغل السيادي (Operator)</h3>
              
              {/* Quantitative Settings Sliders */}
              <div className="space-y-10">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] text-slate-500 font-black uppercase">Fusion_Intensity</span>
                       <span className="text-xl font-black text-blue-400">{fusionConfig.intensity}%</span>
                    </div>
                    <input 
                      type="range" min="1" max="100" 
                      value={fusionConfig.intensity}
                      onChange={(e) => setFusionConfig({...fusionConfig, intensity: parseInt(e.target.value)})}
                      className="w-full accent-blue-600 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                    />
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] text-slate-500 font-black uppercase">Signal_Frequency</span>
                       <span className="text-xl font-black text-emerald-400">{fusionConfig.frequency} Hz</span>
                    </div>
                    <input 
                      type="range" min="100" max="1000" 
                      value={fusionConfig.frequency}
                      onChange={(e) => setFusionConfig({...fusionConfig, frequency: parseInt(e.target.value)})}
                      className="w-full accent-emerald-600 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                    />
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] text-slate-500 font-black uppercase">Tunneling_Rate</span>
                       <span className="text-xl font-black text-purple-400">{fusionConfig.bandwidth} Gbps</span>
                    </div>
                    <input 
                      type="range" min="0.1" max="10" step="0.1"
                      value={fusionConfig.bandwidth}
                      onChange={(e) => setFusionConfig({...fusionConfig, bandwidth: parseFloat(e.target.value)})}
                      className="w-full accent-purple-600 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                    />
                 </div>

                 <div className="space-y-4 pt-6">
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Encryption_Protocol</span>
                    <div className="grid grid-cols-2 gap-2">
                       {['AES-256', 'Quantum_RSA'].map(lvl => (
                         <button 
                            key={lvl}
                            onClick={() => setFusionConfig({...fusionConfig, encryptionLevel: lvl as any})}
                            className={`py-3 rounded-xl text-[9px] font-black border transition-all ${fusionConfig.encryptionLevel === lvl ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-slate-500'}`}
                         >
                           {lvl}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           {/* Radar Display Simulation */}
           <div className="bg-[#050505] rounded-[3.5rem] p-10 border border-blue-900/10 flex flex-col items-center justify-center h-[400px] relative overflow-hidden group shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
              <div 
                className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-blue-500/5 rounded-full"
                style={{ transform: `translate(-50%, -50%) rotate(${radarRotation}deg)` }}
              >
                 <div className="w-1/2 h-px bg-gradient-to-r from-transparent to-blue-500 absolute top-1/2 left-1/2 origin-left shadow-[0_0_20px_blue]"></div>
              </div>
              <div className="relative z-10 text-center space-y-4">
                 <div className="text-5xl animate-pulse grayscale opacity-40">📡</div>
                 <p className="text-[10px] font-black text-blue-900 uppercase tracking-[0.5em]">{isScanning ? 'Scanning_Layers...' : 'Radar_Standby'}</p>
              </div>
           </div>
        </div>

        {/* Center: Targets & Merge View */}
        <div className="lg:col-span-8 space-y-8 flex flex-col">
           
           <div className="bg-slate-900/40 rounded-[4rem] border border-white/5 p-12 flex-1 shadow-2xl flex flex-col overflow-hidden">
              {!selectedDevice ? (
                <div className="flex-1 flex flex-col items-center justify-center opacity-10 grayscale pointer-events-none gap-10">
                   <div className="text-[14rem] animate-pulse">🛰️</div>
                   <p className="text-4xl font-black uppercase tracking-[1em] text-center">Awaiting_Neural_Target</p>
                </div>
              ) : (
                <div className="animate-fadeIn space-y-12 flex-1 flex flex-col">
                   <div className="flex justify-between items-start border-b border-white/5 pb-10">
                      <div className="text-right space-y-2">
                         <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Target_Active: {selectedDevice.id}</span>
                         <h3 className="text-5xl font-black text-white">{selectedDevice.name}</h3>
                         <div className="flex items-center gap-4 justify-end">
                            <span className="text-xs font-mono text-slate-500">{selectedDevice.ip}</span>
                            <span className="px-4 py-1 bg-blue-600/10 text-blue-400 text-[10px] font-black rounded-full border border-blue-500/20">{selectedDevice.os}</span>
                         </div>
                      </div>
                      
                      {mergeStatus === 'idle' && (
                        <button 
                          onClick={initiateMerge}
                          className="px-16 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2.5rem] font-black text-2xl transition-all shadow-[0_30px_60px_rgba(37,99,235,0.4)] active:scale-95"
                        >
                          بدء الارتباط والاندماج ⚡
                        </button>
                      )}

                      {mergeStatus === 'merging' && (
                        <div className="flex flex-col items-center gap-4 animate-pulse">
                           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                           <span className="text-sm font-black text-blue-400 uppercase tracking-widest">Infiltrating_Neural_Layers...</span>
                        </div>
                      )}

                      {mergeStatus === 'merged' && (
                        <div className="px-10 py-5 bg-emerald-500 text-black rounded-[2rem] font-black text-xl flex items-center gap-4 shadow-[0_0_50px_rgba(16,185,129,0.5)]">
                           <span>LINK_STABLE</span>
                           <span className="text-2xl animate-pulse">✅</span>
                        </div>
                      )}
                   </div>

                   {mergeStatus === 'merged' && mergeResult && (
                     <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10 overflow-y-auto no-scrollbar">
                        <div className="space-y-8">
                           <h4 className="text-2xl font-black text-white">تحكم النواة السيادي</h4>
                           <textarea 
                             value={command}
                             onChange={(e) => setCommand(e.target.value)}
                             placeholder="أرسل أمراً للنظام المدمج (مثل: System_Dump, Redirect_Traffic)..."
                             className="w-full bg-black/60 border border-white/10 rounded-[2.5rem] p-8 text-lg text-white h-40 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none text-right"
                           />
                           <button 
                             onClick={sendOverride}
                             className="w-full py-5 bg-white text-black rounded-2xl font-black text-lg hover:bg-blue-600 hover:text-white transition-all shadow-xl"
                           >حقن الأمر العصبوني 💉</button>
                        </div>
                        
                        <div className="bg-blue-950/20 border border-blue-500/10 rounded-[3rem] p-10 flex flex-col gap-6">
                           <h4 className="text-xl font-black text-blue-400">Blueprint_Integration</h4>
                           <div className="bg-black/40 p-6 rounded-2xl font-mono text-[10px] text-blue-200 h-40 overflow-auto no-scrollbar border border-white/5 dir-ltr text-left">
                              {mergeResult.connectionBlueprint}
                           </div>
                           <div className="space-y-4">
                              <span className="text-[10px] font-black text-slate-500 uppercase">System_Summary</span>
                              <p className="text-sm text-slate-300 leading-relaxed italic">"{mergeResult.systemSummary}"</p>
                           </div>
                        </div>
                     </div>
                   )}

                   {!mergeResult && mergeStatus !== 'merging' && (
                     <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto no-scrollbar">
                        {scannedDevices.map(d => (
                          <button 
                            key={d.id}
                            onClick={() => setSelectedDevice(d)}
                            className={`p-8 rounded-[3rem] border-2 transition-all text-right group ${selectedDevice?.id === d.id ? 'bg-white text-black border-white shadow-2xl scale-105' : 'bg-white/5 border-white/5 text-white/40 hover:border-blue-500/30'}`}
                          >
                            <div className="flex justify-between items-center mb-4">
                               <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl bg-black/10`}>
                                  {d.type === 'PC' ? '💻' : d.type === 'PHONE' ? '📱' : '📡'}
                               </div>
                               <span className="text-[10px] font-mono opacity-40">{d.protocol}</span>
                            </div>
                            <h5 className="text-xl font-black mb-1">{d.name}</h5>
                            <p className="text-xs opacity-50">{d.ip}</p>
                          </button>
                        ))}
                     </div>
                   )}
                </div>
              )}
           </div>

           {/* Live Operational Terminal */}
           <div className="h-64 bg-black/90 rounded-[3.5rem] border border-white/5 p-10 flex flex-col shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div></div>
              <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] mb-6">Live_Operator_Console</h3>
              <div ref={terminalRef} className="flex-1 overflow-y-auto font-mono text-[10px] text-blue-900 space-y-2 no-scrollbar text-left dir-ltr">
                 {logs.map((log, i) => (
                   <div key={i} className={`animate-fadeIn flex gap-4 ${log.includes('SUCCESS') ? 'text-emerald-500' : log.includes('ERROR') ? 'text-red-500' : 'opacity-40'}`}>
                      <span className="text-slate-800 shrink-0">[{i}]</span>
                      <span className="whitespace-pre-wrap">{log}</span>
                   </div>
                 ))}
                 {logs.length === 0 && <div className="text-slate-900 italic">STANDBY_FOR_NEURAL_TRAFFIC...</div>}
              </div>
           </div>

        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
      `}</style>
    </div>
  );
};
