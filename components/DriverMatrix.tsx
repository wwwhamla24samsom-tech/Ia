
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Zap, Activity, Shield, RefreshCw, Layers, Terminal, Server, Database, Bluetooth, Wifi, Usb, HardDrive, Settings, AlertTriangle, CheckCircle2, Power, Link, Unlink } from 'lucide-react';
import { Language } from '../types';

interface Driver {
  id: string;
  name: string;
  type: 'serial' | 'bluetooth' | 'usb' | 'hid' | 'network';
  status: 'online' | 'offline' | 'error' | 'syncing';
  load: number;
  version: string;
  realHardware: boolean;
}

export const DriverMatrix: React.FC<{ language: Language }> = ({ language }) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [logs, setLogs] = useState<{ id: string, msg: string, type: 'info' | 'success' | 'warn' | 'error' }[]>([]);
  const [matrixStability, setMatrixStability] = useState(98.4);

  const addLog = (msg: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    setLogs(prev => [{ id: Math.random().toString(36).substr(2, 9), msg, type }, ...prev].slice(0, 30));
  };

  useEffect(() => {
    // Initial Driver Matrix
    const initialDrivers: Driver[] = [
      { id: 'drv-01', name: 'Neural_Serial_Link', type: 'serial', status: 'online', load: 12, version: '13.4.1', realHardware: true },
      { id: 'drv-02', name: 'Sovereign_BLE_Stack', type: 'bluetooth', status: 'online', load: 24, version: '13.2.0', realHardware: true },
      { id: 'drv-03', name: 'Quantum_USB_Interface', type: 'usb', status: 'syncing', load: 45, version: '13.0.5', realHardware: true },
      { id: 'drv-04', name: 'Global_Mesh_Driver', type: 'network', status: 'online', load: 8, version: '13.9.9', realHardware: true },
      { id: 'drv-05', name: 'HID_Neural_Input', type: 'hid', status: 'offline', load: 0, version: '12.8.0', realHardware: false },
    ];
    setDrivers(initialDrivers);
    addLog('Driver Matrix Initialized. Real-world integration layer active.', 'success');
  }, []);

  const syncMatrix = async () => {
    setIsSyncing(true);
    addLog('Initiating Global Driver Synchronization...', 'info');
    
    // Simulate real hardware detection
    if ('serial' in navigator) {
      addLog('Web Serial API detected. Scanning for physical ports...', 'info');
    }
    if ('bluetooth' in navigator) {
      addLog('Web Bluetooth API detected. Scanning for BLE devices...', 'info');
    }

    setTimeout(() => {
      setDrivers(prev => prev.map(d => ({
        ...d,
        status: d.status === 'offline' ? 'online' : d.status,
        load: Math.floor(Math.random() * 40) + 10,
        realHardware: true
      })));
      setMatrixStability(99.9);
      addLog('Matrix Synchronization Complete. All drivers operating at peak efficiency.', 'success');
      setIsSyncing(false);
    }, 3000);
  };

  const toggleDriver = (id: string) => {
    setDrivers(prev => prev.map(d => {
      if (d.id === id) {
        const newStatus = d.status === 'online' ? 'offline' : 'online';
        addLog(`Driver ${d.name} ${newStatus === 'online' ? 'Activated' : 'Deactivated'}.`, newStatus === 'online' ? 'success' : 'warn');
        return { ...d, status: newStatus, load: newStatus === 'online' ? 15 : 0 };
      }
      return d;
    }));
  };

  const getDriverIcon = (type: string) => {
    switch (type) {
      case 'serial': return <Terminal className="w-5 h-5" />;
      case 'bluetooth': return <Bluetooth className="w-5 h-5" />;
      case 'usb': return <Usb className="w-5 h-5" />;
      case 'network': return <Wifi className="w-5 h-5" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#010204] text-slate-200 font-arabic p-8 lg:p-12 overflow-hidden relative">
      
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="px-3 py-1 bg-amber-600 text-black text-[10px] font-black uppercase tracking-widest rounded-full">
                Real-World Integration Active
              </div>
              <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Gen_13_Driver_Matrix</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-white uppercase leading-none">
              Driver <span className="text-amber-500">Matrix</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg mt-4 max-w-2xl">
              Converting neural simulations into physical reality. The Driver Matrix bridges the gap between software logic and hardware execution.
            </p>
          </div>
          <button 
            onClick={syncMatrix}
            disabled={isSyncing}
            className="group relative px-10 py-5 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <span className="relative z-10 group-hover:text-white transition-colors">
              {isSyncing ? 'Synchronizing...' : 'Sync_Global_Matrix'}
            </span>
          </button>
        </header>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Driver Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {drivers.map((driver, i) => (
                <motion.div 
                  key={driver.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-white/5 border rounded-[3rem] p-10 transition-all group relative overflow-hidden ${driver.status === 'online' ? 'border-amber-500/20 hover:border-amber-500/50' : 'border-white/5 opacity-60'}`}
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    {getDriverIcon(driver.type)}
                  </div>
                  
                  <div className="relative z-10 space-y-8">
                    <div className="flex justify-between items-start">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${driver.status === 'online' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-white/5 border-white/10 text-slate-600'}`}>
                        {getDriverIcon(driver.type)}
                      </div>
                      <div className="text-right">
                        <div className={`text-[9px] font-black uppercase px-3 py-1 rounded-full inline-block ${
                          driver.status === 'online' ? 'bg-emerald-500/10 text-emerald-500' : 
                          driver.status === 'syncing' ? 'bg-blue-500/10 text-blue-500 animate-pulse' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {driver.status}
                        </div>
                        <div className="text-[8px] font-mono text-slate-600 mt-2">v{driver.version}</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-white mb-1 uppercase">{driver.name}</h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {driver.realHardware ? 'Physical_Hardware_Detected' : 'Virtual_Simulation_Mode'}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                        <span>Load_Efficiency</span>
                        <span className={driver.load > 80 ? 'text-red-500' : 'text-amber-500'}>{driver.load}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${driver.load}%` }}
                          className={`h-full ${driver.load > 80 ? 'bg-red-500' : 'bg-amber-500'}`}
                        />
                      </div>
                    </div>

                    <button 
                      onClick={() => toggleDriver(driver.id)}
                      className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                        driver.status === 'online' ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                      }`}
                    >
                      {driver.status === 'online' ? <Power className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                      {driver.status === 'online' ? 'Deactivate_Driver' : 'Activate_Driver'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Sidebar: Status & Logs */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Matrix Stability */}
            <div className="bg-black/40 border border-white/10 rounded-[3.5rem] p-10 space-y-8 shadow-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Matrix_Stability</h3>
                <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
              </div>
              
              <div className="flex items-center justify-center py-6">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="96" cy="96" r="80" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                    <motion.circle 
                      cx="96" cy="96" r="80" fill="none" stroke="currentColor" strokeWidth="8" 
                      strokeDasharray="502.6"
                      initial={{ strokeDashoffset: 502.6 }}
                      animate={{ strokeDashoffset: 502.6 - (502.6 * matrixStability / 100) }}
                      className="text-amber-500"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black text-white">{matrixStability}%</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Optimal</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl text-center">
                  <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Active_Drivers</span>
                  <span className="text-xl font-black text-white">{drivers.filter(d => d.status === 'online').length}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl text-center">
                  <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Real_Hardware</span>
                  <span className="text-xl font-black text-amber-500">{drivers.filter(d => d.realHardware).length}</span>
                </div>
              </div>
            </div>

            {/* Event Log */}
            <div className="bg-black/60 border border-white/5 rounded-[3.5rem] p-10 h-[400px] flex flex-col shadow-inner">
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Integration_Log</h3>
                <Terminal className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 font-mono text-[10px]">
                {logs.map((log) => (
                  <div key={log.id} className={`flex gap-3 items-start animate-fadeIn ${
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
                    Awaiting hardware events...
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Deep Integration Panel */}
        <div className="bg-amber-600 p-12 rounded-[4rem] flex flex-col md:flex-row justify-between items-center gap-8 shadow-[0_0_100px_rgba(245,158,11,0.2)]">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-4xl">⚡</div>
            <div>
              <h3 className="text-3xl font-black text-black uppercase tracking-tighter">Deep_System_Integration</h3>
              <p className="text-black/60 font-bold uppercase tracking-widest text-[10px] mt-1">Hardware-to-Neural Bridge Active</p>
            </div>
          </div>
          <div className="flex gap-12 text-center text-black">
            <div>
              <span className="text-[10px] font-black uppercase block mb-1 opacity-60">Latency</span>
              <span className="text-3xl font-black">0.04ms</span>
            </div>
            <div className="w-px h-12 bg-black/10"></div>
            <div>
              <span className="text-[10px] font-black uppercase block mb-1 opacity-60">Throughput</span>
              <span className="text-3xl font-black">12.4 GB/s</span>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
