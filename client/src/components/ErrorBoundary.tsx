import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-8">
          <div className="bg-white/10 backdrop-blur rounded-lg p-8 max-w-md text-center border border-white/20">
            <h1 className="text-2xl font-bold text-white mb-4">EdVirons Loading Error</h1>
            <p className="text-blue-100 mb-6">Something went wrong while loading the application.</p>
            <div className="space-y-3">
              <button 
                onClick={() => this.setState({ hasError: false })}
                className="w-full bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-blue-50 transition-colors"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="w-full border border-white text-white px-4 py-2 rounded font-semibold hover:bg-white/10 transition-colors"
              >
                Reload Page
              </button>
            </div>
            <details className="mt-4 text-left">
              <summary className="text-blue-200 cursor-pointer">Technical Details</summary>
              <pre className="text-xs text-blue-100 mt-2 p-2 bg-black/20 rounded overflow-auto">
                {this.state.error && this.state.error.toString()}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;