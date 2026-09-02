import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Sarah System ErrorBoundary Caught Error]:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#02020a] text-slate-200 flex items-center justify-center p-6 font-mono" dir="rtl">
          <div className="max-w-xl w-full bg-[#080816] border border-rose-500/40 rounded-3xl p-8 shadow-[0_0_50px_rgba(244,63,94,0.15)] space-y-6 text-center relative overflow-hidden">
            <div className="w-16 h-16 bg-rose-500/20 border border-rose-500/50 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
              <ShieldAlert className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white font-sans">
                استعادة التوازن الفوري - صارة v16
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                تم احتواء استثناء تشغيلي في واجهة المعاينة بنجاح بواسطة درع الحماية العصبوني.
              </p>
            </div>

            {this.state.error && (
              <div className="p-4 bg-black/60 rounded-2xl border border-white/10 text-right text-xs text-rose-300 overflow-x-auto max-h-40 no-scrollbar">
                <span className="font-bold text-slate-400 block mb-1">رمز الخطأ:</span>
                <code>{this.state.error.toString()}</code>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة تشغيل المعاينة</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
