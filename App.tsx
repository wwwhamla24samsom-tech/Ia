
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppTab, Language } from './types';
import { Sidebar } from './components/Sidebar';
import { SarahSingleScreenV17 } from './components/SarahSingleScreenV17';
import { OmniSideDrawer } from './components/OmniSideDrawer';
import { SarahHome } from './components/SarahHome';
import { NeuralBrain } from './components/NeuralBrain';
import { NeuralAgent } from './components/NeuralAgent';
import { SearchEngine } from './components/SearchEngine';
import { LogicCore } from './components/LogicCore';
import { VideoStudio } from './components/VideoStudio';
import { HtmlFull } from './components/HtmlFull';
import { OrbitalStation } from './components/OrbitalStation';
import { CyberFusionReactor } from './components/CyberFusionReactor';
import { StrategicArchitect } from './components/StrategicArchitect';
import { NeuralShield } from './components/NeuralShield';
import { NeuralOversight } from './components/NeuralOversight';
import { AdminCenter } from './components/AdminCenter';
import { PythonForge } from './components/PythonForge';
import { ImageStudio } from './components/ImageStudio';
import { KnowledgeVault } from './components/KnowledgeVault';
import { DataStreams } from './components/DataStreams';
import { NeuralAppCloner } from './components/NeuralAppCloner';
import { CodeForge } from './components/CodeForge';
import { SovereignConsole } from './components/SovereignConsole';
import { Settings } from './components/Settings';
import LandingPage from './components/LandingPage';
import { NeuralDeviceControl } from './components/NeuralDeviceControl';
import { NeuralQuadCore } from './components/NeuralQuadCore';
import { GlobalInterface } from './components/GlobalInterface';
import { SystemDiagnostics } from './components/SystemDiagnostics';
import { SecurityGate } from './components/SecurityGate';
import { Generation15 } from './components/Generation15';
import { QuantumNeuralCore } from './components/QuantumNeuralCore';
import { NeuralBroadcast } from './components/NeuralBroadcast';
import { DriverMatrix } from './components/DriverMatrix';
import { AIBrowser } from './components/AIBrowser';
import { CPU10GCore } from './components/CPU10GCore';
import { SystemCloner } from './components/SystemCloner';
import { PromptHub } from './components/PromptHub';
import { HexagramMatrix } from './components/HexagramMatrix';
import { SarahSolarCosmos } from './components/SarahSolarCosmos';
import { AgentSwarm } from './components/AgentSwarm';
import { DragonDomeSystem } from './components/DragonDomeSystem';
import { QuantumDevComputer } from './components/QuantumDevComputer';
import { NeuralShieldWrapper } from './components/NeuralShieldWrapper';
import { UnifiedDataStream } from './components/UnifiedDataStream';
import { SystemHeader } from './components/SystemHeader';
import { SmartGuidancePointer } from './components/SmartGuidancePointer';
import { StrategicSiteAgent } from './components/StrategicSiteAgent';
import { WhiteStrategicChat } from './components/WhiteStrategicChat';
import { KimiLLMStudio } from './components/KimiLLMStudio';
import { SovereignVoiceControlCenter } from './components/SovereignVoiceControlCenter';
import { VoiceHub } from './components/VoiceHub';
import { ApexConstellationHub } from './components/ApexConstellationHub';
import { QuantumPreferencesManager } from './components/QuantumPreferencesManager';
import { quantumPreferencesManager } from './services/quantumPreferences';
import { ConsciousWhiteCanvas } from './components/ConsciousWhiteCanvas';
import { LivePreviewMatrix } from './components/LivePreviewMatrix';
import { OpenSourceSovereignHub } from './components/OpenSourceSovereignHub';
import { Zap, Activity, Sparkles, Shield, Cpu, Home, Command, Search, Gauge, ArrowRight, Sun, Flame, Sliders, MessageSquare, Bot, Mic } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'security' | 'app'>('app');
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [language, setLanguage] = useState<Language>('ar');
  const [turboMode, setTurboMode] = useState(true);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuantumPrefsOpen, setIsQuantumPrefsOpen] = useState(false);
  
  // v17 Side Command Drawer & Gemini States
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [geminiModel, setGeminiModel] = useState('gemini-2.5-flash');
  const [temperature, setTemperature] = useState(0.7);
  const [thinkingMode, setThinkingMode] = useState(true);
  const [systemDirective, setSystemDirective] = useState('');
  const [summonedModuleOverride, setSummonedModuleOverride] = useState<AppTab | null>(null);

  // Keyboard shortcuts Ctrl+K, Alt+S, Alt+Q, Alt+O, Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setQuickSearchOpen(prev => !prev);
      } else if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsSideDrawerOpen(prev => !prev);
      } else if (e.altKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setIsQuantumPrefsOpen(prev => !prev);
      } else if (e.altKey && e.key.toLowerCase() === 'q') {
        e.preventDefault();
        setActiveTab(AppTab.QUANTUM_DEV_COMPUTER);
      } else if (e.key === 'Escape') {
        setQuickSearchOpen(false);
        setIsSideDrawerOpen(false);
        setIsQuantumPrefsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (view === 'landing') {
    return <LandingPage onConnect={() => setView('security')} />;
  }

  if (view === 'security') {
    return <SecurityGate onUnlock={() => setView('app')} />;
  }

  const goBack = () => setActiveTab(AppTab.HOME);

  const allSystemModules = [
    { id: AppTab.CONSCIOUSNESS_WHITE_CANVAS, label: 'الوعي السيادي والصفحة البيضاء (تحدث واكتب)', tag: 'الوعي المفتوح 528Hz', icon: '🧠', desc: 'نظام الوعي المتطور للتحدث والكتابة الحرة على صفحة بيضاء مع توليد فوري للأفكار والأوامر والتكامل مع كافة المنصات' },
    { id: AppTab.LIVE_PREVIEW_MATRIX, label: 'مصفوفة المعاينة المباشرة (Live Preview Matrix)', tag: 'Realtime Sandbox', icon: '⚡', desc: 'مصفوفة المعاينة الحية للواجهات DOM، الحوسبة الكمومية QPU، مفاعل بايثون WASM وتدفق التيليميتري في شاشة واحدة' },
    { id: AppTab.OPEN_SOURCE_HUB, label: 'مركز النظام مفتوح المصدر والترخيص (Open Source Hub)', tag: 'MIT Sovereign Core', icon: '🔓', desc: 'مستودع الأكواد المفتوحة، وثيقة الترخيص الحر، وتصدير بيان النظام وحزم SDK بدون أي تبعيات سحابية' },
    { id: AppTab.APEX_MATRIX, label: 'شبكة القيادة المدارية (Apex Constellation UI)', tag: 'Reznikov Apex Matrix', icon: '🌌', desc: 'واجهة القيادة المدارية المتزامنة المستوحاة من Apex Interface مع النواة المركزية المتوهجة وشبكة الوكلاء والمصور الصوتي اللحظي' },
    { id: AppTab.AI_BROWSER, label: 'جسر المتصفح الخارجي واستقبال أوامر Kimi الذكية', tag: 'Kimi & Browser Bridge', icon: '⚡', desc: 'جسر اتصال سيادي بالمتصفح الخارجي لتلقي وتمرير الأوامر اللحظية من موقع Kimi ونماذج الذكاء الخارجية عبر BroadcastChannel' },
    { id: AppTab.WHITE_STRATEGIC_CHAT, label: 'الدردشة البيضاء ونظام الوديان الاستراتيجي', tag: 'الدردشة والحلول المفترسة', icon: '💬', desc: 'نافذة دردشة بيضاء استراتيجية متصلة بنظام الوديان والذاكرة وتفكيك المشاكل والحلول المفترسة بالعربية والدارجة والإنجليزية' },
    { id: AppTab.STRATEGIC_SITE_AGENT, label: 'الوكيل الاستراتيجي لإدارة وهندسة المواقع داخلياً', tag: 'إدارة وتأليف المواقع', icon: '🌐', desc: 'وكيل استراتيجي مستقل يكتب، يولد، ويتحكم بمنظومة المواقع والعقد وتوجيه الـ Traffic داخلياً' },
    { id: AppTab.DRAGON_DOME, label: 'منظومة دراغون وقبة الحماية السيادية', tag: 'الأمان والدفاع L4', icon: '🐉', desc: 'قبة الحماية الأوبسيديانية وصد الاختراق التلقائي' },
    { id: AppTab.QUANTUM_DEV_COMPUTER, label: 'الكمبيوتر الكمومي الخارق QPU-128', tag: 'شاشة المطورين الخضراء', icon: '💻', desc: 'حاسوب المطورين الكوآنتومي المتكامل: شاشة سوداء وفوسفور أخضر مع مصفوفة 128 كيوبت ومحرر كود وموجه أوامر CLI' },
    { id: AppTab.SOLAR_COSMOS, label: 'صارة (الشمس والنظام الشمسي الموحد)', tag: 'الكون الكوآنتومي', icon: '☀️', desc: 'تكامل مدارات الكواكب السيادية ونواة الطاقة' },
    { id: AppTab.AGENT_SWARM, label: 'سرب وكلاء الاستراتيجية والتنفيذ', tag: 'الذكاء المستقل', icon: '🛡️', desc: 'الوكلاء الستة لتنفيذ المهام المعقدة بدون سحابة' },
    { id: AppTab.GENERATION_16, label: 'صارة v16 - مصفوفة النجمة السداسية', tag: 'الرنين المائي', icon: '🔯', desc: 'إجماع التوافق الكوآنتومي بتردد 528Hz السيادي' },
    { id: AppTab.PYTHON_FORGE, label: 'ورشة بايثون الحقيقية (Real Engine)', tag: 'التنفيذ البرمجي', icon: '🐍', desc: 'بيئة بايثون متكاملة لمعالجة البيانات والتجريب' },
    { id: AppTab.CODE_FORGE, label: 'مفاعل الأكواد والتطوير الذكي', tag: 'البرمجة', icon: '💻', desc: 'توليد وفحص الشيفرات البرمجية بالذكاء الاصطناعي' },
    { id: AppTab.ADMIN_CENTER, label: 'مركز الإدارة ومؤشر استقرار النواة D3', tag: 'التحكم الإداري', icon: '🏛️', desc: 'رصد QSI اللحظي ومحاكاة اختبارات الأمان والتطفل' },
    { id: AppTab.SYSTEM_DIAGNOSTICS, label: 'فحص وتشخيصات النظام D3', tag: 'التيليميتري والمعالجة', icon: '🩺', desc: 'مخططات D3 لاستهلاك الخيوط ومعايرة النواة' },
    { id: AppTab.QUANTUM_NEURAL_CORE, label: 'النواة العصبونية الكوآنتومية', tag: 'المعالجة الكمية', icon: '💠', desc: 'إدارة تشفير الذاكرة ونواة 10G السيادية' },
    { id: AppTab.HOME, label: 'مركز العمليات والشاشة الواحدة v17', tag: 'الرئيسية', icon: '⚡', desc: 'لوحة التحكم الشاملة والاستحضار اللحظي بجمناي' },
    { id: AppTab.LOGIC_CORE, label: 'أوراكل الحقيقة والمنطق الصارم', tag: 'التدقيق والاستدلال', icon: '⚖️', desc: 'محرك التحقق من صحة البيانات والعدالة المعرفية' },
    { id: AppTab.SEARCH, label: 'محرك الاستخبارات والبحث العصبي', tag: 'الاستكشاف', icon: '🔍', desc: 'استرجاع فوري للمعلومات المعقدة وتحليل السياقات' },
    { id: AppTab.AI_NEXUS, label: 'مستنسخ التطبيقات والأنظمة', tag: 'الاستنساخ الذكي', icon: '🧩', desc: 'استنساخ وهندسة المنظومات والبيئات التقنية' },
    { id: AppTab.STRATEGIC_ARCHITECT, label: 'المعمار الاستراتيجي', tag: 'التخطيط', icon: '🏗️', desc: 'بناء الخطط الهيكلية وإدارة تدفق العمليات' },
    { id: AppTab.NEURAL_SHIELD, label: 'درع الحماية والدفاع العصبوني', tag: 'الأمن السيبراني', icon: '🛡️', desc: 'تشفير WebCrypto وتطهير الحزم البرمجية' },
    { id: AppTab.ORBITAL, label: 'الرادار الفضائي المداري', tag: 'الاتصالات', icon: '📡', desc: 'رصد الإشارات العابرة للشبكات والأجهزة' },
    { id: AppTab.SETTINGS, label: 'إعدادات النظام واللغات', tag: 'التخصيص', icon: '⚙️', desc: 'تغيير اللغة والتحكم بوضع الاستجابة الفائقة' },
  ];

  const quickLaunchItems = allSystemModules.slice(0, 6).map(m => ({
    id: m.id,
    label: m.label,
    icon: m.icon,
    color: 'from-cyan-500 to-indigo-600'
  }));

  const filteredModules = searchQuery.trim() === ''
    ? allSystemModules
    : allSystemModules.filter(m => 
        m.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const renderModuleComponent = (tab: AppTab): React.ReactNode => {
    switch (tab) {
      case AppTab.CONSCIOUSNESS_WHITE_CANVAS: return <ConsciousWhiteCanvas language={language} onNavigate={setActiveTab} onOpenLivePreview={() => setActiveTab(AppTab.LIVE_PREVIEW_MATRIX)} />;
      case AppTab.LIVE_PREVIEW_MATRIX: return <LivePreviewMatrix onNavigate={setActiveTab} />;
      case AppTab.OPEN_SOURCE_HUB: return <OpenSourceSovereignHub language={language} />;
      case AppTab.APEX_MATRIX: return <ApexConstellationHub onNavigate={setActiveTab} onSummonModule={(t) => { setActiveTab(AppTab.HOME); setSummonedModuleOverride(t); }} language={language} onOpenDrawer={() => setIsSideDrawerOpen(true)} />;
      case AppTab.WHITE_STRATEGIC_CHAT: return <WhiteStrategicChat onNavigate={setActiveTab} onExecuteCommand={(cmd) => console.log('Command executed:', cmd)} />;
      case AppTab.SOVEREIGN_VOICE_CONTROLLER: return <SovereignVoiceControlCenter language={language} onNavigate={setActiveTab} />;
      case AppTab.KIMI_LLM_STUDIO: return <KimiLLMStudio language={language} onNavigate={setActiveTab} />;
      case AppTab.STRATEGIC_SITE_AGENT: return <StrategicSiteAgent language={language} onNavigate={setActiveTab} />;
      case AppTab.DRAGON_DOME: return <DragonDomeSystem language={language} onNavigate={setActiveTab} />;
      case AppTab.QUANTUM_DEV_COMPUTER: return <QuantumDevComputer onNavigate={setActiveTab} language={language} onSummonModule={(t) => { setActiveTab(AppTab.HOME); setSummonedModuleOverride(t); }} geminiModel={geminiModel} />;
      case AppTab.SOLAR_COSMOS: return <SarahSolarCosmos onNavigate={setActiveTab} language={language} />;
      case AppTab.AGENT_SWARM: return <AgentSwarm language={language} />;
      case AppTab.NEURAL_BRAIN: return <NeuralBrain />;
      case AppTab.VOICE_HUB: return <VoiceHub onNavigate={setActiveTab} language={language} />;
      case AppTab.SEARCH: return <SearchEngine language={language} />;
      case AppTab.LOGIC_CORE: return <LogicCore language={language} />;
      case AppTab.VIDEO_STUDIO: return <VideoStudio language={language} />;
      case AppTab.HTML_FULL: return <HtmlFull language={language} />;
      case AppTab.ORBITAL: return <OrbitalStation language={language} />;
      case AppTab.DRIVERS: return <DriverMatrix language={language} />;
      case AppTab.REACTOR: return <CyberFusionReactor language={language} />;
      case AppTab.STRATEGIC_ARCHITECT: return <StrategicArchitect language={language} />;
      case AppTab.NEURAL_SHIELD: return <NeuralShield language={language} />;
      case AppTab.NEURAL_OVERSIGHT: return <NeuralOversight language={language} />;
      case AppTab.ADMIN_CENTER: return <AdminCenter language={language} />;
      case AppTab.PYTHON_FORGE: return <PythonForge language={language} />;
      case AppTab.STUDIO: return <ImageStudio />;
      case AppTab.KNOWLEDGE_VAULT: return <KnowledgeVault />;
      case AppTab.DATA_STREAMS: return <DataStreams />;
      case AppTab.AI_NEXUS: return <NeuralAppCloner language={language} />;
      case AppTab.CODE_FORGE: return <CodeForge language={language} />;
      case AppTab.LANDING_PAGE: return <LandingPage onConnect={() => setView('security')} />;
      case AppTab.NEURAL_DEVICE_CONTROL: return <NeuralDeviceControl language={language} />;
      case AppTab.NEURAL_QUAD_CORE: return <NeuralQuadCore language={language} />;
      case AppTab.GLOBAL_INTERFACE: return <GlobalInterface language={language} />;
      case AppTab.SYSTEM_DIAGNOSTICS: return <SystemDiagnostics language={language} />;
      case AppTab.GENERATION_15: return <Generation15 language={language} />;
      case AppTab.QUANTUM_NEURAL_CORE: return <QuantumNeuralCore language={language} />;
      case AppTab.NEURAL_BROADCAST: return <NeuralBroadcast language={language} />;
      case AppTab.AI_BROWSER: return <AIBrowser language={language} />;
      case AppTab.CPU_10G_CORE: return <CPU10GCore language={language} />;
      case AppTab.CLONER: return <SystemCloner language={language} />;
      case AppTab.PROMPT_HUB: return <PromptHub language={language} />;
      case AppTab.GENERATION_16: 
      case AppTab.HEXAGRAM_MATRIX: return <HexagramMatrix language={language} />;
      case AppTab.SETTINGS: return <Settings language={language} onLanguageChange={setLanguage} />;
      default: return <DragonDomeSystem language={language} onNavigate={setActiveTab} />;
    }
  };

  const renderContent = () => {
    if (activeTab === AppTab.HOME) {
      return (
        <SarahSingleScreenV17
          onNavigate={setActiveTab}
          language={language}
          onOpenDrawer={() => setIsSideDrawerOpen(true)}
          turboMode={turboMode}
          geminiModel={geminiModel}
          temperature={temperature}
          thinkingMode={thinkingMode}
          systemDirective={systemDirective}
          summonedModuleOverride={summonedModuleOverride}
          onClearSummonOverride={() => setSummonedModuleOverride(null)}
          renderModuleComponent={renderModuleComponent}
        />
      );
    }
    return renderModuleComponent(activeTab);
  };

  return (
    <div className="flex h-screen bg-[#000000] text-white overflow-hidden font-arabic selection:bg-cyan-500 selection:text-black">
      <Sidebar activeTab={activeTab} onNavigate={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col bg-[#000000]">
        {/* Top Speed Progress Bar */}
        <div className="sticky top-0 z-[100] h-1.5 w-full bg-gradient-to-r from-cyan-500 via-indigo-600 to-rose-500 opacity-80"></div>

        {/* Top Control Header with Reactive Framer Motion Nano-Pulse */}
        <SystemHeader
          activeTab={activeTab}
          onNavigate={setActiveTab}
          goBack={goBack}
          turboMode={turboMode}
          setTurboMode={setTurboMode}
          onOpenSearch={() => setQuickSearchOpen(true)}
          onOpenPreferences={() => setIsQuantumPrefsOpen(true)}
          quickLaunchItems={quickLaunchItems}
        />

        {/* Unified Data Stream (Nano-Quantum Sovereign Entity Dashboard) */}
        <UnifiedDataStream onNavigate={(tab) => {
          setActiveTab(AppTab.HOME);
          setSummonedModuleOverride(tab);
        }} />

        {/* Main Content Area Wrapped with NeuralShield Security */}
        <NeuralShieldWrapper systemName="SARAH_OS_V17">
          <div className="animate-page-reveal flex-1">
            {renderContent()}
          </div>
        </NeuralShieldWrapper>

        {/* Quantum Preferences Modal Overlay */}
        <AnimatePresence>
          {isQuantumPrefsOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[2500] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
              onClick={() => setIsQuantumPrefsOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar"
                onClick={e => e.stopPropagation()}
              >
                <QuantumPreferencesManager
                  language={language}
                  onNavigate={setActiveTab}
                  onClose={() => setIsQuantumPrefsOpen(false)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Omnipresent v17 Side Command & Settings Drawer */}
        <OmniSideDrawer
          isOpen={isSideDrawerOpen}
          onClose={() => setIsSideDrawerOpen(false)}
          onNavigate={setActiveTab}
          onSummonModule={(tab) => {
            setActiveTab(AppTab.HOME);
            setSummonedModuleOverride(tab);
          }}
          language={language}
          onLanguageChange={setLanguage}
          turboMode={turboMode}
          setTurboMode={setTurboMode}
          geminiModel={geminiModel}
          setGeminiModel={setGeminiModel}
          temperature={temperature}
          setTemperature={setTemperature}
          thinkingMode={thinkingMode}
          setThinkingMode={setThinkingMode}
          systemDirective={systemDirective}
          setSystemDirective={setSystemDirective}
        />

        {/* Floating Quick Settings Drawer Trigger Button */}
        <button
          onClick={() => setIsSideDrawerOpen(true)}
          className="fixed bottom-6 left-6 z-[2000] p-3.5 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-full shadow-[0_0_25px_rgba(6,182,212,0.4)] border border-white/20 active:scale-90 transition-all flex items-center gap-2 group"
          title="فتح نافذة التحكم والإعدادات الشاملة (Alt+S)"
        >
          <Sliders className="w-5 h-5 group-hover:rotate-45 transition-transform" />
          <span className="text-xs font-black pl-1 hidden sm:inline">إعدادات v17</span>
        </button>

        {/* Smart Guidance Pointer (اليد المؤشرة الذكية للإرشاد عن النواقص واقتراح الأوامر ونظام التعلم النشط) */}
        <SmartGuidancePointer
          currentTab={activeTab}
          onNavigate={(tab) => {
            setActiveTab(tab);
          }}
          onApplyOptimization={(cmd) => {
            console.log('Applying Optimization Command:', cmd);
          }}
          onApplyModelConfig={(config) => {
            if (config.model) setGeminiModel(config.model);
            if (config.temperature !== undefined) setTemperature(config.temperature);
            if (config.systemDirectives !== undefined) setSystemDirective(config.systemDirectives);
          }}
        />

        {/* Quick Launch Search Modal (Ctrl+K) */}
        {quickSearchOpen && (
          <div 
            className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setQuickSearchOpen(false);
            }}
          >
            <div className="bg-[#080814] border border-cyan-500/30 rounded-3xl w-full max-w-2xl p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <Command className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-black text-white">التحكم الآني والإقلاع السريع</h3>
                </div>
                <button 
                  onClick={() => setQuickSearchOpen(false)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-white/5 rounded-lg border border-white/10"
                >
                  إغلاق (Esc)
                </button>
              </div>

              <input
                type="text"
                autoFocus
                placeholder="ابحث عن أي نظام أو وحدة أو أمر إقلاع..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-black/60 border border-white/15 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-medium"
              />

              <div className="space-y-2 max-h-[340px] overflow-y-auto no-scrollbar pt-2">
                {filteredModules.length > 0 ? (
                  filteredModules.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(AppTab.HOME);
                        setSummonedModuleOverride(item.id);
                        setQuickSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 rounded-2xl flex items-center justify-between text-right transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors">
                              {item.label}
                            </span>
                            <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono">
                              {item.tag}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 block mt-0.5">{item.desc}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:-translate-x-1 transition-all" />
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 text-xs font-mono">
                    لا توجد وحدات تطابق البحث "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

