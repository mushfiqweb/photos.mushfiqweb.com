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
  const snippet = allSnippets.find((p) => p.slug === 'npm-commands')!
  return genPostMetadata(snippet)
}

export default function Page() {
  const snippet = allSnippets.find((p) => p.slug === 'npm-commands')!

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
        <p>Link a package to use it locally</p>

        <Pre>
          <code className="language-bash">{'cd ~/path/to/package\nnpm link'}</code>
        </Pre>

        <p>Unlink a package</p>

        <Pre>
          <code className="language-bash">{'cd ~/path/to/package\nnpm unlink'}</code>
        </Pre>

        <p>Remove from global npm list</p>

        <Pre>
          <code className="language-bash">{'npm rm --global <package-name>'}</code>
        </Pre>

        <p>Check if the package is removed</p>

        <Pre>
          <code className="language-bash">{'npm list --global'}</code>
        </Pre>

        <p>
          Clear the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'npx'}</code> cache
        </p>

        <Pre>
          <code className="language-bash">{'rm -rf ~/.npm/_npx'}</code>
        </Pre>

        <p>Execute a package without installing it globally</p>

        <Pre>
          <code className="language-bash">
            {
              "npx <package-name>\n# add @latest to make sure you're using the latest version\nnpx <package-name>@latest"
            }
          </code>
        </Pre>

        <p>
          Common{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'package.json'}</code>{' '}
          configs to develop a CLI in <strong>NodeJS</strong> w <strong>Typescript</strong> &amp;{' '}
          <strong>esbuild</strong>
        </p>

        <CodeTitle lang="json" title="package.json showLineNumbers" />
        <Pre>
          <code className="language-json">
            {
              '// ...\n"scripts": {\n  "dev": "tsc -w && npm run link",\n  "start": "node dist/index.js",\n  "build": "esbuild src/index.ts --bundle --platform=node --target=node18 --outfile=dist/index.js",\n  "up": "npm run build && npm publish --access public && npm run unlink",\n  "link": "npm unlink your-cli && npm i -g && chmod +x ./dist/index.js && npm link your-cli",\n  "unlink": "npm rm -g your-cli && npm unlink your-cli"\n},\n"bin": {\n  "your-cli": "./dist/index.js"\n}\n// more configs...'
            }
          </code>
        </Pre>

        <p>
          Happy linking! <Twemoji emoji="clinking-beer-mugs" />
        </p>
      </PostLayout>
    </>
  )
}
