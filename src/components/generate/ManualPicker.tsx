import { motion } from 'framer-motion'
import { Wand2 } from 'lucide-react'
import type { ClothingItem } from '@/types'
import { CATEGORY_EMOJIS } from '@/types'

interface ManualPickerProps {
  items: ClothingItem[]
  selected: string[]
  onToggle: (id: string) => void
  onComplete: () => void
}

export function ManualPicker({ items, selected, onToggle, onComplete }: ManualPickerProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto pb-2 -mx-1 px-1">
        <div className="flex gap-3" style={{ width: 'max-content' }}>
          {items.map(item => {
            const isSelected = selected.includes(item.id)
            return (
              <motion.button
                key={item.id}
                onClick={() => onToggle(item.id)}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 rounded-md overflow-hidden border-2 transition-all cursor-pointer relative"
                style={{
                  width: 72,
                  height: 96,
                  borderColor: isSelected ? 'var(--accent)' : 'transparent',
                }}
              >
                {item.imgSrc ? (
                  <img src={item.imgSrc} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface text-2xl">
                    {CATEGORY_EMOJIS[item.category]}
                  </div>
                )}
                {isSelected && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.15)' }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      <span className="text-white text-[10px] font-bold">✓</span>
                    </div>
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {selected.length > 0 && (
        <motion.button
          onClick={onComplete}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-pill bg-accent text-white text-sm font-body font-medium hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Wand2 size={14} />
          Complete This Look ✨
        </motion.button>
      )}

      {items.length === 0 && (
        <p className="font-body text-sm text-muted text-center py-6">
          Add pieces to your closet first to build a custom outfit.
        </p>
      )}
    </div>
  )
}
