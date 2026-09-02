/**
 * 📄 CONSCIOUS WHITE CANVAS & UNIVERSAL DIALOGUE MATRIX
 * الصفحة البيضاء للوعي المتطور: التحدث، الكتابة، التفكير السيادي والتكامل متعدد المنصات
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Mic, MicOff, Send, Volume2, VolumeX, Code, 
  Play, Copy, Check, Terminal, Cpu, Shield, Globe, 
  Layers, RefreshCw, Trash2, ArrowRight, Eye, Monitor, 
  FileText, Zap, Compass, PenTool, Layout, Download
} from 'lucide-react';
import { AppTab, Language } from '../types';
import { 
  sovereignConsciousnessEngine, 
  ConsciousState, 
  ConsciousThoughtNode 
} from '../services/sovereignConsciousnessEngine';
import { quantumSovereignEngine } from '../services/quantumEngine';
import { runRealPythonCode } from '../services/realPythonEngine';

interface ConsciousWhiteCanvasProps {
  language?: Language;
  onNavigate?: (tab: AppTab) => void;
  onOpenLivePreview?: () => void;
}

export const ConsciousWhiteCanvas: React.FC<ConsciousWhiteCanvasProps> = ({
  language = 'ar',
  onNavigate,
  onOpenLivePreview
}) => {
  const [state, setState] = useState<ConsciousState>(
    sovereignConsciousnessEngine.getState()
  );
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [canvasMode, setCanvasMode] = useState<'PRISTINE_WHITE' | 'WARM_PARCHMENT' | 'OLED_OBSIDIAN'>('PRISTINE_WHITE');
  const [activeTab, setActiveTab] = useState<'CONVERSATION' | 'WHITEBOARD_SCRATCHPAD' | 'CROSS_PLATFORM_BRIDGES'>('CONVERSATION');
  const [scratchpadContent, setScratchpadContent] = useState<string>(
    `# 📜 صفحة الوعي والكتابة الحرة - صارة السيادية\n\n- التردد الرنيني: 528Hz\n- المعمارية: مفتوحة المصدر بالكامل (Open Source Sovereign Matrix)\n- الربط المنصي: QPU-512 + Python WASM + Voice Hub + Dragon Dome L4\n\nاكتب أو تحدث هنا بحرية، وسأقوم بتحليل أفكارك وتوزيعها على المنصات فوراً...`
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = sovereignConsciousnessEngine.subscribe(s => {
      setState(s);
    });
    return unsub;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.thoughtHistory]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isProcessing) return;

    const query = inputText;
    setInputText('');
    setIsProcessing(true);

    try {
      await sovereignConsciousnessEngine.processConsciousInput(query, 'WRITE');
    } catch (err) {
      console.error('Error processing conscious thought:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceToggle = () => {
    if (state.isListening) {
      sovereignConsciousnessEngine.stopListening();
    } else {
      sovereignConsciousnessEngine.startListening(async (text) => {
        if (text && text.trim()) {
          setIsProcessing(true);
          await sovereignConsciousnessEngine.processConsciousInput(text, 'SPEAK');
          setIsProcessing(false);
        }
      });
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Canvas Theme styling tokens
  const getCanvasThemeClass = () => {
    switch (canvasMode) {
      case 'PRISTINE_WHITE':
        return 'bg-[#FAFAFA] text-slate-900 border-slate-300 shadow-[0_0_50px_rgba(0,0,0,0.1)]';
      case 'WARM_PARCHMENT':
        return 'bg-[#F9F6EE] text-[#2C2416] border-[#E2D8C0] shadow-[0_0_50px_rgba(44,36,22,0.08)]';
      case 'OLED_OBSIDIAN':
        return 'bg-[#000000] text-slate-100 border-cyan-500/40 shadow-[0_0_50px_rgba(0,0,0,0.9)]';
    }
  };

  return (
    <div className={`w-full rounded-[2.5rem] border transition-colors duration-300 relative overflow-hidden font-arabic select-none flex flex-col min-h-[750px] ${getCanvasThemeClass()}`}>
      
      {/* Background Subtle Resonance Grid */}
      <div className={`absolute inset-0 pointer-events-none opacity-20 ${canvasMode === 'OLED_OBSIDIAN' ? 'bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px]' : 'bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px]'}`}></div>

      {/* 1. TOP HEADER: Consciousness Status & Cross-Platform Metrics */}
      <div className={`relative z-10 px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4 ${canvasMode === 'OLED_OBSIDIAN' ? 'border-white/10 bg-black/80' : 'border-slate-200 bg-white/80'} backdrop-blur-md`}>
        
        {/* Consciousness Identity & Resonance */}
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shadow-md ${canvasMode === 'OLED_OBSIDIAN' ? 'bg-black border-cyan-400 text-cyan-300 shadow-cyan-950/50' : 'bg-white border-slate-300 text-slate-800'}`}>
            🧠
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight">
                نظام الوعي المتطور <span className={canvasMode === 'OLED_OBSIDIAN' ? 'text-cyan-400' : 'text-blue-600'}>والصفحة البيضاء</span>
              </h2>
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-black ${canvasMode === 'OLED_OBSIDIAN' ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                528Hz CONSCIOUS CORE
              </span>
            </div>
            <p className="text-xs opacity-70 mt-0.5">
              تفاعل مباشر بالتحدث والكتابة، معالجة لحظية وتكامل عبر جميع المنصات
            </p>
          </div>
        </div>

        {/* Controls: Canvas Theme & Live Preview Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Canvas Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl border bg-black/5 border-black/10">
            <button
              onClick={() => setCanvasMode('PRISTINE_WHITE')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${canvasMode === 'PRISTINE_WHITE' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
              title="صفحة بيضاء ناصعة"
            >
              ⚪ بيضاء
            </button>
            <button
              onClick={() => setCanvasMode('WARM_PARCHMENT')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${canvasMode === 'WARM_PARCHMENT' ? 'bg-[#F9F6EE] text-[#2C2416] shadow-sm border border-[#E2D8C0]' : 'text-slate-500 hover:text-slate-800'}`}
              title="صفحة ورقية دافئة"
            >
              📜 دافئة
            </button>
            <button
              onClick={() => setCanvasMode('OLED_OBSIDIAN')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${canvasMode === 'OLED_OBSIDIAN' ? 'bg-black text-cyan-300 shadow-sm border border-cyan-500/40' : 'text-slate-500 hover:text-slate-800'}`}
              title="شاشة سوداء كوانتومية"
            >
              ⬛ سوداء
            </button>
          </div>

          {/* Live Preview Matrix Button */}
          {onOpenLivePreview && (
            <button
              onClick={onOpenLivePreview}
              className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>مصفوفة المعاينة المباشرة</span>
            </button>
          )}

          {/* Open Source Hub Shortcut */}
          {onNavigate && (
            <button
              onClick={() => onNavigate(AppTab.OPEN_SOURCE_HUB)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 active:scale-95 ${
                canvasMode === 'OLED_OBSIDIAN' 
                  ? 'bg-black border-white/20 text-slate-300 hover:border-cyan-400' 
                  : 'bg-white border-slate-300 text-slate-700 hover:border-blue-400'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-purple-500" />
              <span>المصدر المفتوح</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className={`relative z-10 px-6 py-2 border-b flex items-center gap-2 ${canvasMode === 'OLED_OBSIDIAN' ? 'border-white/5 bg-black/40' : 'border-slate-100 bg-slate-50/50'}`}>
        {[
          { id: 'CONVERSATION', label: 'المحادثة والوعي المتكلم', icon: <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> },
          { id: 'WHITEBOARD_SCRATCHPAD', label: 'السبورة والكتابة الحرة', icon: <PenTool className="w-3.5 h-3.5 text-amber-500" /> },
          { id: 'CROSS_PLATFORM_BRIDGES', label: 'جسور المنصات (Cross-Platform)', icon: <Layers className="w-3.5 h-3.5 text-emerald-500" /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === t.id
                ? canvasMode === 'OLED_OBSIDIAN'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-white text-blue-700 border border-slate-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* 3. MAIN CANVAS CONTENT AREA */}
      <div className="relative z-10 flex-1 p-6 overflow-y-auto max-h-[500px] flex flex-col space-y-4 custom-scrollbar">
        
        {/* VIEW A: CONVERSATION & THOUGHT NODES */}
        {activeTab === 'CONVERSATION' && (
          <div className="space-y-4">
            {state.thoughtHistory.map(node => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-3xl border transition-all ${
                  canvasMode === 'OLED_OBSIDIAN'
                    ? 'bg-black/80 border-cyan-500/30 shadow-[0_0_20px_rgba(0,0,0,0.6)]'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${node.type === 'QUANTUM_INSIGHT' ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400'}`}></span>
                    <h3 className="text-sm font-black">{node.title}</h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                      canvasMode === 'OLED_OBSIDIAN' ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/30' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {node.targetPlatform || 'ALL'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(node.content, node.id)}
                      className="p-1.5 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
                      title="نسخ النص"
                    >
                      {copiedId === node.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => sovereignConsciousnessEngine.speakText(node.content.replace(/[#*`_]/g, ''))}
                      className="p-1.5 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
                      title="استماع صوتي"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-blue-500" />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans opacity-90">
                  {node.content}
                </p>

                {node.codeSnippet && (
                  <div className="mt-3 p-3 rounded-2xl bg-black text-cyan-300 font-mono text-xs overflow-x-auto border border-white/10">
                    <pre>{node.codeSnippet}</pre>
                  </div>
                )}
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* VIEW B: WHITEBOARD SCRATCHPAD */}
        {activeTab === 'WHITEBOARD_SCRATCHPAD' && (
          <div className="h-full flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold opacity-75">محرر الكتابة الحرة والتفكير المباشر (Markdown & Scratchpad):</span>
              <button
                onClick={() => handleCopy(scratchpadContent, 'scratchpad')}
                className="px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 bg-white/10 hover:bg-white/20 transition-all"
              >
                {copiedId === 'scratchpad' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>نسخ المحتوى</span>
              </button>
            </div>
            <textarea
              value={scratchpadContent}
              onChange={e => setScratchpadContent(e.target.value)}
              className={`w-full flex-1 min-h-[350px] p-5 rounded-3xl border font-mono text-xs sm:text-sm leading-relaxed focus:outline-none transition-all ${
                canvasMode === 'OLED_OBSIDIAN'
                  ? 'bg-black text-cyan-300 border-cyan-500/40 focus:border-cyan-400'
                  : 'bg-white text-slate-800 border-slate-300 focus:border-blue-500'
              }`}
              placeholder="اكتب أفكارك وملاحظاتك هنا بحرية..."
            />
          </div>
        )}

        {/* VIEW C: CROSS-PLATFORM BRIDGES */}
        {activeTab === 'CROSS_PLATFORM_BRIDGES' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-black">جسور التكامل المنصي للوعي (Universal Cross-Platform Bridges):</h3>
              <p className="text-xs opacity-75 mt-0.5">
                حالة الربط المباشر بين جميع المحركات والعتاد السيادي لصارة:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {state.activePlatformBridges.map(bridge => (
                <div
                  key={bridge.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    canvasMode === 'OLED_OBSIDIAN'
                      ? 'bg-black border-white/10 hover:border-cyan-500/40'
                      : 'bg-white border-slate-200 hover:border-blue-400 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <h4 className="text-xs font-black">{bridge.name}</h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/30 text-emerald-400 border border-emerald-500/30">
                      {bridge.latencyMs}ms
                    </span>
                  </div>
                  <p className="text-[11px] opacity-75 leading-relaxed">{bridge.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 4. BOTTOM INPUT BAR: Write or Speak */}
      <div className={`relative z-10 p-4 sm:p-5 border-t ${canvasMode === 'OLED_OBSIDIAN' ? 'border-white/10 bg-black/90' : 'border-slate-200 bg-white/90'} backdrop-blur-md`}>
        <form onSubmit={handleSend} className="flex items-center gap-3">
          
          {/* Voice Mic Button */}
          <button
            type="button"
            onClick={handleVoiceToggle}
            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-center active:scale-95 shadow-sm ${
              state.isListening
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-rose-500/50'
                : canvasMode === 'OLED_OBSIDIAN'
                  ? 'bg-black border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
            title={state.isListening ? 'إيقاف الاستماع الصوتي' : 'تحدث مع صارة صوتياً'}
          >
            {state.isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="اكتب هنا أو تحدث بصوتك (مثال: شغّل محاكاة بايثون، أو انشئ تراكب كوانتومي 528Hz)..."
              disabled={isProcessing}
              className={`w-full py-3.5 px-4 rounded-2xl border text-xs sm:text-sm font-sans focus:outline-none transition-all ${
                canvasMode === 'OLED_OBSIDIAN'
                  ? 'bg-black border-white/20 text-white placeholder-slate-500 focus:border-cyan-400'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
              }`}
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className="px-5 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">إرسال</span>
              </>
            )}
          </button>

        </form>

        {state.isSpeaking && (
          <div className="mt-2 flex items-center justify-between text-xs text-cyan-400 bg-black/60 px-3 py-1.5 rounded-xl border border-cyan-500/30">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 animate-bounce" />
              <span>صارة تتحدث الآن بالصوت السيادي...</span>
            </span>
            <button
              onClick={() => sovereignConsciousnessEngine.stopSpeaking()}
              className="text-rose-400 hover:text-rose-300 font-bold"
            >
              إسكات
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
