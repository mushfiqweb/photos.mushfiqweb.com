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
  const snippet = allSnippets.find((p) => p.slug === 'casing-utils')!
  return genPostMetadata(snippet)
}

export default function Page() {
  const snippet = allSnippets.find((p) => p.slug === 'casing-utils')!

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
          I know that we suppose to have a library for this, but sometimes what we need is just a
          simple function to handle 1 or 2 cases <Twemoji emoji="man-shrugging" />
        </p>

        <p>So here we go, just copy and paste the code below to your app.</p>

        <h3 id="capitalize-all-words">Capitalize all words</h3>

        <Pre>
          <code className="language-ts">
            {
              '/**\n * Capitalize the first letter of all words in a string.\n *\n * @param str The string to capitalize.\n * @returns The capitalized string.\n * @example\n * capitalizeAll(\'foo bar\') // "Foo Bar"\n */\nfunction capitalizeAll(str: string): string {\n  return capitalize(str.replace(/\\s./g, ($1) => $1.toUpperCase()))\n}'
            }
          </code>
        </Pre>

        <h3 id="pascalcase-to-plain-text">
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'PascalCase'}</code>{' '}
          to plain text
        </h3>

        <Pre>
          <code className="language-ts">
            {
              '/**\n * Convert a pascal case string to plain text.\n *\n * @param str The string to convert.\n * @returns The plain text.\n * @example\n * pascalCaseToPlainText(\'FooBar\') // "foo bar"\n */\nfunction pascalCaseToPlainText(str: string): string {\n  return str.replace(/[A-Z]/g, ($1) => ` ${$1.toLowerCase()}`).trim()\n}'
            }
          </code>
        </Pre>

        <h3 id="camelcase-to-kebab-case">
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'camelCase'}</code> to{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'kebab-case'}</code>
        </h3>

        <Pre>
          <code className="language-ts">
            {
              '/**\n * Convert a camel case string to kebab case.\n * @param str The string to convert.\n * @returns The kebab case string.\n * @example\n * camelCaseToKebabCase(\'fooBar\') // "foo-bar"\n */\nfunction camelCaseToKebabCase(str: string): string {\n  return str.replace(/[A-Z]/g, ($1) => `-${$1.toLowerCase()}`).trim()\n}'
            }
          </code>
        </Pre>

        <h3 id="kebab-case-to-plain-text">
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'kebab-case'}</code>{' '}
          to plain text
        </h3>

        <Pre>
          <code className="language-ts">
            {
              "/**\n * Convert a kebab case string to plain text.\n *\n * @param str The string to convert.\n * @returns The plain text.\n * @example\n * kebabCaseToPlainText('foo-bar') // \"foo bar\"\n */\nfunction kebabCaseToPlainText(str: string): string {\n  return str.replace(/-/g, ' ')\n}"
            }
          </code>
        </Pre>

        <h3 id="plain-text-to-kebab-case">
          Plain text to{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'kebab-case'}</code>
        </h3>

        <Pre>
          <code className="language-ts">
            {
              "/**\n * Convert a plain text string to kebab case.\n *\n * @param str The string to convert.\n * @returns The kebab case string.\n * @example\n * toKebabCase('hello World') // \"hello-world\"\n */\nfunction toKebabCase(str: string): string {\n  return str.replace(/\\s/g, '-').toLowerCase()\n}"
            }
          </code>
        </Pre>

        <p>And many more in the future. Stay tuned!</p>
      </PostLayout>
    </>
  )
}
