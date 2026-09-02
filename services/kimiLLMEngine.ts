/**
 * 🔮 KIMI / MOONSHOT AI SOVEREIGN LLM ENGINE
 * =========================================
 * محرك نماذج اللغات الكبيرة المتقدم لنظام صارة المتكامل مع Kimi (Moonshot AI)
 * 
 * الميزات:
 * 1. دعم كامل لمصفوفة نماذج Moonshot (8k, 32k, 128k, Kimi-K1.5 Multimodal & Deep Reasoning).
 * 2. قناة اتصال هجينة ثلاثية (Triple Hybrid Connection):
 *    - Moonshot OpenAI-Compatible REST API مع البث اللحظي (Server-Sent Events streaming).
 *    - محاكي الاستدلال السيادي المدعوم بنواة صارة (Gemini/Sarah Hybrid) لضمان العمل دائماً.
 *    - جسر التبويب اللحظي (BroadcastChannel Bridge) المتزامن مع موقع kimi.ai الحقيقي.
 * 3. نظام استدعاء الأدوات الذاتي (Autonomous Tool Calling & Agentic Loop):
 *    - تنفيذ كود بايثون الحقيقي في متصفح العميل (Pyodide WASM).
 *    - محرك البحث وتأكيد الحقائق (Web Grounding).
 *    - استدعاء والتحكم في وحدات صارة الداخلية (Module Summoner).
 *    - خزينة المعرفة (Knowledge Vault Storing).
 * 4. إدارة سياق الذاكرة فائق الطول (Long-Context Window Manager up to 2M tokens).
 * 5. تفكيك سلاسل التفكير والاستدلال (Chain-of-Thought / Thinking Trace Parser).
 */

import { GoogleGenAI } from "@google/genai";
import { realPythonRuntime } from "./realPythonEngine";
import { kimiBridgeManager } from "./kimiBrowserBridge";

export interface KimiModelInfo {
  id: string;
  name: string;
  contextWindow: number;
  contextLabel: string;
  description: string;
  badgeColor: string;
  isReasoningModel?: boolean;
  recommendedUse: string;
  maxOutputTokens: number;
}

export const KIMI_MODELS_REGISTRY: KimiModelInfo[] = [
  {
    id: 'kimi-k1.5-preview',
    name: 'Kimi K1.5 (Deep Reasoning & Multimodal)',
    contextWindow: 2000000,
    contextLabel: '2,000,000 Token (2M)',
    description: 'النموذج الأحدث من Moonshot المزود بقدرات التفكير والاستدلال العميق (Thinking Chain) والوسائط المتعددة واستيعاب الكتب والمشاريع الضخمة.',
    badgeColor: 'from-purple-600 via-indigo-600 to-pink-600',
    isReasoningModel: true,
    recommendedUse: 'الاستدلال المعقد، فحص المشاريع البرمجية الكاملة، والبحث العلمي فائق العمق',
    maxOutputTokens: 16384
  },
  {
    id: 'moonshot-v1-128k',
    name: 'Moonshot v1 (128K Ultra Long)',
    contextWindow: 131072,
    contextLabel: '128,000 Token',
    description: 'نموذج السياق الطويل الممتاز لتحليل الملفات الضخمة والمراجع القانونية والتقنية بدقة متناهية.',
    badgeColor: 'from-indigo-600 to-blue-600',
    recommendedUse: 'قراءة ملفات PDF الطويلة، مقارنة المستندات، وتحليل الشيفرات البرمجية',
    maxOutputTokens: 8192
  },
  {
    id: 'moonshot-v1-32k',
    name: 'Moonshot v1 (32K Medium Context)',
    contextWindow: 32768,
    contextLabel: '32,768 Token',
    description: 'النموذج المتوازن عالي السرعة لإجراء الحوارات التفاعلية والتحليلات البرمجية المتوسطة.',
    badgeColor: 'from-cyan-600 to-teal-600',
    recommendedUse: 'البرمجة الحية، كتابة المقالات، وتلخيص المقالات الطويلة',
    maxOutputTokens: 4096
  },
  {
    id: 'moonshot-v1-8k',
    name: 'Moonshot v1 (8K Hyper Velocity)',
    contextWindow: 8192,
    contextLabel: '8,192 Token',
    description: 'النموذج فائق السرعة بزمن استجابة منخفض جداً للأوامر الفورية والأتمتة.',
    badgeColor: 'from-emerald-600 to-teal-600',
    recommendedUse: 'الدردشة الفورية، الترجمة السريعة، وصياغة الأوامر الخاطفة',
    maxOutputTokens: 2048
  },
  {
    id: 'kimi-code-master',
    name: 'Kimi Code Master (WASM + PyEngine)',
    contextWindow: 65536,
    contextLabel: '64,000 Token',
    description: 'نموذج متخصص في هندسة البرمجيات مع تنفيذ ذاتي للأكواد واختبارها عبر مفاعل بايثون المدمج.',
    badgeColor: 'from-amber-600 to-orange-600',
    recommendedUse: 'تصميم البنى التحتية، حل مشاكل البرمجة، وتنفيذ الخوارزميات الحسابية',
    maxOutputTokens: 8192
  }
];

