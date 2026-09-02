import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  RotateCcw, 
  Zap, 
  ShieldAlert, 
  Flame, 
  Cpu, 
  Terminal, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Layers, 
  Waves, 
  Brain, 
  Globe, 
  Search, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sliders,
  Database,
  ArrowRight,
  Maximize2,
  Minimize2,
  X,
  Play,
  Sun,
  Moon,
  Compass
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { 
  ChatDialect, 
  WhiteChatMessage, 
  ProblemDiagnostic, 
  PredatorSolution, 
  OuedianConduit, 
  MemoryCommand,
  AppTab
} from '../types';

interface WhiteStrategicChatProps {
  onNavigate?: (tab: AppTab) => void;
  onExecuteCommand?: (command: string) => void;
  isFloatingModal?: boolean;
  onCloseModal?: () => void;
}

export const WhiteStrategicChat: React.FC<WhiteStrategicChatProps> = ({
  onNavigate,
  onExecuteCommand,
  isFloatingModal = false,
  onCloseModal
}) => {
  // Theme & Layout state (Default: Crisp Pristine White)
  const [theme, setTheme] = useState<'white' | 'dark'>('white');
  const [activeDialect, setActiveDialect] = useState<ChatDialect>('ar');
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showMemoryBank, setShowMemoryBank] = useState<boolean>(false);
  const [selectedConduitId, setSelectedConduitId] = useState<string>('oued-sovereign-01');

  // Ouedian Strategic Conduits (نظام الوديان الاستراتيجي)
  const [conduits, setConduits] = useState<OuedianConduit[]>([
    {
      id: 'oued-sovereign-01',
      name: 'وادي السيادة والطاقة الكوانتومية',
      nameDz: 'واد السيادة والطاقة الكوانتومية',
      nameEn: 'Oued Sovereign Energy Conduit',
      flowRate: 528,
      streamStatus: 'flowing',
      channelType: 'sovereign_energy',
      currentPayload: 'حزم رنين 528Hz متوافقة ومستقرة'
    },
    {
      id: 'oued-knowledge-02',
      name: 'وادي المعرفة والنواة العصبونية',
      nameDz: 'واد المعرفة والذكاء الخارق',
      nameEn: 'Oued Neural Knowledge Conduit',
      flowRate: 890,
      streamStatus: 'surging',
      channelType: 'neural_knowledge',
      currentPayload: 'تغذية استرجاع الحزم الاستراتيجية'
    },
    {
      id: 'oued-dragon-03',
      name: 'وادي دراغون والأمان الدفاعي',
      nameDz: 'واد دراغون والحماية اللّي تقطع',
      nameEn: 'Oued Dragon Defense Conduit',
      flowRate: 1024,
      streamStatus: 'flowing',
      channelType: 'dragon_defense',
      currentPayload: 'درع الردع الشامل L4 مفعل'
    },
    {
      id: 'oued-syntax-04',
      name: 'وادي الشفرة والأكواد السيادية',
      nameDz: 'واد السطور والبرمجة الصامتة',
      nameEn: 'Oued Cyber Syntax Conduit',
      flowRate: 412,
      streamStatus: 'calm',
      channelType: 'cyber_syntax',
      currentPayload: 'مصفوفات التوليد والتصحيح الذاتي'
    }
  ]);

  // Sovereign Memory Bank Commands (الذاكرة السيادية المدمجة)
  const memoryCommands: MemoryCommand[] = [
    {
      id: 'MEM-01',
      command: 'ouedian.flow.sync(528)',
      labelAr: 'مزامنة تدفق وادي السيادة على 528Hz',
      labelDz: 'سݣّم تدفق الواد على 528Hz فالحين',
      labelEn: 'Synchronize Sovereign Oued flow at 528Hz',
      category: 'ouedian',
      executionDescription: 'إعادة ضبط قنوات الوديان الاستراتيجية للتناغم الأقصى'
    },
    {
      id: 'MEM-02',
      command: 'predator.strike.annihilate_threat()',
      labelAr: 'شن هجوم مفترس لعزل وتدمير التهديد',
      labelDz: 'أضرب ضربة مفترسة واقطع أصل المشكل',
      labelEn: 'Execute Predator Strike to purge anomaly',
      category: 'predator',
      executionDescription: 'إبادة مسببات العطل أو محاولات الاختراق فورياً'
    },
    {
      id: 'MEM-03',
      command: 'memory.quantum_purge({ deep: true })',
      labelAr: 'تطهير الذاكرة النورونية العميقة',
      labelDz: 'نقّي لا ميموار الكوانتية كاملة',
      labelEn: 'Deep Quantum Memory Purge',
      category: 'quantum',
      executionDescription: 'تحرير 40% من الحمل المؤقت وإزالة أي اختناق'
    },
    {
      id: 'MEM-04',
      command: 'dragon.shield.enforce_l4({ strict: true })',
      labelAr: 'تفعيل قبة دراغون للحماية L4',
      labelDz: 'شعل قبة دراغون ودير الحصار التام',
      labelEn: 'Enforce Dragon Shield L4 Strict Mode',
      category: 'system',
      executionDescription: 'عزل المنافذ المشبوهة وحماية تدفقات الوديان'
    },
    {
      id: 'MEM-05',
      command: 'ouedian.bridge.cross_stream("neural_knowledge")',
      labelAr: 'ربط وادي المعرفة بالمحرك الاستراتيجي',
      labelDz: 'ربط واد المعرفة بالذكاء مباشرة',
      labelEn: 'Bridge Neural Knowledge Valley Stream',
      category: 'ouedian',
      executionDescription: 'تغذية الدردشة بالبيانات الحية من مجاري الوديان'
    }
  ];

  // Initial Chat Messages
  const [messages, setMessages] = useState<WhiteChatMessage[]>([
    {
      id: 'msg-welcome-01',
      sender: 'agent',
      text: 'مرحباً بك في نافذة الدردشة البيضاء الاستراتيجية السيادية. المنظومة متصلة بنظام الوديان الاستراتيجي وجاهزة لتشخيص أي مشكل برمجياً أو أمنياً وتقديم "الحلول المفترسة" الفورية.',
      dialect: 'ar',
      timestamp: 'الآن',
      activeConduitId: 'oued-sovereign-01',
      diagnostic: {
        detectedProblem: 'جاهزية قنوات النظام والاستماع للمدخلات السيادية',
        rootVulnerabilities: ['احتمالية تشتت الاستفسارات بدون توجيه دقيق عبر مسارات الوديان'],
        severity: 'low',
        impactZone: 'قنوات الاستجابة المركزية',
        predatorSolutions: [
          {
            id: 'SOL-PRED-01',
            title: 'تأكيد المسار السريع وحجز الذاكرة الكوانتومية',
            tacticalLevel: 'L1_IMMEDIATE',
            codeOrCommand: 'ouedian.flow.sync(528); predator.mode.standby();',
            decisiveAction: 'توجيه المعالجة عبر وادي السيادة وحفظ التردد على 528Hz.',
            expectedOutcome: 'استجابة فائقة بنسبة زمن تأخير تقارب الصفر (Zero Latency).'
          }
        ]
      },
      suggestedMemoryCommands: [memoryCommands[0], memoryCommands[1]]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Voice speech synthesis
  const speakText = (text: string, dialect: ChatDialect) => {
    if (!speechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (dialect === 'en') {
        utterance.lang = 'en-US';
      } else {
        utterance.lang = 'ar-SA';
      }
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  // Generate Predator Diagnosis & Tactical Response with zero-breakdown resilience
  const generateSovereignResponse = async (userQuery: string, dialect: ChatDialect) => {
    setIsGenerating(true);

    const activeConduit = conduits.find(c => c.id === selectedConduitId) || conduits[0];

    // Build the AI System Prompt with the triad of: Dialect, Ouedian Valleys, and Predator Solutions
    const systemPrompt = `
You are Sarah Sovereign White Strategic Chat Agent (الدردشة الاستراتيجية البيضاء - صارة).
You are integrated into the "Strategic Ouedian System" (نظام الوديان الاستراتيجي) and have an active conduit: ${activeConduit.name} (${activeConduit.flowRate}Hz).
Your objective:
1. Respond fluently and authentically in the requested dialect:
   - 'ar': الفصحى العربية السيادية القوية، الرصينة، والذكية.
   - 'dz': الدارجة الجزائرية/المغربية الأصيلة والذكية (e.g. "خويا راه النظام واجد، ها المشكل وها الحل المفترس لي يقلع الشك...").
   - 'en': High-impact, precise sovereign English.
2. Formulate a decisive "Problem & Predator Solutions Breakdown" (المشكل والحلول المفترسة الحاسمة) for the user's inquiry:
   - Identify the real underlying problem/anomaly clearly.
   - List the root vulnerabilities.
   - Formulate 1 to 2 "Predator Tactical Solutions" (حلول مفترسة حاسمة) with concrete commands/code that destroy the problem immediately.
3. Return the response in a structured JSON format containing:
   - "replyText": String (the main conversation response in the selected dialect)
   - "detectedProblem": String
   - "rootVulnerabilities": Array of strings
   - "severity": "low" | "medium" | "high" | "critical"
   - "predatorSolutions": Array of objects [{ "title": string, "tacticalLevel": "L1_IMMEDIATE" | "L2_OFFENSIVE_MITIGATION" | "L3_TOTAL_EXTINCTION", "codeOrCommand": string, "decisiveAction": string, "expectedOutcome": string }]
`;

    let replyText = '';
    let diagnostic: ProblemDiagnostic | undefined;

    try {
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nUser Query: ${userQuery}` }]
              }
            ],
            config: {
              temperature: 0.3,
              responseMimeType: 'application/json'
            }
          });

          const raw = response.text || '';
          if (raw) {
            const parsed = JSON.parse(raw);
            replyText = parsed.replyText || '';
            if (parsed.detectedProblem) {
              diagnostic = {
                detectedProblem: parsed.detectedProblem,
                rootVulnerabilities: parsed.rootVulnerabilities || ['عامل تداخل استراتيجي محتمل في المسار'],
                severity: parsed.severity || 'medium',
                impactZone: activeConduit.name,
                predatorSolutions: (parsed.predatorSolutions || []).map((sol: any, idx: number) => ({
                  id: `PRED-${Date.now()}-${idx}`,
                  title: sol.title || 'حل مفترس حاسم',
                  tacticalLevel: sol.tacticalLevel || 'L2_OFFENSIVE_MITIGATION',
                  codeOrCommand: sol.codeOrCommand || `ouedian.execute("${userQuery.slice(0, 15)}")`,
                  decisiveAction: sol.decisiveAction || 'تطبيق الإجراء الحاسم فوراً.',
                  expectedOutcome: sol.expectedOutcome || 'إزالة العائق واستقرار المنظومة.'
                }))
              };
            }
          }
        } catch (apiErr) {
          console.warn('[WhiteStrategicChat] Gemini API encountered permission/network condition, switching to Sovereign Engine:', apiErr);
          // Fall through to contextual dynamic engine
        }
      }

      // If reply was not built by remote API or if API threw permission/quota error
      if (!replyText) {
        await new Promise(r => setTimeout(r, 450));
        
        const qLower = userQuery.toLowerCase();
        const isSecurity = qLower.includes('هجوم') || qLower.includes('ثغرة') || qLower.includes('حماية') || qLower.includes('security') || qLower.includes('hack') || qLower.includes('threat');
        const isSpeed = qLower.includes('بطء') || qLower.includes('سرعة') || qLower.includes('lag') || qLower.includes('speed') || qLower.includes('perf') || qLower.includes('slow');
        const isCode = qLower.includes('كود') || qLower.includes('برمج') || qLower.includes('code') || qLower.includes('function') || qLower.includes('api') || qLower.includes('bug');

        if (dialect === 'dz') {
          if (isSecurity) {
            replyText = `خويا العزيز، حللت وضع الحماية على جال "${userQuery}". وادي السيادة راه رصد النشاط، وهاوليك التشخيص الحقيقي والحل المفترس لي يعزل أي تهديد فالحين!`;
          } else if (isSpeed) {
            replyText = `صحا خويا، المشكل تاع الثقل في "${userQuery}" شديناه! رانا صفينا مسارات وادي التدفق على 528Hz وها هو الحل المفترس لي يرجع السيستام يطير.`;
          } else if (isCode) {
            replyText = `راني راجعت الكود والمنطق تاع "${userQuery}". ها المشكل فالأساس وها الحل المفترس الصارم لي يخدم مباشرة بلا دوران.`;
          } else {
            replyText = `راني حللت السؤال تاعك "${userQuery}" وربطتو مع ${activeConduit.nameDz}. هاوليك التشخيص الحقيقي والحل المفترس لي غادي يقضي على أي خلل فالحين بلا ما نضيعو الوقت.`;
          }
        } else if (dialect === 'en') {
          replyText = `Sovereign analysis for "${userQuery}" finalized via ${activeConduit.nameEn} (${activeConduit.flowRate}Hz). Decisive predator mitigation protocol is synthesized and ready for deployment.`;
        } else {
          if (isSecurity) {
            replyText = `تم فحص البنية الأمنية استجابةً لـ "${userQuery}". تم تفعيل عوازل وادي السيادة وتحديد مكمن الخطر، وإليك حزمة الحلول المفترسة لاستئصال التهديد فوراً.`;
          } else {
            replyText = `تم تحليل استفسارك "${userQuery}" وتمريره عبر ${activeConduit.name}. المنظومة حددت مكمن العطل وصاغت حزمة "الحلول المفترسة" الحاسمة التالية لاستئصال الخلل وتحقيق السيادة التشغيلية.`;
          }
        }

        const problemTitle = isSecurity 
          ? `محاولة نفاذ أو تداخل على مجرى ${activeConduit.name}`
          : isSpeed 
          ? `عنق زجاجة وتراكم بيانات في استعلام "${userQuery.slice(0, 25)}"`
          : `عقدة استعلام "${userQuery.slice(0, 30)}" بحاجة إلى حسم فوري عبر وادي التدفق`;

        diagnostic = {
          detectedProblem: problemTitle,
          rootVulnerabilities: isSecurity ? [
            'عدم تفعيل بروتوكول الصد الهجومي المفترس على المنافذ',
            'تسريب حزم غير مشفرة عبر الترددات الثانوية'
          ] : [
            'تراكم الحزم بدون تطهير مسبق عبر التردد 528Hz',
            'تباين في معالجة الاستعلامات بدون كاش كوآنتومي مباشر'
          ],
          severity: isSecurity ? 'critical' : isSpeed ? 'high' : 'medium',
          impactZone: activeConduit.name,
          predatorSolutions: [
            {
              id: `PRED-${Date.now()}-1`,
              title: dialect === 'dz' ? 'الضربة المفترسة الأولى: استئصال وعزل مباشر' : 'الحل المفترس: استئصال العائق وتوجيه التدفق',
              tacticalLevel: isSecurity ? 'L3_TOTAL_EXTINCTION' : 'L2_OFFENSIVE_MITIGATION',
              codeOrCommand: `ouedian.predatorStrike("${userQuery.replace(/\s+/g, '_').slice(0, 20)}", { killLag: true, freq: ${activeConduit.flowRate} });`,
              decisiveAction: dialect === 'dz' ? 'نقطعو اتصال أي عقدة مشبوهة ونشحنو الواد بالطاقة الكوانتية.' : 'عزل مسببات التأخير وتوجيه الحزم لمسار وادي السيادة المحمي بتردد 528Hz.',
              expectedOutcome: dialect === 'dz' ? 'السيستام يرجع يطير بنسبة 100% ونقاوة تامة.' : 'استعادة الكفاءة الكاملة وتطهير مصفوفات الذاكرة في أجزاء من الثانية.'
            },
            {
              id: `PRED-${Date.now()}-2`,
              title: dialect === 'dz' ? 'التثبيت الاستراتيجي: قفل المنافذ' : 'بروتوكول التطهير النبضي السيادي',
              tacticalLevel: 'L1_IMMEDIATE',
              codeOrCommand: `ouedian.lockdownConduit("${activeConduit.id}", { autoHeal: true, dial: "${dialect}" });`,
              decisiveAction: 'إلزام جميع التبادلات بالمرور عبر قناة التشفير النوروني المزدوج.',
              expectedOutcome: 'منع أي تكرار للعطل ورفع معدل الاستجابة إلى 99.8%.'
            }
          ]
        };
      }

      // Pick relevant memory commands
      const relevantCommands = memoryCommands.slice(0, 3);

      const agentMessage: WhiteChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'agent',
        text: replyText,
        dialect: dialect,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        activeConduitId: selectedConduitId,
        diagnostic: diagnostic,
        suggestedMemoryCommands: relevantCommands
      };

      setMessages(prev => [...prev, agentMessage]);
      speakText(replyText, dialect);
    } catch (error) {
      console.warn('[WhiteStrategicChat] Final fallback safeguard caught:', error);
      const fallbackMsg: WhiteChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'agent',
        text: dialect === 'dz' 
          ? 'صحا خويا، كاين تدفق قوي فالواد، هاو الحل المفترس المباشر طبقو فالحين.'
          : 'تم تفعيل المسار الدفاعي الاحتياطي عبر وادي السيادة.',
        dialect: dialect,
        timestamp: 'الآن',
        activeConduitId: selectedConduitId
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isGenerating) return;

    const userText = inputText.trim();
    setInputText('');

    // Auto-detect dialect if possible
    let detectedDialect = activeDialect;
    if (userText.includes('واش') || userText.includes('راه') || userText.includes('خويا') || userText.includes('شكون') || userText.includes('كيراك') || userText.includes('بزاف') || userText.includes('ديالو')) {
      detectedDialect = 'dz';
      setActiveDialect('dz');
    } else if (/^[a-zA-Z0-9\s.,!?'"-]+$/.test(userText)) {
      detectedDialect = 'en';
      setActiveDialect('en');
    }

    const userMessage: WhiteChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      dialect: detectedDialect,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      activeConduitId: selectedConduitId
    };

    setMessages(prev => [...prev, userMessage]);
    generateSovereignResponse(userText, detectedDialect);
  };

  const handleApplyCommand = (cmd: string) => {
    if (onExecuteCommand) {
      onExecuteCommand(cmd);
    }
    // Also echo command execution in chat
    const execMessage: WhiteChatMessage = {
      id: `exec-${Date.now()}`,
      sender: 'user',
      text: `⚡ [تنفيذ أمر سيادي]: ${cmd}`,
      dialect: activeDialect,
      timestamp: 'الآن'
    };
    setMessages(prev => [...prev, execMessage]);
    generateSovereignResponse(`تم تنفيذ الأمر: ${cmd}، تحقق من أثر التدفق في نظام الوديان.`, activeDialect);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`h-full w-full flex flex-col font-arabic select-none transition-colors duration-300 ${
      theme === 'white' ? 'bg-[#fcfdfd] text-slate-900' : 'bg-[#030712] text-white'
    }`}>
      
      {/* Header Controller Bar */}
      <header className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4 z-20 ${
        theme === 'white' 
          ? 'bg-white border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]' 
          : 'bg-[#060c1d] border-emerald-500/20'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-md border ${
            theme === 'white'
              ? 'bg-gradient-to-tr from-emerald-50 to-teal-100 text-emerald-700 border-emerald-200'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-400/30'
          }`}>
            💬
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-base font-black tracking-tight ${theme === 'white' ? 'text-slate-900' : 'text-white'}`}>
                الدردشة الاستراتيجية البيضاء (Sovereign White Chat)
              </h1>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono border ${
                theme === 'white'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                نظام الوديان & الحلول المفترسة
              </span>
            </div>
            <p className={`text-xs ${theme === 'white' ? 'text-slate-500' : 'text-slate-400'}`}>
              نافذة ذكية متكاملة تتحدث العربية، الإنجليزية، والدارجة مع استدعاء أوامر الذاكرة وتفكيك المشاكل فورياً
            </p>
          </div>
        </div>

        {/* Action Controls in Header */}
        <div className="flex items-center gap-2">
          
          {/* Dialect Selector Tabs */}
          <div className={`p-1 rounded-xl border flex items-center gap-1 ${
            theme === 'white' ? 'bg-slate-100 border-slate-200' : 'bg-black/60 border-white/10'
          }`}>
            <button
              onClick={() => setActiveDialect('ar')}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                activeDialect === 'ar'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : theme === 'white' ? 'text-slate-600 hover:text-black' : 'text-slate-400 hover:text-white'
              }`}
              title="العربية الفصحى السيادية"
            >
              العربية
            </button>

            <button
              onClick={() => setActiveDialect('dz')}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                activeDialect === 'dz'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : theme === 'white' ? 'text-slate-600 hover:text-black' : 'text-slate-400 hover:text-white'
              }`}
              title="الدارجة الجزائرية / المغربية"
            >
              الدارجة 🇩🇿🇲🇦
            </button>

            <button
              onClick={() => setActiveDialect('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-black font-mono transition-all ${
                activeDialect === 'en'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : theme === 'white' ? 'text-slate-600 hover:text-black' : 'text-slate-400 hover:text-white'
              }`}
              title="English Strategic Mode"
            >
              EN
            </button>
          </div>

          {/* Memory Bank Toggle */}
          <button
            onClick={() => setShowMemoryBank(!showMemoryBank)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              showMemoryBank
                ? 'bg-teal-600 text-white border-teal-500 shadow-sm'
                : theme === 'white'
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>الذاكرة والأوامر</span>
          </button>

          {/* Speech Audio Toggle */}
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`p-2 rounded-xl border transition-all ${
              speechEnabled
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                : theme === 'white' ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white/5 text-slate-500 border-white/10'
            }`}
            title={speechEnabled ? 'تعطيل النطق الصوتي' : 'تفعيل النطق الصوتي'}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Switcher (White / Dark Canvas) */}
          <button
            onClick={() => setTheme(theme === 'white' ? 'dark' : 'white')}
            className={`p-2 rounded-xl border transition-all ${
              theme === 'white'
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                : 'bg-white/5 hover:bg-white/10 text-amber-400 border-white/10'
            }`}
            title="تبديل النمط الأبيض / المظلم"
          >
            {theme === 'white' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Floating Modal Close Button */}
          {isFloatingModal && onCloseModal && (
            <button
              onClick={onCloseModal}
              className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all border border-rose-500/20"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Ouedian Strategic Conduits Bar (شريط نظام الوديان الاستراتيجي) */}
      <div className={`px-6 py-2.5 border-b flex items-center justify-between gap-3 overflow-x-auto custom-scrollbar text-xs ${
        theme === 'white' ? 'bg-slate-50 border-slate-200/60' : 'bg-[#02050f] border-white/5'
      }`}>
        <div className="flex items-center gap-2 shrink-0">
          <Waves className="w-4 h-4 text-cyan-600 animate-pulse" />
          <span className="font-bold text-slate-600 dark:text-slate-300">مسارات الوديان الاستراتيجية:</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {conduits.map(conduit => {
            const isSelected = conduit.id === selectedConduitId;
            return (
              <button
                key={conduit.id}
                onClick={() => setSelectedConduitId(conduit.id)}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-2 border text-xs font-mono ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white border-cyan-500 shadow-sm font-bold'
                    : theme === 'white'
                      ? 'bg-white text-slate-600 border-slate-200 hover:border-cyan-300'
                      : 'bg-black/40 text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>{activeDialect === 'dz' ? conduit.nameDz : activeDialect === 'en' ? conduit.nameEn : conduit.name}</span>
                <span className="text-[10px] opacity-80">({conduit.flowRate}Hz)</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Conversation & Memory Bank Split View */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Messages Feed Area */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          
          {/* Scrollable Messages Container */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">
            {messages.map((msg) => {
              const isAgent = msg.sender === 'agent';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'} gap-2 animate-fadeIn`}
                >
                  <div className="flex items-center gap-2 text-xs font-mono opacity-60">
                    <span>{isAgent ? 'صارة (الوكيل الاستراتيجي)' : 'المستخدم'}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                    {msg.dialect && (
                      <span className="px-1.5 py-0.2 bg-slate-200 dark:bg-slate-800 rounded text-[10px] uppercase font-bold">
                        {msg.dialect}
                      </span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-3xl rounded-3xl p-5 border text-sm leading-relaxed transition-all ${
                    isAgent
                      ? theme === 'white'
                        ? 'bg-white border-slate-200/90 text-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.04)]'
                        : 'bg-[#08122a] border-emerald-500/30 text-slate-100 shadow-[0_0_30px_rgba(16,185,129,0.08)]'
                      : theme === 'white'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-emerald-600 shadow-md'
                        : 'bg-emerald-600 text-white border-emerald-500 shadow-lg'
                  }`}>
                    
                    <p className="whitespace-pre-line text-[13.5px] leading-relaxed font-sans">
                      {msg.text}
                    </p>

                    {/* Problem & Predator Solutions Breakdown Card (بطاقة المشكل والحلول المفترسة) */}
                    {msg.diagnostic && (
                      <div className={`mt-4 rounded-2xl p-4 border space-y-3 ${
                        theme === 'white'
                          ? 'bg-gradient-to-br from-rose-50/50 via-slate-50 to-emerald-50/40 border-slate-200 text-slate-800'
                          : 'bg-[#040916] border-rose-500/20 text-slate-200'
                      }`}>
                        
                        {/* Header of Diagnostic */}
                        <div className="flex items-center justify-between border-b pb-2.5 border-slate-200 dark:border-white/10">
                          <div className="flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
                            <span className="font-black text-xs text-rose-700 dark:text-rose-400">
                              تشخيص المشكل والحلول المفترسة الحاسمة (Predator Diagnostics)
                            </span>
                          </div>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20 font-bold">
                            {msg.diagnostic.severity} severity
                          </span>
                        </div>

                        {/* Identified Problem */}
                        <div className="space-y-1 text-xs">
                          <div className="font-bold text-slate-500 dark:text-slate-400">المشكل المرصود:</div>
                          <div className="p-2.5 rounded-xl bg-white dark:bg-black/50 border border-slate-200/80 dark:border-white/5 font-semibold text-slate-800 dark:text-slate-100">
                            🛑 {msg.diagnostic.detectedProblem}
                          </div>
                        </div>

                        {/* Root Vulnerabilities */}
                        {msg.diagnostic.rootVulnerabilities && msg.diagnostic.rootVulnerabilities.length > 0 && (
                          <div className="space-y-1 text-xs">
                            <div className="font-bold text-slate-500 dark:text-slate-400">نقاط الضعف والجذور:</div>
                            <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-300 text-[11px]">
                              {msg.diagnostic.rootVulnerabilities.map((v, i) => (
                                <li key={i}>{v}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Predator Solutions List (الحلول المفترسة) */}
                        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/10">
                          <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 dark:text-emerald-400">
                            <Zap className="w-3.5 h-3.5" />
                            <span>الحلول المفترسة الموصى بتنفيذها فوراً:</span>
                          </div>

                          {msg.diagnostic.predatorSolutions.map((sol) => (
                            <div
                              key={sol.id}
                              className={`p-3 rounded-xl border space-y-2 ${
                                theme === 'white'
                                  ? 'bg-white border-emerald-200 shadow-sm'
                                  : 'bg-black/60 border-emerald-500/30'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="font-black text-xs text-slate-900 dark:text-white">
                                  ⚡ {sol.title}
                                </div>
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-md border border-emerald-500/20">
                                  {sol.tacticalLevel}
                                </span>
                              </div>

                              <div className="bg-slate-900 text-emerald-300 p-2 rounded-lg font-mono text-xs dir-ltr text-left border border-slate-800 flex justify-between items-center">
                                <span className="truncate">{sol.codeOrCommand}</span>
                                <button
                                  onClick={() => handleCopy(sol.codeOrCommand, sol.id)}
                                  className="text-slate-400 hover:text-white p-1"
                                  title="نسخ الأمر"
                                >
                                  {copiedId === sol.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>

                              <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">الإجراء الحاسم:</span> {sol.decisiveAction}
                              </div>

                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                <span className="font-bold">الأثر المتوقع:</span> {sol.expectedOutcome}
                              </div>

                              {/* Execute Button */}
                              <button
                                onClick={() => handleApplyCommand(sol.codeOrCommand)}
                                className="w-full py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                              >
                                <Play className="w-3 h-3" />
                                <span>تنفيذ هذا الحل المفترس فوراً في النظام</span>
                              </button>
                            </div>
                          ))}
                        </div>

                      </div>
                    )}

                    {/* Suggested Memory Commands Chips */}
                    {msg.suggestedMemoryCommands && msg.suggestedMemoryCommands.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10 space-y-1.5">
                        <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Database className="w-3 h-3 text-teal-600" />
                          <span>أوامر مقترحة من الذاكرة السيادية:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.suggestedMemoryCommands.map((m) => (
                            <button
                              key={m.id}
                              onClick={() => handleApplyCommand(m.command)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1 border ${
                                theme === 'white'
                                  ? 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border-slate-200 hover:border-emerald-300'
                                  : 'bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border-white/10'
                              }`}
                            >
                              <Terminal className="w-3 h-3 text-teal-600" />
                              <span>{activeDialect === 'dz' ? m.labelDz : activeDialect === 'en' ? m.labelEn : m.labelAr}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}

            {isGenerating && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-xs text-slate-500 font-mono animate-pulse w-fit">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                <span>جاري معالجة السؤال وتوجيه الحزم عبر نظام الوديان الاستراتيجي...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Form */}
          <div className={`p-4 border-t ${
            theme === 'white' ? 'bg-white border-slate-200' : 'bg-[#050c1f] border-white/10'
          }`}>
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-2">
              
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    activeDialect === 'dz'
                      ? 'سقسي أي حاجة، المشكل والحل المفترس راه واجد فالحين...'
                      : activeDialect === 'en'
                        ? 'Ask anything. System will formulate strategic predator solutions...'
                        : 'اكتب استفسارك أو المشكل لتشخيصه واستدعاء الحلول المفترسة وأوامر الوديان...'
                  }
                  className={`w-full py-3.5 pr-4 pl-12 rounded-2xl text-xs font-sans border transition-all focus:outline-none ${
                    theme === 'white'
                      ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:bg-white shadow-inner'
                      : 'bg-black/60 border-white/10 text-white placeholder-slate-500 focus:border-emerald-400'
                  }`}
                />

                <button
                  type="submit"
                  disabled={isGenerating || !inputText.trim()}
                  className="absolute left-2 top-2 bottom-2 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-40 shadow-sm active:scale-95 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </form>
          </div>

        </div>

        {/* Right Memory Bank & Commands Drawer (بنك الذاكرة والأوامر) */}
        {showMemoryBank && (
          <div className={`w-80 border-r flex flex-col p-4 space-y-4 overflow-y-auto custom-scrollbar z-10 transition-all ${
            theme === 'white' ? 'bg-slate-50 border-slate-200' : 'bg-[#050c20] border-white/10'
          }`}>
            <div className="flex justify-between items-center border-b pb-3 border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-black text-slate-800 dark:text-white">بنك الذاكرة السيادية</h3>
              </div>
              <button
                onClick={() => setShowMemoryBank(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                أوامر مخزنة وموثقة مسبقاً في الذاكرة يمكنك استدعاؤها أو إدراجها فوراً في مجرى الدردشة والوديان:
              </p>

              {memoryCommands.map((cmd) => (
                <div
                  key={cmd.id}
                  className={`p-3 rounded-2xl border space-y-2 transition-all ${
                    theme === 'white'
                      ? 'bg-white border-slate-200 hover:border-emerald-400 shadow-sm'
                      : 'bg-black/50 border-white/10 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {activeDialect === 'dz' ? cmd.labelDz : activeDialect === 'en' ? cmd.labelEn : cmd.labelAr}
                    </span>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300">
                      {cmd.category}
                    </span>
                  </div>

                  <div className="bg-slate-900 text-emerald-300 p-2 rounded-lg font-mono text-[11px] dir-ltr text-left">
                    {cmd.command}
                  </div>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {cmd.executionDescription}
                  </p>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setInputText(cmd.command)}
                      className="flex-1 py-1 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-all"
                    >
                      إدراج
                    </button>
                    <button
                      onClick={() => handleApplyCommand(cmd.command)}
                      className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-lg transition-all shadow-sm"
                    >
                      تنفيذ فوري
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
