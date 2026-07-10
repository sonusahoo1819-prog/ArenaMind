'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 border rounded-2xl bg-[#FF1744]/5 border-[#FF1744]/20 shadow-xl max-w-md mx-auto my-8 text-center space-y-4">
          <div className="p-3 rounded-2xl bg-[#FF1744]/15 border border-[#FF1744]/30 animate-pulse">
            <ShieldAlert className="w-8 h-8 text-[#FF1744]" />
          </div>
          <h2 className="text-base font-extrabold text-white uppercase tracking-wider">
            System Component Error
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            An unexpected error occurred in this workspace component. Operations telemetry remains stable.
          </p>
          {this.state.error && (
            <pre className="text-[10px] text-left p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/50 text-red-400 overflow-auto w-full max-h-32">
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleRetry}
            className="px-5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all cursor-pointer"
          >
            Retry Component
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
