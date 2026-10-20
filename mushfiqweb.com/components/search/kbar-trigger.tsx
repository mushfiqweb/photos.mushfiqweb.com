import { useKBar } from 'kbar'
import { TextSearchIcon } from 'lucide-react'

export function KbarSearchTrigger() {
  let { query } = useKBar()

  return (
    <button
      aria-label="Search"
      className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700"
      data-umami-event="search-the-site"
      onClick={() => query.toggle()}
    >
      <TextSearchIcon size={24} strokeWidth={1.5} />
    </button>
  )
}
