import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface GlobalErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export const GlobalError: React.FC<GlobalErrorProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error while retrieving this content. Please try again.',
  onRetry,
  showHomeButton = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-5">
        <AlertCircle className="w-7 h-7" />
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-2">
        {title}
      </h2>

      <p className="max-w-md text-sm sm:text-base text-zinc-400 mb-6 leading-relaxed">
        {message}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            type="button"
            data-cursor="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-sm font-medium border border-white/[0.1] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--nova-accent)]/50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        )}

        {showHomeButton && (
          <button
            onClick={() => navigate('/')}
            type="button"
            data-cursor="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--nova-accent)] hover:opacity-90 text-zinc-950 text-sm font-semibold transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#08090C] focus:ring-[var(--nova-accent)]"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
        )}
      </div>
    </div>
  );
};
