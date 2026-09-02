import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Code2, 
  Terminal, 
  Sliders, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Layers, 
  Play, 
  Eye, 
  FileCode, 
  Cpu, 
  Sparkles, 
  RotateCw, 
  Plus, 
  Check, 
  AlertTriangle, 
  ExternalLink, 
  Settings2, 
  Bot, 
  Flame, 
  Radio, 
  Copy,
  Server,
  ArrowRight,
  RefreshCcw,
  Compass,
  FileCheck,
  Power
} from 'lucide-react';
import { SiteNode, SiteFile, StrategicSiteAction, Language } from '../types';

interface StrategicSiteAgentProps {
  language: Language;
  onNavigate?: (tab: any) => void;
}

export const StrategicSiteAgent: React.FC<StrategicSiteAgentProps> = ({ language }) => {
  // Initial Sites Managed by the Strategic Agent
  const [sites, setSites] = useState<SiteNode[]>([
    {
      id: 'site-portal-01',
      name: 'بوابة السيادة المركزية (Sovereign Portal)',
      slug: 'portal.internal',
      category: 'portal',
      status: 'active',
      internalPort: 8080,
      healthScore: 99.4,
      trafficRPS: 1420,
      description: 'البوابة الرئيسية لإدارة الموارد السيادية والتحكم بالمصادقة العصبونية الموحدة.',
      sslState: 'quantum_tls',
      lastModified: 'منذ دقيقتين',
      routes: [
        { path: '/', handler: 'MainGateHandler', isProtected: false },
        { path: '/dashboard', handler: 'NeuralHubController', isProtected: true },
        { path: '/auth/sso', handler: 'SovereignAuthNode', isProtected: true },
        { path: '/api/v1/metrics', handler: 'LiveMetricsEndpoint', isProtected: true }
      ],
      codeFiles: [
        {
          name: 'index.html',
          path: '/src/index.html',
          language: 'html',
          content: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>بوابة السيادة المركزية | Sovereign Portal</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @keyframes glow { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; filter: drop-shadow(0 0 15px #10b981); } }
    .pulse-glow { animation: glow 3s infinite; }
  </style>
</head>
<body class="bg-[#020611] text-white font-sans min-h-screen flex flex-col justify-between p-8">
  <header class="flex justify-between items-center border-b border-emerald-500/30 pb-6">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(16,185,129,0.4)]">
        🌐
      </div>
      <div>
        <h1 class="text-2xl font-black tracking-tight text-white">بوابة السيادة المركزية</h1>
        <p class="text-xs text-emerald-400 font-mono">NODE-ID: SOVEREIGN-CORE-ALPHA</p>
      </div>
    </div>
    <div class="flex gap-2">
      <span class="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-mono">PORT: 8080</span>
      <span class="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full text-xs font-bold">حالة العقدة: متصلة ونشطة</span>
    </div>
  </header>

  <main class="my-12 max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-[#07132c] border border-emerald-500/20 p-6 rounded-3xl space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-bold text-white">حالة الخوادم الداخلية</h2>
        <span class="text-emerald-400 text-xs font-mono">99.98% Uptime</span>
      </div>
      <p class="text-xs text-slate-300 leading-relaxed">
        يتم إدارة وتوجيه الحزم وتأمين الوصول عبر الوكيل الاستراتيجي بنمط العزل التام وبتردد توافق 528Hz.
      </p>
      <div class="h-2 bg-black rounded-full overflow-hidden">
        <div class="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full w-[94%]"></div>
      </div>
    </div>

    <div class="bg-[#07132c] border border-cyan-500/20 p-6 rounded-3xl space-y-4">
      <h2 class="text-lg font-bold text-white">المسارات المحمية</h2>
      <ul class="text-xs space-y-2 text-slate-300 font-mono">
        <li class="flex justify-between border-b border-white/5 pb-1"><span>/dashboard</span> <span class="text-emerald-400">مؤمنة</span></li>
        <li class="flex justify-between border-b border-white/5 pb-1"><span>/auth/sso</span> <span class="text-emerald-400">تشفير كوانتومي</span></li>
        <li class="flex justify-between"><span>/api/v1/metrics</span> <span class="text-cyan-400">نشطة (1420 RPS)</span></li>
      </ul>
    </div>
  </main>

  <footer class="border-t border-white/10 pt-4 flex justify-between text-xs text-slate-500 font-mono">
    <span>النظام الداخلي الخاضع للوكيل الاستراتيجي</span>
    <span>Autonomous Web Orchestration v2.5</span>
  </footer>
</body>
</html>`
        },
        {
          name: 'router.config.json',
          path: '/config/router.json',
          language: 'json',
          content: JSON.stringify({
            host: 'portal.internal',
            internalPort: 8080,
            rateLimitRps: 2500,
            tlsMode: 'Strict_Quantum_AES256',
            failoverNode: 'backup-portal-02.internal'
          }, null, 2)
        }
      ]
    },
    {
      id: 'site-edge-02',
      name: 'لوحة القيادة السريعة (Edge Dashboard)',
      slug: 'edge.internal',
      category: 'dashboard',
      status: 'active',
      internalPort: 8081,
      healthScore: 98.7,
      trafficRPS: 980,
      description: 'لوحة بيانات لحظية ورصد فوري للمقاييس وحركة المرور بين العقد والشبكات.',
      sslState: 'strict_aes',
      lastModified: 'منذ 10 دقائق',
      routes: [
        { path: '/', handler: 'TelemetryView', isProtected: true },
        { path: '/live-charts', handler: 'D3StreamPipeline', isProtected: true },
        { path: '/alerts', handler: 'SecOpsDispatcher', isProtected: true }
      ],
      codeFiles: [
        {
          name: 'index.html',
          path: '/src/index.html',
          language: 'html',
          content: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>Edge Analytics Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#020814] text-white p-6 font-mono">
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex justify-between items-center border-b border-cyan-500/30 pb-4">
      <h1 class="text-xl font-black text-cyan-400">⚡ رادار التحليلات اللحظية (Edge Node)</h1>
      <span class="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-xs">Port 8081</span>
    </div>
    <div class="grid grid-cols-3 gap-4 text-center">
      <div class="bg-black/50 p-4 rounded-2xl border border-cyan-500/20">
        <div class="text-slate-400 text-xs">معدل الاستجابة</div>
        <div class="text-2xl font-black text-emerald-400">1.8 ms</div>
      </div>
      <div class="bg-black/50 p-4 rounded-2xl border border-cyan-500/20">
        <div class="text-slate-400 text-xs">الحزم الممررة</div>
        <div class="text-2xl font-black text-cyan-400">4.8 GB/s</div>
      </div>
      <div class="bg-black/50 p-4 rounded-2xl border border-cyan-500/20">
        <div class="text-slate-400 text-xs">نسبة العزل</div>
        <div class="text-2xl font-black text-indigo-400">100%</div>
      </div>
    </div>
  </div>
</body>
</html>`
        }
      ]
    },
    {
      id: 'site-nexus-03',
      name: 'بوابة متجر الخدمات والواجهات (Nexus API Gateway)',
      slug: 'api-nexus.internal',
      category: 'api_gateway',
      status: 'active',
      internalPort: 8082,
      healthScore: 99.9,
      trafficRPS: 3200,
      description: 'نقطة الربط المركزية وتوجيه استدعاءات نماذج الذكاء الاصطناعي وتوزيع الأحمال.',
      sslState: 'quantum_tls',
      lastModified: 'منذ نصف ساعة',
      routes: [
        { path: '/v1/generate', handler: 'GeminiNeuralProxy', isProtected: true },
        { path: '/v1/models', handler: 'ModelCatalogueService', isProtected: false },
        { path: '/v1/health', handler: 'HealthProbe', isProtected: false }
      ],
      codeFiles: [
        {
          name: 'gateway.js',
          path: '/src/gateway.js',
          language: 'javascript',
          content: `// Sovereign API Gateway Controller
export const gatewayConfig = {
  version: "v2.5",
  upstream: "http://core-engine.internal:3000",
  middleware: ["QuantumAuthGuard", "TrafficThrottler", "AuditLogger"]
};`
        }
      ]
    }
  ]);

  // Selected Site & Navigation
  const [selectedSiteId, setSelectedSiteId] = useState<string>('site-portal-01');
  const [activeSubTab, setActiveSubTab] = useState<'sites_grid' | 'code_synthesizer' | 'routes_control' | 'strategic_cli' | 'live_preview'>('sites_grid');
  
  // Code Editor State
  const selectedSite = sites.find(s => s.id === selectedSiteId) || sites[0];
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [editorContent, setEditorContent] = useState<string>(selectedSite.codeFiles[0]?.content || '');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>('');

  // Auto Pilot Mode & Strategic Actions Log
  const [autoPilot, setAutoPilot] = useState<boolean>(true);
  const [actionLogs, setActionLogs] = useState<StrategicSiteAction[]>([
    {
      id: 'ACT-01',
      action: 'إعادة بناء كود بوابة السيادة وإضافة تحسينات الأمان الصارم',
      targetSiteId: 'site-portal-01',
      agentRole: 'Site Architect',
      status: 'executed',
      impact: 'تسريع التحميل بنسبة 45% وتأمين جميع مسارات التوجيه',
      timestamp: '10:14:22'
    },
    {
      id: 'ACT-02',
      action: 'تفعيل موازنة الأحمال على بوابة Nexus وتوزيع حركة المرور على 4 خيوط',
      targetSiteId: 'site-nexus-03',
      agentRole: 'Traffic Strategist',
      status: 'executed',
      impact: 'استيعاب ما يزيد عن 3200 طلب في الثانية دون أي تباطؤ',
      timestamp: '10:20:05'
    },
    {
      id: 'ACT-03',
      action: 'إنشاء شهادة عزل TLS مخصصة للوحة القيادة السريعة Edge Dashboard',
      targetSiteId: 'site-edge-02',
      agentRole: 'Security Warden',
      status: 'executed',
      impact: 'منع هجمات التداخل وتأمين الاتصالات المشفرة داخلياً',
      timestamp: '10:28:40'
    }
  ]);

  // Terminal CLI
  const [cliInput, setCliInput] = useState<string>('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    '⭐ Sovereign Strategic Site Agent v2.5 initialized.',
    '📡 All 3 internal site nodes are connected and operating under strict telemetry.',
    '⚡ Auto-pilot mode: ACTIVE (Continuous site code verification & traffic optimization).'
  ]);

  // Sync editor content when changing file or site
  useEffect(() => {
    if (selectedSite && selectedSite.codeFiles[selectedFileIndex]) {
      setEditorContent(selectedSite.codeFiles[selectedFileIndex].content);
    }
  }, [selectedSiteId, selectedFileIndex]);

  // Toggle Site Status (Active / Standby / Isolated)
  const handleToggleSiteStatus = (siteId: string) => {
    setSites(prev => prev.map(s => {
      if (s.id === siteId) {
        const nextStatus = s.status === 'active' ? 'isolated' : 'active';
        // Add log
        const newLog: StrategicSiteAction = {
          id: `ACT-${Date.now().toString().slice(-4)}`,
          action: `تغيير حالة الموقع (${s.name}) إلى: ${nextStatus === 'active' ? 'نشط' : 'معزول أمنياً'}`,
          targetSiteId: s.id,
          agentRole: 'Security Warden',
          status: 'executed',
          impact: nextStatus === 'active' ? 'إعادة استئناف توجيه المسارات' : 'قطع الاتصال الخارجي وعزل العقدة لحمايتها',
          timestamp: new Date().toLocaleTimeString('ar-SA')
        };
        setActionLogs(prevLogs => [newLog, ...prevLogs]);
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  // Add New Internal Site
  const handleCreateNewSite = () => {
    const newId = `site-custom-${Date.now().toString().slice(-4)}`;
    const port = 8080 + sites.length;
    const newSite: SiteNode = {
      id: newId,
      name: `موقع المحطة الفرعية ${sites.length + 1} (Sub-Station Node)`,
      slug: `station-${sites.length + 1}.internal`,
      category: 'landing',
      status: 'active',
      internalPort: port,
      healthScore: 100,
      trafficRPS: 120,
      description: 'موقع فرعي داخلي تم إنشاؤه وضبط توجيهه ذاتياً عبر الوكيل الاستراتيجي.',
      sslState: 'quantum_tls',
      lastModified: 'الآن',
      routes: [
        { path: '/', handler: 'StationMain', isProtected: false },
        { path: '/status', handler: 'StationHealthCheck', isProtected: false }
      ],
      codeFiles: [
        {
          name: 'index.html',
          path: '/src/index.html',
          language: 'html',
          content: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>Sub-Station ${sites.length + 1}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#040c1f] text-white p-8 font-sans">
  <div class="max-w-2xl mx-auto border border-emerald-500/30 p-8 rounded-3xl bg-black/60 text-center space-y-4">
    <h1 class="text-2xl font-black text-emerald-400">🚀 محطة الموقع الداخلي الجديد #${sites.length + 1}</h1>
    <p class="text-xs text-slate-300">تم نشر وهندسة هذا الموقع داخلياً بواسطة الوكيل الاستراتيجي السيادي.</p>
    <div class="text-xs text-cyan-300 font-mono">Port: ${port} | Status: Healthy</div>
  </div>
</body>
</html>`
        }
      ]
    };

    setSites(prev => [...prev, newSite]);
    setSelectedSiteId(newId);
    setSelectedFileIndex(0);

    const log: StrategicSiteAction = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      action: `توليد وتدشين موقع داخلي جديد: ${newSite.name}`,
      targetSiteId: newId,
      agentRole: 'Site Architect',
      status: 'executed',
      impact: `فتح المنفذ الداخلي ${port} وتعيين مسارات الوصول الآمنة`,
      timestamp: new Date().toLocaleTimeString('ar-SA')
    };
    setActionLogs(prev => [log, ...prev]);
  };

  // AI Strategic Code Synthesizer (الوكيل يكتب ويعدل الأكواد)
  const handleSynthesizeSiteCode = () => {
    if (!aiPrompt.trim()) return;
    setIsSynthesizing(true);

    setTimeout(() => {
      let generatedHTML = editorContent;

      if (aiPrompt.toLowerCase().includes('dark') || aiPrompt.includes('أمان') || aiPrompt.includes('حماية')) {
        generatedHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${selectedSite.name} - درع الأمان</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#02040a] text-white p-8 font-sans min-h-screen flex flex-col justify-between">
  <div class="max-w-3xl mx-auto w-full bg-[#070e1c] border-2 border-emerald-500/50 p-8 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.3)] space-y-6">
    <div class="flex items-center justify-between border-b border-emerald-500/20 pb-4">
      <div class="flex items-center gap-3">
        <span class="text-3xl">🛡️</span>
        <div>
          <h1 class="text-xl font-black text-emerald-400">${selectedSite.name}</h1>
          <p class="text-xs text-slate-400 font-mono">وضع الحماية القصوى والتحصين الداخلي</p>
        </div>
      </div>
      <span class="px-3 py-1 bg-emerald-500 text-black font-black text-xs rounded-full">محصن كوانتومياً</span>
    </div>
    
    <div class="grid grid-cols-2 gap-4 text-xs">
      <div class="bg-black/60 p-4 rounded-2xl border border-white/5 space-y-1">
        <div class="text-slate-400 font-bold">تشفير القنوات:</div>
        <div class="text-emerald-300 font-mono">Quantum-AES 256-GCM</div>
      </div>
      <div class="bg-black/60 p-4 rounded-2xl border border-white/5 space-y-1">
        <div class="text-slate-400 font-bold">زمن الاستجابة:</div>
        <div class="text-cyan-300 font-mono">0.8 ms (Zero Lag)</div>
      </div>
    </div>

    <p class="text-xs text-slate-300 leading-relaxed">
      تمت إعادة كتابة وتوليد كود هذا الموقع استراتيجياً لتطبيق أعلى معايير العزل ومنع تسريب أي حزم أو ترويسات حساسة.
    </p>

    <div class="pt-2 flex justify-end">
      <button class="px-6 py-2.5 bg-emerald-500 text-black font-black text-xs rounded-xl shadow-lg hover:bg-emerald-400 transition-all">
        تأكيد ترقية المنظومة
      </button>
    </div>
  </div>
</body>
</html>`;
      } else {
        generatedHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${selectedSite.name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-[#030919] via-[#05132e] to-[#02050e] text-white p-8 font-sans min-h-screen">
  <div class="max-w-4xl mx-auto space-y-8">
    <header class="flex justify-between items-center border-b border-cyan-500/30 pb-6">
      <div>
        <span class="text-xs font-mono text-cyan-400 uppercase tracking-wider">Strategic Site Agent v2.5</span>
        <h1 class="text-3xl font-black text-white mt-1">${selectedSite.name}</h1>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 bg-emerald-400 rounded-full animate-ping"></span>
        <span class="text-xs font-mono text-emerald-300">Live & Synced</span>
      </div>
    </header>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white/5 backdrop-blur-xl border border-cyan-500/20 p-6 rounded-3xl">
        <div class="text-2xl mb-2">⚡</div>
        <h3 class="text-sm font-bold text-white mb-1">سرعة فائقة</h3>
        <p class="text-xs text-slate-400 leading-relaxed">معالجة فورية للمسارات مع تقليل استهلاك الموارد بنسبة 60%.</p>
      </div>

      <div class="bg-white/5 backdrop-blur-xl border border-emerald-500/20 p-6 rounded-3xl">
        <div class="text-2xl mb-2">🔒</div>
        <h3 class="text-sm font-bold text-white mb-1">عزل تام</h3>
        <p class="text-xs text-slate-400 leading-relaxed">جدار حماية مدمج يمنع أي استدعاءات خارجية غير مصادق عليها.</p>
      </div>

      <div class="bg-white/5 backdrop-blur-xl border border-indigo-500/20 p-6 rounded-3xl">
        <div class="text-2xl mb-2">🧠</div>
        <h3 class="text-sm font-bold text-white mb-1">إشراف ذكي</h3>
        <p class="text-xs text-slate-400 leading-relaxed">توليد وصيانة ذاتية للشيفرات البرمجية وفق أوامر الوكيل.</p>
      </div>
    </section>

    <div class="bg-black/60 border border-white/10 p-6 rounded-3xl space-y-3">
      <h4 class="text-sm font-bold text-white">توجيهات الوكيل المنفذة:</h4>
      <p class="text-xs text-cyan-300 font-mono">"${aiPrompt}"</p>
    </div>
  </div>
</body>
</html>`;
      }

      setEditorContent(generatedHTML);
      
      // Update the site object
      setSites(prev => prev.map(s => {
        if (s.id === selectedSite.id) {
          const updatedFiles = [...s.codeFiles];
          if (updatedFiles[selectedFileIndex]) {
            updatedFiles[selectedFileIndex].content = generatedHTML;
          }
          return { ...s, codeFiles: updatedFiles, lastModified: 'تم التحديث بواسطة الوكيل الآن' };
        }
        return s;
      }));

      // Add log
      const actionLog: StrategicSiteAction = {
        id: `ACT-${Date.now().toString().slice(-4)}`,
        action: `إعادة كتابة وتوليد شيفرات (${selectedSite.name}) وفق التوجيه: "${aiPrompt.slice(0, 35)}..."`,
        targetSiteId: selectedSite.id,
        agentRole: 'Code Synthesizer',
        status: 'executed',
        impact: 'تحديث فوري لملف index.html ومعاينة التغييرات الحية',
        timestamp: new Date().toLocaleTimeString('ar-SA')
      };
      setActionLogs(prev => [actionLog, ...prev]);

      setIsSynthesizing(false);
      setAiPrompt('');
    }, 1100);
  };

  // Execute CLI Command
  const handleExecuteCli = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;

    const cmd = cliInput.trim();
    const newHistory = [...terminalHistory, `> ${cmd}`];

    if (cmd.startsWith('site.deploy')) {
      newHistory.push(`[OK] Deploying site node (${selectedSite.slug}) to internal cluster... DONE.`);
      newHistory.push(`[OK] Routes propagated across all virtual adapters.`);
    } else if (cmd.startsWith('site.harden')) {
      newHistory.push(`[OK] Strict Content Security Policy (CSP) & Quantum TLS enforced on ${selectedSite.name}.`);
    } else if (cmd.startsWith('site.routes.add')) {
      newHistory.push(`[OK] Route registered into internal routing table.`);
    } else if (cmd.startsWith('site.status')) {
      newHistory.push(`[INFO] Active Sites: ${sites.length} | Healthy: ${sites.filter(s=>s.status==='active').length} | Isolated: ${sites.filter(s=>s.status==='isolated').length}`);
    } else {
      newHistory.push(`[AGENT] Strategic agent analyzed and dispatched command: "${cmd}".`);
      newHistory.push(`[OK] Execution finished successfully.`);
    }

    setTerminalHistory(newHistory);
    setCliInput('');
  };

  // Add Route to selected site
  const handleAddRoute = () => {
    const newRoutePath = `/node-v${selectedSite.routes.length + 1}`;
    const newRoute = {
      path: newRoutePath,
      handler: `AutoServiceHandler_v${selectedSite.routes.length + 1}`,
      isProtected: true
    };

    setSites(prev => prev.map(s => {
      if (s.id === selectedSite.id) {
        return {
          ...s,
          routes: [...s.routes, newRoute],
          lastModified: 'تمت إضافة مسار جديد'
        };
      }
      return s;
    }));

    const log: StrategicSiteAction = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      action: `إضافة وتوجيه مسار جديد (${newRoutePath}) في موقع ${selectedSite.name}`,
      targetSiteId: selectedSite.id,
      agentRole: 'Traffic Strategist',
      status: 'executed',
      impact: 'توسيع قدرة الموقع وتوجيه حركة المرور داخلياً',
      timestamp: new Date().toLocaleTimeString('ar-SA')
    };
    setActionLogs(prev => [log, ...prev]);
  };

  return (
    <div className="h-full w-full bg-[#02050f] text-white flex flex-col overflow-hidden font-arabic select-none">
      
      {/* Top Controller HUD */}
      <header className="bg-[#050e24] border-b border-emerald-500/20 px-6 py-4 flex flex-wrap items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-cyan-600 border border-emerald-400/40 flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)]">
            🌐
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white">الوكيل الاستراتيجي لإدارة وهندسة المواقع داخلياً</h1>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono font-black">
                Autonomous Site Controller
              </span>
            </div>
            <p className="text-xs text-slate-400">
              نظام وكيل ذكي مستقل يكتب، يولد، ويدير منظومة المواقع والعقد الداخلية وشبكات التوجيه في الوقت الفعلي
            </p>
          </div>
        </div>

        {/* Global HUD Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-black/60 border border-white/5 px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2">
            <span className="text-slate-400">المواقع النشطة:</span>
            <span className="text-emerald-400 font-black">{sites.filter(s => s.status === 'active').length} / {sites.length}</span>
          </div>

          <div className="bg-black/60 border border-white/5 px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2">
            <span className="text-slate-400">إجمالي الـ RPS:</span>
            <span className="text-cyan-400 font-black">{sites.reduce((acc, s) => acc + s.trafficRPS, 0)}</span>
          </div>

          {/* Auto-Pilot Toggle */}
          <button
            onClick={() => setAutoPilot(!autoPilot)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              autoPilot 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>الطيار الاستراتيجي المستقل: {autoPilot ? 'نشط' : 'يدوي'}</span>
          </button>
        </div>
      </header>

      {/* Main Navigation Sub-Bar */}
      <div className="bg-[#030919] px-6 py-2 border-b border-white/5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveSubTab('sites_grid')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeSubTab === 'sites_grid'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>مصفوفة المواقع الداخلية ({sites.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('code_synthesizer')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeSubTab === 'code_synthesizer'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>المؤلف البرمجي للوكيل (Code Synthesizer)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('routes_control')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeSubTab === 'routes_control'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>توجيه المسارات والـ Traffic</span>
          </button>

          <button
            onClick={() => setActiveSubTab('live_preview')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeSubTab === 'live_preview'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>المعاينة التفاعلية الحية</span>
          </button>

          <button
            onClick={() => setActiveSubTab('strategic_cli')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeSubTab === 'strategic_cli'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>الموجه الاستراتيجي (Agent CLI)</span>
          </button>
        </div>

        {/* Selected Site Selector Chip */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold">الموقع المستهدف:</span>
          <select
            value={selectedSiteId}
            onChange={(e) => {
              setSelectedSiteId(e.target.value);
              setSelectedFileIndex(0);
            }}
            className="bg-[#08122c] text-emerald-300 border border-emerald-500/30 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none"
          >
            {sites.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.slug})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden p-6">
        
        {/* SUBTAB 1: Internal Sites Grid Matrix */}
        {activeSubTab === 'sites_grid' && (
          <div className="h-full flex flex-col gap-6 overflow-y-auto custom-scrollbar">
            
            {/* Action Bar */}
            <div className="flex justify-between items-center bg-[#071129] p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>إجمالي العقد والمواقع المدارة ذاتياً في البيئة الداخلية السيادية:</span>
              </div>

              <button
                onClick={handleCreateNewSite}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>تدشين موقع داخلي جديد فورياً</span>
              </button>
            </div>

            {/* Sites Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sites.map(site => {
                const isCurrent = site.id === selectedSiteId;
                return (
                  <div
                    key={site.id}
                    className={`bg-[#050e24] rounded-3xl border p-5 flex flex-col justify-between transition-all relative overflow-hidden group ${
                      isCurrent
                        ? 'border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Top Status */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            PORT: {site.internalPort}
                          </span>
                          <h3 className="text-base font-black text-white mt-1">{site.name}</h3>
                          <p className="text-xs text-cyan-300 font-mono">{site.slug}</p>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase font-mono ${
                          site.status === 'active' 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}>
                          {site.status === 'active' ? 'نشط' : 'معزول'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {site.description}
                      </p>

                      {/* Site Metrics */}
                      <div className="bg-black/50 p-3 rounded-2xl border border-white/5 grid grid-cols-3 gap-2 text-center text-xs">
                        <div>
                          <div className="text-[10px] text-slate-500">الصحة</div>
                          <div className="font-mono font-black text-emerald-400">{site.healthScore}%</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500">حركة المرور</div>
                          <div className="font-mono font-black text-cyan-400">{site.trafficRPS} RPS</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500">المسارات</div>
                          <div className="font-mono font-black text-indigo-400">{site.routes.length}</div>
                        </div>
                      </div>
                    </div>

                    {/* Site Card Actions */}
                    <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setSelectedSiteId(site.id);
                          setActiveSubTab('code_synthesizer');
                        }}
                        className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>فتح الكود</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedSiteId(site.id);
                          setActiveSubTab('live_preview');
                        }}
                        className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>معاينة حية</span>
                      </button>

                      <button
                        onClick={() => handleToggleSiteStatus(site.id)}
                        className={`p-1.5 rounded-xl border transition-all ${
                          site.status === 'active'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                        }`}
                        title={site.status === 'active' ? 'عزل الموقع' : 'تفعيل الموقع'}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Strategic Action Logs Section */}
            <div className="bg-[#050e24] rounded-3xl border border-white/10 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-black text-white">سجل العمليات الاستراتيجية المنفذة ذاتياً</h3>
                </div>
                <span className="text-xs text-slate-500 font-mono">Autonomous Action History</span>
              </div>

              <div className="space-y-2">
                {actionLogs.map((log) => (
                  <div key={log.id} className="bg-black/50 p-3 rounded-2xl border border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <div>
                        <span className="font-bold text-white">{log.action}</span>
                        <div className="text-[11px] text-emerald-300 font-mono mt-0.5">
                          <span className="text-slate-400">الأثر:</span> {log.impact}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                      <span className="px-2 py-0.5 bg-white/5 rounded-md text-cyan-300 font-bold">{log.agentRole}</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* SUBTAB 2: AI Code Synthesizer & Multi-file Editor */}
        {activeSubTab === 'code_synthesizer' && (
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left AI Directives & Prompts */}
            <div className="bg-[#050e24] rounded-3xl border border-white/10 p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-black text-white">المؤلف البرمجي الذكي للوكيل</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  اطلب من الوكيل إعادة بناء صفحات الموقع، إضافة أقسام متطورة، أو إعادة هيكلة منطق التوجيه والأمان فوراً:
                </p>

                {/* Prompt Box */}
                <div className="space-y-2">
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="مثال: أعد كتابة كود الموقع ليكون لوحة تحكم أمنية فائقة السرعة مع تشديد بروتوكولات العزل ومؤشرات الأداء..."
                    rows={4}
                    className="w-full bg-black/70 border border-emerald-500/30 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-sans"
                  />
                  <button
                    onClick={handleSynthesizeSiteCode}
                    disabled={isSynthesizing || !aiPrompt.trim()}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {isSynthesizing ? (
                      <RefreshCcw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>{isSynthesizing ? 'جاري توليد وهندسة الكود...' : 'أمر الوكيل بتأليف الكود وإعادة البناء'}</span>
                  </button>
                </div>

                {/* Quick Directive Templates */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="text-xs text-slate-400 font-bold">توجيهات سريعة جاهزة:</div>
                  <div className="space-y-1.5">
                    {[
                      'تحويل التصميم إلى واجهة مظلمة سيادية مع درع أمان',
                      'إضافة بطاقات مراقبة المقاييس اللحظية مع مخططات تفاعلية',
                      'توليد صفحة هبوط ثورية للمنتج مع مؤثرات جمالية',
                      'تطبيق معايير CSP الصارمة وعزل الترويسات'
                    ].map((tpl, i) => (
                      <button
                        key={i}
                        onClick={() => setAiPrompt(tpl)}
                        className="w-full text-right p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-all truncate font-sans block"
                      >
                        ⚡ {tpl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Site Files List */}
              <div className="bg-black/60 p-3 rounded-2xl border border-white/5 space-y-2">
                <div className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ملفات الموقع النشطة:</span>
                </div>
                <div className="flex flex-col gap-1">
                  {selectedSite.codeFiles.map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedFileIndex(idx);
                        setEditorContent(file.content);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono text-right flex items-center justify-between transition-all ${
                        selectedFileIndex === idx
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{file.name}</span>
                      <span className="text-[10px] uppercase text-slate-500">{file.language}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Interactive Code Editor */}
            <div className="lg:col-span-2 bg-[#050e24] rounded-3xl border border-white/10 flex flex-col overflow-hidden">
              <div className="bg-[#07132c] px-4 py-3 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-xs text-slate-300 font-mono pr-2">
                    {selectedSite.slug} &gt; {selectedSite.codeFiles[selectedFileIndex]?.name || 'index.html'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSites(prev => prev.map(s => {
                        if (s.id === selectedSite.id) {
                          const updated = [...s.codeFiles];
                          if (updated[selectedFileIndex]) {
                            updated[selectedFileIndex].content = editorContent;
                          }
                          return { ...s, codeFiles: updated, lastModified: 'تم الحفظ يدوياً' };
                        }
                        return s;
                      }));
                    }}
                    className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-lg transition-all flex items-center gap-1"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>حفظ التعديلات</span>
                  </button>

                  <button
                    onClick={() => setActiveSubTab('live_preview')}
                    className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>معاينة فورية</span>
                  </button>
                </div>
              </div>

              {/* Textarea Code */}
              <div className="flex-1 p-4 bg-[#01040d]">
                <textarea
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  className="w-full h-full bg-transparent text-emerald-300 font-mono text-xs focus:outline-none resize-none custom-scrollbar leading-relaxed dir-ltr text-left"
                  spellCheck={false}
                />
              </div>

              {/* Editor Status Bar */}
              <div className="bg-[#030919] px-4 py-2 border-t border-white/5 flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Lines: {editorContent.split('\n').length} | Chars: {editorContent.length}</span>
                <span className="text-emerald-400">UTF-8 | Ready for Internal Execution</span>
              </div>
            </div>

          </div>
        )}

        {/* SUBTAB 3: Routes & Traffic Control */}
        {activeSubTab === 'routes_control' && (
          <div className="h-full flex flex-col gap-6 overflow-y-auto custom-scrollbar">
            <div className="bg-[#050e24] rounded-3xl border border-white/10 p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-black text-white">جدول توجيه المسارات وحركة المرور ({selectedSite.name})</h3>
                  <p className="text-xs text-slate-400 font-mono">Internal Routing Table & Gateway Dispatcher</p>
                </div>
                <button
                  onClick={handleAddRoute}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>تسجيل مسار داخلي جديد</span>
                </button>
              </div>

              {/* Routes Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-black/50 text-slate-400 border-b border-white/10 font-mono">
                    <tr>
                      <th className="p-3">المسار (Path)</th>
                      <th className="p-3">معالج النواة (Handler)</th>
                      <th className="p-3">مستوى الحماية</th>
                      <th className="p-3">معدل التدفق</th>
                      <th className="p-3">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {selectedSite.routes.map((route, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-all">
                        <td className="p-3 font-bold text-cyan-300">{route.path}</td>
                        <td className="p-3 text-slate-300">{route.handler}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            route.isProtected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-slate-400'
                          }`}>
                            {route.isProtected ? 'مؤمن / مصادق' : 'عام'}
                          </span>
                        </td>
                        <td className="p-3 text-emerald-400">{Math.floor(selectedSite.trafficRPS / (i + 1))} RPS</td>
                        <td className="p-3">
                          <button 
                            onClick={() => {
                              const newHistory = [...terminalHistory, `> site.ping ${selectedSite.slug}${route.path}`, `[OK] Route ping successful: 0.9ms latency.`];
                              setTerminalHistory(newHistory);
                              setActiveSubTab('strategic_cli');
                            }}
                            className="text-cyan-400 hover:underline font-bold text-[11px]"
                          >
                            اختبار المسار ↗
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: Live Interactive Preview */}
        {activeSubTab === 'live_preview' && (
          <div className="h-full flex flex-col bg-[#050e24] rounded-3xl border border-white/10 overflow-hidden">
            {/* Browser Header Bar */}
            <div className="bg-[#07132c] px-4 py-3 border-b border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              </div>

              {/* URL Bar */}
              <div className="flex-1 max-w-xl bg-black/70 border border-emerald-500/30 rounded-xl px-4 py-1.5 flex items-center justify-between text-xs font-mono text-emerald-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>https://{selectedSite.slug}:{selectedSite.internalPort}</span>
                </div>
                <span className="text-[10px] text-slate-500">SANDBOX_RENDER</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSubTab('code_synthesizer')}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 text-xs text-slate-300 rounded-lg transition-all flex items-center gap-1"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>تعديل الشيفرة</span>
                </button>
              </div>
            </div>

            {/* Sandbox Iframe */}
            <div className="flex-1 bg-black p-2">
              <iframe
                title="Internal Site Preview"
                srcDoc={selectedSite.codeFiles[0]?.content || editorContent}
                className="w-full h-full rounded-2xl border border-white/5 bg-white"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        )}

        {/* SUBTAB 5: Strategic Agent CLI Terminal */}
        {activeSubTab === 'strategic_cli' && (
          <div className="h-full bg-[#01040d] rounded-3xl border border-emerald-500/30 p-5 flex flex-col font-mono text-xs overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Terminal className="w-4 h-4" />
                <span>الموجه الاستراتيجي للنظام السيادي (Strategic Agent CLI)</span>
              </div>
              <button
                onClick={() => setTerminalHistory(['[CLEARED] Terminal reset.'])}
                className="text-[11px] text-slate-500 hover:text-slate-300 transition-all"
              >
                مسح الشاشة
              </button>
            </div>

            {/* History Console */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 dir-ltr text-left text-emerald-300 pr-2">
              {terminalHistory.map((line, idx) => (
                <div key={idx} className={line.startsWith('>') ? 'text-cyan-400 font-bold' : line.startsWith('[OK]') ? 'text-emerald-400' : 'text-slate-300'}>
                  {line}
                </div>
              ))}
            </div>

            {/* CLI Command Input */}
            <form onSubmit={handleExecuteCli} className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 dir-ltr">
              <span className="text-cyan-400 font-bold">agent@sovereign:~$</span>
              <input
                type="text"
                value={cliInput}
                onChange={(e) => setCliInput(e.target.value)}
                placeholder="site.deploy --node=core | site.harden | site.status | help"
                className="flex-1 bg-transparent text-emerald-300 focus:outline-none font-mono text-xs"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-lg transition-all"
              >
                تنفيذ
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
};
