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
  const snippet = allSnippets.find((p) => p.slug === 'read-all-file-names-inside-a-folder')!
  return genPostMetadata(snippet)
}

export default function Page() {
  const snippet = allSnippets.find((p) => p.slug === 'read-all-file-names-inside-a-folder')!

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
          Required:{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'node.js'}</code>{' '}
          installation.
        </p>

        <p>Quickly get all files' names inside a folder</p>

        <Pre>
          <code className="language-bash">{"console.log(fs.readdirSync('./folder-path'))"}</code>
        </Pre>

        <p>Example:</p>

        <Pre>
          <code className="language-bash showLineNumbers">
            {
              "# Make sure node.js installed\nnode -v\nv22.9.0\n\n# Now it's good to go\nnode\n> console.log(fs.readdirSync('./folder'))\n[\n  '.DS_Store',\n  'authors',\n  'blog',\n  'headerNavLinks.js',\n  'logo.svg',\n  'projectsData.js',\n  'SITE_METADATA.js',\n  'snippets'\n]"
            }
          </code>
        </Pre>
      </PostLayout>
    </>
  )
}
