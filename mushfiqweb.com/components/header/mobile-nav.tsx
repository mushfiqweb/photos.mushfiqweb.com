'use client'

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { clsx } from 'clsx'
import { Menu, X } from 'lucide-react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from '~/components/ui/link'
import { Twemoji } from '~/components/ui/twemoji'
import { HEADER_NAV_LINKS, MORE_NAV_LINKS } from '~/data/navigation'
import { SITE_METADATA } from '~/data/site-metadata'
import { Logo } from './logo'

export function MobileNav() {
  let [navShow, setNavShow] = useState(false)
  let navRef = useRef(null)

  let onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        enableBodyScroll(navRef.current)
      } else {
        // Prevent scrolling
        disableBodyScroll(navRef.current)
      }
      return !status
    })
  }

  useEffect(() => {
    return clearAllBodyScrollLocks
  })

  return (
    <>
      <div
        className={clsx([
          'rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700',
          'flex items-center justify-center sm:hidden',
        ])}
        data-umami-event="mobile-nav-toggle"
      >
        <button aria-label="Toggle Menu" onClick={onToggleNav}>
          <Menu size={22} />
        </button>
      </div>
      <Transition appear show={navShow} as={Fragment} unmount={false}>
        <Dialog as="div" onClose={onToggleNav} unmount={false}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            unmount={false}
          >
            <div className="fixed inset-0 z-60 bg-black/25" />
          </TransitionChild>
          <TransitionChild
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full opacity-0"
            enterTo="translate-x-0 opacity-95"
            leave="transition ease-in duration-200 transform"
            leaveFrom="translate-x-0 opacity-95"
            leaveTo="translate-x-full opacity-0"
            unmount={false}
          >
            <DialogPanel className="fixed left-0 top-0 z-70 h-full w-full flex flex-col bg-white opacity-95 duration-300 dark:bg-gray-950 dark:opacity-[0.98]">
              {/* Header bar with Logo, Title, and Close Button */}
              <div className="flex items-center justify-between gap-3 px-6 pt-6 sm:px-10 sm:pt-8 shrink-0">
                <div className="flex min-w-0 items-center gap-3">
                  <div onClick={onToggleNav} className="shrink-0">
                    <Logo />
                  </div>
                  <span className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100 line-clamp-2">
                    {SITE_METADATA.headerTitle}
                  </span>
                </div>
                <button
                  className="shrink-0 -mr-2 rounded-lg p-2.5 text-gray-900 hover:bg-gray-100 hover:text-primary-500 focus:outline-none dark:text-gray-100 dark:hover:bg-gray-850 dark:hover:text-primary-400 transition-colors"
                  aria-label="Toggle Menu"
                  onClick={onToggleNav}
                >
                  <X className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.5} />
                </button>
              </div>

              {/* Navigation links */}
              <nav
                ref={navRef}
                className="mt-6 flex h-full basis-0 flex-col items-start gap-4 overflow-y-auto px-6 sm:px-10 pt-2 pb-12"
              >
                {[...HEADER_NAV_LINKS, ...MORE_NAV_LINKS].map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="py-1 text-xl font-bold tracking-widest text-gray-900 outline outline-0 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
                    onClick={onToggleNav}
                  >
                    <Twemoji emoji={link.emoji} />
                    <span className="ml-2">{link.title}</span>
                  </Link>
                ))}
              </nav>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  )
}
