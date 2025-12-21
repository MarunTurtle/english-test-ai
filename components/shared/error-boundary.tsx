'use client';

import { Component, ReactNode } from 'react';
import { MdError, MdRefresh, MdHome } from 'react-icons/md';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch and handle React errors
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    // Log error to console (in production, send to error tracking service)
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      // Default error UI
      return (
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <MdError className="text-red-500 text-5xl" />
            </div>
            
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              Something went wrong
            </h2>
            
            <p className="text-red-700 mb-4">
              {this.state.error.message || 'An unexpected error occurred'}
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.reset}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <MdRefresh className="text-lg" />
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = '/app'}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                <MdHome className="text-lg" />
                Go Home
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-red-800 cursor-pointer hover:underline">
                  Error details (dev only)
                </summary>
                <pre className="mt-2 text-xs text-red-900 bg-red-100 p-3 rounded overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Simple error fallback component for use with error boundaries
 */
export function SimpleErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <MdError className="text-red-500 text-4xl mb-3" />
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        Error Loading Content
      </h3>
      <p className="text-slate-600 mb-4 text-sm">
        {error.message || 'Something went wrong'}
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
      >
        <MdRefresh className="text-base" />
        Try Again
      </button>
    </div>
  );
}

