
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Language } from '../types';
import { GeminiResponse } from './GeminiResponse';

export const WritingStudio: React.FC<{ language: Language }> = ({ language }) => {
  const [systemInstruction, setSystemInstruction] = useState('أنت مساعد ذكي فائق القدرات مدمج في نظام صارة OS.');
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [thinkingProcess, setThinkingProcess] = useState<string[]>([]);
  
  // Model Parameters (Google AI Studio Style)
  const [model, setModel] = useState('gemini-3-pro-preview');
  const [temperature, setTemperature] = useState(0.7);
  const [thinkingBudget, setThinkingBudget] = useState(16000);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleRun = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setOutput('');
    setThinkingProcess(["جاري تهيئة النواة...", "تحليل تعليمات النظام...", "بدء التوليد النوروني..."]);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: temperature,
          thinkingConfig: model.includes('gemini-3') || model.includes('gemini-2.5') ? { thinkingBudget: thinkingBudget } : undefined
        }
      });

      setOutput(response.text || "لم يتم إنتاج مخرجات.");
      setThinkingProcess(prev => [...prev, "اكتملت المعالجة بنجاح."]);
    } catch (err) {
      console.error(err);
      setOutput("❌ فشل الاتصال بالنواة. تحقق من مفتاح API أو إعدادات النموذج.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0b0b] text-[#e3e3e3] font-arabic overflow-hidden min-h-screen border border-white/5 rounded-[3rem] shadow-4xl mb-40">
      
      {/* Top Header Bar */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-[#111111] z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
             <span className="text-white font-black text-xl">S</span>
          </div>
          <h2 className="text-lg font-black tracking-tight text-white uppercase">Sarah <span className="text-blue-500">AI Studio</span></h2>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{model}</span>
           </div>
           <button 
             onClick={handleRun}
             disabled={loading || !prompt.trim()}
             className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-full font-black text-sm transition-all shadow-xl flex items-center gap-3 active:scale-95"
           >
             {loading ? 'Processing...' : 'Run'}
             {!loading && <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
           </button>
           <button 
             onClick={() => setIsSettingsOpen(!isSettingsOpen)}
             className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all md:hidden"
           >
             ⚙️
           </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-[#0f0f0f]">
           
           {/* System Instruction Field */}
           <div className="p-8 border-b border-white/5 bg-black/20">
              <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-3 mr-2">System Instruction</label>
              <textarea 
                value={systemInstruction}
                onChange={(e) => setSystemInstruction(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-300 focus:outline-none focus:border-blue-500/40 transition-all resize-none h-20 text-right"
                placeholder="أدخل تعليمات النظام هنا لتوجيه سلوك الذكاء..."
              />
           </div>

           {/* Workspace: Prompts & Responses */}
           <div className="flex-1 p-8 space-y-10">
              
              {/* Prompt Input */}
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-xs">👤</div>
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">User Prompt</span>
                 </div>
                 <textarea 
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   placeholder="اكتب توجيهك البرمجي أو الإبداعي هنا..."
                   className="w-full bg-transparent border-none focus:ring-0 text-2xl text-white placeholder:text-slate-800 text-right min-h-[150px] resize-none overflow-hidden"
                   onInput={(e) => {
                     const target = e.target as HTMLTextAreaElement;
                     target.style.height = 'auto';
                     target.style.height = target.scrollHeight + 'px';
                   }}
                 />
              </div>

              {/* AI Output Area */}
              {(output || loading) && (
                <div className="space-y-6 pt-10 border-t border-white/5">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs">S</div>
                      <span className="text-xs font-black text-blue-500 uppercase tracking-widest">Model Response</span>
                   </div>
                   
                   {loading && (
                      <div className="space-y-3 opacity-50 animate-pulse">
                         <div className="h-4 w-full bg-white/5 rounded-full"></div>
                         <div className="h-4 w-5/6 bg-white/5 rounded-full"></div>
                      </div>
                   )}

                   {output && (
                      <div className="animate-fadeIn">
                         <GeminiResponse content={output} thoughtProcess={thinkingProcess} />
                      </div>
                   )}
                </div>
              )}
           </div>
        </div>

        {/* Sidebar Controls (Studio Settings) */}
        <aside className={`${isSettingsOpen ? 'fixed inset-0 z-[100] bg-black p-10 pt-24' : 'hidden'} md:flex md:static md:w-[320px] border-r md:border-r-0 md:border-l border-white/10 bg-[#111111] flex-col gap-10 p-8 overflow-y-auto no-scrollbar shadow-2xl`}>
           <div className="flex justify-between items-center md:hidden mb-6">
              <h3 className="text-xl font-black">إعدادات النموذج</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-2xl">✕</button>
           </div>

           <div className="space-y-8">
              {/* Model Select */}
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">Model Selection</label>
                 <select 
                   value={model}
                   onChange={(e) => setModel(e.target.value)}
                   className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                 >
                    <option value="gemini-3-pro-preview">Gemini 3 Pro (Advanced)</option>
                    <option value="gemini-3-flash-preview">Gemini 3 Flash (Fast)</option>
                    <option value="gemini-2.5-flash-lite-latest">Gemini Lite (Efficient)</option>
                 </select>
              </div>

              {/* Thinking Budget Slider */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Thinking Budget</label>
                    <span className="text-xs font-mono text-blue-400">{thinkingBudget}</span>
                 </div>
                 <input 
                   type="range" min="0" max="32768" step="1024"
                   value={thinkingBudget}
                   onChange={(e) => setThinkingBudget(parseInt(e.target.value))}
                   className="w-full accent-blue-600 h-1 bg-white/5 rounded-full appearance-none cursor-pointer"
                 />
                 <p className="text-[9px] text-slate-600 italic">رفع الميزانية يحسن التحليل المنطقي والبرمجي.</p>
              </div>

              {/* Temperature Slider */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Temperature</label>
                    <span className="text-xs font-mono text-blue-400">{temperature}</span>
                 </div>
                 <input 
                   type="range" min="0" max="2" step="0.1"
                   value={temperature}
                   onChange={(e) => setTemperature(parseFloat(e.target.value))}
                   className="w-full accent-blue-600 h-1 bg-white/5 rounded-full appearance-none cursor-pointer"
                 />
                 <div className="flex justify-between text-[8px] font-bold text-slate-700 uppercase">
                    <span>Precise</span>
                    <span>Creative</span>
                 </div>
              </div>

              <div className="pt-10 border-t border-white/5">
                 <div className="p-4 bg-blue-600/5 border border-blue-500/20 rounded-2xl">
                    <h4 className="text-[10px] font-black text-blue-500 uppercase mb-2">Safety Settings</h4>
                    <p className="text-[9px] text-slate-500 leading-relaxed">النموذج يعمل تحت بروتوكول السيادة V12 مع فلاتر أمان مخصصة لضمان النزاهة التقنية.</p>
                 </div>
              </div>
           </div>

           <div className="mt-auto opacity-20 text-center">
              <span className="text-[8px] font-black uppercase tracking-[0.4em]">Powered_By_Google_GenAI</span>
           </div>
        </aside>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
      `}</style>
    </div>
  );
};
