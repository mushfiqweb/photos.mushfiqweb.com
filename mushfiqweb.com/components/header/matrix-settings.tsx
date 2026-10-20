'use client'

import { Transition } from '@headlessui/react'
import clsx from 'clsx'
import { Binary } from 'lucide-react'
import { Fragment, useEffect, useRef, useState } from 'react'
import type { CharSetType, ColorMode } from '~/components/ui/matrix-provider'
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

  // Close when clicking anywhere outside of the settings container
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
        data-umami-event="nav-matrix-settings"
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
        <div className="absolute right-[-100px] top-full z-50 mt-2 w-64 origin-top-right rounded-xl border border-gray-200/50 bg-white/45 p-4 shadow-xl backdrop-blur-md dark:border-neutral-800/50 dark:bg-dark/45 sm:right-0">
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

            {isEnabled && (
              <div className="space-y-3.5 text-xs text-gray-600 dark:text-gray-300">
                {/* Opacity Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span>Opacity</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {Math.round(opacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.60"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-emerald-500 dark:bg-neutral-700 dark:accent-emerald-400"
                  />
                </div>

                {/* Color Selector */}
                <div className="space-y-1.5">
                  <span className="font-medium">Color Scheme</span>
                  <div className="flex gap-2">
                    {[
                      {
                        mode: 'green',
                        class: 'bg-emerald-500 border-emerald-600',
                        label: 'Green',
                      },
                      {
                        mode: 'indigo',
                        class: 'bg-indigo-500 border-indigo-600',
                        label: 'Indigo',
                      },
                      { mode: 'blue', class: 'bg-blue-500 border-blue-600', label: 'Blue' },
                      { mode: 'red', class: 'bg-red-500 border-red-600', label: 'Red' },
                      {
                        mode: 'rainbow',
                        class:
                          'bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 border-gray-300',
                        label: 'Rainbow',
                      },
                    ].map((item) => (
                      <button
                        key={item.mode}
                        onClick={() => {
                          setColorMode(item.mode as ColorMode)
                          setIsOpen(false)
                        }}
                        title={item.label}
                        className={clsx(
                          'h-6 w-6 rounded-full border-2 transition-all hover:scale-110 focus:outline-none',
                          colorMode === item.mode
                            ? 'scale-110 border-gray-900 ring-2 ring-emerald-300 dark:border-white dark:ring-emerald-800'
                            : 'border-transparent opacity-80 hover:opacity-100',
                          item.class
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Speed Selector */}
                <div className="space-y-1.5">
                  <span className="font-medium">Speed</span>
                  <div className="grid grid-cols-3 gap-1 rounded bg-gray-100 p-0.5 dark:bg-neutral-800">
                    {(['slow', 'normal', 'fast'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSpeed(s)
                          setIsOpen(false)
                        }}
                        className={clsx(
                          'rounded py-1 text-[10px] font-medium capitalize transition-all',
                          speed === s
                            ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-700 dark:text-gray-100'
                            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Character Set Selector */}
                <div className="space-y-1.5">
                  <span className="font-medium">Character Set</span>
                  <div className="grid grid-cols-3 gap-1 rounded bg-gray-100 p-0.5 dark:bg-neutral-800">
                    {[
                      { value: 'kms', label: 'KMS' },
                      { value: 'binary', label: '01' },
                      { value: 'kana', label: 'Kana' },
                    ].map((c) => (
                      <button
                        key={c.value}
                        onClick={() => {
                          setCharSet(c.value as CharSetType)
                          setIsOpen(false)
                        }}
                        className={clsx(
                          'rounded py-1 text-[10px] font-medium transition-all',
                          charSet === c.value
                            ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-700 dark:text-gray-100'
                            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                        )}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Transition>
    </div>
  )
}
