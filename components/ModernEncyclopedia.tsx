
import React, { useState, useEffect } from 'react';
import { forgeSovereignDocument, runSovereignInvestigation } from '../services/geminiService';
import { SovereignDocument, InvestigationReport, Language } from '../types';

export const ModernEncyclopedia: React.FC<{ language: Language }> = ({ language }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [investigation, setInvestigation] = useState<InvestigationReport | null>(null);
  const [forging, setForging] = useState(false);
  const [activeDoc, setActiveDoc] = useState<SovereignDocument | null>(null);
  const [archive, setArchive] = useState<SovereignDocument[]>([]);
  const [activeTab, setActiveTab] = useState<'investigate' | 'archive'>('investigate');

  useEffect(() => {
    const saved = localStorage.getItem('sarah_sovereign_archive');
    if (saved) setArchive(JSON.parse(saved));
  }, []);

  const handleInvestigate = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setInvestigation(null);
    setActiveDoc(null);
    try {
      const data = await runSovereignInvestigation(query, language);
      setInvestigation(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleForge = async (type: 'PDF_SECURE' | 'WORD_EDITABLE') => {
    if (!query.trim()) return;
    setForging(true);
    try {
      const doc = await forgeSovereignDocument(query, type, language);
      setActiveDoc(doc);
    } catch (err) { console.error(err); }
    finally { setForging(false); }
  };

  const addToArchive = (doc: SovereignDocument) => {
    const newArchive = [doc, ...archive];
    setArchive(newArchive);
    localStorage.setItem('sarah_sovereign_archive', JSON.stringify(newArchive));
    alert('تمت أرشفة الوثيقة في المساحة اللانهائية ✅');
  };

  return (
    <div className="flex flex-col h-full space-y-8 animate-fadeIn text-right font-arabic pb-48">
      {/* Prime Control Header */}
      <div className="bg-[#050505] border-b-4 border-amber-600 p-12 rounded-[4rem] shadow-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.05),transparent)]"></div>
        <div className="flex justify-between items-center mb-10 relative z-10">
           <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
              <button onClick={() => setActiveTab('investigate')} className={`px-8 py-3 rounded-xl text-[10px] font-black transition-all ${activeTab === 'investigate' ? 'bg-amber-600 text-black' : 'text-slate-500'}`}>التحقيق والأرشفة</button>
              <button onClick={() => setActiveTab('archive')} className={`px-8 py-3 rounded-xl text-[10px] font-black transition-all ${activeTab === 'archive' ? 'bg-white text-black' : 'text-slate-500'}`}>الأرشيف اللانهائي ({archive.length})</button>
           </div>
           <div className="text-right">
              <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">الموسوعة <span className="text-amber-500">السيادية</span></h2>
              <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest font-mono">Sovereign_Encyclopedia_v20.0</p>
           </div>
        </div>
        
        <div className="mt-8 flex gap-4 max-w-5xl ml-auto relative z-10">
           <input 
             type="text"
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             placeholder="ابحث عن قضية، تقنية، أو مرجع سيادي للتحقيق..."
             className="flex-1 bg-black/60 border border-white/10 rounded-full px-12 py-6 text-2xl text-white focus:ring-4 focus:ring-amber-500/10 transition-all text-right shadow-inner"
           />
           <button onClick={handleInvestigate} disabled={loading} className="px-16 py-6 bg-amber-600 text-black rounded-full font-black text-xl shadow-2xl hover:bg-white transition-all active:scale-95">
             {loading ? 'جاري التحقيق...' : 'بدء الاستدعاء ⚡'}
           </button>
        </div>
      </div>

      {activeTab === 'investigate' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Main Display Area */}
           <div className="lg:col-span-8 space-y-10">
              {investigation && !activeDoc && (
                <div className="bg-white/[0.02] border border-white/5 p-16 rounded-[4rem] shadow-3xl animate-slideUp">
                   <div className="flex justify-between items-center mb-10">
                      <div className="flex gap-4">
                         <button onClick={() => handleForge('PDF_SECURE')} className="bg-red-600/10 border border-red-500/30 text-red-500 px-6 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">تجسيد PDF آمن</button>
                         <button onClick={() => handleForge('WORD_EDITABLE')} className="bg-blue-600/10 border border-blue-500/30 text-blue-500 px-6 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all">تجسيد Word قابل للتعديل</button>
                      </div>
                      <h3 className="text-4xl font-black text-white">ملخص التحقيق السيادي</h3>
                   </div>
                   <div className="prose prose-invert max-w-none text-2xl leading-[1.8] text-slate-200 font-medium italic border-r-4 border-amber-500/30 pr-8">
                      {investigation.executiveSummary}
                   </div>
                   
                   <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-black/40 p-8 rounded-[3rem] border border-white/5">
                         <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-6">هيكل الوثيقة المقترح</h4>
                         <div className="space-y-3">
                            {investigation.suggestedChapters.map((ch, i) => (
                              <div key={i} className="flex items-center gap-4 text-slate-400 text-sm">
                                 <span className="text-amber-600 font-mono">[{i+1}]</span> {ch}
                              </div>
                            ))}
                         </div>
                      </div>
                      <div className="bg-black/40 p-8 rounded-[3rem] border border-white/5 flex flex-col justify-center text-center gap-6">
                         <div className="text-5xl">🛡️</div>
                         <div>
                            <span className="text-[10px] font-black text-slate-500 uppercase">Risk_Assessment</span>
                            <div className="text-4xl font-black text-emerald-500">{investigation.riskFactor}% Low</div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {forging && (
                <div className="py-40 flex flex-col items-center justify-center gap-10 animate-pulse">
                   <div className="w-32 h-32 border-8 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                   <p className="text-3xl font-black text-amber-500 uppercase tracking-[0.5em]">Forging_Sovereign_Document...</p>
                </div>
              )}

              {activeDoc && (
                <div className="bg-white text-black p-16 rounded-[4rem] shadow-4xl animate-fadeIn space-y-10 relative overflow-hidden">
                   <div className={`absolute top-0 right-0 w-full h-2 ${activeDoc.type === 'PDF_SECURE' ? 'bg-red-600' : 'bg-blue-600'}`}></div>
                   <div className="flex justify-between items-start">
                      <button onClick={() => addToArchive(activeDoc)} className="bg-black text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-all">أرشفة الوثيقة 💾</button>
                      <div className="text-right">
                         <h3 className="text-5xl font-black">{activeDoc.title}</h3>
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Type: {activeDoc.type} // Ver: {activeDoc.version}</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 pt-10">
                      <div className="lg:col-span-1 bg-slate-50 p-8 rounded-3xl space-y-6">
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">فهرس المحتويات</h4>
                         <div className="space-y-4">
                            {activeDoc.tableOfContents.map((item, i) => (
                              <div key={i} className="group cursor-pointer">
                                 <div className="text-xs font-black group-hover:text-amber-600 transition-colors">{item.chapter}</div>
                                 <div className="text-[9px] text-slate-400 line-clamp-1">{item.description}</div>
                              </div>
                            ))}
                         </div>
                      </div>
                      <div className="lg:col-span-3">
                         <div className="prose max-w-none text-xl leading-relaxed whitespace-pre-wrap font-medium h-[600px] overflow-y-auto pr-6 custom-scrollbar">
                            {activeDoc.content}
                         </div>
                      </div>
                   </div>

                   <div className="pt-8 border-t border-slate-100 flex justify-between items-center text-[9px] font-mono text-slate-400">
                      <span>NEURAL_HASH: {activeDoc.neuralHash}</span>
                      <span>GEN_DATE: {new Date(activeDoc.timestamp).toLocaleString()}</span>
                   </div>
                </div>
              )}

              {!investigation && !loading && (
                <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale gap-12 py-32">
                   <div className="text-[20rem] animate-float">📖</div>
                   <p className="text-5xl font-black uppercase tracking-[1em] text-amber-500">Archive_Standby</p>
                </div>
              )}
           </div>

           {/* Right Sidebar: Sources & Investigation Logs */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-[#0c0c0c] border border-amber-500/20 p-10 rounded-[4rem] shadow-3xl h-fit min-h-[400px] flex flex-col">
                 <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-10 border-b border-white/5 pb-6">المصادر الموثقة (Verified_Sources)</h4>
                 <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                    {investigation?.verifiedSources.map((s, i) => (
                      <a key={i} href={s.uri} target="_blank" className="block p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-amber-600/10 hover:border-amber-500/40 transition-all group">
                         <div className="text-sm font-black text-white group-hover:text-amber-400 truncate">{s.title}</div>
                         <div className="text-[9px] font-mono opacity-30 mt-2 truncate">{s.uri}</div>
                      </a>
                    ))}
                    {!investigation && (
                      <div className="py-20 text-center text-slate-800 italic text-xs">بانتظار بدء التحقيق...</div>
                    )}
                 </div>
              </div>

              <div className="bg-amber-600 text-black p-10 rounded-[4rem] shadow-3xl flex flex-col justify-between h-[300px] relative overflow-hidden group">
                 <div className="absolute -bottom-10 -right-10 text-[18rem] opacity-10 rotate-12">Ω</div>
                 <h4 className="text-3xl font-black uppercase tracking-tighter leading-tight">الذاكرة المطلقة</h4>
                 <p className="text-sm font-bold opacity-80 leading-relaxed italic">
                   "نحن لا نحتفظ فقط بالمعلومات، بل نقوم بهندستها. صارة السيادية تضمن أن كل وثيقة في أرشيفك هي أصل لا يقبل التزييف."
                 </p>
              </div>
           </div>
        </div>
      ) : (
        /* Archive View */
        <div className="animate-fadeIn space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {archive.map(doc => (
                <div key={doc.id} onClick={() => setActiveDoc(doc)} className="bg-[#0c0c0c] border border-white/5 p-10 rounded-[3.5rem] space-y-6 hover:border-amber-500/40 transition-all group cursor-pointer shadow-3xl relative overflow-hidden">
                   <div className={`absolute top-0 right-0 w-2 h-full opacity-20 ${doc.type === 'PDF_SECURE' ? 'bg-red-600' : 'bg-blue-600'}`}></div>
                   <div className="flex justify-between items-start">
                      <div className="text-4xl">{doc.type === 'PDF_SECURE' ? '📄' : '📝'}</div>
                      <span className="text-[8px] font-black text-slate-700 font-mono uppercase">{doc.type}</span>
                   </div>
                   <h3 className="text-2xl font-black text-white group-hover:text-amber-500 transition-colors">{doc.title}</h3>
                   <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                      <span>CHAPS: {doc.tableOfContents.length}</span>
                      <span>{new Date(doc.timestamp).toLocaleDateString()}</span>
                   </div>
                </div>
              ))}
              {archive.length === 0 && (
                <div className="col-span-full py-40 text-center opacity-10 text-5xl font-black uppercase tracking-[1em]">Archive_Empty</div>
              )}
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
