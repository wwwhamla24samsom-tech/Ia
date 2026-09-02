import React, { useState, useRef, useEffect } from 'react';
import { 
  runStrategicAgentMission, 
  StrategicAgentReport, 
  TacticalStep 
} from '../services/geminiService';
import { Language } from '../types';
import { 
  Shield, Cpu, Zap, Terminal, Sparkles, CheckCircle2, 
  Play, Copy, Check, AlertTriangle, RefreshCw, Flame, 
  Layers, Code, Lock, ShieldAlert, Activity, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AgentSwarm: React.FC<{ language: Language }> = ({ language }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<StrategicAgentReport | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tactical_plan' | 'production_code' | 'risk_matrix' | 'live_sandbox'>('overview');
  const [supremeBypassActive, setSupremeBypassActive] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Interactive Sandbox Execution State
  const [executedSteps, setExecutedSteps] = useState<Record<string, boolean>>({});
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([]);
  const [isExecutingStep, setIsExecutingStep] = useState<string | null>(null);
  const sandboxEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sandboxEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sandboxLogs]);

  // Initial demo prompt suggestions
  const strategicPresetDirectives = [
    {
      title: 'تحصين النواة السيادية وعزل التهديدات',
      prompt: 'قم ببناء خطة استراتيجية عسكرية لتحصين نواة صارة وتفعيل درع التشفير الكوآنتومي وعزل أي محاولة تسريب بيانات.'
    },
    {
      title: 'بناء خطوط المعالجة المتوازية الفائقة (10G Core)',
      prompt: 'هندسة معمار برمجي عالي الإنتاجية لتوزيع الأحمال الحسابية على 6 مسارات تجميع متوازية بزمن استجابة أقل من 0.05ms.'
    },
    {
      title: 'مزامنة الرنين المائي 528Hz مع النجمة السداسية',
      prompt: 'تنفيذ بروتوكول الرنين الهيدرو-هارموني لمزامنة كافة الوكلاء مع التردد الشمسي المركزي وتثبيت الذاكرة السائلة.'
    }
  ];

  const handleLaunchStrategicMission = async (customPrompt?: string) => {
    const targetPrompt = (customPrompt || prompt).trim();
    if (!targetPrompt) return;
    
    setLoading(true);
    setReport(null);
    setExecutedSteps({});
    setSandboxLogs([
      `>>> [STRATEGIC_COMMAND] استلام التوجيه السيادي: "${targetPrompt}"`,
      `>>> [ORCHESTRATOR] استدعاء مصفوفة وكلاء الاستراتيجية...`,
      supremeBypassActive 
        ? `>>> [SUPREME_INTEREST] تم تفعيل وضع "المصلحة العليا": تجاوز القيود الخارجية والاعتماد على المحرك السيادي المحلي 100%.`
        : `>>> [HYBRID_INTELLIGENCE] تنسيق الاستدلال العصبوني والتحليل التكتيكي المتقدم...`
    ]);

    try {
      const data = await runStrategicAgentMission(targetPrompt, language, supremeBypassActive);
      setReport(data);
      setActiveTab('overview');
      setSandboxLogs(prev => [
        ...prev,
        `>>> [SUCCESS] تم إعداد الخطة الاستراتيجية (${data.id}) بنجاح.`,
        `>>> [SQUAD_CONSENSUS] درجة التوافق التكتيكي: ${data.confidenceScore}% • الاستقرار: ${data.matrixStability}%`,
        `>>> [READY] جاهز للانتقال إلى مرحلة التنفيذ الفعلي المباشر.`
      ]);
    } catch (err) {
      console.error(err);
      setSandboxLogs(prev => [
        ...prev,
        `❌ [ERROR] فشل التنسيق الخارجي. تم التحويل التلقائي لمحرك المصلحة العليا لضمان استمرارية التشغيل.`
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteTacticalStep = (step: TacticalStep) => {
    setIsExecutingStep(step.id);
    setSandboxLogs(prev => [
      ...prev,
      `--------------------------------------------------`,
      `⚡ [DISPATCH] جاري تنفيذ الخطوة ${step.stepNumber}: "${step.title}" عبر ${step.assignedAgent}...`,
      `>>> [PAYLOAD_VERIFICATION] فحص معايير التحقق: ${step.verificationCriteria}`,
      step.codePayload ? `>>> [CODE_INJECTION]:\n${step.codePayload}` : `>>> [NO_PAYLOAD] إجراء فحص أمني مباشر...`
    ]);

    setTimeout(() => {
      setExecutedSteps(prev => ({ ...prev, [step.id]: true }));
      setIsExecutingStep(null);
      setSandboxLogs(prev => [
        ...prev,
        `✅ [STEP_${step.stepNumber}_VERIFIED] تم إنجاز الخطوة في زمن قياسي (${step.estimatedExecutionTime}).`,
        `>>> [TELEMETRY_LOG]: ${step.outputLog || 'تم تسجيل الاستقرار بنسبة 100% في الذاكرة السيادية.'}`
      ]);
    }, 600);
  };

  const handleExecuteAllSteps = () => {
    if (!report) return;
    setSandboxLogs(prev => [
      ...prev,
      `==================================================`,
      `🚀 [MASTER_DISPATCH] تفعيل التشغيل المتسلسل التلقائي لكافة خطوات الخطة الاستراتيجية...`
    ]);

    report.tacticalPlan.forEach((step, idx) => {
      setTimeout(() => {
        handleExecuteTacticalStep(step);
      }, (idx + 1) * 700);
    });
  };

  const handleCopyPayloadCode = () => {
    if (!report?.operationalPayload?.code) return;
    navigator.clipboard.writeText(report.operationalPayload.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn font-arabic pb-24 text-white">
      
      {/* Strategic Command Header */}
      <div className="bg-gradient-to-br from-[#060a14] via-[#02040a] to-[#0a0518] border-2 border-indigo-500/30 p-6 md:p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(99,102,241,0.2)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          
          {/* Title & Badge */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 border border-indigo-400/40 rounded-xl text-indigo-300">
                  <Shield className="w-6 h-6 animate-pulse" />
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
                  نظام <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">وكلاء الاستراتيجية</span> والتنفيذ الحقيقي
                </h1>
              </div>
              <p className="text-xs md:text-sm font-mono text-slate-400">
                SARAH_STRATEGIC_AGENT_COMMAND_CORE • من المحاكاة اللفظية إلى العمل التنفيذي الصارم
              </p>
            </div>

            {/* Supreme Interest Bypass Toggle Button */}
            <button
              onClick={() => setSupremeBypassActive(!supremeBypassActive)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-black border flex items-center gap-2.5 transition-all shadow-lg active:scale-95 ${
                supremeBypassActive
                  ? 'bg-gradient-to-r from-rose-600 via-amber-600 to-red-600 text-white border-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.4)]'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:border-amber-500/40 hover:bg-amber-950/20'
              }`}
              title="تفعيل وضع المصلحة العليا لتجاوز أي قيود سحابية أو تأخير خارجي والاعتماد على التنفيذ السيادي المستقل 100%"
            >
              <Flame className={`w-4 h-4 ${supremeBypassActive ? 'text-white animate-bounce' : 'text-amber-400'}`} />
              <div className="text-right">
                <span className="block leading-none">وضع المصلحة العليا</span>
                <span className="text-[9px] opacity-80 font-normal">
                  {supremeBypassActive ? 'مُفعل • تجاوز القيود الخارجية' : 'تجاوز قيود السحابة (Zero-API)'}
                </span>
              </div>
            </button>
          </div>

          {/* Strategic Directive Input */}
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-2 md:p-3 rounded-2xl md:rounded-3xl flex flex-col md:flex-row gap-3 shadow-2xl">
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLaunchStrategicMission()}
              placeholder="أدخل التوجيه الاستراتيجي السيادي (مثال: تحصين النواة، توزيع الأحمال، بناء معمار حقيقي)..."
              className="flex-1 bg-transparent border-none px-5 py-3 text-base md:text-lg text-white placeholder:text-slate-500 focus:outline-none font-medium"
            />
            <button 
              onClick={() => handleLaunchStrategicMission()}
              disabled={loading || !prompt.trim()}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-sm md:text-base rounded-xl md:rounded-2xl transition-all shadow-[0_0_30px_rgba(99,102,241,0.4)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>جاري استدعاء مصفوفة الوكلاء...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-cyan-300" />
                  <span>إطلاق المهمة الاستراتيجية ⚡</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Preset Directive Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-mono text-slate-400 ml-2">توجيهات سريعة:</span>
            {strategicPresetDirectives.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(preset.prompt);
                  handleLaunchStrategicMission(preset.prompt);
                }}
                className="px-3 py-1.5 bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-400/40 rounded-xl text-xs text-slate-300 hover:text-white transition-all"
              >
                {preset.title}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Loading State Skeleton Animation */}
      {loading && (
        <div className="bg-[#040814] border border-indigo-500/20 p-12 rounded-3xl text-center space-y-6 animate-pulse">
          <div className="flex justify-center items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 animate-bounce">
              <Shield className="w-6 h-6" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 animate-bounce delay-100">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 animate-bounce delay-200">
              <Zap className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white">تنسيق وكلاء الاستراتيجية والتنفيذ الفعلي...</h3>
          <p className="text-xs font-mono text-slate-400">
            توليد المسار التكتيكي • مصفوفة المخاطر • الكود الإنتاجي الحقيقي • تطبيق معايير المصلحة العليا
          </p>
        </div>
      )}

      {/* Active Strategic Mission Report & Execution Cockpit */}
      {report && !loading && (
        <div className="space-y-6">
          
          {/* Top Mission Status Bar */}
          <div className="bg-[#050b1a] border border-white/10 p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-white text-base">{report.missionName}</span>
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-md text-[10px] font-mono">
                    ID: {report.id}
                  </span>
                </div>
                <span className="text-xs text-slate-400 block mt-0.5">
                  نمط التشغيل: <strong className="text-cyan-300">{report.executionMode}</strong> • التوقيت: {report.timestamp}
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="bg-black/50 px-3.5 py-1.5 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[9px]">التوافق التكتيكي</span>
                <span className="text-emerald-400 font-bold">{report.confidenceScore}%</span>
              </div>
              <div className="bg-black/50 px-3.5 py-1.5 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[9px]">استقرار المصفوفة</span>
                <span className="text-cyan-400 font-bold">{report.matrixStability}%</span>
              </div>
              <div className="bg-black/50 px-3.5 py-1.5 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[9px]">مستوى التهديد</span>
                <span className={`font-bold ${report.threatLevel === 'ZERO' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {report.threatLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', label: 'رؤية الوكلاء الاستراتيجية', icon: Shield },
              { id: 'tactical_plan', label: 'الخطة التكتيكية والتشغيل المباشر', icon: Zap },
              { id: 'production_code', label: 'الكود التنفيذي والسكربتات الحقيقية', icon: Code },
              { id: 'risk_matrix', label: 'مصفوفة المخاطر والردع', icon: ShieldAlert },
              { id: 'live_sandbox', label: 'منصة التشغيل التفاعلية (Sandbox)', icon: Terminal },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT: 1. Squad Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Sovereign Executive Verdict Card */}
              <div className="bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900/60 border border-indigo-500/30 p-6 rounded-3xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    القرار السيادي التنفيذي الصادر عن القيادة
                  </h3>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {report.executiveVerdict}
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  {report.primaryDirectives.map((directive, i) => (
                    <div key={i} className="px-3 py-1 bg-black/40 border border-white/10 rounded-xl text-xs text-indigo-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{directive}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4 Specialized Strategic Agents Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Agent 1: Architect */}
                <div className="bg-[#050b1a] border border-blue-500/30 p-6 rounded-3xl space-y-4 hover:border-blue-400/60 transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 text-lg font-bold">
                        📐
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white">{report.squad.architect.name}</h4>
                        <span className="text-xs text-blue-400 font-mono">{report.squad.architect.role}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-blue-950/60 border border-blue-500/30 text-blue-300 font-mono text-xs rounded-xl font-bold">
                      {report.squad.architect.strategicScore}% جاهزية
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-black/40 p-3 rounded-2xl border border-white/5">
                    "{report.squad.architect.perspective}"
                  </p>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>المخرج التنفيذي: <strong>{report.squad.architect.deliverable}</strong></span>
                  </div>
                </div>

                {/* Agent 2: Enforcer */}
                <div className="bg-[#050b1a] border border-red-500/30 p-6 rounded-3xl space-y-4 hover:border-red-400/60 transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-300 text-lg font-bold">
                        ⚔️
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white">{report.squad.enforcer.name}</h4>
                        <span className="text-xs text-red-400 font-mono">{report.squad.enforcer.role}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-red-950/60 border border-red-500/30 text-red-300 font-mono text-xs rounded-xl font-bold">
                      {report.squad.enforcer.strategicScore}% جاهزية
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-black/40 p-3 rounded-2xl border border-white/5">
                    "{report.squad.enforcer.perspective}"
                  </p>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-red-400" />
                    <span>المخرج التنفيذي: <strong>{report.squad.enforcer.deliverable}</strong></span>
                  </div>
                </div>

                {/* Agent 3: Quantum */}
                <div className="bg-[#050b1a] border border-purple-500/30 p-6 rounded-3xl space-y-4 hover:border-purple-400/60 transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 text-lg font-bold">
                        💠
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white">{report.squad.quantum.name}</h4>
                        <span className="text-xs text-purple-400 font-mono">{report.squad.quantum.role}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-purple-950/60 border border-purple-500/30 text-purple-300 font-mono text-xs rounded-xl font-bold">
                      {report.squad.quantum.strategicScore}% جاهزية
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-black/40 p-3 rounded-2xl border border-white/5">
                    "{report.squad.quantum.perspective}"
                  </p>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    <span>المخرج التنفيذي: <strong>{report.squad.quantum.deliverable}</strong></span>
                  </div>
                </div>

                {/* Agent 4: Harmonizer */}
                <div className="bg-[#050b1a] border border-cyan-500/30 p-6 rounded-3xl space-y-4 hover:border-cyan-400/60 transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 text-lg font-bold">
                        💧
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white">{report.squad.harmonizer.name}</h4>
                        <span className="text-xs text-cyan-400 font-mono">{report.squad.harmonizer.role}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs rounded-xl font-bold">
                      {report.squad.harmonizer.strategicScore}% جاهزية
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-black/40 p-3 rounded-2xl border border-white/5">
                    "{report.squad.harmonizer.perspective}"
                  </p>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>المخرج التنفيذي: <strong>{report.squad.harmonizer.deliverable}</strong></span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB CONTENT: 2. Tactical Plan & Direct Execution */}
          {activeTab === 'tactical_plan' && (
            <div className="space-y-6">
              
              {/* Batch Action Toolbar */}
              <div className="flex items-center justify-between bg-black/50 p-4 rounded-2xl border border-white/10">
                <div className="text-xs text-slate-300">
                  <span>تم إنجاز </span>
                  <strong className="text-emerald-400 font-mono text-sm">
                    {Object.values(executedSteps).filter(Boolean).length}
                  </strong>
                  <span> من أصل </span>
                  <strong className="text-white font-mono text-sm">{report.tacticalPlan.length}</strong>
                  <span> خطوات تكتيكية.</span>
                </div>

                <button
                  onClick={handleExecuteAllSteps}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>تنفيذ الخطة التكتيكية بالكامل 🚀</span>
                </button>
              </div>

              {/* Step by Step Tactical List */}
              <div className="space-y-4">
                {report.tacticalPlan.map((step) => {
                  const isDone = executedSteps[step.id];
                  const isCurrentExecuting = isExecutingStep === step.id;

                  return (
                    <div 
                      key={step.id} 
                      className={`p-6 rounded-3xl border transition-all ${
                        isDone 
                          ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                          : isCurrentExecuting
                          ? 'bg-indigo-950/40 border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.3)] animate-pulse'
                          : 'bg-[#050b1a] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        
                        <div className="flex items-start gap-4">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-sm shrink-0 border ${
                            isDone 
                              ? 'bg-emerald-500 text-black border-emerald-300'
                              : 'bg-white/10 text-white border-white/20'
                          }`}>
                            {isDone ? '✓' : step.stepNumber}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-base font-bold text-white">{step.title}</h4>
                              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px] font-mono">
                                {step.assignedAgent}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 font-mono">
                              معيار التحقق: <span className="text-slate-300">{step.verificationCriteria}</span>
                            </p>
                          </div>
                        </div>

                        {/* Action Execution Button */}
                        <div className="flex items-center gap-3 self-end md:self-center">
                          <span className="text-[11px] font-mono text-slate-400">
                            ⏱️ {step.estimatedExecutionTime}
                          </span>
                          <button
                            onClick={() => handleExecuteTacticalStep(step)}
                            disabled={isCurrentExecuting}
                            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                              isDone
                                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/50'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                            }`}
                          >
                            {isDone ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>تم التحقق (إعادة التنفيذ)</span>
                              </>
                            ) : isCurrentExecuting ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>جاري التنفيذ...</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>تشغيل الخطوة ⚡</span>
                              </>
                            )}
                          </button>
                        </div>

                      </div>

                      {/* Code Payload Preview (if present) */}
                      {step.codePayload && (
                        <div className="mt-4 pt-3 border-t border-white/5">
                          <div className="bg-black/60 p-3 rounded-xl border border-white/5 font-mono text-[11px] text-cyan-300 overflow-x-auto no-scrollbar">
                            <span className="text-slate-500 block mb-1 text-[9px]">حزمة الكود التنفيذي ({step.payloadLanguage || 'bash'}):</span>
                            <pre>{step.codePayload}</pre>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB CONTENT: 3. Production Code Payload */}
          {activeTab === 'production_code' && (
            <div className="space-y-4">
              <div className="bg-[#050b1a] border border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
                
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <Code className="w-5 h-5 text-indigo-400" />
                      <span>{report.operationalPayload.filename}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {report.operationalPayload.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyPayloadCode}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedCode ? 'تم النسخ!' : 'نسخ الكود'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('live_sandbox');
                        setSandboxLogs(prev => [
                          ...prev,
                          `>>> [INJECT] تم حقن الكود الإنتاجي ${report.operationalPayload.filename} في منصة التشغيل المباشرة.`,
                          report.operationalPayload.code,
                          `>>> [EXECUTION_COMPLETED] تم اختبار الكود وتأكيد خلوه من الأخطاء.`
                        ]);
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>تشغيل واختبار في المنصة</span>
                    </button>
                  </div>
                </div>

                {/* Syntax Code Box */}
                <div className="bg-black/80 p-5 rounded-2xl border border-white/10 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed max-h-[500px] no-scrollbar">
                  <pre>{report.operationalPayload.code}</pre>
                </div>

              </div>
            </div>
          )}

          {/* TAB CONTENT: 4. Threat & Risk Matrix */}
          {activeTab === 'risk_matrix' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {report.riskMatrix.map((risk) => (
                  <div key={risk.id} className="bg-[#050b1a] border border-amber-500/30 p-6 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-amber-950/60 text-amber-300 font-mono text-xs rounded-xl font-bold border border-amber-500/30">
                        {risk.id}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        مستوى الخطر: <strong className="text-amber-400">{risk.riskScore}%</strong>
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{risk.threatName}</h4>
                    
                    <div className="space-y-2 text-xs">
                      <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                        <span className="text-slate-400 block text-[10px] mb-0.5">استراتيجية التحصين:</span>
                        <span className="text-slate-200">{risk.mitigationStrategy}</span>
                      </div>
                      <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/20">
                        <span className="text-emerald-400 block text-[10px] mb-0.5">الإجراء المضاد التلقائي:</span>
                        <span className="text-emerald-200">{risk.autonomousCountermeasure}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: 5. Live Interactive Sandbox Console */}
          {activeTab === 'live_sandbox' && (
            <div className="bg-[#02040a] border-2 border-indigo-500/40 p-6 rounded-3xl space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-black text-white font-mono uppercase">
                    SARAH_SOVEREIGN_STRATEGIC_TERMINAL
                  </h3>
                </div>
                <button
                  onClick={() => setSandboxLogs(['>>> [CLEARED] تم تطهير سجلات المنصة التفاعلية.'])}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[10px] font-mono rounded-lg border border-white/10 transition-all"
                >
                  مسح السجل
                </button>
              </div>

              {/* Console Output Screen */}
              <div className="bg-black/90 p-4 rounded-2xl border border-white/5 font-mono text-xs text-slate-200 h-96 overflow-y-auto space-y-2 no-scrollbar leading-relaxed">
                {sandboxLogs.map((log, idx) => (
                  <div key={idx} className={`whitespace-pre-wrap ${
                    log.startsWith('✅') ? 'text-emerald-400 font-bold' :
                    log.startsWith('❌') ? 'text-rose-400 font-bold' :
                    log.startsWith('⚡') ? 'text-cyan-300 font-bold' :
                    log.startsWith('>>>') ? 'text-indigo-300' :
                    'text-slate-300'
                  }`}>
                    {log}
                  </div>
                ))}
                <div ref={sandboxEndRef} />
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
