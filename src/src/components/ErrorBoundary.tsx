import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-black px-4 font-mono text-[#d4d4d4]">
          <div className="w-full max-w-md rounded-md border border-white/10 bg-[#0a0a0a] p-6">
            <p className="text-sm text-red-400">
              zsh: segmentation fault&nbsp;&nbsp;something went wrong
            </p>
            <p className="mt-2 text-xs text-[#9a9a9a]">
              {this.state.error?.message ?? "Unknown error"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded border border-white/20 px-3 py-1 text-xs text-[#d4d4d4] hover:bg-white/10"
            >
              reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
