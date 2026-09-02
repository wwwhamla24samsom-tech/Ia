import React, { useState, useEffect } from 'react';
import { callSystemCloner } from '../services/geminiService';
import { Language } from '../types';
import { Copy, Terminal, Code2, Cpu, Scan, Layers, ShieldCheck, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

export const SystemCloner: React.FC<{ language: Language }> = ({ language }) => {
  const [target, setTarget] = useState('');
  const [isCloning, setIsCloning] = useState(false);
  const [cloneStep, setCloneStep] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const steps = [
    "تهيئة خوارزميات التشكيل والتحليل...",
    "إجراء دراسة معمقة حول النظام المستهدف...",
    "تفكيك البنية المعمارية والمنطق البرمجي...",
    "تفعيل أنظمة صارة الداخلية للربط مع Gemini...",
    "تحويل المحاكاة إلى نسخة حقيقية قابلة للعمل...",
    "توليد الأكواد النهائية وتجميع الملفات..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCloning) {
      setCloneStep(0);
      interval = setInterval(() => {
        setCloneStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isCloning]);

  const handleClone = async () => {
    if (!target.trim()) return;
    setIsCloning(true);
    setResult(null);

    try {
      const clonedCode = await callSystemCloner(target, language);
      setResult(clonedCode);
    } catch (err) {
      console.error(err);
      setResult("❌ فشل الاستنساخ: حدث خطأ أثناء محاولة الاتصال بنواة Gemini.");
    } finally {
      setIsCloning(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-arabic p-8 relative overflow-hidden">
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        {/* Header */}
        <div className="flex items-center gap-6 border-b border-cyan-500/30 pb-8">
          <div className="w-20 h-20 bg-cyan-950 border border-cyan-500 rounded-2xl flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <Scan className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 uppercase tracking-tighter">
              مستنسخ الأنظمة (System Cloner)
            </h1>
            <p className="text-cyan-500/70 font-bold tracking-widest text-sm mt-2 uppercase">
              Real-World Code Generation & Architecture Analysis
            </p>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-black/40 border border-cyan-500/20 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          <div className="space-y-6">
            <label className="block text-xl font-bold text-cyan-400 flex items-center gap-3">
              <Layers className="w-6 h-6" />
              النظام المراد استنساخه (موقع، تطبيق، لعبة، أو فكرة برمجية):
            </label>
            <textarea
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="مثال: استنساخ لعبة Flappy Bird باستخدام HTML/Canvas، أو استنساخ واجهة تويتر..."
              className="w-full h-40 bg-cyan-950/20 border border-cyan-500/30 rounded-2xl p-6 text-xl text-white placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none"
            />
            <button
              onClick={handleClone}
              disabled={isCloning || !target.trim()}
              className="w-full py-6 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-2xl rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 shadow-[0_0_40px_rgba(6,182,212,0.4)]"
            >
              {isCloning ? (
                <>
                  <Cpu className="w-8 h-8 animate-spin" />
                  جاري الاستنساخ...
                </>
              ) : (
                <>
                  <Code2 className="w-8 h-8" />
                  بدء الاستنساخ والتحويل إلى نسخة حقيقية
                </>
              )}
            </button>
          </div>
        </div>

        {/* Processing State */}
        <AnimatePresence>
          {isCloning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-cyan-950/30 border border-cyan-500/40 p-10 rounded-3xl flex flex-col items-center justify-center space-y-8"
            >
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-t-4 border-cyan-400 rounded-full animate-spin"></div>
                <div className="absolute inset-4 border-4 border-blue-500/20 rounded-full"></div>
                <div className="absolute inset-4 border-b-4 border-blue-400 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
                <Scan className="absolute inset-0 m-auto w-10 h-10 text-cyan-400 animate-pulse" />
              </div>
              
              <div className="text-center space-y-4 w-full max-w-2xl">
                <h3 className="text-2xl font-bold text-cyan-300">
                  {steps[cloneStep]}
                </h3>
                <div className="w-full h-2 bg-cyan-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 ease-out"
                    style={{ width: `${((cloneStep + 1) / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        {result && !isCloning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0a0f16] border border-cyan-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.1)]"
          >
            <div className="bg-cyan-950/50 border-b border-cyan-500/30 p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
                <h2 className="text-2xl font-black text-white">النسخة الحقيقية (Real Version)</h2>
              </div>
              <button
                onClick={() => copyToClipboard(result)}
                className="px-6 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 rounded-xl flex items-center gap-3 transition-colors font-bold"
              >
                <Copy className="w-5 h-5" />
                نسخ الكود بالكامل
              </button>
            </div>
            
            <div className="p-8 prose prose-invert prose-cyan max-w-none">
              <div className="markdown-body bg-transparent text-gray-300">
                <ReactMarkdown
                  components={{
                    code({node, inline, className, children, ...props}: any) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline ? (
                        <div className="relative group my-6">
                          <div className="absolute top-0 right-0 bg-cyan-900/50 text-cyan-300 text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg border-b border-l border-cyan-500/30 font-mono">
                            {match?.[1] || 'code'}
                          </div>
                          <button
                            onClick={() => copyToClipboard(String(children))}
                            className="absolute top-2 left-2 p-2 bg-black/50 hover:bg-cyan-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            title="نسخ الكود"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <pre className="!bg-[#05080f] !border !border-cyan-500/20 !p-6 !rounded-xl overflow-x-auto" dir="ltr">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        </div>
                      ) : (
                        <code className="bg-cyan-900/30 text-cyan-300 px-1.5 py-0.5 rounded font-mono text-sm" {...props}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {result}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
