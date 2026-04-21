import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { useWardrobeStore } from './store/wardrobeStore'

function Root() {
  const hasHydrated = useWardrobeStore(s => s._hasHydrated)

  if (!hasHydrated) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F7F4EF',
        }}
      >
        <p
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '2.5rem',
            fontWeight: 500,
            color: '#1C1A17',
            letterSpacing: '-0.02em',
          }}
        >
          Fil<span style={{ color: '#C4956A' }}>é</span>
        </p>
      </div>
    )
  }

  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
