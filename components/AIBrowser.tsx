
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, MessageSquare, Database, Share2, Sparkles, Brain, Cpu, Globe, 
  Layers, Zap, Terminal, RefreshCw, Plus, Trash2, Save, ExternalLink, 
  ChevronRight, Bot, User, Shield, Activity, Send, ArrowLeft, ArrowRight, 
  RotateCw, Home, Maximize2, Minimize2, Settings as SettingsIcon, Layout, 
  MessageCircle, Bluetooth, Tv, Radio, Smartphone, Monitor, Upload, Undo2,
  Compass, Laptop
} from 'lucide-react';
import { Language } from '../types';
import { ExternalBrowserBridge } from './ExternalBrowserBridge';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  status: 'online' | 'offline' | 'syncing';
  icon: React.ReactNode;
  color: string;
  url: string;
  description: string;
}

interface Message {
  id: string;
  sender: 'user' | 'sara' | string;
  content: string;
  timestamp: number;
  modelId?: string;
  attachments?: string[];
}

interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  source: string;
  timestamp: number;
  tags: string[];
}

export const AIBrowser: React.FC<{ language: Language }> = ({ language }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [knowledgeBank, setKnowledgeBank] = useState<KnowledgeEntry[]>([]);
  const [activeModels, setActiveModels] = useState<string[]>(['sara', 'gemini', 'kimi']);
  const [isSyncing, setIsSyncing] = useState(false);
  const [viewMode, setViewMode] = useState<'unified' | 'split' | 'browser' | 'kimi_bridge'>('unified');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [chatMode, setChatMode] = useState<'shared' | 'individual'>('shared');
  const [currentUrl, setCurrentUrl] = useState('https://gemini.google.com');
  const [activeTab, setActiveTab] = useState('gemini');
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const models: AIModel[] = [
    { id: 'sara', name: 'SARA_Core', provider: 'Sovereign', status: 'online', icon: <Brain className="w-5 h-5" />, color: 'rose', url: '', description: 'النواة السيادية للتحكم والتنسيق.' },
    { id: 'kimi', name: 'Kimi (Moonshot)', provider: 'Moonshot AI', status: 'online', icon: <Cpu className="w-5 h-5" />, color: 'purple', url: 'https://kimi.ai', description: 'النموذج الصيني فائق السياق (2M+) المدمج للتحكم وإصدار الأوامر.' },
    { id: 'gemini', name: 'Gemini', provider: 'Google', status: 'online', icon: <Sparkles className="w-5 h-5" />, color: 'blue', url: 'https://gemini.google.com', description: 'ذكاء جوجل المتعدد الوسائط.' },
    { id: 'gpt4', name: 'ChatGPT', provider: 'OpenAI', status: 'online', icon: <Cpu className="w-5 h-5" />, color: 'emerald', url: 'https://chatgpt.com', description: 'نموذج OpenAI الرائد.' },
    { id: 'claude', name: 'Claude', provider: 'Anthropic', status: 'online', icon: <Globe className="w-5 h-5" />, color: 'amber', url: 'https://claude.ai', description: 'ذكاء أنثروبيك الآمن.' },
    { id: 'deepseek', name: 'DeepSeek', provider: 'DeepSeek', status: 'online', icon: <Activity className="w-5 h-5" />, color: 'cyan', url: 'https://chat.deepseek.com', description: 'ذكاء تقني متخصص في الاستدلال.' },
    { id: 'icloud', name: 'Apple_AI', provider: 'Apple', status: 'online', icon: <Database className="w-5 h-5" />, color: 'cyan', url: 'https://www.apple.com/apple-intelligence/', description: 'ذكاء آبل المدمج.' },
    { id: 'perplexity', name: 'Perplexity', provider: 'Perplexity', status: 'online', icon: <Search className="w-5 h-5" />, color: 'indigo', url: 'https://www.perplexity.ai', description: 'محرك بحث ذكي.' },
    { id: 'mistral', name: 'Mistral', provider: 'Mistral', status: 'online', icon: <Layers className="w-5 h-5" />, color: 'orange', url: 'https://chat.mistral.ai', description: 'الذكاء الفرنسي المتطور.' },
    { id: 'grok', name: 'Grok', provider: 'xAI', status: 'online', icon: <Zap className="w-5 h-5" />, color: 'slate', url: 'https://x.com/i/grok', description: 'ذكاء xAI المتمرد.' },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Save to history stack before sending
    setHistoryStack(prev => [...prev, input]);

    const userMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      content: input,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    if (chatMode === 'shared') {
      const activeAI = models.filter(m => activeModels.includes(m.id));
      for (let i = 0; i < activeAI.length; i++) {
        const model = activeAI[i];
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200)); // Sub-second response
        
        const response: Message = {
          id: Math.random().toString(36).substr(2, 9),
          sender: model.id,
          content: `[${model.name}]: جاري معالجة الطلب في الوضع المشترك...`,
          timestamp: Date.now(),
          modelId: model.id
        };
        setMessages(prev => [...prev, response]);
      }
    } else {
      // Individual mode logic
      const model = models.find(m => m.id === activeTab) || models[0];
      await new Promise(resolve => setTimeout(resolve, 150)); // Sub-second response
      const response: Message = {
        id: Math.random().toString(36).substr(2, 9),
        sender: model.id,
        content: `[${model.name}]: استجابة فردية مخصصة لهذا النموذج فقط.`,
        timestamp: Date.now(),
        modelId: model.id
      };
      setMessages(prev => [...prev, response]);
    }

    setIsProcessing(false);
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const lastInput = historyStack[historyStack.length - 1];
    setInput(lastInput);
    setHistoryStack(prev => prev.slice(0, -1));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const userMsg: Message = {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'user',
        content: `تم رفع الملف: ${file.name}`,
        timestamp: Date.now(),
        attachments: [file.name]
      };
      setMessages(prev => [...prev, userMsg]);
      
      // Simulate analysis
      setTimeout(() => {
        const response: Message = {
          id: Math.random().toString(36).substr(2, 9),
          sender: 'sara',
          content: `[SARA_CORE]: تم استلام الملف "${file.name}". جاري تحليله واستخراج البيانات...`,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, response]);
      }, 150); // Sub-second response
    }
  };

  const selectTab = (id: string) => {
    setActiveTab(id);
    if (id === 'kimi') {
      setViewMode('kimi_bridge');
    }
    const model = models.find(m => m.id === id);
    if (model && model.url) {
      setCurrentUrl(model.url);
    }
  };

  return (
    <div className="min-h-screen bg-[#010204] text-slate-200 font-arabic p-4 lg:p-8 overflow-hidden relative flex flex-col">
      
      {/* Browser Chrome / Header */}
      <header className="bg-white/5 border border-white/10 rounded-[2.5rem] p-4 mb-6 flex flex-col md:flex-row items-center gap-6 relative z-20 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
          </div>
          <div className="h-8 w-px bg-white/10 mx-2"></div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-white/5 rounded-xl text-slate-400"><ArrowLeft className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-white/5 rounded-xl text-slate-400"><ArrowRight className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-white/5 rounded-xl text-slate-400"><RotateCw className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex-1 w-full relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><Globe className="w-4 h-4" /></div>
          <input 
            type="text" 
            value={currentUrl}
            readOnly
            className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 px-12 text-xs font-mono text-blue-400 focus:outline-none"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
            <Shield className="w-3 h-3 text-emerald-500" />
            <span className="text-[8px] font-black text-emerald-500 uppercase">Secure</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Device Mode Toggle */}
          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
            <button 
              onClick={() => setDeviceMode('desktop')}
              className={`p-2 rounded-xl transition-all ${deviceMode === 'desktop' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              title="Desktop View"
            ><Monitor className="w-4 h-4" /></button>
            <button 
              onClick={() => setDeviceMode('mobile')}
              className={`p-2 rounded-xl transition-all ${deviceMode === 'mobile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              title="Mobile View"
            ><Smartphone className="w-4 h-4" /></button>
          </div>

          <div className="h-8 w-px bg-white/10"></div>

          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
            <button 
              onClick={() => setViewMode('kimi_bridge')}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all flex items-center gap-1.5 ${viewMode === 'kimi_bridge' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30' : 'text-purple-300 hover:text-white'}`}
            >
              <Zap className="w-3 h-3 text-cyan-300" />
              <span>Kimi_Bridge ⚡</span>
            </button>
            <button 
              onClick={() => setViewMode('unified')}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${viewMode === 'unified' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >Unified</button>
            <button 
              onClick={() => setViewMode('split')}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${viewMode === 'split' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >Split</button>
            <button 
              onClick={() => setViewMode('browser')}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${viewMode === 'browser' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >Real_Site</button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className={`flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden transition-all duration-500 ${deviceMode === 'mobile' ? 'max-w-sm mx-auto border-x-8 border-y-[40px] border-black rounded-[3rem] shadow-2xl h-[800px]' : ''}`}>
        
        {/* Left: AI Selector & Mode Controls (Hidden in Mobile Mode if needed, or adapted) */}
        <div className={`lg:col-span-3 space-y-6 flex flex-col overflow-hidden ${deviceMode === 'mobile' ? 'hidden' : ''}`}>
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 flex-1 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">AI_Matrix_Nodes</h3>
              <div className="flex gap-1">
                <button 
                  onClick={() => setChatMode('shared')}
                  className={`p-2 rounded-lg transition-all ${chatMode === 'shared' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-500'}`}
                  title="Shared Mode"
                ><Share2 className="w-3 h-3" /></button>
                <button 
                  onClick={() => setChatMode('individual')}
                  className={`p-2 rounded-lg transition-all ${chatMode === 'individual' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-500'}`}
                  title="Individual Mode"
                ><User className="w-3 h-3" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-2">
              {models.map((model) => (
                <button 
                  key={model.id}
                  onClick={() => selectTab(model.id)}
                  className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group relative ${
                    activeTab === model.id 
                      ? `bg-${model.color}-500/10 border-${model.color}-500/30` 
                      : 'bg-white/5 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      activeTab === model.id ? `bg-${model.color}-500/20 text-${model.color}-500` : 'bg-white/5 text-slate-500'
                    }`}>
                      {model.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-white">{model.name}</div>
                      <div className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">{model.provider}</div>
                    </div>
                  </div>
                  {activeModels.includes(model.id) && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl">
                <h4 className="text-[10px] font-black text-blue-400 uppercase mb-2">Active_Mode: {chatMode.toUpperCase()}</h4>
                <p className="text-[8px] text-slate-500 leading-relaxed">
                  {chatMode === 'shared' 
                    ? 'يتم مشاركة المدخلات مع كافة النماذج النشطة لبناء بنك معلومات موحد.' 
                    : 'يتم التحدث مع النموذج المختار بشكل مستقل ومنفصل.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Browser / Unified View */}
        <div className={`lg:col-span-${viewMode === 'unified' && deviceMode === 'desktop' ? '6' : '12'} flex flex-col gap-6 overflow-hidden`}>
          
          {viewMode === 'kimi_bridge' ? (
            <div className="flex-1 bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
              <ExternalBrowserBridge language={language} />
            </div>
          ) : viewMode === 'browser' ? (
            <div className="flex-1 bg-white/5 border border-white/10 rounded-[3.5rem] overflow-hidden relative group">
              <iframe 
                src={currentUrl} 
                className="w-full h-full border-none bg-white"
                title="AI Real Site"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-black/80 text-white rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase">
                  <ExternalLink className="w-4 h-4" /> Open_External
                </a>
              </div>
            </div>
          ) : viewMode === 'split' ? (
            <div className="flex-1 grid grid-cols-2 gap-6 overflow-hidden">
               <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden">
                  <iframe src="https://gemini.google.com" className="w-full h-full border-none bg-white" />
               </div>
               <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden">
                  <iframe src="https://chatgpt.com" className="w-full h-full border-none bg-white" />
               </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col bg-white/5 border border-white/10 rounded-[3.5rem] overflow-hidden shadow-2xl relative">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20 backdrop-blur-md z-20">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white font-black">🔱</div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tighter">Unified_AI_Matrix</h3>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">SARA Orchestrating Global Intelligence</p>
                  </div>
                </div>
                <div className="flex gap-4">
                   <button onClick={() => setMessages([])} className="p-2 hover:bg-white/5 rounded-lg text-slate-500"><Trash2 className="w-4 h-4" /></button>
                   <div className="flex gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                   </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar z-10">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => {
                    const modelInfo = models.find(m => m.id === msg.sender);
                    return (
                      <motion.div 
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-[85%] p-6 rounded-[2.5rem] space-y-3 relative overflow-hidden ${
                          msg.sender === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : `bg-white/5 border border-white/10 text-slate-200 rounded-tl-none`
                        }`}>
                          <div className="flex justify-between items-center gap-4 mb-1">
                            <div className="flex items-center gap-2">
                              {modelInfo && (
                                <div className={`w-4 h-4 rounded-md flex items-center justify-center bg-${modelInfo.color}-500/20 text-${modelInfo.color}-500`}>
                                  {React.cloneElement(modelInfo.icon as React.ReactElement<{ className?: string }>, { className: 'w-2.5 h-2.5' })}
                                </div>
                              )}
                              <span className={`text-[8px] font-black uppercase tracking-widest ${modelInfo ? `text-${modelInfo.color}-500` : 'opacity-60'}`}>
                                {msg.sender === 'user' ? 'User_Identity' : (modelInfo?.name || msg.sender).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-[8px] font-mono opacity-40">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
                          {msg.attachments && (
                            <div className="flex gap-2 mt-2">
                              {msg.attachments.map((att, i) => (
                                <div key={i} className="px-3 py-1 bg-black/20 rounded-lg text-[9px] flex items-center gap-2">
                                  <Database className="w-3 h-3" /> {att}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {isProcessing && (
                  <div className="flex justify-end">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] rounded-tl-none flex items-center gap-4">
                      <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Processing_Matrix...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-8 bg-black/40 backdrop-blur-md border-t border-white/5 z-20">
                <div className="relative flex items-center gap-4">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 transition-all"
                    title="Upload File"
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                  
                  <button 
                    onClick={handleUndo}
                    disabled={historyStack.length === 0}
                    className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 transition-all disabled:opacity-30"
                    title="Undo Typing"
                  >
                    <Undo2 className="w-5 h-5" />
                  </button>

                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={chatMode === 'shared' ? "تحدث مع كافة النماذج..." : `تحدث مع ${activeTab}...`}
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isProcessing}
                    className="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-blue-900/20 active:scale-90 disabled:opacity-50"
                  >
                    <Send className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Knowledge Bank (Only in Unified View & Desktop) */}
        {viewMode === 'unified' && deviceMode === 'desktop' && (
          <div className="lg:col-span-3 flex flex-col space-y-6 overflow-hidden">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex-1 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Knowledge_Vault</h3>
                <Database className="w-4 h-4 text-blue-500" />
              </div>
              
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                {knowledgeBank.map((entry) => (
                  <div key={entry.id} className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-3 hover:border-blue-500/20 transition-all cursor-pointer">
                    <div className="text-[7px] font-black text-blue-500 uppercase">{entry.source}</div>
                    <h4 className="text-xs font-black text-white leading-tight">{entry.title}</h4>
                    <div className="flex gap-1">
                      {entry.tags.map(t => <span key={t} className="text-[6px] text-slate-600 uppercase">#{t}</span>)}
                    </div>
                  </div>
                ))}
                {knowledgeBank.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center opacity-10 text-center">
                    <Database className="w-12 h-12 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Vault_Empty</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
