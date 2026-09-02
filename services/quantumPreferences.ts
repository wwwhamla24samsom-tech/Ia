/**
 * ⚙️ SOVEREIGN QUANTUM SYSTEM PREFERENCES & FAVORITES ENGINE
 * محرك التفضيلات والإعدادات المفضلة السيادية للكمبيوتر الكمومي
 */

import { AppTab, Language } from '../types';

export type QuantumThemeMode = 
  | 'OLED_OBSIDIAN_BLACK'    // شاشة سوداء نقية 100% OLED Deep Black
  | 'QUANTUM_CYAN_MATRIX'    // مصفوفة السيان الكوآنتومي على سواد أوبسيدياني
  | 'CRT_PHOSPHOR_GREEN'     // شاشة الفوسفور الأخضر الكلاسيكي الخارق
  | 'AMBER_TERMINAL_GOLD'    // شاشة التيرمينال الكهرمانية الذهبية
  | 'MONOCHROME_STEEL';      // الفولاذ السيادي أحادي اللون

export type QuantumPowerProfile =
  | 'QUANTUM_MAX_TURBO'      // أقصى طاقة حوسبية كوآنتومية وتيربو 528Hz
  | 'CRYO_COHERENCE'         // ثبات تبريدي فائق ونقاء 99.99%
  | 'EMBEDDED_ZERO_LATENCY'  // نظام مدمج فوري بزمن استجابة 0ms
  | 'CYBER_SHIELD_DEFENSE';  // تحصين دفاعي سيبراني ومراقبة التطفل

export interface QuantumMacro {
  id: string;
  name: string;
  command: string;
  targetTab: AppTab;
  shortcut: string;
  icon: string;
}

export interface QuantumSystemPreferences {
  version: string;
  themeMode: QuantumThemeMode;
  powerProfile: QuantumPowerProfile;
  resonantFrequencyHz: 528 | 432 | 741 | 963;
  qubitsCapacity: 128 | 256 | 512 | 1024;
  crtScanlines: boolean;
  audioFeedback: boolean;
  quantumGlowIntensity: number; // 0.0 to 1.0
  autoCollapseWavefunction: boolean;
  defaultStartupTab: AppTab;
  preferredLanguage: Language;
  
  // المفضلة والوحدات المثبتة (Pinned Favorites)
  pinnedModules: AppTab[];
  
  // أوامر الماكرو المخصصة
  customMacros: QuantumMacro[];

  // قياسات النظام المدمج
  embeddedTelemetrySync: boolean;
  soundVolume: number;
}

const DEFAULT_PREFERENCES: QuantumSystemPreferences = {
  version: '17.0.0-QUANTUM',
  themeMode: 'OLED_OBSIDIAN_BLACK',
  powerProfile: 'QUANTUM_MAX_TURBO',
  resonantFrequencyHz: 528,
  qubitsCapacity: 512,
  crtScanlines: false,
  audioFeedback: true,
  quantumGlowIntensity: 0.85,
  autoCollapseWavefunction: true,
  defaultStartupTab: AppTab.HOME,
  preferredLanguage: 'ar',
  pinnedModules: [
    AppTab.QUANTUM_DEV_COMPUTER,
    AppTab.APEX_MATRIX,
    AppTab.SOVEREIGN_VOICE_CONTROLLER,
    AppTab.DRAGON_DOME,
    AppTab.PYTHON_FORGE,
    AppTab.SYSTEM_DIAGNOSTICS
  ],
  customMacros: [
    {
      id: 'macro-1',
      name: '⚡ تشغيل النواة والمطور الشامل',
      command: 'open quantum dev computer --qubits 512 --turbo',
      targetTab: AppTab.QUANTUM_DEV_COMPUTER,
      shortcut: 'Alt+Q',
      icon: '💻'
    },
    {
      id: 'macro-2',
      name: '🛡️ تحصين قبة دراغون L4',
      command: 'engage dragon dome --shield max --quarantine auto',
      targetTab: AppTab.DRAGON_DOME,
      shortcut: 'Alt+D',
      icon: '🐉'
    },
    {
      id: 'macro-3',
      name: '🐍 محاكي بايثون الحقيقي في الذاكرة',
      command: 'launch python forge --wasm --coherence 528',
      targetTab: AppTab.PYTHON_FORGE,
      shortcut: 'Alt+P',
      icon: '🐍'
    },
    {
      id: 'macro-4',
      name: '🎙️ استدعاء قائد الصوت السيادي',
      command: 'activate sovereign voice orchestrator',
      targetTab: AppTab.SOVEREIGN_VOICE_CONTROLLER,
      shortcut: 'Alt+V',
      icon: '🎙️'
    }
  ],
  embeddedTelemetrySync: true,
  soundVolume: 0.6
};

