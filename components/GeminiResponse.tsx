
import React, { useState, useEffect, useRef } from 'react';

interface GeminiResponseProps {
  content: string;
  title?: string;
  loading?: boolean;
  thoughtProcess?: string[];
  sources?: { title: string; uri: string }[];
}

const CodeWindow: React.FC<{ code: string; lang: string }> = ({ code, lang }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-8 rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#0d1117] shadow-4xl animate-page-reveal group">
      <div className="flex items-center justify-between px-8 py-4 bg-[#161b22] border-b border-white/5">
        <div className="flex gap-2.5">
          <div className="w-3.5 h-3.5 rounded-full bg-red-500/50 hover:bg-red-500 transition-colors"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/50 hover:bg-yellow-500 transition-colors"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-green-500/50 hover:bg-green-500 transition-colors"></div>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">{lang || 'CODE'}</span>
          <button 
            onClick={copy}
            className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all btn-interact ${copied ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
          >
            {copied ? 'تم النسخ' : 'نسخ الكود'}
          </button>
        </div>
      </div>
      <div className="p-8 overflow-x-auto no-scrollbar relative">
        <pre className="font-mono text-[14px] leading-relaxed text-blue-200 dir-ltr text-left selection:bg-blue-500/30">
          <code>{code.trim()}</code>
        </pre>
      </div>
    </div>
  );
};

export const GeminiResponse: React.FC<GeminiResponseProps> = ({ content, title, loading, thoughtProcess, sources }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (loading) {
      setDisplayedText('');
      return;
    }

    setIsTyping(true);
    let currentIdx = 0;
    
    // محرك الكتابة النبضي
    const interval = setInterval(() => {
      currentIdx += Math.ceil((content.length - currentIdx) * 0.1) + 15;
      if (currentIdx > content.length) {
        setDisplayedText(content);
        setIsTyping(false);
        clearInterval(interval);
      } else {
        setDisplayedText(content.substring(0, currentIdx));
      }
    }, 20);

    return () => clearInterval(interval);
  }, [content, loading]);

  const renderContent = (text: string) => {
    // التحقق من خطأ الحصة المخصص
    if (text.includes("CORE_QUOTA_EXHAUSTED")) {
      return (
        <div className="p-8 bg-amber-900/20 border border-amber-500/30 rounded-[3rem] text-center space-y-4 animate-pulse">
           <div className="text-6xl">⏳</div>
           <h4 className="text-2xl font-black text-amber-500 uppercase tracking-tighter">الحصة النورونية مستنفدة</h4>
           <p className="text-lg text-amber-100 font-medium">لقد أرسلت الكثير من الأوامر بسرعة كبيرة. صارة تحتاج لدقيقة من التأمل لاستعادة طاقتها.</p>
           <div className="text-[10px] font-mono text-amber-800 uppercase tracking-widest pt-4">Reason: API_RATE_LIMIT_429</div>
        </div>
      );
    }

    const segments = text.split(/(```[\s\S]*?```)/g);
    
    return segments.map((segment, i) => {
      if (segment?.startsWith('```')) {
        const match = segment.match(/```(\w+)?\n?([\s\S]*?)```/);
        return <CodeWindow key={i} code={match?.[2] || ''} lang={match?.[1] || 'code'} />;
      }

      return (
        <div key={i} className="text-slate-200 leading-relaxed space-y-8 animate-page-reveal">
          {segment.split('\n').map((line, idx) => {
            if (!line) return <div key={idx} className="h-4"></div>;
            
            if (line.startsWith('### ')) return <h3 key={idx} className="text-3xl font-black text-white mt-12 mb-6 tracking-tight">{line.substring(4)}</h3>;
            if (line.startsWith('## ')) return <h2 key={idx} className="text-4xl font-black text-blue-400 mt-16 mb-8 border-r-8 border-blue-600 pr-6 tracking-tighter">{line.substring(3)}</h2>;
            if (line.startsWith('* ') || line.startsWith('- ')) return (
              <div key={idx} className="flex items-start gap-5 pr-8 py-2 group hover:bg-white/5 rounded-2xl transition-all">
                <span className="text-blue-500 mt-2.5 text-[12px] animate-pulse">●</span>
                <span className="flex-1 text-xl text-slate-300 font-medium leading-relaxed">{line.substring(2)}</span>
              </div>
            );
            
            if (!line.trim()) return <div key={idx} className="h-4"></div>;

            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
              <p key={idx} className="text-2xl font-medium leading-relaxed">
                {parts.map((part, pIdx) => 
                  part?.startsWith('**') && part?.endsWith('**') 
                  ? <strong key={pIdx} className="text-white font-black drop-shadow-sm">{part.slice(2, -2)}</strong> 
                  : part
                )}
              </p>
            );
          })}
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="w-full space-y-10 p-16 text-right bg-white/[0.02] rounded-[4rem] border border-white/5 animate-pulse">
        <div className="flex items-center gap-8 justify-end">
          <div className="h-6 w-80 bg-white/10 rounded-full"></div>
          <div className="w-16 h-16 rounded-[2rem] border-8 border-blue-600 border-t-transparent animate-spin"></div>
        </div>
        <div className="space-y-8">
          <div className="h-8 w-full bg-white/5 rounded-3xl"></div>
          <div className="h-8 w-5/6 bg-white/5 rounded-3xl"></div>
          <div className="h-8 w-4/6 bg-white/5 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-16 animate-page-reveal text-right font-arabic p-16 bg-white/[0.03] rounded-[5rem] border border-white/5 shadow-4xl backdrop-blur-3xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-blue-500 via-transparent to-transparent"></div>
      <div className="flex flex-col gap-12">
        {title && (
          <div className="flex items-center gap-10 justify-end border-b border-white/5 pb-10">
             <h3 className="text-5xl font-black text-white tracking-tighter uppercase">{title}</h3>
             <div className="w-3 h-14 bg-blue-600 rounded-full shadow-[0_0_30px_#3b82f6]"></div>
          </div>
        )}
        
        <div className="text-slate-200">
          {renderContent(displayedText)}
          {isTyping && <span className="inline-block w-2 h-10 bg-blue-500 animate-pulse mr-3 align-middle shadow-[0_0_15px_#3b82f6]"></span>}
        </div>

        {sources && sources.length > 0 && (
          <div className="flex flex-wrap gap-5 justify-end pt-12 border-t border-white/5">
            {sources.map((source, i) => (
              <a 
                key={i} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-3 bg-white/5 border border-white/5 rounded-[1.5rem] text-xs font-black text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-2xl flex items-center gap-3 btn-interact"
              >
                {source.title} 
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
