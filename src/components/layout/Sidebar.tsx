import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shirt, Heart, Wand2, ImageIcon, LayoutGrid } from 'lucide-react'
import { useWardrobeStore } from '@/store/wardrobeStore'
import { darkenHex } from '@/utils/colorUtils'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const NAV_ITEMS = [
  { path: '/closet',   label: 'My Closet',   Icon: Shirt },
  { path: '/outfits',  label: 'Outfits',     Icon: LayoutGrid },
  { path: '/generate', label: 'AI Generate', Icon: Wand2 },
  { path: '/inspo',    label: 'Inspiration', Icon: ImageIcon },
]

export function Sidebar() {
  const navigate = useNavigate()
  const profile = useWardrobeStore(s => s.getActiveProfile())
  const isMobile = useMediaQuery('(max-width: 767px)')

  const sidebarBg = profile ? darkenHex(profile.accentColor, 0.3) : '#2a2824'
  const accentColor = profile?.accentColor ?? '#C4956A'

  if (isMobile) {
    return (
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex"
        style={{
          backgroundColor: sidebarBg,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {NAV_ITEMS.map(({ path, label, Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[56px] transition-colors ${
                isActive ? 'opacity-100' : 'opacity-50 hover:opacity-70'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className="transition-colors"
                  style={isActive ? { color: accentColor } : { color: 'rgba(247,244,239,0.8)' }}
                >
                  <Icon size={20} />
                </div>
                <span
                  className="text-[10px] font-body font-medium"
                  style={isActive ? { color: accentColor } : { color: 'rgba(247,244,239,0.7)' }}
                >
                  {label.split(' ')[0]}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-tab-indicator"
                    className="absolute top-0 h-0.5 w-8 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    )
  }

  return (
    <aside
      className="fixed top-0 left-0 h-full w-[220px] z-40 flex flex-col"
      style={{ backgroundColor: sidebarBg }}
    >
      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <h1
          className="font-display text-2xl font-semibold tracking-tight"
          style={{ color: 'rgba(247,244,239,0.95)' }}
        >
          Filé
        </h1>
      </div>

      {/* Active user pill */}
      {profile && (
        <button
          onClick={() => navigate('/')}
          className="mx-4 mb-5 flex items-center gap-2.5 px-3 py-2 rounded-md cursor-pointer transition-all hover:opacity-80"
          style={{ backgroundColor: 'rgba(247,244,239,0.1)' }}
        >
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: accentColor }}
          />
          <span className="font-body text-xs font-medium truncate flex-1" style={{ color: 'rgba(247,244,239,0.85)' }}>
            {profile.name}
          </span>
          <span className="font-body text-[10px] opacity-50" style={{ color: 'rgba(247,244,239,0.7)' }}>
            switch ↩
          </span>
        </button>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.slice(0, 3).map(({ path, label, Icon }) => (
          <NavItem key={path} path={path} label={label} Icon={Icon} accentColor={accentColor} />
        ))}
        <div className="my-3 h-px" style={{ backgroundColor: 'rgba(247,244,239,0.08)' }} />
        <NavItem path={NAV_ITEMS[3].path} label={NAV_ITEMS[3].label} Icon={NAV_ITEMS[3].Icon} accentColor={accentColor} />
      </nav>

      {/* Footer */}
      <div className="px-6 py-5">
        <p className="font-body text-[10px] tracking-widest uppercase" style={{ color: 'rgba(247,244,239,0.25)' }}>
          Filé Studio
        </p>
      </div>
    </aside>
  )
}

function NavItem({ path, label, Icon, accentColor }: { path: string; label: string; Icon: typeof Shirt; accentColor: string }) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-body font-medium transition-all ${
          isActive ? '' : 'hover:opacity-70'
        }`
      }
      style={({ isActive }) =>
        isActive
          ? { backgroundColor: `${accentColor}22`, color: accentColor }
          : { color: 'rgba(247,244,239,0.65)' }
      }
    >
      <Icon size={16} />
      {label}
    </NavLink>
  )
}
