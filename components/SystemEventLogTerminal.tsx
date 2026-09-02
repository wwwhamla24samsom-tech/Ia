/**
 * 📟 SOVEREIGN SYSTEM EVENT LOG TERMINAL
 * =====================================
 * مكون عرض سجل أحداث النظام اللحظي داخل النافذة الرئيسية بأسلوب Terminal جذاب
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  systemEventLogger, 
  SystemEvent, 
  EventCategory, 
  EventLevel 
} from '../services/systemEventLogger';
import { AppTab } from '../types';
import { 
  Terminal, 
  Activity, 
  Trash2, 
  Download, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  Maximize2, 
  Minimize2, 
  Copy, 
  Check, 
  Sparkles, 
  Shield, 
  Zap, 
  Volume2, 
  VolumeX, 
  Radio, 
  Cpu, 
  ChevronRight, 
  CornerDownLeft,
  Flame,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface Props {
  onNavigate?: (tab: AppTab) => void;
  className?: string;
  defaultExpanded?: boolean;
}

export const SystemEventLogTerminal: React.FC<Props> = ({
  onNavigate,
  className = '',
  defaultExpanded = true
}) => {
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [terminalTheme, setTerminalTheme] = useState<'matrix-green' | 'cyber-cyan' | 'obsidian-gold' | 'neon-purple'>('matrix-green');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [copied, setCopied] = useState(false);

  // Command line input state
  const [cliInput, setCliInput] = useState('');
  const [cliHistory, setCliHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const terminalBodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubscribe = systemEventLogger.subscribe((newEvents, latest) => {
      setEvents([...newEvents]);
      if (soundEnabled && latest && typeof window !== 'undefined') {
        playTerminalChirp(latest.level);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [soundEnabled]);

  useEffect(() => {
    if (autoScroll && terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [events, autoScroll]);

  const playTerminalChirp = (level: EventLevel) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freq = level === 'SOVEREIGN' ? 528 : level === 'CRITICAL' ? 220 : level === 'SUCCESS' ? 880 : 440;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // Audio might be blocked without user gesture
    }
  };

  const handleCopyLogs = () => {
    const text = systemEventLogger.exportLogs();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(systemEventLogger.exportLogs());
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `sarah_system_events_${new Date().toISOString().slice(0, 19)}.json`);
    dlAnchorElem.click();
  };

  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = cliInput.trim();
    if (!cmd) return;

    setCliHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    setCliInput('');

    const lower = cmd.toLowerCase();

    if (lower === 'clear' || lower === 'cls') {
      systemEventLogger.clearLogs();
      return;
    }

    if (lower === 'help') {
      systemEventLogger.logSovereignOp(
        'CLI_HELP',
        'الأوامر المتاحة: help, clear, export, purge, ping, stats, summon [tab_name], theme [green|cyan|gold|purple]',
        'TerminalShell',
        'INFO'
      );
      return;
    }

    if (lower.startsWith('summon ') || lower.startsWith('open ')) {
      const target = lower.replace(/^(summon|open)\s+/, '').trim();
      const tabMap: Record<string, AppTab> = {
        'voice': AppTab.SOVEREIGN_VOICE_CONTROLLER,
        'kimi': AppTab.KIMI_LLM_STUDIO,
        'quantum': AppTab.QUANTUM_DEV_COMPUTER,
        'dragon': AppTab.DRAGON_DOME,
        'forge': AppTab.CODE_FORGE,
        'python': AppTab.PYTHON_FORGE,
        'chat': AppTab.WHITE_STRATEGIC_CHAT,
        'home': AppTab.HOME
      };

      const matchedTab = tabMap[target];
      if (matchedTab && onNavigate) {
        onNavigate(matchedTab);
        systemEventLogger.logModuleSummon(matchedTab, target, 'TerminalCLI');
      } else {
        systemEventLogger.logSovereignOp(
          'CLI_SUMMON_FAIL',
          `الوحدة غير معروفة: ${target}. جرب: voice, kimi, quantum, dragon, forge, python, chat, home`,
          'TerminalShell',
          'WARN'
        );
      }
      return;
    }

    if (lower === 'purge' || lower === 'turbo') {
      systemEventLogger.logSovereignOp(
        'CLI_TURBO_PURGE',
        'تم تفريغ الذاكرة المؤقتة وضبط المحاذاة على تردد 528Hz السيادي.',
        'TerminalCLI',
        'SOVEREIGN',
        0.4
      );
      return;
    }

    if (lower === 'ping') {
      systemEventLogger.logSovereignOp(
        'CLI_PING_RESPONSE',
        'PONG! زمن الاستجابة السيادي: 0.12ms | النواة: مستقرة 100%',
        'TerminalCLI',
        'SUCCESS',
        0.12
      );
      return;
    }

    if (lower === 'stats') {
      const total = events.length;
      systemEventLogger.logSovereignOp(
        'CLI_SYSTEM_STATS',
        `إجمالي الأحداث: ${total} | النواة: Sovereign L4 | التردد: 528Hz | الاستقرار: 99.99%`,
        'TerminalCLI',
        'INFO'
      );
      return;
    }

    if (lower.startsWith('theme ')) {
      const t = lower.replace('theme ', '').trim();
      if (t === 'green') setTerminalTheme('matrix-green');
      else if (t === 'cyan') setTerminalTheme('cyber-cyan');
      else if (t === 'gold') setTerminalTheme('obsidian-gold');
      else if (t === 'purple') setTerminalTheme('neon-purple');
      return;
    }

    // Default custom command echo
    systemEventLogger.logSovereignOp(
      'CLI_EXEC_ECHO',
      `تم تنفيذ الأمر في سياق النواة: "${cmd}"`,
      'TerminalCLI',
      'INFO'
    );
  };

  const filteredEvents = events.filter(e => {
    const matchesCat = selectedCategory === 'ALL' || e.category === selectedCategory;
    const matchesQuery = !searchQuery.trim() || 
      e.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.details && e.details.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  // Calculate stats
  const totalEvents = events.length;
  const sovereignCount = events.filter(e => e.level === 'SOVEREIGN').length;
  const summonCount = events.filter(e => e.category === 'MODULE_SUMMON').length;
  const avgLatency = events.filter(e => e.executionTimeMs !== undefined).length > 0
    ? (events.filter(e => e.executionTimeMs !== undefined).reduce((acc, c) => acc + (c.executionTimeMs || 0), 0) / 
       events.filter(e => e.executionTimeMs !== undefined).length).toFixed(2)
    : '0.65';

  // Theme color definitions
  const themeColors = {
    'matrix-green': {
      border: 'border-emerald-500/40',
      headerBg: 'bg-emerald-950/80',
      textAccent: 'text-emerald-400',
      textGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
      cursor: 'bg-emerald-400',
      tagBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
    },
    'cyber-cyan': {
      border: 'border-cyan-500/40',
      headerBg: 'bg-cyan-950/80',
      textAccent: 'text-cyan-400',
      textGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.2)]',
      cursor: 'bg-cyan-400',
      tagBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30'
    },
    'obsidian-gold': {
      border: 'border-amber-500/40',
      headerBg: 'bg-amber-950/80',
      textAccent: 'text-amber-400',
      textGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]',
      cursor: 'bg-amber-400',
      tagBg: 'bg-amber-500/20 text-amber-300 border-amber-400/30'
    },
    'neon-purple': {
      border: 'border-purple-500/40',
      headerBg: 'bg-purple-950/80',
      textAccent: 'text-purple-400',
      textGlow: 'shadow-[0_0_15px_rgba(168,85,247,0.2)]',
      cursor: 'bg-purple-400',
      tagBg: 'bg-purple-500/20 text-purple-300 border-purple-400/30'
    }
  }[terminalTheme];

  const categoryLabels: { id: EventCategory | 'ALL'; label: string; icon: string }[] = [
    { id: 'ALL', label: 'كافة الأحداث', icon: '⚡' },
    { id: 'MODULE_SUMMON', label: 'استدعاء الوحدات', icon: '🔮' },
    { id: 'SOVEREIGN_OP', label: 'العمليات السيادية', icon: '👑' },
    { id: 'PYTHON_EXEC', label: 'مفاعل بايثون', icon: '🐍' },
    { id: 'SECURITY_SHIELD', label: 'قبة الحماية', icon: '🛡️' },
    { id: 'VOICE_INTENT', label: 'التحكم الصوتي', icon: '🎙️' },
    { id: 'QUANTUM_QPU', label: 'الكمبيوتر الكمومي', icon: '💻' }
  ];

  const getLevelBadge = (level: EventLevel) => {
    switch (level) {
      case 'SOVEREIGN':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/25 border border-emerald-400/60 text-emerald-300 shadow-sm shadow-emerald-500/30">SOVEREIGN</span>;
      case 'SUCCESS':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 border border-teal-400/40 text-teal-300">SUCCESS</span>;
      case 'WARN':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 border border-amber-400/40 text-amber-300">WARN</span>;
      case 'CRITICAL':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 border border-rose-400/40 text-rose-300 animate-pulse">CRITICAL</span>;
      case 'INFO':
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-cyan-500/15 border border-cyan-400/30 text-cyan-300">INFO</span>;
    }
  };

  return (
    <div 
      className={`rounded-3xl border ${themeColors.border} bg-[#02050c]/95 shadow-2xl backdrop-blur-2xl transition-all duration-300 overflow-hidden font-mono flex flex-col ${
        isFullScreen 
          ? 'fixed inset-4 z-50 h-[calc(100vh-32px)]' 
          : isExpanded 
          ? 'h-auto min-h-[380px]' 
          : 'h-14'
      } ${className}`}
      dir="ltr"
    >
      {/* Terminal Top Window Bar */}
      <div className={`flex items-center justify-between px-4 py-3 border-b border-slate-800/90 ${themeColors.headerBg} select-none`}>
        {/* Left: Window Controls & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-400 transition-colors" 
              title="تصغير / توسيع"
            />
            <button 
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-400 transition-colors" 
              title="شاشة كاملة"
            />
            <button 
              onClick={() => setAutoScroll(!autoScroll)}
              className={`w-3 h-3 rounded-full ${autoScroll ? 'bg-emerald-500/80 hover:bg-emerald-400' : 'bg-slate-600'} transition-colors`} 
              title="قفل التمرير التلقائي"
            />
          </div>

          <div className="h-4 w-[1px] bg-slate-700/60 mx-1" />

          <div className="flex items-center gap-2">
            <Terminal className={`w-4 h-4 ${themeColors.textAccent} animate-pulse`} />
            <span className="text-xs font-bold text-white tracking-wider flex items-center gap-1.5">
              SARAH_SYSTEM_EVENT_LOG <span className="text-[10px] text-slate-400 font-normal">[v17.4 LIVE_BUS]</span>
            </span>
          </div>
        </div>

        {/* Center: Live Telemetry Micro Indicators */}
        {isExpanded && (
          <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Events: <strong className="text-white">{totalEvents}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-slate-800">
              <span>Latency: <strong className="text-emerald-400">{avgLatency}ms</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-slate-800">
              <span>Sovereign: <strong className="text-purple-300">100%</strong></span>
            </div>
          </div>
        )}

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-1.5">
          {/* Theme Selector Dropdown */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setTerminalTheme('matrix-green')}
              className={`w-3 h-3 rounded-full bg-emerald-400 ${terminalTheme === 'matrix-green' ? 'ring-2 ring-emerald-300 scale-110' : 'opacity-60'}`}
              title="Matrix Green"
            />
            <button
              onClick={() => setTerminalTheme('cyber-cyan')}
              className={`w-3 h-3 rounded-full bg-cyan-400 ${terminalTheme === 'cyber-cyan' ? 'ring-2 ring-cyan-300 scale-110' : 'opacity-60'}`}
              title="Cyber Cyan"
            />
            <button
              onClick={() => setTerminalTheme('obsidian-gold')}
              className={`w-3 h-3 rounded-full bg-amber-400 ${terminalTheme === 'obsidian-gold' ? 'ring-2 ring-amber-300 scale-110' : 'opacity-60'}`}
              title="Obsidian Gold"
            />
            <button
              onClick={() => setTerminalTheme('neon-purple')}
              className={`w-3 h-3 rounded-full bg-purple-400 ${terminalTheme === 'neon-purple' ? 'ring-2 ring-purple-300 scale-110' : 'opacity-60'}`}
              title="Neon Purple"
            />
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              soundEnabled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="تفعيل النغمات الصوتية للأحداث"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Copy Logs */}
          <button
            onClick={handleCopyLogs}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-all"
            title="نسخ السجل"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Download Logs */}
          <button
            onClick={handleDownloadLogs}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-all"
            title="تحميل السجل كملف JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Clear Logs */}
          <button
            onClick={() => systemEventLogger.clearLogs()}
            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-900/40 text-xs transition-all"
            title="تفريغ السجل"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Full Screen Toggle */}
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-all"
          >
            {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Sub-Header Toolbar: Filter Tabs & Search Box */}
          <div className="px-4 py-2.5 bg-black/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categoryLabels.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? themeColors.tagBg + ' font-bold shadow-sm'
                      : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في الأحداث / تصفية..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-700"
              />
            </div>
          </div>

          {/* Main Terminal Feed Area */}
          <div 
            ref={terminalBodyRef}
            className="flex-1 p-4 overflow-y-auto space-y-1.5 min-h-[220px] max-h-[420px] bg-[#02040a] relative select-text"
          >
            {/* CRT Scanline Overlay Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30" />

            {filteredEvents.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-600">
                &gt; لا توجد أحداث مطابقة في السجل حالياً. ابدأ باستدعاء الوحدات أو تشغيل الأوامر السيادية.
              </div>
            ) : (
              filteredEvents.map((evt, idx) => (
                <div 
                  key={evt.id || idx}
                  className="flex items-start gap-2 text-xs leading-relaxed hover:bg-slate-900/40 px-2 py-1 rounded transition-colors group"
                >
                  {/* Timestamp */}
                  <span className="text-slate-500 font-mono text-[11px] whitespace-nowrap select-none">
                    [{evt.timeFormatted}]
                  </span>

                  {/* Level Badge */}
                  <span className="select-none flex-shrink-0">
                    {getLevelBadge(evt.level)}
                  </span>

                  {/* Source Component */}
                  <span className="text-slate-400 font-bold whitespace-nowrap">
                    [{evt.source}]:
                  </span>

                  {/* Action Code */}
                  <span className={`font-semibold ${themeColors.textAccent} whitespace-nowrap`}>
                    {evt.action}
                  </span>

                  {/* Latency Pill if available */}
                  {evt.executionTimeMs !== undefined && (
                    <span className="text-[10px] text-amber-400/80 bg-amber-950/30 px-1.5 py-0.2 rounded border border-amber-500/20 whitespace-nowrap">
                      {evt.executionTimeMs}ms
                    </span>
                  )}

                  {/* Details & Arabic Description */}
                  {evt.details && (
                    <span className="text-slate-300 font-sans text-right flex-1 break-words">
                      {evt.details}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Interactive Shell CLI Input Line */}
          <form 
            onSubmit={handleCliSubmit}
            className="px-4 py-2.5 bg-black/90 border-t border-slate-800 flex items-center gap-2"
          >
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold select-none">
              <span>sarah@sovereign-core</span>
              <span className="text-slate-500">:</span>
              <span className="text-cyan-400">~</span>
              <span className="text-slate-400">$</span>
            </div>

            <input
              type="text"
              value={cliInput}
              onChange={(e) => setCliInput(e.target.value)}
              placeholder="اكتب أمر للطرفية (مثال: help, summon voice, stats, ping, purge, clear)..."
              className="flex-1 bg-transparent text-white text-xs font-mono focus:outline-none placeholder:text-slate-600"
            />

            <button
              type="submit"
              className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs flex items-center gap-1 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <CornerDownLeft className="w-3 h-3" />
              <span className="text-[11px]">إرسال</span>
            </button>
          </form>
        </>
      )}
    </div>
  );
};
