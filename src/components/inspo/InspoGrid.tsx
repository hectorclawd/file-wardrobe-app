import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import type { InspoPhoto } from '@/types'
import { InspoCard } from './InspoCard'
import { gridContainer as container, gridItem as item } from '@/utils/animations'

interface InspoGridProps {
  photos: InspoPhoto[]
  onDelete: (id: string) => void
  onAdd: () => void
}

export function InspoGrid({ photos, onDelete, onAdd }: InspoGridProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}
    >
      {photos.map(photo => (
        <motion.div key={photo.id} variants={item}>
          <InspoCard photo={photo} onDelete={() => onDelete(photo.id)} />
        </motion.div>
      ))}
      <motion.button
        variants={item}
        onClick={onAdd}
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="rounded-lg border-2 border-dashed border-[var(--border)] hover:border-accent flex flex-col items-center justify-center gap-2 text-muted hover:text-accent transition-colors cursor-pointer"
        style={{ aspectRatio: '2/3' }}
        aria-label="Add inspiration photo"
      >
        <div className="w-9 h-9 rounded-full border border-current flex items-center justify-center">
          <Plus size={16} />
        </div>
        <span className="font-body text-xs font-medium">Add inspo</span>
      </motion.button>
    </motion.div>
  )
}
