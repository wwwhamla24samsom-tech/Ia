
import React, { useState, useEffect } from 'react';
import { searchDigitalLibrary } from '../services/geminiService';
import { Language, SearchSource } from '../types';

interface Book {
  title: string;
  author: string;
  summary: string;
  icon: string;
  category?: string;
  tier?: string;
}

interface DigitalLibraryProps {
  language: Language;
}

export const DigitalLibrary: React.FC<DigitalLibraryProps> = ({ language }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [sources, setSources] = useState<SearchSource[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const parseBooks = (text: string): Book[] => {
    const bookRegex = /\[BOOK\]([\s\S]*?)\[\/BOOK\]/g;
    const matches = [...text.matchAll(bookRegex)];
    
    return matches.map(match => {
      const content = match[1];
      const title = content.match(/Title:\s*(.*)/)?.[1] || "Prime Knowledge";
      const author = content.match(/Author:\s*(.*)/)?.[1] || "Sarah V7 Archive";
      const summary = content.match(/Summary:\s*([\s\S]*?)(?=Icon:|$)/)?.[1] || "";
      const icon = content.match(/Icon:\s*(.*)/)?.[1] || "💎";
      const category = content.match(/Category:\s*(.*)/)?.[1] || "Super-Knowledge";
      return { title, author, summary, icon, category };
    });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setBooks([]);
    setSelectedBook(null);
    try {
      const result = await searchDigitalLibrary(query, language);
      const parsed = parseBooks(result.text);
      if (parsed.length > 0) {
        setBooks(parsed);
      } else {
        setBooks([{ 
          title: "V7 Prime Insight", 
          author: "Neural Encyclopedia", 
          summary: result.text, 
          icon: "🧠",
          category: "Deep Logic"
        }]);
      }
      setSources(result.sources);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-full min-h-screen transition-all duration-1000 font-serif ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-[#fafafa] text-black'}`}>
      
      {/* Prime Header Dashboard */}
      <div className="sticky top-0 z-40 flex justify-between items-center px-12 py-6 border-b border-white/5 backdrop-blur-3xl bg-opacity-90">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl shadow-[0_0_20px_rgba(37,99,235,0.4)]">📖</div>
          <div className="flex flex-col">
            <span className="text-xl font-black uppercase tracking-[0.2em]">Encyclopedia_V7</span>
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.5em] mt-1">Global_Archives: 100TB_LOADED</span>
          </div>
        </div>
        <div className="flex gap-5">
          {selectedBook && (
            <button 
              onClick={() => setSelectedBook(null)}
              className="px-8 py-2.5 border-2 border-current rounded-full font-black text-[10px] uppercase hover:bg-current hover:text-inherit transition-all"
            >
              Back_To_Stacks
            </button>
          )}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="px-8 py-2.5 bg-current text-inherit rounded-full font-black text-[10px] uppercase hover:opacity-80 transition-all border-2 border-transparent shadow-xl"
          >
            {isDarkMode ? 'Day_Light_Mode' : 'Stealth_Archive_Mode'}
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-10 py-16 space-y-20">
        {!selectedBook ? (
          <>
            {/* Massive Search Interface */}
            <section className="space-y-12 max-w-4xl mx-auto text-right">
              <div className="space-y-4">
                 <h2 className="text-7xl md:text-8xl font-black tracking-tighter leading-none">الموسوعة <span className="text-blue-600">العالمية</span></h2>
                 <p className="text-slate-500 text-xl font-medium">أكبر أرشيف بشري لعلوم البرمجة، التشفير الفائق، وابتكار الأنظمة (Google, Apple, Microsoft).</p>
              </div>
              
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ابحث في 100 تيرابايت من المعرفة التقنية..."
                  className={`w-full bg-transparent border-b-8 border-current py-10 px-6 text-4xl md:text-5xl font-black focus:outline-none placeholder-current placeholder-opacity-5 text-right transition-all focus:border-blue-600`}
                />
                <div className="flex justify-between items-center mt-6">
                   <div className="flex gap-4">
                      {['البرمجة العميقة', 'تشفير V7', 'أنظمة Apple', 'نواة Google'].map(hint => (
                        <button key={hint} onClick={() => setQuery(hint)} className="text-[10px] font-black uppercase tracking-widest text-blue-500 border border-blue-500/20 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all">{hint}</button>
                      ))}
                   </div>
                   <button 
                    type="submit" 
                    disabled={loading}
                    className="px-16 py-5 bg-blue-600 text-white rounded-full font-black text-xl uppercase tracking-widest transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)] active:scale-95 disabled:opacity-50"
                  >
                    {loading ? 'TUNNELING...' : 'ACCESS_KNOWLEDGE'}
                  </button>
                </div>
              </form>
            </section>

            {/* Encyclopedic Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pt-10">
              {books.map((book, i) => (
                <div 
                  key={i}
                  onClick={() => setSelectedBook(book)}
                  className="group cursor-pointer border-4 border-current p-0 flex flex-col h-full hover:bg-current hover:text-inherit transition-all duration-500 rounded-[3rem] overflow-hidden hover:-translate-y-4"
                >
                  <div className="aspect-[4/5] border-b-4 border-current flex items-center justify-center text-9xl grayscale-0 group-hover:grayscale transition-all bg-current bg-opacity-5 relative overflow-hidden">
                    <div className="absolute top-6 right-8 text-[10px] font-black text-blue-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">V7_Encoded_Vol</div>
                    <span className="group-hover:scale-125 transition-transform duration-700">{book.icon}</span>
                  </div>
                  <div className="p-10 flex flex-col flex-1 text-right gap-4">
                    <div className="flex justify-between items-center">
                       <span className="bg-blue-600/10 text-blue-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase">{book.category}</span>
                    </div>
                    <h3 className="text-3xl font-black mb-2 leading-tight">{book.title}</h3>
                    <p className="text-sm font-bold opacity-60 line-clamp-3 leading-relaxed">{book.summary}</p>
                    <div className="mt-auto pt-8 border-t border-current border-opacity-10 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                      <span className="text-[11px] font-black uppercase tracking-widest underline decoration-2 underline-offset-8">Read_Volume_Prime</span>
                      <span className="text-2xl">→</span>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {loading && (
              <div className="py-40 flex flex-col items-center gap-8">
                <div className="w-32 h-1 bg-blue-600 animate-pulse shadow-[0_0_20px_blue]"></div>
                <p className="font-black uppercase tracking-[0.8em] text-sm text-blue-500 animate-pulse">Pulling_From_100TB_Stacks</p>
              </div>
            )}

            {!loading && books.length === 0 && (
              <div className="py-40 text-center opacity-10 select-none pointer-events-none">
                <div className="text-[18rem] font-black leading-none tracking-tighter">PRIME</div>
                <p className="text-2xl font-bold uppercase tracking-[2em] mt-8">Archives_Ready</p>
              </div>
            )}
          </>
        ) : (
          /* Reader View - Encyclopedic Style */
          <article className="animate-fadeIn max-w-5xl mx-auto space-y-16">
            <header className="flex flex-col md:flex-row gap-16 items-start text-right">
              <div className="w-full md:w-2/5 aspect-[3/4] border-8 border-current rounded-[4rem] flex items-center justify-center text-[12rem] bg-current bg-opacity-5 shrink-0 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {selectedBook.icon}
              </div>
              <div className="flex-1 space-y-10 pt-10">
                <div className="space-y-4">
                  <div className="flex gap-4 justify-end">
                    <span className="bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">Omega_Prime_Tier</span>
                    <span className="bg-current text-inherit px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-current border-opacity-20">{selectedBook.category}</span>
                  </div>
                  <h2 className="text-7xl md:text-8xl font-black tracking-tighter leading-none">{selectedBook.title}</h2>
                  <p className="text-3xl font-bold opacity-40">{selectedBook.author}</p>
                </div>
                
                <div className="flex gap-6 justify-end pt-10">
                  <button className="px-10 py-4 border-4 border-current rounded-full font-black text-xs uppercase tracking-widest hover:bg-current hover:text-inherit transition-all">Download_Archive</button>
                  <button className="px-10 py-4 bg-blue-600 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/40">Inject_To_Brain</button>
                </div>
              </div>
            </header>

            <div className={`prose prose-2xl max-w-none text-right border-t-[12px] border-current pt-20 transition-all ${isDarkMode ? 'prose-invert' : ''}`}>
              <div className="whitespace-pre-wrap leading-[1.6] text-4xl font-medium opacity-90 first-letter:text-8xl first-letter:font-black first-letter:text-blue-600">
                {selectedBook.summary}
              </div>
            </div>

            {sources.length > 0 && (
              <div className="pt-32 border-t-4 border-current border-opacity-10">
                <h3 className="text-sm font-black uppercase tracking-[0.5em] mb-10 opacity-30">Grounding_Verification_Matrix</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {sources.map((source, i) => (
                    <a 
                      key={i} 
                      href={source.uri} 
                      target="_blank" 
                      className="p-8 border-4 border-current border-opacity-10 hover:border-blue-600 hover:text-blue-600 transition-all flex justify-between items-center group rounded-[2.5rem]"
                    >
                      <span className="text-sm font-black truncate max-w-[85%]">{source.title}</span>
                      <span className="text-2xl opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-4">→</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </article>
        )}
      </main>

      <footer className="p-12 border-t border-current border-opacity-5 text-center opacity-20 text-[11px] font-black uppercase tracking-[1em]">
        Sarah_ULTRA_V7 // Universal_Encyclopedia_Protocol // 200TB_Total_Hybrid_Memory
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        ::-moz-selection { background: #3b82f6; color: white; }
        ::selection { background: #3b82f6; color: white; }
      `}</style>
    </div>
  );
};
