import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppTab } from '../types';
import { useCpuTelemetry, cpuTelemetry } from '../services/cpuTelemetry';
import { NanoPulseMonitorLayer } from './NanoPulseMonitorLayer';
import { quantumPreferencesManager, QuantumSystemPreferences } from '../services/quantumPreferences';
import { quantumSovereignEngine, QuantumRegisters } from '../services/quantumEngine';
import { 
  Zap, Search, ArrowRight, Cpu, Activity, Gauge, Flame, Sparkles, Server, MessageSquare, Sliders, Bookmark
} from 'lucide-react';

interface SystemHeaderProps {
  activeTab: AppTab;
  onNavigate: (tab: AppTab) => void;
  goBack: () => void;
  turboMode: boolean;
  setTurboMode: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenSearch: () => void;
  onOpenPreferences?: () => void;
  quickLaunchItems?: Array<{ id: AppTab; label: string; icon: string; color: string }>;
}

export const SystemHeader: React.FC<SystemHeaderProps> = ({
  activeTab,
  onNavigate,
  goBack,
  turboMode,
  setTurboMode,
  onOpenSearch,
  onOpenPreferences
}) => {
  const telemetry = useCpuTelemetry();
  const [prefs, setPrefs] = useState<QuantumSystemPreferences>(
    quantumPreferencesManager.getPreferences()
  );
  const [qRegs, setQRegs] = useState<QuantumRegisters>(
    quantumSovereignEngine.getRegisters()
  );

  useEffect(() => {
    const unsubPrefs = quantumPreferencesManager.subscribe(p => setPrefs(p));
    const unsubEngine = quantumSovereignEngine.subscribe((r) => setQRegs(r));
    return () => {
      unsubPrefs();
      unsubEngine();
    };
  }, []);

  const moduleInfoMap: Record<string, { label: string; icon: string }> = {
    [AppTab.QUANTUM_DEV_COMPUTER]: { label: 'QPU-512 الخارق', icon: '💻' },
    [AppTab.APEX_MATRIX]: { label: 'شبكة Apex', icon: '🌌' },
    [AppTab.SOVEREIGN_VOICE_CONTROLLER]: { label: 'التحكم الصوتي', icon: '🎙️' },
    [AppTab.DRAGON_DOME]: { label: 'قبة دراغون', icon: '🐉' },
    [AppTab.PYTHON_FORGE]: { label: 'مفاعل بايثون', icon: '🐍' },
    [AppTab.AI_BROWSER]: { label: 'جسر المتصفح', icon: '⚡' },
    [AppTab.SYSTEM_DIAGNOSTICS]: { label: 'فحص D3', icon: '🩺' },
    [AppTab.GENERATION_16]: { label: 'النجمة السداسية', icon: '🔯' },
    [AppTab.SOLAR_COSMOS]: { label: 'النظام الشمسي', icon: '☀️' },
    [AppTab.AGENT_SWARM]: { label: 'سرب الوكلاء', icon: '🛡️' },
    [AppTab.CODE_FORGE]: { label: 'صهر الأكواد', icon: '💻' },
    [AppTab.WHITE_STRATEGIC_CHAT]: { label: 'الدردشة البيضاء', icon: '💬' }
  };

  return (
    <motion.header
      id="sarah-system-header"
      className="sticky top-1.5 z-[90] px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-2.5 sm:gap-4 relative backdrop-blur-2xl transition-colors duration-300 rounded-2xl border mx-2 sm:mx-4"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: '#000000',
        borderColor: 'rgba(6, 182, 212, 0.4)',
        boxShadow: '0 0 25px rgba(0, 0, 0, 0.9)'
      }}
    >
      {/* 1. Dynamic Nano-Pulse Living Light Layer */}
      <NanoPulseMonitorLayer
        telemetry={telemetry}
        onNavigate={onNavigate}
        onTriggerStress={(active) => cpuTelemetry.setStressMode(active)}
        onTriggerCalibration={(active) => cpuTelemetry.setCalibrationMode(active)}
      />

      {/* Left Area: Navigation + Quantum QPU Realtime Status */}
      <div className="flex items-center gap-2 sm:gap-3 z-10">
        {activeTab !== AppTab.HOME && (
          <button 
            id="header-back-home-btn"
            onClick={goBack}
            className="px-3 py-1.5 bg-black border border-white/20 rounded-xl text-xs font-black text-white hover:border-cyan-400 transition-all flex items-center gap-1.5 group shadow-sm active:scale-95"
          >
            <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">الرئيسية</span>
          </button>
        )}

        <div className="flex items-center gap-2 px-2.5 py-1 bg-black/90 border border-cyan-500/40 rounded-xl font-mono text-[11px] shadow-[0_0_12px_rgba(6,182,212,0.15)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="font-black text-cyan-300">QPU-{prefs.qubitsCapacity}</span>
          <span className="text-slate-500 hidden xl:inline">|</span>
          <span className="text-emerald-400 hidden xl:inline">{qRegs.COHERENCE}% Coh</span>
          <span className="text-slate-500 hidden xl:inline">|</span>
          <span className="text-amber-300 font-bold hidden lg:inline">{prefs.resonantFrequencyHz}Hz</span>
        </div>
      </div>

      {/* Center Area: Favorite Pinned Modules from Quantum Preferences */}
      <div className="hidden md:flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 z-10">
        {prefs.pinnedModules.map(tabId => {
          const item = moduleInfoMap[tabId] || { label: tabId, icon: '⚡' };
          const isActive = activeTab === tabId;
          return (
            <button
              key={tabId}
              id={`quick-launch-${tabId}`}
              onClick={() => onNavigate(tabId)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                isActive 
                  ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.6)]' 
                  : 'bg-black text-slate-300 border-white/10 hover:border-cyan-500/40 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Area: Preferences Trigger + Quick Actions & Turbo Control */}
      <div className="flex items-center gap-2 z-10">
        
        {/* Quantum Preferences Quick Trigger */}
        {onOpenPreferences && (
          <button
            onClick={onOpenPreferences}
            className="px-3 py-1.5 bg-black border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] active:scale-95"
            title="فتح إعدادات النظام المفضلة للكمبيوتر الكمومي"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تفضيلات النواة</span>
          </button>
        )}

        <button
          id="header-white-chat-btn"
          onClick={() => onNavigate(AppTab.WHITE_STRATEGIC_CHAT)}
          className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border transition-all shadow-sm active:scale-95 ${
            activeTab === AppTab.WHITE_STRATEGIC_CHAT
              ? 'bg-white text-slate-900 border-white shadow-lg'
              : 'bg-black text-emerald-300 border-emerald-500/40 hover:border-emerald-400'
          }`}
          title="فتح نافذة الدردشة البيضاء الاستراتيجية ونظام الوديان"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">الدردشة البيضاء</span>
        </button>

        <button
          id="header-quick-command-btn"
          onClick={onOpenSearch}
          className="px-3 py-1.5 bg-black border border-white/20 hover:border-cyan-500/50 rounded-xl text-xs text-slate-300 flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">أمر (Ctrl+K)</span>
        </button>

        <button
          id="header-turbo-toggle-btn"
          onClick={() => setTurboMode(prev => !prev)}
          className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border transition-all active:scale-95 ${
            turboMode 
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
              : 'bg-black text-slate-500 border-white/10'
          }`}
          title="تفعيل الاستجابة اللحظية الفائقة"
        >
          <Zap className={`w-3.5 h-3.5 ${turboMode ? 'text-cyan-400 animate-pulse' : ''}`} />
          <span className="hidden sm:inline">Turbo</span>
        </button>
      </div>
    </motion.header>
  );
};

