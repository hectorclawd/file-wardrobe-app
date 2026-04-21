import { motion } from 'framer-motion'
import type { UserProfile } from '@/types'

interface ProfileCardProps {
  profile: UserProfile
  onClick: () => void
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('')
}

export function ProfileCard({ profile, onClick }: ProfileCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(28,26,23,0.16)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg cursor-pointer w-40 border text-left"
      style={{ borderColor: profile.accentColor, borderWidth: '0.5px' }}
    >
      {/* Avatar */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-display font-medium"
        style={{ backgroundColor: profile.accentColor }}
      >
        {getInitials(profile.name)}
      </div>

      {/* Name */}
      <div className="text-center">
        <p className="font-display text-base font-medium text-ink leading-tight">{profile.name}</p>
        <p className="font-body text-xs text-muted mt-1">
          {profile.clothes.length} piece{profile.clothes.length !== 1 ? 's' : ''}
          {' · '}
          {profile.outfits.length} outfit{profile.outfits.length !== 1 ? 's' : ''}
        </p>
      </div>
    </motion.button>
  )
}
