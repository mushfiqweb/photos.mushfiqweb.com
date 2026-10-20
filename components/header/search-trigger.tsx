'use client'

import { TextSearchIcon } from 'lucide-react'

export function HeaderSearchTrigger() {
  const handleClick = () => {
    const input = document.querySelector('input[type="text"]') as HTMLInputElement
    if (input) {
      input.focus()
      input.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <button
      aria-label="Search"
      onClick={handleClick}
      className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      title="Search (Click to focus search)"
    >
      <TextSearchIcon size={24} strokeWidth={1.5} />
    </button>
  )
}
