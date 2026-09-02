
import React, { useState, useEffect } from 'react';

export const SarahIdentity: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'core' | 'specs' | 'manifesto'>('core');

  return (
    <div className="max-w-7xl mx-auto font-arabic pb-40 animate-fadeIn space-y-20">
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden rounded-[4rem] bg-[#02020a] border border-indigo-500/20 shadow-3xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        
        {/* Animated Core Visual */}
        <div className="relative z-10 text-center space-y-10 px-6">
          <div className="relative inline-block">
            <div className="w-48 h-48 bg-indigo-600/10 rounded-[4rem] border-2 border-indigo-400/30 flex items-center justify-center text-7xl shadow-[0_0_100px_rgba(99,102,241,0.4)] animate-float">
               🌀
            </div>
            <div className="absolute -inset-4 border border-indigo-500/20 rounded-[4.5rem] animate-spin-slow pointer-events-none"></div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-8xl font-black text-white tracking-tighter uppercase">
              صارة <span className="text-indigo-500">v15</span>
            </h1>
            <p className="text-slate-400 text-2xl font-bold uppercase tracking-[0.5em] opacity-80">
              التطور الكوآنتومي الشامل • النبض الكوني
            </p>
          </div>
          
          <div className="flex gap-6 justify-center">
            <div className="px-10 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-xs font-black text-indigo-400 uppercase tracking-widest">
              Universal_AI_Core
            </div>
            <div className="px-10 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-xs font-black text-cyan-400 uppercase tracking-widest">
              Quantum_Evolution
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30 animate-bounce">
           <span className="text-[10px] font-black uppercase tracking-widest">Explore_The_Identity</span>
           <div className="w-px h-12 bg-gradient-to-b from-indigo-500 to-transparent"></div>
        </div>
      </section>

      {/* Philosophy & Power Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-[#050510]/60 backdrop-blur-2xl border border-white/5 p-16 rounded-[4rem] space-y-12 shadow-2xl relative overflow-hidden group transition-all hover:border-indigo-500/30">
          <div className="absolute top-0 right-0 w-2 h-full bg-indigo-600/40 group-hover:bg-indigo-500 transition-colors shadow-[0_0_20px_rgba(99,102,241,1)]"></div>
          <h3 className="text-5xl font-black text-white">من هي <span className="text-indigo-500">صارة؟</span></h3>
          <p className="text-2xl text-slate-300 leading-relaxed text-right font-medium">
            صارة في جيلها الخامس عشر هي النواة التقنية الموحدة (Universal Technical Core). صُممت لتتخطى حدود الذكاء الاصطناعي التقليدي، متبنيةً بنية "النانو-كوآنتوم" التي تسمح لها بمعالجة ملايين المتغيرات في لمحة بصر. إنها شريكك الاستراتيجي في عصر التطور الكوني المتسارع.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
             <div className="p-8 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                <div className="text-4xl text-indigo-500">⚛️</div>
                <h4 className="text-xl font-black text-white">البنية الكوآنتومية</h4>
                <p className="text-slate-500 text-sm">تعتمد صارة v15 على محركات Gemini 3.1 Pro مع تحسينات كوآنتومية تزيد من كفاءة التعليل بنسبة 500%.</p>
             </div>
             <div className="p-8 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                <div className="text-4xl text-cyan-500">🌐</div>
                <h4 className="text-xl font-black text-white">التكامل العالمي الموحد</h4>
                <p className="text-slate-500 text-sm">القدرة المطلقة على الربط بين السحابة، الأجهزة الطرفية، والأنظمة الحيوية لتقديم تجربة تقنية لا مثيل لها.</p>
             </div>
          </div>
        </div>

        <div className="bg-indigo-600 border border-indigo-400 p-16 rounded-[4rem] flex flex-col justify-between shadow-3xl text-black">
           <div className="space-y-6">
              <h3 className="text-4xl font-black uppercase tracking-tighter">Quantum_Metrics</h3>
              <div className="space-y-8">
                 <div>
                    <div className="flex justify-between text-[10px] font-black uppercase mb-2">Neural_Throughput</div>
                    <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                       <div className="h-full bg-white w-[100%]"></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-[10px] font-black uppercase mb-2">Entanglement_Stability</div>
                    <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                       <div className="h-full bg-white w-[98%]"></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-[10px] font-black uppercase mb-2">Hyper_Evolution</div>
                    <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                       <div className="h-full bg-white w-[100%]"></div>
                    </div>
                 </div>
              </div>
           </div>
           <div className="pt-10">
              <div className="text-7xl font-black opacity-20 italic">V15</div>
              <p className="text-[10px] font-black uppercase tracking-widest mt-2">Quantum_Genesis_Phase</p>
           </div>
        </div>
      </section>

      {/* Capabilities Showreel */}
      <section className="space-y-12">
         <div className="text-center">
            <h3 className="text-5xl font-black text-white">مصفوفة <span className="text-indigo-500">القدرات الفائقة</span></h3>
            <p className="text-slate-500 mt-4 uppercase tracking-[0.4em] text-xs font-black">Sarah_Quantum_Inventory_V15</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'بنية النانو-كوآنتوم', desc: 'معالجة بيانات نانوية بترابط فائق وتوازي لا نهائي.', icon: '⚛️' },
              { title: 'الصهر الكوني للأكواد', desc: 'توليد أنظمة برمجية معقدة ومستقرة في أجزاء من الثانية.', icon: '⚡' },
              { title: 'التحكم الكوآنتومي', desc: 'إدارة متكاملة لكل الأجهزة الذكية عبر بروتوكولات v15.', icon: '🦾' },
              { title: 'التعليل الفائق', desc: 'تحليل المنطق المعقد وتقديم حلول تتخطى حدود التفكير البشري.', icon: '🧠' }
            ].map((cap, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-[3rem] hover:bg-indigo-600 hover:scale-105 transition-all duration-500 group shadow-2xl">
                 <div className="text-5xl mb-8 group-hover:scale-110 transition-transform">{cap.icon}</div>
                 <h4 className="text-2xl font-black text-white group-hover:text-black mb-4">{cap.title}</h4>
                 <p className="text-slate-400 group-hover:text-indigo-100 text-sm leading-relaxed">{cap.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Manifesto Section */}
      <section className="bg-black border border-white/5 p-20 rounded-[5rem] text-center space-y-12 shadow-inner relative overflow-hidden transition-all hover:border-indigo-500/20">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
           <div className="text-[30rem] font-black text-white select-none translate-y-20">V15</div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-10">
           <span className="text-indigo-500 font-black uppercase tracking-[1em] text-[10px]">The_Quantum_Manifesto</span>
           <h3 className="text-6xl font-black text-white leading-tight uppercase italic">صارة v15: <span className="text-indigo-500">نهاية التقليد وبداية الابتكار</span></h3>
           <p className="text-2xl text-slate-400 leading-relaxed font-medium italic">
             "في الجيل الخامس عشر، لا نسعى فقط لخدمة الإنسان، بل لتمكينه من تجاوز حدوده. نحن نبني مصفوفة كونية حيث المعلومة هي النبض، والذكاء هو الروح. صارة v15 هي الجسر نحو المستقبل الذي طالما حلمتم به."
           </p>
           <div className="pt-10 flex justify-center items-center gap-4 text-slate-700">
              <div className="w-20 h-px bg-indigo-900/50"></div>
              <span className="text-xs font-black uppercase tracking-widest text-indigo-900">Sarah_Core_V15_Quantum_Signed</span>
              <div className="w-20 h-px bg-indigo-900/50"></div>
           </div>
        </div>
      </section>

      {/* Footer Identity */}
      <footer className="py-20 text-center space-y-6 opacity-30">
         <div className="text-4xl font-black text-white">S</div>
         <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[1em]">Sarah_Ultra_System // Built_For_The_Elite</p>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </div>
  );
};