const STORAGE_KEY = 'SARAH_QUANTUM_SYSTEM_PREFERENCES_V17';

export class QuantumPreferencesManager {
  private static instance: QuantumPreferencesManager;
  private preferences: QuantumSystemPreferences;
  private listeners: Set<(prefs: QuantumSystemPreferences) => void> = new Set();

  private constructor() {
    this.preferences = this.loadFromStorage();
  }

  public static getInstance(): QuantumPreferencesManager {
    if (!QuantumPreferencesManager.instance) {
      QuantumPreferencesManager.instance = new QuantumPreferencesManager();
    }
    return QuantumPreferencesManager.instance;
  }

  private loadFromStorage(): QuantumSystemPreferences {
    try {
      if (typeof window === 'undefined') return { ...DEFAULT_PREFERENCES };
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PREFERENCES,
          ...parsed,
          pinnedModules: Array.isArray(parsed.pinnedModules) ? parsed.pinnedModules : DEFAULT_PREFERENCES.pinnedModules,
          customMacros: Array.isArray(parsed.customMacros) ? parsed.customMacros : DEFAULT_PREFERENCES.customMacros
        };
      }
    } catch (e) {
      console.warn('[QuantumPreferencesManager] Failed to load preferences from storage:', e);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private saveToStorage() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
      }
    } catch (e) {
      console.warn('[QuantumPreferencesManager] Failed to save preferences:', e);
    }
    this.notifyListeners();
  }

  public subscribe(callback: (prefs: QuantumSystemPreferences) => void): () => void {
    this.listeners.add(callback);
    callback(this.preferences);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(cb => {
      try {
        cb({ ...this.preferences });
      } catch (err) {
        console.error('QuantumPreferences listener error:', err);
      }
    });
  }

  public getPreferences(): QuantumSystemPreferences {
    return { ...this.preferences };
  }

  public updatePreferences(partial: Partial<QuantumSystemPreferences>) {
    this.preferences = {
      ...this.preferences,
      ...partial
    };
    this.saveToStorage();
  }

  public togglePinModule(tab: AppTab) {
    const isPinned = this.preferences.pinnedModules.includes(tab);
    if (isPinned) {
      this.preferences.pinnedModules = this.preferences.pinnedModules.filter(t => t !== tab);
    } else {
      this.preferences.pinnedModules = [...this.preferences.pinnedModules, tab];
    }
    this.saveToStorage();
  }

  public isModulePinned(tab: AppTab): boolean {
    return this.preferences.pinnedModules.includes(tab);
  }

  public addCustomMacro(macro: Omit<QuantumMacro, 'id'>) {
    const newMacro: QuantumMacro = {
      ...macro,
      id: `macro-${Date.now()}`
    };
    this.preferences.customMacros = [...this.preferences.customMacros, newMacro];
    this.saveToStorage();
  }

  public removeCustomMacro(macroId: string) {
    this.preferences.customMacros = this.preferences.customMacros.filter(m => m.id !== macroId);
    this.saveToStorage();
  }

  public resetToDefaults() {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.saveToStorage();
  }

  public exportPreferencesJson(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  public importPreferencesJson(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed === 'object' && parsed !== null) {
        this.preferences = {
          ...DEFAULT_PREFERENCES,
          ...parsed
        };
        this.saveToStorage();
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }
}

export const quantumPreferencesManager = QuantumPreferencesManager.getInstance();
