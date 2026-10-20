import { PostLayout } from '~/layouts/post-layout'
import { Link } from '~/components/ui/link'
import { allBlogs } from '~/data/blog-registry'
import { allAuthors } from '~/data/author-registry'
import { genPostMetadata } from '~/utils/metadata'
import type { Metadata } from 'next'

// Import custom interactive components
import ModelExplorer from './components/model-explorer'
import ParameterChart from './components/parameter-chart'
import SlmLlmComparison from './components/slm-llm-comparison'
import AgentFrameworks from './components/agent-frameworks'
import ClaudeConsole from './components/claude-console'
import DecisionMatrix from './components/decision-matrix'

export async function generateMetadata(): Promise<Metadata> {
  const post = allBlogs.find((p) => p.slug === '12-open-source-llms')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === '12-open-source-llms')!

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
        {/* Section 1: Introduction */}
        <h2 id="introduction">Introduction</h2>
        <p>
          In 2026, the landscape of Artificial Intelligence has undergone a monumental shift. The
          initial reign of massive, closed-source API gateways has evolved into a diverse ecosystem
          of highly capable, sovereign, and cost-effective open-weight models. Developers are no
          longer restricted to cloud-hosted black boxes; they can now choose, fine-tune, and deploy
          state-of-the-art models directly on their own hardware.
        </p>
        <p>
          Whether you are building autonomous software agents, deploying real-time multimodal
          assistants, or optimizing on-device inference for low-power edge nodes, there is an
          open-source model designed specifically for your constraints. In this deep dive, we
          explore twelve standout open-source models of 2026, comparing their core architectures,
          licenses, context windows, and ideal production deployment scenarios.
        </p>

        {/* Section 2: The 12 Open-Source LLMs */}
        <h2 id="the-12-open-source-llms">The 12 Open-Source LLMs</h2>
        <p>
          Each of these twelve models has been selected for a specific standout strength. Sourced
          from academic labs, consumer tech companies, and specialized AI hardware providers, they
          collectively define the state of the art in open-weight capabilities.
        </p>
        <p>
          Below, you will find meta-information on parameter sizes, active vs. total weights, and
          specific licenses. Use the interactive explorer in the next section to filter and search
          the models according to your project's specific criteria.
        </p>

        {/* Section 3: Interactive Model Explorer */}
        <h2 id="interactive-model-explorer">Interactive Model Explorer</h2>
        <p>
          Filter and sort the standout open-source LLMs by their focus areas (Reasoning, Coding,
          Multimodal, Edge), license models, or context windows. Expand any model's card to inspect
          its exact neural architecture details, hardware/VRAM requirements, and benchmark ranks.
        </p>

        <ModelExplorer />

        {/* Section 4: Architecture & Parameter Trade-offs */}
        <h2 id="architecture--parameter-trade-offs">Architecture & Parameter Trade-offs</h2>
        <p>
          Choosing the right model requires balancing two primary performance levers:{' '}
          <strong>Parameter Footprint</strong> (which dictates memory requirements and inference
          throughput) and <strong>Context Window Sizing</strong> (which dictates how much raw
          information the model can recall in a single loop).
        </p>
        <p>
          In the past, running large context windows required massive compute clusters. Today,
          architectures like Mixture-of-Experts (MoE) activate only a fraction of their total
          parameter count per token, drastically reducing inference latency while supporting native
          context lengths of up to one million tokens (as seen in DeepSeek V4 and NVIDIA's Nemotron
          3 Super).
        </p>

        <ParameterChart />

        {/* Section 5: LLMs vs. SLMs: Production Insights */}
        <h2 id="llms-vs-slms-production-insights">LLMs vs. SLMs: Production Insights</h2>
        <p>
          A common architectural question when designing production systems is whether to route
          tasks to a <strong>Small Language Model (SLM)</strong> or a{' '}
          <strong>Large Language Model (LLM)</strong>. In production, parameter size corresponds
          directly to operational cost, memory requirements, and latency.
        </p>
        <p>
          While SLMs (typically under 10 Billion parameters) are highly efficient and can run
          directly on consumer devices or edge nodes, they lack the deep attention depth needed for
          multi-step reasoning. Large models, conversely, handle complex logic but require expensive
          cloud hosting. Use the comparison tabs below to evaluate how they differ across critical
          dimensions.
        </p>

        <SlmLlmComparison />

        {/* Section 6: Agent Frameworks: Single vs. Multi-Agent */}
        <h2 id="agent-frameworks-single-vs-multi-agent">
          Agent Frameworks: Single vs. Multi-Agent
        </h2>
        <p>
          Building autonomous systems requires deciding on the agent layout. A{' '}
          <strong>Single-Agent system</strong> relies on a single high-reasoning model (like Meta's
          Llama 4 Scout or Qwen3) that plans, picks a tool, and loops on its own until a task is
          completed.
        </p>
        <p>
          A <strong>Multi-Agent system</strong> decomposes a complex problem into subtasks, routing
          each to specialized agents (e.g., a coder agent, a search agent, and a code validator
          agent). This prevents single-agent context pollution and allows steps to execute in
          parallel, but introduces coordination latency.
        </p>

        <AgentFrameworks />

        {/* Section 7: Claude Code: 7 Permission Modes */}
        <h2 id="claude-code-7-permission-modes">Claude Code: 7 Permission Modes</h2>
        <p>
          As coding agents become more autonomous, security is a major concern. When using developer
          tools like <code>Claude Code</code>, the agent must interact with your local file system,
          run bash commands, and occasionally make external HTTP requests to fetch documentation.
        </p>
        <p>
          To ensure security without sacrificing productivity, tools implement permission systems.
          Understanding these permission modes is critical for setting up a safe development
          environment. Select a mode in the mock terminal console below to see how it handles tool
          execution and user prompts.
        </p>

        <ClaudeConsole />

        {/* Section 8: Interactive Decision Matrix */}
        <h2 id="interactive-decision-matrix">Interactive Decision Matrix</h2>
        <p>
          Ready to deploy? Finding the right model depends on your hosting limitations, task
          complexity, and compliance requirements.
        </p>
        <p>
          Use our interactive advisor below. By answering three simple questions, you will receive a
          tailored deployment recommendation explaining why that model fits your architecture.
        </p>

        <DecisionMatrix />

        <hr className="my-8 border-gray-200 dark:border-zinc-800" />

        <p className="text-xs text-gray-500 dark:text-zinc-400">
          <em>
            Original content inspired by the ByteByteGo system design refresher. Special thanks to
            all open-source research institutes contributing to weight reproducibility and dataset
            transparency.
          </em>
        </p>
      </PostLayout>
    </>
  )
}
