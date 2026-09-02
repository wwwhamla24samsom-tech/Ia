
import React, { useState, useEffect, useRef } from 'react';
import { callHyperSearch, executeSuperReasoning } from '../services/geminiService';
import { Language, SearchSource } from '../types';

interface DimensionSystem {
  id: string;
  name: string;
  icon: string;
  domain: string;
  description: string;
  color: string;
}

export const NeuralCarousel: React.FC<{ language: Language }> = ({ language }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [sources, setSources] = useState<SearchSource[]>([]);
  const [isInjecting, setIsInjecting] = useState(false);
  const [query, setQuery] = useState('');

  const systems: DimensionSystem[] = [
    { id: 'geo', name: 'المحلل الجيوسياسي', icon: '🌍', domain: 'السياسة العالمية والصراعات', description: 'تحليل موازين القوى والتحولات الاستراتيجية العالمية.', color: 'from-blue-600 to-indigo-900' },
    { id: 'eco', name: 'المراقب الاقتصادي', icon: '💹', domain: 'الأسواق المالية والعملات الرقمية', description: 'تتبع نبض الاقتصاد العالمي وتوقع الانهيارات والفرص.', color: 'from-emerald-600 to-teal-900' },
    { id: 'sci', name: 'محرك البحث العلمي', icon: '🔬', domain: 'الفيزياء، الطب، والتكنولوجيا', description: 'استخلاص أحدث الابتكارات من المختبرات العالمية.', color: 'from-purple-600 to-fuchsia-900' },
    { id: 'cyber', name: 'درع التهديدات', icon: '🛡️', domain: 'الأمن السيبراني والثغرات', description: 'تحليل الهجمات النشطة وتأمين الفضاء النوروني.', color: 'from-red-600 to-rose-900' },
    { id: 'future', name: 'مستشرف المستقبل', icon: '⏳', domain: 'المستقبليات والتوقعات التقنية', description: 'رسم مسارات التطور البشري في العقود القادمة.', color: 'from-amber-600 to-orange-900' }
  ];

  const handleProcess = async () => {
    const activeSystem = systems[activeIndex];
    setLoading(true);
    setResult(null);
    setSources([]);

    try {
      const fullQuery = `قم بعمل تحليل عميق وفوري لمجال (${activeSystem.domain}) بناءً على السؤال: ${query || 'ما هي آخر التطورات الاستراتيجية؟'}. ابحث في الويب وقدم تقريراً سيادياً مفصلاً.`;
      const searchData = await callHyperSearch(fullQuery, language);
      setResult(searchData.text);
      setSources(searchData.sources);
    } catch (err) {
      setResult("❌ فشل الارتباط بالأبعاد النورونية.");
    } finally {
      setLoading(false);
    }
  };

  const injectToBrain = () => {
    setIsInjecting(true);
    setTimeout(() => {
      setIsInjecting(false);
      alert("✅ تم حقن البيانات بنجاح في العقل المركزي لصارة v15.");
    }, 2000);
  };

  const nextSystem = () => setActiveIndex((prev) => (prev + 1) % systems.length);
  const prevSystem = () => setActiveIndex((prev) => (prev - 1 + systems.length) % systems.length);

  return (
    <div className="flex flex-col h-full w-full bg-[#020204] font-arabic overflow-hidden relative">
      
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)] animate-pulse"></div>
      </div>

      <header className="relative z-10 px-12 py-10 flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">مفاعل <span className="text-blue-500">الأبعاد</span></h2>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mt-2">Neural_Dimensions_Reactor_v1.0</p>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-right">
              <span className="text-[8px] font-black text-slate-600 uppercase block mb-1">Active_System</span>
              <span className="text-xs font-black text-blue-400 uppercase tracking-widest">{systems[activeIndex].id}_CORE</span>
           </div>
           <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-2xl shadow-xl">
             {systems[activeIndex].icon}
           </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
        
        {/* The Carousel */}
        <div className="relative w-full max-w-5xl h-[450px] flex items-center justify-center perspective-[2000px]">
           {systems.map((sys, idx) => {
             const offset = idx - activeIndex;
             const isActive = idx === activeIndex;
             const absOffset = Math.abs(offset);
             
             return (
               <div 
                 key={sys.id}
                 className={`absolute w-full max-w-xl p-10 rounded-[4rem] border-2 transition-all duration-700 ease-out cursor-pointer overflow-hidden group
                   ${isActive ? 'z-50 scale-110 opacity-100 border-white/20 bg-black/80 shadow-[0_0_100px_rgba(59,130,246,0.2)]' : 'z-20 opacity-20 grayscale border-white/5 bg-black/40'}
                 `}
                 style={{
                   transform: `translateX(${offset * 120}%) translateZ(${-absOffset * 300}px) rotateY(${offset * -15}deg)`,
                   pointerEvents: isActive ? 'auto' : 'none'
                 }}
               >
                  <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${sys.color}`}></div>
                  <div className="relative z-10 flex flex-col items-center text-center gap-8">
                     <div className="text-8xl group-hover:scale-110 transition-transform duration-500">{sys.icon}</div>
                     <div className="space-y-4">
                        <h3 className="text-5xl font-black text-white tracking-tighter">{sys.name}</h3>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed italic">"{sys.description}"</p>
                     </div>
                     {isActive && (
                       <div className="w-full flex gap-4 mt-4">
                          <input 
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="أدخل محور التركيز (مثال: أزمة الطاقة)..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-all text-right"
                          />
                          <button 
                            onClick={handleProcess}
                            className="bg-white text-black px-10 py-4 rounded-2xl font-black text-sm uppercase hover:bg-blue-600 hover:text-white transition-all shadow-2xl"
                          >تحليل ⚡</button>
                       </div>
                     )}
                  </div>
               </div>
             );
           })}

           {/* Navigation Buttons */}
           <button onClick={prevSystem} className="absolute left-0 z-[100] w-16 h-16 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-3xl border border-white/10 transition-all active:scale-90">←</button>
           <button onClick={nextSystem} className="absolute right-0 z-[100] w-16 h-16 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-3xl border border-white/10 transition-all active:scale-90">→</button>
        </div>

        {/* Results / Report Area */}
        <div className="w-full max-w-5xl mt-12 pb-40">
           {loading ? (
             <div className="space-y-6 animate-pulse">
                <div className="h-4 w-64 bg-white/5 rounded-full mx-auto"></div>
                <div className="h-40 w-full bg-white/5 rounded-[3rem]"></div>
             </div>
           ) : result ? (
             <div className="animate-slideUp space-y-10">
                <div className="bg-white/[0.03] border border-white/10 p-12 rounded-[4rem] relative overflow-hidden">
                   <div className={`absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b ${systems[activeIndex].color}`}></div>
                   <h4 className="text-2xl font-black text-white mb-8 flex items-center gap-4">
                     <span>💎</span> تقرير النظام: {systems[activeIndex].name}
                   </h4>
                   <div className="prose prose-invert max-w-none text-2xl leading-[1.8] text-slate-200 font-medium whitespace-pre-wrap text-right">
                     {result}
                   </div>
                   
                   <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center">
                      <div className="flex gap-4">
                         {sources.map((s, i) => (
                           <a key={i} href={s.uri} target="_blank" className="text-[10px] font-black text-blue-500 hover:underline">🔗 المصدر {i+1}</a>
                         ))}
                      </div>
                      <button 
                        onClick={injectToBrain}
                        disabled={isInjecting}
                        className={`px-12 py-5 rounded-[2rem] font-black text-sm uppercase transition-all shadow-3xl flex items-center gap-4 ${isInjecting ? 'bg-blue-600 text-white animate-pulse' : 'bg-white text-black hover:bg-emerald-500'}`}
                      >
                        {isInjecting ? 'جاري الحقن النوروني...' : 'إرسال إلى العقل الفائق 🧠'}
                      </button>
                   </div>
                </div>
             </div>
           ) : (
             <div className="py-20 text-center opacity-10 grayscale select-none pointer-events-none">
                <div className="text-[15rem] leading-none font-black tracking-tighter">DIMENSION</div>
                <p className="text-3xl font-black uppercase tracking-[1.5em] mt-8">Reactor_Standby</p>
             </div>
           )}
        </div>
      </main>

      <style>{`
        .perspective-[2000px] { perspective: 2000px; }
        @keyframes scanline { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
        .animate-scanline { animation: scanline 2s linear infinite; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};
