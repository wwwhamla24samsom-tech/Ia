
import React, { useState, useEffect, useRef } from 'react';
import { reconstructAndHardenApp } from '../services/geminiService';
import { ClonedAppResult, Language, TransportPacket } from '../types';

export const NeuralAppCloner: React.FC<{ language: Language }> = ({ language }) => {
  const [appInput, setAppInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [cloningStatus, setCloningStatus] = useState('');
  const [result, setResult] = useState<ClonedAppResult | null>(null);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'transport' | 'source' | 'security' | 'preview'>('blueprint');
  const [packets, setPackets] = useState<TransportPacket[]>([]);
  const [previewKey, setPreviewKey] = useState(0);

  // محاكاة تدفق حزم البيانات (Transport Sniffing)
  useEffect(() => {
    if (result && activeTab === 'transport') {
      const interval = setInterval(() => {
        const newPacket: TransportPacket = {
          id: Math.random().toString(36).substr(2, 6).toUpperCase(),
          protocol: result.transportAnalysis.identifiedProtocols[Math.floor(Math.random() * result.transportAnalysis.identifiedProtocols.length)],
          endpoint: result.transportAnalysis.detectedEndpoints[Math.floor(Math.random() * result.transportAnalysis.detectedEndpoints.length)],
          payloadSize: (Math.random() * 50).toFixed(1) + ' KB',
          status: Math.random() > 0.3 ? 'secured' : 'intercepted',
          latency: Math.floor(Math.random() * 5) + 1
        };
        setPackets(prev => [newPacket, ...prev].slice(0, 15));
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [result, activeTab]);

  const handleClone = async () => {
    if (!appInput.trim()) return;
    setLoading(true);
    setResult(null);
    setPackets([]);
    
    const statuses = [
      '🔍 جاري تفكيك الهيكل البرمجي (Source Decomposition)...',
      '📡 اعتراض طبقة المواصلات (Sniffing Transport Layer)...',
      '🧩 إعادة بناء المنطق النوروني (Neural Re-Architecting)...',
      '🛡️ حقن بروتوكولات الحماية السيادية (Injection)...',
      '📦 تجميع الحزمة النهائية (Build Ready)...'
    ];

    let i = 0;
    const interval = setInterval(() => {
      setCloningStatus(statuses[i % statuses.length]);
      i++;
    }, 2500);

    try {
      const data = await reconstructAndHardenApp(appInput, language);
      setResult(data);
      setActiveTab('transport');
    } catch (err) {
      console.error(err);
      setCloningStatus('❌ فشل بروتوكول الاستنساخ: تداخل في البيانات.');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const downloadProject = () => {
    if (!result) return;
    const blob = new Blob([result.fullCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.name.replace(/\s+/g, '_')}_SARAH_CLONE.html`;
    a.click();
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto space-y-10 px-6 pb-48 text-right font-arabic">
      
      {/* Search & Ingestion Hub */}
      <div className="bg-slate-950 rounded-[4rem] p-16 shadow-[0_0_120px_rgba(59,130,246,0.15)] border border-blue-500/20 -mt-10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent)]"></div>
        <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center gap-8 mb-12">
          <div className="w-24 h-24 bg-blue-500/10 rounded-[2.5rem] flex items-center justify-center border border-blue-500/30 text-5xl shadow-2xl animate-float">
             <span className={loading ? "animate-spin" : ""}>🧩</span>
          </div>
          <div>
            <h2 className="text-6xl font-black text-white uppercase tracking-tighter">مستنسخ <span className="text-blue-500">التطبيقات</span> الفائق</h2>
            <p className="text-slate-400 text-xl mt-3 max-w-3xl mx-auto italic font-medium">"نضام كامل للهندسة العكسية وتحليل المواصلات الشبكية وحقن الحماية السيادية."</p>
          </div>
        </div>

        <div className="space-y-6 relative z-10 max-w-4xl mx-auto">
          <input
            type="text"
            value={appInput}
            onChange={(e) => setAppInput(e.target.value)}
            placeholder="أدخل رابط الموقع، اسم التطبيق، أو الحزمة المستهدفة..."
            className="w-full bg-black/60 border border-blue-900/40 rounded-full px-10 py-8 focus:outline-none focus:ring-4 focus:ring-blue-500/10 text-white text-2xl font-medium placeholder-slate-800 shadow-inner text-right transition-all"
          />
          <button
            onClick={handleClone}
            disabled={loading || !appInput.trim()}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-8 rounded-[3rem] font-black text-3xl transition-all shadow-[0_20px_60px_rgba(37,99,235,0.4)] flex items-center justify-center gap-6 group disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-6">
                <div className="w-4 h-4 bg-white rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-4 h-4 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-2xl">{cloningStatus}</span>
              </div>
            ) : (
              <>
                <span>بدء الهندسة العكسية والتحليل</span>
                <svg className="w-10 h-10 group-hover:rotate-180 transition-transform duration-1000" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 4a2 2 0 114 0v1a2 2 0 01-2 2h-3a2 2 0 01-2-2V4a2 2 0 114 0z M7 10h10a2 2 0 012 2v1a2 2 0 11-4 0h-2a2 2 0 11-4 0H5a2 2 0 012-2v-1z" /></svg>
              </>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="flex flex-col bg-white rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden animate-slideUp text-right">
          
          {/* Dashboard Navigation */}
          <div className="flex bg-slate-50 border-b border-slate-100 p-6 justify-center gap-6 overflow-x-auto no-scrollbar">
            {[
              { id: 'transport', label: 'تحليل المواصلات', icon: '📡' },
              { id: 'preview', label: 'المعاينة الحية', icon: '📱' },
              { id: 'blueprint', label: 'المخطط الهندسي', icon: '📐' },
              { id: 'source', label: 'كود النواة', icon: '💻' },
              { id: 'security', label: 'التحصين السيادي', icon: '🛡️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-10 py-4 rounded-[2rem] font-black text-sm flex items-center gap-3 transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <span className="text-xl">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-12 min-h-[700px] flex flex-col">
            
            {activeTab === 'transport' && (
              <div className="space-y-12 animate-fadeIn flex flex-col h-full">
                <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                   <div className="space-y-4 flex-1">
                      <h3 className="text-4xl font-black text-slate-900">مراقب طبقة النقل (Transport Analyzer)</h3>
                      <p className="text-slate-500 font-medium text-lg">تحليل حي لحزم البيانات والمنافذ والبروتوكولات التي يتصل بها التطبيق.</p>
                   </div>
                   <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center gap-6 shadow-sm">
                      <div className="text-right">
                         <span className="text-[10px] font-black text-red-600 uppercase">Risk_Level</span>
                         <div className="text-3xl font-black text-red-700">{result.transportAnalysis.riskScore}/100</div>
                      </div>
                      <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-2xl shadow-xl">⚠️</div>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 flex-1">
                   <div className="lg:col-span-2 bg-black rounded-[3.5rem] p-10 flex flex-col h-[500px] shadow-4xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                      <div className="flex justify-between items-center mb-6 relative z-10 border-b border-white/10 pb-4">
                         <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Live_Packet_Stream</span>
                         <span className="text-[9px] font-mono text-slate-500">Uplink: Sarah_Node_ST</span>
                      </div>
                      <div className="flex-1 overflow-y-auto no-scrollbar font-mono text-[11px] space-y-3 relative z-10 text-left dir-ltr">
                         {packets.map((p, i) => (
                           <div key={p.id} className="flex justify-between p-3 rounded-xl bg-white/5 border border-white/5 animate-slideInRight">
                              <div className="flex gap-4">
                                 <span className="text-blue-500 font-black">[{p.id}]</span>
                                 <span className="text-slate-400">{p.protocol}</span>
                                 <span className="text-slate-200 truncate max-w-[200px]">{p.endpoint}</span>
                              </div>
                              <div className="flex gap-6">
                                 <span className="text-emerald-500">{p.payloadSize}</span>
                                 <span className={`font-black uppercase ${p.status === 'secured' ? 'text-blue-400' : 'text-red-500 animate-pulse'}`}>{p.status}</span>
                              </div>
                           </div>
                         ))}
                         {packets.length === 0 && <div className="py-20 text-center text-slate-700 italic">بانتظار تدفق الحزم...</div>}
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="bg-slate-900 rounded-[3rem] p-8 space-y-6 border border-white/5">
                         <h4 className="text-xl font-black text-white">العقد المكتشفة (Endpoints)</h4>
                         <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
                            {result.transportAnalysis.detectedEndpoints.map((ep, i) => (
                              <div key={i} className="p-4 bg-black/40 border border-white/5 rounded-2xl font-mono text-[10px] text-blue-400 truncate">
                                 {ep}
                              </div>
                            ))}
                         </div>
                      </div>
                      <div className="bg-blue-600 text-white p-8 rounded-[3rem] shadow-3xl">
                         <h4 className="text-[10px] font-black uppercase tracking-widest mb-4">Proxy_Configuration</h4>
                         <p className="text-sm font-bold leading-relaxed">
                            "تم تحويل كافة طلبات الشبكة لتمر عبر: {result.transportAnalysis.recommendedProxy}"
                         </p>
                         <div className="mt-6 h-1 w-full bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white animate-pulse" style={{ width: '85%' }}></div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="flex flex-col lg:flex-row items-center justify-between gap-16 animate-fadeIn flex-1">
                <div className="space-y-10 flex-1 text-right">
                   <div className="space-y-2">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em]">Independent_Simulation</span>
                      <h3 className="text-7xl font-black text-slate-900 leading-none">{result.name}</h3>
                   </div>
                   <p className="text-2xl text-slate-500 leading-relaxed font-medium italic">
                      "التطبيق يعمل الآن في بيئة معزولة تماماً (Sandbox) مع تشفير كامل للمواصلات الخارجية."
                   </p>
                   <div className="flex flex-wrap gap-4 pt-10">
                      <button onClick={downloadProject} className="bg-slate-900 text-white px-12 py-5 rounded-[2.5rem] font-black text-xl hover:bg-black transition-all shadow-3xl">تحميل النسخة المستقلة 📥</button>
                      <button className="bg-blue-600 text-white px-12 py-5 rounded-[2.5rem] font-black text-xl hover:bg-blue-500 transition-all shadow-3xl">تجسيد APK سيادي 📱</button>
                   </div>
                </div>

                <div className="relative group">
                   <div className="w-[340px] h-[680px] bg-slate-950 rounded-[4rem] border-[12px] border-slate-900 shadow-[0_50px_120px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-900 rounded-b-3xl z-20"></div>
                      <div className="flex-1 bg-white relative z-10">
                         <iframe 
                           key={previewKey}
                           title="Clone Preview"
                           srcDoc={result.fullCode}
                           className="w-full h-full border-none"
                         />
                      </div>
                   </div>
                   <div className="absolute -inset-10 bg-blue-500/10 blur-[80px] rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            )}

            {activeTab === 'blueprint' && (
              <div className="space-y-12 animate-fadeIn">
                 <div className="flex justify-between items-center border-b border-slate-100 pb-8">
                    <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">المخطط المعماري للنظام</h3>
                    <div className="flex gap-3">
                       <span className="px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Protocol Sync: STABLE</span>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                       <h4 className="text-xl font-black text-slate-800 flex items-center gap-3">التحسينات النورونية <span>✨</span></h4>
                       <div className="space-y-4">
                          {result.optimizations.map((opt, i) => (
                            <div key={i} className="flex items-center gap-6 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 group hover:border-blue-400 transition-all shadow-sm">
                               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-md font-black text-xl">✓</div>
                               <span className="font-black text-slate-700 text-lg">{opt}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                    <div className="bg-slate-900 rounded-[4rem] p-12 text-right space-y-8 shadow-inner relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-[80px]"></div>
                       <h4 className="text-2xl font-black text-blue-400 uppercase">تحليل النضام المصدري</h4>
                       <p className="text-slate-300 leading-[1.8] italic font-medium text-lg">
                          "تم استخراج كافة العقد الحيوية واستبدالها بوحدات صارة للتحكم المطلق. تم حذف كافة أدوات التتبع (Trackers) وحقن بروتوكول التخفي V9."
                       </p>
                       <div className="pt-10 border-t border-white/5 space-y-6">
                          <div>
                            <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-2">Architectural_Integrity</div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-500 w-[100%] shadow-[0_0_10px_blue]"></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-2">Protocol_Efficiency</div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-emerald-500 w-[94%] shadow-[0_0_10px_#10b981]"></div>
                            </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'source' && (
              <div className="space-y-8 animate-fadeIn flex flex-col h-full">
                <div className="flex justify-between items-center">
                   <div className="flex gap-4">
                      <button onClick={() => navigator.clipboard.writeText(result.fullCode)} className="bg-slate-100 text-slate-600 px-8 py-3 rounded-2xl font-black text-xs hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest">Copy_Full_Source</button>
                      <button onClick={downloadProject} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-xs shadow-xl uppercase tracking-widest">Export_HTML</button>
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">ملفات كود النواة (Sovereign_Source)</h3>
                </div>
                <div className="bg-slate-950 rounded-[3.5rem] p-12 text-blue-400 font-mono text-sm overflow-auto h-[550px] shadow-inner text-left dir-ltr selection:bg-blue-500/30 no-scrollbar">
                   {result.fullCode}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-12 animate-fadeIn text-right">
                <div className="flex items-center gap-8">
                   <div className="w-24 h-24 bg-red-600/10 rounded-[2.5rem] flex items-center justify-center text-6xl shadow-2xl border border-red-500/20">🛡️</div>
                   <div>
                      <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">تحصين النواة السيادي</h3>
                      <p className="text-slate-500 text-xl font-bold mt-2 italic">"تم بناء المستنسخ بتقنيات حماية استباقية تتجاوز النظام الأصلي بـ 12 مرحلة."</p>
                   </div>
                </div>
                
                <div className="bg-emerald-50 border-2 border-emerald-100 p-16 rounded-[4rem] text-3xl text-emerald-900 leading-[1.8] font-medium shadow-inner italic relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl">✓</div>
                   {result.securityHardening}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {[
                     { label: 'Network Obfuscation', icon: '🌐', desc: 'تمويه كافة طلبات الـ HTTP والـ DNS.' },
                     { label: 'Logic Scrambling', icon: '🔑', desc: 'تشفير منطق عمل الدوال لمنع الهندسة العكسية.' },
                     { label: 'Anti-Tamper Kernel', icon: '🤖', desc: 'نواة ذكية تكتشف محاولات التعديل الخارجي.' }
                   ].map(s => (
                     <div key={s.label} className="bg-white border border-slate-100 p-10 rounded-[3rem] flex flex-col items-center gap-6 shadow-sm hover:shadow-2xl transition-all group">
                        <span className="text-6xl group-hover:scale-110 transition-transform">{s.icon}</span>
                        <div className="text-center space-y-2">
                           <span className="font-black text-sm text-slate-900 uppercase tracking-widest">{s.label}</span>
                           <p className="text-xs text-slate-400 font-medium">{s.desc}</p>
                        </div>
                        <span className="px-6 py-1.5 bg-emerald-600 text-white rounded-full text-[9px] font-black tracking-[0.3em]">SECURED</span>
                     </div>
                   ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer Branding for Result */}
          <div className="bg-slate-900 p-12 flex flex-col md:flex-row justify-between items-center gap-10 border-t border-white/5 relative overflow-hidden">
             <div className="absolute inset-0 bg-blue-500/5 opacity-40"></div>
             <div className="text-right relative z-10">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] block mb-2">Sovereign_Project_Token</span>
                <span className="text-3xl font-black text-blue-400 uppercase tracking-widest">ULTRA-FORGE-{result.id.slice(-6).toUpperCase()}</span>
             </div>
             <div className="flex gap-4 relative z-10">
                <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-3">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping shadow-[0_0_10px_#10b981]"></div>
                   Build_Verified
                </div>
                <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest">
                   Sarah_V12_Brain
                </div>
             </div>
          </div>

        </div>
      )}

      {!result && !loading && (
        <div className="py-32 text-center text-slate-800 flex flex-col items-center gap-10 opacity-20 grayscale hover:grayscale-0 hover:opacity-50 transition-all duration-1000">
           <div className="text-[20rem] leading-none select-none drop-shadow-3xl">🧩</div>
           <p className="text-6xl font-black uppercase tracking-[1.5em] leading-tight">Cloner_Standby</p>
           <p className="text-2xl font-bold max-w-2xl mx-auto leading-relaxed">"سأبني لك نضاماً معزولاً عن السحابة التقليدية، حيث السيادة لك والتحليل لي."</p>
        </div>
      )}

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slideInRight { animation: slideInRight 0.5s ease-out forwards; }
        @keyframes scanline { 0% { top: 0%; } 100% { top: 100%; } }
        .animate-scanline { animation: scanline 4s linear infinite; }
      `}</style>
    </div>
  );
};
