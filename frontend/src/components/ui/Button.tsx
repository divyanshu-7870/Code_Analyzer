import type { ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

type ButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  variant?: ButtonVariant
  icon?: ReactNode
  children?: ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'border-blue-500/70 bg-blue-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.22)] hover:bg-blue-400',
  secondary: 'border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-zinc-500 hover:bg-zinc-800',
  ghost: 'border-transparent bg-transparent text-zinc-400 hover:bg-zinc-900 hover:text-white',
  danger: 'border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/15',
}

export function Button({ variant = 'secondary', icon, children, className = '', disabled, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.015 }}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon}
      {children}
    </motion.button>
  )
}
