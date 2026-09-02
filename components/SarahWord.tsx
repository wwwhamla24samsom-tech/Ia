
import React, { useState, useRef, useEffect } from 'react';
import { improveLinguisticSkills, analyzeAndSuggestWriting } from '../services/geminiService';
import { Language, WritingAnalysis, SovereignDocument } from '../types';

export const SarahWord: React.FC<{ language: Language; onExit: () => void }> = ({ language, onExit }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('مستند جديد');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState<WritingAnalysis | null>(null);
  const [showArchivePicker, setShowArchivePicker] = useState(false);
  const [archive, setArchive] = useState<SovereignDocument[]>([]);
  
  // Text Styling State
  const [fontSize, setFontSize] = useState(18);
  const [textAlign, setTextAlign] = useState<'right' | 'center' | 'left'>('right');
  const [isBold, setIsBold] = useState(false);
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedContent = localStorage.getItem('sarah_word_content');
    if (savedContent) setContent(savedContent);
    
    const savedArchive = localStorage.getItem('sarah_sovereign_archive');
    if (savedArchive) setArchive(JSON.parse(savedArchive));

    editorRef.current?.focus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (content) {
        localStorage.setItem('sarah_word_content', content);
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1200);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [content]);

  const importFromArchive = (doc: SovereignDocument) => {
    setContent(doc.content);
    setTitle(doc.title);
    setShowArchivePicker(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setContent(text);
        setTitle(file.name.split('.')[0]);
      }
    };
    reader.readAsText(file);
  };

  const insertFormat = (char: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = `${before}${char}${selection}${char}${after}`;
    setContent(newText);
    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + char.length, end + char.length);
    }, 0);
  };

  const handleDeepAnalysis = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const data = await analyzeAndSuggestWriting(content, language);
      setAnalysis(data);
      setShowAnalysis(true);
    } catch (err) {
      alert('فشل تحليل المخطوطة سيادياً.');
    } finally {
      setLoading(false);
    }
  };

  const refineText = async (mode: 'general' | 'tech' | 'creative' | 'formal') => {
    if (!content.trim() || loading) return;
    setLoading(true);
    try {
      let promptPrefix = '';
      switch(mode) {
          case 'tech': promptPrefix = 'أعد صياغة النص بأسلوب تقني دقيق ومحترف: '; break;
          case 'creative': promptPrefix = 'أعد صياغة النص بأسلوب أدبي إبداعي وجذاب: '; break;
          case 'formal': promptPrefix = 'حول النص إلى خطاب رسمي مؤسسي: '; break;
          default: promptPrefix = 'حسن صياغة النص وتصحيح الأخطاء: ';
      }
      const improved = await improveLinguisticSkills(promptPrefix + content, language);
      setContent(improved);
    } catch (err) {
      alert('حدث خطأ في معالجة النص.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1500] bg-[#fdfdfd] flex flex-col font-arabic text-slate-900 animate-fadeIn h-full w-full">
      
      {/* Top Bar */}
      <header className="h-16 px-6 border-b border-slate-200 bg-white flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
           <button 
             onClick={onExit}
             className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
           <div className="h-6 w-px bg-slate-200 mx-2"></div>
           <div className="flex flex-col">
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent border-none p-0 text-sm font-bold text-slate-800 focus:ring-0 placeholder:text-slate-300 w-64"
                placeholder="عنوان المستند..."
              />
              <div className="flex items-center gap-2">
                 <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest">Primary_Word_Core_v2.0</span>
                 <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                 <span className="text-[10px] text-slate-400 font-medium">{isSaving ? 'جاري الحفظ...' : 'تم الحفظ'}</span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={() => setShowArchivePicker(!showArchivePicker)}
             className="px-5 py-2 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold hover:bg-amber-100 transition-all flex items-center gap-2"
           >
             استيراد من الأرشيف 🏛️
           </button>
           <button 
             onClick={handleDeepAnalysis}
             disabled={loading}
             className="px-5 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all flex items-center gap-2"
           >
             {loading ? '...' : 'تحليل ذكي 🧠'}
           </button>
           <button 
             onClick={() => refineText('general')}
             disabled={loading}
             className="px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg"
           >
             {loading ? '...' : 'تحسين الصياغة ✨'}
           </button>
        </div>
      </header>

      {/* Formatting Toolbar */}
      <div className="h-14 px-6 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm overflow-x-auto no-scrollbar">
         <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 pr-4 border-l border-slate-200 ml-4 pl-1">
               <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
               </button>
               <input type="file" ref={fileInputRef} className="hidden" accept=".txt,.md,.json,.js,.py,.doc,.docx" onChange={handleFileUpload} />
               <button onClick={() => {navigator.clipboard.writeText(content); alert('تم النسخ');}} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
               </button>
            </div>

            <div className="flex items-center bg-slate-100 rounded-lg px-2 py-1 gap-2 mr-2">
               <button onClick={() => setFontSize(s => Math.max(12, s - 1))} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded text-slate-600">-</button>
               <span className="text-xs font-bold text-slate-800 w-4 text-center">{fontSize}</span>
               <button onClick={() => setFontSize(s => Math.min(48, s + 1))} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded text-slate-600">+</button>
            </div>

            <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-1 mr-2">
               <button onClick={() => setTextAlign('right')} className={`p-1.5 rounded ${textAlign === 'right' ? 'bg-white shadow-sm text-black' : 'text-slate-500'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg></button>
               <button onClick={() => setTextAlign('center')} className={`p-1.5 rounded ${textAlign === 'center' ? 'bg-white shadow-sm text-black' : 'text-slate-500'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M7 12h10M7 18h10" /></svg></button>
               <button onClick={() => setTextAlign('left')} className={`p-1.5 rounded ${textAlign === 'left' ? 'bg-white shadow-sm text-black' : 'text-slate-500'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10M4 18h7" /></svg></button>
            </div>
         </div>
      </div>

      <main className="flex-1 flex relative overflow-hidden bg-[#f4f7f9]">
        
        {/* Archive Picker Overlay */}
        {showArchivePicker && (
          <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-12">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-4xl p-10 flex flex-col h-[600px]">
               <div className="flex justify-between items-center mb-8">
                  <button onClick={() => setShowArchivePicker(false)} className="text-slate-400 hover:text-red-500">✕</button>
                  <h3 className="text-2xl font-black">اختر وثيقة من الأرشيف السيادي</h3>
               </div>
               <div className="flex-1 overflow-y-auto pr-4 space-y-4">
                  {archive.map(doc => (
                    <button key={doc.id} onClick={() => importFromArchive(doc)} className="w-full text-right p-6 rounded-3xl border border-slate-100 hover:border-amber-500 hover:bg-amber-50 transition-all group">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-[9px] font-black text-slate-400">{doc.type}</span>
                          <h4 className="font-black text-slate-800 group-hover:text-amber-700">{doc.title}</h4>
                       </div>
                       <p className="text-xs text-slate-500 line-clamp-1">{doc.content.substring(0, 100)}...</p>
                    </button>
                  ))}
                  {archive.length === 0 && <p className="text-center py-20 text-slate-400">الأرشيف فارغ حالياً.</p>}
               </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto no-scrollbar py-12 px-4 flex justify-center" onClick={() => editorRef.current?.focus()}>
           <div className="w-full max-w-[850px] bg-white min-h-[1100px] shadow-2xl border border-slate-200 p-16 lg:p-24 transition-all">
              <textarea 
                ref={editorRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="ابدأ الكتابة هنا..."
                className="w-full h-full bg-transparent border-none focus:ring-0 resize-none outline-none text-slate-900 placeholder:text-slate-200 leading-[1.8] overflow-hidden"
                style={{ fontSize: `${fontSize}px`, textAlign: textAlign, fontWeight: isBold ? 'bold' : 'normal', minHeight: '1000px' }}
                spellCheck={false}
              />
           </div>
        </div>

        {showAnalysis && analysis && (
          <div className="absolute top-0 right-0 h-full w-80 bg-white border-r border-slate-200 shadow-2xl p-8 overflow-y-auto animate-slideInRight z-40">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">تحليل صارة النوروني</h3>
                <button onClick={() => setShowAnalysis(false)} className="text-slate-400 hover:text-red-500">✕</button>
             </div>
             <div className="space-y-8">
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                   <div className="flex justify-between text-xs font-bold text-blue-800 mb-2">
                      <span>جودة القراءة</span>
                      <span>{analysis.readability}%</span>
                   </div>
                   <div className="h-1.5 bg-blue-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600" style={{ width: `${analysis.readability}%` }}></div>
                   </div>
                </div>
                <div>
                   <h4 className="text-[10px] font-black text-slate-400 uppercase mb-3">النبرة (Tone)</h4>
                   <p className="text-sm font-bold text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100">{analysis.tone}</p>
                </div>
                <div>
                   <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4">الاقتراحات</h4>
                   <div className="space-y-3">
                      {analysis.suggestions.map((s, i) => (
                        <div key={i} className="p-4 bg-white border border-slate-100 rounded-xl text-xs text-slate-600 shadow-sm hover:border-blue-400 transition-all cursor-pointer">
                           {s.text}
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}
      </main>

      <footer className="h-10 bg-white border-t border-slate-100 px-8 flex items-center justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest">
         <div className="flex gap-8">
            <span>WORDS: {content.split(/\s+/).filter(w => w).length}</span>
            <span>CHARS: {content.length}</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
            <span>Sarah_Word_Core_Online</span>
         </div>
      </footer>
    </div>
  );
};
