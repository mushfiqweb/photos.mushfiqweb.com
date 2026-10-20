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
  const snippet = allSnippets.find((p) => p.slug === 'gitignore-ignore-directory-keep-1-file')!
  return genPostMetadata(snippet)
}

export default function Page() {
  const snippet = allSnippets.find((p) => p.slug === 'gitignore-ignore-directory-keep-1-file')!

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
        <p>Keep 1 file and ignore others in a directory</p>

        <p>
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'.gitignore'}</code>
        </p>

        <CodeTitle lang="bash" title=".gitignore {5} showLineNumbers" />
        <Pre>
          <code className="language-bash">
            {
              '# Ignore all file in a directory\ndirectory/*\n\n# Keep only this file\n!directory/file-to-keep.ext'
            }
          </code>
        </Pre>
      </PostLayout>
    </>
  )
}
