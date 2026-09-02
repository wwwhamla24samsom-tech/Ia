import React, { useState, useEffect, useRef } from 'react';
import { AppTab } from '../types';
import { sovereignVoiceCommander, VoiceCommandIntent, VoiceEngineConfig } from '../services/sovereignVoiceCommander';
import { realPythonRuntime } from '../services/realPythonEngine';
import { dragonShield } from '../services/dragonDomeEngine';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Radio, 
  Terminal, 
  Cpu, 
  Shield, 
  Sparkles, 
  Bot, 
  Play, 
  Settings, 
  RefreshCw, 
  Activity, 
  Zap, 
  Layers, 
  Code, 
  Globe, 
  CheckCircle2, 
  Sliders, 
  ArrowRight,
  Flame,
  Volume1
} from 'lucide-react';

interface VoiceHubProps {
  onNavigate: (tab: AppTab) => void;
  language?: string;
}

export const VoiceHub: React.FC<VoiceHubProps> = ({ onNavigate, language = 'ar' }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [history, setHistory] = useState<VoiceCommandIntent[]>([]);
  const [lastIntent, setLastIntent] = useState<VoiceCommandIntent | null>(null);
  
  // Custom config
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState<VoiceEngineConfig>(sovereignVoiceCommander.getConfig());
  const [manualCommandInput, setManualCommandInput] = useState('');
  const [activeTab, setActiveTab] = useState<'commander' | 'python_voice' | 'rules' | 'config'>('commander');

  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sovereignVoiceCommander.setNavigationCallback((tab: AppTab) => {
      onNavigate(tab);
    });

    const unsubscribe = sovereignVoiceCommander.subscribe((state) => {
      setIsListening(state.isListening);
      setIsSpeaking(state.isSpeaking);
      setTranscript(state.currentTranscript);
      setAudioLevel(state.audioLevel);
      setHistory(state.history);
      setLastIntent(state.lastIntent);
    });

    return () => {
      unsubscribe();
    };
  }, [onNavigate]);

  const handleToggleMic = () => {
    sovereignVoiceCommander.toggleListening();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCommandInput.trim()) return;
    sovereignVoiceCommander.processVoiceCommand(manualCommandInput.trim());
    setManualCommandInput('');
  };

  const handleQuickCommand = (cmd: string) => {
    sovereignVoiceCommander.processVoiceCommand(cmd);
  };

  const handleConfigChange = (key: keyof VoiceEngineConfig, val: any) => {
    const updated = { ...config, [key]: val };
    setConfig(updated);
    sovereignVoiceCommander.saveConfig(updated);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#05060f] text-white p-4 md:p-6 overflow-y-auto space-y-6">
      
      {/* Header Banner - Sovereign & Isolated from Gemini */}
      <div className="relative rounded-3xl p-6 bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-indigo-950/40 border border-blue-500/30 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
              isListening 
                ? 'bg-red-500/20 border-red-400 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.5)] scale-105 animate-pulse' 
                : isSpeaking 
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]' 
                : 'bg-blue-600/20 border-blue-400/40 text-blue-400'
            }`}>
              {isListening ? (
                <Radio className="w-8 h-8 animate-ping" />
              ) : isSpeaking ? (
                <Volume2 className="w-8 h-8 animate-bounce" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </div>
            {/* Status Dot */}
            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-[#05060f] ${
              isListening ? 'bg-red-500 animate-ping' : isSpeaking ? 'bg-emerald-400' : 'bg-blue-500'
            }`} />
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-indigo-300">
                نظام التحدث والقيادة الصوتية السيادي (Sovereign Voice Orchestrator)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 border border-emerald-400/50 text-emerald-300">
                🛡️ معزول ومنفصل 100% عن Gemini
              </span>
            </div>
            <p className="text-xs md:text-sm text-blue-200/70 mt-1">
              التحكم اللحظي المباشر في كافة وحدات صارة وبايثون وقبة دراغون بالأوامر الصوتية الحية واستجابة نطق سيادية فورية.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3 rounded-2xl border transition-all flex items-center gap-2 text-xs font-bold ${
              showSettings 
                ? 'bg-blue-600 text-white border-blue-400' 
                : 'bg-blue-900/30 hover:bg-blue-900/50 border-blue-500/30 text-blue-300'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>إعدادات الصوت والنبرة</span>
          </button>

          {isSpeaking && (
            <button
              onClick={() => sovereignVoiceCommander.stopSpeaking()}
              className="p-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2"
            >
              <VolumeX className="w-4 h-4" />
              <span>إسكات الصوت</span>
            </button>
          )}

          <button
            onClick={handleToggleMic}
            className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-3 transition-all duration-300 shadow-xl ${
              isListening
                ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-500/30 animate-pulse'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/30'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5" />
                <span>إيقاف الاستماع</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>تحدث الآن بالصوت</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Settings Modal/Drawer */}
      {showSettings && (
        <div className="bg-[#090b17] border border-blue-500/30 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              <span>خيارات المحرك الصوتي السيادي المنفصل</span>
            </h3>
            <span className="text-[11px] text-blue-300/60">محرك ويب نقي بدون واجهات خارجية</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-white/70 block mb-1.5">اللهجة واللغة الصوتية</label>
              <select
                value={config.voiceLanguage}
                onChange={(e) => handleConfigChange('voiceLanguage', e.target.value)}
                className="w-full bg-[#111427] border border-blue-500/30 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-400"
              >
                <option value="ar-SA">العربية (السعودية - فصحى)</option>
                <option value="ar-EG">العربية (مصر)</option>
                <option value="ar-DZ">العربية (الجزائر)</option>
                <option value="ar-AE">العربية (الإمارات)</option>
                <option value="en-US">English (US)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-white/70 block mb-1.5">سرعة النطق ({config.speechRate}x)</label>
              <input
                type="range"
                min="0.7"
                max="1.5"
                step="0.05"
                value={config.speechRate}
                onChange={(e) => handleConfigChange('speechRate', parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="text-xs text-white/70 block mb-1.5">نبرة الصوت (Pitch: {config.speechPitch})</label>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={config.speechPitch}
                onChange={(e) => handleConfigChange('speechPitch', parseFloat(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.autoSpeakResponse}
                onChange={(e) => handleConfigChange('autoSpeakResponse', e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span className="text-white/80">النطق التلقائي الفوري لردود صارة</span>
            </label>

            <button
              onClick={() => sovereignVoiceCommander.speak('أهلاً بك، تم ضبط إعدادات النطق الصوتي السيادي بنجاح.')}
              className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 rounded-xl text-blue-300 flex items-center gap-2 font-bold"
            >
              <Volume1 className="w-3.5 h-3.5" />
              <span>اختبار نبرة الصوت الآن</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left/Main Column: Active Audio Visualizer, Live Transcript, History */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Realtime Waveform & Active Listening Stage */}
          <div className="bg-[#090b1a] border border-blue-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col items-center justify-center min-h-[220px] text-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-radial from-blue-600/10 via-transparent to-transparent pointer-events-none" />

            {/* Visualizer bars */}
            <div className="flex items-center gap-1.5 h-16 mb-4">
              {[...Array(24)].map((_, i) => {
                const height = isListening
                  ? Math.max(8, Math.sin(i * 0.4 + Date.now() * 0.005) * 48 * audioLevel + 12)
                  : isSpeaking
                  ? Math.max(6, Math.cos(i * 0.5) * 36 + 10)
                  : 4;
                return (
                  <div
                    key={i}
                    style={{ height: `${height}px` }}
                    className={`w-1.5 rounded-full transition-all duration-75 ${
                      isListening
                        ? 'bg-gradient-to-t from-red-500 to-rose-300'
                        : isSpeaking
                        ? 'bg-gradient-to-t from-emerald-500 to-teal-300'
                        : 'bg-blue-500/20'
                    }`}
                  />
                );
              })}
            </div>

            {/* Current State Text */}
            <div className="text-sm font-bold">
              {isListening ? (
                <span className="text-red-400 flex items-center gap-2 animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  صارة تستمع إليك الآن... تحدث بأي أمر أو نظام
                </span>
              ) : isSpeaking ? (
                <span className="text-emerald-400 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 animate-bounce" />
                  صارة تتحدث وتجيبك صوتياً...
                </span>
              ) : (
                <span className="text-white/60">
                  انقر على زر "تحدث بالصوت" أو اكتب الأمر أدناه للتحكم اللحظي
                </span>
              )}
            </div>

            {/* Live Transcript Display */}
            {transcript && (
              <div className="mt-4 px-4 py-2 bg-black/40 border border-white/10 rounded-2xl max-w-xl text-xs md:text-sm text-blue-200 font-mono">
                "{transcript}"
              </div>
            )}
          </div>

          {/* Quick Vocal Commands / Triggers */}
          <div className="bg-[#090b1a] border border-white/5 rounded-3xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white/80 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>أوامر صوتية سريعة بنقرة واحدة (تجربة صوتية حية)</span>
              </span>
              <span className="text-[11px] text-white/40">تنفذ بالصوت أو النقر</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {[
                { label: 'افتح استوديو كيمي', cmd: 'افتح استوديو كيمي', icon: '🔮', color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-300' },
                { label: 'شغل قبة دراغون', cmd: 'فعل قبة دراغون والحماية القصوى', icon: '🐉', color: 'from-rose-500/20 to-red-500/20 border-rose-500/30 text-rose-300' },
                { label: 'شغل مفاعل بايثون', cmd: 'افتح مفاعل بايثون', icon: '🐍', color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300' },
                { label: 'الكمبيوتر الكمومي', cmd: 'شغل الكمبيوتر الكمومي الخارق', icon: '💻', color: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300' },
                { label: 'تسريع تيربو 528Hz', cmd: 'فعل التيربو الشامل وسرعة النواة', icon: '⚡', color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30 text-amber-300' },
                { label: 'احسب 25 * 40', cmd: 'احسب 25 * 40', icon: '🔢', color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300' },
                { label: 'فحص صحة النظام', cmd: 'فحص النظام وحالة النواة', icon: '🩺', color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-300' },
                { label: 'من أنتِ يا صارة؟', cmd: 'مرحبا من انت وعرفي بنفسك', icon: '👑', color: 'from-pink-500/20 to-purple-500/20 border-pink-500/30 text-pink-300' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickCommand(item.cmd)}
                  className={`p-2.5 rounded-2xl bg-gradient-to-br ${item.color} border text-right transition-all hover:scale-102 active:scale-98 flex items-center gap-2`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="text-xs font-bold truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input (Fallback / Testing) */}
          <form onSubmit={handleManualSubmit} className="relative flex items-center">
            <input
              type="text"
              value={manualCommandInput}
              onChange={(e) => setManualCommandInput(e.target.value)}
              placeholder="اكتب أمراً صوتياً باللغة العربية (مثال: 'افتح قبة دراغون' أو 'احسب 120 + 350' أو 'تيربو')..."
              className="w-full bg-[#0d1024] border border-blue-500/30 rounded-2xl pl-12 pr-4 py-3.5 text-xs md:text-sm text-white placeholder-white/40 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
            />
            <button
              type="submit"
              className="absolute left-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <span>تنفيذ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Command Execution Log Stream */}
          <div className="bg-[#090b1a] border border-white/5 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>سجل الأوامر الصوتية الحية المفسرة محلياً</span>
              </span>
              <span className="text-[10px] text-white/50">{history.length} أمر مسجل</span>
            </div>

            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {history.length === 0 ? (
                <div className="text-center py-8 text-white/40 text-xs">
                  لا توجد أوامر بعد. اضغط على الميكروفون وتحدث بصوتك مباشرة!
                </div>
              ) : (
                history.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                          {item.recognizedIntent}
                        </span>
                        <span className="text-white/60 text-[10px]">
                          {item.executedAt ? new Date(item.executedAt).toLocaleTimeString('ar-SA') : ''}
                        </span>
                      </div>
                      <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        تم التنفيذ
                      </span>
                    </div>

                    <div className="text-white font-medium">
                      🗣️ المسموع: <span className="text-blue-200 font-bold">"{item.rawTranscript}"</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/20 text-blue-100 flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <Volume2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item.speechResponse}</span>
                      </div>
                      <button
                        onClick={() => sovereignVoiceCommander.speak(item.speechResponse)}
                        title="إعادة نطق الرد"
                        className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
              <div ref={historyEndRef} />
            </div>
          </div>
        </div>

        {/* Right Column: Sovereign Architecture, Capabilities, and System Modules Map */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Sovereign Isolation Badge Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/30 to-teal-950/20 border border-emerald-500/30 shadow-xl space-y-3">
            <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
              <Shield className="w-5 h-5" />
              <span>استقلالية تامة عن Gemini</span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              يعمل هذا النظام الصوتي عبر تقنيات التعرف المباشر وتوليد الكلام في متصفحك، مع محرك استدلال قواعدي سيادي (Sovereign Rule Engine) يتفاعل مع وحدات النظام محلياً بدون إرسال صوتك أو استدعاء أي خوادم خارجية.
            </p>
            <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[11px] text-emerald-300">
              <span>زمن الاستجابة:</span>
              <span className="font-mono font-bold">&lt; 15ms (لحظي)</span>
            </div>
          </div>

          {/* Connected Sovereign Systems Map */}
          <div className="bg-[#090b1a] border border-white/10 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>الأنظمة الخاضعة للتحكم الصوتي المباشر</span>
            </h3>

            <div className="space-y-2.5">
              {[
                { name: 'استوديو Kimi LLM ونماذج Moonshot', tab: AppTab.KIMI_LLM_STUDIO, icon: '🔮', desc: 'محادثة استدلالية وسياق 2M توكن' },
                { name: 'قبة دراغون والدرع السيادي L4', tab: AppTab.DRAGON_DOME, icon: '🐉', desc: 'تأمين النواة وصد الهجمات' },
                { name: 'الكمبيوتر الكمومي الخارق QPU-128', tab: AppTab.QUANTUM_DEV_COMPUTER, icon: '💻', desc: 'الشاشة الخضراء وموجه الأوامر' },
                { name: 'مفاعل بايثون الحقيقي WASM', tab: AppTab.PYTHON_FORGE, icon: '🐍', desc: 'تشغيل الحسابات والأكواد محلياً' },
                { name: 'الدردشة البيضاء ونظام الوديان', tab: AppTab.WHITE_STRATEGIC_CHAT, icon: '💬', desc: 'الاستراتيجية وتوليد المخرجات' },
                { name: 'جسر المتصفح وتكامل Kimi الخارجي', tab: AppTab.AI_BROWSER, icon: '⚡', desc: 'مزامنة الأوامر مع موقع kimi.ai' },
                { name: 'الشاشة الواحدة السيادية صارة v17', tab: AppTab.HOME, icon: '☀️', desc: 'الواجهة الشاملة وسهم التوجيه الذكي' }
              ].map((sys, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigate(sys.tab)}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-blue-600/20 border border-white/5 hover:border-blue-500/40 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{sys.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                        {sys.name}
                      </div>
                      <div className="text-[10px] text-white/50">{sys.desc}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Voice Commander Hints */}
          <div className="p-4 rounded-3xl bg-blue-950/20 border border-blue-500/20 space-y-2 text-xs text-blue-200/80">
            <div className="font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-400" />
              <span>أمثلة عبارات يمكنك قولها:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-blue-300/70">
              <li>"افتح استوديو كيمي"</li>
              <li>"شغل قبة دراغون الدفاعية"</li>
              <li>"احسب خمسين في سبعين"</li>
              <li>"فعل التيربو الشامل وسرعة النواة"</li>
              <li>"افتح الشاشة الواحدة"</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
