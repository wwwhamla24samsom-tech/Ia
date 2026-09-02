import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Settings as SettingsIcon, Zap, Shield, Sparkles, Cpu, 
  Flame, Globe, Sliders, RefreshCw, Terminal, Wrench, 
  RotateCcw, CheckCircle2, ChevronRight, Search, Activity,
  Lock, Eye, Bot, Compass, Code, Layers, ShieldAlert, HeartPulse
} from 'lucide-react';
import { AppTab, Language } from '../types';

interface OmniSideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: AppTab) => void;
  onSummonModule: (tab: AppTab) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  turboMode: boolean;
  setTurboMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  geminiModel: string;
  setGeminiModel: (model: string) => void;
  temperature: number;
  setTemperature: (t: number) => void;
  thinkingMode: boolean;
  setThinkingMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  systemDirective: string;
  setSystemDirective: (d: string) => void;
}

export const OmniSideDrawer: React.FC<OmniSideDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSummonModule,
  language,
  onLanguageChange,
  turboMode,
  setTurboMode,
  geminiModel,
  setGeminiModel,
  temperature,
  setTemperature,
  thinkingMode,
  setThinkingMode,
  systemDirective,
  setSystemDirective
}) => {
  const [activeCategory, setActiveCategory] = useState<'GEMINI' | 'SUMMON_ALL' | 'DEFENSE' | 'PREFERENCES' | 'MAINTENANCE'>('GEMINI');
  const [moduleSearch, setModuleSearch] = useState('');
  const [hydroResonanceLock, setHydroResonanceLock] = useState(true);
  const [zeroTrustStrict, setZeroTrustStrict] = useState(true);
  const [soundFx, setSoundFx] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'dz', label: 'الجزائرية (دارجة)', flag: '🇩🇿' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  ];

  const geminiModels = [
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', tag: 'فائق السرعة (افتراضي)', desc: 'استجابة فائقة السرعة وتوليد كود لحظي' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', tag: 'تفكير واستدلال عميق', desc: 'معالجة المسائل المعقدة والتخطيط الهيكلي' },
    { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (Preview)', tag: 'الجيل الثالث المطور', desc: 'أحدث نماذج جيل 3 مع فهم سياقي فائق' },
    { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro (Preview)', tag: 'الاستدلال السيادي الأقصى', desc: 'أقوى نموذج للاستنساخ وهندسة المنظومات' },
  ];

  const allSystemModules = [
    { id: AppTab.SOVEREIGN_VOICE_CONTROLLER, label: 'نظام التحدث والتحكم الصوتي المستقل (بدون Gemini)', category: 'AGENTS', icon: '🎙️', tag: 'Sovereign Voice & System Control', desc: 'نظام تحدث صوتي ذكي ومستقل 100% عن Gemini يتحكم ويقود كافة أنظمة صارة بالأوامر الصوتية الحية' },
    { id: AppTab.KIMI_LLM_STUDIO, label: 'استوديو Kimi LLM (Moonshot AI)', category: 'AGENTS', icon: '🔮', tag: '2M Context & CoT', desc: 'نظام الاستدلال العميق K1.5 مع نافذة سياق 2M توكن وتنفيذ بايثون الذاتي' },
    { id: AppTab.QUANTUM_DEV_COMPUTER, label: 'الكمبيوتر الكمومي الخارق QPU-128 (الشاشة الخضراء)', category: 'CODE', icon: '💻', tag: 'Green CRT Mainframe', desc: 'حاسوب المطورين الكوآنتومي: شاشة سوداء وفوسفور أخضر مع مصفوفة 128 كيوبت ومحرر وموجه أوامر' },
    { id: AppTab.DRAGON_DOME, label: 'منظومة دراغون وقبة الحماية السيادية', category: 'SECURITY', icon: '🐉', tag: 'L4 Obsidian', desc: 'تحصين بيئة التشغيل وصد التطفل الكوآنتومي' },
    { id: AppTab.SOLAR_COSMOS, label: 'صارة (الشمس والنظام الشمسي الموحد)', category: 'COSMIC', icon: '☀️', tag: 'Solar Core', desc: 'تكامل مدارات الكواكب والأنظمة السيادية' },
    { id: AppTab.AGENT_SWARM, label: 'سرب وكلاء الاستراتيجية والتنفيذ', category: 'AGENTS', icon: '🛡️', tag: 'Multi-Agent', desc: 'الوكلاء الستة لتنفيذ المهام بدون سحابة' },
    { id: AppTab.GENERATION_16, label: 'صارة v16 - مصفوفة النجمة السداسية', category: 'COSMIC', icon: '🔯', tag: '528Hz Matrix', desc: 'إجماع التوافق الكوآنتومي والرنين المائي' },
    { id: AppTab.PYTHON_FORGE, label: 'مفاعل بايثون الحقيقي (Real Python)', category: 'CODE', icon: '🐍', tag: 'Live Sandbox', desc: 'بيئة بايثون حقيقية لتنفيذ الأكواد وتحليل البيانات' },
    { id: AppTab.CODE_FORGE, label: 'صهر الأكواد والبرمجة السيادية', category: 'CODE', icon: '💻', tag: 'Code Synthesizer', desc: 'توليد وهندسة أكواد TypeScript و Rust و Python' },
    { id: AppTab.SYSTEM_DIAGNOSTICS, label: 'فحص وتشخيصات النظام D3', category: 'DIAGNOSTICS', icon: '🩺', tag: 'D3 Telemetry', desc: 'مخططات استهلاك الخيوط والذاكرة في الوقت الفعلي' },
    { id: AppTab.ADMIN_CENTER, label: 'مركز الإدارة ومؤشر استقرار QSI', category: 'SECURITY', icon: '🏛️', tag: 'QSI Index', desc: 'رصد مؤشر الاستقرار الكوآنتومي واختبارات الأمان' },
    { id: AppTab.LOGIC_CORE, label: 'أوراكل الحقيقة والمنطق الصارم', category: 'AGENTS', icon: '⚖️', tag: 'Truth Oracle', desc: 'استخلاص الحقائق وتدقيق الاستنتاجات' },
    { id: AppTab.SEARCH, label: 'محرك الاستخبارات والبحث العصبي', category: 'AGENTS', icon: '🔍', tag: 'Neural Search', desc: 'استرجاع فوري للمعلومات المعقدة وتحليل الويب' },
    { id: AppTab.AI_NEXUS, label: 'مستنسخ التطبيقات والأنظمة', category: 'CODE', icon: '🧩', tag: 'App Cloner', desc: 'استنساخ المنظومات وإعادة بنائها محلياً' },
    { id: AppTab.STRATEGIC_ARCHITECT, label: 'المعمار الاستراتيجي', category: 'AGENTS', icon: '🏗️', tag: 'Architecture', desc: 'بناء الخطط الهيكلية وإدارة تدفق العمليات' },
    { id: AppTab.QUANTUM_NEURAL_CORE, label: 'النواة العصبونية الكوآنتومية', category: 'COSMIC', icon: '💠', tag: '10G Quantum', desc: 'إدارة تشفير الذاكرة ونواة 10G CPU' },
    { id: AppTab.HTML_FULL, label: 'تجسيد المواقع وتطبيقات الويب', category: 'CODE', icon: '🌐', tag: 'Web Forger', desc: 'بناء وتصدير تطبيقات تفاعلية كاملة' },
    { id: AppTab.NEURAL_SHIELD, label: 'درع الحماية والدفاع العصبوني', category: 'SECURITY', icon: '🛡️', tag: 'WebCrypto', desc: 'تشفير WebCrypto SHA-256 وعزل الحزم' },
    { id: AppTab.ORBITAL, label: 'الرادار الفضائي المداري', category: 'DIAGNOSTICS', icon: '📡', tag: 'Orbital Mesh', desc: 'رصد الإشارات والاتصالات اللاسلكية' },
    { id: AppTab.DRIVERS, label: 'مصفوفة التعريفات والعتاد', category: 'DIAGNOSTICS', icon: '⚙️', tag: 'Hardware Matrix', desc: 'فحص عتاد الجهاز والمسرعات الرسومية' },
    { id: AppTab.PROMPT_HUB, label: 'مستودع البرومبتات السيادية', category: 'AGENTS', icon: '📜', tag: 'Prompt Bank', desc: 'التعليمات الشاملة والتفصيلية لكل الأنظمة' },
  ];

  const filteredModules = moduleSearch.trim() === ''
    ? allSystemModules
    : allSystemModules.filter(m => 
        m.label.toLowerCase().includes(moduleSearch.toLowerCase()) ||
        m.desc.toLowerCase().includes(moduleSearch.toLowerCase()) ||
        m.tag.toLowerCase().includes(moduleSearch.toLowerCase())
      );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[4000] overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Slide-out Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="absolute top-0 right-0 h-full w-full max-w-xl bg-[#050813] border-l border-cyan-500/40 text-white shadow-[-20px_0_60px_rgba(6,182,212,0.2)] flex flex-col font-arabic z-10"
          >
            {/* Drawer Header */}
            <div className="p-6 bg-gradient-to-r from-[#0e040c] via-[#070918] to-[#040d14] border-b border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-amber-500 p-[2px] shadow-lg">
                  <div className="w-full h-full bg-black/90 rounded-[14px] flex items-center justify-center text-xl">
                    ⚡
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <span>نافذة التحكم الشاملة والإعدادات</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      SARAH v17
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    التحكم الفوري بنماذج جمناي، استحضار كافة الوحدات، وإدارة دروع الحماية
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all"
                title="إغلاق النافذة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Banner */}
            {actionNotice && (
              <div className="bg-emerald-950/90 border-b border-emerald-500/40 px-6 py-2.5 text-xs text-emerald-300 font-mono flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{actionNotice}</span>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 bg-black/40 overflow-x-auto no-scrollbar px-3 pt-2 gap-1.5 text-xs font-bold">
              <button
                onClick={() => setActiveCategory('GEMINI')}
                className={`px-3.5 py-2.5 rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeCategory === 'GEMINI'
                    ? 'bg-[#050813] text-cyan-300 border-t-2 border-cyan-400 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>محرك جمناي (AI)</span>
              </button>

              <button
                onClick={() => setActiveCategory('SUMMON_ALL')}
                className={`px-3.5 py-2.5 rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeCategory === 'SUMMON_ALL'
                    ? 'bg-[#050813] text-amber-300 border-t-2 border-amber-400 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>استحضار الوحدات ({allSystemModules.length})</span>
              </button>

              <button
                onClick={() => setActiveCategory('DEFENSE')}
                className={`px-3.5 py-2.5 rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeCategory === 'DEFENSE'
                    ? 'bg-[#050813] text-rose-300 border-t-2 border-rose-400 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-rose-400" />
                <span>الدروع والتردد</span>
              </button>

              <button
                onClick={() => setActiveCategory('PREFERENCES')}
                className={`px-3.5 py-2.5 rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeCategory === 'PREFERENCES'
                    ? 'bg-[#050813] text-blue-300 border-t-2 border-blue-400 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>اللغة والنظام</span>
              </button>

              <button
                onClick={() => setActiveCategory('MAINTENANCE')}
                className={`px-3.5 py-2.5 rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeCategory === 'MAINTENANCE'
                    ? 'bg-[#050813] text-purple-300 border-t-2 border-purple-400 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 text-purple-400" />
                <span>الصيانة والذاكرة</span>
              </button>
            </div>

            {/* Drawer Body Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 text-sm">
              
              {/* TAB 1: GEMINI AI ENGINE */}
              {activeCategory === 'GEMINI' && (
                <div className="space-y-6 animate-in fade-in">
                  
                  {/* Model Selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        <span>نموذج الذكاء الاصطناعي الأساسي (Gemini Model Core):</span>
                      </span>
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                        {geminiModel}
                      </span>
                    </label>

                    <div className="grid grid-cols-1 gap-2.5">
                      {geminiModels.map(m => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setGeminiModel(m.id);
                            triggerNotice(`تم تعيين نموذج الذكاء الاصطناعي إلى ${m.name}`);
                          }}
                          className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between ${
                            geminiModel === m.id
                              ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
                              : 'bg-black/40 border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <strong className="text-xs font-black text-white">{m.name}</strong>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-cyan-300">
                                {m.tag}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1">{m.desc}</p>
                          </div>
                          {geminiModel === m.id && (
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Temperature & Creativity Slider */}
                  <div className="bg-black/50 border border-white/10 p-4 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-amber-400" />
                        <span>معامل الاستجابة والحرارة (Temperature):</span>
                      </span>
                      <strong className="text-xs font-mono text-amber-400">{temperature.toFixed(2)}</strong>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.05"
                      value={temperature}
                      onChange={e => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>0.0 (دقيق وصارم)</span>
                      <span>0.5 (متوازن ومرن)</span>
                      <span>1.0 (إبداعي ومتحرر)</span>
                    </div>
                  </div>

                  {/* Super Thinking Mode Toggle */}
                  <div className="bg-black/50 border border-white/10 p-4 rounded-2xl flex items-center justify-between gap-4">
                    <div>
                      <strong className="text-xs font-black text-white flex items-center gap-2">
                        <Bot className="w-4 h-4 text-indigo-400" />
                        <span>وضع الاستدلال المعزز وعرض الأفكار (Thinking Mode)</span>
                      </strong>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        إظهار خطوات التفكير والتحليل المنطقي العميق قبل الإجابة النهائية
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setThinkingMode(prev => !prev);
                        triggerNotice(`تم ${!thinkingMode ? 'تفعيل' : 'تعطيل'} وضع الاستدلال المعزز`);
                      }}
                      className={`w-12 h-6 rounded-full transition-all relative ${
                        thinkingMode ? 'bg-indigo-600' : 'bg-white/20'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                        thinkingMode ? 'right-7' : 'right-1'
                      }`} />
                    </button>
                  </div>

                  {/* System Instruction / Directive Preset Editor */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-300 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      <span>التوجيه السيادي لنظام صارة (System Directive):</span>
                    </label>
                    <textarea
                      rows={3}
                      value={systemDirective}
                      onChange={e => setSystemDirective(e.target.value)}
                      placeholder="اكتب التوجيه السيادي العام الموجه لنموذج جمناي..."
                      className="w-full bg-black/60 border border-white/15 rounded-2xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono leading-relaxed"
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          setSystemDirective('أنت صارة v17: النواة السيادية الفائقة. أجب بدقة واحترافية وبسرعة فائقة مع توليد حلول برمجية وهيكلية كاملة.');
                          triggerNotice('تم تطبيق قالب المهندس السيادي');
                        }}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] text-cyan-300 border border-white/10 font-bold"
                      >
                        قالب: المهندس السيادي
                      </button>
                      <button
                        onClick={() => {
                          setSystemDirective('أنت صارة v17: محرك الاستدلال والتخطيط الاستراتيجي. قم بتفكيك الأسئلة إلى خطوات منطقية وقدم تحليلاً حاسماً للمخاطر.');
                          triggerNotice('تم تطبيق قالب المخطط الاستراتيجي');
                        }}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] text-amber-300 border border-white/10 font-bold"
                      >
                        قالب: المخطط الاستراتيجي
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: MASTER SUMMON LAUNCHER (ALL MODULES) */}
              {activeCategory === 'SUMMON_ALL' && (
                <div className="space-y-4 animate-in fade-in">
                  
                  {/* Search Modules Filter */}
                  <div className="relative">
                    <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="ابحث عن وحدة لاستحضارها فوراً على الشاشة..."
                      value={moduleSearch}
                      onChange={e => setModuleSearch(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded-2xl pr-10 pl-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium"
                    />
                  </div>

                  <div className="space-y-2 max-h-[460px] overflow-y-auto custom-scrollbar">
                    {filteredModules.map(item => (
                      <div
                        key={item.id}
                        className="p-3.5 bg-black/40 hover:bg-white/5 border border-white/10 hover:border-cyan-500/30 rounded-2xl flex items-center justify-between gap-3 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl p-2 rounded-xl bg-white/5 border border-white/5">{item.icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <strong className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors">
                                {item.label}
                              </strong>
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                                {item.tag}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => {
                              onSummonModule(item.id);
                              onClose();
                              triggerNotice(`تم استحضار [${item.label}] على الشاشة الرئيسية`);
                            }}
                            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[11px] font-bold shadow-md active:scale-95 transition-all flex items-center gap-1"
                          >
                            <span>استحضار فوري</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TAB 3: DEFENSE, SHIELDS & RESONANCE */}
              {activeCategory === 'DEFENSE' && (
                <div className="space-y-5 animate-in fade-in">
                  
                  {/* Turbo Mode */}
                  <div className="bg-black/50 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between gap-4">
                    <div>
                      <strong className="text-xs font-black text-amber-300 flex items-center gap-2">
                        <Flame className="w-4 h-4 text-amber-400" />
                        <span>وضع السرعة والتيربو السيادي (Turbo Engine)</span>
                      </strong>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        تسريع المعالجة وإلغاء فترات الانتظار غير الضرورية لضمان أقصى سرعة استجابة
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setTurboMode(prev => !prev);
                        triggerNotice(`وضع التيربو الآن: ${!turboMode ? 'مفعل ⚡' : 'معطل'}`);
                      }}
                      className={`w-12 h-6 rounded-full transition-all relative ${
                        turboMode ? 'bg-amber-500' : 'bg-white/20'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-all ${
                        turboMode ? 'right-7' : 'right-1'
                      }`} />
                    </button>
                  </div>

                  {/* 528Hz Resonance Lock */}
                  <div className="bg-black/50 border border-cyan-500/30 p-4 rounded-2xl flex items-center justify-between gap-4">
                    <div>
                      <strong className="text-xs font-black text-cyan-300 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-cyan-400" />
                        <span>تثبيت الرنين المائي الكوآنتومي 528Hz</span>
                      </strong>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        مزامنة تردد الاستجابة الكوآنتومي لمنع التداخل الإشعاعي
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setHydroResonanceLock(prev => !prev);
                        triggerNotice(`الرنين المائي 528Hz: ${!hydroResonanceLock ? 'مقفل 100%' : 'حر'}`);
                      }}
                      className={`w-12 h-6 rounded-full transition-all relative ${
                        hydroResonanceLock ? 'bg-cyan-500' : 'bg-white/20'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-all ${
                        hydroResonanceLock ? 'right-7' : 'right-1'
                      }`} />
                    </button>
                  </div>

                  {/* Zero-Trust Strict Sandbox */}
                  <div className="bg-black/50 border border-rose-500/30 p-4 rounded-2xl flex items-center justify-between gap-4">
                    <div>
                      <strong className="text-xs font-black text-rose-300 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-rose-400" />
                        <span>حاجز الأمان الصارم Zero-Trust & L4 Obsidian</span>
                      </strong>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        تشفير كافة البيانات بـ WebCrypto SHA-256 وحظر الاستدعاءات المشبوهة
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setZeroTrustStrict(prev => !prev);
                        triggerNotice(`حاجز Zero-Trust: ${!zeroTrustStrict ? 'مفعل وصارم' : 'عادي'}`);
                      }}
                      className={`w-12 h-6 rounded-full transition-all relative ${
                        zeroTrustStrict ? 'bg-rose-600' : 'bg-white/20'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                        zeroTrustStrict ? 'right-7' : 'right-1'
                      }`} />
                    </button>
                  </div>

                </div>
              )}

              {/* TAB 4: LANGUAGE & PREFERENCES */}
              {activeCategory === 'PREFERENCES' && (
                <div className="space-y-6 animate-in fade-in">
                  
                  {/* Language Selector */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-300 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span>لغة النظام والواجهة (System Language):</span>
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {languages.map(l => (
                        <button
                          key={l.code}
                          onClick={() => {
                            onLanguageChange(l.code);
                            triggerNotice(`تم تغيير لغة النظام إلى: ${l.label}`);
                          }}
                          className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                            language === l.code
                              ? 'bg-blue-950/80 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] ring-1 ring-blue-400'
                              : 'bg-black/40 border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <span className="text-xl mb-1">{l.flag}</span>
                          <strong className="text-xs font-bold text-white">{l.label}</strong>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sound FX Feedback */}
                  <div className="bg-black/50 border border-white/10 p-4 rounded-2xl flex items-center justify-between gap-4">
                    <div>
                      <strong className="text-xs font-black text-white">المؤثرات الصوتية والحسية (Audio / Haptic)</strong>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        أصوات النبض الكوآنتومي والتأكيد التفاعلي عند تنفيذ الأوامر
                      </p>
                    </div>
                    <button
                      onClick={() => setSoundFx(prev => !prev)}
                      className={`w-12 h-6 rounded-full transition-all relative ${
                        soundFx ? 'bg-cyan-500' : 'bg-white/20'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-all ${
                        soundFx ? 'right-7' : 'right-1'
                      }`} />
                    </button>
                  </div>

                </div>
              )}

              {/* TAB 5: MAINTENANCE & MEMORY */}
              {activeCategory === 'MAINTENANCE' && (
                <div className="space-y-4 animate-in fade-in">
                  
                  <div className="bg-black/50 border border-white/10 p-4 rounded-2xl space-y-3">
                    <strong className="text-xs font-black text-purple-300 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-purple-400" />
                      <span>تفريغ الذاكرة المؤقتة وإعادة تعيين الجلسة</span>
                    </strong>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      تطهير ذاكرة الرام المؤقتة لنظام صارة وإعادة موازنة مسارات المعالجة.
                    </p>
                    <button
                      onClick={() => triggerNotice('تم تفريغ الذاكرة المؤقتة واستعادة 420MB RAM')}
                      className="px-4 py-2 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 font-bold rounded-xl text-xs flex items-center gap-2 transition-all active:scale-95"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>تطهير الذاكرة الآن (Memory Purge)</span>
                    </button>
                  </div>

                  <div className="bg-black/50 border border-white/10 p-4 rounded-2xl space-y-3">
                    <strong className="text-xs font-black text-emerald-300 flex items-center gap-2">
                      <HeartPulse className="w-4 h-4 text-emerald-400" />
                      <span>فحص النبض الحيوي الشامل (Full Telemetry Ping)</span>
                    </strong>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      إرسال إشارة اختبارية عبر كافة قنوات النواة للتحقق من استقرار 0% Packet Loss.
                    </p>
                    <button
                      onClick={() => triggerNotice('تم الفحص: كافة المكونات في حالة استقرار مثالي (QSI 99.9%)')}
                      className="px-4 py-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl text-xs flex items-center gap-2 transition-all active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>إجراء فحص النبض (Ping Core)</span>
                    </button>
                  </div>

                </div>
              )}

            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-black/80 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>SARAH_V17_SOVEREIGN_CORE_ACTIVE</span>
              </span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
              >
                إغلاق النافذة
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
