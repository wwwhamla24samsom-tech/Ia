
export enum AppTab {
  HOME = 'home',
  LANDING_PAGE = 'landing_page',
  NEURAL_BRAIN = 'neural_brain',
  VOICE_HUB = 'voice_hub',
  SEARCH = 'search',
  CODE_FORGE = 'code_forge',
  ADMIN_CENTER = 'admin_center',
  SETTINGS = 'settings',
  SNAPSHOTS = 'snapshots',
  STAR_GATE = 'star_gate',
  LOGIC_CORE = 'logic_core',
  STUDIO = 'studio',
  VIDEO_STUDIO = 'video_studio',
  EXPLORER = 'explorer',
  HTML_FULL = 'html_full',
  PYTHON_FORGE = 'python_forge',
  AI_NEXUS = 'ai_nexus',
  SPACE_NODE_5 = 'space_node_5',
  HOLO_MATRIX = 'holo_matrix',
  WORD_CORE = 'word_core',
  VPN_SHIELD = 'vpn_shield',
  AGENT_SWARM = 'agent_swarm',
  INFINITY_INTELLIGENCE = 'infinity_intelligence',
  NEURAL_CINEMA = 'neural_cinema',
  PHOTO_RETOUCH = 'photo_retouch',
  AURA_AUDIO = 'aura_audio',
  QUANTUM_COUNCIL = 'quantum_council',
  HYPER_LEARNING = 'hyper_learning',
  KNOWLEDGE_VAULT = 'knowledge_vault',
  DATA_STREAMS = 'data_streams',
  NEURAL_SHIELD = 'neural_shield',
  NEURAL_OVERSIGHT = 'neural_oversight',
  REMOTE_FORGE = 'remote_forge',
  NEURAL_SANDBOX = 'neural_sandbox',
  NEURAL_TRACKER = 'neural_tracker',
  STRATEGIC_ARCHITECT = 'strategic_architect',
  INTELLIGENCE_FUSION = 'intelligence_fusion',
  UPDATE_PROTOCOL = 'update_protocol',
  CITY_HUB = 'city_hub',
  MARKETPLACE = 'marketplace',
  REACTOR = 'reactor',
  ORBITAL = 'orbital',
  GENESIS = 'genesis',
  RETALIATION = 'retaliation',
  DRIVERS = 'drivers',
  NEURAL_CAROUSEL = 'neural_carousel',
  NEURAL_DEVICE_CONTROL = 'neural_device_control',
  NEURAL_QUAD_CORE = 'neural_quad_core',
  GLOBAL_INTERFACE = 'global_interface',
  SYSTEM_DIAGNOSTICS = 'system_diagnostics',
  GENERATION_15 = 'generation_15',
  QUANTUM_NEURAL_CORE = 'quantum_neural_core',
  NEURAL_BROADCAST = 'neural_broadcast',
  AI_BROWSER = 'ai_browser',
  CPU_10G_CORE = 'cpu_10g_core',
  CLONER = 'cloner',
  PROMPT_HUB = 'prompt_hub',
  GENERATION_16 = 'generation_16',
  HEXAGRAM_MATRIX = 'hexagram_matrix',
  SOLAR_COSMOS = 'solar_cosmos',
  DRAGON_DOME = 'dragon_dome',
  QUANTUM_DEV_COMPUTER = 'quantum_dev_computer',
  STRATEGIC_SITE_AGENT = 'strategic_site_agent',
  WHITE_STRATEGIC_CHAT = 'white_strategic_chat',
  KIMI_LLM_STUDIO = 'kimi_llm_studio',
  SOVEREIGN_VOICE_CONTROLLER = 'sovereign_voice_controller',
  APEX_MATRIX = 'apex_matrix',
  CONSCIOUSNESS_WHITE_CANVAS = 'consciousness_white_canvas',
  LIVE_PREVIEW_MATRIX = 'live_preview_matrix',
  OPEN_SOURCE_HUB = 'open_source_hub'
}

export type Language = 'ar' | 'dz' | 'en' | 'de' | 'fr';

export interface TransportPacket {
  id: string;
  protocol: string;
  endpoint: string;
  payloadSize: string;
  status: 'intercepted' | 'redirected' | 'secured';
  latency: number;
}

