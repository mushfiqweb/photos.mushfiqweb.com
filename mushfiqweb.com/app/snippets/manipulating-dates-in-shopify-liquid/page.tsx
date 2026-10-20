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
  const snippet = allSnippets.find((p) => p.slug === 'manipulating-dates-in-shopify-liquid')!
  return genPostMetadata(snippet)
}

export default function Page() {
  const snippet = allSnippets.find((p) => p.slug === 'manipulating-dates-in-shopify-liquid')!

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
        <p>Adding/substracting days in Shopify's Liquid template language</p>

        <CodeTitle lang="liquid" title="snippet.liquid showLineNumbers" />
        <Pre>
          <code className="language-liquid">
            {
              '{% assign days = 4 %}\n\n{% assign ms = days | times: 24 | times: 60 | times: 60 %}\n{% assign now = \'now\' | date: "%s" %}\n\n{% assign today = now | date: "%b %d" %}\n{% assign before = now | minus: ms |date: "%b %d" %}\n{% assign after = now | plus: ms | date: "%b %d" %}\n\n<div>Today: {{ today }}</div>\n<div>{{days}} days before today: {{ before }}</div>\n<div>{{days}} days after today: {{ after }}</div>'
            }
          </code>
        </Pre>

        <p>Result:</p>

        <CodeTitle lang="html" title="index.html showLineNumbers" />
        <Pre>
          <code className="language-html">
            {
              '<div>Today: Aug 29</div>\n<div>4 days before today: Aug 25</div>\n<div>4 days after today: Sep 02</div>'
            }
          </code>
        </Pre>

        <h3 id="how-it-works">How it works</h3>

        <ul>
          <li>
            First convert{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'now'}</code> to
            seconds since 1970 with filter{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'| date: "%s"'}
            </code>
            .
          </li>
          <li>
            Convert{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'days'}</code> range
            to seconds{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'x 24 x 60 x 60'}
            </code>
          </li>
          <li>
            Use filters{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'| minus'}</code> or{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'| plus'}</code> to
            get the result and parse back to date format with{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'date: "%b %d"'}
            </code>{' '}
            filter
          </li>
        </ul>

        <p>
          The format for Liquid date is the same as{' '}
          <Link href="http://strftime.net/">strftime</Link>.
        </p>
      </PostLayout>
    </>
  )
}
