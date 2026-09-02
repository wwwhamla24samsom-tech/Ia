
import React, { useState } from 'react';
import { askScienceExpert } from '../services/geminiService';
import { Language } from '../types';

interface ScienceLibraryProps {
  language: Language;
}

export const ScienceLibrary: React.FC<ScienceLibraryProps> = ({ language }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const quickTopics = [
    { label: 'النسبية العامة', icon: '⚛️' },
    { label: 'الثقوب السوداء', icon: '🪐' },
    { label: 'تفاضل وتكامل', icon: '➗' },
    { label: 'ميكانيكا الكم', icon: '🔬' }
  ];

  const handleAsk = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const activeQuery = customQuery || query;
    if (!activeQuery.trim()) return;

    setLoading(true);
    setResponse('');
    try {
      // Fix: Passed language argument to askScienceExpert
      const answer = await askScienceExpert(activeQuery, language);
      setResponse(answer);
    } catch (err) {
      setResponse("حدث خطأ أثناء التواصل مع مختبر العلوم. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto space-y-6 px-4">
      <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 -mt-10 relative z-10 shadow-xl">
        <h2 className="text-3xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
          <span className="bg-emerald-600 text-white p-2 rounded-xl">📚</span>
          مكتبة العلوم الذكية
        </h2>
        
        <form onSubmit={handleAsk} className="space-y-4">
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="اطرح سؤالك في الفيزياء، الرياضيات، أو الفلك..."
              className="w-full bg-white border border-emerald-200 rounded-2xl px-6 py-5 focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all text-lg h-32 resize-none shadow-inner"
            />
            {loading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                   <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-emerald-700 font-bold animate-pulse">صارة تفكر بعمق...</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between gap-4">
             <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
               {quickTopics.map((topic) => (
                 <button
                   key={topic.label}
                   type="button"
                   onClick={() => {
                     setQuery(topic.label);
                     handleAsk(undefined, `اشرح لي بالتفصيل عن ${topic.label}`);
                   }}
                   className="flex-shrink-0 bg-white border border-emerald-100 px-4 py-2 rounded-xl text-sm font-semibold text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                 >
                   {topic.icon} {topic.label}
                 </button>
               ))}
             </div>
             <button
              disabled={loading}
              className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-emerald-700 disabled:bg-emerald-300 transition-all shadow-lg shadow-emerald-200"
            >
              اسأل العالمة
            </button>
          </div>
        </form>
      </div>

      <div className="flex-1 pb-24 overflow-y-auto mt-4">
        {response ? (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-50 animate-fadeIn">
            <div className="prose prose-emerald max-w-none">
               <p className="whitespace-pre-wrap text-gray-700 leading-relaxed text-lg italic">
                  {response}
               </p>
            </div>
          </div>
        ) : !loading && (
          <div className="text-center py-20 opacity-40">
            <div className="text-6xl mb-4">🔬</div>
            <p className="text-xl text-emerald-900 font-medium">صارة جاهزة لحل أعقد المسائل العلمية معك</p>
          </div>
        )}
      </div>
    </div>
  );
};
