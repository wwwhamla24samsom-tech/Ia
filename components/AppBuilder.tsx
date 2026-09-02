
import React, { useState } from 'react';
import { createAppArchitect } from '../services/geminiService';
import { AppIdea, Language } from '../types';

interface AppBuilderProps {
  language: Language;
}

export const AppBuilder: React.FC<AppBuilderProps> = ({ language }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [apps, setApps] = useState<AppIdea[]>([]);
  const [selectedApp, setSelectedApp] = useState<AppIdea | null>(null);

  const handleBuild = async (isClone = false) => {
    if (!prompt.trim() && !isClone) return;
    setLoading(true);
    try {
      /* Fix: result is cast to any to allow access to name, description, and code properties returned from the service */
      const result = await createAppArchitect(
        isClone ? `تحسين هذا التطبيق: ${selectedApp?.name}` : prompt,
        language,
        isClone,
        selectedApp?.codeSnippet || ""
      ) as any;
      const newApp: AppIdea = {
        id: Math.random().toString(36).substr(2, 9),
        name: result.name,
        description: result.description,
        codeSnippet: result.code,
        version: isClone ? (selectedApp?.version || 1) + 1 : 1
      };
      setApps([newApp, ...apps]);
      setSelectedApp(newApp);
      setPrompt('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto space-y-6 px-4">
      <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl -mt-10 relative z-10 border border-slate-800">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <span className="bg-blue-500 p-2 rounded-xl text-white">⚙️</span>
          مختبر بناء التطبيقات الذكي
        </h2>
        
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="صف فكرة تطبيقك، أو اطلب تحسين تطبيق موجود..."
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white h-32 resize-none"
          />
          <div className="flex gap-4">
            <button
              onClick={() => handleBuild(false)}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20"
            >
              {loading ? "جاري البناء..." : "بناء فوري 🚀"}
            </button>
            {selectedApp && (
              <button
                onClick={() => handleBuild(true)}
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-purple-900/20"
              >
                استنساخ وتحسين ✨
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-24">
        <div className="lg:col-span-1 space-y-4 overflow-y-auto no-scrollbar max-h-[600px]">
          <h3 className="text-xl font-bold text-gray-800 px-2">تطبيقاتك المنشأة</h3>
          {apps.map(app => (
            <button
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className={`w-full text-right p-5 rounded-3xl border transition-all ${
                selectedApp?.id === app.id ? 'bg-white border-blue-500 shadow-xl scale-[1.02]' : 'bg-white/5 border-gray-100 hover:bg-white'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full">V{app.version}</span>
                <h4 className="font-bold text-gray-800">{app.name}</h4>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{app.description}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selectedApp ? (
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 h-full overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">{selectedApp.name}</h3>
                <div className="flex gap-2">
                   <button className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100"><svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>
                </div>
              </div>
              <p className="text-gray-600 mb-6">{selectedApp.description}</p>
              <div className="flex-1 bg-slate-900 rounded-2xl p-6 font-mono text-sm text-blue-300 overflow-auto whitespace-pre">
                {selectedApp.codeSnippet}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-[2.5rem] text-gray-400">
              اختر تطبيقاً أو ابدأ بناء فكرتك الأولى
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
