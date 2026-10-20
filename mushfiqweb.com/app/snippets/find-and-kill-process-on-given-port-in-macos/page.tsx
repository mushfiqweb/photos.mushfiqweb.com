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
  const snippet = allSnippets.find(
    (p) => p.slug === 'find-and-kill-process-on-given-port-in-macos'
  )!
  return genPostMetadata(snippet)
}

export default function Page() {
  const snippet = allSnippets.find(
    (p) => p.slug === 'find-and-kill-process-on-given-port-in-macos'
  )!

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
        <h4 id="-macos-only">
          <Twemoji emoji="warning" /> MacOS only
        </h4>

        <p>List all the processes by ports with their PIDs</p>

        <Pre>
          <code className="language-bash">{'sudo lsof -i -P | grep LISTEN'}</code>
        </Pre>

        <p>The result should look like this:</p>

        <Pre>
          <code className="language-bash showLineNumbers">
            {
              'rapportd    123            leo    5u  IPv4 0x84512a8572c9xxxx      0t0    TCP *:62003 (LISTEN)\nrapportd    123            leo    6u  IPv6 0x84512a857627xxxx      0t0    TCP *:62003 (LISTEN)\nmongod      414            leo    9u  IPv4 0x84512a857926xxxx      0t0    TCP localhost:27017 (LISTEN)\nLoom       3315            leo   28u  IPv4 0x84512a85785cxxxx      0t0    TCP localhost:11223 (LISTEN)\nnode      38238            leo   22u  IPv6 0x84512a857627xxxx      0t0    TCP *:5000 (LISTEN)\nnode      68336            leo   22u  IPv6 0x84512a858bb4xxxx      0t0    TCP *:443 (LISTEN)'
            }
          </code>
        </Pre>

        <p>The 2nd column is the PID of the process on the port in the last column</p>

        <p>
          Now kill the process in that port by using{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'sudo kill -9 <PID>'}
          </code>
        </p>

        <Pre>
          <code className="language-bash">{'sudo kill -9 68336'}</code>
        </Pre>

        <p>
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'68336'}</code> is the
          PID of the process running on port{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'443'}</code>
        </p>

        <p>Check again</p>

        <Pre>
          <code className="language-bash showLineNumbers">
            {
              '$ sudo lsof -i -P | grep LISTEN\n\nrapportd    123            leo    5u  IPv4 0x84512a8572c9xxxx      0t0    TCP *:62003 (LISTEN)\nrapportd    123            leo    6u  IPv6 0x84512a857627xxxx      0t0    TCP *:62003 (LISTEN)\nmongod      414            leo    9u  IPv4 0x84512a857926xxxx      0t0    TCP localhost:27017 (LISTEN)\nLoom       3315            leo   28u  IPv4 0x84512a85785cxxxx      0t0    TCP localhost:11223 (LISTEN)\nnode      38238            leo   22u  IPv6 0x84512a857627xxxx      0t0    TCP *:5000 (LISTEN)'
            }
          </code>
        </Pre>

        <p>
          The process on port{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'443'}</code> is
          already stopped!
        </p>

        <p>
          Cheers <Twemoji emoji="clinking-beer-mugs" />
        </p>
      </PostLayout>
    </>
  )
}
