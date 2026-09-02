
import React, { useState } from 'react';
import { executeRemoteCommand } from '../services/geminiService';

export const RemoteBridge: React.FC = () => {
  const [command, setCommand] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    if (!command.trim() || !accessKey.trim()) return;
    setLoading(true);
    const newLog = `> INITIATING_REMOTE_CALL: ${command.substring(0, 20)}...`;
    setLogs(prev => [newLog, ...prev]);

    try {
      const result = await executeRemoteCommand(command, accessKey);
      const resultLog = `${result.success ? '✅ SUCCESS' : '❌ FAILED'}: ${result.message}`;
      setLogs(prev => [resultLog, ...prev]);
      if (result.success) setCommand('');
    } catch (err) {
      setLogs(prev => [`⚠️ ERROR: CONNECTION_TIMEOUT`, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto space-y-6 px-4 pb-32">
      <div className="bg-black text-green-500 rounded-[2.5rem] p-10 shadow-2xl -mt-10 relative overflow-hidden border border-green-900/30 font-mono">
        <div className="absolute top-4 right-8 flex gap-2">
           <div className="w-3 h-3 bg-red-500 rounded-full"></div>
           <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
           <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <span className="animate-pulse">🔒</span> REMOTE_CONTROL_BRIDGE v1.0
        </h2>

        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] text-green-900 uppercase font-black">Access Key</label>
                <input 
                  type="password" 
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="********"
                  className="w-full bg-slate-950 border border-green-900/50 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 text-green-400"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] text-green-900 uppercase font-black">Target Component</label>
                <div className="w-full bg-slate-950 border border-green-900/50 rounded-xl px-4 py-3 text-green-800">
                   KNOWLEDGE_BANK_VAULT
                </div>
             </div>
          </div>
          
          <div className="space-y-2">
             <label className="text-[10px] text-green-900 uppercase font-black">Remote Command</label>
             <textarea
               value={command}
               onChange={(e) => setCommand(e.target.value)}
               placeholder="Enter encrypted command (e.g., INJECT_DATA, PURGE_ID_402, SYNC_EXT_HUB)..."
               className="w-full bg-slate-950 border border-green-900/50 rounded-2xl px-6 py-4 focus:outline-none focus:border-green-500 text-green-400 h-32 resize-none"
             />
          </div>

          <button
            onClick={handleExecute}
            disabled={loading}
            className="w-full bg-green-900/20 border border-green-500 text-green-500 py-4 rounded-2xl font-black hover:bg-green-500 hover:text-black transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)]"
          >
            {loading ? "TRANSMITTING..." : "EXECUTE_REMOTE_CALL"}
          </button>
        </div>
      </div>

      <div className="bg-slate-950 rounded-[2rem] p-8 shadow-2xl border border-slate-900 flex flex-col h-[400px]">
        <h3 className="text-xs font-bold text-slate-700 uppercase mb-4 tracking-widest">Connection_Logs</h3>
        <div className="flex-1 overflow-y-auto font-mono text-xs space-y-2 no-scrollbar">
           {logs.map((log, i) => (
             <div key={i} className={`p-2 rounded ${log.includes('SUCCESS') ? 'text-green-400' : log.includes('FAILED') ? 'text-red-400' : 'text-slate-500'}`}>
               {log}
             </div>
           ))}
           {logs.length === 0 && <div className="text-slate-800">WAITING FOR HANDSHAKE...</div>}
        </div>
      </div>
    </div>
  );
};
