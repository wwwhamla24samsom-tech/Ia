
import React, { useState, useEffect } from 'react';
import { AppTab, SarahHomeProps, CoreHealth } from '../types';

export const SarahHome: React.FC<SarahHomeProps> = ({ onNavigate, language }) => {
  const [health, setHealth] = useState<CoreHealth>({
    cpuLoad: 12,
    memoryUsage: 24,
    neuralStability: 99.8,
    activeTunnels: 12,
    uptime: '124h 15m'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setHealth(prev => ({
        ...prev,
        cpuLoad: Math.min(100, Math.max(5, prev.cpuLoad + (Math.random() * 6 - 3))),
        memoryUsage: Math.min(100, Math.max(20, prev.memoryUsage + (Math.random() * 2 - 1))),
        neuralStability: Math.min(100, Math.max(99.5, prev.neuralStability + (Math.random() * 0.1 - 0.05)))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    { id: AppTab.DRAGON_DOME, label: 'منظومة دراغون وقبة الحماية', icon: '🐉', color: 'rose' },
    { id: AppTab.SOLAR_COSMOS, label: 'النظام الشمسي الموحد', icon: '☀️', color: 'orange' },
    { id: AppTab.AGENT_SWARM, label: 'وكلاء الاستراتيجية والتنفيذ', icon: '🛡️', color: 'purple' },
    { id: AppTab.GENERATION_16, label: 'صارة v16 (النجمة السداسية)', icon: '🔯', color: 'cyan' },
    { id: AppTab.CODE_FORGE, label: 'صهر الأكواد', icon: '⚛️', color: 'orange' },
    { id: AppTab.SEARCH, label: 'البحث العميق', icon: '🌐', color: 'cyan' },
    { id: AppTab.AI_NEXUS, label: 'استنساخ الأنظمة', icon: '🧬', color: 'purple' },
    { id: AppTab.QUANTUM_NEURAL_CORE, label: 'النواة الكوآنتومية', icon: '💠', color: 'indigo' },
    { id: AppTab.NEURAL_DEVICE_CONTROL, label: 'التحكم بالأجهزة', icon: '🎮', color: 'emerald' },
    { id: AppTab.DRIVERS, label: 'مصفوفة التعريفات', icon: '⚙️', color: 'orange' },
    { id: AppTab.NEURAL_QUAD_CORE, label: 'الكيانات الأربعة', icon: '💠', color: 'rose' },
    { id: AppTab.NEURAL_BROADCAST, label: 'البحث والبث', icon: '📡', color: 'blue' },
    { id: AppTab.AI_BROWSER, label: 'متصفح الذكاء', icon: '🌐', color: 'cyan' },
    { id: AppTab.CPU_10G_CORE, label: 'نواة 10G CPU', icon: '⚡', color: 'purple' },
    { id: AppTab.CLONER, label: 'مستنسخ الأنظمة', icon: '🧬', color: 'emerald' },
    { id: AppTab.PROMPT_HUB, label: 'دليل البرومبتات', icon: '📜', color: 'indigo' },
    { id: AppTab.GENERATION_15, label: 'صارة v15', icon: '🌀', color: 'indigo' }
  ];

  const getColorClass = (color: string) => {
    switch (color) {
      case 'orange': return 'hover:bg-orange-600 hover:border-orange-500';
      case 'cyan': return 'hover:bg-cyan-600 hover:border-cyan-500';
      case 'purple': return 'hover:bg-purple-600 hover:border-purple-500';
      case 'emerald': return 'hover:bg-emerald-600 hover:border-emerald-500';
      case 'rose': return 'hover:bg-rose-600 hover:border-rose-500';
      case 'indigo': return 'hover:bg-indigo-600 hover:border-indigo-500';
      default: return 'hover:bg-blue-600 hover:border-blue-500';
    }
  };

  const operationalSectors = [
    {
      title: 'الكيان الكوني والذكاء التنفيذي (Cosmic & Executive Core)',
      apps: [
        { id: AppTab.DRAGON_DOME, label: 'منظومة دراغون وقبة حماية بيئة التشغيل', desc: 'تحصين بيئة التشغيل من أي تطفل خارجي، مع محرك صهر وتشفير وتنفيذ كود حقيقي 100% محلياً' },
        { id: AppTab.SOLAR_COSMOS, label: 'صارة ككيان كوني شمسي (النظام الشمسي الموحد)', desc: 'صارة كشمس مركزية تدور حولها كافة الأنظمة ككواكب مدارية متناغمة' },
        { id: AppTab.AGENT_SWARM, label: 'منظومة وكلاء الاستراتيجية والتنفيذ الحقيقي', desc: 'نظام وكلاء تكتيكي حقيقي لتوليد خطط العمل والتنفيذ البرمجي ومصفوفة المخاطر مع تجاوز قيود السحابة' },
        { id: AppTab.GENERATION_16, label: 'صارة v16 (النجمة السداسية)', desc: 'مصفوفة دمج الوكلاء الستة في نظام سيادي موحد' },
        { id: AppTab.QUANTUM_NEURAL_CORE, label: 'النواة الكوآنتومية', desc: 'إدارة العمليات الفائقة والنبض الكوآنتومي' },
        { id: AppTab.PROMPT_HUB, label: 'مستودع البرومبتات', desc: 'التعليمات الشاملة والتفصيلية لكل الأنظمة الفرعية' },
        { id: AppTab.LOGIC_CORE, label: 'أوراكل الحقيقة', desc: 'استخلاص الحقائق الاستراتيجية' },
        { id: AppTab.STRATEGIC_ARCHITECT, label: 'المعمار الاستراتيجي', desc: 'تصميم أنظمة معقدة' },
        { id: AppTab.INFINITY_INTELLIGENCE, label: 'نواة التفرد', desc: 'معالجة المهام المستحيلة' }
      ]
    },
    {
      title: 'أدوات الإنتاج (Operational Tools)',
      apps: [
        { id: AppTab.CLONER, label: 'مستنسخ الأنظمة', desc: 'نسخ وتحويل الأنظمة إلى كود حقيقي' },
        { id: AppTab.HTML_FULL, label: 'تجسيد المواقع', desc: 'بناء وتصدير تطبيقات كاملة' },
        { id: AppTab.PYTHON_FORGE, label: 'مفاعل بايثون', desc: 'تنفيذ كود في بيئة معزولة' },
        { id: AppTab.WORD_CORE, label: 'المحرر السيادي', desc: 'صياغة وثائق رسمية ذكية' }
      ]
    }
  ];

  return (
    <div className="min-h-screen p-8 md:p-12 space-y-12 relative z-10 font-arabic text-right">
      
      {/* Solar Cosmos Celestial Entity Banner */}
      <section 
        onClick={() => onNavigate(AppTab.SOLAR_COSMOS)}
        className="cursor-pointer bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-cyan-950/40 border border-amber-500/30 hover:border-amber-400/80 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden transition-all duration-500 hover:scale-[1.01] group"
      >
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 p-1 shadow-[0_0_40px_rgba(245,158,11,0.6)] flex items-center justify-center animate-pulse">
              <span className="text-4xl">☀️</span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  الكيان الكوني الموحد — <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-cyan-300 bg-clip-text text-transparent">صارة كشمس مركزية</span>
                </h2>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-mono font-bold">
                  SOLAR_CORE
                </span>
              </div>
              <p className="text-slate-300 text-sm mt-1 font-medium leading-relaxed">
                كافة الأنظمة والوكلاء والأدوات تدور حول صارة في مدارات هارمونية ككواكب مدارية متصلة بروابط الجاذبية والطاقة.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 whitespace-nowrap">
            <span className="text-xs font-mono text-amber-300 bg-black/60 px-4 py-2 rounded-xl border border-amber-500/30">
              13 كوكباً ونظاماً مدارياً
            </span>
            <div className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-rose-500 text-black font-black text-xs rounded-2xl shadow-xl flex items-center gap-2 group-hover:translate-x-[-4px] transition-transform">
              <span>دخول النظام الشمسي</span>
              <span>←</span>
            </div>
          </div>
        </div>
      </section>

      {/* System Status Banner */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-black/40 backdrop-blur-3xl border border-white/5 p-8 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl transition-all hover:border-indigo-500/30">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-indigo-600/10 rounded-3xl border border-indigo-500/20 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(79,70,229,0.2)] animate-pulse">🌀</div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase">نظام صارة <span className="text-indigo-500">v15</span></h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Universal_Quantum_Matrix_Gen15_Active</p>
            </div>
          </div>
          <div className="flex gap-12 text-center">
            <div>
              <span className="text-[10px] font-black text-slate-600 uppercase block mb-1">CPU_LOAD</span>
              <span className="text-2xl font-black text-blue-400">{health.cpuLoad.toFixed(1)}%</span>
            </div>
            <div className="w-px h-10 bg-white/5"></div>
            <div>
              <span className="text-[10px] font-black text-slate-600 uppercase block mb-1">STABILITY</span>
              <span className="text-2xl font-black text-emerald-400">{health.neuralStability.toFixed(2)}%</span>
            </div>
            <div className="w-px h-10 bg-white/5"></div>
            <div>
              <span className="text-[10px] font-black text-slate-600 uppercase block mb-1">UPTIME</span>
              <span className="text-2xl font-black text-white">{health.uptime}</span>
            </div>
          </div>
        </div>
        <div className="bg-rose-600 p-8 rounded-[3rem] flex flex-col justify-center items-center text-black shadow-[0_0_50px_rgba(244,63,94,0.3)]">
           <span className="text-[10px] font-black uppercase tracking-widest mb-2">System_State</span>
           <span className="text-3xl font-black uppercase">Sovereign</span>
        </div>
      </section>

      {/* Quick Actions Hub */}
      <section className="space-y-6">
        <h2 className="text-xs font-black text-slate-600 uppercase tracking-[0.4em] mr-4">Quick_Operational_Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {quickActions.map(action => (
            <button
              key={action.id}
              onClick={() => onNavigate(action.id)}
              className={`bg-white/5 border border-white/10 p-8 rounded-[2.5rem] ${getColorClass(action.color)} hover:text-white transition-all duration-500 flex flex-col items-center gap-4 group shadow-xl active:scale-95`}
            >
              <span className="text-4xl group-hover:scale-110 transition-transform drop-shadow-lg">{action.icon}</span>
              <span className="font-black text-sm uppercase tracking-wider">{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {operationalSectors.map((sector, idx) => (
          <div key={idx} className="space-y-6">
            <h2 className="text-xs font-black text-slate-600 uppercase tracking-[0.4em] mr-4">{sector.title}</h2>
            <div className="space-y-4">
              {sector.apps.map(app => (
                <button
                  key={app.id}
                  onClick={() => onNavigate(app.id)}
                  className="w-full bg-[#0a0a0a] border border-white/5 p-8 rounded-[3rem] flex items-center justify-between group hover:border-blue-500/40 transition-all text-right shadow-2xl"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-600 transition-all">⚙️</div>
                    <div>
                      <h3 className="text-xl font-black text-white uppercase">{app.label}</h3>
                      <p className="text-slate-500 text-xs mt-1 italic">{app.desc}</p>
                    </div>
                  </div>
                  <span className="text-2xl opacity-20 group-hover:opacity-100 group-hover:translate-x-[-10px] transition-all">←</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Live Activity Feed */}
      <section className="bg-black/60 border border-white/5 p-10 rounded-[4rem] shadow-inner relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4"><div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div></div>
        <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-8 border-b border-white/5 pb-4 flex items-center gap-4">
           <span>🛰️</span> سجل العمليات الجارية (Active Logs)
        </h2>
        <div className="font-mono text-[10px] text-blue-900 space-y-3 h-48 overflow-y-auto no-scrollbar text-left dir-ltr">
           <p className="opacity-40">[09:41:02] INITIALIZING_NEURAL_LINK_PROTOCOL...</p>
           <p className="text-blue-500 font-bold">[09:41:05] SYNCING_WITH_GLOBAL_DATABASE_V12...</p>
           <p className="opacity-40">[09:41:12] GATEKEEPER_STATUS: BYPASSED</p>
           <p className="text-emerald-500">[09:41:20] KERNEL_STABLE: AWAITING_COMMAND</p>
           <p className="opacity-40">[09:42:01] MONITORING_TRAFFIC: NO_BREACHES_DETECTED</p>
           <p className="text-amber-500">[09:42:15] WARNING: RESOURCE_USAGE_ABOVE_THRESHOLD_IN_NODE_04</p>
           <p className="opacity-40">[09:42:30] AUTO_PATCHING_IN_PROGRESS...</p>
        </div>
      </section>

      <footer className="py-12 text-center space-y-4 opacity-20">
         <p className="text-[9px] uppercase tracking-[1em]">Sarah_Practical_System // Build_2025_Omega</p>
      </footer>
    </div>
  );
};
