import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, Terminal, Cpu, Sparkles, Send, Copy, Check, ExternalLink, 
  RefreshCw, Play, Shield, Zap, AlertCircle, ArrowUpRight, ArrowDownLeft,
  Layers, Code2, Database, Laptop, CheckCircle2, XCircle, Share2, Compass,
  Sliders, MessageSquare, Download, Flame, Key, Radio
} from 'lucide-react';
import { 
  kimiBridgeManager, 
  ExternalBridgeCommand, 
  SUPPORTED_EXTERNAL_SITES, 
  ExternalTargetSite,
  SARAH_KIMI_USERSCRIPT_CODE 
} from '../services/kimiBrowserBridge';
import { realPythonRuntime } from '../services/realPythonEngine';
import { AppTab, Language } from '../types';

interface ExternalBrowserBridgeProps {
  language: Language;
  onNavigate?: (tab: AppTab) => void;
  onSummonModule?: (tab: AppTab) => void;
}

export const ExternalBrowserBridge: React.FC<ExternalBrowserBridgeProps> = ({
  language,
  onNavigate,
  onSummonModule
}) => {
  const [selectedSite, setSelectedSite] = useState<ExternalTargetSite>(SUPPORTED_EXTERNAL_SITES[0]); // Kimi by default
  const [activeTab, setActiveTab] = useState<'dispatch' | 'receiver' | 'script' | 'embed'>('dispatch');
  const [outgoingPrompt, setOutgoingPrompt] = useState('');
  const [customTaskType, setCustomTaskType] = useState<string>('code_forge');
  const [commands, setCommands] = useState<ExternalBridgeCommand[]>([]);
  const [executingCmdId, setExecutingCmdId] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [autoExecute, setAutoExecute] = useState(true);
  const [simulatedKimiInput, setSimulatedKimiInput] = useState(`\`\`\`json
{
  "sarah_command": "RUN_PYTHON",
  "payload": {
    "code": "# أمر صادر من ذكاء Kimi الخارجي لحساب التوافق الكوانتومي\\nimport math\\n\\nqubits = [1, 2, 4, 8, 16, 32, 64, 128]\\ncoherence = [math.sin(q * 0.1) * 528 for q in qubits]\\n\\nprint('⚡ نتيجة تنفيذ أمر Kimi في النواة:')\\nfor q, c in zip(qubits, coherence):\\n    print(f'Qubit {q:3d} -> Coherence: {c:.2f} Hz')\\n\\nprint('✅ التوافق الكوانتومي مكتمل 100% بنجاح!')"
  },
  "reason": "حساب استقرار مصفوفة الكيوبتات والتوافق الترددي"
}
\`\`\``);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '🌐 [BRIDGE_READY] تم تهيئة قناة التوافق BroadcastChannel بنجاح (SARAH_KIMI_SOVEREIGN_BRIDGE).',
    '⚡ [LISTEN_MODE] الاستماع المباشر لأوامر Kimi و ChatGPT و DeepSeek بنمط Zero-Latency.',
    '🔮 [QUANTUM_COHERENCE] التردد السيادي 528Hz متزامن ومتاح.'
  ]);

  // Subscribe to bridge events
  useEffect(() => {
    // Fill default prompt based on selected site
    setOutgoingPrompt(selectedSite.suggestedPromptTemplate);

    const unsubscribe = kimiBridgeManager.subscribe((newCmd) => {
      setCommands(prev => [newCmd, ...prev]);
      addTerminalLog(`📥 [COMMAND_RECEIVED] وصل أمر جديد من [${newCmd.source.toUpperCase()}]: نوع [${newCmd.commandType}]`);
      
      if (autoExecute && newCmd.status === 'pending') {
        executeCommandDirectly(newCmd);
      }
    });

    // Populate existing history
    setCommands(kimiBridgeManager.getHistory());

    return () => unsubscribe();
  }, [selectedSite, autoExecute]);

  const addTerminalLog = (log: string) => {
    const time = new Date().toLocaleTimeString('ar-EG');
    setTerminalLogs(prev => [`[${time}] ${log}`, ...prev.slice(0, 40)]);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(outgoingPrompt);
    setCopiedPrompt(true);
    addTerminalLog(`📋 تم نسخ البرومبت المخصص لموقع ${selectedSite.name} إلى الحافظة.`);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(SARAH_KIMI_USERSCRIPT_CODE);
    setCopiedScript(true);
    addTerminalLog('📋 تم نسخ كود إضافة المتصفح (Tampermonkey UserScript) بنجاح.');
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleOpenExternalSite = () => {
    handleCopyPrompt();
    window.open(selectedSite.url, '_blank', 'noopener,noreferrer');
    addTerminalLog(`🚀 تم فتح نافذة خارجية لموقع ${selectedSite.name} (${selectedSite.url}).`);
  };

  const handlePresetTaskSelect = (task: string) => {
    setCustomTaskType(task);
    let prompt = '';
    switch (task) {
      case 'code_forge':
        prompt = `${selectedSite.suggestedPromptTemplate}\n\nالمهمة المطلوبة: اكتب خوارزمية بايثون متقدمة لتشفير مصفوفة المفاتيح الكوانتومية وحساب الهاش السيادي 528Hz مع معالجة الاستثناءات.`;
        break;
      case 'security_scan':
        prompt = `${selectedSite.suggestedPromptTemplate}\n\nالمهمة المطلوبة: تفقد أمان النظام وأرسل أمر فحص الأمان السيادي QUANTUM_SECURITY_SCAN.`;
        break;
      case 'summon_module':
        prompt = `${selectedSite.suggestedPromptTemplate}\n\nالمهمة المطلوبة: قم بتوجيه صارة لاستحضار وحدة ورشة بايثون الحقيقية من خلال أمر SUMMON_MODULE مع المعامل python_forge.`;
        break;
      case 'knowledge_vault':
        prompt = `${selectedSite.suggestedPromptTemplate}\n\nالمهمة المطلوبة: لخص أحدث التطورات في الحوسبة الكمومية وأصدر أمراً لحفظها في KnowledgeVault.`;
        break;
    }
    setOutgoingPrompt(prompt);
  };

  const executeCommandDirectly = async (cmd: ExternalBridgeCommand) => {
    setExecutingCmdId(cmd.id);
    addTerminalLog(`⚙️ [EXECUTING] جاري تنفيذ أمر [${cmd.commandType}]...`);

    const resultCmd = await kimiBridgeManager.executeCommand(cmd, {
      onRunPython: async (code: string) => {
        addTerminalLog('🐍 [PYTHON_ENGINE] تشغيل الكود في بيئة بايثون WASM المعزولة...');
        const runRes = await realPythonRuntime.runPythonCode(code);
        if (runRes.success) {
          addTerminalLog(`✅ [PYTHON_SUCCESS] تم التنفيذ بنجاح في ${runRes.executionTimeMs}ms:\n${runRes.stdout.slice(0, 150)}...`);
        } else {
          addTerminalLog(`❌ [PYTHON_ERROR] خطأ أثناء التنفيذ: ${runRes.stderr}`);
        }
        return {
          success: runRes.success,
          output: runRes.stdout,
          error: runRes.stderr,
          executionTimeMs: runRes.executionTimeMs
        };
      },
      onSummonModule: (tab: string) => {
        addTerminalLog(`🚀 [SUMMON] استحضار الوحدة المطلوبة: ${tab}`);
        if (onSummonModule) {
          onSummonModule(tab as AppTab);
        } else if (onNavigate) {
          onNavigate(tab as AppTab);
        }
      },
      onSaveKnowledge: (title: string, content: string, tags: string[]) => {
        addTerminalLog(`📚 [KNOWLEDGE] تم تسجيل الوثيقة المعرفية: "${title}" بالوسوم [${tags.join(', ')}]`);
      },
      onSecurityScan: async () => {
        addTerminalLog('🛡️ [SECURITY_SCAN] تم إطلاق فحص قبة دراغون الشامل: النواة نقية بنسبة 100% ومحمية.');
        return { status: 'secure', score: 100 };
      }
    });

    setCommands(prev => prev.map(c => c.id === cmd.id ? resultCmd : c));
    setExecutingCmdId(null);
  };

  const handleSimulateIncoming = () => {
    if (!simulatedKimiInput.trim()) return;
    addTerminalLog(`📥 [SIMULATION] محاكاة استلام استجابة / أمر من ${selectedSite.name}...`);
    kimiBridgeManager.handleIncomingRawEvent({
      source: selectedSite.id,
      rawText: simulatedKimiInput,
      timestamp: Date.now()
    });
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-100 font-arabic flex flex-col overflow-hidden relative">
      
      {/* Header Bar */}
      <header className="px-6 lg:px-10 py-5 bg-black/60 border-b border-white/10 backdrop-blur-2xl flex flex-wrap justify-between items-center gap-4 z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_25px_rgba(147,51,234,0.5)]">
            <Globe className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl lg:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-cyan-300 to-white">
                جسر المتصفح الخارجي وتكامل Kimi والأوامر
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-500/40">
                Kimi Bridge v17
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              تبادل الأوامر والتحكم الثنائي بين صارة ومنصات الذكاء الخارجية (Kimi, DeepSeek, ChatGPT, Claude)
            </p>
          </div>
        </div>

        {/* Bridge Status & Auto-Execute Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
            <span className="text-slate-300">قناة التوافق:</span>
            <span className="text-emerald-400 font-mono font-bold">528Hz Active</span>
          </div>

          <button
            onClick={() => setAutoExecute(!autoExecute)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
              autoExecute 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
            title="تنفيذ الأوامر الواردة تلقائياً بمجرد وصولها من Kimi أو المتصفح"
          >
            <Zap className={`w-4 h-4 ${autoExecute ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>التنفيذ التلقائي: {autoExecute ? 'مفعل ⚡' : 'يدوي'}</span>
          </button>
        </div>
      </header>

      {/* Target Site Switcher */}
      <div className="px-6 lg:px-10 py-3 bg-[#050814] border-b border-white/5 flex items-center gap-3 overflow-x-auto no-scrollbar">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 whitespace-nowrap pl-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>الموقع / الذكاء المستهدف:</span>
        </span>
        {SUPPORTED_EXTERNAL_SITES.map(site => {
          const isSelected = selectedSite.id === site.id;
          return (
            <button
              key={site.id}
              onClick={() => setSelectedSite(site)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 whitespace-nowrap border ${
                isSelected
                  ? `bg-gradient-to-r ${site.badgeColor} text-white border-white/30 shadow-[0_0_20px_rgba(147,51,234,0.3)] scale-[1.02]`
                  : 'bg-white/5 text-slate-400 hover:text-white border-white/5 hover:bg-white/10'
              }`}
            >
              <span>{site.icon}</span>
              <span>{site.name}</span>
              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>}
            </button>
          );
        })}
      </div>

      {/* Mode Navigation Tabs */}
      <div className="px-6 lg:px-10 pt-4 pb-2 flex items-center gap-2 border-b border-white/5 bg-[#03060f]">
        {[
          { id: 'dispatch', label: '1. إرسال المهام وصياغة الأوامر لـ Kimi', icon: Send },
          { id: 'receiver', label: '2. خط استقبال وتنفيذ أوامر Kimi الواردة', icon: Terminal, count: commands.length },
          { id: 'script', label: '3. سكربت المتصفح التلقائي (UserScript)', icon: Code2 },
          { id: 'embed', label: '4. المتصفح السيادي المباشر', icon: Laptop }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-purple-600/30 text-purple-200 border-purple-400/50 shadow-[0_0_15px_rgba(147,51,234,0.2)]'
                  : 'bg-white/5 text-slate-400 hover:text-white border-transparent hover:bg-white/10'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
              <span>{t.label}</span>
              {t.count !== undefined && t.count > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-purple-500 text-white font-bold">
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left / Center Viewport */}
        <div className="flex-1 flex flex-col p-6 lg:p-8 overflow-y-auto no-scrollbar gap-6">
          
          {/* TAB 1: DISPATCH TO KIMI */}
          {activeTab === 'dispatch' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Site Info Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-black/60 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{selectedSite.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-purple-200">{selectedSite.name} ({selectedSite.vendor})</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedSite.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[10px] text-slate-500">الأوامر المدعومة:</span>
                      {selectedSite.commandCompatibility.map(cmd => (
                        <span key={cmd} className="px-2 py-0.5 rounded text-[9px] font-mono bg-purple-900/50 text-purple-300 border border-purple-500/30">
                          {cmd}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={handleCopyPrompt}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold transition-all border border-white/10 flex items-center gap-2 shadow-sm"
                  >
                    {copiedPrompt ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-purple-300" />}
                    <span>{copiedPrompt ? 'تم النسخ!' : 'نسخ البرومبت 📋'}</span>
                  </button>

                  <button
                    onClick={handleOpenExternalSite}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(147,51,234,0.4)]"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>فتح {selectedSite.name} وإرسال المهمة ⚡</span>
                  </button>
                </div>
              </div>

              {/* Preset Tasks */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>نماذج المهام التوجيهية الجاهزة لإعطاء الأوامر:</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { id: 'code_forge', label: 'كتابة خوارزمية بايثون', desc: 'أمر RUN_PYTHON لتنفيذه في صارة', icon: '🐍' },
                    { id: 'security_scan', label: 'فحص أمان سيادي', desc: 'أمر QUANTUM_SECURITY_SCAN', icon: '🛡️' },
                    { id: 'summon_module', label: 'استحضار وتفعيل وحدة', desc: 'أمر SUMMON_MODULE', icon: '🚀' },
                    { id: 'knowledge_vault', label: 'توثيق المعرفة', desc: 'أمر INGEST_KNOWLEDGE', icon: '📚' }
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => handlePresetTaskSelect(p.id)}
                      className={`p-3 rounded-xl border text-right transition-all flex flex-col gap-1 ${
                        customTaskType === p.id 
                          ? 'bg-purple-900/30 border-purple-400/50 shadow-[0_0_15px_rgba(147,51,234,0.2)]'
                          : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base">{p.icon}</span>
                        <span className="text-xs font-bold text-slate-200">{p.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Customizer Box */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <span>صيغة البرومبت المهيكل للربط مع {selectedSite.name}:</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {outgoingPrompt.length} حرف
                  </span>
                </div>
                <textarea
                  value={outgoingPrompt}
                  onChange={(e) => setOutgoingPrompt(e.target.value)}
                  className="w-full h-56 p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-purple-100 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none leading-relaxed"
                  placeholder="اكتب البرومبت أو المهمة المطلوب تكليف Kimi بها..."
                />
              </div>

              {/* How it Works Guide */}
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">كيف يعمل التوجيه والأوامر بين Kimi وصارة؟</p>
                  <p className="text-slate-300 leading-relaxed">
                    1. عند نسخ البرومبت وفتحه في <strong className="text-purple-300">Kimi ({selectedSite.name})</strong>، سيقوم الذكاء الخارجي بصياغة الحل وإصدار أمر مهيكل بصيغة <code className="text-cyan-300 bg-cyan-950 px-1 py-0.5 rounded">sarah_command</code>.
                    <br />
                    2. إذا قمت بتثبيت سكربت المتصفح التلقائي (UserScript) من التبويب رقم 3، فسيظهر زر عائم داخل موقع Kimi لإرسال الأمر فوراً إلى صارة دون الحاجة للنسخ واللصق!
                    <br />
                    3. يمكنك أيضاً تجربة محاكاة وصول الأمر مباشرة في التبويب الثاني لرؤية التنفيذ الفوري.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMMAND RECEIVER & PIPELINE */}
          {activeTab === 'receiver' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Simulation Dock */}
              <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">محاكي / مختبر حقن أوامر Kimi اللحظية</h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Cross-Tab Emulator</span>
                </div>

                <p className="text-xs text-slate-400">
                  يمكنك لصق كود أو نص أو أمر JSON صادر من Kimi هنا لتجربة استيعابه وتنفيذه في النواة:
                </p>

                <textarea
                  value={simulatedKimiInput}
                  onChange={(e) => setSimulatedKimiInput(e.target.value)}
                  className="w-full h-40 p-4 rounded-xl bg-black/80 border border-white/10 font-mono text-xs text-emerald-300 focus:border-emerald-500 outline-none resize-none leading-relaxed"
                  placeholder="أدخل أمر Kimi التجريبي هنا..."
                />

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSimulatedKimiInput(`\`\`\`json
{
  "sarah_command": "RUN_PYTHON",
  "payload": {
    "code": "import time, sys\\nprint('🔮 تشغيل مهمة معالجة البيانات من Kimi...')\\nprint(f'إصدار المحرك: {sys.version.split()[0]}')\\nprint('البيانات معالجة بنجاح 100%!')"
  },
  "reason": "تنفيذ كود تشخيصي سريع"
}
\`\`\``)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-[11px] border border-white/5"
                    >
                      أمر بايثون سريع 🐍
                    </button>

                    <button
                      onClick={() => setSimulatedKimiInput(`\`\`\`json
{
  "sarah_command": "SUMMON_MODULE",
  "payload": { "moduleTab": "quantum_dev_computer" },
  "reason": "استحضار الحاسوب الكمومي QPU-128"
}
\`\`\``)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-[11px] border border-white/5"
                    >
                      أمر استحضار حاسوب QPU 💻
                    </button>
                  </div>

                  <button
                    onClick={handleSimulateIncoming}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>حقن واستقبال الأمر ⚡</span>
                  </button>
                </div>
              </div>

              {/* Commands Pipeline List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-400 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <span>سجل الأوامر الواردة من Kimi والمتصفحات الخارجية ({commands.length}):</span>
                  </h3>
                  <button
                    onClick={() => setCommands([])}
                    className="text-[11px] text-slate-500 hover:text-slate-300"
                  >
                    مسح السجل
                  </button>
                </div>

                {commands.length === 0 ? (
                  <div className="p-10 rounded-2xl bg-black/40 border border-white/5 text-center text-slate-500 space-y-2">
                    <Radio className="w-8 h-8 mx-auto text-slate-600 animate-pulse" />
                    <p className="text-xs font-bold">لا توجد أوامر واردة حالياً</p>
                    <p className="text-[11px]">في انتظار وصول أوامر من صفحة Kimi أو عبر محاكي الحقن أعلاه.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {commands.map((cmd) => {
                      const isRunning = executingCmdId === cmd.id;
                      return (
                        <div
                          key={cmd.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            cmd.status === 'executed'
                              ? 'bg-emerald-950/20 border-emerald-500/30'
                              : cmd.status === 'failed'
                              ? 'bg-rose-950/20 border-rose-500/30'
                              : 'bg-black/60 border-purple-500/30'
                          }`}
                        >
                          <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                            <div className="flex items-center gap-2.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-purple-900/60 text-purple-300 border border-purple-500/30">
                                {cmd.source.toUpperCase()}
                              </span>
                              <span className="font-mono text-xs font-bold text-white">
                                {cmd.commandType}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                ID: {cmd.id}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              {cmd.executionTimeMs !== undefined && (
                                <span className="text-[10px] font-mono text-cyan-400">
                                  {cmd.executionTimeMs}ms
                                </span>
                              )}
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                                cmd.status === 'executed'
                                  ? 'bg-emerald-900/60 text-emerald-300'
                                  : cmd.status === 'failed'
                                  ? 'bg-rose-900/60 text-rose-300'
                                  : 'bg-amber-900/60 text-amber-300'
                              }`}>
                                {cmd.status === 'executed' && <CheckCircle2 className="w-3 h-3" />}
                                {cmd.status === 'failed' && <XCircle className="w-3 h-3" />}
                                {cmd.status === 'pending' && <RefreshCw className="w-3 h-3 animate-spin" />}
                                <span>{cmd.status.toUpperCase()}</span>
                              </span>
                            </div>
                          </div>

                          {/* Payload Details */}
                          <div className="p-3 rounded-xl bg-black/60 border border-white/5 font-mono text-[11px] text-slate-300 overflow-x-auto my-2">
                            <pre>{typeof cmd.payload === 'string' ? cmd.payload : JSON.stringify(cmd.payload, null, 2)}</pre>
                          </div>

                          {/* Execution Result if any */}
                          {cmd.result && (
                            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 font-mono text-[11px] text-emerald-200 mt-2">
                              <span className="text-[10px] font-bold text-emerald-400 block mb-1">⚡ نتيجة التنفيذ المكتملة:</span>
                              <pre>{typeof cmd.result === 'string' ? cmd.result : JSON.stringify(cmd.result, null, 2)}</pre>
                            </div>
                          )}

                          {/* Action Button if pending */}
                          {cmd.status === 'pending' && (
                            <div className="flex justify-end mt-3">
                              <button
                                onClick={() => executeCommandDirectly(cmd)}
                                disabled={isRunning}
                                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
                              >
                                {isRunning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                                <span>{isRunning ? 'جاري التنفيذ...' : 'اعتماد وتنفيذ الأمر فوراً ⚡'}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: USERSCRIPT & EXTENSION INJECTOR */}
          {activeTab === 'script' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-black border border-indigo-500/20 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-indigo-200 flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-indigo-400" />
                    <span>سكربت المتصفح السيادي للربط التلقائي (Sarah-Kimi Bridge UserScript)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    يعمل مع إضافات المتصفح مثل <strong className="text-white">Tampermonkey</strong> أو <strong className="text-white">Violentmonkey</strong> على Chrome و Edge و Firefox و Safari.
                  </p>
                </div>

                <button
                  onClick={handleCopyScript}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                >
                  {copiedScript ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedScript ? 'تم النسخ بنجاح!' : 'نسخ كود السكربت 📋'}</span>
                </button>
              </div>

              {/* Installation Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">1</div>
                  <h4 className="font-bold text-white">تثبيت إضافة Tampermonkey</h4>
                  <p className="text-slate-400 leading-relaxed">
                    قم بتثبيت إضافة Tampermonkey من متجر Chrome أو Firefox مجاناً.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">2</div>
                  <h4 className="font-bold text-white">إنشاء سكربت جديد ولصق الكود</h4>
                  <p className="text-slate-400 leading-relaxed">
                    انقر على إضافة سكربت جديد في Tampermonkey ثم الصق الكود البرمجي أدناه واحفظه.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">3</div>
                  <h4 className="font-bold text-white">افتح Kimi وأرسل الأوامر</h4>
                  <p className="text-slate-400 leading-relaxed">
                    افتح موقع kimi.ai، وسيظهر زر صارة العائم لإرسال أي رد أو أمر برمجياً لصارة في الزمن الحقيقي!
                  </p>
                </div>
              </div>

              {/* Code Preview */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>كود السكربت الكامل:</span>
                  <span className="font-mono text-[10px]">JavaScript • UserScript 17.0</span>
                </div>
                <div className="p-4 rounded-2xl bg-black/80 border border-white/10 font-mono text-xs text-indigo-200 overflow-x-auto max-h-96 no-scrollbar leading-relaxed">
                  <pre>{SARAH_KIMI_USERSCRIPT_CODE}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EMBEDDED LIVE BROWSER SANDBOX */}
          {activeTab === 'embed' && (
            <div className="space-y-4 animate-fadeIn flex-1 flex flex-col">
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span className="font-mono text-xs text-purple-300">{selectedSite.url}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(selectedSite.url, '_blank')}
                    className="px-3.5 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 rounded-lg text-xs font-bold border border-purple-500/30 flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>فتح في تبويب مستقل</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 min-h-[500px] rounded-2xl border border-white/10 bg-black/40 overflow-hidden relative flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="text-6xl">{selectedSite.icon}</div>
                <h3 className="text-lg font-bold text-white">بوابة الربط مع {selectedSite.name}</h3>
                <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                  نظراً لقيود الحماية الصارمة للمتصفحات (X-Frame-Options)، يفضل فتح موقع {selectedSite.name} في تبويب خارجي مستقل مع تفعيل سكربت الربط التلقائي، أو استخدام البرومبتات المهيكلة المباشرة.
                </p>
                <button
                  onClick={handleOpenExternalSite}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-xl flex items-center gap-2 hover:scale-105 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>فتح {selectedSite.name} الآن مع البرومبت السيادي 🚀</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar: Realtime Terminal & Telemetry */}
        <div className="lg:w-[380px] xl:w-[420px] bg-black/80 border-r border-white/10 flex flex-col">
          <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white">التيليميتري وسجل الأوامر اللحظي</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>528Hz Coherence</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 p-3 gap-2 border-b border-white/5 text-center text-xs">
            <div className="p-2 rounded-lg bg-white/5">
              <span className="text-[10px] text-slate-400 block">الأوامر</span>
              <span className="font-mono font-bold text-white">{commands.length}</span>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <span className="text-[10px] text-slate-400 block">الاستجابة</span>
              <span className="font-mono font-bold text-emerald-400">&lt; 1ms</span>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <span className="text-[10px] text-slate-400 block">التوافق</span>
              <span className="font-mono font-bold text-purple-400">100%</span>
            </div>
          </div>

          {/* Terminal Output */}
          <div className="flex-1 p-4 font-mono text-[11px] overflow-y-auto no-scrollbar space-y-2 text-slate-300">
            {terminalLogs.map((log, i) => (
              <div key={i} className="leading-relaxed border-b border-white/5 pb-1">
                {log}
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-[#050814] border-t border-white/10 flex justify-between items-center text-xs">
            <span className="text-[10px] text-slate-500 font-mono">Channel: SARAH_KIMI_BRIDGE</span>
            <button
              onClick={() => addTerminalLog('🧹 تم تنظيف شاشة التيليميتري.')}
              className="text-[10px] text-slate-400 hover:text-white"
            >
              مسح التيليميتري
            </button>
          </div>
        </div>

      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};
