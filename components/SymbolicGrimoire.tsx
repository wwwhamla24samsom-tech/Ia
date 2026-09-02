
import React, { useState, useEffect, useRef } from 'react';
import { SymbolEntry, Language, SearchSource } from '../types';
import { callHyperSearch, analyzeAncientContent } from '../services/geminiService';

interface BookEntry {
  id: string;
  title: string;
  author: string;
  era: string;
  description: string;
  category: 'philosophy' | 'mysticism' | 'history' | 'system';
  coverIcon: string;
  isExternal?: boolean;
}

export const SymbolicGrimoire: React.FC<{ language: Language }> = ({ language }) => {
  const [activeDrawer, setActiveDrawer] = useState<'books' | 'symbols' | 'network'>('books');
  const [searchSource, setSearchSource] = useState<'internal' | 'external'>('internal');
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Results State
  const [internalBooks, setInternalBooks] = useState<BookEntry[]>([
    { id: 'gilgamesh', title: 'ملحمة جلجامش', author: 'سومر', era: '2100 ق.م', category: 'history', coverIcon: '🦁', description: 'أقدم ملاحم البشرية تتحدث عن الخلود والملك العظيم.' },
    { id: 'emerald', title: 'لوح الزمرد', author: 'هرمس', era: 'مصر القديمة', category: 'mysticism', coverIcon: '❇️', description: 'النص المؤسس للخيمياء والارتباط الكوني.' },
    { id: 'republic', title: 'جمهورية أفلاطون', author: 'أفلاطون', era: '375 ق.م', category: 'system', coverIcon: '🏛️', description: 'تصميم المدينة الفاضلة والعدالة المطلقة.' },
    { id: 'muqaddimah', title: 'المقدمة', author: 'ابن خلدون', era: '1377 م', category: 'history', coverIcon: '🌍', description: 'تأسيس علم العمران البشري والاجتماع.' }
  ]);

  const [internalSymbols, setInternalSymbols] = useState<SymbolEntry[]>([
    { id: 'inanna', glyph: '𒈹', name: 'Inanna Star', origin: 'Sumerian', category: 'mesopotamian', meaning: 'رمز الملكية والألوهية والنفوذ.' },
    { id: 'horus', glyph: '𓁹', name: 'Eye of Horus', origin: 'Egyptian', category: 'egyptian', meaning: 'رمز الحماية والقوة والشفاء.' },
    { id: 'aleph', glyph: '𐤀', name: 'Aleph Ox', origin: 'Ancient Torah', category: 'torah_ancient', meaning: 'البداية المطلقة وقوة الخلق الأولى.' }
  ]);

  const [externalInvestigation, setExternalInvestigation] = useState<{ text: string, sources: SearchSource[] } | null>(null);

  // Modal / Inspection States
  const [selectedItem, setSelectedItem] = useState<BookEntry | SymbolEntry | null>(null);
  const [analysisText, setAnalysisText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setActiveQuery(query);
    
    if (searchSource === 'external') {
      setActiveDrawer('network');
      try {
        const result = await callHyperSearch(`التحقيق الشامل حول: ${query}. ابحث في المصادر التاريخية والكتب والمراجع العالمية.`, language);
        setExternalInvestigation(result);
      } catch (err) {
        console.error("Net search failed", err);
      }
    } else {
      // Simulate fast internal retrieval
      await new Promise(r => setTimeout(r, 600));
    }
    
    setIsSearching(false);
  };

  const handleDeepInspect = async () => {
    if (!selectedItem) return;
    setIsAnalyzing(true);
    setAnalysisText('');
    try {
      const type = 'glyph' in selectedItem ? 'symbol' : 'book';
      const name = 'glyph' in selectedItem ? (selectedItem as SymbolEntry).name : (selectedItem as BookEntry).title;
      const res = await analyzeAncientContent(name, type, language);
      setAnalysisText(res);
    } catch (err) {
      setAnalysisText("خطأ في تشفير البيانات النورونية.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredBooks = internalBooks.filter(b => b.title.includes(activeQuery) || b.description.includes(activeQuery));
  const filteredSymbols = internalSymbols.filter(s => s.name.includes(activeQuery) || s.meaning.includes(activeQuery));

  return (
    <div className="flex flex-col h-full max-w-full mx-auto space-y-10 px-6 pb-40 text-right font-arabic">
      
      {/* Sovereign Search Console */}
      <div className="bg-[#050505] border border-white/10 p-12 rounded-[4rem] shadow-3xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-20"></div>
         <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent ${isSearching ? 'animate-scanline' : 'opacity-50'}`}></div>
         
         <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
            <div className="flex items-center gap-10">
               <div className={`w-28 h-28 bg-blue-600/10 rounded-[2.5rem] border border-blue-500/30 flex items-center justify-center text-6xl shadow-2xl transition-all duration-500 ${isSearching ? 'scale-110 shadow-blue-500/50 rotate-12' : 'animate-float'}`}>
                 {searchSource === 'external' ? '🌐' : '🏛️'}
               </div>
               <div>
                  <h2 className="text-7xl font-black text-white tracking-tighter uppercase leading-none">الأرشيف <span className="text-blue-500">الملكي</span></h2>
                  <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-4">Sovereign_Deep_Retrieval_Matrix_v19.4</p>
               </div>
            </div>
            
            <div className="flex bg-black/60 p-2 rounded-[2.5rem] border border-white/5">
               <button 
                 onClick={() => { setActiveDrawer('books'); setQuery(''); setActiveQuery(''); }}
                 className={`px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all ${activeDrawer === 'books' ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
               >درج الكتب 📚</button>
               <button 
                 onClick={() => { setActiveDrawer('symbols'); setQuery(''); setActiveQuery(''); }}
                 className={`px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all ${activeDrawer === 'symbols' ? 'bg-amber-600 text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
               >درج الرموز 📜</button>
               {externalInvestigation && (
                 <button 
                   onClick={() => setActiveDrawer('network')}
                   className={`px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all ${activeDrawer === 'network' ? 'bg-blue-600 text-white shadow-xl' : 'text-blue-900 animate-pulse'}`}
                 >التحقيق المباشر 📡</button>
               )}
            </div>
         </div>
         
         <div className="mt-12 relative max-w-5xl mx-auto z-10">
            <form onSubmit={handleSearch} className="relative flex items-center gap-4 bg-white/5 border border-white/10 rounded-full p-2 focus-within:border-blue-500/50 transition-all shadow-inner backdrop-blur-3xl">
               
               <div className="flex gap-1 bg-black/40 rounded-full p-1 mr-2">
                  <button 
                    type="button" 
                    onClick={() => setSearchSource('internal')}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${searchSource === 'internal' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}
                  >الذاكرة</button>
                  <button 
                    type="button" 
                    onClick={() => setSearchSource('external')}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${searchSource === 'external' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}
                  >الشبكة</button>
               </div>

               <input 
                 type="text" 
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 placeholder={searchSource === 'external' ? "اطلب تحقيقاً كاملاً من موارد الويب الخارجية..." : "ابحث في ذاكرة الكتب والرموز المحمية..."}
                 className="flex-1 bg-transparent border-none px-6 text-white focus:ring-0 text-right text-2xl font-medium placeholder:text-blue-900/30"
               />

               <div className="flex gap-2">
                  {query && (
                    <button type="button" onClick={() => setQuery('')} className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-slate-500 hover:text-red-500 transition-all">✕</button>
                  )}
                  <button 
                    type="submit"
                    disabled={isSearching || !query.trim()}
                    className={`px-12 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all ${isSearching ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.4)]'}`}
                  >
                    {isSearching ? 'جاري الاسترجاع...' : 'إرسال الاستدعاء ⚡'}
                  </button>
               </div>
            </form>
         </div>
      </div>

      {/* Dynamic Display Area */}
      <main className="animate-fadeIn min-h-[600px]">
        
        {isSearching && (
          <div className="py-40 flex flex-col items-center justify-center gap-12 animate-fadeIn">
             <div className="w-32 h-32 border-[10px] border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
             <p className="text-4xl font-black text-blue-500 animate-pulse tracking-[0.5em] uppercase">Deep_Archive_Fetch...</p>
          </div>
        )}

        {!isSearching && (
          <>
            {activeDrawer === 'books' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {filteredBooks.map(book => (
                   <div key={book.id} onClick={() => { setSelectedItem(book); setAnalysisText(''); }} className="bg-[#080808] border border-white/5 rounded-[4rem] p-10 flex flex-col md:flex-row gap-10 hover:border-blue-500/30 transition-all group cursor-pointer shadow-2xl relative overflow-hidden">
                      <div className="w-full md:w-56 h-72 bg-gradient-to-br from-slate-900 to-black rounded-[3rem] border border-white/10 flex flex-col items-center justify-center relative shadow-inner group-hover:scale-105 transition-transform duration-500">
                         <div className="text-8xl mb-4 group-hover:scale-110 transition-transform">{book.coverIcon}</div>
                         <div className="text-center px-4">
                            <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">{book.era}</span>
                            <span className="text-xs font-bold text-blue-400 opacity-60 uppercase">{book.category}</span>
                         </div>
                         <div className="absolute left-4 top-4 bottom-4 w-1 bg-blue-500/20 rounded-full"></div>
                      </div>
                      <div className="flex-1 space-y-6 py-4">
                         <h3 className="text-4xl font-black text-white group-hover:text-blue-400 transition-colors leading-tight">{book.title}</h3>
                         <p className="text-xl text-slate-400 leading-relaxed italic font-medium pr-8 border-r-4 border-blue-600/30">"{book.description}"</p>
                         <button className="px-10 py-5 bg-white text-black rounded-[2rem] font-black text-sm uppercase hover:bg-blue-600 hover:text-white transition-all shadow-xl">فحص المخطوطة 👁️</button>
                      </div>
                   </div>
                 ))}
                 {filteredBooks.length === 0 && <div className="col-span-full py-40 text-center opacity-10 text-5xl font-black uppercase tracking-[1em]">No_Archives_Matched</div>}
              </div>
            )}

            {activeDrawer === 'symbols' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {filteredSymbols.map(sym => (
                   <div key={sym.id} onClick={() => { setSelectedItem(sym); setAnalysisText(''); }} className="bg-[#050505] border border-white/5 rounded-[4rem] p-12 space-y-10 hover:border-amber-500/40 transition-all cursor-pointer group shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-600/20 group-hover:bg-amber-500 transition-all"></div>
                      <div className="text-[10rem] text-white text-center font-serif group-hover:scale-110 transition-transform h-40 flex items-center justify-center drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                         {sym.glyph}
                      </div>
                      <div className="space-y-4">
                         <h3 className="text-4xl font-black text-white group-hover:text-amber-500 transition-colors">{sym.name}</h3>
                         <p className="text-lg text-slate-400 leading-relaxed italic border-r-2 border-amber-600/20 pr-6 line-clamp-2">"{sym.meaning}"</p>
                      </div>
                      <button className="w-full py-5 bg-white/5 border border-white/10 rounded-[2rem] text-[10px] font-black text-slate-500 group-hover:bg-amber-600 group-hover:text-black transition-all uppercase tracking-[0.2em]">Deep_Inspect_Symbol</button>
                   </div>
                 ))}
              </div>
            )}

            {/* Fixed: Use 'activeDrawer' instead of undefined 'activeTab' to control the investigation view display. */}
            {(activeDrawer === 'network' && externalInvestigation) && (
              <div className="animate-fadeIn space-y-12">
                 {/* The Sovereign Browser Frame */}
                 <div className="bg-[#0a0a0a] border border-blue-500/30 rounded-[5rem] shadow-[0_0_150px_rgba(37,99,235,0.1)] overflow-hidden flex flex-col h-[850px]">
                    
                    {/* Browser UI Header */}
                    <div className="bg-[#151515] p-8 border-b border-white/5 flex items-center justify-between">
                       <div className="flex gap-6 items-center">
                          <div className="flex gap-2">
                             <div className="w-4 h-4 rounded-full bg-red-500/40 hover:bg-red-500 cursor-pointer"></div>
                             <div className="w-4 h-4 rounded-full bg-yellow-500/40 hover:bg-yellow-500 cursor-pointer"></div>
                             <div className="w-4 h-4 rounded-full bg-green-500/40 hover:bg-green-500 cursor-pointer"></div>
                          </div>
                          <div className="flex bg-black/60 px-8 py-3 rounded-full border border-white/10 text-xs font-mono text-blue-400 w-[500px] items-center gap-4 shadow-inner">
                             <span className="opacity-20">https://</span>
                             <span className="truncate">cosmic-browser.sarah.ultra/investigate?q={encodeURIComponent(activeQuery)}</span>
                             <span className="text-blue-800 ml-auto animate-pulse">🔒</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">External_Data_Retrieval</span>
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                       </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto no-scrollbar p-12 lg:p-24 flex flex-col lg:flex-row gap-20">
                       
                       {/* Result Content Area */}
                       <div className="flex-1 space-y-12 text-right">
                          <div className="space-y-4">
                             <h3 className="text-6xl font-black text-white leading-tight">ملخص التحقيق الاستخباراتي</h3>
                             <div className="flex gap-4 justify-end">
                                <span className="px-6 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Grounding_Verified</span>
                                <span className="px-6 py-2 bg-white/5 border border-white/10 text-slate-500 rounded-full text-[10px] font-black uppercase">Live_Net_Data</span>
                             </div>
                          </div>
                          
                          <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[4rem] text-3xl text-slate-200 leading-[1.8] italic font-medium shadow-inner relative group">
                             <div className="absolute top-10 right-10 text-blue-900 text-6xl opacity-20 group-hover:opacity-100 transition-opacity">“</div>
                             <div className="relative z-10 whitespace-pre-wrap">{externalInvestigation?.text}</div>
                             <div className="absolute bottom-10 left-10 text-blue-900 text-6xl opacity-20 group-hover:opacity-100 transition-opacity rotate-180">“</div>
                          </div>
                       </div>
                       
                       {/* Artifacts (Sources) Sidebar */}
                       <div className="lg:w-[450px] space-y-10">
                          <div className="flex items-center justify-between mr-4">
                             <h4 className="text-sm font-black text-blue-400 uppercase tracking-widest">المكتشفات (Discovered_Artifacts)</h4>
                             <span className="text-[10px] text-slate-600 font-mono">COUNT: {externalInvestigation?.sources.length}</span>
                          </div>
                          
                          <div className="space-y-4 overflow-y-auto max-h-[500px] no-scrollbar pr-4">
                             {externalInvestigation?.sources.map((s, i) => (
                               <a 
                                 key={i} 
                                 href={s.uri} 
                                 target="_blank" 
                                 rel="noopener noreferrer" 
                                 className="block p-8 bg-black/60 border border-white/5 rounded-[3rem] hover:border-blue-500 hover:bg-blue-600/5 transition-all group shadow-xl"
                               >
                                  <div className="flex justify-between items-center mb-4">
                                     <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-blue-50 group-hover:text-white transition-all">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                     </div>
                                     <span className="text-[9px] font-black text-slate-600 uppercase group-hover:text-blue-400 transition-colors">Extracted_Link_{i+1}</span>
                                  </div>
                                  <div className="text-lg font-black text-slate-200 truncate group-hover:text-white transition-colors">{s.title}</div>
                               </a>
                             ))}
                          </div>
                       </div>
                    </div>
                    
                    {/* Browser Footer Actions */}
                    <div className="p-10 bg-white/[0.02] border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                       <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.4em]">Sarah_Cosmic_Browser // End_of_Report</p>
                       <div className="flex gap-4">
                          <button onClick={() => { setExternalInvestigation(null); setActiveDrawer('books'); }} className="px-10 py-4 bg-white/5 border border-white/10 text-slate-500 rounded-2xl text-[10px] font-black uppercase hover:bg-red-600/20 hover:text-red-500 transition-all">إغلاق التحقيق الجاري</button>
                          <button onClick={() => alert('تم النسخ للذاكرة الملكية')} className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-2xl hover:bg-blue-500">نسخ كامل التقرير للذاكرة</button>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Deep Inspection & Memory Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 lg:p-20 animate-fadeIn font-arabic">
           <div className="bg-[#0c051a] w-full max-w-7xl h-full rounded-[5rem] border border-blue-500/20 flex flex-col shadow-[0_0_150px_rgba(37,99,235,0.2)] overflow-hidden">
              
              {/* Modal Header */}
              <div className="px-16 py-12 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                 <div className="flex items-center gap-10">
                    <div className="w-20 h-20 bg-blue-600/10 rounded-[2.5rem] border border-blue-500/30 flex items-center justify-center text-5xl shadow-2xl">
                       {'glyph' in selectedItem ? (selectedItem as SymbolEntry).glyph : (selectedItem as BookEntry).coverIcon}
                    </div>
                    <div>
                       <h3 className="text-5xl font-black text-white">{'glyph' in selectedItem ? (selectedItem as SymbolEntry).name : (selectedItem as BookEntry).title}</h3>
                       <p className="text-blue-500 font-mono text-[11px] uppercase tracking-[0.5em] mt-2">
                         {'glyph' in selectedItem ? 'Ancient_Symbol_Registry' : 'Grand_Archive_Volume'}
                       </p>
                    </div>
                 </div>
                 <button 
                   onClick={() => { setSelectedItem(null); setAnalysisText(''); }} 
                   className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-red-600 transition-all text-2xl"
                 >✕</button>
              </div>

              {/* Modal Content Scrollable */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-16 lg:p-24 flex flex-col lg:flex-row gap-24">
                 
                 {/* Original Record Information */}
                 <div className="flex-1 space-y-12 text-right">
                    <div>
                       <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-6">المحتوى الأصلي في السجل</h4>
                       <p className="text-4xl text-slate-100 leading-relaxed font-medium italic border-r-8 border-blue-600 pr-12">
                          "{'glyph' in selectedItem ? (selectedItem as SymbolEntry).meaning : (selectedItem as BookEntry).description}"
                       </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                       <div className="p-8 bg-white/5 rounded-[3rem] border border-white/5 shadow-inner">
                          <span className="text-[10px] font-black text-slate-600 uppercase block mb-4">Origin / Author</span>
                          <span className="text-2xl font-black text-white">{'glyph' in selectedItem ? (selectedItem as SymbolEntry).origin : (selectedItem as BookEntry).author}</span>
                       </div>
                       <div className="p-8 bg-white/5 rounded-[3rem] border border-white/5 shadow-inner">
                          <span className="text-[10px] font-black text-slate-600 uppercase block mb-4">Era / Category</span>
                          <span className="text-2xl font-black text-white">{'glyph' in selectedItem ? (selectedItem as SymbolEntry).category : (selectedItem as BookEntry).era}</span>
                       </div>
                    </div>
                 </div>

                 {/* Neural Analysis Panel */}
                 <div className="lg:w-[500px] flex flex-col gap-8">
                    <div className="bg-blue-600/5 border border-blue-500/20 p-10 rounded-[4rem] flex-1 flex flex-col shadow-2xl relative">
                       <div className="absolute top-0 right-0 w-2 h-full bg-blue-600/30"></div>
                       <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                          <span>🔮</span> Deep_Neural_Inspection
                       </h4>
                       
                       <div className="flex-1 overflow-y-auto no-scrollbar font-medium text-lg text-slate-300 leading-relaxed bg-black/40 p-8 rounded-[3rem] border border-white/5 min-h-[350px]">
                          {analysisText ? (
                             <div className="whitespace-pre-wrap animate-fadeIn text-right">{analysisText}</div>
                          ) : isAnalyzing ? (
                             <div className="flex flex-col items-center justify-center h-full gap-8 text-blue-400 animate-pulse">
                                <div className="text-7xl">✨</div>
                                <p className="text-xs font-black uppercase tracking-widest text-center">Consulting_Ancient_Neural_Nodes...</p>
                             </div>
                          ) : (
                             <div className="flex flex-col items-center justify-center h-full gap-8 text-slate-700 opacity-40">
                                <div className="text-7xl">📜</div>
                                <p className="text-xs font-black uppercase tracking-widest">Inspection_Pending</p>
                             </div>
                          )}
                       </div>

                       <button 
                         onClick={handleDeepInspect}
                         disabled={isAnalyzing}
                         className="w-full mt-8 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-lg uppercase shadow-[0_0_50px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-all disabled:opacity-50"
                       >
                         {isAnalyzing ? 'Analyzing...' : 'بدء التحقيق العميق 🧠'}
                       </button>
                    </div>

                    <button 
                      onClick={() => { navigator.clipboard.writeText(JSON.stringify(selectedItem)); alert('تم نسخ المحتوى لذاكرة الأرشيف.'); }}
                      className="w-full py-7 bg-white text-black rounded-[2.5rem] font-black text-xl hover:bg-blue-600 hover:text-white transition-all shadow-3xl flex items-center justify-center gap-4 group"
                    >
                       <span>نسخ المحتوى للذاكرة</span>
                       <svg className="w-8 h-8 group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes scanline { 0% { left: -100%; } 100% { left: 100%; } }
        .animate-scanline { animation: scanline 2.5s linear infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};
