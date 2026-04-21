import { StrictMode, Component, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { useWardrobeStore } from './store/wardrobeStore'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null }
  static getDerivedStateFromError(e: Error) { return { error: e.message } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, fontFamily: 'monospace', backgroundColor: '#F7F4EF', minHeight: '100vh' }}>
          <h2 style={{ color: '#C4607A', marginBottom: 12 }}>Something went wrong</h2>
          <pre style={{ color: '#1C1A17', whiteSpace: 'pre-wrap', fontSize: 13 }}>{this.state.error}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

function Root() {
  const hasHydrated = useWardrobeStore(s => s._hasHydrated)

  if (!hasHydrated) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F4EF' }}>
        <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', fontWeight: 500, color: '#1C1A17' }}>
          Fil<span style={{ color: '#C4956A' }}>é</span>
        </p>
      </div>
    )
  }

  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Root />
    </ErrorBoundary>
  </StrictMode>,
)
