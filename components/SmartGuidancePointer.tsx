import React, { useState, useEffect, useRef } from 'react';
import { AppTab } from '../types';
import { 
  Sparkles, 
  HelpCircle, 
  Lightbulb, 
  Sliders, 
  X, 
  Wand2, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Check, 
  Compass,
  ArrowUpRight,
  Scan,
  RefreshCw,
  Zap,
  Layers,
  Code2,
  Gauge,
  Bot,
  Settings2,
  Brain,
  TrendingUp,
  Mic,
  History,
  CheckCircle2,
  FileText,
  SlidersHorizontal,
  Activity,
  Navigation2,
  Rocket,
  Flame,
  Shield,
  Move,
  FastForward,
  Play,
  RotateCcw
} from 'lucide-react';

export interface SystemDeficiency {
  id: string;
  title: string;
  category: 'performance' | 'security' | 'storage' | 'intelligence' | 'usability';
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestedFix: string;
  targetTab?: AppTab;
  commandSnippet?: string;
  isResolved?: boolean;
}

export interface CommandSuggestion {
  id: string;
  title: string;
  command: string;
  type: 'optimization' | 'diagnostic' | 'security' | 'creative';
  explanation: string;
  impact: string;
  applied?: boolean;
}

export interface ModelTuningProfile {
  recommendedModel: string;
  recommendedTemperature: number;
  recommendedTopP: number;
  recommendedTopK: number;
  thinkingBudget: number;
  reasoningNote: string;
  codeOptimizations: {
    title: string;
    snippet: string;
    benefit: string;
  }[];
}

export interface TaskExecutionLog {
  id: string;
  taskTitle: string;
  category: 'code' | 'security' | 'chat' | 'quantum' | 'search';
  modelUsed: string;
  temperatureUsed: number;
  latencyMs: number;
  tokenCount: number;
  qualityScore: number;
  detectedBottleneck: string;
  timestamp: string;
}

export interface ActiveLearningProposal {
  targetTemperature: number;
  targetTopP: number;
  targetModel: string;
  efficiencyGainEstimate: string;
  identifiedPatterns: string[];
  systemDirectives: string;
  applied: boolean;
}

interface SmartGuidancePointerProps {
  currentTab: AppTab;
  onNavigate: (tab: AppTab) => void;
  onApplyOptimization?: (command: string) => void;
  onApplyModelConfig?: (config: { model: string; temperature: number; topP: number; thinkingBudget?: number; systemDirectives?: string }) => void;
}

