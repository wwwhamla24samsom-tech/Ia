import { useEffect, useState } from 'react';

export interface ThreadState {
  id: number;
  label: string;
  usage: number; // 0 - 100%
  freqGhz: number;
  tempC: number;
  status: 'optimal' | 'high' | 'critical';
}

export interface CpuTelemetryData {
  threads: ThreadState[];
  avgUsage: number; // 0 - 100 %
  peakUsage: number; // 0 - 100 %
  pulseIntensity: number; // 0.0 to 1.0
  pulseSpeed: number; // animation duration in seconds (1.8s down to 0.4s)
  glowColor: string; // rgba or hex
  accentColor: string; // emerald, cyan, amber, rose
  temperature: number; // average temp °C
  frequencyGhz: number; // average GHz
  stressActive: boolean;
  calibrationActive: boolean;
  timestamp: number;
}

type TelemetryListener = (data: CpuTelemetryData) => void;

class CpuTelemetryEngine {
  private threads: ThreadState[] = [];
  private listeners: Set<TelemetryListener> = new Set();
  private timer: any = null;
  private stressActive = false;
  private calibrationActive = false;
  private currentData: CpuTelemetryData;

  constructor() {
    this.threads = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      label: `Core ${Math.floor(i / 2)} / T${i}`,
      usage: Math.floor(Math.random() * 30) + 18,
      freqGhz: +(3.8 + Math.random() * 0.4).toFixed(2),
      tempC: Math.floor(Math.random() * 10) + 44,
      status: 'optimal'
    }));

    this.currentData = this.computeTelemetry(this.threads);
    this.startHeartbeat();
  }

  private computeTelemetry(threads: ThreadState[]): CpuTelemetryData {
    const avg = Math.round(threads.reduce((acc, curr) => acc + curr.usage, 0) / threads.length);
    const peak = Math.max(...threads.map(u => u.usage));
    const avgTemp = Math.round(threads.reduce((acc, curr) => acc + curr.tempC, 0) / threads.length);
    const avgFreq = +(threads.reduce((acc, curr) => acc + curr.freqGhz, 0) / threads.length).toFixed(2);

    // Dynamic glow & pulse intensity (0.15 base to 1.0 max)
    const normalizedLoad = Math.min(1, Math.max(0.1, avg / 100));
    const pulseIntensity = +(0.2 + normalizedLoad * 0.8).toFixed(3);
    
    // Animation duration: 2.0s when idle, 0.4s when under heavy load
    const pulseSpeed = +(Math.max(0.35, 2.0 - normalizedLoad * 1.5)).toFixed(2);

    // Glow color mapping based on thread utilization
    let glowColor = 'rgba(16, 185, 129, 0.45)'; // emerald
    let accentColor = 'emerald';
    if (peak > 88 || avg > 80) {
      glowColor = 'rgba(244, 63, 94, 0.75)'; // rose
      accentColor = 'rose';
    } else if (peak > 70 || avg > 60) {
      glowColor = 'rgba(245, 158, 11, 0.65)'; // amber
      accentColor = 'amber';
    } else if (avg > 35) {
      glowColor = 'rgba(6, 182, 212, 0.55)'; // cyan
      accentColor = 'cyan';
    }

    return {
      threads,
      avgUsage: avg,
      peakUsage: peak,
      pulseIntensity,
      pulseSpeed,
      glowColor,
      accentColor,
      temperature: avgTemp,
      frequencyGhz: avgFreq,
      stressActive: this.stressActive,
      calibrationActive: this.calibrationActive,
      timestamp: Date.now()
    };
  }

  private startHeartbeat() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      this.tick();
    }, 400);
  }

  private tick() {
    this.threads = this.threads.map(t => {
      let baseDelta = (Math.random() * 14 - 7);
      if (this.stressActive) baseDelta += 24;
      if (this.calibrationActive) baseDelta -= 12;

      const newUsage = Math.max(8, Math.min(100, Math.round(t.usage + baseDelta)));
      const newFreq = +(3.4 + (newUsage / 100) * 1.4 + (Math.random() * 0.08 - 0.04)).toFixed(2);
      const newTemp = Math.round(38 + (newUsage / 100) * 44 + (Math.random() * 2 - 1));

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

    this.currentData = this.computeTelemetry(this.threads);
    this.notify();
  }

  public setExternalThreads(updatedThreads: ThreadState[], stress = false, calibration = false) {
    this.threads = updatedThreads;
    this.stressActive = stress;
    this.calibrationActive = calibration;
    this.currentData = this.computeTelemetry(this.threads);
    this.notify();
  }

  public setStressMode(active: boolean) {
    this.stressActive = active;
    this.tick();
  }

  public setCalibrationMode(active: boolean) {
    this.calibrationActive = active;
    this.tick();
  }

  public getCurrent(): CpuTelemetryData {
    return this.currentData;
  }

  public subscribe(listener: TelemetryListener): () => void {
    this.listeners.add(listener);
    listener(this.currentData);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    queueMicrotask(() => {
      for (const listener of this.listeners) {
        try {
          listener(this.currentData);
        } catch (err) {
          console.error('Telemetry subscriber error:', err);
        }
      }
    });
  }
}

export const cpuTelemetry = new CpuTelemetryEngine();

export function useCpuTelemetry(): CpuTelemetryData {
  const [data, setData] = useState<CpuTelemetryData>(cpuTelemetry.getCurrent());

  useEffect(() => {
    const unsubscribe = cpuTelemetry.subscribe((latest) => {
      setData(latest);
    });
    return unsubscribe;
  }, []);

  return data;
}
