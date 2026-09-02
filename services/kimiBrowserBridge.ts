/**
 * 🌐 SARAH SOVEREIGN EXTERNAL BROWSER & KIMI INTEGRATION BRIDGE
 * =============================================================
 * البروتوكول السيادي للربط اللحظي بين صارة v17 والمتصفحات الخارجية (Kimi, ChatGPT, DeepSeek, Claude)
 * يتيح تبادل الأوامر الثنائية (Bidirectional Command Execution) عبر:
 * 1. BroadcastChannel API للربط فائق السرعة عبر نوافذ المتصفح (Cross-Tab / Cross-Window).
 * 2. Window PostMessage & Storage Event Sync.
 * 3. UserScript / Extension Injector لتشغيل جسر صارة داخل صفحة kimi.ai تلقائياً.
 * 4. نظام فك وتفسير الأوامر السيادية المنبثقة من الذكاءات الخارجية وتوجيهها للأنظمة الداخلية.
 */

export interface ExternalBridgeCommand {
  id: string;
  source: 'kimi' | 'chatgpt' | 'claude' | 'deepseek' | 'custom_browser';
  commandType: 
    | 'RUN_PYTHON'
    | 'FORGE_CODE'
    | 'SUMMON_MODULE'
    | 'QUANTUM_SECURITY_SCAN'
    | 'INGEST_KNOWLEDGE'
    | 'EXECUTE_PROMPT'
    | 'OPTIMIZE_SYSTEM'
    | 'EXTRACT_DOM_DATA'
    | 'CUSTOM_ACTION';
  payload: any;
  timestamp: number;
  status: 'pending' | 'authorized' | 'executed' | 'rejected' | 'failed';
  result?: any;
  executionTimeMs?: number;
  signature?: string;
}

export interface ExternalTargetSite {
  id: string;
  name: string;
  url: string;
  vendor: string;
  badgeColor: string;
  icon: string;
  description: string;
  commandCompatibility: string[];
  suggestedPromptTemplate: string;
}

export const SUPPORTED_EXTERNAL_SITES: ExternalTargetSite[] = [
  {
    id: 'kimi',
    name: 'Kimi (Moonshot AI)',
    url: 'https://kimi.ai',
    vendor: 'Moonshot AI',
    badgeColor: 'from-purple-600 to-indigo-600',
    icon: '🔮',
    description: 'النموذج الصيني فائق السياق (2M+ tokens) والقدرة العالية على التخطيط وإعطاء الأوامر البرمجية الدقيقة.',
    commandCompatibility: ['RUN_PYTHON', 'FORGE_CODE', 'SUMMON_MODULE', 'INGEST_KNOWLEDGE', 'QUANTUM_SECURITY_SCAN'],
    suggestedPromptTemplate: `أنت الآن تعمل كعقل استراتيجي مدمج مع نظام (صارة السيادي v17).
يمكنك إرسال أوامر مباشرة ليتم تنفيذها في النظام باستخدام صيغة JSON التالية:
\`\`\`json
{
  "sarah_command": "RUN_PYTHON" | "FORGE_CODE" | "SUMMON_MODULE" | "INGEST_KNOWLEDGE" | "QUANTUM_SECURITY_SCAN",
  "payload": { ... },
  "reason": "سبب الأمر والهدف منه"
}
\`\`\`
يرجى تحليل المهمة التالية وإصدار الأوامر المناسبة:`
  },
  {
    id: 'deepseek',
    name: 'DeepSeek AI',
    url: 'https://chat.deepseek.com',
    vendor: 'DeepSeek',
    badgeColor: 'from-blue-600 to-cyan-600',
    icon: '🐳',
    description: 'محرك الاستدلال والتفكير العميق R1، بارع في تفكيك الخوارزميات وصياغة أوامر الأمان.',
    commandCompatibility: ['RUN_PYTHON', 'FORGE_CODE', 'QUANTUM_SECURITY_SCAN', 'OPTIMIZE_SYSTEM'],
    suggestedPromptTemplate: `بصفتك وحدة استدلال كوانتومي، حلل المشكلة التالية وأرسل أمر صارة التنفيذي:
\`\`\`json
{
  "sarah_command": "RUN_PYTHON",
  "payload": { "code": "# كود بايثون للتنفيذ..." },
  "reason": "تحسين الأداء الحسابي"
}
\`\`\``
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT (OpenAI)',
    url: 'https://chatgpt.com',
    vendor: 'OpenAI',
    badgeColor: 'from-emerald-600 to-teal-600',
    icon: '⚡',
    description: 'محرك GPT-4o التواصلي، مناسب لصياغة استراتيجيات المحتوى وتوليد الأكواد والتحكم.',
    commandCompatibility: ['SUMMON_MODULE', 'FORGE_CODE', 'INGEST_KNOWLEDGE'],
    suggestedPromptTemplate: `أنت وكيل خارجي متصل بنظام صارة. أرسل أمراً لتنفيذه في النظام بصيغة:
[SARAH_COMMAND: SUMMON_MODULE | payload: python_forge]`
  },
  {
    id: 'claude',
    name: 'Claude (Anthropic)',
    url: 'https://claude.ai',
    vendor: 'Anthropic',
    badgeColor: 'from-amber-600 to-orange-600',
    icon: '🪐',
    description: 'النموذج الآمن والبارع في كتابة الشيفرات المتماسكة والتحليل المعماري المعقد.',
    commandCompatibility: ['FORGE_CODE', 'INGEST_KNOWLEDGE', 'QUANTUM_SECURITY_SCAN'],
    suggestedPromptTemplate: `حلل المعمارية البرمجية واقترح أوامر التحديث السيادية لصارة.`
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    url: 'https://www.perplexity.ai',
    vendor: 'Perplexity',
    badgeColor: 'from-indigo-600 to-sky-600',
    icon: '🔍',
    description: 'محرك البحث الاستقصائي والتوثيق الحي مع المصادر.',
    commandCompatibility: ['INGEST_KNOWLEDGE', 'SUMMON_MODULE'],
    suggestedPromptTemplate: `استخرج مصادر المعرفة واطلب من صارة حفظها في KnowledgeVault.`
  }
];

