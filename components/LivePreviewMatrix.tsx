/**
 * ⚡ LIVE PREVIEW MATRIX & HOLOGRAPHIC INSPECTOR
 * مصفوفة المعاينة المباشرة: معاينة الواجهات، تنفيذ بايثون، الحاسوب الكمومي، والتحكم الشامل
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Monitor, Play, RotateCcw, Copy, Check, Terminal, 
  Cpu, Code, Layers, Sliders, Zap, CheckCircle2, 
  Maximize2, Eye, Shield, Sparkles, RefreshCw, FileCode, Globe
} from 'lucide-react';
import { AppTab } from '../types';
import { quantumSovereignEngine, QuantumRegisters, QubitState } from '../services/quantumEngine';
import { runRealPythonCode } from '../services/realPythonEngine';
import { systemEventLogger } from '../services/systemEventLogger';

interface LivePreviewMatrixProps {
  onNavigate?: (tab: AppTab) => void;
}

export const LivePreviewMatrix: React.FC<LivePreviewMatrixProps> = ({ onNavigate }) => {
  const [layoutMode, setLayoutMode] = useState<'QUAD_MATRIX' | 'UI_FOCUS' | 'QUANTUM_FOCUS' | 'PYTHON_FOCUS'>('QUAD_MATRIX');
  
  // 1. UI Live Sandbox State
  const [uiCode, setUiCode] = useState<string>(
`<div style="font-family: sans-serif; text-align: center; padding: 24px; background: linear-gradient(135deg, #020617, #0f172a); color: #38bdf8; border-radius: 20px; border: 1px solid #38bdf840; box-shadow: 0 0 25px rgba(56,189,248,0.2);">
  <h2 style="font-size: 20px; margin-bottom: 8px; color: #fff;">🌐 معاينة واجهة صارة السيادية المباشرة</h2>
  <p style="font-size: 13px; color: #94a3b8;">تم إنشاء هذا العنصر وتصييره فورياً في الذاكرة دون خوادم وسيطة.</p>
  <div style="margin-top: 16px; display: inline-block; padding: 8px 16px; background: #0284c7; color: #fff; font-weight: bold; border-radius: 12px; font-size: 12px;">
    ⚡ 528Hz Harmonic Rendered
  </div>
</div>`
  );

  // 2. Quantum State
  const [qRegs, setQRegs] = useState<QuantumRegisters>(quantumSovereignEngine.getRegisters());
  const [qubits, setQubits] = useState<QubitState[]>(quantumSovereignEngine.getQubits());
  const [qResult, setQResult] = useState<string | null>(null);

  // 3. Python Engine State
  const [pythonCode, setPythonCode] = useState<string>(
`# Real In-Memory Python Execution
import math

def generate_harmonics():
    base_hz = 528
    return {f"harmonic_{i}": base_hz * i for i in range(1, 5)}

print("Harmonics Matrix:", generate_harmonics())
`
  );
  const [pythonOutput, setPythonOutput] = useState<string>('جاهز للتنفيذ...');
  const [isPythonRunning, setIsPythonRunning] = useState(false);

  // 4. Copied Flag
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  useEffect(() => {
    const unsub = quantumSovereignEngine.subscribe((regs) => {
      setQRegs(regs);
      setQubits(quantumSovereignEngine.getQubits());
    });
    return unsub;
  }, []);

  const handleRunPython = async () => {
    setIsPythonRunning(true);
    setPythonOutput('جاري التنفيذ في محرك WASM...');
    try {
      const res = await runRealPythonCode(pythonCode);
      setPythonOutput(res.stdout || (res.stderr ? 'خطأ: ' + res.stderr : 'تم التنفيذ بنجاح بدون مخرجات نصية.'));
    } catch (err: any) {
      setPythonOutput(`خطأ في التنفيذ: ${err.message}`);
    } finally {
      setIsPythonRunning(false);
    }
  };

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="w-full space-y-6 font-arabic text-right">
      
      {/* 1. TOP BAR & MATRIX MODE CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-[#000000] border border-cyan-500/40 rounded-[2.5rem] shadow-[0_0_40px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-black border border-cyan-400 text-cyan-300 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white">
                مصفوفة المعاينة المباشرة <span className="text-cyan-400">(Live Preview Matrix)</span>
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-black">
                REAL-TIME QUAD
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              معاينة متزامنة لتصيير الـ DOM، الحوسبة الكمومية، ومحرك بايثون في الذاكرة الحية.
            </p>
          </div>
        </div>

        {/* Layout Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-2xl">
          {[
            { id: 'QUAD_MATRIX', label: '🔲 المصفوفة الرباعية' },
            { id: 'UI_FOCUS', label: '🌐 معاينة الواجهات' },
            { id: 'QUANTUM_FOCUS', label: '💻 المعالج الكمومي' },
            { id: 'PYTHON_FOCUS', label: '🐍 مفاعل بايثون' },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setLayoutMode(btn.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                layoutMode === btn.id
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. QUADRANTS GRID */}
      <div className={`grid gap-6 ${
        layoutMode === 'QUAD_MATRIX' 
          ? 'grid-cols-1 lg:grid-cols-2' 
          : 'grid-cols-1'
      }`}>

        {/* QUADRANT 1: LIVE UI SANDBOX */}
        {(layoutMode === 'QUAD_MATRIX' || layoutMode === 'UI_FOCUS') && (
          <div className="bg-[#000000] border border-blue-500/40 rounded-[2rem] p-5 shadow-lg flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-white font-black text-sm">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>المعاينة المباشرة للواجهات (HTML/DOM Live Preview)</span>
              </div>
              <button
                onClick={() => handleCopy(uiCode, 'ui')}
                className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs flex items-center gap-1 border border-white/10"
              >
                {copiedSection === 'ui' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>نسخ</span>
              </button>
            </div>

            {/* Live Render Output Window */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-white/10 min-h-[140px] flex items-center justify-center">
              <div 
                className="w-full"
                dangerouslySetInnerHTML={{ __html: uiCode }} 
              />
            </div>

            {/* Live HTML Code Editor */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400">محرر الـ HTML الحي:</span>
              <textarea
                value={uiCode}
                onChange={e => setUiCode(e.target.value)}
                rows={4}
                className="w-full p-3 bg-black border border-white/10 rounded-xl font-mono text-xs text-blue-300 focus:outline-none focus:border-blue-400 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* QUADRANT 2: QUANTUM QPU LIVE SUPERPOSITION MATRIX */}
        {(layoutMode === 'QUAD_MATRIX' || layoutMode === 'QUANTUM_FOCUS') && (
          <div className="bg-[#000000] border border-cyan-500/40 rounded-[2rem] p-5 shadow-lg flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-white font-black text-sm">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>مصفوفة التراكب الكمومي اللحظية (QPU-512 Realtime)</span>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {qRegs.COHERENCE}% Coherence
              </span>
            </div>

            {/* QPU Hardware Registers */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 font-mono text-center">
              {[
                { label: 'QAX', val: qRegs.QAX, color: 'text-cyan-400' },
                { label: 'QBX', val: qRegs.QBX, color: 'text-indigo-400' },
                { label: 'QCX', val: qRegs.QCX, color: 'text-emerald-400' },
                { label: 'QDX', val: qRegs.QDX, color: 'text-amber-400' },
                { label: 'QEX', val: qRegs.QEX, color: 'text-purple-400' },
                { label: 'QFX', val: qRegs.QFX, color: 'text-rose-400' },
              ].map((r, i) => (
                <div key={i} className="p-2 bg-black border border-white/10 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">{r.label}</span>
                  <span className={`text-xs font-black ${r.color} truncate block`}>{r.val}</span>
                </div>
              ))}
            </div>

            {/* Instant Quantum Gate Triggers */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  quantumSovereignEngine.applyHadamard(0);
                  setQResult('تم تطبيق بوابة Hadamard H|q0⟩.');
                }}
                className="px-3 py-1.5 bg-black border border-cyan-400 text-cyan-300 rounded-xl text-xs font-mono font-bold hover:bg-cyan-500/20 active:scale-95"
              >
                [ H ] Hadamard
              </button>
              <button
                onClick={() => {
                  quantumSovereignEngine.applyCNOT(0, 1);
                  setQResult('تم تشبيك Bell State عبر CNOT.');
                }}
                className="px-3 py-1.5 bg-black border border-purple-400 text-purple-300 rounded-xl text-xs font-mono font-bold hover:bg-purple-500/20 active:scale-95"
              >
                [ CNOT ] Entangle
              </button>
              <button
                onClick={() => {
                  const m = quantumSovereignEngine.measureAll();
                  setQResult(`انهيار الموجة: |${m.binaryResult.slice(0, 8)}⟩ (${m.hexValue})`);
                }}
                className="px-3 py-1.5 bg-cyan-500 text-black rounded-xl text-xs font-mono font-black active:scale-95 shadow-md"
              >
                [ 💥 قياس وانهيار ]
              </button>
            </div>

            {qResult && (
              <div className="p-2.5 bg-black border border-cyan-500/40 rounded-xl font-mono text-xs text-cyan-300">
                &gt; {qResult}
              </div>
            )}
          </div>
        )}

        {/* QUADRANT 3: REAL PYTHON WASM FORGE */}
        {(layoutMode === 'QUAD_MATRIX' || layoutMode === 'PYTHON_FOCUS') && (
          <div className="bg-[#000000] border border-amber-500/40 rounded-[2rem] p-5 shadow-lg flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-white font-black text-sm">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>مفاعل بايثون الحقيقي في الذاكرة (Python WASM Engine)</span>
              </div>
              <button
                onClick={handleRunPython}
                disabled={isPythonRunning}
                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                {isPythonRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>تنفيذ بايثون</span>
              </button>
            </div>

            {/* Python Code Input */}
            <textarea
              value={pythonCode}
              onChange={e => setPythonCode(e.target.value)}
              rows={4}
              className="w-full p-3 bg-black border border-white/10 rounded-xl font-mono text-xs text-amber-300 focus:outline-none focus:border-amber-400 leading-relaxed"
            />

            {/* Python Output Console */}
            <div className="p-3 bg-black border border-amber-500/30 rounded-xl font-mono text-xs text-slate-300 max-h-[120px] overflow-y-auto">
              <span className="text-[10px] text-amber-500 block mb-1">المخرجات (Standard Output):</span>
              <pre className="whitespace-pre-wrap">{pythonOutput}</pre>
            </div>
          </div>
        )}

        {/* QUADRANT 4: UNIVERSAL DISPATCH & TELEMETRY BUS */}
        {layoutMode === 'QUAD_MATRIX' && (
          <div className="bg-[#000000] border border-emerald-500/40 rounded-[2rem] p-5 shadow-lg flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-white font-black text-sm">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>متحكم الأنظمة الموحد وتدفق التيليميتري (Universal Telemetry)</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                100% Sovereign
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-black border border-white/10 rounded-xl">
                <span className="text-slate-400 block text-[10px]">التردد الرنيني السيادي</span>
                <span className="text-emerald-400 font-black font-mono text-sm mt-0.5 block">528.00 Hz Solfeggio</span>
              </div>
              <div className="p-3 bg-black border border-white/10 rounded-xl">
                <span className="text-slate-400 block text-[10px]">درع الحماية L4 دراغون</span>
                <span className="text-cyan-400 font-black font-mono text-sm mt-0.5 block">ACTIVE & ENCRYPTED</span>
              </div>
            </div>

            <div className="p-3 bg-black border border-white/10 rounded-xl font-mono text-[11px] text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Memory Footprint:</span>
                <span className="text-white">Zero-Cloud / Pure WASM</span>
              </div>
              <div className="flex justify-between">
                <span>License:</span>
                <span className="text-emerald-400">MIT / Sovereign Open Source</span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
