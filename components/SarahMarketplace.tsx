
import React, { useState, useEffect } from 'react';
import { analyzeMarketplaceSystem } from '../services/geminiService';
import { SystemExtension, Language } from '../types';

export const SarahMarketplace: React.FC<{ language: Language }> = ({ language }) => {
  const [extensions, setExtensions] = useState<SystemExtension[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'security' | 'logic' | 'creative'>('all');

  useEffect(() => {
    loadExtensions();
  }, []);

  const loadExtensions = async () => {
    setLoading(true);
    try {
      const data = await analyzeMarketplaceSystem(language);
      setExtensions(data.map(ext => ({ ...ext, installed: false })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInstall = (id: string) => {
    setExtensions(prev => prev.map(ext => 
      ext.id === id ? { ...ext, installed: !ext.installed } : ext
    ));
    // Simulation of credit deduction or license activation
    alert('تم دمج القدرة بنجاح في مصفوفة صارة v15');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 animate-fadeIn font-arabic pb-40">
      
      {/* Marketplace Header (Gen 8 Golden) */}
      <div className="text-center space-y-8 pt-10">
        <div className="inline-block px-8 py-2 bg-amber-600/10 border border-amber-500/20 rounded-full text-[10px] font-black text-amber-500 uppercase tracking-[0.5em] mb-4">Sarah_Neural_Store_v1.0</div>
        <h2 className="text-9xl font-black text-white tracking-tighter uppercase leading-none">سوق <span className="text-amber-500">القدرات</span></h2>
        <p className="text-slate-500 text-3xl font-medium tracking-wide max-w-4xl mx-auto italic">
          "مصفوفة صارة تتوسع.. قم بدمج وحدات استخباراتية وبرمجية فائقة لتصل لدرجة السيادة المطلقة."
        </p>
      </div>

      {/* Modern Luxury Filters */}
      <div className="flex justify-center gap-4 bg-[#0a0a0a] p-3 rounded-[2.5rem] w-fit mx-auto border border-white/5 shadow-3xl">
        {['all', 'security', 'logic', 'creative'].map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f as any)}
            className={`px-12 py-4 rounded-[1.8rem] text-xs font-black uppercase transition-all tracking-widest ${activeFilter === f ? 'bg-amber-600 text-black shadow-[0_0_30px_rgba(245,158,11,0.4)] scale-110' : 'text-slate-500 hover:text-white'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-48 flex flex-col items-center gap-12">
           <div className="w-20 h-20 border-8 border-amber-500/20 border-t-amber-500 rounded-full animate-spin shadow-[0_0_50px_rgba(245,158,11,0.2)]"></div>
           <p className="text-amber-900 font-black uppercase tracking-[1em] animate-pulse text-sm">Syncing_With_Matrix_Core...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
           {extensions.filter(e => activeFilter === 'all' || e.category === activeFilter).map(ext => (
             <div key={ext.id} className="bg-[#0c0c0c] border border-white/5 rounded-[4rem] p-12 space-y-10 hover:border-amber-500/40 transition-all duration-700 group shadow-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-l from-transparent via-amber-600/30 to-transparent"></div>
                
                <div className="flex justify-between items-start">
                   <div className="w-24 h-24 bg-amber-600/5 rounded-[2.5rem] flex items-center justify-center text-5xl border border-amber-500/10 shadow-inner group-hover:scale-110 transition-transform duration-700">
                      {ext.icon}
                   </div>
                   <div className="text-right">
                      <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${ext.price === 'free' ? 'bg-emerald-600/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-600 text-black shadow-2xl'}`}>
                         {ext.price === 'free' ? 'CORE_FREE' : `${ext.price}$ PRIME`}
                      </span>
                      <p className="text-[10px] text-slate-700 font-mono mt-4">SERIAL_{ext.id.toUpperCase()}</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="text-3xl font-black text-white group-hover:text-amber-400 transition-colors uppercase tracking-tighter">{ext.name}</h3>
                   <p className="text-slate-400 text-lg leading-relaxed font-medium line-clamp-4 italic border-r-2 border-amber-600/20 pr-6">"{ext.description}"</p>
                </div>

                <button 
                  onClick={() => handleInstall(ext.id)}
                  className={`w-full py-7 rounded-[2rem] font-black text-xl transition-all active:scale-95 flex items-center justify-center gap-4 ${ext.installed ? 'bg-emerald-600 text-white shadow-[0_0_40px_rgba(16,185,129,0.3)]' : 'bg-white text-black hover:bg-amber-500 shadow-3xl group-hover:scale-[1.02]'}`}
                >
                   {ext.installed ? '✓ INTEGRATED' : ext.price === 'free' ? 'تثبيت القدرة' : 'شراء وتفعيل القدرة'}
                   {!ext.installed && <span className="text-2xl animate-pulse">⚡</span>}
                </button>
             </div>
           ))}
        </div>
      )}

      {/* Gen 8 Footer Branding */}
      <footer className="py-24 text-center space-y-8 opacity-20 group hover:opacity-50 transition-opacity duration-1000">
         <div className="text-6xl font-black text-white tracking-tighter">S</div>
         <p className="text-[11px] font-black text-slate-500 uppercase tracking-[1.5em]">Sarah_Marketplace // Sovereign_Systems // Generation_8_Meta</p>
      </footer>
    </div>
  );
};
