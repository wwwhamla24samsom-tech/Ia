
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Radio, Search, Shield, Zap, Activity, MapPin, Wifi, Server, Database, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { fetchGlobalIntel } from '../services/geminiService';
import { Language } from '../types';

const GLOBAL_NODES = [
  { id: 'us-east', name: 'US_East_Prime', lat: 40.7128, lng: -74.0060, status: 'active' },
  { id: 'eu-central', name: 'EU_Central_Core', lat: 50.1109, lng: 8.6821, status: 'active' },
  { id: 'asia-pacific', name: 'Asia_Pacific_Hub', lat: 35.6762, lng: 139.6503, status: 'active' },
  { id: 'me-north', name: 'ME_Sovereign_Node', lat: 25.2048, lng: 55.2708, status: 'active' },
  { id: 'sa-south', name: 'SA_Data_Link', lat: -23.5505, lng: -46.6333, status: 'standby' },
];

export const GlobalInterface: React.FC<{ language: Language }> = ({ language }) => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [scanTarget, setScanTarget] = useState('');
  const [scanTopic, setScanTopic] = useState('Cybersecurity Trends');
  const [isScanning, setIsScanning] = useState(false);
  const [intelReport, setIntelReport] = useState<{ status: string; intel: string[]; threats: string[]; opportunities: string[] } | null>(null);
  const [logs, setLogs] = useState<{ id: string, msg: string, type: 'info' | 'success' | 'warn' }[]>([]);

  const addLog = (msg: string, type: 'info' | 'success' | 'warn' = 'info') => {
    setLogs(prev => [{ id: Math.random().toString(36).substr(2, 9), msg, type }, ...prev].slice(0, 20));
  };

  const handleScan = async () => {
    if (!scanTarget.trim()) return;
    setIsScanning(true);
    setIntelReport(null);
    addLog(`Initiating global scan on target: ${scanTarget}...`, 'info');
    
    try {
      const data = await fetchGlobalIntel(scanTarget, scanTopic, language);
      setIntelReport(data);
      addLog('Global intelligence successfully retrieved.', 'success');
    } catch (err) {
      addLog('Failed to establish global uplink.', 'warn');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000510] text-slate-200 font-arabic p-8 lg:p-12 overflow-hidden relative">
      
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#000510]/80 to-[#000510]"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div>
            <h1 className="text-6xl font-black tracking-tighter text-white uppercase leading-none flex items-center gap-4">
              <Globe className="w-16 h-16 text-blue-500 animate-pulse" />
              <span className="text-blue-500">GLOBAL</span> UPLINK
            </h1>
            <p className="text-blue-500/60 font-mono text-[10px] uppercase tracking-[0.4em] mt-2">
              Sovereign_Network_Status: <span className="text-blue-400 animate-pulse">CONNECTED</span> // Latency: 12ms
            </p>
          </div>
          
          <div className="flex items-center gap-6 bg-blue-950/20 p-6 rounded-[2rem] border border-blue-500/20 backdrop-blur-md">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-blue-500/60 uppercase tracking-widest">Active_Nodes</span>
              <span className="text-2xl font-black text-white font-mono">{GLOBAL_NODES.length} / 128</span>
            </div>
            <div className="p-4 bg-blue-600/20 rounded-xl animate-pulse">
              <Wifi className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </header>

        {/* World Map Visualization (Abstract) */}
        <div className="relative h-[400px] bg-blue-900/5 border border-blue-500/10 rounded-[3rem] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
          
          {/* Simulated Map Grid */}
          <div className="w-full h-full grid grid-cols-12 grid-rows-6 gap-1 opacity-10">
            {Array.from({ length: 72 }).map((_, i) => (
              <div key={i} className="border border-blue-500/20"></div>
            ))}
          </div>

          {/* Nodes */}
          {GLOBAL_NODES.map((node) => (
            <motion.button
              key={node.id}
              whileHover={{ scale: 1.2 }}
              onClick={() => { setActiveNode(node.id); setScanTarget(node.name); }}
              className={`absolute p-2 rounded-full border-2 transition-all z-20 group
                ${activeNode === node.id ? 'bg-blue-500 border-white shadow-[0_0_20px_#3b82f6]' : 'bg-black/60 border-blue-500/50 hover:bg-blue-500/20'}`}
              style={{ 
                top: `${(90 - node.lat) * (100/180)}%`, 
                left: `${(node.lng + 180) * (100/360)}%` 
              }}
            >
              <div className={`w-2 h-2 rounded-full ${node.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 border border-blue-500/30 rounded-lg text-[8px] font-black uppercase tracking-widest text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {node.name}
              </div>
            </motion.button>
          ))}

          {/* Scanning Effect */}
          {isScanning && (
            <div className="absolute inset-0 pointer-events-none">
              <motion.div 
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="absolute left-0 right-0 h-1 bg-blue-500/50 shadow-[0_0_20px_#3b82f6]"
              />
            </div>
          )}
        </div>

        {/* Control Panel & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Scan Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-black/40 border border-blue-500/20 rounded-[2.5rem] p-8 backdrop-blur-md">
              <h3 className="text-blue-500 font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <Radio className="w-4 h-4" /> Scan Parameters
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Target_Location</label>
                  <input 
                    type="text" 
                    value={scanTarget}
                    onChange={(e) => setScanTarget(e.target.value)}
                    placeholder="e.g., Silicon Valley, Tokyo, Global..."
                    className="w-full bg-black/40 border border-blue-500/20 rounded-xl px-4 py-3 text-sm font-mono text-blue-100 focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Intelligence_Topic</label>
                  <input 
                    type="text" 
                    value={scanTopic}
                    onChange={(e) => setScanTopic(e.target.value)}
                    placeholder="e.g., AI Trends, Cyber Threats..."
                    className="w-full bg-black/40 border border-blue-500/20 rounded-xl px-4 py-3 text-sm font-mono text-blue-100 focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                <button 
                  onClick={handleScan}
                  disabled={isScanning || !scanTarget}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20"
                >
                  {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Initiate_Global_Scan
                </button>
              </div>
            </div>

            {/* Logs */}
            <div className="bg-black/40 border border-white/5 rounded-[2.5rem] p-6 h-48 overflow-y-auto no-scrollbar font-mono text-[9px] space-y-2">
              {logs.map((log) => (
                <div key={log.id} className={`flex gap-2 ${log.type === 'success' ? 'text-emerald-400' : log.type === 'warn' ? 'text-amber-400' : 'text-slate-500'}`}>
                  <span>{">"}</span>
                  <span>{log.msg}</span>
                </div>
              ))}
              {logs.length === 0 && <span className="text-slate-700 italic">System ready for uplink...</span>}
            </div>
          </div>

          {/* Intelligence Report */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {intelReport ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white/5 border border-blue-500/10 rounded-[3rem] p-10 h-full relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    <Globe className="w-64 h-64" />
                  </div>

                  <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                      <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Intelligence Report</h2>
                        <p className="text-xs text-slate-400 font-mono mt-1">Target: {scanTarget} // Topic: {scanTopic}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3">Current_Status</h4>
                        <p className="text-slate-300 leading-relaxed font-medium">{intelReport.status}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                          <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3" /> Key_Intel
                          </h4>
                          <ul className="space-y-3">
                            {intelReport.intel.map((item, i) => (
                              <li key={i} className="text-xs text-slate-400 flex gap-2">
                                <span className="text-emerald-500/50">•</span> {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                          <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" /> Threats_&_Risks
                          </h4>
                          <ul className="space-y-3">
                            {intelReport.threats.map((item, i) => (
                              <li key={i} className="text-xs text-slate-400 flex gap-2">
                                <span className="text-amber-500/50">•</span> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-3">Strategic_Opportunities</h4>
                        <div className="flex flex-wrap gap-3">
                          {intelReport.opportunities.map((opp, i) => (
                            <span key={i} className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs text-purple-300 font-medium">
                              {opp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-white/5 rounded-[3rem]">
                  <Globe className="w-16 h-16 text-slate-700 mb-6 animate-pulse" />
                  <h3 className="text-xl font-black text-slate-600 uppercase tracking-widest mb-2">Awaiting Uplink</h3>
                  <p className="text-slate-500 text-sm max-w-md">Select a target node or enter manual coordinates to initiate global intelligence gathering.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
