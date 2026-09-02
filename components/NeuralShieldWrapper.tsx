import React, { useState, useEffect } from 'react';
import { neuralKernelSecurity, KernelShieldTelemetry } from '../services/neuralKernelSecurity';
import { Shield, Lock, AlertOctagon, CheckCircle2, RefreshCw, Zap, Bug, EyeOff } from 'lucide-react';

interface NeuralShieldWrapperProps {
  children: React.ReactNode;
  systemName?: string;
}

export const NeuralShieldWrapper: React.FC<NeuralShieldWrapperProps> = ({ 
  children,
  systemName = 'SARAH_KERNEL_SYSTEM' 
}) => {
  const [telemetry, setTelemetry] = useState<KernelShieldTelemetry>(neuralKernelSecurity.getTelemetry());
  const [active, setActive] = useState<boolean>(true);
  const [showInterceptToast, setShowInterceptToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTel = neuralKernelSecurity.getTelemetry();
      setTelemetry(currentTel);
      setActive(currentTel.active);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => {
    const nextState = neuralKernelSecurity.toggleActive();
    setActive(nextState);
    setTelemetry(neuralKernelSecurity.getTelemetry());
  };

  const handleTestInjectionInterceptor = () => {
    const attackPayload = "<script>stealData('//intruder.vector')</script> DROP TABLE memory_nodes; --";
    const result = neuralKernelSecurity.sanitizeAndWrap(attackPayload, 'UserSimulationProbe');
    
    setTelemetry(neuralKernelSecurity.getTelemetry());
    if (result.threatDetected) {
      setToastMessage(result.threatMessage || 'تم اعتراض وتطهير هجوم حقن غير مصرح به على مستوى النواة!');
      setShowInterceptToast(true);
      setTimeout(() => setShowInterceptToast(false), 5000);
    }
  };

  return (
    <div className="relative w-full min-h-full">
      {/* Active Neural Shield Perimeter Top Bar */}
      <div className={`transition-all duration-500 border-b px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono select-none ${
        active 
          ? 'bg-gradient-to-r from-blue-950/90 via-[#030712]/95 to-slate-950/90 border-blue-500/30 text-blue-300 shadow-[0_4px_25px_rgba(59,130,246,0.15)]' 
          : 'bg-gradient-to-r from-red-950/90 via-black to-red-950/90 border-red-500/40 text-red-300 shadow-[0_4px_25px_rgba(239,68,68,0.2)]'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg border flex items-center justify-center ${
            active ? 'bg-blue-500/20 border-blue-400 text-blue-400 animate-pulse' : 'bg-red-500/20 border-red-500 text-red-400'
          }`}>
            <Shield className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wide">
              {active ? 'NeuralShield: تغليف نشط وتأمين النواة 100%' : 'NeuralShield: الحماية متوقفة جزئياً'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
              {telemetry.encryptionMode}
            </span>
          </div>
        </div>

        {/* Right Stats & Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-slate-400">
            <span>العمليات المطهرة: <strong className="text-emerald-400">{telemetry.sanitizedTransactionsCount.toLocaleString()}</strong></span>
            <span>الحقن المحظورة: <strong className="text-amber-400">{telemetry.blockedInjectionsCount}</strong></span>
            <span>تكامل النواة: <strong className="text-cyan-400">{telemetry.kernelIntegrityScore}%</strong></span>
          </div>

          <button
            onClick={handleTestInjectionInterceptor}
            className="px-3 py-1 bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-white/10 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5"
            title="فحص اعتراض الحقن"
          >
            <Bug className="w-3 h-3" />
            <span>اختبار صد الحقن</span>
          </button>

          <button
            onClick={handleToggle}
            className={`px-3 py-1 rounded-lg text-[10px] font-black border transition-all flex items-center gap-1.5 ${
              active 
                ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400 shadow-md' 
                : 'bg-red-600 hover:bg-red-500 text-white border-red-400'
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>{active ? 'الحماية مشددة' : 'إعادة تفعيل'}</span>
          </button>
        </div>
      </div>

      {/* Intercept Toast Alert */}
      {showInterceptToast && (
        <div className="fixed top-16 right-6 z-[9999] max-w-md bg-black/95 border-2 border-red-500 p-4 rounded-2xl shadow-[0_0_40px_rgba(239,68,68,0.6)] text-white font-arabic animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-600/30 rounded-xl text-red-400">
              <AlertOctagon className="w-6 h-6 animate-bounce" />
            </div>
            <div className="space-y-1 text-right">
              <h4 className="text-sm font-black text-red-400">اعتراض أمني على مستوى النواة!</h4>
              <p className="text-xs text-slate-200 leading-relaxed">{toastMessage}</p>
              <span className="text-[10px] font-mono text-emerald-400 block pt-1">
                ✓ تم تطهير البيانات وعزل المتغيرات الخبيثة فوراً.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Render Wrapped App Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
};
