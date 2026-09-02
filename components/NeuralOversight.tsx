
import React, { useState, useEffect, useRef } from 'react';
import { analyzeOversightLogs } from '../services/geminiService';
import { OversightReport, MonitoringProcess, NetworkConnection, Language } from '../types';

export const NeuralOversight: React.FC<{ language: Language }> = ({ language }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<OversightReport | null>(null);
  const [processes, setProcesses] = useState<MonitoringProcess[]>([]);
  const [connections, setConnections] = useState<NetworkConnection[]>([]);
  const [activeTab, setActiveTab] = useState<'processes' | 'network' | 'audit'>('processes');
  const [isLive, setIsLive] = useState(true);

  // توليد بيانات مراقبة وهمية (Simulation)
  useEffect(() => {
    if (!isLive) return;

    const generateMockData = () => {
      const mockProcs: MonitoringProcess[] = [
        { pid: '1024', name: 'Neural_Core_Daemon', usage: Math.random() * 5, status: 'trusted', origin: 'Sarah_OS' },
        { pid: '4452', name: 'Background_Analytics', usage: Math.random() * 12, status: 'trusted', origin: 'Google_Services' },
        { pid: '9901', name: 'unknown_agent_x', usage: Math.random() * 30, status: 'suspicious', origin: 'Remote_Binary' },
        { pid: '0012', name: 'System_Watchdog', usage: 1, status: 'trusted', origin: 'Sarah_OS' }
      ];
      setProcesses(mockProcs);

      const mockConns: NetworkConnection[] = [
        { id: 'C1', destination: '8.8.8.8', port: 443, protocol: 'HTTPS', dataSent: '1.2 KB' },
        { id: 'C2', destination: '192.168.1.105', port: 8080, protocol: 'TCP', dataSent: '450 B' },
        { id: 'C3', destination: 'spy-relay.darkweb.net', port: 666, protocol: 'UDP', dataSent: '20.5 MB' }
      ];
      setConnections(mockConns);
    };

    generateMockData();
    const interval = setInterval(generateMockData, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  const runDeepAudit = async () => {
    setLoading(true);
    const logSummary = `Processes: ${processes.map(p => p.name).join(', ')}. Connections: ${connections.map(c => c.destination).join(', ')}`;
    try {
      const data = await analyzeOversightLogs(logSummary, language);
      setReport(data);
      setActiveTab('audit');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto space-y-8 px-6 pb-40 text-right font-arabic selection:bg-red-500 selection:text-white">
      
      {/* Oversight Dashboard Header */}
      <div className="bg-slate-950 rounded-[3.5rem] p-12 shadow-[0_0_80px_rgba(239,68,68,0.1)] border border-white/5 -mt-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-10">
          <div className="flex items-center gap-6">
            <div className={`w-24 h-24 rounded-[2.5rem] border-2 flex items-center justify-center text-5xl transition-all duration-700 ${isLive ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)]' : 'bg-slate-900 border-white/5 opacity-50'}`}>
               👁️
            </div>
            <div>
               <h2 className="text-5xl font-black text-white tracking-tighter">نواة <span className="text-red-500">الرقابة</span></h2>
               <p className="text-slate-500 font-mono text-[10px] tracking-[0.5em] uppercase mt-2">Neural_Oversight: Real-Time_Anti-Spy</p>
            </div>
          </div>

          <div className="flex gap-4">
             <button 
               onClick={() => setIsLive(!isLive)}
               className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isLive ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-500'}`}
             >
               {isLive ? 'LIVE_STREAMING' : 'PAUSED'}
             </button>
             <button 
               onClick={runDeepAudit}
               disabled={loading}
               className="px-10 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-2xl"
             >
               {loading ? 'ANALYZING...' : 'RUN_DEEP_AUDIT ✨'}
             </button>
          </div>
        </div>

        {/* Status Mini-Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
           {[
             { label: 'Privacy Shield', status: 'ACTIVE', color: 'text-emerald-500' },
             { label: 'Cam/Mic Lock', status: 'LOCKED', color: 'text-emerald-500' },
             { label: 'Spyware Detected', status: '01 FOUND', color: 'text-red-500' },
             { label: 'Encryption', status: 'RSA-4096', color: 'text-cyan-500' }
           ].map(s => (
             <div key={s.label} className="bg-black/40 border border-white/5 p-6 rounded-3xl backdrop-blur-xl">
                <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">{s.label}</span>
                <span className={`text-xl font-black ${s.color}`}>{s.status}</span>
             </div>
           ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-10">
         
         {/* Navigation Tabs */}
         <div className="lg:w-64 flex flex-col gap-3">
            {[
              { id: 'processes', label: 'مراقبة العمليات', icon: '⚙️' },
              { id: 'network', label: 'تحليل الشبكة', icon: '📡' },
              { id: 'audit', label: 'تقرير الرقابة AI', icon: '🧠' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`p-6 rounded-[2rem] border transition-all text-right flex items-center justify-between group ${activeTab === tab.id ? 'bg-white text-black border-white shadow-xl scale-105' : 'bg-slate-900 border-white/5 text-slate-500 hover:border-white/20'}`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="font-black text-xs uppercase tracking-widest">{tab.label}</span>
              </button>
            ))}
         </div>

         {/* Content Display */}
         <div className="flex-1 min-h-[600px] bg-slate-900/30 backdrop-blur-3xl rounded-[3.5rem] border border-white/5 p-12 overflow-hidden shadow-inner">
            
            {activeTab === 'processes' && (
              <div className="space-y-8 animate-fadeIn">
                 <h3 className="text-2xl font-black text-white flex items-center gap-4">
                   <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                   مصفوفة العمليات النشطة (Process Matrix)
                 </h3>
                 <div className="space-y-4">
                    {processes.map(p => (
                      <div key={p.pid} className="bg-black/40 p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-red-500/30 transition-all">
                         <div className="flex gap-4">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${p.status === 'suspicious' ? 'bg-red-600 text-white animate-pulse' : 'bg-white/5 text-slate-400'}`}>
                               {p.status}
                            </span>
                            <button className="text-[10px] font-black text-slate-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">KILL_TASK</button>
                         </div>
                         <div className="text-right">
                            <div className="font-black text-white">{p.name}</div>
                            <div className="text-[10px] font-mono text-slate-500">PID: {p.pid} | Origin: {p.origin}</div>
                         </div>
                         <div className="w-24 text-right">
                            <span className="text-xs font-black text-red-500">{p.usage.toFixed(1)}%</span>
                            <div className="h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                               <div className="h-full bg-red-500" style={{ width: `${p.usage}%` }}></div>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {activeTab === 'network' && (
              <div className="space-y-8 animate-fadeIn">
                 <h3 className="text-2xl font-black text-white">تحليل تدفق البيانات (Network Analytics)</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {connections.map(c => (
                      <div key={c.id} className="bg-black/60 p-8 rounded-[2.5rem] border border-white/5 space-y-4 group hover:scale-[1.02] transition-all">
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] font-mono text-cyan-500">{c.protocol} Port: {c.port}</span>
                            <div className={`w-3 h-3 rounded-full ${c.destination.includes('darkweb') ? 'bg-red-500 shadow-[0_0_15px_red]' : 'bg-cyan-500 animate-pulse'}`}></div>
                         </div>
                         <div className="text-2xl font-black text-white truncate">{c.destination}</div>
                         <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <span>Sent: {c.dataSent}</span>
                            <span className={c.destination.includes('darkweb') ? 'text-red-500' : 'text-slate-700'}>
                               {c.destination.includes('darkweb') ? 'SUSPICIOUS_REMOTE_SERVER' : 'NODE_VERIFIED'}
                            </span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="space-y-8 animate-fadeIn">
                 {report ? (
                   <div className="space-y-10">
                      <div className={`p-10 rounded-[3rem] border-2 flex items-center justify-between ${report.isSafe ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-red-500/5 border-red-500/30'}`}>
                         <div>
                            <h4 className={`text-4xl font-black ${report.isSafe ? 'text-emerald-500' : 'text-red-500'}`}>
                               {report.isSafe ? 'النظام مؤمن تماماً' : 'تم اكتشاف نشاط مشبوه'}
                            </h4>
                            <p className="text-slate-400 mt-2">مستوى التهديد: {report.threatScore}/100</p>
                         </div>
                         <div className="text-6xl">{report.isSafe ? '✅' : '🚨'}</div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="bg-black/40 p-8 rounded-[2.5rem] border border-white/5">
                            <h5 className="text-xs font-black text-slate-500 uppercase mb-4 tracking-widest">Detected_Spyware_Signatures</h5>
                            <div className="space-y-3">
                               {report.detectedSpyware.map((s, i) => (
                                 <div key={i} className="flex items-center gap-3 text-red-400 font-bold">
                                    <span>⚠️</span> {s}
                                 </div>
                               ))}
                               {report.detectedSpyware.length === 0 && <div className="text-emerald-500">لا يوجد برمجيات تجسس معروفة</div>}
                            </div>
                         </div>
                         <div className="bg-black/40 p-8 rounded-[2.5rem] border border-white/5">
                            <h5 className="text-xs font-black text-slate-500 uppercase mb-4 tracking-widest">Recommended_Neural_Patch</h5>
                            <p className="text-slate-300 italic text-sm leading-relaxed">{report.recomendedAction}</p>
                         </div>
                      </div>

                      <div className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem]">
                         <h5 className="text-xs font-black text-slate-500 uppercase mb-4 tracking-widest">Final_Connection_Audit</h5>
                         <p className="text-white font-medium">{report.connectionAudit}</p>
                      </div>
                   </div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center opacity-20 py-40 grayscale pointer-events-none">
                      <div className="text-[12rem] mb-6 animate-pulse">🧠</div>
                      <p className="text-4xl font-black uppercase tracking-[1em]">Audit_Needed</p>
                   </div>
                 )}
              </div>
            )}

         </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};
