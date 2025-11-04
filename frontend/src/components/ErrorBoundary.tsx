import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FaExclamationCircle, FaHome } from 'react-icons/fa';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details to console
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-dark-darker px-5">
          <motion.div
            className="max-w-2xl w-full text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Error Icon */}
            <motion.div
              className="text-8xl text-red-500 mb-6 inline-block"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <FaExclamationCircle />
            </motion.div>

            {/* Title */}
            <h1 className="text-5xl font-black mb-4 bg-gradient-full bg-clip-text text-transparent">
              Oops! Something went wrong
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              We encountered an unexpected error. Don't worry, it's not your fault!
            </p>

            {/* Error Details (in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <motion.details
                className="mb-8 text-left bg-dark-card/50 border border-red-500/30 rounded-xl p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <summary className="cursor-pointer text-red-400 font-semibold mb-2">
                  Error Details (Development Mode)
                </summary>
                <pre className="text-xs text-gray-300 overflow-auto max-h-64 mt-4">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </motion.details>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center flex-wrap">
              <motion.button
                onClick={this.handleReload}
                className="bg-gradient-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reload Page
              </motion.button>

              <motion.button
                onClick={this.handleGoHome}
                className="bg-dark-card border-2 border-primary/30 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 inline-flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaHome />
                Go Home
              </motion.button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

