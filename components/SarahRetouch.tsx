
import React, { useState, useRef, useEffect } from 'react';

export const SarahRetouch: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    sepia: 0,
    grayscale: 0,
    hue: 0,
    blur: 0
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const getFilterString = () => `
    brightness(${filters.brightness}%) 
    contrast(${filters.contrast}%) 
    saturate(${filters.saturate}%) 
    sepia(${filters.sepia}%) 
    grayscale(${filters.grayscale}%) 
    hue-rotate(${filters.hue}deg) 
    blur(${filters.blur}px)
  `;

  const handleSave = () => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.filter = getFilterString();
        ctx.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.download = 'sarah_edited_asset.png';
        link.href = canvas.toDataURL();
        link.click();
      }
    };
  };

  return (
    <div className="flex flex-col h-full space-y-10 animate-fadeIn font-arabic text-right pb-40">
      
      {/* Search & Meta Header */}
      <div className="bg-slate-900 border border-white/5 p-8 rounded-[3rem] flex justify-between items-center shadow-2xl">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-purple-600/10 rounded-2xl flex items-center justify-center text-4xl shadow-xl border border-purple-500/20">📸</div>
            <div>
               <h2 className="text-3xl font-black text-white">محرر <span className="text-purple-500">صارة</span> ريتاتش</h2>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural_Image_Processor // READY</p>
            </div>
         </div>
         <button 
           onClick={() => fileRef.current?.click()}
           className="bg-purple-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase hover:bg-white hover:text-black transition-all shadow-xl"
         >
           رفع صورة للمعالجة 🖼️
         </button>
         <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleUpload} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Visual Canvas Area */}
        <div className="lg:col-span-8 bg-black rounded-[4rem] border-8 border-white/5 min-h-[600px] flex items-center justify-center relative overflow-hidden shadow-4xl group">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-noise.png')] opacity-10"></div>
           
           {image ? (
             <div className="relative p-10 animate-fadeIn flex flex-col items-center">
                <img 
                  src={image} 
                  className="max-w-full max-h-[70vh] rounded-[2rem] shadow-2xl transition-all duration-300" 
                  style={{ filter: getFilterString() }}
                />
                <canvas ref={canvasRef} className="hidden" />
             </div>
           ) : (
             <div className="text-center space-y-8 opacity-20">
                <div className="text-[15rem]">🖼️</div>
                <p className="text-4xl font-black uppercase tracking-[0.5em]">Awaiting_Asset</p>
             </div>
           )}
        </div>

        {/* Control Sidebar */}
        <div className="lg:col-span-4 bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-10 rounded-[4rem] space-y-10 shadow-3xl flex flex-col">
           <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-white">نواة <span className="text-purple-500">التحكم</span></h3>
              <button 
                onClick={() => setFilters({brightness:100, contrast:100, saturate:100, sepia:0, grayscale:0, hue:0, blur:0})}
                className="text-[10px] font-black text-slate-500 uppercase hover:text-white"
              >إعادة تهيئة ↺</button>
           </div>

           <div className="space-y-8 flex-1 overflow-y-auto no-scrollbar pr-2">
              {[
                { id: 'brightness', label: 'السطوع', min: 0, max: 200, unit: '%' },
                { id: 'contrast', label: 'التباين', min: 0, max: 200, unit: '%' },
                { id: 'saturate', label: 'التشبع', min: 0, max: 200, unit: '%' },
                { id: 'hue', label: 'تدرج اللون', min: 0, max: 360, unit: '°' },
                { id: 'blur', label: 'الضبابية', min: 0, max: 15, unit: 'px' },
                { id: 'sepia', label: 'كلاسيك (Sepia)', min: 0, max: 100, unit: '%' },
                { id: 'grayscale', label: 'أبيض وأسود', min: 0, max: 100, unit: '%' },
              ].map(f => (
                <div key={f.id} className="space-y-3">
                   <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                      <span>{f.label}</span>
                      <span className="text-purple-400">{(filters as any)[f.id]}{f.unit}</span>
                   </div>
                   <input 
                      type="range" 
                      min={f.min} 
                      max={f.max} 
                      value={(filters as any)[f.id]}
                      onChange={(e) => setFilters({...filters, [f.id]: parseInt(e.target.value)})}
                      className="w-full accent-purple-600 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                   />
                </div>
              ))}
           </div>

           <div className="pt-10 border-t border-white/5 space-y-4">
              <button 
                onClick={handleSave}
                disabled={!image}
                className="w-full py-6 bg-purple-600 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-purple-500 transition-all flex items-center justify-center gap-4 disabled:opacity-30 active:scale-95"
              >
                 تصدير النتيجة السيادية 📥
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
