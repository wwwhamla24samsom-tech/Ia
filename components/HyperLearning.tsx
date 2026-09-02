
import React, { useState } from 'react';
import { hyperLearnExpert } from '../services/geminiService';
import { Language } from '../types';

interface HyperLearningProps {
  language: Language;
}

export const HyperLearning: React.FC<HyperLearningProps> = ({ language }) => {
  const [query, setQuery] = useState('');
  const [field, setField] = useState('الاقتصاد والأسواق المالية');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');

  const fields = [
    { name: 'الاقتصاد والأسواق المالية', icon: '💹' },
    { name: 'الذكاء الاصطناعي المتقدم', icon: '🤖' },
    { name: 'الجيوسياسية العالمية', icon: '🌍' },
    { name: 'العلوم العصبية والنورونية', icon: '🧠' },
    { name: 'فلسفة المستقبل', icon: '⏳' }
  ];

  const handleLearn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setAnalysis('');
    try {
      const result = await hyperLearnExpert(query, field, language);
      setAnalysis(result);
    } catch (err) {
      setAnalysis("⚠️ حدث خطأ في وحدة التعلم الفائق. يرجى التحقق من مفتاح الـ API والاتصال بالنواة.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto space-y-8 px-4 pb-40">
      <div className="bg-slate-950 text-emerald-400 rounded-[3.5rem] p-12 shadow-2xl -mt-10 relative overflow-hidden border border-emerald-500/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(16,185,129,0.1),transparent)]"></div>
        
        <div className="flex justify-between items-center mb-10 relative z-10">
          <h2 className="text-4xl font-black flex items-center gap-4">
            <span className="p-4 bg-emerald-500/10 rounded-3xl border border-emerald-500/20">🧬</span>
            نواة التعلم الفائق
          </h2>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">Neural_Link_Active</span>
          </div>
        </div>

        <div className="space-y-8 relative z-10">
          <div className="flex flex-wrap gap-3">
            {fields.map(f => (
              <button 
                key={f.name} 
                onClick={() => setField(f.name)}
                className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all border flex items-center gap-2 ${field === f.name ? 'bg-emerald-600 border-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-slate-900 border-emerald-900/30 text-emerald-800 hover:border-emerald-700'}`}
              >
                <span>{f.icon}</span>
                {f.name}
              </button>
            ))}
          </div>

          <form onSubmit={handleLearn} className="space-y-6">
            <div className="relative group">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`حلل المشهد الحالي في ${field}... أدخل بياناتك أو سؤالك الاستراتيجي`}
                className="w-full bg-slate-900/50 border border-emerald-500/10 rounded-[2.5rem] px-10 py-8 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-emerald-100 h-56 resize-none placeholder-emerald-900/50 text-xl font-medium shadow-inner transition-all group-hover:border-emerald-500/30"
              />
              <div className="absolute bottom-6 left-10 text-[10px] text-emerald-900 font-black uppercase tracking-widest">Awaiting_Neural_Input_v4</div>
            </div>
            
            <button
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 py-6 rounded-[2.5rem] font-black text-xl transition-all shadow-2xl shadow-emerald-900/20 flex items-center justify-center gap-4 group"
            >
              {loading ? (
                <div className="flex gap-2">
                   <div className="w-2 h-2 bg-slate-950 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-slate-950 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                   <div className="w-2 h-2 bg-slate-950 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              ) : (
                <>
                  <span>بدء عملية التقطير الاستراتيجي</span>
                  <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="flex-1 space-y-8">
        {analysis ? (
          <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3.5rem] p-12 shadow-2xl border border-white/5 animate-fadeIn relative">
            <div className="absolute top-0 right-12 w-24 h-1 bg-emerald-500/50"></div>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_emerald]"></span>
              <h3 className="text-xl font-black text-emerald-400 uppercase tracking-tighter">الذكاء المستخلص (Neural Output)</h3>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-200 leading-relaxed text-xl whitespace-pre-wrap font-medium">
                {analysis}
              </p>
            </div>
          </div>
        ) : !loading && (
          <div className="py-32 text-center text-slate-800 flex flex-col items-center gap-6 opacity-30 grayscale transition-all hover:grayscale-0 hover:opacity-50">
             <div className="text-9xl mb-4">📈</div>
             <p className="text-3xl font-black uppercase tracking-[1rem]">Deep_Analysis_Ready</p>
             <p className="text-sm font-bold">صارة مستعدة لتحليل أعقد المتغيرات الاقتصادية والسياسية</p>
          </div>
        )}
      </div>
    </div>
  );
};
