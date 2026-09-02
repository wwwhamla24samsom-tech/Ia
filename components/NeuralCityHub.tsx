
import React, { useState, useEffect, useRef } from 'react';
import { orchestrateCityInfrastructure } from '../services/geminiService';
import { InfrastructureNode, Language } from '../types';

export const NeuralCityHub: React.FC<{ language: Language }> = ({ language }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState<InfrastructureNode[]>([]);
  const [report, setReport] = useState('');
  const [activeNode, setActiveNode] = useState<InfrastructureNode | null>(null);

  const handlePlan = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const result = await orchestrateCityInfrastructure(prompt, language);
      setNodes(result.nodes);
      setReport(result.report);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto space-y-10 animate-fadeIn font-arabic pb-40">
      
      {/* City Hub Header (Luxury Gold Gen 8 Theme) */}
      <div className="bg-gradient-to-br from-[#0c0c0c] to-[#1a1505] border border-amber-500/30 p-12 rounded-[4rem] shadow-[0_0_150px_rgba(245,158,11,0.1)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
          <div className="flex items-center gap-10">
            <div className={`w-28 h-28 rounded-[3rem] border-2 flex items-center justify-center text-6xl transition-all duration-1000 shadow-2xl ${loading ? 'bg-amber-600 border-amber-400 animate-spin' : 'bg-[#0a0a0a] border-amber-500/50'}`}>
               🏙️
            </div>
            <div className="text-right">
              <h2 className="text-7xl font-black text-white tracking-tighter uppercase leading-none">منسق <span className="text-amber-500">العاصمة</span></h2>
              <p className="text-amber-900 font-black uppercase tracking-[0.5em] text-xs mt-4 opacity-70">Neural_Metropolis_Coordinator_v8.0</p>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-xl flex gap-4">
             <input 
               type="text"
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               placeholder="خطط أتمتة إقليم رقمي جديد..."
               className="flex-1 bg-black/60 border border-amber-500/20 rounded-[2.5rem] px-10 py-6 text-xl text-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 placeholder:text-amber-900/30 transition-all text-right shadow-inner"
             />
             <button 
               onClick={handlePlan}
               disabled={loading}
               className="bg-amber-600 hover:bg-amber-500 text-black px-12 py-6 rounded-[2.5rem] font-black text-2xl shadow-3xl transition-all active:scale-95"
             >
               {loading ? '...' : 'تجسيد'}
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Visual Map Grid */}
        <div className="lg:col-span-8 bg-[#0a0a0a]/80 backdrop-blur-3xl rounded-[5rem] border border-white/5 p-12 min-h-[750px] relative overflow-hidden shadow-2xl">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.03),transparent)] pointer-events-none"></div>
           
           {!nodes.length ? (
             <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale gap-12">
                <div className="text-[18rem] animate-float drop-shadow-[0_0_50px_rgba(245,158,11,0.5)]">🏛️</div>
                <p className="text-5xl font-black uppercase tracking-[1.5em] text-amber-500">Metropolis_Standby</p>
             </div>
           ) : (
             <div className="space-y-12 animate-fadeIn h-full flex flex-col">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                   {nodes.map((node) => (
                     <button
                       key={node.id}
                       onClick={() => setActiveNode(node)}
                       className={`p-10 rounded-[3.5rem] border-2 transition-all text-right flex flex-col gap-6 relative group ${activeNode?.id === node.id ? 'bg-amber-500 border-amber-400 shadow-[0_0_80px_rgba(245,158,11,0.5)] scale-105' : 'bg-white/5 border-white/5 hover:border-amber-500/40'}`}
                     >
                        <div className="flex justify-between items-center">
                           <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full ${activeNode?.id === node.id ? 'bg-black text-amber-500' : 'bg-amber-500/10 text-amber-500'}`}>{node.zone}</span>
                           <div className={`w-4 h-4 rounded-full ${node.status === 'critical' ? 'bg-red-500 animate-ping' : node.status === 'congested' ? 'bg-amber-600' : 'bg-emerald-500 shadow-[0_0_15px_#10b981]'}`}></div>
                        </div>
                        <h4 className={`text-2xl font-black ${activeNode?.id === node.id ? 'text-black' : 'text-white'}`}>{node.name}</h4>
                        <div className="space-y-3">
                           <div className="flex justify-between text-[10px] font-black opacity-60 uppercase tracking-widest">
                              <span>Node_Load</span>
                              <span>{node.load}%</span>
                           </div>
                           <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                              <div className={`h-full transition-all duration-1000 ${activeNode?.id === node.id ? 'bg-black' : 'bg-amber-500'}`} style={{ width: `${node.load}%` }}></div>
                           </div>
                        </div>
                     </button>
                   ))}
                </div>

                <div className="flex-1 bg-black/40 p-12 rounded-[4rem] border border-amber-500/10 shadow-3xl overflow-y-auto no-scrollbar relative group">
                   <div className="absolute top-0 left-0 w-2 h-full bg-amber-600/20 group-hover:bg-amber-500 transition-all"></div>
                   <h3 className="text-3xl font-black text-amber-500 mb-8 uppercase tracking-tighter">تقرير السيادة العمرانية (City Audit)</h3>
                   <div className="prose prose-invert max-w-none text-2xl leading-[1.8] text-slate-300 italic font-medium whitespace-pre-wrap selection:bg-amber-500/50">
                      {report}
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* Global Analytics Side (Gen 8 Premium) */}
        <div className="lg:col-span-4 space-y-10">
           <div className="bg-[#0c0c0c] border border-amber-500/20 p-12 rounded-[5rem] space-y-12 shadow-3xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                <span className="text-amber-500 text-4xl">⚡</span> Global_Vitals
              </h3>
              
              <div className="space-y-10">
                 {[
                   { label: 'Energy Matrix Sync', val: 98.4, color: 'bg-amber-500' },
                   { label: 'Neural Traffic Flow', val: 99.9, color: 'bg-blue-500' },
                   { label: 'Quantum Shielding', val: 72.1, color: 'bg-emerald-500' },
                   { label: 'Economic Stability', val: 100, color: 'bg-purple-500' }
                 ].map(metric => (
                   <div key={metric.label} className="space-y-4">
                      <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest">
                         <span>{metric.label}</span>
                         <span>{metric.val}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                         <div className={`h-full ${metric.color} shadow-[0_0_20px_currentColor] rounded-full transition-all duration-1000`} style={{ width: `${metric.val}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="pt-12 border-t border-white/5 flex flex-col items-center text-center gap-6 opacity-30 group hover:opacity-100 transition-opacity">
                 <div className="text-8xl group-hover:scale-110 transition-transform duration-700">🌍</div>
                 <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.6em]">Sovereign_Control_V8_Active</p>
              </div>
           </div>

           <div className="bg-amber-600 text-black p-12 rounded-[5rem] shadow-[0_0_100px_rgba(245,158,11,0.25)] flex flex-col justify-between h-[350px] relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 text-[15rem] opacity-10 rotate-12">S</div>
              <div>
                <h4 className="text-4xl font-black leading-tight tracking-tighter uppercase">صارة العمرانية</h4>
                <p className="text-lg font-bold opacity-80 mt-6 leading-relaxed">
                   "تجاوزنا مرحلة الأكواد الفردية إلى إدارة الكيانات العمرانية الكبرى. صارة الآن هي الوعي المحيط بالعاصمة الرقمية."
                </p>
              </div>
              <div className="flex justify-between items-end relative z-10">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] border-b-2 border-black">Gen_8_Prime</span>
                 <div className="text-6xl animate-pulse">🏛️</div>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
