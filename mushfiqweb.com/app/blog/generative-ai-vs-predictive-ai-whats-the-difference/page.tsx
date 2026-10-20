import { PostLayout } from '~/layouts/post-layout'
import { Twemoji } from '~/components/ui/twemoji'
import { Image } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import { Pre } from '~/components/mdx/pre'
import { CodeTitle } from '~/components/mdx/code-title'
import { TableWrapper } from '~/components/mdx/table-wrapper'
import { Callout } from '~/components/mdx/callout'
import { CodeBlock } from '~/components/mdx/code-block'
import { allBlogs } from '~/data/blog-registry'
import { allAuthors } from '~/data/author-registry'
import { genPostMetadata } from '~/utils/metadata'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const post = allBlogs.find(
    (p) => p.slug === 'generative-ai-vs-predictive-ai-whats-the-difference'
  )!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find(
    (p) => p.slug === 'generative-ai-vs-predictive-ai-whats-the-difference'
  )!

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
        <h2 id="definitions">Definitions</h2>

        <ul>
          <li>
            <strong>Generative AI</strong>
          </li>
        </ul>

        <p>
          Models that learn the distribution of data and can produce new samples: e.g., LLMs for
          text, diffusion models for images, code assistants for programming, and multimodal systems
          for mixed inputs/outputs.
        </p>

        <ul>
          <li>
            <strong>Predictive AI</strong>
          </li>
        </ul>

        <p>
          Models that map inputs to an outcome: e.g., classification (spam vs. not), regression
          (demand forecast), ranking (recommendations), and anomaly detection. These do not create
          new artifacts; they estimate what’s likely.
        </p>

        <h2 id="how-they-work-at-a-glance">How They Work (At A Glance)</h2>

        <ul>
          <li>Generative AI</li>
        </ul>

        <ul>
          <li>
            Common families: transformer LLMs, diffusion models, VAEs, autoregressive sequence
            models
          </li>
          <li>
            Training style: self-supervised/pretraining on massive corpora, then fine-tuning or
            prompting
          </li>
          <li>
            Output: probabilistic content generation guided by context, instructions, or examples
          </li>
        </ul>

        <ul>
          <li>Predictive AI</li>
          <li>
            Common families: gradient-boosted trees, linear/logistic regression, random forests,
            shallow/modern neural networks
          </li>
          <li>
            Training style: supervised learning on labeled datasets; sometimes semi/weakly
            supervised
          </li>
          <li>Output: numeric scores, probabilities, or discrete labels tied to KPIs</li>
        </ul>

        <h2 id="inputs-and-outputs">Inputs and Outputs</h2>

        <ul>
          <li>Generative</li>
        </ul>

        <ul>
          <li>Inputs: prompts, documents, images, audio, code, structured context</li>
          <li>Outputs: net-new text, images, audio, code, or structured content (e.g., JSON)</li>
        </ul>

        <ul>
          <li>Predictive</li>
          <li>Inputs: tabular features, time series, event logs, encoded text/images</li>
          <li>
            Outputs: predictions (e.g., likelihood of churn), forecasts, classifications, rankings
          </li>
        </ul>

        <h2 id="typical-use-cases">Typical Use Cases</h2>

        <ul>
          <li>Generative</li>
        </ul>

        <ul>
          <li>Content creation: marketing copy, product descriptions, documentation</li>
          <li>Knowledge tasks: summarization, Q&amp;A, drafting emails/tickets</li>
          <li>Design/code: UI mockups, code generation, test creation</li>
          <li>Multimodal: image generation/editing, audio synthesis, video captions</li>
        </ul>

        <ul>
          <li>Predictive</li>
          <li>Business outcomes: demand forecasting, lead scoring, churn prediction</li>
          <li>Risk &amp; compliance: fraud detection, credit scoring, anomaly alerts</li>
          <li>Operations: predictive maintenance, capacity planning</li>
          <li>Personalization: recommendations, next-best-action</li>
        </ul>

        <h2 id="evaluating-quality">Evaluating Quality</h2>

        <ul>
          <li>Generative metrics</li>
        </ul>

        <ul>
          <li>
            Text: human eval, task success rate, BLEU/ROUGE (for some tasks),
            factuality/hallucination rate
          </li>
          <li>Images/audio: human eval, task-specific criteria; consistency/faithfulness</li>
          <li>Safety: toxicity, PII leakage, policy adherence</li>
        </ul>

        <ul>
          <li>Predictive metrics</li>
          <li>Classification: accuracy, precision/recall, F1, ROC-AUC, PR-AUC</li>
          <li>Regression/forecast: RMSE/MAE/MAPE, calibration</li>
          <li>Ranking: NDCG/MRR, hit-rate, lift</li>
        </ul>

        <h2 id="risks-and-governance">Risks and Governance</h2>

        <ul>
          <li>Generative risks</li>
        </ul>

        <ul>
          <li>Hallucinations, brand/safety violations, IP concerns</li>
          <li>Data leakage through prompts or training sets</li>
          <li>Overreliance without human review</li>
        </ul>

        <ul>
          <li>Predictive risks</li>
          <li>Bias in training data, poor generalization, model drift</li>
          <li>Data quality issues, feature leakage</li>
          <li>Miscalibration leading to bad decisions</li>
        </ul>

        <p>Mitigation patterns:</p>

        <ul>
          <li>Retrieval-Augmented Generation (RAG) for grounding generative answers</li>
          <li>Human-in-the-loop review for high-stakes content or decisions</li>
          <li>MLOps: monitoring drift, data checks, audit trails, explainability</li>
        </ul>

        <h2 id="cost-and-latency-profiles">Cost and Latency Profiles</h2>

        <ul>
          <li>
            Generative: can be compute-heavy (especially large models and long outputs); latency
            varies with context length and modality. Caching and smaller models help.
          </li>
          <li>
            Predictive: often lower latency and cost per prediction; efficient for large-scale batch
            or streaming use.
          </li>
        </ul>

        <h2 id="decision-checklist">Decision Checklist</h2>

        <p>
          Use <strong>Generative AI</strong> when:
        </p>

        <ul>
          <li>You need net-new content or creative artifacts</li>
          <li>Tasks are open-ended (summarize, brainstorm, draft, translate)</li>
          <li>Acceptable outputs are “good enough” with human review and policy checks</li>
          <li>You can provide grounding context (RAG) to reduce hallucinations</li>
        </ul>

        <p>
          Use <strong>Predictive AI</strong> when:
        </p>

        <ul>
          <li>You need a clear numeric/label outcome tied to KPIs</li>
          <li>Data is structured/time-series and labeled</li>
          <li>You must optimize accuracy, calibration, and operational reliability</li>
          <li>Decisions influence transactions, risk, or resource allocation</li>
        </ul>

        <p>
          When in doubt, consider a <strong>hybrid</strong>:
        </p>

        <ul>
          <li>Predictive model identifies candidates; generative model drafts tailored content</li>
          <li>Generative model proposes actions; predictive scoring ranks them for execution</li>
          <li>Predictive classifiers gate generative responses for safety</li>
        </ul>

        <h2 id="integration-patterns">Integration Patterns</h2>

        <ul>
          <li>Generative</li>
        </ul>

        <ul>
          <li>Prompt engineering, tool-use (function calling), and RAG with vector search</li>
          <li>Content moderation and policy filters</li>
          <li>Workflow orchestration with human approval steps</li>
        </ul>

        <ul>
          <li>Predictive</li>
          <li>Feature pipelines, model registries, CI/CD for models, monitoring and alerts</li>
          <li>A/B testing and incremental rollouts</li>
          <li>Explainability for regulated domains</li>
        </ul>

        <h2 id="getting-started">Getting Started</h2>

        <ol>
          <li>Define the outcome: net-new content vs. forecast/classification</li>
          <li>Map to evaluation: human eval and safety checks vs. precision/recall/ROC-AUC</li>
          <li>
            Assess data: unlabeled corpora for generative; labeled, governed datasets for predictive
          </li>
          <li>Start small: pilot with clear success criteria, track real-world performance</li>
          <li>Add guardrails: grounding, moderation, and human-in-the-loop where needed</li>
          <li>Operationalize: observability, versioning, and continuous improvement</li>
        </ol>

        <p>
          Happy building <Twemoji emoji="clinking-beer-mugs" />
        </p>
      </PostLayout>
    </>
  )
}
