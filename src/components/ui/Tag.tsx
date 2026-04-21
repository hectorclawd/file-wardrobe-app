import type { Occasion } from '@/types'
import { OCCASION_COLORS } from '@/types'

interface TagProps {
  label: string
  occasion?: Occasion | string
  className?: string
}

export function Tag({ label, occasion, className = '' }: TagProps) {
  const color = occasion ? (OCCASION_COLORS[occasion as Occasion] ?? '#7A7570') : '#7A7570'

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-pill text-[10px] font-body font-medium tracking-wide ${className}`}
      style={{ backgroundColor: `${color}18`, color }}
    >
      {label}
    </span>
  )
}
