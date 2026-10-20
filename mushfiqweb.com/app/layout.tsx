import 'css/tailwind.css'
import 'css/twemoji.css'
import 'react-medium-image-zoom/dist/styles.css'
import 'remark-github-blockquote-alert/alert.css'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import clsx from 'clsx'
import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Josefin_Sans, Playpen_Sans, Titillium_Web } from 'next/font/google'
import localFont from 'next/font/local'
import { UmamiAnalytics } from '~/components/analytics/umami'
import { Footer } from '~/components/footer'
import { Header } from '~/components/header'
import { KBarSearchProvider } from '~/components/search/kbar-provider'
import { TiltedGridBackground } from '~/components/ui/tilted-grid-background'
import { SITE_METADATA } from '~/data/site-metadata'
import { ThemeProviders } from './theme-providers'
import { MatrixProvider } from '~/components/ui/matrix-provider'
import { MatrixBackground } from '~/components/ui/matrix-background'

const FONT_HYPER = localFont({
  src: '../public/static/fonts/HYPE-Strong.otf',
  display: 'swap', // Optional: Adds a fallback while the font is loading
  variable: '--font-hyper', // Optional: Use as a CSS variable
})

const FONT_PLAYPEN_SANS = Playpen_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['800'],
  variable: '--font-playpen-sans',
})

const FONT_NUNITO = Titillium_Web({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '200', '600', '700', '400'],
  variable: '--font-nunito',
})

const FONT_JOSEFIN = Josefin_Sans({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '200', '600', '700', '400'],
  variable: '--font-josefin',
})

const FONT_JETBRAINS_MONO = JetBrains_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

export let metadata: Metadata = {
  metadataBase: new URL(SITE_METADATA.siteUrl),
  title: {
    default: SITE_METADATA.title,
    template: `%s | ${SITE_METADATA.title}`,
  },
  description: SITE_METADATA.description,
  keywords: [
    'Mushfiqur Rahman Shishir',
    'CTO at AGT Software Partners',
    'AGT Software Partners',
    'Co-Founder at KMS Marketplace',
    'KMS Marketplace',
    'Co-Founder at KMS Tech',
    'KMS Tech',
    'Full Stack Developer',
    '15 years experience',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'Software Architecture',
    'Engineering Leadership',
  ],
  authors: [{ name: 'Mushfiqur Rahman Shishir', url: SITE_METADATA.siteUrl }],
  creator: 'Mushfiqur Rahman Shishir',
  publisher: 'Mushfiqur Rahman Shishir',
  openGraph: {
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    url: './',
    siteName: SITE_METADATA.title,
    images: [SITE_METADATA.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${SITE_METADATA.siteUrl}/feed.xml`,
    },
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

const personAndWebsiteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_METADATA.siteUrl}/#person`,
      name: 'Mushfiqur Rahman Shishir',
      alternateName: ['mushfiqweb', 'Mushfiqur Rahman'],
      url: SITE_METADATA.siteUrl,
      image: `${SITE_METADATA.siteUrl}/static/images/logo.jpg`,
      description:
        'While playing the role of CTO at AGT Software Partners, I have been actively involved in full-stack development, bringing over 15 years of experience in delivering impactful solutions across diverse industries.',
      jobTitle: 'Chief Technology Officer (CTO)',
      worksFor: {
        '@type': 'Organization',
        name: 'AGT Software Partners',
        url: 'https://allgentech.io/',
      },
      hasOccupation: [
        {
          '@type': 'Role',
          roleName: 'Chief Technology Officer (CTO)',
          worksFor: {
            '@type': 'Organization',
            name: 'AGT Software Partners',
            url: 'https://allgentech.io/',
          },
        },
        {
          '@type': 'Role',
          roleName: 'Co-Founder',
          worksFor: {
            '@type': 'Organization',
            name: 'KMS Marketplace',
            url: 'https://kmstech.co',
          },
        },
        {
          '@type': 'Role',
          roleName: 'Co-Founder',
          worksFor: {
            '@type': 'Organization',
            name: 'KMS Tech',
            url: 'https://kmstech.co',
          },
        },
      ],
      sameAs: [
        'https://www.linkedin.com/in/mushfiqweb',
        'https://github.com/mushfiqweb',
        'https://twitter.com/mushfiqweb',
        'https://x.com/mushfiqweb',
        'https://allgentech.io/',
        'https://kmstech.co',
      ],
      knowsAbout: [
        'Full-Stack Development',
        'Software Architecture',
        'eCommerce Platforms',
        'TypeScript',
        'React',
        'Next.js',
        'Node.js',
        'Engineering Leadership',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_METADATA.siteUrl}/#website`,
      url: SITE_METADATA.siteUrl,
      name: "Mushfiqur's blog",
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
  let basePath = process.env.BASE_PATH || ''

  return (
    <html
      lang={SITE_METADATA.language}
      className={clsx(
        'scroll-smooth',
        FONT_NUNITO.variable,
        FONT_JETBRAINS_MONO.variable,
        FONT_PLAYPEN_SANS.variable,
        FONT_HYPER.variable,
        FONT_JOSEFIN.variable
      )}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personAndWebsiteJsonLd) }}
        />
        <link rel="author" href={`${SITE_METADATA.siteUrl}/llms.txt`} />
      </head>
      <link
        rel="icon"
        type="image/x-icon"
        href="https://mushfiqweb.com/static/favicons/favicon.ico"
      />

      <link rel="apple-touch-icon" sizes="76x76" href={`${basePath}/static/favicons/favicon.ico`} />

      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${basePath}/static/favicons/favicon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${basePath}/static/favicons/favicon.png`}
      />
      <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      <link
        rel="mask-icon"
        href={`${basePath}/static/favicons/safari-pinned-tab.svg`}
        color="#5bbad5"
      />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
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
        <ThemeProviders>
          <MatrixProvider>
            <UmamiAnalytics websiteId={SITE_METADATA.analytics.umamiAnalytics.websiteId} />
            <KBarSearchProvider configs={SITE_METADATA.search.kbarConfigs}>
              <Header />
              <main className="mb-auto grow pb-24 md:pb-28">{children}</main>
            </KBarSearchProvider>
            <Footer />
            <MatrixBackground />
          </MatrixProvider>
        </ThemeProviders>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
