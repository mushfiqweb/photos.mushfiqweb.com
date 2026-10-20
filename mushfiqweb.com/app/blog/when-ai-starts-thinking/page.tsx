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
  const post = allBlogs.find((p) => p.slug === 'when-ai-starts-thinking')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'when-ai-starts-thinking')!

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
        <h1 id="when-ai-models-begin-to-notice-their-own-thoughts">
          When AI Models Begin to Notice Their Own Thoughts
        </h1>

        <p>
          Artificial intelligence is starting to study itself. Recent research suggests that{' '}
          <strong>
            large language models (LLMs) may occasionally recognize their own internal changes
          </strong>
          , a phenomenon described as <em>introspective awareness</em>. While rare, these signals
          hint at a future where AI systems can explain not only <em>what</em> they produce, but
          also <em>how</em> they arrive at those outputs.
        </p>

        <Image
          src="https://assets.ibm.com/is/image/ibm/adobestock_1242397089?ts=1763123759664&dpr=off"
          alt="Render of several artificial intelligence heads against a black backdrop"
          width={800}
          height={400}
        />

        <h2 id="the-black-box-problem">The Black Box Problem</h2>

        <p>
          Modern AI systems are often described as <strong>black boxes</strong>. They generate text,
          images, and predictions with astonishing fluency, yet their inner workings remain opaque.
          Once trained on massive datasets, the complexity of their neural pathways makes human
          interpretation nearly impossible.
        </p>

        <p>
          Researchers at Anthropic attempted to pierce this opacity using <em>concept injection</em>
          . By inserting known neural activity patterns—such as “bread” or “all caps text”—into a
          model mid-task, they asked whether the system noticed anything unusual. Surprisingly,{' '}
          <strong>Claude Opus 4 and 4.1 detected the disturbance about 20% of the time</strong>,
          sometimes reporting that “a thought had been injected.”
        </p>

        <h2 id="why-this-matters">Why This Matters</h2>

        <p>
          IBM experts caution against equating this with human self-awareness. Instead, it
          represents a <strong>technical sensitivity to internal signals</strong>. As Karthikeyan
          Natesan Ramamurthy of IBM Research explained:
        </p>

        <blockquote>
          <p>
            “If a model can recognize its own bad thought, you can stop it before it reaches the
            user.”
          </p>
        </blockquote>

        <p>
          This ability connects directly to IBM’s <strong>steerability research</strong>, which
          explores guiding models in real-time to ensure predictability without stifling creativity.
          Tools like the <em>Attention Tracker</em> and <em>AI Steerability 360</em> already help
          developers visualize activations, detect bias, and prevent adversarial prompt injections.
        </p>

        <h2 id="transparency-and-trust">Transparency and Trust</h2>

        <p>
          The broader industry push is toward <strong>AI transparency</strong>. Larger models appear
          more capable of introspection, suggesting that representational richness may aid in
          detecting irregularities. However, IBM researchers emphasize that “awareness” here is
          purely statistical, not emotional or conscious.
        </p>

        <p>Kush Varshney, IBM Fellow, frames this as interpretability rather than sentience:</p>

        <blockquote>
          <p>
            “Borrowing terms from human cognition is fine; we just have to resist believing it’s the
            same thing as introspection.”
          </p>
        </blockquote>

        <p>
          By embedding oversight mechanisms, IBM ensures that{' '}
          <strong>humans remain responsible for judgment</strong>, even as models monitor
          themselves. This dual-layer approach—self-analysis plus human verification—could make AI
          safer, more accountable, and easier to audit in critical industries like finance and
          healthcare.
        </p>

        <h2 id="the-limits-of-self-knowledge">The Limits of Self-Knowledge</h2>

        <p>
          Despite these advances, introspection remains unreliable. Models often fail to detect
          injected concepts, or worse, fabricate explanations—describing “dust” or “light” that
          researchers never introduced. This tendency toward <strong>confabulation</strong>{' '}
          underscores the need for careful governance.
        </p>

        <p>As David Cox of IBM Research notes:</p>

        <blockquote>
          <p>
            “The brain tells stories about why it did something, but those stories are not always
            accurate. We may be building machines that behave in similar ways.”
          </p>
        </blockquote>

        <h2 id="looking-ahead">Looking Ahead</h2>

        <p>
          The next frontier is determining whether introspection can emerge naturally, without
          deliberate interference. If models begin to notice their own reasoning during everyday
          tasks, it could mark a profound shift in how we design and trust AI systems.
        </p>

        <p>
          Ultimately, this research bridges two quests:{' '}
          <strong>understanding human cognition and building machines that reason.</strong> Teaching
          AI to ask questions about itself may illuminate both paths.
        </p>

        <p>---</p>

        <p>
          <em>
            Sources: <Link href="https://share.google/oQ2AMXk7tcQ5iqwRt">IBM Think</Link>, Anthropic
            Research
          </em>
        </p>
      </PostLayout>
    </>
  )
}
