'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  CATEGORIES,
  findPhotoBySlug,
  photoToSlug,
  type Category,
  type Photo,
} from '~/data/photos'
import { BackgroundPhotoCache } from './background-photo-cache'
import { FilterBar } from './filter-bar'
import { LoadMoreButton } from './load-more-button'
import { PhotoCard } from './photo-card'
import { PhotoLightbox } from './photo-lightbox'

const INITIAL_BATCH_SIZE = 15
const BATCH_INCREMENT = 15

export function PhotoGrid({ photos }: { photos: Photo[] }) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All')
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH_SIZE)
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null)

  // 1. Initial deep-link resolution on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const hash = window.location.hash
    if (hash) {
      const initialPhoto = findPhotoBySlug(photos, hash)
      if (initialPhoto) {
        setActivePhoto(initialPhoto)
      }
    }
  }, [photos])

  // 2. Synchronize browser Back/Forward history buttons
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleHashSync = () => {
      const hash = window.location.hash
      if (!hash || hash === '#') {
        setActivePhoto(null)
      } else {
        const matched = findPhotoBySlug(photos, hash)
        if (matched) {
          setActivePhoto(matched)
        }
      }
    }

    window.addEventListener('popstate', handleHashSync)
    window.addEventListener('hashchange', handleHashSync)
    return () => {
      window.removeEventListener('popstate', handleHashSync)
      window.removeEventListener('hashchange', handleHashSync)
    }
  }, [photos])

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: photos.length }
    photos.forEach((photo) => {
      const cat = photo.category || 'Photography'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return counts
  }, [photos])

  // Filter photos based on category
  const filteredPhotos = useMemo(() => {
    if (selectedCategory === 'All') return photos
    return photos.filter((photo) => photo.category === selectedCategory)
  }, [photos, selectedCategory])

  // Ensure active photo is present in the lightbox list even if category filter differs
  const lightboxPhotos = useMemo(() => {
    if (activePhoto && !filteredPhotos.some((p) => p.id === activePhoto.id)) {
      return photos
    }
    return filteredPhotos
  }, [activePhoto, filteredPhotos, photos])

  // Reset pagination when category changes
  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category)
    setVisibleCount(INITIAL_BATCH_SIZE)
  }

  const visiblePhotos = filteredPhotos.slice(0, visibleCount)
  const hasMore = visibleCount < filteredPhotos.length
  const remainingCount = Math.min(BATCH_INCREMENT, filteredPhotos.length - visibleCount)

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + BATCH_INCREMENT)
  }

  // Open photo & push to browser history
  const handleSelectPhoto = (photo: Photo) => {
    setActivePhoto(photo)
    if (typeof window !== 'undefined') {
      const slug = photoToSlug(photo)
      window.history.pushState(null, '', `#${slug}`)
    }
  }

  // Navigate photos & replace state to keep history clean
  const handleNavigatePhoto = (photo: Photo) => {
    setActivePhoto(photo)
    if (typeof window !== 'undefined') {
      const slug = photoToSlug(photo)
      window.history.replaceState(null, '', `#${slug}`)
    }
  }

  // Close lightbox & clear hash from URL cleanly
  const handleCloseLightbox = () => {
    setActivePhoto(null)
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.pushState(
        null,
        '',
        window.location.pathname + window.location.search
      )
    }
  }

  return (
    <div className="w-full">
      {/* Background Cache Storage Downloader & Pre-warmer */}
      <BackgroundPhotoCache photos={photos} />

      {/* Category filter pills */}
      <FilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        categoryCounts={categoryCounts}
      />

      {/* Zero state */}
      {filteredPhotos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-base text-neutral-600 dark:text-neutral-400 font-medium">
            No photos found in this category
          </p>
          <button
            onClick={() => setSelectedCategory('All')}
            className="mt-4 px-4 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-xs font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
          >
            Show All Photos
          </button>
        </div>
      ) : (
        <>
          {/* Masonry Multi-Column Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {visiblePhotos.map((photo, index) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                index={index}
                onSelect={handleSelectPhoto}
              />
            ))}
          </div>

          {/* Load More Button matching mushfiqweb.com style */}
          <LoadMoreButton
            onClick={handleLoadMore}
            hasMore={hasMore}
            remainingCount={remainingCount}
          />
        </>
      )}

      {/* Full-screen Lightbox Modal */}
      <PhotoLightbox
        photos={lightboxPhotos}
        activePhoto={activePhoto}
        onClose={handleCloseLightbox}
        onNavigate={handleNavigatePhoto}
      />
    </div>
  )
}
