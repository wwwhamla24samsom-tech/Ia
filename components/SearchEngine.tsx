import React, { useState, useEffect } from 'react';
import { callHyperSearch } from '../services/geminiService';
import { Language, SearchSource } from '../types';
import { Mic, Paperclip, X, Check, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SearchEngine: React.FC<{ language: Language }> = ({ language }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchStep, setSearchStep] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [sources, setSources] = useState<SearchSource[]>([]);
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [textToConfirm, setTextToConfirm] = useState('');

  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const searchSteps = [
    "تهيئة الاتصال...",
    "مسح الشبكة العالمية...",
    "تحليل البيانات...",
    "توليد النتائج..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setSearchStep(0);
      interval = setInterval(() => {
        setSearchStep(prev => (prev < searchSteps.length - 1 ? prev + 1 : prev));
      }, 800);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Typing effect for result
  useEffect(() => {
    if (!result) {
      setDisplayedText('');
      return;
    }

    setIsTyping(true);
    let currentIdx = 0;
    
    const interval = setInterval(() => {
      currentIdx += Math.ceil((result.length - currentIdx) * 0.1) + 5;
      if (currentIdx > result.length) {
        setDisplayedText(result);
        setIsTyping(false);
        clearInterval(interval);
      } else {
        setDisplayedText(result.substring(0, currentIdx));
      }
    }, 20);

    return () => clearInterval(interval);
  }, [result]);

  const requestSearchConfirm = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const activeQuery = customQuery || query;
    if (!activeQuery.trim()) return;
    
    setTextToConfirm(activeQuery);
    setShowConfirmModal(true);
  };

  const handleConfirmedSearch = async () => {
    setShowConfirmModal(false);
    setQuery(textToConfirm);
    setLoading(true);
    setResult(null);
    setSources([]);

    try {
      const { text, sources } = await callHyperSearch(textToConfirm, language);
      setResult(text);
      setSources(sources);
    } catch (err) {
      console.error(err);
      setResult("❌ خطأ في الارتباط الفائق: النواة لم تستجب.");
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      if (!line) return <div key={idx} className="h-2 md:h-4"></div>;
      if (line.startsWith('### ')) return <h3 key={idx} className="text-xl md:text-2xl font-black mt-6 md:mt-8 mb-3 md:mb-4">{line.substring(4)}</h3>;
      if (line.startsWith('## ')) return <h2 key={idx} className="text-2xl md:text-3xl font-black mt-8 md:mt-10 mb-4 md:mb-6 border-r-4 md:border-r-8 border-black pr-3 md:pr-4">{line.substring(3)}</h2>;
      if (line.startsWith('# ')) return <h1 key={idx} className="text-3xl md:text-4xl font-black mt-10 md:mt-12 mb-6 md:mb-8 border-b-2 md:border-b-4 border-black pb-2 md:pb-4">{line.substring(2)}</h1>;
      if (line.startsWith('* ') || line.startsWith('- ')) return (
        <div key={idx} className="flex items-start gap-3 md:gap-4 pr-2 md:pr-4 py-1 md:py-2">
          <span className="text-black mt-1.5 md:mt-2 text-[8px] md:text-[10px]">⬛</span>
          <span className="flex-1 text-base md:text-xl font-medium leading-relaxed">{line.substring(2)}</span>
        </div>
      );
      
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} className="text-base md:text-xl font-medium leading-relaxed mb-3 md:mb-4">
          {parts.map((part, pIdx) => 
            part?.startsWith('**') && part?.endsWith('**') 
            ? <strong key={pIdx} className="font-black bg-black text-white px-1.5 md:px-2 py-0.5 md:py-1 mx-1">{part.slice(2, -2)}</strong> 
            : part
          )}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-white text-black font-arabic overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 md:p-6 border-b-2 md:border-b-4 border-black flex justify-between items-center bg-white relative z-10">
        <div className="flex items-center gap-3 md:gap-6">
          <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase">
            البحث <span className="text-black/30">العميق</span>
          </h1>
          <span className="px-2 py-1 md:px-4 md:py-1 border border-black md:border-2 text-[8px] md:text-xs font-black uppercase tracking-widest hidden sm:inline-block">V.12_CORE</span>
        </div>
        <div className="flex gap-2 md:gap-4">
          <button className="p-2 md:p-4 border-2 md:border-4 border-black hover:bg-black hover:text-white transition-colors group relative">
            <Mic className="w-5 h-5 md:w-6 md:h-6" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">صوت</span>
          </button>
          <button className="p-2 md:p-4 border-2 md:border-4 border-black hover:bg-black hover:text-white transition-colors group relative">
            <Paperclip className="w-5 h-5 md:w-6 md:h-6" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">ملف</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Results Area */}
        <div className="flex-1 p-4 md:p-16 overflow-y-auto relative bg-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

          {loading ? (
             <div className="flex flex-col items-center justify-center h-full space-y-8 md:space-y-12 relative z-10">
                <div className="relative w-24 h-24 md:w-40 md:h-40">
                  <div className="absolute inset-0 border-4 md:border-8 border-black/10"></div>
                  <div className="absolute inset-0 border-t-4 md:border-t-8 border-black animate-spin"></div>
                  <div className="absolute inset-4 md:inset-8 border-4 md:border-8 border-black/10"></div>
                  <div className="absolute inset-4 md:inset-8 border-b-4 md:border-b-8 border-black animate-[spin_1.5s_linear_infinite_reverse]"></div>
                </div>
                <div className="text-center space-y-4 md:space-y-6">
                  <h3 className="text-xl md:text-4xl font-black uppercase tracking-widest animate-pulse">
                    {searchSteps[searchStep]}
                  </h3>
                  <div className="w-40 md:w-64 h-1 md:h-2 bg-black/10 mx-auto overflow-hidden">
                    <div 
                      className="h-full bg-black transition-all duration-300 ease-out"
                      style={{ width: `${((searchStep + 1) / searchSteps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
             </div>
          ) : result ? (
            <div className="space-y-8 md:space-y-16 max-w-5xl mx-auto relative z-10">
               <div className="p-6 md:p-16 border-2 md:border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] md:shadow-[16px_16px_0_0_rgba(0,0,0,1)]">
                 <div className="border-b-2 md:border-b-4 border-black pb-4 md:pb-8 mb-6 md:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                   <h2 className="text-3xl md:text-5xl font-black">النتيجة</h2>
                   <span className="text-xs md:text-xl font-black text-black/40 uppercase tracking-widest">SARA_RESPONSE</span>
                 </div>
                 <div className="text-black">
                   {renderFormattedText(displayedText)}
                   {isTyping && <span className="inline-block w-3 h-6 md:w-4 md:h-8 bg-black animate-pulse mr-2 align-middle"></span>}
                 </div>
               </div>
               
               {sources.length > 0 && (
                 <div className="space-y-4 md:space-y-6">
                    <h3 className="text-lg md:text-2xl font-black uppercase tracking-widest border-b-2 md:border-b-4 border-black pb-2 md:pb-4 inline-block">المصادر المرجعية</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {sources.map((s, i) => (
                        <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="p-4 md:p-6 border-2 md:border-4 border-black bg-white hover:bg-black hover:text-white transition-colors flex justify-between items-center group font-bold shadow-[4px_4px_0_0_rgba(0,0,0,1)] md:shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] md:hover:translate-x-[8px] md:hover:translate-y-[8px]">
                           <span className="truncate max-w-[80%] text-sm md:text-xl">{s.title}</span>
                           <span className="text-xl md:text-2xl">↗</span>
                        </a>
                      ))}
                    </div>
                 </div>
               )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center opacity-10 relative z-10">
              <div className="text-center">
                <Search className="w-24 h-24 md:w-48 md:h-48 mx-auto mb-6 md:mb-12" />
                <h2 className="text-4xl md:text-8xl font-black tracking-tighter">جاهز للبحث</h2>
              </div>
            </div>
          )}
        </div>

        {/* Horizontal Input Area (Bottom) */}
        <div className="border-t-2 md:border-t-4 border-black bg-gray-50 flex items-center justify-between p-4 md:p-8 z-10 shrink-0 gap-4 md:gap-8">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="اكتب للبحث العميق..."
            className="flex-1 bg-transparent resize-none focus:outline-none text-2xl md:text-5xl font-black leading-relaxed text-black placeholder-black/20 h-16 md:h-24 pt-2 md:pt-4"
          />
          <button
            onClick={(e) => requestSearchConfirm(e as any)}
            disabled={loading || !query.trim()}
            className="w-16 h-16 md:w-24 md:h-24 shrink-0 rounded-full border-2 md:border-4 border-black bg-white text-black hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] md:shadow-[8px_8px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] md:active:translate-x-[8px] md:active:translate-y-[8px]"
          >
            <Search className="w-6 h-6 md:w-10 md:h-10" />
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-white/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              className="bg-white border-4 md:border-8 border-black p-6 md:p-12 max-w-3xl w-full shadow-[16px_16px_0_0_rgba(0,0,0,1)] md:shadow-[32px_32px_0_0_rgba(0,0,0,1)]"
            >
              <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-10 border-b-4 md:border-b-8 border-black pb-4 md:pb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-black text-white flex items-center justify-center rounded-full shrink-0">
                  <Search className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black">تأكيد النص</h2>
              </div>
              
              <div className="bg-gray-50 p-6 md:p-10 border-2 md:border-4 border-black mb-8 md:mb-12 max-h-60 md:max-h-80 overflow-y-auto relative">
                <div className="absolute top-0 right-0 w-4 h-4 md:w-8 md:h-8 border-b-2 md:border-b-4 border-l-2 md:border-l-4 border-black"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 md:w-8 md:h-8 border-t-2 md:border-t-4 border-r-2 md:border-r-4 border-black"></div>
                <p className="text-xl md:text-3xl font-bold leading-relaxed">{textToConfirm}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 md:gap-8">
                <button 
                  onClick={handleConfirmedSearch}
                  className="flex-1 py-4 md:py-8 bg-black text-white font-black text-xl md:text-3xl flex items-center justify-center gap-2 md:gap-4 hover:bg-gray-800 transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] md:shadow-[8px_8px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] md:active:translate-x-[8px] md:active:translate-y-[8px]"
                >
                  <Check className="w-6 h-6 md:w-10 md:h-10" />
                  قبول
                </button>
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-4 md:py-8 bg-white text-black border-2 md:border-4 border-black font-black text-xl md:text-3xl flex items-center justify-center gap-2 md:gap-4 hover:bg-gray-100 transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,1)] md:shadow-[8px_8px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] md:active:translate-x-[8px] md:active:translate-y-[8px]"
                >
                  <X className="w-6 h-6 md:w-10 md:h-10" />
                  عدول
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
