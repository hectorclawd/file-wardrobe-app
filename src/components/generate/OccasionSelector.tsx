import { motion } from 'framer-motion'
import type { Occasion } from '@/types'

const OCCASIONS: { value: Occasion; emoji: string }[] = [
  { value: 'Casual',     emoji: '☀️' },
  { value: 'Work',       emoji: '💼' },
  { value: 'Night Out',  emoji: '🌙' },
  { value: 'Formal',     emoji: '🎩' },
  { value: 'Sport',      emoji: '🏃' },
  { value: 'Date Night', emoji: '🌹' },
]

interface OccasionSelectorProps {
  selected: Occasion | null
  onSelect: (occasion: Occasion) => void
}

export function OccasionSelector({ selected, onSelect }: OccasionSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {OCCASIONS.map(({ value, emoji }) => {
        const isSelected = selected === value
        return (
          <motion.button
            key={value}
            onClick={() => onSelect(value)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            className={`flex flex-col items-center gap-1.5 py-4 px-3 rounded-lg border transition-all cursor-pointer ${
              isSelected
                ? 'border-transparent text-white'
                : 'border-[var(--border)] bg-card text-ink hover:border-accent'
            }`}
            style={isSelected ? { backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' } : {}}
          >
            <span className="text-xl">{emoji}</span>
            <span className="font-body text-xs font-medium">{value}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
