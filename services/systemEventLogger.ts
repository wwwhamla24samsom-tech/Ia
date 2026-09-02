/**
 * 📡 SOVEREIGN SYSTEM EVENT LOGGER & TELEMETRY STREAM
 * ====================================================
 * محرك تسجيل أحداث النظام اللحظي لتتبع كافة استدعاءات الوحدات والعمليات السيادية
 */

export type EventCategory = 
  | 'MODULE_SUMMON' 
  | 'SOVEREIGN_OP' 
  | 'PYTHON_EXEC' 
  | 'SECURITY_SHIELD' 
  | 'VOICE_INTENT' 
  | 'QUANTUM_QPU' 
  | 'SYSTEM_DIAG';

export type EventLevel = 'INFO' | 'SUCCESS' | 'WARN' | 'CRITICAL' | 'SOVEREIGN';

export interface SystemEvent {
  id: string;
  timestamp: number;
  timeFormatted: string;
  category: EventCategory;
  level: EventLevel;
  source: string;
  action: string;
  details?: string;
  executionTimeMs?: number;
  metadata?: Record<string, any>;
}

type EventSubscriber = (events: SystemEvent[], latestEvent: SystemEvent | null) => void;

class SystemEventLogger {
  private events: SystemEvent[] = [];
  private subscribers: EventSubscriber[] = [];
  private maxBufferSize = 250;
  private isMuted = false;

  constructor() {
    this.loadFromStorage();
    if (this.events.length === 0) {
      this.seedInitialEvents();
    }
  }

