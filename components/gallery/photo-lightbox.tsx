'use client'

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock'
import clsx from 'clsx'
import {
  Calendar,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  Share2,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { Fragment, useEffect, useRef, useState } from 'react'
import { photoToSlug, type Photo } from '~/data/photos'

interface PhotoLightboxProps {
  photos: Photo[]
  activePhoto: Photo | null
  onClose: () => void
  onNavigate: (photo: Photo) => void
}

export function PhotoLightbox({
  photos,
  activePhoto,
  onClose,
  onNavigate,
}: PhotoLightboxProps) {
  const [showInfo, setShowInfo] = useState(true)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [showSpinner, setShowSpinner] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const loadedUrlsRef = useRef<Set<string>>(new Set())
  const modalRef = useRef<HTMLDivElement>(null)

  const handleShare = async () => {
    if (!activePhoto || typeof window === 'undefined') return

    const slug = photoToSlug(activePhoto)
    const shareUrl = `${window.location.origin}${window.location.pathname}#${slug}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${activePhoto.title} | Photos by Mushfiqur Rahman`,
          text: activePhoto.description || `Check out "${activePhoto.title}" captured by Mushfiqur Rahman.`,
          url: shareUrl,
        })
        return
      } catch {
        // Fallback to clipboard if share cancelled
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  const currentIndex = activePhoto ? photos.findIndex((p) => p.id === activePhoto.id) : -1
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < photos.length - 1

  // Manage loading state when active photo changes
  useEffect(() => {
    if (!activePhoto) return

    if (loadedUrlsRef.current.has(activePhoto.src)) {
      setIsImageLoading(false)
      setShowSpinner(false)
      return
    }

    setIsImageLoading(true)
    setShowSpinner(false)
    const timer = setTimeout(() => {
      setShowSpinner(true)
    }, 150)

    return () => clearTimeout(timer)
  }, [activePhoto?.id, activePhoto?.src])

  // Pre-load next 2 and previous 2 images in the background for instant navigation
  useEffect(() => {
    if (typeof window === 'undefined' || !activePhoto) return

    for (let i = 1; i <= 2; i++) {
      const nextIdx = currentIndex + i
      if (nextIdx < photos.length) {
        const nextSrc = photos[nextIdx].src
        const nextImg = new window.Image()
        nextImg.src = nextSrc
        nextImg.onload = () => loadedUrlsRef.current.add(nextSrc)
      }

      const prevIdx = currentIndex - i
      if (prevIdx >= 0) {
        const prevSrc = photos[prevIdx].src
        const prevImg = new window.Image()
        prevImg.src = prevSrc
        prevImg.onload = () => loadedUrlsRef.current.add(prevSrc)
      }
    }
  }, [activePhoto, currentIndex, photos])

  const handlePrev = () => {
    if (hasPrev) {
      const prevPhoto = photos[currentIndex - 1]
      if (loadedUrlsRef.current.has(prevPhoto.src)) {
        setIsImageLoading(false)
        setShowSpinner(false)
      } else {
        setIsImageLoading(true)
      }
      onNavigate(prevPhoto)
    }
  }

  const handleNext = () => {
    if (hasNext) {
      const nextPhoto = photos[currentIndex + 1]
      if (loadedUrlsRef.current.has(nextPhoto.src)) {
        setIsImageLoading(false)
        setShowSpinner(false)
      } else {
        setIsImageLoading(true)
      }
      onNavigate(nextPhoto)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activePhoto) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'i' || e.key === 'I') {
        setShowInfo((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activePhoto, currentIndex, hasPrev, hasNext])

  // Body scroll lock
  useEffect(() => {
    if (activePhoto && modalRef.current) {
      disableBodyScroll(modalRef.current)
    }
    return () => {
      clearAllBodyScrollLocks()
    }
  }, [activePhoto])

  if (!activePhoto) return null

  const exif = activePhoto.exif || {}

  return (
    <Transition appear show={Boolean(activePhoto)} as={Fragment}>
      <Dialog as="div" onClose={onClose} className="relative z-50">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl" />
        </TransitionChild>

        <div ref={modalRef} className="fixed inset-0 overflow-hidden">
          <div className="flex h-full w-full flex-col">
            {/* Top Toolbar */}
            <div className="relative z-20 flex items-center justify-between px-4 py-3 sm:px-6 bg-black/40 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-white/80 font-mono text-xs sm:text-sm">
                  {currentIndex + 1} / {photos.length}
                </span>
                <span className="hidden sm:inline-block h-3 w-px bg-white/20" />
                <h2 className="text-white font-medium text-sm sm:text-base truncate max-w-xs sm:max-w-md">
                  {activePhoto.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className={clsx(
                    'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                    isCopied
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                  title="Share / Copy Link to this Photo"
                  aria-label="Share or copy link"
                >
                  {isCopied ? (
                    <>
                      <Check size={16} className="text-emerald-400" />
                      <span className="text-xs font-mono">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={16} />
                      <span className="hidden sm:inline text-xs">Share</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className={clsx(
                    'p-2 rounded-lg text-white/80 hover:text-white transition-colors',
                    showInfo ? 'bg-white/20 text-white' : 'hover:bg-white/10'
                  )}
                  title="Toggle EXIF Details (I)"
                >
                  <Info size={18} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  title="Close (Esc)"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Main Stage */}
            <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
              {/* Prev Button */}
              {hasPrev && (
                <button
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-4 z-20 p-2 sm:p-3 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/80 backdrop-blur-md transition-all duration-200"
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* Next Button */}
              {hasNext && (
                <button
                  onClick={handleNext}
                  className="absolute right-2 sm:right-4 z-20 p-2 sm:p-3 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/80 backdrop-blur-md transition-all duration-200"
                  aria-label="Next photo"
                >
                  <ChevronRight size={24} />
                </button>
              )}

              {/* Photo Display with Blurry Progressive Loading Effect */}
              <div className="relative h-full w-full flex items-center justify-center">
                <Image
                  key={activePhoto.id}
                  src={activePhoto.src}
                  alt={activePhoto.description || activePhoto.title}
                  fill
                  priority
                  unoptimized
                  placeholder={activePhoto.blurDataURL ? 'blur' : 'empty'}
                  blurDataURL={activePhoto.blurDataURL}
                  className={clsx(
                    'object-contain select-none transition-all duration-300 ease-out',
                    isImageLoading
                      ? 'blur-xl scale-[1.02] opacity-80'
                      : 'blur-0 scale-100 opacity-100'
                  )}
                  onLoad={() => {
                    loadedUrlsRef.current.add(activePhoto.src)
                    setIsImageLoading(false)
                    setShowSpinner(false)
                  }}
                  sizes="100vw"
                />

                {/* Progressive blur badge indicator - only shows if loading takes longer than 150ms */}
                {isImageLoading && showSpinner && (
                  <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-xs font-mono shadow-lg border border-white/10 animate-pulse">
                      <div className="h-2.5 w-2.5 rounded-full border-2 border-white/30 border-t-emerald-400 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom EXIF & Caption Bar */}
            <Transition
              show={showInfo}
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-4"
            >
              <div className="relative z-20 bg-black/75 border-t border-white/10 px-4 py-3 sm:px-6 backdrop-blur-md">
                <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-white text-sm sm:text-base font-semibold tracking-wide">
                      {activePhoto.title}
                    </h3>
                    {activePhoto.description ? (
                      <p className="text-neutral-300 text-xs sm:text-sm mt-0.5 max-w-xl">
                        {activePhoto.description}
                      </p>
                    ) : (
                      <p className="text-neutral-300 text-xs mt-0.5">
                        {activePhoto.caption}
                      </p>
                    )}
                    {exif.dateTaken && (
                      <p className="text-neutral-400 text-[11px] sm:text-xs flex items-center gap-1.5 mt-1">
                        <Calendar size={12} />
                        <span>Taken on {exif.dateTaken}</span>
                      </p>
                    )}
                  </div>

                  {/* Badges for Camera / EXIF Specs */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] font-mono">
                    {exif.camera && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 text-neutral-200">
                        <Camera size={12} className="text-emerald-400" />
                        <span>{exif.camera}</span>
                      </span>
                    )}
                    {exif.lens && (
                      <span className="px-2 py-0.5 rounded bg-white/10 text-neutral-200">
                        {exif.lens}
                      </span>
                    )}
                    {exif.aperture && (
                      <span className="px-2 py-0.5 rounded bg-white/10 text-neutral-200">
                        {exif.aperture}
                      </span>
                    )}
                    {exif.shutterSpeed && (
                      <span className="px-2 py-0.5 rounded bg-white/10 text-neutral-200">
                        {exif.shutterSpeed}
                      </span>
                    )}
                    {exif.iso && (
                      <span className="px-2 py-0.5 rounded bg-white/10 text-neutral-200">
                        {exif.iso}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-white/5 text-neutral-400">
                      {activePhoto.width} × {activePhoto.height}
                    </span>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
