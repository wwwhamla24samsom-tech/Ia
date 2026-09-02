
import React, { useState } from 'react';
import { runManifestationProtocol } from '../services/geminiService';
import { ManifestResult, ManifestTarget, Language } from '../types';

export const ExternalManifestation: React.FC<{ language: Language }> = ({ language }) => {
  const [target, setTarget] = useState<ManifestTarget>('windows_exe');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ManifestResult | null>(null);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'script' | 'core'>('blueprint');

  const targets = [
    { id: 'windows_exe', label: 'Windows', icon: '🪟' },
    { id: 'android_apk', label: 'Android', icon: '📱' },
    { id: 'browser_extension', label: 'Chrome', icon: '🌐' },
    { id: 'python_core', label: 'Python', icon: '🐍' }
  ];

  const handleManifest = async () => {
    if (!purpose.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await runManifestationProtocol(target, purpose, language);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("⚠️ فشل بروتوكول التجسيد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn font-arabic pb-40">
      
      <div className="bg-slate-950/80 backdrop-blur-3xl border border-blue-500/30 p-10 rounded-[3rem] text-center relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="w-20 h-20 bg-blue-600/10 border-2 border-blue-400/50 rounded-[2rem] flex items-center justify-center text-4xl mx-auto animate-pulse">
            🧊
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">التجسيد <span className="text-blue-500">الخارجي</span></h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Protocol_v12.0</p>
        </div>
      </div>

      <div className="space-y-6">
         <div className="bg-black/60 rounded-[2.5rem] border border-white/10 p-8 space-y-8">
            <div className="grid grid-cols-2 gap-3">
               {targets.map(t => (
                 <button
                   key={t.id}
                   onClick={() => setTarget(t.id as ManifestTarget)}
                   className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${target === t.id ? 'bg-white text-black border-white shadow-xl' : 'bg-slate-900 border-white/5 text-white/40'}`}
                 >
                   <span className="text-2xl">{t.icon}</span>
                   <span className="font-black text-[10px]">{t.label}</span>
                 </button>
               ))}
            </div>

            <textarea 
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="لماذا تريد تجسيد صارة؟..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-white text-sm h-32 focus:outline-none resize-none"
            />

            <button 
              onClick={handleManifest}
              disabled={loading || !purpose.trim()}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg shadow-xl"
            >
              {loading ? 'جاري الاستخراج...' : 'بدء التجسيد 🚀'}
            </button>
         </div>

         {result && (
           <div className="bg-slate-900/60 rounded-[3rem] border border-blue-500/20 overflow-hidden animate-slideUp">
              <div className="flex bg-black/40 p-2 rounded-full m-6 gap-1">
                 {[
                   { id: 'blueprint', label: 'المخطط' },
                   { id: 'script', label: 'التنفيذ' },
                   { id: 'core', label: 'النواة' }
                 ].map(tab => (
                   <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id as any)}
                     className={`flex-1 py-3 rounded-full text-[10px] font-black ${activeTab === tab.id ? 'bg-white text-black' : 'text-slate-500'}`}
                   >
                     {tab.label}
                   </button>
                 ))}
              </div>

              <div className="p-8">
                 {activeTab === 'blueprint' && (
                   <p className="text-lg leading-relaxed text-slate-100 italic">{result.systemBlueprint}</p>
                 )}
                 {activeTab === 'script' && (
                   <div className="bg-black p-6 rounded-2xl font-mono text-xs text-emerald-400 border border-emerald-950 text-left dir-ltr">
                     {result.installationScript}
                   </div>
                 )}
                 {activeTab === 'core' && (
                   <div className="bg-black p-6 rounded-2xl font-mono text-[10px] text-blue-300 h-64 overflow-auto text-left dir-ltr">
                     {result.coreCode}
                   </div>
                 )}
              </div>
           </div>
         )}
      </div>
    </div>
  );
};
