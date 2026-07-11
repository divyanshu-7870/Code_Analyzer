import { motion, type HTMLMotionProps } from 'framer-motion'

export function Card({ className = '', ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-xl border border-zinc-800 bg-zinc-900/80 shadow-[0_18px_60px_rgba(0,0,0,0.22)] ${className}`}
      {...props}
    />
  )
}
