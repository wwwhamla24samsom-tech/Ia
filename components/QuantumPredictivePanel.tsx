import React, { useState, useEffect } from 'react';
import { 
  QuantumPredictiveReport, 
  QuantumPredictedBug, 
  runLocalPredictiveAnalysis, 
  runDeepPredictiveAnalysis 
} from '../services/quantumPredictiveAnalytics';
import { 
  Brain, ShieldAlert, Sparkles, Zap, CheckCircle2, AlertTriangle, 
  RefreshCw, Check, Code2, Wrench, Bug, Cpu, Sliders, ChevronDown, ChevronUp, Eye
} from 'lucide-react';

interface QuantumPredictivePanelProps {
  code: string;
  language: 'python' | 'typescript' | 'javascript' | 'generic';
  onApplyFix: (newCode: string, bugId?: string) => void;
  onApplyFullRefactor?: (fullCode: string) => void;
  isCompact?: boolean;
}

export const QuantumPredictivePanel: React.FC<QuantumPredictivePanelProps> = ({
  code,
  language,
  onApplyFix,
  onApplyFullRefactor,
  isCompact = false
}) => {
  const [report, setReport] = useState<QuantumPredictiveReport>(() => runLocalPredictiveAnalysis(code, language));
  const [isDeepScanning, setIsDeepScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'predictions' | 'insights' | 'refactor'>('predictions');
  const [appliedFixes, setAppliedFixes] = useState<Record<string, boolean>>({});
  const [expandedBugId, setExpandedBugId] = useState<string | null>(null);
  const [autoScanEnabled, setAutoScanEnabled] = useState(true);

  // Real-time continuous predictive scan with debounce
  useEffect(() => {
    if (!autoScanEnabled) return;

    const timer = setTimeout(() => {
      const quickReport = runLocalPredictiveAnalysis(code, language);
      setReport(prev => ({
        ...quickReport,
        // preserve AI results if recent
        predictedBugs: [
          ...quickReport.predictedBugs,
          ...prev.predictedBugs.filter(b => b.id.startsWith('AI-') && !quickReport.predictedBugs.some(qb => qb.title === b.title))
        ]
      }));
    }, 280);

    return () => clearTimeout(timer);
  }, [code, language, autoScanEnabled]);

  const handleRunDeepScan = async () => {
    setIsDeepScanning(true);
    try {
      const deepReport = await runDeepPredictiveAnalysis(code, language);
      setReport(deepReport);
    } catch (err) {
      console.warn('Deep predictive scan error:', err);
    } finally {
      setIsDeepScanning(false);
    }
  };

  const handleFixSingleBug = (bug: QuantumPredictedBug) => {
    if (bug.targetOriginalCode && bug.autoFixCodeSnippet) {
      if (code.includes(bug.targetOriginalCode)) {
        const updated = code.replace(bug.targetOriginalCode, bug.autoFixCodeSnippet);
        onApplyFix(updated, bug.id);
        setAppliedFixes(prev => ({ ...prev, [bug.id]: true }));
        return;
      }
    }

    if (bug.autoFixCodeSnippet) {
      // If no exact match, append or replace line if lineNumber exists
      if (bug.lineNumber) {
        const lines = code.split('\n');
        if (lines[bug.lineNumber - 1] !== undefined) {
          lines[bug.lineNumber - 1] = bug.autoFixCodeSnippet;
          const updated = lines.join('\n');
          onApplyFix(updated, bug.id);
          setAppliedFixes(prev => ({ ...prev, [bug.id]: true }));
          return;
        }
      }
    }

    // Fallback: if we have suggestedOptimizedFullCode, apply that
    if (report.suggestedOptimizedFullCode) {
      onApplyFix(report.suggestedOptimizedFullCode, bug.id);
      setAppliedFixes(prev => ({ ...prev, [bug.id]: true }));
    }
  };

  const getSeverityBadge = (severity: QuantumPredictedBug['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          label: 'حرج جداً (Critical Crash Hazard)',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
        };
      case 'high':
        return {
          bg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          label: 'مرتفع (High Vulnerability)',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
        };
      case 'medium':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          label: 'متوسط (Logic Anomaly)',
          icon: <Bug className="w-3.5 h-3.5 text-amber-400" />
        };
      default:
        return {
          bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          label: 'تحسين (Proactive Tip)',
          icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        };
    }
  };

  return (
    <div className={`flex flex-col bg-[#050814] border border-cyan-500/30 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.15)] font-arabic ${isCompact ? 'p-3' : 'p-5'} text-white space-y-4`}>
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-inner">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white tracking-wide flex items-center gap-1.5">
                <span>التحليلات التنبؤية الكوانتومية</span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  Quantum Predictive Engine
                </span>
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">
              رصد الأنماط والتنبؤ بالأخطاء البرمجية قبل حدوثها واقتراح الشيفرات الصحيحة
            </p>
          </div>
        </div>

        {/* Action Controls & AI Deep Scan Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoScanEnabled(!autoScanEnabled)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all flex items-center gap-1 ${
              autoScanEnabled 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
            title="المسح التنبؤي اللحظي المستمر"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${autoScanEnabled ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`}></span>
            <span>{autoScanEnabled ? 'المسح اللحظي: نشط' : 'المسح متوقف'}</span>
          </button>

          <button
            onClick={handleRunDeepScan}
            disabled={isDeepScanning}
            className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black text-xs font-black rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDeepScanning ? 'animate-spin' : ''}`} />
            <span>{isDeepScanning ? 'جارِ الفحص العميق...' : 'فحص كوانتومي عميق ⚡'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Dashboard (Coherence & Risk Gauges) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-black/60 p-3 rounded-xl border border-cyan-500/20 text-center relative overflow-hidden">
          <div className="text-[10px] text-slate-400 font-mono">معامل الاتساق الكوانتومي</div>
          <div className="text-base font-black text-cyan-400 font-mono mt-0.5">
            {report.quantumCoherenceScore}%
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-500" 
              style={{ width: `${report.quantumCoherenceScore}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-black/60 p-3 rounded-xl border border-rose-500/20 text-center relative overflow-hidden">
          <div className="text-[10px] text-slate-400 font-mono">مؤشر خطر الشذوذ (Anomaly Risk)</div>
          <div className="text-base font-black text-rose-400 font-mono mt-0.5">
            {report.anomalyRiskIndex}%
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-rose-500 h-full transition-all duration-500" 
              style={{ width: `${Math.min(100, report.anomalyRiskIndex * 2)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-black/60 p-3 rounded-xl border border-white/5 text-center">
          <div className="text-[10px] text-slate-400 font-mono">الأخطاء المتنبأ بها</div>
          <div className={`text-base font-black font-mono mt-0.5 ${report.predictedBugs.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {report.predictedBugs.length} أنماط مرصودة
          </div>
        </div>

        <div className="bg-black/60 p-3 rounded-xl border border-white/5 text-center">
          <div className="text-[10px] text-slate-400 font-mono">سلامة إدارة الذاكرة</div>
          <div className="text-xs font-black text-emerald-400 font-mono mt-1 flex items-center justify-center gap-1">
            <Cpu className="w-3 h-3" />
            <span>{report.patternInsights.memorySafety === 'optimal' ? 'مثالية (Safe 528Hz)' : 'تحتاج ضبط'}</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-white/10 gap-2 text-xs">
        <button
          onClick={() => setActiveTab('predictions')}
          className={`pb-2 px-3 font-black transition-all flex items-center gap-1.5 border-b-2 ${
            activeTab === 'predictions'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Bug className="w-3.5 h-3.5" />
          <span>الأخطاء المتنبأ بها ({report.predictedBugs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('insights')}
          className={`pb-2 px-3 font-black transition-all flex items-center gap-1.5 border-b-2 ${
            activeTab === 'insights'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>تحليل الأنماط والتعقيد</span>
        </button>

        {report.suggestedOptimizedFullCode && (
          <button
            onClick={() => setActiveTab('refactor')}
            className={`pb-2 px-3 font-black transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === 'refactor'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>الشيفرة الكاملة المحسنة 🚀</span>
          </button>
        )}
      </div>

      {/* Tab 1: Predicted Bugs List */}
      {activeTab === 'predictions' && (
        <div className="space-y-3">
          {report.predictedBugs.length === 0 ? (
            <div className="bg-emerald-950/20 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 mx-auto flex items-center justify-center text-emerald-400 shadow-lg">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-emerald-300">الشيفرة نقية 100% ولا توجد أخطاء متنبأ بها حالياً</h4>
              <p className="text-xs text-emerald-400/80 max-w-md mx-auto">
                الأنماط البرمجية الحالية متسقة مع معايير الأمان الكوانتومي والكفاءة العالية وخالية من تسريب الذاكرة أو الحلقات اللانهائية.
              </p>
            </div>
          ) : (
            report.predictedBugs.map((bug) => {
              const badge = getSeverityBadge(bug.severity);
              const isFixed = appliedFixes[bug.id];
              const isExpanded = expandedBugId === bug.id;

              return (
                <div 
                  key={bug.id} 
                  className={`bg-[#080d1e] border transition-all rounded-xl p-4 space-y-3 ${
                    isFixed 
                      ? 'border-emerald-500/40 bg-emerald-950/10' 
                      : bug.severity === 'critical' 
                      ? 'border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.1)]' 
                      : 'border-white/10 hover:border-cyan-500/30'
                  }`}
                >
                  {/* Top Bug Header */}
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border flex items-center gap-1 ${badge.bg}`}>
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>
                      {bug.lineNumber && (
                        <span className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded font-mono">
                          السطر #{bug.lineNumber}
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-500/20">
                        احتمالية الحدوث: {Math.round(bug.probability * 100)}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedBugId(isExpanded ? null : bug.id)}
                        className="text-slate-400 hover:text-white text-[11px] flex items-center gap-0.5 transition-colors"
                      >
                        <span>{isExpanded ? 'إخفاء التفاصيل' : 'تفاصيل'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      <button
                        onClick={() => handleFixSingleBug(bug)}
                        disabled={isFixed}
                        className={`px-3 py-1 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 shadow-md active:scale-95 ${
                          isFixed 
                            ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 cursor-default' 
                            : 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        }`}
                      >
                        {isFixed ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>تم تطبيق الإصلاح ✓</span>
                          </>
                        ) : (
                          <>
                            <Wrench className="w-3.5 h-3.5" />
                            <span>تطبيق الإصلاح التلقائي ⚡</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Bug Title and Root Cause */}
                  <div>
                    <h4 className="text-xs font-black text-white">{bug.title}</h4>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      <strong className="text-amber-300">التشخيص الاستباقي: </strong> 
                      {bug.rootCause}
                    </p>
                  </div>

                  {/* Target Snippet & Suggested Replacement */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono">
                    {bug.snippet && (
                      <div className="bg-black/60 p-2.5 rounded-lg border border-rose-500/20 text-rose-200 dir-ltr text-left overflow-x-auto">
                        <span className="text-[9px] text-rose-400 block font-bold mb-1 font-arabic text-right dir-rtl">
                          ⚠️ الشيفرة التي تنطوي على خطأ محتمل:
                        </span>
                        <code>{bug.snippet}</code>
                      </div>
                    )}

                    {bug.autoFixCodeSnippet && (
                      <div className="bg-black/60 p-2.5 rounded-lg border border-emerald-500/20 text-emerald-200 dir-ltr text-left overflow-x-auto">
                        <span className="text-[9px] text-emerald-400 block font-bold mb-1 font-arabic text-right dir-rtl">
                          ✓ الشيفرة الصحيحة المقترحة:
                        </span>
                        <code>{bug.autoFixCodeSnippet}</code>
                      </div>
                    )}
                  </div>

                  {/* Expanded In-depth Diagnostic */}
                  {isExpanded && (
                    <div className="bg-black/40 p-3 rounded-lg border border-white/5 space-y-2 text-[11px] animate-fadeIn">
                      <div>
                        <strong className="text-cyan-300 block mb-0.5">الشرح المعماري الكوانتومي:</strong>
                        <p className="text-slate-300">{bug.explanation}</p>
                      </div>
                      <div>
                        <strong className="text-rose-300 block mb-0.5">الآثار المترتبة في حال عدم الإصلاح:</strong>
                        <p className="text-slate-300">{bug.impactIfUnfixed}</p>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        النمط البرمجي المطابق: {bug.patternMatched}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Pattern Insights & Tips */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-black/60 p-3 rounded-xl border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 block">درجة التعقيد السيكلوماتيكي</span>
              <span className="text-sm font-black text-cyan-400 font-mono mt-1 block">
                {report.patternInsights.complexityScore} / 10
              </span>
            </div>
            <div className="bg-black/60 p-3 rounded-xl border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 block">صحة العمليات اللاتزامنية</span>
              <span className="text-sm font-black text-emerald-400 font-mono mt-1 block">
                {report.patternInsights.asyncHealth.toUpperCase()}
              </span>
            </div>
            <div className="bg-black/60 p-3 rounded-xl border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 block">أمان التزامن والخيوط</span>
              <span className="text-sm font-black text-cyan-300 font-mono mt-1 block">
                {report.patternInsights.concurrencySafety.toUpperCase()}
              </span>
            </div>
            <div className="bg-black/60 p-3 rounded-xl border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 block">تصنيف الجودة السيادي</span>
              <span className="text-sm font-black text-amber-300 font-mono mt-1 block">
                {report.patternInsights.cleanlinessRating}
              </span>
            </div>
          </div>

          {/* Proactive Tips */}
          <div className="bg-[#080d1e] p-4 rounded-xl border border-cyan-500/20 space-y-2">
            <h4 className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>نصائح وتوصيات استباقية للشيفرة:</span>
            </h4>
            <div className="space-y-1.5">
              {report.proactiveTips.map((tip, idx) => (
                <div key={idx} className="bg-black/50 p-2.5 rounded-lg border border-white/5 text-[11px] text-slate-300 leading-relaxed flex items-start gap-2">
                  <span className="text-cyan-400 font-mono mt-0.5">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Full Refactored Code Injection */}
      {activeTab === 'refactor' && report.suggestedOptimizedFullCode && (
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/10">
            <div>
              <h4 className="text-xs font-black text-emerald-300">الشيفرة الكاملة المصححة والمحسنة كوانتومياً</h4>
              <p className="text-[10px] text-slate-400">تم تنقيح جميع الأنماط وإعادة الهيكلة مع الحفاظ على المنطق الوظيفي الكامل.</p>
            </div>
            <button
              onClick={() => {
                if (onApplyFullRefactor && report.suggestedOptimizedFullCode) {
                  onApplyFullRefactor(report.suggestedOptimizedFullCode);
                } else if (report.suggestedOptimizedFullCode) {
                  onApplyFix(report.suggestedOptimizedFullCode);
                }
              }}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>حقن الشيفرة المحسنة في المحرر فوراً 🚀</span>
            </button>
          </div>

          <pre className="bg-black/90 p-4 rounded-xl border border-emerald-500/20 text-emerald-300 text-xs font-mono max-h-72 overflow-auto dir-ltr text-left leading-relaxed">
            <code>{report.suggestedOptimizedFullCode}</code>
          </pre>
        </div>
      )}

    </div>
  );
};
