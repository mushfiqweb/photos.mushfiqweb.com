'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useState } from 'react'
import type { Photo } from '~/data/photos'

interface PhotoCardProps {
  photo: Photo
  index: number
  onSelect: (photo: Photo) => void
}

export function PhotoCard({ photo, index, onSelect }: PhotoCardProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  // Pre-decode the image on hover so clicking opens the lightbox in 0ms
  const handleMouseEnter = () => {
    if (typeof window !== 'undefined') {
      const img = new window.Image()
      img.src = photo.src
    }
  }

  return (
    <div
      onClick={() => onSelect(photo)}
      onMouseEnter={handleMouseEnter}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(photo)
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View photo: ${photo.title}`}
      className={clsx(
        'group relative overflow-hidden rounded-xl cursor-pointer break-inside-avoid mb-4',
        'border border-neutral-200/50 dark:border-neutral-800/60',
        'bg-neutral-100 dark:bg-neutral-900',
        'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/40',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500'
      )}
    >
      {/* Aspect Ratio Box with Image */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: `${photo.width} / ${photo.height}`,
        }}
      >
        <Image
          src={photo.src}
          alt={photo.description || photo.title || 'Photo'}
          fill
          unoptimized
          placeholder={photo.blurDataURL ? 'blur' : 'empty'}
          blurDataURL={photo.blurDataURL}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={clsx(
            'object-cover transition-all duration-700 ease-out group-hover:scale-105',
            !isLoaded ? 'blur-xl scale-105 opacity-80' : 'blur-0 scale-100 opacity-100'
          )}
          onLoad={() => setIsLoaded(true)}
          priority={index < 4}
        />

        {/* Gradient dark overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover info badge */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-white text-sm sm:text-base font-semibold truncate tracking-wide">
              {photo.title}
            </h3>
            {photo.category && (
              <span className="shrink-0 text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                {photo.category}
              </span>
            )}
          </div>

          <p className="text-neutral-300 text-xs font-mono truncate">
            {photo.caption}
          </p>
        </div>
      </div>
    </div>
  )
}
