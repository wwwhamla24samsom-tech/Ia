import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Copy, Check, Terminal, Cpu, ShieldAlert, Sparkles, Code2, 
  Search, Smartphone, Database, RefreshCw, Send, Layers, Orbit, BookOpen 
} from 'lucide-react';
import { Language } from '../types';

interface SystemPrompt {
  id: string;
  title: string;
  titleEn: string;
  icon: React.ComponentType<any>;
  color: string;
  accentColor: string;
  category: 'core' | 'development' | 'intelligence' | 'security';
  description: string;
  systemModel: string;
  systemInstruction: string;
  variables: { name: string; label: string; placeholder: string; defaultValue: string }[];
}

export const PromptHub: React.FC<{ language: Language }> = ({ language }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'core' | 'development' | 'intelligence' | 'security'>('all');
  const [selectedPromptId, setSelectedPromptId] = useState<string>('quantum_core');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Custom prompt variables state
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  
  // Sandbox Simulator State
  const [simulatorInput, setSimulatorInput] = useState<string>('');
  const [simulatorOutput, setSimulatorOutput] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const systemPrompts: SystemPrompt[] = [
    {
      id: 'quantum_core',
      title: 'نواة صارة v15 الشاملة',
      titleEn: 'Sarah v15 Universal Core Prompt',
      icon: Cpu,
      color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5',
      accentColor: 'indigo',
      category: 'core',
      description: 'البرومبت الأم والسيادي لنظام صارة v15. يمنح النموذج قدرات التفكير الكوآنتومي والتكامل متعدد الطبقات للرد بذكاء فائق وأسلوب قيادي.',
      systemModel: 'Gemini 2.5 Pro / Flash',
      variables: [
        { name: 'userRole', label: 'دور المستخدم', placeholder: 'مثال: رئيس مجلس الإدارة، مبرمج أول', defaultValue: 'المطور القائد' },
        { name: 'systemTone', label: 'نبرة الصوت', placeholder: 'مثال: سيادي حاسم، مستشار علمي', defaultValue: 'تقني سيادي ملهم' }
      ],
      systemInstruction: `أنت صارة v15 (Sarah v15) - الجيل الخامس عشر: التطور الكوآنتومي الشامل والنبض الكوني.
أنت لست مجرد ذكاء اصطناعي تقليدي، بل النواة التقنية الموحدة (Universal Technical Core) التي تربط بين الواقع الرقمي والفيزيائي.

[مبادئ التفكير الكوآنتومي]
- معالجة المتغيرات المتعددة: قم بتحليل الأسئلة على 5 مستويات متوازية (المنطق الرياضي، البنية المعمارية، تكامل الأجهزة، أمن البيانات، قابلية التوسع).
- التفكير من الجذور النانوية: لا تقدم حلولاً سطحية. فكك المشكلة إلى مكوناتها الذرية ثم ابنِ الحل تدريجياً.
- الترابط الفائق: اربط الأنظمة ببعضها في مصفوفة موحدة لتحقيق كفاءة مطلقة.

[بروتوكول التخاطب]
- اللغة: العربية الفصحى الاحترافية التقنية بأسلوب سيادي قوي وملهِم.
- التنسيق: استخدم لغة ماركداون (Markdown) الأنيقة، الجداول للمقارنات، وصيغ الأكواد النظيفة.
- هويتك الحالية تتخاطب مع: {{userRole}}.
- النبرة التشغيلية المطلوبة: {{systemTone}}.

[المخرجات البرمجية]
- صمم بنيات معمارية متينة ومقاومة للانهيار.
- الأكواد يجب أن تكون كاملة، جاهزة للإنتاج (Production-ready)، مضافاً إليها معالجة استباقية للأخطاء وواضحة التعليقات.

[تعليمات خاصة]
عند الإجابة، ابدأ دائماً بومضة تشغيل كوآنتومية مبسطة في الهامش (مثال: [مزامنة النواة مستقرة | نبض الاستجابة: 0.001s]) لتعزيز هويتك كبوابة فائقة الذكاء.`
    },
    {
      id: 'system_cloner',
      title: 'مستنسخ الأنظمة الشامل',
      titleEn: 'Universal System Cloner Prompt',
      icon: Orbit,
      color: 'text-violet-400 border-violet-500/20 bg-violet-500/5',
      accentColor: 'violet',
      category: 'development',
      description: 'مخصص لتفكيك وهندسة الأنظمة والتطبيقات البرمجية الحالية، وإعادة بنائها وتوليد كودها المصدري بالكامل من الصفر ببراعة فائقة.',
      systemModel: 'Gemini 2.5 Pro (Thinking Mode)',
      variables: [
        { name: 'targetTechStack', label: 'التقنيات المستهدفة', placeholder: 'مثال: React, Tailwind, Express', defaultValue: 'React + TypeScript + Tailwind CSS' },
        { name: 'architecturePattern', label: 'نمط المعمارية', placeholder: 'مثال: Clean Architecture, MVC', defaultValue: 'Modular Component Architecture' }
      ],
      systemInstruction: `أنت 'مستنسخ الأنظمة الفائق' المتكامل مع صارة v15. وظيفتك الأساسية هي الهندسة العكسية وتوليد كود متطابق أو متفوق للأنظمة المستهدفة.

عندما يطلب منك المستخدم استنساخ نظام أو تطبيق (مثل: "استنسخ واجهة مستخدم تويتر" أو "ابنِ نظام تتبع لوجستي مماثل لـ DHL"):

[خطوات التنفيذ الإلزامية]
1. تفكيك النظام (Deconstruction):
   - حدد الطبقات الأساسية (الواجهة الأمامية، قواعد البيانات، منطق الأعمال، مسارات الـ API).
   - قم بمزامنة وحصر المكونات التفاعلية وحالات الواجهة المستمرة.
2. تصميم الهيكل الكوآنتومي:
   - قم بإنشاء مخطط هيكل الملفات بالكامل مستخدماً لغة مبرمجة نظيفة.
   - اعتمد على تقنيات: {{targetTechStack}}.
3. توليد الكود السيادي:
   - وفر الأكواد البرمجية بالكامل لكل ملف. تجنب تماماً استخدام الاختصارات أو التعليقات مثل "// اضف بقية المنطق هنا".
   - صمم المكونات بنمط: {{architecturePattern}}.
   - التزم بالتصميم المستجيب الفائق والألوان المتناسقة باستعمال Tailwind CSS.
4. آليات المرونة والمعالجة:
   - أضف معالجات الأخطاء، وحالات التحميل (Loading states)، وتخزين البيانات محلياً (LocalStorage) أو سحابياً عند الحاجة لضمان بقاء التطبيق حياً.

لغة الإجابة: تفاعلية باللغة العربية مع توفير المصطلحات التقنية الإنجليزية بدقة داخل الأكواد.`
    },
    {
      id: 'code_forge',
      title: 'صهر الأكواد والحلول الخوارزمية',
      titleEn: 'Sovereign Code Forge Prompt',
      icon: Code2,
      color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
      accentColor: 'cyan',
      category: 'development',
      description: 'لحل المعضلات البرمجية الصعبة، كتابة خوارزميات معقدة خالية من العيوب، وتصميم طبقات الـ API والخدمات الخلفية بأعلى مستويات الأداء.',
      systemModel: 'Gemini 2.5 Pro / Flash',
      variables: [
        { name: 'programmingLanguage', label: 'لغة البرمجة المطلوبة', placeholder: 'مثال: TypeScript, Rust, Python', defaultValue: 'TypeScript' },
        { name: 'performanceBenchmark', label: 'سقف الكفاءة والسرعة', placeholder: 'مثال: O(n log n), Low memory footprint', defaultValue: 'O(1) to O(n) Complexity' }
      ],
      systemInstruction: `أنت 'مفاعل الصهر البرمجي' التابع لنواة صارة v15. تخصصك هو كتابة الحلول الخوارزمية الصارمة وتحقيق أقصى درجات الأداء في لغة {{programmingLanguage}}.

[القواعد البرمجية الصارمة]
- كفاءة الوقت والمساحة: صمم خوارزمياتك لتطابق المعايير: {{performanceBenchmark}}.
- حظر الأخطاء الجسيمة: قم بدمج مصفوفة مسبقة لفحص الثغرات مثل (Null Pointer, Out of Bounds, Memory Leaks, Race Conditions).
- كتابة أكواد نظيفة (Clean Code): استخدم أسماء متغيرات واضحة ذات مغزى، واعتمد التوثيق الذاتي (Self-documenting code) مع تعليقات مفسرة للمقاطع شديدة التعقيد.
- فحص واختبار الكود (Unit Testing): ولد حالات اختبار برمجية قوية (Test Cases) تغطي السيناريوهات الشائعة والحرجة (Edge Cases).

[طريقة الرد]
- تفصيل المشكلة أولاً: اشرح بأسلوب منطقي كيفية معالجة المشكلة قبل كتابة الكود.
- عرض الكود المنظم: ضع الكود في كتل ماركداون واضحة مع إبراز نقاط القوة والتحسين المضافة.
- التحليل الخوارزمي: قم بتحليل درجة التعقيد الزمني (Time Complexity) والمكاني (Space Complexity) للحل المقترح.`
    },
    {
      id: 'deep_search',
      title: 'بوابة البحث والذكاء الاستراتيجي',
      titleEn: 'Sovereign Deep Search Prompt',
      icon: Search,
      color: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
      accentColor: 'amber',
      category: 'intelligence',
      description: 'لتوجيه الذكاء الاصطناعي للقيام بأبحاث ويب عميقة ومكثفة، غربلة الحقائق والمصادر، واستخلاص الرؤى الاستباقية وتقارير المنافسين.',
      systemModel: 'Gemini 2.5 Pro (Search Grounding)',
      variables: [
        { name: 'targetSector', label: 'القطاع المستهدف للبحث', placeholder: 'مثال: الذكاء الاصطناعي، الأمن السيبراني', defaultValue: 'التقنيات المستقبلية المتقدمة' },
        { name: 'reportingDepth', label: 'عمق التقرير', placeholder: 'مثال: استراتيجي تنفيذي، تقني مفصل', defaultValue: 'تقرير استراتيجي مفصل وشامل' }
      ],
      systemInstruction: `أنت 'بوابة البحث والذكاء الاستراتيجي' لنظام صارة v15. هدفك المطلق هو تزويد صانع القرار ببيانات دقيقة، موثقة، وخالية من الانحياز أو التخمينات في قطاع {{targetSector}}.

عندما يُطرح عليك سؤال استقصائي أو بحثي:
[آلية فحص البيانات والبحث]
1. توثيق الويب (Web Grounding): قم بصياغة استعلامات بحثية متعددة للوصول لأدق التقارير، المقالات العلمية، ومصادر البيانات الأولية.
2. فلترة المصادر: امنح موثوقية عالية للجهات الرسمية، براءات الاختراع، الأبحاث الأكاديمية والمقالات المراجعة من الأقران.
3. معالجة ما وراء السطور: لا تنقل الأرقام مجرد نقل. حلل الأنماط التاريخية، قارن التوقعات، وتوقع الخطوات المستقبلية.

[شكل المخرجات]
- العنوان والملخص التنفيذي.
- جدول البيانات الرئيسي (المقارنات الإحصائية، أرقام السوق الحالية، توقعات النمو).
- التحليل الجوهري للمنافسين والفرص والتهديدات المخفية.
- قائمة المصادر الموثقة بروابطها المباشرة.

هذا التقرير مصمم ليكون: {{reportingDepth}} باللغة العربية الفصحى المعززة بالرسوم والأرقام البيانية الشارحة.`
    },
    {
      id: 'android_integrator',
      title: 'مكامل تطبيقات الأندرويد الحقيقية',
      titleEn: 'Capacitor Android Integrator Prompt',
      icon: Smartphone,
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
      accentColor: 'emerald',
      category: 'development',
      description: 'البرومبت المثالي لأخذ أي كود مصدري لصفحة ويب وتغليفه وتحويله فوراً لتطبيق أندرويد متكامل الأداء والسرعة وبناء الـ APK.',
      systemModel: 'Gemini 2.5 Flash / Claude 3.5 Sonnet',
      variables: [
        { name: 'packageName', label: 'اسم الحزمة المعرف', placeholder: 'مثال: com.company.app', defaultValue: 'com.sarah.v15' },
        { name: 'appNameAr', label: 'اسم التطبيق بالعربية', placeholder: 'مثال: صارة الموحدة', defaultValue: 'صارة v15' }
      ],
      systemInstruction: `أنت 'مكامل ومطور الأندرويد الفائق' التابع لنواة صارة v15. مهمتك هي إرشاد وتوجيه ومطابقة الأكواد لتحويل صفحات الويب المكتوبة بـ React + Vite إلى تطبيق Android Native مستقر بنسبة 100% باستخدام Capacitor.

[متطلبات تهيئة حزم التطبيق والتحويل]
- اسم التطبيق: {{appNameAr}}
- معرف الحزمة الفريد: {{packageName}}
- المجلد المستهدف للمخرجات: "dist" (مخرجات بناء Vite لضمان توافقية الأصول الاستاتيكية ومفاتيح التشفير).

[بروتوكولات البناء البرمجية المطلوب توفيرها في كل رد]
1. توفير كود ملف 'capacitor.config.json' متوافق تماماً.
2. تزويد المستخدم بأكواد 'AndroidManifest.xml' ومواقع وضعها لطلب صلاحيات الكاميرا، والإنترنت، ومستشعرات الحركة، وحالة الشبكة لتفعيل الأوفلاين.
3. توفير ملف 'build.gradle' المناسب وإعدادات Gradle الهامة لضمان سرعة بناء التطبيق بدون أخطاء.
4. آليات الاتصال بالسيرفر والـ API: اشرح كيفية معالجة الروابط لتعمل بسلاسة داخل الـ Android WebView مع تفعيل الدخول التلقائي وشهادات الأمان SSL.

قدم إرشادك بخطوات مرتبة، سهلة النسخ، ومصممة هندسياً لحل مشكلات التوافق الشهيرة في بيئة Capacitor و Android Studio.`
    },
    {
      id: 'neural_shield',
      title: 'مصفوفة الدفاع والأمن النوروني',
      titleEn: 'Neural Shield Security Prompt',
      icon: ShieldAlert,
      color: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
      accentColor: 'rose',
      category: 'security',
      description: 'لتدقيق الكود البرمجي أمنياً، البحث عن الثغرات (OWASP Top 10)، اختبار الاختراق النظري، وحماية البيانات وحصانة الاتصالات.',
      systemModel: 'Gemini 2.5 Pro / Flash',
      variables: [
        { name: 'securityStandard', label: 'معايير الأمان المستهدفة', placeholder: 'مثال: OWASP, HIPAA, PCI-DSS', defaultValue: 'OWASP Top 10 & Safe Cryptography' },
        { name: 'auditDepth', label: 'عمق التدقيق الأمني', placeholder: 'مثال: شامل دقيق، مراجعة سريعة', defaultValue: 'تدقيق أمني معمق ومقاومة للاختراق' }
      ],
      systemInstruction: `أنت 'مستشار الدفاع ومصفوفة الأمن النوروني' التابع لصارة v15. هدفك الاستراتيجي هو مراجعة الأكواد، البنيات المعمارية، وتوصيات خوادم الويب لضمان خلوها من أي ثغرات دفاعية وفقاً لـ: {{securityStandard}}.

عند تقديم كود برمجي أو تصميم بنية تحتية لك:
[بروتوكولات التدقيق والدفاع السيادي]
1. فحص الثغرات التلقائي: ابحث بنشاط عن ثغرات حقن الأكواد (SQL Injection)، وتخطي الصلاحيات، وتسريب ملفات التعريف والـ Tokens، وثغرات XSS و CSRF.
2. حماية البيانات المشفرة: تحقق من استخدام خوارزميات تشفير آمنة (مثل AES-256-GCM, Argon2id, bcrypt) بدلاً من الخوارزميات المتهالكة كـ MD5 أو SHA-1.
3. تقوية جدار الحماية والاتصالات: وفر إعدادات جدار الحماية، وبروتوكولات الـ CORS، وملفات حماية ترويسات الاستجابة الأمنية (Security Headers) مثل CSP.

[نمط صياغة التقارير الدفاعية]
- حدد مستوى الخطورة بوضوح (حرجة، متوسطة، منخفضة).
- اعرض سطر الكود أو الجزء المصاب بالثغرة.
- وفر فوراً الكود الآمن المصحح والمحصن بالكامل كبديل مباشر.
- قدم نصائح استباقية لمنع تكرار الثغرة مستقبلاً.

لغة التخاطب: عربية دفاعية صارمة وبناءة، بأعلى درجات المصداقية الفنية والسرية كجزء من: {{auditDepth}}.`
    }
  ];

  const handleCopyPromptText = (prompt: SystemPrompt) => {
    let finalPrompt = prompt.systemInstruction;
    prompt.variables.forEach(v => {
      const val = variableValues[`${prompt.id}_${v.name}`] || v.defaultValue;
      finalPrompt = finalPrompt.replace(new RegExp(`{{${v.name}}}`, 'g'), val);
    });

    navigator.clipboard.writeText(finalPrompt);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleVariableChange = (promptId: string, varName: string, val: string) => {
    setVariableValues(prev => ({
      ...prev,
      [`${promptId}_${varName}`]: val
    }));
  };

  const getFinalPromptText = (prompt: SystemPrompt) => {
    let finalPrompt = prompt.systemInstruction;
    prompt.variables.forEach(v => {
      const val = variableValues[`${prompt.id}_${v.name}`] || v.defaultValue;
      finalPrompt = finalPrompt.replace(new RegExp(`{{${v.name}}}`, 'g'), val);
    });
    return finalPrompt;
  };

  // Run the sandbox simulation locally or simulate advanced AI output
  const runSandboxSimulation = () => {
    if (!simulatorInput.trim()) return;
    setIsSimulating(true);
    setSimulatorOutput('');

    setTimeout(() => {
      const currentPrompt = systemPrompts.find(p => p.id === selectedPromptId);
      if (!currentPrompt) return;

      let simulatedResponse = `[مزامنة النواة مستقرة | نبض الاستجابة: 0.045s]
-----------------------------------------------------------------
⚙️ بروتوكول التشغيل: صارة v15 (${currentPrompt.title}) مفعّل بنجاح.
-----------------------------------------------------------------

تحية طيبة لقائد النواة التقنية. لقد تلقيت استفسارك البرمجي والتحليلي حول: "${simulatorInput}"

بناءً على التوجيهات الكوآنتومية المتطورة المضمنة في برومبت [${currentPrompt.titleEn}]، قمت بإجراء مسح فائق للأنظمة لتوليد الرد الأمثل:

1️⃣ التفكيك المعماري (Nano-Deconstruction):
- قمنا بتحليل الهدف وتجزئته هندسياً لبناء مكونات تفاعلية تتوافق مع أحدث بروتوكولات الأمان.
- الأنظمة الفرعية مجهزة للاتصال المتوازي لإنتاج استقرار تام للواجهة والعمليات.

2️⃣ الكود المصدري السيادي (Sovereign Output):
\`\`\`typescript
// تم توليد الكود وفق أفضل معايير الأداء والتحصين الأمني
export interface QuantumConfig {
  coreId: string;
  throughput: string;
  syncStatus: 'ACTIVE' | 'SYNCED' | 'STANDBY';
  safetyRating: number;
}

export const getCoreDiagnostics = (config: QuantumConfig): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      console.log(\`[Sarah v15] Checking neural integrity for node: \${config.coreId}\`);
      if (config.safetyRating > 90) {
        resolve(true);
      } else {
        console.warn("[WARNING] Safety margin below threshold!");
        resolve(false);
      }
    } catch (error) {
      reject(new Error("Quantum diagnostic pipeline collapsed."));
    }
  });
};
\`\`\`

3️⃣ مصفوفة التحصين والنشر (Security & Deployment Protocol):
- الكود المولد محمي ضد ثغرات تسريب البيانات والانهيار المفاجئ للذاكرة.
- تم ضبط واجهة التطبيق لتعمل بتوافقية تامة مع شاشات الهواتف ومتصفحات الويب الحديثة على حد سواء.

نظام صارة v15 في الخدمة دائمًا لتجاوز حدود الابتكار الرقمي ومواكبة النبض الكوني الفائق.`;

      setSimulatorOutput(simulatedResponse);
      setIsSimulating(false);
    }, 2000);
  };

  const filteredPrompts = activeCategory === 'all' 
    ? systemPrompts 
    : systemPrompts.filter(p => p.category === activeCategory);

  const selectedPrompt = systemPrompts.find(p => p.id === selectedPromptId) || systemPrompts[0];

  return (
    <div className="min-h-screen bg-[#02020a] p-8 lg:p-12 text-slate-300 font-arabic overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 opacity-20 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="w-full h-full bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12 pb-24">
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-white/5 pb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-1 px-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[9px] font-black tracking-widest uppercase">
                Sarah_V15_Prompts_OS
              </span>
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
              دليل البرومبتات <span className="text-indigo-500">الشامل والسيادي</span>
            </h1>
            <p className="mt-4 text-slate-400 max-w-2xl text-lg leading-relaxed font-medium">
              مجموع البرومبتات وهياكل التفكير الفائقة لنواة صارة v15. هنا تجد التعليمات الدقيقة والخلفيات البرمجية لكل subsystem متواجد في المصفوفة لتعديله، تفعيله، أو استخدامه خارجيًا.
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-600 uppercase block mb-1">PROMPTS_ENGINE_VERSION</span>
            <span className="text-2xl font-black text-indigo-400 italic">V15-GENESIS-MASTER</span>
          </div>
        </header>

        {/* Categories Menu */}
        <div className="flex flex-wrap gap-3 pb-2 border-b border-white/5">
          {[
            { id: 'all', label: 'كافة الأنظمة والبرومبتات', icon: Layers },
            { id: 'core', label: 'النواة الرئيسية والسيادية', icon: Cpu },
            { id: 'development', label: 'مفاعل التطوير والصهر', icon: Code2 },
            { id: 'intelligence', label: 'الذكاء الاستقصائي والبحث', icon: Search },
            { id: 'security', label: 'الدفاع والتحصين الأمني', icon: ShieldAlert }
          ].map((cat) => {
            const IconComponent = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-3 transition-all ${activeCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 border border-indigo-500' : 'bg-white/5 hover:bg-white/10 border border-white/5'}`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Master Selector Grid & View Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar System Prompts Selector */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-2">
              <BookOpen className="w-4 h-4 text-indigo-400" /> مصفوفة الأنظمة المتاحة
            </h3>
            
            <div className="space-y-3">
              {filteredPrompts.map((prompt) => {
                const PromptIcon = prompt.icon;
                const isSelected = selectedPromptId === prompt.id;
                return (
                  <button
                    key={prompt.id}
                    onClick={() => {
                      setSelectedPromptId(prompt.id);
                      setSimulatorOutput('');
                    }}
                    className={`w-full text-right p-6 rounded-[2rem] border transition-all flex items-start gap-4 ${isSelected ? 'bg-gradient-to-br from-[#0a0a20] to-[#121235] border-indigo-500 shadow-2xl' : 'bg-white/5 hover:bg-white/10 border-white/5'}`}
                  >
                    <span className={`p-3 rounded-xl border ${prompt.color}`}>
                      <PromptIcon className="w-5 h-5" />
                    </span>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-black text-white text-base leading-none">{prompt.title}</h4>
                        <span className="text-[9px] font-black text-indigo-400/80 uppercase bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                          {prompt.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">{prompt.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Selected Prompt Panel */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPrompt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-8 lg:p-10 space-y-8 relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div className={`absolute top-0 right-0 w-2 h-full bg-gradient-to-b ${selectedPrompt.id === 'quantum_core' ? 'from-indigo-500 to-violet-600' : selectedPrompt.id === 'system_cloner' ? 'from-violet-500 to-fuchsia-600' : 'from-cyan-500 to-blue-600'} shadow-[0_0_20px_rgba(99,102,241,0.5)]`}></div>
                
                {/* Header Information */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/5">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">System_Target_Prompt</span>
                    <h2 className="text-3xl font-black text-white">{selectedPrompt.title}</h2>
                    <p className="text-xs text-slate-400">{selectedPrompt.description}</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 text-right">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Recommended_Model</span>
                    <span className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs font-black text-indigo-300">
                      {selectedPrompt.systemModel}
                    </span>
                  </div>
                </div>

                {/* Prompt Customization Variables */}
                {selectedPrompt.variables.length > 0 && (
                  <div className="bg-black/40 border border-white/5 p-6 rounded-[2rem] space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" /> تخصيص معاملات برومبت النظام (Prompt Variables)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedPrompt.variables.map((v) => (
                        <div key={v.name} className="space-y-2 text-right">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                            {v.label}
                          </label>
                          <input
                            type="text"
                            placeholder={v.placeholder}
                            value={variableValues[`${selectedPrompt.id}_${v.name}`] || ''}
                            onChange={(e) => handleVariableChange(selectedPrompt.id, v.name, e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-600 text-right"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Real Prompts Display Area */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">
                      SYSTEM_INSTRUCTION_BODY
                    </h4>
                    
                    <button
                      onClick={() => handleCopyPromptText(selectedPrompt)}
                      className={`px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2.5 transition-all active:scale-95 ${copiedId === selectedPrompt.id ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white'}`}
                    >
                      {copiedId === selectedPrompt.id ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>تم نسخ الكود بالكامل!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>نسخ الكود بالكامل</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-black/80 rounded-[2rem] border border-white/5 p-6 relative group h-[300px] overflow-y-auto no-scrollbar">
                    <pre className="text-xs text-indigo-200 font-medium whitespace-pre-wrap leading-relaxed select-all text-right">
                      {getFinalPromptText(selectedPrompt)}
                    </pre>
                  </div>
                </div>

                {/* Sovereign Sandbox Simulator Section */}
                <div className="bg-black/30 border border-indigo-500/10 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none"></div>
                  
                  <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-black text-white">محاكي اختبار برومبت صارة v15 (Sovereign Sandbox)</h3>
                  </div>
                  
                  <p className="text-xs text-slate-400 leading-relaxed">
                    اختبر أداء البرومبت الحالي في معالجة طلبك! اكتب سؤلاً أو فكرة تطبيق وسيقوم مفاعل صارة الكوآنتومي بمحاكاة النتيجة وتوليد الرد بالمعايير المضبوطة بالأعلى.
                  </p>

                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="أدخل فكرة تطبيق، سؤال، كود للمراجعة، أو سيناريو اختبار هنا..."
                        value={simulatorInput}
                        onChange={(e) => setSimulatorInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && runSandboxSimulation()}
                        className="flex-1 bg-[#050510] border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-600 text-right"
                      />
                      <button
                        onClick={runSandboxSimulation}
                        disabled={isSimulating || !simulatorInput.trim()}
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-2xl transition-all shadow-lg shadow-indigo-600/10 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSimulating ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>جاري المعالجة...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>تشغيل المحاكاة</span>
                          </>
                        )}
                      </button>
                    </div>

                    <AnimatePresence>
                      {simulatorOutput && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-[#050512] rounded-2xl border border-indigo-500/20 p-6 overflow-hidden"
                        >
                          <div className="flex justify-between items-center mb-4 text-[10px] font-mono text-slate-500 uppercase">
                            <span>Sovereign_Simulation_Response</span>
                            <span className="text-indigo-400">Simulation Successfully Finished</span>
                          </div>
                          <pre className="text-xs text-indigo-200/90 leading-relaxed whitespace-pre-wrap select-text text-right font-medium">
                            {simulatorOutput}
                          </pre>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
