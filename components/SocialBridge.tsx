
import React, { useState } from 'react';
import { generateSocialCampaign } from '../services/geminiService';
import { Language } from '../types';

export const SocialBridge: React.FC<{ language: Language }> = ({ language }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, string> | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook', 'telegram', 'whatsapp']);

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: '🔵', color: 'bg-blue-600', textColor: 'text-blue-500' },
    { id: 'telegram', name: 'Telegram', icon: '💎', color: 'bg-cyan-500', textColor: 'text-cyan-500' },
    { id: 'whatsapp', name: 'WhatsApp', icon: '🟢', color: 'bg-green-500', textColor: 'text-green-500' },
  ];

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || selectedPlatforms.length === 0) return;
    setLoading(true);
    try {
      const data = await generateSocialCampaign(prompt, selectedPlatforms, language);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم نسخ المنشور بنجاح!');
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto space-y-10 px-6 py-10">
      <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]"></div>
        
        <div className="flex items-center gap-6 mb-10 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-green-500 rounded-3xl flex items-center justify-center text-4xl shadow-xl">🔗</div>
          <div>
            <h2 className="text-4xl font-black text-white">جسر التواصل الذكي</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">Sarah Neural Social Link v1.0</p>
          </div>
        </div>

        <div className="space-y-8 relative z-10">
          <div className="flex flex-wrap gap-4">
            {platforms.map(p => (
              <button
                key={p.id}
                onClick={() => togglePlatform(p.id)}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black transition-all border-2 ${
                  selectedPlatforms.includes(p.id) 
                  ? `${p.color} border-transparent text-white shadow-lg scale-105` 
                  : 'bg-slate-800 border-white/5 text-slate-500 hover:border-white/20'
                }`}
              >
                <span className="text-2xl">{p.icon}</span>
                {p.name}
              </button>
            ))}
          </div>

          <div className="relative group">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="صف فكرة المنشور، العرض التسويقي، أو الرسالة التي تريد نشرها عبر المنصات..."
              className="w-full bg-slate-800/50 border border-white/5 rounded-3xl px-10 py-8 focus:outline-none focus:ring-4 focus:ring-blue-500/20 text-white h-48 resize-none text-xl font-medium shadow-inner placeholder-slate-700"
            />
            <div className="absolute bottom-6 left-10 text-[10px] text-slate-600 font-black uppercase tracking-widest">Awaiting_Campaign_Data</div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || selectedPlatforms.length === 0}
            className="w-full bg-white text-slate-900 py-6 rounded-[2.5rem] font-black text-2xl transition-all shadow-2xl flex items-center justify-center gap-4 hover:bg-blue-50"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-slate-900 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-slate-900 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-3 h-3 bg-slate-900 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-lg">صارة تصيغ حملتك...</span>
              </div>
            ) : "توزيع المحتوى الذكي 🚀"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
        {/* Fix: Explicitly cast textValue to string to handle 'unknown' type returned by Object.entries when mapping results */}
        {results && Object.entries(results).map(([platform, textValue]) => {
          const text = textValue as string;
          const pInfo = platforms.find(p => p.id === platform);
          return (
            <div key={platform} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] flex flex-col gap-6 animate-fadeIn group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{pInfo?.icon}</span>
                  <span className={`font-black uppercase tracking-widest text-xs ${pInfo?.textColor}`}>{platform}</span>
                </div>
                <button 
                  onClick={() => copyToClipboard(text)}
                  className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </button>
              </div>
              <div className="flex-1 text-slate-200 leading-relaxed font-medium text-sm whitespace-pre-wrap">
                {text}
              </div>
              <a 
                href={platform === 'telegram' ? `https://t.me/share/url?url=&text=${encodeURIComponent(text)}` : platform === 'whatsapp' ? `https://wa.me/?text=${encodeURIComponent(text)}` : `https://facebook.com/sharer/sharer.php`}
                target="_blank"
                className={`w-full py-4 rounded-2xl font-black text-xs text-center border transition-all ${pInfo?.textColor} border-white/5 group-hover:border-current`}
              >
                نشر مباشر الآن
              </a>
            </div>
          );
        })}

        {!results && !loading && (
          <div className="col-span-full py-32 text-center text-slate-800 flex flex-col items-center gap-6 opacity-20 grayscale">
             <div className="text-9xl mb-4">💬</div>
             <p className="text-3xl font-black uppercase tracking-[1rem]">Social_Link_Standby</p>
             <p className="text-sm font-bold mt-4">جاهزة لنشر أفكارك عبر العالم الرقمي</p>
          </div>
        )}
      </div>
    </div>
  );
};
