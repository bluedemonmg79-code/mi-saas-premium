import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log del error
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });

    // Aquí podrías enviar el error a un servicio de logging como Sentry
    // Ejemplo: logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
          color: 'white',
          padding: '2rem',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{
            maxWidth: '500px',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '20px',
            padding: '3rem'
          }}>
            <AlertTriangle 
              size={60} 
              color="#ef4444" 
              style={{ marginBottom: '1.5rem' }} 
            />
            <h2 style={{ 
              fontSize: '1.5rem', 
              marginBottom: '1rem',
              color: '#ef4444'
            }}>
              Oops! Algo salió mal
            </h2>
            <p style={{ 
              color: 'rgba(255,255,255,0.6)', 
              marginBottom: '2rem',
              lineHeight: 1.6
            }}>
              Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                textAlign: 'left',
                background: 'rgba(0,0,0,0.3)',
                padding: '1rem',
                borderRadius: '10px',
                marginBottom: '1.5rem',
                fontSize: '0.85rem'
              }}>
                <summary style={{ 
                  cursor: 'pointer', 
                  marginBottom: '0.5rem',
                  color: '#fca5a5'
                }}>
                  Ver detalles del error
                </summary>
                <pre style={{ 
                  whiteSpace: 'pre-wrap', 
                  wordBreak: 'break-word',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.75rem'
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.8rem 2rem',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