export interface ClonedAppResult {
  id: string;
  name: string;
  fullCode: string;
  optimizations: string[];
  securityHardening: string;
  transportAnalysis: {
    detectedEndpoints: string[];
    riskScore: number;
    recommendedProxy: string;
    identifiedProtocols: string[];
  };
}

// ... بقية الـ interfaces الموجودة سابقاً دون تغيير ...
export interface SearchSource { title: string; uri: string; }
export interface NeuralThought { id: string; text: string; timestamp: number; intensity: number; region: string; origin?: string; emotionalColor?: string; }
export interface SovereignDocument { id: string; title: string; type: string; category: string; tableOfContents: { chapter: string; description: string }[]; content: string; neuralHash: string; version: string; timestamp: number; }
export interface InvestigationReport { query: string; executiveSummary: string; verifiedSources: SearchSource[]; suggestedChapters: string[]; riskFactor: number; }
export interface LogicalOutput { conclusion: string; thoughtSteps: string[]; sources?: SearchSource[]; }
export interface CosmicVerdict { summary: string; dimensions: { name: string; value: number; color: string }[]; starLog: string[]; resonanceLevel: number; manifestCode: string; }
export interface PythonSimulationResult { output: string; logicBreakdown: string; librariesUsed: string[]; potentialBugs: string[]; securityStatus: string; estimatedEfficiency: number; }
export interface FusionConfig { intensity: number; frequency: number; bandwidth: number; encryptionLevel: 'AES-256' | 'Quantum_RSA'; }
export interface NeuralMergeResult { connectionBlueprint: string; systemSummary: string; vulnerabilitiesFound: string[]; }
export interface UserLocation { latitude: number; longitude: number; }
export interface MapResult { title: string; uri: string; address?: string; rating?: string; snippets?: string[]; hours?: string; phone?: string; }
export interface NoCodeProject { id: string; name: string; description: string; features: string[]; fullCode: string; techStack: string[]; }
export interface SystemUpdate { version: string; timestamp: number; changes: string[]; newCapabilities: string[]; technicalSpecs: string; }
export interface SystemUpdatePackage { version: string; codename: string; securityLevel: string; patchSize: string; releaseNotes: string[]; integrityHash: string; deploymentSteps: string[]; }
export interface ThreatAnalysis { threatLevel: string; isMalicious: boolean; detectedAnomalies: string[]; recommendedPatch: string; sourceOrigin: string; }
export interface OversightReport { isSafe: boolean; threatScore: number; detectedSpyware: string[]; recomendedAction: string; connectionAudit: string; }
export interface MonitoringProcess { pid: string; name: string; usage: number; status: string; origin: string; }
export interface NetworkConnection { id: string; destination: string; port: number; protocol: string; dataSent: string; }
export interface RemoteSite { id: string; name: string; neuralAddress: string; status: string; code: string; structure: { id: string; label: string; type: string; pos: { x: number, y: number, z: number } }[]; }
export interface WritingAnalysis { readability: number; tone: string; suggestions: { text: string }[]; }
export interface SovereignAnalysis { strategicDecision: string; riskAssessment: string; confidenceScore: number; thoughtProcess: string[]; }
export interface ManifestResult { manifestationId: string; systemBlueprint: string; securityHash: string; installationScript: string; coreCode: string; }
export interface VisionAnalysisResult { objects: string[]; description: string; technicalDetails: string[]; detectedText: string; threatAssessment: string; }
export interface TruthAuditReport { integrityScore: number; hallucinationRisk: string; verifiedAnchors: string[]; neuralSeal: string; }
export interface StrategicBlueprint { systemName: string; vision: string; nodes: { id: string; label: string; type: string; description: string }[]; technicalStack: string[]; operationalLogic: string; runnableSimulationCode: string; }
export interface FusedResponse { content: string; mimickedLogic: string; efficiencyBoost: number; extractedKnowledge: string[]; }
export interface SystemExtension { id: string; name: string; description: string; category: string; icon: string; price: string; installed?: boolean; }
export interface CyberDefenseReport { integrityScore: number; strategySummary: string; synergyPaths: AlgorithmPath[]; }
export interface AlgorithmPath { id: string; sourceSystem: string; targetSystem: string; action: string; efficiency: number; status: string; }
export interface SystemConfig { id: string; name: string; powerLevel: number; mode: 'stealth' | 'balanced' | 'aggressive'; autoEvolve: boolean; }
export interface SatelliteNode { id: string; name: string; altitude: number; signalStrength: number; }
export interface OrbitalReport { activeSatellites: SatelliteNode[]; }
export interface GenesisReport { generatedPackets: GenesisDataPacket[]; assemblyLog: string[]; systemEnhancementRatio: number; }
export interface GenesisDataPacket { id: string; label: string; content: string; type: string; priority: string; integrationScore: number; metadata: string; visibility: string; }
export interface DeterrenceReport { threatLevel: string; coreIntegrity: number; activeIntrusions: IntrusionEvent[]; counterMeasures: DefenseAction[]; poisonPillActive: boolean; retaliationSummary: string; }
export interface IntrusionEvent { id: string; originIp: string; location: string; intent: string; deviceType: string; method: string; intensity: number; }
export interface DefenseAction { id: string; type: string; status: string; targetImpact: string; efficiency: number; }
export interface SystemDriver { id: string; name: string; status: string; load: number; isOptimized: boolean; }
export interface SystemUpdateHistory { version: string; timestamp: number; changes: string[]; performanceGain: string; }
export interface HyperScriptResult { generatedCode: string; logs: string[]; executionTime: string; status: string; }
export interface BioMetrics { mood: string; humanDetected: boolean; attentionLevel: number; noiseLevel: number; gestures?: string[]; }
export interface CouncilResult { id: string; opinions: { node: string; verdict: string; confidence: number; keyPoint: string }[]; sovereignDecision: string; finalSynthesis: string; processingTime: string; }
export interface TrinityResult { perspectives: { agent: string; insight: string; confidence: number; encryptionKey: string }[]; unifiedVerdict: string; matrixStability: number; }
export interface SingularityResult { logicSwarm: { id: string; label: string; type: string; strength: number }[]; evolutionRate: number; architectVerdict: string; realityAnchor: string; temporalSimulation: string[]; }
export interface NexusResult { sarahLogic: string; targetAILogic: string; fusedOutput: string; buildStatus: string; }
export interface DetectedSignal { id: string; name: string; protocol: string; strength: number; security: string; macAddress: string; distance: string; coordinates: { x: number, y: number }; }
export interface SignalAnalysis { pairingCode: string; securityHash: string; protocolStability: number; }
export interface CryptoAnalysis { algorithmType: string; securityLevel: number; logicStructure: string; vulnerabilities: string[]; generatedCode: string; neuralSeal: string; }
export interface SwarmResult { architect: string; enforcer: string; visionary: string; finalSynthesis: string; matrixStability: number; }
export type ManifestTarget = 'windows_exe' | 'android_apk' | 'browser_extension' | 'python_core';
export interface TVDialogueResponse { message: string; suggestions: string[]; }
export interface TVAppConfig { name: string; features: string[]; }
export interface DiagnosticResult { module: string; status: 'optimal' | 'degraded' | 'critical'; efficiency: number; fixSuggestion: string; }
export interface TrackingResult { targetName: string; locationName: string; matchProbability: number; coordinates: { lat: number, lng: number }; vocalIntel: string; socialFootprint: string[]; lastSeen: string; networkProvider?: string; signalType?: string; }
export interface VRSystemState { spatialNodes: { id: string; label: string; type: string; depth: number; rotation: number; scale: number }[]; activeSector: string; }
export interface GeneratedImage { url: string; prompt: string; size: '1K' | '2K' | '4K'; }
export interface AppIdea { id: string; name: string; description: string; codeSnippet: string; version: number; }
export interface KnowledgeEntry { id: string; title: string; summary: string; timestamp: number; }
export interface DataChannel { id: string; name: string; load: number; status: string; }
export interface GeneratedVideo { id: string; uri: string; prompt: string; aspectRatio: '16:9' | '9:16'; resolution: string; }
export interface SandboxResult { logs: string[]; executionTime: string; output: string; status: string; securityAudit: string; temporalEfficiency: number; }
export interface ForgeNode { id: string; label: string; type: string; pos: { x: number, y: number, z: number }; code: string; complexity: number; }
export interface DeviceControl { id: string; name: string; type: string; status: string; ip: string; os: string; protocol: string; }
export interface InfrastructureNode { id: string; name: string; zone: string; status: string; load: number; }
export interface OmniStep { system: string; action: string; status: 'pending' | 'processing' | 'completed'; }
export interface InternalApp { id: string; name: string; icon: string; description: string; category: string; status: string; }
export interface MatrixLink { source: string; target: string; value: number; type: 'data' | 'logic' | 'security'; }
export interface SymbolEntry { id: string; glyph: string; name: string; origin: string; category: string; meaning: string; }
export interface StealthCommand { id: string; alias: string; realFunction: string; icon: string; category: 'beauty' | 'hobby'; dangerLevel: string; }
export interface SystemSnapshot { id: string; name: string; timestamp: number; data: any; }
export interface SingularityPulse { realityStability: number; neuralEntropy: number; evolutionVelocity: number; }
export type BroadcastProtocol = 'wifi' | 'neural_link' | 'bluetooth' | 'external_ip';
export interface CastPacket { timestamp: number; bytes: string; status: 'sent' | 'error'; type: string; }
export interface BrainVitals { frontalLobeActive: number; temporalLobeActive: number; parietalLobeActive: number; synapseSpeed: number; consciousnessLevel: number; }
export interface CoreHealth { cpuLoad: number; memoryUsage: number; neuralStability: number; activeTunnels: number; uptime: string; }
export interface SarahHomeProps { onNavigate: (tab: AppTab) => void; language: Language; }

