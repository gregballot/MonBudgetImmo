import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import type { AppError } from '../../types';
import './ErrorBoundary.scss';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: AppError) => void;
}

interface State {
  hasError: boolean;
  error?: AppError;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error: {
        id: Date.now().toString(),
        message: error.message,
        code: error.name,
        details: error.stack,
      },
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    const appError: AppError = {
      id: Date.now().toString(),
      message: error.message,
      code: error.name,
      details: {
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      },
    };

    this.setState({ error: appError });
    this.props.onError?.(appError);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>Oups ! Quelque chose s'est mal passé</h2>
            <p>
              Une erreur inattendue s'est produite. Veuillez rafraîchir la page ou réessayer plus tard.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Détails de l'erreur (développement)</summary>
                <pre>{JSON.stringify(this.state.error, null, 2)}</pre>
              </details>
            )}
            <button
              className="error-retry-btn"
              onClick={() => window.location.reload()}
            >
              Rafraîchir la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
