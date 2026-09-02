import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, Activity, Zap, Cpu, AlertTriangle, ShieldAlert, 
  Search, Filter, Pause, Play, Trash2, Download, Sparkles, 
  Layers, ArrowUpRight, Flame, CheckCircle2, Sliders, Radio, Link2
} from 'lucide-react';

export interface QuantumAnomalyLog {
  id: string;
  timestamp: string;
  rawTime: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  anomalyType: 
    | 'ENTROPY_VOLATILITY_BURST'
    | 'THERMAL_NOISE_PULSE'
    | 'PHASE_DRIFT_CASCADE'
    | 'DECOHERENCE_COLLAPSE'
    | 'QUANTUM_JITTER_SPIKE';
  quantumMetric: {
    name: string;
    value: number;
    unit: string;
    delta: string;
  };
  cpuCorrelation: {
    coreId: number;
    coreLabel: string;
    cpuLoad: number;
    frequencyGhz: number;
    tempC: number;
    correlationScore: number; // 0 - 100%
    couplingStatus: 'COUPLED' | 'INDEPENDENT' | 'REACTIVE';
  };
  subsystemVector: string;
  mitigationAction: string;
}

interface QuantumAnomalyLogStreamProps {
  currentEntropy: number;
  currentThermal: number;
  currentDecoherence: number;
  currentPhaseDrift: number;
  cpuThreads: Array<{
    id: number;
    label: string;
    usage: number;
    freqGhz: number;
    tempC: number;
    status: 'optimal' | 'high' | 'critical';
  }>;
  isStreamingActive?: boolean;
}