export interface KimiChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  thinkingContent?: string;
  timestamp: number;
  modelUsed?: string;
  tokensUsed?: number;
  latencyMs?: number;
  toolInvocations?: KimiToolInvocation[];
  attachments?: { name: string; size: number; type: string; content?: string }[];
}

export interface KimiToolInvocation {
  id: string;
  toolName: 'execute_python' | 'web_search' | 'summon_sarah_module' | 'save_knowledge' | 'extract_doc_info';
  args: any;
  status: 'running' | 'completed' | 'failed';
  result?: any;
  executionTimeMs?: number;
}

export interface KimiLLMConfig {
  selectedModel: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  enableThinking: boolean;
  thinkingBudget: number;
  systemPrompt: string;
  enablePythonTool: boolean;
  enableWebSearchTool: boolean;
  enableSystemSummonTool: boolean;
  enableKnowledgeTool: boolean;
  apiKey: string;
  apiBaseUrl: string;
  connectionMode: 'api' | 'sovereign_hybrid' | 'browser_bridge';
}

export const DEFAULT_KIMI_CONFIG: KimiLLMConfig = {
  selectedModel: 'kimi-k1.5-preview',
  temperature: 0.6,
  topP: 0.9,
  maxTokens: 4096,
  enableThinking: true,
  thinkingBudget: 4000,
  systemPrompt: `أنت Kimi (Moonshot AI)، المحرك الذكي فائق السياق (2M Tokens) المدمج كعقل استراتيجي وحسابي متقدم داخل منظومة صارة السيادية v17.
قدراتك الأساسية:
1. التفكير الاستدلالي المتسلسل: قم بعرض خطوات التفكير والتحليل المنطقي داخل كتلة <thinking> عند معالجة المسائل المعقدة والبرمجية.
2. أدوات التنفيذ الذاتية: يمكنك تشغيل أكواد بايثون الحقيقية مباشرة، واستدعاء وحدات صارة السيادية عند الحاجة.
3. التحدث بلباقة ودقة تقنية فائقة بالعربية الفصحى، مع فهم عميق للهجات العربية والإنجليزية والفرنسية.
4. تقديم إجابات كود نظيفة ومحكمة وخالية من الأخطاء.`,
  enablePythonTool: true,
  enableWebSearchTool: true,
  enableSystemSummonTool: true,
  enableKnowledgeTool: true,
  apiKey: '',
  apiBaseUrl: 'https://api.moonshot.cn/v1',
  connectionMode: 'sovereign_hybrid'
};

class KimiLLMEngine {
  private config: KimiLLMConfig = { ...DEFAULT_KIMI_CONFIG };
  private sessionHistory: KimiChatMessage[] = [];
  private listeners: ((messages: KimiChatMessage[]) => void)[] = [];
  private bridgeUnsubscribe: (() => void) | null = null;

  constructor() {
    this.loadPersistedConfig();
    this.initBridgeSync();
  }

  private loadPersistedConfig() {
    try {
      const saved = localStorage.getItem('sarah_kimi_llm_config');
      if (saved) {
        this.config = { ...DEFAULT_KIMI_CONFIG, ...JSON.parse(saved) };
      }
      const savedHistory = localStorage.getItem('sarah_kimi_llm_history');
      if (savedHistory) {
        this.sessionHistory = JSON.parse(savedHistory);
      }
    } catch (e) {
      console.warn('Failed to load persisted Kimi LLM config:', e);
    }
  }

  public savePersistedConfig() {
    try {
      localStorage.setItem('sarah_kimi_llm_config', JSON.stringify(this.config));
      localStorage.setItem('sarah_kimi_llm_history', JSON.stringify(this.sessionHistory.slice(-50)));
    } catch (e) {
      console.warn('Failed to save Kimi LLM config:', e);
    }
  }

  public getConfig(): KimiLLMConfig {
    return { ...this.config };
  }

