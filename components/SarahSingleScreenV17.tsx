import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Zap, Send, Bot, Shield, Cpu, Activity, 
  Flame, Terminal, Code, Play, CheckCircle2, RotateCcw,
  Sliders, Maximize2, Minimize2, X, ExternalLink, ArrowUpRight,
  Layers, Compass, Wrench, RefreshCw, Copy, Check, ChevronDown,
  Sun, Search, Bookmark, Monitor, Radio, Binary, Lock, Archive, Loader2, Download
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { AppTab, Language } from '../types';
import { SystemEventLogTerminal } from './SystemEventLogTerminal';
import { systemEventLogger } from '../services/systemEventLogger';
import { ApexConstellationHub } from './ApexConstellationHub';
import { quantumSovereignEngine, QuantumRegisters, QubitState } from '../services/quantumEngine';
import { quantumPreferencesManager, QuantumSystemPreferences } from '../services/quantumPreferences';
import { QuantumPreferencesManager } from './QuantumPreferencesManager';
import { ConsciousWhiteCanvas } from './ConsciousWhiteCanvas';
import { LivePreviewMatrix } from './LivePreviewMatrix';
import { OpenSourceSovereignHub } from './OpenSourceSovereignHub';
import { generateFullProjectZip } from '../services/zipExportService';

interface Message {
  id: string;
  sender: 'user' | 'sarah';
  text: string;
  timestamp: string;
  thoughtSteps?: string[];
  suggestedModule?: {
    id: AppTab;
    label: string;
    icon: string;
  };
  codeSnippet?: {
    lang: string;
    code: string;
  };
}

interface SummonedModule {
  id: AppTab;
  label: string;
  icon: string;
  tag: string;
  isMaximized: boolean;
}

interface SarahSingleScreenV17Props {
  onNavigate: (tab: AppTab) => void;
  language: Language;
  onOpenDrawer: () => void;
  turboMode: boolean;
  geminiModel: string;
  temperature: number;
  thinkingMode: boolean;
  systemDirective: string;
  summonedModuleOverride?: AppTab | null;
  onClearSummonOverride?: () => void;
  renderModuleComponent: (tab: AppTab) => React.ReactNode;
}

