'use client'

import clsx from 'clsx'

interface LoadMoreButtonProps {
  onClick: () => void
  hasMore: boolean
  remainingCount: number
}

export function LoadMoreButton({
  onClick,
  hasMore,
  remainingCount,
}: LoadMoreButtonProps) {
  if (!hasMore) {
    return (
      <div className="flex flex-col items-center justify-center pt-8 pb-4 text-center">
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-mono">
          — All photos loaded —
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center pt-8 pb-4">
      <button
        onClick={onClick}
        className={clsx(
          'inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300',
          'border border-neutral-300 dark:border-neutral-700/80',
          'bg-neutral-100 hover:bg-neutral-200/90 text-neutral-800',
          'dark:bg-neutral-800/80 dark:hover:bg-neutral-700/80 dark:text-neutral-100',
          'shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500'
        )}
      >
        <span>Load More Photos</span>
        <span className="text-xs px-1.5 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-700 font-mono text-neutral-600 dark:text-neutral-300">
          +{remainingCount}
        </span>
      </button>
    </div>
  )
}
