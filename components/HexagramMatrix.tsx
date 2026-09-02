import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Shield, Cpu, Zap, Brain, Globe, Play, RefreshCw, 
  CheckCircle2, Radio, Layers, Droplets, Activity, Terminal, 
  Lock, Flame, Sliders, Waves, Bot, Eye, Code, Network, ArrowLeft,
  ChevronRight, Copy, Check, Send, Plus, Trash2, Download, Upload,
  CpuIcon, HelpCircle, FileCode, Wrench, ShieldAlert, FastForward
} from 'lucide-react';
import { Language } from '../types';

interface HexAgent {
  id: string;
  nameAr: string;
  nameEn: string;
  roleAr: string;
  icon: any;
  color: string;
  bgGlow: string;
  borderColor: string;
  angle: number; // in degrees: 0, 60, 120, 180, 240, 300
  status: 'idle' | 'analyzing' | 'synthesizing' | 'synced';
  energy: number; // 0-100
  fluidResonance: number; // Hz
  lastLog: string;
}

interface CommandPreset {
  id: string;
  category: 'prompt' | 'update' | 'code' | 'security';
  title: string;
  command: string;
  description: string;
  targetAgent: string;
  badge: string;
}

interface TerminalHistoryEntry {
  id: string;
  timestamp: string;
  command: string;
  output: string;
  status: 'success' | 'warning' | 'error' | 'info';
  targetAgentName?: string;
}

