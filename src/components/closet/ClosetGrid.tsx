import { motion } from 'framer-motion'
import type { ClothingItem } from '@/types'
import { ClothingCard } from './ClothingCard'
import { AddClothingCard } from './AddClothingCard'
import { gridContainer as container, gridItem as item } from '@/utils/animations'

interface ClosetGridProps {
  items: ClothingItem[]
  filterKey: string
  onAdd: () => void
  onDelete: (id: string) => void
}

export function ClosetGrid({ items, filterKey, onAdd, onDelete }: ClosetGridProps) {
  return (
    <motion.div
      key={filterKey}
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}
    >
      {items.map(clothing => (
        <motion.div key={clothing.id} variants={item}>
          <ClothingCard item={clothing} onDelete={() => onDelete(clothing.id)} />
        </motion.div>
      ))}
      <motion.div variants={item}>
        <AddClothingCard onClick={onAdd} />
      </motion.div>
    </motion.div>
  )
}
