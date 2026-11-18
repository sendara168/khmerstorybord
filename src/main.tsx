import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, fontFamily: 'sans-serif', maxWidth: 720, margin: '40px auto' }}>
          <h2 style={{ color: '#b91c1c' }}>មានបញ្ហាក្នុងការបង្ហាញកម្មវិធី (Runtime Error)</h2>
          <pre style={{ background: '#fee2e2', padding: 16, borderRadius: 8, overflow: 'auto' }}>
            {this.state.error.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '10px 16px', marginTop: 12, cursor: 'pointer' }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
