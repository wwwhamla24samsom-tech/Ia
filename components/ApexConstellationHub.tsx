/**
 * 🌌 SARAH APEX CONSTELLATION COMMAND UI
 * =====================================
 * واجهة القيادة المدارية المستوحاة من Apex Interface / Reznikov Engineering
 * نواة مركزية متوهجة + شبكة عقد الوكلاء المترابطة + مصور صوتي لحظي + تفاعل فوري
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Cpu, 
  Activity, 
  Terminal, 
  Volume2, 
  VolumeX, 
  Play, 
  RotateCcw, 
  Maximize2, 
  Layers, 
  Radio, 
  ArrowUpRight, 
  Search, 
  ChevronRight, 
  Sliders, 
  CheckCircle2, 
  Flame, 
  Send,
  Compass,
  Code,
  Globe,
  Database,
  Lock,
  RefreshCw,
  Eye,
  Bot
} from 'lucide-react';
import { AppTab, Language } from '../types';
import { systemEventLogger } from '../services/systemEventLogger';

export interface AgentNode {
  id: string;
  name: string;
  arabicName: string;
  role: string;
  category: 'executive' | 'creative' | 'technical' | 'operations' | 'core';
  color: 'cyan' | 'amber' | 'emerald' | 'purple' | 'blue';
  x: number; // percentage from center (0-100 coordinate space)
  y: number;
  size: 'sm' | 'md' | 'lg';
  status: 'ONLINE' | 'ACTIVE' | 'SYNCING' | 'IDLE';
  linkedTab: AppTab;
  connections: string[]; // IDs of other linked nodes
  metrics: {
    latency: string;
    load: string;
    throughput: string;
  };
  description: string;
  activeTask: string;
}

interface Props {
  onNavigate: (tab: AppTab) => void;
  onSummonModule?: (tab: AppTab) => void;
  language?: Language;
  onOpenDrawer?: () => void;
}

export const ApexConstellationHub: React.FC<Props> = ({
  onNavigate,
  onSummonModule,
  language = 'ar',
  onOpenDrawer
}) => {
  // Constellation Node Definitions matching the Apex layout exactly
  const agentNodes: AgentNode[] = [
    {
      id: 'strategist',
      name: 'Strategist',
      arabicName: 'المخطط الاستراتيجي',
      role: 'Global Strategic Orchestration',
      category: 'executive',
      color: 'cyan',
      x: 50,
      y: 16,
      size: 'lg',
      status: 'ONLINE',
      linkedTab: AppTab.STRATEGIC_ARCHITECT,
      connections: ['chief_of_staff', 'finance', 'researcher'],
      metrics: { latency: '0.2ms', load: '14%', throughput: '99.8%' },
      description: 'صياغة القرارات السيادية وتوجيه البنية التحتية العليا.',
      activeTask: 'تحليل سيناريوهات التوسع ومحاذاة الموارد'
    },
    {
      id: 'chief_of_staff',
      name: 'Chief of staff',
      arabicName: 'رئيس الأركان',
      role: 'Executive Operational Sync',
      category: 'executive',
      color: 'cyan',
      x: 35,
      y: 27,
      size: 'md',
      status: 'ACTIVE',
      linkedTab: AppTab.ADMIN_CENTER,
      connections: ['strategist', 'researcher', 'ops'],
      metrics: { latency: '0.4ms', load: '22%', throughput: '98.5%' },
      description: 'متابعة تنفيذ توجيهات النواة والتنسيق بين سائر الوكلاء.',
      activeTask: 'جدولة مهام المزامنة وتدقيق مؤشرات الاستقرار QSI'
    },
    {
      id: 'researcher',
      name: 'Researcher',
      arabicName: 'الباحث المعرفي',
      role: 'Deep Knowledge Synthesis',
      category: 'executive',
      color: 'cyan',
      x: 23,
      y: 22,
      size: 'md',
      status: 'ONLINE',
      linkedTab: AppTab.SEARCH,
      connections: ['strategist', 'chief_of_staff', 'developer'],
      metrics: { latency: '0.6ms', load: '19%', throughput: '99.1%' },
      description: 'استقصاء البيانات المعقدة وتحليل الاتجاهات والأنماط المعرفية.',
      activeTask: 'استخلاص الرؤى من قواعد البيانات العصبونية'
    },
    {
      id: 'finance',
      name: 'Finance',
      arabicName: 'الوكيل المالي',
      role: 'Resource & Fiscal Allocation',
      category: 'executive',
      color: 'cyan',
      x: 77,
      y: 22,
      size: 'md',
      status: 'ONLINE',
      linkedTab: AppTab.DATA_STREAMS,
      connections: ['strategist', 'memory', 'engineering'],
      metrics: { latency: '0.3ms', load: '9%', throughput: '100%' },
      description: 'إدارة تدفقات الموارد وتوزيع الطاقة الحسابية بكفاءة اقتصادية فائقة.',
      activeTask: 'موازنة استهلاك خيوط المعالجة السحابية'
    },
    {
      id: 'memory',
      name: 'Memory',
      arabicName: 'الذاكرة السيادية',
      role: '10G Quantum Memory Vault',
      category: 'technical',
      color: 'cyan',
      x: 82,
      y: 40,
      size: 'md',
      status: 'ACTIVE',
      linkedTab: AppTab.QUANTUM_NEURAL_CORE,
      connections: ['finance', 'design', 'engineering'],
      metrics: { latency: '0.1ms', load: '38%', throughput: '99.9%' },
      description: 'تخزين السياقات طويلة الأمد واسترجاع المعارف بتردد 528Hz.',
      activeTask: 'مزامنة السجلات اللحظية مع قبة الحماية'
    },
    {
      id: 'sales',
      name: 'Sales',
      arabicName: 'وكيل النمو والمبيعات',
      role: 'Client Acquisition & Expansion',
      category: 'operations',
      color: 'amber',
      x: 18,
      y: 42,
      size: 'lg',
      status: 'ACTIVE',
      linkedTab: AppTab.AI_NEXUS,
      connections: ['marketing', 'ops', 'developer'],
      metrics: { latency: '0.5ms', load: '31%', throughput: '97.6%' },
      description: 'توجيه فرص النمو وبناء مسارات التحويل الذكية.',
      activeTask: 'تحليل سلوك المستفيدين وتوليد مقترحات القيمة'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      arabicName: 'التسويق والانتشار',
      role: 'Brand & Distribution Reach',
      category: 'creative',
      color: 'amber',
      x: 26,
      y: 48,
      size: 'md',
      status: 'ONLINE',
      linkedTab: AppTab.NEURAL_BROADCAST,
      connections: ['sales', 'ops', 'social'],
      metrics: { latency: '0.7ms', load: '18%', throughput: '99.0%' },
      description: 'هندسة الحملات الترويجية وتوليد المحتوى البصري والرقمي.',
      activeTask: 'بث التحديثات عبر القنوات العصبونية الموحدة'
    },
    {
      id: 'ops',
      name: 'Ops',
      arabicName: 'العمليات والبنية',
      role: 'Autonomous Infrastructure Ops',
      category: 'operations',
      color: 'amber',
      x: 32,
      y: 53,
      size: 'lg',
      status: 'ACTIVE',
      linkedTab: AppTab.DRAGON_DOME,
      connections: ['chief_of_staff', 'sales', 'marketing', 'analytics'],
      metrics: { latency: '0.2ms', load: '45%', throughput: '100%' },
      description: 'حراسة البيئة التشغيلية وقبة دراغون L4 لضمان صفر أعطال.',
      activeTask: 'مراقبة درع دراغون وعزل أي تطفل فوري'
    },
    {
      id: 'developer',
      name: 'Developer',
      arabicName: 'المطور السيادي',
      role: 'Full-Stack Code Synthesis',
      category: 'technical',
      color: 'amber',
      x: 10,
      y: 54,
      size: 'sm',
      status: 'ONLINE',
      linkedTab: AppTab.CODE_FORGE,
      connections: ['researcher', 'sales'],
      metrics: { latency: '0.8ms', load: '27%', throughput: '98.9%' },
      description: 'بناء الشيفرات وتصحيح الأخطاء البرمجية التلقائي.',
      activeTask: 'صهر خوارزميات TypeScript المتوازية'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      arabicName: 'التحليلات والمقاييس',
      role: 'Real-time Metrics Engine',
      category: 'technical',
      color: 'cyan',
      x: 39,
      y: 60,
      size: 'sm',
      status: 'ONLINE',
      linkedTab: AppTab.SYSTEM_DIAGNOSTICS,
      connections: ['ops', 'social'],
      metrics: { latency: '0.3ms', load: '12%', throughput: '99.4%' },
      description: 'رسم المخططات البيانية اللحظية D3 ومعدلات استهلاك المعالج.',
      activeTask: 'توليد رادار التنبؤ العصبي لاستهلاك الموارد'
    },
    {
      id: 'social',
      name: 'Social',
      arabicName: 'الشبكات والتفاعل',
      role: 'Omni-channel Engagement',
      category: 'creative',
      color: 'amber',
      x: 52,
      y: 62,
      size: 'lg',
      status: 'ACTIVE',
      linkedTab: AppTab.WHITE_STRATEGIC_CHAT,
      connections: ['marketing', 'analytics', 'crm'],
      metrics: { latency: '0.4ms', load: '35%', throughput: '99.2%' },
      description: 'إدارة قنوات التواصل والردود الاستراتيجية باللغة العربية والإنجليزية.',
      activeTask: 'التفاعل مع استفسارات المستخدم عبر المحادثة الذكية'
    },
    {
      id: 'crm',
      name: 'CRM',
      arabicName: 'إدارة العلاقات',
      role: 'Relationship & Identity Core',
      category: 'operations',
      color: 'cyan',
      x: 65,
      y: 63,
      size: 'sm',
      status: 'ONLINE',
      linkedTab: AppTab.KNOWLEDGE_VAULT,
      connections: ['social', 'engineering'],
      metrics: { latency: '0.5ms', load: '15%', throughput: '98.7%' },
      description: 'تأمين سجلات العملاء والمستفيدين مع تشفير سيادي.',
      activeTask: 'مزامنة بطاقات الهوية الرقمية الآمنة'
    },
    {
      id: 'engineering',
      name: 'Engineering',
      arabicName: 'الهندسة والبرمجيات',
      role: 'Quantum & Core Systems Dev',
      category: 'technical',
      color: 'amber',
      x: 76,
      y: 57,
      size: 'lg',
      status: 'ACTIVE',
      linkedTab: AppTab.QUANTUM_DEV_COMPUTER,
      connections: ['finance', 'memory', 'design', 'crm'],
      metrics: { latency: '0.1ms', load: '52%', throughput: '99.9%' },
      description: 'برمجة النواة الكوآنتومية QPU-128 ومحرك بايثون الحقيقي.',
      activeTask: 'تشغيل دوائر الحساب الكمومي ومصفوفة 128 كيوبت'
    },
    {
      id: 'design',
      name: 'Design',
      arabicName: 'التصميم والتجربة',
      role: 'Apex UI/UX Synthesis',
      category: 'creative',
      color: 'cyan',
      x: 88,
      y: 50,
      size: 'md',
      status: 'ONLINE',
      linkedTab: AppTab.STUDIO,
      connections: ['memory', 'engineering'],
      metrics: { latency: '0.6ms', load: '21%', throughput: '99.5%' },
      description: 'هندسة الواجهات المدارية التفاعلية وتنسيق الأبعاد البصرية الفائقة.',
      activeTask: 'معايرة توهج الأشعة المدارية وتأثيرات CRT'
    }
  ];

  // State
  const [selectedNode, setSelectedNode] = useState<AgentNode | null>(agentNodes[0]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'IDLE' | 'SPEAKING' | 'LISTENING' | 'SYNCING'>('SPEAKING');
  const [hoveredNode, setHoveredNode] = useState<AgentNode | null>(null);
  const [activeTabMode, setActiveTabMode] = useState<'RADAR' | 'GRID' | 'INSPECTOR'>('RADAR');
  const [commandInput, setCommandInput] = useState('');
  const [audioBars, setAudioBars] = useState<number[]>([40, 65, 85, 95, 70, 50, 80, 100, 60, 45, 90, 75, 40]);
  const [coreEnergy, setCoreEnergy] = useState(99.4);
  const [pulseCount, setPulseCount] = useState(0);

  // Dynamic Audio Waveform Animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAudioBars(prev => prev.map(() => Math.floor(Math.random() * 75) + 25));
      setPulseCount(p => p + 1);
    }, 140);
    return () => clearInterval(interval);
  }, []);

  // Voice Interaction Simulation
  const handleCoreClick = () => {
    setIsSpeaking(prev => !prev);
    const newStatus = !isSpeaking ? 'SPEAKING' : 'IDLE';
    setVoiceStatus(newStatus);
    
    systemEventLogger.logSovereignOp(
      'APEX_CORE_PULSE',
      `تم تنشيط النواة المدارية Apex Core (${newStatus}) ومزامنة تردد الرنين 528Hz مع سائر الوكلاء.`,
      'ApexCommandCore',
      'SOVEREIGN',
      0.3
    );
  };

  const handleSelectNode = (node: AgentNode) => {
    setSelectedNode(node);
    systemEventLogger.logSovereignOp(
      'AGENT_FOCUS',
      `تم توجيه حيز القيادة إلى الوكيل: [${node.name} - ${node.arabicName}] واستدعاء مقاييس الأداء.`,
      'ApexTopology',
      'INFO'
    );
  };

  const handleSummon = (tab: AppTab) => {
    if (onSummonModule) {
      onSummonModule(tab);
    } else {
      onNavigate(tab);
    }
  };

  const handleExecuteCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    systemEventLogger.logSovereignOp(
      'APEX_DIRECT_CMD',
      `أمر مباشر عبر Apex Console: "${commandInput}" تم توجيهه إلى شبكة الوكلاء.`,
      'ApexCommander',
      'SUCCESS'
    );
    setCommandInput('');
  };

  // Center coordinate for SVG lines
  const centerX = 50;
  const centerY = 44;

  return (
    <div className="w-full min-h-[820px] bg-[#020612] text-white rounded-[2.5rem] border border-cyan-500/30 p-4 sm:p-6 lg:p-8 relative overflow-hidden shadow-[0_0_80px_rgba(2,14,39,0.9)] flex flex-col justify-between select-none">
      
      {/* 🌌 Background Celestial Nebula & Radial Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(14,42,86,0.55)_0%,rgba(4,16,36,0.85)_45%,#01040a_100%)] pointer-events-none" />
      
      {/* Dynamic Starfield & Grid Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />
      
      {/* Ambient Outer Halo Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. TOP STATUS & NAVIGATION BAR */}
      {/* ========================================================================= */}
      <header className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        {/* Left: Apex Logo & Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-amber-500 p-[2px] shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <div className="w-full h-full bg-[#030816] rounded-[14px] flex items-center justify-center text-cyan-300">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white tracking-wide font-sans">
                SARAH <span className="text-cyan-400">APEX</span> MATRIX
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-500/40">
                v17.5 CONSTELLATION
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              شبكة الوكلاء المدارية المتزامنة • النواة السيادية المستقلة
            </p>
          </div>
        </div>

        {/* Center: Live Telemetry Badges */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/50 border border-cyan-500/20 text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Active Agents: <strong>14/14</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/50 border border-amber-500/20 text-amber-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Core Energy: <strong>{coreEnergy}%</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/50 border border-emerald-500/20 text-emerald-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Frequency: <strong>528Hz Sovereign</strong></span>
          </div>
        </div>

        {/* Right: View Modes & Quick Settings */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-black/60 p-1 rounded-2xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTabMode('RADAR')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeTabMode === 'RADAR'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>الرادار المداري</span>
            </button>
            <button
              onClick={() => setActiveTabMode('GRID')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeTabMode === 'GRID'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>مصفوفة الوكلاء</span>
            </button>
          </div>

          {onOpenDrawer && (
            <button
              onClick={onOpenDrawer}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs transition-all"
              title="الإعدادات الشاملة"
            >
              <Sliders className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN INTERACTIVE CONSTELLATION STAGE */}
      {/* ========================================================================= */}
      <div className="relative z-10 flex-1 my-4 min-h-[460px] sm:min-h-[520px] flex items-center justify-center">
        
        {activeTabMode === 'RADAR' ? (
          <div className="w-full h-full min-h-[500px] relative">
            
            {/* SVG Interactive Constellation Neural Lines & Laser Links */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Glow Filter */}
                <filter id="laser-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="0.8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Core Radial Gradients */}
                <radialGradient id="coreGlowCyan" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#0284c7" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="coreGlowAmber" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                  <stop offset="70%" stopColor="#d97706" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Concentric Orbital Rings around Apex Core */}
              <circle 
                cx={centerX} 
                cy={centerY} 
                r="12" 
                fill="none" 
                stroke="#06b6d4" 
                strokeWidth="0.25" 
                strokeDasharray="1, 1"
                className="opacity-40 animate-spin-slow"
              />
              <circle 
                cx={centerX} 
                cy={centerY} 
                r="22" 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="0.2" 
                strokeDasharray="2, 2"
                className="opacity-30"
              />
              <circle 
                cx={centerX} 
                cy={centerY} 
                r="34" 
                fill="none" 
                stroke="#0284c7" 
                strokeWidth="0.15" 
                className="opacity-20"
              />
              <circle 
                cx={centerX} 
                cy={centerY} 
                r="44" 
                fill="none" 
                stroke="#0369a1" 
                strokeWidth="0.1" 
                strokeDasharray="4, 4"
                className="opacity-15"
              />

              {/* Laser Lines from Core to each Agent Node */}
              {agentNodes.map(node => {
                const isSelected = selectedNode?.id === node.id;
                const strokeColor = node.color === 'amber' ? '#f59e0b' : '#06b6d4';
                return (
                  <g key={`core-link-${node.id}`}>
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={node.x}
                      y2={node.y}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? '0.5' : '0.2'}
                      strokeOpacity={isSelected ? '0.85' : '0.35'}
                      strokeDasharray={isSelected ? 'none' : '1.5, 1.5'}
                      filter="url(#laser-glow)"
                    />
                    {/* Floating Photon Particle traversing along the line */}
                    <circle r={isSelected ? '0.6' : '0.4'} fill={strokeColor} opacity="0.9">
                      <animateMotion
                        path={`M ${centerX} ${centerY} L ${node.x} ${node.y}`}
                        dur={`${2 + (node.x % 3)}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                );
              })}

              {/* Inter-node constellation links */}
              {agentNodes.map(node =>
                node.connections.map(targetId => {
                  const targetNode = agentNodes.find(n => n.id === targetId);
                  if (!targetNode || node.id > targetId) return null; // Avoid duplicate lines
                  return (
                    <line
                      key={`inter-${node.id}-${targetId}`}
                      x1={node.x}
                      y1={node.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke="#38bdf8"
                      strokeWidth="0.15"
                      strokeOpacity="0.25"
                    />
                  );
                })
              )}
            </svg>

            {/* ========================================================================= */}
            {/* 🌌 THE APEX CENTRAL REACTOR CORE */}
            {/* ========================================================================= */}
            <div 
              className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center cursor-pointer group"
              onClick={handleCoreClick}
            >
              {/* Outer Pulsing Aura */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
                
                {/* Outer Cyan Magnetic Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40 animate-[spin_12s_linear_infinite] group-hover:border-cyan-300 transition-colors shadow-[0_0_30px_rgba(6,182,212,0.4)]" />
                
                {/* Concentric Golden Ring */}
                <div className="absolute inset-2 sm:inset-3 rounded-full border-2 border-amber-400/60 animate-[spin_8s_linear_infinite_reverse] shadow-[0_0_25px_rgba(245,158,11,0.5)]" />

                {/* Inner Glowing Sun Core */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-cyan-300 p-[3px] shadow-[0_0_40px_rgba(245,158,11,0.8)] animate-pulse flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#040d21] flex flex-col items-center justify-center text-center p-1 relative overflow-hidden group-hover:bg-[#061433] transition-colors">
                    
                    {/* Internal Core Energy Spark */}
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-amber-500/20 pointer-events-none" />
                    
                    <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300 animate-bounce" />
                    <span className="text-[9px] font-black tracking-widest text-cyan-300 font-sans mt-0.5">
                      APEX
                    </span>
                  </div>
                </div>

                {/* Orbiting Micro Node */}
                <div className="absolute -top-1 right-2 w-3 h-3 rounded-full bg-cyan-400 border border-white shadow-[0_0_10px_#06b6d4] animate-ping" />
              </div>

              {/* Title & Core State Label */}
              <div className="mt-2 text-center">
                <span className="text-xs font-black text-white tracking-widest font-sans drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                  SARAH SOVEREIGN CORE
                </span>
              </div>

              {/* Audio Waveform Visualizer with "SPEAKING" Label (Direct match to Screenshot) */}
              <div className="mt-3 flex flex-col items-center bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                {/* Audio Bars */}
                <div className="flex items-center gap-1 h-5">
                  {audioBars.map((height, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-gradient-to-t from-amber-500 via-amber-300 to-yellow-200 rounded-full"
                      animate={{ height: `${voiceStatus === 'SPEAKING' ? height : 20}%` }}
                      transition={{ duration: 0.15 }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-[9px] font-mono font-black text-amber-300 tracking-wider">
                    {voiceStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 🪐 AGENT CONSTELLATION NODES (Positioned radially around the core) */}
            {/* ========================================================================= */}
            {agentNodes.map(node => {
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode?.id === node.id;
              const isAmber = node.color === 'amber';

              return (
                <div
                  key={node.id}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`
                  }}
                  onClick={() => handleSelectNode(node)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group flex flex-col items-center"
                >
                  {/* Node Orb Container */}
                  <div className="relative flex items-center justify-center">
                    
                    {/* Outer Glow Halo on Select/Hover */}
                    {(isSelected || isHovered) && (
                      <div 
                        className={`absolute -inset-2 rounded-full blur-md opacity-80 animate-pulse ${
                          isAmber ? 'bg-amber-500/50' : 'bg-cyan-500/50'
                        }`} 
                      />
                    )}

                    {/* Ring Shape / Orb */}
                    <div 
                      className={`rounded-full transition-all duration-300 flex items-center justify-center relative shadow-lg ${
                        node.size === 'lg' 
                          ? 'w-7 h-7 sm:w-8 sm:h-8' 
                          : node.size === 'md' 
                          ? 'w-5 h-5 sm:w-6 sm:h-6' 
                          : 'w-4 h-4 sm:w-5 sm:h-5'
                      } ${
                        isAmber 
                          ? 'bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 border-2 border-amber-300/80 shadow-[0_0_15px_rgba(245,158,11,0.6)]' 
                          : 'bg-gradient-to-tr from-cyan-600 via-cyan-400 to-sky-200 border-2 border-cyan-300/80 shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                      } ${
                        isSelected ? 'scale-125 ring-4 ring-white/60' : 'group-hover:scale-115'
                      }`}
                    >
                      {/* Inner Dark Hole for Ring Archetype (Chief of Staff, Memory, CRM) */}
                      {['chief_of_staff', 'memory', 'crm'].includes(node.id) && (
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#030919]" />
                      )}
                    </div>
                  </div>

                  {/* Node Label Text */}
                  <div className="mt-1.5 text-center flex flex-col items-center">
                    <span 
                      className={`text-[11px] sm:text-xs font-bold tracking-tight whitespace-nowrap transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] ${
                        isSelected 
                          ? 'text-white font-black drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]' 
                          : isAmber 
                          ? 'text-amber-200/90 group-hover:text-amber-100' 
                          : 'text-cyan-200/90 group-hover:text-cyan-100'
                      }`}
                    >
                      {node.name}
                    </span>
                    <span className="text-[9px] text-slate-400 font-sans hidden sm:block">
                      {node.arabicName}
                    </span>
                  </div>
                </div>
              );
            })}

          </div>
        ) : (
          /* ========================================================================= */
          /* 📋 GRID VIEW MODE: ALL AGENTS IN CARDS */
          /* ========================================================================= */
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2 max-h-[520px] overflow-y-auto no-scrollbar">
            {agentNodes.map(node => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => handleSelectNode(node)}
                  className={`p-4 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden bg-black/50 backdrop-blur-md flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_25px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                      : 'border-white/10 hover:border-cyan-500/40 hover:bg-white/5'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        node.color === 'amber' ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                      }`}>
                        {node.status}
                      </span>
                      <span className="text-sm font-black text-white">{node.name}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-300 mt-1">{node.arabicName}</h4>
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{node.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Latency: <strong className="text-white">{node.metrics.latency}</strong></span>
                    <span>Load: <strong className="text-emerald-400">{node.metrics.load}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM AGENT INSPECTOR & COMMAND CONSOLE DOCK */}
      {/* ========================================================================= */}
      {selectedNode && (
        <footer className="relative z-20 bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Left/Main: Selected Agent Telemetry & Task */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-lg ${
              selectedNode.color === 'amber'
                ? 'bg-amber-500/20 border border-amber-400/50 text-amber-300 shadow-amber-500/20'
                : 'bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-cyan-500/20'
            }`}>
              <Bot className="w-6 h-6" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-black text-white">{selectedNode.name}</span>
                <span className="text-xs text-slate-400 font-sans">({selectedNode.arabicName})</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {selectedNode.status}
                </span>
                <span className="text-[11px] font-mono text-cyan-400">
                  ⚡ {selectedNode.role}
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-1 font-sans">
                <strong>المهمة الحالية:</strong> {selectedNode.activeTask}
              </p>
            </div>
          </div>

          {/* Center: Micro Metrics */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-slate-400">
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              Latency: <strong className="text-cyan-300">{selectedNode.metrics.latency}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              Load: <strong className="text-amber-300">{selectedNode.metrics.load}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              Throughput: <strong className="text-emerald-300">{selectedNode.metrics.throughput}</strong>
            </div>
          </div>

          {/* Right: Direct Actions & Summon Button */}
          <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end">
            <button
              onClick={() => handleSummon(selectedNode.linkedTab)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-amber-500 hover:from-cyan-400 hover:to-amber-400 text-white font-black text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>استحضار الوحدة الميدانية</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate(selectedNode.linkedTab)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold border border-white/10 transition-all flex items-center gap-1.5"
            >
              <span>فتح كامل</span>
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </footer>
      )}

      {/* Direct Global Command Line Input */}
      <form 
        onSubmit={handleExecuteCommand}
        className="relative z-20 mt-3 flex items-center gap-2 bg-black/90 p-2 rounded-2xl border border-white/10 focus-within:border-cyan-500/60 transition-colors"
      >
        <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-950/60 rounded-xl text-xs text-cyan-300 font-mono font-bold">
          <Terminal className="w-3.5 h-3.5" />
          <span>APEX_SHELL &gt;</span>
        </div>
        <input
          type="text"
          value={commandInput}
          onChange={e => setCommandInput(e.target.value)}
          placeholder="وجه أمراً فورياً إلى النواة أو لأي وكيل في المنظومة (مثال: أعد هيكلة خطة المبيعات، افحص الأمان L4)..."
          className="flex-1 bg-transparent text-white text-xs px-2 focus:outline-none placeholder:text-slate-500 font-sans"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs flex items-center gap-1 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>تنفيذ</span>
        </button>
      </form>

    </div>
  );
};
