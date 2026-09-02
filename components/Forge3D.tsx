
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { ForgeNode } from '../types';

export const Forge3D: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState<ForgeNode[]>([]);
  const [rotation, setRotation] = useState({ x: -20, y: 35 });
  const [selectedNode, setSelectedNode] = useState<ForgeNode | null>(null);

  const handleForge = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `أنت 'المصهر النوروني'. قم بتصميم معمارية برمجية لـ: ${prompt}. قدم النتيجة بتنسيق JSON حصراً كقائمة من العقد 3D.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                label: { type: Type.STRING },
                type: { type: Type.STRING },
                pos: {
                  type: Type.OBJECT,
                  properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, z: { type: Type.NUMBER } }
                },
                code: { type: Type.STRING },
                complexity: { type: Type.NUMBER }
              }
            }
          }
        }
      });
      const data = JSON.parse(response.text || "[]");
      setNodes(data);
      setPrompt('');
    } catch (err) {
      alert("عذراً، فشل الصهر النوروني.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white relative overflow-hidden font-arabic">
      {/* HUD Controller */}
      <div className="absolute top-10 left-10 z-[100] w-96 space-y-6">
        <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-black text-blue-500 mb-4 uppercase tracking-tighter">Forge_3D_Sculptor</h2>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="صف البرنامج الذي تريد نحته (مثلاً: نظام تشفير بيانات متقدم)..."
            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all h-24 resize-none"
          />
          <button 
            onClick={handleForge}
            disabled={loading}
            className="w-full mt-4 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-blue-900/40"
          >
            {loading ? 'جاري التشكيل النوروني...' : 'بدء التجسيد البرمجي 💎'}
          </button>
        </div>

        {selectedNode && (
          <div className="bg-blue-950/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-blue-500/30 animate-fadeIn">
            <h3 className="text-xl font-black text-cyan-400 mb-2">{selectedNode.label}</h3>
            <div className="text-[10px] font-mono text-slate-400 mb-4 uppercase tracking-widest">Logic_Source_Code</div>
            <div className="bg-black/60 p-4 rounded-xl font-mono text-[10px] text-blue-300 max-h-40 overflow-y-auto no-scrollbar">
              {selectedNode.code}
            </div>
            <button className="w-full mt-4 py-2 border border-blue-500/30 rounded-xl text-[10px] font-black hover:bg-blue-500/20 transition-all">تحسين الوظيفة (V7 Optimize)</button>
          </div>
        )}
      </div>

      {/* 3D Forge Environment */}
      <div 
        className="flex-1 flex items-center justify-center relative cursor-move"
        onMouseMove={(e) => {
          if (e.buttons === 1) {
            setRotation({ x: rotation.x - e.movementY * 0.2, y: rotation.y + e.movementX * 0.2 });
          }
        }}
      >
        <div 
          className="w-[1200px] h-[900px] transition-transform duration-500 ease-out"
          style={{ perspective: '1800px', transformStyle: 'preserve-3d' }}
        >
          <div 
            className="w-full h-full relative transition-transform duration-1000"
            style={{ transformStyle: 'preserve-3d', transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
          >
            {/* Grid Floor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1600px] h-[1600px] bg-[radial-gradient(circle,rgba(37,99,235,0.05)_1px,transparent_1px)] bg-[size:60px:60px] [transform:rotateX(90deg)_translateZ(-300px)]"></div>

            {/* Central Processing Hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-600/20 border border-blue-500/40 rounded-[3rem] shadow-[0_0_120px_rgba(59,130,246,0.3)] animate-pulse flex items-center justify-center">
               <span className="text-[10px] font-black tracking-[0.5em] text-blue-400">SARAH_CORE</span>
            </div>

            {/* Program Nodes (Forged Objects) */}
            {nodes.map((node) => (
              <div 
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="absolute transition-all duration-1000 group cursor-pointer"
                style={{ 
                  left: `calc(50% + ${node.pos.x}px)`, 
                  top: `calc(50% + ${node.pos.y}px)`, 
                  transform: `translateZ(${node.pos.z}px)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="w-24 h-24 relative animate-float">
                  <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-500 shadow-2xl group-hover:scale-125 ${node.type === 'logic' ? 'bg-purple-600/40 border-purple-400 shadow-purple-500/20' : 'bg-cyan-600/40 border-cyan-400 shadow-cyan-500/20'}`}></div>
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 px-4 py-2 rounded-xl text-[9px] font-black text-white border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {node.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Overaly */}
      <div className="absolute bottom-10 right-10 flex gap-10 opacity-30 text-[9px] font-black uppercase tracking-[0.3em]">
         <span>System_Complexity: {nodes.reduce((a, b) => a + b.complexity, 0)}</span>
         <span>Temporal_Accuracy: 99.98%</span>
         <span>Memory_Forge: 100TB_Stable</span>
      </div>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};
