import { NextResponse } from 'next/server'
import { allBlogs } from '~/data/blog-registry'
import { allCoreContent } from '~/utils/contentlayer'
import { sortPosts } from '~/utils/misc'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    const limit = parseInt(searchParams.get('limit') || '5', 10)

    const sortedPosts = allCoreContent(sortPosts(allBlogs))
    const paginatedPosts = sortedPosts.slice(offset, offset + limit)
    const hasMore = sortedPosts.length > offset + limit

    return NextResponse.json({ posts: paginatedPosts, hasMore })
  } catch (e) {
    console.error('Error fetching paginated posts:', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
