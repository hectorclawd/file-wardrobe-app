import { motion } from 'framer-motion'
import { LayoutGrid } from 'lucide-react'
import type { Outfit } from '@/types'
import { OutfitCard } from './OutfitCard'
import { gridContainer as container, gridItem as item } from '@/utils/animations'

interface OutfitGridProps {
  outfits: Outfit[]
  onDelete: (id: string) => void
  onGenerateCTA: () => void
}

export function OutfitGrid({ outfits, onDelete, onGenerateCTA }: OutfitGridProps) {
  if (outfits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center text-2xl">
          <LayoutGrid size={28} className="text-muted" />
        </div>
        <div>
          <p className="font-display text-xl font-medium text-ink">No outfits yet</p>
          <p className="font-body text-sm text-muted mt-1">Generate your first look or build one manually</p>
        </div>
        <button
          onClick={onGenerateCTA}
          className="mt-2 px-6 py-2.5 rounded-pill bg-accent text-white text-sm font-body font-medium hover:opacity-90 transition-opacity cursor-pointer"
        >
          Generate an outfit
        </button>
      </div>
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
    >
      {outfits.map(outfit => (
        <motion.div key={outfit.id} variants={item}>
          <OutfitCard outfit={outfit} onDelete={() => onDelete(outfit.id)} />
        </motion.div>
      ))}
    </motion.div>
  )
}
