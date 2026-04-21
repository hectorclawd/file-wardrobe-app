import { useEffect, type ReactNode } from 'react'
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useWardrobeStore } from '@/store/wardrobeStore'
import { Sidebar } from '@/components/layout/Sidebar'
import { ProfileSelect } from '@/pages/ProfileSelect'
import { Closet } from '@/pages/Closet'
import { Outfits } from '@/pages/Outfits'
import { Generate } from '@/pages/Generate'
import { Inspo } from '@/pages/Inspo'
import { hexToRgbString } from '@/utils/colorUtils'

function AppShell({ children }: { children: ReactNode }) {
  const { activeProfileId, getActiveProfile } = useWardrobeStore()
  const profile = getActiveProfile()

  useEffect(() => {
    if (profile) {
      document.documentElement.style.setProperty('--accent', profile.accentColor)
      document.documentElement.style.setProperty('--accent-rgb', profile.accentRgb)
      document.documentElement.style.setProperty('--accent-light', blendWithCream(profile.accentColor, 0.15))
    }
    return () => {
      document.documentElement.style.removeProperty('--accent')
      document.documentElement.style.removeProperty('--accent-rgb')
      document.documentElement.style.removeProperty('--accent-light')
    }
  }, [profile?.accentColor])

  if (!activeProfileId) return <Navigate to="/" replace />

  return (
    <div className="flex h-full">
      <Sidebar />
      {/* Main content: offset by sidebar on desktop */}
      <div className="flex-1 flex flex-col md:ml-[220px] min-h-0">
        {children}
      </div>
    </div>
  )
}

function blendWithCream(hex: string, opacity: number): string {
  try {
    const rgb = hexToRgbString(hex)
    const [r, g, b] = rgb.split(' ').map(Number)
    // Blend with cream #F7F4EF
    const cr = Math.round(r * opacity + 247 * (1 - opacity))
    const cg = Math.round(g * opacity + 244 * (1 - opacity))
    const cb = Math.round(b * opacity + 239 * (1 - opacity))
    return `#${[cr, cg, cb].map(v => v.toString(16).padStart(2, '0')).join('')}`
  } catch {
    return '#F0E6D8'
  }
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<ProfileSelect />} />
        <Route
          path="/closet"
          element={
            <AppShell>
              <motion.div
                className="flex-1 flex flex-col min-h-0 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Closet />
              </motion.div>
            </AppShell>
          }
        />
        <Route
          path="/outfits"
          element={
            <AppShell>
              <Outfits />
            </AppShell>
          }
        />
        <Route
          path="/generate"
          element={
            <AppShell>
              <Generate />
            </AppShell>
          }
        />
        <Route
          path="/inspo"
          element={
            <AppShell>
              <Inspo />
            </AppShell>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AnimatedRoutes />
    </HashRouter>
  )
}
