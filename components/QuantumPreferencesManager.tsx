/**
 * ⚙️ QUANTUM SYSTEM PREFERENCES & FAVORITES MANAGER
 * واجهة إعدادات النظام المفضلة وإدارة الحوسبة الكمومية السيادية
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sliders, Cpu, Sparkles, Pin, CheckCircle2, Shield, Zap, 
  Volume2, VolumeX, Moon, Sun, Terminal, Radio, RefreshCw, 
  Download, Upload, Plus, Trash2, Command, Play, Bookmark,
  Monitor, Activity, Lock, Eye, Layers
} from 'lucide-react';
import { AppTab, Language } from '../types';
import { 
  quantumPreferencesManager, 
  QuantumSystemPreferences, 
  QuantumThemeMode, 
  QuantumPowerProfile 
} from '../services/quantumPreferences';
import { quantumSovereignEngine } from '../services/quantumEngine';
import { systemEventLogger } from '../services/systemEventLogger';

interface QuantumPreferencesManagerProps {
  language?: Language;
  onNavigate?: (tab: AppTab) => void;
  onClose?: () => void;
}

export const QuantumPreferencesManager: React.FC<QuantumPreferencesManagerProps> = ({
  language = 'ar',
  onNavigate,
  onClose
}) => {
  const [prefs, setPrefs] = useState<QuantumSystemPreferences>(
    quantumPreferencesManager.getPreferences()
  );
  const [activeTab, setActiveTab] = useState<'FAVORITES' | 'HARDWARE' | 'DISPLAY' | 'MACROS' | 'BACKUP'>('FAVORITES');
  const [newMacroName, setNewMacroName] = useState('');
  const [newMacroCommand, setNewMacroCommand] = useState('');
  const [newMacroTarget, setNewMacroTarget] = useState<AppTab>(AppTab.QUANTUM_DEV_COMPUTER);
  const [newMacroShortcut, setNewMacroShortcut] = useState('Alt+1');
  const [showAddMacro, setShowAddMacro] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  useEffect(() => {
    const unsub = quantumPreferencesManager.subscribe(p => {
      setPrefs(p);
    });
    return unsub;
  }, []);

  const handleUpdate = (partial: Partial<QuantumSystemPreferences>) => {
    quantumPreferencesManager.updatePreferences(partial);
    systemEventLogger.recordEvent(
      'SOVEREIGN_OP',
      'UPDATE_QUANTUM_PREFERENCES',
      'QuantumPreferencesManager',
      'SUCCESS',
      'تم تحديث تفضيلات وإعدادات النظام الكمومي المدمج.',
      0.4,
      partial
    );
  };

  const handleTogglePin = (tab: AppTab) => {
    quantumPreferencesManager.togglePinModule(tab);
  };

  const handleAddMacro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMacroName.trim() || !newMacroCommand.trim()) return;
    quantumPreferencesManager.addCustomMacro({
      name: newMacroName.trim(),
      command: newMacroCommand.trim(),
      targetTab: newMacroTarget,
      shortcut: newMacroShortcut,
      icon: '⚡'
    });
    setNewMacroName('');
    setNewMacroCommand('');
    setShowAddMacro(false);
  };

  const allAvailableModules: { id: AppTab; label: string; tag: string; icon: string; desc: string }[] = [
    { id: AppTab.QUANTUM_DEV_COMPUTER, label: 'الكمبيوتر الكمومي الخارق QPU-512', tag: 'Quantum Mainframe', icon: '💻', desc: 'شاشة سوداء ومصفوفة 512 كيوبت مع محرر كود وتيرمينال CLI' },
    { id: AppTab.APEX_MATRIX, label: 'شبكة القيادة المدارية (Apex Constellation)', tag: 'Reznikov Apex Matrix', icon: '🌌', desc: 'واجهة القيادة المدارية المتزامنة والمصور الصوتي اللحظي' },
    { id: AppTab.SOVEREIGN_VOICE_CONTROLLER, label: 'التحكم الصوتي المستقل (بدون Gemini)', tag: 'Voice Orchestrator', icon: '🎙️', desc: 'تنفيذ الأوامر الصوتية المعقدة والمركبة محلياً' },
    { id: AppTab.DRAGON_DOME, label: 'قبة دراغون ودروع الحماية السيادية L4', tag: 'Obsidian Defense', icon: '🐉', desc: 'الحماية الاستباقية وصد الهجمات والتطفل' },
    { id: AppTab.PYTHON_FORGE, label: 'مفاعل بايثون الحقيقي في الذاكرة (WASM)', tag: 'Live Sandbox', icon: '🐍', desc: 'تنفيذ خوارزميات بايثون ومعالجة المصفوفات بدون خادم' },
    { id: AppTab.AI_BROWSER, label: 'جسر المتصفح الخارجي وأوامر Kimi', tag: 'Kimi External Bridge', icon: '⚡', desc: 'استقبال وتمرير الأوامر اللحظية من Kimi والنوافذ' },
    { id: AppTab.SYSTEM_DIAGNOSTICS, label: 'فحص وتشخيصات النظام والمعالجة D3', tag: 'D3 Telemetry', icon: '🩺', desc: 'مخططات استهلاك الخيوط والذاكرة ومعايرة النواة' },
    { id: AppTab.GENERATION_16, label: 'صارة v16 (مصفوفة النجمة السداسية)', tag: '528Hz Matrix', icon: '🔯', desc: 'رنين وتوافق ترددي 528Hz عبر العقد الستة' },
    { id: AppTab.SOLAR_COSMOS, label: 'صارة (النظام الشمسي الموحد)', tag: 'Cosmos Core', icon: '☀️', desc: 'تكامل مدارات الكواكب السيادية ونواة الطاقة' },
    { id: AppTab.AGENT_SWARM, label: 'سرب وكلاء الاستراتيجية والتنفيذ', tag: 'Multi-Agent Swarm', icon: '🛡️', desc: 'الوكلاء الستة لتنفيذ المهام المعقدة ذاتياً' },
    { id: AppTab.CODE_FORGE, label: 'صهر الأكواد والبرمجة السيادية', tag: 'Code Synthesizer', icon: '💻', desc: 'توليد وفحص الشيفرات البرمجية بالذكاء الاصطناعي' },
    { id: AppTab.WHITE_STRATEGIC_CHAT, label: 'الدردشة الاستراتيجية والوديان', tag: 'Valleys & Memory', icon: '💬', desc: 'تفكيك المشاكل والحلول المفترسة المتعددة' }
  ];

  const themeModes: { id: QuantumThemeMode; label: string; icon: string; desc: string; previewClass: string }[] = [
    { 
      id: 'OLED_OBSIDIAN_BLACK', 
      label: 'سواد أوبسيدياني نقي (Pure OLED Black)', 
      icon: '⬛', 
      desc: 'سواد مطلق #000000 موفر للطاقة مع إضاءات نيون دقيقة عالية التباين', 
      previewClass: 'bg-black border-cyan-500/40 text-cyan-300' 
    },
    { 
      id: 'QUANTUM_CYAN_MATRIX', 
      label: 'مصفوفة السيان الكوآنتومي (Cyan Matrix)', 
      icon: '💠', 
      desc: 'إشعاع هولوجرافي أزرق وسماوي على خلفية سواد كوني عميق', 
      previewClass: 'bg-[#020617] border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
    },
    { 
      id: 'CRT_PHOSPHOR_GREEN', 
      label: 'فوسفور أخضر كلاسيكي (CRT Quantum Green)', 
      icon: '📟', 
      desc: 'شاشة الحواسيب العملاقة القديمة بلون الزمرد المشع #00FF66', 
      previewClass: 'bg-[#000d05] border-[#00ff66]/70 text-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.2)]' 
    },
    { 
      id: 'AMBER_TERMINAL_GOLD', 
      label: 'شاشة كهرمانية ذهبية (Amber Phosphor)', 
      icon: '🟨', 
      desc: 'تيرمينال كهرماني دافئ ومريح للعين مع وضوح نصوص خارق', 
      previewClass: 'bg-[#0d0700] border-amber-500/70 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
    }
  ];

  const powerProfiles: { id: QuantumPowerProfile; label: string; icon: string; desc: string }[] = [
    { id: 'QUANTUM_MAX_TURBO', label: 'أقصى طاقة حوسبية تيربو (528Hz Maximum Turbo)', icon: '⚡', desc: 'استغلال كامل لمصفوفة 512 كيوبت وتسريع المعالجة المتوازية' },
    { id: 'CRYO_COHERENCE', label: 'الثبات التبريدي الفائق (14mK Cryo Coherence)', icon: '❄️', desc: 'أعلى دقة كمية مع تقليل نسبة التشويش الحراري إلى 0.001%' },
    { id: 'EMBEDDED_ZERO_LATENCY', label: 'النظام المدمج الفوري (Zero-Latency Embedded)', icon: '🚀', desc: 'تنفيذ فوري للأوامر الصوتية وتوجيه المهام دون أي تأخير' },
    { id: 'CYBER_SHIELD_DEFENSE', label: 'التحصين الدفاعي الأقصى (Fortified Shield)', icon: '🛡️', desc: 'فحص كل عملية عبر قبة دراغون وتشفير WebCrypto مضاعف' }
  ];

  const frequencies: { hz: 528 | 432 | 741 | 963; label: string; effect: string }[] = [
    { hz: 528, label: '528 Hz — رنين التحول والمصفوفة المائية (Solfeggio Transformation)', effect: 'تردد النواة الأساسي لصارة والتوافق الكمومي المتوازن' },
    { hz: 432, label: '432 Hz — الرنين الكوني الطبيعي (Cosmic Harmony)', effect: 'المحاذاة الرياضية الطبيعية وتناغم الحسابات المدارية' },
    { hz: 741, label: '741 Hz — إيقاظ الحدس وحل المشاكل المعقدة (Intuitive Awakening)', effect: 'تسريع تفكيك الأوامر وحل المعضلات البرمجية الصعبة' },
    { hz: 963, label: '963 Hz — التردد التاجي السيادي (Crown Sovereign Frequency)', effect: 'أعلى إدراك هيكلي للبيئة المستقلة وسرب الوكلاء' }
  ];

  const handleExport = () => {
    const data = quantumPreferencesManager.exportPreferencesJson();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sarah-quantum-preferences-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice('تم تصدير ملف التفضيلات بنجاح ✅');
    setTimeout(() => setExportNotice(null), 3000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const success = quantumPreferencesManager.importPreferencesJson(text);
      if (success) {
        setExportNotice('تم استيراد التفضيلات وتطبيقها فوراً ✅');
      } else {
        setExportNotice('خطأ في تنسيق ملف JSON ❌');
      }
      setTimeout(() => setExportNotice(null), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full bg-[#000000] border border-cyan-500/40 rounded-[2.5rem] p-5 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.9)] text-white relative overflow-hidden font-arabic select-none">
      
      {/* Background Quantum Grid Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Top Header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-black border border-cyan-500/60 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            ⚙️
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                إعدادات النظام المفضلة <span className="text-cyan-400">للحاسوب الكمومي</span>
              </h2>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 font-black">
                QPU-512 CORE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              تخصيص المفضلة، وضبط النواة الكمومية، ومصفوفة الشاشة السوداء، ومحاذاة الترددات 528Hz
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => {
              quantumSovereignEngine.resetCryoCore();
              setExportNotice('تمت إعادة ضبط التبريد الكمومي للحالة الأرضية |0⟩ ✅');
              setTimeout(() => setExportNotice(null), 2500);
            }}
            className="px-3.5 py-2 bg-black border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>إعادة ضبط التبريد</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {exportNotice && (
        <div className="mt-4 p-3 bg-cyan-950/80 border border-cyan-500/60 text-cyan-200 rounded-2xl text-xs font-mono text-center animate-pulse">
          {exportNotice}
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 mt-6 pb-2 border-b border-white/5">
        {[
          { id: 'FAVORITES', label: 'المفضلة والوحدات المثبتة', icon: <Bookmark className="w-4 h-4 text-amber-400" /> },
          { id: 'HARDWARE', label: 'عتاد وقوة النواة (QPU)', icon: <Cpu className="w-4 h-4 text-cyan-400" /> },
          { id: 'DISPLAY', label: 'الشاشة السوداء والمصفوفة', icon: <Monitor className="w-4 h-4 text-emerald-400" /> },
          { id: 'MACROS', label: 'أوامر الماكرو والتشغيل السريع', icon: <Command className="w-4 h-4 text-purple-400" /> },
          { id: 'BACKUP', label: 'النسخ الاحتياطي والمزامنة', icon: <Download className="w-4 h-4 text-blue-400" /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === t.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'bg-white/5 text-slate-400 hover:text-white border border-transparent hover:border-white/10'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT AREA */}
      <div className="mt-6 min-h-[380px]">
        
        {/* 1. FAVORITES & PINNED MODULES TAB */}
        {activeTab === 'FAVORITES' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Pin className="w-4 h-4 text-cyan-400" />
                  <span>تثبيت الوحدات والأنظمة المفضلة في الشريط الرئيسي</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  اختر الوحدات التي تود تثبيتها في شريط الإقلاع السريع والوصول المباشر للكمبيوتر الكمومي:
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-3 py-1 rounded-xl border border-cyan-500/30">
                {prefs.pinnedModules.length} وحدات مثبتة
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {allAvailableModules.map(mod => {
                const isPinned = prefs.pinnedModules.includes(mod.id);
                return (
                  <div
                    key={mod.id}
                    onClick={() => handleTogglePin(mod.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isPinned
                        ? 'bg-black border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30'
                        : 'bg-black/60 border-white/10 hover:border-white/20 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl p-2 bg-white/5 rounded-xl border border-white/5">{mod.icon}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-white">{mod.label}</span>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400 block mt-0.5">{mod.tag}</span>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{mod.desc}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`p-2 rounded-xl border transition-all flex-shrink-0 ${
                        isPinned
                          ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                      }`}
                    >
                      <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-black' : ''}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. HARDWARE & QPU POWER TAB */}
        {activeTab === 'HARDWARE' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>بروفايل الطاقة والحوسبة الكمومية المدمجة</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                تحديد أداء النواة، وسعة الكيوبتات التراكبية، ومحاذاة التردد الرنيني:
              </p>
            </div>

            {/* Power Profiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {powerProfiles.map(p => (
                <div
                  key={p.id}
                  onClick={() => handleUpdate({ powerProfile: p.id })}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    prefs.powerProfile === p.id
                      ? 'bg-black border-cyan-500/70 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/40'
                      : 'bg-black/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{p.icon}</span>
                    <span className={`w-3 h-3 rounded-full ${prefs.powerProfile === p.id ? 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]' : 'bg-white/10'}`}></span>
                  </div>
                  <h4 className="text-sm font-black text-white">{p.label}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>

            {/* Qubits Capacity & Resonant Frequency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              
              {/* Qubits Selector */}
              <div className="bg-black border border-white/10 rounded-2xl p-4">
                <label className="text-xs font-black text-cyan-300 block mb-2">
                  سعة مصفوفة الكيوبتات (Quantum Qubits Matrix):
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[128, 256, 512, 1024].map(q => (
                    <button
                      key={q}
                      onClick={() => {
                        handleUpdate({ qubitsCapacity: q as any });
                        quantumSovereignEngine.setQubitCount(q);
                      }}
                      className={`py-2 rounded-xl text-xs font-mono font-black transition-all ${
                        prefs.qubitsCapacity === q
                          ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      {q} Qubits
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 mt-2 block">
                  الحالة الحالية: {prefs.qubitsCapacity} كيوبت في حالة تشابك 528Hz مع ثبات فائق.
                </span>
              </div>

              {/* Solfeggio Resonant Frequency */}
              <div className="bg-black border border-white/10 rounded-2xl p-4">
                <label className="text-xs font-black text-cyan-300 block mb-2">
                  محاذاة التردد الرنيني للنظام (Harmonic Resonant Frequency):
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[528, 432, 741, 963].map(freq => (
                    <button
                      key={freq}
                      onClick={() => handleUpdate({ resonantFrequencyHz: freq as any })}
                      className={`py-2 rounded-xl text-xs font-mono font-black transition-all ${
                        prefs.resonantFrequencyHz === freq
                          ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      {freq} Hz
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 mt-2 block">
                  {frequencies.find(f => f.hz === prefs.resonantFrequencyHz)?.effect}
                </span>
              </div>
            </div>

            {/* Audio Feedback & Telemetry Sync */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-black border border-white/10 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-950 text-cyan-400 rounded-xl border border-cyan-500/30">
                  {prefs.audioFeedback ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">المؤثرات الصوتية الترددية للبوابات الكمومية</h4>
                  <p className="text-xs text-slate-400">توليد نغمات Solfeggio سنية عند تنفيذ البوابات (H, X, CNOT)</p>
                </div>
              </div>
              <button
                onClick={() => handleUpdate({ audioFeedback: !prefs.audioFeedback })}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  prefs.audioFeedback
                    ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                    : 'bg-white/10 text-slate-400'
                }`}
              >
                {prefs.audioFeedback ? 'مفعلة ✅' : 'معطلة ❌'}
              </button>
            </div>
          </div>
        )}

        {/* 3. DISPLAY & BLACK SCREEN MATRIX TAB */}
        {activeTab === 'DISPLAY' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Monitor className="w-4 h-4 text-emerald-400" />
                <span>شاشة الحاسوب الكمومي ومصفوفة السواد المطلق</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                تخصيص نمط العرض الفوسفوري، والسواد الأوبسيدياني، وتأثير خطوط المسح CRT:
              </p>
            </div>

            {/* Themes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {themeModes.map(th => (
                <div
                  key={th.id}
                  onClick={() => handleUpdate({ themeMode: th.id })}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    prefs.themeMode === th.id
                      ? `${th.previewClass} ring-1 ring-cyan-500/50`
                      : 'bg-black/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{th.icon}</span>
                    <span className={`w-3 h-3 rounded-full ${prefs.themeMode === th.id ? 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]' : 'bg-white/10'}`}></span>
                  </div>
                  <h4 className="text-sm font-black">{th.label}</h4>
                  <p className="text-xs opacity-80 mt-1 leading-relaxed">{th.desc}</p>
                </div>
              ))}
            </div>

            {/* CRT Scanlines Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-black border border-white/10 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-500/30">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">تأثير خطوط المسح الكلاسيكية (CRT Scanlines)</h4>
                  <p className="text-xs text-slate-400">إضافة خطوط تيرمينال فوسفورية لمحاكاة الشاشات الكمومية العتيقة</p>
                </div>
              </div>
              <button
                onClick={() => handleUpdate({ crtScanlines: !prefs.crtScanlines })}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  prefs.crtScanlines
                    ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                    : 'bg-white/10 text-slate-400'
                }`}
              >
                {prefs.crtScanlines ? 'مفعلة ✅' : 'معطلة ❌'}
              </button>
            </div>
          </div>
        )}

        {/* 4. MACROS & CLI SHORTCUTS TAB */}
        {activeTab === 'MACROS' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Command className="w-4 h-4 text-purple-400" />
                  <span>أوامر الماكرو والتشغيل السريع (Quantum Macros)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  أوامر وسلاسل عمليات سريعة قابلة للتنفيذ بنقرة زر واحدة أو اختصارات لوحة المفاتيح:
                </p>
              </div>
              <button
                onClick={() => setShowAddMacro(prev => !prev)}
                className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة ماكرو جديد</span>
              </button>
            </div>

            {/* Add Macro Form */}
            {showAddMacro && (
              <form onSubmit={handleAddMacro} className="p-4 bg-black border border-cyan-500/40 rounded-2xl space-y-3">
                <h4 className="text-xs font-black text-cyan-300">إنشاء ماكرو كمومي مخصص:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="اسم الماكرو (مثال: فحص سريع وتحصين النواة)"
                    value={newMacroName}
                    onChange={e => setNewMacroName(e.target.value)}
                    className="bg-black/80 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                  <input
                    type="text"
                    placeholder="الأمر المنفذ (Command CLI)"
                    value={newMacroCommand}
                    onChange={e => setNewMacroCommand(e.target.value)}
                    className="bg-black/80 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={newMacroTarget}
                    onChange={e => setNewMacroTarget(e.target.value as AppTab)}
                    className="bg-black/80 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    {allAvailableModules.map(m => (
                      <option key={m.id} value={m.id}>{m.label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="اختصار لوحة المفاتيح (مثال: Alt+M)"
                    value={newMacroShortcut}
                    onChange={e => setNewMacroShortcut(e.target.value)}
                    className="bg-black/80 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddMacro(false)}
                    className="px-3 py-1.5 bg-white/10 text-slate-400 rounded-xl text-xs"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-cyan-500 text-black font-black rounded-xl text-xs"
                  >
                    حفظ الماكرو
                  </button>
                </div>
              </form>
            )}

            {/* Macros List */}
            <div className="space-y-2.5">
              {prefs.customMacros.map(macro => (
                <div
                  key={macro.id}
                  className="p-3.5 bg-black border border-white/10 rounded-2xl flex items-center justify-between gap-3 hover:border-cyan-500/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl p-2 bg-white/5 rounded-xl">{macro.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">{macro.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30">
                          {macro.shortcut}
                        </span>
                      </div>
                      <code className="text-[10px] font-mono text-cyan-400 block mt-0.5">
                        &gt; {macro.command}
                      </code>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate(macro.targetTab)}
                        className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 rounded-xl text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
                      >
                        <Play className="w-3 h-3" />
                        <span>تنفيذ</span>
                      </button>
                    )}
                    <button
                      onClick={() => quantumPreferencesManager.removeCustomMacro(macro.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="حذف الماكرو"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. BACKUP & SYSTEM SYNC TAB */}
        {activeTab === 'BACKUP' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-blue-400" />
                <span>النسخ الاحتياطي والمزامنة للتفضيلات والعتاد الكمومي</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                تصدير واستيراد تكوين النظام الكامل ومزامنة البيانات محلياً 100%:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Export */}
              <div className="p-5 bg-black border border-white/10 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>تصدير ملف التفضيلات (JSON)</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    حفظ كافة الإعدادات والمفضلة والأوامر المخصصة في ملف محلي مشفر.
                  </p>
                </div>
                <button
                  onClick={handleExport}
                  className="mt-4 w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                >
                  <Download className="w-4 h-4" />
                  <span>تصدير التفضيلات الآن</span>
                </button>
              </div>

              {/* Import */}
              <div className="p-5 bg-black border border-white/10 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>استيراد ملف التفضيلات</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    استعادة الإعدادات المحفوظة مسبقاً وتطبيقها فوراً على النواة.
                  </p>
                </div>
                <label className="mt-4 w-full py-2.5 bg-black border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <Upload className="w-4 h-4" />
                  <span>اختيار ملف JSON للاستيراد</span>
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>
              </div>
            </div>

            {/* Reset Defaults */}
            <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-rose-300">إعادة ضبط المصنع الكمومي (Factory Reset)</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">مسح كافة التفضيلات المخصصة واستعادة إعدادات النواة الافتراضية</p>
              </div>
              <button
                onClick={() => {
                  quantumPreferencesManager.resetToDefaults();
                  setExportNotice('تمت استعادة الإعدادات الافتراضية بنجاح 🔄');
                  setTimeout(() => setExportNotice(null), 2500);
                }}
                className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold"
              >
                استعادة الافتراضي
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
