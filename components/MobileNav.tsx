
import React from 'react';
import { AppTab } from '../types';

interface MobileNavProps {
  activeTab: AppTab;
  onNavigate: (tab: AppTab) => void;
}

const getIconPath = (id: string) => {
  switch (id) {
    case 'home': return "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6";
    case 'space_node_5': return "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z";
    case 'infinity_intelligence': return "M13 10V3L4 14h7v7l9-11h-7z M12 6.253v13";
    case 'agent_swarm': return "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z";
    case 'search': return "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z";
    case 'code_forge': return "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4";
    default: return "M4 6h16M4 12h16M4 18h16";
  }
};

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onNavigate }) => {
  const menuItems = [
    { id: AppTab.HOME, label: 'الرئيسية' },
    { id: AppTab.SEARCH, label: 'البحث' },
    { id: AppTab.CODE_FORGE, label: 'الأكواد' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-3xl border-t border-white/5 px-6 py-4 flex justify-between items-center z-[2000]">
      {menuItems.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.id ? 'text-blue-500 scale-110' : 'text-slate-600'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={getIconPath(item.id)} />
          </svg>
          <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};
