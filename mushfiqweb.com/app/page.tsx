import { allBlogs } from '~/data/blog-registry'
import { allSnippets } from '~/data/snippet-registry'
import { Home } from '~/components/home-page'
import { allCoreContent } from '~/utils/contentlayer'
import { sortPosts } from '~/utils/misc'

import { redirect } from 'next/navigation'

const MAX_POSTS_DISPLAY = 5
const MAX_SNIPPETS_DISPLAY = 6

export default async function HomePage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const code = searchParams?.code
  if (typeof code === 'string') {
    redirect(`/callback?code=${encodeURIComponent(code)}`)
  }

  return (
    <Home
      posts={allCoreContent(sortPosts(allBlogs)).slice(0, MAX_POSTS_DISPLAY)}
      snippets={allCoreContent(sortPosts(allSnippets)).slice(0, MAX_SNIPPETS_DISPLAY)}
    />
  )
}
