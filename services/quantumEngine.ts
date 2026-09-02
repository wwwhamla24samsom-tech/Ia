/**
 * ⚡ SOVEREIGN QUANTUM COMPUTING ENGINE & HARDWARE REGISTERS (QPU-512 CORE)
 * محرك الحوسبة الكمومية السيادي ونواة المعالجة الكمومية المدمجة
 */

export interface QubitState {
  index: number;
  alpha: number; // Amplitude |0>
  beta: number;  // Amplitude |1>
  phase: number; // in radians
  entangledWith: number | null;
  probabilityOne: number;
}

export type QuantumGateType = 'H' | 'X' | 'Y' | 'Z' | 'S' | 'T' | 'CNOT' | 'SWAP' | 'U528';

export interface QuantumCircuitStep {
  gate: QuantumGateType;
  targetQubit: number;
  controlQubit?: number;
  parameter?: number;
}

export interface QuantumRegisters {
  QAX: string; // Quantum Accumulator X
  QBX: string; // Quantum Base X
  QCX: string; // Quantum Counter X (528Hz Sync)
  QDX: string; // Quantum Data X
  QEX: string; // Quantum Entanglement Register
  QFX: string; // Quantum Flux Control
  QFLAGS: string; // Quantum ALU Flags
  CYCLE: number;
  COHERENCE: number;
  TEMPERATURE_mK: number;
  ENTANGLED_PAIRS: number;
}

export interface QuantumExecutionResult {
  circuitName: string;
  qubitCount: number;
  executionTimeMs: number;
  stateVector: number[];
  probabilities: number[];
  measuredState: string;
  coherenceScore: number;
  entropyHex: string;
  telemetryLog: string[];
}

export class QuantumSovereignEngine {
  private static instance: QuantumSovereignEngine;

  private qubitCount: number = 512;
  private activeSimulatedQubits: number = 16; // for direct vector simulation
  private stateVector: number[] = [];
  private qubits: QubitState[] = [];
  private coherence: number = 99.985;
  private temperatureMillikelvin: number = 14.2; // 14.2 mK Superconducting Cryostat
  private cycleCounter: number = 5280000;
  private listeners: Set<(registers: QuantumRegisters, stateVector: number[]) => void> = new Set();
  private audioContext: AudioContext | null = null;
  private timer: any = null;

  private registers: QuantumRegisters = {
    QAX: '0x7F00AA12',
    QBX: '0x00FF889C',
    QCX: '0x528000FF',
    QDX: '0x1337C0DE',
    QEX: '0xDEADBEEF',
    QFX: '0x52852852',
    QFLAGS: 'COHERENT | SUPERPOSITION | ENTANGLED | ZERO_ERR',
    CYCLE: 5280000,
    COHERENCE: 99.985,
    TEMPERATURE_mK: 14.2,
    ENTANGLED_PAIRS: 256
  };

  private constructor() {
    this.initializeQubits();
    this.startQuantumClock();
  }

  public static getInstance(): QuantumSovereignEngine {
    if (!QuantumSovereignEngine.instance) {
      QuantumSovereignEngine.instance = new QuantumSovereignEngine();
    }
    return QuantumSovereignEngine.instance;
  }

  private initializeQubits() {
    const dim = Math.pow(2, Math.min(this.activeSimulatedQubits, 8)); // 256 states
    this.stateVector = new Array(dim).fill(0);
    this.stateVector[0] = 1.0; // Ground state |0...0>

    this.qubits = [];
    for (let i = 0; i < this.activeSimulatedQubits; i++) {
      this.qubits.push({
        index: i,
        alpha: 1.0,
        beta: 0.0,
        phase: 0,
        entangledWith: i % 2 === 0 ? i + 1 : i - 1,
        probabilityOne: 0.0
      });
    }

    // Apply Hadamard to first 4 qubits for default superposition
    this.applyHadamard(0);
    this.applyHadamard(1);
    this.applyHadamard(2);
    this.applyEntanglement528(0, 1);
  }

  private startQuantumClock() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.cycleCounter += 528;
      // Slight cryogenic thermal jitter simulation
      const jitter = (Math.random() - 0.5) * 0.004;
      this.coherence = Math.min(99.999, Math.max(99.900, this.coherence + jitter));
      
      const tempJitter = (Math.random() - 0.5) * 0.05;
      this.temperatureMillikelvin = Math.max(12.0, Math.min(16.5, this.temperatureMillikelvin + tempJitter));

