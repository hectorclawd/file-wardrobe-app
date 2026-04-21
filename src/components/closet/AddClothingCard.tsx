import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

interface AddClothingCardProps {
  onClick: () => void
}

export function AddClothingCard({ onClick }: AddClothingCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', damping: 24, stiffness: 300 }}
      className="rounded-lg border-2 border-dashed border-[var(--border)] hover:border-accent flex flex-col items-center justify-center gap-2 text-muted hover:text-accent transition-colors cursor-pointer"
      style={{ aspectRatio: '3/4' }}
      aria-label="Add clothing item"
    >
      <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center">
        <Plus size={18} />
      </div>
      <span className="font-body text-xs font-medium">Add piece</span>
    </motion.button>
  )
}
