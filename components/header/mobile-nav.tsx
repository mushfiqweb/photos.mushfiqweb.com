'use client'

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { clsx } from 'clsx'
import { Menu, X } from 'lucide-react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from '~/components/ui/link'
import { HEADER_NAV_LINKS, MORE_NAV_LINKS } from '~/data/navigation'
import { SITE_METADATA } from '~/data/site-metadata'
import { Logo } from './logo'

export function MobileNav() {
  let [navShow, setNavShow] = useState(false)
  let navRef = useRef(null)

  let onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        if (navRef.current) enableBodyScroll(navRef.current)
      } else {
        if (navRef.current) disableBodyScroll(navRef.current)
      }
      return !status
    })
  }

  useEffect(() => {
    return () => {
      clearAllBodyScrollLocks()
    }
  }, [])

  return (
    <>
      <div className="flex items-center justify-center rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 sm:hidden">
        <button aria-label="Toggle Menu" onClick={onToggleNav}>
          <Menu size={22} />
        </button>
      </div>
      <Transition appear show={navShow} as={Fragment}>
        <Dialog as="div" onClose={onToggleNav} className="relative z-50">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </TransitionChild>
          <TransitionChild
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full opacity-0"
            enterTo="translate-x-0 opacity-100"
            leave="transition ease-in duration-200 transform"
            leaveFrom="translate-x-0 opacity-100"
            leaveTo="translate-x-full opacity-0"
          >
            <DialogPanel className="fixed inset-y-0 right-0 z-50 h-full w-full max-w-xs flex flex-col bg-white/95 dark:bg-dark/95 backdrop-blur-md p-6 shadow-2xl border-l border-gray-200/50 dark:border-neutral-800/50">
              <div className="flex items-center justify-between pb-6 border-b border-gray-200/30 dark:border-neutral-800/40">
                <div className="flex items-center gap-3">
                  <Logo />
                  <span className="font-bold text-sm tracking-wider uppercase text-neutral-900 dark:text-neutral-100">
                    {SITE_METADATA.headerTitle}
                  </span>
                </div>
                <button
                  aria-label="Close Menu"
                  onClick={onToggleNav}
                  className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800"
                >
                  <X size={22} />
                </button>
              </div>

              <nav ref={navRef} className="mt-8 flex flex-col gap-6">
                {[...HEADER_NAV_LINKS, ...MORE_NAV_LINKS].map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    onClick={onToggleNav}
                    className="text-lg font-semibold tracking-wide text-gray-800 hover:text-emerald-500 dark:text-gray-200 dark:hover:text-emerald-400 transition-colors"
                  >
                    {link.title}
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
