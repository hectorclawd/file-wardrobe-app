import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface StatCardProps {
  value: number | string
  label: string
  icon?: ReactNode
}

export function StatCard({ value, label, icon }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-card rounded-lg p-5 border border-[var(--border)] shadow-card"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-3xl font-semibold text-ink">{value}</p>
          <p className="font-body text-xs text-muted mt-1 tracking-wide uppercase">{label}</p>
        </div>
        {icon && (
          <span className="text-accent opacity-60">{icon}</span>
        )}
      </div>
    </motion.div>
  )
}
