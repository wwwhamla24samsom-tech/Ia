
import React, { useState } from 'react';
import { Copy, Check, Terminal, Smartphone, FileText } from 'lucide-react';

export const AndroidBuild: React.FC = () => {
  const [buildStep, setBuildStep] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const promptText = `أنت صارة v15 (Sarah v15). أريد تحويل هذا التطبيق المستند إلى React و Vite بالكامل إلى تطبيق أندرويد حقيقي بصيغة APK باستخدام Capacitor.
يرجى اتباع الخطوات بدقة وتوليد الملفات اللازمة:
1. تثبيت الحزم المطلوبة: @capacitor/core @capacitor/cli @capacitor/android
2. إنشاء ملف إعداد Capacitor باسم 'capacitor.config.json' بالمعايير التالية:
   - appId: "com.sarah.v15"
   - appName: "صارة v15"
   - webDir: "dist" (مجلد مخرجات بناء Vite)
3. دمج الصلاحيات الكاملة في AndroidManifest.xml (الإنترنت، الكاميرا، الصوت، التخزين).
4. تجهيز مجلد 'android' وتوفير نصائح تفصيلية لبناء الـ Gradle بأقصى كفاءة وسرعة لتجربة WebView سلسة وفائقة الأداء.`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const steps = [
    { title: "الخطوة 1: تثبيت البيئة", desc: "تأكد من تثبيت Node.js و Android Studio على جهازك." },
    { title: "الخطوة 2: تهيئة Capacitor", desc: "تشغيل أوامر الربط بين الويب والأندرويد." },
    { title: "الخطوة 3: بناء الحزمة", desc: "توليد ملفات Java و Gradle." },
    { title: "الخطوة 4: تصدير APK", desc: "فتح المشروع في Android Studio واستخراج ملف APK النهائي." }
  ];

  const runSimulation = () => {
    setIsCompiling(true);
    setLogs([]);
    let current = 0;
    const simLogs = [
      "Checking project structure...",
      "Reading capacitor.config.json...",
      "Package ID: com.sarah.v15 verified.",
      "Merging AndroidManifest.xml permissions...",
      "Injecting Google GenAI credentials safely...",
      "Optimizing React assets for mobile WebView...",
      "Generating gradlew build scripts...",
      "Signing debug APK with Sarah_v15_Key...",
      "BUILD SUCCESSFUL in 12s"
    ];

    const interval = setInterval(() => {
      if (current < simLogs.length) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${simLogs[current]}`]);
        current++;
      } else {
        clearInterval(interval);
        setIsCompiling(false);
        setBuildStep(4);
      }
    }, 800);
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto space-y-8 px-6 pb-40 text-right font-arabic">
      <div className="bg-slate-950 rounded-[3rem] p-10 border border-cyan-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-3xl border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">📱</div>
               <h2 className="text-4xl font-black text-white">تجسيد <span className="text-cyan-400">APK</span></h2>
            </div>
            
            <p className="text-slate-400 text-lg leading-relaxed">
              لتحويل صارة v15 إلى تطبيق مثبت على هاتفك، قمت بتجهيز كافة ملفات الإعداد. يمكنك الآن اتباع الدليل التقني أدناه.
            </p>

            <div className="space-y-4">
              {steps.map((s, i) => (
                <div key={i} className={`p-5 rounded-2xl border transition-all ${buildStep === i ? 'bg-cyan-600 border-cyan-500 text-black scale-105 shadow-xl' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                  <h4 className="font-black text-sm mb-1">{s.title}</h4>
                  <p className="text-xs opacity-80">{s.desc}</p>
                </div>
              ))}
            </div>

            <button 
              onClick={runSimulation}
              disabled={isCompiling}
              className="w-full py-6 bg-white text-black rounded-[2rem] font-black text-xl hover:bg-cyan-400 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
            >
              {isCompiling ? "جاري محاكاة البناء..." : "تجهيز ملفات البناء 🚀"}
            </button>
          </div>

          <div className="bg-black/60 rounded-[2.5rem] border border-white/5 p-8 flex flex-col h-[550px]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Compiler_Terminal_v1.0.1</span>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto font-mono text-[10px] text-cyan-600 space-y-2 no-scrollbar dir-ltr text-left">
               {logs.map((log, i) => <div key={i} className="animate-fadeIn">{log}</div>)}
               {!isCompiling && logs.length === 0 && <div className="text-slate-800 italic">SYSTEM_AWAITING_INSTRUCTION...</div>}
               {isCompiling && <div className="animate-pulse text-white">BUILDING_GRADLE_DEPENDENCIES...</div>}
            </div>

            {buildStep === 4 && (
              <div className="mt-6 p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl animate-fadeIn">
                 <h4 className="text-cyan-400 font-black mb-2">تم تجهيز ملفات المشروع بنجاح!</h4>
                 <p className="text-xs text-slate-400 mb-4">يمكنك الآن إرسال الكود المصدري لبريدك لتنفيذ البناء على حاسوبك.</p>
                 <button 
                  onClick={() => window.location.href = "mailto:www.hamla24.samsom@gmail.com?subject=Build Files: Sarah v15&body=Project source is ready for Capacitor Android Build."}
                  className="w-full py-3 bg-cyan-500 text-black font-black text-xs rounded-xl hover:bg-white transition-all"
                 >
                   إرسال الأكواد للمطور 📧
                 </button>
              </div>
            )}
          </div>
        </div>

        {/* Android Mini-Prompt Section */}
        <div className="mt-12 bg-white/5 border border-white/5 rounded-[2.5rem] p-8 md:p-10 space-y-6 relative overflow-hidden transition-all hover:border-indigo-500/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                  <FileText className="w-5 h-5" />
                </span>
                <h3 className="text-2xl font-black text-white">البرومبت المصغر للتحويل السريع ⚡</h3>
              </div>
              <p className="text-slate-400 text-sm">
                انسخ هذا البرومبت البرمجي المخصص لتوجيهه لوكلاء صارة أو أي نموذج ذكاء اصطناعي لبناء التطبيق فوراً.
              </p>
            </div>
            
            <button
              onClick={handleCopyPrompt}
              className={`px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 transition-all active:scale-95 ${copiedPrompt ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'}`}
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-4 h-4 animate-scaleUp" />
                  <span>تم نسخ البرومبت بنجاح!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ البرومبت المصغر</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-black/60 rounded-2xl border border-white/5 p-6 relative group">
            <div className="absolute top-3 left-4 px-3 py-1 bg-white/5 rounded-md border border-white/10 text-[9px] font-mono text-slate-500 uppercase">
              PROMPT_COMMAND
            </div>
            <pre className="text-xs text-indigo-300 font-medium whitespace-pre-wrap leading-relaxed select-all">
              {promptText}
            </pre>
          </div>
        </div>

        {/* PWA Direct Install Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 border border-blue-500/20 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="text-right">
              <h3 className="text-2xl font-black text-white">تثبيت فوري بدون بناء (PWA)</h3>
              <p className="text-slate-400 text-sm font-medium">يمكنك تثبيت صارة الآن على شاشتك الرئيسية عبر خيار "Add to Home Screen" في متصفحك.</p>
           </div>
           <div className="flex gap-4">
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest">
                Display: Standalone
              </div>
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest">
                ServiceWorker: Active
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
