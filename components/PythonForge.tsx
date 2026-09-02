import React, { useState, useRef, useEffect } from 'react';
import { realPythonRuntime, PythonExecutionOutput, PythonEngineState } from '../services/realPythonEngine';
import { Language } from '../types';
import { QuantumPredictivePanel } from './QuantumPredictivePanel';
import { 
  Play, Terminal, Cpu, RefreshCw, Copy, Check, Sparkles, 
  Code2, AlertCircle, CheckCircle2, Zap, Layers, BookOpen, Bug, Shield,
  Brain, ChevronDown, ChevronUp
} from 'lucide-react';

export const PythonForge: React.FC<{ language: Language }> = ({ language }) => {
  const [code, setCode] = useState<string>(`import math
import random
import json
import statistics

# 1. إعداد دالة التنشيط النورونية (Sigmoid Function)
def sigmoid(x):
    return 1 / (1 + math.exp(-x))

# 2. مصفوفة بيانات التدريب
raw_inputs = [0.5, 1.2, -0.8, 2.4, -1.5, 3.0]
activated_outputs = [round(sigmoid(x), 4) for x in raw_inputs]

# 3. حساب المؤشرات الإحصائية
mean_val = statistics.mean(activated_outputs)
variance_val = statistics.variance(activated_outputs)

# 4. طباعة النتائج في الـ Terminal
print(">>> [PYTHON_WASM_CORE] تم تشغيل النواة الحقيقية بنجاح 100%")
print(f">>> المدخلات: {raw_inputs}")
print(f">>> مخرجات التنشيط: {activated_outputs}")
print(f">>> المتوسط الحسابي: {mean_val:.4f} | التباين: {variance_val:.4f}")

# إرجاع كائن ملخص
summary = {
    "status": "SUCCESS_REAL_PYTHON",
    "samples_count": len(raw_inputs),
    "mean": round(mean_val, 4),
    "outputs": activated_outputs
}
print(">>> ملخص JSON:", json.dumps(summary, indent=2))
`);

  const [engineState, setEngineState] = useState<PythonEngineState>(realPythonRuntime.getState());
  const [statusMsg, setStatusMsg] = useState<string>(realPythonRuntime.getStatusMessage());
  const [loading, setLoading] = useState(false);
  const [lastOutput, setLastOutput] = useState<PythonExecutionOutput | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<{ type: 'system' | 'stdout' | 'stderr' | 'success'; text: string }[]>([
    { type: 'system', text: '>>> [KERNEL] محرك بايثون الحقيقي جاهز للتشغيل عبر WebAssembly (Python 3.12).' },
    { type: 'system', text: '>>> اضغط على "تشغيل الكود 🚀" لتنفيذ السكريبت واستقبال المخرجات الحية.' }
  ]);
  const [copied, setCopied] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState<string>('neural');
  const [showPredictiveAnalytics, setShowPredictiveAnalytics] = useState<boolean>(true);

  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subscribe to engine state changes
    const unsubscribe = realPythonRuntime.subscribeStatus((state, msg) => {
      setEngineState(state);
      setStatusMsg(msg);
    });

    // Auto-warm the engine in background
    realPythonRuntime.initEngine().catch(e => console.log('Warming engine...', e));

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  const handleRun = async () => {
    if (!code.trim() || loading) return;

    setLoading(true);
    const startNotice = `>>> [EXECUTION_START] جاري إرسال الكود إلى نواة Python 3.12 WASM...`;
    setTerminalLogs(prev => [...prev, { type: 'system', text: startNotice }]);

    try {
      const result = await realPythonRuntime.runPythonCode(code);
      setLastOutput(result);

      if (result.stdout) {
        setTerminalLogs(prev => [
          ...prev, 
          { type: 'stdout', text: result.stdout }
        ]);
      }

      if (result.stderr) {
        setTerminalLogs(prev => [
          ...prev, 
          { type: 'stderr', text: result.stderr }
        ]);
      }

      if (result.success) {
        setTerminalLogs(prev => [
          ...prev,
          { type: 'success', text: `✓ تم التنفيذ بنجاح في ${result.executionTimeMs} ميلي ثانية | ${result.pythonVersion}` }
        ]);
      } else {
        setTerminalLogs(prev => [
          ...prev,
          { type: 'stderr', text: `❌ فشل التنفيذ - تفاصيل الخطأ مسجلة أعلاه.` }
        ]);
      }
    } catch (err: any) {
      setTerminalLogs(prev => [
        ...prev,
        { type: 'stderr', text: `❌ خطأ غير متوقع: ${err?.message || err}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySnippet = (snippetKey: string) => {
    setSelectedSnippet(snippetKey);
    switch (snippetKey) {
      case 'neural':
        setCode(`import math
import statistics
import json

def sigmoid(x):
    return 1 / (1 + math.exp(-x))

raw_inputs = [0.5, 1.2, -0.8, 2.4, -1.5, 3.0]
activated_outputs = [round(sigmoid(x), 4) for x in raw_inputs]

print(">>> [NEURAL_SIGMOID] مخرجات التنشيط النوروني الحقيقي:")
for orig, act in zip(raw_inputs, activated_outputs):
    print(f"  f({orig:4.1f}) = {act:.4f}")

print(f"\\n>>> المتوسط: {statistics.mean(activated_outputs):.4f}")
`);
        break;

      case 'crypto':
        setCode(`import hashlib
import time

payload = "SARAH_SOVEREIGN_SYSTEM_2026_CORE"
sha256_hash = hashlib.sha256(payload.encode()).hexdigest()
sha512_hash = hashlib.sha512(payload.encode()).hexdigest()

print(">>> [CRYPTO_ENGINE] تشفير حقيقي باستخدام hashlib القياسية:")
print(f">>> النص الأصلي: {payload}")
print(f">>> SHA-256: {sha256_hash}")
print(f">>> SHA-512 (البصمة الكاملة):\\n    {sha512_hash}")
`);
        break;

      case 'primes':
        setCode(`import time

def find_primes(limit=100):
    primes = []
    for num in range(2, limit + 1):
        is_prime = True
        for i in range(2, int(num**0.5) + 1):
            if num % i == 0:
                is_prime = False
                break
        if is_prime:
            primes.append(num)
    return primes

start = time.time()
primes_list = find_primes(150)
elapsed = (time.time() - start) * 1000

print(f">>> [BENCHMARK] تم استخراج {len(primes_list)} عدداً أولياً في {elapsed:.3f} ms:")
print(primes_list)
`);
        break;

      case 'classes':
        setCode(`class DragonAgent:
    def __init__(self, name, power_level):
        self.name = name
        self.power_level = power_level
        self.shield_integrity = 100.0
        
    def activate_shield(self, boost=15.5):
        self.power_level += boost
        return f"الوكيل {self.name} قام بتعزيز درع الطاقة إلى {self.power_level:.1f}%"

# تجربة الكائنات الموجهة (OOP)
agent1 = DragonAgent("صارة السيادية", 98.4)
agent2 = DragonAgent("دراغون كيرنل", 100.0)

print(agent1.activate_shield())
print(agent2.activate_shield(25.0))
`);
        break;

      case 'predictive_demo':
        setCode(`# 🧪 نموذج لاختبار التحليلات التنبؤية الكوانتومية (Predictive Bug Test)
# لاحظ كيف يكتشف المحرك التنبؤي الأخطاء الشائعة قبل تشغيل الكود!

# 1. خطر الوسيط الافتراضي المتغير (Mutable Default Argument)
def append_transaction(tx_id, records=[]):
    records.append(tx_id)
    return records

# 2. خطر القسمة على قائمة فارغة (Potential ZeroDivisionError)
def compute_average(values):
    total = sum(values)
    return total / len(values)

# 3. خطر التقاط الاستثناءات العام دون تحديد (Bare Except)
try:
    data = {"system": "sovereign", "qubits": 128}
    key_val = data["unknown_node"]
except:
    print("حدث استثناء غير محدد!")

# 4. تنفيذ العمليات
print(append_transaction("TX_1001"))
print(append_transaction("TX_1002"))
print("المتوسط:", compute_average([10, 20, 30]))
`);
        break;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full max-w-full mx-auto bg-[#05070a] text-white p-0 overflow-hidden min-h-screen font-arabic">
      
      {/* Header Bar */}
      <header className="px-6 lg:px-10 py-5 border-b border-white/5 bg-black/60 backdrop-blur-3xl z-50 flex flex-wrap justify-between items-center gap-4 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-amber-400 flex items-center gap-2">
              <Code2 className="w-7 h-7 text-blue-500" />
              <span>Python <span className="text-blue-500">Forge</span></span>
            </h2>
            <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider mt-0.5">
              REAL_PYTHON_WASM // محرك بايثون 3.12 الحقيقي معزول محلياً 100%
            </span>
          </div>
          
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5 text-xs font-mono">
              <div className={`w-2.5 h-2.5 rounded-full ${engineState === 'READY' ? 'bg-emerald-400 animate-pulse' : engineState === 'INITIALIZING' ? 'bg-amber-400 animate-spin' : 'bg-blue-400'}`}></div>
              <span className="text-slate-300 text-[11px]">{statusMsg}</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5 text-xs font-mono">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400 text-[11px]">WASM Pyodide 3.12</span>
            </div>
          </div>
        </div>
        
        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowPredictiveAnalytics(!showPredictiveAnalytics)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 shadow-sm ${
              showPredictiveAnalytics 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]' 
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
            }`}
            title="تفعيل/إخفاء لوحة التحليلات التنبؤية الكوانتومية"
          >
            <Brain className={`w-4 h-4 ${showPredictiveAnalytics ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`} />
            <span>التحليلات التنبؤية</span>
            <span className="text-[9px] font-mono bg-cyan-950 px-1.5 py-0.5 rounded text-cyan-400 border border-cyan-500/30">
              528Hz
            </span>
          </button>

          <button 
            onClick={handleCopyCode}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-white/5 flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'تم النسخ!' : 'نسخ الكود'}</span>
          </button>

          <button 
            onClick={handleRun}
            disabled={loading}
            className="px-8 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-white rounded-xl font-black text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري التنفيذ الحقيقي...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>تشغيل الكود 🚀</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Snippets Preset Selector Bar */}
      <div className="px-6 lg:px-10 py-3 bg-[#080c14] border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-slate-400">قوالب بايثون الحقيقية الجاهزة:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'neural', label: 'دوال التنشيط والإحصاء (math + statistics)' },
            { id: 'crypto', label: 'التشفير وحساب الهاش (hashlib)' },
            { id: 'primes', label: 'توليد الأعداد الأولية وقياس السرعة' },
            { id: 'classes', label: 'البرمجة كائنية التوجه (OOP & Classes)' },
            { id: 'predictive_demo', label: '🧪 تجربة التنبؤ بالأخطاء (Predictive Analytics Test)' },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => handleApplySnippet(s.id)}
              className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all border ${
                selectedSnippet === s.id
                  ? 'bg-blue-600/30 text-blue-300 border-blue-400 font-bold shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                  : s.id === 'predictive_demo'
                  ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30 hover:bg-cyan-900/40'
                  : 'bg-white/5 text-slate-400 hover:text-white border-white/5'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace: Code Editor & Live Terminal */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Code Editor & Quantum Predictive Panel Container */}
        <div className="flex-1 flex flex-col bg-[#05070a] border-l border-white/5 relative overflow-y-auto no-scrollbar">
          <div className="px-6 py-2 bg-black/40 border-b border-white/5 flex items-center justify-between text-xs font-mono text-slate-500 sticky top-0 z-10 backdrop-blur-md">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>script.py</span>
            </span>
            <span className="flex items-center gap-3">
              <span className="text-cyan-400">Quantum_Predictor: ACTIVE</span>
              <span>UTF-8 • Python 3</span>
            </span>
          </div>

          <div className="flex-1 min-h-[360px] flex flex-col relative">
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full flex-1 min-h-[340px] bg-transparent p-6 lg:p-8 font-mono text-sm lg:text-base text-yellow-100 outline-none resize-none selection:bg-blue-500/30 leading-relaxed no-scrollbar"
              spellCheck={false}
              placeholder="# اكتب كود بايثون هنا..."
            />
          </div>

          {/* Predictive Analytics Panel */}
          {showPredictiveAnalytics && (
            <div className="p-4 lg:p-6 bg-[#04060c] border-t border-cyan-500/20">
              <QuantumPredictivePanel
                code={code}
                language="python"
                onApplyFix={(newCode) => setCode(newCode)}
                onApplyFullRefactor={(fullCode) => setCode(fullCode)}
              />
            </div>
          )}

          <div className="px-6 py-2 bg-black/30 border-t border-white/5 flex justify-between text-[11px] font-mono text-slate-500">
            <span>الأسطر: {code.split('\n').length} | الحروف: {code.length}</span>
            <span className="text-emerald-400">✓ بيئة معزولة بنمط Zero-Trust • 528Hz Predictive Coherence</span>
          </div>
        </div>

        {/* Live Terminal Output Console */}
        <div className="lg:w-[500px] xl:w-[540px] flex flex-col bg-black/90 backdrop-blur-2xl border-r border-white/5">
          <div className="px-6 py-3 bg-white/5 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-black text-slate-300 uppercase tracking-wider">
                مخرجات الطرفية (Stdout / Stderr)
              </span>
            </div>
            <button 
              onClick={() => setTerminalLogs([])} 
              className="text-[10px] font-mono text-slate-400 hover:text-rose-400 transition-colors uppercase px-2 py-0.5 rounded bg-white/5"
            >
              مسح السجل
            </button>
          </div>
          
          <div 
            ref={terminalRef} 
            className="flex-1 overflow-y-auto p-6 font-mono text-xs space-y-2 text-left dir-ltr no-scrollbar select-text bg-[#030508]"
          >
            {terminalLogs.map((log, i) => (
              <div 
                key={i} 
                className={`whitespace-pre-wrap leading-relaxed ${
                  log.type === 'system' 
                    ? 'text-blue-400 font-bold' 
                    : log.type === 'stderr' 
                    ? 'text-rose-400 bg-rose-950/20 p-2 rounded border border-rose-500/20' 
                    : log.type === 'success' 
                    ? 'text-emerald-400 font-bold border-t border-white/5 pt-1' 
                    : 'text-amber-200'
                }`}
              >
                {log.text}
              </div>
            ))}

            {terminalLogs.length === 0 && (
              <div className="text-slate-700 italic text-center py-10">
                [لا توجد مخرجات مسجلة - اضغط على تشغيل الكود]
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-2 text-amber-400 py-2">
                <span className="w-2 h-4 bg-amber-400 animate-pulse"></span>
                <span>جاري معالجة الكود في نواة بايثون...</span>
              </div>
            )}
          </div>

          {/* Performance & Execution Telemetry Footer */}
          {lastOutput && (
            <div className="p-4 bg-slate-950 border-t border-white/5 grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-white/5 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 block">زمن المعالجة:</span>
                <span className="text-emerald-400 font-bold">{lastOutput.executionTimeMs} ms</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 block">النواة:</span>
                <span className="text-blue-400 font-bold truncate">{lastOutput.pythonVersion}</span>
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
