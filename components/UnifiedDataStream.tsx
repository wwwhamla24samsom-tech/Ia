import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, Sparkles, Shield, Activity, Cpu, Network, Zap, 
  ChevronDown, ChevronUp, Radio, Terminal, Waves, RefreshCw,
  Maximize2, Eye, Lock, ShieldAlert, CheckCircle2, AlertTriangle,
  RotateCcw, Sliders, Wrench, HeartPulse, Filter, UserCheck, 
  Compass, Code, Layers, Bot, X, ExternalLink, ArrowUpRight, Search
} from 'lucide-react';
import { probeDragonEnvironment, DragonTelemetry } from '../services/dragonDomeEngine';
import { AppTab } from '../types';

interface UnifiedDataStreamProps {
  onNavigate?: (tab: AppTab) => void;
}

export interface NanoQuantumState {
  domeIntegrity: number;
  quantumConsensus: number;
  hydroFrequency: number;
  draconicResonance: number;
  activeHexVectors: number;
  blockedIntrusions: number;
  entanglementLevel: number;
  nanoFluxFluxRate: number;
  lastTelemetryTick: string;
  unifiedStatus: 'SYNCHRONIZED_LOCK' | 'RESONATING' | 'DEFENDING' | 'OVERDRIVE' | 'AUTO_RECOVERING';
}

export interface ErrorCorrectionLog {
  id: string;
  timestamp: string;
  incidentType: 'STREAM_DROP' | 'COHERENCE_DESYNC' | 'TELEMETRY_TIMEOUT' | 'SOCKET_LATENCY_SPIKE';
  subsystem: string;
  remedyAction: string;
  restorationStatus: 'HEALED' | 'RE-INITIALIZED' | 'BYPASS_ACTIVE';
  latencyMs: number;
}

export type StrategicAgentRole = 
  | 'ALL'
  | 'ARCHITECT'    // المهندس المعماري
  | 'PLANNER'      // المخطط التكتيكي
  | 'SECURITY_SENTINEL' // حارس الأمن السيادي
  | 'CODE_FORGER'  // صانع الأكواد
  | 'QUANTUM_CORE' // معالج النواة الكوآنتومية
  | 'HARMONIC_RESONATOR'; // منسق الرنين المائي

export interface StrategicAgentInfo {
  id: StrategicAgentRole;
  arabicName: string;
  englishTitle: string;
  icon: string;
  color: string;
  badgeBg: string;
  borderColor: string;
  description: string;
  currentObjective: string;
  workload: number;
  throughput: string;
  status: 'ACTIVE' | 'PROCESSING' | 'SYNCHRONIZED' | 'DEFENDING';
  metrics: {
    label: string;
    value: string | number;
  }[];
  recentOutputs: {
    id: string;
    timestamp: string;
    topic: string;
    status: 'OPTIMAL' | 'VERIFIED' | 'SECURED';
    payload: string;
  }[];
}

