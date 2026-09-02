
import React, { useState } from 'react';
import { improveLinguisticSkills } from '../services/geminiService';
import { Language } from '../types';

export const LanguageLab: React.FC<{ currentLang: Language }> = ({ currentLang }) => {
  const [inputText, setInputText] = useState('');
  const [targetLang, setTargetLang] = useState<Language>(currentLang);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  const linguisticTemplates = [
    { id: 'tech', label: 'صياغة تقنية ⚙️', prompt: 'قم بتحويل النص التالي إلى توثيق تقني دقيق بمعايير ISO:', color: 'border-blue-500/30 text-blue-400' },
    { id: 'creative', label: 'أسلوب إبداعي ✨', prompt: 'أعد صياغة النص بأسلوب أدبي ملهم وجذاب:', color: 'border-purple-500/30 text-purple-400' },
    { id: 'formal', label: 'خطاب رسمي 🏛️', prompt: 'حول النص إلى صيغة رسمية دبلوماسية شديدة اللباقة:', color: 'border-amber-500/30 text-amber-400' },
    { id: 'logic', label: 'منطق فلسفي ⚖️', prompt: 'حلل النص وأعد صياغته كأطروحة منطقية محكمة:', color: 'border-emerald-500/30 text-emerald-400' }
  ];

  const handleApplyTemplate = async (templatePrompt: string) => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const enhanced = await improveLinguisticSkills(`${templatePrompt}\n\n${inputText}`, targetLang);
      setResult(enhanced);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImprove = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const enhanced = await improveLinguisticSkills(inputText, targetLang);
      setResult(enhanced);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto space-y-8 px-4 pb-40 font-arabic">
      <div className="bg-slate-950/80 backdrop-blur-3xl text-white rounded-[3rem] p-10 shadow-2xl -mt-10 relative z-10 border border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
        <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
          <span className="bg-blue-600/20 p-3 rounded-2xl text-blue-400 border border-blue-500/20">🌍</span>
          مختبر اللغات والذكاء اللغوي
        </h2>
        
        <div className="space-y-8">
          {/* Quick Templates Chips */}
          <div className="flex flex-wrap gap-3">
             {linguisticTemplates.map(t => (
               <button
                 key={t.id}
                 onClick={() => handleApplyTemplate(t.prompt)}
                 disabled={loading || !inputText.trim()}
                 className={`px-6 py-2.5 rounded-full border text-[10px] font-black transition-all hover:bg-white/5 active:scale-95 disabled:opacity-30 ${t.color}`}
               >
                 {t.label}
               </button>
             ))}
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اكتب نصاً لتحسينه، ترجمته، أو صياغته بقالب احترافي..."
            className="w-full bg-black/40 border border-white/10 rounded-[2rem] px-8 py-6 focus:outline-none focus:ring-4 focus:ring-blue-500/10 text-white h-48 resize-none shadow-inner text-xl leading-relaxed placeholder:text-slate-800"
          />
          
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex bg-white/5 p-1.5 rounded-2xl gap-2 border border-white/5 w-full md:w-auto">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setTargetLang(lang.code)}
                  className={`flex-1 md:px-6 py-2 rounded-xl text-[10px] font-black transition-all ${
                    targetLang === lang.code ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleImprove}
              disabled={loading}
              className="w-full md:flex-1 bg-white text-black py-4 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>تحسين وترجمة فورية 🚀</>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 pb-24">
        {result ? (
          <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-12 border border-white/10 animate-fadeIn shadow-2xl relative group">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 shadow-[0_0_20px_blue] rounded-full"></div>
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-black text-blue-400 flex items-center gap-3">
                 <span>💎</span> النتيجة المطورة (V7 Output)
               </h3>
               <button 
                  onClick={() => { navigator.clipboard.writeText(result); alert('تم النسخ!'); }}
                  className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition-all"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
               </button>
            </div>
            <p className="whitespace-pre-wrap text-white text-2xl leading-[1.8] text-right font-medium selection:bg-blue-500/30">
              {result}
            </p>
          </div>
        ) : !loading && (
          <div className="py-20 text-center text-slate-800 opacity-20 flex flex-col items-center gap-6 grayscale select-none">
             <div className="text-[10rem]">🏮</div>
             <p className="text-3xl font-black uppercase tracking-[0.8em]">Linguistic_Core_Idle</p>
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};