      const hexCycle = (this.cycleCounter % 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0');
      this.registers = {
        ...this.registers,
        QAX: `0x7F${Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0')}`,
        QCX: `0x5280${(this.cycleCounter % 0xFFFF).toString(16).toUpperCase().padStart(4, '0')}`,
        CYCLE: this.cycleCounter,
        COHERENCE: Number(this.coherence.toFixed(3)),
        TEMPERATURE_mK: Number(this.temperatureMillikelvin.toFixed(1))
      };

      this.notifyListeners();
    }, 250);
  }

  public subscribe(callback: (registers: QuantumRegisters, stateVector: number[]) => void): () => void {
    this.listeners.add(callback);
    callback(this.registers, this.stateVector);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(cb => {
      try {
        cb(this.registers, this.stateVector);
      } catch (err) {
        console.error('QuantumEngine listener error:', err);
      }
    });
  }

  public getRegisters(): QuantumRegisters {
    return { ...this.registers };
  }

  public getStateVector(): number[] {
    return [...this.stateVector];
  }

  public getQubits(): QubitState[] {
    return [...this.qubits];
  }

  public getQubitCount(): number {
    return this.qubitCount;
  }

  public setQubitCount(count: number) {
    this.qubitCount = count;
    this.registers.ENTANGLED_PAIRS = Math.floor(count / 2);
    this.notifyListeners();
  }

  public setCryoTemperature(targetmK: number) {
    this.temperatureMillikelvin = targetmK;
    this.coherence = Math.min(99.999, 100 - (targetmK / 1000));
    this.notifyListeners();
  }

  /**
   * تطبق بوابة هادامارد (Hadamard Gate) لوضع الكيوبت في حالة تراكب كمي فائق
   */
  public applyHadamard(qubitIndex: number) {
    if (qubitIndex < 0 || qubitIndex >= this.qubits.length) return;
    const q = this.qubits[qubitIndex];
    const prevA = q.alpha;
    const prevB = q.beta;
    const invSqrt2 = 1 / Math.SQRT2;

    q.alpha = (prevA + prevB) * invSqrt2;
    q.beta = (prevA - prevB) * invSqrt2;
    q.probabilityOne = Math.pow(q.beta, 2);

    this.recomputeStateVector();
    this.playQuantumTone(528, 0.08);
  }

  /**
   * بوابة Pauli-X (عكس الحالة الكمية NOT)
   */
  public applyPauliX(qubitIndex: number) {
    if (qubitIndex < 0 || qubitIndex >= this.qubits.length) return;
    const q = this.qubits[qubitIndex];
    const temp = q.alpha;
    q.alpha = q.beta;
    q.beta = temp;
    q.probabilityOne = Math.pow(q.beta, 2);

    this.recomputeStateVector();
    this.playQuantumTone(432, 0.08);
  }

  /**
   * بوابة Pauli-Z (عكس الطور Phase Flip)
   */
  public applyPauliZ(qubitIndex: number) {
    if (qubitIndex < 0 || qubitIndex >= this.qubits.length) return;
    const q = this.qubits[qubitIndex];
    q.beta = -q.beta;
    this.recomputeStateVector();
    this.playQuantumTone(639, 0.08);
  }

  /**
   * بوابة التشابك الكمي المزدوج CNOT (Controlled-NOT)
   */
  public applyCNOT(controlIndex: number, targetIndex: number) {
    if (controlIndex >= this.qubits.length || targetIndex >= this.qubits.length) return;
    const ctrl = this.qubits[controlIndex];
    const target = this.qubits[targetIndex];

    if (ctrl.probabilityOne > 0.4) {
      this.applyPauliX(targetIndex);
    }
    ctrl.entangledWith = targetIndex;
    target.entangledWith = controlIndex;

    this.recomputeStateVector();
    this.playQuantumTone(741, 0.1);
  }

  /**
   * بوابة الرنين والتشابك التوافقي الفائق 528Hz Solfeggio Entangler
   */
  public applyEntanglement528(q1: number, q2: number) {
    if (q1 >= this.qubits.length || q2 >= this.qubits.length) return;
    this.applyHadamard(q1);
    this.applyCNOT(q1, q2);
    this.qubits[q1].phase = Math.PI / 4;
    this.qubits[q2].phase = Math.PI / 4;
    this.recomputeStateVector();
    this.playQuantumTone(528, 0.2);
  }

  /**
   * قياس الحالة الكمية وانهيار التراكب (Measurement Collapse)
   */
  public measureAll(): { binaryResult: string; decimalValue: number; hexValue: string } {
    let binary = '';
    this.qubits.forEach(q => {
      const bit = Math.random() < q.probabilityOne ? '1' : '0';
      binary += bit;
      if (bit === '1') {
        q.alpha = 0;
        q.beta = 1;
        q.probabilityOne = 1;
      } else {
        q.alpha = 1;
        q.beta = 0;
        q.probabilityOne = 0;
      }
    });

    const decimalValue = parseInt(binary.substring(0, 32), 2) || 0;
    const hexValue = '0x' + decimalValue.toString(16).toUpperCase().padStart(8, '0');

    this.recomputeStateVector();
    this.playQuantumTone(852, 0.15);

    return { binaryResult: binary, decimalValue, hexValue };
  }

  /**
   * تنفيذ دارة كمومية كاملة (Quantum Circuit Pipeline)
   */
  public async executeCircuit(
    circuitName: string,
    steps: QuantumCircuitStep[]
  ): Promise<QuantumExecutionResult> {
    const startTime = performance.now();
    const logs: string[] = [];

    logs.push(`[QPU_INIT] Starting Quantum Execution Pipeline: "${circuitName}"`);
    logs.push(`[QPU_CHIP] Superconducting Coherence: ${this.coherence}% @ ${this.temperatureMillikelvin}mK`);

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      switch (step.gate) {
        case 'H':
          this.applyHadamard(step.targetQubit);
          logs.push(`[STEP ${i + 1}] Applied Hadamard H|q${step.targetQubit}⟩ -> Superposition State`);
          break;
        case 'X':
          this.applyPauliX(step.targetQubit);
          logs.push(`[STEP ${i + 1}] Applied Pauli-X |q${step.targetQubit}⟩ -> Quantum NOT Bit-flip`);
          break;
        case 'Z':
          this.applyPauliZ(step.targetQubit);
          logs.push(`[STEP ${i + 1}] Applied Pauli-Z |q${step.targetQubit}⟩ -> Quantum Phase-flip`);
          break;
        case 'CNOT':
          if (step.controlQubit !== undefined) {
            this.applyCNOT(step.controlQubit, step.targetQubit);
            logs.push(`[STEP ${i + 1}] Applied CNOT Control:|q${step.controlQubit}⟩ Target:|q${step.targetQubit}⟩ -> Bell State Entanglement`);
          }
          break;
        case 'U528':
          if (step.controlQubit !== undefined) {
            this.applyEntanglement528(step.controlQubit, step.targetQubit);
            logs.push(`[STEP ${i + 1}] Applied 528Hz Solfeggio Resonant Matrix (|q${step.controlQubit}⟩ ⊗ |q${step.targetQubit}⟩)`);
          }
          break;
      }
    }

    const measurement = this.measureAll();
    const duration = Math.max(1, Math.round(performance.now() - startTime));

    const entropyHex = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();

    logs.push(`[MEASURE] Wavefunction Collapsed: |${measurement.binaryResult}⟩ -> ${measurement.hexValue}`);
    logs.push(`[SUCCESS] Circuit executed in ${duration}ms with Fidelity ${(this.coherence * 0.999).toFixed(3)}%`);

    return {
      circuitName,
      qubitCount: this.qubitCount,
      executionTimeMs: duration,
      stateVector: [...this.stateVector],
      probabilities: this.qubits.map(q => q.probabilityOne),
      measuredState: measurement.hexValue,
      coherenceScore: this.coherence,
      entropyHex,
      telemetryLog: logs
    };
  }

  private recomputeStateVector() {
    const dim = Math.min(256, Math.pow(2, 8));
    const newVector: number[] = new Array(dim).fill(0);

    // Calculate approximate tensor product amplitudes for first 8 qubits
    for (let i = 0; i < dim; i++) {
      let amp = 1.0;
      for (let bit = 0; bit < 8; bit++) {
        const isOne = ((i >> bit) & 1) === 1;
        const q = this.qubits[bit] || { alpha: 1, beta: 0 };
        amp *= isOne ? q.beta : q.alpha;
      }
      newVector[i] = Math.abs(amp);
    }

    // Normalize
    const sumSq = newVector.reduce((acc, v) => acc + v * v, 0) || 1;
    const norm = Math.sqrt(sumSq);
    this.stateVector = newVector.map(v => v / norm);

    this.notifyListeners();
  }

  private playQuantumTone(freq: number, duration: number) {
    try {
      if (typeof window === 'undefined') return;
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) this.audioContext = new AudioCtx();
      }
      if (!this.audioContext || this.audioContext.state === 'suspended') return;

      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);

      gain.gain.setValueAtTime(0.04, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.start();
      osc.stop(this.audioContext.currentTime + duration);
    } catch {
      // Ignore audio synthesis errors
    }
  }

  /**
   * إعادة ضبط وتبريد النواة الكوآنتومية إلى الحالة الأرضية |0⟩
   */
  public resetCryoCore() {
    this.initializeQubits();
    this.coherence = 99.999;
    this.temperatureMillikelvin = 12.0;
    this.registers.QFLAGS = 'ZERO_ERR | GROUND_STATE | COHERENT';
    this.notifyListeners();
    this.playQuantumTone(528, 0.3);
  }
}

export const quantumSovereignEngine = QuantumSovereignEngine.getInstance();