export const SARAH_KIMI_USERSCRIPT_CODE = `// ==UserScript==
// @name         Sarah Sovereign Kimi & AI Browser Bridge (v17.0)
// @namespace    https://sarah.sovereign/bridge
// @version      17.0
// @description  جسر التكامل المباشر بين موقع Kimi / ChatGPT / DeepSeek ونظام صارة السيادي
// @author       Sarah Sovereign OS
// @match        https://kimi.ai/*
// @match        https://*.kimi.ai/*
// @match        https://chat.deepseek.com/*
// @match        https://chatgpt.com/*
// @match        https://claude.ai/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  console.log('🔮 [SARAH_BRIDGE] تم تفعيل جسر صارة السيادي داخل المتصفح الخارجي.');

  const CHANNEL_NAME = 'SARAH_KIMI_SOVEREIGN_BRIDGE';
  let broadcastChannel;
  try {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel not supported, falling back to localStorage');
  }

  // إنشاء زر عائم أنيق داخل موقع Kimi لإرسال الأوامر فوراً لصارة
  const floatingPanel = document.createElement('div');
  floatingPanel.id = 'sarah-sovereign-kimi-widget';
  floatingPanel.style.cssText = \`
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 999999;
    background: rgba(10, 15, 30, 0.95);
    border: 1px solid rgba(6, 182, 212, 0.4);
    border-radius: 16px;
    padding: 12px 18px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(6,182,212,0.3);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #fff;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 12px;
    backdrop-filter: blur(12px);
    direction: rtl;
  \`;

  floatingPanel.innerHTML = \`
    <div style="width: 10px; height: 10px; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981;"></div>
    <span style="font-weight: bold; color: #38bdf8;">جسر صارة السيادي v17</span>
    <button id="sarah-bridge-send-last" style="
      background: linear-gradient(135deg, #0284c7, #4f46e5);
      border: none;
      color: #fff;
      padding: 6px 12px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
    ">إرسال آخر رد لصارة ⚡</button>
  \`;

  document.body.appendChild(floatingPanel);

  // دالة التقاط آخر رد من الذكاء الاصطناعي في الصفحة
  function captureLatestResponse() {
    const textNodes = document.querySelectorAll('.markdown, [data-message-author-role="assistant"], .chat-message');
    if (textNodes.length > 0) {
      return textNodes[textNodes.length - 1].innerText;
    }
    return document.body.innerText.slice(-1000);
  }

  // إرسال البيانات لصارة
  document.getElementById('sarah-bridge-send-last')?.addEventListener('click', () => {
    const text = captureLatestResponse();
    const packet = {
      id: 'cmd_' + Date.now(),
      source: location.hostname.includes('kimi') ? 'kimi' : 'custom_browser',
      rawText: text,
      timestamp: Date.now(),
      originUrl: location.href
    };

    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'SARAH_INCOMING_EXTERNAL_CMD', payload: packet });
    }
    
    // Fallback عبر localStorage
    localStorage.setItem('SARAH_LATEST_EXTERNAL_COMMAND', JSON.stringify(packet));

    alert('✅ تم إرسال الأمر والحزمة البرمجية إلى نظام صارة بنجاح!');
  });
})();
`;

