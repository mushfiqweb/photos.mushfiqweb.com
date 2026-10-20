import { PostLayout } from '~/layouts/post-layout'
import { allBlogs } from '~/data/blog-registry'
import { allAuthors } from '~/data/author-registry'
import { genPostMetadata } from '~/utils/metadata'
import type { Metadata } from 'next'

import McpVisualizer from './components/mcp-visualizer'
import ToolExecutionConsole from './components/tool-execution-console'

export async function generateMetadata(): Promise<Metadata> {
  const post = allBlogs.find((p) => p.slug === 'connecting-llms-to-the-real-world')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'connecting-llms-to-the-real-world')!

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
          Large Language Models (LLMs) are incredibly capable text synthesizers, but in isolation,
          they are completely cut off from the real world. They cannot read your local workspace,
          query your company's sales database, or send Slack notifications to coordinate a release.
        </p>
        <p>
          To solve this, developers use **Tool Calling** (or function calling). In this paradigm,
          when an LLM determines it needs external information, it emits a structured JSON payload
          representing a tool request, which the client application executes. Recently, Anthropic
          introduced the **Model Context Protocol (MCP)**, standardizing this relationship into an
          open protocol.
        </p>

        <h2 id="tool-calling-and-function-selection">Tool Calling and Function Selection</h2>
        <p>
          Tool calling is a three-stage communication loop. First, the developer passes a list of
          tool descriptions (schemas containing names, descriptions, and parameter constraints)
          along with the user's prompt.
        </p>
        <p>
          Second, the LLM decides whether to run a tool. If yes, it pauses text generation and
          outputs a JSON object containing the function arguments. Third, the client application
          intercepts this JSON, runs the code locally or via APIs, and returns the string output to
          the LLM to resume text generation.
        </p>

        <ToolExecutionConsole />

        <h2 id="the-model-context-protocol-mcp">The Model Context Protocol (MCP)</h2>
        <p>
          While tool calling is powerful, integration complexity quickly becomes a bottleneck. In a
          world without standards, every AI-powered client (Cursor, VS Code, Claude Desktop) has to
          implement unique connectors to talk to various tool servers (GitHub APIs, local SQLite,
          Jira hooks).
        </p>
        <p>
          MCP introduces a standard client-server protocol. Under MCP, tool creators build a single
          **MCP Server** that exposes tool definitions via JSON-RPC. Any **MCP Host** (client editor
          or shell) that implements the standard immediately gains access to all MCP servers.
        </p>

        <h2 id="interactive-integration-complexity-visualizer">
          Interactive Integration Complexity Visualizer
        </h2>
        <p>
          Toggle between the two diagrams below to visualize how standardizing tool calls reduces
          architectural integration paths. What was once a custom mesh ($N \times M$) of duplicate
          API connectors becomes a clean, single-point star ($N + M$) topology.
        </p>

        <McpVisualizer />

        <h2 id="interactive-tool-execution-console">Interactive Tool Execution Console</h2>
        <p>
          <em>
            (Click the Trigger button in the console above to watch how a standard tool calling loop
            parses parameters, verifies rights, and returns outputs.)
          </em>
        </p>

        <h2 id="the-future-of-mcp-integrations">The Future of MCP Integrations</h2>
        <p>
          By standardizing how LLMs discover resources, request prompts, and call tools, MCP is
          building a modular ecosystem for AI applications. Rather than building custom database and
          API parsers for every new project, developers can plug in pre-configured MCP servers,
          giving their agents immediate, safe, and audited access to local development utilities.
        </p>

        <hr className="my-8 border-gray-200 dark:border-zinc-800" />

        <p className="dark:text-zinc-450 text-xs text-gray-500">
          <em>
            Original system design topics compiled from the Anthropic MCP and ByteByteGo developer
            series.
          </em>
        </p>
      </PostLayout>
    </>
  )
}
