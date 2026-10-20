import type { Metadata } from 'next'
import { SITE_METADATA } from '~/data/site-metadata'

interface PageSEOProps {
  title: string
  description?: string
  image?: string
  [key: string]: any
}

export function genPageMetadata({ title, description, image, ...rest }: PageSEOProps): Metadata {
  const ogImage = image || SITE_METADATA.socialBanner
  return {
    title,
    description: description || SITE_METADATA.description,
    openGraph: {
      title: `${title} | ${SITE_METADATA.title}`,
      description: description || SITE_METADATA.description,
      url: './',
      siteName: SITE_METADATA.title,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      title: `${title} | ${SITE_METADATA.title}`,
      description: description || SITE_METADATA.description,
      card: 'summary_large_image',
      images: [ogImage],
      creator: '@mushfiqweb',
    },
    ...rest,
  }
}
