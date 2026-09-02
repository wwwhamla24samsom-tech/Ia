
import React, { useState, useRef } from 'react';
import { generateImageWithSarah, editImageWithSarah } from '../services/geminiService';
import { GeneratedImage } from '../types';
import { ApiKeyDialog } from './ApiKeyDialog';
import { CinematicPlayer } from './CinematicPlayer';

export const ImageStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [error, setError] = useState('');
  const [theaterMedia, setTheaterMedia] = useState<GeneratedImage | null>(null);
  
  const [editingImage, setEditingImage] = useState<GeneratedImage | null>(null);
  const [aiEditPrompt, setAiEditPrompt] = useState('');
  const [filters, setFilters] = useState({
    brightness: 100, contrast: 100, grayscale: 0, sepia: 0, hueRotate: 0, saturate: 100, blur: 0
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // @ts-ignore
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      setShowKeyDialog(true);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const url = await generateImageWithSarah(prompt, size);
      const newImg = { url, prompt, size };
      setImages([newImg, ...images]);
      setPrompt('');
    } catch (err: any) {
      if (err.message.includes("API_KEY_INVALID")) {
        setShowKeyDialog(true);
      } else {
        setError(err.message || "فشل توليد الصورة.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getFilterString = () => 
    `brightness(${filters.brightness}%) contrast(${filters.contrast}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) hue-rotate(${filters.hueRotate}deg) saturate(${filters.saturate}%) blur(${filters.blur}px)`;

  const handleAiEdit = async () => {
    if (!editingImage || !aiEditPrompt.trim()) return;
    setEditLoading(true);
    try {
      const resultUrl = await editImageWithSarah(editingImage.url, aiEditPrompt, 'ar');
      const updatedImg = { ...editingImage, url: resultUrl, prompt: aiEditPrompt };
      setEditingImage(updatedImg);
      setImages(prev => prev.map(img => img.url === editingImage.url ? updatedImg : img));
      setAiEditPrompt('');
    } catch (err: any) {
      alert("فشل التعديل الذكي: " + err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const downloadModifiedImage = () => {
    if (!editingImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = editingImage.url;
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.filter = getFilterString();
        ctx.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.download = `sarah_retouch_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto space-y-8 px-6 pb-40 text-right font-arabic">
      {showKeyDialog && <ApiKeyDialog onSuccess={() => setShowKeyDialog(false)} />}
      
      {theaterMedia && (
        <CinematicPlayer media={theaterMedia} onClose={() => setTheaterMedia(null)} />
      )}
      
      <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-purple-100 -mt-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse"></div>
        <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center justify-end gap-4">
           استوديو صارة الإبداعي
           <span className="p-3 bg-purple-600 text-white rounded-2xl shadow-lg">🎨</span>
        </h2>
        
        <form onSubmit={handleGenerate} className="space-y-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="صِف الصورة التي تتخيلها... ستقوم صارة بتحويل كلماتك إلى واقع بصري."
            className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-8 py-6 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all h-32 resize-none text-xl font-medium placeholder:text-slate-300 shadow-inner"
          />
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center bg-slate-100 p-2 rounded-2xl gap-2">
              {(['1K', '2K', '4K'] as const).map((s) => (
                <button key={s} type="button" onClick={() => setSize(s)} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${size === s ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>
                  {s}
                </button>
              ))}
            </div>
            <button
              disabled={loading}
              className="bg-purple-600 text-white px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-purple-700 disabled:bg-blue-300 transition-all shadow-xl shadow-purple-500/20 flex items-center gap-3"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "توليد صورة سحرية ✨"}
            </button>
          </div>
          {error && <p className="text-red-500 font-bold text-sm">{error}</p>}
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((img, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-100 group cursor-pointer hover:scale-[1.02] transition-all relative"
          >
            <div className="aspect-square bg-slate-100 relative">
              <img src={img.url} alt={img.prompt} className="w-full h-full object-cover group-hover:brightness-75 transition-all" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                 <button onClick={() => setTheaterMedia(img)} className="bg-white text-black px-6 py-3 rounded-full font-black text-xs shadow-2xl">المعرض السينمائي ⛶</button>
                 <button onClick={() => setEditingImage(img)} className="bg-purple-600 text-white px-6 py-3 rounded-full font-black text-xs shadow-2xl">تعديل بالذكاء ⚙️</button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 font-medium line-clamp-2 leading-relaxed">{img.prompt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* مودال التعديل الاحترافي */}
      {editingImage && (
        <div className="fixed inset-0 z-[3000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 lg:p-12 animate-fadeIn">
          <div className="bg-[#121212] w-full max-w-7xl h-full lg:h-[90vh] rounded-[4rem] border border-white/10 overflow-hidden flex flex-col lg:flex-row shadow-[0_0_100px_rgba(147,51,234,0.2)]">
            
            {/* منطقة العرض والمعاينة الحية */}
            <div className="flex-1 bg-black relative flex items-center justify-center p-8 group">
              <img 
                src={editingImage.url} 
                style={{ filter: getFilterString() }}
                className="max-w-full max-h-full rounded-3xl shadow-4xl transition-all duration-300"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="absolute top-8 left-8 flex gap-4">
                 <button onClick={() => setEditingImage(null)} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-red-600 transition-all">✕</button>
              </div>
            </div>

            {/* لوحة التحكم الجانبية */}
            <div className="lg:w-[450px] bg-[#1a1a1a] border-r border-white/5 p-10 flex flex-col gap-10 overflow-y-auto no-scrollbar scroll-smooth">
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-white">مختبر التعديل</h3>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Neural_Retouch_v4.2</p>
              </div>

              {/* فلاتر التحكم اليدوي */}
              <div className="space-y-8">
                {[
                  { id: 'brightness', label: 'السطوع', min: 0, max: 200 },
                  { id: 'contrast', label: 'التباين', min: 0, max: 200 },
                  { id: 'saturate', label: 'التشبع', min: 0, max: 200 },
                  { id: 'hueRotate', label: 'درجة اللون', min: 0, max: 360 },
                  { id: 'blur', label: 'الضبابية', min: 0, max: 20 },
                  { id: 'grayscale', label: 'أبيض وأسود', min: 0, max: 100 },
                  { id: 'sepia', label: 'كلاسيكي', min: 0, max: 100 },
                ].map(f => (
                  <div key={f.id} className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                       <span>{f.label}</span>
                       <span className="text-purple-500 font-mono">{(filters as any)[f.id]}</span>
                    </div>
                    <input 
                      type="range" 
                      min={f.min} 
                      max={f.max} 
                      value={(filters as any)[f.id]}
                      onChange={(e) => setFilters({...filters, [f.id]: parseInt(e.target.value)})}
                      className="w-full accent-purple-500 h-1 bg-white/5 rounded-full appearance-none cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              {/* التعديل بالذكاء الاصطناعي */}
              <div className="pt-8 border-t border-white/5 space-y-6">
                <h4 className="text-sm font-black text-purple-500 uppercase tracking-widest">التعديل النوروني (AI Infill)</h4>
                <div className="relative">
                  <textarea 
                    value={aiEditPrompt}
                    onChange={(e) => setAiEditPrompt(e.target.value)}
                    placeholder="اطلب تعديلاً ذكياً.. (مثال: أضف نظارات شمسية للشخصية)"
                    className="w-full bg-black border border-white/10 rounded-2xl p-4 text-xs text-white h-24 resize-none focus:outline-none focus:border-purple-500 transition-all"
                  />
                  <button 
                    onClick={handleAiEdit}
                    disabled={editLoading || !aiEditPrompt.trim()}
                    className="absolute bottom-3 left-3 bg-purple-600 text-white px-6 py-2 rounded-xl text-[10px] font-black hover:bg-purple-500 disabled:opacity-30 transition-all"
                  >
                    {editLoading ? 'جاري المعالجة...' : 'تعديل بالذكاء ✨'}
                  </button>
                </div>
              </div>

              {/* أزرار الإجراءات النهائية */}
              <div className="mt-auto pt-10 flex flex-col gap-4">
                 <button 
                  onClick={downloadModifiedImage}
                  className="w-full py-5 bg-white text-black rounded-2xl font-black text-lg hover:bg-purple-500 hover:text-white transition-all shadow-4xl flex items-center justify-center gap-3"
                 >
                   <span>حفظ وتحميل النتيجة</span>
                   <span className="text-xl">📥</span>
                 </button>
                 <button 
                  onClick={() => setFilters({brightness: 100, contrast: 100, grayscale: 0, sepia: 0, hueRotate: 0, saturate: 100, blur: 0})}
                  className="w-full py-4 bg-white/5 border border-white/10 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-white transition-all"
                 >إعادة ضبط الفلاتر ↺</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
