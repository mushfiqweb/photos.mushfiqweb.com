import type { Blog } from '~/types/blog'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Link } from '~/components/ui/link'
import type { CoreContent } from '~/types/data'
import { formatDate } from '~/utils/misc'
import { ViewsCounter } from './views-counter'

export function PostCardGridView({ post }: { post: CoreContent<Blog> }) {
  let { path, date, title, summary, slug, readingTime } = post
  return (
    <article>
      <div className="flex flex-col items-start justify-between gap-4 md:gap-6">
        <div className="w-full space-y-3">
          <div className="flex items-center gap-x-1.5 text-sm text-gray-600 dark:text-gray-400">
            <time dateTime={date}>{formatDate(date)}</time>
            <span className="mx-1 text-gray-400">/</span>
            <span>{Math.ceil(readingTime.minutes)} mins read</span>
            <span className="mx-1 text-gray-400">/</span>
            <ViewsCounter type={'blog'} slug={slug} />
          </div>
          <div className="group relative">
            <h2 className="text-xl font-semibold leading-6">
              <Link href={`/${path}`}>
                <GrowingUnderline>{title}</GrowingUnderline>
              </Link>
            </h2>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-500 md:mt-3">
              {summary}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
