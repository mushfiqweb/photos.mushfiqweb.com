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
  const snippet = allSnippets.find((p) => p.slug === 'pnpm-aliases')!
  return genPostMetadata(snippet)
}

export default function Page() {
  const snippet = allSnippets.find((p) => p.slug === 'pnpm-aliases')!

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
        <h2 id="install--upgrade-pnpm">
          Install &amp; upgrade{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'pnpm'}</code>
        </h2>

        <p>
          I recommend you to install{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'pnpm'}</code>{' '}
          globally using{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'npm'}</code> with:
        </p>

        <Pre>
          <code className="language-bash">{'npm i -g pnpm'}</code>
        </Pre>

        <p>To upgrade to the latest version, run:</p>

        <Pre>
          <code className="language-bash">{'npm i -g pnpm@latest'}</code>
        </Pre>

        <h2 id="add-an-alias-for-pnpm-in-your-shell">
          Add an alias for{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'pnpm'}</code> in your
          shell
        </h2>

        <p>
          Open your shell profile file (e.g.{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'.zprofile'}</code> or{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'.bash_profile'}
          </code>
          ):
        </p>

        <Pre>
          <code className="language-bash">{'$ code ~/.zprofile\n# or code ~/.bash_profile'}</code>
        </Pre>

        <p>
          Or if you prefer <strong>Vim</strong>:
        </p>

        <Pre>
          <code className="language-bash">{'$ vim ~/.zprofile\n# or vim ~/.bash_profile'}</code>
        </Pre>

        <p>Add the following line to your shell profile file:</p>

        <Pre>
          <code className="language-bash">{'alias pn=pnpm'}</code>
        </Pre>

        <p>And reload it with:</p>

        <Pre>
          <code className="language-bash">{'source ~/.zprofile\n# or source ~/.bash_profile'}</code>
        </Pre>

        <p>
          Now you can use{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'pn'}</code> instead
          of <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'pnpm'}</code> in
          your shell.
        </p>

        <Pre>
          <code className="language-bash">{'$ pn -v\n9.12.1'}</code>
        </Pre>

        <h2 id="bump-dependencies-in-your-project-to-the-latest-version">
          Bump dependencies in your project to the latest version
        </h2>

        <p>
          If you want to upgrade all the dependencies in your project to the latest version, you can
          use the following command:
        </p>

        <Pre>
          <code className="language-bash">{'pnpm up -i -L'}</code>
        </Pre>

        <p>
          Which will show you the list of packages that will be upgraded and ask you to confirm the
          upgrade.
        </p>

        <Pre>
          <code className="language-bash showLineNumbers">
            {
              '$ pn up -i -L\n? Choose which packages to update (Press <space> to select, <a> to toggle all, <i> to invert selection) …\n❯ ○ devDependencies\n    ○ Package                                                    Current   Target\n    ○ @commitlint/cli                                             19.4.1 ❯ 19.5.0\n    ○ @commitlint/config-conventional                             19.4.1 ❯ 19.5.0\n    ○ @types/node                                                 22.5.4 ❯ 22.7.5\n    ○ @types/react                                                18.3.5 ❯ 18.3.11\n    ○ @typescript-eslint/eslint-plugin                            6.21.0 ❯ 8.8.1\n    ○ @typescript-eslint/parser                                   6.21.0 ❯ 8.8.1\n    ○ eslint                                                      8.57.0 ❯ 9.12.0\n    ○ eslint-config-next                                          14.2.8 ❯ 14.2.15\n    ○ eslint-config-prettier                                      8.10.0 ❯ 9.1.0\n    ○ husky                                                        9.1.5 ❯ 9.1.6\n    ○ prettier-plugin-tailwindcss                                  0.6.6 ❯ 0.6.8\n    ○ typescript                                                   5.5.4 ❯ 5.6.3\n  ○ dependencies\n    ○ Package                                                    Current   Target\n    ○ @headlessui/react                                            2.1.5 ❯ 2.1.10\n    ○ @next/bundle-analyzer                                       14.2.8 ❯ 14.2.15\n    ○ contentlayer2                                                0.5.0 ❯ 0.5.1\n    ○ esbuild                                                     0.23.1 ❯ 0.24.0\n    ○ lucide-react                                               0.439.0 ❯ 0.451.0\n    ○ next                                                        14.2.8 ❯ 14.2.15\n    ○ next-contentlayer2                                           0.5.0 ❯ 0.5.1\n    ○ pliny                                                        0.3.1 ❯ 0.3.2\n    ○ postcss                                                     8.4.45 ❯ 8.4.47\n    ○ rehype-citation                                              2.1.1 ❯ 2.2.0\n    ○ rehype-preset-minify                                         7.0.0 ❯ 7.0.1\n    ○ tailwindcss                                                 3.4.10 ❯ 3.4.13\n\nEnter to start updating. Ctrl-c to cancel.'
            }
          </code>
        </Pre>

        <p>
          Happy aliasing! <Twemoji emoji="clinking-beer-mugs" />
        </p>
      </PostLayout>
    </>
  )
}
