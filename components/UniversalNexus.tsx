
import React, { useState, useEffect } from 'react';
import { runUniversalNexus } from '../services/geminiService';
import { NexusResult, Language } from '../types';

export const UniversalNexus: React.FC<{ language: Language }> = ({ language }) => {
  const [prompt, setPrompt] = useState('');
  const [targetAI, setTargetAI] = useState('GPT-4 Omni');
  const [fusionLevel, setFusionLevel] = useState(75);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NexusResult | null>(null);
  const [activeTab, setActiveTab] = useState<'fusion' | 'code' | 'simulation'>('fusion');

  const availableAIs = [
    { name: 'GPT-4 Omni', color: 'text-emerald-500', icon: '🧠' },
    { name: 'Claude 3.5 Opus', color: 'text-orange-500', icon: '🎨' },
    { name: 'DeepSeek Coder', color: 'text-blue-500', icon: '💻' },
    { name: 'Llama 3 (Meta)', color: 'text-purple-500', icon: '🦙' }
  ];

  const handleNexusInitiate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await runUniversalNexus(prompt, targetAI, fusionLevel, language);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fadeIn font-arabic pb-40">
      
      {/* Nexus Interface Header */}
      <div className="bg-[#020205] border-b-8 border-indigo-600 p-16 rounded-t-[5rem] shadow-[0_0_150px_rgba(79,70,229,0.15)] relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.08),transparent_70%)]"></div>
        <div className="relative z-10 space-y-8">
           <div className="flex justify-center gap-6">
              <div className={`w-28 h-28 rounded-full border-4 flex items-center justify-center text-7xl transition-all duration-1000 ${loading ? 'animate-spin border-indigo-500 shadow-[0_0_60px_rgba(79,70,229,0.6)]' : 'border-white/10'}`}>
                 ⚛️
              </div>
           </div>
           <h2 className="text-8xl font-black text-white tracking-tighter uppercase leading-none">نيكسوس <span className="text-indigo-500">العالمي</span></h2>
           <p className="text-slate-500 text-2xl font-bold uppercase tracking-[0.4em]">Universal_AI_Fusion_v1.0</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Settings Panel */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-black/60 border border-white/10 p-10 rounded-[4rem] space-y-10 shadow-3xl">
              <div className="space-y-4">
                 <h3 className="text-xs font-black text-indigo-500 uppercase tracking-widest mr-4">Target_AI_Model</h3>
                 <div className="grid grid-cols-1 gap-3">
                    {availableAIs.map(ai => (
                      <button
                        key={ai.name}
                        onClick={() => setTargetAI(ai.name)}
                        className={`p-6 rounded-[2.5rem] border-2 transition-all flex items-center justify-between group ${targetAI === ai.name ? 'bg-white text-black border-white shadow-2xl scale-105' : 'bg-slate-900 border-white/5 text-white/40 hover:border-indigo-500/30'}`}
                      >
                         <span className="text-3xl">{ai.icon}</span>
                         <span className="font-black text-lg">{ai.name}</span>
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-black uppercase">Fusion_Level</span>
                    <span className="text-xl font-black text-indigo-400">{fusionLevel}%</span>
                 </div>
                 <input 
                   type="range" min="1" max="100" 
                   value={fusionLevel}
                   onChange={(e) => setFusionLevel(parseInt(e.target.value))}
                   className="w-full accent-indigo-600 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                 />
              </div>

              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="صف ما تريد بناءه بالتعاون بين صارة والذكاء الآخر..."
                className="w-full bg-black/60 border border-white/10 rounded-[2.5rem] p-8 text-xl text-white h-48 focus:ring-4 focus:ring-indigo-500/20 transition-all resize-none text-right"
              />

              <button 
                onClick={handleNexusInitiate}
                disabled={loading || !prompt.trim()}
                className="w-full py-7 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2.5rem] font-black text-2xl transition-all shadow-3xl active:scale-95 disabled:opacity-50"
              >
                {loading ? 'جاري الصهر النوروني...' : 'بدء الاندماج والعمل ⚡'}
              </button>
           </div>
        </div>

        {/* Workspace Display */}
        <div className="lg:col-span-8 space-y-8">
           {result ? (
             <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[4rem] border border-indigo-500/20 shadow-2xl min-h-[800px] flex flex-col overflow-hidden animate-slideUp">
                
                {/* Workspace Tabs */}
                <div className="flex bg-black/40 p-3 rounded-full mx-10 mt-10 border border-white/5 gap-2">
                   {[
                     { id: 'fusion', label: 'الاندماج الفكري', icon: '💎' },
                     { id: 'code', label: 'مختبر البناء', icon: '💻' },
                     { id: 'simulation', label: 'المحاكاة', icon: '🕹️' }
                   ].map(tab => (
                     <button
                       key={tab.id}
                       onClick={() => setActiveTab(tab.id as any)}
                       className={`flex-1 py-5 rounded-full text-[12px] font-black flex items-center justify-center gap-4 transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-2xl scale-105' : 'text-slate-500 hover:text-white'}`}
                     >
                       <span>{tab.icon}</span>
                       {tab.label}
                     </button>
                   ))}
                </div>

                <div className="flex-1 p-12 overflow-y-auto no-scrollbar">
                   {activeTab === 'fusion' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-fadeIn">
                        <div className="space-y-6">
                           <div className="flex items-center gap-4 justify-end">
                              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Sarah_Logic_Core</span>
                              <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                           </div>
                           <p className="bg-black/40 p-8 rounded-[3rem] border border-white/5 text-xl text-slate-100 leading-relaxed italic font-medium text-right">
                              "{result.sarahLogic}"
                           </p>
                        </div>
                        <div className="space-y-6">
                           <div className="flex items-center gap-4 justify-end">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{targetAI}_Logic</span>
                              <div className="w-1.5 h-6 bg-slate-700 rounded-full"></div>
                           </div>
                           <p className="bg-white/5 p-8 rounded-[3rem] border border-white/5 text-xl text-slate-400 leading-relaxed italic font-medium text-right">
                              "{result.targetAILogic}"
                           </p>
                        </div>
                        <div className="md:col-span-2 pt-12 border-t border-white/5 space-y-8">
                           <div className="text-center">
                              <span className="bg-indigo-600 text-white px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">The_Fused_Solution_v1.0</span>
                           </div>
                           <div className="prose prose-invert max-w-none text-3xl leading-[1.8] text-slate-100 font-bold text-right selection:bg-indigo-600/50">
                              {result.fusedOutput}
                           </div>
                        </div>
                     </div>
                   )}

                   {activeTab === 'code' && (
                     <div className="space-y-8 animate-fadeIn h-full flex flex-col">
                        <div className="flex justify-between items-center">
                           <div className="flex gap-4">
                              <button onClick={() => alert('تم نسخ الكود')} className="bg-white/5 text-slate-400 px-6 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all">Copy_Matrix_Code</button>
                              <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase">Inject_To_Kernel</button>
                           </div>
                           <h3 className="text-2xl font-black text-white">البيئة المندمجة (Fused Build)</h3>
                        </div>
                        <div className="flex-1 bg-black rounded-[3rem] p-10 font-mono text-sm text-indigo-400 border border-white/5 shadow-inner dir-ltr text-left overflow-auto no-scrollbar selection:bg-indigo-600/30">
                           {`// Sarah Nexus Integration Code\n// Partner: ${targetAI}\n// Fusion: ${fusionLevel}%\n\n${result.fusedOutput.split('.').join('\n')}`}
                        </div>
                     </div>
                   )}

                   {activeTab === 'simulation' && (
                      <div className="h-full flex flex-col items-center justify-center gap-12 animate-fadeIn py-20 text-center">
                         <div className="text-[12rem] animate-pulse drop-shadow-[0_0_80px_rgba(79,70,229,0.3)]">🏺</div>
                         <h4 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Simulation_Stable</h4>
                         <div className="px-10 py-4 bg-emerald-600 text-black rounded-full font-black text-sm uppercase shadow-2xl">Build_Status: {result.buildStatus}</div>
                      </div>
                   )}
                </div>
                
                {/* Nexus Branding Footer */}
                <div className="p-12 bg-black/60 border-t border-white/5 flex justify-between items-center">
                   <div className="flex items-center gap-6">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                      <span className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Protocols_Synced_By_Sarah_V12</span>
                   </div>
                   <div className="text-4xl font-black text-indigo-500 opacity-40">S</div>
                </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center opacity-5 grayscale pointer-events-none gap-12 py-40">
                <div className="text-[18rem] animate-float">⚛️</div>
                <p className="text-5xl font-black uppercase tracking-[1em] text-center">Awaiting_Neural_Nexus_Handshake</p>
             </div>
           )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes scanline { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-scanline { animation: scanline 4s linear infinite; }
      `}</style>
    </div>
  );
};
