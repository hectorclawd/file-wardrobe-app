import { useNavigate } from 'react-router-dom'
import { useWardrobeStore } from '@/store/wardrobeStore'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import type { ReactNode } from 'react'

interface TopbarProps {
  title: string
  actions?: ReactNode
}

export function Topbar({ title, actions }: TopbarProps) {
  const navigate = useNavigate()
  const profile = useWardrobeStore(s => s.getActiveProfile())
  const isMobile = useMediaQuery('(max-width: 767px)')

  return (
    <header className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-[var(--border)] bg-cream/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile: profile pill */}
        {isMobile && profile && (
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-pill border border-[var(--border)] bg-surface hover:bg-accent-light transition-colors cursor-pointer"
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: profile.accentColor }}
            />
            <span className="font-body text-xs font-medium text-ink">{profile.name}</span>
          </button>
        )}
        <h1 className="font-display text-2xl md:text-3xl font-medium text-ink">{title}</h1>
      </div>
      {actions && (
        <div className="flex items-center gap-2">{actions}</div>
      )}
    </header>
  )
}
