'use client'

import { Transition } from '@headlessui/react'
import clsx from 'clsx'
import { Binary } from 'lucide-react'
import { Fragment, useEffect, useRef, useState } from 'react'
import type { CharSetType, ColorMode, MatrixSpeed } from '~/components/ui/matrix-provider'
import { useMatrix } from '~/components/ui/matrix-provider'

export function MatrixSettings() {
  const {
    isEnabled,
    setIsEnabled,
    opacity,
    setOpacity,
    colorMode,
    setColorMode,
    speed,
    setSpeed,
    charSet,
    setCharSet,
  } = useMatrix()

  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative flex items-center" ref={containerRef}>
      <button
        aria-label="Matrix background settings"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'group flex items-center justify-center rounded p-1.5 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:hover:bg-gray-700',
          isOpen && 'bg-gray-200 dark:bg-gray-700'
        )}
      >
        <Binary
          strokeWidth={1.5}
          size={22}
          className={clsx(
            'transition-all duration-300 ease-in-out',
            'group-hover:rotate-12 group-hover:scale-125',
            isEnabled
              ? 'text-emerald-500 dark:text-emerald-400'
              : 'text-gray-600 group-hover:text-emerald-500 dark:text-gray-400 dark:group-hover:text-emerald-400'
          )}
        />
      </button>

      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <div className="absolute right-[-100px] top-full z-50 mt-2 w-72 origin-top-right rounded-xl border border-gray-200/50 bg-white/90 p-4 shadow-xl backdrop-blur-md dark:border-neutral-800/50 dark:bg-dark/95 sm:right-0">
          <div className="space-y-4">
            {/* Title & Enable Switch */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2 dark:border-neutral-800">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Matrix Background
              </span>
              <button
                onClick={() => setIsEnabled(!isEnabled)}
                className={clsx(
                  'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  isEnabled ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-neutral-700'
                )}
              >
                <span
                  className={clsx(
                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    isEnabled ? 'translate-x-4' : 'translate-x-0'
                  )}
                />
              </button>
            </div>

            {/* Opacity slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>Opacity</span>
                <span>{Math.round(opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.4"
                step="0.01"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-emerald-500 dark:bg-neutral-700"
              />
            </div>

            {/* Color mode */}
            <div className="space-y-1.5">
              <span className="text-xs text-gray-600 dark:text-gray-400">Color</span>
              <div className="grid grid-cols-5 gap-1.5">
                {(['green', 'rainbow', 'indigo', 'blue', 'red'] as ColorMode[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setColorMode(c)}
                    className={clsx(
                      'rounded-md py-1 text-xs capitalize transition-colors',
                      colorMode === c
                        ? 'bg-emerald-500 text-white font-medium'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-gray-300'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Speed */}
            <div className="space-y-1.5">
              <span className="text-xs text-gray-600 dark:text-gray-400">Speed</span>
              <div className="grid grid-cols-3 gap-1.5">
                {(['slow', 'normal', 'fast'] as MatrixSpeed[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={clsx(
                      'rounded-md py-1 text-xs capitalize transition-colors',
                      speed === s
                        ? 'bg-emerald-500 text-white font-medium'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-gray-300'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Character set */}
            <div className="space-y-1.5">
              <span className="text-xs text-gray-600 dark:text-gray-400">Charset</span>
              <div className="grid grid-cols-3 gap-1.5">
                {(['kms', 'binary', 'kana'] as CharSetType[]).map((cs) => (
                  <button
                    key={cs}
                    onClick={() => setCharSet(cs)}
                    className={clsx(
                      'rounded-md py-1 text-xs capitalize transition-colors',
                      charSet === cs
                        ? 'bg-emerald-500 text-white font-medium'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-gray-300'
                    )}
                  >
                    {cs === 'kms' ? 'KMS Tech' : cs}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  )
}
