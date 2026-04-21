import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import type { ClothingItem } from '@/types'
import { CATEGORY_EMOJIS } from '@/types'
import { Tag } from '@/components/ui/Tag'

interface ClothingCardProps {
  item: ClothingItem
  onDelete: () => void
}

export function ClothingCard({ item, onDelete }: ClothingCardProps) {
  return (
    <motion.div
      layout
      className="bg-card rounded-lg overflow-hidden border border-[var(--border)] group relative"
      whileHover={{ y: -3, boxShadow: '0 8px 28px rgba(28,26,23,0.12)' }}
      transition={{ type: 'spring', damping: 24, stiffness: 300 }}
    >
      {/* Image area — 3:4 aspect ratio */}
      <div className="relative w-full" style={{ aspectRatio: '3/4' }}>
        {item.imgSrc ? (
          <img
            src={item.imgSrc}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface text-5xl">
            {CATEGORY_EMOJIS[item.category]}
          </div>
        )}

        {/* Delete button on hover */}
        <motion.button
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-md text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
          aria-label="Delete item"
        >
          <Trash2 size={13} />
        </motion.button>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="font-body text-sm font-medium text-ink truncate">{item.name}</p>
        <p className="font-body text-[11px] text-muted mt-0.5">{item.category} · {item.color}</p>
        <div className="mt-2">
          <Tag label={item.occasion} occasion={item.occasion} />
        </div>
      </div>
    </motion.div>
  )
}
