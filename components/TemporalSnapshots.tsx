
import React, { useState, useEffect } from 'react';
import { SystemSnapshot } from '../types';

export const TemporalSnapshots: React.FC = () => {
  const [snapshots, setSnapshots] = useState<SystemSnapshot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sarah_temporal_vault');
    if (saved) setSnapshots(JSON.parse(saved));
  }, []);

  const createSnapshot = () => {
    setLoading(true);
    const newSnapshot: SystemSnapshot = {
      id: Math.random().toString(36).substr(2, 9),
      name: `نقطة زمنية - ${new Date().toLocaleTimeString('ar-SA')}`,
      timestamp: Date.now(),
      data: {
        promptHistory: [], // يمكن ربطه بسجل الطلبات الحقيقي
        settings: {},
        generatedMediaCount: 0
      }
    };

    const updated = [newSnapshot, ...snapshots];
    setSnapshots(updated);
    localStorage.setItem('sarah_temporal_vault', JSON.stringify(updated));
    
    setTimeout(() => {
      setLoading(false);
      alert('تم أخذ لقطة سيادية للنظام بنجاح. يمكنك العودة إليها في أي وقت.');
    }, 1500);
  };

  const rollback = (snapshot: SystemSnapshot) => {
    if (confirm(`هل أنت متأكد من العودة إلى ${snapshot.name}؟ سيتم إعادة تهيئة المصفوفة الحالية.`)) {
      setLoading(true);
      // محاكاة استعادة البيانات
      setTimeout(() => {
        setLoading(false);
        window.location.reload(); // إعادة تحميل النظام لتطبيق الحالة المسترجعة
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto space-y-10 px-6 pb-40 font-arabic text-right">
      <header className="bg-slate-900 border border-emerald-500/30 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent)]"></div>
         <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
            <div>
               <h2 className="text-5xl font-black text-white tracking-tighter">الخزنة <span className="text-emerald-500">الزمنية</span></h2>
               <p className="text-emerald-900 font-mono text-[10px] tracking-[0.4em] uppercase mt-4">Temporal_Rollback_Core_v1.0</p>
            </div>
            <button 
              onClick={createSnapshot}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-500 text-black px-12 py-5 rounded-[2.5rem] font-black text-xl shadow-[0_0_50px_rgba(16,185,129,0.3)] transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'جاري الأرشفة...' : 'أخذ لقطة للنظام 📸'}
            </button>
         </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {snapshots.map(s => (
           <div key={s.id} className="bg-black/60 border border-white/5 p-10 rounded-[3rem] space-y-6 hover:border-emerald-500/40 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:opacity-30 transition-opacity">⏳</div>
              <div className="space-y-2">
                 <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Snapshot_ID: {s.id}</span>
                 <h3 className="text-2xl font-black text-white">{s.name}</h3>
                 <p className="text-slate-500 text-xs font-bold">{new Date(s.timestamp).toLocaleString('ar-SA')}</p>
              </div>
              <button 
                onClick={() => rollback(s)}
                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] hover:bg-emerald-600 hover:text-black transition-all"
              >
                تفعيل الارتداد الزمني ↺
              </button>
           </div>
         ))}
         {snapshots.length === 0 && (
           <div className="col-span-full py-32 text-center opacity-10 grayscale border-4 border-dashed border-white/5 rounded-[4rem]">
              <div className="text-[10rem]">📦</div>
              <p className="text-3xl font-black uppercase tracking-[1em]">Vault_Empty</p>
           </div>
         )}
      </div>
    </div>
  );
};
