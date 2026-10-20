'use client'

import clsx from 'clsx'
import { CATEGORIES, type Category } from '~/data/photos'

interface FilterBarProps {
  selectedCategory: Category
  onSelectCategory: (category: Category) => void
  categoryCounts: Record<string, number>
}

export function FilterBar({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}: FilterBarProps) {
  return (
    <div className="w-full mb-8">
      {/* Category Filter Pills Centered */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category
          const count = categoryCounts[category] || 0
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={clsx(
                'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200',
                isSelected
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm ring-1 ring-neutral-900/10 dark:ring-white/20'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600 dark:bg-neutral-800/80 dark:hover:bg-neutral-800 dark:text-neutral-300'
              )}
            >
              <span>{category}</span>
              <span
                className={clsx(
                  'text-[10px] px-1.5 py-0.2 rounded-full font-mono',
                  isSelected
                    ? 'bg-white/20 text-white dark:bg-neutral-900/20 dark:text-neutral-900'
                    : 'bg-neutral-200/60 dark:bg-neutral-700/60 text-neutral-500 dark:text-neutral-400'
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
