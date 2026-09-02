
import React, { useState, useEffect } from 'react';
import { MatrixLink, Language } from '../types';

export const MatrixSync: React.FC<{ language: Language }> = ({ language }) => {
  const [links, setLinks] = useState<MatrixLink[]>([]);
  const [syncStatus, setSyncStatus] = useState(0);

  useEffect(() => {
    const nodes = ['Neural_Core', 'App_Suite', 'Forge_Engine', 'Security_Vault', 'Search_Link'];
    const generateLinks = () => {
      const newLinks: MatrixLink[] = [];
      for(let i=0; i<12; i++) {
        newLinks.push({
          source: nodes[Math.floor(Math.random() * nodes.length)],
          target: nodes[Math.floor(Math.random() * nodes.length)],
          value: Math.floor(Math.random() * 100),
          type: ['data', 'logic', 'security'][Math.floor(Math.random() * 3)] as any
        });
      }
      setLinks(newLinks);
      setSyncStatus(prev => Math.min(100, Math.max(90, prev + (Math.random() * 4 - 2))));
    };

    generateLinks();
    const interval = setInterval(generateLinks, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto space-y-10 px-6 pb-40 text-right font-arabic">
      
      <div className="bg-slate-950 border border-blue-500/20 p-12 rounded-[4rem] shadow-3xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent)]"></div>
        <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
          <div>
            <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">مزامنة <span className="text-blue-500">المصفوفة</span></h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.5em] text-[10px] mt-4 opacity-70">Matrix_Integration_Monitor_v15.0</p>
          </div>

          <div className="bg-black/60 p-10 rounded-[3rem] border border-white/5 flex items-center gap-12 shadow-inner">
             <div className="text-right">
                <span className="text-[10px] font-black text-slate-600 uppercase block mb-1">Matrix_Sync_Stability</span>
                <div className="text-4xl font-black text-blue-500">{syncStatus.toFixed(1)}%</div>
             </div>
             <div className="w-1.5 h-16 bg-blue-600/20 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 shadow-[0_0_20px_blue] transition-all duration-1000" style={{ height: `${syncStatus}%` }}></div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Real-time Link Visualizer */}
        <div className="lg:col-span-8 bg-black/80 backdrop-blur-3xl rounded-[5rem] border border-white/5 p-4 relative overflow-hidden h-[650px] shadow-2xl flex items-center justify-center group">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-40"></div>
           
           <div className="relative w-full h-full p-20 flex flex-col justify-between">
              {links.map((link, i) => (
                <div key={i} className="flex items-center justify-between animate-fadeIn group/link" style={{ animationDelay: `${i*0.1}s` }}>
                   <div className="flex items-center gap-6">
                      <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_blue] group-hover/link:animate-ping"></div>
                      <span className="text-[10px] font-mono text-blue-900 group-hover/link:text-white transition-colors">{link.source}</span>
                   </div>
                   
                   <div className="flex-1 mx-10 relative h-px bg-white/5 overflow-hidden">
                      <div className={`h-full bg-gradient-to-r from-transparent ${link.type === 'security' ? 'via-red-500' : link.type === 'logic' ? 'via-purple-500' : 'via-blue-400'} to-transparent animate-matrix-flow`} style={{ animationDuration: `${2 + (link.value/20)}s` }}></div>
                   </div>

                   <div className="flex items-center gap-6">
                      <span className="text-[10px] font-mono text-slate-800 group-hover/link:text-white transition-colors">{link.target}</span>
                      <div className={`w-3 h-3 rounded-full ${link.type === 'security' ? 'bg-red-600' : link.type === 'logic' ? 'bg-purple-600' : 'bg-blue-600'} opacity-20 group-hover/link:opacity-100 transition-opacity`}></div>
                   </div>
                </div>
              ))}
           </div>

           {/* Pulse HUD Overlay */}
           <div className="absolute bottom-10 left-10 p-8 bg-black/60 backdrop-blur-xl border border-white/5 rounded-[3rem] space-y-4">
              <div className="flex items-center gap-4">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Active_Neural_Streams: {links.length}</span>
              </div>
           </div>
        </div>

        {/* Global Registry Sidebar */}
        <div className="lg:col-span-4 bg-[#0a0a0a] border border-white/5 rounded-[4rem] p-10 flex flex-col shadow-inner">
           <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8 border-b border-white/5 pb-6">مصفوفة الربط (Link Matrix)</h3>
           <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
              {links.map((link, i) => (
                <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-blue-500/30 transition-all">
                   <div className="flex justify-between items-center mb-2">
                      <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full ${link.type === 'security' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>{link.type}</span>
                      <span className="text-[10px] text-slate-700 font-mono">FLOW: {link.value}Kb/s</span>
                   </div>
                   <div className="text-xs font-bold text-slate-400 truncate">
                      {link.source} <span className="text-white mx-2">↠</span> {link.target}
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      <style>{`
        @keyframes matrix-flow { 
          0% { transform: translateX(-100%); } 
          100% { transform: translateX(100%); } 
        }
        .animate-matrix-flow { animation: matrix-flow linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};
