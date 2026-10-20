import type { Metadata } from 'next'
import { SITE_METADATA } from '~/data/site-metadata'
import type { BlogPost, Snippet } from '~/types/blog'

export function genPostMetadata(post: BlogPost | Snippet): Metadata {
  let publishedAt = new Date(post.date).toISOString()
  let modifiedAt = new Date(post.lastmod || post.date).toISOString()
  let imageList = [SITE_METADATA.socialBanner]
  if (post.images) {
    imageList = Array.isArray(post.images) ? post.images : [post.images as string]
  }
  let ogImages = imageList.map((img) => {
    return {
      url: img.includes('http') ? img : SITE_METADATA.siteUrl + img,
    }
  })

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: SITE_METADATA.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      authors: [SITE_METADATA.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  }
}
