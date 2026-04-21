import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
  fullWidth?: boolean
}

const BASE = 'inline-flex items-center justify-center gap-2 font-body font-medium transition-colors cursor-pointer select-none rounded-pill'

const VARIANTS = {
  primary:   'bg-accent text-white hover:opacity-90',
  secondary: 'bg-surface text-ink border border-[var(--border)] hover:bg-accent-light',
  ghost:     'bg-transparent text-ink hover:bg-surface',
}

const SIZES = {
  sm: 'px-4 py-1.5 text-xs tracking-wide',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  className = '',
  fullWidth = false,
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </motion.button>
  )
}