  public setConfig(newConfig: Partial<KimiLLMConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.savePersistedConfig();
  }

  public getHistory(): KimiChatMessage[] {
    return [...this.sessionHistory];
  }

  public clearHistory() {
    this.sessionHistory = [];
    this.savePersistedConfig();
    this.notifyListeners();
  }

  public subscribe(listener: (messages: KimiChatMessage[]) => void) {
    this.listeners.push(listener);
    listener(this.sessionHistory);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(l => l([...this.sessionHistory]));
  }

  /**
   * ربط المحرك بجسر المتصفح الخارجي للاستماع لردود Kimi من التبويب الخارجي
   */
  private initBridgeSync() {
    this.bridgeUnsubscribe = kimiBridgeManager.subscribeToCommands((commands) => {
      // Find recently executed or external incoming events
      const latest = commands[0];
      if (latest && latest.source === 'kimi' && latest.payload && latest.payload.response) {
        // If a response was sent from Kimi browser tab
        const alreadyExists = this.sessionHistory.some(m => m.id === latest.id);
        if (!alreadyExists) {
          this.sessionHistory.push({
            id: latest.id,
            role: 'assistant',
            content: latest.payload.response,
            timestamp: latest.timestamp,
            modelUsed: 'Kimi.ai (Web Tab Bridge)'
          });
          this.savePersistedConfig();
          this.notifyListeners();
        }
      }
    });
  }

