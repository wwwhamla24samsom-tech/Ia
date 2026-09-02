
import React, { useState } from 'react';
import { InternalApp, Language } from '../types';

export const AppSuite: React.FC<{ language: Language }> = ({ language }) => {
  const [activeApp, setActiveApp] = useState<string | null>(null);

  const apps: InternalApp[] = [
    { id: 'calc', name: 'الحاسبة النورونية', icon: '🔢', description: 'حسابات فائقة السرعة مع تنبؤ بالنتائج.', category: 'Utilities', status: 'active' },
    { id: 'clock', name: 'التوقيت العالمي', icon: '🕒', description: 'مزامنة الوقت عبر القارات بدقة ذرية.', category: 'Time', status: 'active' },
    { id: 'health', name: 'المتتبع الحيوي', icon: '🧬', description: 'تحليل المؤشرات الحيوية عبر الكاميرا.', category: 'Health', status: 'beta' },
    { id: 'finance', name: 'محلل الأسواق', icon: '📈', description: 'توقعات أسهم العملات والمعادن الثمينة.', category: 'Finance', status: 'active' },
    { id: 'notes', name: 'المفكرة السرية', icon: '📝', description: 'ملاحظات مشفرة لا تلمس السحابة أبداً.', category: 'Security', status: 'active' },
    { id: 'weather', name: 'رادار الطقس', icon: '🌩️', description: 'توقعات جوية مبنية على خرائط فضائية.', category: 'Science', status: 'active' }
  ];

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto space-y-12 px-6 pb-40 font-arabic text-right">
      
      {/* Premium Header */}
      <div className="text-center space-y-4 pt-10 animate-fadeIn">
        <h2 className="text-7xl font-black text-white tracking-tighter uppercase leading-none">تطبيقات <span className="text-blue-500">صارة</span></h2>
        <p className="text-slate-500 text-xl font-medium tracking-wide max-w-2xl mx-auto italic">
           "مجموعة من الأدوات الجميلة والمصقولة بدقة، مدمجة في صلب نظام صارة السيادي."
        </p>
      </div>

      {!activeApp ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slideUp">
           {apps.map(app => (
             <button 
               key={app.id}
               onClick={() => setActiveApp(app.id)}
               className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 flex flex-col items-center gap-8 group hover:bg-blue-600 hover:scale-105 transition-all duration-500 shadow-2xl relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-4 opacity-20 text-[8px] font-black uppercase tracking-widest text-white">{app.category}</div>
                <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-700 shadow-inner group-hover:bg-white group-hover:text-blue-600">
                   {app.icon}
                </div>
                <div className="text-center space-y-3">
                   <h3 className="text-3xl font-black text-white group-hover:text-black">{app.name}</h3>
                   <p className="text-slate-500 group-hover:text-blue-100 text-sm leading-relaxed italic line-clamp-2">"{app.description}"</p>
                </div>
                <div className="flex items-center gap-2">
                   <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${app.status === 'beta' ? 'bg-amber-500 text-black' : 'bg-blue-600/20 text-blue-400 group-hover:bg-white group-hover:text-blue-600'}`}>
                      {app.status === 'beta' ? 'BETA_BUILD' : 'OS_STABLE'}
                   </span>
                </div>
             </button>
           ))}
        </div>
      ) : (
        <div className="bg-black/60 backdrop-blur-3xl border border-white/5 rounded-[4rem] p-16 animate-fadeIn relative flex flex-col items-center min-h-[600px] justify-center text-center shadow-[0_0_100px_rgba(59,130,246,0.1)]">
           <button onClick={() => setActiveApp(null)} className="absolute top-10 left-10 text-slate-500 hover:text-white font-black text-sm uppercase tracking-widest border-b border-transparent hover:border-white transition-all">← Back_To_Apps</button>
           
           <div className="text-[12rem] animate-float mb-12">
              {apps.find(a => a.id === activeApp)?.icon}
           </div>
           <h3 className="text-6xl font-black text-white mb-6">{apps.find(a => a.id === activeApp)?.name}</h3>
           <p className="text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
              "هذا التطبيق قيد المزامنة النورونية العميقة الآن. سيتم توفيره في التحديث القادم كجزء من تجسيد صارة v15.1."
           </p>
           
           <div className="mt-12 flex gap-4">
              <div className="px-8 py-3 bg-blue-600 text-white rounded-full font-black text-xs uppercase tracking-widest animate-pulse">Establishing_Neural_Sync</div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
