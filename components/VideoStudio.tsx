
import React, { useState, useRef, useEffect } from 'react';
import { generateVideoWithVeo, extendVideo, improveVideoPrompt } from '../services/geminiService';
import { GeneratedVideo, Language } from '../types';
import { ApiKeyDialog } from './ApiKeyDialog';
import { CinematicPlayer } from './CinematicPlayer';

export const VideoStudio: React.FC<{ language: Language }> = ({ language }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [loading, setLoading] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<GeneratedVideo | null>(null);
  const [theaterVideo, setTheaterVideo] = useState<GeneratedVideo | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadingMessages = [
    "صارة تقوم بتحليل الأبعاد الدرامية...",
    "جاري استدعاء محرك الرؤية SNV-3...",
    "بناء المشهد الضوئي والظلال...",
    "توليد الحركات الانسيابية للكاميرا...",
    "اللمسات الأخيرة على جودة البث..."
  ];

  const handleImprove = async () => {
    if (!prompt.trim()) return;
    setIsImproving(true);
    try {
      const improved = await improveVideoPrompt(prompt, language);
      setPrompt(improved);
    } catch (err) {
      console.error(err);
    } finally {
      setIsImproving(false);
    }
  };

  const handleImportLocalVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newVideo: GeneratedVideo = {
        id: `local-${Math.random().toString(36).substr(2, 9)}`,
        uri: url,
        prompt: `مستورد محلي: ${file.name}`,
        aspectRatio: '16:9', // القيمة الافتراضية
        resolution: 'Local'
      };
      setVideos([newVideo, ...videos]);
      setSelectedVideo(newVideo);
      // تنظيف المدخلات للسماح برفع نفس الملف مرة أخرى
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    // @ts-ignore
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      setShowKeyDialog(true);
      return;
    }

    setLoading(true);
    let msgIdx = 0;
    setStatusMessage(loadingMessages[0]);
    
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length;
      setStatusMessage(loadingMessages[msgIdx]);
    }, 7000);

    try {
      const uri = await generateVideoWithVeo(prompt, aspectRatio, resolution);
      const newVideo: GeneratedVideo = {
        id: Math.random().toString(36).substr(2, 9),
        uri,
        prompt,
        aspectRatio,
        resolution
      };
      setVideos([newVideo, ...videos]);
      setSelectedVideo(newVideo);
      setPrompt('');
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("Requested entity was not found")) {
        setShowKeyDialog(true);
      } else {
        setStatusMessage("فشل التوليد. تأكد من صلاحية مفتاح الـ API.");
      }
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const lineCount = prompt.split('\n').length;

  return (
    <div className="flex flex-col h-full max-w-full mx-auto bg-[#fdfdfd] min-h-screen font-arabic overflow-y-auto no-scrollbar pb-40">
      {showKeyDialog && <ApiKeyDialog onSuccess={() => setShowKeyDialog(false)} />}
      
      {theaterVideo && (
        <CinematicPlayer media={theaterVideo} onClose={() => setTheaterVideo(null)} />
      )}
      
      <header className="bg-white border-b border-slate-200 px-10 py-6 flex justify-between items-center sticky top-0 z-[100] shadow-sm">
         <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg text-2xl font-black italic">S</div>
            <div>
               <h1 className="text-2xl font-black text-slate-900 tracking-tight">استوديو <span className="text-blue-600">صارة</span> للرؤية</h1>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Neural_Vision_Engine // SNV-3_PRO</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               accept="video/mp4,video/quicktime,video/webm" 
               onChange={handleImportLocalVideo}
            />
            <button 
               onClick={() => fileInputRef.current?.click()}
               className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
            >
               <span>حقن فيديو محلي</span>
               <span>📥</span>
            </button>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
               {['16:9', '9:16'].map(ratio => (
                 <button
                   key={ratio}
                   onClick={() => setAspectRatio(ratio as any)}
                   className={`px-6 py-2 rounded-lg text-[10px] font-black transition-all ${aspectRatio === ratio ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   {ratio === '16:9' ? 'لاندسكيب' : 'بورتريه'}
                 </button>
               ))}
            </div>
            <button 
               onClick={handleGenerate}
               disabled={loading || !prompt.trim()}
               className="bg-slate-900 text-white px-10 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95 disabled:opacity-30"
             >
               {loading ? 'RUNNING...' : 'ACTION 🎬'}
            </button>
         </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row h-full">
         <div className="flex-1 bg-white border-l border-slate-200 flex flex-col relative group min-h-[600px]">
            <div className="flex-1 flex">
               <div className="w-16 bg-slate-50 border-l border-slate-100 flex flex-col items-center py-10 text-[10px] font-mono text-slate-300 select-none">
                  {[...Array(Math.max(30, lineCount))].map((_, i) => (
                    <div key={i} className="leading-[2.5rem] h-10">{String(i + 1).padStart(2, '0')}</div>
                  ))}
               </div>
               
               <textarea
                 ref={textareaRef}
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 placeholder="اكتب سيناريو المشهد هنا بأسلوبك.. (مثال: لقطة علوية لغابة أرجوانية عند الغروب، واقعية سينمائية)..."
                 className="flex-1 bg-transparent p-12 text-3xl font-medium text-slate-800 focus:outline-none resize-none leading-[2.5rem] text-right placeholder:text-slate-100 selection:bg-blue-100"
                 spellCheck={false}
               />
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 p-3 bg-white/80 backdrop-blur-2xl border border-slate-200 rounded-3xl shadow-2xl z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
               <button 
                 onClick={handleImprove}
                 disabled={isImproving || !prompt.trim()}
                 className="flex items-center gap-2 px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-black text-slate-700 hover:bg-white hover:border-blue-400 transition-all"
               >
                 {isImproving ? <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div> : '✨ تحسين السيناريو'}
               </button>
               <div className="h-6 w-px bg-slate-200 mx-2"></div>
               <button 
                 onClick={() => setPrompt('')}
                 className="p-3 text-slate-400 hover:text-red-500 transition-colors"
               >🗑️</button>
               <div className="px-4 text-[10px] font-mono text-slate-400 border-r border-slate-100 pr-6">
                 {prompt.length} chars
               </div>
            </div>

            {loading && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-3xl z-[200] flex flex-col items-center justify-center gap-10 animate-fadeIn">
                 <div className="relative">
                    <div className="w-32 h-32 border-[6px] border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">🎬</div>
                 </div>
                 <div className="text-center space-y-3">
                    <p className="text-4xl font-black text-slate-900 animate-pulse tracking-tighter">{statusMessage}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.5em]">Neural_Simulation_Active</p>
                 </div>
              </div>
            )}
         </div>

         <div className="lg:w-[500px] flex flex-col bg-[#f8f9fa] h-full overflow-hidden border-r border-slate-200">
            <div className="p-8 border-b border-slate-200 flex justify-between items-center bg-white">
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                  المعاينة السينمائية
               </h3>
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SNV-3_Uplink</span>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10">
               {selectedVideo ? (
                 <div className="space-y-8 animate-fadeIn">
                    <div 
                      className="aspect-video bg-black rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white relative group cursor-pointer"
                      onClick={() => setTheaterVideo(selectedVideo)}
                    >
                       <video 
                         key={selectedVideo.uri} 
                         src={selectedVideo.uri} 
                         autoPlay 
                         loop 
                         className="w-full h-full object-contain"
                       />
                       <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-white text-slate-900 px-8 py-3 rounded-full font-black text-xs shadow-3xl">عرض المسرح ⛶</div>
                       </div>
                    </div>
                    
                    <div className="space-y-6 text-right">
                       <p className="text-xl text-slate-800 font-bold italic leading-relaxed">"{selectedVideo.prompt}"</p>
                       <div className="flex gap-3">
                          {selectedVideo.resolution !== 'Local' && (
                             <button 
                               onClick={async () => {
                                 setLoading(true);
                                 setStatusMessage("تمديد الزمن السينمائي...");
                                 try {
                                   const uri = await extendVideo(selectedVideo.uri, "Continue scene", selectedVideo.aspectRatio);
                                   const v = { ...selectedVideo, id: Math.random().toString(36).substr(2,9), uri, prompt: selectedVideo.prompt + " (EXT)" };
                                   setVideos([v, ...videos]);
                                   setSelectedVideo(v);
                                 } catch(e) {} finally { setLoading(false); }
                               }}
                               className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase hover:bg-blue-600 transition-all shadow-xl"
                             >تمديد (+7ث)</button>
                          )}
                          <a 
                            href={selectedVideo.uri} 
                            download 
                            className="p-4 bg-white border border-slate-200 text-slate-900 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center"
                          >📥</a>
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="h-96 border-4 border-dashed border-slate-200 rounded-[4rem] flex flex-col items-center justify-center text-slate-200 gap-6 opacity-40">
                    <div className="text-8xl">🎞️</div>
                    <p className="text-sm font-black uppercase tracking-[0.4em]">Empty_Preview</p>
                 </div>
               )}

               <div className="space-y-6 pt-10 border-t border-slate-200">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">المكتبة (فيديوهات مولدة ومستوردة)</h4>
                  <div className="grid grid-cols-2 gap-4">
                     {videos.map(v => (
                       <button 
                         key={v.id} 
                         onClick={() => setSelectedVideo(v)}
                         className={`aspect-video rounded-3xl overflow-hidden border-4 transition-all relative ${selectedVideo?.id === v.id ? 'border-blue-600 scale-105 shadow-xl' : 'border-white hover:border-blue-100 shadow-sm'}`}
                       >
                          <video src={v.uri} className="w-full h-full object-cover pointer-events-none" />
                          {v.resolution === 'Local' && (
                             <div className="absolute top-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[8px] font-black text-white">LOCAL</div>
                          )}
                       </button>
                     ))}
                  </div>
               </div>
            </div>

            <div className="p-8 bg-white border-t border-slate-200 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
               <div className="flex gap-6">
                  <span>RES: {selectedVideo?.resolution || resolution}</span>
                  <span>SYNC: STABLE</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Neural_Vision_Ready</span>
               </div>
            </div>
         </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};
