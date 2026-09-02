
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { OmniStep, Language, AppTab } from '../types';

export const OmniFusion: React.FC<{ language: Language }> = ({ language }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<OmniStep[]>([]);
  const [fusionLog, setFusionLog] = useState<string[]>([]);
  const [matrixStability, setMatrixStability] = useState(100);
  const [activeTab, setActiveTab] = useState<'fusion' | 'control'>('fusion');

  // Systems Status
  const primarySystems = [
    // Corrected enum property access
    { id: AppTab.WORD_CORE, name: 'نواة الكتابة (Word Core)', status: 'Optimal', load: 12 },
    { id: AppTab.CODE_FORGE, name: 'مفاعل الأكواد (Code Forge)', status: 'Standby', load: 5 },
    { id: AppTab.NEURAL_BRAIN, name: 'العقل المركزي (Neural Brain)', status: 'Active', load: 45 },
  ];

  const secondarySystems = [
    { id: AppTab.STUDIO, name: 'استوديو الصور', status: 'Idle', load: 0 },
    // Corrected enum property access
    { id: AppTab.VPN_SHIELD, name: 'درع الحماية', status: 'Secured', load: 8 },
    { id: AppTab.EXPLORER, name: 'المستكشف الجغرافي', status: 'Active', load: 15 },
  ];

  const handleFusion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setSteps([]);
    setFusionLog(["[FUSION] تهيئة مصفوفة الاندماج الشامل...", "[LINK] ربط أنظمة الدفاع والبرمجة والبحث..."]);
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `أنت 'مفاعل الاندماج الكلي' لصارة v15. الهدف: ${query}. 
        قم بتفكيك هذا الهدف وتوزيعه على الأنظمة التالية ببراعة النواة الكوآنتومية: (Coding, Security, Research, Creativity, Data).
        قدم النتيجة بتنسيق JSON حصراً كقائمة خطوات تنفيذية لكل نظام.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                system: { type: Type.STRING },
                action: { type: Type.STRING },
                status: { type: Type.STRING }
              }
            }
          }
        }
      });

      const parsedSteps = JSON.parse(response.text || "[]") as OmniStep[];
      setSteps(parsedSteps.map(s => ({ ...s, status: 'pending' })));

      for (let i = 0; i < parsedSteps.length; i++) {
        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'processing' } : s));
        setFusionLog(prev => [...prev, `[SYSTEM] معالجة طلب ${parsedSteps[i].system}...`]);
        await new Promise(r => setTimeout(r, 1200));
        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'completed' } : s));
        setFusionLog(prev => [...prev, `[SUCCESS] اكتمل دمج وظيفة ${parsedSteps[i].system}.`]);
        setMatrixStability(prev => Math.max(80, prev - (Math.random() * 5)));
      }

      setFusionLog(prev => [...prev, "[FUSION] تم اكتمال الاندماج الكلي. النظام في حالة سيادة مطلقة."]);
      setMatrixStability(100);

    } catch (err) {
      setFusionLog(prev => [...prev, "❌ [CRITICAL] فشل الاندماج: تداخل في الموجات النورونية."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto space-y-8 px-6 pb-40 font-arabic text-right">
      
      {/* Tab Switcher */}
      <div className="flex justify-center gap-4 mb-4">
         <button 
           onClick={() => setActiveTab('fusion')}
           className={`px-8 py-3 rounded-2xl font-black text-sm transition-all ${activeTab === 'fusion' ? 'bg-amber-500 text-black shadow-xl' : 'bg-white/5 text-slate-500'}`}
         >
           مفاعل الاندماج ⚛️
         </button>
         <button 
           onClick={() => setActiveTab('control')}
           className={`px-8 py-3 rounded-2xl font-black text-sm transition-all ${activeTab === 'control' ? 'bg-blue-600 text-white shadow-xl' : 'bg-white/5 text-slate-500'}`}
         >
           مصفوفة التحكم بالأنظمة 🕹️
         </button>
      </div>

      {activeTab === 'fusion' ? (
        <>
          <div className="bg-black border-4 border-amber-500/30 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05),transparent)] pointer-events-none"></div>
            
            <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
              <div className="flex items-center gap-8">
                 <div className={`w-24 h-24 rounded-full border-[6px] flex items-center justify-center text-5xl transition-all duration-1000 ${loading ? 'border-amber-500 animate-spin shadow-[0_0_80px_rgba(245,158,11,0.5)]' : 'border-white/10 shadow-2xl'}`}>
                    {loading ? '⚛️' : '👑'}
                 </div>
                 <div>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">مفاعل <span className="text-amber-500">الاندماج</span></h1>
                    <p className="text-amber-900 font-black uppercase tracking-[0.5em] text-xs mt-4 opacity-70">Unified_Omni_System_v1.0</p>
                 </div>
              </div>

              <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 flex items-center gap-12">
                 <div className="text-right">
                    <span className="text-[10px] font-black text-slate-600 uppercase block mb-1">Matrix_Stability</span>
                    <div className="text-3xl font-black text-amber-500">{matrixStability.toFixed(0)}%</div>
                 </div>
              </div>
            </div>

            <div className="mt-12 relative">
              <form onSubmit={handleFusion} className="relative group">
                <textarea 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="اطلب شيئاً معقداً يجمع بين البرمجة والبحث والأمان..."
                  className="w-full bg-slate-900 border-2 border-white/10 rounded-[3rem] p-10 text-xl text-white focus:ring-8 focus:ring-amber-500/5 transition-all resize-none h-40 text-right placeholder:text-slate-800 shadow-inner"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="absolute left-6 bottom-6 bg-amber-500 hover:bg-amber-400 text-black px-12 py-4 rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'جاري الاندماج...' : 'تفعيل ⚡'}
                </button>
              </form>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
               {steps.map((step, i) => (
                 <div key={i} className={`p-8 rounded-[3.5rem] border-2 transition-all duration-700 ${step.status === 'processing' ? 'bg-amber-500 border-amber-400 shadow-3xl scale-105' : step.status === 'completed' ? 'bg-emerald-600/10 border-emerald-500/40 opacity-100' : 'bg-white/5 border-white/5 opacity-40'}`}>
                    <div className="flex justify-between items-center mb-6">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${step.status === 'processing' ? 'bg-black text-amber-500 animate-pulse' : 'bg-white/5 text-slate-500'}`}>{step.system}</span>
                    </div>
                    <h4 className={`text-xl font-black mb-4 ${step.status === 'processing' ? 'text-black' : 'text-white'}`}>{step.action}</h4>
                    <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                       <div className={`h-full transition-all duration-1000 ${step.status === 'processing' ? 'bg-white w-1/2' : step.status === 'completed' ? 'bg-emerald-500 w-full' : 'w-0'}`}></div>
                    </div>
                 </div>
               ))}
            </div>
            <div className="lg:col-span-4 bg-black/80 rounded-[4rem] border border-white/5 p-10 flex flex-col shadow-2xl h-full min-h-[400px]">
               <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-10 border-b border-white/5 pb-8">سجل الاندماج</h3>
               <div className="flex-1 overflow-y-auto font-mono text-[10px] text-amber-900 space-y-6 no-scrollbar text-left dir-ltr">
                  {fusionLog.map((log, i) => (
                    <div key={i} className={`animate-fadeIn pl-4 border-l-2 ${log.includes('SUCCESS') ? 'border-emerald-500 text-emerald-400 font-bold' : 'border-slate-900'}`}>
                       {log}
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </>
      ) : (
        /* Control Matrix View */
        <div className="space-y-10 animate-fadeIn">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Primary Source Systems */}
              <div className="bg-blue-900/10 border border-blue-500/20 p-12 rounded-[4rem] space-y-10 shadow-2xl">
                 <div className="flex justify-between items-center border-b border-blue-500/20 pb-6">
                    <h3 className="text-3xl font-black text-blue-400">الأنظمة المصدرية الرئيسية</h3>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Primary_Core_v12</span>
                 </div>
                 <div className="space-y-6">
                    {primarySystems.map(sys => (
                      <div key={sys.id} className="bg-black/40 p-8 rounded-[3rem] border border-white/5 hover:border-blue-500/40 transition-all group">
                         <div className="flex justify-between items-center mb-6">
                            <h4 className="text-2xl font-black text-white">{sys.name}</h4>
                            <span className="px-4 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">{sys.status}</span>
                         </div>
                         <div className="space-y-4">
                            <div className="flex justify-between text-[10px] font-black text-slate-500">
                               <span>SYSTEM_LOAD</span>
                               <span>{sys.load}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-500 transition-all duration-1000 shadow-[0_0_15px_blue]" style={{ width: `${sys.load}%` }}></div>
                            </div>
                         </div>
                         <div className="mt-6 flex gap-3">
                            <button className="flex-1 py-3 bg-white/5 hover:bg-blue-600 text-slate-400 hover:text-white rounded-2xl text-[10px] font-black transition-all">إعادة مزامنة</button>
                            <button className="flex-1 py-3 bg-white/5 hover:bg-emerald-600 text-slate-400 hover:text-white rounded-2xl text-[10px] font-black transition-all">تحسين الأداء</button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Secondary Source Systems */}
              <div className="bg-purple-900/10 border border-purple-500/20 p-12 rounded-[4rem] space-y-10 shadow-2xl">
                 <div className="flex justify-between items-center border-b border-purple-500/20 pb-6">
                    <h3 className="text-3xl font-black text-purple-400">الأنظمة المصدرية الثانوية</h3>
                    <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Secondary_Aux_v6</span>
                 </div>
                 <div className="space-y-6">
                    {secondarySystems.map(sys => (
                      <div key={sys.id} className="bg-black/40 p-8 rounded-[3rem] border border-white/5 hover:border-purple-500/40 transition-all group">
                         <div className="flex justify-between items-center mb-6">
                            <h4 className="text-2xl font-black text-white">{sys.name}</h4>
                            <span className="px-4 py-1 bg-purple-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">{sys.status}</span>
                         </div>
                         <div className="space-y-4">
                            <div className="flex justify-between text-[10px] font-black text-slate-500">
                               <span>IDLE_EFFICIENCY</span>
                               <span>{100 - sys.load}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-purple-500 transition-all duration-1000 shadow-[0_0_15px_purple]" style={{ width: `${sys.load}%` }}></div>
                            </div>
                         </div>
                      </div>
                    ))}
                    {/* Add Secondary System Trigger */}
                    <div className="p-10 border-4 border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center opacity-30 hover:opacity-100 transition-all group cursor-pointer">
                       <div className="text-4xl mb-4 group-hover:scale-125 transition-transform">➕</div>
                       <p className="text-[10px] font-black uppercase tracking-widest">حقن نظام ثانوي جديد</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-black border border-white/5 p-12 rounded-[5rem] flex flex-col items-center text-center gap-8 shadow-inner">
              <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(16,185,129,0.2)] animate-pulse">
                🛡️
              </div>
              <div>
                <h3 className="text-3xl font-black text-white">بروتوكول حماية النواة المصدرية</h3>
                <p className="text-slate-500 text-lg max-w-2xl mt-4">
                   "يتم مراقبة كافة الأنظمة الرئيسية والثانوية بواسطة خوارزمية صارة للردع الذاتي. أي محاولة اختراق ستؤدي إلى عزل النظام المصدر وتشفيره فوراً."
                </p>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};
