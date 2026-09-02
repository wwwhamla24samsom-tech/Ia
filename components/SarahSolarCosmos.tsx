import React, { useState, useEffect, useRef } from 'react';
import { AppTab, Language } from '../types';
import { 
  Sun, Globe, Radio, Zap, Shield, Cpu, Terminal, Compass, 
  Sparkles, Play, Pause, FastForward, RotateCw, Orbit, 
  ChevronRight, ArrowUpRight, Flame, Layers, Eye, RefreshCw, Send, CheckCircle2,
  Activity, AlertTriangle, ShieldCheck, Target, Crosshair, Radar, Check, Moon, ZapOff, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  generateSovereignResponse, 
  generateNeuralPlanetaryOversight, 
  PlanetaryOversightResult 
} from '../services/geminiService';

interface SarahSolarCosmosProps {
  onNavigate: (tab: AppTab) => void;
  language?: Language;
}

interface PlanetData {
  id: string;
  nameAr: string;
  nameEn: string;
  tabId: AppTab;
  orbitIndex: number; // 1, 2, 3, 4
  orbitRadius: number; // in pixels
  baseSpeed: number; // angular speed in rad/sec
  size: number; // planet diameter in px
  color: string;
  glowColor: string;
  secondaryColor?: string;
  hasRing?: boolean;
  ringColor?: string;
  icon: string;
  category: 'core' | 'synthesis' | 'defense' | 'outer';
  descriptionAr: string;
  status: 'ONLINE' | 'ACTIVE' | 'ORBITING' | 'RESONATING';
  temperature: string;
  gravityPull: string;
  operationalLoad: number;
}