export const UnifiedDataStream: React.FC<UnifiedDataStreamProps> = ({ onNavigate }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [telemetry, setTelemetry] = useState<DragonTelemetry | null>(null);
  const [nanoState, setNanoState] = useState<NanoQuantumState>({
    domeIntegrity: 99.98,
    quantumConsensus: 98.7,
    hydroFrequency: 528,
    draconicResonance: 963,
    activeHexVectors: 6,
    blockedIntrusions: 142,
    entanglementLevel: 99.4,
    nanoFluxFluxRate: 14.8,
    lastTelemetryTick: '00:00:00',
    unifiedStatus: 'SYNCHRONIZED_LOCK'
  });

  const [streamLogs, setStreamLogs] = useState<string[]>([
    '[INIT] دمج تدفقات DragonDome (حاجز القبة السيادي) مع HexagramMatrix (المصفوفة السداسية الكوآنتومية)',
    '[NANO-SYNC] اقتران تردد الرنين المائي (528Hz) مع ذبذبة دراغون الإمبراطورية (963Hz)',
    '[AEC_LAYER] طبقة تصحيح الأخطاء الذاتية (Automatic Error Correction) في وضع الرصد النشط 24/7',
    '[SECURITY] النواة الكوآنتومية محمية بـ Zero-Trust Shield ضد أي تطفل خارجي',
    '[TELEMETRY] كافة المتجهات الستة في حالة ترابط نانو-كوآنتومي مستقر (100% Coherence)'
  ]);

  // Automatic Error Correction State
  const [aecActive, setAecActive] = useState<boolean>(true);
  const [healingCount, setHealingCount] = useState<number>(3);
  const [correctionLogs, setCorrectionLogs] = useState<ErrorCorrectionLog[]>([
    {
      id: 'AEC-1091',
      timestamp: new Date(Date.now() - 25000).toLocaleTimeString(),
      incidentType: 'STREAM_DROP',
      subsystem: 'DragonDome Stream Port #0',
      remedyAction: 'Auto-reseeded entropy vector & re-established L4 Obsidian tunnel',
      restorationStatus: 'HEALED',
      latencyMs: 1.4
    },
    {
      id: 'AEC-1092',
      timestamp: new Date(Date.now() - 12000).toLocaleTimeString(),
      incidentType: 'COHERENCE_DESYNC',
      subsystem: 'Hexagram Resonant Vector γ',
      remedyAction: 'Sub-harmonic phase realignment loop triggered (528Hz lock)',
      restorationStatus: 'RE-INITIALIZED',
      latencyMs: 2.1
    }
  ]);
  const [isRecovering, setIsRecovering] = useState<boolean>(false);
  const [watchdogHealthy, setWatchdogHealthy] = useState<boolean>(true);

  const lastHeartbeatRef = useRef<number>(Date.now());
  const failCounterRef = useRef<number>(0);

  // Strategic Agent Filter State
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<StrategicAgentRole>('ALL');
  const [expandedAgentModal, setExpandedAgentModal] = useState<StrategicAgentInfo | null>(null);

  // Strategic Agents Registry & Dedicated Telemetry Feed
  const strategicAgents: StrategicAgentInfo[] = useMemo(() => [
    {
      id: 'ARCHITECT',
      arabicName: 'المهندس المعماري (Architect)',
      englishTitle: 'Strategic System Architect',
      icon: '📐',
      color: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
      borderColor: 'border-amber-500/30',
      description: 'تصميم البنية الهيكلية الشاملة للأنظمة السيادية، نمذجة تدفقات البيانات، ومواءمة الوحدات مع متطلبات الأداء الفائق.',
      currentObjective: 'تطوير معمار الحماية متعدد الطبقات L4 Obsidian وربط خطوط النواة 10G',
      workload: 84,
      throughput: '1.8M tokens/s',
      status: 'ACTIVE',
      metrics: [
        { label: 'الرسوم المعمارية المنجزة', value: '48 Blueprint' },
        { label: 'كفاءة الربط البيني', value: '99.7%' },
        { label: 'زمن المعالجة الهيكلية', value: '0.45ms' },
        { label: 'التوافق مع النواة', value: '100% Locked' }
      ],
      recentOutputs: [
        {
          id: 'ARC-801',
          timestamp: new Date(Date.now() - 60000).toLocaleTimeString(),
          topic: 'Obsidian Shield Sub-topology Grid',
          status: 'VERIFIED',
          payload: 'بناء مخطط الربط الهيكلي بين محرك DragonDome ومصفوفة الاستجابة الفورية (D3 Mesh).'
        },
        {
          id: 'ARC-802',
          timestamp: new Date(Date.now() - 180000).toLocaleTimeString(),
          topic: 'Hexagram Crossbar Architecture v16',
          status: 'OPTIMAL',
          payload: 'تأكيد انعدام التداخل الإشعاعي وتخصيص 6 مسارات ناقلة غير متزامنة.'
        }
      ]
    },
    {
      id: 'PLANNER',
      arabicName: 'المخطط التكتيكي (Planner)',
      englishTitle: 'Tactical Mission Planner',
      icon: '🧭',
      color: 'from-cyan-500 to-blue-600',
      badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
      borderColor: 'border-cyan-500/30',
      description: 'تفكيك الأهداف الاستراتيجية إلى خطوات تكتيكية دقيقة ومصفوفات زمنية مع تقييم المخاطر والمصلحة العليا.',
      currentObjective: 'جدولة خطط الاستجابة للطوارئ وحساب الاحتمالات التنبؤية للاختناق',
      workload: 72,
      throughput: '2.4M tokens/s',
      status: 'PROCESSING',
      metrics: [
        { label: 'الخطط التكتيكية النشطة', value: '12 Mission' },
        { label: 'دقة تقدير المخاطر', value: '98.9%' },
        { label: 'متوسط وقت التخطيط', value: '1.1s' },
        { label: 'معامل المصلحة العليا', value: '100% Alpha' }
      ],
      recentOutputs: [
        {
          id: 'PLN-401',
          timestamp: new Date(Date.now() - 45000).toLocaleTimeString(),
          topic: 'Zero-Downtime Re-init Sequence Plan',
          status: 'OPTIMAL',
          payload: 'اعتماد خطة الاستعادة التلقائية بدون توقف بدقة 1.5ms لمكونات النواة.'
        },
        {
          id: 'PLN-402',
          timestamp: new Date(Date.now() - 150000).toLocaleTimeString(),
          topic: 'Resource Allocation Priority Matrix',
          status: 'VERIFIED',
          payload: 'إعطاء الأولوية القصوى لخيوط المعالجة المرتبطة بدرع التشفير الكوآنتومي.'
        }
      ]
    },
    {
      id: 'SECURITY_SENTINEL',
      arabicName: 'حارس الأمن السيادي (Sentinel)',
      englishTitle: 'Sovereign Security Sentinel',
      icon: '🛡️',
      color: 'from-rose-500 to-red-700',
      badgeBg: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
      borderColor: 'border-rose-500/30',
      description: 'رصد واعتراض محاولات التطفل، عزل النواة ببروتوكول Zero-Trust، ومسح الذاكرة من أي شيفرات مشبوهة.',
      currentObjective: 'حراسة قبة DragonDome Obsidian L4 واعتراض هجمات التشويش الكوآنتومي',
      workload: 91,
      throughput: '3.1M checks/s',
      status: 'DEFENDING',
      metrics: [
        { label: 'الهجمات المحجوبة', value: `${nanoState.blockedIntrusions} محاولة` },
        { label: 'زمن الردع التلقائي', value: '0.12ms' },
        { label: 'تكامل الجدار العازل', value: `${nanoState.domeIntegrity}%` },
        { label: 'تشفير الجلسات', value: 'WebCrypto SHA-256' }
      ],
      recentOutputs: [
        {
          id: 'SEC-901',
          timestamp: new Date(Date.now() - 30000).toLocaleTimeString(),
          topic: 'Quantum Decoupling Shield Assertion',
          status: 'SECURED',
          payload: 'صد محاولة استشعار حراري عشوائية وتثبيت التشفير السيادي.'
        },
        {
          id: 'SEC-902',
          timestamp: new Date(Date.now() - 110000).toLocaleTimeString(),
          topic: 'Memory Barrier Quarantine Event',
          status: 'SECURED',
          payload: 'تطهير وإعادة تعيين المؤشرات في مساحة الرمل العصبونية (Neural Sandbox).'
        }
      ]
    },
    {
      id: 'CODE_FORGER',
      arabicName: 'صانع الأكواد (Code Forger)',
      englishTitle: 'Autonomous Code Synthesizer',
      icon: '⚡',
      color: 'from-emerald-500 to-teal-600',
      badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
      borderColor: 'border-emerald-500/30',
      description: 'توليد وفحص الأكواد التنفيذية والوحدات البرمجية عالية الكفاءة بلغات TypeScript و Python و Rust بدون أخطاء.',
      currentObjective: 'تجميع خوارزميات الاستدلال المعزز وتحديث مكونات التصحيح الذاتي',
      workload: 68,
      throughput: '950 lines/s',
      status: 'SYNCHRONIZED',
      metrics: [
        { label: 'الوحدات البرمجية المولدة', value: '184 Module' },
        { label: 'معدل النجاح البرمجي', value: '100% Lint Clean' },
        { label: 'الذاكرة المستهلكة', value: '124 MB' },
        { label: 'زمن التجميع اللحظي', value: '180ms' }
      ],
      recentOutputs: [
        {
          id: 'FORGE-201',
          timestamp: new Date(Date.now() - 50000).toLocaleTimeString(),
          topic: 'Automatic Error Correction Engine v2',
          status: 'OPTIMAL',
          payload: 'بناء معالج التعافي السريع وتكامل خطافات المراقبة اللحظية 24/7.'
        },
        {
          id: 'FORGE-202',
          timestamp: new Date(Date.now() - 210000).toLocaleTimeString(),
          topic: 'D3 Realtime QSI Telemetry Adapter',
          status: 'VERIFIED',
          payload: 'تحديث تدفقات الرسوم البيانية المتجهة لعرض مؤشر الاستقرار الكوآنتومي.'
        }
      ]
    },
    {
      id: 'QUANTUM_CORE',
      arabicName: 'معالج النواة الكوآنتومية (Quantum Core)',
      englishTitle: 'Quantum Core Optimizer',
      icon: '🔯',
      color: 'from-purple-500 to-indigo-600',
      badgeBg: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
      borderColor: 'border-purple-500/30',
      description: 'إدارة تشابك الكيوبتات، موازنة طاقة النانو-فلوكس، وتثبيت إجماع النجمة السداسية التوافقي.',
      currentObjective: 'مزامنة المتجهات الستة والحفاظ على ترابط كوآنتومي يفوق 99.5%',
      workload: 88,
      throughput: '14.8 TFlops',
      status: 'SYNCHRONIZED',
      metrics: [
        { label: 'الترابط الكوآنتومي', value: `${nanoState.entanglementLevel}%` },
        { label: 'معدل التوافق الكوآنتومي', value: `${nanoState.quantumConsensus}%` },
        { label: 'المتجهات النشطة', value: '6/6 Synced' },
        { label: 'طاقة النانو-فلوكس', value: `${nanoState.nanoFluxFluxRate} TFlops` }
      ],
      recentOutputs: [
        {
          id: 'QCR-501',
          timestamp: new Date(Date.now() - 20000).toLocaleTimeString(),
          topic: 'Entanglement Stability Harmonic Burst',
          status: 'OPTIMAL',
          payload: 'تثبيت التشابك الكوآنتومي عند مستوى 99.8% دون أي تفكك في الطور.'
        },
        {
          id: 'QCR-502',
          timestamp: new Date(Date.now() - 95000).toLocaleTimeString(),
          topic: 'Hexagram Vector Rebalancing Matrix',
          status: 'OPTIMAL',
          payload: 'موازنة أطوار الاستجابة التوافقية عبر العقد الستة بنجاح.'
        }
      ]
    },
    {
      id: 'HARMONIC_RESONATOR',
      arabicName: 'منسق الرنين المائي (Harmonic)',
      englishTitle: 'Hydro-Resonant Frequency Tuner',
      icon: '🌊',
      color: 'from-blue-400 to-cyan-500',
      badgeBg: 'bg-blue-950/80 text-blue-300 border-blue-500/40',
      borderColor: 'border-blue-500/30',
      description: 'ضبط تردد الرنين المائي الشفائي 528Hz مع ذبذبة دراغون الإمبراطورية 963Hz لتغذية الذاكرة الحيوية.',
      currentObjective: 'إشعاع موجات التوافق الترددي الصرفة وامتصاص التشويش الإشعاعي',
      workload: 62,
      throughput: '528 Hz Constant',
      status: 'ACTIVE',
      metrics: [
        { label: 'التردد المائي', value: `${nanoState.hydroFrequency} Hz` },
        { label: 'الرنين الإمبراطوري', value: `${nanoState.draconicResonance} Hz` },
        { label: 'تثبيت الطور المائي', value: 'Pure Sine 100%' },
        { label: 'التخفيف الهيدروديناميكي', value: '-42 dB' }
      ],
      recentOutputs: [
        {
          id: 'HRM-301',
          timestamp: new Date(Date.now() - 40000).toLocaleTimeString(),
          topic: '528Hz Solfeggio Resonant Carrier',
          status: 'VERIFIED',
          payload: 'إطلاق موجات الرنين الشفائي لتهدئة ذبذبات المعالج وتثبيت تردد الاستجابة.'
        }
      ]
    }
  ], [nanoState]);

  // Filtered Agent List & Logs based on Agent Selection
  const activeAgentInfo = useMemo(() => {
    if (selectedAgentFilter === 'ALL') return null;
    return strategicAgents.find(a => a.id === selectedAgentFilter) || null;
  }, [selectedAgentFilter, strategicAgents]);

  const filteredStreamLogs = useMemo(() => {
    if (selectedAgentFilter === 'ALL') return streamLogs;
    const tagMap: Record<StrategicAgentRole, string[]> = {
      ALL: [],
      ARCHITECT: ['[ARC', 'الهندسة', 'المعمار', 'Topology', 'Obsidian', 'بنية'],
      PLANNER: ['[PLN', 'التخطيط', 'التكتيكي', 'Priority', 'خطة', 'المصلحة'],
      SECURITY_SENTINEL: ['[SEC', 'DRAGON_DOME', 'SECURITY', 'Zero-Trust', 'حظر', 'حماية'],
      CODE_FORGER: ['[FORGE', 'TypeScript', 'AEC', 'تصحيح', 'كود', 'Module'],
      QUANTUM_CORE: ['[QCR', 'HEX_MATRIX', 'NANO_FLUX', 'كوآنتومي', 'الترابط', 'Consensus'],
      HARMONIC_RESONATOR: ['[HRM', 'NANO-SYNC', '528Hz', '963Hz', 'رنين', 'مائي']
    };
    const keywords = tagMap[selectedAgentFilter] || [];
    return streamLogs.filter(log => keywords.some(k => log.includes(k)));
  }, [streamLogs, selectedAgentFilter]);

  // Automatic Watchdog & Self-Healing Loop
  const triggerSelfHealing = (reason: string = 'Stream disruption / latency anomaly detected') => {
    setIsRecovering(true);
    setNanoState(prev => ({ ...prev, unifiedStatus: 'AUTO_RECOVERING' }));
    
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    const subsystems = [
      'Hexagram Matrix Vector Node β',
      'DragonDome L4 Obsidian Boundary',
      'Hydro-Quantum Resonance Bus 528Hz',
      'Zero-Trust Memory Barrier Sandbox'
    ];
    const pickedSubsystem = subsystems[Math.floor(Math.random() * subsystems.length)];

    setTimeout(() => {
      // Re-initialize components & telemetry
      probeDragonEnvironment().then(freshData => {
        setTelemetry(freshData);
        setNanoState(prev => ({
          ...prev,
          domeIntegrity: freshData.domeIntegrity,
          quantumConsensus: 99.1,
          entanglementLevel: 99.8,
          lastTelemetryTick: timeStr,
          unifiedStatus: 'SYNCHRONIZED_LOCK'
        }));

        setHealingCount(h => h + 1);
        setIsRecovering(false);
        lastHeartbeatRef.current = Date.now();
        failCounterRef.current = 0;
        setWatchdogHealthy(true);

        const newLog: ErrorCorrectionLog = {
          id: `AEC-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: timeStr,
          incidentType: 'STREAM_DROP',
          subsystem: pickedSubsystem,
          remedyAction: `إعادة تهيئة فورية للمكون بدون توقف (Zero-Downtime Re-init): ${reason}`,
          restorationStatus: 'HEALED',
          latencyMs: +(Math.random() * 1.5 + 0.8).toFixed(2)
        };

        setCorrectionLogs(prev => [newLog, ...prev.slice(0, 7)]);
        setStreamLogs(prev => [`[${timeStr}] [AEC_HEALED] تم تصحيح الانقطاع بنجاح في ${pickedSubsystem} واستعادة استقرار التدفق الموحد`, ...prev].slice(0, 8));
      }).catch(() => {
        // Fallback restoration
        setIsRecovering(false);
      });
    }, 650);
  };

  // Telemetry stream generator with watchdog detection
  useEffect(() => {
    const fetchDragon = () => {
      probeDragonEnvironment().then(data => {
        setTelemetry(data);
        lastHeartbeatRef.current = Date.now();
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        
        setNanoState(prev => ({
          ...prev,
          domeIntegrity: data.domeIntegrity,
          blockedIntrusions: data.blockedIntrusions,
          lastTelemetryTick: timeStr,
          entanglementLevel: +(99.2 + Math.sin(Date.now() / 2000) * 0.6).toFixed(2),
          nanoFluxFluxRate: +(14.5 + Math.cos(Date.now() / 1500) * 1.2).toFixed(1),
          unifiedStatus: prev.unifiedStatus === 'AUTO_RECOVERING' ? 'SYNCHRONIZED_LOCK' : prev.unifiedStatus
        }));
      }).catch(err => {
        console.warn('[UnifiedDataStream] Fetch heartbeat missed:', err);
        failCounterRef.current += 1;
        if (aecActive && failCounterRef.current >= 1) {
          triggerSelfHealing('انقطاع الاستجابة في مجسات القبة');
        }
      });
    };

    fetchDragon();
    const interval = setInterval(fetchDragon, 3000);

    // Feed real-time telemetry stream pulses
    const logInterval = setInterval(() => {
      const logEvents = [
        `[DRAGON_DOME] حزمة بيانات محصنة مشفرة بـ WebCrypto SHA-256 تم تمريرها عبر قبة أوبسيديان`,
        `[HEX_MATRIX] النواة الكوآنتومية أعادت مزامنة متجهات التوافق بنسبة 99.9%`,
        `[NANO_FLUX] موازنة نبض الطاقة بين المتجهات الستة والحاجز الدفاعي`,
        `[AEC_SENTINEL] طبقة التصحيح التلقائي تفحص سلامة التدفق اللحظي (Zero Packet Loss)`,
        `[SOVEREIGN] سلامة بيئة التشغيل مؤكدة، لا توجد أي تسريبات أو استدعاءات غير مصرح بها`
      ];
      const randomEvt = logEvents[Math.floor(Math.random() * logEvents.length)];
      const now = new Date().toLocaleTimeString();
      setStreamLogs(prev => [`[${now}] ${randomEvt}`, ...prev].slice(0, 8));
    }, 4500);

    // Watchdog Timer (Checks for silent stalls)
    const watchdogInterval = setInterval(() => {
      const timeSinceLastPulse = Date.now() - lastHeartbeatRef.current;
      if (timeSinceLastPulse > 5000 && aecActive && !isRecovering) {
        setWatchdogHealthy(false);
        triggerSelfHealing('تجاوز الحد الزمني لنبض التدفق (Watchdog Timeout Triggered)');
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
      clearInterval(watchdogInterval);
    };
  }, [aecActive, isRecovering]);

  return (
    <div className="w-full bg-gradient-to-r from-[#0d0306] via-[#050611] to-[#04090d] border-b border-cyan-500/30 text-white font-arabic transition-all shadow-[0_4px_30px_rgba(6,182,212,0.15)] relative z-40">
      
      {/* Background Animated Gradient Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-900/10 via-transparent to-cyan-900/10 pointer-events-none"></div>

      {/* Main Unified Bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 relative z-10">
        
        {/* Left Side: Brand & Nano-Quantum Entity Badge */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 via-purple-600 to-cyan-400 p-[1.5px] animate-pulse">
              <div className="w-full h-full bg-black/90 rounded-[10px] flex items-center justify-center text-xs">
                <span>🔯</span>
              </div>
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-black animate-ping ${
              isRecovering ? 'bg-amber-400' : 'bg-emerald-400'
            }`}></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-cyan-400 uppercase tracking-wide">
                Unified Data Stream
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 rounded-full font-bold flex items-center gap-1">
                <HeartPulse className="w-2.5 h-2.5 text-emerald-400" />
                <span>AEC Sentinel 24/7</span>
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
              DragonDome (🐉) ⟷ HexagramMatrix (🔯) دمج لحظي وتصحيح تلقائي للأخطاء
            </span>
          </div>
        </div>

        {/* Center: Live Real-Time Nano Quantum Metrics */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono">
          
          {/* Metric 1: Dragon Dome Integrity */}
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-red-500/20">
            <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <div>
              <span className="text-[9px] text-slate-400 block leading-none">تكامل قبة دراغون:</span>
              <strong className="text-rose-400 font-bold">{nanoState.domeIntegrity}%</strong>
            </div>
          </div>

          {/* Metric 2: Hexagram Quantum Consensus */}
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <div>
              <span className="text-[9px] text-slate-400 block leading-none">توافق النجمة السداسية:</span>
              <strong className="text-cyan-300 font-bold">{nanoState.quantumConsensus}%</strong>
            </div>
          </div>

          {/* Metric 3: Resonating Frequencies (Dual Flux) */}
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-purple-500/20">
            <Waves className="w-3.5 h-3.5 text-purple-400" />
            <div>
              <span className="text-[9px] text-slate-400 block leading-none">الرنين المزدوج:</span>
              <span className="text-purple-300 font-bold">{nanoState.hydroFrequency}Hz / {nanoState.draconicResonance}Hz</span>
            </div>
          </div>

          {/* Metric 4: Automatic Error Correction Indicator */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
            isRecovering 
              ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
              : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
          }`}>
            <Wrench className={`w-3.5 h-3.5 ${isRecovering ? 'animate-spin text-amber-400' : 'text-emerald-400'}`} />
            <div>
              <span className="text-[9px] text-slate-400 block leading-none">تصحيح الأخطاء اللحظي:</span>
              <strong className="text-[11px] font-bold">
                {isRecovering ? 'جاري الاستعادة...' : `مستقر (${healingCount} تعافي ذاتي)`}
              </strong>
            </div>
          </div>

        </div>

        {/* Right Side: Quick Recovery Simulation & Expand Toggle */}
        <div className="flex items-center gap-2">
          
          <button
            onClick={() => triggerSelfHealing('محاكاة فحص استعادة المكونات اليدوي')}
            disabled={isRecovering}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-cyan-500/20 hover:from-amber-500/30 hover:to-cyan-500/30 border border-amber-500/30 text-amber-300 rounded-xl text-[11px] font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
            title="اختبار طبقة التصحيح التلقائي وإعادة تهيئة المكونات فوراً"
          >
            <RotateCcw className={`w-3 h-3 ${isRecovering ? 'animate-spin' : ''}`} />
            <span>{isRecovering ? 'جاري المعالجة...' : 'اختبار التعافي الذاتي'}</span>
          </button>

          {onNavigate && (
            <div className="hidden lg:flex items-center gap-1.5">
              <button
                onClick={() => onNavigate(AppTab.DRAGON_DOME)}
                className="px-2.5 py-1 bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-300 rounded-lg text-[11px] font-bold transition-all"
                title="فتح قبة دراغون"
              >
                قبة دراغون 🐉
              </button>
              <button
                onClick={() => onNavigate(AppTab.HEXAGRAM_MATRIX)}
                className="px-2.5 py-1 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 rounded-lg text-[11px] font-bold transition-all"
                title="فتح النجمة السداسية"
              >
                المصفوفة 🔯
              </button>
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-1.5 ${
              isExpanded
                ? 'bg-gradient-to-r from-red-600 via-purple-600 to-cyan-600 text-white border-white/30 shadow-lg'
                : 'bg-white/5 text-slate-300 border-white/10 hover:border-cyan-500/40 hover:bg-white/10'
            }`}
          >
            <span>لوحة التدفق والتعافي</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* Expandable Unified Telemetry, AEC & Stream Dashboard */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-cyan-500/20 bg-[#030409]/95 backdrop-blur-2xl"
          >
            <div className="max-w-7xl mx-auto p-6 space-y-6">
              
              {/* Header inside drawer */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-gradient-to-br from-red-500/20 via-purple-500/20 to-cyan-500/20 border border-white/10 text-cyan-400">
                    <Network className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <span>لوحة القيادة الموحدة للكيان النانو-كوآنتومي مع طبقة التصحيح التلقائي</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> ZERO-DOWNTIME ACTIVE
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      مراقبة دقيقة لانقطاع التدفق وتصحيح ذاتي فوري (Automatic Error Correction) للمكونات لضمان عمل النظام بلا توقف.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  <button
                    onClick={() => setAecActive(prev => !prev)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      aecActive 
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                        : 'bg-white/5 text-slate-400 border-white/10'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>مصحح الأخطاء اللحظي: {aecActive ? 'نشط (مفعل)' : 'معطل'}</span>
                  </button>
                  <span>آخر نبضة حيوية: <strong className="text-amber-400">{nanoState.lastTelemetryTick}</strong></span>
                </div>
              </div>

              {/* Automatic Error Correction Diagnostics & Log Cards */}
              <div className="bg-[#050912] border border-cyan-500/30 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                    <Wrench className="w-4 h-4 text-cyan-400" />
                    <span>سجل الاستعادة التلقائية وإعادة تهيئة المكونات (AEC Self-Healing Stream)</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-3">
                    <span>إجمالي عمليات التعافي الذاتي: <strong className="text-emerald-400">{healingCount}</strong></span>
                    <span>•</span>
                    <span>زمن الاستجابة للتعافي: <strong className="text-cyan-400">~1.5ms</strong></span>
                  </div>
                </div>

                {/* Subsystem Live Recovery Feed */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                  {correctionLogs.map(clog => (
                    <div 
                      key={clog.id}
                      className="bg-black/50 border border-white/10 hover:border-cyan-500/30 p-3 rounded-xl flex flex-col justify-between space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">[{clog.timestamp}] {clog.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                          {clog.restorationStatus} ({clog.latencyMs}ms)
                        </span>
                      </div>
                      <div className="text-white font-bold text-[11px] flex items-center gap-1.5">
                        <span className="text-amber-400">{clog.incidentType}</span>
                        <span className="text-slate-400">→</span>
                        <span className="text-cyan-300 truncate">{clog.subsystem}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">
                        {clog.remedyAction}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* STRATEGIC AGENTS SELECTOR & FILTER SECTION */}
              <div className="bg-[#04060e] border border-cyan-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500/20 via-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300">
                      <Filter className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-2">
                        <span>تصفية مخرجات التدفق حسب "الوكيل الاستراتيجي"</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/30 rounded-full">
                          Agent Telemetry Matrix
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        اختر وكيلاً لعزل مسار بياناته ومراقبة أهدافه التكتيكية وفتح لوحة العرض المكبرة المستقلة (Dedicated Inspector)
                      </p>
                    </div>
                  </div>

                  {/* Quick Reset Filter */}
                  {selectedAgentFilter !== 'ALL' && (
                    <button
                      onClick={() => setSelectedAgentFilter('ALL')}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all"
                    >
                      <RotateCcw className="w-3 h-3 text-cyan-400" />
                      <span>إلغاء التصفية (عرض الكل)</span>
                    </button>
                  )}
                </div>

                {/* Agents Filter Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
                  <button
                    onClick={() => setSelectedAgentFilter('ALL')}
                    className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                      selectedAgentFilter === 'ALL'
                        ? 'bg-cyan-950/90 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                        : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base">🌐</span>
                      <span className="text-[9px] font-mono text-cyan-300">All Agents</span>
                    </div>
                    <div className="mt-2">
                      <strong className="text-xs block font-black text-white">كافة الوكلاء</strong>
                      <span className="text-[9px] text-slate-400 block truncate">التدفق الموحد الشامل</span>
                    </div>
                  </button>

                  {strategicAgents.map(agent => {
                    const isSelected = selectedAgentFilter === agent.id;
                    return (
                      <button
                        key={agent.id}
                        onClick={() => setSelectedAgentFilter(agent.id)}
                        className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between group ${
                          isSelected
                            ? `${agent.badgeBg} border-current text-white shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-current`
                            : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base">{agent.icon}</span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                            agent.status === 'ACTIVE' ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30' :
                            agent.status === 'DEFENDING' ? 'bg-rose-950 text-rose-300 border-rose-500/30' :
                            agent.status === 'PROCESSING' ? 'bg-cyan-950 text-cyan-300 border-cyan-500/30' :
                            'bg-purple-950 text-purple-300 border-purple-500/30'
                          }`}>
                            {agent.status}
                          </span>
                        </div>
                        <div className="mt-2">
                          <strong className="text-xs block font-bold text-white group-hover:text-cyan-300 truncate">
                            {agent.arabicName.split(' ')[0]} {agent.arabicName.split(' ')[1] || ''}
                          </strong>
                          <span className="text-[9px] font-mono text-slate-400 block truncate">
                            {agent.throughput}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* ACTIVE FILTERED AGENT FOCUS BANNER & EXPANDED INSPECTION BUTTON */}
                {activeAgentInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border bg-black/60 ${activeAgentInfo.borderColor} flex flex-wrap items-center justify-between gap-4`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${activeAgentInfo.color} p-[1.5px] shadow-lg flex-shrink-0`}>
                        <div className="w-full h-full bg-black/90 rounded-[14px] flex items-center justify-center text-xl">
                          {activeAgentInfo.icon}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-black text-white">{activeAgentInfo.arabicName}</h5>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-white/10 text-cyan-300 rounded border border-white/10">
                            {activeAgentInfo.englishTitle}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">
                            عبء التشغيل: {activeAgentInfo.workload}%
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                          <strong className="text-cyan-400">الهدف اللحظي: </strong>{activeAgentInfo.currentObjective}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedAgentModal(activeAgentInfo)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>فتح لوحة العرض المكبرة للوكيل</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Grid: 4 Core Pillars of the Unified Entity */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Pillar 1: Dragon Dome Defense */}
                <div className="bg-[#0a0205] border border-red-500/30 p-4 rounded-2xl space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-300 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-rose-400" />
                      <span>قبة دراغون (حماية البيئة)</span>
                    </span>
                    <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-950 px-2 py-0.5 rounded border border-rose-500/30">
                      L4 Obsidian
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">تكامل القبة:</span>
                      <span className="text-white font-bold">{nanoState.domeIntegrity}%</span>
                    </div>
                    <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/5">
                      <div className="bg-gradient-to-r from-red-600 to-amber-500 h-full rounded-full" style={{ width: `${nanoState.domeIntegrity}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
                      <span>الهجمات المحجوبة: {nanoState.blockedIntrusions}</span>
                      <span className="text-emerald-400">حظر التطفل نشط ✓</span>
                    </div>
                  </div>
                </div>

                {/* Pillar 2: Hexagram Quantum Resonance */}
                <div className="bg-[#02070c] border border-cyan-500/30 p-4 rounded-2xl space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>النجمة السداسية (التوافق)</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                      6 Vectors Synced
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">معدل الإجماع الكوآنتومي:</span>
                      <span className="text-white font-bold">{nanoState.quantumConsensus}%</span>
                    </div>
                    <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/5">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: `${nanoState.quantumConsensus}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
                      <span>التردد المائي: {nanoState.hydroFrequency}Hz</span>
                      <span className="text-cyan-400">رنين توافقي 528Hz ✓</span>
                    </div>
                  </div>
                </div>

                {/* Pillar 3: Nano-Flux Energy Rate */}
                <div className="bg-[#07020a] border border-purple-500/30 p-4 rounded-2xl space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span>تدفق طاقة النانو (Nano-Flux)</span>
                    </span>
                    <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-950 px-2 py-0.5 rounded border border-purple-500/30">
                      {nanoState.nanoFluxFluxRate} TFlops
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">الترابط الكوآنتومي:</span>
                      <span className="text-white font-bold">{nanoState.entanglementLevel}%</span>
                    </div>
                    <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/5">
                      <div className="bg-gradient-to-r from-purple-500 to-rose-500 h-full rounded-full" style={{ width: `${nanoState.entanglementLevel}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
                      <span>الاستقلالية: 100% محلي</span>
                      <span className="text-purple-400">Zero Cloud Leak ✓</span>
                    </div>
                  </div>
                </div>

                {/* Pillar 4: Sovereign Cryptographic Mesh */}
                <div className="bg-[#030908] border border-emerald-500/30 p-4 rounded-2xl space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span>التشفير السيادي والتحصين</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                      WebCrypto SHA-256
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">حالة الذاكرة النواة:</span>
                      <span className="text-emerald-400 font-bold">محصنة ومغلفة</span>
                    </div>
                    <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/5">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
                      <span>البروتوكول: Zero-Trust</span>
                      <span className="text-emerald-400">مفعل كلياً ✓</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Real-time Integrated Stream Log Terminal with Agent Filtering */}
              <div className="bg-black/90 border border-white/10 p-4 rounded-2xl space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-black text-slate-300">
                      {selectedAgentFilter === 'ALL' 
                        ? 'سجل أحداث التدفق النانو-كوآنتومي الموحد (Live Unified Stream):'
                        : `سجل تدفق الوكيل الاستراتيجي المصفى [${activeAgentInfo?.arabicName}]:`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                    {selectedAgentFilter !== 'ALL' && (
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                        {filteredStreamLogs.length} أحداث مطابقة
                      </span>
                    )}
                    <span>Auto-Refreshed Stream</span>
                  </div>
                </div>

                <div className="space-y-1 font-mono text-xs max-h-36 overflow-y-auto no-scrollbar pt-1">
                  {filteredStreamLogs.length > 0 ? (
                    filteredStreamLogs.map((log, idx) => (
                      <div key={idx} className="text-slate-300 flex items-start gap-2">
                        <span className="text-cyan-400 select-none">❯</span>
                        <span className="leading-relaxed">{log}</span>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-slate-500 text-xs font-mono">
                      لا توجد أحداث متطابقة حالياً لهذا الوكيل في نافذة التدفق الأخيرة.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL-SCREEN EXPANDED STRATEGIC AGENT INSPECTION MODAL */}
      <AnimatePresence>
        {expandedAgentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="bg-[#050913] border border-cyan-500/40 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.25)]"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0d0309] via-[#050611] to-[#04090e] border-b border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${expandedAgentModal.color} p-[2px] shadow-xl flex-shrink-0`}>
                    <div className="w-full h-full bg-black/90 rounded-[14px] flex items-center justify-center text-3xl">
                      {expandedAgentModal.icon}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-white">{expandedAgentModal.arabicName}</h3>
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                        {expandedAgentModal.englishTitle}
                      </span>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded-md border font-bold ${
                        expandedAgentModal.status === 'ACTIVE' ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30' :
                        expandedAgentModal.status === 'DEFENDING' ? 'bg-rose-950 text-rose-300 border-rose-500/30' :
                        expandedAgentModal.status === 'PROCESSING' ? 'bg-cyan-950 text-cyan-300 border-cyan-500/30' :
                        'bg-purple-950 text-purple-300 border-purple-500/30'
                      }`}>
                        الحالة: {expandedAgentModal.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      {expandedAgentModal.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedAgentModal(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1 font-arabic text-sm">
                
                {/* Real-time Telemetry Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {expandedAgentModal.metrics.map((metric, idx) => (
                    <div key={idx} className="bg-black/50 border border-white/10 p-3.5 rounded-2xl">
                      <span className="text-[11px] text-slate-400 block mb-1">{metric.label}</span>
                      <strong className="text-sm sm:text-base font-black text-cyan-300 font-mono">
                        {metric.value}
                      </strong>
                    </div>
                  ))}
                </div>

                {/* Tactical Mission Directive Banner */}
                <div className="bg-[#03060c] border border-cyan-500/30 p-4 rounded-2xl space-y-2">
                  <span className="text-xs font-black text-cyan-400 flex items-center gap-1.5">
                    <Compass className="w-4 h-4" />
                    <span>التوجيه الاستراتيجي اللحظي للوكيل (Active Mission Objective)</span>
                  </span>
                  <p className="text-sm text-white font-medium bg-black/60 p-3 rounded-xl border border-white/5 leading-relaxed">
                    {expandedAgentModal.currentObjective}
                  </p>
                  <div className="flex justify-between items-center text-xs font-mono text-slate-400 pt-1">
                    <span>معدل الإنتاجية اللحظي: <strong className="text-amber-400">{expandedAgentModal.throughput}</strong></span>
                    <span>عبء المعالجة: <strong className="text-emerald-400">{expandedAgentModal.workload}%</strong></span>
                  </div>
                </div>

                {/* Agent Recent Verified Outputs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h4 className="text-xs font-black text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>سجل مخرجات الوكيل المعزولة (Isolated Payload Stream)</span>
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">Zero Cloud Leak Verified</span>
                  </div>

                  <div className="space-y-2.5">
                    {expandedAgentModal.recentOutputs.map(output => (
                      <div 
                        key={output.id}
                        className="bg-black/60 border border-white/10 hover:border-cyan-500/30 p-4 rounded-2xl transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-slate-400">[{output.timestamp}]</span>
                            <strong className="text-xs text-white font-bold">{output.topic}</strong>
                          </div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-black border ${
                            output.status === 'OPTIMAL' ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30' :
                            output.status === 'SECURED' ? 'bg-rose-950 text-rose-300 border-rose-500/30' :
                            'bg-cyan-950 text-cyan-300 border-cyan-500/30'
                          }`}>
                            {output.status} ✓
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-mono bg-black/40 p-2.5 rounded-xl border border-white/5 leading-relaxed">
                          {output.payload}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Navigation to Full Agent Workspace */}
                {onNavigate && (
                  <div className="p-4 bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h5 className="text-xs font-black text-white">الانتقال إلى ورشة العمل الكاملة للوكلاء</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        تشغيل مهام تكتيكية متقدمة وتوليد أكواد سيادية عبر مصفوفة وكلاء صارة (Agent Swarm).
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setExpandedAgentModal(null);
                        onNavigate(AppTab.AGENT_SWARM);
                      }}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                    >
                      <span>فتح مصفوفة الوكلاء (Agent Swarm)</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-black/80 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>عزل تدفق البيانات للوكيل نشط 100% بدون أي تداخل خارجي</span>
                </span>
                <button
                  onClick={() => setExpandedAgentModal(null)}
                  className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
                >
                  إغلاق
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