export interface QuadCoreState {
  engineer: { status: string; output: string; progress: number };
  planner: { status: string; plan: string[]; progress: number };
  fetcher: { status: string; resources: SearchSource[]; progress: number };
  supervisor: { status: string; verdict: string; progress: number };
}

export interface QuadCoreResult {
  engineeringSpecs: string;
  strategicPlan: string[];
  gatheredResources: SearchSource[];
  finalVerdict: string;
  executionStatus: 'success' | 'warning' | 'critical';
}

export interface SiteFile {
  name: string;
  path: string;
  content: string;
  language: 'html' | 'javascript' | 'typescript' | 'css' | 'json';
}

export interface SiteNode {
  id: string;
  name: string;
  slug: string;
  category: 'portal' | 'landing' | 'dashboard' | 'api_gateway' | 'docs';
  status: 'active' | 'standby' | 'isolated' | 'building';
  internalPort: number;
  healthScore: number;
  trafficRPS: number;
  routes: { path: string; handler: string; isProtected: boolean }[];
  sslState: 'quantum_tls' | 'strict_aes' | 'isolated';
  description: string;
  codeFiles: SiteFile[];
  lastModified: string;
}

export interface StrategicSiteAction {
  id: string;
  action: string;
  targetSiteId: string;
  agentRole: 'Site Architect' | 'Traffic Strategist' | 'Security Warden' | 'Code Synthesizer';
  status: 'executed' | 'in_progress' | 'queued';
  impact: string;
  timestamp: string;
}

