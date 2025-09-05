"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Component, ReactNode } from "react";

interface ImageErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ImageErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
  showRetryButton?: boolean;
}

export class ImageErrorBoundary extends Component<
  ImageErrorBoundaryProps,
  ImageErrorBoundaryState
> {
  constructor(props: ImageErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ImageErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Image Error Boundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='flex flex-col items-center justify-center p-8 bg-muted/50 rounded-lg'>
          <AlertCircle className='h-12 w-12 text-destructive mb-4' />
          <h3 className='text-lg font-semibold mb-2'>Image Failed to Load</h3>
          <p className='text-muted-foreground text-center mb-4'>
            There was an error loading this image. This might be due to network
            issues or the image being unavailable.
          </p>
          {this.props.showRetryButton !== false && (
            <button
              onClick={this.handleRetry}
              className='flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors'>
              <RefreshCw className='h-4 w-4' />
              Try Again
            </button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useImageErrorBoundary() {
  const handleImageError = (error: Error) => {
    console.error("Image loading error:", error);
    // You can add additional error handling logic here
    // such as reporting to error tracking services
  };

  return { handleImageError };
}
