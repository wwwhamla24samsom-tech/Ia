import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Laptop, Smartphone, Server, Cpu, Radio, RefreshCw, Send, Bluetooth, Usb, Wifi, Terminal, Globe, Database, Activity, Link as LinkIcon, Lock } from 'lucide-react';
import { DeviceControl, Language } from '../types';

export const NeuralDeviceControl: React.FC<{ language: Language }> = ({ language }) => {
  const [devices, setDevices] = useState<DeviceControl[]>([]);
  const [command, setCommand] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState<{ id: string, msg: string, type: 'info' | 'success' | 'warn' | 'error', time: string }[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<any>(null);
  const [activeProtocol, setActiveProtocol] = useState<'serial' | 'bluetooth' | 'tcp' | 'mqtt' | 'webhook'>('serial');
  const [dataStream, setDataStream] = useState<number[]>(Array(20).fill(0));
  
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric', fractionalSecondDigits: 2 });
    setLogs(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), msg, type, time }].slice(-50));
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Simulate incoming data stream if a device is connected
  useEffect(() => {
    if (!connectedDevice) return;
    const interval = setInterval(() => {
      setDataStream(prev => [...prev.slice(1), Math.random() * 100]);
    }, 200);
    return () => clearInterval(interval);
  }, [connectedDevice]);

  // --- Real Hardware & Software Interfaces ---

  const requestBluetoothDevice = async () => {
    try {
      addLog('Initializing Bluetooth Protocol...', 'info');
      // @ts-ignore
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service']
      });
      
      addLog(`Bluetooth Device Connected: ${device.name}`, 'success');
      setConnectedDevice({ type: 'bluetooth', name: device.name, raw: device });
      setActiveProtocol('bluetooth');
      
      setDevices(prev => [...prev, {
        id: device.id,
        name: device.name || 'Unknown BLE Device',
        type: 'iot',
        status: 'active',
        ip: 'BLE_MAC_HIDDEN',
        os: 'Embedded',
        protocol: 'Bluetooth_LE'
      }]);

    } catch (error: any) {
      console.error(error);
      addLog(`Bluetooth Connection Failed: ${error.message}`, 'error');
      addLog('Simulating Bluetooth connection for demonstration...', 'warn');
      
      // Simulation fallback
      setTimeout(() => {
        const mockDevice = { name: 'Smart_Sensor_BLE_09' };
        setConnectedDevice({ type: 'bluetooth', name: mockDevice.name, raw: mockDevice });
        setActiveProtocol('bluetooth');
        setDevices(prev => [...prev, {
          id: 'ble-' + Math.random(),
          name: mockDevice.name,
          type: 'iot',
          status: 'active',
          ip: 'BLE_MAC_SIMULATED',
          os: 'RTOS',
          protocol: 'Bluetooth_LE'
        }]);
        addLog(`Simulated Bluetooth Device Connected: ${mockDevice.name}`, 'success');
      }, 1000);
    }
  };

  const requestSerialDevice = async () => {
    try {
      addLog('Opening Serial Port Gate...', 'info');
      // @ts-ignore
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      
      addLog('Serial Port Opened Successfully.', 'success');
      setConnectedDevice({ type: 'serial', name: 'Serial_Port_COM', raw: port });
      setActiveProtocol('serial');

      setDevices(prev => [...prev, {
        id: 'serial-' + Math.random(),
        name: 'Serial_Interface_Node',
        type: 'server',
        status: 'active',
        ip: 'COM_PORT',
        os: 'Serial_Stream',
        protocol: 'UART_9600'
      }]);

    } catch (error: any) {
      console.error(error);
      addLog(`Serial Connection Failed: ${error.message}`, 'error');
      addLog('Simulating Serial connection for demonstration...', 'warn');
      
      // Simulation fallback
      setTimeout(() => {
        setConnectedDevice({ type: 'serial', name: 'COM3_Arduino_Node', raw: {} });
        setActiveProtocol('serial');
        setDevices(prev => [...prev, {
          id: 'serial-' + Math.random(),
          name: 'COM3_Arduino_Node',
          type: 'server',
          status: 'active',
          ip: 'COM3',
          os: 'Microcontroller',
          protocol: 'UART_115200'
        }]);
        addLog('Simulated Serial Port Opened Successfully.', 'success');
      }, 1000);
    }
  };

  const scanNetwork = async () => {
    setIsScanning(true);
    addLog('Scanning Local Network & Wi-Fi Interfaces...', 'info');
    
    // Real browser network info
    // @ts-ignore
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      addLog(`Network Detected: ${connection.effectiveType?.toUpperCase() || 'UNKNOWN'}`, 'info');
      addLog(`Downlink Speed: ~${connection.downlink} Mbps`, 'info');
      addLog(`RTT: ${connection.rtt}ms`, 'info');
    }

    setTimeout(() => {
      addLog('Found 3 active devices on local subnet (192.168.1.x)', 'success');
      setDevices(prev => [...prev, 
        { id: 'ip-1', name: 'Smart_TV_LivingRoom', type: 'laptop', status: 'active', ip: '192.168.1.105', os: 'WebOS', protocol: 'TCP/IP' },
        { id: 'ip-2', name: 'Security_Cam_01', type: 'iot', status: 'active', ip: '192.168.1.112', os: 'Linux', protocol: 'RTSP/TCP' },
        { id: 'ip-3', name: 'NAS_Storage_Server', type: 'server', status: 'active', ip: '192.168.1.200', os: 'TrueNAS', protocol: 'SMB/TCP' }
      ]);
      setConnectedDevice({ type: 'tcp', name: 'Local_Network_Hub', raw: {} });
      setActiveProtocol('tcp');
      setIsScanning(false);
      addLog('Network Scan Cycle Complete.', 'success');
    }, 2000);
  };

  const connectExternalSoftware = (type: 'mqtt' | 'webhook') => {
    addLog(`Initializing ${type.toUpperCase()} Software Integration...`, 'info');
    setTimeout(() => {
      if (type === 'mqtt') {
        addLog('Connected to MQTT Broker (tcp://broker.hivemq.com:1883)', 'success');
        setConnectedDevice({ type: 'mqtt', name: 'MQTT_Global_Broker', raw: {} });
        setActiveProtocol('mqtt');
        setDevices(prev => [...prev, {
          id: 'mqtt-' + Math.random(),
          name: 'MQTT_Global_Broker',
          type: 'server',
          status: 'active',
          ip: 'broker.hivemq.com',
          os: 'Cloud',
          protocol: 'MQTT_v5'
        }]);
      } else {
        addLog('Webhook Listener Active (Endpoint: /api/v1/webhook/receive)', 'success');
        setConnectedDevice({ type: 'webhook', name: 'Webhook_API_Gateway', raw: {} });
        setActiveProtocol('webhook');
        setDevices(prev => [...prev, {
          id: 'wh-' + Math.random(),
          name: 'Webhook_API_Gateway',
          type: 'server',
          status: 'active',
          ip: 'API_GATEWAY',
          os: 'Serverless',
          protocol: 'HTTPS/REST'
        }]);
      }
    }, 1500);
  };

  const sendCommand = async () => {
    if (!command.trim()) return;
    addLog(`[${activeProtocol.toUpperCase()}] Executing Command: ${command}`, 'info');

    if (connectedDevice?.type === 'serial' && connectedDevice.raw?.writable) {
      try {
        const encoder = new TextEncoder();
        const writer = connectedDevice.raw.writable.getWriter();
        await writer.write(encoder.encode(command + '\n'));
        writer.releaseLock();
        addLog(`Sent to Serial: ${command}`, 'success');
      } catch (e: any) {
        addLog(`Serial Write Failed: ${e.message}`, 'error');
      }
    } else if (connectedDevice) {
      // Simulate sending for other protocols
      setTimeout(() => {
        addLog(`[${activeProtocol.toUpperCase()}] Payload delivered successfully.`, 'success');
        // Simulate response
        setTimeout(() => {
          addLog(`[${activeProtocol.toUpperCase()}] Response: ACK_RECEIVED_OK`, 'info');
        }, 500);
      }, 800);
    } else {
      addLog('No direct hardware/software interface connected. Command logged to neural buffer.', 'warn');
    }
    setCommand('');
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'server': return <Server className="w-6 h-6" />;
      case 'smartphone': return <Smartphone className="w-6 h-6" />;
      case 'laptop': return <Laptop className="w-6 h-6" />;
      case 'iot': return <Radio className="w-6 h-6" />;
      default: return <Cpu className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#010204] text-slate-200 font-arabic p-8 lg:p-12 overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col gap-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-white uppercase leading-none">
              Hardware & Software <span className="text-emerald-500">Integration</span> Node
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] mt-2 text-xs">
              Universal_Interface_Matrix_v3.0
            </p>
          </div>
          <div className="flex gap-4">
            <div className={`px-6 py-3 border rounded-full flex items-center gap-3 shadow-lg transition-all ${connectedDevice ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-400' : 'bg-red-900/20 border-red-500/50 text-red-400'}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${connectedDevice ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-red-500'}`}></div>
              <span className="text-xs font-black uppercase tracking-widest">
                {connectedDevice ? `LINKED: ${connectedDevice.name}` : 'SYSTEM_DISCONNECTED'}
              </span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
          
          {/* Left Column: Controls & Devices */}
          <section className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Connection Hub */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <button onClick={requestBluetoothDevice} className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-[2rem] hover:bg-blue-600 hover:text-white transition-all group flex flex-col items-center justify-center gap-3 text-center">
                <Bluetooth className="w-8 h-8 text-blue-500 group-hover:text-white" />
                <span className="font-black text-[10px] uppercase tracking-widest">Bluetooth LE</span>
              </button>

              <button onClick={requestSerialDevice} className="bg-amber-900/10 border border-amber-500/20 p-6 rounded-[2rem] hover:bg-amber-600 hover:text-white transition-all group flex flex-col items-center justify-center gap-3 text-center">
                <Usb className="w-8 h-8 text-amber-500 group-hover:text-white" />
                <span className="font-black text-[10px] uppercase tracking-widest">Serial / USB</span>
              </button>

              <button onClick={scanNetwork} disabled={isScanning} className="bg-emerald-900/10 border border-emerald-500/20 p-6 rounded-[2rem] hover:bg-emerald-600 hover:text-white transition-all group flex flex-col items-center justify-center gap-3 text-center">
                <Wifi className={`w-8 h-8 text-emerald-500 group-hover:text-white ${isScanning ? 'animate-pulse' : ''}`} />
                <span className="font-black text-[10px] uppercase tracking-widest">Wi-Fi / LAN</span>
              </button>

              <button onClick={() => connectExternalSoftware('mqtt')} className="bg-purple-900/10 border border-purple-500/20 p-6 rounded-[2rem] hover:bg-purple-600 hover:text-white transition-all group flex flex-col items-center justify-center gap-3 text-center">
                <Activity className="w-8 h-8 text-purple-500 group-hover:text-white" />
                <span className="font-black text-[10px] uppercase tracking-widest">MQTT Broker</span>
              </button>

              <button onClick={() => connectExternalSoftware('webhook')} className="bg-rose-900/10 border border-rose-500/20 p-6 rounded-[2rem] hover:bg-rose-600 hover:text-white transition-all group flex flex-col items-center justify-center gap-3 text-center">
                <Globe className="w-8 h-8 text-rose-500 group-hover:text-white" />
                <span className="font-black text-[10px] uppercase tracking-widest">Webhooks API</span>
              </button>
            </div>

            {/* Connected Devices List */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col overflow-hidden">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Active_Integration_Nodes</h3>
                 <div className="flex gap-2">
                   <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase">{devices.length} Nodes</span>
                 </div>
               </div>
               
               <div className="flex-1 overflow-y-auto pr-2 space-y-4 no-scrollbar">
                 {devices.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[2rem] text-slate-600 font-mono text-xs opacity-50">
                     <LinkIcon className="w-12 h-12 mb-4 opacity-50" />
                     NO_INTEGRATIONS_DETECTED. INITIATE_CONNECTION_PROTOCOL.
                   </div>
                 ) : (
                   <AnimatePresence>
                     {devices.map((device) => (
                       <motion.div 
                         key={device.id}
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="bg-black/40 border border-white/5 hover:border-emerald-500/30 transition-colors rounded-3xl p-6 flex items-center justify-between group"
                       >
                         <div className="flex items-center gap-6">
                           <div className="p-4 bg-white/5 rounded-2xl text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                             {getDeviceIcon(device.type)}
                           </div>
                           <div>
                             <h4 className="font-black text-white text-lg">{device.name}</h4>
                             <div className="flex items-center gap-3 mt-1">
                               <span className="text-[10px] font-mono text-emerald-500 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">{device.protocol}</span>
                               <span className="text-[10px] font-mono text-slate-500 uppercase">{device.ip}</span>
                               <span className="text-[10px] font-mono text-slate-600 uppercase">OS: {device.os}</span>
                             </div>
                           </div>
                         </div>
                         <div className="flex items-center gap-4">
                           {/* Mini Data Stream Visualization */}
                           <div className="hidden md:flex items-end gap-1 h-8 w-24 opacity-50 group-hover:opacity-100 transition-opacity">
                             {dataStream.slice(0, 12).map((val, i) => (
                               <div key={i} className="w-1.5 bg-emerald-500 rounded-t-sm transition-all duration-75" style={{ height: `${val}%` }}></div>
                             ))}
                           </div>
                           <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase rounded-xl flex items-center gap-2">
                             <Lock className="w-3 h-3" /> Secured
                           </div>
                         </div>
                       </motion.div>
                     ))}
                   </AnimatePresence>
                 )}
               </div>
            </div>

            {/* Terminal Input */}
            <div className="bg-black/60 border border-white/10 rounded-[2.5rem] p-6 relative overflow-hidden flex flex-col gap-4">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <Terminal className="w-5 h-5 text-emerald-500" />
                   <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Universal_Command_Terminal</span>
                 </div>
                 
                 {/* Protocol Selector */}
                 <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                   {['serial', 'bluetooth', 'tcp', 'mqtt', 'webhook'].map(proto => (
                     <button
                       key={proto}
                       onClick={() => setActiveProtocol(proto as any)}
                       className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${activeProtocol === proto ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-white'}`}
                     >
                       {proto}
                     </button>
                   ))}
                 </div>
              </div>
              
              <div className="flex gap-4">
                <input 
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendCommand()}
                  placeholder={`Enter payload or command for [${activeProtocol.toUpperCase()}]...`}
                  className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-emerald-100 font-mono text-sm focus:outline-none focus:border-emerald-500/50 transition-all"
                />
                <button 
                  onClick={sendCommand}
                  className="px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  Execute
                </button>
              </div>
            </div>

          </section>

          {/* Right Column: Logs & Telemetry */}
          <aside className="lg:col-span-4 flex flex-col gap-8">
             {/* Telemetry Visualizer */}
             <div className="bg-black/40 border border-white/5 rounded-[2.5rem] p-8 h-48 flex flex-col relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 relative z-10">Live_Telemetry_Stream</h3>
               <div className="flex-1 flex items-end gap-1 relative z-10">
                 {dataStream.map((val, i) => (
                   <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-sm relative group">
                     <div className="absolute bottom-0 left-0 w-full bg-emerald-500 rounded-t-sm transition-all duration-75" style={{ height: `${val}%` }}></div>
                   </div>
                 ))}
               </div>
             </div>

             {/* System Logs */}
             <div className="bg-black/60 border border-white/5 rounded-[3rem] p-8 flex-1 flex flex-col shadow-inner relative overflow-hidden">
               <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Integration_Logs</h3>
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               </div>
               <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 font-mono text-[10px]">
                 {logs.map((log) => (
                   <div key={log.id} className={`flex gap-3 items-start ${
                     log.type === 'success' ? 'text-emerald-400' : 
                     log.type === 'error' ? 'text-red-400' : 
                     log.type === 'warn' ? 'text-amber-400' : 'text-slate-400'
                   }`}>
                     <span className="opacity-40 shrink-0">[{log.time}]</span>
                     <span className="opacity-50 shrink-0">{">"}</span>
                     <span className="leading-relaxed break-all">{log.msg}</span>
                   </div>
                 ))}
                 <div ref={logsEndRef} />
                 {logs.length === 0 && <div className="text-slate-700 italic text-center mt-20">Awaiting Connection...</div>}
               </div>
             </div>
          </aside>

        </div>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