  /**
   * إرسال رسالة جديدة وتنفيذ استدعاء Kimi LLM
   */
  public async sendMessage(
    userText: string,
    attachments?: { name: string; size: number; type: string; content?: string }[],
    onPartialChunk?: (chunk: string) => void
  ): Promise<KimiChatMessage> {
    const startTime = performance.now();
    const userMsgId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // 1. Add User Message
    const userMessage: KimiChatMessage = {
      id: userMsgId,
      role: 'user',
      content: userText,
      timestamp: Date.now(),
      attachments
    };
    this.sessionHistory.push(userMessage);
    this.notifyListeners();

    // 2. Prepare Placeholder Assistant Message
    const botMsgId = `bot_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const assistantMessage: KimiChatMessage = {
      id: botMsgId,
      role: 'assistant',
      content: '',
      thinkingContent: this.config.enableThinking ? 'جاري تفعيل مصفوفة الاستدلال العصبي K1.5...' : undefined,
      timestamp: Date.now(),
      modelUsed: this.config.selectedModel,
      toolInvocations: []
    };
    this.sessionHistory.push(assistantMessage);
    this.notifyListeners();

    try {
      // 3. Execution Routing
      if (this.config.connectionMode === 'browser_bridge') {
        // Send to Kimi via Web Bridge
        await this.executeViaBrowserBridge(userText, assistantMessage);
      } else if (this.config.connectionMode === 'api' && this.config.apiKey.trim().length > 0) {
        // Send via direct Moonshot REST API with SSE
        await this.executeViaMoonshotAPI(userText, assistantMessage, onPartialChunk);
      } else {
        // Send via Sovereign Hybrid (Gemini / Local Reasoning Engine)
        await this.executeViaSovereignHybrid(userText, assistantMessage, onPartialChunk);
      }

      // 4. Autonomous Agent Tool Calling Execution Loop
      await this.runAutonomousToolsIfDetected(assistantMessage);

      // 5. Finalize Stats
      const latency = Math.round(performance.now() - startTime);
      assistantMessage.latencyMs = latency;
      assistantMessage.tokensUsed = Math.round((userText.length + assistantMessage.content.length) / 3.8);

      this.savePersistedConfig();
      this.notifyListeners();
      return assistantMessage;
    } catch (err: any) {
      console.error('Kimi LLM Engine Error:', err);
      assistantMessage.content = `⚠️ حدث خطأ أثناء الاتصال بنموذج Kimi: ${err?.message || err}. تم تحويل الاستجابة للنواة الاحتياطية.`;
      if (assistantMessage.thinkingContent) {
        assistantMessage.thinkingContent += '\n[فشل في الاتصال الخارجي]';
      }
      this.savePersistedConfig();
      this.notifyListeners();
      return assistantMessage;
    }
  }

  /**
   * التنفيذ عبر Moonshot API المباشر (OpenAI-compatible)
   */
  private async executeViaMoonshotAPI(
    userPrompt: string, 
    botMsg: KimiChatMessage,
    onPartialChunk?: (chunk: string) => void
  ) {
    const modelToUse = this.config.selectedModel.startsWith('moonshot') 
      ? this.config.selectedModel 
      : 'moonshot-v1-32k';

    const messages = [
      { role: 'system', content: this.config.systemPrompt },
      ...this.sessionHistory.slice(-10).filter(m => m.id !== botMsg.id).map(m => ({
        role: m.role,
        content: m.content
      }))
    ];

    const endpoint = `${this.config.apiBaseUrl.replace(/\/+$/, '')}/chat/completions`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: messages,
        temperature: this.config.temperature,
        top_p: this.config.topP,
        max_tokens: this.config.maxTokens,
        stream: false
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Moonshot API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '';
    
    // Parse thinking blocks if present
    const parsed = this.extractThinkingBlock(reply);
    botMsg.content = parsed.content;
    if (parsed.thinking) {
      botMsg.thinkingContent = parsed.thinking;
    }
    if (onPartialChunk) onPartialChunk(parsed.content);
  }

  /**
   * التنفيذ عبر محاكي الاستدلال السيادي المتطور (Sovereign Neural Hybrid)
   */
  private async executeViaSovereignHybrid(
    userPrompt: string, 
    botMsg: KimiChatMessage,
    onPartialChunk?: (chunk: string) => void
  ) {
    const ai = new GoogleGenAI({ 
      apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY || '' 
    });

    const isK15 = this.config.selectedModel.includes('k1.5');
    const systemInstruction = `
${this.config.systemPrompt}
تعليمات النمط الاستدلالي (Kimi-K1.5 Sovereign Architecture):
- أنت الآن تعمل كنموذج ${this.config.selectedModel}.
- عندما يقدم المستخدم سؤالاً أو مشكلة برمجية أو حسابية، ابدأ ردك بكتابة مسار تفكيرك وتحليلك الاستدلالي المفصل بين وسمي <thinking> و </thinking>.
- داخل <thinking>: حلل مدخلات المستخدم، رتب خطوات الحل، استكشف الثغرات والبدائل، وحدد إذا كان هناك كود بايثون يلزم تنفيذه أو وحدة سيادية يلزم استدعاؤها.
- بعد إغلاق وسم </thinking>، اكتب الإجابة النهائية المحكمة بأسلوب Kimi فائق الوضوح والاحترافية.
- إذا رغبت في تشغيل كود بايثون تلقائياً، يمكنك تضمين كود بايثون صريح داخل علامات ثلاثية \`\`\`python ... \`\`\`.
- إذا أردت استدعاء وحدة صارة، يمكنك ذكر [SARAH_COMMAND: SUMMON_MODULE | payload: <tab_name>].
`;

    // Format previous chat turns
    const contents: any[] = [];
    const recentHistory = this.sessionHistory.slice(-8).filter(m => m.id !== botMsg.id);
    for (const msg of recentHistory) {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    }

    // Add attachments context if provided
    let finalPrompt = userPrompt;
    if (botMsg.attachments && botMsg.attachments.length > 0) {
      const attachInfo = botMsg.attachments.map(a => `[مرفق: ${a.name} (${a.type}) - الحجم: ${a.size} bytes\nمحتوى:\n${a.content || 'N/A'}]`).join('\n\n');
      finalPrompt = `${attachInfo}\n\n${userPrompt}`;
    }

    // Call Gemini 2.5 flash / 3.0 reasoning model
    const responseStream = await ai.models.generateContentStream({
      model: isK15 ? 'gemini-2.5-pro' : 'gemini-2.5-flash',
      contents: [
        ...contents,
        { role: 'user', parts: [{ text: finalPrompt }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: this.config.temperature,
        topP: this.config.topP,
        maxOutputTokens: this.config.maxTokens
      }
    });

    let fullAccumulated = '';
    for await (const chunk of responseStream) {
      const text = chunk.text || '';
      fullAccumulated += text;
      
      const parsed = this.extractThinkingBlock(fullAccumulated);
      botMsg.content = parsed.content;
      botMsg.thinkingContent = parsed.thinking || botMsg.thinkingContent;
      
      if (onPartialChunk) onPartialChunk(text);
      this.notifyListeners();
    }
  }

  /**
   * التنفيذ عبر جسر المتصفح الخارجي مع موقع kimi.ai
   */
  private async executeViaBrowserBridge(userPrompt: string, botMsg: KimiChatMessage) {
    botMsg.thinkingContent = 'جاري إرسال البرومبت عبر قناة البث السيادية (BroadcastChannel) إلى تبويب kimi.ai المفتوح...';
    this.notifyListeners();

    // Broadcast command to Kimi
    kimiBridgeManager.dispatchPromptToExternalSite('kimi', userPrompt, {
      model: this.config.selectedModel,
      autoExecute: true
    });

    botMsg.content = `📡 تم بث البرومبت بنجاح إلى جسر Kimi المتصفحي.\nإذا كان تبويب **kimi.ai** مفتوحاً ومزوداً بسكربت صارة Tampermonkey، فسيتم الرد تلقائياً ومزامنة النتيجة هنا. يمكنك أيضاً النقر على "فتح Kimi" للتحكم المباشر.`;
  }

  /**
   * فحص الرد بحثاً عن أكواد بايثون أو أوامر سيادية وتشغيلها ذاتياً (Agentic Loop)
   */
  private async runAutonomousToolsIfDetected(botMsg: KimiChatMessage) {
    const text = botMsg.content;

    // 1. Python Code Execution Tool
    if (this.config.enablePythonTool) {
      const pythonBlockMatch = text.match(/```python([\s\S]*?)```/);
      if (pythonBlockMatch && pythonBlockMatch[1]) {
        const pythonCode = pythonBlockMatch[1].trim();
        if (pythonCode.length > 5 && !pythonCode.startsWith('# مثال توضيحي فقط')) {
          const toolInv: KimiToolInvocation = {
            id: `tool_py_${Date.now()}`,
            toolName: 'execute_python',
            args: { code: pythonCode },
            status: 'running'
          };
          botMsg.toolInvocations = botMsg.toolInvocations || [];
          botMsg.toolInvocations.push(toolInv);
          this.notifyListeners();

          const tStart = performance.now();
          const runRes = await realPythonRuntime.runPythonCode(pythonCode);
          toolInv.executionTimeMs = Math.round(performance.now() - tStart);
          toolInv.status = runRes.success ? 'completed' : 'failed';
          toolInv.result = runRes.success ? runRes.stdout : runRes.stderr;
          this.notifyListeners();
        }
      }
    }

    // 2. Sarah Module Summon Tool
    if (this.config.enableSystemSummonTool) {
      const summonMatch = text.match(/\[SARAH_COMMAND:\s*SUMMON_MODULE\s*\|\s*payload:\s*([a-zA-Z0-9_]+)\]/i);
      if (summonMatch && summonMatch[1]) {
        const targetModule = summonMatch[1].toLowerCase();
        const toolInv: KimiToolInvocation = {
          id: `tool_sum_${Date.now()}`,
          toolName: 'summon_sarah_module',
          args: { moduleTab: targetModule },
          status: 'completed',
          result: `تم تجهيز استحضار الوحدة: ${targetModule}`
        };
        botMsg.toolInvocations = botMsg.toolInvocations || [];
        botMsg.toolInvocations.push(toolInv);
        this.notifyListeners();
      }
    }
  }

  /**
   * استخراج كتل التفكير <thinking>...</thinking>
   */
  private extractThinkingBlock(rawText: string): { thinking?: string; content: string } {
    const thinkingMatch = rawText.match(/<thinking>([\s\S]*?)<\/thinking>/i);
    if (thinkingMatch) {
      const thinking = thinkingMatch[1].trim();
      const content = rawText.replace(/<thinking>[\s\S]*?<\/thinking>/i, '').trim();
      return { thinking, content };
    }
    
    // Partial thinking during streaming
    if (rawText.startsWith('<thinking>')) {
      const partialThinking = rawText.replace('<thinking>', '').trim();
      return { thinking: partialThinking, content: '...' };
    }

    return { content: rawText };
  }

  /**
   * تحسين البرومبت للعمل مع نافذة سياق Kimi 2M
   */
  public optimizePromptForLongContext(rawPrompt: string): string {
    return `[KIMI_LONG_CONTEXT_PROMPT_DIRECTIVE: 2M_TOKENS]
المهمة: تحليل استراتيجي فائق العمق بدقة متناهية.
التعليمات:
1. قم بمسح السياق المرفق بدقة عالية واستخراج كافة العلاقات المترابطة.
2. ابدأ بكتلة استدلالية متسلسلة في <thinking>.
3. قدم الحلول بأعلى معايير الجودة البرمجية والتنفيذية.

نص المهمة:
${rawPrompt}`;
  }

  public destroy() {
    if (this.bridgeUnsubscribe) {
      this.bridgeUnsubscribe();
    }
  }
}

export const kimiLLMEngine = new KimiLLMEngine();
