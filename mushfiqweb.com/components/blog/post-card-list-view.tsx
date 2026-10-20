import type { Blog } from '~/types/blog'
import { TagsList } from '~/components/blog/tags'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Link } from '~/components/ui/link'
import type { CoreContent } from '~/types/data'
import { formatDate } from '~/utils/misc'
import { ViewsCounter } from './views-counter'

export function PostCardListView({
  post,
  loading,
}: {
  post: CoreContent<Blog>
  loading?: 'lazy' | 'eager'
}) {
  let { slug, date, title, summary, tags, images, readingTime } = post
  return (
    <article>
      <div className="flex flex-col gap-2 space-y-3 md:flex-row md:gap-8">
        <div className="space-y-4 md:space-y-5">
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-3">
              <dl className="text-sm">
                <dt className="sr-only">Published on</dt>
                <dd className="font-medium leading-6 text-gray-500 dark:text-gray-400">
                  <time dateTime={date}>{formatDate(date)}</time>
                  <span className="mx-2 text-gray-400">/</span>
                  <span>{Math.ceil(readingTime.minutes)} mins read</span>
                  <span className="mx-2 text-gray-400">/</span>
                  <ViewsCounter type={'blog'} slug={slug} />
                </dd>
              </dl>
              <h2 className="pb-1 text-xl font-bold tracking-tight md:text-2xl">
                <Link href={`/blog/${slug}`} className="text-gray-900 dark:text-gray-100">
                  <GrowingUnderline data-umami-event="latest-post-title" duration={500}>
                    {title}
                  </GrowingUnderline>
                </Link>
              </h2>
              <TagsList tags={tags} />
            </div>
            <div className="line-clamp-2 text-gray-500 dark:text-gray-400 md:line-clamp-3">
              {summary}
            </div>
          </div>
          <div className="text-base font-medium leading-6">
            <Link
              href={`/blog/${slug}`}
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300"
              aria-label={`Read "${title}"`}
            >
              <GrowingUnderline data-umami-event="latest-post-read-more">
                Read article →
              </GrowingUnderline>
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
