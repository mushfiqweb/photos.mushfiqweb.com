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
  const snippet = allSnippets.find((p) => p.slug === 'event-emitter')!
  return genPostMetadata(snippet)
}

export default function Page() {
  const snippet = allSnippets.find((p) => p.slug === 'event-emitter')!

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
          Simple Event Emitter or PubSub pattern <Twemoji emoji="owl" />
        </p>

        <CodeTitle lang="js" title="event-emitter.js showLineNumbers" />
        <Pre>
          <code className="language-js">
            {
              'class Event {\n  constructor() {\n    this.events = {}\n  }\n\n  subscribe(event, handler) {\n    this.events[event] = this.events[event] || []\n    this.events[event].push(handler)\n    return () => this.unSubscribe(event, handler)\n  }\n\n  unSubscribe(event, handler) {\n    let handlers = this.events[event]\n    if (handlers && Array.isArray(handlers)) {\n      for (let i = 0; i < handlers.length; i++) {\n        if (handlers[i] === handler) {\n          handlers.splice(i, 1)\n          break\n        }\n      }\n    }\n  }\n\n  emit(event, ...args) {\n    ;(this.events[event] || []).forEach((handler) => {\n      handler(...args)\n    })\n  }\n}'
            }
          </code>
        </Pre>

        <p>Usage</p>

        <CodeTitle lang="js" title="main.js showLineNumbers" />
        <Pre>
          <code className="language-js">
            {
              "// Create a global instance in your app\nlet globalEvent = new Event()\n\nlet handler1 = (data) => console.log(`handler1(): FOO event emiited with data: ${data}`)\nlet handler2 = (data) => console.log(`handler2(): FOO event emiited with data: ${data}`)\n\n// Subscribe to event\nglobalEvent.subscribe('FOO', handler1)\nglobalEvent.subscribe('FOO', handler2)\n\n// Emit event when needed\nglobalEvent.emit('FOO', 'foo')\n\n// Expected:\n// handler1(): FOO event emiited with data: foo\n// handler2(): FOO event emiited with data: foo\n\n// Unsubscribe event\nglobalEvent.unSubscribe('FOO', handler2)\n\n// Then\nglobalEvent.emit('FOO', 'bar')\n\n// Expected:\n// handler1(): FOO event emiited with data: bar"
            }
          </code>
        </Pre>
      </PostLayout>
    </>
  )
}
