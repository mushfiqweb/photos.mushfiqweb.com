'use client'

import { clsx } from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { Heart, Sparkles, Target, Lightbulb } from 'lucide-react'
import type { SelectStats, StatsType } from '~/utils/supabase'
import { useBlogStats, useUpdateBlogStats } from '~/hooks/use-blog-stats'

const MAX_REACTIONS = 10

const REACTIONS = [
  {
    Icon: Heart,
    key: 'loves' as keyof Omit<SelectStats, 'type' | 'slug'>,
    label: 'Love',
    colorClass: 'hover:text-red-500 dark:hover:text-red-400 hover:scale-125 hover:rotate-6',
    activeClass: 'text-red-500 dark:text-red-400 fill-red-500 dark:fill-red-400 scale-110',
  },
  {
    Icon: Sparkles,
    key: 'applauses' as keyof Omit<SelectStats, 'type' | 'slug'>,
    label: 'Applause',
    colorClass: 'hover:text-orange-500 dark:hover:text-orange-400 hover:scale-125 hover:-rotate-12',
    activeClass:
      'text-orange-500 dark:text-orange-400 fill-orange-500 dark:fill-orange-400 scale-110',
  },
  {
    Icon: Target,
    key: 'bullseyes' as keyof Omit<SelectStats, 'type' | 'slug'>,
    label: 'Bullseye',
    colorClass: 'hover:text-blue-500 dark:hover:text-blue-400 hover:scale-125 hover:rotate-12',
    activeClass: 'text-blue-500 dark:text-blue-400 fill-blue-500 dark:fill-blue-400 scale-110',
  },
  {
    Icon: Lightbulb,
    key: 'ideas' as keyof Omit<SelectStats, 'type' | 'slug'>,
    label: 'Idea',
    colorClass: 'hover:text-yellow-500 dark:hover:text-yellow-400 hover:scale-125 hover:-rotate-6',
    activeClass:
      'text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400 scale-110',
  },
]

export function Reactions({
  type,
  slug,
  className,
}: {
  type: StatsType
  slug: string
  className?: string
}) {
  let [stats, isLoading] = useBlogStats(type, slug)
  let updateReaction = useUpdateBlogStats()
  let [initialReactions, setInitialReactions] = useState<Record<string, boolean>>({})
  let [reactions, setReactions] = useState<Record<string, boolean>>({})

  useEffect(() => {
    try {
      const newKey = `reactions/${type}/${slug}`
      const oldKey = `${type}/${slug}`
      let newFormatData = localStorage.getItem(newKey)
      let parsed: Record<string, boolean> = {}

      if (newFormatData) {
        parsed = JSON.parse(newFormatData)
      } else {
        // Fallback to old format migration
        let oldFormatData = localStorage.getItem(oldKey)
        if (oldFormatData) {
          const oldJson = JSON.parse(oldFormatData)
          parsed = {
            loves: !!oldJson.loves,
            applauses: !!oldJson.applauses,
            ideas: !!oldJson.ideas,
            bullseyes: !!oldJson.bullseyes,
          }
          localStorage.setItem(newKey, JSON.stringify(parsed))
        }
      }

      const loaded = {
        loves: !!parsed.loves,
        applauses: !!parsed.applauses,
        ideas: !!parsed.ideas,
        bullseyes: !!parsed.bullseyes,
      }
      setInitialReactions(loaded)
      setReactions(loaded)
    } catch (e) {}
  }, [type, slug])

  const reactionsRef = useRef(reactions)
  useEffect(() => {
    reactionsRef.current = reactions
  }, [reactions])

  useEffect(() => {
    if (stats) {
      setInitialReactions(reactionsRef.current)
    }
  }, [stats])

  function handleToggle(key: string) {
    if (isLoading || !stats) return

    const nextReacted = !reactions[key]
    const updatedReactions = { ...reactions, [key]: nextReacted }
    setReactions(updatedReactions)

    // Calculate new DB total (base count + user delta)
    const dbTotal = stats[key] + (nextReacted ? 1 : 0) - (initialReactions[key] ? 1 : 0)

    // Save to local storage
    localStorage.setItem(`reactions/${type}/${slug}`, JSON.stringify(updatedReactions))

    // Send update to server
    updateReaction({ type, slug, [key]: dbTotal })
  }

  return (
    <div className={clsx('flex items-center gap-6', className)}>
      {REACTIONS.map(({ key, Icon, colorClass, activeClass, label }) => {
        const hasReacted = !!reactions[key]
        const value = stats[key] + (hasReacted ? 1 : 0) - (initialReactions[key] ? 1 : 0)
        return (
          <Reaction
            key={key}
            Icon={Icon}
            colorClass={colorClass}
            activeClass={activeClass}
            label={label}
            value={isLoading ? '--' : Math.max(0, value)}
            hasReacted={hasReacted}
            onClick={() => handleToggle(key)}
          />
        )
      })}
    </div>
  )
}

function Reaction({
  Icon,
  colorClass,
  activeClass,
  label,
  value,
  hasReacted,
  onClick,
}: {
  Icon: React.ComponentType<{
    className?: string
    strokeWidth?: number
    size?: number
    fill?: string
  }>
  colorClass: string
  activeClass: string
  label: string
  value: string | number
  hasReacted: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group relative flex select-none flex-col items-center justify-center gap-1.5 transition-transform focus:outline-none active:scale-95"
      data-umami-event="post-reaction"
      title={label}
    >
      <div
        className={clsx(
          'transition-all duration-300 ease-in-out',
          hasReacted ? activeClass : 'text-gray-400 dark:text-gray-500',
          colorClass
        )}
      >
        <Icon strokeWidth={1.5} size={26} fill={hasReacted ? 'currentColor' : 'none'} />
      </div>
      <span className="min-w-[20px] text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
        {value}
      </span>
    </button>
  )
}