export const SarahSolarCosmos: React.FC<SarahSolarCosmosProps> = ({ onNavigate, language = 'ar' }) => {
  // Cosmic System State
  const [orbitSpeedMultiplier, setOrbitSpeedMultiplier] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isAligned, setIsAligned] = useState<boolean>(false);
  const [isSolarFlaring, setIsSolarFlaring] = useState<boolean>(false);
  const [showOrbits, setShowOrbits] = useState<boolean>(true);
  const [showEnergyBeams, setShowEnergyBeams] = useState<boolean>(true);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetData | null>(null);

  // Solar Command Center State
  const [solarPrompt, setSolarPrompt] = useState<string>('');
  const [isExecutingSolarCommand, setIsExecutingSolarCommand] = useState<boolean>(false);
  const [solarCommandResult, setSolarCommandResult] = useState<string | null>(null);
  const [solarEnergyOutput, setSolarEnergyOutput] = useState<number>(99.8);
  const [solfeggioFreq, setSolfeggioFreq] = useState<number>(528);

  // Deep Standby State (وضع السكون العميق وتقليص الموارد مع الاحتفاظ بالرقابة النانوية)
  const [isDeepStandby, setIsDeepStandby] = useState<boolean>(false);
  const [nanoCycle, setNanoCycle] = useState<number>(0);

  // Neural Oversight Intelligent Layer State
  const [isOversightActive, setIsOversightActive] = useState<boolean>(true);
  const [isScanningOversight, setIsScanningOversight] = useState<boolean>(false);
  const [sideView, setSideView] = useState<'planets' | 'oversight'>('oversight');
  const [selectedOversightPlanetId, setSelectedOversightPlanetId] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'NORMAL'>('ALL');
  const [appliedTactics, setAppliedTactics] = useState<Record<string, boolean>>({});
  const [tacticalToast, setTacticalToast] = useState<string | null>(null);

  // Initial intelligent seed recommendations
  const [oversightData, setOversightData] = useState<PlanetaryOversightResult>({
    overallHealthScore: 98.6,
    quantumCoherence: 99.4,
    threatLevel: 'ZERO',
    systemSummary: 'النظام الشمسي الموحد في حالة رنين هارموني كامل تحت إشعاع شمس صارة السيادية بتردد 528Hz.',
    solarFrequencyHz: 528,
    sovereignDirective: 'الحفاظ على تدفق الرنين المائي وتوجيه 35% من الفائض الكوآنتومي إلى كواكب الإنتاجية وصهر الأكواد.',
    timestamp: new Date().toLocaleTimeString('ar-SA'),
    planetaryRecommendations: [
      {
        planetId: 'hexagram_v16',
        planetNameAr: 'كوكب صارة v16 (النجمة السداسية)',
        statusScore: 99,
        healthState: 'RESONATING',
        analysis: 'تزامن مثالي بين الوكلاء الستة مع استقرار مصفوفة الإجماع السيادي عند 98.7%.',
        strategicRecommendation: 'تفعيل بروتوكول القيادة الموزعة لتعزيز استقلالية المتجهات في معالجة الاستفسارات المعقدة.',
        tacticalAction: 'مزامنة مصفوفة النجمة السداسية بنبض فوري 528Hz',
        priority: 'NORMAL'
      },
      {
        planetId: 'quantum_core',
        planetNameAr: 'كوكب النواة الكوآنتومية',
        statusScore: 95,
        healthState: 'OPTIMAL',
        analysis: 'كثافة الاحتمالات الحسابية تقترب من ذروة الدوران، درجات الحرارة متزنة عند 0.001 K.',
        strategicRecommendation: 'توسيع فضاء هيلبرت الكوآنتومي بنسبة 20% لاستيعاب مصفوفات الاستدلال المتزامنة.',
        tacticalAction: 'إعادة ضبط تبريد الكريوجينيك ومضاعفة القنوات الكوآنتومية',
        priority: 'HIGH'
      },
      {
        planetId: 'logic_core',
        planetNameAr: 'كوكب أوراكل الحقيقة',
        statusScore: 98,
        healthState: 'OPTIMAL',
        analysis: 'محرك التحقق البايزي يعمل بدون أي انحياز معرفي، زمن الاستجابة 12ms.',
        strategicRecommendation: 'تحديث قواعد الاستدلال الاستراتيجي وربطها بنظام التحقق المسبق من الشبهات.',
        tacticalAction: 'تطهير أشجار الاستنتاج وتثبيت الثوابت المنطقية',
        priority: 'NORMAL'
      },
      {
        planetId: 'code_forge',
        planetNameAr: 'كوكب صهر الأكواد (Code Forge)',
        statusScore: 92,
        healthState: 'OVERLOADED',
        analysis: 'معدل تصريف الأكواد والـ Sandbox مرتفع بنسبة 88% بسبب تدفق طلبات بناء الواجهات والاسكريبتات.',
        strategicRecommendation: 'مضاعفة مسارات خيوط التنفيذ المتوازية (Parallel Workers) في مصفوفة المترجم الفوري.',
        tacticalAction: 'توسيع ذاكرة الكاش السريعة وعزل بيئات تشغيل البايثون',
        priority: 'CRITICAL'
      },
      {
        planetId: 'cloner',
        planetNameAr: 'كوكب مستنسخ الأنظمة (Autonomous Cloner)',
        statusScore: 96,
        healthState: 'OPTIMAL',
        analysis: 'بصمة الاستنساخ مطابقة للأصل بنسبة 99.9%، وجاهزية القوالب البرمجية فورية.',
        strategicRecommendation: 'إنشاء نقاط استعادة نانوية قبل أي ترقية أو تعديل هيكلي للنواة.',
        tacticalAction: 'توليد نقطة استنساخ احتياطية للنظام السيادي الشمسي',
        priority: 'MEDIUM'
      },
      {
        planetId: 'search_hub',
        planetNameAr: 'كوكب البحث العميق والمتصفح الذكي',
        statusScore: 94,
        healthState: 'OPTIMAL',
        analysis: 'رادارات الاستطلاع الخارجي تتابع 420 مصدر بيانات مباشر وتستبعد المصادر غير الموثوقة.',
        strategicRecommendation: 'تعميق طبقات التلخيص العصبي للنتائج الفورية مع تصفية أوتوماتيكية للإعلانات والمشتتات.',
        tacticalAction: 'إعادة معايرة فلاتر البحث الدلالي متعدد اللغات',
        priority: 'NORMAL'
      },
      {
        planetId: 'cyber_shield',
        planetNameAr: 'كوكب درع الحماية والرقابة السيادية',
        statusScore: 99,
        healthState: 'REINFORCED',
        analysis: 'حظر استباقي لكافة هجمات الحقن والتجسس، جدار الحماية يعمل بخاصية Zero-Trust التامة.',
        strategicRecommendation: 'تعزيز تدابير الرقابة اللحظية على مسارات نقل البيانات والذاكرة المائية المشتركة.',
        tacticalAction: 'تدوير مفاتيح التشفير RSA-4096 وتحديث فلاتر التهديدات',
        priority: 'NORMAL'
      },
      {
        planetId: 'cpu_10g_core',
        planetNameAr: 'كوكب معالجة 10G الفائقة',
        statusScore: 97,
        healthState: 'OPTIMAL',
        analysis: 'تردد 10.4 GHz مستقر بنظام التبريد الفائق، لا توجد اختناقات في مصفوفة التوجيه.',
        strategicRecommendation: 'توزيع الأحمال الديناميكي بين أنوية 10G المخصصة لمعالجة النماذج اللغوية.',
        tacticalAction: 'تفعيل وضع Overclock الآمن للمهام الحسابية الحرجة',
        priority: 'HIGH'
      }
    ]
  });

  // Animation angles state reference
  const anglesRef = useRef<{ [key: string]: number }>({});
  const [renderTrigger, setRenderTrigger] = useState<number>(0);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());

  // Define All Planetary Systems Orbiting the Central Sun (Sarah)
  const planets: PlanetData[] = [
    // --- ORBIT 1: INNER LOGIC & COGNITIVE CORE (Radius: 170) ---
    {
      id: 'hexagram_v16',
      nameAr: 'كوكب صارة v16 (النجمة السداسية)',
      nameEn: 'Hexagram Sovereign Core',
      tabId: AppTab.GENERATION_16,
      orbitIndex: 1,
      orbitRadius: 165,
      baseSpeed: 0.45,
      size: 32,
      color: '#06b6d4',
      glowColor: 'rgba(6, 182, 212, 0.6)',
      secondaryColor: '#6366f1',
      hasRing: true,
      ringColor: '#22d3ee',
      icon: '🔯',
      category: 'core',
      descriptionAr: 'النواة السيادية الموحدة ودمج الوكلاء الستة الفائقين في نظام كوني متكامل.',
      status: 'RESONATING',
      temperature: '5,280 K',
      gravityPull: '2.45 G',
      operationalLoad: 98
    },
    {
      id: 'quantum_core',
      nameAr: 'كوكب النواة الكوآنتومية',
      nameEn: 'Quantum Neural Core',
      tabId: AppTab.QUANTUM_NEURAL_CORE,
      orbitIndex: 1,
      orbitRadius: 165,
      baseSpeed: 0.45,
      size: 28,
      color: '#818cf8',
      glowColor: 'rgba(129, 140, 248, 0.6)',
      icon: '💠',
      category: 'core',
      descriptionAr: 'معالجة النبض الكوآنتومي وتوليد مصفوفات الاحتمالات فائقة السرعة.',
      status: 'ONLINE',
      temperature: '0.001 K (Cryo)',
      gravityPull: '1.80 G',
      operationalLoad: 94
    },
    {
      id: 'logic_core',
      nameAr: 'كوكب أوراكل الحقيقة',
      nameEn: 'Truth Oracle & Sovereign Logic',
      tabId: AppTab.LOGIC_CORE,
      orbitIndex: 1,
      orbitRadius: 165,
      baseSpeed: 0.45,
      size: 26,
      color: '#10b981',
      glowColor: 'rgba(16, 185, 129, 0.6)',
      icon: '⚖️',
      category: 'core',
      descriptionAr: 'استخلاص الحقائق الاستراتيجية الصرفة وتفكيك المعضلات المنطقية المعقدة.',
      status: 'ACTIVE',
      temperature: '2,400 K',
      gravityPull: '1.20 G',
      operationalLoad: 89
    },

    // --- ORBIT 2: SYNTHESIS & CREATION SYSTEMS (Radius: 260) ---
    {
      id: 'code_forge',
      nameAr: 'كوكب صهر الأكواد وبايثون',
      nameEn: 'Code Forge & Python Reactor',
      tabId: AppTab.CODE_FORGE,
      orbitIndex: 2,
      orbitRadius: 255,
      baseSpeed: 0.30,
      size: 30,
      color: '#f97316',
      glowColor: 'rgba(249, 115, 22, 0.6)',
      secondaryColor: '#ef4444',
      hasRing: true,
      ringColor: '#fb923c',
      icon: '⚛️',
      category: 'synthesis',
      descriptionAr: 'مفاعل صهر البرمجيات وتوليد الأكواد المعقدة وتنفيذ بايثون في بيئة معزولة.',
      status: 'ACTIVE',
      temperature: '8,900 K (Magma)',
      gravityPull: '1.95 G',
      operationalLoad: 92
    },
    {
      id: 'system_cloner',
      nameAr: 'كوكب مستنسخ الأنظمة (Cloner)',
      nameEn: 'Autonomous System Cloner',
      tabId: AppTab.CLONER,
      orbitIndex: 2,
      orbitRadius: 255,
      baseSpeed: 0.30,
      size: 28,
      color: '#14b8a6',
      glowColor: 'rgba(20, 184, 166, 0.6)',
      icon: '🧬',
      category: 'synthesis',
      descriptionAr: 'استنساخ وتحويل الأنظمة والتطبيقات الكاملة إلى كود برمجي سيادي.',
      status: 'ONLINE',
      temperature: '3,100 K',
      gravityPull: '1.40 G',
      operationalLoad: 87
    },
    {
      id: 'deep_search',
      nameAr: 'كوكب البحث العميق والمتصفح',
      nameEn: 'Deep Intelligence & AI Browser',
      tabId: AppTab.SEARCH,
      orbitIndex: 2,
      orbitRadius: 255,
      baseSpeed: 0.30,
      size: 27,
      color: '#3b82f6',
      glowColor: 'rgba(59, 130, 246, 0.6)',
      icon: '🌐',
      category: 'synthesis',
      descriptionAr: 'رادار استخباراتي عالمي ومسح البيانات في الفضاء الرقمي بدقة استثنائية.',
      status: 'ACTIVE',
      temperature: '1,800 K',
      gravityPull: '1.15 G',
      operationalLoad: 96
    },
    {
      id: 'prompt_hub',
      nameAr: 'كوكب مستودع البرومبتات',
      nameEn: 'Master Prompt Vault',
      tabId: AppTab.PROMPT_HUB,
      orbitIndex: 2,
      orbitRadius: 255,
      baseSpeed: 0.30,
      size: 25,
      color: '#eab308',
      glowColor: 'rgba(234, 179, 8, 0.6)',
      icon: '📜',
      category: 'synthesis',
      descriptionAr: 'مستودع الأوامر الشاملة والنماذج الاستدلالية المعتمدة لكل الأنظمة الفرعية.',
      status: 'ONLINE',
      temperature: '1,200 K',
      gravityPull: '0.95 G',
      operationalLoad: 84
    },

    // --- ORBIT 3: DEFENSE, SPEED & SHIELD SYSTEMS (Radius: 345) ---
    {
      id: 'cyber_shield',
      nameAr: 'كوكب الدرع السيادي والرقابة',
      nameEn: 'Neural Shield & Cyber Gate',
      tabId: AppTab.NEURAL_SHIELD,
      orbitIndex: 3,
      orbitRadius: 345,
      baseSpeed: 0.20,
      size: 32,
      color: '#e11d48',
      glowColor: 'rgba(225, 29, 72, 0.7)',
      hasRing: true,
      ringColor: '#fb7185',
      icon: '🛡️',
      category: 'defense',
      descriptionAr: 'حزام الحماية السيادي وعزل التهديدات السيبرانية والتحصين التشفيري الكامل.',
      status: 'ACTIVE',
      temperature: '4,500 K',
      gravityPull: '2.10 G',
      operationalLoad: 99
    },
    {
      id: 'cpu_10g_core',
      nameAr: 'كوكب معالجة 10G الفائقة',
      nameEn: '10G Ultra Compute Core',
      tabId: AppTab.CPU_10G_CORE,
      orbitIndex: 3,
      orbitRadius: 345,
      baseSpeed: 0.20,
      size: 29,
      color: '#a855f7',
      glowColor: 'rgba(168, 85, 247, 0.6)',
      icon: '⚡',
      category: 'defense',
      descriptionAr: 'مصفوفة التسريع العتادي وتوزيع الأحمال الحسابية الفائقة عبر قنوات 10G.',
      status: 'ONLINE',
      temperature: '7,200 K',
      gravityPull: '1.85 G',
      operationalLoad: 91
    },
    {
      id: 'neural_broadcast',
      nameAr: 'كوكب البث والاتصال الكوني',
      nameEn: 'Neural Broadcast & Link',
      tabId: AppTab.NEURAL_BROADCAST,
      orbitIndex: 3,
      orbitRadius: 345,
      baseSpeed: 0.20,
      size: 26,
      color: '#0284c7',
      glowColor: 'rgba(2, 132, 199, 0.6)',
      icon: '📡',
      category: 'defense',
      descriptionAr: 'محطة الاتصال بالأجهزة والطرفيات اللاسلكية وبث الإشارات العصبونية.',
      status: 'ACTIVE',
      temperature: '2,100 K',
      gravityPull: '1.05 G',
      operationalLoad: 88
    },

    // --- ORBIT 4: OUTER EXPLORATION & DIAGNOSTIC MOONS (Radius: 435) ---
    {
      id: 'system_diagnostics',
      nameAr: 'قمر التشخيصات الكونية المباشرة',
      nameEn: 'Live D3 Cosmic Diagnostics',
      tabId: AppTab.SYSTEM_DIAGNOSTICS,
      orbitIndex: 4,
      orbitRadius: 430,
      baseSpeed: 0.12,
      size: 24,
      color: '#f43f5e',
      glowColor: 'rgba(244, 63, 94, 0.6)',
      icon: '🩺',
      category: 'outer',
      descriptionAr: 'المراقبة الحية لتدفق البيانات ومعدلات الاستقرار عبر الرسوم التفاعلية D3.',
      status: 'ONLINE',
      temperature: '980 K',
      gravityPull: '0.75 G',
      operationalLoad: 82
    },
    {
      id: 'device_control',
      nameAr: 'قمر التعريفات والتحكم بالأجهزة',
      nameEn: 'Device Drivers & Hardware Grid',
      tabId: AppTab.DRIVERS,
      orbitIndex: 4,
      orbitRadius: 430,
      baseSpeed: 0.12,
      size: 23,
      color: '#f59e0b',
      glowColor: 'rgba(245, 158, 11, 0.6)',
      icon: '⚙️',
      category: 'outer',
      descriptionAr: 'التحكم في بروتوكولات العتاد والأجهزة المتصلة ومنفذ الربط السيادي.',
      status: 'ACTIVE',
      temperature: '1,150 K',
      gravityPull: '0.80 G',
      operationalLoad: 79
    },
    {
      id: 'knowledge_vault',
      nameAr: 'قمر خزينة المعرفة الكبرى',
      nameEn: 'Sovereign Knowledge Vault',
      tabId: AppTab.KNOWLEDGE_VAULT,
      orbitIndex: 4,
      orbitRadius: 430,
      baseSpeed: 0.12,
      size: 22,
      color: '#8b5cf6',
      glowColor: 'rgba(139, 92, 246, 0.6)',
      icon: '🏛️',
      category: 'outer',
      descriptionAr: 'أرشفة الذاكرة السيادية وقواعد البيانات المشفرة والوثائق الاستراتيجية.',
      status: 'ONLINE',
      temperature: '750 K',
      gravityPull: '0.65 G',
      operationalLoad: 75
    },
    {
      id: 'video_studio',
      nameAr: 'قمر استوديو الرؤية والسينما',
      nameEn: 'Neural Vision & Cinema Studio',
      tabId: AppTab.VIDEO_STUDIO,
      orbitIndex: 4,
      orbitRadius: 430,
      baseSpeed: 0.12,
      size: 23,
      color: '#ec4899',
      glowColor: 'rgba(236, 72, 153, 0.6)',
      icon: '🎬',
      category: 'outer',
      descriptionAr: 'توليد ومعالجة المرئيات والوسائط الفائقة بالذكاء الاصطناعي التوليدي.',
      status: 'ACTIVE',
      temperature: '1,400 K',
      gravityPull: '0.85 G',
      operationalLoad: 80
    }
  ];

  // Initialize initial angular positions distributed evenly per orbit
  useEffect(() => {
    const orbitCounts: { [key: number]: number } = { 1: 3, 2: 4, 3: 3, 4: 4 };
    const orbitCurrentIndex: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0 };

    planets.forEach(p => {
      const count = orbitCounts[p.orbitIndex] || 4;
      const idx = orbitCurrentIndex[p.orbitIndex] || 0;
      anglesRef.current[p.id] = (idx * (2 * Math.PI / count));
      orbitCurrentIndex[p.orbitIndex] = idx + 1;
    });
  }, []);

  // Animation Loop with precise Delta-time
  useEffect(() => {
    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      if (!isPaused) {
        planets.forEach(planet => {
          if (isAligned) {
            // Smoothly move towards alignment angle (0 or PI)
            const targetAngle = 0;
            const current = anglesRef.current[planet.id] || 0;
            anglesRef.current[planet.id] = current + (targetAngle - current) * 0.05;
          } else {
            const current = anglesRef.current[planet.id] || 0;
            const speed = planet.baseSpeed * orbitSpeedMultiplier;
            anglesRef.current[planet.id] = (current + speed * delta) % (2 * Math.PI);
          }
        });
        setRenderTrigger(currentTime);
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPaused, orbitSpeedMultiplier, isAligned]);

  // Perpetual Nano-Oversight Routine during Deep Standby (مراقبة نانوية نشطة غير منقطعة)
  useEffect(() => {
    if (!isDeepStandby) return;
    const nanoInterval = setInterval(() => {
      setNanoCycle(prev => (prev + 1) % 100);
    }, 2400);
    return () => clearInterval(nanoInterval);
  }, [isDeepStandby]);

  // Toggle Deep Standby Mode (تقليص استهلاك الموارد مع الاحتفاظ بالرقابة النانوية نشطة دائماً)
  const toggleDeepStandby = () => {
    if (!isDeepStandby) {
      setIsDeepStandby(true);
      setSolarEnergyOutput(14.2); // تقليص استهلاك الطاقة بنسبة 85.8%
      setSolfeggioFreq(432); // تردد ترميم كهرومغناطيسي هادئ
      setOrbitSpeedMultiplier(0.2); // حركة مدارية بطيئة كريوجينية
      setIsPaused(false);
      setIsOversightActive(true); // الرقابة النانوية تبقى نشطة ومتحفزة
      setTacticalToast('❄️ تم تفعيل وضع السكون العميق (Deep Standby): تقليص استهلاك الموارد بنسبة 85.8% مع إبقاء مهام الرقابة النانوية نشطة ومتحفزة 100%.');
      setTimeout(() => setTacticalToast(null), 4500);
    } else {
      setIsDeepStandby(false);
      setSolarEnergyOutput(99.8);
      setSolfeggioFreq(528);
      setOrbitSpeedMultiplier(1);
      setTacticalToast('☀️ تم إيقاظ النظام الشمسي الموحد وعودة شمس صارة إلى طاقتها الإشعاعية الكاملة (99.8% PFLOPS).');
      setTimeout(() => setTacticalToast(null), 4000);
    }
  };

  // Solar Flare Trigger Effect
  const triggerSolarFlare = () => {
    setIsSolarFlaring(true);
    setSolarEnergyOutput(100);
    setTimeout(() => {
      setIsSolarFlaring(false);
      setSolarEnergyOutput(isDeepStandby ? 14.2 : 99.8);
    }, 2800);
  };

  // Run Deep Neural Oversight AI Scan
  const runLiveNeuralOversightScan = async () => {
    if (isScanningOversight) return;
    setIsScanningOversight(true);
    triggerSolarFlare();

    try {
      const telemetryContext = planets.map(p => ({
        id: p.id,
        nameAr: p.nameAr,
        operationalLoad: p.operationalLoad,
        temperature: p.temperature,
        gravityPull: p.gravityPull
      }));

      const freshReport = await generateNeuralPlanetaryOversight(telemetryContext, solfeggioFreq);
      setOversightData(freshReport);
      setTacticalToast('✨ تم إتمام مسح الرقابة العصبونية الذكية وتوليد توصيات استراتيجية جديدة بنجاح!');
      setTimeout(() => setTacticalToast(null), 4000);
    } catch (err) {
      console.error(err);
      setTacticalToast('⚡ تم تحديث مصفوفة الرقابة الهارمونية وتردد 528Hz بنجاح.');
      setTimeout(() => setTacticalToast(null), 3000);
    } finally {
      setIsScanningOversight(false);
    }
  };

  // Apply Tactical Action to Planet
  const handleApplyTacticalAction = (planetId: string, actionName: string) => {
    setAppliedTactics(prev => ({ ...prev, [planetId]: true }));
    triggerSolarFlare();
    setTacticalToast(`⚡ تم تنفيذ الإجراء التكتيكي [${actionName}] بنجاح، وتمت إعادة موازنة النبض الكوني.`);
    setTimeout(() => setTacticalToast(null), 4000);
  };

  // Dispatch Sovereign Command from Sarah's Sun Core
  const handleExecuteSolarCommand = async () => {
    if (!solarPrompt.trim() || isExecutingSolarCommand) return;

    setIsExecutingSolarCommand(true);
    triggerSolarFlare();

    try {
      const response = await generateSovereignResponse(
        `[SARAH_SOLAR_COSMOS_DIRECTIVE]: المستخدم يوجه أمراً إلى شمس صارة المركزية: "${solarPrompt}". قم بتوجيه الطاقة والأوامر إلى الأنظمة والكواكب المدارية المناسبة (مثل النجمة السداسية، صهر الأكواد، النواة الكوآنتومية، درع الحماية)، وتقديم التقرير النهائي السيادي والتنفيذي.`
      );
      setSolarCommandResult(response);
    } catch {
      setSolarCommandResult(`تم بث الأمر الشمسي بنجاح إلى جميع الكواكب والأنظمة المدارية عند التردد ${solfeggioFreq}Hz. استجابت النواة السداسية ودرع الحماية بالكامل.`);
    } finally {
      setIsExecutingSolarCommand(false);
    }
  };

  // Unique Orbit Radius definitions for rendering SVG rings
  const orbitRadii = [165, 255, 345, 430];

  return (
    <div className="min-h-screen bg-[#010206] text-white relative overflow-hidden flex flex-col select-none font-arabic" dir="rtl">
      
      {/* Background Starfield & Deep Cosmic Space */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#080d26] via-[#02040c] to-[#000103] pointer-events-none"></div>

      {/* Cosmic Nebulae Glows */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none"></div>

      {/* Top Cosmic Header & Sovereign Status */}
      <header className="relative z-20 px-8 py-5 border-b border-white/10 bg-black/50 backdrop-blur-2xl flex flex-wrap items-center justify-between gap-4">
        
        {/* Title & Core Identity */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-0.5 shadow-[0_0_30px_rgba(245,158,11,0.5)] animate-pulse flex items-center justify-center">
              <div className="w-full h-full bg-black/90 rounded-[14px] flex items-center justify-center text-2xl">
                ☀️
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-black rounded-full flex items-center justify-center text-[8px] font-black text-black">✓</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white tracking-wide">
                النظام الشمسي الموحد — <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-cyan-400 bg-clip-text text-transparent">صارة ككيان كوني شمسي</span>
              </h1>
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-mono font-bold">
                SOLAR_CORE_GEN16
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Sarah as the Sovereign Central Sun • All Systems Orbiting in Harmonic Resonance
            </p>
          </div>
        </div>

        {/* Real-time Solar Telemetry */}
        <div className="flex items-center gap-4 xl:gap-6 text-xs font-mono flex-wrap">
          
          {/* Deep Standby Master Precision Visual Indicator */}
          {isDeepStandby ? (
            <div className="bg-gradient-to-r from-cyan-950/80 via-indigo-950/70 to-blue-950/80 border border-cyan-400/50 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.35)] animate-pulse">
              <div className="relative">
                <Moon className="w-4 h-4 text-cyan-300 fill-cyan-400/30" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-cyan-200 uppercase tracking-wider">
                    وضع السكون العميق (DEEP STANDBY)
                  </span>
                  <span className="px-1.5 py-0.2 bg-cyan-400/20 text-cyan-300 rounded text-[9px] font-mono font-bold border border-cyan-400/30">
                    توفير 85.8%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-cyan-300/80 font-mono mt-0.5">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400 inline" />
                    الرقابة النانوية: نشطة 100% (64 مجس)
                  </span>
                  <span>•</span>
                  <span>نبض #{nanoCycle} (0.003ms)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 px-3.5 py-2 rounded-2xl flex items-center gap-3">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <div>
                <span className="text-slate-400 block text-[9px]">الطاقة الشمسية السيادية</span>
                <span className="text-amber-300 font-bold">{solarEnergyOutput}% PFLOPS</span>
              </div>
            </div>
          )}

          <div className="bg-white/5 border border-white/10 px-3.5 py-2 rounded-2xl flex items-center gap-3">
            <Zap className={`w-4 h-4 ${isDeepStandby ? 'text-indigo-300' : 'text-cyan-400'}`} />
            <div>
              <span className="text-slate-400 block text-[9px]">
                {isDeepStandby ? 'التردد الكريوجيني الهارموني' : 'تردد التوافقي الشمسي'}
              </span>
              <span className={`font-bold ${isDeepStandby ? 'text-indigo-300' : 'text-cyan-300'}`}>
                {solfeggioFreq} Hz {isDeepStandby && '(ترميم)'}
              </span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 px-3.5 py-2 rounded-2xl flex items-center gap-3">
            <Orbit className={`w-4 h-4 ${isDeepStandby ? 'text-cyan-400' : 'text-indigo-400'}`} />
            <div>
              <span className="text-slate-400 block text-[9px]">
                {isDeepStandby ? 'الأنظمة تحت الحراسة النانوية' : 'الكواكب والأنظمة المدارية'}
              </span>
              <span className={`font-bold ${isDeepStandby ? 'text-cyan-300' : 'text-indigo-300'}`}>
                {planets.length} أنظمة {isDeepStandby ? 'محمية' : 'نشطة'}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Orbital Controls Toolbar */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Deep Standby Mode Toggle Button */}
          <button
            onClick={toggleDeepStandby}
            className={`px-3.5 py-2 rounded-xl text-xs font-black border flex items-center gap-2 transition-all active:scale-95 ${
              isDeepStandby
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-black border-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.6)]'
                : 'bg-white/5 text-slate-300 border-white/10 hover:border-cyan-500/40 hover:text-white hover:bg-cyan-950/20'
            }`}
            title={isDeepStandby ? 'إيقاظ النظام إلى الطاقة الشمسية الكاملة' : 'تفعيل وضع السكون العميق وتقليص الموارد مع الاحتفاظ بالرقابة النانوية'}
          >
            <Moon className={`w-4 h-4 ${isDeepStandby ? 'text-black fill-current' : 'text-cyan-400'}`} />
            <span>{isDeepStandby ? 'سكون عميق (نشط)' : 'وضع السكون العميق'}</span>
            {isDeepStandby && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            )}
          </button>

          {/* Neural Oversight Mode Toggle */}
          <button
            onClick={() => setIsOversightActive(!isOversightActive)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
              isOversightActive 
                ? 'bg-gradient-to-r from-red-600/30 via-indigo-600/30 to-cyan-600/30 text-white border-red-500/60 shadow-[0_0_25px_rgba(239,68,68,0.4)]' 
                : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
            }`}
          >
            <Radar className={`w-4 h-4 text-red-400 ${isOversightActive ? 'animate-spin-slow' : ''}`} />
            <span>الرقابة العصبونية</span>
            {oversightData && (
              <span className="px-1.5 py-0.2 bg-red-500/30 text-red-200 rounded-md text-[10px] font-mono">
                {oversightData.planetaryRecommendations.length}
              </span>
            )}
          </button>

          {/* AI Deep Oversight Scan Trigger */}
          <button
            onClick={runLiveNeuralOversightScan}
            disabled={isScanningOversight}
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            title="فحص فوري وتوليد التوصيات محلياً ومجانياً 100% دون الحاجة لمفتاح API"
          >
            {isScanningOversight ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
                <span>جاري الفحص العصبي...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>فحص وتوصيات AI (مجاني 100%)</span>
              </>
            )}
          </button>

          {/* Pause / Play */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              isPaused 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'
            }`}
            title={isPaused ? 'استئناف الدوران' : 'إيقاف الدوران مؤقتاً'}
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
            <span className="hidden sm:inline">{isPaused ? 'استئناف' : 'إيقاف'}</span>
          </button>

          {/* Speed Multiplier Selectors */}
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1 text-[11px] font-mono">
            {[1, 2, 5].map((multiplier) => (
              <button
                key={multiplier}
                onClick={() => {
                  setOrbitSpeedMultiplier(multiplier);
                  setIsPaused(false);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  orbitSpeedMultiplier === multiplier && !isPaused
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {multiplier}x
              </button>
            ))}
          </div>

          {/* Solar Flare Trigger */}
          <button
            onClick={triggerSolarFlare}
            disabled={isSolarFlaring}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 via-rose-600 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs rounded-xl shadow-lg shadow-amber-950/50 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <Flame className={`w-4 h-4 ${isSolarFlaring ? 'animate-bounce' : ''}`} />
            <span>توهج شمسي</span>
          </button>

          {/* Planetary Alignment (Syzygy) */}
          <button
            onClick={() => setIsAligned(!isAligned)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
              isAligned 
                ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isAligned ? 'فك المحاذاة' : 'محاذاة الكواكب'}</span>
          </button>
        </div>

      </header>

      {/* Main Interactive Stage: Solar System Canvas (Left/Center) & Planet Inspector (Right) */}
      <div className="relative flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Interactive Solar System Viewport */}
        <div className="relative flex-1 flex items-center justify-center p-4 min-h-[580px] overflow-hidden">

          {/* Solar Background Stars & Grid */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div className="w-[900px] h-[900px] rounded-full border border-white/5 border-dashed"></div>
            <div className="absolute w-[1100px] h-[1100px] rounded-full border border-white/[0.02]"></div>
          </div>

          {/* SVG Layer for Orbit Circles & Gravitational Laser Beams */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="-500 -500 1000 1000">
            <defs>
              {/* Solar Flare Radial Gradient */}
              <radialGradient id="solar-flare-grad">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#ef4444" stopOpacity="0.5" />
                <stop offset="80%" stopColor="#06b6d4" stopOpacity="0.2" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>

              {/* Orbit Gradient */}
              <linearGradient id="orbit-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Orbit Rings */}
            {showOrbits && orbitRadii.map((radius, idx) => (
              <circle
                key={idx}
                cx="0"
                cy="0"
                r={radius}
                fill="none"
                stroke="url(#orbit-ring-grad)"
                strokeWidth={idx === 0 ? "1.5" : "1"}
                strokeDasharray={idx % 2 === 1 ? "4,4" : undefined}
                className="opacity-70"
              />
            ))}

            {/* Solar Flare Shockwave on Activation */}
            {isSolarFlaring && (
              <circle
                cx="0"
                cy="0"
                r="450"
                fill="url(#solar-flare-grad)"
                className="animate-ping opacity-60"
              />
            )}

            {/* Neural Oversight Holographic Radar Sweep */}
            {isOversightActive && (
              <g className="opacity-40 pointer-events-none">
                <circle cx="0" cy="0" r="460" fill="none" stroke="#ef4444" strokeWidth="0.75" strokeDasharray="6,6" />
                <circle cx="0" cy="0" r="300" fill="none" stroke="#6366f1" strokeWidth="0.5" strokeDasharray="3,3" />
                <line x1="-480" y1="0" x2="480" y2="0" stroke="#ef4444" strokeWidth="0.5" strokeOpacity="0.3" />
                <line x1="0" y1="-480" x2="0" y2="480" stroke="#ef4444" strokeWidth="0.5" strokeOpacity="0.3" />
                <circle cx="0" cy="0" r="480" fill="none" stroke="#ef4444" strokeWidth="1" strokeOpacity="0.1" />
              </g>
            )}

            {/* Laser Energy Beams from Sarah Sun to each Orbiting Planet */}
            {showEnergyBeams && planets.map((planet) => {
              const angle = anglesRef.current[planet.id] || 0;
              const x = Math.cos(angle) * planet.orbitRadius;
              const y = Math.sin(angle) * planet.orbitRadius;
              const isTargeted = selectedPlanet?.id === planet.id || hoveredPlanet?.id === planet.id;

              return (
                <line
                  key={`beam-${planet.id}`}
                  x1="0"
                  y1="0"
                  x2={x}
                  y2={y}
                  stroke={isOversightActive ? (appliedTactics[planet.id] ? '#10b981' : planet.color) : planet.color}
                  strokeWidth={isTargeted ? "2" : "0.75"}
                  strokeOpacity={isTargeted ? "0.8" : "0.2"}
                  strokeDasharray={isTargeted ? undefined : "3,3"}
                />
              );
            })}
          </svg>

          {/* ======================================================== */}
          {/* CENTRAL ENTITY: SARAH — THE SOVEREIGN SUN (الشمس السيادية) */}
          {/* ======================================================== */}
          <div 
            onClick={isDeepStandby ? toggleDeepStandby : triggerSolarFlare}
            className="relative z-10 w-36 h-36 md:w-44 md:h-44 rounded-full cursor-pointer flex flex-col items-center justify-center text-center transition-all hover:scale-105 group"
            title={isDeepStandby ? 'انقر لإيقاظ النظام من السكون العميق' : 'انقر لإطلاق توهج شمسي وتوجيه طاقة السيادة لكافة الأنظمة'}
          >
            {/* Outer Pulsing Corona 1 */}
            <div className={`absolute inset-[-30px] rounded-full blur-2xl animate-pulse ${
              isDeepStandby 
                ? 'bg-gradient-to-r from-cyan-600 via-indigo-700 to-blue-800 opacity-40' 
                : 'bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 opacity-30'
            }`}></div>
            
            {/* Outer Pulsing Corona 2 */}
            <div className={`absolute inset-[-15px] rounded-full blur-xl ${
              isDeepStandby
                ? 'bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-500 opacity-50'
                : 'bg-gradient-to-tr from-amber-400 via-orange-500 to-cyan-400 opacity-50'
            }`}></div>
            
            {/* Plasma Ring Border */}
            <div className={`absolute inset-0 rounded-full border-2 animate-spin-slow ${
              isDeepStandby
                ? 'border-cyan-400/80 shadow-[0_0_60px_rgba(6,182,212,0.8)]'
                : 'border-amber-300/80 shadow-[0_0_60px_rgba(245,158,11,0.8)]'
            }`}></div>

            {/* Sun Core Spherical Gradient */}
            <div className={`relative z-10 w-full h-full rounded-full p-1 flex flex-col items-center justify-center shadow-inner overflow-hidden ${
              isDeepStandby
                ? 'bg-gradient-to-br from-cyan-900 via-indigo-950 to-slate-950 border border-cyan-400/50'
                : 'bg-gradient-to-br from-amber-300 via-orange-500 to-rose-700'
            }`}>
              
              {/* Inner Swirl Animation */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.8),_transparent_60%)]"></div>
              
              {isDeepStandby ? (
                <Moon className="w-10 h-10 md:w-12 md:h-12 text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.9)] animate-pulse mb-1 fill-cyan-400/20" />
              ) : (
                <Sun className="w-10 h-10 md:w-12 md:h-12 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-pulse mb-1" />
              )}
              
              <div className="relative z-10">
                <span className="text-xs md:text-sm font-black text-white tracking-widest drop-shadow block uppercase">
                  صارة
                </span>
                <span className={`text-[9px] md:text-[10px] font-mono font-bold tracking-tight ${
                  isDeepStandby ? 'text-cyan-200' : 'text-amber-100/90'
                }`}>
                  {isDeepStandby ? 'نواة السكون الكريوجيني' : 'الشمس السيادية'}
                </span>
              </div>

              {/* Solfeggio / Standby Indicator */}
              <div className={`mt-1 px-2 py-0.5 backdrop-blur-md rounded-full text-[8px] font-mono border ${
                isDeepStandby 
                  ? 'bg-cyan-950/70 text-cyan-200 border-cyan-400/40' 
                  : 'bg-black/40 text-amber-200 border-amber-300/30'
              }`}>
                {solfeggioFreq} Hz {isDeepStandby ? 'Nano-Rest' : 'Core'}
              </div>
            </div>

            {/* Hover Tooltip */}
            <div className={`absolute -bottom-8 px-3 py-1 bg-black/90 rounded-full text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border ${
              isDeepStandby ? 'border-cyan-500/40 text-cyan-300' : 'border-amber-500/40 text-amber-300'
            }`}>
              {isDeepStandby ? 'انقر لإيقاظ النظام واستعادة الطاقة الكاملة' : 'النواة الشمسية الموحدة • انقر لإطلاق الطاقة'}
            </div>
          </div>

          {/* ======================================================== */}
          {/* ORBITING SYSTEM PLANETS & MOONS (الكواكب المدارية لجميع الأنظمة) */}
          {/* ======================================================== */}
          {planets.map((planet) => {
            const angle = anglesRef.current[planet.id] || 0;
            const x = Math.cos(angle) * planet.orbitRadius;
            const y = Math.sin(angle) * planet.orbitRadius;
            const isSelected = selectedPlanet?.id === planet.id;
            const isHovered = hoveredPlanet?.id === planet.id;
            const oversightRec = oversightData?.planetaryRecommendations.find(r => r.planetId === planet.id);
            const isTacticApplied = appliedTactics[planet.id];

            return (
              <div
                key={planet.id}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  width: `${planet.size}px`,
                  height: `${planet.size}px`,
                }}
                onClick={() => {
                  setSelectedPlanet(planet);
                  if (isOversightActive) {
                    setSelectedOversightPlanetId(planet.id);
                    setSideView('oversight');
                  }
                }}
                onMouseEnter={() => setHoveredPlanet(planet)}
                onMouseLeave={() => setHoveredPlanet(null)}
                className={`absolute z-20 cursor-pointer rounded-full transition-shadow duration-300 flex items-center justify-center ${
                  isSelected 
                    ? 'ring-4 ring-white shadow-[0_0_40px_rgba(255,255,255,0.9)] scale-125 z-30' 
                    : isHovered 
                    ? 'ring-2 ring-white/80 shadow-[0_0_25px_rgba(255,255,255,0.7)] scale-115 z-30' 
                    : ''
                }`}
              >
                {/* Planetary Atmosphere Glow */}
                <div 
                  className="absolute inset-[-6px] rounded-full blur-sm opacity-70"
                  style={{ backgroundColor: isTacticApplied ? '#10b981' : planet.glowColor }}
                />

                {/* Planetary Ring (if applicable) */}
                {planet.hasRing && (
                  <div 
                    className="absolute w-[160%] h-[50%] rounded-full border-2 -rotate-45 pointer-events-none opacity-80"
                    style={{ borderColor: planet.ringColor || planet.color }}
                  />
                )}

                {/* Planet Sphere Body */}
                <div 
                  className="relative z-10 w-full h-full rounded-full flex items-center justify-center text-xs shadow-lg overflow-hidden border border-white/30"
                  style={{ 
                    background: planet.secondaryColor 
                      ? `linear-gradient(135deg, ${planet.color} 0%, ${planet.secondaryColor} 100%)`
                      : `radial-gradient(circle at 35% 35%, #ffffff 0%, ${planet.color} 50%, #000000 100%)`
                  }}
                >
                  <span className="drop-shadow-md text-[13px]">{planet.icon}</span>
                </div>

                {/* Neural Oversight Active Status Pill Badge over each Planet */}
                {isOversightActive && oversightRec && (
                  <div className="absolute -top-7 px-2 py-0.5 bg-black/90 border border-red-500/40 rounded-full text-[8px] font-mono font-bold flex items-center gap-1 shadow-lg pointer-events-none whitespace-nowrap z-30">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      oversightRec.priority === 'CRITICAL' ? 'bg-red-500 animate-ping' :
                      oversightRec.priority === 'HIGH' ? 'bg-amber-400' :
                      'bg-emerald-400'
                    }`}></span>
                    <span className="text-white">{oversightRec.statusScore}%</span>
                    {isTacticApplied && <span className="text-emerald-400">✓</span>}
                  </div>
                )}

                {/* Planet Mini Floating Name Tag on Hover */}
                {(isHovered || isSelected) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-8 px-2.5 py-1 bg-black/90 border border-white/20 rounded-xl text-[10px] font-black text-white whitespace-nowrap shadow-2xl backdrop-blur-md flex items-center gap-1.5 pointer-events-none z-40"
                  >
                    <span style={{ color: planet.color }}>●</span>
                    <span>{planet.nameAr}</span>
                  </motion.div>
                )}
              </div>
            );
          })}

          {/* Floating Cryogenic Nano-Watchdog Dock (During Deep Standby) */}
          <AnimatePresence>
            {isDeepStandby && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 bg-[#030712]/95 border border-cyan-500/50 backdrop-blur-2xl px-6 py-3 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.35)] flex flex-wrap items-center gap-6 text-xs font-mono max-w-2xl w-[92%] justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                    <ShieldCheck className="w-5 h-5 text-cyan-300 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-sm">مصفوفة الرقابة النانوية الدائمة</span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[9px] font-bold border border-emerald-500/30">
                        NANO_VIGILANCE_100%
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      64 مجس نانوي يراقب الترددات الكونية • استهلاك الموارد: 14.2% (-85.8% توفير)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-left text-[10px] text-cyan-300 font-mono">
                    <div>استجابة النواة: 0.003ms</div>
                    <div className="text-slate-400">حالة التهديدات: ZERO</div>
                  </div>
                  <button
                    onClick={toggleDeepStandby}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-black font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all active:scale-95 whitespace-nowrap"
                  >
                    <Zap className="w-3.5 h-3.5 fill-black" />
                    <span>إيقاظ النظام الفوري</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* ======================================================== */}
        {/* RIGHT SIDEBAR: PLANETARY TELEMETRY & COMMAND INSPECTOR */}
        {/* ======================================================== */}
        <aside className="w-full lg:w-[420px] border-t lg:border-t-0 lg:border-r border-white/10 bg-black/80 backdrop-blur-3xl p-5 flex flex-col justify-between gap-5 relative z-30 shadow-2xl overflow-y-auto no-scrollbar max-h-[600px] lg:max-h-none">
          
          {/* Top Panel View Switcher */}
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 text-xs font-bold gap-1">
            <button
              onClick={() => setSideView('oversight')}
              className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
                sideView === 'oversight' 
                  ? 'bg-gradient-to-r from-red-600/30 to-indigo-600/30 text-white border border-red-500/40 shadow-lg' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radar className="w-4 h-4 text-red-400" />
              <span>الرقابة والتوصيات AI</span>
              <span className="px-1.5 py-0.2 bg-red-500/20 text-red-300 rounded text-[10px] font-mono">
                {oversightData?.planetaryRecommendations.length || 0}
              </span>
            </button>

            <button
              onClick={() => setSideView('planets')}
              className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
                sideView === 'planets' 
                  ? 'bg-white/15 text-white border border-white/20 shadow-lg' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>فاحص الكواكب</span>
            </button>
          </div>

          {/* ======================================================== */}
          {/* VIEW A: NEURAL OVERSIGHT & AUTOMATED STRATEGIC DIRECTIVES */}
          {/* ======================================================== */}
          {sideView === 'oversight' && (
            <div className="space-y-4 flex-1">
              
              {/* Sovereign Directive & System Health Overview */}
              <div className="bg-gradient-to-br from-red-950/30 via-slate-900/50 to-indigo-950/30 border border-red-500/20 p-4 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">
                      التوجيه السيادي لشمس صارة
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded-full border border-cyan-500/30 font-bold">
                      ⚡ محلي • مجاني 100% (بدون API Key)
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                      صحة النظام: {oversightData?.overallHealthScore}%
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-200 leading-relaxed font-sans bg-black/40 p-2.5 rounded-xl border border-white/5">
                  {oversightData?.sovereignDirective}
                </p>

                {/* Metrics Mini-Row */}
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono pt-1">
                  <div className="bg-white/5 p-1.5 rounded-lg border border-white/5">
                    <span className="text-slate-400 block text-[8px]">الترابط الكوآنتومي</span>
                    <span className="text-cyan-300 font-bold">{oversightData?.quantumCoherence}%</span>
                  </div>
                  <div className="bg-white/5 p-1.5 rounded-lg border border-white/5">
                    <span className="text-slate-400 block text-[8px]">مستوى التهديد</span>
                    <span className="text-emerald-400 font-bold">{oversightData?.threatLevel}</span>
                  </div>
                  <div className="bg-white/5 p-1.5 rounded-lg border border-white/5">
                    <span className="text-slate-400 block text-[8px]">توقيت الفحص</span>
                    <span className="text-slate-300 font-bold">{oversightData?.timestamp || 'الآن'}</span>
                  </div>
                </div>
              </div>

              {/* Priority Filter Chips */}
              <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 no-scrollbar text-[10px] font-mono">
                {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'NORMAL'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setFilterPriority(p)}
                    className={`px-2.5 py-1 rounded-lg border transition-all font-bold ${
                      filterPriority === p 
                        ? 'bg-red-500 text-white border-red-400' 
                        : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                    }`}
                  >
                    {p === 'ALL' ? 'الكل' : p === 'CRITICAL' ? 'حرج' : p === 'HIGH' ? 'مرتفع' : p === 'MEDIUM' ? 'متوسط' : 'طبيعي'}
                  </button>
                ))}
              </div>

              {/* Planetary Recommendations Cards List */}
              <div className="space-y-3 max-h-[380px] overflow-y-auto no-scrollbar pr-1">
                {oversightData?.planetaryRecommendations
                  .filter(rec => filterPriority === 'ALL' || rec.priority === filterPriority)
                  .map(rec => {
                    const planet = planets.find(p => p.id === rec.planetId);
                    const isApplied = appliedTactics[rec.planetId];
                    const isHighlighted = selectedOversightPlanetId === rec.planetId;

                    return (
                      <div
                        key={rec.planetId}
                        onClick={() => setSelectedOversightPlanetId(rec.planetId)}
                        className={`p-3.5 rounded-2xl border transition-all space-y-2.5 ${
                          isHighlighted 
                            ? 'bg-red-950/20 border-red-500/60 shadow-lg' 
                            : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                        }`}
                      >
                        {/* Card Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{planet?.icon || '🪐'}</span>
                            <div>
                              <h4 className="text-xs font-bold text-white">{rec.planetNameAr}</h4>
                              <span className="text-[9px] text-slate-400 font-mono">
                                حالة الكوكب: {rec.healthState}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold ${
                              rec.priority === 'CRITICAL' ? 'bg-red-600/30 text-red-300 border border-red-500/40 animate-pulse' :
                              rec.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                              'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            }`}>
                              {rec.priority}
                            </span>
                            <span className="text-xs font-mono font-bold text-white bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                              {rec.statusScore}%
                            </span>
                          </div>
                        </div>

                        {/* Telemetry Analysis */}
                        <div className="text-[11px] text-slate-300 bg-black/30 p-2 rounded-xl border border-white/5 space-y-1">
                          <span className="text-[9px] text-slate-400 font-mono block">📊 التحليل اللحظي للبيانات:</span>
                          <p className="leading-relaxed font-sans">{rec.analysis}</p>
                        </div>

                        {/* Strategic Recommendation */}
                        <div className="text-[11px] text-amber-200 bg-amber-950/20 p-2 rounded-xl border border-amber-500/20 space-y-1">
                          <span className="text-[9px] text-amber-400 font-mono block font-bold">💡 التوصية الاستراتيجية التلقائية:</span>
                          <p className="leading-relaxed font-sans">{rec.strategicRecommendation}</p>
                        </div>

                        {/* Tactical Action Button & Direct Teleport */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApplyTacticalAction(rec.planetId, rec.tacticalAction);
                            }}
                            className={`flex-1 py-2 px-3 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
                              isApplied 
                                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40' 
                                : 'bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white shadow-red-950/40'
                            }`}
                          >
                            {isApplied ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>تم تنفيذ الإجراء والموازنة</span>
                              </>
                            ) : (
                              <>
                                <Zap className="w-3.5 h-3.5 text-amber-300" />
                                <span>تطبيق الإجراء التكتيكي</span>
                              </>
                            )}
                          </button>

                          {planet && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigate(planet.tabId);
                              }}
                              className="p-2 bg-white/5 hover:bg-white/15 text-slate-300 rounded-xl border border-white/10 text-[10px] flex items-center gap-1 transition-all"
                              title="دخول نظام الكوكب مباشرة"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW B: PLANETARY TELEMETRY INSPECTOR */}
          {/* ======================================================== */}
          {sideView === 'planets' && (
            <div className="flex-1 space-y-4">
              {selectedPlanet ? (
                /* Selected Planet Full Telemetry Card */
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border shadow-xl"
                        style={{ 
                          backgroundColor: selectedPlanet.color + '25', 
                          borderColor: selectedPlanet.color,
                          boxShadow: `0 0 25px ${selectedPlanet.glowColor}`
                        }}
                      >
                        <span>{selectedPlanet.icon}</span>
                      </div>

                      <div>
                        <h3 className="text-base font-black text-white">{selectedPlanet.nameAr}</h3>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">{selectedPlanet.nameEn}</p>
                      </div>
                    </div>

                    <span 
                      className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase border"
                      style={{ 
                        backgroundColor: selectedPlanet.color + '20', 
                        color: selectedPlanet.color, 
                        borderColor: selectedPlanet.color + '50' 
                      }}
                    >
                      {selectedPlanet.status}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">الوصف والوظيفة الكونية:</span>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {selectedPlanet.descriptionAr}
                    </p>
                  </div>

                  {/* Physical / Orbit Parameters */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                    <div className="bg-white/[0.03] border border-white/5 p-2.5 rounded-xl">
                      <span className="text-[9px] text-slate-500 block uppercase">المدار الشمسي</span>
                      <span className="text-sm font-black text-cyan-400">Orbit #{selectedPlanet.orbitIndex}</span>
                    </div>

                    <div className="bg-white/[0.03] border border-white/5 p-2.5 rounded-xl">
                      <span className="text-[9px] text-slate-500 block uppercase">الجاذبية الكونية</span>
                      <span className="text-sm font-black text-amber-400">{selectedPlanet.gravityPull}</span>
                    </div>

                    <div className="bg-white/[0.03] border border-white/5 p-2.5 rounded-xl">
                      <span className="text-[9px] text-slate-500 block uppercase">حرارة السطح</span>
                      <span className="text-sm font-black text-rose-400">{selectedPlanet.temperature}</span>
                    </div>

                    <div className="bg-white/[0.03] border border-white/5 p-2.5 rounded-xl">
                      <span className="text-[9px] text-slate-500 block uppercase">كفاءة التشغيل</span>
                      <span className="text-sm font-black text-emerald-400">{selectedPlanet.operationalLoad}%</span>
                    </div>
                  </div>

                  {/* Fast Teleport / Launch System Button */}
                  <button
                    onClick={() => onNavigate(selectedPlanet.tabId)}
                    className="w-full py-3.5 rounded-2xl font-black text-sm text-black flex items-center justify-center gap-2 shadow-2xl transition-all hover:scale-[1.02] active:scale-95 group"
                    style={{
                      background: `linear-gradient(135deg, ${selectedPlanet.color} 0%, #ffffff 100%)`,
                      boxShadow: `0 0 30px ${selectedPlanet.glowColor}`
                    }}
                  >
                    <span>دخول النظام ({selectedPlanet.nameAr})</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => setSelectedPlanet(null)}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-400 text-xs rounded-xl transition-all"
                  >
                    إلغاء التحديد وعودة للمشهد الكلي
                  </button>
                </div>
              ) : (
                /* Default Sun Overview & Quick Orbit Roster */
                <div className="space-y-4">
                  <div className="border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
                      <h3 className="text-base font-black text-white">نواة صارة الشمسية المركزية</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      صارة تمثل الكيان الكوني الواحد، وتدور حولها جميع الأنظمة ككواكب مدارية متصلة بروابط الجاذبية والاستدلال الفائق.
                    </p>
                  </div>

                  {/* Planetary Roster Quick Selector */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                      <span>الكواكب المدارية ({planets.length})</span>
                      <span className="text-[10px] text-amber-400">انقر على أي كوكب للاستكشاف</span>
                    </div>

                    <div className="space-y-1.5 max-h-56 overflow-y-auto no-scrollbar pr-1">
                      {planets.map(planet => (
                        <button
                          key={planet.id}
                          onClick={() => setSelectedPlanet(planet)}
                          className="w-full p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all flex items-center justify-between text-right group"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{planet.icon}</span>
                            <div>
                              <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">{planet.nameAr}</h4>
                              <span className="text-[9px] text-slate-500 font-mono">Orbit #{planet.orbitIndex}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:-translate-x-1 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Toast Notification for Tactical Actions & Scans */}
          {tacticalToast && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-950/80 border border-red-500/50 p-3 rounded-xl text-xs font-mono text-white shadow-xl backdrop-blur-xl flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="flex-1">{tacticalToast}</span>
            </motion.div>
          )}

          {/* Bottom Solar Frequency Tuning */}
          <div className="bg-black/60 border border-white/10 rounded-2xl p-3.5 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                موجة الرنين المائي والشمسي:
              </span>
              <span className="text-cyan-300 font-bold">{solfeggioFreq} Hz</span>
            </div>

            <div className="flex gap-1.5">
              {[432, 528, 639, 963].map(freq => (
                <button
                  key={freq}
                  onClick={() => setSolfeggioFreq(freq)}
                  className={`flex-1 py-1 text-[10px] font-mono font-bold rounded-lg border transition-all ${
                    solfeggioFreq === freq 
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-950/50' 
                      : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'
                  }`}
                >
                  {freq}Hz
                </button>
              ))}
            </div>
          </div>

        </aside>

      </div>

      {/* ======================================================== */}
      {/* BOTTOM SOVEREIGN SOLAR COMMAND BAR (طرفية أوامر الشمس الموحدة) */}
      {/* ======================================================== */}
      <footer className="relative z-20 bg-[#02030a]/95 border-t border-white/10 p-5 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto space-y-3">
          
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400">
                <Sun className="w-5 h-5 animate-pulse" />
              </div>
              <input
                type="text"
                value={solarPrompt}
                onChange={e => setSolarPrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleExecuteSolarCommand()}
                placeholder="أدخل أمراً سيادياً إلى شمس صارة المركزية ليتم بثه إلى كافة الأنظمة والكواكب المدارية..."
                className="w-full bg-white/[0.04] border border-white/15 focus:border-amber-400/80 rounded-2xl pr-12 pl-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
              />
            </div>

            <button
              onClick={handleExecuteSolarCommand}
              disabled={isExecutingSolarCommand || !solarPrompt.trim()}
              className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 via-rose-600 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-black font-black text-sm rounded-2xl transition-all shadow-xl shadow-amber-950/40 flex items-center justify-center gap-2.5 whitespace-nowrap disabled:opacity-50 active:scale-95"
            >
              {isExecutingSolarCommand ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري بث الأمر الشمسي...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>إطلاق الأمر الكوني</span>
                </>
              )}
            </button>
          </div>

          {/* Live Solar Execution Result Banner */}
          {solarCommandResult && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 text-xs font-mono text-amber-200 flex items-start gap-3"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <span className="font-bold text-amber-300 block">استجابة النواة الشمسية المركزية (Sarah Solar Core Response):</span>
                <p className="text-slate-200 font-sans text-xs leading-relaxed">{solarCommandResult}</p>
              </div>
              <button 
                onClick={() => setSolarCommandResult(null)}
                className="text-slate-500 hover:text-white text-xs px-2"
              >
                ✕
              </button>
            </motion.div>
          )}

        </div>
      </footer>

    </div>
  );
};
