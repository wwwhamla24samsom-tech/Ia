
import React, { useState, useRef } from 'react';
import { analyzeVisionImage } from '../services/geminiService';
import { VisionAnalysisResult, Language } from '../types';

export const VisionLab: React.FC<{ language: Language }> = ({ language }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VisionAnalysisResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const data = await analyzeVisionImage(image, language);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("⚠️ فشل التحليل البصري. تحقق من جودة الصورة.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn font-arabic pb-40">
      
      {/* Vision Header */}
      <div className="bg-slate-950/80 backdrop-blur-3xl border border-cyan-500/30 p-12 rounded-[4rem] shadow-[0_0_120px_rgba(6,182,212,0.1)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05),transparent)]"></div>
        <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
          <div className="flex items-center gap-10">
            <div className={`w-24 h-24 rounded-[3rem] border-2 flex items-center justify-center text-5xl transition-all duration-1000 ${loading ? 'bg-cyan-600 border-cyan-400 shadow-[0_0_60px_rgba(6,182,212,0.6)] animate-spin' : 'bg-slate-900 border-white/10'}`}>
               👁️
            </div>
            <div>
              <h2 className="text-6xl font-black text-white tracking-tighter uppercase">مختبر <span className="text-cyan-400">الرؤية</span></h2>
              <p className="text-slate-500 font-bold uppercase tracking-[0.4em] mt-3">Neural_Visual_Intelligence_V12</p>
            </div>
          </div>
          
          <div className="flex gap-6">
             <button 
               onClick={() => fileRef.current?.click()}
               className="px-12 py-5 bg-white/5 border border-white/10 rounded-[2rem] text-xs font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-4"
             >
               {image ? 'تغيير الصورة 📸' : 'رفع عينة بصرية 📤'}
             </button>
             <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Visual Input Zone */}
        <div className="lg:col-span-7 space-y-8">
           <div className="bg-black/60 rounded-[4rem] border border-white/5 p-4 relative overflow-hidden h-[650px] shadow-3xl flex items-center justify-center group">
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
              
              {image ? (
                <div className="relative w-full h-full p-6 animate-fadeIn">
                   <img src={image} className="w-full h-full object-contain rounded-[3rem] shadow-2xl transition-all duration-1000 group-hover:scale-[1.02]" alt="Neural Sample" />
                   
                   {/* Scanning Line Overlay */}
                   {loading && (
                     <div className="absolute inset-x-0 top-0 h-[2px] bg-cyan-400 shadow-[0_0_20px_cyan] animate-scanline z-20"></div>
                   )}
                   
                   {!loading && !result && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={handleAnalyze}
                          className="bg-white text-black px-16 py-6 rounded-full font-black text-2xl shadow-3xl hover:bg-cyan-400 transition-all active:scale-95"
                        >
                          بدء المسح النوروني ⚡
                        </button>
                     </div>
                   )}
                </div>
              ) : (
                <div 
                  onClick={() => fileRef.current?.click()}
                  className="flex flex-col items-center justify-center opacity-10 grayscale pointer-events-none gap-10 hover:opacity-100 transition-all cursor-pointer"
                >
                   <div className="text-[14rem] animate-float">📸</div>
                   <p className="text-4xl font-black uppercase tracking-[1em]">Awaiting_Neural_Input</p>
                </div>
              )}
           </div>
        </div>

        {/* Intelligence Brief Side */}
        <div className="lg:col-span-5 space-y-8">
           {result ? (
             <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[4rem] border border-cyan-500/20 p-12 space-y-12 animate-slideInRight shadow-2xl h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-500/40"></div>
                
                <div className="space-y-4">
                   <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em]">Objects_Detected</span>
                   <div className="flex flex-wrap gap-3">
                      {result.objects.map((obj, i) => (
                        <div key={i} className="px-6 py-2.5 bg-cyan-600/10 border border-cyan-600/30 rounded-full text-xs font-black text-cyan-400 flex items-center gap-3">
                           <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
                           {obj}
                        </div>
                      ))}
                   </div>
                </div>

                <div className="space-y-6 flex-1">
                   <h3 className="text-3xl font-black text-white">التقرير الاستخباراتي البصري</h3>
                   <p className="text-xl text-slate-300 leading-relaxed italic selection:bg-cyan-500/30">
                     "{result.description}"
                   </p>
                </div>

                <div className="space-y-6 pt-10 border-t border-white/5">
                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Technical_Parameters</span>
                   <ul className="space-y-3">
                      {result.technicalDetails.map((detail, i) => (
                        <li key={i} className="flex items-center gap-4 text-sm text-slate-400">
                           <span className="text-cyan-500 font-mono">[{i+1}]</span> {detail}
                        </li>
                      ))}
                   </ul>
                </div>

                {result.detectedText && (
                   <div className="mt-6 p-8 bg-black/60 rounded-3xl border border-white/5 shadow-inner">
                      <span className="text-[10px] font-black text-blue-400 uppercase mb-4 block">OCR_Text_Extracted</span>
                      <p className="font-mono text-sm text-blue-300 text-left dir-ltr break-words">{result.detectedText}</p>
                   </div>
                )}

                {result.threatAssessment && (
                   <div className="mt-auto pt-8 border-t border-white/5 flex justify-between items-center">
                      <div className="text-right">
                         <span className="text-[9px] font-black text-red-500 uppercase">Assessment</span>
                         <div className="text-lg font-black text-white uppercase">{result.threatAssessment}</div>
                      </div>
                      <div className="text-4xl">🛡️</div>
                   </div>
                )}
             </div>
           ) : (
             <div className="bg-black/40 rounded-[4rem] border border-white/5 p-12 h-full flex flex-col items-center justify-center opacity-5 grayscale pointer-events-none gap-10">
                <div className="text-[10rem] animate-pulse">🧠</div>
                <p className="text-2xl font-black uppercase tracking-[0.5em] text-center">Neural_Logic_Engine_Standby</p>
             </div>
           )}
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        .animate-scanline {
          animation: scanline 3s linear infinite;
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideInRight { animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
