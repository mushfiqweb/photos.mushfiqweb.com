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
  const snippet = allSnippets.find((p) => p.slug === 'rename-a-case-sensitive-file-in-a-git-repo')!
  return genPostMetadata(snippet)
}

export default function Page() {
  const snippet = allSnippets.find((p) => p.slug === 'rename-a-case-sensitive-file-in-a-git-repo')!

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
          Simple file/directory renaming in git is not a problem. But what if you want to rename a
          case sensitive file/directory in your git repo? For example, you have a file named{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'README.md'}</code>{' '}
          and you want to rename it to{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'Readme.md'}</code>.
        </p>

        <p>
          Keep in mind that renaming by <strong>IDE</strong> or <strong>file manager</strong> will
          not work because git will not recognize the change. <Twemoji emoji="face-with-monocle" />
        </p>

        <p>You can do it with the following command:</p>

        <Pre>
          <code className="language-bash">{'git mv README.md Readme.md'}</code>
        </Pre>

        <p>Then follow with the usual git workflow:</p>

        <Pre>
          <code className="language-bash">
            {'git add .\ngit commit -m "Rename README.md to Readme.md"'}
          </code>
        </Pre>

        <p>
          That's it! You have successfully renamed a case sensitive file/directory in a git repo.
        </p>

        <p>
          Happy commiting! <Twemoji emoji="clinking-beer-mugs" />
        </p>
      </PostLayout>
    </>
  )
}
