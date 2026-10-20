import './globals.css'

import clsx from 'clsx'
import type { Metadata, Viewport } from 'next'
import { Footer } from '~/components/footer'
import { Header } from '~/components/header'
import { OfflineNotice } from '~/components/ui/offline-notice'
import { GritBackground } from '~/components/ui/grit-background'
import { MatrixBackground } from '~/components/ui/matrix-background'
import { MatrixProvider } from '~/components/ui/matrix-provider'
import { TiltedGridBackground } from '~/components/ui/tilted-grid-background'
import { SITE_METADATA } from '~/data/site-metadata'
import { ThemeProviders } from './theme-providers'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_METADATA.siteUrl),
  title: {
    default: SITE_METADATA.title,
    template: `%s | ${SITE_METADATA.title}`,
  },
  description: SITE_METADATA.description,
  keywords: [
    'Mushfiqur Rahman Shishir',
    'Mushfiqur Rahman',
    'Photography Showcase',
    'Nikon D3000',
    'Street Photography',
    'Portraits',
    'Concerts',
    'Bangladeshi Photographer',
    'photos.mushfiqweb.com',
  ],
  authors: [{ name: SITE_METADATA.author, url: SITE_METADATA.siteUrl }],
  creator: SITE_METADATA.author,
  publisher: SITE_METADATA.author,
  openGraph: {
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    url: './',
    siteName: SITE_METADATA.headerTitle,
    images: [
      {
        url: SITE_METADATA.socialBanner,
        width: 1200,
        height: 630,
        alt: SITE_METADATA.title,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    card: 'summary_large_image',
    images: [SITE_METADATA.socialBanner],
    creator: '@mushfiqweb',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_METADATA.siteUrl}/#person`,
      name: SITE_METADATA.author,
      alternateName: ['mushfiqweb', 'Mushfiqur Rahman'],
      url: SITE_METADATA.blogUrl,
      image: `${SITE_METADATA.siteUrl}${SITE_METADATA.siteLogo}`,
      sameAs: [
        SITE_METADATA.linkedin,
        SITE_METADATA.github,
        SITE_METADATA.x,
        SITE_METADATA.facebook,
        SITE_METADATA.instagram,
        SITE_METADATA.blogUrl,
      ],
      jobTitle: 'Chief Technology Officer (CTO)',
      worksFor: {
        '@type': 'Organization',
        name: 'AGT Software Partners',
      },
    },
    {
      '@type': 'ImageGallery',
      '@id': `${SITE_METADATA.siteUrl}/#gallery`,
      url: SITE_METADATA.siteUrl,
      name: SITE_METADATA.title,
      description: SITE_METADATA.description,
      publisher: {
        '@id': `${SITE_METADATA.siteUrl}/#person`,
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_METADATA.siteUrl}/#website`,
      url: SITE_METADATA.siteUrl,
      name: SITE_METADATA.headerTitle,
      description: SITE_METADATA.description,
      publisher: {
        '@id': `${SITE_METADATA.siteUrl}/#person`,
      },
    },
  ],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff' },
    { media: '(prefers-color-scheme: dark)', color: '#000' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="76x76" href="/static/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/static/favicons/site.webmanifest" />
      </head>
      <body
        className={clsx([
          'antialiased',
          'relative min-h-screen w-full max-w-full overflow-x-clip',
          'flex flex-col',
          'bg-white text-neutral-900',
          'dark:bg-dark dark:text-gray-100',
        ])}
      >
        <TiltedGridBackground className="inset-x-0 top-0 z-[-1] h-[70vh]" />
        <GritBackground />
        <ThemeProviders>
          <MatrixProvider>
            <Header />
            <main className="mb-auto grow pb-24 md:pb-28">{children}</main>
            <Footer />
            <OfflineNotice />
            <MatrixBackground />
          </MatrixProvider>
        </ThemeProviders>
      </body>
    </html>
  )
}
