import React, { useState, useRef, useEffect } from 'react';
import { generateFullHtmlApp } from '../services/geminiService';
import { Language } from '../types';
import { Play, Sparkles, Smartphone, Monitor, Tablet, Code2, Eye, Download, RotateCw, Maximize2, Minimize2, Check, Copy } from 'lucide-react';

const PRESET_APPS = [
  {
    name: 'حاسبة النجمة السداسية والترددات',
    prompt: 'تطبيق حاسبة كمومية تفاعلية حديثة مع مؤثرات ضوئية ورسوم بيانية بتردد 528Hz',
    code: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>حاسبة صارة الكوآنتومية</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
    body { font-family: 'Cairo', sans-serif; background: #050811; color: #fff; }
    .glow { box-shadow: 0 0 25px rgba(16, 185, 129, 0.4); }
  </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-4">
  <div class="w-full max-w-sm bg-[#0a0f1d] border border-emerald-500/30 rounded-3xl p-6 glow">
    <div class="flex items-center justify-between mb-4 border-b border-emerald-500/20 pb-3">
      <span class="text-xs font-bold text-emerald-400">⚡ صارة QPU-128</span>
      <span id="coherence" class="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">528Hz Active</span>
    </div>
    
    <div id="display" class="w-full h-16 bg-black/60 border border-emerald-500/40 rounded-2xl flex items-center justify-end px-4 text-3xl font-mono text-emerald-300 mb-6 overflow-x-auto">
      0
    </div>

    <div class="grid grid-cols-4 gap-2.5">
      <button onclick="clearCalc()" class="p-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl font-bold">C</button>
      <button onclick="appendVal('(')" class="p-3 bg-white/5 hover:bg-white/10 text-emerald-400 rounded-xl font-bold">(</button>
      <button onclick="appendVal(')')" class="p-3 bg-white/5 hover:bg-white/10 text-emerald-400 rounded-xl font-bold">)</button>
      <button onclick="appendVal('/')" class="p-3 bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 rounded-xl font-bold">÷</button>

      <button onclick="appendVal('7')" class="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl font-bold">7</button>
      <button onclick="appendVal('8')" class="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl font-bold">8</button>
      <button onclick="appendVal('9')" class="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl font-bold">9</button>
      <button onclick="appendVal('*')" class="p-3 bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 rounded-xl font-bold">×</button>

      <button onclick="appendVal('4')" class="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl font-bold">4</button>
      <button onclick="appendVal('5')" class="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl font-bold">5</button>
      <button onclick="appendVal('6')" class="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl font-bold">6</button>
      <button onclick="appendVal('-')" class="p-3 bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 rounded-xl font-bold">-</button>

      <button onclick="appendVal('1')" class="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl font-bold">1</button>
      <button onclick="appendVal('2')" class="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl font-bold">2</button>
      <button onclick="appendVal('3')" class="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl font-bold">3</button>
      <button onclick="appendVal('+')" class="p-3 bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 rounded-xl font-bold">+</button>

      <button onclick="appendVal('0')" class="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl font-bold col-span-2">0</button>
      <button onclick="appendVal('.')" class="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl font-bold">.</button>
      <button onclick="calculate()" class="p-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl">=</button>
    </div>
  </div>

  <script>
    let expr = '';
    const display = document.getElementById('display');
    function appendVal(val) {
      if (expr === '0' && val !== '.') expr = '';
      expr += val;
      display.innerText = expr;
    }
    function clearCalc() {
      expr = '';
      display.innerText = '0';
    }
    function calculate() {
      try {
        const res = Function('"use strict";return (' + expr + ')')();
        expr = String(res);
        display.innerText = res;
      } catch (e) {
        display.innerText = 'Error';
        expr = '';
      }
    }
  </script>
</body>
</html>`
  },
  {
    name: 'لوحة قياس النبض السيادي والبيانات',
    prompt: 'لوحة تحكم إحصائية حية مع رصد الأمان والتيليميتري ومؤقت',
    code: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>لوحة التيليميتري السيادية</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
    body { font-family: 'Cairo', sans-serif; background: #030712; color: #fff; }
  </style>
</head>
<body class="p-4 sm:p-6 min-h-screen flex flex-col justify-center">
  <div class="max-w-md mx-auto w-full bg-[#081024] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-black text-white">رادار التيليميتري L4</h1>
        <p class="text-xs text-cyan-400/80">صارة v17 التوافق الفوري</p>
      </div>
      <div class="w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
    </div>

    <div class="grid grid-cols-2 gap-3 mb-6">
      <div class="bg-white/5 border border-cyan-500/20 p-4 rounded-2xl text-center">
        <div class="text-xs text-slate-400 mb-1">التردد الكوآنتومي</div>
        <div class="text-2xl font-black text-emerald-400 font-mono">528 Hz</div>
      </div>
      <div class="bg-white/5 border border-cyan-500/20 p-4 rounded-2xl text-center">
        <div class="text-xs text-slate-400 mb-1">استقرار النواة</div>
        <div class="text-2xl font-black text-cyan-400 font-mono">99.98%</div>
      </div>
    </div>

    <div class="bg-black/50 border border-white/10 rounded-2xl p-4 mb-6">
      <div class="flex justify-between text-xs mb-2">
        <span class="text-slate-400">سعة الذاكرة المستقلة</span>
        <span id="mem-val" class="text-cyan-300 font-mono">64%</span>
      </div>
      <div class="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
        <div id="mem-bar" class="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full" style="width: 64%"></div>
      </div>
    </div>

    <button onclick="pingPulse()" class="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-2xl text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-all">
      ⚡ نبضة كشف سيادية
    </button>
  </div>

  <script>
    function pingPulse() {
      const val = Math.floor(55 + Math.random() * 35);
      document.getElementById('mem-val').innerText = val + '%';
      document.getElementById('mem-bar').style.width = val + '%';
    }
    setInterval(pingPulse, 4000);
  </script>
</body>
</html>`
  }
];

export const HtmlFull: React.FC<{ language: Language }> = ({ language }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [appData, setAppData] = useState<{ name: string, code: string }>(PRESET_APPS[0]);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [viewportMode, setViewportMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bootSequence, setBootSequence] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setBootSequence(false);
    setStatusMessage('⚡ جاري تجسيد الكود وبناء المنظومة عبر جيل الذكاء السيادي...');
    try {
      const result = await generateFullHtmlApp(prompt, language);
      if (result && result.code) {
        setAppData(result);
        setBootSequence(true);
        setPreviewKey(k => k + 1);
        setStatusMessage('✓ تم تجسيد التطبيق بنجاح داخل نظام المعاينة.');
        setTimeout(() => setBootSequence(false), 2000);
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage('⚠️ تعذر إكمال التجسيد التلقائي، تم الإبقاء على النموذج الحالي.');
    } finally {
      setLoading(false);
    }
  };

  const downloadHtml = () => {
    if (!appData) return;
    const blob = new Blob([appData.code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appData.name || 'sarah_app'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    if (!appData) return;
    navigator.clipboard.writeText(appData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col h-full space-y-6 font-arabic animate-fadeIn ${isFullscreen ? 'fixed inset-0 z-[5000] bg-black p-0 m-0' : 'pb-24'}`}>
      
      {/* Search & Manifestation Bar */}
      {!isFullscreen && (
        <div className="bg-[#0c0c0c]/80 backdrop-blur-2xl border border-emerald-500/20 p-6 sm:p-8 rounded-[2.5rem] shadow-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-pulse"></div>
          
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 relative z-10">
             <div className="flex items-center gap-4 text-right w-full lg:w-auto">
                <div className={`w-14 h-14 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-3xl border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)] ${loading ? 'animate-spin' : ''}`}>
                   🌐
                </div>
                <div>
                   <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">نظام تجسيد <span className="text-emerald-400">والمعاينة الحية</span></h2>
                   <p className="text-emerald-400/80 font-mono text-xs">Live Sandboxed Virtual Engine v19.4</p>
                </div>
             </div>
             
             <div className="flex-1 w-full relative">
                <input 
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="صِف التطبيق أو الواجهة التي تريد تجسيدها ومعاينتها فوراً..."
                  className="w-full bg-black/80 border border-emerald-500/30 rounded-2xl px-5 py-4 pl-32 text-sm sm:text-base text-white focus:outline-none focus:border-emerald-500 transition-all text-right shadow-inner placeholder:text-slate-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
                <button 
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2.5 rounded-xl font-black text-xs transition-all shadow-lg active:scale-95 disabled:opacity-40 flex items-center gap-1.5"
                >
                  {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-black" />}
                  <span>{loading ? 'جاري البناء...' : 'تجسيد'}</span>
                </button>
             </div>
          </div>

          {/* Quick Preset Selector */}
          <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-bold">نماذج جاهزة:</span>
              {PRESET_APPS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAppData(preset);
                    setPreviewKey(k => k + 1);
                    setStatusMessage(`تم تحميل نموذج: ${preset.name}`);
                  }}
                  className="px-3 py-1 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 transition-all text-xs"
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {statusMessage && (
              <span className="text-[11px] text-emerald-400 animate-pulse font-mono">{statusMessage}</span>
            )}
          </div>
        </div>
      )}

      {/* Manifestation Zone (The Preview & Code Section) */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        
        {/* Top Control Toolbar */}
        {!isFullscreen && (
          <div className="w-full max-w-4xl bg-[#0a0f1d] border border-white/10 rounded-2xl p-2.5 mb-4 flex flex-wrap items-center justify-between gap-2 shadow-xl">
            {/* View Mode (Preview vs Code) */}
            <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'preview' ? 'bg-emerald-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>المعاينة التفاعلية</span>
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'code' ? 'bg-emerald-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>محرر الشيفرة</span>
              </button>
            </div>

            {/* Viewport Dimension Selectors */}
            {viewMode === 'preview' && (
              <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setViewportMode('mobile')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${viewportMode === 'mobile' ? 'bg-white/20 text-emerald-300' : 'text-slate-500 hover:text-white'}`}
                  title="شاشة الهاتف"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewportMode('tablet')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${viewportMode === 'tablet' ? 'bg-white/20 text-emerald-300' : 'text-slate-500 hover:text-white'}`}
                  title="شاشة التابلت"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewportMode('desktop')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${viewportMode === 'desktop' ? 'bg-white/20 text-emerald-300' : 'text-slate-500 hover:text-white'}`}
                  title="شاشة المكتب"
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quick Actions (Reload, Download, Fullscreen) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewKey(k => k + 1)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all"
                title="إعادة تحميل المعاينة"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-all flex items-center gap-1"
                title="نسخ الكود"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
              </button>

              <button
                onClick={downloadHtml}
                className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1"
                title="تحميل كملف HTML مستقل"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">تحميل HTML</span>
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all"
                title="ملء الشاشة"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Live Preview Display View */}
        {viewMode === 'preview' ? (
          <div className={`transition-all duration-300 flex items-center justify-center w-full ${isFullscreen ? 'h-screen' : ''}`}>
            <div
              className={`bg-[#050914] border-[8px] border-[#182035] shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col transition-all ${
                isFullscreen 
                  ? 'w-full h-full rounded-none border-none' 
                  : viewportMode === 'mobile'
                    ? 'w-[360px] h-[660px] rounded-[3rem]'
                    : viewportMode === 'tablet'
                      ? 'w-[680px] h-[720px] rounded-[2.5rem]'
                      : 'w-full max-w-4xl h-[650px] rounded-3xl'
              }`}
            >
              {bootSequence && (
                <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center text-emerald-400">
                  <Sparkles className="w-12 h-12 animate-spin mb-4" />
                  <p className="font-mono text-xs tracking-widest uppercase">جاري مزامنة البيئة الآمنة...</p>
                </div>
              )}
              
              <iframe
                ref={iframeRef}
                key={previewKey}
                srcDoc={appData.code}
                className="w-full h-full border-none bg-white"
                title="Sovereign App Live Preview"
                sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
              />
            </div>
          </div>
        ) : (
          /* Live Code Editor View */
          <div className="w-full max-w-4xl bg-[#080d1a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="bg-[#03060f] px-5 py-3 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400">HTML5 / JavaScript Sandbox Source</span>
              <button
                onClick={() => {
                  setPreviewKey(k => k + 1);
                  setViewMode('preview');
                  setStatusMessage('تم تحديث المعاينة من الشيفرة المصدرية.');
                }}
                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg transition-all"
              >
                تطبيق التعديلات في المعاينة ▶
              </button>
            </div>
            
            <textarea
              value={appData.code}
              onChange={(e) => setAppData(prev => ({ ...prev, code: e.target.value }))}
              className="w-full h-[520px] p-5 bg-transparent font-mono text-xs text-emerald-300/90 leading-relaxed focus:outline-none resize-none custom-scrollbar selection:bg-emerald-500 selection:text-black dir-ltr text-left"
              spellCheck={false}
            />
          </div>
        )}

      </div>

      {/* Floating Exit for Fullscreen */}
      {isFullscreen && (
        <button 
          onClick={() => setIsFullscreen(false)}
          className="fixed top-6 left-6 z-[6000] p-3.5 bg-black/80 border border-white/20 text-white rounded-full hover:bg-rose-600 transition-all shadow-2xl backdrop-blur-xl"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
