'use client';
import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Production logging — would send to monitoring service
    console.error('[Ahli Connect Error]', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[300px] flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">Something went wrong</h3>
            <p className="text-sm text-[#9CA3AF] mb-4">
              An unexpected error occurred. Our team has been notified.
            </p>
            <p className="text-xs text-[#9CA3AF] bg-[#F4EFE8] rounded-[12px] p-3 mb-4 font-mono text-left break-all">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 bg-[#1B3A6B] text-white font-semibold px-5 py-2.5 rounded-[12px] text-sm hover:bg-[#152E56] transition-all"
            >
              <RefreshCw size={14} /> Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