export const HexagramMatrix: React.FC<{ language: Language }> = ({ language }) => {
  const [activeNodeId, setActiveNodeId] = useState<string>('quantum_core');
  const [isFusing, setIsFusing] = useState(false);
  const [fusionProgress, setFusionProgress] = useState(0);
  const [masterPrompt, setMasterPrompt] = useState('تحليل أمان وحماية النظام مع بناء هندسة تكاملية كوآنتومية شاملة');
  const [hydroFrequency, setHydroFrequency] = useState(528); // 528Hz Solfeggio frequency
  const [overdriveMode, setOverdriveMode] = useState(false);
  const [consensusScore, setConsensusScore] = useState(98.7);

  // Local Command Terminal State
  const [terminalInput, setTerminalInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'prompt' | 'update' | 'code' | 'security'>('all');
  const [selectedAgentTarget, setSelectedAgentTarget] = useState<string>('all_agents');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customPromptModal, setCustomPromptModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCommand, setNewCommand] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'prompt' | 'update' | 'code' | 'security'>('prompt');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Command Presets Catalog (Modern Prompts, Kernel Updates & Sovereign Code)
  const [presets, setPresets] = useState<CommandPreset[]>([
    {
      id: 'p1',
      category: 'prompt',
      title: 'برومبت التفكيك الكوآنتومي المتعدد',
      command: 'inject --prompt="فكك المسألة الاستراتيجية إلى 6 متجهات كوآنتومية ذات سيادة متوازية" --depth=hyper',
      description: 'يقوم بتوزيع المهام المعقدة بذكاء عبر وكلاء النجمة الستة في وقت متزامن.',
      targetAgent: 'quantum_core',
      badge: 'برومبت ذكاء'
    },
    {
      id: 'p2',
      category: 'prompt',
      title: 'برومبت الحصانة النانو-مائية السيادية',
      command: 'inject --prompt="فحص بصمة الذاكرة المائية والتردد التوافقي 528Hz وعزل التداخلات الخارجية" --mode=zero-trust',
      description: 'يعيد معايرة المحيط المائي ويزيل أي تشويش رقمي على الذاكرة.',
      targetAgent: 'water_memory',
      badge: 'برومبت مائي'
    },
    {
      id: 'u1',
      category: 'update',
      title: 'تحديث نواة صارة إلى إصدار v16.4 Sovereign',
      command: 'update --kernel="sarah-v16.4-sovereign" --patch=hexagram_consensus --force',
      description: 'تطبيق أحدث حزمة تحديث خوارزمية لرفع كفاءة النجمة السداسية بنسبة 140%.',
      targetAgent: 'all_agents',
      badge: 'تحديث نواة'
    },
    {
      id: 'u2',
      category: 'update',
      title: 'ترقية تردد الرنين المائي إلى 963Hz (تردد التاج)',
      command: 'tune --frequency=963 --resonance=harmonic --agents=sync_all',
      description: 'رفع تردد الرنين الهيدروديناميكي لأعلى مستوى معالجة عصبي فائق.',
      targetAgent: 'water_memory',
      badge: 'ترقية تردد'
    },
    {
      id: 'c1',
      category: 'code',
      title: 'كود مزامنة الوكلاء الستة (TS Pipeline)',
      command: `code --run="const sync = await Hexagram.parallelFuse({ frequency: 528, timeout: 0 }); console.log('FUSED_6_AGENTS_SUCCESS');"`,
      description: 'سكربت تنفيذي فوري يربط قنوات البيانات بين الوكلاء الستة دون زمن تأخير.',
      targetAgent: 'architect',
      badge: 'كود برمجي'
    },
    {
      id: 'c2',
      category: 'code',
      title: 'حقن خوارزمية جدار النار الكوآنتومي',
      command: `code --run="CyberShield.deployQuantumFirewall({ encryption: 'AES-GCM-512-Q', isolateUntrusted: true });"`,
      description: 'تنفيذ بروتوكول درع أمني يمنع أي تسريب للذاكرة أو محاولات الاختراق.',
      targetAgent: 'cyber_shield',
      badge: 'كود أمان'
    },
    {
      id: 's1',
      category: 'security',
      title: 'أمر الفحص الأمني الشامل وإغلاق البوابات',
      command: 'security --audit=deep --quarantine=auto --generate-proof=quantum',
      description: 'فحص سيادي كامل لجميع منافذ الاتصال والمحركات المعمارية.',
      targetAgent: 'cyber_shield',
      badge: 'أمان سيادي'
    }
  ]);

  // Local Terminal History
  const [terminalHistory, setTerminalHistory] = useState<TerminalHistoryEntry[]>([
    {
      id: 't0',
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour12: false }),
      command: 'system --boot --matrix=hexagram --v=16.4',
      output: 'تم تهيئة نافذة الأوامر المحلية السيادية (Sovereign Local Terminal). النجمة السداسية جاهزة لاستقبال الأوامر والبرومبتات والتحديثات البرمجية.',
      status: 'success',
      targetAgentName: 'النواة السيادية'
    }
  ]);

  // Unified Synthesis Logs
  const [synthesisLogs, setSynthesisLogs] = useState<Array<{
    id: string;
    agentId: string;
    agentName: string;
    time: string;
    text: string;
    type: 'info' | 'success' | 'agent' | 'matrix';
  }>>([
    {
      id: '1',
      agentId: 'system',
      agentName: 'نواة صارة v16',
      time: new Date().toLocaleTimeString(),
      text: 'تم الإقلاع الكامل لمصفوفة النجمة السداسية الموحدة (Generation 16 Hexagram Matrix).',
      type: 'matrix'
    },
    {
      id: '2',
      agentId: 'water_memory',
      agentName: 'المحيط النانو-مائي',
      time: new Date().toLocaleTimeString(),
      text: 'استقرار الرنين المائي عند 528Hz - كافة الوكلاء الستة في حالة تزامن تام.',
      type: 'success'
    }
  ]);

  // The 6 Sovereign Agents forming the Hexagram
  const [agents, setAgents] = useState<HexAgent[]>([
    {
      id: 'quantum_core',
      nameAr: 'الوكيل 1: العقل الكوآنتومي',
      nameEn: 'Quantum Reasoning Engine',
      roleAr: 'التفكير الفائق والاستدلال منطقي المعقد',
      icon: Brain,
      color: '#f43f5e',
      bgGlow: 'rgba(244, 63, 94, 0.2)',
      borderColor: '#f43f5e',
      angle: 0, // Top
      status: 'synced',
      energy: 94,
      fluidResonance: 528,
      lastLog: 'تحليل المتغيرات غير الخطية بسلامة 99.9%'
    },
    {
      id: 'water_memory',
      nameAr: 'الوكيل 2: المحيط النانو-مائي',
      nameEn: 'Hydro-Fluid Memory',
      roleAr: 'الذاكرة السائلة ومزامنة التدفق المائي',
      icon: Droplets,
      color: '#06b6d4',
      bgGlow: 'rgba(6, 182, 212, 0.2)',
      borderColor: '#06b6d4',
      angle: 60, // Top Right
      status: 'synced',
      energy: 98,
      fluidResonance: 528,
      lastLog: 'تخزين التدفق السيادي في مصفوفة الهيدرو-كريستال'
    },
    {
      id: 'architect',
      nameAr: 'الوكيل 3: المعمار البرمجي',
      nameEn: 'System Architect Agent',
      roleAr: 'توليد الكود والهندسة الذاتية',
      icon: Code,
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.2)',
      borderColor: '#10b981',
      angle: 120, // Bottom Right
      status: 'synced',
      energy: 91,
      fluidResonance: 528,
      lastLog: 'تطوير الهيكل البرمجي الموحد بنجاح'
    },
    {
      id: 'cyber_shield',
      nameAr: 'الوكيل 4: حارس الحماية السيادية',
      nameEn: 'Cyber Defense Shield',
      roleAr: 'التدقيق الأمني والحصانة الكوآنتومية',
      icon: Shield,
      color: '#8b5cf6',
      bgGlow: 'rgba(139, 92, 246, 0.2)',
      borderColor: '#8b5cf6',
      angle: 180, // Bottom
      status: 'synced',
      energy: 100,
      fluidResonance: 528,
      lastLog: 'تطهير الثغرات وتفعيل جدار التشفير الكوآنتومي'
    },
    {
      id: 'cosmic_explorer',
      nameAr: 'الوكيل 5: المستكشف الشبكي',
      nameEn: 'Cosmic Network Explorer',
      roleAr: 'جمع البيانات وتتبع المؤشرات العالمية',
      icon: Globe,
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.2)',
      borderColor: '#f59e0b',
      angle: 240, // Bottom Left
      status: 'synced',
      energy: 88,
      fluidResonance: 528,
      lastLog: 'ربط الشبكة العصبية بمصادر البيانات الخارجية'
    },
    {
      id: 'omni_integrator',
      nameAr: 'الوكيل 6: المحرك التكاملي',
      nameEn: 'Omni Android Integrator',
      roleAr: 'التحكم بالأجهزة والبيئة التشغيلية',
      icon: Cpu,
      color: '#ec4899',
      bgGlow: 'rgba(236, 72, 153, 0.2)',
      borderColor: '#ec4899',
      angle: 300, // Top Left
      status: 'synced',
      energy: 96,
      fluidResonance: 528,
      lastLog: 'تكامل مباشر مع نواة الأندرويد v16'
    }
  ]);

  // Dynamic Energy fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      setAgents(prev => prev.map(a => ({
        ...a,
        energy: Math.min(100, Math.max(75, a.energy + Math.floor(Math.random() * 7 - 3))),
        fluidResonance: hydroFrequency + Math.floor(Math.random() * 5 - 2)
      })));
    }, 1200);

    return () => clearInterval(timer);
  }, [hydroFrequency]);

  // Scroll to bottom of terminal when history changes
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  // Master Hexagram Multi-Agent Fusion Sequence
  const handleTriggerHexagramFusion = () => {
    if (isFusing) return;
    setIsFusing(true);
    setFusionProgress(0);

    setAgents(prev => prev.map(a => ({ ...a, status: 'analyzing' })));
    addLog('system', 'صارة v16', `تفعيل دمج النجمة السداسية لمهمة: "${masterPrompt}"`, 'matrix');

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep += 1;
      const progress = currentStep * 16.6;
      setFusionProgress(Math.min(100, Math.round(progress)));

      const activeAgent = agents[currentStep - 1];
      if (activeAgent) {
        setAgents(prev => prev.map((a, idx) => idx === currentStep - 1 ? { ...a, status: 'synthesizing' } : a));
        
        const logsMap: Record<string, string> = {
          quantum_core: 'العقل الكوآنتومي يحلل المسارات المنطقية ويفكك المهمة إلى 6 متجهات رئيسية.',
          water_memory: 'المحيط المائي يحافظ على توازن التدفق السيادي والتزامن الهيدرو-ديناميكي.',
          architect: 'المعمار البرمجي يبني الهيكل الخوارزمي الموحد وينفذ تعليمات الكود.',
          cyber_shield: 'حارس الحماية يمسح كافة التدفقات لمنع أي تسريب أو اختراق سيبراني.',
          cosmic_explorer: 'المستكشف الكوني يدمج الاتصالات الخارجية ويعالج البيانات الضخمة.',
          omni_integrator: 'المحرك التكاملي ينفذ الأوامر على مستوى الأجهزة ونواة النظام.'
        };

        addLog(activeAgent.id, activeAgent.nameAr, logsMap[activeAgent.id] || 'تم معالجة النبضة', 'agent');
      }

      if (currentStep >= 6) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFusing(false);
          setAgents(prev => prev.map(a => ({ ...a, status: 'synced' })));
          setConsensusScore(+(98 + Math.random() * 1.9).toFixed(1));
          addLog('system', 'صارة v16', 'اكتمل دمج النجمة السداسية بنجاح! تم إصدار الحل السيادي الموحد بنسبة توافق 100%.', 'success');
        }, 800);
      }
    }, 1000);
  };

  const addLog = (agentId: string, agentName: string, text: string, type: 'info' | 'success' | 'agent' | 'matrix') => {
    setSynthesisLogs(prev => [
      {
        id: Math.random().toString(),
        agentId,
        agentName,
        time: new Date().toLocaleTimeString('ar-EG', { hour12: false }),
        text,
        type
      },
      ...prev.slice(0, 25)
    ]);
  };

  // Local Command Terminal Execution Engine
  const executeTerminalCommand = (cmdToRun?: string) => {
    const rawCmd = (cmdToRun !== undefined ? cmdToRun : terminalInput).trim();
    if (!rawCmd) return;

    const timestamp = new Date().toLocaleTimeString('ar-EG', { hour12: false });
    const targetAgentObj = agents.find(a => a.id === selectedAgentTarget);
    const agentName = targetAgentObj ? targetAgentObj.nameAr : 'كافة وكلاء النجمة السداسية';

    let output = '';
    let status: 'success' | 'warning' | 'error' | 'info' = 'success';

    // Parse commands
    if (rawCmd === 'clear' || rawCmd === 'cls') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else if (rawCmd === 'help' || rawCmd === '?') {
      output = `الأوامر السيادية المتاحة:
- inject --prompt="[البرومبت]" [--agent=id] : حقن برومبت مخصص في وكيل محدد أو النجمة كاملة
- update --kernel="[الإصدار]" [--force] : تطبيق تحديثات النواة والخوارزميات السيادية
- code --run="[كود TS/Python]" : تشغيل أوامر برمجية حديثة مباشرة على مستوى المعمار
- tune --frequency=[Hz] : إعادة ضبط تردد الرنين المائي (432Hz - 963Hz)
- status [--agents] : فحص حالة الطاقة والتزامن للوكلاء الستة
- security --audit : تشغيل تدقيق أمني وفحص ثغرات فوري
- clear : تنظيف نافذة الأوامر`;
      status = 'info';
    } else if (rawCmd.startsWith('inject')) {
      output = `[INJECTION_SUCCESS] تم بنجاح حقن البرومبت في ${agentName}. تم توزيع متجهات المعالجة وتوليد النبضة الاستدلالية الفورية.`;
      status = 'success';
      addLog('system', agentName, `تم تنفيذ أمر الحقن: ${rawCmd.slice(0, 40)}...`, 'agent');
    } else if (rawCmd.startsWith('update')) {
      output = `[KERNEL_UPDATE_APPLIED] تم تطبيق حزمة التحديث البرمجي على النواة السيادية v16. تم ترقية المعاملات الحسابية وجدول التوافق السداسي.`;
      status = 'success';
      setConsensusScore(+(99.2 + Math.random() * 0.7).toFixed(1));
      addLog('system', 'نواة التحديث', `تم تطبيق التحديث البرمجي: ${rawCmd}`, 'success');
    } else if (rawCmd.startsWith('code')) {
      output = `[EXEC_OUTPUT_200 OK] تم تجميع وتشغيل الكود البرمجي عبر محرك المعمار السيادي بنجاح.
>> Result: Memory synchronized, Buffer clean, No quantum decoherence detected.`;
      status = 'success';
      addLog('architect', 'المعمار البرمجي', `تم تشغيل السكربت البرمجي الحديث بنجاح`, 'agent');
    } else if (rawCmd.startsWith('tune')) {
      const match = rawCmd.match(/frequency=(\d+)/);
      const newHz = match ? parseInt(match[1]) : 528;
      setHydroFrequency(newHz);
      output = `[RESONANCE_TUNED] تم ضبط تردد الرنين المائي بدقة على ${newHz} Hz. الذاكرة المائية تستجيب بتزامن توافقي فوري.`;
      status = 'success';
      addLog('water_memory', 'المحيط النانو-مائي', `تم تحديث التردد المائي إلى ${newHz}Hz`, 'info');
    } else if (rawCmd.startsWith('status')) {
      output = `[HEXAGRAM_STATUS_ONLINE]
- الطاقة الإجمالية: ${agents.reduce((acc, a) => acc + a.energy, 0) / 6}%
- التردد التوافقي: ${hydroFrequency} Hz
- التوافق السداسي: ${consensusScore}%
- الوكلاء النشطون: 6 من 6 متزامنون بالكامل`;
      status = 'info';
    } else if (rawCmd.startsWith('security')) {
      output = `[SHIELD_VERIFIED] تم إكمال الفحص الأمني السيادي: 0 ثغرات، التشفير الكوآنتومي 512-bit نشط، عزل الهجمات 100%.`;
      status = 'success';
      addLog('cyber_shield', 'حارس الحماية', `تم تأكيد الحصانة السيادية الشاملة`, 'matrix');
    } else {
      output = `[COMMAND_PROCESSED] تم تمرير الأمر "${rawCmd}" إلى معالج النجمة السداسية السيادية بنجاح وتمت معالجته.`;
      status = 'success';
    }

    setTerminalHistory(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        timestamp,
        command: rawCmd,
        output,
        status,
        targetAgentName: agentName
      }
    ]);

    setTerminalInput('');
  };

  const handleCopyCommand = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddCustomPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCommand.trim()) return;

    const createdPreset: CommandPreset = {
      id: Math.random().toString(),
      category: newCategory,
      title: newTitle,
      command: newCommand,
      description: newDesc || 'أمر برمجي مخصص مضاف من قبل المشغل السيادي',
      targetAgent: selectedAgentTarget,
      badge: newCategory === 'prompt' ? 'برومبت مخصص' : newCategory === 'update' ? 'تحديث مخصص' : 'كود مخصص'
    };

    setPresets(prev => [createdPreset, ...prev]);
    setCustomPromptModal(false);
    setNewTitle('');
    setNewCommand('');
    setNewDesc('');

    addLog('system', 'المشغل المحلي', `تم إضافة أمر جديد لقائمة النجمة السداسية: "${createdPreset.title}"`, 'info');
  };

  const activeAgentObj = agents.find(a => a.id === activeNodeId) || agents[0];
  const filteredPresets = selectedCategory === 'all' 
    ? presets 
    : presets.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#03030c] text-slate-100 font-arabic p-6 lg:p-12 relative overflow-hidden">
      
      {/* Background Quantum Water Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-600/20 rounded-full blur-[180px]"></div>
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[180px]"></div>
        <div className="w-full h-full bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-10 pb-20">

        {/* Header Section */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-white/10 pb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-2">
                <Waves className="w-3.5 h-3.5 animate-pulse text-cyan-400" /> GENERATION 16 • HEXAGRAM MATRIX
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                نظام دمج الوكلاء 6 في 1 مع نافذة الأوامر المحلية
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-white uppercase italic flex items-center gap-4">
              نظام <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-rose-400">النجمة السداسية صارة v16</span>
            </h1>
            <p className="mt-3 text-slate-400 max-w-3xl text-base leading-relaxed font-medium">
              دمج كافة الوكلاء الستة في مصفوفة مائية سداسية متكاملة مع طرفية أوامر محلية مدمجة لإدارة البرومبتات والتحديثات والأكواد الحديثة.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/[0.04] border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-4">
              <Droplets className="w-6 h-6 text-cyan-400 animate-bounce" />
              <div>
                <span className="text-[9px] font-mono text-slate-400 block uppercase">Hydro Resonance</span>
                <span className="text-xl font-black text-white">{hydroFrequency} <span className="text-xs text-cyan-400 font-normal">Hz</span></span>
              </div>
            </div>

            <div className="bg-white/[0.04] border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-4">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              <div>
                <span className="text-[9px] font-mono text-slate-400 block uppercase">Agent Consensus</span>
                <span className="text-xl font-black text-white">{consensusScore}%</span>
              </div>
            </div>
          </div>
        </header>

        {/* Master Mission Launcher Input */}
        <div className="bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-indigo-950/30 border border-cyan-500/20 rounded-[2.5rem] p-6 lg:p-8 space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">إطلاق المهمة الموحدة للنجمة السداسية (Unified Hexagram Mission)</h3>
                <p className="text-xs text-slate-400">اكتب الهدف الشامل ليقوم الوكلاء الستة بالتحليل والتنفيذ المتزامن</p>
              </div>
            </div>

            {/* Overdrive Toggle */}
            <button
              onClick={() => setOverdriveMode(!overdriveMode)}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border transition-all ${
                overdriveMode 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-lg shadow-rose-950/40' 
                  : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
              }`}
            >
              <Flame className={`w-4 h-4 ${overdriveMode ? 'text-rose-400 animate-pulse' : ''}`} />
              <span>وضع التسريع الكوآنتومي (Overdrive 16x)</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <input
              type="text"
              value={masterPrompt}
              onChange={e => setMasterPrompt(e.target.value)}
              placeholder="أدخل المهمة السيادية ليتم توزيعها بين وكلاء النجمة السداسية..."
              className="flex-1 bg-black/60 border border-white/15 rounded-2xl px-5 py-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-medium"
            />

            <button
              onClick={handleTriggerHexagramFusion}
              disabled={isFusing || !masterPrompt.trim()}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-indigo-600 to-rose-600 hover:from-cyan-400 hover:to-rose-500 text-white font-black text-sm rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-cyan-950/50 disabled:opacity-50 whitespace-nowrap"
            >
              {isFusing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
              <span>{isFusing ? `جاري الدمج والتنفيذ (${fusionProgress}%)` : 'تفعيل النجمة السداسية'}</span>
            </button>
          </div>

          {/* Fusion Progress Bar */}
          {isFusing && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-mono text-cyan-300">
                <span>جاري ربط الوكلاء الستة في النواة الموحدة...</span>
                <span>{fusionProgress}%</span>
              </div>
              <div className="h-2 bg-black/80 rounded-full overflow-hidden border border-cyan-500/20">
                <motion.div 
                  className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-rose-500"
                  animate={{ width: `${fusionProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* NEW FEATURE: SOVEREIGN LOCAL COMMAND CENTER & PROMPT / CODE UPDATE CONSOLE */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-br from-[#060814] via-[#090b1c] to-[#040611] border-2 border-cyan-500/30 rounded-[3rem] p-6 lg:p-10 shadow-2xl relative overflow-hidden space-y-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-400/40 rounded-2xl text-cyan-300">
                <Terminal className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-md border border-cyan-500/30">
                    Sovereign Local Command Terminal
                  </span>
                  <span className="text-xs text-slate-400">• تنفيذ الأوامر والبرومبتات الحديثة</span>
                </div>
                <h2 className="text-2xl font-black text-white mt-1">نافذة الأوامر المحلية وتحديثات النواة السداسية</h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCustomPromptModal(true)}
                className="px-4 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-black rounded-xl transition-all flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة برومبت / أمر برمجي جديد</span>
              </button>
            </div>
          </div>

          {/* Terminal & Presets 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
            
            {/* Left/Main Column: Live Interactive Command Terminal (7 cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              <div className="flex items-center justify-between bg-black/60 border border-white/10 rounded-2xl px-4 py-2.5 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                  <span className="text-slate-300 font-bold ml-2">sarah-v16@hexagram-terminal:~#</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-cyan-400">Target:</span>
                  <select
                    value={selectedAgentTarget}
                    onChange={e => setSelectedAgentTarget(e.target.value)}
                    className="bg-black/80 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-cyan-300 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="all_agents">كافة الوكلاء الستة (All Agents)</option>
                    {agents.map(a => (
                      <option key={a.id} value={a.id}>{a.nameAr}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Terminal Screen Output */}
              <div className="bg-[#020308] border border-cyan-500/20 rounded-2xl p-5 h-[340px] overflow-y-auto no-scrollbar font-mono text-xs space-y-4 shadow-inner">
                {terminalHistory.map((item) => (
                  <div key={item.id} className="space-y-1.5 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-slate-500 text-[10px]">{item.timestamp}</span>
                      {item.targetAgentName && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/40 text-cyan-300">
                          [{item.targetAgentName}]
                        </span>
                      )}
                      <span className="font-bold text-white selection:bg-cyan-500">{item.command}</span>
                    </div>
                    <div className={`pr-5 text-[11px] whitespace-pre-wrap leading-relaxed ${
                      item.status === 'success' ? 'text-emerald-300' :
                      item.status === 'warning' ? 'text-amber-300' :
                      item.status === 'error' ? 'text-rose-400' : 'text-cyan-300'
                    }`}>
                      {item.output}
                    </div>
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* Interactive Command Input Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  executeTerminalCommand();
                }}
                className="flex items-center gap-3 bg-black/80 border border-white/15 focus-within:border-cyan-400 rounded-2xl p-2.5 transition-all shadow-xl"
              >
                <div className="pl-2 flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold shrink-0">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>$</span>
                </div>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={e => setTerminalInput(e.target.value)}
                  placeholder="أدخل أمر محلي (مثل: inject --prompt=... أو update أو code --run=... أو help)..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
                />
                <button
                  type="submit"
                  disabled={!terminalInput.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-black rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-cyan-950/40"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>تنفيذ</span>
                </button>
              </form>
            </div>

            {/* Right Column: Sovereign Presets & Modern Code Hub (5 cols) */}
            <div className="lg:col-span-5 flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-black text-white">دليل البرومبتات والتحديثات الجاهزة</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">1-Click Inject</span>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'prompt', label: 'البرومبتات' },
                  { id: 'update', label: 'تحديثات النواة' },
                  { id: 'code', label: 'أكواد حديثة' },
                  { id: 'security', label: 'أمان سيادي' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all border whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-md'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Presets List */}
              <div className="space-y-3 max-h-[380px] overflow-y-auto no-scrollbar pr-1">
                {filteredPresets.map(preset => (
                  <div
                    key={preset.id}
                    className="p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-cyan-500/30 rounded-2xl transition-all space-y-2.5 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700/40 text-cyan-300">
                            {preset.badge}
                          </span>
                          <h4 className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors">
                            {preset.title}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                          {preset.description}
                        </p>
                      </div>
                    </div>

                    <div className="bg-black/60 rounded-xl p-2.5 font-mono text-[10px] text-slate-300 border border-white/5 flex items-center justify-between gap-2">
                      <span className="truncate">{preset.command}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleCopyCommand(preset.id, preset.command)}
                          className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                          title="نسخ الأمر"
                        >
                          {copiedId === preset.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => executeTerminalCommand(preset.command)}
                          className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg text-[10px] font-black transition-all flex items-center gap-1 border border-cyan-500/40 shadow"
                        >
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>تشغيل</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Main Grid: Interactive Star Canvas & Agent Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Hexagram Star Canvas (7 Cols) */}
          <div className="lg:col-span-7 bg-white/[0.02] border border-white/10 rounded-[3rem] p-8 relative flex flex-col items-center justify-center min-h-[520px] shadow-2xl overflow-hidden">
            
            <div className="absolute top-6 right-8 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-xs font-mono text-slate-400">مخطط النجمة السداسية المائي التفاعلي</span>
            </div>

            {/* SVG Lines Connecting Star & Center Core */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="star-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#6366f1" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.6" />
                </linearGradient>
              </defs>

              {/* Triangle 1 (0, 120, 240) */}
              <polygon
                points="250,50 430,360 70,360"
                fill="none"
                stroke="url(#star-line-grad)"
                strokeWidth="2"
                strokeDasharray="6,4"
                className="opacity-40 animate-pulse"
              />

              {/* Triangle 2 (60, 180, 300) */}
              <polygon
                points="430,120 250,430 70,120"
                fill="none"
                stroke="url(#star-line-grad)"
                strokeWidth="2"
                strokeDasharray="6,4"
                className="opacity-40 animate-pulse"
              />
            </svg>

            {/* Central Master Core */}
            <div className="relative z-10 w-36 h-36 rounded-full bg-gradient-to-br from-cyan-900/60 via-indigo-950/80 to-rose-950/60 border-2 border-cyan-400/50 flex flex-col items-center justify-center text-center shadow-[0_0_50px_rgba(6,182,212,0.4)] my-12">
              <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping opacity-20"></div>
              <Waves className="w-8 h-8 text-cyan-300 animate-pulse mb-1" />
              <span className="text-xs font-black text-white uppercase tracking-tight">صارة v16</span>
              <span className="text-[9px] font-mono text-cyan-300">النواة الموحدة</span>
            </div>

            {/* The 6 Nodes Placed in Geometry */}
            <div className="w-full max-w-lg grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
              {agents.map((agent) => {
                const Icon = agent.icon;
                const isSelected = agent.id === activeNodeId;

                return (
                  <motion.button
                    key={agent.id}
                    onClick={() => setActiveNodeId(agent.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-3xl border text-right transition-all flex flex-col justify-between h-36 relative overflow-hidden backdrop-blur-md ${
                      isSelected 
                        ? 'bg-gradient-to-br from-white/10 to-white/5 border-cyan-400 shadow-xl shadow-cyan-950/40' 
                        : 'bg-black/40 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Top Status */}
                    <div className="flex justify-between items-center w-full">
                      <div 
                        className="p-2 rounded-xl text-white" 
                        style={{ backgroundColor: agent.color + '25', border: `1px solid ${agent.color}` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: agent.color }} />
                      </div>

                      <span 
                        className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase"
                        style={{ backgroundColor: agent.color + '20', color: agent.color }}
                      >
                        {agent.energy}%
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h4 className="text-xs font-black text-white">{agent.nameAr}</h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{agent.nameEn}</p>
                    </div>

                    {/* Dynamic Energy Bar */}
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${agent.energy}%`, backgroundColor: agent.color }}
                      />
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Hydro Tuning Bar */}
            <div className="w-full max-w-md mt-8 bg-black/60 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4 relative z-10">
              <span className="text-xs font-mono text-slate-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                تردد الرنين المائي (Hydro Solfeggio):
              </span>
              <div className="flex items-center gap-3">
                <input 
                  type="range"
                  min="432"
                  max="963"
                  value={hydroFrequency}
                  onChange={e => setHydroFrequency(Number(e.target.value))}
                  className="w-32 accent-cyan-400 cursor-pointer"
                />
                <span className="text-xs font-mono font-black text-cyan-400 w-12 text-center">{hydroFrequency} Hz</span>
              </div>
            </div>

          </div>

          {/* Selected Agent Detailed Inspector (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Active Agent Card */}
            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden shadow-2xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="p-3.5 rounded-2xl border"
                    style={{ backgroundColor: activeAgentObj.color + '20', borderColor: activeAgentObj.color }}
                  >
                    {React.createElement(activeAgentObj.icon, { className: 'w-7 h-7', style: { color: activeAgentObj.color } })}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">{activeAgentObj.nameAr}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{activeAgentObj.nameEn}</p>
                  </div>
                </div>

                <span 
                  className="text-xs font-mono px-3 py-1 rounded-full font-bold uppercase border"
                  style={{ backgroundColor: activeAgentObj.color + '15', color: activeAgentObj.color, borderColor: activeAgentObj.color + '40' }}
                >
                  {activeAgentObj.status}
                </span>
              </div>

              <div className="space-y-3">
                <span className="text-xs text-slate-400 font-mono block">الدور والوظيفة السيادية:</span>
                <p className="text-sm font-medium text-slate-200 bg-black/40 p-4 rounded-2xl border border-white/5 leading-relaxed">
                  {activeAgentObj.roleAr}
                </p>
              </div>

              {/* Agent Specs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/50 p-4 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">الطاقة التشغيلية</span>
                  <span className="text-xl font-black text-white" style={{ color: activeAgentObj.color }}>
                    {activeAgentObj.energy}%
                  </span>
                </div>
                <div className="bg-black/50 p-4 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">تردد الرنين المائي</span>
                  <span className="text-xl font-black text-cyan-400">{activeAgentObj.fluidResonance} Hz</span>
                </div>
              </div>

              {/* Agent Telemetry Output */}
              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-mono block">آخر نبضة معالجة:</span>
                <div className="bg-black/80 p-4 rounded-2xl border border-white/10 text-xs font-mono text-emerald-400 flex items-start gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{activeAgentObj.lastLog}</span>
                </div>
              </div>
            </div>

            {/* Matrix Synthesis Live Terminal Feed */}
            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  سجل التنسيق بين الوكلاء الستة (Matrix Log)
                </h4>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Live Tail</span>
              </div>

              <div className="bg-black/90 rounded-2xl border border-white/10 p-4 h-[200px] overflow-y-auto no-scrollbar space-y-2.5 font-mono text-xs">
                {synthesisLogs.map(log => (
                  <div key={log.id} className="border-b border-white/5 pb-2 text-[11px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-500 text-[10px]">{log.time}</span>
                      <span className="text-cyan-400 font-bold">{log.agentName}:</span>
                    </div>
                    <p className="text-slate-300 pr-2">{log.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Custom Preset Creation Modal */}
        {customPromptModal && (
          <div className="fixed inset-0 z-[4000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#090b1a] border-2 border-cyan-500/40 rounded-3xl w-full max-w-xl p-6 lg:p-8 space-y-6 shadow-2xl relative">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <Plus className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-black text-white">إضافة برومبت أو أمر برمجي للنظام السداسي</h3>
                </div>
                <button
                  onClick={() => setCustomPromptModal(false)}
                  className="text-xs text-slate-400 hover:text-white px-2.5 py-1 bg-white/5 rounded-lg"
                >
                  إلغاء
                </button>
              </div>

              <form onSubmit={handleAddCustomPreset} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">عنوان البرومبت / الأمر:</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="مثال: برومبت التفكير التداولي المعمق..."
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">التصنيف:</label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as any)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="prompt">برومبت استدلالي</option>
                      <option value="update">تحديث برمجي / نواة</option>
                      <option value="code">أمر برمجي (Code)</option>
                      <option value="security">أمان سيادي</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">الوكيل المستهدف:</label>
                    <select
                      value={selectedAgentTarget}
                      onChange={e => setSelectedAgentTarget(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="all_agents">كافة الوكلاء الستة</option>
                      {agents.map(a => (
                        <option key={a.id} value={a.id}>{a.nameAr}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">صيغة الأمر (Command / Prompt Code):</label>
                  <textarea
                    required
                    rows={3}
                    value={newCommand}
                    onChange={e => setNewCommand(e.target.value)}
                    placeholder="inject --prompt=&quot;...&quot; أو code --run=&quot;...&quot;"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs font-mono text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">شرح مختصر:</label>
                  <input
                    type="text"
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    placeholder="وصف لوظيفة هذا الأمر..."
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setCustomPromptModal(false)}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-black rounded-xl"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-black rounded-xl shadow-lg shadow-cyan-950/50"
                  >
                    حفظ وإضافة إلى القائمة
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