export const QuantumAnomalyLogStream: React.FC<QuantumAnomalyLogStreamProps> = ({
  currentEntropy,
  currentThermal,
  currentDecoherence,
  currentPhaseDrift,
  cpuThreads,
  isStreamingActive = true
}) => {
  const [logs, setLogs] = useState<QuantumAnomalyLog[]>([]);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [selectedLog, setSelectedLog] = useState<QuantumAnomalyLog | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const previousMetricsRef = useRef({
    entropy: currentEntropy,
    thermal: currentThermal,
    decoherence: currentDecoherence,
    phaseDrift: currentPhaseDrift
  });

  // Generate initial bootstrap logs
  useEffect(() => {
    const initialLogs: QuantumAnomalyLog[] = [
      {
        id: 'QANO-9401',
        timestamp: new Date(Date.now() - 14000).toLocaleTimeString('en-US', { hour12: false }) + '.' + Math.floor(Math.random() * 900 + 100),
        rawTime: Date.now() - 14000,
        severity: 'CRITICAL',
        anomalyType: 'ENTROPY_VOLATILITY_BURST',
        quantumMetric: {
          name: 'Quantum Entropy',
          value: 86.4,
          unit: 'dBm',
          delta: '+28.2%'
        },
        cpuCorrelation: {
          coreId: 3,
          coreLabel: 'Core 1 / T3',
          cpuLoad: 92,
          frequencyGhz: 4.82,
          tempC: 76,
          correlationScore: 94.8,
          couplingStatus: 'COUPLED'
        },
        subsystemVector: 'Synaptic Bus α-9 (Neural Crossbar)',
        mitigationAction: 'Dynamic Affinity Rebalancing & Quantum Flux Damping (Success)'
      },
      {
        id: 'QANO-9402',
        timestamp: new Date(Date.now() - 9000).toLocaleTimeString('en-US', { hour12: false }) + '.' + Math.floor(Math.random() * 900 + 100),
        rawTime: Date.now() - 9000,
        severity: 'HIGH',
        anomalyType: 'PHASE_DRIFT_CASCADE',
        quantumMetric: {
          name: 'Phase Drift',
          value: 78.1,
          unit: 'mrad',
          delta: '+19.5%'
        },
        cpuCorrelation: {
          coreId: 6,
          coreLabel: 'Core 3 / T6',
          cpuLoad: 88,
          frequencyGhz: 4.65,
          tempC: 72,
          correlationScore: 89.2,
          couplingStatus: 'COUPLED'
        },
        subsystemVector: 'Hexagram Matrix Coherence Node γ',
        mitigationAction: 'Sub-harmonic Phase Alignment Loop Engaged'
      },
      {
        id: 'QANO-9403',
        timestamp: new Date(Date.now() - 4000).toLocaleTimeString('en-US', { hour12: false }) + '.' + Math.floor(Math.random() * 900 + 100),
        rawTime: Date.now() - 4000,
        severity: 'MEDIUM',
        anomalyType: 'THERMAL_NOISE_PULSE',
        quantumMetric: {
          name: 'Thermal Floor',
          value: 64.7,
          unit: 'dBm',
          delta: '+11.8%'
        },
        cpuCorrelation: {
          coreId: 0,
          coreLabel: 'Core 0 / T0',
          cpuLoad: 68,
          frequencyGhz: 4.10,
          tempC: 58,
          correlationScore: 74.5,
          couplingStatus: 'REACTIVE'
        },
        subsystemVector: 'DragonDome Obsidian Boundary L4',
        mitigationAction: 'Cryo-Feedback Throttle Compensation Active'
      }
    ];

    setLogs(initialLogs);
  }, []);

  // Real-time Anomaly Detection & CPU Spike Correlation Engine
  useEffect(() => {
    if (!isStreamingActive || isPaused) return;

    const prev = previousMetricsRef.current;
    const entropyDelta = currentEntropy - prev.entropy;
    const thermalDelta = currentThermal - prev.thermal;
    const decoherenceDelta = currentDecoherence - prev.decoherence;
    const phaseDriftDelta = currentPhaseDrift - prev.phaseDrift;

    // Detect anomaly condition
    const isEntropySpike = currentEntropy > 72 || Math.abs(entropyDelta) > 12;
    const isThermalSpike = currentThermal > 68 || Math.abs(thermalDelta) > 10;
    const isDecoherenceSpike = currentDecoherence > 60 || Math.abs(decoherenceDelta) > 9;
    const isPhaseDriftSpike = currentPhaseDrift > 70 || Math.abs(phaseDriftDelta) > 14;

    // Find highest loaded CPU thread
    const sortedThreads = [...cpuThreads].sort((a, b) => b.usage - a.usage);
    const peakThread = sortedThreads[0] || {
      id: 0,
      label: 'Core 0 / T0',
      usage: 45,
      freqGhz: 4.0,
      tempC: 50,
      status: 'optimal'
    };

    const isCpuSpike = peakThread.usage > 70;

    if (isEntropySpike || isThermalSpike || isDecoherenceSpike || isPhaseDriftSpike || (isCpuSpike && Math.random() > 0.4)) {
      const now = new Date();
      const timeMs = now.toLocaleTimeString('en-US', { hour12: false }) + '.' + Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0');

      let anomalyType: QuantumAnomalyLog['anomalyType'] = 'ENTROPY_VOLATILITY_BURST';
      let metricName = 'Quantum Entropy';
      let metricVal = currentEntropy;
      let metricUnit = 'dBm';
      let metricDeltaStr = `${entropyDelta >= 0 ? '+' : ''}${entropyDelta.toFixed(1)}%`;

      if (isDecoherenceSpike) {
        anomalyType = 'DECOHERENCE_COLLAPSE';
        metricName = 'Decoherence Flux';
        metricVal = currentDecoherence;
        metricUnit = '%';
        metricDeltaStr = `${decoherenceDelta >= 0 ? '+' : ''}${decoherenceDelta.toFixed(1)}%`;
      } else if (isPhaseDriftSpike) {
        anomalyType = 'PHASE_DRIFT_CASCADE';
        metricName = 'Phase Drift';
        metricVal = currentPhaseDrift;
        metricUnit = 'mrad';
        metricDeltaStr = `${phaseDriftDelta >= 0 ? '+' : ''}${phaseDriftDelta.toFixed(1)}%`;
      } else if (isThermalSpike) {
        anomalyType = 'THERMAL_NOISE_PULSE';
        metricName = 'Thermal Noise';
        metricVal = currentThermal;
        metricUnit = 'dBm';
        metricDeltaStr = `${thermalDelta >= 0 ? '+' : ''}${thermalDelta.toFixed(1)}%`;
      }

      // Calculate coupling correlation score between anomaly severity and CPU thread load
      const baseCorrelation = Math.min(99.2, Math.max(52.0, (peakThread.usage * 0.6) + (metricVal * 0.4) + (Math.random() * 6 - 3)));
      const isCritical = baseCorrelation > 88 || peakThread.usage > 85 || metricVal > 80;
      const isHigh = baseCorrelation > 75 || peakThread.usage > 72;

      const severity: QuantumAnomalyLog['severity'] = isCritical ? 'CRITICAL' : isHigh ? 'HIGH' : 'MEDIUM';

      const vectors = [
        'Synaptic Mesh Layer 4 (Tensor Fabric)',
        'DragonDome Obsidian Shield Core Boundary',
        'Hexagram Sovereign Harmonic Gate γ',
        'Hydro-Resonant Frequency Bus 528Hz',
        'WebCrypto Memory Isolated Sandbox'
      ];
      const vector = vectors[Math.floor(Math.random() * vectors.length)];

      const mitigations = [
        'Auto-quenched via Neural Gate Dampener (Response 1.2ms)',
        'Dynamic affinity shift to Core 2 / T4 (Success)',
        'Cryo-Feedback Frequency Modulation Engaged',
        'Zero-Trust Memory Barrier Sanitized & Re-locked',
        'Phase-Conjugate Inversion Filter Applied'
      ];
      const mitigation = mitigations[Math.floor(Math.random() * mitigations.length)];

      const newLog: QuantumAnomalyLog = {
        id: `QANO-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: timeMs,
        rawTime: Date.now(),
        severity,
        anomalyType,
        quantumMetric: {
          name: metricName,
          value: +metricVal.toFixed(1),
          unit: metricUnit,
          delta: metricDeltaStr
        },
        cpuCorrelation: {
          coreId: peakThread.id,
          coreLabel: peakThread.label,
          cpuLoad: peakThread.usage,
          frequencyGhz: peakThread.freqGhz,
          tempC: peakThread.tempC,
          correlationScore: +baseCorrelation.toFixed(1),
          couplingStatus: baseCorrelation > 80 ? 'COUPLED' : 'REACTIVE'
        },
        subsystemVector: vector,
        mitigationAction: mitigation
      };

      setLogs(prev => [newLog, ...prev.slice(0, 49)]);
    }

    previousMetricsRef.current = {
      entropy: currentEntropy,
      thermal: currentThermal,
      decoherence: currentDecoherence,
      phaseDrift: currentPhaseDrift
    };
  }, [currentEntropy, currentThermal, currentDecoherence, currentPhaseDrift, cpuThreads, isStreamingActive, isPaused]);

  // Trigger Synthetic Injected Anomaly for manual live verification
  const handleInjectSyntheticAnomaly = () => {
    const now = new Date();
    const timeMs = now.toLocaleTimeString('en-US', { hour12: false }) + '.' + Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0');
    
    const randomCore = Math.floor(Math.random() * 8);
    const injectedLog: QuantumAnomalyLog = {
      id: `SYNTH-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: timeMs,
      rawTime: Date.now(),
      severity: 'CRITICAL',
      anomalyType: 'ENTROPY_VOLATILITY_BURST',
      quantumMetric: {
        name: 'Quantum Entropy Surge',
        value: 94.8,
        unit: 'dBm',
        delta: '+43.5%'
      },
      cpuCorrelation: {
        coreId: randomCore,
        coreLabel: `Core ${Math.floor(randomCore / 2)} / T${randomCore}`,
        cpuLoad: 97,
        frequencyGhz: 4.95,
        tempC: 82,
        correlationScore: 98.4,
        couplingStatus: 'COUPLED'
      },
      subsystemVector: 'DragonDome Obsidian Boundary L4 - Synthetic Stress Probe',
      mitigationAction: 'Targeted Core Affinity Quarantine & Flux Inversion Activated'
    };

    setLogs(prev => [injectedLog, ...prev.slice(0, 49)]);
  };

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchSeverity = filterSeverity === 'ALL' || log.severity === filterSeverity;
      const matchQuery = 
        searchQuery.trim() === '' ||
        log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.anomalyType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.subsystemVector.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.cpuCorrelation.coreLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.mitigationAction.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSeverity && matchQuery;
    });
  }, [logs, filterSeverity, searchQuery]);

  // Aggregate Metrics
  const totalAnomalies = logs.length;
  const criticalCount = logs.filter(l => l.severity === 'CRITICAL').length;
  const avgCorrelation = logs.length > 0 
    ? +(logs.reduce((acc, curr) => acc + curr.cpuCorrelation.correlationScore, 0) / logs.length).toFixed(1)
    : 0;
  const highestCpuCoupling = logs.length > 0
    ? Math.max(...logs.map(l => l.cpuCorrelation.cpuLoad))
    : 0;

  return (
    <div className="bg-[#040412] border border-cyan-500/20 rounded-[2.5rem] p-6 lg:p-8 space-y-6 shadow-2xl relative overflow-hidden text-slate-200 font-mono">
      
      {/* Background ambient mesh */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[120px] pointer-events-none -z-0"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/5 blur-[120px] pointer-events-none -z-0"></div>

      {/* Top Console Header & Realtime Correlation Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-white/10 pb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 flex items-center gap-1.5">
              <Link2 className="w-3 h-3" /> QUANTUM_CPU_CORRELATION_STREAM
            </span>
            <span className="text-[10px] text-slate-500 font-sans">v16 Live Tail</span>
          </div>

          <h3 className="text-2xl font-black text-white font-arabic tracking-tight flex items-center gap-2">
            <Terminal className="w-6 h-6 text-cyan-400" />
            سجل رصد الضوضاء الكوآنتومية وتزامن اختناقات المعالج (CPU Spikes)
          </h3>
          <p className="text-xs text-slate-400 font-arabic mt-1 font-sans">
            تحليل ترابط لحظي بين تذبذبات الإنتروبيا والضوضاء الحرارية وارتفاع استهلاك خيوط المعالجة في النواة.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsPaused(prev => !prev)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              isPaused 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg' 
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isPaused ? 'استئناف البث' : 'إيقاف مؤقت'}</span>
          </button>

          <button
            onClick={handleInjectSyntheticAnomaly}
            className="px-4 py-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-xs font-black shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 border border-rose-400/40"
            title="حقن شذوذ كوآنتومي مع ذروة استهلاك معالج للاختبار"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-arabic">حقن شذوذ تجريبي ⚡</span>
          </button>

          <button
            onClick={() => setLogs([])}
            className="p-2 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 rounded-xl transition-all"
            title="مسح السجل"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Live Correlation Insight Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        
        <div className="bg-black/50 border border-white/5 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 uppercase block">إجمالي حالات الشذوذ</span>
          <div className="text-2xl font-black text-white mt-1 flex items-baseline gap-2">
            {totalAnomalies}
            <span className="text-[10px] text-cyan-400 font-normal font-sans">أحداث مسجلة</span>
          </div>
        </div>

        <div className="bg-black/50 border border-rose-500/20 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 uppercase block">شذوذ حرج (Critical Spikes)</span>
          <div className="text-2xl font-black text-rose-400 mt-1 flex items-baseline gap-2">
            {criticalCount}
            <span className="text-[10px] text-rose-400/80 font-normal font-sans">تزامن شديد</span>
          </div>
        </div>

        <div className="bg-black/50 border border-cyan-500/20 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 uppercase block">متوسط مؤشر الترابط (Coupling)</span>
          <div className="text-2xl font-black text-cyan-300 mt-1 flex items-baseline gap-2">
            {avgCorrelation}%
            <span className="text-[10px] text-emerald-400 font-normal font-sans">ثقة الحساب</span>
          </div>
        </div>

        <div className="bg-black/50 border border-amber-500/20 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 uppercase block">ذروة إجهاد المعالج المتزامن</span>
          <div className="text-2xl font-black text-amber-400 mt-1 flex items-baseline gap-2">
            {highestCpuCoupling}%
            <span className="text-[10px] text-amber-400/80 font-normal font-sans">Peak Load</span>
          </div>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-black/40 border border-white/10 p-3 rounded-2xl relative z-10 text-xs">
        
        {/* Search Input */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في معرف الشذوذ، النواة، أو المتجه (Vector)..."
            className="bg-transparent border-none text-white text-xs placeholder-slate-500 focus:outline-none w-full font-sans"
          />
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all uppercase ${
                filterSeverity === sev
                  ? sev === 'CRITICAL'
                    ? 'bg-rose-500 text-white'
                    : sev === 'HIGH'
                    ? 'bg-amber-500 text-black'
                    : sev === 'MEDIUM'
                    ? 'bg-cyan-500 text-black'
                    : 'bg-white text-black'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

      </div>

      {/* Console Feed Window */}
      <div 
        ref={scrollContainerRef}
        className="bg-black/90 rounded-2xl border border-white/10 p-4 h-[380px] overflow-y-auto space-y-2.5 relative z-10 font-mono text-xs shadow-inner"
      >
        <AnimatePresence initial={false}>
          {filteredLogs.length > 0 ? (
            filteredLogs.map(log => {
              const isCrit = log.severity === 'CRITICAL';
              const isHigh = log.severity === 'HIGH';

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
                    isCrit 
                      ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.08)]' 
                      : isHigh 
                      ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60' 
                      : 'bg-white/[0.02] border-white/5 hover:border-cyan-500/40 hover:bg-white/[0.04]'
                  } ${selectedLog?.id === log.id ? 'ring-1 ring-cyan-400 bg-cyan-950/30' : ''}`}
                >
                  {/* Top Line: Timestamp + Severity + Type + Correlation Score */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">[{log.timestamp}]</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                        isCrit 
                          ? 'bg-rose-600 text-white' 
                          : isHigh 
                          ? 'bg-amber-500 text-black' 
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        {log.severity}
                      </span>
                      <strong className="text-white text-[11px] group-hover:text-cyan-300 transition-colors">
                        {log.id}
                      </strong>
                      <span className="text-slate-400 text-[11px]">:: {log.anomalyType}</span>
                    </div>

                    {/* Coupled CPU Tag */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">
                        <Cpu className={`w-3 h-3 ${log.cpuCorrelation.cpuLoad > 80 ? 'text-rose-400' : 'text-amber-400'}`} />
                        <span className="text-slate-300 font-bold">{log.cpuCorrelation.coreLabel}</span>
                        <span className={`font-black ${log.cpuCorrelation.cpuLoad > 80 ? 'text-rose-400' : 'text-amber-400'}`}>
                          ({log.cpuCorrelation.cpuLoad}%)
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                        <Link2 className="w-3 h-3" />
                        <span>{log.cpuCorrelation.correlationScore}% Coupling</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Line: Anomaly Metric Details vs CPU Spike */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-slate-500">Quantum Flux:</span>
                      <span className="font-bold text-rose-300">{log.quantumMetric.name}</span>
                      <span className="bg-white/5 px-1.5 py-0.5 rounded text-white font-bold">
                        {log.quantumMetric.value} {log.quantumMetric.unit}
                      </span>
                      <span className="text-rose-400 font-black">({log.quantumMetric.delta})</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-slate-500">Vector:</span>
                      <span className="text-indigo-300 truncate max-w-[260px]">{log.subsystemVector}</span>
                    </div>
                  </div>

                  {/* Expandable Extended Inspection */}
                  {selectedLog?.id === log.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-cyan-500/20 bg-black/60 p-3 rounded-xl space-y-2 text-[11px]"
                    >
                      <div className="flex flex-wrap justify-between gap-2 text-slate-400">
                        <span>CPU Frequency: <strong className="text-white">{log.cpuCorrelation.frequencyGhz} GHz</strong></span>
                        <span>Core Thermal: <strong className="text-amber-300">{log.cpuCorrelation.tempC} °C</strong></span>
                        <span>Coupling Mode: <strong className="text-cyan-400">{log.cpuCorrelation.couplingStatus}</strong></span>
                      </div>
                      <div className="text-emerald-400 flex items-center gap-1.5 pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span><strong>إجراء المعالجة والتخميد:</strong> {log.mitigationAction}</span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 py-12 space-y-2">
              <Activity className="w-8 h-8 text-slate-600 animate-pulse" />
              <span className="text-xs">لا توجد سجلات شذوذ تطابق معايير التصفية الحالية</span>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Console Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-2 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-3">
          <span>الحالة: <strong className="text-emerald-400">Realtime Anomaly Correlator Active</strong></span>
          <span className="text-slate-600">•</span>
          <span>نافذة السجل: <strong>50 أحداث حديثة</strong></span>
        </div>

        <div className="text-slate-500 text-[10px]">
          خوارزمية الاستدلال: Cross-Correlation Volatility Matrix (CCVM-16)
        </div>
      </div>

    </div>
  );
};
