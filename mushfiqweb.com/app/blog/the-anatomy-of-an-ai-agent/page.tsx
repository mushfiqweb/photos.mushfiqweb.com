import { PostLayout } from '~/layouts/post-layout'
import { allBlogs } from '~/data/blog-registry'
import { allAuthors } from '~/data/author-registry'
import { genPostMetadata } from '~/utils/metadata'
import type { Metadata } from 'next'

import AgentSimulator from './components/agent-simulator'
import MemoryDashboard from './components/memory-dashboard'

export async function generateMetadata(): Promise<Metadata> {
  const post = allBlogs.find((p) => p.slug === 'the-anatomy-of-an-ai-agent')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'the-anatomy-of-an-ai-agent')!

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
          Artificial intelligence agents represent a paradigm shift in how we interact with
          computers. Rather than relying on simple request-response text generation, an **AI Agent**
          operates as an autonomous worker. Given a high-level goal, it continuously plans, gathers
          context, selects and executes tools, and evaluates observations until it reaches its
          objective.
        </p>
        <p>
          But what actually happens inside an agent's runtime? An agent is not just a raw Large
          Language Model. Building a production-ready agentic system requires orchestrating model
          reasoning, multi-tiered memory layers, and deterministic tool execution boundaries. Let's
          peel back the layers to understand how they work.
        </p>

        <h2 id="core-agent-architecture">Core Agent Architecture</h2>
        <p>
          The fundamental framework of an agent is the **while-loop runtime**. In this architecture,
          the LLM functions as the "brain," but a surrounding software execution engine handles loop
          state management.
        </p>
        <p>
          The loop begins with a user goal, followed by a cycle of **Planning**, **Acting (Tool
          Calling)**, and **Observing**. This execution cycle runs continuously. Crucially, the
          model is highly modular; a robust agentic architecture separates the reasoning LLM from
          the underlying runtime so that models can be swapped out as capabilities improve.
        </p>

        <h2 id="planning-and-task-decomposition">Planning and Task Decomposition</h2>
        <p>
          Large tasks are too complex for an LLM to solve in a single shot. The planning layer
          decomposes a goal into a list of sequential subtasks. Algorithms like **Chain-of-Thought
          (CoT)**, **Tree-of-Thoughts (ToT)**, or **ReAct (Reason + Action)** enable the model to
          think before acting.
        </p>
        <p>
          Furthermore, self-reflection mechanisms allow the agent to evaluate its own mistakes
          mid-task. If a bash command returns an error or a script fails compilation, the agent
          updates its subtask checklist and tries a different approach, correcting course
          dynamically.
        </p>

        <h2 id="memory-management-layers">Memory Management Layers</h2>
        <p>
          An agent requires memory to maintain consistency. Without memory, it would repeat tools or
          forget subtasks. Agent memory is divided into three distinct layers:{' '}
          <strong>Sensory Memory</strong>, <strong>Short-Term Memory</strong>, and{' '}
          <strong>Long-Term Memory</strong>.
        </p>
        <p>
          While short-term memory sits inside the volatile Transformer KV cache (the immediate
          prompt context), long-term memory is persisted externally using Vector Databases. This
          tiered structure enables agents to hold temporary workspace details while recalling global
          codebase references across sessions.
        </p>

        <MemoryDashboard />

        <h2 id="interactive-agent-action-loop">Interactive Agent Action Loop</h2>
        <p>
          Observe the execution loop of an agent in real-time. By selecting a target goal, you can
          watch how the agent updates its internal planning checklist, retrieves context from
          memory, calls system tools, and reacts to output logs.
        </p>

        <AgentSimulator />

        <h2 id="interactive-memory-dashboard">Interactive Memory Dashboard</h2>
        <p>
          <em>
            (Investigate memory sizes, retrieval latency, and implementation backends above using
            the Memory Layer selector panel.)
          </em>
        </p>

        <h2 id="sizing-up-production-agents">Sizing Up Production Agents</h2>
        <p>
          Building reliable agents in production remains a software engineering challenge. In
          production, success is heavily dependent on context compression (preventing context window
          pollution), tool reliability (deterministic schemas), and safety guardrails.
        </p>
        <p>
          By isolating memory layers, configuring strict CLI permission sandboxes, and establishing
          clear subtask rollback logic, developers can create autonomous agents that can be trusted
          to run without constant human supervision.
        </p>

        <hr className="my-8 border-gray-200 dark:border-zinc-800" />

        <p className="dark:text-zinc-450 text-xs text-gray-500">
          <em>Original system design topics compiled from the ByteByteGo AI systems series.</em>
        </p>
      </PostLayout>
    </>
  )
}
