
import React from 'react';
import { Language } from '../types';

interface SettingsProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Settings: React.FC<SettingsProps> = ({ language, onLanguageChange }) => {
  const [personality, setPersonality] = React.useState('technical');
  const [thinkingBudget, setThinkingBudget] = React.useState(16384);
  const [learningMode, setLearningMode] = React.useState(true);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'dz', label: 'الجزائرية', flag: '🇩🇿' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto space-y-6 px-4 bg-black font-mono">
      <div className="bg-black border border-white/20 p-8 shadow-2xl -mt-10 relative z-10">
        <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3 uppercase tracking-widest">
          <span className="bg-white text-black p-1 text-sm">SET</span>
          SYSTEM_CONFIG_GLOBAL
        </h2>

        <div className="space-y-10">
          <section>
            <h3 className="text-[10px] font-black text-white/40 mb-4 uppercase tracking-[0.2em]">Neural_Language_Core</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`py-3 rounded-none font-bold transition-all border text-[10px] flex flex-col items-center gap-1 ${
                    language === lang.code 
                    ? 'bg-white border-white text-black' 
                    : 'bg-black border-white/10 text-white/40 hover:border-white'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black text-white/40 mb-4 uppercase tracking-[0.2em]">Intelligence_Response_Profile</h3>
            <div className="grid grid-cols-3 gap-2">
              {['creative', 'technical', 'balanced'].map(p => (
                <button
                  key={p}
                  onClick={() => setPersonality(p)}
                  className={`py-3 rounded-none font-bold transition-all border text-[10px] uppercase ${
                    personality === p 
                    ? 'bg-white border-white text-black shadow-lg' 
                    : 'bg-black border-white/10 text-white/40 hover:border-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10">
              <div>
                <h4 className="text-[11px] font-black text-white uppercase">DZ_Dialect_Analysis</h4>
                <p className="text-[9px] text-white/40 uppercase">Enable Deep Darja Context Awareness</p>
              </div>
              <button
                onClick={() => setLearningMode(!learningMode)}
                className={`w-10 h-5 transition-all relative ${learningMode ? 'bg-white' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-3 h-3 transition-all ${learningMode ? 'right-6 bg-black' : 'right-1 bg-white'}`}></div>
              </button>
            </div>
          </section>

          <button className="w-full bg-white text-black py-4 font-black text-xs uppercase tracking-[0.5em] hover:bg-slate-200 transition-all">
            Commit_Changes_To_Core
          </button>
        </div>
      </div>
    </div>
  );
};