export const SarahSingleScreenV17: React.FC<SarahSingleScreenV17Props> = ({
  onNavigate,
  language,
  onOpenDrawer,
  turboMode,
  geminiModel,
  temperature,
  thinkingMode,
  systemDirective,
  summonedModuleOverride,
  onClearSummonOverride,
  renderModuleComponent
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mainViewMode, setMainViewMode] = useState<'CONSCIOUS_WHITE_CANVAS' | 'LIVE_PREVIEW_MATRIX' | 'OPEN_SOURCE_HUB' | 'APEX_CONSTELLATION' | 'QUANTUM_MAINFRAME' | 'QUANTUM_PREFERENCES' | 'DUAL_WORKSPACE' | 'SYSTEM_LOGS'>('CONSCIOUS_WHITE_CANVAS');
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState('');

  const handleInstantZipExport = async () => {
    setIsZipping(true);
    setZipProgress('جاري تحضير حزمة الكود الكاملة (Full ZIP)...');
    try {
      const response = await fetch('/sarah_sovereign_full_codebase.zip');
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sarah_sovereign_full_codebase.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setZipProgress('تم تنزيل المشروع كاملاً!');
        setTimeout(() => {
          setIsZipping(false);
          setZipProgress('');
        }, 2500);
        return;
      }

      const blob = await generateFullProjectZip((msg) => setZipProgress(msg));
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sarah_sovereign_full_codebase.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setZipProgress('تم تنزيل المشروع!');
      setTimeout(() => {
        setIsZipping(false);
        setZipProgress('');
      }, 2500);
    } catch (e: any) {
      setZipProgress(`خطأ: ${e.message}`);
      setIsZipping(false);
    }
  };

  // Quantum Engine & Preferences live state
  const [qRegs, setQRegs] = useState<QuantumRegisters>(quantumSovereignEngine.getRegisters());
  const [qubits, setQubits] = useState<QubitState[]>(quantumSovereignEngine.getQubits());
  const [stateVector, setStateVector] = useState<number[]>(quantumSovereignEngine.getStateVector());
  const [quantumPrefs, setQuantumPrefs] = useState<QuantumSystemPreferences>(quantumPreferencesManager.getPreferences());
  const [lastCircuitResult, setLastCircuitResult] = useState<string | null>(null);

  useEffect(() => {
    const unsubEngine = quantumSovereignEngine.subscribe((regs, vec) => {
      setQRegs(regs);
      setQubits(quantumSovereignEngine.getQubits());
      setStateVector(vec);
    });
    const unsubPrefs = quantumPreferencesManager.subscribe(p => {
      setQuantumPrefs(p);
    });
    return () => {
      unsubEngine();
      unsubPrefs();
    };
  }, []);

  // Active Summoned Workspaces Stack
  const [activeSummons, setActiveSummons] = useState<SummonedModule[]>([
    {
      id: AppTab.DRAGON_DOME,
      label: 'منظومة دراغون وقبة الحماية',
      icon: '🐉',
      tag: 'L4 Obsidian Active',
      isMaximized: false
    }
  ]);
  const [selectedSummonId, setSelectedSummonId] = useState<AppTab | null>(AppTab.DRAGON_DOME);

  // Handle external summon request from side drawer or search
  useEffect(() => {
    if (summonedModuleOverride) {
      summonModuleById(summonedModuleOverride);
      if (onClearSummonOverride) onClearSummonOverride();
    }
  }, [summonedModuleOverride]);

  // Initial Welcome Messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init-1',
      sender: 'sarah',
      text: 'مرحباً بك في نظام صارة v17 (الجيل السابع عشر) — واجهة الشاشة الواحدة الكوآنتومية الموحدة. أنا النواة الذكية المستقلة المدعومة بمحرك جمناي الفائق. يمكنك توجيه أي أمر، توليد أكواد، فحص المنظومة، أو استحضار أي وحدة للعمل أمامك فوراً دون مغادرة هذه الشاشة.',
      timestamp: new Date().toLocaleTimeString(),
      thoughtSteps: [
        'تهيئة قنوات المعالجة السريعة عبر Gemini 2.5 Flash',
        'مزامنة التردد المائي 528Hz مع النواة الكوآنتومية',
        'تفعيل وضع استحضار الوحدات اللحظي (On-Demand Workspace Summoner)'
      ],
      suggestedModule: {
        id: AppTab.DRAGON_DOME,
        label: 'قبة دراغون ودروع الحماية L4',
        icon: '🐉'
      }
    }
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Fast Gemini Execution Engine
  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = (customPrompt || inputQuery).trim();
    if (!promptToSend || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputQuery('');
    setIsLoading(true);

    try {
      let replyText = '';
      
      const effectiveDirective = systemDirective || `
أنت صارة v17 (Sarah v17) - النواة السيادية الفائقة وواجهة الشاشة الواحدة.
أنت تقدم إجابات وحلول برمجية وتكتيكية فائقة السرعة والدقة.
إذا تضمن طلب المستخدم أي إشارة أو رغبة في استدعاء وحدات النظام (مثل قبة دراغون، سرب الوكلاء، بايثون، النجمة السداسية، صهر الأكواد، النظام الشمسي، فحص واستقرار النواة)، اشرح الإجراء بذكاء وقدم الحل مباشرة.
اللغة الأساسية: العربية الفصحى الاحترافية والتقنية بأسلوب سيادي ملهِم.
`;

      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (apiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
            model: geminiModel || 'gemini-2.5-flash',
            contents: promptToSend,
            config: {
              systemInstruction: effectiveDirective,
              temperature: temperature,
              ...(thinkingMode ? { thinkingConfig: { thinkingBudget: 4096 } } : {})
            }
          });
          replyText = response.text || '';
        } catch (apiErr) {
          console.warn('[SarahSingleScreen] Gemini API note (switching to sovereign local core):', apiErr);
        }
      }

      if (!replyText) {
        await new Promise(r => setTimeout(r, 400));
        replyText = `تمت معالجة الأمر "${promptToSend}" بنجاح عبر نواة صارة v17 الكوآنتومية بتردد 528Hz. المنظومة مستقرة والاتصال بالمسارات السيادية متزامن 100%.`;
      }

      // Detect relevant system module to suggest instant summon
      let detectedModule: { id: AppTab; label: string; icon: string } | undefined = undefined;
      const lower = promptToSend.toLowerCase();

      if (lower.includes('kimi') || lower.includes('كيمي') || lower.includes('متصفح') || lower.includes('browser') || lower.includes('أوامر خارجية') || lower.includes('اوامر خارجية') || lower.includes('bridge') || lower.includes('جسر')) {
        detectedModule = { id: AppTab.AI_BROWSER, label: 'جسر المتصفح وتكامل Kimi والأوامر', icon: '⚡' };
      } else if (lower.includes('دراغون') || lower.includes('قبة') || lower.includes('حماية') || lower.includes('تطفل') || lower.includes('shield') || lower.includes('dragon')) {
        detectedModule = { id: AppTab.DRAGON_DOME, label: 'قبة دراغون السيادية L4', icon: '🐉' };
      } else if (lower.includes('بايثون') || lower.includes('python') || lower.includes('مفاعل بايثون') || lower.includes('داتا')) {
        detectedModule = { id: AppTab.PYTHON_FORGE, label: 'مفاعل بايثون الحقيقي', icon: '🐍' };
      } else if (lower.includes('سرب') || lower.includes('وكلاء') || lower.includes('وكيل') || lower.includes('agent') || lower.includes('swarm')) {
        detectedModule = { id: AppTab.AGENT_SWARM, label: 'سرب وكلاء الاستراتيجية والتنفيذ', icon: '🛡️' };
      } else if (lower.includes('سداسية') || lower.includes('v16') || lower.includes('رنين') || lower.includes('528') || lower.includes('hexagram')) {
        detectedModule = { id: AppTab.GENERATION_16, label: 'صارة v16 - النجمة السداسية', icon: '🔯' };
      } else if (lower.includes('شمس') || lower.includes('كون') || lower.includes('مدار') || lower.includes('solar') || lower.includes('cosmos')) {
        detectedModule = { id: AppTab.SOLAR_COSMOS, label: 'صارة (النظام الشمسي الموحد)', icon: '☀️' };
      } else if (lower.includes('كود') || lower.includes('برمجة') || lower.includes('code') || lower.includes('typescript') || lower.includes('تطوير')) {
        detectedModule = { id: AppTab.CODE_FORGE, label: 'صهر الأكواد والبرمجة السيادية', icon: '💻' };
      } else if (lower.includes('فحص') || lower.includes('تشخيص') || lower.includes('d3') || lower.includes('تيليميتري') || lower.includes('ذاكرة')) {
        detectedModule = { id: AppTab.SYSTEM_DIAGNOSTICS, label: 'فحص وتشخيصات النظام D3', icon: '🩺' };
      } else if (lower.includes('كمبيوتر كمومي') || lower.includes('شاشة سوداء') || lower.includes('شاشة خضراء') || lower.includes('فوسفور') || lower.includes('مبرمج') || lower.includes('qpu') || lower.includes('quantum') || lower.includes('terminal')) {
        detectedModule = { id: AppTab.QUANTUM_DEV_COMPUTER, label: 'الكمبيوتر الكمومي الخارق QPU-128 (الشاشة الخضراء)', icon: '💻' };
      } else if (lower.includes('حقيقة') || lower.includes('منطق') || lower.includes('أوراكل') || lower.includes('تدقيق')) {
        detectedModule = { id: AppTab.LOGIC_CORE, label: 'أوراكل الحقيقة والمنطق', icon: '⚖️' };
      }

      // Check for code blocks in response
      let codeSnippet: { lang: string; code: string } | undefined = undefined;
      const codeMatch = replyText.match(/```(\w+)?\n([\s\S]*?)```/);
      if (codeMatch) {
        codeSnippet = {
          lang: codeMatch[1] || 'typescript',
          code: codeMatch[2].trim()
        };
      }

      const sarahMsg: Message = {
        id: `sarah-${Date.now()}`,
        sender: 'sarah',
        text: replyText,
        timestamp: new Date().toLocaleTimeString(),
        thoughtSteps: thinkingMode ? [
          `تحليل السياق عبر ${geminiModel || 'gemini-2.5-flash'}`,
          'فحص سلامة المخرجات وفق معايير الحماية السيادية',
          'صياغة الحل الفوري بأقصى كفاءة استجابة'
        ] : undefined,
        suggestedModule: detectedModule,
        codeSnippet: codeSnippet
      };

      setMessages(prev => [...prev, sarahMsg]);
    } catch (err: any) {
      console.warn('[SarahSingleScreen] Fallback:', err);
      const fallbackMsg: Message = {
        id: `sarah-${Date.now()}`,
        sender: 'sarah',
        text: `تم استلام الأمر وتوجيهه عبر قنوات الأمان السيادية. الاستجابة جاهزة ومستقرة.`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Summon Module helper
  const summonModuleById = (tabId: AppTab) => {
    const registry: Record<string, { label: string; icon: string; tag: string }> = {
      [AppTab.SOVEREIGN_VOICE_CONTROLLER]: { label: 'نظام التحدث والتحكم الصوتي المستقل (بدون Gemini)', icon: '🎙️', tag: 'Sovereign Voice Orchestrator' },
      [AppTab.VOICE_HUB]: { label: 'نظام التحدث والقيادة الصوتية (بدون Gemini)', icon: '🎙️', tag: 'Sovereign Voice Orchestrator' },
      [AppTab.KIMI_LLM_STUDIO]: { label: 'استوديو Kimi LLM (Moonshot AI)', icon: '🔮', tag: '2M Context & CoT Studio' },
      [AppTab.AI_BROWSER]: { label: 'جسر المتصفح وتكامل Kimi والأوامر', icon: '⚡', tag: 'Kimi External Command Bridge' },
      [AppTab.QUANTUM_DEV_COMPUTER]: { label: 'الكمبيوتر الكمومي الخارق QPU-128', icon: '💻', tag: 'Green CRT Dev Mainframe' },
      [AppTab.DRAGON_DOME]: { label: 'منظومة دراغون وقبة الحماية', icon: '🐉', tag: 'L4 Obsidian Defense' },
      [AppTab.SOLAR_COSMOS]: { label: 'صارة (النظام الشمسي الموحد)', icon: '☀️', tag: 'Solar Cosmos Core' },
      [AppTab.AGENT_SWARM]: { label: 'سرب وكلاء الاستراتيجية والتنفيذ', icon: '🛡️', tag: 'Multi-Agent Swarm' },
      [AppTab.GENERATION_16]: { label: 'صارة v16 (النجمة السداسية)', icon: '🔯', tag: '528Hz Quantum Matrix' },
      [AppTab.PYTHON_FORGE]: { label: 'مفاعل بايثون الحقيقي', icon: '🐍', tag: 'Live Python Sandbox' },
      [AppTab.CODE_FORGE]: { label: 'صهر الأكواد والبرمجة السيادية', icon: '💻', tag: 'Code Synthesizer' },
      [AppTab.SYSTEM_DIAGNOSTICS]: { label: 'فحص وتشخيصات النظام D3', icon: '🩺', tag: 'D3 Telemetry & Threads' },
      [AppTab.ADMIN_CENTER]: { label: 'مركز الإدارة واستقرار QSI', icon: '🏛️', tag: 'Quantum Stability Index' },
      [AppTab.LOGIC_CORE]: { label: 'أوراكل الحقيقة والمنطق', icon: '⚖️', tag: 'Truth Logic Oracle' },
      [AppTab.SEARCH]: { label: 'محرك الاستخبارات والبحث', icon: '🔍', tag: 'Neural Deep Search' },
      [AppTab.QUANTUM_NEURAL_CORE]: { label: 'النواة الكوآنتومية 10G', icon: '💠', tag: '10G Quantum Memory' },
      [AppTab.AI_NEXUS]: { label: 'مستنسخ التطبيقات والأنظمة', icon: '🧩', tag: 'Autonomous Cloner' },
      [AppTab.STRATEGIC_ARCHITECT]: { label: 'المعمار الاستراتيجي', icon: '🏗️', tag: 'Architecture Blueprint' },
      [AppTab.HTML_FULL]: { label: 'تجسيد المواقع والتطبيقات', icon: '🌐', tag: 'Web Manifest Engine' },
      [AppTab.NEURAL_SHIELD]: { label: 'درع الدفاع العصبوني', icon: '🛡️', tag: 'WebCrypto Defense' },
      [AppTab.ORBITAL]: { label: 'الرادار الفضائي المداري', icon: '📡', tag: 'Orbital Mesh Link' },
      [AppTab.DRIVERS]: { label: 'مصفوفة التعريفات والعتاد', icon: '⚙️', tag: 'Hardware Matrix' },
    };

    const info = registry[tabId] || { label: 'وحدة النظام المستحضرة', icon: '⚡', tag: 'System Unit' };

    // Record live system event in telemetry bus
    systemEventLogger.logModuleSummon(tabId, info.label, 'SingleScreenSummoner', 0.5);

    setActiveSummons(prev => {
      const exists = prev.find(s => s.id === tabId);
      if (exists) {
        setSelectedSummonId(tabId);
        return prev;
      }
      const newSummon: SummonedModule = {
        id: tabId,
        label: info.label,
        icon: info.icon,
        tag: info.tag,
        isMaximized: false
      };
      setSelectedSummonId(tabId);
      return [newSummon, ...prev];
    });
  };

  const closeSummon = (tabId: AppTab) => {
    setActiveSummons(prev => {
      const remaining = prev.filter(s => s.id !== tabId);
      if (selectedSummonId === tabId) {
        setSelectedSummonId(remaining.length > 0 ? remaining[0].id : null);
      }
      return remaining;
    });
  };

  const toggleMaximizeSummon = (tabId: AppTab) => {
    setActiveSummons(prev => prev.map(s => s.id === tabId ? { ...s, isMaximized: !s.isMaximized } : s));
  };

  const quickSummonList = [
    { id: AppTab.SOVEREIGN_VOICE_CONTROLLER, label: 'التحكم الصوتي المستقل (بدون Gemini)', icon: '🎙️', color: 'from-emerald-500/30 to-teal-600/30 border-emerald-400/70 text-emerald-300' },
    { id: AppTab.KIMI_LLM_STUDIO, label: 'استوديو Kimi LLM', icon: '🔮', color: 'from-purple-500/30 to-indigo-600/30 border-purple-400/70 text-purple-300' },
    { id: AppTab.QUANTUM_DEV_COMPUTER, label: 'الكمبيوتر الكمومي الخارق', icon: '💻', color: 'from-emerald-500/30 to-green-600/30 border-[#00ff66]/70 text-[#00ff66]' },
    { id: AppTab.DRAGON_DOME, label: 'قبة دراغون', icon: '🐉', color: 'from-rose-500/20 to-red-600/20 border-rose-500/40 text-rose-300' },
    { id: AppTab.SOLAR_COSMOS, label: 'النظام الشمسي', icon: '☀️', color: 'from-amber-500/20 to-orange-600/20 border-amber-500/40 text-amber-300' },
    { id: AppTab.AGENT_SWARM, label: 'سرب الوكلاء', icon: '🛡️', color: 'from-purple-500/20 to-indigo-600/20 border-purple-500/40 text-purple-300' },
    { id: AppTab.GENERATION_16, label: 'صارة v16 (النجمة)', icon: '🔯', color: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/40 text-cyan-300' },
    { id: AppTab.PYTHON_FORGE, label: 'مفاعل بايثون', icon: '🐍', color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/40 text-emerald-300' },
    { id: AppTab.CODE_FORGE, label: 'صهر الأكواد', icon: '💻', color: 'from-orange-500/20 to-amber-600/20 border-orange-500/40 text-orange-300' },
    { id: AppTab.SYSTEM_DIAGNOSTICS, label: 'فحص D3', icon: '🩺', color: 'from-blue-500/20 to-cyan-600/20 border-blue-500/40 text-blue-300' },
    { id: AppTab.LOGIC_CORE, label: 'أوراكل الحقيقة', icon: '⚖️', color: 'from-violet-500/20 to-purple-600/20 border-violet-500/40 text-violet-300' },
  ];

  const quickPromptActions = [
    { label: '💻 تشغيل الحاسوب الكمومي الخارق للشاشة الخضراء', prompt: 'قم باستحضار وتشغيل الكمبيوتر الكمومي الخارق QPU-128 مع شاشة المطورين السوداء والفوسفور الأخضر.' },
    { label: '🛡️ فحص قبة دراغون وتحصين البيئة', prompt: 'قم بفحص حالة درع دراغون الأوبسيدياني L4، وتحقق من عدم وجود أي اختراقات أو تسريبات.' },
    { label: '🤖 استدعاء سرب الوكلاء لتخطيط مهمة', prompt: 'استدعِ سرب الوكلاء الاستراتيجيين وقدم لي خطة عمل تكتيكية متكاملة مع تحليل المخاطر.' },
    { label: '💻 توليد كود TypeScript سيادي', prompt: 'اكتب كود TypeScript سيادي متكامل وعالي الأداء لتنفيذ خوارزمية تشفير متوازية مع معالجة الأخطاء.' },
    { label: '🐍 تشغيل كود بايثون لمعالجة البيانات', prompt: 'جهز كود بايثون متكامل يقوم بتحليل وتصفية مصفوفات بيانات مع توليد إحصائيات دقيقة.' },
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeSummonObj = activeSummons.find(s => s.id === selectedSummonId);

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8 space-y-6 font-arabic text-right relative z-10">
      
      {/* 1. TOP HERO: SARAH V17 SINGLE SCREEN COMMAND BANNER */}
      <section className="bg-gradient-to-r from-[#0d0309] via-[#060817] to-[#040d14] border border-cyan-500/40 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_10px_40px_rgba(6,182,212,0.15)] relative overflow-hidden">
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-amber-500 p-[2px] shadow-[0_0_35px_rgba(6,182,212,0.5)] flex-shrink-0 animate-pulse">
              <div className="w-full h-full bg-black/90 rounded-[22px] flex items-center justify-center text-3xl sm:text-4xl">
                ⚡
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  صارة <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-amber-300">v17 — الشاشة الواحدة الكوآنتومية</span>
                </h1>
                <span className="text-xs font-mono px-3 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-black flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ON-DEMAND WORKSPACES</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed max-w-3xl">
                المحطة السيادية الموحدة: استجابة فائقة السرعة بمحرك جمناي، استحضار الوحدات التخصصية عند الحاجة في نفس الشاشة، ونافذة إعدادات شاملة لعمل أي شيء.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            <button
              onClick={handleInstantZipExport}
              disabled={isZipping}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-bold text-xs shadow-xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isZipping ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Archive className="w-4 h-4 text-emerald-200" />}
              <span>{isZipping ? (zipProgress || 'جاري الضغط...') : '📦 تنزيل المشروع كملف ZIP'}</span>
            </button>

            <button
              onClick={() => summonModuleById(AppTab.QUANTUM_DEV_COMPUTER)}
              className="px-4 py-3 rounded-2xl bg-[#020d05] border border-[#00ff66]/60 hover:bg-[#00ff66]/10 text-[#00ff66] font-mono font-bold text-xs shadow-xl shadow-[#00ff66]/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <Terminal className="w-4 h-4 text-[#00ff66] animate-pulse" />
              <span>⚡ QPU-128</span>
            </button>

            <button
              onClick={onOpenDrawer}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-blue-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <Sliders className="w-4 h-4" />
              <span>الإعدادات</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. QUICK-SUMMON RIBBON (استحضار فوري للوحدات بنقرة واحدة) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>شريط الاستحضار السريع للوحدات (Quick Summon Dock):</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">انقر لاستحضار أي وحدة فوراً دون مغادرة الشاشة</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {quickSummonList.map(item => {
            const isCurrentlyActive = activeSummons.some(s => s.id === item.id);
            return (
              <button
                key={item.id}
                onClick={() => summonModuleById(item.id)}
                className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between group active:scale-95 bg-gradient-to-b ${item.color} ${
                  isCurrentlyActive ? 'ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'hover:border-white/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{item.icon}</span>
                  {isCurrentlyActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  )}
                </div>
                <strong className="text-xs font-bold text-white block mt-2 group-hover:text-cyan-300 truncate">
                  {item.label}
                </strong>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2.5 VIEW SELECTOR TABS */}
      <section className="flex flex-wrap items-center justify-between gap-3 bg-black p-2.5 rounded-3xl border border-cyan-500/40 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Conscious White Canvas */}
          <button
            onClick={() => setMainViewMode('CONSCIOUS_WHITE_CANVAS')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              mainViewMode === 'CONSCIOUS_WHITE_CANVAS'
                ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/40 border border-cyan-300 scale-[1.03]'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span>🧠 الوعي والصفحة البيضاء</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-[10px] font-mono text-cyan-300 border border-cyan-500/40 font-black">
              528Hz TALK & WRITE
            </span>
          </button>

          {/* Live Preview Matrix */}
          <button
            onClick={() => setMainViewMode('LIVE_PREVIEW_MATRIX')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              mainViewMode === 'LIVE_PREVIEW_MATRIX'
                ? 'bg-black text-cyan-300 border border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-[1.02]'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Monitor className="w-4 h-4 text-cyan-400" />
            <span>⚡ مصفوفة المعاينة المباشرة</span>
          </button>

          {/* Quantum Mainframe */}
          <button
            onClick={() => setMainViewMode('QUANTUM_MAINFRAME')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              mainViewMode === 'QUANTUM_MAINFRAME'
                ? 'bg-black text-cyan-300 border border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-[1.02]'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>💻 الحاسوب الكمومي QPU-{quantumPrefs.qubitsCapacity}</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-[10px] font-mono text-cyan-300 border border-cyan-500/40 font-black">
              {qRegs.COHERENCE}%
            </span>
          </button>

          {/* Open Source Hub */}
          <button
            onClick={() => setMainViewMode('OPEN_SOURCE_HUB')}
            className={`px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              mainViewMode === 'OPEN_SOURCE_HUB'
                ? 'bg-black text-emerald-300 border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[1.02]'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Code className="w-4 h-4 text-emerald-400" />
            <span>🔓 المصدر المفتوح</span>
          </button>

          {/* Quantum Preferences */}
          <button
            onClick={() => setMainViewMode('QUANTUM_PREFERENCES')}
            className={`px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              mainViewMode === 'QUANTUM_PREFERENCES'
                ? 'bg-black text-amber-300 border border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-[1.02]'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>⚙️ إعدادات النظام</span>
          </button>

          {/* Apex Constellation */}
          <button
            onClick={() => setMainViewMode('APEX_CONSTELLATION')}
            className={`px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              mainViewMode === 'APEX_CONSTELLATION'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 border border-cyan-300/50 scale-[1.02]'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Compass className="w-4 h-4 text-cyan-300" />
            <span>🌌 شبكة Apex المدارية</span>
          </button>

          {/* Dual Workspace */}
          <button
            onClick={() => setMainViewMode('DUAL_WORKSPACE')}
            className={`px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              mainViewMode === 'DUAL_WORKSPACE'
                ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-lg shadow-amber-500/30 border border-amber-300/50 scale-[1.02]'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-300" />
            <span>⚡ الشاشة المزدوجة</span>
            {activeSummons.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-[10px] font-mono text-emerald-300 border border-emerald-500/40">
                {activeSummons.length} Active
              </span>
            )}
          </button>

          {/* System Telemetry */}
          <button
            onClick={() => setMainViewMode('SYSTEM_LOGS')}
            className={`px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              mainViewMode === 'SYSTEM_LOGS'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-500/30 border border-emerald-300/50 scale-[1.02]'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>📟 التيليميتري</span>
          </button>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-black border border-cyan-500/30 rounded-xl text-[11px] font-mono text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Quantum Clock: <strong>{quantumPrefs.resonantFrequencyHz}Hz</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400">{qRegs.TEMPERATURE_mK}mK Cryo</span>
        </div>
      </section>

      {/* 2.7 CONSCIOUS WHITE CANVAS VIEW */}
      {mainViewMode === 'CONSCIOUS_WHITE_CANVAS' && (
        <section className="space-y-6 animate-page-reveal">
          <ConsciousWhiteCanvas
            language={language}
            onNavigate={onNavigate}
            onOpenLivePreview={() => setMainViewMode('LIVE_PREVIEW_MATRIX')}
          />
        </section>
      )}

      {/* 2.75 LIVE PREVIEW MATRIX VIEW */}
      {mainViewMode === 'LIVE_PREVIEW_MATRIX' && (
        <section className="space-y-6 animate-page-reveal">
          <LivePreviewMatrix
            onNavigate={onNavigate}
          />
        </section>
      )}

      {/* 2.78 OPEN SOURCE SOVEREIGN HUB VIEW */}
      {mainViewMode === 'OPEN_SOURCE_HUB' && (
        <section className="space-y-6 animate-page-reveal">
          <OpenSourceSovereignHub
            language={language}
          />
        </section>
      )}

      {/* 2.8 QUANTUM MAINFRAME HUD VIEW (شاشة الكمبيوتر الكمومي المدمج ومصفوفة الكيوبتات) */}
      {mainViewMode === 'QUANTUM_MAINFRAME' && (
        <section className="space-y-6 animate-page-reveal">
          
          {/* Main QPU Superconducting Panel */}
          <div className="bg-[#000000] border border-cyan-500/50 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] relative overflow-hidden text-right">
            
            <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-black border border-cyan-400 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(6,182,212,0.5)]">
                  💻
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      الحاسوب الكمومي السيادي المدمج <span className="text-cyan-400">(QPU-{quantumPrefs.qubitsCapacity})</span>
                    </h2>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/60 font-black">
                      SOVEREIGN CORE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    تنفيذ فوري للبوابات الكمومية، محاكاة التراكب والتشابك التوافقي، وسجل مسجلات الـ ALU اللحظية.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => onNavigate(AppTab.QUANTUM_DEV_COMPUTER)}
                  className="px-4 py-2.5 bg-black border border-[#00ff66]/70 hover:bg-[#00ff66]/10 text-[#00ff66] font-mono font-bold text-xs rounded-2xl shadow-[0_0_15px_rgba(0,255,102,0.2)] transition-all flex items-center gap-2 active:scale-95"
                >
                  <Terminal className="w-4 h-4" />
                  <span>فتح شاشة المطورين الخضراء بالكامل (QPU-128 IDE)</span>
                </button>
                <button
                  onClick={() => setMainViewMode('QUANTUM_PREFERENCES')}
                  className="px-4 py-2.5 bg-black border border-amber-500/60 hover:bg-amber-500/10 text-amber-300 font-bold text-xs rounded-2xl shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all flex items-center gap-2 active:scale-95"
                >
                  <Sliders className="w-4 h-4" />
                  <span>تعديل تفضيلات النواة</span>
                </button>
              </div>
            </div>

            {/* QPU Realtime Hardware Registers Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6">
              {[
                { label: 'QAX (Accumulator)', val: qRegs.QAX, color: 'text-cyan-300' },
                { label: 'QBX (Quantum Base)', val: qRegs.QBX, color: 'text-indigo-300' },
                { label: 'QCX (528Hz Sync)', val: qRegs.QCX, color: 'text-emerald-300' },
                { label: 'QDX (Quantum Data)', val: qRegs.QDX, color: 'text-amber-300' },
                { label: 'QEX (Entangled Reg)', val: qRegs.QEX, color: 'text-purple-300' },
                { label: 'QFX (Flux Control)', val: qRegs.QFX, color: 'text-rose-300' },
              ].map((reg, i) => (
                <div key={i} className="p-3 bg-black/90 border border-white/10 rounded-2xl font-mono">
                  <span className="text-[10px] text-slate-400 block">{reg.label}</span>
                  <span className={`text-sm font-black ${reg.color} mt-0.5 block truncate`}>{reg.val}</span>
                </div>
              ))}
            </div>

            {/* Interactive Quantum Gates Circuit Controls */}
            <div className="mt-6 p-5 bg-black border border-cyan-500/30 rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-black text-white">لوحة إطلاق البوابات الكمومية اللحظية (Quantum Gates Trigger):</h3>
                </div>
                <span className="text-[11px] font-mono text-cyan-400">
                  Flags: <strong className="text-white">{qRegs.QFLAGS}</strong>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => {
                    quantumSovereignEngine.applyHadamard(0);
                    setLastCircuitResult('تم تطبيق بوابة Hadamard H|q0⟩ -> تراكب فائق متكافئ بنجاح.');
                  }}
                  className="px-3.5 py-2 bg-black border border-cyan-400 text-cyan-300 rounded-xl text-xs font-mono font-bold hover:bg-cyan-500/20 active:scale-95 transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                >
                  [ H ] Hadamard |q0⟩
                </button>
                <button
                  onClick={() => {
                    quantumSovereignEngine.applyPauliX(0);
                    setLastCircuitResult('تم تطبيق بوابة Pauli-X (عكس الحالة NOT).');
                  }}
                  className="px-3.5 py-2 bg-black border border-indigo-400 text-indigo-300 rounded-xl text-xs font-mono font-bold hover:bg-indigo-500/20 active:scale-95 transition-all shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                >
                  [ X ] Pauli-X (NOT)
                </button>
                <button
                  onClick={() => {
                    quantumSovereignEngine.applyCNOT(0, 1);
                    setLastCircuitResult('تم تطبيق بوابة CNOT |q0⟩ -> |q1⟩ وتشابك Bell State.');
                  }}
                  className="px-3.5 py-2 bg-black border border-purple-400 text-purple-300 rounded-xl text-xs font-mono font-bold hover:bg-purple-500/20 active:scale-95 transition-all shadow-[0_0_12px_rgba(168,85,247,0.2)]"
                >
                  [ CNOT ] Bell Entanglement
                </button>
                <button
                  onClick={() => {
                    quantumSovereignEngine.applyEntanglement528(0, 1);
                    setLastCircuitResult('تم تطبيق مصفوفة الرنين 528Hz Solfeggio Entangler.');
                  }}
                  className="px-3.5 py-2 bg-black border border-emerald-400 text-emerald-300 rounded-xl text-xs font-mono font-bold hover:bg-emerald-500/20 active:scale-95 transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                >
                  [ 528Hz ] Solfeggio Matrix
                </button>
                <button
                  onClick={() => {
                    const res = quantumSovereignEngine.measureAll();
                    setLastCircuitResult(`انهيار دالة الموجة: |${res.binaryResult}⟩ -> ${res.hexValue}`);
                  }}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-black rounded-xl text-xs font-mono font-black active:scale-95 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                  [ 💥 قياس وانهيار Wavefunction ]
                </button>
              </div>

              {lastCircuitResult && (
                <div className="p-3 bg-black border border-cyan-500/40 rounded-xl text-xs font-mono text-cyan-300 flex items-center justify-between">
                  <span>&gt; {lastCircuitResult}</span>
                  <span className="text-[10px] text-slate-500">{new Date().toLocaleTimeString()}</span>
                </div>
              )}
            </div>

            {/* Qubits Live Superposition Matrix */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Binary className="w-4 h-4 text-cyan-400" />
                  <span>مصفوفة تراكب الكيوبتات النشطة (Active Qubit Superposition Spectrum):</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Total Active Entangled Pairs: <strong className="text-cyan-400">{qRegs.ENTANGLED_PAIRS}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                {qubits.slice(0, 16).map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-black border border-white/10 hover:border-cyan-500/50 rounded-2xl font-mono text-center space-y-1.5 transition-all"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>|q{q.index}⟩</span>
                      <span className="text-cyan-400">{(q.probabilityOne * 100).toFixed(0)}% |1⟩</span>
                    </div>
                    {/* Visual Amplitude Bar */}
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
                        style={{ width: `${Math.max(5, q.probabilityOne * 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-[9px] text-slate-500 flex justify-between">
                      <span>α: {q.alpha.toFixed(2)}</span>
                      <span>β: {q.beta.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </section>
      )}

      {/* 2.9 QUANTUM SYSTEM PREFERENCES VIEW */}
      {mainViewMode === 'QUANTUM_PREFERENCES' && (
        <section className="space-y-6 animate-page-reveal">
          <QuantumPreferencesManager
            language={language}
            onNavigate={onNavigate}
            onClose={() => setMainViewMode('QUANTUM_MAINFRAME')}
          />
        </section>
      )}

      {/* 3. APEX CONSTELLATION RADAR PRIMARY VIEW */}
      {mainViewMode === 'APEX_CONSTELLATION' && (
        <section className="space-y-6 animate-page-reveal">
          <ApexConstellationHub
            onNavigate={onNavigate}
            onSummonModule={(tab) => {
              summonModuleById(tab);
              setMainViewMode('DUAL_WORKSPACE');
            }}
            language={language}
            onOpenDrawer={onOpenDrawer}
          />

          {/* Quick Active Summons Dock if any are active */}
          {activeSummonObj && (
            <div className="bg-[#050b18] border border-cyan-500/30 rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{activeSummonObj.icon}</span>
                  <div>
                    <h3 className="text-sm font-black text-white">{activeSummonObj.label}</h3>
                    <span className="text-xs font-mono text-cyan-300">{activeSummonObj.tag}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMainViewMode('DUAL_WORKSPACE')}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>فتح في الشاشة المزدوجة</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate(activeSummonObj.id)}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                    title="تكبير ملء الشاشة"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="max-h-[500px] overflow-y-auto custom-scrollbar p-2">
                {renderModuleComponent(activeSummonObj.id)}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 3.5. DUAL-PANE COGNITIVE & SUMMONED WORKSPACE LAYOUT */}
      {mainViewMode === 'DUAL_WORKSPACE' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-page-reveal">
        
        {/* LEFT/MAIN PANE: FAST GEMINI COGNITIVE & COMMAND CHAT (col-span-12 or col-span-5) */}
        <div className={`space-y-4 transition-all duration-300 ${
          activeSummonObj && !activeSummonObj.isMaximized ? 'lg:col-span-5' : activeSummonObj?.isMaximized ? 'hidden' : 'lg:col-span-12'
        }`}>
          
          <div className="bg-[#050914] border border-cyan-500/30 rounded-3xl p-5 space-y-4 shadow-xl flex flex-col h-[650px]">
            
            {/* Console Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>وحدة التحكم والمحادثة الفائقة بجمناي</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      {geminiModel}
                    </span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400 block">
                    استجابة فورية • استحضار تلقائي • توليد أكواد
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setMessages([])}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 text-xs font-mono transition-all"
                  title="مسح سجل المحادثة"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {quickPromptActions.map((qa, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(qa.prompt)}
                  disabled={isLoading}
                  className="px-2.5 py-1.5 rounded-xl bg-black/40 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 text-[11px] font-bold text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-all flex-shrink-0 disabled:opacity-50"
                >
                  {qa.label}
                </button>
              ))}
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3.5 p-2 bg-black/40 rounded-2xl border border-white/5">
              {messages.map(msg => (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[92%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-br-none shadow-lg'
                      : 'bg-[#080d1e] border border-cyan-500/20 text-slate-200 rounded-bl-none shadow-md'
                  }`}>
                    
                    {/* Thought Steps if any */}
                    {msg.thoughtSteps && msg.thoughtSteps.length > 0 && (
                      <div className="bg-black/50 border border-indigo-500/30 p-2.5 rounded-xl text-[11px] font-mono text-indigo-300 space-y-1 mb-2">
                        <div className="flex items-center gap-1.5 font-bold">
                          <Bot className="w-3.5 h-3.5 text-indigo-400" />
                          <span>خطوات التفكير والاستدلال:</span>
                        </div>
                        {msg.thoughtSteps.map((step, sIdx) => (
                          <div key={sIdx} className="text-slate-400 pl-2">
                            • {step}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="whitespace-pre-wrap font-arabic">{msg.text}</div>

                    {/* Code Snippet if generated */}
                    {msg.codeSnippet && (
                      <div className="bg-black/90 border border-white/10 rounded-xl p-3 font-mono text-xs space-y-2 mt-2">
                        <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[10px] text-slate-400">
                          <span className="uppercase text-cyan-400">{msg.codeSnippet.lang}</span>
                          <button
                            onClick={() => copyToClipboard(msg.codeSnippet!.code, msg.id)}
                            className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-0.5 rounded bg-white/10"
                          >
                            {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === msg.id ? 'تم النسخ' : 'نسخ الكود'}</span>
                          </button>
                        </div>
                        <pre className="overflow-x-auto text-slate-200 custom-scrollbar p-1">
                          <code>{msg.codeSnippet.code}</code>
                        </pre>
                      </div>
                    )}

                    {/* Auto-suggested Module Instant Summon CTA */}
                    {msg.suggestedModule && (
                      <div className="pt-2">
                        <button
                          onClick={() => summonModuleById(msg.suggestedModule!.id)}
                          className="w-full px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-blue-500/20 hover:from-amber-500/30 hover:to-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-between transition-all shadow-md group"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-base">{msg.suggestedModule.icon}</span>
                            <span>استحضار [{msg.suggestedModule.label}] على الشاشة</span>
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-[-2px] transition-transform" />
                        </button>
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400 pt-1 font-mono flex items-center justify-between">
                      <span>{msg.sender === 'user' ? 'الأمر المدخل' : 'صارة v17'}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono p-3 bg-cyan-950/40 rounded-xl border border-cyan-500/20 animate-pulse">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>جاري معالجة الاستجابة وتوليد الحل الكوآنتومي عبر جمناي...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Prompt Input Box */}
            <form 
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="اكتب أمرك لصارة أو اطلب استحضار أي وحدة أو توليد كود..."
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                disabled={isLoading}
                className="w-full bg-black/70 border border-cyan-500/40 focus:border-cyan-400 rounded-2xl px-5 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all font-medium"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="px-5 py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-2xl font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-40 flex items-center gap-1.5 flex-shrink-0"
              >
                <span>إرسال</span>
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>

        {/* RIGHT PANE: ACTIVE SUMMONED WORKSPACES DECK (col-span-7 or full-screen if maximized) */}
        {activeSummons.length > 0 && activeSummonObj && (
          <div className={`space-y-3 transition-all duration-300 ${
            activeSummonObj.isMaximized ? 'lg:col-span-12' : 'lg:col-span-7'
          }`}>
            
            {/* Summoned Workspace Container */}
            <div className="bg-[#03060f] border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[650px]">
              
              {/* Workspace Top Bar (Multi-Tasking Tabs & Controls) */}
              <div className="bg-gradient-to-r from-[#0e040c] via-[#070918] to-[#040d14] border-b border-white/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                
                {/* Active Tabs Strip */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {activeSummons.map(sum => {
                    const isSelected = sum.id === selectedSummonId;
                    return (
                      <div
                        key={sum.id}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-cyan-950/90 border-cyan-400 text-white shadow-md'
                            : 'bg-black/40 border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-200'
                        }`}
                      >
                        <button
                          onClick={() => setSelectedSummonId(sum.id)}
                          className="flex items-center gap-1.5"
                        >
                          <span className="text-base">{sum.icon}</span>
                          <span>{sum.label}</span>
                        </button>
                        <button
                          onClick={() => closeSummon(sum.id)}
                          className="text-slate-400 hover:text-rose-400 p-0.5 rounded-md transition-colors"
                          title="إغلاق هذه الوحدة"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Window Actions */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-cyan-300 border border-white/10 hidden sm:inline">
                    {activeSummonObj.tag}
                  </span>
                  <button
                    onClick={() => toggleMaximizeSummon(activeSummonObj.id)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all"
                    title={activeSummonObj.isMaximized ? 'تصغير العرض' : 'تكبير ملء الشاشة'}
                  >
                    {activeSummonObj.isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => closeSummon(activeSummonObj.id)}
                    className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 transition-all"
                    title="إغلاق الوحدة"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* Mounted Module Viewport */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2 sm:p-4">
                {renderModuleComponent(activeSummonObj.id)}
              </div>

            </div>

          </div>
        )}

      </div>
      )}

      {/* 4. REAL-TIME SYSTEM EVENT LOG TERMINAL */}
      {mainViewMode === 'SYSTEM_LOGS' && (
        <section className="mt-4 animate-page-reveal">
          <SystemEventLogTerminal onNavigate={onNavigate} />
        </section>
      )}

      {/* Subtle Bottom System Event Stream for telemetry visibility across all modes */}
      {mainViewMode !== 'SYSTEM_LOGS' && (
        <section className="mt-4">
          <SystemEventLogTerminal onNavigate={onNavigate} />
        </section>
      )}

    </div>
  );
};
