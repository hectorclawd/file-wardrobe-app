import { motion } from 'framer-motion'
import { Trash2, Sparkles } from 'lucide-react'
import type { Outfit } from '@/types'
import { CATEGORY_EMOJIS } from '@/types'
import { Tag } from '@/components/ui/Tag'

interface OutfitCardProps {
  outfit: Outfit
  onDelete: () => void
}

export function OutfitCard({ outfit, onDelete }: OutfitCardProps) {
  const displayPieces = outfit.pieces.slice(0, 4)

  return (
    <motion.div
      layout
      className="bg-card rounded-lg overflow-hidden border border-[var(--border)] group"
      whileHover={{ y: -3, boxShadow: '0 8px 28px rgba(28,26,23,0.12)' }}
      transition={{ type: 'spring', damping: 24, stiffness: 300 }}
    >
      {/* Thumbnail grid */}
      <div className="grid grid-cols-2 gap-px bg-surface" style={{ aspectRatio: '4/3' }}>
        {displayPieces.map((piece, i) => (
          <div key={piece.id} className="relative overflow-hidden bg-surface">
            {piece.imgSrc ? (
              <img
                src={piece.imgSrc}
                alt={piece.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                {CATEGORY_EMOJIS[piece.category]}
              </div>
            )}
          </div>
        ))}
        {/* Fill empty slots */}
        {Array.from({ length: Math.max(0, 4 - displayPieces.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-surface/50" />
        ))}
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-body text-sm font-medium text-ink truncate">{outfit.label}</p>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <Tag label={outfit.occasion} occasion={outfit.occasion} />
              {outfit.fromInspo && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill bg-accent-light text-accent text-[10px] font-body font-medium">
                  <Sparkles size={9} />
                  Inspo
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onDelete}
            className="p-1.5 text-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer flex-shrink-0"
            aria-label="Delete outfit"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
