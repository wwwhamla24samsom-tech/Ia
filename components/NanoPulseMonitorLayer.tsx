import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CpuTelemetryData } from '../services/cpuTelemetry';
import { 
  Activity, Cpu, Flame, Zap, Gauge, Sliders, Shield, AlertTriangle, 
  CheckCircle2, RefreshCw, BarChart2, Radio, Sparkles, ChevronDown 
} from 'lucide-react';
import { AppTab } from '../types';

interface NanoPulseMonitorLayerProps {
  telemetry: CpuTelemetryData;
  onNavigate: (tab: AppTab) => void;
  onTriggerStress?: (active: boolean) => void;
  onTriggerCalibration?: (active: boolean) => void;
}

export const NanoPulseMonitorLayer: React.FC<NanoPulseMonitorLayerProps> = ({
  telemetry,
  onNavigate,
  onTriggerStress,
  onTriggerCalibration
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const isCritical = telemetry.avgUsage > 80 || telemetry.peakUsage > 88 || telemetry.stressActive;
  const isHighLoad = !isCritical && (telemetry.avgUsage > 60 || telemetry.peakUsage > 72);
  const isOptimal = !isCritical && !isHighLoad;

  // Dynamic color palette mapping
  const primaryColor = isCritical 
    ? '#f43f5e' 
    : isHighLoad 
    ? '#f59e0b' 
    : telemetry.avgUsage > 35 
    ? '#06b6d4' 
    : '#10b981';

  const glowShadow = isCritical
    ? 'rgba(244, 63, 94, 0.6)'
    : isHighLoad
    ? 'rgba(245, 158, 11, 0.5)'
    : telemetry.avgUsage > 35
    ? 'rgba(6, 182, 212, 0.45)'
    : 'rgba(16, 185, 129, 0.4)';

  // Waveform amplitude calculated from CPU telemetry
  const waveAmplitude = Math.min(14, Math.max(3, (telemetry.avgUsage / 100) * 14));

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. AMBIENT LIVING LIGHT FIELD (FULL-HEADER NANO-PULSE REACTIVE GLOW)    */}
      {/* ========================================================================= */}
      <motion.div
        className="absolute inset-0 pointer-events-none -z-10 rounded-b-2xl overflow-hidden"
        animate={{
          opacity: [
            telemetry.pulseIntensity * 0.35,
            telemetry.pulseIntensity * 0.85,
            telemetry.pulseIntensity * 0.35
          ],
          scaleY: [1, 1.05, 1]
        }}
        transition={{
          duration: telemetry.pulseSpeed,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <div
          className="w-full h-full"
          style={{
            background: `radial-gradient(ellipse 80% 90% at 50% 0%, ${telemetry.glowColor} 0%, rgba(2, 2, 10, 0) 80%)`
          }}
        />
      </motion.div>

      {/* Dynamic Top Edge Scanner Light Beam */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
        animate={{
          opacity: [0.5, 1, 0.5],
          boxShadow: [
            `0 0 6px ${primaryColor}`,
            `0 0 18px ${primaryColor}`,
            `0 0 6px ${primaryColor}`
          ]
        }}
        transition={{
          duration: telemetry.pulseSpeed,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${primaryColor} 50%, transparent 100%)`
        }}
      />

      {/* Dynamic Bottom Edge Border Ray */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1.5px] pointer-events-none"
        animate={{
          opacity: [0.3, 0.85, 0.3],
          boxShadow: [
            `0 0 4px ${primaryColor}`,
            `0 0 14px ${primaryColor}`,
            `0 0 4px ${primaryColor}`
          ]
        }}
        transition={{
          duration: telemetry.pulseSpeed,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          background: `linear-gradient(90deg, transparent 10%, ${primaryColor} 50%, transparent 90%)`
        }}
      />

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE NANO-PULSE TELEMETRY CAPSULE IN TOP BAR                    */}
      {/* ========================================================================= */}
      <div className="relative inline-flex items-center">
        <motion.button
          id="nano-pulse-telemetry-badge"
          onClick={() => setIsPopoverOpen(prev => !prev)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all text-xs font-mono group relative overflow-hidden backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(5, 10, 25, 0.75)',
            borderColor: primaryColor,
            boxShadow: `0 0 12px ${glowShadow}`
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          title="طبقة مراقبة Nano-Pulse اللحظية • انقر لعرض تفاصيل استهلاك الموارد"
        >
          {/* Subtle Background Photon Wave */}
          <motion.div
            className="absolute inset-0 -z-10 opacity-20 pointer-events-none"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: Math.max(1.2, telemetry.pulseSpeed * 2),
              repeat: Infinity,
              ease: 'linear'
            }}
            style={{
              background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`
            }}
          />

          {/* Living Quantum Node with Concentric Expanding Rings */}
          <div className="relative flex items-center justify-center w-4 h-4 flex-shrink-0">
            <motion.span
              className="absolute w-4 h-4 rounded-full"
              style={{ backgroundColor: primaryColor }}
              animate={{
                scale: [1, 2.2, 1],
                opacity: [0.6, 0.05, 0.6]
              }}
              transition={{
                duration: telemetry.pulseSpeed,
                repeat: Infinity,
                ease: 'easeOut'
              }}
            />
            <motion.span
              className="absolute w-3 h-3 rounded-full"
              style={{ backgroundColor: primaryColor }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.8, 0.2, 0.8]
              }}
              transition={{
                duration: telemetry.pulseSpeed,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            <span
              className="w-2 h-2 rounded-full z-10"
              style={{ backgroundColor: primaryColor, boxShadow: `0 0 6px ${primaryColor}` }}
            />
          </div>

          {/* Label + Mode */}
          <div className="flex items-center gap-1.5">
            <span className="font-black text-white tracking-wide text-[11px] flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              <span className="hidden sm:inline">Nano-Pulse:</span>
            </span>
          </div>

          {/* Dynamic Sine/Photon Oscilloscope Mini Wave */}
          <div className="w-12 h-4 hidden sm:flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 48 16" className="w-full h-full overflow-visible">
              <motion.path
                d={`M 0 8 Q 12 ${8 - waveAmplitude}, 24 8 T 48 8`}
                fill="none"
                stroke={primaryColor}
                strokeWidth="1.8"
                strokeLinecap="round"
                animate={{
                  d: [
                    `M 0 8 Q 12 ${8 - waveAmplitude}, 24 8 T 48 8`,
                    `M 0 8 Q 12 ${8 + waveAmplitude}, 24 8 T 48 8`,
                    `M 0 8 Q 12 ${8 - waveAmplitude}, 24 8 T 48 8`
                  ]
                }}
                transition={{
                  duration: telemetry.pulseSpeed,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </svg>
          </div>

          {/* 8-Thread Mini Equalizer Bars */}
          <div className="flex items-end gap-[2px] h-4 px-1 py-0.5 bg-black/40 rounded-md border border-white/5">
            {telemetry.threads.map((t) => {
              const heightPercent = Math.max(15, t.usage);
              const barColor =
                t.status === 'critical' ? '#f43f5e' : t.status === 'high' ? '#f59e0b' : '#10b981';
              return (
                <motion.div
                  key={t.id}
                  className="w-[3px] rounded-sm"
                  style={{
                    backgroundColor: barColor,
                    boxShadow: t.status === 'critical' ? '0 0 4px #f43f5e' : 'none'
                  }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                />
              );
            })}
          </div>

          {/* Percentage & Frequency */}
          <div className="flex items-center gap-1">
            <span
              className="font-black text-xs"
              style={{ color: primaryColor }}
            >
              {telemetry.avgUsage}%
            </span>
            <span className="text-[9px] text-slate-400 hidden md:inline">
              ({telemetry.frequencyGhz}GHz)
            </span>
          </div>

          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isPopoverOpen ? 'rotate-180 text-white' : ''
            }`}
          />
        </motion.button>

        {/* ========================================================================= */}
        {/* 3. EXPANDABLE TELEMETRY HUD POPOVER (FRAMER MOTION)                      */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {isPopoverOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute top-full right-0 sm:right-auto sm:left-0 mt-3 w-80 sm:w-96 p-4 rounded-3xl bg-[#060a17]/95 border shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-[150] space-y-4 font-arabic text-right"
              style={{
                borderColor: primaryColor,
                boxShadow: `0 10px 40px ${glowShadow}`
              }}
            >
              {/* Header Title & Status */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <div 
                    className="p-2 rounded-xl"
                    style={{ backgroundColor: `${primaryColor}20`, border: `1px solid ${primaryColor}40` }}
                  >
                    <Activity className="w-4 h-4" style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                      <span>طبقة مراقبة النانو (Nano-Pulse HUD)</span>
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      مزامنة حية مع مفاعل التشخيصات D3
                    </span>
                  </div>
                </div>

                <div 
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border"
                  style={{
                    backgroundColor: `${primaryColor}15`,
                    borderColor: primaryColor,
                    color: primaryColor
                  }}
                >
                  {isCritical ? 'حمل حرج (Critical)' : isHighLoad ? 'نشاط مرتفع (Active)' : 'استقرار مثالي (Nominal)'}
                </div>
              </div>

              {/* Real-time Metrics Grid */}
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-black/50 p-2.5 rounded-2xl border border-white/5 text-center">
                  <div className="text-[9px] text-slate-400 font-mono">متوسط الحمل</div>
                  <div className="text-sm font-black mt-0.5" style={{ color: primaryColor }}>
                    {telemetry.avgUsage}%
                  </div>
                </div>
                <div className="bg-black/50 p-2.5 rounded-2xl border border-white/5 text-center">
                  <div className="text-[9px] text-slate-400 font-mono">ذروة النواة</div>
                  <div className="text-sm font-black text-rose-400 mt-0.5">
                    {telemetry.peakUsage}%
                  </div>
                </div>
                <div className="bg-black/50 p-2.5 rounded-2xl border border-white/5 text-center">
                  <div className="text-[9px] text-slate-400 font-mono">التردد</div>
                  <div className="text-sm font-black text-cyan-300 mt-0.5">
                    {telemetry.frequencyGhz}G
                  </div>
                </div>
                <div className="bg-black/50 p-2.5 rounded-2xl border border-white/5 text-center">
                  <div className="text-[9px] text-slate-400 font-mono">الحرارة</div>
                  <div className={`text-sm font-black mt-0.5 ${telemetry.temperature > 70 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {telemetry.temperature}°C
                  </div>
                </div>
              </div>

              {/* 8-Thread Grid with Live Pulse Meters */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono">
                  <span className="flex items-center gap-1 font-bold">
                    <Cpu className="w-3 h-3 text-cyan-400" />
                    <span>حالة الخيوط النانوية (8 Quantum Cores):</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    سرعة النبض: {telemetry.pulseSpeed}s
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {telemetry.threads.map(t => {
                    const statusColor = t.status === 'critical' ? 'text-rose-400' : t.status === 'high' ? 'text-amber-400' : 'text-emerald-400';
                    return (
                      <div 
                        key={t.id}
                        className="bg-black/40 p-2 rounded-xl border border-white/5 flex flex-col justify-between space-y-1"
                      >
                        <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                          <span>T{t.id}</span>
                          <span className={statusColor}>{t.tempC}°</span>
                        </div>
                        <div className={`text-xs font-black font-mono ${statusColor}`}>
                          {t.usage}%
                        </div>
                        {/* Thread Mini Bar */}
                        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              backgroundColor: t.status === 'critical' ? '#f43f5e' : t.status === 'high' ? '#f59e0b' : '#10b981'
                            }}
                            animate={{ width: `${t.usage}%` }}
                            transition={{ duration: 0.2 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Telemetry Actions */}
              <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsPopoverOpen(false);
                    onNavigate(AppTab.SYSTEM_DIAGNOSTICS);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>فتح شاشة تشخيصات D3 الكاملة</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
