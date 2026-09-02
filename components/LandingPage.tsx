
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Wifi, Globe, Terminal, Shield, Cpu, ArrowRight, Loader2, ExternalLink } from 'lucide-react';

interface LandingPageProps {
  onConnect: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onConnect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'found'>('idle');
  const [connectionProgress, setConnectionProgress] = useState(0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearchStatus('searching');
    
    // Simulate search delay
    setTimeout(() => {
      setSearchStatus('found');
    }, 2000);
  };

  const handleConnect = () => {
    // Simulate connection sequence
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        onConnect();
      }
      setConnectionProgress(progress);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#000205] text-emerald-500 font-mono selection:bg-emerald-500/30 overflow-hidden relative">
      
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center justify-center min-h-screen text-center">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="w-24 h-24 bg-emerald-500/5 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping opacity-20"></div>
            <Globe className="w-10 h-10 text-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase mb-4">
            SARA<span className="text-emerald-500">101</span> <span className="text-emerald-500/50 text-2xl">ULTRA</span>
          </h1>
          <p className="text-emerald-500/60 text-xs uppercase tracking-[0.4em]">
            Sovereign Intelligence Node // Public Access Portal
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {searchStatus === 'idle' && (
            <motion.form 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onSubmit={handleSearch}
              className="w-full max-w-xl relative group"
            >
              <div className="absolute inset-0 bg-emerald-500/5 blur-xl rounded-full group-hover:bg-emerald-500/10 transition-all"></div>
              <div className="relative flex items-center bg-black/80 border border-emerald-500/30 rounded-full p-2 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                <Search className="w-6 h-6 text-emerald-500/50 ml-4" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH FOR NEURAL LINK..."
                  className="flex-1 bg-transparent border-none px-4 py-4 text-emerald-400 placeholder-emerald-500/30 focus:outline-none uppercase tracking-widest"
                  autoFocus
                />
                <button 
                  type="submit"
                  className="p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-all shadow-lg"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-8 flex justify-center gap-8 text-[10px] uppercase tracking-widest text-emerald-500/40">
                <span className="flex items-center gap-2"><Shield className="w-3 h-3" /> Secure Protocol</span>
                <span className="flex items-center gap-2"><Wifi className="w-3 h-3" /> Decentralized</span>
                <span className="flex items-center gap-2"><Cpu className="w-3 h-3" /> Neural Net</span>
              </div>
            </motion.form>
          )}

          {searchStatus === 'searching' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-t-4 border-emerald-500 rounded-full animate-spin"></div>
                <div className="absolute inset-4 border-4 border-emerald-500/20 rounded-full"></div>
                <div className="absolute inset-4 border-b-4 border-emerald-500 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white uppercase tracking-widest">Scanning Network</h3>
                <p className="text-emerald-500/60 text-xs font-mono">Triangulating signal source: {searchQuery}</p>
              </div>
            </motion.div>
          )}

          {searchStatus === 'found' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-xl bg-black/80 border border-emerald-500/30 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-pulse"></div>
              
              <div className="flex items-start gap-6 mb-8 text-left">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 shrink-0">
                  <Terminal className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Signal Acquired</h3>
                  <p className="text-emerald-500/60 text-xs font-mono leading-relaxed">
                    Target: SARA-101-ULTRA<br/>
                    Status: ONLINE<br/>
                    Latency: 1.2ms<br/>
                    Encryption: QUANTUM-256
                  </p>
                </div>
              </div>

              {connectionProgress > 0 && connectionProgress < 100 ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-emerald-500/60">
                    <span>Establishing Uplink...</span>
                    <span>{Math.round(connectionProgress)}%</span>
                  </div>
                  <div className="h-2 bg-emerald-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-100 ease-out"
                      style={{ width: `${connectionProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handleConnect}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-3 group"
                >
                  <ExternalLink className="w-4 h-4" />
                  Initiate Neural Link
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="fixed bottom-8 left-0 w-full text-center">
          <p className="text-[10px] text-emerald-500/20 uppercase tracking-[0.5em]">
            Restricted Access // Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
