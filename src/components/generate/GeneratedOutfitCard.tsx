import { motion } from 'framer-motion'
import { Sparkles, RefreshCw, BookmarkPlus } from 'lucide-react'
import type { ClothingItem } from '@/types'
import { CATEGORY_EMOJIS } from '@/types'
import { Button } from '@/components/ui/Button'

interface GeneratedOutfitCardProps {
  pieces: ClothingItem[]
  rationale: string
  occasion: string
  onSave: () => void
  onRegenerate: () => void
}

export function GeneratedOutfitCard({ pieces, rationale, occasion, onSave, onRegenerate }: GeneratedOutfitCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-card rounded-lg border border-[var(--border)] p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-accent" />
        <span className="font-body text-xs font-medium text-accent tracking-wide uppercase">Generated Look</span>
        <span className="font-body text-xs text-muted">· {occasion}</span>
      </div>

      {/* Piece thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {pieces.map(piece => (
          <div
            key={piece.id}
            className="flex-shrink-0 rounded-md overflow-hidden border border-[var(--border)] bg-surface"
            style={{ width: 80, height: 107 }}
          >
            {piece.imgSrc ? (
              <img src={piece.imgSrc} alt={piece.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                {CATEGORY_EMOJIS[piece.category]}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Piece labels */}
      <div className="flex flex-wrap gap-1.5">
        {pieces.map(piece => (
          <span key={piece.id} className="font-body text-[11px] text-muted px-2 py-0.5 bg-surface rounded-pill">
            {piece.name}
          </span>
        ))}
      </div>

      {/* Rationale */}
      <div className="bg-accent-light rounded-md p-3.5">
        <p className="font-body text-xs text-muted leading-relaxed">
          <span className="font-medium text-ink">Why this works: </span>
          {rationale}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={onSave} size="sm" className="flex-1 gap-1.5">
          <BookmarkPlus size={13} />
          Save Outfit
        </Button>
        <Button onClick={onRegenerate} variant="secondary" size="sm" className="gap-1.5">
          <RefreshCw size={13} />
          Regenerate
        </Button>
      </div>
    </motion.div>
  )
}
