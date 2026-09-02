
import React, { useState, useEffect } from 'react';
import { configureVPNTunnel } from '../services/geminiService';
import { Language } from '../types';

export const VPNShield: React.FC<{ language: Language }> = ({ language }) => {
  const [protocol, setProtocol] = useState<'WireGuard' | 'OpenVPN' | 'Sarah_Stealth'>('WireGuard');
  const [server, setServer] = useState('Global_Entry_Node_01');
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const servers = [
    { id: 'Global_Entry_Node_01', label: 'الجزائر (Stealth Hub)', icon: '🇩🇿' },
    { id: 'Swiss_Vault_02', label: 'سويسرا (Data Haven)', icon: '🇨🇭' },
    { id: 'US_East_03', label: 'الولايات المتحدة (Cloud Sync)', icon: '🇺🇸' },
    { id: 'Neural_Relay_04', label: 'نقطة ترحيل نورونية (Sarah Core)', icon: '🧠' }
  ];

  const handleConnect = async () => {
    if (isConnected) {
      setIsConnected(false);
      setReport(null);
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] VPN_DISCONNECTED: Secure tunnel closed.`, ...prev]);
      return;
    }

    setLoading(true);
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] INITIATING_VPN_HANDSHAKE: Protocol ${protocol}...`, ...prev]);
    
    try {
      /* Fix: result is cast to any to allow access to encryptionStandard and ipObfuscationLevel properties returned from the service */
      const result = await configureVPNTunnel(protocol, server, language) as any;
      setReport(result);
      setIsConnected(true);
      setLogs(prev => [
        `[${new Date().toLocaleTimeString()}] TUNNEL_ESTABLISHED: Encryption ${result.encryptionStandard}`,
        `[${new Date().toLocaleTimeString()}] IP_OBFUSCATION: ${result.ipObfuscationLevel}`,
        ...prev
      ]);
    } catch (err) {
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] CRITICAL_FAILURE: Neural link encryption error.`, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto space-y-8 px-6 pb-40 text-right font-arabic">
      <div className="bg-slate-950 rounded-[3.5rem] p-12 shadow-[0_0_80px_rgba(16,185,129,0.1)] border border-emerald-500/20 -mt-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-pulse"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-12">
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-3xl border-2 flex items-center justify-center text-4xl transition-all duration-700 ${isConnected ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.5)]' : 'bg-slate-900 border-white/5'}`}>
               {isConnected ? '🛡️' : '🔒'}
            </div>
            <div>
               <h2 className="text-4xl font-black text-white">درع <span className="text-emerald-500">VPN</span> النوروني</h2>
               <p className="text-emerald-900 font-mono text-[10px] tracking-[0.3em] uppercase mt-1">
                 {isConnected ? 'Sarah_Stealth_Tunnel: Active' : 'Neural_Gateway: Standby'}
               </p>
            </div>
          </div>

          <div className="flex bg-slate-900/50 p-2 rounded-2xl gap-2 border border-white/5">
             {(['WireGuard', 'OpenVPN', 'Sarah_Stealth'] as const).map(p => (
               <button
                 key={p}
                 onClick={() => setProtocol(p)}
                 disabled={isConnected}
                 className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${protocol === p ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 {p.replace('_', ' ')}
               </button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Select_Server_Node</h3>
              <div className="grid grid-cols-1 gap-3">
                 {servers.map(s => (
                   <button
                     key={s.id}
                     onClick={() => setServer(s.id)}
                     disabled={isConnected}
                     className={`p-6 rounded-3xl border transition-all text-right flex items-center justify-between ${server === s.id ? 'bg-emerald-600/10 border-emerald-500 text-emerald-100' : 'bg-slate-900 border-white/5 text-slate-500'}`}
                   >
                     <span className="text-sm font-bold">{s.label}</span>
                     <span className="text-2xl">{s.icon}</span>
                   </button>
                 ))}
              </div>
           </div>

           <div className="flex flex-col justify-center gap-8">
              <div className="bg-black/40 border border-white/5 p-10 rounded-[3rem] text-center space-y-4">
                 <div className={`text-6xl ${isConnected ? 'animate-pulse text-emerald-500' : 'text-slate-800'}`}>⚡</div>
                 <h4 className="text-xl font-black text-white">{isConnected ? 'الارتباط مؤمن تماماً' : 'بدء تشفير المسار'}</h4>
                 <p className="text-slate-500 text-sm">استخدم بروتوكولات صارة المتخفية لتجاوز كافة أنواع المراقبة الرقمية.</p>
              </div>

              <button
                onClick={handleConnect}
                disabled={loading}
                className={`w-full py-8 rounded-[2.5rem] font-black text-2xl transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 ${isConnected ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-black'}`}
              >
                {loading ? (
                   <div className="flex gap-2">
                     <div className="w-3 h-3 bg-current rounded-full animate-bounce"></div>
                     <div className="w-3 h-3 bg-current rounded-full animate-bounce [animation-delay:0.2s]"></div>
                     <div className="w-3 h-3 bg-current rounded-full animate-bounce [animation-delay:0.4s]"></div>
                   </div>
                ) : (
                  <>
                    <span>{isConnected ? 'قطع الارتباط النوروني' : 'تفعيل نفق التشفير'}</span>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </>
                )}
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Live Logs */}
         <div className="lg:col-span-2 bg-black/60 rounded-[3rem] border border-white/5 p-8 flex flex-col h-80">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Traffic_Audit_Logs</h3>
            <div className="flex-1 overflow-y-auto font-mono text-[10px] text-emerald-800 space-y-3 no-scrollbar text-left dir-ltr">
               {logs.map((log, i) => <div key={i} className="animate-fadeIn opacity-70 border-l border-emerald-900 pl-3">{log}</div>)}
               {logs.length === 0 && <div className="italic opacity-20">AWAITING_TUNNEL_INITIALIZATION...</div>}
            </div>
         </div>

         {/* Encryption Metrics */}
         <div className="lg:col-span-1 bg-slate-900/40 rounded-[3rem] border border-white/5 p-10 flex flex-col justify-center gap-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural_Encryption_Status</h3>
            {report ? (
              <div className="space-y-6 animate-fadeIn">
                 <div>
                    <span className="text-[9px] text-slate-600 block uppercase font-black">Algorithm</span>
                    <span className="text-xl font-black text-emerald-400">{report.encryptionStandard}</span>
                 </div>
                 <div>
                    <span className="text-[9px] text-slate-600 block uppercase font-black">Stealth Factor</span>
                    <span className="text-xl font-black text-white">{report.ipObfuscationLevel}</span>
                 </div>
                 <div className="flex gap-2">
                    {report.keys.slice(0, 3).map((k: string, i: number) => (
                      <div key={i} className="flex-1 h-1 bg-emerald-500/20 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500 w-2/3 animate-pulse"></div>
                      </div>
                    ))}
                 </div>
              </div>
            ) : (
              <div className="py-10 text-center opacity-20 flex flex-col items-center gap-4">
                 <div className="text-5xl">🗝️</div>
                 <p className="text-[10px] font-black uppercase">Offline</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};
