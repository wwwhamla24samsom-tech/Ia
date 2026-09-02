
import React from 'react';
import { AppTab } from '../types';

interface SidebarProps {
  activeTab: AppTab;
  onNavigate: (tab: AppTab) => void;
  isAdmin?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onNavigate }) => {
  const menuItems = [
    { id: AppTab.CONSCIOUSNESS_WHITE_CANVAS, label: 'الوعي السيادي والصفحة البيضاء (تحدث واكتب)', icon: '🧠' },
    { id: AppTab.LIVE_PREVIEW_MATRIX, label: 'مصفوفة المعاينة المباشرة (Live Preview Matrix)', icon: '⚡' },
    { id: AppTab.OPEN_SOURCE_HUB, label: 'مركز النظام المفتوح المصدر (Open Source Hub)', icon: '🔓' },
    { id: AppTab.APEX_MATRIX, label: 'شبكة القيادة المدارية (Apex Constellation UI)', icon: '🌌' },
    { id: AppTab.SOVEREIGN_VOICE_CONTROLLER, label: 'نظام التحدث والتحكم الصوتي المستقل (بدون Gemini)', icon: '🎙️' },
    { id: AppTab.KIMI_LLM_STUDIO, label: 'استوديو Kimi LLM (Moonshot AI)', icon: '🔮' },
    { id: AppTab.WHITE_STRATEGIC_CHAT, label: 'الدردشة البيضاء ونظام الوديان', icon: '💬' },
    { id: AppTab.AI_BROWSER, label: 'جسر Kimi والمتصفح الخارجي واستقبال الأوامر', icon: '⚡' },
    { id: AppTab.STRATEGIC_SITE_AGENT, label: 'الوكيل الاستراتيجي لإدارة المواقع', icon: '🌐' },
    { id: AppTab.QUANTUM_DEV_COMPUTER, label: 'الكمبيوتر الكمومي الخارق QPU-128', icon: '💻' },
    { id: AppTab.DRAGON_DOME, label: 'منظومة دراغون وقبة الحماية', icon: '🐉' },
    { id: AppTab.SOLAR_COSMOS, label: 'صارة (الشمس والنظام الشمسي)', icon: '☀️' },
    { id: AppTab.AGENT_SWARM, label: 'وكلاء الاستراتيجية والتنفيذ الحقيقي', icon: '🛡️' },
    { id: AppTab.GENERATION_16, label: 'صارة v16 (النجمة السداسية)', icon: '🔯' },
    { id: AppTab.HOME, label: 'مركز العمليات', icon: '🏠' },
    { id: AppTab.LANDING_PAGE, label: 'صفحة الهبوط', icon: '🚀' },
    { id: AppTab.LOGIC_CORE, label: 'أوراكل الحقيقة', icon: '⚖️' },
    { id: AppTab.SEARCH, label: 'الاستخبارات', icon: '🔍' },
    { id: AppTab.CODE_FORGE, label: 'مفاعل الأكواد', icon: '💻' },
    { id: AppTab.AI_NEXUS, label: 'مستنسخ الأنظمة', icon: '🧩' },
    { id: AppTab.STRATEGIC_ARCHITECT, label: 'المعمار الاستراتيجي', icon: '🏗️' },
    { id: AppTab.DRIVERS, label: 'مصفوفة التعريفات', icon: '⚙️' },
    { id: AppTab.ORBITAL, label: 'الرادار الفضائي', icon: '📡' },
    { id: AppTab.NEURAL_DEVICE_CONTROL, label: 'التحكم العصبوني', icon: '🧠' },
    { id: AppTab.NEURAL_QUAD_CORE, label: 'الكيانات الأربعة', icon: '💠' },
    { id: AppTab.GLOBAL_INTERFACE, label: 'الرابط العالمي', icon: '🌐' },
    { id: AppTab.SYSTEM_DIAGNOSTICS, label: 'فحص النظام', icon: '🩺' },
    { id: AppTab.NEURAL_BROADCAST, label: 'البحث والبث', icon: '📡' },
    { id: AppTab.CPU_10G_CORE, label: 'نواة 10G CPU', icon: '⚡' },
    { id: AppTab.CLONER, label: 'مستنسخ الأنظمة', icon: '🧬' },
    { id: AppTab.GENERATION_15, label: 'صارة v15', icon: '🌀' },
    { id: AppTab.PROMPT_HUB, label: 'مستودع البرومبتات', icon: '📜' },
    { id: AppTab.QUANTUM_NEURAL_CORE, label: 'النواة الكوآنتومية', icon: '💠' },
    { id: AppTab.NEURAL_SHIELD, label: 'نواة الدفاع', icon: '🛡️' },
    { id: AppTab.ADMIN_CENTER, label: 'مركز التحكم', icon: '🏛️' },
    { id: AppTab.SETTINGS, label: 'الإعدادات', icon: '⚙️' },
  ];

  return (
    <aside className="hidden lg:flex w-24 flex-col bg-black border-l border-white/5 h-full py-8 items-center justify-between z-50 shadow-2xl">
       <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-[0_0_25px_rgba(79,70,229,0.5)] cursor-pointer hover:scale-110 transition-all" onClick={() => onNavigate(AppTab.HOME)}>
          🌀
       </div>

       <nav className="flex flex-col gap-4">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={item.label}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all relative group ${activeTab === item.id ? 'bg-white text-black shadow-2xl scale-110' : 'text-slate-600 hover:text-white hover:bg-white/5'}`}
            >
              {item.icon}
              {/* Tooltip */}
              <div className="absolute right-20 px-4 py-2 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-all transform translate-x-2 group-hover:translate-x-0 whitespace-nowrap shadow-3xl z-[100]">
                 {item.label}
              </div>
            </button>
          ))}
       </nav>

       <div className="flex flex-col items-center gap-4">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
          <span className="text-[8px] font-black text-slate-800 rotate-90 whitespace-nowrap uppercase tracking-[0.5em]">K_STABLE</span>
       </div>
    </aside>
  );
};
