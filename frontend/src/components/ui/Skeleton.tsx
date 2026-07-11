export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-shimmer rounded-lg bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 ${className}`} />
}
