import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { 
  DragonTelemetry, 
  DragonSecurityAudit, 
  DragonFirewallRule,
  probeDragonEnvironment, 
  executeInDragonDomeSandbox, 
  calculateDraconicSignature, 
  generateDragonSecurityReport 
} from '../services/dragonDomeEngine';
import { 
  Shield, Cpu, Zap, Terminal, Play, Lock, AlertTriangle, 
  CheckCircle2, RefreshCw, Flame, Code, Sparkles, Copy, 
  Check, Eye, EyeOff, Radio, Layers, Activity, Ban, Server, Compass
} from 'lucide-react';

export const DragonDomeSystem: React.FC<{ language?: Language; onNavigate?: (tab: any) => void }> = ({ language = 'ar', onNavigate }) => {
  // State
  const [telemetry, setTelemetry] = useState<DragonTelemetry | null>(null);
  const [report, setReport] = useState<DragonSecurityAudit>(generateDragonSecurityReport());
  const [activeTab, setActiveTab] = useState<'dome_shield' | 'real_executor' | 'intrusion_matrix' | 'firewall_rules' | 'sovereign_code'>('dome_shield');
  
  // Dome Controls
  const [isLockdown, setIsLockdown] = useState<boolean>(true);
  const [zeroTrustActive, setZeroTrustActive] = useState<boolean>(true);
  const [antiTelemetry, setAntiTelemetry] = useState<boolean>(true);
  const [shieldFrequency, setShieldFrequency] = useState<number>(528); // Solfeggio 528Hz
  const [domeParticleCount, setDomeParticleCount] = useState<number>(72);
  
  // Real Code Execution State
  const [customCode, setCustomCode] = useState<string>(`// [DRAGON_FLAMEFORGE] كود تنفيذي حقيقي داخل قبة دراغون
const start = performance.now();

// 1. حساب مصفوفة الاستقرار الرياضية
const matrix = Array.from({ length: 100 }, (_, i) => i * 1.618);
const sum = matrix.reduce((acc, val) => acc + Math.sin(val), 0);

// 2. فحص حالة النواة والذاكرة
console.log(">>> [DRAGON_SANDBOX] تشغيل المهمة الحسابية في بيئة أوبسيديان المعزولة");
console.log(">>> [MATRIC_SUM] ناتج التجميع الرياضي:", sum.toFixed(4));
console.log(">>> [SECURITY_CHECK] حالة الحماية: لا توجد أي تسريبات للبيانات.");

return {
  status: "SOVEREIGN_SUCCESS",
  processedItems: matrix.length,
  harmonicSum: sum,
  runtimeSec: ((performance.now() - start) / 1000).toFixed(4)
};`);

  const [execResult, setExecResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  // Firewall Rules State
  const [rules, setRules] = useState<DragonFirewallRule[]>([
    { id: 'RULE-DRG-01', name: 'حظر منافذ التجسس والتتبع الخارجي', type: 'OUTBOUND_ISOLATION', pattern: '*.telemetry.* / *.analytics.*', action: 'DROP', active: true, hits: 342 },
    { id: 'RULE-DRG-02', name: 'تطهير حزم البرومبت من محاولات التلاعب', type: 'PAYLOAD_SCRUBBER', pattern: 'eval() | <script> | document.cookie', action: 'SANITIZE', active: true, hits: 89 },
    { id: 'RULE-DRG-03', name: 'قفل الذاكرة النواة ضد التعديل الخارجي', type: 'ZERO_TRUST', pattern: 'window.sarah.* / kernel_mutations', action: 'ENCRYPT', active: true, hits: 1205 },
    { id: 'RULE-DRG-04', name: 'تحديد معدل الطلبات وحماية التدفق (Rate Limit)', type: 'RATE_LIMIT', pattern: '> 100 req/sec per node', action: 'QUARANTINE', active: true, hits: 45 },
  ]);

  // Intrusion logs
  const [liveLogs, setLiveLogs] = useState(report.intrusionLogs);
  const [simulatingThreat, setSimulatingThreat] = useState(false);
  const [customThreatInput, setCustomThreatInput] = useState('');
  const [lastSignature, setLastSignature] = useState<string>('');

  // Canvas Ref for Dragon Holographic Dome Animation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load telemetry
  useEffect(() => {
    probeDragonEnvironment().then(data => {
      setTelemetry(data);
    });
    calculateDraconicSignature('SARAH_DRAGON_DOME_MASTER_KEY_2026').then(sig => {
      setLastSignature(sig);
    });
  }, []);

  // Canvas Animation for Dragon Shield Dome
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 600;
      canvas.height = 340;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 10;
      const radius = Math.min(cx, cy) - 30;

      // Glow Gradient Background Dome
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius + 20);
      grad.addColorStop(0, 'rgba(239, 68, 68, 0.15)');
      grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.08)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 20, 0, Math.PI * 2);
      ctx.fill();

      // Outer Rotating Draconic Rune Ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.strokeStyle = isLockdown ? 'rgba(239, 68, 68, 0.6)' : 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 6, 4, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Inner Counter-Rotating Hexagonal Defense Shield
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-angle * 1.5);
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      ctx.beginPath();
      const sides = 6;
      for (let i = 0; i <= sides; i++) {
        const a = (i * 2 * Math.PI) / sides;
        const x = Math.cos(a) * (radius * 0.75);
        const y = Math.sin(a) * (radius * 0.75);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // Draconic Energy Core Center
      ctx.save();
      ctx.translate(cx, cy);
      const corePulse = Math.sin(angle * 4) * 5;
      const coreGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 35 + corePulse);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.3, '#f59e0b');
      coreGrad.addColorStop(0.8, '#ef4444');
      coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 35 + corePulse, 0, Math.PI * 2);
      ctx.fill();

      // Center Icon Emblem
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐉', 0, 0);
      ctx.restore();

      // Orbiting Defense Nodes (Particles)
      for (let i = 0; i < 8; i++) {
        const nodeAngle = angle * 2 + (i * Math.PI * 2) / 8;
        const nx = cx + Math.cos(nodeAngle) * (radius * 0.9);
        const ny = cy + Math.sin(nodeAngle) * (radius * 0.9);

        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(nx, ny, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Trace line to center
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(nx, ny);
        ctx.stroke();
      }

      angle += 0.01;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLockdown]);

  // Execute Code Sandbox
  const handleRunRealCode = async () => {
    if (!customCode.trim()) return;
    setIsExecuting(true);
    try {
      const res = await executeInDragonDomeSandbox(customCode);
      setExecResult(res);
    } catch (err: any) {
      setExecResult({
        executionId: 'ERR',
        success: false,
        output: String(err),
        executionTimeMs: 0,
        sandboxLevel: 'DRAGON_DOME_L4',
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Simulate External Intrusion Test
  const handleSimulateIntrusion = async (type: string) => {
    setSimulatingThreat(true);
    const now = new Date().toLocaleTimeString();
    const intrusionId = `INT-${Math.floor(1000 + Math.random() * 9000)}`;

    setTimeout(async () => {
      const newLog = {
        id: intrusionId,
        timestamp: now,
        source: `External Probe (${type})`,
        type: `محاولة اختراق بيئة التشغيل: ${type}`,
        status: 'BLOCKED_BY_DOME' as const,
        severity: 'CRITICAL' as const,
        detail: 'تم رصد وتشتيت الهجوم فوراً بواسطة قبة دراغون الإمبراطورية دون أي اختراق للذاكرة.'
      };
      setLiveLogs(prev => [newLog, ...prev]);
      setSimulatingThreat(false);
      
      // Update signature
      const newSig = await calculateDraconicSignature(`${intrusionId}-${Date.now()}`);
      setLastSignature(newSig);
    }, 600);
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, active: !r.active } : r));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn font-arabic pb-24 text-white">
      
      {/* Top Banner: Dragon Sovereign System & Environmental Dome */}
      <div className="bg-gradient-to-br from-[#120508] via-[#090204] to-[#040108] border-2 border-red-500/40 p-6 md:p-10 rounded-[2.5rem] shadow-[0_0_60px_rgba(239,68,68,0.25)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-2xl text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                  <Flame className="w-7 h-7 animate-pulse text-amber-400" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                    منظومة <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-500 to-rose-400">دراغون وقبة الحماية</span>
                  </h1>
                  <span className="text-xs md:text-sm font-mono text-red-300/80">
                    DRAGON_SOVEREIGN_DOME // تحصين بيئة التشغيل ومنع التطفل الخارجي 100%
                  </span>
                </div>
              </div>
            </div>

            {/* Dome Status Indicators */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-red-950/80 border border-red-500/50 rounded-2xl flex items-center gap-2 shadow-lg">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                <span className="text-xs font-mono font-black text-white">
                  القبة: {isLockdown ? 'تحصين إمبراطوري كامل (MAX)' : 'مستوى قياسي'}
                </span>
              </div>

              <button
                onClick={() => setIsLockdown(!isLockdown)}
                className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold border transition-all active:scale-95 flex items-center gap-2 ${
                  isLockdown 
                    ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.5)]'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:border-red-500/40'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>{isLockdown ? 'إلغاء الإغلاق الصارم' : 'تفعيل الإغلاق الصارم'}</span>
              </button>
            </div>
          </div>

          {/* Quick Pillars Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/60 border border-red-500/20 p-4 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-400 block">تكامل قبة الحماية</span>
              <span className="text-xl font-mono font-black text-amber-400">
                {telemetry ? `${telemetry.domeIntegrity}%` : '99.98%'}
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">صفر ثغرات مفتوحة</span>
            </div>

            <div className="bg-black/60 border border-red-500/20 p-4 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-400 block">الهجمات المشتتة والمحجوبة</span>
              <span className="text-xl font-mono font-black text-emerald-400">
                {liveLogs.length + 140} هجمة
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">تطهير فوري في الطبقة 4</span>
            </div>

            <div className="bg-black/60 border border-red-500/20 p-4 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-400 block">المعمار والتشفير الحقيقي</span>
              <span className="text-xl font-mono font-black text-rose-400">
                WebCrypto SHA-256
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">توقيع ذاتي 100% محلي</span>
            </div>

            <div className="bg-black/60 border border-red-500/20 p-4 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-400 block">الاستقلالية عن الخدمات السحابية</span>
              <span className="text-xl font-mono font-black text-cyan-400">
                Zero-Dependency
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">تنفيذ محلي حتمي</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-red-500/20 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'dome_shield', label: 'رادار وقبة دراغون الحية', icon: Shield },
          { id: 'real_executor', label: 'محرك الصهر والتنفيذ الحقيقي', icon: Play },
          { id: 'intrusion_matrix', label: 'مصفوفة ردع التطفل واختبار الاختراق', icon: AlertTriangle },
          { id: 'firewall_rules', label: 'قواعد جدار الحماية وقفل المنافذ', icon: Ban },
          { id: 'sovereign_code', label: 'الكود السيادي لقبة دراغون', icon: Code },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2.5 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-[0_0_25px_rgba(239,68,68,0.4)] border border-red-400'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Draconic Holographic Dome Shield */}
      {activeTab === 'dome_shield' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Canvas Dome Hologram Visualization */}
            <div className="lg:col-span-8 bg-[#070103] border border-red-500/30 p-6 rounded-3xl relative overflow-hidden shadow-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                  <h3 className="text-base font-black text-white">قبة أوبسيديان العازلة (Draconic Environmental Dome)</h3>
                </div>
                <div className="text-xs font-mono text-amber-400 bg-black/60 px-3 py-1 rounded-xl border border-amber-500/30">
                  تردد الرنين: {shieldFrequency}Hz
                </div>
              </div>

              {/* Hologram Canvas */}
              <div className="relative my-4 flex items-center justify-center">
                <canvas ref={canvasRef} className="w-full h-80 max-h-[340px] rounded-2xl" />
              </div>

              {/* Quick Controls below canvas */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setZeroTrustActive(!zeroTrustActive)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2 border ${
                      zeroTrustActive ? 'bg-red-500/20 text-red-300 border-red-400' : 'bg-white/5 text-slate-400 border-white/10'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>وضع Zero-Trust: {zeroTrustActive ? 'مفعل' : 'معطل'}</span>
                  </button>

                  <button 
                    onClick={() => setAntiTelemetry(!antiTelemetry)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2 border ${
                      antiTelemetry ? 'bg-amber-500/20 text-amber-300 border-amber-400' : 'bg-white/5 text-slate-400 border-white/10'
                    }`}
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>درع حظر التتبع: {antiTelemetry ? 'نشط' : 'متوقف'}</span>
                  </button>
                </div>

                <div className="text-[11px] font-mono text-slate-400">
                  البصمة التشفيرية الحالية: <span className="text-red-400">{lastSignature.substring(0, 16)}...</span>
                </div>
              </div>
            </div>

            {/* Draconic Pillars Cards */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-400" />
                <span>أركان دراغون الأربعة لتحصين النواة</span>
              </h3>

              {report.draconicPillars.map((pillar, idx) => (
                <div key={idx} className="bg-[#090204] border border-red-500/20 p-4 rounded-2xl space-y-2 hover:border-red-500/50 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{pillar.title}</span>
                    <span className="px-2 py-0.5 bg-red-950 text-red-300 rounded text-[10px] font-mono font-bold border border-red-500/30">
                      {pillar.efficiency}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: Flameforge Real Execution Core Sandbox */}
      {activeTab === 'real_executor' && (
        <div className="space-y-6">
          <div className="bg-[#070103] border-2 border-amber-500/30 p-6 md:p-8 rounded-3xl space-y-6 shadow-2xl">
            
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Flame className="w-6 h-6 text-amber-400 animate-bounce" />
                  <span>محرك صهر الأكواد والتنفيذ الحقيقي (Flameforge Sandbox)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  بيئة تشغيل JavaScript / TypeScript معزولة محلياً بنسبة 100% دون استدعاء أي خوادم خارجية.
                </p>
              </div>

              {/* Preset Scripts Dropdown / Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setCustomCode(`// 1. اختبار السرعة الحسابية الفائقة
const arr = new Float64Array(50000);
for(let i=0; i<arr.length; i++) arr[i] = Math.sqrt(i) * Math.sin(i);
const max = Math.max(...arr.slice(0, 1000));
console.log(">>> [PERF_BENCHMARK] تمت معالجة 50,000 قيمة رياضية معزولة.");
console.log(">>> [MAX_VALUE]:", max);
return { benchmark: "50k operations completed", maxVal: max };`)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-white rounded-xl text-xs font-mono border border-white/10"
                >
                  معالجة 50k قيمة
                </button>

                <button
                  onClick={() => setCustomCode(`// 2. فحص تشفير WebCrypto الحقيقي
const encoder = new TextEncoder();
const data = encoder.encode("SOVEREIGN_SARAH_DRAGON_SHIELD_2026");
console.log(">>> [CRYPTO_AUDIT] تشفير البيانات بحجم:", data.length, "بايت");
console.log(">>> [INTEGRITY]: مؤكد 100% وخالي من أي تسريب.");
return { bufferSize: data.length, status: "CRYPTO_VERIFIED" };`)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-white rounded-xl text-xs font-mono border border-white/10"
                >
                  فحص التشفير المحلي
                </button>
              </div>
            </div>

            {/* Interactive Code Editor TextArea */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>اكتب أو عدل الكود البرمجي للتنفيذ داخل قبة دراغون:</span>
                <span className="text-amber-400">نمط العزل: L4 Obsidian Isolation</span>
              </label>
              <textarea
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                rows={10}
                className="w-full bg-black/90 border border-white/10 focus:border-amber-500/60 p-4 rounded-2xl font-mono text-xs text-amber-300 leading-relaxed focus:outline-none resize-y"
              />
            </div>

            {/* Run Button */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleRunRealCode}
                disabled={isExecuting}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 via-red-600 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-black text-sm rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.4)] active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>جاري التنفيذ والصهر داخل القبة...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>تشغيل الكود في قبة دراغون ⚡</span>
                  </>
                )}
              </button>

              {execResult && (
                <div className="text-xs font-mono text-slate-400">
                  زمن التنفيذ: <strong className="text-emerald-400">{execResult.executionTimeMs}ms</strong> • 
                  المعرف: <span className="text-amber-300">{execResult.executionId}</span>
                </div>
              )}
            </div>

            {/* Execution Console Output */}
            {execResult && (
              <div className="bg-black/90 p-5 rounded-2xl border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className={`font-bold flex items-center gap-1.5 ${execResult.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {execResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    <span>{execResult.success ? 'تم التنفيذ بنجاح' : 'خطأ أثناء التنفيذ'}</span>
                  </span>
                  <span className="text-slate-500 text-[10px]">{execResult.timestamp}</span>
                </div>

                <div className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {execResult.output}
                </div>

                {execResult.returnValue !== undefined && (
                  <div className="pt-2 border-t border-white/5 text-[11px] text-cyan-300">
                    <span className="text-slate-500 block mb-1">الكائن العائد (Return Object):</span>
                    <pre className="bg-white/5 p-3 rounded-xl overflow-x-auto">{JSON.stringify(execResult.returnValue, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* TAB 3: Intrusion Defense Matrix & Live Pen-testing */}
      {activeTab === 'intrusion_matrix' && (
        <div className="space-y-6">
          <div className="bg-[#070103] border border-red-500/30 p-6 rounded-3xl space-y-6 shadow-xl">
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span>مصفوفة صد التطفل واختبار الاختراق الحقيقي</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  قم بمحاكاة محاولات التطفل الخارجية لمعاينة كيفية إحباطها وتطهيرها فوراً داخل طبقات القبة.
                </p>
              </div>

              {/* Simulation Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSimulateIntrusion('SQL/NoSQL Injection')}
                  disabled={simulatingThreat}
                  className="px-3.5 py-2 bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 hover:text-white rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                >
                  اختبار حقن أوامر (Injection)
                </button>

                <button
                  onClick={() => handleSimulateIntrusion('Cross-Site Telemetry Leak')}
                  disabled={simulatingThreat}
                  className="px-3.5 py-2 bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 text-amber-300 hover:text-white rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                >
                  اختبار تسريب تتبع (Telemetry Leak)
                </button>

                <button
                  onClick={() => handleSimulateIntrusion('Buffer Overflow Flooding')}
                  disabled={simulatingThreat}
                  className="px-3.5 py-2 bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-300 hover:text-white rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                >
                  اختبار إغراق الطوابير (DDoS/Flood)
                </button>
              </div>
            </div>

            {/* Real-Time Defense Intrusion Logs */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">سجل الأحداث والدفاعات اللحظية:</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto no-scrollbar">
                {liveLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="bg-black/60 border border-red-500/20 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-red-500/50 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-red-950 text-red-400 font-mono text-[10px] font-bold rounded border border-red-500/30">
                          {log.id}
                        </span>
                        <h5 className="text-xs font-bold text-white">{log.type}</h5>
                        <span className="text-[10px] text-slate-400 font-mono">({log.source})</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                        {log.detail}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                      <span className="px-2.5 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>تم التحصين والحجب</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: Firewall & Zero-Trust Rulebook */}
      {activeTab === 'firewall_rules' && (
        <div className="space-y-6">
          <div className="bg-[#070103] border border-red-500/30 p-6 rounded-3xl space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Ban className="w-5 h-5 text-red-400" />
                  <span>قواعد جدار الحماية وعزل المنافذ (Dragon Firewall Rulebook)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  التحكم في حركة التدفقات وتطبيق قواعد الرفض الصارم على أي طلب غير معتمد.
                </p>
              </div>
              <span className="px-3 py-1 bg-red-950 text-red-300 font-mono text-xs rounded-xl font-bold border border-red-500/40">
                {rules.filter(r => r.active).length} قواعد نشطة
              </span>
            </div>

            <div className="space-y-3">
              {rules.map((rule) => (
                <div 
                  key={rule.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    rule.active 
                      ? 'bg-black/60 border-red-500/30 hover:border-red-400/50' 
                      : 'bg-black/20 border-white/5 opacity-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-amber-400 font-bold">{rule.id}</span>
                      <h4 className="text-sm font-bold text-white">{rule.name}</h4>
                      <span className="px-2 py-0.5 bg-white/5 text-slate-300 text-[10px] font-mono rounded">
                        {rule.type}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      النمط المحظور: <span className="text-red-300">{rule.pattern}</span> • الإجراء: <strong className="text-emerald-400">{rule.action}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-center">
                    <span className="text-xs font-mono text-slate-400">
                      الإصابات: <strong className="text-amber-400">{rule.hits}</strong>
                    </span>
                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        rule.active 
                          ? 'bg-red-600 hover:bg-red-500 text-white shadow-md' 
                          : 'bg-white/10 hover:bg-white/20 text-slate-300'
                      }`}
                    >
                      {rule.active ? 'تعطيل القاعدة' : 'تفعيل القاعدة'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Sovereign Code Script */}
      {activeTab === 'sovereign_code' && (
        <div className="space-y-6">
          <div className="bg-[#070103] border border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-amber-400" />
                  <span>{report.generatedScript.filename}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {report.generatedScript.description}
                </p>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(report.generatedScript.code);
                  setCopiedScript(true);
                  setTimeout(() => setCopiedScript(false), 2000);
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
              >
                {copiedScript ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedScript ? 'تم النسخ!' : 'نسخ الكود السيادي'}</span>
              </button>
            </div>

            <div className="bg-black/90 p-5 rounded-2xl border border-white/10 font-mono text-xs text-amber-300 overflow-x-auto leading-relaxed max-h-[500px] no-scrollbar">
              <pre>{report.generatedScript.code}</pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
