import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  kimiLLMEngine, 
  KIMI_MODELS_REGISTRY, 
  KimiModelInfo, 
  KimiChatMessage, 
  KimiLLMConfig 
} from '../services/kimiLLMEngine';
import { kimiBridgeManager } from '../services/kimiBrowserBridge';
import { realPythonRuntime } from '../services/realPythonEngine';
import { AppTab, Language } from '../types';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Cpu, 
  Zap, 
  Terminal, 
  Sliders, 
  ExternalLink, 
  Play, 
  RefreshCw, 
  Copy, 
  Check, 
  Trash2, 
  Download, 
  FileText, 
  Paperclip, 
  ChevronDown, 
  ChevronUp, 
  Brain, 
  ShieldCheck, 
  Globe, 
  Compass, 
  Key, 
  Code2, 
  Layers, 
  Eye, 
  EyeOff, 
  X, 
  ArrowUpRight,
  Maximize2,
  Minimize2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface KimiLLMStudioProps {
  language?: Language;
  onNavigate?: (tab: AppTab) => void;
}

export const KimiLLMStudio: React.FC<KimiLLMStudioProps> = ({ 
  language = 'ar',
  onNavigate 
}) => {
  const [messages, setMessages] = useState<KimiChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [config, setConfig] = useState<KimiLLMConfig>(kimiLLMEngine.getConfig());
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [showModelsDropdown, setShowModelsDropdown] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({});
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: number; type: string; content?: string }[]>([]);
  const [bridgeConnected, setBridgeConnected] = useState(false);
  const [activePresetCategory, setActivePresetCategory] = useState<'coding' | 'reasoning' | 'analysis' | 'security'>('coding');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(config.apiKey || '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [splitBrowserView, setSplitBrowserView] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Subscribe to Kimi LLM Engine Messages & Updates
  useEffect(() => {
    const unsub = kimiLLMEngine.subscribe((newMessages) => {
      setMessages(newMessages);
    });

    const bridgeStatusInterval = setInterval(() => {
      setBridgeConnected(kimiBridgeManager.isBridgeActive());
    }, 2000);

    return () => {
      unsub();
      clearInterval(bridgeStatusInterval);
    };
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentModelInfo = KIMI_MODELS_REGISTRY.find(m => m.id === config.selectedModel) || KIMI_MODELS_REGISTRY[0];

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed && attachedFiles.length === 0) return;
    if (isGenerating) return;

    setIsGenerating(true);
    const filesToSend = [...attachedFiles];
    setInput('');
    setAttachedFiles([]);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      await kimiLLMEngine.sendMessage(trimmed, filesToSend);
    } catch (err: any) {
      showToast(`❌ خطأ: ${err?.message || err}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setAttachedFiles(prev => [
          ...prev, 
          {
            name: file.name,
            size: file.size,
            type: file.type || 'text/plain',
            content: content
          }
        ]);
        showToast(`📎 تم إرفاق الملف بنجاح: ${file.name}`);
      };
      reader.readAsText(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopyCodeOrText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    showToast('📋 تم النسخ إلى الحافظة');
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const toggleThinking = (id: string) => {
    setExpandedThinking(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectModel = (modelId: string) => {
    const updated = { ...config, selectedModel: modelId };
    setConfig(updated);
    kimiLLMEngine.setConfig({ selectedModel: modelId });
    setShowModelsDropdown(false);
    showToast(`🔮 تم التحويل إلى نموذج: ${modelId}`);
  };

  const handleSaveApiKey = () => {
    const updated = { 
      ...config, 
      apiKey: tempApiKey.trim(),
      connectionMode: tempApiKey.trim().length > 0 ? ('api' as const) : ('sovereign_hybrid' as const)
    };
    setConfig(updated);
    kimiLLMEngine.setConfig(updated);
    setShowApiKeyModal(false);
    showToast('🔑 تم حفظ مفتاح Moonshot API بنجاح');
  };

  const handleExportChat = (format: 'md' | 'json') => {
    if (messages.length === 0) {
      showToast('⚠️ لا توجد رسائل لتصديرها');
      return;
    }
    let dataStr = '';
    let filename = `kimi_chat_${new Date().toISOString().slice(0, 10)}`;

    if (format === 'json') {
      dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(messages, null, 2));
      filename += '.json';
    } else {
      const mdContent = messages.map(m => {
        const header = m.role === 'user' ? '### 👤 المستخدم:' : `### 🔮 Kimi (${m.modelUsed || 'Moonshot'}):`;
        const thinking = m.thinkingContent ? `\n> **سلسلة التفكير (Thinking Chain):**\n> ${m.thinkingContent.replace(/\n/g, '\n> ')}\n` : '';
        return `${header}\n${thinking}\n${m.content}\n\n---\n`;
      }).join('\n');
      dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(mdContent);
      filename += '.md';
    }

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`📥 تم تصدير الحوار بصيغة ${format.toUpperCase()}`);
  };

  const promptPresets = {
    coding: [
      {
        title: 'هندسة بنية Full-Stack متقدمة',
        prompt: 'صمم بنية معمارية كاملة لتطبيق سحابي يربط بين خوادم Node.js وواجهات React مع محرك قواعد بيانات، وقدم الشيفرات الأساسية مع شرح تفصيلي في سلسلة التفكير.'
      },
      {
        title: 'تحليل وتصحيح كود بايثون معقد',
        prompt: 'حلل الخوارزمية التالية في بايثون، وقم بتشغيلها وفحصها ذاتياً لمعالجة أية ثغرات في الذاكرة أو التعقيد الزمني:\n```python\ndef optimize_matrix(n):\n    return [i**2 for i in range(n) if i % 2 == 0]\nprint("Matrix optimized:", len(optimize_matrix(1000)))\n```'
      },
      {
        title: 'كتابة خوارزمية ذكاء اصطناعي سيادية',
        prompt: 'اكتب خوارزمية بايثون متكاملة لحساب مصفوفة الارتباط العصبي (Neural Correlation Matrix) مع رسم النتائج النصية واختبارها عبر PyEngine.'
      }
    ],
    reasoning: [
      {
        title: 'استدلال علمي متعدد الخطوات (K1.5 CoT)',
        prompt: 'قم بتحليل معضلة كوانتومية معقدة: كيف يمكن تقليل الضوضاء الحرارية في معالجات QPU-128 فائقة التوصيل؟ فصل خطوات التفكير الرياضي بدقة داخل <thinking>.'
      },
      {
        title: 'تفكيك مسألة منطقية وحسابية',
        prompt: 'لدينا شبكة من 7 عقد حاسوبية كل عقدة ترسل 128 بت من البيانات المشفرة كل 4 ملي ثانية. احسب معدل التدفق الكلي ونسبة استهلاك النطاق الترددي عند تشفير AES-GCM.'
      }
    ],
    analysis: [
      {
        title: 'تحليل مستند واستخراج الحقائق الكبرى',
        prompt: 'قم بفحص المستندات المرفقة واستخرج منها: 1) الثغرات الجوهرية 2) التوصيات الاستراتيجية 3) ملخص تنفيذي لا يتجاوز 5 نقاط جوهرية.'
      },
      {
        title: 'مقارنة نماذج الذكاء الصينية والعالمية',
        prompt: 'قدم مقارنة استراتيجية محايدة وشاملة بين معمارية Kimi K1.5 (Moonshot) و DeepSeek R1 و Gemini 2.5 Pro من حيث نافذة السياق، كفاءة الاستدلال، والتكلفة.'
      }
    ],
    security: [
      {
        title: 'فحص أمني وتحصين ضد حقن البرومبت',
        prompt: 'فصل استراتيجية حماية كاملة (Prompt Injection & Jailbreak Defense) لنماذج LLM المستخدمة في الإنتاج، مع أمثلة على فلاتر الإدخال والتحقق.'
      },
      {
        title: 'استدعاء قبة دراغون والحماية السيادية L4',
        prompt: 'قم بإصدار أمر فوري لاستدعاء قبة دراغون السيادية [SARAH_COMMAND: SUMMON_MODULE | payload: dragon_dome] مع تحليل لمستوى الجاهزية الدفاعية للنظام.'
      }
    ]
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#020612] text-slate-100 font-arabic overflow-hidden relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[3000] px-5 py-2.5 bg-[#05142e]/95 border border-purple-500/50 rounded-2xl shadow-[0_0_35px_rgba(168,85,247,0.6)] text-white text-xs font-black backdrop-blur-xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header / Status & Model Bar */}
      <header className="bg-[#050c1e]/90 border-b border-purple-500/20 px-4 py-3 flex flex-wrap items-center justify-between gap-3 backdrop-blur-xl shrink-0 z-20">
        
        {/* Left: Brand & Model Selection */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 p-0.5 shadow-[0_0_20px_rgba(147,51,234,0.4)] flex items-center justify-center">
            <div className="w-full h-full bg-[#030816] rounded-2xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white flex items-center gap-1.5">
                <span>استوديو Kimi LLM السيادي</span>
                <span className="text-[9px] bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.2 rounded-full font-mono font-bold">
                  Moonshot Engine
                </span>
              </h2>
            </div>
            <p className="text-[10px] text-purple-300/80 font-mono">سياق فائق حتى 2M Token مع استدلال K1.5 وتنفيذ بايثون</p>
          </div>

          {/* Model Selector Dropdown Trigger */}
          <div className="relative mr-2">
            <button
              onClick={() => setShowModelsDropdown(!showModelsDropdown)}
              className="px-3 py-1.5 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-all shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
              <span>{currentModelInfo.name}</span>
              <span className="text-[9px] bg-purple-500/30 text-purple-200 px-1.5 py-0.5 rounded-md font-mono">
                {currentModelInfo.contextLabel}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-purple-400" />
            </button>

            {/* Dropdown Menu */}
            {showModelsDropdown && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-[#061026] border border-purple-500/40 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn backdrop-blur-2xl">
                <div className="text-[10px] font-black text-purple-300 px-2 py-1 border-b border-white/5 mb-1 flex items-center justify-between">
                  <span>نماذج Moonshot / Kimi المتاحة</span>
                  <span className="text-slate-400 font-mono">Select Active LLM</span>
                </div>
                <div className="space-y-1 max-h-72 overflow-y-auto custom-scrollbar">
                  {KIMI_MODELS_REGISTRY.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleSelectModel(m.id)}
                      className={`w-full text-right p-2.5 rounded-xl border transition-all flex flex-col gap-1 ${
                        config.selectedModel === m.id
                          ? 'bg-purple-600/30 border-purple-400 text-white shadow-lg'
                          : 'bg-white/5 border-transparent hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black">{m.name}</span>
                        <span className="text-[9px] font-mono bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">
                          {m.contextLabel}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-snug">{m.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Mode status & Actions */}
        <div className="flex items-center gap-2">
          
          {/* Connection Status Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-black/50 border border-white/10 rounded-xl text-xs">
            <span className="text-[10px] text-slate-400">وضع الاتصال:</span>
            {config.connectionMode === 'api' ? (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Moonshot API
              </span>
            ) : config.connectionMode === 'browser_bridge' ? (
              <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> Web Bridge (kimi.ai)
              </span>
            ) : (
              <span className="text-[10px] text-purple-300 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Sovereign Hybrid (Sarah)
              </span>
            )}
          </div>

          {/* Web Split View Toggle */}
          <button
            onClick={() => setSplitBrowserView(!splitBrowserView)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              splitBrowserView 
                ? 'bg-purple-600 text-white border-purple-400 shadow-md' 
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title="عرض موقع kimi.ai جنباً إلى جنب مع الاستوديو"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>عرض موقع Kimi</span>
          </button>

          {/* API Key Configure Button */}
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
            title="إعداد مفتاح Moonshot API"
          >
            <Key className="w-4 h-4 text-amber-400" />
          </button>

          {/* Settings Drawer Button */}
          <button
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            className={`p-2 rounded-xl border transition-all ${
              showSettingsDrawer 
                ? 'bg-purple-600 text-white border-purple-400' 
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title="إعدادات ومعاملات النموذج الفائقة"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Clear Chat */}
          <button
            onClick={() => {
              if (confirm('هل تريد مسح سجل المحادثة بالكامل؟')) {
                kimiLLMEngine.clearHistory();
                showToast('🧹 تم مسح سجل المحادثة');
              }
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-rose-950/40 border border-white/10 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-all"
            title="مسح الحوار"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Export Dropdown */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleExportChat('md')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1"
              title="تصدير الحوار كـ Markdown"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono">MD</span>
            </button>
            <button
              onClick={() => handleExportChat('json')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1"
              title="تصدير الحوار كـ JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono">JSON</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Area (Split or Full Screen) */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Chat & Reasoning Canvas */}
        <div className={`flex-1 flex flex-col h-full overflow-hidden transition-all ${splitBrowserView ? 'lg:w-1/2' : 'w-full'}`}>
          
          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-5">
            
            {/* Welcome / Empty State */}
            {messages.length === 0 && (
              <div className="max-w-3xl mx-auto my-8 text-center space-y-6 animate-fadeIn">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 p-1 shadow-[0_0_50px_rgba(168,85,247,0.4)]">
                  <div className="w-full h-full bg-[#040a1c] rounded-3xl flex items-center justify-center">
                    <Bot className="w-10 h-10 text-purple-400 animate-pulse" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-white">نظام الاستدلال وحوار نماذج Kimi (Moonshot AI)</h3>
                  <p className="text-xs text-slate-300 max-w-xl mx-auto mt-2 leading-relaxed">
                    منظومة متكاملة تتيح لك تشغيل أحدث نماذج Kimi مع استيعاب فائق يصل إلى 2 مليون توكن، واستعراض سلسلة التفكير المنطقي خطوة بخطوة، مع إمكانية تنفيذ أكواد بايثون ذاتياً واستدعاء وحدات صارة السيادية.
                  </p>
                </div>

                {/* Preset Categories */}
                <div className="bg-[#050f24] border border-purple-500/20 p-4 rounded-3xl text-right">
                  <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                    <span className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>قوالب البرومبتات السريعة الجاهزة</span>
                    </span>
                    <div className="flex gap-1">
                      {(['coding', 'reasoning', 'analysis', 'security'] as const).map(cat => (
                        <button
                          key={cat}
                          onClick={() => setActivePresetCategory(cat)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            activePresetCategory === cat
                              ? 'bg-purple-600 text-white shadow-sm'
                              : 'bg-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {cat === 'coding' && '💻 برمجة'}
                          {cat === 'reasoning' && '🧠 استدلال K1.5'}
                          {cat === 'analysis' && '📊 تحليل ضخم'}
                          {cat === 'security' && '🛡️ أمان سيادي'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {promptPresets[activePresetCategory].map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInput(preset.prompt);
                          if (textareaRef.current) textareaRef.current.focus();
                        }}
                        className="p-3 bg-black/40 hover:bg-purple-950/30 border border-white/5 hover:border-purple-500/40 rounded-2xl text-right transition-all group"
                      >
                        <div className="text-xs font-black text-white group-hover:text-purple-300 flex items-center justify-between">
                          <span>{preset.title}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {preset.prompt}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Message Render Loop */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-4xl mx-auto ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* Assistant Avatar */}
                {msg.role !== 'user' && (
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 shrink-0 shadow-md">
                    <div className="w-full h-full bg-[#030917] rounded-2xl flex items-center justify-center">
                      <Bot className="w-4 h-4 text-purple-400" />
                    </div>
                  </div>
                )}

                {/* Message Bubble Container */}
                <div
                  className={`flex flex-col gap-2 max-w-[85%] sm:max-w-[78%] ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {/* Sender & Timestamp header */}
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 px-1">
                    <span>{msg.role === 'user' ? '👤 أنت' : `🔮 Kimi (${msg.modelUsed || 'Moonshot'})`}</span>
                    <span>•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    {msg.latencyMs && (
                      <>
                        <span>•</span>
                        <span className="text-purple-400 font-bold">{msg.latencyMs}ms</span>
                      </>
                    )}
                    {msg.tokensUsed && (
                      <>
                        <span>•</span>
                        <span className="text-cyan-400">{msg.tokensUsed} tokens</span>
                      </>
                    )}
                  </div>

                  {/* Attachments if present */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-1">
                      {msg.attachments.map((att, i) => (
                        <div 
                          key={i} 
                          className="px-2.5 py-1 bg-purple-950/40 border border-purple-500/30 rounded-xl text-[10px] font-mono text-purple-300 flex items-center gap-1.5"
                        >
                          <Paperclip className="w-3 h-3" />
                          <span>{att.name}</span>
                          <span className="text-slate-400">({Math.round(att.size / 1024)} KB)</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Thinking Chain Block (K1.5 CoT Reasoning) */}
                  {msg.thinkingContent && (
                    <div className="w-full bg-[#050e22] border border-purple-500/30 rounded-2xl overflow-hidden shadow-inner mb-1">
                      <button
                        onClick={() => toggleThinking(msg.id)}
                        className="w-full px-3.5 py-2 bg-purple-950/30 hover:bg-purple-950/50 flex items-center justify-between text-right transition-colors"
                      >
                        <div className="flex items-center gap-2 text-xs font-black text-purple-300">
                          <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
                          <span>سلسلة التفكير والاستدلال (K1.5 Chain-of-Thought)</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-purple-400 font-mono">
                          <span>{expandedThinking[msg.id] !== false ? 'إخفاء' : 'عرض الخطوات'}</span>
                          {expandedThinking[msg.id] !== false ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </div>
                      </button>

                      {expandedThinking[msg.id] !== false && (
                        <div className="p-3.5 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap border-t border-purple-500/10 bg-black/40 text-right dir-rtl">
                          {msg.thinkingContent}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Main Bubble Content */}
                  <div
                    className={`p-4 rounded-3xl shadow-xl text-sm leading-relaxed text-right relative group ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-tr-none'
                        : 'bg-[#08122a] border border-purple-500/20 text-slate-100 rounded-tl-none w-full'
                    }`}
                  >
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyCodeOrText(msg.content, msg.id)}
                      className="absolute top-3 left-3 p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                      title="نسخ النص"
                    >
                      {copiedMsgId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <div className="prose prose-invert max-w-none text-right">
                      <ReactMarkdown>{msg.content || '...'}</ReactMarkdown>
                    </div>
                  </div>

                  {/* Tool Invocations Result Cards */}
                  {msg.toolInvocations && msg.toolInvocations.length > 0 && (
                    <div className="w-full space-y-2 mt-1">
                      {msg.toolInvocations.map((tool) => (
                        <div
                          key={tool.id}
                          className="bg-[#040c1e] border border-cyan-500/30 p-3 rounded-2xl text-right text-xs shadow-md"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              {tool.toolName === 'execute_python' && <Code2 className="w-4 h-4 text-cyan-400" />}
                              {tool.toolName === 'summon_sarah_module' && <Compass className="w-4 h-4 text-amber-400" />}
                              {tool.toolName === 'save_knowledge' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                              
                              <span className="font-black text-white">
                                {tool.toolName === 'execute_python' && '🐍 أداة تنفيذ بايثون الحقيقي (PyEngine WASM)'}
                                {tool.toolName === 'summon_sarah_module' && '🚀 استدعاء وحدة صارة السيادية'}
                                {tool.toolName === 'save_knowledge' && '💾 حفظ المعرفة في الخزينة'}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-[10px] font-mono">
                              {tool.status === 'running' && (
                                <span className="text-amber-400 flex items-center gap-1">
                                  <RefreshCw className="w-3 h-3 animate-spin" /> جاري التشغيل...
                                </span>
                              )}
                              {tool.status === 'completed' && (
                                <span className="text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> تم بنجاح ({tool.executionTimeMs}ms)
                                </span>
                              )}
                              {tool.status === 'failed' && (
                                <span className="text-rose-400 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" /> تعذر التنفيذ
                                </span>
                              )}
                            </div>
                          </div>

                          {tool.args && tool.args.code && (
                            <pre className="bg-black/60 p-2.5 rounded-xl text-[11px] font-mono text-cyan-300 overflow-x-auto my-1 border border-white/5 dir-ltr text-left">
                              {tool.args.code}
                            </pre>
                          )}

                          {tool.result && (
                            <div className="bg-black/80 p-2.5 rounded-xl border border-white/5 mt-1">
                              <span className="text-[9px] text-slate-400 font-mono block mb-0.5">مخرجات الطرفية (Output):</span>
                              <pre className="text-[11px] font-mono text-slate-200 whitespace-pre-wrap dir-ltr text-left">
                                {tool.result}
                              </pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                </div>

                {/* User Avatar */}
                {msg.role === 'user' && (
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 p-0.5 shrink-0 shadow-md">
                    <div className="w-full h-full bg-[#030917] rounded-2xl flex items-center justify-center text-xs font-black text-cyan-300">
                      U
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Generating Indicator */}
            {isGenerating && (
              <div className="flex gap-3 max-w-4xl mx-auto items-center text-xs text-purple-300 font-mono animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-purple-600/30 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                </div>
                <span>جاري معالجة واستدلال Kimi عبر نواة Moonshot فائقة السياق...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Attached Files Bar */}
          {attachedFiles.length > 0 && (
            <div className="bg-[#050e22] border-t border-purple-500/20 px-4 py-2 flex flex-wrap gap-2 items-center">
              <span className="text-[10px] text-slate-400 font-bold">المرفقات ({attachedFiles.length}):</span>
              {attachedFiles.map((file, idx) => (
                <div 
                  key={idx} 
                  className="px-2.5 py-1 bg-purple-950/60 border border-purple-500/40 rounded-xl text-xs text-purple-200 flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-mono">{file.name}</span>
                  <button
                    onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== idx))}
                    className="p-0.5 hover:text-rose-400 text-slate-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input & Action Terminal */}
          <div className="p-4 bg-[#040a1a] border-t border-purple-500/20 shrink-0">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex flex-col gap-2">
              
              <div className="relative flex items-end gap-2 bg-[#07132e] border border-purple-500/40 rounded-3xl p-2 focus-within:border-purple-400 focus-within:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all">
                
                {/* File Attachment Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-2xl bg-white/5 hover:bg-purple-900/40 text-purple-300 hover:text-white transition-all shrink-0"
                  title="إرفاق ملفات أو أكواد في سياق Kimi (2M Tokens)"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Auto-expanding Textarea */}
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={`اكتب رسالتك لنموذج ${currentModelInfo.name}... (Enter للإرسال، Shift+Enter لسطر جديد)`}
                  rows={1}
                  className="flex-1 bg-transparent border-0 text-white placeholder-slate-400 text-sm focus:outline-none resize-none max-h-44 py-2 px-2 custom-scrollbar text-right"
                  dir="auto"
                />

                {/* Optimize Prompt Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (input.trim()) {
                      setInput(kimiLLMEngine.optimizePromptForLongContext(input));
                      showToast('✨ تم تعزيز البرومبت لسياق 2M');
                    }
                  }}
                  className="p-2.5 rounded-2xl bg-white/5 hover:bg-purple-900/40 text-amber-300 hover:text-white transition-all shrink-0"
                  title="تحسين البرومبت لنافذة سياق Kimi 2M"
                >
                  <Sparkles className="w-4 h-4" />
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={isGenerating || (!input.trim() && attachedFiles.length === 0)}
                  className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black shadow-lg shadow-purple-900/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shrink-0 flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Quick Tools Pill Bar */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-purple-300">
                    <Brain className="w-3.5 h-3.5" /> الاستدلال: {config.enableThinking ? 'مفعل ⚡' : 'معطل'}
                  </span>
                  <span className="flex items-center gap-1 text-cyan-300">
                    <Code2 className="w-3.5 h-3.5" /> بايثون: {config.enablePythonTool ? 'تلقائي' : 'معطل'}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-300">
                    <Globe className="w-3.5 h-3.5" /> السعة: {currentModelInfo.contextLabel}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://kimi.ai"
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>فتح موقع kimi.ai</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </form>
          </div>

        </div>

        {/* Optional Right Side: kimi.ai Live Web Iframe / Bridge */}
        {splitBrowserView && (
          <div className="hidden lg:flex flex-col w-1/2 border-r border-purple-500/20 bg-[#030714] h-full">
            <div className="p-3 bg-[#061026] border-b border-purple-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-black text-white">متصفح Kimi المباشر (kimi.ai)</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://kimi.ai"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 rounded-lg bg-purple-600/30 text-purple-200 hover:bg-purple-600 text-[10px] font-bold flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>نافذة جديدة</span>
                </a>
                <button
                  onClick={() => setSplitBrowserView(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 relative bg-black">
              <iframe
                src="https://kimi.ai"
                title="Kimi AI Web App"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </div>
        )}

      </div>

      {/* Settings Side Drawer */}
      {showSettingsDrawer && (
        <div className="fixed inset-y-0 left-0 w-full sm:w-96 bg-[#040c1e]/95 backdrop-blur-2xl border-r border-purple-500/30 shadow-[0_0_80px_rgba(0,0,0,0.8)] z-[2500] p-5 flex flex-col overflow-y-auto custom-scrollbar font-arabic animate-slideIn">
          
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-black text-white">معاملات وإعدادات Kimi LLM</h3>
            </div>
            <button
              onClick={() => setShowSettingsDrawer(false)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 text-right">
            
            {/* Connection Mode */}
            <div className="bg-black/40 p-3 rounded-2xl border border-white/5 space-y-2">
              <label className="text-xs font-black text-white block">طريقة الاتصال بمحرك Kimi:</label>
              <div className="grid grid-cols-3 gap-1">
                {(['sovereign_hybrid', 'api', 'browser_bridge'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => {
                      const upd = { ...config, connectionMode: mode };
                      setConfig(upd);
                      kimiLLMEngine.setConfig(upd);
                    }}
                    className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-all ${
                      config.connectionMode === mode
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode === 'sovereign_hybrid' && '🔮 هجين سيادي'}
                    {mode === 'api' && '🔑 API مباشر'}
                    {mode === 'browser_bridge' && '🌐 جسر المتصفح'}
                  </button>
                ))}
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="bg-black/40 p-3 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">درجة الحرارة (Temperature):</span>
                <span className="text-xs font-mono text-purple-300 font-bold">{config.temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.5"
                step="0.05"
                value={config.temperature}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  const upd = { ...config, temperature: val };
                  setConfig(upd);
                  kimiLLMEngine.setConfig(upd);
                }}
                className="w-full accent-purple-500"
              />
              <span className="text-[10px] text-slate-400 block">قيم أقل للدقة البرمجية والرياضية، قيم أعلى للإبداع.</span>
            </div>

            {/* Top P Slider */}
            <div className="bg-black/40 p-3 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">Top-P (Nucleus Sampling):</span>
                <span className="text-xs font-mono text-purple-300 font-bold">{config.topP}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={config.topP}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  const upd = { ...config, topP: val };
                  setConfig(upd);
                  kimiLLMEngine.setConfig(upd);
                }}
                className="w-full accent-purple-500"
              />
            </div>

            {/* Max Output Tokens */}
            <div className="bg-black/40 p-3 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">أقصى توكنز للإجابة (Max Tokens):</span>
                <span className="text-xs font-mono text-purple-300 font-bold">{config.maxTokens}</span>
              </div>
              <input
                type="range"
                min="512"
                max="16384"
                step="512"
                value={config.maxTokens}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  const upd = { ...config, maxTokens: val };
                  setConfig(upd);
                  kimiLLMEngine.setConfig(upd);
                }}
                className="w-full accent-purple-500"
              />
            </div>

            {/* Thinking Chain Toggle */}
            <div className="bg-black/40 p-3 rounded-2xl border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-white block">سلسلة التفكير (Thinking CoT)</span>
                <span className="text-[10px] text-slate-400">عرض مسار الاستدلال التحليلي للنموذج</span>
              </div>
              <button
                onClick={() => {
                  const upd = { ...config, enableThinking: !config.enableThinking };
                  setConfig(upd);
                  kimiLLMEngine.setConfig(upd);
                }}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  config.enableThinking ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    config.enableThinking ? 'translate-x-0' : '-translate-x-5'
                  }`}
                />
              </button>
            </div>

            {/* Python WASM Tool Toggle */}
            <div className="bg-black/40 p-3 rounded-2xl border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-white block">مفاعل بايثون الذاتي (PyEngine)</span>
                <span className="text-[10px] text-slate-400">تشغيل أكواد بايثون الحقيقية داخل WASM</span>
              </div>
              <button
                onClick={() => {
                  const upd = { ...config, enablePythonTool: !config.enablePythonTool };
                  setConfig(upd);
                  kimiLLMEngine.setConfig(upd);
                }}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  config.enablePythonTool ? 'bg-cyan-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    config.enablePythonTool ? 'translate-x-0' : '-translate-x-5'
                  }`}
                />
              </button>
            </div>

            {/* System Persona / Prompt */}
            <div className="bg-black/40 p-3 rounded-2xl border border-white/5 space-y-2">
              <span className="text-xs font-black text-white block">البرومبت التوجيهي للنظام (System Prompt):</span>
              <textarea
                value={config.systemPrompt}
                onChange={(e) => {
                  const upd = { ...config, systemPrompt: e.target.value };
                  setConfig(upd);
                  kimiLLMEngine.setConfig(upd);
                }}
                rows={4}
                className="w-full bg-black/60 border border-white/10 rounded-xl p-2 text-xs text-slate-200 custom-scrollbar text-right"
              />
            </div>

          </div>

          <div className="mt-auto pt-4 border-t border-white/10">
            <button
              onClick={() => {
                setShowSettingsDrawer(false);
                showToast('✅ تم حفظ كافة الإعدادات بنجاح');
              }}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg"
            >
              حفظ وإغلاق
            </button>
          </div>

        </div>
      )}

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[3000] flex items-center justify-center p-4">
          <div className="bg-[#050e24] border border-purple-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scaleUp text-right font-arabic">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-white">إعداد مفتاح Moonshot AI API</h3>
              </div>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              إذا كنت تملك مفتاح API من منصة Moonshot AI (kimi.ai)، يمكنك إدخاله هنا للاتصال المباشر بنماذج `moonshot-v1-8k/32k/128k`. (في حال تركه فارغاً، سيعمل الاستوديو بنمط المحاكي السيادي الهجين مجاناً).
            </p>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Moonshot API Key:</label>
              <input
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white font-mono focus:border-purple-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href="https://platform.moonshot.cn"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-purple-400 hover:text-white flex items-center gap-1"
              >
                <span>الحصول على مفتاح من Moonshot</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-3 py-2 rounded-xl bg-white/5 text-slate-300 hover:text-white text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSaveApiKey}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black shadow-lg"
                >
                  حفظ المفتاح
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
