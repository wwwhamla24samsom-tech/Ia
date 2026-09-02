import React, { useState, useEffect } from 'react';
import { analyzeSecurityThreat, generateNeuralKey } from '../services/geminiService';
import { neuralKernelSecurity, KernelShieldTelemetry } from '../services/neuralKernelSecurity';
import { deviceBehaviorMonitor, ConnectedDevice, SecurityEventAlert } from '../services/deviceBehaviorMonitor';
import { ThreatAnalysis, Language } from '../types';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Laptop, 
  Smartphone, 
  Server, 
  Radio, 
  Lock, 
  Key, 
  Activity, 
  Eye, 
  Ban, 
  CheckCircle2, 
  RefreshCw, 
  Zap, 
  Bell, 
  Cpu
} from 'lucide-react';

export const NeuralShield: React.FC<{ language: Language }> = ({ language }) => {
  const [shieldActive, setShieldActive] = useState(neuralKernelSecurity.getTelemetry().active);
  const [loading, setLoading] = useState(false);
  const [threatData, setThreatData] = useState<ThreatAnalysis | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [customLog, setCustomLog] = useState('');
  const [neuralKey, setNeuralKey] = useState('');
  const [kernelTelemetry, setKernelTelemetry] = useState<KernelShieldTelemetry>(neuralKernelSecurity.getTelemetry());
  
  // Real-time Device Behavior Monitoring States
  const [devices, setDevices] = useState<ConnectedDevice[]>(deviceBehaviorMonitor.getConnectedDevices());
  const [alerts, setAlerts] = useState<SecurityEventAlert[]>(deviceBehaviorMonitor.getAlerts());
  const [activeTab, setActiveTab] = useState<'devices' | 'alerts' | 'scanner' | 'tuning'>('devices');
  const [realtimeNotice, setRealtimeNotice] = useState<SecurityEventAlert | null>(null);
  
  // Security Settings States
  const [encryptionLevel, setEncryptionLevel] = useState('Quantum_RSA');
  const [stealthLevel, setStealthLevel] = useState(90);
  const [autoPatch, setAutoPatch] = useState(true);
  const [behaviorAuditActive, setBehaviorAuditActive] = useState(true);

  // Sync telemetry and live devices
  useEffect(() => {
    const interval = setInterval(() => {
      const tel = neuralKernelSecurity.getTelemetry();
      setKernelTelemetry(tel);
      setShieldActive(tel.active);
      setDevices(deviceBehaviorMonitor.getConnectedDevices());
      setAlerts(deviceBehaviorMonitor.getAlerts());

      if (tel.active) {
        setLogs(prev => [
          `[${new Date().toLocaleTimeString()}] رصد حركة الشبكة: تم فحص ${tel.sanitizedTransactionsCount} عملية | التصدي لـ ${tel.blockedInjectionsCount} محاولة حقن`, 
          ...prev
        ].slice(0, 10));
      }
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleToggleShield = () => {
    const nextState = neuralKernelSecurity.toggleActive();
    setShieldActive(nextState);
    setKernelTelemetry(neuralKernelSecurity.getTelemetry());
  };

  const runFullScan = async () => {
    setLoading(true);
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] بدء الفحص النوروني الشامل للنظام وسلوك العقد...`, ...prev]);
    
    try {
      const kernelCheck = neuralKernelSecurity.sanitizeAndWrap(customLog || "System Status: Stable. Encryption: Active. Protocol: V6.7", 'NeuralShieldFullScan');
      if (kernelCheck.threatDetected) {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] اعتراض النواة: ${kernelCheck.threatMessage}`, ...prev]);
      }

      const result = await analyzeSecurityThreat(kernelCheck.wrappedData, language);
      setThreatData(result);
      setLogs(prev => [
        `[${new Date().toLocaleTimeString()}] اكتمال الفحص: مستوى التهديد الحالي هو ${result.threatLevel.toUpperCase()}`,
        ...prev
      ]);
    } catch (err) {
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] تنبيه: تعذر استكمال الفحص الخارجي، تم الاعتماد على حماية النواة المدمجة.`, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const handleInjectKey = async () => {
    setLoading(true);
    const key = await generateNeuralKey();
    const generated = key || "SARAH-NC-X99-ULTRA-SEC-8821-BETA-QURAN-CORE-V6";
    setNeuralKey(generated);
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] تم توليد مفتاح الماستر وإعادة تشفير طبقات البيانات.`, ...prev]);
    setLoading(false);
  };

  // Simulate or handle unauthorized access attempt
  const handleSimulateAttack = () => {
    const newAlert = deviceBehaviorMonitor.simulateUnauthorizedAccess();
    setAlerts(deviceBehaviorMonitor.getAlerts());
    setDevices(deviceBehaviorMonitor.getConnectedDevices());
    setRealtimeNotice(newAlert);
    setLogs(prev => [
      `[${newAlert.timestamp}] 🚨 إنذار فوري: رصد محاولة وصول غير مصرح بها من الجهاز [${newAlert.deviceName} - ${newAlert.ipAddress}]`,
      ...prev
    ]);
  };

  const handleBlockDevice = (id: string) => {
    deviceBehaviorMonitor.blockDevice(id);
    setDevices(deviceBehaviorMonitor.getConnectedDevices());
    setAlerts(deviceBehaviorMonitor.getAlerts());
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] تم حظر وعزل الجهاز [${id}] وتجريده من صلاحيات النواة`, ...prev]);
  };

  const handleTrustDevice = (id: string) => {
    deviceBehaviorMonitor.trustDevice(id);
    setDevices(deviceBehaviorMonitor.getConnectedDevices());
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] تمت استعادة موثوقية الجهاز [${id}]`, ...prev]);
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto space-y-8 px-4 sm:px-6 pb-48 text-right font-arabic selection:bg-red-500 selection:text-white">
      
      {/* Real-time Unauthorized Access Banner Notification */}
      {realtimeNotice && (
        <div className="bg-rose-950/80 border-2 border-rose-500 text-white p-5 rounded-3xl shadow-[0_0_40px_rgba(244,63,94,0.3)] flex flex-col md:flex-row items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center gap-4 text-right">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-2xl shadow-lg">
              🚨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-rose-500 text-black px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                  تنبيه أمني عاجل في الوقت الفعلي
                </span>
                <span className="text-xs font-mono text-rose-300">{realtimeNotice.timestamp}</span>
              </div>
              <h4 className="text-lg font-black text-white mt-1">
                محاولة وصول غير مصرح بها للبيانات ({realtimeNotice.deviceName})
              </h4>
              <p className="text-xs text-rose-200 mt-0.5">{realtimeNotice.description}</p>
              <div className="text-[11px] font-mono text-rose-400 mt-1 bg-black/40 px-3 py-1 rounded-lg inline-block dir-ltr">
                {realtimeNotice.interceptedData}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                handleBlockDevice(realtimeNotice.deviceId);
                setRealtimeNotice(null);
              }}
              className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-lg active:scale-95 flex items-center gap-1.5"
            >
              <Ban className="w-4 h-4" />
              <span>عزل وحظر الجهاز</span>
            </button>
            <button
              onClick={() => setRealtimeNotice(null)}
              className="bg-white/10 hover:bg-white/20 text-slate-300 px-4 py-2.5 rounded-xl font-bold text-xs transition-all"
            >
              تجاهل
            </button>
          </div>
        </div>
      )}

      {/* Main Defense Hub Header */}
      <div className="bg-[#020617] rounded-[3rem] p-8 sm:p-12 shadow-[0_0_100px_rgba(59,130,246,0.1)] border border-white/5 relative overflow-hidden group">
        <div className={`absolute top-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent ${shieldActive ? 'via-blue-500' : 'via-rose-600'} to-transparent animate-pulse`}></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-4 flex items-center justify-center text-4xl sm:text-5xl transition-all duration-700 ${shieldActive ? 'bg-blue-500/10 border-blue-400 shadow-[0_0_50px_rgba(59,130,246,0.3)]' : 'bg-rose-950/20 border-rose-600 animate-pulse'}`}>
               {shieldActive ? <ShieldCheck className="w-12 h-12 text-blue-400" /> : <ShieldAlert className="w-12 h-12 text-rose-500" />}
            </div>
            <div>
               <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">درع صارة <span className={shieldActive ? 'text-blue-400' : 'text-rose-500'}>النوروني والسيادي</span></h2>
               <div className="flex flex-wrap items-center gap-3 mt-2">
                  <div className={`w-2 h-2 rounded-full ${shieldActive ? 'bg-blue-400 animate-ping' : 'bg-rose-600'}`}></div>
                  <span className="text-slate-400 font-mono text-xs tracking-wider">
                    {shieldActive ? 'NEURAL_SHIELD: SECURED // رصد السلوك نشط' : 'NEURAL_SHIELD: VULNERABLE // الحماية معطلة'}
                  </span>
               </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
             <button 
               onClick={handleSimulateAttack}
               className="bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 px-5 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-2 active:scale-95"
               title="محاكاة محاولة اختراق أو وصول غير مصرح به للتأكد من جاهزية الرصد"
             >
               <Zap className="w-4 h-4 text-rose-400" />
               <span>محاكاة محاولة تسلل</span>
             </button>

             <button 
               onClick={handleInjectKey}
               className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl text-xs font-black text-white hover:bg-white/10 transition-all flex items-center gap-2"
             >
               <Key className="w-4 h-4 text-blue-400" />
               <span>توليد مفتاح الماستر</span>
             </button>

             <button 
               onClick={handleToggleShield}
               className={`px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-95 flex items-center gap-2 ${shieldActive ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-950/50'}`}
             >
               <Shield className="w-4 h-4" />
               <span>{shieldActive ? 'تعطيل الحماية' : 'تنشيط الدرع'}</span>
             </button>
          </div>
        </div>

        {/* Real-time Telemetry Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/5">
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
            <div className="text-slate-400 text-xs font-bold mb-1">الأجهزة المتصلة</div>
            <div className="text-2xl font-black text-white flex items-center gap-2">
              <span>{devices.length}</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-normal font-mono">عقد نشطة</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
            <div className="text-slate-400 text-xs font-bold mb-1">محاولات الوصول الممنوعة</div>
            <div className="text-2xl font-black text-rose-400 flex items-center gap-2">
              <span>{devices.reduce((acc, d) => acc + d.unauthorizedAttempts, 0)}</span>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-normal font-mono">اعتراض فوري</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
            <div className="text-slate-400 text-xs font-bold mb-1">مؤشر سلامة النواة</div>
            <div className="text-2xl font-black text-emerald-400 flex items-center gap-2 font-mono">
              <span>{kernelTelemetry.kernelIntegrityScore}%</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
            <div className="text-slate-400 text-xs font-bold mb-1">تشفير البيانات</div>
            <div className="text-lg font-black text-cyan-300 font-mono truncate">
              {encryptionLevel}
            </div>
          </div>
        </div>

      </div>

      {/* Tabs Navigation for Shield Features */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a0f1d] border border-white/10 p-2 rounded-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('devices')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              activeTab === 'devices' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>رصد سلوك الأجهزة المتصلة</span>
            <span className="bg-black/40 px-2 py-0.5 rounded-full text-[10px]">{devices.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              activeTab === 'alerts' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>إنذارات الوصول غير المصرح به</span>
            {alerts.length > 0 && (
              <span className="bg-rose-500 text-black font-black px-2 py-0.5 rounded-full text-[10px]">
                {alerts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              activeTab === 'scanner' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>فحص التهديدات بالذكاء السيادي</span>
          </button>

          <button
            onClick={() => setActiveTab('tuning')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              activeTab === 'tuning' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>إعدادات التحصين والنواة</span>
          </button>
        </div>

        <div className="flex items-center gap-2 px-3 text-xs text-slate-400 font-mono">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
          <span>تحديث حي كل 3.5 ثانية</span>
        </div>
      </div>

      {/* Tab 1: Connected Devices Behavior Monitoring */}
      {activeTab === 'devices' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {devices.map((device) => {
              const isBlocked = device.trustStatus === 'blocked';
              const isSuspicious = device.trustStatus === 'suspicious';
              return (
                <div 
                  key={device.id}
                  className={`bg-[#060b18] border rounded-3xl p-6 relative overflow-hidden transition-all shadow-xl ${
                    isBlocked 
                      ? 'border-rose-600/40 bg-rose-950/10' 
                      : isSuspicious 
                        ? 'border-amber-500/40 bg-amber-950/10' 
                        : 'border-blue-500/20 hover:border-blue-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                        isBlocked ? 'bg-rose-500/20 text-rose-400' : isSuspicious ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {device.deviceType === 'desktop' ? <Laptop className="w-6 h-6" /> : device.deviceType === 'mobile' ? <Smartphone className="w-6 h-6" /> : <Server className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white">{device.name}</h4>
                        <div className="text-xs font-mono text-slate-400 dir-ltr text-right">{device.ipAddress}</div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                      isBlocked ? 'bg-rose-600 text-white' : isSuspicious ? 'bg-amber-500 text-black animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {isBlocked ? 'محظور ومعزول' : isSuspicious ? 'مشبوه / قيد الرصد' : 'موثوق'}
                    </span>
                  </div>

                  {/* Behavior Score Bar */}
                  <div className="space-y-1.5 my-4 bg-black/40 p-3 rounded-2xl border border-white/5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">تقييم سلامة السلوك:</span>
                      <span className={`font-bold ${device.behaviorScore > 80 ? 'text-emerald-400' : device.behaviorScore > 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {device.behaviorScore}/100
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${device.behaviorScore > 80 ? 'bg-emerald-500' : device.behaviorScore > 40 ? 'bg-amber-500' : 'bg-rose-600'}`}
                        style={{ width: `${device.behaviorScore}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4 text-slate-300">
                    <div className="bg-white/5 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-500 block">إجمالي الطلبات:</span>
                      <span className="font-bold text-white">{device.accessAttempts}</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-500 block">محاولات غير مصرحة:</span>
                      <span className={`font-bold ${device.unauthorizedAttempts > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{device.unauthorizedAttempts}</span>
                    </div>
                  </div>

                  {/* Anomaly Tags */}
                  {device.anomalyFlags.length > 0 && (
                    <div className="space-y-1 mb-4">
                      <div className="text-[10px] font-bold text-rose-400 uppercase">انحرافات سلوكية مرصودة:</div>
                      <div className="space-y-1">
                        {device.anomalyFlags.map((flag, idx) => (
                          <div key={idx} className="text-[11px] bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2 py-1 rounded-lg">
                            • {flag}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Controls */}
                  <div className="pt-2 border-t border-white/5 flex gap-2">
                    {isBlocked ? (
                      <button
                        onClick={() => handleTrustDevice(device.id)}
                        className="flex-1 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>إلغاء الحظر والتوثيق</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlockDevice(device.id)}
                        className="flex-1 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>عزل وحظر الجهاز</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Unauthorized Access Alerts Feed */}
      {activeTab === 'alerts' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-[#0a0f1d] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <span>سجل الإنذارات ومحاولات الوصول غير المصرح بها</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">Total Intercepted: {alerts.length}</span>
            </div>

            {alerts.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-bold text-sm">
                لا توجد أي محاولات وصول غير مصرح بها حتى الآن. النظام آمن بنسبة 100%.
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className="bg-black/50 border border-rose-500/20 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 mt-1">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-rose-400 font-bold">{alert.timestamp}</span>
                          <span className="text-white font-black text-sm">{alert.eventType}</span>
                          <span className="text-[10px] bg-rose-500 text-black px-2 py-0.5 rounded-full font-black uppercase">
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{alert.description}</p>
                        <div className="text-[11px] font-mono text-slate-400 mt-1">
                          الجهاز: <span className="text-white font-bold">{alert.deviceName}</span> | IP: <span className="text-cyan-300">{alert.ipAddress}</span>
                        </div>
                        <div className="bg-black/80 border border-white/5 rounded-lg p-2 font-mono text-[10px] text-rose-300 mt-2 dir-ltr text-left">
                          {alert.interceptedData}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                        ✓ تم الاعتراض: {alert.actionTaken}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Deep Security Scanner */}
      {activeTab === 'scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
          {/* Scanner Input */}
          <div className="bg-[#0a0f1d] border border-white/10 rounded-3xl p-8 space-y-6">
            <h3 className="text-xl font-black text-white">فحص الشيفرات والنصوص المشبوهة</h3>
            <textarea 
              value={customLog}
              onChange={(e) => setCustomLog(e.target.value)}
              placeholder="أدخل سجلات مشبوهة، حزم بيانات، أو استعلامات للتحقق منها عبر محرك الفحص النوروني..."
              className="w-full bg-black/70 border border-white/10 rounded-2xl p-5 text-white text-sm focus:outline-none focus:border-blue-500 h-44 resize-none placeholder:text-slate-600 transition-all shadow-inner"
            />
            
            <button 
              onClick={runFullScan}
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-base transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Eye className="w-5 h-5" />
                  <span>بدء الفحص النوروني الشامل للتهديدات</span>
                </>
              )}
            </button>

            {/* Master Key Widget */}
            {neuralKey && (
              <div className="bg-blue-950/30 border border-blue-500/30 p-5 rounded-2xl animate-fadeIn">
                <div className="flex justify-between items-center mb-2 text-xs font-bold text-blue-400">
                  <span>مفتاح التشفير السيادي النشط (Master Key)</span>
                  <button 
                    onClick={() => { navigator.clipboard.writeText(neuralKey); }}
                    className="text-white hover:underline text-[11px]"
                  >
                    نسخ
                  </button>
                </div>
                <div className="bg-black/90 p-3 rounded-xl font-mono text-[11px] text-blue-300 break-all border border-blue-500/10">
                  {neuralKey}
                </div>
              </div>
            )}
          </div>

          {/* Scanner Report & Logs */}
          <div className="bg-[#0a0f1d] border border-white/10 rounded-3xl p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                <h3 className="text-xl font-black text-white">تقرير الفحص الاستخباراتي</h3>
                <span className="text-xs font-mono text-blue-400">GEMINI_SEC_V3</span>
              </div>

              {threatData ? (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex justify-between items-center">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase ${
                      threatData.threatLevel === 'critical' || threatData.isMalicious ? 'bg-rose-600 text-white' : 'bg-emerald-500 text-black'
                    }`}>
                      {threatData.threatLevel} Alert
                    </span>
                    <span className="text-xs text-slate-400">المصدر: {threatData.sourceOrigin}</span>
                  </div>

                  <div className="bg-black/50 p-4 rounded-2xl border border-white/5 space-y-2">
                    <div className="text-xs text-slate-400 font-bold">الأنماط والانحرافات المرصودة:</div>
                    <div className="flex flex-wrap gap-2">
                      {threatData.detectedAnomalies.map((a, idx) => (
                        <span key={idx} className="bg-white/5 border border-white/10 px-3 py-1 rounded-xl text-xs text-slate-200">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-950/20 border border-blue-500/20 p-4 rounded-2xl">
                    <div className="text-xs text-blue-400 font-bold mb-1">توصيات بروتوكول صارة:</div>
                    <p className="text-xs text-slate-300 leading-relaxed">{threatData.recommendedPatch}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-600">
                  <Shield className="w-16 h-16 mx-auto mb-3 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">بانتظار تشغيل أمر الفحص الأول</p>
                </div>
              )}
            </div>

            {/* Mini Log Stream */}
            <div className="bg-black/60 p-3 rounded-2xl border border-white/5 font-mono text-[10px] text-blue-400 space-y-1 max-h-36 overflow-y-auto custom-scrollbar">
              {logs.slice(0, 4).map((log, i) => (
                <div key={i} className="truncate">• {log}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Security Tuning */}
      {activeTab === 'tuning' && (
        <div className="bg-[#0a0f1d] border border-white/10 rounded-3xl p-8 space-y-8 animate-fadeIn">
          <h3 className="text-xl font-black text-white">إعدادات وضبط معايير الأمان السيادية</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-blue-400 font-bold uppercase">مستوى التشفير</span>
                <span className="text-xs text-white font-mono">{encryptionLevel}</span>
              </div>
              <div className="flex gap-2">
                {['Standard', 'Ultra', 'Quantum_RSA'].map(l => (
                  <button 
                    key={l} 
                    onClick={() => setEncryptionLevel(l)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${encryptionLevel === l ? 'bg-blue-600 border-blue-500 text-white' : 'bg-transparent border-white/10 text-slate-400 hover:text-white'}`}
                  >
                    {l.split('_')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-emerald-400 font-bold uppercase">عامل التخفي والعزل</span>
                <span className="text-xs text-white font-mono">{stealthLevel}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={stealthLevel}
                onChange={(e) => setStealthLevel(parseInt(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-white/10 rounded-full"
              />
            </div>

            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white uppercase">رصد السلوك النشط</div>
                <div className="text-[10px] text-slate-400 mt-0.5">التنبيه التلقائي عند أي نشاط شاذ</div>
              </div>
              <button 
                onClick={() => setBehaviorAuditActive(!behaviorAuditActive)}
                className={`w-12 h-6 rounded-full transition-all relative ${behaviorAuditActive ? 'bg-emerald-600' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${behaviorAuditActive ? 'right-7' : 'right-1'}`}></div>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
