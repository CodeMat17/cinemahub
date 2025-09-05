"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='min-h-screen flex items-center justify-center bg-background'>
          <div className='text-center space-y-6 max-w-md mx-auto px-4'>
            <div className='space-y-4'>
              <AlertTriangle className='h-16 w-16 mx-auto text-destructive' />
              <h1 className='text-2xl font-bold'>Something went wrong</h1>
              <p className='text-muted-foreground'>
                We encountered an unexpected error. Please try refreshing the
                page.
              </p>
            </div>
            <div className='space-y-2'>
              <Button
                onClick={() => window.location.reload()}
                className='w-full'>
                <RefreshCw className='h-4 w-4 mr-2' />
                Refresh Page
              </Button>
              <Button
                variant='outline'
                onClick={() => this.setState({ hasError: false })}
                className='w-full'>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
