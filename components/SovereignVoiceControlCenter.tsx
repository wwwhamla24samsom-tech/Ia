/**
 * 🎙️ SOVEREIGN VOICE & SYSTEM COMMAND COCKPIT
 * ============================================
 * وحدة التحكم الصوتي الذكي المستقلة تماماً عن جمناي
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  sovereignVoiceController, 
  VoiceCommandIntent, 
  VoiceEngineConfig 
} from '../services/sovereignVoiceController';
import { AppTab, Language } from '../types';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  Terminal, 
  Cpu, 
  Shield, 
  Radio, 
  Sliders, 
  Zap, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Sparkles, 
  Code, 
  Send,
  MessageSquare,
  Flame,
  Layers,
  Settings2,
  ChevronRight,
  Headphones,
  Compass
} from 'lucide-react';

interface Props {
  language?: Language;
  onNavigate: (tab: AppTab) => void;
}

export const SovereignVoiceControlCenter: React.FC<Props> = ({
  language = 'ar',
  onNavigate
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [lastIntent, setLastIntent] = useState<VoiceCommandIntent | null>(null);
  const [history, setHistory] = useState<VoiceCommandIntent[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [config, setConfig] = useState<VoiceEngineConfig>(sovereignVoiceController.getConfig());
  
  const [manualText, setManualText] = useState('');
  const [activeTabSub, setActiveTabSub] = useState<'cockpit' | 'multi_step' | 'history' | 'settings' | 'matrix'>('cockpit');
  const [systemToast, setSystemToast] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    sovereignVoiceController.setNavigationCallback((tab: AppTab) => {
      onNavigate(tab);
      showToast(`⚡ تم التوجيه السيادي إلى: ${tab}`);
    });

    sovereignVoiceController.setNotificationCallback((msg: string) => {
      showToast(msg);
    });

    const unsubscribe = sovereignVoiceController.subscribe((state) => {
      setIsListening(state.isListening);
      setIsSpeaking(state.isSpeaking);
      setTranscript(state.transcript);
      setInterimTranscript(state.interimTranscript);
      setLastIntent(state.lastIntent);
      setHistory(state.history);
      setAudioLevel(state.audioLevel);
    });

    return () => {
      unsubscribe();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [onNavigate]);

  const showToast = (msg: string) => {
    setSystemToast(msg);
    setTimeout(() => setSystemToast(null), 4000);
  };

  // Audio Visualizer Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angle = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 65 + (isListening ? Math.sin(angle * 4) * 8 + audioLevel * 25 : 0);

      // Outer glowing ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 15, 0, Math.PI * 2);
      ctx.strokeStyle = isListening ? 'rgba(0, 255, 170, 0.4)' : isSpeaking ? 'rgba(168, 85, 247, 0.4)' : 'rgba(59, 130, 246, 0.2)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Rotating frequency points
      const points = 16;
      for (let i = 0; i < points; i++) {
        const theta = (i / points) * Math.PI * 2 + angle;
        const dist = radius + (isListening ? Math.sin(theta * 3 + angle * 5) * 12 * (audioLevel + 0.3) : 0);
        const px = centerX + Math.cos(theta) * dist;
        const py = centerY + Math.sin(theta) * dist;

        ctx.beginPath();
        ctx.arc(px, py, isListening ? 3.5 : 2, 0, Math.PI * 2);
        ctx.fillStyle = isListening ? '#00ffaa' : isSpeaking ? '#c084fc' : '#60a5fa';
        ctx.shadowColor = isListening ? '#00ffaa' : '#a855f7';
        ctx.shadowBlur = 10;
        ctx.fill();
      }

      // Inner Core Gradient
      const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius);
      if (isListening) {
        grad.addColorStop(0, 'rgba(0, 255, 170, 0.35)');
        grad.addColorStop(0.7, 'rgba(16, 185, 129, 0.15)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
      } else if (isSpeaking) {
        grad.addColorStop(0, 'rgba(168, 85, 247, 0.4)');
        grad.addColorStop(0.7, 'rgba(99, 102, 241, 0.15)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
      } else {
        grad.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
        grad.addColorStop(0.8, 'rgba(30, 58, 138, 0.1)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
      }

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = isListening ? '#00ffaa' : isSpeaking ? '#a855f7' : '#3b82f6';
      ctx.lineWidth = 3;
      ctx.stroke();

      angle += isListening ? 0.04 : 0.015;
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isListening, isSpeaking, audioLevel]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    sovereignVoiceController.handleFinalTranscript(manualText.trim());
    setManualText('');
  };

  // Compound multi-step commands presets
  const multiStepPresetCommands = [
    {
      title: '💻 وضع المطور الشامل والمحاكي والتنظيف',
      cmd: 'قم بفتح نافذة المطور وتشغيل محاكي بايثون وأغلق كافة المهام الخلفية غير الضرورية',
      stepsCount: 3,
      badge: 'أمر المستخدم النموذجي',
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-300'
    },
    {
      title: '🛡️ التحصين الأمني والمصفوفة الرياضية والتيربو',
      cmd: 'فعل قبة دراغون وحصن النظام ثم شغل بايثون واحسب مصفوفة كوانتوم وأغلق المهام الزائدة',
      stepsCount: 3,
      badge: 'حماية وحساب وتنظيف',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-300'
    },
    {
      title: '🌌 شبكة القيادة المدارية واستوديو Kimi ومسح الكاش',
      cmd: 'انقلني إلى شبكة القيادة المدارية وافتح استوديو كيمي ونظف الذاكرة المؤقتة',
      stepsCount: 3,
      badge: 'استدلال وقيادة',
      color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/40 text-purple-300'
    },
    {
      title: '⚡ الصيانة السريعة وتفريغ الموارد وتشخيص المعالجات',
      cmd: 'أغلق كافة المهام الخلفية وفعل تيربو 528Hz وافحص حالة النظام',
      stepsCount: 3,
      badge: 'صيانة 0ms',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-300'
    }
  ];

  const sampleCommands = [
    { label: '🛡️ فعل قبة دراغون وحصن النظام', cmd: 'فعل قبة دراغون وحصن النظام بالكامل' },
    { label: '💻 افتح الكمبيوتر الكمومي الخارق QPU-128', cmd: 'انقلني إلى الكمبيوتر الكمومي الخارق' },
    { label: '🐍 شغل محاكي بايثون واحسب مصفوفة كوانتوم', cmd: 'شغل محاكي بايثون واحسب مصفوفة تربيعية' },
    { label: '🔮 افتح استوديو Kimi LLM', cmd: 'افتح استوديو كيمي للذكاء الاصطناعي' },
    { label: '⚡ فعل التيربو وفرغ الذاكرة 528Hz', cmd: 'تيربو وفرغ الذاكرة المؤقتة' },
    { label: '🧹 أغلق كافة المهام الخلفية غير الضرورية', cmd: 'أغلق كافة المهام الخلفية غير الضرورية ونظف الموارد' },
    { label: '🌌 افتح شبكة القيادة المدارية (Apex Matrix)', cmd: 'انقلني إلى شبكة القيادة المدارية' },
    { label: '🔍 فحص حالة وتشخيص المعالجات', cmd: 'ما هي حالة النظام والتشخيص' }
  ];

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#030712] via-[#050b1a] to-[#02040a] text-slate-100 p-4 sm:p-6 lg:p-8 relative overflow-hidden" dir="rtl">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating System Toast */}
      {systemToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-950/90 border border-emerald-400/50 text-emerald-200 px-5 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
          <span className="text-sm font-bold">{systemToast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5 mb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/30 to-teal-500/20 border border-emerald-400/50 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <Radio className="w-6 h-6 text-emerald-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-wide">
                نظام التحدث والتحكم الصوتي المستقل
              </h1>
              <span className="px-2.5 py-0.5 text-[11px] font-extrabold bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 rounded-full">
                Zero Gemini • 100% Sovereign
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              محرك صوتي مستقل تماماً يتحكم بجميع أقسام ومفاعلات النظام وتوليف بايثون الحي عبر الأوامر الطبيعية
            </p>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 p-1.5 rounded-2xl backdrop-blur-md">
          <button
            onClick={() => setActiveTabSub('cockpit')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTabSub === 'cockpit'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            منصة القيادة
          </button>
          <button
            onClick={() => setActiveTabSub('multi_step')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTabSub === 'multi_step'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>الأوامر المركبة متعددة الخطوات</span>
            <span className="px-1.5 py-0.2 bg-cyan-950 text-[10px] font-mono text-cyan-300 border border-cyan-500/40 rounded-full">
              Multi-Step
            </span>
          </button>
          <button
            onClick={() => setActiveTabSub('history')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTabSub === 'history'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            سجل الأوامر ({history.length})
          </button>
          <button
            onClick={() => setActiveTabSub('matrix')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTabSub === 'matrix'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            مصفوفة التحكم
          </button>
          <button
            onClick={() => setActiveTabSub('settings')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTabSub === 'settings'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            إعدادات الصوت
          </button>
        </div>
      </div>

      {/* Multi-Step Commands Feature Banner */}
      <div className="max-w-7xl mx-auto mb-6 bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-purple-950/60 border border-cyan-500/30 rounded-3xl p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-cyan-300 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-white">
                  محرك معالجة الأوامر الصوتية متعددة الخطوات (Multi-Step Compound Voice Pipeline)
                </h2>
                <span className="px-2 py-0.5 bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 rounded-full text-[10px] font-mono">
                  Autonomous Sequencer
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                يمكنك الآن نطق أوامر معقدة متتالية في جملة واحدة، وسيقوم النظام بتفكيكها إلى خطة عمل تنفيذية متتابعة مع تقرير صوتي وبصري شامل.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => sovereignVoiceController.handleFinalTranscript('قم بفتح نافذة المطور وتشغيل محاكي بايثون وأغلق كافة المهام الخلفية غير الضرورية')}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>تجربة أمر المستخدم النموذجي (3 خطوات)</span>
            </button>
          </div>
        </div>

        {/* Multi-Step Presets Quick Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/10">
          {multiStepPresetCommands.map((item, idx) => (
            <div
              key={idx}
              onClick={() => sovereignVoiceController.handleFinalTranscript(item.cmd)}
              className={`p-3 rounded-2xl bg-gradient-to-b ${item.color} border hover:border-white/40 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] group flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-black/40 rounded-full border border-white/10">
                    {item.badge}
                  </span>
                  <span className="text-[10px] font-mono opacity-80">
                    {item.stepsCount} خطوات
                  </span>
                </div>
                <h4 className="text-xs font-black text-white group-hover:text-cyan-200 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-300/90 mt-1 leading-relaxed font-sans line-clamp-2">
                  « {item.cmd} »
                </p>
              </div>
              <div className="flex items-center justify-end mt-2 pt-1 border-t border-white/5">
                <span className="text-[10px] font-bold text-cyan-300 flex items-center gap-1 group-hover:translate-x-[-2px] transition-transform">
                  تشغيل السلسلة <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left/Main Column: Visualizer Orb & Live Audio Stream */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Main Visualizer & Command Orb Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center min-h-[380px]">
            {/* Status Indicators */}
            <div className="w-full flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-emerald-400 animate-ping' : isSpeaking ? 'bg-purple-400 animate-pulse' : 'bg-slate-600'}`} />
                <span className="text-xs font-bold text-slate-300">
                  {isListening ? '🎙️ الاستماع المباشر نشط (تحدث الآن...)' : isSpeaking ? '🔊 النطق الصوتي السيادي جاري...' : '⏸️ الميكروفون في وضع الاستعداد'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
                  كلمة التنبيه: <b className="text-emerald-300">"يا صارة"</b>
                </span>
                {isSpeaking && (
                  <button
                    onClick={() => sovereignVoiceController.stopSpeaking()}
                    className="p-1.5 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 rounded-xl border border-rose-500/40 text-xs flex items-center gap-1"
                    title="إيقاف النطق"
                  >
                    <Square className="w-3 h-3" /> إيقاف الصوت
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Canvas Orb */}
            <div className="relative flex items-center justify-center my-2">
              <canvas
                ref={canvasRef}
                width={260}
                height={260}
                className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                onClick={() => sovereignVoiceController.toggleListening()}
              />
              <button
                onClick={() => sovereignVoiceController.toggleListening()}
                className={`absolute w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all ${
                  isListening
                    ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-black shadow-emerald-500/50 scale-110'
                    : isSpeaking
                    ? 'bg-gradient-to-tr from-purple-500 to-indigo-500 text-white shadow-purple-500/50'
                    : 'bg-gradient-to-tr from-slate-800 to-slate-700 text-slate-200 border border-slate-600 hover:border-emerald-400/50'
                }`}
              >
                {isListening ? (
                  <Mic className="w-9 h-9 animate-bounce" />
                ) : isSpeaking ? (
                  <Volume2 className="w-9 h-9 animate-pulse" />
                ) : (
                  <MicOff className="w-8 h-8 opacity-70" />
                )}
              </button>
            </div>

            {/* Transcript & Interim Live Feed */}
            <div className="w-full max-w-xl text-center mt-3">
              {interimTranscript && (
                <div className="text-sm font-medium text-emerald-300/90 italic animate-pulse mb-1">
                  "{interimTranscript}..."
                </div>
              )}
              {transcript ? (
                <div className="text-base font-bold text-white bg-slate-950/60 border border-slate-800/80 px-4 py-2 rounded-2xl inline-block shadow-inner">
                  « {transcript} »
                </div>
              ) : (
                <div className="text-xs text-slate-400">
                  انقر على الدائرة أو قل <span className="text-emerald-400 font-bold">"يا صارة"</span> ثم اطلب التحكم بأي وحدة
                </div>
              )}
            </div>

            {/* Manual Text Command Input */}
            <form onSubmit={handleManualSubmit} className="w-full max-w-xl mt-5 flex items-center gap-2">
              <input
                type="text"
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="أو اكتب الأمر الصوتي كتابة (مثال: شغل بايثون، فعل دراغون، افتح كيمي...)"
                className="flex-1 bg-slate-950/80 border border-slate-800 text-white text-xs sm:text-sm rounded-2xl px-4 py-2.5 focus:outline-none focus:border-emerald-400/70 transition-all placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-400/50 text-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
              >
                <Send className="w-3.5 h-3.5" />
                تنفيذ
              </button>
            </form>
          </div>

          {/* Quick Voice Triggers & System Control Buttons */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black text-white">الأوامر الصوتية الجاهزة للتنفيذ الفوري</span>
              </div>
              <span className="text-[10px] text-slate-400">انقر لتجربة الأمر أو قله بالصوت</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {sampleCommands.map((sc, idx) => (
                <button
                  key={idx}
                  onClick={() => sovereignVoiceController.handleFinalTranscript(sc.cmd)}
                  className="p-3 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-emerald-400/40 rounded-2xl text-right transition-all flex items-center justify-between group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">
                      {sc.label}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-[-2px] transition-all" />
                </button>
              ))}
            </div>
          </div>

          {/* Last Executed Intent Card */}
          {lastIntent && (
            <div className={`bg-slate-900/70 border rounded-3xl p-5 backdrop-blur-xl shadow-xl transition-all ${
              lastIntent.isMultiStep ? 'border-cyan-500/50 shadow-cyan-500/10' : 'border-emerald-500/30'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {lastIntent.isMultiStep ? (
                    <div className="flex items-center gap-1.5 text-cyan-300">
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span className="text-xs font-black">
                        خطة العمليات متعددة الخطوات المنفذة (Compound Multi-Step Pipeline)
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-black">
                        آخر أمر صوتي تم تنفيذه في النظام
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {lastIntent.isMultiStep && (
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-500/40">
                      {lastIntent.steps?.length || 0} خطوات متتالية
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full">
                    دقة المطابقة: {Math.round(lastIntent.confidence * 100)}%
                  </span>
                </div>
              </div>

              <div className="bg-slate-950/80 rounded-2xl p-3.5 border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">النص المنطوق بالكامل:</span>
                  <span className="font-bold text-white max-w-md truncate">« {lastIntent.rawTranscript} »</span>
                </div>

                {/* Multi-Step Pipeline Visualizer Stepper */}
                {lastIntent.isMultiStep && lastIntent.steps && lastIntent.steps.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-1">
                      <span>تسلسل تنفيذ الخطوات (Sequential Execution):</span>
                      <span className="text-cyan-400 font-mono text-[10px]">
                        حالة الخطة: {lastIntent.executionStatus.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {lastIntent.steps.map((st, sidx) => (
                        <div
                          key={sidx}
                          className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
                            st.status === 'completed'
                              ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                              : st.status === 'running'
                              ? 'bg-cyan-950/40 border-cyan-400/60 text-white animate-pulse'
                              : st.status === 'failed'
                              ? 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                              : 'bg-slate-900/40 border-slate-800 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                              st.status === 'completed'
                                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40'
                                : st.status === 'running'
                                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/60'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {st.status === 'completed' ? '✓' : st.status === 'running' ? '⚡' : st.stepIndex}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white">« {st.stepText} »</span>
                                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-black/40 text-cyan-300 border border-white/5">
                                  {st.matchedAction}
                                </span>
                              </div>
                              {st.executionResult && (
                                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 font-mono">
                                  {st.executionResult}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            {st.durationMs !== undefined && (
                              <span className="text-[10px] font-mono text-slate-400 bg-black/40 px-2 py-0.5 rounded">
                                {st.durationMs}ms
                              </span>
                            )}
                            {st.targetTab && (
                              <button
                                onClick={() => onNavigate(st.targetTab!)}
                                className="px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold transition-all flex items-center gap-1"
                              >
                                <span>فتح الوحدة</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!lastIntent.isMultiStep && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">الإجراء المنفذ:</span>
                    <span className="font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                      {lastIntent.matchedAction}
                    </span>
                  </div>
                )}

                {lastIntent.executionResult && (
                  <div className="text-xs bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-slate-300 font-mono text-right">
                    {lastIntent.executionResult}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-400">الرد المنطوق الصوتي:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-300 font-semibold">{lastIntent.responseSpokenText}</span>
                    <button
                      onClick={() => sovereignVoiceController.speak(lastIntent.responseSpokenText)}
                      className="p-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/40 text-purple-300"
                      title="إعادة نطق الرد"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Multi-Step Studio Sub Tab View */}
          {activeTabSub === 'multi_step' && (
            <div className="bg-slate-900/70 border border-cyan-500/30 rounded-3xl p-5 backdrop-blur-xl shadow-xl space-y-4 animate-page-reveal">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-black text-white">استوديو تركيب واختبار الأوامر المركبة</h3>
                </div>
                <span className="text-xs text-slate-400">ربط المهام بـ (و / ثم / بعد ذلك)</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                يقوم المحلل السيادي بتفكيك النصوص المعقدة إلى خطوات ذرية (Atomic Intents)، وتنفيذها بالتوالي دون مقاطعة، ثم توجيهك إلى شاشة العمل النهائية وتوليد ملخص صوتي مدمج.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                    <Code className="w-4 h-4 text-cyan-400" />
                    <span>مزيج: بيئة المطور + بايثون + تنظيف المهام</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    « قم بفتح نافذة المطور وتشغيل محاكي بايثون وأغلق كافة المهام الخلفية غير الضرورية »
                  </p>
                  <button
                    onClick={() => sovereignVoiceController.handleFinalTranscript('قم بفتح نافذة المطور وتشغيل محاكي بايثون وأغلق كافة المهام الخلفية غير الضرورية')}
                    className="w-full py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40 transition-all"
                  >
                    تنفيذ السلسلة الآن ⚡
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>مزيج: درع دراغون + بايثون + التيربو 528Hz</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    « فعل قبة دراغون وحصن النظام ثم شغل بايثون واحسب مصفوفة كوانتوم وأغلق المهام الزائدة »
                  </p>
                  <button
                    onClick={() => sovereignVoiceController.handleFinalTranscript('فعل قبة دراغون وحصن النظام ثم شغل بايثون واحسب مصفوفة كوانتوم وأغلق المهام الزائدة')}
                    className="w-full py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/40 transition-all"
                  >
                    تنفيذ السلسلة الآن ⚡
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Configuration, System Telemetry & History */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Engine Independence Card */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/90 border border-emerald-500/30 rounded-3xl p-5 backdrop-blur-xl shadow-xl">
            <div className="flex items-center gap-2.5 mb-3">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-black text-white">الاستقلال السيادي الصوتي</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              يعمل هذا النظام بمحرك محلي معزول كلياً عن Google Gemini، مما يضمن سرعة استجابة فورية (0ms Latency)، وتحكم كامل بالواجهات وبايثون دون الحاجة لأي مفاتيح أو اشتراكات خارجية.
            </p>

            <div className="space-y-2 border-t border-slate-800/80 pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">حالة التعرف (STT):</span>
                <span className="text-emerald-400 font-bold">Web Speech Native (نشط)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">حالة التوليف (TTS):</span>
                <span className="text-emerald-400 font-bold">528Hz Sovereign Synth</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">محلل النوايا (Intent Parser):</span>
                <span className="text-purple-400 font-bold">قواعد سيادية ذاتية (Local)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">الربط بالنظام (System Bus):</span>
                <span className="text-cyan-400 font-bold">تحكم ثنائي الاتجاه 100%</span>
              </div>
            </div>
          </div>

          {/* Quick Voice Settings */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-black text-white">ضبط النطق والترددات</h3>
              </div>
              <button
                onClick={() => sovereignVoiceController.playBeep(528, 0.2)}
                className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30"
              >
                اختبار 528Hz
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Language Selector */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">اللهجة والصوت:</label>
                <select
                  value={config.language}
                  onChange={(e) => {
                    const l = e.target.value as any;
                    setConfig({ ...config, language: l });
                    sovereignVoiceController.updateConfig({ language: l });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2 focus:outline-none focus:border-emerald-400"
                >
                  <option value="ar-SA">العربية الفصحى (السعودية ar-SA)</option>
                  <option value="ar-DZ">العربية (الجزائر ar-DZ)</option>
                  <option value="ar-EG">العربية (مصر ar-EG)</option>
                  <option value="en-US">English (US en-US)</option>
                </select>
              </div>

              {/* Continuous Listening Toggle */}
              <div className="flex items-center justify-between bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-300 font-medium">الاستماع المستمر (Always-On):</span>
                <input
                  type="checkbox"
                  checked={config.continuousListening}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setConfig({ ...config, continuousListening: val });
                    sovereignVoiceController.updateConfig({ continuousListening: val });
                    if (val) sovereignVoiceController.startListening();
                  }}
                  className="accent-emerald-500 w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Wake Word Toggle */}
              <div className="flex items-center justify-between bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-300 font-medium">تفعيل كلمة التنبيه ("يا صارة"):</span>
                <input
                  type="checkbox"
                  checked={config.wakeWordEnabled}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setConfig({ ...config, wakeWordEnabled: val });
                    sovereignVoiceController.updateConfig({ wakeWordEnabled: val });
                  }}
                  className="accent-emerald-500 w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Speech Speed Slider */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>سرعة النطق:</span>
                  <span>{config.speechRate}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.5"
                  step="0.05"
                  value={config.speechRate}
                  onChange={(e) => {
                    const r = parseFloat(e.target.value);
                    setConfig({ ...config, speechRate: r });
                    sovereignVoiceController.updateConfig({ speechRate: r });
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Execution History Stream */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 backdrop-blur-xl flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-black text-white">سجل الأوامر الصوتية الحديثة</h3>
              </div>
              {history.length > 0 && (
                <button
                  onClick={() => sovereignVoiceController.clearHistory()}
                  className="text-[10px] text-rose-400 hover:text-rose-300"
                >
                  مسح السجل
                </button>
              )}
            </div>

            <div className="space-y-2 overflow-y-auto max-h-64 pr-1">
              {history.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  لم يتم تنفيذ أوامر بعد. قل <b className="text-slate-400">"يا صارة شغل بايثون"</b> للبدء
                </div>
              ) : (
                history.map((item, idx) => (
                  <div key={idx} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-emerald-300 truncate max-w-[160px]">
                        « {item.rawTranscript} »
                      </span>
                      <span className="text-slate-500 font-mono">
                        {new Date(item.timestamp).toLocaleTimeString('ar-SA')}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {item.executionResult || item.responseSpokenText}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