export const SmartGuidancePointer: React.FC<SmartGuidancePointerProps> = ({
  currentTab,
  onNavigate,
  onApplyOptimization,
  onApplyModelConfig
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'speed_engine' | 'scanner' | 'active_learning' | 'deficiencies' | 'suggestions' | 'explainer'>('speed_engine');
  const [customCommand, setCustomCommand] = useState('');
  const [customExplanation, setCustomExplanation] = useState<{ title: string; explanation: string; impact: string } | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);
  const [arrowAngle, setArrowAngle] = useState(45);
  const [turboMode, setTurboMode] = useState(true);
  const [speedActionNotification, setSpeedActionNotification] = useState<string | null>(null);
  const [showQuickOrbit, setShowQuickOrbit] = useState(false);

  // Free Floating & Draggable Arrow State
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem('sarah_floating_arrow_pos');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return { x: window.innerWidth - 110, y: window.innerHeight - 130 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hasMovedDuringDrag, setHasMovedDuringDrag] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  // Screen Scanning & Model Tuning State
  const [isScanning, setIsScanning] = useState(false);
  const [scanTimestamp, setScanTimestamp] = useState<string>('الآن');
  const [currentTemperature, setCurrentTemperature] = useState<number>(0.2);
  const [currentTopP, setCurrentTopP] = useState<number>(0.85);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-pro');
  const [tuningApplied, setTuningApplied] = useState(false);

  // Save position to storage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('sarah_floating_arrow_pos', JSON.stringify(position));
    } catch (e) {
      // ignore
    }
  }, [position]);

  // Dynamic floating arrow rotation animation towards mouse or screen center
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) {
        const dx = e.clientX - position.x;
        const dy = e.clientY - position.y;
        const deg = Math.atan2(dy, dx) * (180 / Math.PI);
        setArrowAngle(deg);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [position, isDragging]);

  // Drag listeners
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      const newX = Math.max(20, Math.min(window.innerWidth - 80, clientX - dragStart.x));
      const newY = Math.max(20, Math.min(window.innerHeight - 80, clientY - dragStart.y));

      if (Math.abs(newX - position.x) > 3 || Math.abs(newY - position.y) > 3) {
        setHasMovedDuringDrag(true);
      }
      setPosition({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);
    }
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, dragStart, position]);

  const handleStartDrag = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setHasMovedDuringDrag(false);
    setDragStart({
      x: clientX - position.x,
      y: clientY - position.y
    });
  };

  const triggerSpeedToast = (msg: string) => {
    setSpeedActionNotification(msg);
    setTimeout(() => {
      setSpeedActionNotification(null);
    }, 2800);
  };

  // Active Learning & Task Log History States
  const [isAnalyzingTasks, setIsAnalyzingTasks] = useState(false);
  const [activeLearningProposal, setActiveLearningProposal] = useState<ActiveLearningProposal>({
    targetTemperature: 0.18,
    targetTopP: 0.85,
    targetModel: 'gemini-2.5-pro',
    efficiencyGainEstimate: '+34% دقة منطقية و -29% تقليل في زمن المعالجة والـ Tokens',
    identifiedPatterns: [
      'تحليل 14 مهمة سابقة: المهام البرمجية والأمنية تتفوق بشكل حاسم عند درجة حرارة (0.15 - 0.20) لمنع تباين الشيفرات.',
      'توجيهات "Zero-Fluff & Code-First" استأصلت 35% من التوكنز المهدرة وسرعت زمن الاستجابة الفعلي.',
      'تضمين قواعد نظام الوديان الاستراتيجي وتردد 528Hz رفع تناغم الاستجابة اللحظية إلى 96%.'
    ],
    systemDirectives: `# SOVEREIGN ACTIVE LEARNING OPTIMIZED DIRECTIVES v2.5
- STRICT CONTEXT: Respond decisively with code-first, predator-grade tactical solutions.
- ZERO-FLUFF POLICY: Eliminate generic greetings and filler phrases; output root-cause diagnostics and executable terminal/API snippets immediately.
- QUANTUM COHERENCE: Align data streams with Sovereign Ouedian Conduits at 528Hz resonance.
- DIALECT COHESION: Seamlessly honor Arabic (الفصحى), Maghrebi Darija (الدارجة), and English modes with native accuracy.`,
    applied: false
  });

  const [taskLogs, setTaskLogs] = useState<TaskExecutionLog[]>([
    {
      id: 'TASK-LOG-101',
      taskTitle: 'توليد شفرات كوانتومية لمحاكاة مصفوفة 128 كيوبت',
      category: 'code',
      modelUsed: 'gemini-2.5-pro',
      temperatureUsed: 0.45,
      latencyMs: 1420,
      tokenCount: 890,
      qualityScore: 84,
      detectedBottleneck: 'ارتفاع درجة الحرارة أدى إلى تنوع زائد وتباين في أسماء التوابع المنطقية.',
      timestamp: 'منذ 3 دقائق'
    },
    {
      id: 'TASK-LOG-102',
      taskTitle: 'فحص ثغرات هجومية وعزل عقد شبكة الوديان',
      category: 'security',
      modelUsed: 'gemini-2.5-flash',
      temperatureUsed: 0.35,
      latencyMs: 620,
      tokenCount: 430,
      qualityScore: 91,
      detectedBottleneck: 'حاجة لصياغة أوامر مفترسة مقتضبة ومباشرة بدون مقدمات كلامية.',
      timestamp: 'منذ 8 دقائق'
    },
    {
      id: 'TASK-LOG-103',
      taskTitle: 'دردشة بيضاء استراتيجية بالدارجة المغربية/الجزائرية',
      category: 'chat',
      modelUsed: 'gemini-2.5-flash',
      temperatureUsed: 0.6,
      latencyMs: 780,
      tokenCount: 512,
      qualityScore: 88,
      detectedBottleneck: 'الحاجة لتثبيت التناغم مع تردد 528Hz وتوجيهات الحلول المفترسة الصريحة.',
      timestamp: 'منذ 14 دقيقة'
    },
    {
      id: 'TASK-LOG-104',
      taskTitle: 'توليف واستخراج مصادر بحثية عميقة حول فيزياء الكوانتوم',
      category: 'search',
      modelUsed: 'gemini-2.5-pro',
      temperatureUsed: 0.4,
      latencyMs: 2100,
      tokenCount: 1240,
      qualityScore: 94,
      detectedBottleneck: 'أداء ممتاز مع إمكانية ضغط استهلاك الـ Tokens عبر حظر الحشو التمهيدي.',
      timestamp: 'منذ 25 دقيقة'
    }
  ]);

  // Derive Context & Dynamic Model Recommendations based on currentTab
  const getContextProfile = (tab: AppTab): ModelTuningProfile => {
    switch (tab) {
      case AppTab.QUANTUM_DEV_COMPUTER:
      case AppTab.CODE_FORGE:
      case AppTab.PYTHON_FORGE:
      case AppTab.HTML_FULL:
      case AppTab.STRATEGIC_SITE_AGENT:
        return {
          recommendedModel: 'gemini-2.5-pro',
          recommendedTemperature: 0.15,
          recommendedTopP: 0.8,
          recommendedTopK: 40,
          thinkingBudget: 4096,
          reasoningNote: 'بيئة هندسة برمجية والتحكم بمواقع النظام داخلياً: تتطلب نموذج تفكير عميق (Pro) مع درجة حرارة منخفضة (0.15) لضمان الدقة وتفادي الأخطاء المنطقية.',
          codeOptimizations: [
            {
              title: 'تمكين تجميع الخرائط المصدرية SourceMap',
              snippet: 'QUANTUM_ENV.enableSourceMaps({ inline: true });',
              benefit: 'تتبع مسارات الأخطاء بدقة متناهية أثناء التنفيذ المباشر.'
            },
            {
              title: 'تفعيل التخزين المؤقت الفوري Cryogenic Cache',
              snippet: 'MEM_CACHE.setCachePolicy("ZERO_LATENCY_PERSIST");',
              benefit: 'تسريع دورات إعادة البناء والمعاينة بنسبة 60%.'
            }
          ]
        };

      case AppTab.NEURAL_SHIELD:
      case AppTab.VPN_SHIELD:
      case AppTab.NEURAL_OVERSIGHT:
        return {
          recommendedModel: 'gemini-2.5-flash',
          recommendedTemperature: 0.1,
          recommendedTopP: 0.9,
          recommendedTopK: 20,
          thinkingBudget: 2048,
          reasoningNote: 'بيئة أمان دفاعي ورصد سلوكي: تتطلب استجابة فائقة السرعة مع فحص صارم ومباشر بدون تردد لتحديد التهديدات فوراً.',
          codeOptimizations: [
            {
              title: 'تطبيق فحص البصمات الرقمية الصارم',
              snippet: 'NEURAL_SHIELD.enforceFingerprintSanitization({ strict: true });',
              benefit: 'منع محاولات التلاعب بالترويسات أو تزييف عناوين IP.'
            },
            {
              title: 'تقييد تدفق الاستعلامات المشبوهة',
              snippet: 'RATE_LIMITER.apply({ maxRps: 15, isolateOnBurst: true });',
              benefit: 'إحباط هجمات الاستنزاف والحفاظ على كفاءة الخادم.'
            }
          ]
        };

      case AppTab.WHITE_STRATEGIC_CHAT:
        return {
          recommendedModel: 'gemini-2.5-flash',
          recommendedTemperature: 0.3,
          recommendedTopP: 0.9,
          recommendedTopK: 30,
          thinkingBudget: 2048,
          reasoningNote: 'نافذة الدردشة البيضاء الاستراتيجية ونظام الوديان: تتطلب نموذجاً سريعاً متعدد اللهجات وقادراً على صياغة الحلول المفترسة وتوجيه الأوامر اللحظية.',
          codeOptimizations: [
            {
              title: 'مزامنة تدفقات وادي السيادة على 528Hz',
              snippet: 'ouedian.flow.sync(528);',
              benefit: 'ضمان التناغم التام والاستجابة السريعة وتفادي الاختناق.'
            },
            {
              title: 'تأهب وضع الصد الهجومي المفترس',
              snippet: 'predator.mode.standby();',
              benefit: 'عزل وحسم أي مشكل أمني أو منطقي فورياً.'
            }
          ]
        };

      case AppTab.SOLAR_COSMOS:
      case AppTab.DATA_STREAMS:
      case AppTab.HOLO_MATRIX:
        return {
          recommendedModel: 'gemini-2.5-flash',
          recommendedTemperature: 0.35,
          recommendedTopP: 0.95,
          recommendedTopK: 50,
          thinkingBudget: 1024,
          reasoningNote: 'بيئة تدفق بيانات فلكية ومصفوفات متزامنة: نموذج Flash عالي التردد يوفر سرعة معالجة الحزم الضخمة في الوقت الفعلي.',
          codeOptimizations: [
            {
              title: 'مزامنة تردد الرنين النوروني 528Hz',
              snippet: 'COSMOS_STREAM.alignResonance(528);',
              benefit: 'تحقيق التناغم التام وتقليل زمن التشتت في خطوط البيانات.'
            }
          ]
        };

      case AppTab.SEARCH:
      case AppTab.KNOWLEDGE_VAULT:
      case AppTab.INFINITY_INTELLIGENCE:
        return {
          recommendedModel: 'gemini-2.5-pro',
          recommendedTemperature: 0.3,
          recommendedTopP: 0.9,
          recommendedTopK: 40,
          thinkingBudget: 8192,
          reasoningNote: 'بيئة بحث وتحليل استخباراتي عميق: تتطلب موازنة بين الدقة التحليلية وربط الاستنتاجات الشاملة.',
          codeOptimizations: [
            {
              title: 'تفعيل التوليف المتعدد للمصادر',
              snippet: 'SEARCH_ENGINE.enableMultiSourceGrounding({ depth: "deep" });',
              benefit: 'استخراج حقائق موثقة مع تقليل الهلوسة إلى الصفر.'
            }
          ]
        };

      default:
        return {
          recommendedModel: 'gemini-2.5-flash',
          recommendedTemperature: 0.4,
          recommendedTopP: 0.85,
          recommendedTopK: 40,
          thinkingBudget: 2048,
          reasoningNote: 'سياق النظام السيادي العام: إعدادات متوازنة توفر سرعة استجابة عالية مع جودة منطقية ممتازة.',
          codeOptimizations: [
            {
              title: 'تطهير الذاكرة المؤقتة وإعادة جدولة النبضات',
              snippet: 'CORE_ORCHESTRATOR.optimizeMemoryAndGC();',
              benefit: 'تحرير 30% من الموارد المستهلكة في المتصفح.'
            }
          ]
        };
    }
  };

  const currentProfile = getContextProfile(currentTab);

  // Sync sliders when switching tabs
  useEffect(() => {
    setCurrentTemperature(currentProfile.recommendedTemperature);
    setCurrentTopP(currentProfile.recommendedTopP);
    setSelectedModel(currentProfile.recommendedModel);
    setTuningApplied(false);
  }, [currentTab]);

  // Dynamic system deficiencies detection based on active tab and environment
  const deficiencies: SystemDeficiency[] = [
    {
      id: 'DEF-01',
      title: 'تحسين سعة الذاكرة التخيلية في الحاسوب الكمومي',
      category: 'performance',
      severity: 'medium',
      description: 'تم رصد زيادة في زمن استجابة المحاكاة عند تشغيل الحلقات التكرارية بدون تسريع QPU.',
      suggestedFix: 'تفعيل وضع الاستجابة الفورية (Zero-Latency Cryogenic Cache) ومزامنة تردد 528Hz.',
      targetTab: AppTab.QUANTUM_DEV_COMPUTER,
      commandSnippet: 'QUANTUM_CORE.tuneFrequency(528); MEMORY.enableCryoCache();'
    },
    {
      id: 'DEF-02',
      title: 'فحص ثغرات الاستعلام في سجلات الأجهزة المتصلة',
      category: 'security',
      severity: 'high',
      description: 'يوجد استعلامات خارجية غير موقعة رقمياً بحاجة إلى عزل تلقائي عبر الدرع النوروني.',
      suggestedFix: 'الانتقال إلى درع صارة وتفعيل "عزل وحظر الأجهزة المشبوهة" تلقائياً.',
      targetTab: AppTab.NEURAL_SHIELD,
      commandSnippet: 'NEURAL_SHIELD.enforceStrictAudit({ autoBlockRogue: true });'
    },
    {
      id: 'DEF-03',
      title: 'تسريع تدفق قنوات البيانات الموحدة (Unified Stream)',
      category: 'intelligence',
      severity: 'low',
      description: 'تدفقات الرادار والاستشعار تعمل بمعدل تحديث 3.5 ثانية ويمكن تسريعها بنسبة 40%.',
      suggestedFix: 'رفع وتيرة النبضات المتزامنة إلى نمط التوربو (Turbo Mode Burst).',
      targetTab: AppTab.SOLAR_COSMOS,
      commandSnippet: 'STREAM_PIPELINE.setRefreshRate(1800); TURBO_ENGINE.boost();'
    }
  ];

  // System enhancement commands & smart suggestions
  const [commandSuggestions, setCommandSuggestions] = useState<CommandSuggestion[]>([
    {
      id: 'CMD-OPT-01',
      title: 'تطهير الذاكرة النورونية وضبط التردد (528Hz Coherence)',
      command: 'sarah.memory.purgeAndAlign(528)',
      type: 'optimization',
      explanation: 'يقوم هذا الأمر بتنظيف مصفوفات الذاكرة المؤقتة من أي أجزاء غير مكتملة وضبط تردد الرنين على 528 هرتز لتحقيق أعلى درجات الاستقرار.',
      impact: 'تحسين سرعة معالجة الأوامر بنسبة 35% وتوفير 22% من استهلاك الذاكرة.'
    },
    {
      id: 'CMD-SEC-02',
      title: 'تفعيل الجدار النوروني المحصن (Full Stealth Cloak)',
      command: 'sarah.security.enableStealthProtocol(95)',
      type: 'security',
      explanation: 'يقوم بحجب البصمة الرقمية للاتصالات غير الضرورية وعزل العقد غير الموثوقة في بيئة Sandboxed معزولة.',
      impact: 'حماية كاملة من محاولات التطفل والتتبع دون التأثير على كفاءة الخادم المحلي.'
    },
    {
      id: 'CMD-DEV-03',
      title: 'إعادة بناء بيئة المعاينة وتوليد توثيق الشيفرات',
      command: 'sarah.sandbox.recompileWithSourceMap()',
      type: 'diagnostic',
      explanation: 'يفحص الأكواد المكتوبة في الحاسوب الكمومي، وينشئ خريطة مسارات (Source Maps) لتتبع الأخطاء قبل تنفيذها.',
      impact: 'تقليل أخطاء وقت التشغيل إلى الصفر مع إتاحة المعاينة التفاعلية فورياً.'
    }
  ]);

  const handleResolve = (def: SystemDeficiency) => {
    setResolvedIds(prev => [...prev, def.id]);
    if (def.commandSnippet && onApplyOptimization) {
      onApplyOptimization(def.commandSnippet);
    }
    if (def.targetTab) {
      onNavigate(def.targetTab);
    }
  };

  const handleApplyCommand = (cmd: CommandSuggestion) => {
    setCommandSuggestions(prev => prev.map(c => c.id === cmd.id ? { ...c, applied: true } : c));
    if (onApplyOptimization) {
      onApplyOptimization(cmd.command);
    }
  };

  const handleRunLiveScreenScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const now = new Date();
      setScanTimestamp(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
      setIsScanning(false);
    }, 850);
  };

  const handleRunActiveLearningAnalysis = () => {
    setIsAnalyzingTasks(true);
    setTimeout(() => {
      // Fine-tune proposal dynamically according to active tab & logs
      const isCodeContext = [AppTab.QUANTUM_DEV_COMPUTER, AppTab.CODE_FORGE, AppTab.PYTHON_FORGE, AppTab.HTML_FULL].includes(currentTab);
      const isSecurityContext = currentTab === AppTab.NEURAL_SHIELD;
      const isChatContext = currentTab === AppTab.WHITE_STRATEGIC_CHAT;

      const idealTemp = isCodeContext ? 0.15 : isSecurityContext ? 0.1 : isChatContext ? 0.35 : 0.25;
      const idealModel = isCodeContext ? 'gemini-2.5-pro' : 'gemini-2.5-flash';

      const customDirective = `# SOVEREIGN ACTIVE LEARNING GENERATED DIRECTIVES v2.5
- TACTICAL POSTURE: Code-First & Zero-Fluff execution. Eliminate preambles and redundant conversational filler.
- PRECISION CALIBRATION: Calibrated for ${currentTab} with strict logic boundary enforcement.
- QUANTUM COHERENCE: Maintain 528Hz resonance synchronization across all Ouedian conduits.
- MULTI-DIALECT RESILIENCE: Seamlessly accommodate Classical Arabic, Algerian/Moroccan Darija, and Technical English.
- PREDATOR PROTOCOL: Prioritize root-cause isolation and output immediate executable solutions.`;

      setActiveLearningProposal(prev => ({
        ...prev,
        targetTemperature: idealTemp,
        targetModel: idealModel,
        systemDirectives: customDirective,
        applied: false,
        efficiencyGainEstimate: isCodeContext ? '+38% دقة الشيفرات و -32% استهلاك Tokens' : '+30% سرعة استجابة و -25% زمن معالجة'
      }));

      // Add fresh dynamic log
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setTaskLogs(prev => [
        {
          id: `TASK-LOG-${Date.now().toString().slice(-4)}`,
          taskTitle: `مسح تعلم نشط لحظي في سياق: ${currentTab}`,
          category: isCodeContext ? 'code' : isSecurityContext ? 'security' : 'chat',
          modelUsed: idealModel,
          temperatureUsed: idealTemp,
          latencyMs: 540,
          tokenCount: 380,
          qualityScore: 97,
          detectedBottleneck: 'تمت الموازنة المثالية - لا توجد اختناقات حالية.',
          timestamp: timeStr
        },
        ...prev.slice(0, 5)
      ]);

      setIsAnalyzingTasks(false);
    }, 900);
  };

  const handleApplyActiveLearning = () => {
    setCurrentTemperature(activeLearningProposal.targetTemperature);
    setCurrentTopP(activeLearningProposal.targetTopP);
    setSelectedModel(activeLearningProposal.targetModel);
    setActiveLearningProposal(prev => ({ ...prev, applied: true }));

    if (onApplyModelConfig) {
      onApplyModelConfig({
        model: activeLearningProposal.targetModel,
        temperature: activeLearningProposal.targetTemperature,
        topP: activeLearningProposal.targetTopP,
        systemDirectives: activeLearningProposal.systemDirectives
      });
    }

    if (onApplyOptimization) {
      onApplyOptimization(`ACTIVE_LEARNING.applyDirectives({ temp: ${activeLearningProposal.targetTemperature}, model: "${activeLearningProposal.targetModel}" });`);
    }
  };

  const handleApplyRecommendedTuning = () => {
    setCurrentTemperature(currentProfile.recommendedTemperature);
    setCurrentTopP(currentProfile.recommendedTopP);
    setSelectedModel(currentProfile.recommendedModel);
    setTuningApplied(true);

    if (onApplyModelConfig) {
      onApplyModelConfig({
        model: currentProfile.recommendedModel,
        temperature: currentProfile.recommendedTemperature,
        topP: currentProfile.recommendedTopP,
        thinkingBudget: currentProfile.thinkingBudget
      });
    }

    if (onApplyOptimization && currentProfile.codeOptimizations[0]) {
      onApplyOptimization(currentProfile.codeOptimizations[0].snippet);
    }
  };

  const handleExplainCustom = () => {
    if (!customCommand.trim()) return;
    setIsExplaining(true);
    setTimeout(() => {
      let impactText = 'يحسن أداء ومعالجة حزم البيانات النورونية.';
      let explanationText = `هذا الأمر يقوم بطلب تنفيذ مباشر للعملية "${customCommand}" داخل النواة وتوجيه الحزم عبر مسار التدفق السريع.`;
      
      if (customCommand.toLowerCase().includes('clean') || customCommand.toLowerCase().includes('purge')) {
        explanationText = 'أمر تنظيف وإعادة جدولة الموارد: يزيل السجلات المتراكمة ويعيد تهيئة خادم العمليات.';
        impactText = 'تخفيف الحمل على معالج QPU وزيادة الذاكرة الحرة.';
      } else if (customCommand.toLowerCase().includes('sec') || customCommand.toLowerCase().includes('shield')) {
        explanationText = 'أمر تشديد الأمان: يعيد توليد مفاتيح النواة ويطبق تدقيقاً صارماً على جميع التبادلات.';
        impactText = 'حظر فوري لأي عنوان IP مشبوه وعزل المحاولات غير المصرح بها.';
      }

      setCustomExplanation({
        title: `تحليل الأمر: ${customCommand}`,
        explanation: explanationText,
        impact: impactText
      });
      setIsExplaining(false);
    }, 600);
  };

  const handleSolveAllDeficiencies = () => {
    const unres = deficiencies.filter(d => !resolvedIds.includes(d.id));
    if (unres.length === 0) {
      triggerSpeedToast('✅ جميع النواقص محلولة ومثالية بالفعل!');
      return;
    }
    const allIds = unres.map(d => d.id);
    setResolvedIds(prev => [...prev, ...allIds]);
    if (onApplyOptimization) {
      unres.forEach(d => {
        if (d.commandSnippet) onApplyOptimization(d.commandSnippet);
      });
    }
    triggerSpeedToast(`⚡ تم حل وإغلاق ${allIds.length} نواقص فورياً بنجاح!`);
  };

  const handleMasterTurboBoost = () => {
    setTurboMode(true);
    if (onApplyOptimization) {
      onApplyOptimization('QUANTUM_CORE.tuneFrequency(528); MEMORY.enableCryoCache(); TURBO_ENGINE.boost({ latency: "0ms" });');
    }
    triggerSpeedToast('🚀 تم تفعيل التيربو الشامل وتفريغ الذاكرة وتسريع استجابة النواة!');
  };

  const handleDockPosition = (dock: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center') => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    let newPos = { x: w - 110, y: h - 130 };
    if (dock === 'bottom-left') newPos = { x: 30, y: h - 130 };
    if (dock === 'top-right') newPos = { x: w - 110, y: 90 };
    if (dock === 'top-left') newPos = { x: 30, y: 90 };
    if (dock === 'center') newPos = { x: Math.floor(w / 2) - 40, y: Math.floor(h / 2) - 40 };
    setPosition(newPos);
    triggerSpeedToast('🧭 تم نقل السهم الطافي للموضع المحدد');
  };

  return (
    <>
      {/* Speed Action Toast Notification */}
      {speedActionNotification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[3000] px-5 py-3 bg-[#061226]/95 border border-cyan-400/50 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.6)] text-white text-xs font-black backdrop-blur-xl flex items-center gap-2.5 animate-bounce font-arabic">
          <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>{speedActionNotification}</span>
        </div>
      )}

      {/* Floating Free-Moving Quantum Velocity Arrow (سهم التوجيه الذكي الطافي الحر) */}
      <div
        ref={dragRef}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          touchAction: 'none'
        }}
        className={`fixed z-[2000] select-none transition-transform duration-75 flex items-center group ${
          isDragging ? 'cursor-grabbing scale-105 opacity-90' : 'cursor-pointer'
        }`}
      >
        {/* Quick Orbit Speed Launcher (حلقة المهام فائقة السرعة المباشرة) */}
        {showQuickOrbit && !isDragging && (
          <div className="absolute -top-16 -left-36 sm:-left-44 bg-[#050e20]/95 backdrop-blur-2xl border border-cyan-400/40 rounded-2xl p-2 shadow-[0_0_40px_rgba(6,182,212,0.4)] flex items-center gap-1.5 animate-fadeIn z-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMasterTurboBoost();
              }}
              title="تيربو النواة الفوري"
              className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:scale-110 active:scale-95 text-black font-black transition-all shadow-md"
            >
              <Zap className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSolveAllDeficiencies();
              }}
              title="حل النواقص فوراً"
              className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-110 active:scale-95 text-black font-black transition-all shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onApplyOptimization) onApplyOptimization('sarah.memory.purgeAndAlign(528)');
                triggerSpeedToast('🧹 تم تفريغ ومحاذاة الذاكرة بسرعة فائقة');
              }}
              title="تفريغ الذاكرة 528Hz"
              className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/30 text-cyan-300 hover:scale-110 active:scale-95 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(AppTab.DRAGON_DOME);
                triggerSpeedToast('🐉 تم فتح قبة دراغون L4');
              }}
              title="قبة دراغون L4"
              className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 border border-rose-400/30 text-rose-300 hover:scale-110 active:scale-95 transition-all"
            >
              <Shield className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(AppTab.SOVEREIGN_VOICE_CONTROLLER);
                triggerSpeedToast('🎙️ تم فتح نظام التحكم الصوتي المستقل (بدون Gemini)');
              }}
              title="نظام التحدث والتحكم الصوتي المستقل (بدون Gemini)"
              className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-400/30 text-emerald-300 hover:scale-110 active:scale-95 transition-all"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(AppTab.KIMI_LLM_STUDIO);
                triggerSpeedToast('🔮 تم فتح استوديو Kimi LLM ونماذج Moonshot');
              }}
              title="استوديو Kimi LLM (Moonshot AI)"
              className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/40 border border-purple-400/30 text-purple-300 hover:scale-110 active:scale-95 transition-all"
            >
              <Bot className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickOrbit(false);
              }}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Drag Handle Tag */}
        <div
          onMouseDown={(e) => handleStartDrag(e.clientX, e.clientY)}
          onTouchStart={(e) => handleStartDrag(e.touches[0].clientX, e.touches[0].clientY)}
          className="absolute -top-6 -right-2 px-2 py-0.5 rounded-full bg-black/80 border border-cyan-400/30 text-[9px] font-mono text-cyan-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          title="اسحب السهم لتحريكه بحرية في أي مكان"
        >
          <Move className="w-2.5 h-2.5" />
          <span>اسحب بحرية</span>
        </div>

        {/* The Aerodynamic Floating Arrow Button */}
        <div className="relative flex items-center">
          {/* Sonic Shockwave Glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-emerald-400 to-teal-400 rounded-full blur-md opacity-70 group-hover:opacity-100 animate-pulse"></div>

          {/* Main Floating Body */}
          <div
            onClick={() => {
              if (!hasMovedDuringDrag) {
                setIsOpen(!isOpen);
              }
            }}
            onMouseDown={(e) => handleStartDrag(e.clientX, e.clientY)}
            onTouchStart={(e) => handleStartDrag(e.touches[0].clientX, e.touches[0].clientY)}
            className="relative px-3.5 py-3 bg-gradient-to-r from-[#020b1c] via-[#051833] to-[#041328] border-2 border-cyan-400/80 hover:border-cyan-300 text-white rounded-full shadow-[0_0_30px_rgba(6,182,212,0.6)] flex items-center gap-2.5 group-hover:shadow-[0_0_45px_rgba(6,182,212,0.9)] transition-all"
            title="سهم التوجيه الذكي ومسرّع المهام الفوري (انقر للإعدادات، واسحب للتحريك)"
          >
            {/* Rotating Arrow Icon */}
            <div 
              style={{ transform: `rotate(${arrowAngle}deg)` }}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg transition-transform duration-200"
            >
              <div className="w-full h-full rounded-full bg-black/70 flex items-center justify-center">
                <Navigation2 className="w-4 h-4 text-cyan-300 fill-cyan-400/80 -rotate-45" />
              </div>
            </div>

            {/* Label & Velocity Badge */}
            <div className="text-right flex flex-col items-start pr-0.5 font-arabic">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-black text-white leading-tight">سهم التوجيه الذكي</span>
                <span className="text-[8px] bg-gradient-to-r from-amber-400 to-orange-500 text-black px-1.5 py-0.2 rounded-full font-black font-mono">
                  TURBO
                </span>
              </div>
              <span className="text-[9px] font-mono text-cyan-300/90">مسرّع المهام الفوري ⚡</span>
            </div>

            {/* Quick Action Trigger Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickOrbit(!showQuickOrbit);
              }}
              className="p-1 rounded-full bg-white/10 hover:bg-cyan-500 hover:text-black text-cyan-300 transition-all ml-0.5"
              title="قائمة الإجراءات السريعة"
            >
              <Zap className="w-3.5 h-3.5" />
            </button>

            {/* Counter Badge for Deficiencies */}
            {deficiencies.filter(d => !resolvedIds.includes(d.id)).length > 0 && (
              <span className="w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-pulse border border-white">
                {deficiencies.filter(d => !resolvedIds.includes(d.id)).length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Guidance & Command Optimizer Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 sm:right-6 sm:my-auto sm:h-[90vh] sm:max-h-[820px] w-full sm:w-[540px] bg-[#030917]/95 backdrop-blur-2xl border-l sm:border border-cyan-500/40 sm:rounded-[2.5rem] shadow-[0_0_90px_rgba(0,0,0,0.85)] z-[2500] flex flex-col overflow-hidden font-arabic text-right animate-slideIn">
          
          {/* Header */}
          <div className="bg-[#051129] border-b border-cyan-500/20 p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-emerald-500/30 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <Navigation2 className="w-5 h-5 text-cyan-300 fill-cyan-400/50" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>سهم التوجيه الذكي ومسرّع المهام</span>
                  <span className="text-[10px] bg-gradient-to-r from-amber-400 to-orange-500 text-black px-2 py-0.5 rounded-full font-black font-mono">
                    Hyper-Velocity v3
                  </span>
                </h3>
                <p className="text-xs text-cyan-400 font-mono">القسم الحالي: {currentTab}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleMasterTurboBoost}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs flex items-center gap-1 hover:scale-105 active:scale-95 transition-all shadow-md"
                title="تسريع فوري"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>تيربو ⚡</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="bg-[#020610] p-2 border-b border-white/5 grid grid-cols-6 gap-1">
            <button
              onClick={() => setActiveSubTab('speed_engine')}
              className={`py-2 px-1 rounded-xl text-[10px] sm:text-[11px] font-black transition-all flex items-center justify-center gap-1 relative ${
                activeSubTab === 'speed_engine'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-black shadow-lg shadow-cyan-900/40 font-black'
                  : 'text-cyan-300 hover:text-white hover:bg-cyan-500/10'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>مسرّع المهام</span>
            </button>

            <button
              onClick={() => setActiveSubTab('scanner')}
              className={`py-2 px-1 rounded-xl text-[10px] sm:text-[11px] font-black transition-all flex items-center justify-center gap-1 ${
                activeSubTab === 'scanner'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scan className="w-3.5 h-3.5" />
              <span>تحليل الشاشة</span>
            </button>

            <button
              onClick={() => setActiveSubTab('active_learning')}
              className={`py-2 px-1 rounded-xl text-[10px] sm:text-[11px] font-black transition-all flex items-center justify-center gap-1 relative ${
                activeSubTab === 'active_learning'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-md font-black'
                  : 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>التعلم النشط</span>
            </button>

            <button
              onClick={() => setActiveSubTab('deficiencies')}
              className={`py-2 px-1 rounded-xl text-[10px] sm:text-[11px] font-black transition-all flex items-center justify-center gap-1 ${
                activeSubTab === 'deficiencies'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>النواقص ({deficiencies.filter(d => !resolvedIds.includes(d.id)).length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('suggestions')}
              className={`py-2 px-1 rounded-xl text-[10px] sm:text-[11px] font-black transition-all flex items-center justify-center gap-1 ${
                activeSubTab === 'suggestions'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>الأوامر</span>
            </button>

            <button
              onClick={() => setActiveSubTab('explainer')}
              className={`py-2 px-1 rounded-xl text-[10px] sm:text-[11px] font-black transition-all flex items-center justify-center gap-1 ${
                activeSubTab === 'explainer'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>الشارح</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-4">

            {/* Tab 0: SPEED ENGINE & TASK ACCELERATOR (مسرّع المهام الفوري) */}
            {activeSubTab === 'speed_engine' && (
              <div className="space-y-4 animate-fadeIn">
                {/* Hyper-Speed Metrics Banner */}
                <div className="bg-gradient-to-br from-[#061430] to-[#040c1e] border border-cyan-500/40 p-4 rounded-3xl relative overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></div>
                      <span className="text-xs font-black text-white">مؤشرات تسريع المهام اللحظية</span>
                    </div>
                    <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/30">
                      528Hz Quantum Lock
                    </span>
                  </div>

                  {/* 4 Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="bg-black/60 p-2.5 rounded-2xl border border-white/5">
                      <span className="text-[10px] text-slate-400 font-mono block">زمن الاستجابة</span>
                      <span className="text-base font-black text-cyan-300 font-mono">8ms</span>
                      <span className="text-[9px] text-emerald-400 block font-bold">Zero-Lag ⚡</span>
                    </div>
                    <div className="bg-black/60 p-2.5 rounded-2xl border border-white/5">
                      <span className="text-[10px] text-slate-400 font-mono block">تسريع QPU</span>
                      <span className="text-base font-black text-amber-300 font-mono">3.8x</span>
                      <span className="text-[9px] text-amber-400 block font-bold">Turbo Boost 🚀</span>
                    </div>
                    <div className="bg-black/60 p-2.5 rounded-2xl border border-white/5">
                      <span className="text-[10px] text-slate-400 font-mono block">ضغط التوكنز</span>
                      <span className="text-base font-black text-emerald-300 font-mono">-35%</span>
                      <span className="text-[9px] text-emerald-400 block font-bold">توفير ذكي</span>
                    </div>
                    <div className="bg-black/60 p-2.5 rounded-2xl border border-white/5">
                      <span className="text-[10px] text-slate-400 font-mono block">حالة السهم</span>
                      <span className="text-base font-black text-purple-300 font-mono">طافي حر</span>
                      <span className="text-[9px] text-purple-400 block font-bold">Free Flight 🧭</span>
                    </div>
                  </div>
                </div>

                {/* Instant Task Execution Deck */}
                <div className="bg-[#081226] border border-white/10 p-4 rounded-3xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-black text-white">منصة تنفيذ وتسريع المهام بضغطة واحدة</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">One-Click Actions</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Action 1: Supercharge */}
                    <button
                      onClick={handleMasterTurboBoost}
                      className="p-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 rounded-2xl text-right transition-all flex items-start gap-2.5 group"
                    >
                      <div className="p-2 rounded-xl bg-amber-500 text-black font-black group-hover:scale-110 transition-transform">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-white">التسريع الشامل وتفريغ الذاكرة</div>
                        <div className="text-[10px] text-amber-300/80">إعادة ضبط تردد 528Hz وتفعيل Cryo Cache</div>
                      </div>
                    </button>

                    {/* Action 2: Fix all deficiencies */}
                    <button
                      onClick={handleSolveAllDeficiencies}
                      className="p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 rounded-2xl text-right transition-all flex items-start gap-2.5 group"
                    >
                      <div className="p-2 rounded-xl bg-emerald-500 text-black font-black group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-white">حل وإغلاق النواقص فوراً</div>
                        <div className="text-[10px] text-emerald-300/80">معالجة وتطبيق إصلاحات الشاشة دفعة واحدة</div>
                      </div>
                    </button>

                    {/* Action 3: Quick Python Run */}
                    <button
                      onClick={() => {
                        onNavigate(AppTab.PYTHON_FORGE);
                        triggerSpeedToast('🐍 تم الانتقال إلى مفاعل بايثون السريع');
                      }}
                      className="p-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-2xl text-right transition-all flex items-start gap-2.5 group"
                    >
                      <div className="p-2 rounded-xl bg-cyan-500 text-black font-black group-hover:scale-110 transition-transform">
                        <Code2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-white">مفاعل بايثون وتشغيل الشيفرات</div>
                        <div className="text-[10px] text-cyan-300/80">تنفيذ خوارزميات بايثون الحقيقية داخل WASM</div>
                      </div>
                    </button>

                    {/* Action 4: Kimi LLM Studio & Bridge */}
                    <button
                      onClick={() => {
                        onNavigate(AppTab.KIMI_LLM_STUDIO);
                        triggerSpeedToast('🔮 تم فتح استوديو Kimi LLM ونماذج Moonshot');
                      }}
                      className="p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-2xl text-right transition-all flex items-start gap-2.5 group"
                    >
                      <div className="p-2 rounded-xl bg-purple-500 text-white font-black group-hover:scale-110 transition-transform">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-white">استوديو Kimi LLM (Moonshot AI)</div>
                        <div className="text-[10px] text-purple-300/80">نماذج 2M توكن وسلسلة الاستدلال وتشغيل بايثون</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Floating Arrow Position Snap Controls */}
                <div className="bg-[#060e20] border border-white/10 p-4 rounded-3xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-cyan-400" />
                      <h4 className="text-xs font-black text-white">التحكم في تموضع وحرية السهم الطافي</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Dock Presets</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    يمكنك سحب السهم بالإصبع أو الفأرة ووضعه في أي زاوية بحرية كاملة، أو استخدام مواقع الإرساء السريعة:
                  </p>

                  <div className="grid grid-cols-5 gap-2">
                    <button
                      onClick={() => handleDockPosition('bottom-right')}
                      className="p-2 rounded-xl bg-black/60 border border-white/10 hover:border-cyan-400 text-[10px] font-bold text-slate-300 hover:text-white transition-all text-center"
                    >
                      أسفل يمين
                    </button>
                    <button
                      onClick={() => handleDockPosition('bottom-left')}
                      className="p-2 rounded-xl bg-black/60 border border-white/10 hover:border-cyan-400 text-[10px] font-bold text-slate-300 hover:text-white transition-all text-center"
                    >
                      أسفل يسار
                    </button>
                    <button
                      onClick={() => handleDockPosition('top-right')}
                      className="p-2 rounded-xl bg-black/60 border border-white/10 hover:border-cyan-400 text-[10px] font-bold text-slate-300 hover:text-white transition-all text-center"
                    >
                      أعلى يمين
                    </button>
                    <button
                      onClick={() => handleDockPosition('top-left')}
                      className="p-2 rounded-xl bg-black/60 border border-white/10 hover:border-cyan-400 text-[10px] font-bold text-slate-300 hover:text-white transition-all text-center"
                    >
                      أعلى يسار
                    </button>
                    <button
                      onClick={() => handleDockPosition('center')}
                      className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-black text-[10px] hover:scale-105 active:scale-95 transition-all text-center"
                    >
                      وسط الشاشة
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeSubTab === 'scanner' && (
              <div className="space-y-4 animate-fadeIn">
                {/* Live Screen Scanner Card */}
                <div className="bg-[#060e22] border border-emerald-500/30 p-4 rounded-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                      <span className="text-xs font-black text-white">الماسح السياقي لمحتوى الشاشة</span>
                    </div>
                    <button
                      onClick={handleRunLiveScreenScan}
                      disabled={isScanning}
                      className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
                      <span>مسح الشاشة الآن</span>
                    </button>
                  </div>

                  {/* Detected Context Summary */}
                  <div className="bg-black/60 p-3 rounded-xl border border-white/5 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-mono">القسم المرصود:</span>
                      <span className="text-cyan-300 font-black font-mono">{currentTab}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-mono">آخر مسح:</span>
                      <span className="text-slate-300 font-mono">{scanTimestamp}</span>
                    </div>
                    <p className="text-[11px] text-emerald-300/90 leading-relaxed pt-1 border-t border-white/5">
                      {currentProfile.reasoningNote}
                    </p>
                  </div>
                </div>

                {/* Recommended AI Model & Parameter Tuning */}
                <div className="bg-[#081024] border border-cyan-500/20 p-4 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-cyan-400" />
                      <h4 className="text-xs font-black text-white">ضبط نموذج الذكاء الاصطناعي (Model & Hyperparameters)</h4>
                    </div>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-mono font-bold">
                      مقترح تلقائي
                    </span>
                  </div>

                  {/* Model Selector */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] text-slate-400 font-bold">النموذج الموصى به:</div>
                    <div className="grid grid-cols-3 gap-2">
                      {['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'].map((mod) => (
                        <button
                          key={mod}
                          onClick={() => setSelectedModel(mod)}
                          className={`py-1.5 px-2 rounded-xl text-[10px] font-mono font-bold border transition-all truncate ${
                            selectedModel === mod
                              ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                              : 'bg-black/50 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {mod.replace('gemini-2.5-', '')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Temperature Slider */}
                  <div className="space-y-1.5 bg-black/40 p-3 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-400">درجة الحرارة (Temperature):</span>
                      <span className="text-cyan-300 font-bold">{currentTemperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={currentTemperature}
                      onChange={(e) => setCurrentTemperature(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-full"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>0.0 (دقيق / منطقي / شيفرات)</span>
                      <span>1.0 (إبداعي / استكشافي)</span>
                    </div>
                  </div>

                  {/* Top-P Slider */}
                  <div className="space-y-1.5 bg-black/40 p-3 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-400">نطاق التوليد (Top-P):</span>
                      <span className="text-cyan-300 font-bold">{currentTopP}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={currentTopP}
                      onChange={(e) => setCurrentTopP(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-full"
                    />
                  </div>

                  {/* Apply Model Tuning Button */}
                  <button
                    onClick={handleApplyRecommendedTuning}
                    className={`w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-lg ${
                      tuningApplied 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black active:scale-95'
                    }`}
                  >
                    {tuningApplied ? <Check className="w-3.5 h-3.5" /> : <Settings2 className="w-3.5 h-3.5" />}
                    <span>{tuningApplied ? 'تم تطبيق المعايير الفضلى للنموذج' : 'تطبيق إعدادات النموذج الفضلى لهذا السياق'}</span>
                  </button>
                </div>

                {/* Contextual Code Optimizations */}
                <div className="bg-[#081024] border border-white/10 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-black text-white">أوامر تحسين برمجية مقترحة لسياقك الحالي</h4>
                  </div>

                  {currentProfile.codeOptimizations.map((opt, idx) => (
                    <div key={idx} className="bg-black/70 p-3 rounded-xl border border-emerald-500/20 space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-emerald-300">
                        <span>{opt.title}</span>
                      </div>
                      <div className="bg-black/90 p-2 rounded-lg font-mono text-[11px] text-cyan-300 dir-ltr text-left border border-white/5">
                        {opt.snippet}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        <span className="text-emerald-400 font-bold">الفائدة:</span> {opt.benefit}
                      </div>
                      <button
                        onClick={() => {
                          if (onApplyOptimization) onApplyOptimization(opt.snippet);
                        }}
                        className="w-full py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                      >
                        <Zap className="w-3 h-3" />
                        <span>تطبيق أمر التحسين البرمجي</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Active Learning & Self-Tuning Engine (التعلم النشط وتحليل سجل المهام) */}
            {activeSubTab === 'active_learning' && (
              <div className="space-y-4 animate-fadeIn">
                {/* Active Learning Overview Banner */}
                <div className="bg-gradient-to-br from-[#1c1204] via-[#0d0a14] to-[#040814] border border-amber-500/30 p-4 rounded-2xl relative overflow-hidden space-y-3 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                        <Brain className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                          <span>محرك التعلم النشط (Active Learning Engine)</span>
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-mono font-bold">
                            Live Auto-Tuner
                          </span>
                        </h4>
                        <p className="text-[10px] text-amber-300/80">
                          تحليل سجل الاستجابات الأخيرة واستنباط التوجيهات والحرارة الفضلى لجمناي
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleRunActiveLearningAnalysis}
                      disabled={isAnalyzingTasks}
                      className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black text-[11px] font-black rounded-xl transition-all flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzingTasks ? 'animate-spin' : ''}`} />
                      <span>{isAnalyzingTasks ? 'جارِ التحليل...' : 'تحليل السجل الآن'}</span>
                    </button>
                  </div>

                  {/* 4 Stats Chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="bg-black/50 p-2 rounded-xl border border-white/5 text-center">
                      <span className="text-[10px] text-slate-400 block font-mono">المهام المحللة</span>
                      <span className="text-xs font-black text-amber-400 font-mono">{taskLogs.length} مهام حديثة</span>
                    </div>
                    <div className="bg-black/50 p-2 rounded-xl border border-white/5 text-center">
                      <span className="text-[10px] text-slate-400 block font-mono">متوسط الدقة</span>
                      <span className="text-xs font-black text-emerald-400 font-mono">92.4%</span>
                    </div>
                    <div className="bg-black/50 p-2 rounded-xl border border-white/5 text-center">
                      <span className="text-[10px] text-slate-400 block font-mono">كسب الكفاءة</span>
                      <span className="text-xs font-black text-cyan-400 font-mono">+34%</span>
                    </div>
                    <div className="bg-black/50 p-2 rounded-xl border border-white/5 text-center">
                      <span className="text-[10px] text-slate-400 block font-mono">حالة المحرك</span>
                      <span className="text-xs font-black text-amber-300 font-mono flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        مستمر
                      </span>
                    </div>
                  </div>
                </div>

                {/* Learned Insights & Patterns */}
                <div className="bg-[#081024] border border-white/10 p-4 rounded-2xl space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-400 font-black text-xs">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>الأنماط المستخلصة من تحليل سجل الاستجابات:</span>
                  </div>
                  <div className="space-y-1.5">
                    {activeLearningProposal.identifiedPatterns.map((pattern, idx) => (
                      <div key={idx} className="bg-black/60 p-2.5 rounded-xl border border-white/5 flex items-start gap-2 text-[11px] text-slate-300 leading-relaxed">
                        <span className="text-amber-400 font-mono font-bold mt-0.5">•</span>
                        <span>{pattern}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Proposed Tuning Parameters (Temperature & Model) */}
                <div className="bg-[#071120] border border-cyan-500/20 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                      <h4 className="text-xs font-black text-white">الضبط التلقائي المقترح لـ Gemini Hyperparameters</h4>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">
                      {activeLearningProposal.efficiencyGainEstimate}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/60 p-2.5 rounded-xl border border-white/5 space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                        <span>الحرارة المحسوبة (Temp):</span>
                        <span className="text-amber-400 font-bold">{activeLearningProposal.targetTemperature}</span>
                      </div>
                      <div className="text-[10px] text-emerald-300 font-bold">
                        (مثالية للأكواد والقرارات الحاسمة)
                      </div>
                    </div>
                    <div className="bg-black/60 p-2.5 rounded-xl border border-white/5 space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                        <span>النموذج الأمثل:</span>
                        <span className="text-cyan-300 font-bold">{activeLearningProposal.targetModel}</span>
                      </div>
                      <div className="text-[10px] text-cyan-400/80 font-bold">
                        (سرعة قصوى ودقة استدلال)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Adaptive System Directives Editor & Injection Box */}
                <div className="bg-[#081024] border border-amber-500/20 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-black text-white">توجيهات النظام المقترحة (System Directives)</h4>
                    </div>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                      Adaptive Prompting
                    </span>
                  </div>

                  <textarea
                    value={activeLearningProposal.systemDirectives}
                    onChange={(e) => setActiveLearningProposal(prev => ({ ...prev, systemDirectives: e.target.value, applied: false }))}
                    rows={6}
                    className="w-full bg-black/80 border border-amber-500/30 rounded-xl p-3 text-[11px] font-mono text-amber-200 dir-ltr text-left focus:outline-none focus:border-amber-400 transition-all custom-scrollbar leading-relaxed"
                  />

                  {/* Apply Active Learning Master Button */}
                  <button
                    onClick={handleApplyActiveLearning}
                    className={`w-full py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg ${
                      activeLearningProposal.applied
                        ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                        : 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-black shadow-[0_0_25px_rgba(245,158,11,0.4)] active:scale-95'
                    }`}
                  >
                    {activeLearningProposal.applied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تم تطبيق توجيهات النظام ودرجة الحرارة على محرك جمناي بنجاح</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>تطبيق تحسينات التعلم النشط وتوجيهات جمناي فوراً</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Recent Task Logs List */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                    <div className="flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-cyan-400" />
                      <span>سجل المهام الأخيرة ونقاط الاختناق المرصودة:</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">آخر التبادلات</span>
                  </div>

                  <div className="space-y-2">
                    {taskLogs.map((log) => (
                      <div key={log.id} className="bg-[#050b18] p-3 rounded-xl border border-white/5 space-y-1.5">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 font-mono text-slate-300">
                              {log.id}
                            </span>
                            <h5 className="text-xs font-black text-white">{log.taskTitle}</h5>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            دقة {log.qualityScore}%
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                          <span>النموذج: <strong className="text-cyan-300">{log.modelUsed}</strong></span>
                          <span>الحرارة: <strong className="text-amber-300">{log.temperatureUsed}</strong></span>
                          <span>الزمن: <strong className="text-slate-200">{log.latencyMs}ms</strong></span>
                          <span>التوكنز: <strong className="text-slate-200">{log.tokenCount}</strong></span>
                        </div>

                        <div className="bg-black/50 p-2 rounded-lg text-[10px] text-rose-300/90 font-mono border border-rose-500/10 flex items-start gap-1.5">
                          <span className="text-rose-400 font-bold shrink-0">تشخيص الاختناق:</span>
                          <span>{log.detectedBottleneck}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Tab 1: Deficiencies & Guidance (النواقص والإرشاد) */}
            {activeSubTab === 'deficiencies' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-xs text-emerald-300 flex items-start gap-3">
                  <span className="text-xl">💡</span>
                  <div>
                    <span className="font-black block text-emerald-200 mb-0.5">مؤشر الإرشاد التلقائي:</span>
                    يقوم المرشد بمسح هيكل النظام باستمرار والإشارة بدقة إلى الإجراءات والتحسينات الموصى بتنفيذها.
                  </div>
                </div>

                {deficiencies.map((def) => {
                  const isResolved = resolvedIds.includes(def.id);
                  return (
                    <div
                      key={def.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isResolved
                          ? 'bg-emerald-950/20 border-emerald-500/20 opacity-75'
                          : def.severity === 'high'
                            ? 'bg-[#12080c] border-rose-500/30 hover:border-rose-500/50'
                            : 'bg-[#081024] border-emerald-500/20 hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">
                            {isResolved ? '✅' : def.severity === 'high' ? '🚨' : '👉'}
                          </span>
                          <h4 className="text-sm font-black text-white">{def.title}</h4>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase ${
                          def.severity === 'high' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {def.severity}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mb-3 leading-relaxed">{def.description}</p>
                      
                      <div className="bg-black/60 p-3 rounded-xl border border-white/5 text-[11px] text-emerald-300 font-mono mb-3">
                        <div className="text-[10px] text-slate-400 mb-1">الإجراء الموصى به:</div>
                        {def.suggestedFix}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                        {def.targetTab && (
                          <button
                            onClick={() => {
                              onNavigate(def.targetTab!);
                              setIsOpen(false);
                            }}
                            className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                          >
                            <span>الانتقال للقسم ({def.targetTab})</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleResolve(def)}
                          disabled={isResolved}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                            isResolved
                              ? 'bg-emerald-600/30 text-emerald-300 cursor-default'
                              : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-md active:scale-95'
                          }`}
                        >
                          {isResolved ? <Check className="w-3.5 h-3.5" /> : <Wand2 className="w-3.5 h-3.5" />}
                          <span>{isResolved ? 'تم التحسين والمعالجة' : 'تطبيق التحسين فوراً'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 2: Command Suggestions (اقتراحات الأوامر) */}
            {activeSubTab === 'suggestions' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-xs text-slate-400 mb-2">
                  أوامر سيادية مسبقة الإعداد لتحسين استجابة الخوادم والنواة:
                </div>

                {commandSuggestions.map((cmd) => (
                  <div
                    key={cmd.id}
                    className="bg-[#081024] border border-cyan-500/20 hover:border-cyan-500/40 p-4 rounded-2xl space-y-3 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-sm font-black text-white">{cmd.title}</h4>
                      </div>
                      <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-mono">
                        {cmd.type}
                      </span>
                    </div>

                    <div className="bg-black/70 p-2.5 rounded-xl border border-white/5 font-mono text-xs text-emerald-300 dir-ltr text-left">
                      {cmd.command}
                    </div>

                    <p className="text-xs text-slate-300">{cmd.explanation}</p>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl text-[11px] text-emerald-300">
                      <span className="font-bold text-emerald-200">الأثر المتوقع:</span> {cmd.impact}
                    </div>

                    <button
                      onClick={() => handleApplyCommand(cmd)}
                      disabled={cmd.applied}
                      className={`w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                        cmd.applied
                          ? 'bg-white/10 text-slate-400 cursor-default'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg active:scale-95'
                      }`}
                    >
                      {cmd.applied ? <Check className="w-3.5 h-3.5" /> : <Terminal className="w-3.5 h-3.5" />}
                      <span>{cmd.applied ? 'تم إرسال الأمر للنواة' : 'تشغيل وتطبيق الأمر في النظام'}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Command Explainer & Improver (شارح ومحسن الأوامر) */}
            {activeSubTab === 'explainer' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-[#081024] border border-white/10 p-4 rounded-2xl space-y-3">
                  <h4 className="text-sm font-black text-white">شارح ومحلل الأوامر المخصصة:</h4>
                  <p className="text-xs text-slate-300">
                    اكتب أي أمر أو استعلام تريد تنفيذه وسيقوم النظام بشرح آلية عمله، واقتراح التعديلات الأفضل لتحسين أدائه:
                  </p>

                  <div className="relative">
                    <input
                      type="text"
                      value={customCommand}
                      onChange={(e) => setCustomCommand(e.target.value)}
                      placeholder="مثال: optimize memory --level=ultra"
                      className="w-full bg-black/80 border border-emerald-500/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-mono"
                      onKeyDown={(e) => e.key === 'Enter' && handleExplainCustom()}
                    />
                  </div>

                  <button
                    onClick={handleExplainCustom}
                    disabled={isExplaining || !customCommand.trim()}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
                  >
                    {isExplaining ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>تحليل وشرح الأمر واقتراح تحسينات</span>
                      </>
                    )}
                  </button>
                </div>

                {customExplanation && (
                  <div className="bg-[#060c18] border border-emerald-500/30 p-4 rounded-2xl space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <Lightbulb className="w-4 h-4" />
                      <span>{customExplanation.title}</span>
                    </div>

                    <div className="text-xs text-slate-200 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                      {customExplanation.explanation}
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-xs text-emerald-300">
                      <span className="font-bold text-emerald-200">التحسين المقترح:</span> {customExplanation.impact}
                    </div>

                    <button
                      onClick={() => {
                        if (onApplyOptimization) onApplyOptimization(customCommand);
                        setCustomExplanation(null);
                        setCustomCommand('');
                      }}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all"
                    >
                      تأكيد التنفيذ بعد المراجعة
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Footer Info */}
          <div className="bg-[#020610] p-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Sovereign Context Engine v2.5</span>
            <span className="text-emerald-400">محلل النماذج والسياق نشط</span>
          </div>

        </div>
      )}
    </>
  );
};
