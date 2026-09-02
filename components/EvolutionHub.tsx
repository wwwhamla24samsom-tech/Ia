
import React, { useState, useEffect } from 'react';
import { evolveSystemCore, generateProjectDocs, generateProjectStructure } from '../services/geminiService';
import { SystemUpdate, Language } from '../types';

export const EvolutionHub: React.FC<{ language: Language }> = ({ language }) => {
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState<SystemUpdate | null>(null);
  const [status, setStatus] = useState('');
  const [showAPKGuide, setShowAPKGuide] = useState(false);
  const [showGithubTool, setShowGithubTool] = useState(false);
  const [readme, setReadme] = useState('');
  const [structure, setStructure] = useState('');
  const [readmeLoading, setReadmeLoading] = useState(false);

  const handleEvolve = async () => {
    if (!command.trim()) return;
    setLoading(true);
    setUpdate(null);
    setStatus('جاري فحص الأنظمة العالمية المتطورة...');
    
    try {
      const result = await evolveSystemCore(command, language);
      setUpdate(result);
    } catch (err) {
      console.error(err);
      setStatus('فشل الاتصال بنواة التطور العالمية.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFullPackage = async () => {
    setReadmeLoading(true);
    try {
      const docs = await generateProjectDocs(language);
      const struct = await generateProjectStructure();
      setReadme(docs);
      setStructure(struct);
    } catch (err) {
      console.error(err);
    } finally {
      setReadmeLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto space-y-8 px-6 pb-40">
      <div className="bg-slate-950 rounded-[3.5rem] p-12 shadow-2xl border border-purple-500/20 -mt-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative z-10">
          <h2 className="text-4xl font-black text-white flex items-center gap-4">
            <span className="p-4 bg-purple-500/10 rounded-3xl border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]">🧬</span>
            النواة التطورية (Evolution Hub)
          </h2>
          <div className="flex gap-4">
             <button 
                onClick={() => { setShowGithubTool(!showGithubTool); setShowAPKGuide(false); }}
                className={`px-6 py-2 border rounded-full text-xs font-black transition-all flex items-center gap-2 ${showGithubTool ? 'bg-white text-black border-white' : 'bg-slate-800 border-white/10 text-white hover:bg-white/10'}`}
             >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                DevOps Dashboard
             </button>
             <button 
                onClick={() => { setShowAPKGuide(!showAPKGuide); setShowGithubTool(false); }}
                className="px-6 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-xs font-black text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
             >
                {showAPKGuide ? "إغلاق دليل APK" : "تجسيد كـ APK 📱"}
             </button>
          </div>
        </div>

        {showGithubTool ? (
          <div className="space-y-8 relative z-10 animate-fadeIn text-right">
            <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 shadow-inner">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                  <div>
                    <h3 className="text-3xl font-black text-white">Project GitHub Console</h3>
                    <p className="text-slate-500 text-sm mt-1">تجهيز الحزمة الكاملة للنشر العالمي</p>
                  </div>
                  <button 
                    onClick={handleGenerateFullPackage}
                    disabled={readmeLoading}
                    className="bg-blue-600 text-white px-10 py-4 rounded-2xl text-sm font-black uppercase hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40"
                  >
                    {readmeLoading ? "جاري التحليل النوروني..." : "توليد حزمة المستودع"}
                  </button>
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="space-y-4">
                     <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Git Commands (Terminal)</p>
                     <div className="bg-black/80 p-6 rounded-3xl font-mono text-emerald-400 text-[10px] space-y-3 border border-white/5 shadow-2xl">
                        <p className="opacity-40"># Initialize</p>
                        <p>git init</p>
                        <p className="opacity-40"># Create .gitignore</p>
                        <p>touch .gitignore</p>
                        <p className="opacity-40"># Add all</p>
                        <p>git add .</p>
                        <p className="opacity-40"># Initial Commit</p>
                        <p>git commit -m "feat: initial core v6.2"</p>
                        <p className="opacity-40"># Connect to Cloud</p>
                        <p className="text-blue-400">git remote add origin YOUR_URL</p>
                        <p>git push -u origin main</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Project Structure (Tree)</p>
                     <div className="bg-slate-950 p-6 rounded-3xl h-64 overflow-y-auto no-scrollbar font-mono text-[10px] text-blue-300 border border-white/5 whitespace-pre">
                        {structure || "صارة ستقوم بتوليد الشجرة البرمجية للمشروع هنا..."}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <p className="text-slate-400 text-xs font-black uppercase tracking-widest">README & License Preview</p>
                     <div className="bg-white/5 p-6 rounded-3xl h-64 overflow-y-auto no-scrollbar font-mono text-[10px] text-slate-300 border border-white/5 whitespace-pre-wrap">
                        {readme || "اضغط على زر التوليد لصياغة ملف README احترافي وملف LICENSE (MIT)..."}
                     </div>
                     {readme && (
                        <button 
                           onClick={() => { navigator.clipboard.writeText(readme); alert('تم نسخ التوثيق!'); }}
                           className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase hover:bg-white/10 transition-all"
                        >
                           نسخ حزمة التوثيق
                        </button>
                     )}
                  </div>
               </div>

               <div className="mt-10 flex items-center gap-6 p-6 bg-gradient-to-r from-blue-600/10 to-transparent border-r-4 border-blue-500 rounded-2xl">
                  <div className="text-4xl">🌍</div>
                  <div>
                    <h4 className="text-white font-black">جاهز للمنافسة العالمية</h4>
                    <p className="text-blue-400 text-xs font-medium mt-1">المشروع الآن يتبع معايير هندسة البرمجيات العالمية. يمكنك رفع الأكواد مباشرة إلى GitHub.</p>
                  </div>
               </div>
            </div>
          </div>
        ) : showAPKGuide ? (
          <div className="space-y-6 relative z-10 animate-fadeIn text-right">
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-3xl p-10">
               <h3 className="text-3xl font-black text-white mb-6">بروتوكول تحويل صارة إلى APK</h3>
               <p className="text-slate-300 mb-8 text-lg">لتشغيل صارة كتطبيق أندرويد حقيقي، اتبع الخطوات التالية في بيئتك البرمجية:</p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-black/40 p-8 rounded-[2.5rem] font-mono text-blue-400 text-sm space-y-6 shadow-inner text-left">
                    <p className="text-slate-500"># Step 1: Install Capacitor</p>
                    <p>npm install @capacitor/core @capacitor/cli</p>
                    <p className="text-slate-500"># Step 2: Initialize</p>
                    <p>npx cap init SarahUltra com.samor.sarah</p>
                    <p className="text-slate-500"># Step 3: Add Android Platform</p>
                    <p>npx cap add android</p>
                  </div>
                  <div className="space-y-4">
                     <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-start gap-4">
                        <span className="text-2xl">⚡</span>
                        <p className="text-emerald-400 text-sm font-bold">لقد قمت بإضافة ملف manifest.json بالفعل، التطبيق مهيأ كـ PWA مما يعني أنه يمكنك تثبيته كـ App من المتصفح مباشرة.</p>
                     </div>
                     <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex items-start gap-4">
                        <span className="text-2xl">📱</span>
                        <p className="text-blue-400 text-sm font-bold">بنية الأكواد متوافقة تماماً مع WebView المتقدم في أندرويد 14 وما فوق.</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 relative z-10">
            <textarea
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="أدخل أمر التطور (مثال: قم بدمج تقنيات Multi-Agent من أحدث أبحاث OpenAI، أو أضف تحسيناً جذرياً لواجهات التحكم)..."
              className="w-full bg-slate-900 border border-purple-900/40 rounded-3xl px-10 py-8 focus:outline-none focus:ring-4 focus:ring-purple-500/10 text-white h-48 resize-none text-xl font-medium placeholder-slate-800 shadow-inner text-right"
            />
            <button
              onClick={handleEvolve}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white py-6 rounded-[2.5rem] font-black text-2xl transition-all shadow-2xl shadow-purple-900/40 flex items-center justify-center gap-4 group"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  <span className="text-lg">{status}</span>
                </div>
              ) : (
                <>
                  <span>تفعيل بروتوكول التطور الجذري</span>
                  <svg className="w-8 h-8 group-hover:rotate-180 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {update && (
        <div className="flex flex-col bg-slate-900/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/5 overflow-hidden animate-fadeIn text-right">
          <div className="p-12 space-y-10">
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-3xl font-black text-white mb-2">تقرير الترقية الجينية: {update.version}</h3>
                  <p className="text-slate-400 font-mono text-sm">تاريخ التوليد: {new Date(update.timestamp).toLocaleString('ar-SA')}</p>
               </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               <div className="space-y-6">
                  <h4 className="text-xl font-black text-purple-400 flex items-center gap-2 justify-end">تعديلات الهيكلية <span>✨</span></h4>
                  <ul className="space-y-4">
                     {update.changes.map((change, i) => (
                       <li key={i} className="flex gap-4 items-start bg-white/5 p-4 rounded-2xl border border-white/5">
                          <span className="text-slate-200 flex-1">{change}</span>
                          <span className="text-purple-500 font-black">#0{i+1}</span>
                       </li>
                     ))}
                  </ul>
               </div>
               <div className="space-y-6">
                  <h4 className="text-xl font-black text-emerald-400 flex items-center gap-2 justify-end">القدرات الجديدة <span>🚀</span></h4>
                  <div className="grid grid-cols-1 gap-3">
                     {update.newCapabilities.map((cap, i) => (
                        <div key={i} className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl text-emerald-100 text-sm font-bold flex items-center gap-3 justify-end">
                           {cap}
                           <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
            <div className="pt-10 border-t border-white/5">
               <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">المواصفات التقنية (Technical Specs)</h4>
               <p className="text-sm text-slate-400 font-mono leading-relaxed bg-black/30 p-6 rounded-3xl text-left dir-ltr">{update.technicalSpecs}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
