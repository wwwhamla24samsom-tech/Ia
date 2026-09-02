
import React, { useState } from 'react';
import { StealthCommand, Language } from '../types';

export const StealthAdmin: React.FC<{ language: Language }> = ({ language }) => {
  const [activeCategory, setActiveCategory] = useState<'beauty' | 'hobby'>('beauty');
  const [logs, setLogs] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const commands: StealthCommand[] = [
    { id: '1', alias: 'تنسيق الحواجب', realFunction: 'CLEAN_KERNEL_TEMP', icon: '🎨', category: 'beauty', dangerLevel: 'low' },
    { id: '2', alias: 'بخاخ تثبيت نفاث', realFunction: 'FORCE_SYSTEM_SYNC', icon: '💨', category: 'beauty', dangerLevel: 'medium' },
    { id: '3', alias: 'تقشير كيميائي عميق', realFunction: 'PURGE_LOG_DATABASE', icon: '🧪', category: 'beauty', dangerLevel: 'high' },
    { id: '4', alias: 'أحمر شفاه قرمزي', realFunction: 'TRIGGER_NEURAL_REBOOT', icon: '💄', category: 'beauty', dangerLevel: 'critical' },
    { id: '5', alias: 'عزف بيانو هادئ', realFunction: 'SUSPEND_ALL_INPUTS', icon: '🎹', category: 'hobby', dangerLevel: 'medium' },
    { id: '6', alias: 'تسلق جبال الألب', realFunction: 'ESCALATE_PRIVILEGES', icon: '🧗', category: 'hobby', dangerLevel: 'critical' },
    { id: '7', alias: 'جمع طوابع نادرة', realFunction: 'EXPORT_PRIVATE_ENCRYPTION_KEYS', icon: '📜', category: 'hobby', dangerLevel: 'high' }
  ];

  const executeCommand = (cmd: StealthCommand) => {
    setIsExecuting(true);
    setLogs(prev => [`[SYSTEM] Executing: ${cmd.realFunction} (Alias: ${cmd.alias})`, ...prev]);
    setTimeout(() => {
      setLogs(prev => [`[SUCCESS] Operation completed via ${cmd.alias} node.`, ...prev]);
      setIsExecuting(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto space-y-10 px-6 pb-40 text-right font-arabic">
      <div className="bg-[#12081a] border-4 border-purple-500/10 p-12 rounded-[4rem] shadow-3xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-20"></div>
         <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
            <div className="flex items-center gap-8">
               <div className="w-24 h-24 bg-pink-600/10 rounded-[2.5rem] border border-pink-500/30 flex items-center justify-center text-6xl shadow-2xl animate-float">💄</div>
               <div>
                  <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">إعدادات <span className="text-pink-400">التجميل</span></h2>
                  <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-4">Stealth_Admin_Controller_v7.2</p>
               </div>
            </div>
            <div className="flex gap-4">
               <button onClick={() => setActiveCategory('beauty')} className={`px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all ${activeCategory === 'beauty' ? 'bg-pink-600 text-white' : 'bg-white/5 text-slate-500'}`}>Beauty_Matrix</button>
               <button onClick={() => setActiveCategory('hobby')} className={`px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all ${activeCategory === 'hobby' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500'}`}>Hobby_Hub</button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {commands.filter(c => c.category === activeCategory).map(cmd => (
              <button
                key={cmd.id}
                onClick={() => executeCommand(cmd)}
                disabled={isExecuting}
                className="bg-white/[0.02] border-2 border-white/5 p-10 rounded-[3.5rem] flex flex-col items-center gap-6 group hover:bg-white/[0.05] hover:border-pink-500/40 transition-all duration-500 shadow-2xl relative overflow-hidden"
              >
                 <div className={`absolute top-0 right-0 w-2 h-full ${cmd.dangerLevel === 'critical' ? 'bg-red-600' : cmd.dangerLevel === 'high' ? 'bg-orange-500' : 'bg-blue-500'} opacity-20 group-hover:opacity-100 transition-opacity`}></div>
                 <div className="text-7xl group-hover:scale-125 transition-transform duration-700">{cmd.icon}</div>
                 <div className="text-center">
                    <h3 className="text-3xl font-black text-white mb-2">{cmd.alias}</h3>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">ID: {cmd.id} // SEC_LVL: {cmd.dangerLevel}</span>
                 </div>
                 <div className="mt-4 px-6 py-2 bg-white/5 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-pink-400">تطبيق التعديلات ✨</div>
              </button>
            ))}
         </div>

         <div className="lg:col-span-4 bg-black/80 rounded-[4rem] border border-white/5 p-10 flex flex-col shadow-inner">
            <h3 className="text-xs font-black text-pink-500 uppercase tracking-[0.4em] mb-10 border-b border-white/5 pb-8">سجل المعالجة المتخفي</h3>
            <div className="flex-1 overflow-y-auto no-scrollbar font-mono text-[10px] space-y-4 dir-ltr text-left">
               {logs.map((log, i) => (
                 <div key={i} className={`animate-fadeIn pl-4 border-l-2 ${log.includes('SUCCESS') ? 'border-emerald-500 text-emerald-400' : log.includes('Executing') ? 'border-blue-500 text-blue-400' : 'border-slate-800 text-slate-600'}`}>
                    {log}
                 </div>
               ))}
               {logs.length === 0 && <div className="text-slate-800 italic py-20 text-center uppercase tracking-widest">System_Awaiting_Disguised_Command</div>}
            </div>
            {isExecuting && (
              <div className="mt-8 flex items-center justify-center gap-4 animate-pulse">
                 <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                 <span className="text-[10px] font-black text-pink-500 uppercase">Synchronizing_Beauty_Parameters...</span>
              </div>
            )}
         </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
