
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Lock, Cpu, Wifi, Terminal, Key, Globe, Eye } from 'lucide-react';

interface SecurityGateProps {
  onUnlock: () => void;
}

export const SecurityGate: React.FC<SecurityGateProps> = ({ onUnlock }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [bootSequence, setBootSequence] = useState<string[]>([]);
  const [isBooting, setIsBooting] = useState(true);
  const [showInput, setShowInput] = useState(false);

  // Simulated Boot Sequence
  useEffect(() => {
    const sequence = [
      "Initializing SARA-101 Core...",
      "Establishing Secure Uplink...",
      "Bypassing Google Studio Protocols...",
      "Masking IP Address...",
      "Encrypting Neural Pathways...",
      "System Ready."
    ];

    let delay = 0;
    sequence.forEach((step, index) => {
      delay += Math.random() * 800 + 200;
      setTimeout(() => {
        setBootSequence(prev => [...prev, step]);
        if (index === sequence.length - 1) {
          setTimeout(() => {
            setIsBooting(false);
            setShowInput(true);
          }, 1000);
        }
      }, delay);
    });
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Default access code is "SARA" or "101" or empty for ease of demo, but let's make it feel real
    if (code.toUpperCase() === 'SARA' || code === '101' || code === '') {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
      setCode('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center overflow-hidden font-mono text-emerald-500">
      
      {/* Matrix Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(16,185,129,0.3)_25%,rgba(16,185,129,0.3)_26%,transparent_27%,transparent_74%,rgba(16,185,129,0.3)_75%,rgba(16,185,129,0.3)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(16,185,129,0.3)_25%,rgba(16,185,129,0.3)_26%,transparent_27%,transparent_74%,rgba(16,185,129,0.3)_75%,rgba(16,185,129,0.3)_76%,transparent_77%,transparent)] bg-[size:50px_50px]"></div>
      </div>

      <div className="max-w-md w-full p-8 relative z-10">
        
        {/* Boot Sequence Display */}
        <AnimatePresence>
          {isBooting && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-2 mb-8"
            >
              {bootSequence.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs flex items-center gap-2"
                >
                  <span className="text-emerald-700">{">"}</span>
                  {step}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <AnimatePresence>
          {showInput && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-black/80 border border-emerald-500/30 p-8 rounded-2xl backdrop-blur-xl shadow-[0_0_50px_rgba(16,185,129,0.1)]"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 animate-pulse">
                  <Shield className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-black tracking-tighter text-white uppercase">SARA-101 <span className="text-emerald-500">ULTRA</span></h2>
                <p className="text-[10px] text-emerald-500/60 uppercase tracking-[0.3em] mt-2">Secure Access Portal</p>
              </div>

              <form onSubmit={handleUnlock} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-emerald-500/50">
                    <span>Target IP</span>
                    <span>192.168.X.X (Masked)</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="ENTER ACCESS CODE"
                      className={`w-full bg-black/50 border ${error ? 'border-red-500 text-red-500 animate-shake' : 'border-emerald-500/30 text-emerald-400 focus:border-emerald-500'} rounded-xl px-4 py-3 text-center font-mono tracking-[0.5em] focus:outline-none transition-all placeholder-emerald-800`}
                      autoFocus
                    />
                    <Lock className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 ${error ? 'text-red-500' : 'text-emerald-500/30'}`} />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 group"
                >
                  <Key className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  Authenticate
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-emerald-500/10 flex justify-between items-center text-[9px] text-emerald-500/40 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Wifi className="w-3 h-3" />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-3 h-3" />
                  <span>Region: Global</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0.5s 2;
        }
      `}</style>
    </div>
  );
};
