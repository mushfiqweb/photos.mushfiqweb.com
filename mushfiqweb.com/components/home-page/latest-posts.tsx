'use client'

import { useState } from 'react'
import type { Blog, Snippet } from '~/types/blog'
import { PostCardListView } from '~/components/blog/post-card-list-view'
import { SnippetCard } from '~/components/cards/snippet'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Link } from '~/components/ui/link'
import type { CoreContent } from '~/types/data'

export function LatestPosts({
  posts: initialPosts,
  snippets,
}: {
  posts: CoreContent<Blog>[]
  snippets: CoreContent<Snippet>[]
}) {
  let [view, setView] = useState<'posts' | 'snippets'>('posts')
  const [posts, setPosts] = useState<CoreContent<Blog>[]>(initialPosts)
  const [offset, setOffset] = useState(initialPosts.length)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/posts?offset=${offset}&limit=5`)
      const data = await res.json()
      if (data.posts && data.posts.length > 0) {
        setPosts((prev) => [...prev, ...data.posts])
        setOffset((prev) => prev + data.posts.length)
        setHasMore(data.hasMore)
      } else {
        setHasMore(false)
      }
    } catch (e) {
      console.error('Failed to load more posts', e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 divide-y divide-gray-200 dark:divide-gray-700 md:mt-8 md:space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex text-2xl font-bold sm:text-2xl sm:leading-10 md:text-4xl">
          <span className="mr-2 md:mr-3">Latest Posts</span>
        </div>
        <div className="flex items-center justify-end text-base font-medium leading-6">
          <Link href={view === 'posts' ? '/blog' : '/snippets'} className="" aria-label="All posts">
            <GrowingUnderline data-umami-event="all-posts">
              <span className="hidden md:inline-block">View all {view}</span>
              <span className="md:hidden">More</span> &rarr;
            </GrowingUnderline>
          </Link>
        </div>
      </div>
      {view === 'posts' ? (
        <>
          <ul className="space-y-12 divide-gray-200 pt-6 dark:divide-gray-700 md:space-y-20 md:pt-10">
            {!posts.length && 'No posts found.'}
            {posts.map((post, idx) => (
              <li key={post.slug}>
                <PostCardListView post={post} loading={idx === 0 ? 'eager' : 'lazy'} />
              </li>
            ))}
          </ul>
          {hasMore && (
            <div className="flex justify-center pt-8 md:pt-12">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-neutral-800"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Loading...
                  </>
                ) : (
                  'Load More Posts'
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="py-10">
          <div className="grid-cols-2 gap-x-6 gap-y-10 space-y-10 md:grid md:space-y-0">
            {!snippets.length && 'No snippets found.'}
            {snippets.map((snippet) => (
              <SnippetCard snippet={snippet} key={snippet.path} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
