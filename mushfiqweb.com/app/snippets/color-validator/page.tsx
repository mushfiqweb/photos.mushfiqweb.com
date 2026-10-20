import { PostLayout } from '~/layouts/post-layout'
import { Twemoji } from '~/components/ui/twemoji'
import { Image } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import { Pre } from '~/components/mdx/pre'
import { CodeTitle } from '~/components/mdx/code-title'
import { TableWrapper } from '~/components/mdx/table-wrapper'
import { Callout } from '~/components/mdx/callout'
import { CodeBlock } from '~/components/mdx/code-block'
import { allSnippets } from '~/data/snippet-registry'
import { allAuthors } from '~/data/author-registry'
import { genPostMetadata } from '~/utils/metadata'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const snippet = allSnippets.find((p) => p.slug === 'color-validator')!
  return genPostMetadata(snippet)
}

export default function Page() {
  const snippet = allSnippets.find((p) => p.slug === 'color-validator')!

  const authorList = snippet.authors || ['default']
  const authorDetails = authorList.map((authorSlug) => {
    return allAuthors.find((p) => p.slug === authorSlug)!
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CodeSnippet',
    headline: snippet.title,
    datePublished: snippet.date,
    dateModified: snippet.lastmod || snippet.date,
    description: snippet.summary,
    image: snippet.images ? snippet.images[0] : '/static/images/logo.jpg',
    url: `https://www.mushfiqweb.com/snippets/${snippet.slug}`,
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
      <PostLayout content={snippet} authorDetails={authorDetails}>
        <blockquote>
          <p>[!WARNING] This util is for client-side only, do not use it in Server environments.</p>
        </blockquote>

        <p>Simple color validator function</p>

        <CodeTitle lang="ts" title="utils.ts showLineNumbers" />
        <Pre>
          <code className="language-ts">
            {
              'export function isValidColor(color: string) {\n  let otpNode = new Option()\n  otpNode.style.color = color\n\n  return !!otpNode.style.color\n}'
            }
          </code>
        </Pre>

        <p>Usage</p>

        <CodeTitle lang="ts" title="index.ts showLineNumbers" />
        <Pre>
          <code className="language-ts">
            {
              "// Valid colors\nisValidColor('purple') // true\nisValidColor('burlywood') // true\nisValidColor('lightsalmon') // true\nisValidColor('rgb(255, 255, 255)') // true\nisValidColor('rgba(255, 255, 255, .5)') // true\nisValidColor('#ccc') // true\nisValidColor('hsl(100, 0%, 18%)') // true\n\n// Invalid colors\nisValidColor('not-a-color-name') // false\nisValidColor('dark gray') // false. Should be 'darkgray'\nisValidColor('rgb(255, 255, 255, 1, 1)') // false\nisValidColor('#ccczzz') // false"
            }
          </code>
        </Pre>

        <p>Caveat</p>

        <p>
          Strings like{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'unset'}</code>,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'initial'}</code>,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'inherit'}</code>,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'currentcolor'}</code>
          ,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'transparent'}</code>{' '}
          are also valid values, so if you want to exclude these strings, just change the function a
          bit:
        </p>

        <CodeTitle lang="ts" title="utils.ts showLineNumbers" />
        <Pre>
          <code className="language-ts">
            {
              "export function isValidColor(color: string) {\n  let otpNode = new Option()\n  otpNode.style.color = color\n\n  return !!otpNode.style.color && !/(unset|initial|inherit|currentcolor|transparent)/i.test(color)\n}\n\nisValidColor('rgb(-1, 255, 255)') // true\nisValidColor('none') // false\nisValidColor('initial') // false\nisValidColor('gray') // true"
            }
          </code>
        </Pre>
      </PostLayout>
    </>
  )
}
