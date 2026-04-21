import { motion } from 'framer-motion'

interface FilterChipProps {
  label: string
  active: boolean
  onClick: () => void
}

export function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={`px-4 py-1.5 rounded-pill text-xs font-body font-medium transition-all border cursor-pointer whitespace-nowrap ${
        active
          ? 'text-white border-transparent'
          : 'text-muted bg-transparent border-[var(--border)] hover:border-accent hover:text-ink'
      }`}
      style={active ? { backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' } : {}}
    >
      {label}
    </motion.button>
  )
}
