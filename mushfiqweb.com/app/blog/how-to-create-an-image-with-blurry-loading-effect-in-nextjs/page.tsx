import { PostLayout } from '~/layouts/post-layout'
import { Twemoji } from '~/components/ui/twemoji'
import { Image } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import { Pre } from '~/components/mdx/pre'
import { CodeTitle } from '~/components/mdx/code-title'
import { TableWrapper } from '~/components/mdx/table-wrapper'
import { Callout } from '~/components/mdx/callout'
import { CodeBlock } from '~/components/mdx/code-block'
import { allBlogs } from '~/data/blog-registry'
import { allAuthors } from '~/data/author-registry'
import { genPostMetadata } from '~/utils/metadata'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const post = allBlogs.find(
    (p) => p.slug === 'how-to-create-an-image-with-blurry-loading-effect-in-nextjs'
  )!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find(
    (p) => p.slug === 'how-to-create-an-image-with-blurry-loading-effect-in-nextjs'
  )!

  const authorList = post.authors || ['default']
  const authorDetails = authorList.map((authorSlug) => {
    return allAuthors.find((p) => p.slug === authorSlug)!
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.lastmod || post.date,
    description: post.summary,
    image: post.images ? post.images[0] : '/static/images/logo.jpg',
    url: `https://www.mushfiqweb.com/blog/${post.slug}`,
    author: authorDetails.map((author) => ({
      '@type': 'Person',
      name: author.name,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostLayout content={post} authorDetails={authorDetails}>
        <p>
          <strong>NextJS</strong> has provided a{' '}
          <Link href="https://nextjs.org/docs/app/api-reference/components/image">
            built-in image component
          </Link>
          that has many useful features, we can leverage them with some custom styles to create a
          beautiful image with a blurry loading effect.
        </p>

        <blockquote>
          <p>
            [!NOTE] All the examples below are in React with TypeScript and style is written in
            Tailwind CSS
          </p>
        </blockquote>

        <h2 id="blurred-image">Blurred image</h2>

        <p>
          The simple idea here is to make the image blurry at first (with{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'blur-xl'}</code>{' '}
          class), and then fade it in by removing the blur effect (with{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'blur-0'}</code>) when
          the image is{' '}
          <Link href="https://nextjs.org/docs/app/api-reference/components/image#onload">
            loaded
          </Link>
          .
        </p>

        <CodeTitle lang="tsx" title="image.tsx showLineNumbers" />
        <Pre>
          <code className="language-tsx">
            {
              "'use client'\n\nimport { clsx } from 'clsx'\nimport type { ImageProps as NextImageProps } from 'next/image'\nimport NextImage from 'next/image'\nimport { useState } from 'react'\n\nexport interface ImageProps extends Omit<NextImageProps, 'src' | 'priority'> {\n  src: string\n}\n\nexport function Image(props: ImageProps) {\n  let { alt, src, loading = 'lazy', style, className, ...rest } = props\n  let [loaded, setLoaded] = useState(false)\n\n  return (\n    <div\n      className={clsx(\n        // Add a `image-container` class to the parent element\n        // to make it easier to adjust the styles in mdx file content\n        'image-container overflow-hidden',\n        !loaded && 'animate-pulse [animation-duration:4s]',\n        className\n      )}\n    >\n      <NextImage\n        className={clsx(\n          '[transition:filter_500ms_cubic-bezier(.4,0,.2,1)]',\n          'h-full max-h-full w-full object-center',\n          loaded ? 'blur-0' : 'blur-xl'\n        )}\n        src={src}\n        alt={alt}\n        style={{ objectFit: 'cover', ...style }}\n        loading={loading}\n        priority={loading === 'eager'}\n        quality={100}\n        onLoad={() => setLoaded(true)}\n        {...rest}\n      />\n    </div>\n  )\n}"
            }
          </code>
        </Pre>

        <p>
          I'm using Tailwind <Link href="https://tailwindcss.com/docs/blur">blur filters</Link>{' '}
          utility to create the blur effect. You can create your own variation by mixing the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'blur'}</code> utility
          with others like <Link href="https://tailwindcss.com/docs/grayscale">grayscale</Link>,{' '}
          <Link href="https://tailwindcss.com/docs/scale">scale</Link>, etc. (Remember to update the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'transition'}</code>{' '}
          property as well).
        </p>

        <h2 id="adjusting-the-size">Adjusting the size</h2>

        <p>
          The component is auto-sized following the child image, you can pass{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'className'}</code> to
          customize its size. For example:
        </p>

        <Pre>
          <code className="language-tsx showLineNumbers">
            {
              '<Image\n  src={logo}\n  alt={org}\n  className="h-12 w-12 shrink-0 rounded-md"\n  style={{ objectFit: \'contain\' }}\n  width={200}\n  height={200}\n/>'
            }
          </code>
        </Pre>

        <h2 id="mdx-support">MDX support</h2>

        <p>
          If you want to use the component to render images in MDX files, you will need to update
          tailwind typography config to make the images responsive.
        </p>

        <CodeTitle lang="js" title="tailwind.config.js showLineNumbers" />
        <Pre>
          <code className="language-js">
            {
              "module.exports = {\n  theme: {\n    extend: {\n      typography: ({ theme }) => ({\n        DEFAULT: {\n          css: {\n            '.image-container': {\n              width: 'fit-content',\n              marginLeft: 'auto',\n              marginRight: 'auto',\n              img: {\n                marginTop: 0,\n                marginBottom: 0,\n              },\n            },\n            // ... more typography styles\n          },\n        },\n      }),\n    },\n  },\n}"
            }
          </code>
        </Pre>

        <h2 id="avoid-blurring-on-every-render">Avoid blurring on every render</h2>

        <p>
          The blur effect is happening every time the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'Image'}</code>{' '}
          component is rendered (even if the image is already loaded). If you want to avoid this,
          you will need to control the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'loaded'}</code> state
          manually:
        </p>

        <CodeTitle lang="tsx" title="image.tsx {9-25,33} showLineNumbers" />
        <Pre>
          <code className="language-tsx">
            {
              "'use client'\n\nimport { clsx } from 'clsx'\nimport type { ImageProps as NextImageProps } from 'next/image'\nimport NextImage from 'next/image'\nimport { usePathname } from 'next/navigation'\nimport { useState } from 'react'\n\nlet loadedImages: string[] = []\n\n// Detecting if the image is already loaded to avoid the blur effect\n// happens every time the component is rendered based on the route pathname\nfunction useImageLoadedState(src: string) {\n  let pathname = usePathname()\n  let uniqueImagePath = pathname + '__' + src\n  let [loaded, setLoaded] = useState(() => loadedImages.includes(uniqueImagePath))\n  return [\n    loaded,\n    () => {\n      if (loaded) return\n      loadedImages.push(uniqueImagePath)\n      setLoaded(true)\n    },\n  ] as const\n}\n\nexport interface ImageProps extends Omit<NextImageProps, 'src' | 'priority'> {\n  src: string\n}\n\nexport function Image(props: ImageProps) {\n  let { alt, src, loading = 'lazy', style, className, ...rest } = props\n  let [loaded, onLoad] = useImageLoadedState(src)\n\n  return (\n    <div\n      className={clsx(\n        'image-container overflow-hidden',\n        !loaded && 'animate-pulse [animation-duration:4s]',\n        className\n      )}\n    >\n      <NextImage\n        className={clsx(\n          '[transition:filter_500ms_cubic-bezier(.4,0,.2,1)]',\n          'h-full max-h-full w-full object-center',\n          loaded ? 'blur-0' : 'blur-xl'\n        )}\n        src={src}\n        alt={alt}\n        style={{ objectFit: 'cover', ...style }}\n        loading={loading}\n        priority={loading === 'eager'}\n        quality={100}\n        onLoad={onLoad}\n        {...rest}\n      />\n    </div>\n  )\n}"
            }
          </code>
        </Pre>

        <p>Now the image will be blurred when it is loaded for the first time on each page.</p>

        <blockquote>
          <p>
            [!TIP] If you want to prioritize a image that is above the fold, you can set the{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'loading'}</code>{' '}
            prop to{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'eager'}</code>.
          </p>
        </blockquote>

        <p>
          My blog is using this component to render images, you can navigate around the site and see
          the beautiful loading effect in action.
        </p>

        <p>
          Happy blurring! <Twemoji emoji="clinking-beer-mugs" />
        </p>
      </PostLayout>
    </>
  )
}