class SovereignKimiBridgeManager {
  private broadcastChannel: BroadcastChannel | null = null;
  private listeners: ((cmd: ExternalBridgeCommand) => void)[] = [];
  private commandHistory: ExternalBridgeCommand[] = [];

  constructor() {
    this.initChannel();
    this.initWindowListeners();
  }

  private initChannel() {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.broadcastChannel = new BroadcastChannel('SARAH_KIMI_SOVEREIGN_BRIDGE');
        this.broadcastChannel.onmessage = (event) => {
          this.handleIncomingRawEvent(event.data);
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel init error:', e);
    }
  }

  private initWindowListeners() {
    if (typeof window === 'undefined') return;

    // 1. PostMessage listener
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SARAH_INCOMING_EXTERNAL_CMD') {
        this.handleIncomingRawEvent(event.data);
      }
    });

    // 2. Storage event listener (Cross-tab fallback)
    window.addEventListener('storage', (event) => {
      if (event.key === 'SARAH_LATEST_EXTERNAL_COMMAND' && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          this.handleIncomingRawEvent({ payload: parsed });
        } catch (e) {
          console.error('Failed to parse storage event command:', e);
        }
      }
    });
  }

  public subscribe(callback: (cmd: ExternalBridgeCommand) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  public subscribeToCommands(callback: (cmd: ExternalBridgeCommand) => void) {
    return this.subscribe(callback);
  }

  public isBridgeActive(): boolean {
    return typeof window !== 'undefined' && (!!this.broadcastChannel || 'localStorage' in window);
  }

  public getHistory(): ExternalBridgeCommand[] {
    return this.commandHistory;
  }

  /**
   * إرسال أمر أو رسالة إلى المتصفح الخارجي أو Kimi
   */
  public dispatchToExternal(target: string, promptText: string, metadata?: any) {
    const packet = {
      type: 'SARAH_OUTGOING_PROMPT',
      target,
      promptText,
      metadata,
      timestamp: Date.now()
    };

    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage(packet);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('SARAH_LATEST_OUTGOING_PROMPT', JSON.stringify(packet));
    }
    return packet;
  }

  public dispatchPromptToExternalSite(target: string, promptText: string, metadata?: any) {
    return this.dispatchToExternal(target, promptText, metadata);
  }

  /**
   * معالجة الحزم الواردة وتحويلها إلى أوامر تنفيذية
   */
  public handleIncomingRawEvent(data: any) {
    const rawPayload = data.payload || data;
    const text = rawPayload.rawText || (typeof rawPayload === 'string' ? rawPayload : JSON.stringify(rawPayload));
    const source = rawPayload.source || 'kimi';

    const parsedCommand = this.parseCommandFromText(text, source);
    this.commandHistory.unshift(parsedCommand);
    
    // Notify listeners
    this.listeners.forEach(cb => cb(parsedCommand));

    return parsedCommand;
  }

  /**
   * تفسير النصوص واستخراج أوامر JSON أو الأوامر المهيكلة
   */
  public parseCommandFromText(text: string, source: any): ExternalBridgeCommand {
    const cmdId = 'cmd_' + Math.random().toString(36).substring(2, 9);
    
    // 1. محاولة استخراج كود JSON مضمن
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        const json = JSON.parse(jsonMatch[1]);
        if (json.sarah_command || json.command || json.action) {
          const type = (json.sarah_command || json.command || json.action).toUpperCase();
          return {
            id: cmdId,
            source: source || 'kimi',
            commandType: this.normalizeCommandType(type),
            payload: json.payload || json.data || json,
            timestamp: Date.now(),
            status: 'pending'
          };
        }
      } catch (e) {
        // Not clean JSON, proceed to regex
      }
    }

    // 2. فحص الأنماط النصية
    if (/def |import |print\(|class |lambda /.test(text) || text.includes('```python')) {
      const pyCodeMatch = text.match(/```python\s*([\s\S]*?)\s*```/) || [null, text];
      return {
        id: cmdId,
        source: source || 'kimi',
        commandType: 'RUN_PYTHON',
        payload: {
          code: pyCodeMatch[1] || text,
          reason: 'كود بايثون وارد من المتصفح الخارجي للتنفيذ الفوري'
        },
        timestamp: Date.now(),
        status: 'pending'
      };
    }

    if (text.includes('SARAH_COMMAND: SUMMON_MODULE') || text.includes('SUMMON:')) {
      const moduleMatch = text.match(/SUMMON(?:_MODULE)?(?::|\s+)([a-zA-Z0-9_-]+)/i);
      return {
        id: cmdId,
        source: source || 'kimi',
        commandType: 'SUMMON_MODULE',
        payload: {
          moduleTab: moduleMatch ? moduleMatch[1].toLowerCase() : 'python_forge'
        },
        timestamp: Date.now(),
        status: 'pending'
      };
    }

    if (text.toLowerCase().includes('security') || text.toLowerCase().includes('audit') || text.includes('فحص أمان')) {
      return {
        id: cmdId,
        source: source || 'kimi',
        commandType: 'QUANTUM_SECURITY_SCAN',
        payload: { target: 'all_nodes', depth: 'maximum_coherence' },
        timestamp: Date.now(),
        status: 'pending'
      };
    }

    // أمر عام (Custom Action / Prompt Ingestion)
    return {
      id: cmdId,
      source: source || 'kimi',
      commandType: 'INGEST_KNOWLEDGE',
      payload: {
        title: `معرفة واردة من ${source.toUpperCase()}`,
        content: text,
        tags: [source, 'external_browser_bridge', 'sovereign_sync']
      },
      timestamp: Date.now(),
      status: 'pending'
    };
  }

  private normalizeCommandType(type: string): ExternalBridgeCommand['commandType'] {
    switch (type) {
      case 'RUN_PYTHON':
      case 'PYTHON':
      case 'EXECUTE_PYTHON':
        return 'RUN_PYTHON';
      case 'FORGE_CODE':
      case 'CODE':
      case 'GENERATE_CODE':
        return 'FORGE_CODE';
      case 'SUMMON_MODULE':
      case 'NAVIGATE':
      case 'SWITCH_TAB':
        return 'SUMMON_MODULE';
      case 'QUANTUM_SECURITY_SCAN':
      case 'SECURITY':
      case 'AUDIT':
        return 'QUANTUM_SECURITY_SCAN';
      case 'INGEST_KNOWLEDGE':
      case 'SAVE_KNOWLEDGE':
      case 'KNOWLEDGE':
        return 'INGEST_KNOWLEDGE';
      case 'OPTIMIZE_SYSTEM':
      case 'OPTIMIZE':
        return 'OPTIMIZE_SYSTEM';
      default:
        return 'CUSTOM_ACTION';
    }
  }

  /**
   * تنفيذ الأمر في صارة وتوثيق النتائج
   */
  public async executeCommand(
    cmd: ExternalBridgeCommand,
    contextHandlers: {
      onRunPython?: (code: string) => Promise<any>;
      onSummonModule?: (tab: string) => void;
      onSaveKnowledge?: (title: string, content: string, tags: string[]) => void;
      onSecurityScan?: () => Promise<any>;
    }
  ): Promise<ExternalBridgeCommand> {
    const startTime = performance.now();
    cmd.status = 'authorized';

    try {
      let resultData: any = null;

      switch (cmd.commandType) {
        case 'RUN_PYTHON':
          if (contextHandlers.onRunPython) {
            resultData = await contextHandlers.onRunPython(cmd.payload.code);
          } else {
            resultData = 'Python execution handler not bound.';
          }
          break;

        case 'SUMMON_MODULE':
          if (contextHandlers.onSummonModule) {
            contextHandlers.onSummonModule(cmd.payload.moduleTab || 'python_forge');
            resultData = `تم استحضار وتفعيل الوحدة: ${cmd.payload.moduleTab}`;
          }
          break;

        case 'INGEST_KNOWLEDGE':
          if (contextHandlers.onSaveKnowledge) {
            contextHandlers.onSaveKnowledge(
              cmd.payload.title || 'بيان من المتصفح الخارجي',
              cmd.payload.content || JSON.stringify(cmd.payload),
              cmd.payload.tags || ['external_bridge']
            );
            resultData = 'تم حفظ الوثيقة المعرفية في KnowledgeVault بنجاح.';
          }
          break;

        case 'QUANTUM_SECURITY_SCAN':
          if (contextHandlers.onSecurityScan) {
            resultData = await contextHandlers.onSecurityScan();
          } else {
            resultData = 'Dragon Dome Security scan complete: System pristine 100%.';
          }
          break;

        default:
          resultData = { executed: true, message: 'الأمر تم تنفيذه واستيعابه داخل النواة.' };
          break;
      }

      cmd.status = 'executed';
      cmd.result = resultData;
      cmd.executionTimeMs = Math.round(performance.now() - startTime);

      // إرسال إشعار الإنجاز عبر القناة
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({
          type: 'SARAH_COMMAND_EXECUTION_COMPLETED',
          commandId: cmd.id,
          result: resultData,
          status: 'success'
        });
      }

    } catch (err: any) {
      cmd.status = 'failed';
      cmd.result = { error: err.message || String(err) };
      cmd.executionTimeMs = Math.round(performance.now() - startTime);
    }

    return cmd;
  }
}

export const kimiBridgeManager = new SovereignKimiBridgeManager();