export type ChatDialect = 'ar' | 'dz' | 'en';

export interface PredatorSolution {
  id: string;
  title: string;
  tacticalLevel: 'L1_IMMEDIATE' | 'L2_OFFENSIVE_MITIGATION' | 'L3_TOTAL_EXTINCTION';
  codeOrCommand: string;
  decisiveAction: string;
  expectedOutcome: string;
}

export interface ProblemDiagnostic {
  detectedProblem: string;
  rootVulnerabilities: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  impactZone: string;
  predatorSolutions: PredatorSolution[];
}

export interface OuedianConduit {
  id: string;
  name: string;
  nameEn: string;
  nameDz: string;
  flowRate: number; // e.g. 528 Hz or MB/s
  streamStatus: 'flowing' | 'surging' | 'calm' | 'turbulent';
  channelType: 'sovereign_energy' | 'neural_knowledge' | 'dragon_defense' | 'cyber_syntax';
  currentPayload: string;
}

export interface MemoryCommand {
  id: string;
  command: string;
  labelAr: string;
  labelDz: string;
  labelEn: string;
  category: 'ouedian' | 'predator' | 'quantum' | 'system';
  executionDescription: string;
}

export interface WhiteChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  dialect: ChatDialect;
  timestamp: string;
  activeConduitId?: string;
  diagnostic?: ProblemDiagnostic;
  suggestedMemoryCommands?: MemoryCommand[];
  isStreaming?: boolean;
}


