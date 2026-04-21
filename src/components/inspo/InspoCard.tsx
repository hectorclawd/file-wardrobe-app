import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import type { InspoPhoto } from '@/types'

interface InspoCardProps {
  photo: InspoPhoto
  onDelete: () => void
}

export function InspoCard({ photo, onDelete }: InspoCardProps) {
  return (
    <motion.div
      layout
      className="relative rounded-lg overflow-hidden border border-[var(--border)] group bg-surface"
      style={{ aspectRatio: '2/3' }}
      whileHover={{ y: -3, boxShadow: '0 8px 28px rgba(28,26,23,0.12)' }}
      transition={{ type: 'spring', damping: 24, stiffness: 300 }}
    >
      <img
        src={photo.imgSrc}
        alt={photo.note || 'Inspiration photo'}
        className="w-full h-full object-cover"
      />

      {/* Overlay */}
      {photo.note && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
          <p className="font-body text-xs text-white/90 leading-relaxed line-clamp-2">{photo.note}</p>
        </div>
      )}

      {/* Delete */}
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-md text-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
        aria-label="Delete inspiration photo"
      >
        <Trash2 size={13} />
      </button>
    </motion.div>
  )
}
