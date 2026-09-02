import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { 
  Activity, Shield, ShieldAlert, Sparkles, Zap, Flame, Radio, 
  Terminal, RefreshCw, AlertTriangle, CheckCircle2, Bug, Play,
  Lock, Eye, Cpu, Database, Share2, Layers, AlertOctagon, Sliders, Bell
} from 'lucide-react';
import { generateDragonSecurityReport, DragonSecurityAudit } from '../services/dragonDomeEngine';
import { neuralKernelSecurity } from '../services/neuralKernelSecurity';
import { Language } from '../types';

interface StabilityDataPoint {
  timestamp: Date;
  timeLabel: string;
  stabilityIndex: number; // 0 - 100
  coherenceRate: number; // 0 - 100
  intrusionPressure: number; // 0 - 100
  threatDetected: boolean;
  isBreach: boolean;
  eventNote?: string;
}

interface DomeSector {
  id: string;
  name: string;
  nameEn: string;
  angle: number;
  integrity: number;
  status: 'OPTIMAL' | 'DEFENDING' | 'ALERT';
  threatHits: number;
}

export const QuantumStabilityDashboard: React.FC<{ language?: Language }> = ({ language }) => {
  const [dataPoints, setDataPoints] = useState<StabilityDataPoint[]>([]);
  const [currentQSI, setCurrentQSI] = useState<number>(99.98);
  const [currentCoherence, setCurrentCoherence] = useState<number>(98.9);
  const [totalIntrusionsBlocked, setTotalIntrusionsBlocked] = useState<number>(142);
  const [selectedFrequency, setSelectedFrequency] = useState<number>(528);
  const [safetyThreshold, setSafetyThreshold] = useState<number>(99.0); // Safety critical threshold
  const [isSimulatingAttack, setIsSimulatingAttack] = useState<boolean>(false);
  const [breachAlertActive, setBreachAlertActive] = useState<boolean>(false);
  const [lastBreachEvent, setLastBreachEvent] = useState<{ time: string; value: number; msg: string; sector: string } | null>(null);

  const [lastInterception, setLastInterception] = useState<{ time: string; type: string; origin: string } | null>({
    time: '01:04:12',
    type: 'SQL/NoSQL Buffer Overrun Injection',
    origin: 'External Sector Gamma (Hexagram Matrix Gate)'
  });
  
  const [auditReport, setAuditReport] = useState<DragonSecurityAudit | null>(null);
  const [streamActive, setStreamActive] = useState<boolean>(true);
  const [interceptLogs, setInterceptLogs] = useState<{ id: string; time: string; msg: string; status: 'BLOCKED' | 'NORMAL' | 'WARN' | 'BREACH' }[]>([
    { id: 'SEC-101', time: '01:00:02', msg: 'مزامنة تردد 528Hz مع قبة الحماية L4 Obsidian', status: 'NORMAL' },
    { id: 'SEC-102', time: '01:02:18', msg: 'صد واعتراض محاولة حقن غير مصرح بها على حدود النواة', status: 'BLOCKED' },
    { id: 'SEC-103', time: '01:05:04', msg: 'استقرار الترابط الكوآنتومي بنسبة 99.98% فوق الحد الآمن (99.0%)', status: 'NORMAL' }
  ]);

  const [sectors, setSectors] = useState<DomeSector[]>([
    { id: 'sec-a', name: 'القطاع α: جدار الأوبسيديان L4', nameEn: 'Obsidian Wall L4', angle: 0, integrity: 100, status: 'OPTIMAL', threatHits: 41 },
    { id: 'sec-b', name: 'القطاع β: الرنين الهيدروديناميكي', nameEn: 'Hydro-Resonance', angle: 60, integrity: 99.8, status: 'OPTIMAL', threatHits: 19 },
    { id: 'sec-c', name: 'القطاع γ: بوابة التوافق السداسي', nameEn: 'Hexagram Matrix Gate', angle: 120, integrity: 98.6, status: 'OPTIMAL', threatHits: 28 },
    { id: 'sec-d', name: 'القطاع δ: العزل النوروني Zero-Trust', nameEn: 'Neural Airgap Isolation', angle: 180, integrity: 100, status: 'OPTIMAL', threatHits: 33 },
    { id: 'sec-e', name: 'القطاع ε: تشفير الذاكرة WebCrypto', nameEn: 'Memory Crypto Shield', angle: 240, integrity: 99.9, status: 'OPTIMAL', threatHits: 12 },
    { id: 'sec-z', name: 'القطاع ζ: نواة الاستقلالية الصرفة', nameEn: 'Zero-Cloud Sovereign Core', angle: 300, integrity: 100, status: 'OPTIMAL', threatHits: 9 }
  ]);

  // Chart and Radar SVG Refs
  const waveformSvgRef = useRef<SVGSVGElement | null>(null);
  const radarSvgRef = useRef<SVGSVGElement | null>(null);

  // Initialize initial history data
  useEffect(() => {
    const initialPoints: StabilityDataPoint[] = [];
    const now = Date.now();
    for (let i = 24; i >= 0; i--) {
      const t = new Date(now - i * 3000);
      const timeStr = `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}:${t.getSeconds().toString().padStart(2, '0')}`;
      const baseQsi = 99.7 + Math.sin(i * 0.5) * 0.25;
      initialPoints.push({
        timestamp: t,
        timeLabel: timeStr,
        stabilityIndex: +baseQsi.toFixed(2),
        coherenceRate: +(98.5 + Math.cos(i * 0.4) * 0.4).toFixed(2),
        intrusionPressure: +(2 + Math.random() * 3).toFixed(1),
        threatDetected: i === 8 || i === 18,
        isBreach: baseQsi < safetyThreshold,
        eventNote: i === 8 ? 'صد تطفل Vector-7' : i === 18 ? 'عزل حزمة خبيثة' : undefined
      });
    }
    setDataPoints(initialPoints);

    // Initial audit probe
    const audit = generateDragonSecurityReport();
    setAuditReport(audit);
  }, []);

  // Periodic Telemetry Updates
  useEffect(() => {
    if (!streamActive) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      const noise = (Math.random() - 0.5) * 0.08;
      const nextQSI = Math.min(100, Math.max(99.4, 99.96 + noise));
      const nextCoherence = Math.min(100, Math.max(98.0, 98.9 + (Math.random() - 0.5) * 0.2));
      const intrusionLoad = +(1.5 + Math.random() * 4).toFixed(1);
      const isBreach = nextQSI < safetyThreshold;

      setCurrentQSI(+nextQSI.toFixed(2));
      setCurrentCoherence(+nextCoherence.toFixed(2));

      if (isBreach && !breachAlertActive) {
        setBreachAlertActive(true);
        setLastBreachEvent({
          time: timeStr,
          value: +nextQSI.toFixed(2),
          msg: `انخفاض مفاجئ في مؤشر استقرار النواة دون الحد الآمن (${safetyThreshold}%)`,
          sector: 'DragonDome Core Boundary'
        });
      }

      setDataPoints(prev => {
        const next = [
          ...prev.slice(1),
          {
            timestamp: now,
            timeLabel: timeStr,
            stabilityIndex: +nextQSI.toFixed(2),
            coherenceRate: +nextCoherence.toFixed(2),
            intrusionPressure: intrusionLoad,
            threatDetected: false,
            isBreach: isBreach
          }
        ];
        return next;
      });

      // Update radar sector integrity with minor live ripples
      setSectors(prev => prev.map(sec => ({
        ...sec,
        integrity: +(Math.min(100, 99.5 + Math.random() * 0.5)).toFixed(1)
      })));

    }, 3000);

    return () => clearInterval(interval);
  }, [streamActive, safetyThreshold, breachAlertActive]);

  // D3 Render: Quantum Stability Waveform Timeline with Threshold Safety Boundary
  useEffect(() => {
    if (!waveformSvgRef.current || dataPoints.length === 0) return;

    const svg = d3.select(waveformSvgRef.current);
    svg.selectAll('*').remove();

    const width = waveformSvgRef.current.clientWidth || 700;
    const height = 290;
    const margin = { top: 25, right: 35, bottom: 35, left: 45 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Gradient Definitions
    const defs = svg.append('defs');

    // Area Gradient (Normal Safe State)
    const areaGradient = defs.append('linearGradient')
      .attr('id', 'qsi-area-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    areaGradient.append('stop').attr('offset', '0%').attr('stop-color', breachAlertActive ? '#ef4444' : '#10b981').attr('stop-opacity', 0.45);
    areaGradient.append('stop').attr('offset', '50%').attr('stop-color', breachAlertActive ? '#f59e0b' : '#06b6d4').attr('stop-opacity', 0.15);
    areaGradient.append('stop').attr('offset', '100%').attr('stop-color', '#020617').attr('stop-opacity', 0);

    // Line Gradient
    const lineGradient = defs.append('linearGradient')
      .attr('id', 'qsi-line-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '0%');
    lineGradient.append('stop').attr('offset', '0%').attr('stop-color', '#34d399');
    lineGradient.append('stop').attr('offset', '50%').attr('stop-color', '#06b6d4');
    lineGradient.append('stop').attr('offset', '100%').attr('stop-color', breachAlertActive ? '#ef4444' : '#a855f7');

    // Danger Zone Pattern / Gradient for Breach Below Threshold
    const dangerPattern = defs.append('pattern')
      .attr('id', 'danger-stripes')
      .attr('width', 8)
      .attr('height', 8)
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('patternTransform', 'rotate(45)');
    dangerPattern.append('rect')
      .attr('width', 4)
      .attr('height', 8)
      .attr('fill', 'rgba(239, 68, 68, 0.15)');

    // Scales
    const xScale = d3.scalePoint<string>()
      .domain(dataPoints.map(d => d.timeLabel))
      .range([0, innerWidth]);

    const yMin = 98.0;
    const yMax = 100.2;
    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([innerHeight, 0]);

    // Draw Danger Zone Area below safetyThreshold
    const thresholdY = yScale(safetyThreshold);
    if (thresholdY < innerHeight) {
      g.append('rect')
        .attr('x', 0)
        .attr('y', thresholdY)
        .attr('width', innerWidth)
        .attr('height', innerHeight - thresholdY)
        .attr('fill', 'url(#danger-stripes)')
        .attr('opacity', 0.8);
    }

    // Grid lines (horizontal)
    const yGrid = d3.axisLeft(yScale)
      .ticks(5)
      .tickSize(-innerWidth)
      .tickFormat(() => '');

    g.append('g')
      .attr('class', 'grid')
      .call(yGrid)
      .selectAll('line')
      .attr('stroke', 'rgba(255, 255, 255, 0.07)')
      .attr('stroke-dasharray', '3,3');
    g.selectAll('.grid .domain').remove();

    // Area Generator
    const areaGen = d3.area<StabilityDataPoint>()
      .x(d => xScale(d.timeLabel) || 0)
      .y0(innerHeight)
      .y1(d => yScale(d.stabilityIndex))
      .curve(d3.curveMonotoneX);

    // Draw Area
    g.append('path')
      .datum(dataPoints)
      .attr('fill', 'url(#qsi-area-gradient)')
      .attr('d', areaGen);

    // Line Generator
    const lineGen = d3.line<StabilityDataPoint>()
      .x(d => xScale(d.timeLabel) || 0)
      .y(d => yScale(d.stabilityIndex))
      .curve(d3.curveMonotoneX);

    // Draw Line
    g.append('path')
      .datum(dataPoints)
      .attr('fill', 'none')
      .attr('stroke', 'url(#qsi-line-gradient)')
      .attr('stroke-width', 2.5)
      .attr('filter', breachAlertActive ? 'drop-shadow(0px 0px 10px rgba(239, 68, 68, 0.8))' : 'drop-shadow(0px 0px 8px rgba(16, 185, 129, 0.6))')
      .attr('d', lineGen);

    // Nominal 100% Stability Baseline
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(100))
      .attr('y2', yScale(100))
      .attr('stroke', 'rgba(52, 211, 153, 0.35)')
      .attr('stroke-dasharray', '4,4')
      .attr('stroke-width', 1);

    // Critical Safety Threshold Boundary Line (Visual Alarm Threshold)
    const thresholdLineG = g.append('g');
    thresholdLineG.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', thresholdY)
      .attr('y2', thresholdY)
      .attr('stroke', '#ef4444')
      .attr('stroke-dasharray', '6,3')
      .attr('stroke-width', 1.8)
      .attr('filter', 'drop-shadow(0px 0px 6px rgba(239, 68, 68, 0.8))');

    // Threshold Text Label on Right Edge
    thresholdLineG.append('text')
      .attr('x', innerWidth - 5)
      .attr('y', thresholdY - 6)
      .attr('text-anchor', 'end')
      .attr('fill', '#f87171')
      .attr('font-size', '9.5px')
      .attr('font-family', 'monospace')
      .attr('font-weight', 'bold')
      .text(`حد الأمان الحرج (${safetyThreshold}%) ⚠️`);

    // Draw Data Points / Threat Nodes / Breach Alerts
    dataPoints.forEach((d, idx) => {
      const cx = xScale(d.timeLabel) || 0;
      const cy = yScale(d.stabilityIndex);
      const isUnderThreshold = d.stabilityIndex < safetyThreshold;

      if (d.threatDetected || isUnderThreshold) {
        // Red threat / breach ping marker
        const pingG = g.append('g').attr('transform', `translate(${cx}, ${cy})`);
        
        pingG.append('circle')
          .attr('r', 10)
          .attr('fill', 'rgba(239, 68, 68, 0.35)')
          .attr('class', 'animate-ping');

        pingG.append('circle')
          .attr('r', 5)
          .attr('fill', '#ef4444')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 1.8);

        // Tooltip label above
        pingG.append('text')
          .attr('y', -14)
          .attr('text-anchor', 'middle')
          .attr('fill', '#fca5a5')
          .attr('font-size', '9px')
          .attr('font-family', 'monospace')
          .attr('font-weight', 'black')
          .text(isUnderThreshold ? '🚨 اختراق حد الأمان!' : 'صد تطفل 🛡️');
      } else if (idx === dataPoints.length - 1) {
        // Current Head Pulsing Indicator
        const headG = g.append('g').attr('transform', `translate(${cx}, ${cy})`);
        
        headG.append('circle')
          .attr('r', 6)
          .attr('fill', 'rgba(6, 182, 212, 0.4)')
          .attr('class', 'animate-ping');

        headG.append('circle')
          .attr('r', 3.5)
          .attr('fill', '#38bdf8')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 1.5);
      }
    });

    // Axes
    const xAxis = d3.axisBottom(xScale)
      .tickValues(dataPoints.filter((_, i) => i % 4 === 0).map(d => d.timeLabel));

    const yAxis = d3.axisLeft(yScale)
      .ticks(4)
      .tickFormat(d => `${d}%`);

    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    g.append('g')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    g.selectAll('.domain').attr('stroke', 'rgba(255, 255, 255, 0.1)');
    g.selectAll('.tick line').attr('stroke', 'rgba(255, 255, 255, 0.1)');

  }, [dataPoints, safetyThreshold, breachAlertActive]);

  // D3 Render: Radial Defense Dome Intrusion Radar
  useEffect(() => {
    if (!radarSvgRef.current) return;

    const svg = d3.select(radarSvgRef.current);
    svg.selectAll('*').remove();

    const size = radarSvgRef.current.clientWidth || 320;
    const center = size / 2;
    const radius = center - 30;

    const g = svg
      .attr('viewBox', `0 0 ${size} ${size}`)
      .append('g')
      .attr('transform', `translate(${center}, ${center})`);

    // Draw concentric radar rings
    const rings = [0.25, 0.5, 0.75, 1.0];
    rings.forEach(fraction => {
      g.append('circle')
        .attr('r', radius * fraction)
        .attr('fill', 'none')
        .attr('stroke', fraction === 1.0 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(255, 255, 255, 0.08)')
        .attr('stroke-width', fraction === 1.0 ? 1.5 : 1)
        .attr('stroke-dasharray', fraction === 1.0 ? 'none' : '3,3');
    });

    // Draw crosshair axes
    g.append('line')
      .attr('x1', -radius).attr('x2', radius)
      .attr('y1', 0).attr('y2', 0)
      .attr('stroke', 'rgba(255, 255, 255, 0.1)');

    g.append('line')
      .attr('x1', 0).attr('x2', 0)
      .attr('y1', -radius).attr('y2', radius)
      .attr('stroke', 'rgba(255, 255, 255, 0.1)');

    // Draw Sector Nodes and Labels
    sectors.forEach((sec) => {
      const rad = (sec.angle - 90) * (Math.PI / 180);
      const nodeX = radius * 0.85 * Math.cos(rad);
      const nodeY = radius * 0.85 * Math.sin(rad);

      // Line from center to sector node
      g.append('line')
        .attr('x1', 0).attr('y1', 0)
        .attr('x2', nodeX).attr('y2', nodeY)
        .attr('stroke', sec.status === 'ALERT' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(16, 185, 129, 0.25)')
        .attr('stroke-width', sec.status === 'ALERT' ? 2 : 1);

      // Sector Node Circle
      const nodeG = g.append('g').attr('transform', `translate(${nodeX}, ${nodeY})`);

      nodeG.append('circle')
        .attr('r', sec.status === 'ALERT' ? 12 : 10)
        .attr('fill', sec.status === 'ALERT' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(6, 182, 212, 0.2)')
        .attr('stroke', sec.status === 'ALERT' ? '#ef4444' : '#10b981')
        .attr('stroke-width', sec.status === 'ALERT' ? 2 : 1.5)
        .attr('class', sec.status === 'ALERT' ? 'animate-ping' : '');

      nodeG.append('circle')
        .attr('r', 4.5)
        .attr('fill', sec.status === 'ALERT' ? '#f87171' : '#34d399');

      // Outer sector label
      const labelX = (radius + 14) * Math.cos(rad);
      const labelY = (radius + 14) * Math.sin(rad);

      g.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('fill', sec.status === 'ALERT' ? '#f87171' : '#cbd5e1')
        .attr('font-size', '8.5px')
        .attr('font-family', 'monospace')
        .attr('font-weight', 'bold')
        .text(sec.name.split(':')[0]);
    });

    // Central Core Pulse
    const centerG = g.append('g');
    centerG.append('circle')
      .attr('r', 16)
      .attr('fill', breachAlertActive ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.15)')
      .attr('stroke', breachAlertActive ? '#ef4444' : '#10b981')
      .attr('stroke-width', 1.8)
      .attr('class', 'animate-pulse');

    centerG.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', '#ffffff')
      .attr('font-size', '10px')
      .text(breachAlertActive ? '🚨' : '⚛️');

  }, [sectors, breachAlertActive]);

  // Simulation: Trigger Threat Injection Stress Test (Breaching the Safety Boundary)
  const handleSimulateIntrusionAttack = () => {
    if (isSimulatingAttack) return;
    setIsSimulatingAttack(true);
    setBreachAlertActive(true);

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    // Inject threat via neural kernel security
    const attackPayload = "<script>hijack_quantum_kernel_state()</script> DROP TABLE memory_matrix; --";
    const sanitizeResult = neuralKernelSecurity.sanitizeAndWrap(attackPayload, 'AdminStressProbe');

    // Temporarily alert sector γ (Hexagram Gate) and α (Obsidian Wall)
    setSectors(prev => prev.map(sec => 
      sec.id === 'sec-c' || sec.id === 'sec-a'
        ? { ...sec, status: 'ALERT', threatHits: sec.threatHits + 1 }
        : sec
    ));

    // Force QSI below safety threshold to trigger visual safety alarm
    const breachedQSI = +(safetyThreshold - 0.45).toFixed(2);
    setCurrentQSI(breachedQSI);
    setCurrentCoherence(96.8);

    setLastBreachEvent({
      time: timeStr,
      value: breachedQSI,
      msg: `تجاوز الحد الآمن! هجوم مكثف على قطاع γ بقبة DragonDome (${breachedQSI}% < ${safetyThreshold}%)`,
      sector: 'القطاع γ: بوابة التوافق السداسي'
    });

    setDataPoints(prev => [
      ...prev.slice(1),
      {
        timestamp: now,
        timeLabel: timeStr,
        stabilityIndex: breachedQSI,
        coherenceRate: 96.8,
        intrusionPressure: 94.2,
        threatDetected: true,
        isBreach: true,
        eventNote: 'تجاوز حد الأمان - تفعيل بروتوكول الصد العاجل L4'
      }
    ]);

    setTotalIntrusionsBlocked(prev => prev + 1);
    setLastInterception({
      time: timeStr,
      type: sanitizeResult.threatDetected ? sanitizeResult.threatMessage || 'محاولة حقن كود خبيث' : 'اختراق عالي التردد',
      origin: 'محاكاة اختبار الضغط (Vector γ - Hexagram Gate)'
    });

    setInterceptLogs(prev => [
      {
        id: `BREACH-${Math.floor(1000 + Math.random() * 9000)}`,
        time: timeStr,
        msg: `[ALARM_TRIGGERED] هبوط مؤشر الاستقرار إلى ${breachedQSI}% دون الحد الآمن (${safetyThreshold}%) - إطلاق الدفاعات الفورية!`,
        status: 'BREACH'
      },
      {
        id: `INTRUDE-${Math.floor(1000 + Math.random() * 9000)}`,
        time: timeStr,
        msg: `[L4_DOME_INTERCEPT] تم حظر وتطهير هجوم حقن غير مصرح به فوراً واستعادة التوافق 100%`,
        status: 'BLOCKED'
      },
      ...prev.slice(0, 6)
    ]);

    // Restore sector status and clear breach alert after 4s
    setTimeout(() => {
      setSectors(prev => prev.map(sec => ({ ...sec, status: 'OPTIMAL' })));
      setIsSimulatingAttack(false);
      setBreachAlertActive(false);
      setCurrentQSI(99.98);
      setCurrentCoherence(98.9);
    }, 4000);
  };

  return (
    <div className="space-y-8 text-white font-arabic animate-fadeIn">
      
      {/* 🚨 VISUAL BREACH ALARM BANNER (Activated when QSI drops below safety boundary) */}
      {breachAlertActive && (
        <div className="bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 border-2 border-rose-500 p-6 rounded-[2.5rem] shadow-[0_0_60px_rgba(239,68,68,0.5)] animate-pulse flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-600 flex items-center justify-center text-3xl animate-bounce shadow-lg">
              🚨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-white text-rose-900">
                  CRITICAL BREACH DETECTED
                </span>
                <h4 className="text-xl font-black text-white">
                  تنبيه أمني بصري: تجاوز الحد الآمن لاستقرار النواة!
                </h4>
              </div>
              <p className="text-xs text-rose-200 mt-1 font-mono">
                مستوى الاستقرار الحالي ({currentQSI}%) هبط دون الحد الأدنى المعياري ({safetyThreshold}%). تم استنفار دروع قبة DragonDome L4 فوراً.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setBreachAlertActive(false);
                setCurrentQSI(99.98);
              }}
              className="px-5 py-2.5 bg-white text-rose-950 rounded-2xl text-xs font-black hover:bg-rose-100 transition-all shadow-md"
            >
              استعادة التوازن الفوري 🛡️
            </button>
          </div>
        </div>
      )}

      {/* Top Banner: Real-time Quantum Stability Index Header */}
      <div className={`bg-gradient-to-r ${breachAlertActive ? 'from-rose-950/80 via-black to-red-950/80 border-rose-500/50 shadow-[0_0_50px_rgba(239,68,68,0.3)]' : 'from-emerald-950/80 via-black to-cyan-950/80 border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)]'} border p-8 rounded-[3rem] relative overflow-hidden transition-all duration-500`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-cyan-500/10 pointer-events-none"></div>

        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl ${breachAlertActive ? 'bg-rose-500/20 border-rose-400 text-rose-400' : 'bg-emerald-500/20 border-emerald-400 text-emerald-400'} border flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-pulse`}>
              {breachAlertActive ? '⚠️' : '⚛️'}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-3xl font-black uppercase tracking-tight text-white">
                  مؤشر استقرار النواة الكوآنتومية <span className="text-emerald-400 font-mono">(QSI)</span>
                </h3>
                <span className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold ${breachAlertActive ? 'bg-rose-950 text-rose-300 border-rose-500/40 animate-pulse' : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'} border`}>
                  {breachAlertActive ? 'SECURITY ALARM ACTIVE' : 'D3 REALTIME ENGINE'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-mono">
                رصد لحظي لمستويات الترابط الكوآنتومي وحماية قبة أوبسيديان (L4 Obsidian Dome Defense)
              </p>
            </div>
          </div>

          {/* Action Trigger Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStreamActive(!streamActive)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold border transition-all flex items-center gap-2 ${
                streamActive 
                  ? 'bg-emerald-600/30 text-emerald-300 border-emerald-400 shadow-md' 
                  : 'bg-white/5 text-slate-400 border-white/10'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${streamActive ? 'animate-spin' : ''}`} />
              <span>{streamActive ? 'التدفق اللحظي: نشط' : 'التدفق متوقف'}</span>
            </button>

            <button
              onClick={handleSimulateIntrusionAttack}
              disabled={isSimulatingAttack}
              className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-2xl text-xs font-black shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 border border-rose-400 disabled:opacity-50"
            >
              {isSimulatingAttack ? (
                <>
                  <ShieldAlert className="w-4 h-4 animate-bounce" />
                  <span>جاري التصدي للهجوم...</span>
                </>
              ) : (
                <>
                  <Bug className="w-4 h-4" />
                  <span>محاكاة اختبار تطفل واختراق الحدود 🛡️</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Metrics Cards with Threshold Gauge */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Current QSI Score with Dynamic Danger Indicator */}
        <div className={`border p-6 rounded-[2.5rem] relative overflow-hidden backdrop-blur-xl transition-all duration-300 ${
          currentQSI < safetyThreshold 
            ? 'bg-rose-950/40 border-rose-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]' 
            : 'bg-black/60 border-emerald-500/20'
        }`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>معدل الاستقرار (QSI)</span>
            <Activity className={`w-4 h-4 ${currentQSI < safetyThreshold ? 'text-rose-400 animate-bounce' : 'text-emerald-400'}`} />
          </div>
          <div className={`text-4xl font-black font-mono tracking-tight ${
            currentQSI < safetyThreshold ? 'text-rose-400' : 'text-emerald-400'
          }`}>
            {currentQSI}%
          </div>
          <span className={`text-[10px] font-mono block mt-2 ${
            currentQSI < safetyThreshold ? 'text-rose-300 font-bold' : 'text-emerald-500/80'
          }`}>
            {currentQSI < safetyThreshold ? '⚠️ هبوط دون الحد الآمن!' : '✓ الانحراف المعياري: < 0.002%'}
          </span>
        </div>

        {/* Metric 2: Safety Threshold Controller */}
        <div className="bg-black/60 border border-amber-500/20 p-6 rounded-[2.5rem] relative overflow-hidden backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>الحد الأدنى الآمن (Threshold)</span>
            <Sliders className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-4xl font-black text-amber-400 font-mono tracking-tight">
              {safetyThreshold}%
            </div>
            <div className="flex gap-1">
              {[98.5, 99.0, 99.5].map(val => (
                <button
                  key={val}
                  onClick={() => setSafetyThreshold(val)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                    safetyThreshold === val 
                      ? 'bg-amber-500 text-black' 
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>
          <span className="text-[10px] text-amber-400/80 font-mono block mt-2">
            ✓ يطلق التنبيه البصري عند تجاوزه
          </span>
        </div>

        {/* Metric 3: Total Intercepted Dome Intrusions */}
        <div className="bg-black/60 border border-rose-500/20 p-6 rounded-[2.5rem] relative overflow-hidden backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>محاولات التطفل المحظورة</span>
            <Shield className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-4xl font-black text-rose-400 font-mono tracking-tight">
            {totalIntrusionsBlocked}
          </div>
          <span className="text-[10px] text-rose-400/80 font-mono block mt-2">
            ✓ تم التطهير على مستوى النواة L4
          </span>
        </div>

        {/* Metric 4: Dome Defense Vector Status */}
        <div className="bg-black/60 border border-purple-500/20 p-6 rounded-[2.5rem] relative overflow-hidden backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>حالة قطاعات القبة</span>
            <Lock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-4xl font-black text-purple-300 font-mono tracking-tight">
            6 / 6
          </div>
          <span className="text-[10px] text-purple-400/80 font-mono block mt-2">
            ✓ كافة القطاعات في وضع التحصين الكامل
          </span>
        </div>

      </div>

      {/* Main Charts Row: D3 Waveform + D3 Dome Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: D3 Timeline Waveform of Quantum Stability */}
        <div className="lg:col-span-2 bg-black/80 border border-emerald-500/20 p-8 rounded-[3rem] shadow-2xl space-y-4 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${breachAlertActive ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-emerald-500/10 text-emerald-400'}`}>
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-black text-white">
                  رسم بياني لحظي لمؤشر استقرار النواة الكوآنتومية (D3 Waveform)
                </h4>
                <p className="text-xs text-slate-400 font-mono">
                  تحديث مباشر كل 3 ثوانٍ مع خط تنبيه بصري أحمر للحد الآمن ({safetyThreshold}%)
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="text-slate-300">مستوى QSI</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-1 bg-rose-500"></span>
                <span className="text-rose-400">خط الحد الآمن ({safetyThreshold}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
                <span className="text-rose-400 font-bold">تجاوز / صد تطفل</span>
              </div>
            </div>
          </div>

          {/* D3 Waveform SVG Canvas */}
          <div className="w-full h-[290px] relative">
            <svg ref={waveformSvgRef} className="w-full h-full" />
          </div>

          {/* Chart Footer with Frequency Tuning */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span>ضبط تردد رنين القبة الكوآنتومية:</span>
              <div className="flex gap-1.5">
                {[528, 963, 432].map(freq => (
                  <button
                    key={freq}
                    onClick={() => setSelectedFrequency(freq)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      selectedFrequency === freq
                        ? 'bg-emerald-500 text-black font-bold'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {freq} Hz
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span>البروتوكول: <strong className="text-emerald-400">WebCrypto Quantum Zero-Trust</strong></span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: D3 Defense Dome Radial Radar */}
        <div className={`bg-black/80 border ${breachAlertActive ? 'border-rose-500/40 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'border-cyan-500/20'} p-8 rounded-[3rem] shadow-2xl flex flex-col justify-between space-y-4 transition-all duration-300`}>
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Shield className={`w-5 h-5 ${breachAlertActive ? 'text-rose-400' : 'text-cyan-400'}`} />
              <h4 className="text-base font-black text-white">رادار قطاعات القبة الستة</h4>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
              breachAlertActive ? 'text-rose-400 bg-rose-950 border-rose-500/40 animate-pulse' : 'text-cyan-400 bg-cyan-950 border-cyan-500/30'
            }`}>
              {breachAlertActive ? 'ALERT: SECTOR BREACH' : 'L4 Obsidian'}
            </span>
          </div>

          {/* D3 Radar SVG Canvas */}
          <div className="w-full flex items-center justify-center my-2">
            <div className="w-full max-w-[280px] aspect-square">
              <svg ref={radarSvgRef} className="w-full h-full" />
            </div>
          </div>

          {/* Sectors Quick Status List */}
          <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-white/5">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>القطاع الأكثر استهدافاً:</span>
              <span className="text-amber-400 font-bold">α (Obsidian) - 41 صد</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>درع التوافق السداسي (γ):</span>
              <span className={`${breachAlertActive ? 'text-rose-400 animate-pulse' : 'text-emerald-400'} font-bold`}>
                {breachAlertActive ? 'Defending Attack' : '99.8% Coherence'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Real-time Threat Logs & Interception Audit Table */}
      <div className="bg-black/80 border border-white/10 p-8 rounded-[3rem] space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-black text-white">سجل اعتراض ومراقبة التطفل والإنذارات اللحظية</h4>
              <p className="text-xs text-slate-400 font-mono">
                بيان فوري لكافة التدفقات التي تم فحصها وتطهيرها أو تجاوزت حدود الأمان
              </p>
            </div>
          </div>

          {lastInterception && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs font-mono text-rose-300">
              <span>آخر تحييد: <strong>{lastInterception.type}</strong> ({lastInterception.time})</span>
            </div>
          )}
        </div>

        <div className="space-y-2 font-mono text-xs max-h-48 overflow-y-auto no-scrollbar">
          {interceptLogs.map((log) => (
            <div
              key={log.id}
              className={`p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 border ${
                log.status === 'BREACH'
                  ? 'bg-red-950/40 border-red-500/50 text-red-200 animate-pulse'
                  : log.status === 'BLOCKED'
                  ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  : log.status === 'WARN'
                  ? 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                  : 'bg-white/5 border-white/5 text-emerald-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${
                  log.status === 'BREACH' ? 'bg-red-500 animate-bounce' : log.status === 'BLOCKED' ? 'bg-rose-400 animate-ping' : 'bg-emerald-400'
                }`}></span>
                <span className="text-slate-400">[{log.time}]</span>
                <strong className="text-white">{log.id}:</strong>
                <span>{log.msg}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                log.status === 'BREACH'
                  ? 'bg-red-600 text-white animate-pulse'
                  : log.status === 'BLOCKED' 
                  ? 'bg-rose-600 text-white' 
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
              }`}>
                {log.status === 'BREACH' ? '🚨 BREACH ALARM' : log.status === 'BLOCKED' ? 'NEUTRALIZED' : 'SECURE'}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
