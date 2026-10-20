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
  const snippet = allSnippets.find((p) => p.slug === 'remove-falsy-values-from-an-object')!
  return genPostMetadata(snippet)
}

export default function Page() {
  const snippet = allSnippets.find((p) => p.slug === 'remove-falsy-values-from-an-object')!

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
        <p>
          This function will remove all falsy values like{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'null'}</code>,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'undefined'}</code>,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'0'}</code>,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{"''"}</code>,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'false'}</code> from
          an object and its nested children.
        </p>

        <p>
          Allow passing custom{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'falsyValues'}</code>{' '}
          to remove and return a new object without the falsy values.
        </p>

        <CodeTitle lang="js" title="remove-falsy.js showLineNumbers" />
        <Pre>
          <code className="language-js">
            {
              "function removeFalsy(obj, falsyValues = ['', null, undefined]) {\n  if (!obj || typeof obj !== 'object') {\n    return obj\n  }\n  return Object.entries(obj).reduce((a, c) => {\n    let [k, v] = c\n    if (falsyValues.indexOf(v) === -1 && JSON.stringify(removeFalsy(v, falsyValues)) !== '{}') {\n      a[k] = typeof v === 'object' && !Array.isArray(v) ? removeFalsy(v, falsyValues) : v\n    }\n    return a\n  }, {})\n}"
            }
          </code>
        </Pre>

        <h5 id="example-usage">Example usage</h5>

        <CodeTitle lang="js" title="index.js showLineNumbers" />
        <Pre>
          <code className="language-js">
            {
              "let obj = {\n  a: 1,\n  b: 0,\n  c: '',\n  d: null,\n  e: undefined,\n  f: false,\n  g: {\n    a: 1,\n    b: 0,\n    c: '',\n    d: null,\n    e: undefined,\n    f: false,\n  },\n  j: {},\n  h: [],\n  i: [1],\n}\nconsole.log(removeFalsy(obj, [0, false, '', null, undefined]))\n// 👉 { a: 1, g: { a: 1 }, i: [ 1 ] }"
            }
          </code>
        </Pre>

        <p>
          Happy coding <Twemoji emoji="clinking-beer-mugs" />
        </p>
      </PostLayout>
    </>
  )
}
