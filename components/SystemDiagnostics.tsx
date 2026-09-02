import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as d3 from 'd3';
import { 
  Activity, Zap, Shield, Brain, CheckCircle2, AlertTriangle, RefreshCw, BarChart3, 
  Cpu, Radio, Pause, Play, Sliders, Flame, Server, Sparkles, Filter, RotateCcw,
  Gauge, Layers, Terminal
} from 'lucide-react';
import { Language } from '../types';
import { cpuTelemetry } from '../services/cpuTelemetry';
import { QuantumAnomalyLogStream } from './QuantumAnomalyLogStream';

interface NoiseDataPoint {
  timestamp: number;
  timeLabel: string;
  entropy: number;       // Quantum Entropy (0 - 100)
  thermal: number;       // Thermal Noise (dBm)
  decoherence: number;   // Decoherence Rate (0 - 100 %)
  phaseDrift: number;    // Phase Shift Noise (mrad)
}

interface ThreadState {
  id: number;
  label: string;
  usage: number;         // 0 - 100 %
  freqGhz: number;       // e.g. 3.8 - 4.8 GHz
  tempC: number;         // e.g. 35 - 85 °C
  status: 'optimal' | 'high' | 'critical';
}

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

export const SystemDiagnostics: React.FC<{ language: Language }> = ({ language }) => {
  // Live Streaming Controls
  const [isStreaming, setIsStreaming] = useState(true);
  const [updateIntervalMs, setUpdateIntervalMs] = useState(300);
  const [dataWindowSize, setDataWindowSize] = useState(40);
  
  // Active Chart View Filter
  const [activeNoiseChannels, setActiveNoiseChannels] = useState<{
    entropy: boolean;
    thermal: boolean;
    decoherence: boolean;
    phaseDrift: boolean;
  }>({
    entropy: true,
    thermal: true,
    decoherence: true,
    phaseDrift: false
  });

  // Diagnostic Tests State
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { status: 'pass' | 'fail' | 'warning', score: number, msg: string }>>({});
  const [progress, setProgress] = useState(0);

  // Live Data Buffers
  const [noiseHistory, setNoiseHistory] = useState<NoiseDataPoint[]>([]);
  const [threads, setThreads] = useState<ThreadState[]>([]);
  const [threadHistory, setThreadHistory] = useState<{ timestamp: number; avgUsage: number; peakUsage: number }[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Action status indicators
  const [calibrationActive, setCalibrationActive] = useState(false);
  const [stressTestActive, setStressTestActive] = useState(false);

  // D3 SVG Container Refs
  const quantumChartRef = useRef<SVGSVGElement | null>(null);
  const cpuChartRef = useRef<SVGSVGElement | null>(null);
  const quantumContainerRef = useRef<HTMLDivElement | null>(null);
  const cpuContainerRef = useRef<HTMLDivElement | null>(null);

  // 1. Initialize CPU Threads
  useEffect(() => {
    const initialThreads: ThreadState[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      label: `Core ${Math.floor(i / 2)} / T${i}`,
      usage: Math.floor(Math.random() * 40) + 20,
      freqGhz: +(3.6 + Math.random() * 0.8).toFixed(2),
      tempC: Math.floor(Math.random() * 20) + 42,
      status: 'optimal'
    }));
    setThreads(initialThreads);

    // Initial noise history
    const now = Date.now();
    const initialNoise: NoiseDataPoint[] = Array.from({ length: 30 }, (_, i) => {
      const t = now - (30 - i) * 300;
      return {
        timestamp: t,
        timeLabel: new Date(t).toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' }),
        entropy: 35 + Math.sin(i * 0.3) * 15 + Math.random() * 10,
        thermal: 20 + Math.cos(i * 0.2) * 10 + Math.random() * 8,
        decoherence: 15 + Math.sin(i * 0.5) * 8 + Math.random() * 5,
        phaseDrift: 40 + Math.random() * 25
      };
    });
    setNoiseHistory(initialNoise);

    // Initial thread history
    const initialThreadHist = Array.from({ length: 30 }, (_, i) => {
      const t = now - (30 - i) * 300;
      return {
        timestamp: t,
        avgUsage: Math.floor(25 + Math.random() * 20),
        peakUsage: Math.floor(55 + Math.random() * 25)
      };
    });
    setThreadHistory(initialThreadHist);

    // Initial Log
    setLogs([
      { id: '1', timestamp: new Date().toLocaleTimeString(), type: 'info', message: 'D3 Quantum Streamer initialized.' },
      { id: '2', timestamp: new Date().toLocaleTimeString(), type: 'success', message: 'Neural CPU thread affinity synchronized.' }
    ]);
  }, []);

  // 2. Real-Time Data Producer Loop
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeStr = new Date(now).toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' });

      // Update Quantum Noise Data
      setNoiseHistory(prev => {
        const last = prev[prev.length - 1] || { entropy: 40, thermal: 25, decoherence: 18, phaseDrift: 30 };
        
        let noiseFactor = calibrationActive ? 0.3 : (stressTestActive ? 2.2 : 1.0);
        
        const nextEntropy = Math.max(5, Math.min(99, last.entropy + (Math.random() * 12 - 5.8) * noiseFactor));
        const nextThermal = Math.max(5, Math.min(95, last.thermal + (Math.random() * 10 - 4.9) * noiseFactor));
        const nextDecoherence = Math.max(2, Math.min(98, last.decoherence + (Math.random() * 8 - 4.0) * noiseFactor));
        const nextPhaseDrift = Math.max(10, Math.min(100, last.phaseDrift + (Math.random() * 14 - 7.0) * noiseFactor));

        const newPoint: NoiseDataPoint = {
          timestamp: now,
          timeLabel: timeStr,
          entropy: +nextEntropy.toFixed(2),
          thermal: +nextThermal.toFixed(2),
          decoherence: +nextDecoherence.toFixed(2),
          phaseDrift: +nextPhaseDrift.toFixed(2)
        };

        const updated = [...prev, newPoint];
        return updated.slice(-dataWindowSize);
      });

      // Update CPU Threads State
      setThreads(prevThreads => {
        const updated = prevThreads.map(t => {
          let baseDelta = (Math.random() * 16 - 8);
          if (stressTestActive) baseDelta += 25;
          if (calibrationActive) baseDelta -= 15;

          const newUsage = Math.max(5, Math.min(100, Math.round(t.usage + baseDelta)));
          const newFreq = +(3.4 + (newUsage / 100) * 1.4 + (Math.random() * 0.1 - 0.05)).toFixed(2);
          const newTemp = Math.round(38 + (newUsage / 100) * 45 + (Math.random() * 3 - 1.5));
          
          let status: ThreadState['status'] = 'optimal';
          if (newUsage > 85 || newTemp > 80) status = 'critical';
          else if (newUsage > 65 || newTemp > 70) status = 'high';

          return {
            ...t,
            usage: newUsage,
            freqGhz: newFreq,
            tempC: newTemp,
            status
          };
        });

        const avg = Math.round(updated.reduce((acc, curr) => acc + curr.usage, 0) / updated.length);
        const peak = Math.max(...updated.map(u => u.usage));

        // Schedule telemetry sync and history update outside the render phase
        queueMicrotask(() => {
          cpuTelemetry.setExternalThreads(updated, stressTestActive, calibrationActive);
          setThreadHistory(prev => [
            ...prev,
            { timestamp: now, avgUsage: avg, peakUsage: peak }
          ].slice(-dataWindowSize));

          if (peak > 92 && Math.random() > 0.7) {
            addLog('warning', `Thread peak detected: ${peak}% load.`);
          }
        });

        return updated;
      });

    }, updateIntervalMs);

    return () => clearInterval(interval);
  }, [isStreaming, updateIntervalMs, dataWindowSize, calibrationActive, stressTestActive]);

  const addLog = (type: LogEntry['type'], message: string) => {
    setLogs(prev => [
      { id: Math.random().toString(), timestamp: new Date().toLocaleTimeString(), type, message },
      ...prev.slice(0, 15)
    ]);
  };

  // 3. Render D3 Quantum Noise Chart
  useEffect(() => {
    if (!quantumChartRef.current || !quantumContainerRef.current || noiseHistory.length < 2) return;

    const svgEl = d3.select(quantumChartRef.current);
    svgEl.selectAll('*').remove(); // Clear previous drawing

    const containerWidth = quantumContainerRef.current.clientWidth || 650;
    const height = 260;
    const margin = { top: 20, right: 25, bottom: 30, left: 45 };
    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = svgEl
      .attr('width', containerWidth)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Define Gradients
    const defs = svg.append('defs');

    // Entropy Gradient (Rose/Pink)
    const gradEntropy = defs.append('linearGradient')
      .attr('id', 'entropy-grad')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    gradEntropy.append('stop').attr('offset', '0%').attr('stop-color', '#f43f5e').attr('stop-opacity', 0.4);
    gradEntropy.append('stop').attr('offset', '100%').attr('stop-color', '#f43f5e').attr('stop-opacity', 0.0);

    // Thermal Gradient (Amber)
    const gradThermal = defs.append('linearGradient')
      .attr('id', 'thermal-grad')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    gradThermal.append('stop').attr('offset', '0%').attr('stop-color', '#f59e0b').attr('stop-opacity', 0.3);
    gradThermal.append('stop').attr('offset', '100%').attr('stop-color', '#f59e0b').attr('stop-opacity', 0.0);

    // Decoherence Gradient (Indigo/Cyan)
    const gradDecoherence = defs.append('linearGradient')
      .attr('id', 'decoherence-grad')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    gradDecoherence.append('stop').attr('offset', '0%').attr('stop-color', '#6366f1').attr('stop-opacity', 0.35);
    gradDecoherence.append('stop').attr('offset', '100%').attr('stop-color', '#6366f1').attr('stop-opacity', 0.0);

    // Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(noiseHistory, d => new Date(d.timestamp)) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .nice()
      .range([innerHeight, 0]);

    // Gridlines
    g.append('g')
      .attr('class', 'grid')
      .attr('stroke', '#ffffff10')
      .attr('stroke-dasharray', '3,3')
      .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(() => ''));

    // Axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(5)
      .tickFormat(d3.timeFormat('%H:%M:%S') as any);

    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => `${d}%`);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .attr('color', '#64748b')
      .call(xAxis)
      .selectAll('text')
      .style('font-size', '10px')
      .style('font-family', 'monospace');

    g.append('g')
      .attr('color', '#64748b')
      .call(yAxis)
      .selectAll('text')
      .style('font-size', '10px')
      .style('font-family', 'monospace');

    // Generators
    const areaGen = (key: keyof NoiseDataPoint) => d3.area<NoiseDataPoint>()
      .x(d => xScale(new Date(d.timestamp)))
      .y0(innerHeight)
      .y1(d => yScale(d[key] as number))
      .curve(d3.curveMonotoneX);

    const lineGen = (key: keyof NoiseDataPoint) => d3.line<NoiseDataPoint>()
      .x(d => xScale(new Date(d.timestamp)))
      .y(d => yScale(d[key] as number))
      .curve(d3.curveMonotoneX);

    // Draw Channels
    if (activeNoiseChannels.entropy) {
      g.append('path')
        .datum(noiseHistory)
        .attr('fill', 'url(#entropy-grad)')
        .attr('d', areaGen('entropy'));

      g.append('path')
        .datum(noiseHistory)
        .attr('fill', 'none')
        .attr('stroke', '#f43f5e')
        .attr('stroke-width', 2.5)
        .attr('d', lineGen('entropy'));
    }

    if (activeNoiseChannels.thermal) {
      g.append('path')
        .datum(noiseHistory)
        .attr('fill', 'url(#thermal-grad)')
        .attr('d', areaGen('thermal'));

      g.append('path')
        .datum(noiseHistory)
        .attr('fill', 'none')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4,2')
        .attr('d', lineGen('thermal'));
    }

    if (activeNoiseChannels.decoherence) {
      g.append('path')
        .datum(noiseHistory)
        .attr('fill', 'url(#decoherence-grad)')
        .attr('d', areaGen('decoherence'));

      g.append('path')
        .datum(noiseHistory)
        .attr('fill', 'none')
        .attr('stroke', '#6366f1')
        .attr('stroke-width', 2.5)
        .attr('d', lineGen('decoherence'));
    }

    if (activeNoiseChannels.phaseDrift) {
      g.append('path')
        .datum(noiseHistory)
        .attr('fill', 'none')
        .attr('stroke', '#06b6d4')
        .attr('stroke-width', 2)
        .attr('d', lineGen('phaseDrift'));
    }

    // Add Latest Data Point Indicator Pulse
    const latestPoint = noiseHistory[noiseHistory.length - 1];
    if (latestPoint && activeNoiseChannels.entropy) {
      g.append('circle')
        .attr('cx', xScale(new Date(latestPoint.timestamp)))
        .attr('cy', yScale(latestPoint.entropy))
        .attr('r', 5)
        .attr('fill', '#f43f5e')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2)
        .attr('class', 'animate-pulse');
    }
  }, [noiseHistory, activeNoiseChannels]);

  // 4. Render D3 CPU Thread Utilization Chart
  useEffect(() => {
    if (!cpuChartRef.current || !cpuContainerRef.current || threadHistory.length < 2) return;

    const svgEl = d3.select(cpuChartRef.current);
    svgEl.selectAll('*').remove();

    const containerWidth = cpuContainerRef.current.clientWidth || 650;
    const height = 260;
    const margin = { top: 20, right: 25, bottom: 30, left: 45 };
    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = svgEl
      .attr('width', containerWidth)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const defs = svg.append('defs');

    // Cpu Avg Gradient (Emerald)
    const gradCpuAvg = defs.append('linearGradient')
      .attr('id', 'cpu-avg-grad')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    gradCpuAvg.append('stop').attr('offset', '0%').attr('stop-color', '#10b981').attr('stop-opacity', 0.4);
    gradCpuAvg.append('stop').attr('offset', '100%').attr('stop-color', '#10b981').attr('stop-opacity', 0.0);

    const xScale = d3.scaleTime()
      .domain(d3.extent(threadHistory, d => new Date(d.timestamp)) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .nice()
      .range([innerHeight, 0]);

    // Gridlines
    g.append('g')
      .attr('stroke', '#ffffff10')
      .attr('stroke-dasharray', '3,3')
      .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(() => ''));

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .attr('color', '#64748b')
      .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.timeFormat('%H:%M:%S') as any))
      .selectAll('text')
      .style('font-size', '10px')
      .style('font-family', 'monospace');

    g.append('g')
      .attr('color', '#64748b')
      .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => `${d}%`))
      .selectAll('text')
      .style('font-size', '10px')
      .style('font-family', 'monospace');

    // Peak Area
    const areaPeak = d3.area<{ timestamp: number; avgUsage: number; peakUsage: number }>()
      .x(d => xScale(new Date(d.timestamp)))
      .y0(innerHeight)
      .y1(d => yScale(d.peakUsage))
      .curve(d3.curveStepAfter);

    const linePeak = d3.line<{ timestamp: number; avgUsage: number; peakUsage: number }>()
      .x(d => xScale(new Date(d.timestamp)))
      .y(d => yScale(d.peakUsage))
      .curve(d3.curveStepAfter);

    const lineAvg = d3.line<{ timestamp: number; avgUsage: number; peakUsage: number }>()
      .x(d => xScale(new Date(d.timestamp)))
      .y(d => yScale(d.avgUsage))
      .curve(d3.curveMonotoneX);

    const areaAvg = d3.area<{ timestamp: number; avgUsage: number; peakUsage: number }>()
      .x(d => xScale(new Date(d.timestamp)))
      .y0(innerHeight)
      .y1(d => yScale(d.avgUsage))
      .curve(d3.curveMonotoneX);

    // Draw Peak Thread Trace
    g.append('path')
      .datum(threadHistory)
      .attr('fill', 'none')
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '3,3')
      .attr('d', linePeak);

    // Draw Avg Area & Line
    g.append('path')
      .datum(threadHistory)
      .attr('fill', 'url(#cpu-avg-grad)')
      .attr('d', areaAvg);

    g.append('path')
      .datum(threadHistory)
      .attr('fill', 'none')
      .attr('stroke', '#10b981')
      .attr('stroke-width', 2.5)
      .attr('d', lineAvg);

    // Latest Peak Point
    const lastPoint = threadHistory[threadHistory.length - 1];
    if (lastPoint) {
      g.append('circle')
        .attr('cx', xScale(new Date(lastPoint.timestamp)))
        .attr('cy', yScale(lastPoint.avgUsage))
        .attr('r', 5)
        .attr('fill', '#10b981')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2);
    }
  }, [threadHistory]);

  // Actions
  const handleTriggerCalibration = () => {
    setCalibrationActive(true);
    addLog('info', 'Quantum noise calibration sequence initiated.');
    setTimeout(() => {
      setCalibrationActive(false);
      addLog('success', 'De-noising complete: Noise floor reduced by 64%.');
    }, 4500);
  };

  const handleTriggerStressTest = () => {
    setStressTestActive(true);
    addLog('warning', 'CPU Multi-Thread stress test engaged (100% load requested).');
    setTimeout(() => {
      setStressTestActive(false);
      addLog('success', 'Stress test completed successfully without core throttling.');
    }, 5000);
  };

  const runTest = (id: string) => {
    setActiveTest(id);
    setProgress(0);
    setResults(prev => ({ ...prev, [id]: undefined }));

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          completeTest(id);
          return 100;
        }
        return prev + Math.random() * 8;
      });
    }, 100);
  };

  const completeTest = (id: string) => {
    setActiveTest(null);
    const score = Math.floor(Math.random() * 15) + 85;
    let status: 'pass' | 'fail' | 'warning' = 'pass';
    let msg = 'Optimal Performance';

    if (score < 90) {
      status = 'warning';
      msg = 'Sub-optimal latency detected';
    }

    setResults(prev => ({
      ...prev,
      [id]: { status, score, msg }
    }));
    addLog('success', `Diagnostic module [${id}] completed with score ${score}%.`);
  };

  const currentAvgNoise = noiseHistory.length > 0 
    ? +(noiseHistory.reduce((a, b) => a + b.entropy, 0) / noiseHistory.length).toFixed(1)
    : 0;

  const currentCpuAvg = threads.length > 0 
    ? Math.round(threads.reduce((a, b) => a + b.usage, 0) / threads.length)
    : 0;

  const peakTemp = threads.length > 0 ? Math.max(...threads.map(t => t.tempC)) : 0;

  const tests = [
    { id: 'neural_latency', title: 'Neural Latency', icon: Zap, desc: 'Measures response time of synaptic web.', color: 'blue' },
    { id: 'security_integrity', title: 'Security Integrity', icon: Shield, desc: 'Verifies encryption protocols & firewall.', color: 'emerald' },
    { id: 'cognitive_sync', title: 'Cognitive Sync', icon: Brain, desc: 'Calibrates user-system interface alignment.', color: 'purple' },
    { id: 'core_stability', title: 'Core Stability', icon: Activity, desc: 'Stress tests central processing unit.', color: 'rose' }
  ];

  return (
    <div className="min-h-screen bg-[#02020a] text-slate-200 font-arabic p-6 lg:p-12 overflow-hidden relative">
      {/* Background FX */}
      <div className="absolute inset-0 z-0 opacity-15 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[160px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-600/20 blur-[160px] rounded-full"></div>
        <div className="w-full h-full bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:36px_36px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-10 pb-20">
        
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-white/5 pb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-1 px-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5">
                <Activity className="w-3 h-3 animate-pulse" /> LIVE_QUANTUM_STREAM_DIAGNOSTICS
              </span>
              <span className="text-xs font-mono text-emerald-400">● REALTIME D3 ACTIVE</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
              تشخيصات <span className="text-rose-500">النظام النوروني</span>
            </h1>
            <p className="mt-3 text-slate-400 max-w-2xl text-base leading-relaxed font-medium">
              مراقبة متحيّزة حية لـ D3 لمستويات الضوضاء الكوآنتومية، تفكك البتات الإنعكاسية، واستغلال الخيوط المعالجية (CPU Threads) لحظياً.
            </p>
          </div>

          {/* Quick Stats Summary */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-4">
              <Radio className="w-6 h-6 text-rose-400" />
              <div>
                <span className="text-[9px] font-mono text-slate-400 block uppercase">Quantum Noise Avg</span>
                <span className="text-xl font-black text-white">{currentAvgNoise} <span className="text-xs text-rose-400 font-normal">dBm</span></span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-4">
              <Cpu className="w-6 h-6 text-emerald-400" />
              <div>
                <span className="text-[9px] font-mono text-slate-400 block uppercase">CPU Load Avg</span>
                <span className="text-xl font-black text-white">{currentCpuAvg}%</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-4">
              <Flame className="w-6 h-6 text-amber-400" />
              <div>
                <span className="text-[9px] font-mono text-slate-400 block uppercase">Peak Thread Temp</span>
                <span className="text-xl font-black text-white">{peakTemp}°C</span>
              </div>
            </div>
          </div>
        </header>

        {/* Global Toolbar Controls */}
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2.5 transition-all shadow-lg ${
                isStreaming 
                  ? 'bg-amber-600/80 hover:bg-amber-500 text-white shadow-amber-900/20' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'
              }`}
            >
              {isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isStreaming ? 'إيقاف البث الحي' : 'تشغيل البث الحي'}</span>
            </button>

            <button
              onClick={handleTriggerCalibration}
              disabled={calibrationActive}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-2xl transition-all flex items-center gap-2.5 shadow-lg shadow-indigo-900/20 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${calibrationActive ? 'animate-spin' : ''}`} />
              <span>{calibrationActive ? 'جاري معايرة الضوضاء...' : 'معايرة النواة الكوآنتومية'}</span>
            </button>

            <button
              onClick={handleTriggerStressTest}
              disabled={stressTestActive}
              className="px-6 py-3 bg-rose-600/80 hover:bg-rose-500 text-white font-black text-xs rounded-2xl transition-all flex items-center gap-2.5 shadow-lg shadow-rose-900/20 disabled:opacity-50"
            >
              <Flame className={`w-4 h-4 ${stressTestActive ? 'animate-bounce' : ''}`} />
              <span>{stressTestActive ? 'جاري اختبار الضغط...' : 'اختبار ضغط الخيوط (Stress Test)'}</span>
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">معدل التحديث:</span>
              <select
                value={updateIntervalMs}
                onChange={e => setUpdateIntervalMs(Number(e.target.value))}
                className="bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value={150}>فائق السرعة (150ms)</option>
                <option value={300}>عادي (300ms)</option>
                <option value={600}>مستقر (600ms)</option>
                <option value={1000}>بطيء (1s)</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">نافذة البيانات:</span>
              <select
                value={dataWindowSize}
                onChange={e => setDataWindowSize(Number(e.target.value))}
                className="bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value={20}>20 نقطة</option>
                <option value={40}>40 نقطة</option>
                <option value={60}>60 نقطة</option>
              </select>
            </div>
          </div>
        </div>

        {/* Real-Time Live Stream D3 Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: Quantum Noise Live Stream */}
          <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden" ref={quantumContainerRef}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <Radio className="w-5 h-5 text-rose-500" />
                    مخطط D3 الحي للضوضاء الكوآنتومية
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  مراقبة موجات الضوضاء والتداخلات الكهرومغناطيسية في الوقت الفعلي.
                </p>
              </div>

              {/* Channel Toggles */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveNoiseChannels(p => ({ ...p, entropy: !p.entropy }))}
                  className={`px-3 py-1 rounded-full text-[10px] font-black border transition-all ${
                    activeNoiseChannels.entropy ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-white/5 text-slate-500 border-white/5'
                  }`}
                >
                  Entropy
                </button>
                <button
                  onClick={() => setActiveNoiseChannels(p => ({ ...p, thermal: !p.thermal }))}
                  className={`px-3 py-1 rounded-full text-[10px] font-black border transition-all ${
                    activeNoiseChannels.thermal ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-white/5 text-slate-500 border-white/5'
                  }`}
                >
                  Thermal
                </button>
                <button
                  onClick={() => setActiveNoiseChannels(p => ({ ...p, decoherence: !p.decoherence }))}
                  className={`px-3 py-1 rounded-full text-[10px] font-black border transition-all ${
                    activeNoiseChannels.decoherence ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40' : 'bg-white/5 text-slate-500 border-white/5'
                  }`}
                >
                  Decoherence
                </button>
                <button
                  onClick={() => setActiveNoiseChannels(p => ({ ...p, phaseDrift: !p.phaseDrift }))}
                  className={`px-3 py-1 rounded-full text-[10px] font-black border transition-all ${
                    activeNoiseChannels.phaseDrift ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' : 'bg-white/5 text-slate-500 border-white/5'
                  }`}
                >
                  Phase Drift
                </button>
              </div>
            </div>

            {/* SVG Canvas Container */}
            <div className="bg-black/60 rounded-2xl border border-white/5 p-4 flex justify-center items-center min-h-[260px]">
              <svg ref={quantumChartRef} className="w-full h-auto overflow-visible"></svg>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Decoherence Rate</span>
                <span className="text-lg font-black text-indigo-400">
                  {noiseHistory.length > 0 ? noiseHistory[noiseHistory.length - 1].decoherence : 0}%
                </span>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Entropy Shift</span>
                <span className="text-lg font-black text-rose-400">
                  {noiseHistory.length > 0 ? noiseHistory[noiseHistory.length - 1].entropy : 0} dB
                </span>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Phase Stability</span>
                <span className="text-lg font-black text-cyan-400">
                  {noiseHistory.length > 0 ? (100 - noiseHistory[noiseHistory.length - 1].phaseDrift).toFixed(1) : 100}%
                </span>
              </div>
            </div>
          </div>

          {/* Chart 2: CPU Thread Utilization Live Stream */}
          <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden" ref={cpuContainerRef}>
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-emerald-500" />
                    مخطط D3 لاستغلال خيوط المعالجة
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  تتبع مسارات الاستغلال المتوسط والذروة لـ 8 خيوط كوآنتومية (Multi-Threads).
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-emerald-500 rounded-full"></span>
                  <span className="text-slate-400">المتوسط</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-red-500 rounded-full border border-dashed"></span>
                  <span className="text-slate-400">الذروة</span>
                </div>
              </div>
            </div>

            {/* SVG Canvas Container */}
            <div className="bg-black/60 rounded-2xl border border-white/5 p-4 flex justify-center items-center min-h-[260px]">
              <svg ref={cpuChartRef} className="w-full h-auto overflow-visible"></svg>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Active Cores</span>
                <span className="text-lg font-black text-emerald-400">8 / 8 Cores</span>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Avg Frequency</span>
                <span className="text-lg font-black text-amber-400">
                  {threads.length > 0 ? (threads.reduce((a, b) => a + b.freqGhz, 0) / threads.length).toFixed(2) : 4.2} GHz
                </span>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Max Thread Load</span>
                <span className="text-lg font-black text-red-400">
                  {threads.length > 0 ? Math.max(...threads.map(t => t.usage)) : 0}%
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Live Multi-Thread Utilization Grid & Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Threads Visual Grid (8 Cores) */}
          <div className="lg:col-span-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  مصفوفة الخيوط الكوآنتومية المباشرة (Live Thread Matrix)
                </h3>
                <p className="text-xs text-slate-400 mt-1">حالة كل خيط معالج، التردد اللحظي، ودرجة الحرارة.</p>
              </div>
              <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase">
                Dynamic Affinity Engine
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {threads.map(t => (
                <div
                  key={t.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    t.status === 'critical' 
                      ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/20' 
                      : t.status === 'high' 
                      ? 'bg-amber-950/20 border-amber-500/40' 
                      : 'bg-black/40 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-black text-white">{t.label}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      t.status === 'critical' ? 'bg-rose-500/20 text-rose-400' : t.status === 'high' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {t.usage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-3">
                    <motion.div
                      className={`h-full ${
                        t.status === 'critical' ? 'bg-rose-500' : t.status === 'high' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      animate={{ width: `${t.usage}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>{t.freqGhz} GHz</span>
                    <span>{t.tempC} °C</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostic Console Logs Feed */}
          <div className="lg:col-span-4 bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-400" />
                سجل التنبيهات والأحداث
              </h3>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Live Tail</span>
            </div>

            <div className="bg-black/80 rounded-2xl border border-white/5 p-4 h-[240px] overflow-y-auto no-scrollbar space-y-2 font-mono text-xs">
              {logs.map(log => (
                <div key={log.id} className="flex items-start gap-2 border-b border-white/5 pb-1.5">
                  <span className="text-slate-600 text-[10px]">{log.timestamp}</span>
                  <span className={`text-[10px] font-bold uppercase ${
                    log.type === 'error' ? 'text-rose-400' : log.type === 'warning' ? 'text-amber-400' : log.type === 'success' ? 'text-emerald-400' : 'text-indigo-400'
                  }`}>
                    [{log.type}]
                  </span>
                  <span className="text-slate-300 flex-1">{log.message}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Dedicated Quantum Anomaly Log Stream & CPU Spikes Correlation Console */}
        <QuantumAnomalyLogStream
          currentEntropy={noiseHistory[noiseHistory.length - 1]?.entropy ?? 40}
          currentThermal={noiseHistory[noiseHistory.length - 1]?.thermal ?? 25}
          currentDecoherence={noiseHistory[noiseHistory.length - 1]?.decoherence ?? 18}
          currentPhaseDrift={noiseHistory[noiseHistory.length - 1]?.phaseDrift ?? 30}
          cpuThreads={threads}
          isStreamingActive={isStreaming}
        />

        {/* Diagnostic Suite Tests runner */}
        <div className="space-y-6 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-indigo-400" />
              اختبارات فحص الكفاءة والاستقرار الذاتي
            </h3>
            <span className="text-xs text-slate-400 font-mono">Automated Health Check</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tests.map((test) => {
              const result = results[test.id];
              const isActive = activeTest === test.id;
              const Icon = test.icon;

              return (
                <div 
                  key={test.id}
                  className={`relative p-6 rounded-[2rem] border transition-all overflow-hidden group
                    ${isActive 
                      ? `bg-indigo-950/20 border-indigo-500/50` 
                      : result 
                        ? 'bg-white/5 border-white/10' 
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                >
                  <div className="relative z-10 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-white/5 rounded-2xl text-indigo-400 border border-white/5">
                        <Icon className="w-5 h-5" />
                      </div>
                      {result && (
                        <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5
                          ${result.status === 'pass' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}
                        `}>
                          {result.status === 'pass' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {result.score}%
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-lg font-black text-white uppercase">{test.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{test.desc}</p>
                    </div>

                    {isActive ? (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] uppercase tracking-widest text-slate-400">
                          <span>جاري الفحص...</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-indigo-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => runTest(test.id)}
                        disabled={!!activeTest}
                        className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2
                          ${result 
                            ? 'bg-white/5 text-slate-400 hover:bg-white/10' 
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                          }
                          ${!!activeTest && 'opacity-50 cursor-not-allowed'}
                        `}
                      >
                        {result ? <RefreshCw className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
                        {result ? 'إعادة الاختبار' : 'بدء الاختبار'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
