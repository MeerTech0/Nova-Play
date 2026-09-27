import { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, Home, AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
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
    console.error('NovaPlay ErrorBoundary caught error:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center text-white">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[var(--nova-accent)] flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-2">
            {this.props.fallbackTitle || 'Playback Experience Interrupted'}
          </h2>

          <p className="max-w-md text-sm text-zinc-400 mb-6 leading-relaxed">
            {this.state.error?.message ||
              'A temporary rendering disruption occurred. You can reload the player or return to the main catalogue.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--nova-accent)] text-zinc-950 font-semibold text-sm hover:opacity-90 transition-all shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Player</span>
            </button>

            <button
              type="button"
              onClick={this.handleGoHome}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-sm font-medium border border-white/10 transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Return to Home</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
