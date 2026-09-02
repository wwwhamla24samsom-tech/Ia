
import React, { useState, useEffect } from 'react';
import { generateNoCodeSolution } from '../services/geminiService';
import { NoCodeProject, Language } from '../types';

export const NoCodeStudio: React.FC<{ language: Language }> = ({ language }) => {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState<'store' | 'website' | 'app' | 'dashboard'>('app');
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<NoCodeProject | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'live_run' | 'code' | 'deployment'>('preview');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentLog, setDeploymentLog] = useState<string[]>([]);
  const [previewKey, setPreviewKey] = useState(0);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setProject(null);
    try {
      const result = await generateNoCodeSolution(prompt, type, language);
      setProject(result);
      setPreviewKey(prev => prev + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPackage = (ext: string) => {
    if (!project) return;
    const blob = new Blob([project.fullCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '_')}_SARAH_BUILD.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const simulateDeployment = async () => {
    setIsDeploying(true);
    setDeploymentLog([]);
    const logs = [
      "INITIATING_SOVEREIGN_NODE_HANDSHAKE...",
      "BYPASSING_STANDARD_DNS_RESOLVERS...",
      "INJECTING_ENCRYPTED_ASSETS_TO_PRIVATE_VPS...",
      "ESTABLISHING_XOR_TUNNEL_LINK...",
      "MAPPING_SOVEREIGN_ID_TO_VIRTUAL_HOST...",
      "DEPLOYMENT_STABLE: PROJECT_LIVE_OFF-GRID"
    ];

    for (let log of logs) {
      await new Promise(r => setTimeout(r, 800));
      setDeploymentLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
    }
    setIsDeploying(false);
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto space-y-8 px-6 pb-40 font-arabic">
      
      {/* Search/Forge Bar */}
      <div className="bg-slate-950 rounded-[3.5rem] p-12 shadow-2xl border border-blue-500/20 -mt-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative z-10 text-right">
          <h2 className="text-4xl font-black text-white flex items-center gap-4">
            <span className="p-4 bg-blue-500/10 rounded-3xl border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]">🏗️</span>
            تجسيد المواقع السيادية (Forge)
          </h2>
          <div className="flex bg-slate-900 p-1.5 rounded-2xl gap-1 border border-white/5">
            {[
              { id: 'app', label: 'تطبيق مستقل 📱' },
              { id: 'website', label: 'موقع سيادي 🌐' },
              { id: 'store', label: 'متجر خارج السحابة 🛒' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setType(t.id as any)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${type === t.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6 relative z-10">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`صف الموقع الذي تريده... سأبني الكود وأجهز بروتوكول استضافة مستقل بعيداً عن خدمات قوقل التقليدية.`}
            className="w-full bg-slate-900 border border-blue-900/40 rounded-3xl px-10 py-8 focus:outline-none focus:ring-4 focus:ring-blue-500/10 text-white h-48 resize-none text-xl font-medium placeholder-slate-800 shadow-inner text-right"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-[2.5rem] font-black text-2xl transition-all shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-4"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-lg text-white">جاري التجسيد خارج السحابة...</span>
              </div>
            ) : "تجسيد الموقع المستقل ✨"}
          </button>
        </div>
      </div>

      {project && (
        <div className="flex flex-col bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-fadeIn text-right">
          {/* Navigation Bar */}
          <div className="flex bg-slate-50 border-b border-slate-100 p-4 justify-center gap-4">
            {[
              { id: 'preview', label: 'الهيكل والوظائف', icon: '✨' },
              { id: 'live_run', label: 'المعاينة المباشرة', icon: '📱' },
              { id: 'code', label: 'كود النواة (Kernel)', icon: '💻' },
              { id: 'deployment', label: 'تجسيد مباشر (Deploy)', icon: '🚀' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-8 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-12 min-h-[600px] flex flex-col">
            {activeTab === 'preview' && (
              <div className="space-y-8 animate-fadeIn flex-1">
                <div className="flex items-center justify-between">
                  <span className="bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Sovereign Architecture</span>
                  <h3 className="text-3xl font-black text-slate-900">{project.name}</h3>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed">{project.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100 group">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 font-bold">✔</div>
                      <p className="font-bold text-slate-800">{f}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'live_run' && (
              <div className="flex flex-col items-center justify-center space-y-12 animate-fadeIn py-10 flex-1">
                <div className="relative group">
                  {/* Smartphone Frame Simulation */}
                  <div className="w-[320px] h-[640px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-950 shadow-[0_0_100px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-950 rounded-b-2xl z-20"></div>
                     <div className="flex-1 bg-white relative z-10">
                        <iframe 
                          key={previewKey}
                          title="Live Preview"
                          srcDoc={project.fullCode}
                          className="w-full h-full border-none"
                        />
                     </div>
                  </div>
                  {/* Reflection/Glow Effect */}
                  <div className="absolute -inset-10 bg-blue-500/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
                <div className="text-center space-y-4">
                   <h4 className="text-2xl font-black text-slate-900 tracking-tight">المعاينة النورونية المباشرة</h4>
                   <p className="text-slate-500 font-bold">التطبيق يعمل الآن في بيئة معزولة داخل مصفوفة صارة.</p>
                   <button 
                    onClick={() => setPreviewKey(k => k + 1)}
                    className="px-10 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs hover:bg-slate-200 transition-all"
                   >إعادة تشغيل المحاكاة ↺</button>
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <div className="space-y-8 animate-fadeIn flex-1">
                <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-black text-slate-900">ملفات النواة (Kernel)</h3>
                   <button className="text-blue-600 font-bold hover:underline" onClick={() => navigator.clipboard.writeText(project.fullCode)}>نسخ الكود الكامل</button>
                </div>
                <div className="bg-slate-950 rounded-[2.5rem] p-8 text-blue-400 font-mono text-xs overflow-x-auto whitespace-pre h-[500px] shadow-inner text-left dir-ltr">
                   {project.fullCode}
                </div>
                <div className="flex gap-4 flex-wrap">
                   {project.techStack.map(tech => (
                     <span key={tech} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black border border-slate-200">{tech}</span>
                   ))}
                </div>
              </div>
            )}

            {activeTab === 'deployment' && (
              <div className="space-y-10 animate-fadeIn h-full flex flex-col flex-1">
                <div className="flex items-center gap-6 text-slate-900">
                   <div className="text-5xl">🛰️</div>
                   <div>
                      <h3 className="text-3xl font-black">مركز التجسيد الفوري (Deploy)</h3>
                      <p className="text-slate-500 font-bold">رفع المشروع على خادم خاص VPS خارج سحابة Google</p>
                   </div>
                </div>

                {!isDeploying && deploymentLog.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-10 py-20 border-4 border-dashed border-slate-100 rounded-[4rem]">
                     <button 
                       onClick={simulateDeployment}
                       className="px-20 py-8 bg-slate-900 text-white rounded-[3rem] font-black text-3xl shadow-3xl hover:scale-105 transition-all"
                     >
                        إطلاق الموقع الآن 🚀
                     </button>
                     <p className="text-slate-400 font-bold">سيتم توجيه الموقع إلى النود الخاص بك في مصفوفة صارة.</p>
                  </div>
                ) : (
                  <div className="flex-1 bg-black rounded-[3rem] p-10 font-mono text-xs text-blue-400 space-y-3 overflow-y-auto h-96 shadow-inner text-left dir-ltr">
                     {deploymentLog.map((log, i) => (
                       <div key={i} className={`animate-fadeIn ${log.includes('SUCCESS') ? 'text-emerald-500 font-black' : ''}`}>
                          {log}
                       </div>
                     ))}
                     {isDeploying && <div className="animate-pulse">_</div>}
                  </div>
                )}
                
                {deploymentLog.some(l => l.includes('STABLE')) && (
                  <div className="mt-8 p-8 bg-emerald-600 text-white rounded-[2.5rem] flex justify-between items-center shadow-2xl">
                     <div className="text-right">
                        <h4 className="text-xl font-black">الموقع نشط الآن!</h4>
                        <p className="text-sm opacity-80">تم التجسيد بنجاح على النود المستقل.</p>
                     </div>
                     <button className="bg-white text-emerald-600 px-10 py-4 rounded-2xl font-black">معاينة الموقع 🌍</button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Unrestricted Direct Download Section */}
          <div className="bg-slate-900 p-10 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5">
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">SOVEREIGN_MANIFEST_TOKEN</span>
              <span className="text-2xl font-black text-blue-400 uppercase">ULTRA-FORGE-{project.id.toUpperCase()}</span>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => downloadPackage('apk')}
                className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-sm hover:bg-emerald-500 transition-all shadow-xl flex items-center gap-3"
              >
                <span>تحميل حزمة APK 📱</span>
              </button>
              <button 
                onClick={() => downloadPackage('ipa')}
                className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-sm hover:bg-blue-500 transition-all shadow-xl flex items-center gap-3"
              >
                <span>تحميل حزمة iOS 🍎</span>
              </button>
              <button 
                onClick={() => downloadPackage('zip')}
                className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all shadow-xl flex items-center gap-3"
              >
                <span>كود المصدر ZIP 💻</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {!project && !loading && (
        <div className="py-20 text-center text-slate-800 flex flex-col items-center gap-6 opacity-20 grayscale hover:grayscale-0 hover:opacity-50 transition-all">
           <div className="text-[15rem]">🏰</div>
           <p className="text-5xl font-black uppercase tracking-[1rem]">Web_Forge_Ready</p>
           <p className="text-2xl font-bold">سأبني لك إمبراطورية ويب لا تخضع لقوانين السحابة التقليدية</p>
        </div>
      )}
    </div>
  );
};