  private loadFromStorage() {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('sarah_system_event_log_v1');
        if (stored) {
          this.events = JSON.parse(stored);
        }
      }
    } catch (e) {
      console.warn('Failed to load system event logs:', e);
    }
  }

  private saveToStorage() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('sarah_system_event_log_v1', JSON.stringify(this.events.slice(-100)));
      }
    } catch (e) {
      console.warn('Failed to save system event logs:', e);
    }
  }

  private formatTime(date: Date = new Date()): string {
    const pad = (n: number, z = 2) => ('00' + n).slice(-z);
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;
  }

  private seedInitialEvents() {
    const now = Date.now();
    const seeds: SystemEvent[] = [
      {
        id: 'EVT-INIT-001',
        timestamp: now - 18000,
        timeFormatted: this.formatTime(new Date(now - 18000)),
        category: 'SOVEREIGN_OP',
        level: 'SOVEREIGN',
        source: 'SovereignKernel',
        action: 'BOOT_CORE_ALIGNMENT',
        details: 'تمت محاذاة نواة النظام على تردد 528Hz واستقرار زمن الاستجابة عند 0ms.',
        executionTimeMs: 0.8
      },
      {
        id: 'EVT-INIT-002',
        timestamp: now - 14000,
        timeFormatted: this.formatTime(new Date(now - 14000)),
        category: 'SECURITY_SHIELD',
        level: 'SUCCESS',
        source: 'DragonDomeEngine',
        action: 'SHIELD_L4_ENGAGED',
        details: 'تفعيل قبة دراغون الحصينة L4 وعزل بيئة التشغيل عن أي تطفل خارجي.',
        executionTimeMs: 1.4
      },
      {
        id: 'EVT-INIT-003',
        timestamp: now - 10000,
        timeFormatted: this.formatTime(new Date(now - 10000)),
        category: 'QUANTUM_QPU',
        level: 'INFO',
        source: 'QuantumComputer',
        action: 'QPU_128_ONLINE',
        details: 'مصفوفة 128 كيوبت جاهزة للحسابات والدوائر الكمومية.',
        executionTimeMs: 2.1
      },
      {
        id: 'EVT-INIT-004',
        timestamp: now - 5000,
        timeFormatted: this.formatTime(new Date(now - 5000)),
        category: 'MODULE_SUMMON',
        level: 'SUCCESS',
        source: 'ModuleSummoner',
        action: 'SINGLE_SCREEN_READY',
        details: 'تهيئة منصة الشاشة الواحدة الموحدة v17 وجاهزية استقبال الأوامر.',
        executionTimeMs: 0.5
      }
    ];

    this.events = seeds;
    this.saveToStorage();
  }

  public recordEvent(
    category: EventCategory,
    action: string,
    source: string,
    level: EventLevel = 'INFO',
    details?: string,
    executionTimeMs?: number,
    metadata?: Record<string, any>
  ): SystemEvent {
    const now = new Date();
    const event: SystemEvent = {
      id: `EVT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      timestamp: now.getTime(),
      timeFormatted: this.formatTime(now),
      category,
      level,
      source,
      action,
      details,
      executionTimeMs,
      metadata
    };

    this.events.push(event);
    if (this.events.length > this.maxBufferSize) {
      this.events.shift();
    }

    this.saveToStorage();
    this.notifySubscribers(event);

    return event;
  }

  public logModuleSummon(tabId: string, moduleLabel: string, source = 'UserNavigation', executionTimeMs?: number) {
    return this.recordEvent(
      'MODULE_SUMMON',
      `SUMMON_${tabId.toUpperCase()}`,
      source,
      'SUCCESS',
      `تم استدعاء الوحدة السيادية: [${moduleLabel}] وتوجيه حيز الرؤية إليها`,
      executionTimeMs,
      { tabId, moduleLabel }
    );
  }

  public logSovereignOp(action: string, details: string, source = 'SovereignCore', level: EventLevel = 'SOVEREIGN', executionTimeMs?: number) {
    return this.recordEvent(
      'SOVEREIGN_OP',
      action,
      source,
      level,
      details,
      executionTimeMs
    );
  }

  public logPythonExec(codeSnippet: string, success: boolean, executionTimeMs: number, stdout?: string) {
    return this.recordEvent(
      'PYTHON_EXEC',
      success ? 'PYTHON_RUN_SUCCESS' : 'PYTHON_RUN_ERROR',
      'RealPythonRuntime',
      success ? 'SUCCESS' : 'CRITICAL',
      success 
        ? `تم تنفيذ كود بايثون بنجاح: ${stdout ? stdout.slice(0, 100) : 'بدون مخرجات'}` 
        : `خطأ في تنفيذ بايثون: ${stdout || 'Syntax/Runtime Error'}`,
      executionTimeMs,
      { codeSnippet: codeSnippet.slice(0, 200) }
    );
  }

  public logVoiceIntent(transcript: string, matchedAction: string, confidence: number) {
    return this.recordEvent(
      'VOICE_INTENT',
      matchedAction,
      'SovereignVoiceController',
      confidence > 0.9 ? 'SOVEREIGN' : 'INFO',
      `أمر صوتي مُعالج: "${transcript}" (ثقة: ${Math.round(confidence * 100)}%)`,
      undefined,
      { transcript, confidence }
    );
  }

  public logSecurityShield(action: string, details: string, level: EventLevel = 'WARN') {
    return this.recordEvent(
      'SECURITY_SHIELD',
      action,
      'DragonDomeShield',
      level,
      details
    );
  }

  public getEvents(categoryFilter?: EventCategory): SystemEvent[] {
    if (!categoryFilter) return [...this.events];
    return this.events.filter(e => e.category === categoryFilter);
  }

  public clearLogs() {
    this.events = [];
    this.saveToStorage();
    this.notifySubscribers(null);
  }

  public exportLogs(): string {
    return JSON.stringify(this.events, null, 2);
  }

  public subscribe(fn: EventSubscriber): () => void {
    this.subscribers.push(fn);
    fn([...this.events], this.events[this.events.length - 1] || null);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== fn);
    };
  }

  private notifySubscribers(latestEvent: SystemEvent | null) {
    const list = [...this.events];
    this.subscribers.forEach(fn => fn(list, latestEvent));
  }
}

export const systemEventLogger = new SystemEventLogger();
