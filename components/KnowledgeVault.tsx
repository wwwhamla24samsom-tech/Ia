
import React, { useState } from 'react';
import { ingestKnowledge } from '../services/geminiService';
import { KnowledgeEntry } from '../types';

export const KnowledgeVault: React.FC = () => {
  const [data, setData] = useState('');
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleIngest = async () => {
    if (!data.trim()) return;
    setLoading(true);
    try {
      /* Fix: result is cast to any to allow access to title and summary properties returned from the service */
      const result = await ingestKnowledge(data) as any;
      const newEntry: KnowledgeEntry = {
        id: Math.random().toString(36).substr(2, 9),
        title: result.title,
        summary: result.summary,
        timestamp: Date.now()
      };
      setEntries([newEntry, ...entries]);
      setData('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto space-y-10 px-6 pb-48 text-right font-arabic">
      <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950 text-blue-400 rounded-[4rem] p-16 shadow-2xl border border-blue-500/20 -mt-10 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        <h2 className="text-5xl font-black mb-12 flex items-center gap-6 relative z-10">
          <span className="p-4 bg-indigo-900 border border-indigo-500 rounded-3xl shadow-[0_0_30px_rgba(99,102,241,0.5)] animate-float">📀</span>
          نواة الاستيعاب الكوآنتومي <span className="text-white">500TB</span>
        </h2>

        <div className="space-y-8 relative z-10">
          <textarea
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="أدخل مقالات، أرشيفات أكواد، أو أبحاث التشفير الكوآنتومي ليتم دمجها في ذاكرة صارة v15..."
            className="w-full bg-black/40 border border-indigo-500/30 rounded-[2.5rem] px-10 py-10 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 text-white h-64 resize-none placeholder-indigo-900/50 shadow-inner text-2xl font-medium transition-all"
          />
          <button
            onClick={handleIngest}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-8 rounded-[3rem] font-black text-2xl transition-all shadow-[0_0_50px_rgba(99,102,241,0.3)] flex items-center justify-center gap-6 group"
          >
            {loading ? (
               <div className="flex gap-4">
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  <span className="text-xl">جاري الامتصاص الكوآنتومي...</span>
               </div>
            ) : (
              <>
                <span>تغذية النواة بالعلم الكوني</span>
                <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-12 mt-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
           <div className="text-right">
              <h3 className="text-4xl font-black text-white uppercase tracking-tighter">الذاكرة المدمجة</h3>
              <p className="text-slate-500 font-bold mt-2">قاعدة بيانات صارة v15 المحدثة</p>
           </div>
           <div className="relative flex-1 max-w-md w-full">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث في أرشيف الـ 500TB..."
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/20 text-lg text-white text-right placeholder-slate-600"
              />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredEntries.map(entry => (
            <div key={entry.id} className="bg-slate-900/40 backdrop-blur-xl rounded-[3.5rem] p-10 border border-white/5 hover:border-blue-500/30 transition-all animate-fadeIn relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-1.5 h-full bg-blue-600 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top shadow-[0_0_20px_blue]"></div>
              <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">V7_Memory_Block</div>
              <h4 className="text-2xl font-black text-white mb-6 group-hover:text-blue-400 transition-colors">{entry.title}</h4>
              <p className="text-slate-400 leading-relaxed text-lg mb-8 line-clamp-4 italic">"{entry.summary}"</p>
              <div className="flex justify-between items-center text-[10px] font-black text-slate-700 border-t border-white/5 pt-8">
                <span>ENTRY_ID: {entry.id.toUpperCase()}</span>
                <span>INGEST_STAMP: {new Date(entry.timestamp).toLocaleDateString('ar-SA')}</span>
              </div>
            </div>
          ))}
          {filteredEntries.length === 0 && (
            <div className="col-span-full py-40 text-center text-slate-800 flex flex-col items-center gap-10 opacity-20 grayscale">
               <div className="text-[10rem]">📦</div>
               <p className="text-4xl font-black uppercase tracking-[1em]">Core_Vacuum</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};
