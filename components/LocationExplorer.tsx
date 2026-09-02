
import React, { useState, useEffect } from 'react';
import { callMapsExplorer, getPlaceDeepDetails } from '../services/geminiService';
import { UserLocation, MapResult, Language } from '../types';

interface LocationExplorerProps {
  initialQuery?: string;
  language: Language;
}

export const LocationExplorer: React.FC<LocationExplorerProps> = ({ initialQuery, language }) => {
  const [query, setQuery] = useState(initialQuery || '');
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [results, setResults] = useState<MapResult[]>([]);
  const [location, setLocation] = useState<UserLocation | undefined>();
  const [selectedPlace, setSelectedPlace] = useState<MapResult | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => console.warn("Location permission denied", err)
    );

    if (initialQuery) {
      handleSearch(undefined, initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (e?: React.FormEvent, directQuery?: string) => {
    if (e) e.preventDefault();
    const activeQuery = directQuery || query;
    if (!activeQuery.trim()) return;

    setLoading(true);
    setSelectedPlace(null);
    try {
      const data = await callMapsExplorer(activeQuery, language, location);
      setResponse(data.text);
      setResults(data.results);
    } catch (err) {
      setResponse("عذراً، حدث خطأ أثناء البحث عن الأماكن.");
    } finally {
      setLoading(false);
    }
  };

  const inspectPlace = async (place: MapResult) => {
    setDetailLoading(true);
    setSelectedPlace({ ...place }); // العرض الأولي
    try {
      const details = await getPlaceDeepDetails(place.title, language);
      setSelectedPlace({ ...place, ...details });
    } catch (err) {
      console.error("Failed to fetch deep details", err);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto space-y-6 px-4 relative overflow-hidden">
      <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-8 shadow-2xl border border-white/20 -mt-10 relative z-10">
        <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center gap-4">
          <span className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-500/20">📍</span>
          استكشف مع صارة v15
        </h2>
        <form onSubmit={(e) => handleSearch(e)} className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="مثال: أفضل مطاعم البيتزا، معالم قريبة، فنادق 5 نجوم..."
            className="flex-1 bg-gray-100/50 border border-gray-200 rounded-3xl px-8 py-5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-xl font-medium text-gray-800"
          />
          <button
            disabled={loading}
            className="bg-blue-600 text-white px-12 py-5 rounded-3xl font-black text-xl hover:bg-blue-700 disabled:bg-blue-300 transition-all shadow-xl shadow-blue-500/30"
          >
            {loading ? "..." : "بحث"}
          </button>
        </form>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-32 overflow-y-auto no-scrollbar">
        <div className={`lg:col-span-2 space-y-6 transition-all duration-500 ${selectedPlace ? 'opacity-40 grayscale pointer-events-none scale-95' : 'opacity-100'}`}>
          {response && (
            <div className="bg-blue-50/50 rounded-[2rem] p-8 border border-blue-100/50 animate-fadeIn">
              <p className="whitespace-pre-wrap text-gray-700 leading-relaxed text-xl italic font-medium">{response}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((place, idx) => (
              <div
                key={idx}
                onClick={() => inspectPlace(place)}
                className="bg-white rounded-[2.5rem] p-8 shadow-md border border-gray-50 hover:border-blue-400 hover:shadow-2xl transition-all group cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-start justify-between relative z-10 mb-4">
                  <h3 className="font-black text-2xl text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">{place.title}</h3>
                  <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
                {place.snippets && place.snippets.length > 0 && (
                  <p className="text-gray-500 italic text-sm line-clamp-2 mb-6">"{place.snippets[0]}"</p>
                )}
                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 w-fit px-4 py-2 rounded-full">
                  استكشاف التفاصيل النورونية
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* لوحة التفاصيل الجانبية */}
        {selectedPlace && (
          <div className="lg:col-span-1 animate-slideInRight h-fit sticky top-6">
            <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl border border-gray-100 flex flex-col gap-8 relative overflow-hidden">
              <button 
                onClick={() => setSelectedPlace(null)}
                className="absolute top-8 left-8 p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
              >
                ✕
              </button>
              
              <div className="pt-8">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-2 block">Place_Inspection_Active</span>
                <h3 className="text-4xl font-black text-gray-900 leading-none mb-4">{selectedPlace.title}</h3>
                
                {detailLoading ? (
                  <div className="py-12 flex flex-col items-center gap-4">
                     <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                     <p className="text-sm font-bold text-gray-400 animate-pulse">جاري جلب البيانات من الخرائط...</p>
                  </div>
                ) : (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="flex gap-4 items-center">
                       <div className="px-6 py-2 bg-amber-100 text-amber-700 rounded-2xl font-black text-xl flex items-center gap-2">
                          <span>⭐</span> {selectedPlace.rating || '4.5'}
                       </div>
                       <span className="text-gray-400 font-bold">تقييم المستخدمين</span>
                    </div>

                    <div className="space-y-6">
                       <div className="flex gap-4 items-start">
                          <span className="text-2xl">📍</span>
                          <div>
                             <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Address</h4>
                             <p className="text-gray-700 font-medium leading-relaxed">{selectedPlace.address || "راجع الرابط أدناه"}</p>
                          </div>
                       </div>
                       
                       <div className="flex gap-4 items-start">
                          <span className="text-2xl">⏰</span>
                          <div>
                             <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Opening Hours</h4>
                             <p className="text-gray-700 font-medium">{selectedPlace.hours || "مفتوح الآن"}</p>
                          </div>
                       </div>

                       <div className="flex gap-4 items-start">
                          <span className="text-2xl">📞</span>
                          <div>
                             <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Phone</h4>
                             <p className="text-gray-700 font-medium">{selectedPlace.phone || "غير مدرج"}</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-6">
                       <a 
                        href={selectedPlace.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-center shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
                       >
                         فتح في خرائط Google 🗺️
                       </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {!loading && results.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center opacity-20 py-20 grayscale pointer-events-none">
           <div className="text-[12rem] mb-6 animate-float">🧭</div>
           <p className="text-4xl font-black uppercase tracking-[1em]">Explorer_Standby</p>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideInRight { animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
