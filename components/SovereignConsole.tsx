
import React, { useState, useRef } from 'react';
import { runSovereignReasoning } from '../services/geminiService';
import { SovereignAnalysis, Language } from '../types';

export const SovereignConsole: React.FC<{ language: Language }> = ({ language }) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SovereignAnalysis | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDeepAnalysis = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const result = await runSovereignReasoning(prompt, language, image || undefined);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fadeIn font-arabic pb-40 px-6">
      
      {/* Strategic Command Header */}
      <div className="bg-[#0c0c0c] border border-blue-500/20 p-12 rounded-[4rem] shadow-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent)]"></div>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
          <div className="flex items-center gap-10">
            <div className="w-24 h-24 bg-blue-600/10 border border-blue-500/30 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-2xl animate-pulse">🏛️</div>
            <div>
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter">التحليل <span className="text-blue-500">الاستراتيجي</span></h2>
              <p className="text-slate-500 font-bold uppercase tracking-[0.4em] mt-2">Sovereign_Logic_Command_Center</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="px-8 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-black text-emerald-500 uppercase flex items-center gap-3">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
               Inference_Stable
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white/[0.02] border border-white/5 rounded-[4rem] p-10 space-y-8 shadow-inner relative">
            <h3 className="text-2xl font-black text-white">تغذية مصفوفة القرار</h3>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="أدخل المعطيات، الأزمة، أو المهمة لتحليلها واستخلاص خطة عمل..."
              className="w-full bg-black/60 border border-white/10 rounded-[3rem] p-10 text-xl text-white h-64 focus:ring-4 focus:ring-blue-500/20 transition-all resize-none text-right placeholder:text-slate-800"
            />

            <div className="flex flex-col md:flex-row items-center gap-6">
              <button 
                onClick={() => fileRef.current?.click()}
                className={`w-full md:w-auto px-12 py-5 rounded-[2rem] border-2 transition-all flex items-center justify-center gap-4 font-black ${image ? 'bg-blue-600 text-white border-blue-400' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
              >
                {image ? 'البيانات المرئية محملة ✅' : 'إرفاق وثائق/صور 📸'}
              </button>
              <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleFile} />
              
              <button 
                onClick={handleDeepAnalysis}
                disabled={loading || !prompt.trim()}
                className="flex-1 py-5 bg-white text-black rounded-[2rem] font-black text-2xl hover:bg-blue-600 hover:text-white transition-all shadow-3xl active:scale-95 disabled:opacity-50"
              >
                {loading ? 'جاري التعليل...' : 'بدء المعالجة الاستراتيجية'}
              </button>
            </div>
          </div>

          {analysis && (
            <div className="bg-blue-600/5 border border-blue-500/20 rounded-[4rem] p-12 animate-slideUp space-y-10 shadow-4xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-2 h-full bg-blue-600"></div>
               <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${analysis.riskAssessment === 'critical' ? 'bg-red-600' : 'bg-emerald-600'} text-white`}>
                      {analysis.riskAssessment} Risk
                    </span>
                    <span className="px-4 py-1 bg-slate-900 rounded-full text-[10px] font-black text-blue-400">Confidence: {analysis.confidenceScore}%</span>
                  </div>
                  <h4 className="text-3xl font-black text-white underline decoration-blue-600 decoration-4 underline-offset-8">الخلاصة التنفيذية</h4>
               </div>
               <p className="text-2xl leading-relaxed text-slate-100 font-medium text-right italic">
                 "{analysis.strategicDecision}"
               </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-black/60 rounded-[4rem] border border-white/5 p-10 h-full min-h-[500px] flex flex-col shadow-inner">
              <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.4em] mb-10 border-b border-white/5 pb-6">Neural_Action_Steps</h3>
              <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar pr-4">
                 {analysis ? analysis.thoughtProcess.map((step, i) => (
                   <div key={i} className="flex gap-6 items-start animate-slideInRight text-right justify-end" style={{ animationDelay: `${i*0.2}s` }}>
                      <div className="flex-1">
                         <div className="text-[10px] text-blue-500 font-black mb-2 uppercase">Step_0{i+1}</div>
                         <p className="text-sm text-slate-300 font-medium leading-relaxed italic">"{step}"</p>
                      </div>
                      <div className="w-1.5 h-10 bg-blue-600/20 rounded-full shrink-0"></div>
                   </div>
                 )) : (
                   <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale text-center gap-10">
                      <div className="text-8xl animate-float">🧠</div>
                      <p className="text-xl font-black uppercase tracking-[0.5em]">Awaiting_Input</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
      <style>{`
        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slideInRight { animation: slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};
