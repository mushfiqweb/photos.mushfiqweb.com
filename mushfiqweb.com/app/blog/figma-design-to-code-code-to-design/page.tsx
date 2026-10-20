import { PostLayout } from '~/layouts/post-layout'
import { allBlogs } from '~/data/blog-registry'
import { allAuthors } from '~/data/author-registry'
import { genPostMetadata } from '~/utils/metadata'
import type { Metadata } from 'next'

import CodeConnector from './components/code-connector'
import DomReconstructor from './components/dom-reconstructor'

export async function generateMetadata(): Promise<Metadata> {
  const post = allBlogs.find((p) => p.slug === 'figma-design-to-code-code-to-design')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'figma-design-to-code-code-to-design')!

  const authorList = post.authors || ['default']
  const authorDetails = authorList.map((authorSlug) => {
    return allAuthors.find((p) => p.slug === authorSlug)!
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.lastmod || post.date,
    description: post.summary,
    image: post.images ? post.images[0] : '/static/images/logo.jpg',
    url: `https://www.mushfiqweb.com/blog/${post.slug}`,
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
      <PostLayout content={post} authorDetails={authorDetails}>
        <h2 id="introduction">Introduction</h2>
        <p>
          The gap between design and engineering is one of the oldest friction points in software
          development. Designers build layouts in visual tools like **Figma**, while developers
          reconstruct those mockups from scratch in code (HTML, CSS, React components).
          Historically, this handoff has relied on static image inspections or parsing raw styling
          dimensions.
        </p>
        <p>
          In 2026, AI coding agents and advanced protocol standardizations (like the **Model Context
          Protocol**) are enabling a **bidirectional synchronization** loop. Design files can now
          connect directly to code repositories via Figma's Code Connect, and running application
          interfaces can be captured and compiled back into fully editable Figma frames
          automatically. Let's see how this lifecycle works.
        </p>

        <h2 id="design-to-code-code-connect">Design-to-Code: Code Connect</h2>
        <p>
          Traditional "design-to-code" tools generated bloated, unmaintainable absolute-positioned
          code blocks. Figma's **Code Connect** changes this by mapping visual components directly
          to existing component registries in your codebase (e.g. mapping Figma's{' '}
          <code>Button</code> components to your project's <code>~/components/ui/button.tsx</code>).
        </p>
        <p>
          When an AI developer agent (like Claude Code or Cursor) connects to Figma via the Figma
          MCP server, it does not just look at a screenshot. It queries the server for structured
          design JSON, resolves variables (like colors, paddings, and font tokens), and matches them
          to Code Connect configurations, outputting clean, production-ready code.
        </p>

        <CodeConnector />

        <h2 id="code-to-design-dom-to-figma-capture">Code-to-Design: DOM-to-Figma Capture</h2>
        <p>
          While design-to-code handles the initial setup, what happens when developer edits or live
          updates are made directly in code? The bidirectional loop allows developers to convert
          running application code **back into editable Figma designs**.
        </p>
        <p>
          Using an MCP server client, a headless browser script (powered by tools like Playwright)
          captures the rendered DOM structure, dimensions, and computed CSS of a running application
          (e.g., on localhost:3000). The server then parses these DOM nodes and maps them to native
          Figma frames using auto-layout variables, producing clean, editable layers for the design
          team.
        </p>

        <DomReconstructor />

        <h2 id="interactive-code-connect-generator">Interactive Code Connect Generator</h2>
        <p>
          *Use the component selector above to simulate how Figma Code Connect maps design specs
          into framework code inputs (React/Tailwind, Vue, or SwiftUI).*
        </p>

        <h2 id="interactive-dom-reconstructor">Interactive DOM Reconstructor</h2>
        <p>
          *Click the Capture DOM button in the simulator above to observe how live CSS and node
          trees are parsed and reconstructed into editable auto-layout frames.*
        </p>

        <h2 id="the-synchronized-design-system-lifecycle">
          The Synchronized Design System Lifecycle
        </h2>
        <p>
          By leveraging MCP servers and Code Connect interfaces, organizations can keep designs and
          code bases in sync. AI agents can implement layout adjustments directly from design
          changes, and design mockups can be refreshed automatically from running deployments.
        </p>
        <p>
          This automated, bidirectional feedback loop eliminates manual layout matching, reduces
          styling divergence, and allows product teams to iterate with confidence.
        </p>

        <hr className="my-8 border-gray-200 dark:border-zinc-800" />

        <p className="dark:text-zinc-450 text-xs text-gray-500">
          <em>
            Original system design topics compiled from the Figma developer and Model Context
            Protocol series.
          </em>
        </p>
      </PostLayout>
    </>
  )
}
