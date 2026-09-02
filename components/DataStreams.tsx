
import React, { useState, useEffect } from 'react';
import { distillDataStream, analyzeNeuralTraffic } from '../services/geminiService';
import { DataChannel } from '../types';

export const DataStreams: React.FC = () => {
  const [channels, setChannels] = useState<DataChannel[]>([]);
  const [loading, setLoading] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);
  const [distilledInsight, setDistilledInsight] = useState('');
  const [securityReport, setSecurityReport] = useState<any>(null);
  const [totalTraffic, setTotalTraffic] = useState(0);

  useEffect(() => {
    const names = ['ALPHA_STREAM', 'BETA_NETWORK', 'GAMMA_LINK', 'DELTA_HUB', 'EPSILON_PIPE', 'ZETA_FLOW'];
    setChannels(names.map(n => ({
      id: Math.random().toString(36).substr(2, 5),
      name: n,
      load: Math.floor(Math.random() * 100),
      status: 'active'
    })));

    const interval = setInterval(() => {
      setChannels(prev => prev.map(c => ({
        ...c,
        load: Math.min(100, Math.max(0, c.load + (Math.random() * 20 - 10)))
      })));
      setTotalTraffic(prev => prev + Math.random() * 0.5);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleDistill = async () => {
    setLoading(true);
    try {
      const sampleData = channels.map(c => `${c.name}: LOAD ${c.load.toFixed(2)}%`).join(', ');
      const insight = await distillDataStream(`قنوات نشطة حالياً: ${sampleData}. حلل التوجهات الكبرى.`);
      setDistilledInsight(insight);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityAudit = async () => {
    setAuditLoading(true);
    setSecurityReport(null);
    try {
      const streamData = channels.map(c => `CH: ${c.name} [LOAD: ${c.load.toFixed(1)}%] Status: ${c.status}`).join(' | ');
      const report = await analyzeNeuralTraffic(streamData);
      setSecurityReport(report);
    } catch (err) {
      console.error(err);
    } finally {
      setAuditLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto space-y-8 px-6 pb-48 text-right font-arabic">
      
      {/* Dynamic Header Section */}
      <div className="bg-[#020617] text-blue-400 rounded-[3.5rem] p-12 shadow-2xl -mt-10 relative overflow-hidden border border-white/5">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 relative z-10">
          <div>
            <div className="flex items-center gap-4 mb-4">
               <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
               <h2 className="text-5xl font-black text-white tracking-tighter">تدفق البيانات النورونية</h2>
            </div>
            <p className="text-blue-900 font-mono text-xs tracking-[0.5em] uppercase">Global_Neural_Ingestion_Matrix_v6.7</p>
          </div>
          <div className="bg-black/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Total_Traffic_Processed</span>
            <span className="text-4xl font-black text-white">{totalTraffic.toFixed(2)} <span className="text-blue-500 text-lg">PB</span></span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-16 relative z-10">
          {channels.map(channel => (
            <div key={channel.id} className={`bg-slate-950/50 p-6 rounded-[2rem] border transition-all duration-700 relative group overflow-hidden ${channel.load > 85 ? 'border-red-500/30' : 'border-blue-900/20'}`}>
              {channel.load > 85 && (
                <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
              )}
              <div className="flex justify-between items-center mb-6 relative z-10">
                <span className="text-[9px] font-black text-slate-700 font-mono">{channel.id}</span>
                <div className={`w-1.5 h-1.5 rounded-full ${channel.load > 85 ? 'bg-red-500 animate-ping' : 'bg-blue-500 animate-pulse'}`}></div>
              </div>
              <h4 className="font-black text-white text-xs mb-3 truncate relative z-10 uppercase tracking-wider">{channel.name}</h4>
              <div className="h-[2px] bg-white/5 rounded-full overflow-hidden relative z-10">
                <div 
                  className={`h-full transition-all duration-1000 ${channel.load > 85 ? 'bg-red-600 shadow-[0_0_10px_red]' : 'bg-blue-500 shadow-[0_0_10px_#3b82f6]'}`}
                  style={{ width: `${channel.load}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-3 relative z-10">
                 <span className="text-[9px] text-slate-500 font-bold">{channel.load.toFixed(1)}%</span>
                 <span className={`text-[8px] font-black uppercase ${channel.load > 85 ? 'text-red-500' : 'text-blue-900'}`}>{channel.load > 85 ? 'HIGH_LOAD' : 'STABLE'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         
         {/* Intelligence Distillation Panel */}
         <div className="bg-white/5 backdrop-blur-3xl rounded-[3.5rem] p-12 border border-white/5 flex flex-col gap-10 shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between items-center relative z-10">
               <h3 className="text-3xl font-black text-white">تقطير الذكاء (Insights)</h3>
               <button 
                  onClick={handleDistill}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl shadow-blue-900/20 active:scale-95 text-xs uppercase"
               >
                  {loading ? "جاري المعالجة..." : "بدء التقطير ⚡"}
               </button>
            </div>
            
            <div className="flex-1 relative z-10">
               {distilledInsight ? (
                 <div className="bg-black/20 p-8 rounded-[2.5rem] border border-blue-500/10 animate-fadeIn">
                    <p className="text-xl text-slate-200 leading-relaxed font-medium italic">"{distilledInsight}"</p>
                 </div>
               ) : (
                 <div className="h-64 flex flex-col items-center justify-center opacity-10 grayscale border-2 border-dashed border-white/10 rounded-[3rem]">
                    <div className="text-8xl mb-4">🔮</div>
                    <p className="text-xl font-black uppercase tracking-[0.5em]">Awaiting_Command</p>
                 </div>
               )}
            </div>
         </div>

         {/* Security Audit Panel - New Logic */}
         <div className={`bg-slate-950/40 backdrop-blur-3xl rounded-[3.5rem] p-12 border transition-all duration-700 ${securityReport?.anomalyDetected ? 'border-red-600/30 shadow-[0_0_100px_rgba(220,38,38,0.1)]' : 'border-emerald-500/20 shadow-2xl'}`}>
            <div className="flex justify-between items-center mb-10">
               <h3 className={`text-3xl font-black ${securityReport?.anomalyDetected ? 'text-red-500' : 'text-emerald-500'}`}>الرقابة النورونية (Audit)</h3>
               <button 
                  onClick={handleSecurityAudit}
                  disabled={auditLoading}
                  className={`px-10 py-4 rounded-2xl font-black transition-all shadow-xl active:scale-95 text-xs uppercase ${securityReport?.anomalyDetected ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-emerald-600 text-black hover:bg-emerald-500'}`}
               >
                  {auditLoading ? "فحص عميق..." : "تدقيق المسارات 🛡️"}
               </button>
            </div>

            <div className="space-y-8">
               {securityReport ? (
                 <div className="animate-fadeIn space-y-8">
                    <div className={`p-8 rounded-[2.5rem] flex items-center justify-between ${securityReport.anomalyDetected ? 'bg-red-950/20 border border-red-600/30' : 'bg-emerald-950/20 border border-emerald-600/30'}`}>
                       <div>
                          <h4 className={`text-2xl font-black ${securityReport.anomalyDetected ? 'text-red-500' : 'text-emerald-500'}`}>
                             Threat_Level: {securityReport.threatLevel}
                          </h4>
                          <p className="text-slate-500 text-sm mt-1">
                             {securityReport.anomalyDetected ? 'تم اكتشاف محاولات حقن أو تلاعب بالأحمال.' : 'كافة القنوات تعمل ضمن معايير الأمان العليا.'}
                          </p>
                       </div>
                       <div className="text-5xl">{securityReport.anomalyDetected ? '🚨' : '✅'}</div>
                    </div>

                    {securityReport.suspiciousChannels.length > 0 && (
                      <div className="space-y-4">
                         <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mr-4">Suspicious_Nodes_Identified</h5>
                         <div className="flex flex-wrap gap-3">
                            {securityReport.suspiciousChannels.map((ch: string) => (
                              <span key={ch} className="bg-red-600/10 border border-red-600/20 px-6 py-2 rounded-xl text-red-500 font-bold text-xs">
                                {ch}
                              </span>
                            ))}
                         </div>
                      </div>
                    )}

                    <div className="bg-black/60 p-8 rounded-[2.5rem] border border-white/5">
                       <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Mitigation_Protocol</h5>
                       <p className="text-slate-300 text-sm leading-relaxed italic">{securityReport.mitigationProtocol}</p>
                    </div>
                 </div>
               ) : (
                 <div className="h-64 flex flex-col items-center justify-center opacity-10 grayscale border-2 border-dashed border-white/10 rounded-[3rem]">
                    <div className="text-8xl mb-4">📡</div>
                    <p className="text-xl font-black uppercase tracking-[0.5em]">Audit_Registry_Empty</p>
                 </div>
               )}
            </div>
         </div>

      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};
