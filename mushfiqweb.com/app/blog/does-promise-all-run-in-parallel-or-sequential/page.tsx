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
  const post = allBlogs.find((p) => p.slug === 'does-promise-all-run-in-parallel-or-sequential')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'does-promise-all-run-in-parallel-or-sequential')!

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
        <p>
          Let's say you have a list of async tasks (each return a <strong>Promise</strong>).
        </p>

        <CodeTitle lang="js" title="promises.js showLineNumbers" />
        <Pre>
          <code className="language-js">
            {
              'let promise1 = async function () {\n  /* ... */\n}\nlet promise2 = async function () {\n  /* ... */\n}\nlet promise3 = async function () {\n  /* ... */\n}'
            }
          </code>
        </Pre>

        <p>What would you choose to run them?</p>

        <p>Awaiting each promise one by one:</p>

        <Pre>
          <code className="language-js showLineNumbers">
            {'await promise1()\nawait promise2()\nawait promise3()\n// do other stuff'}
          </code>
        </Pre>

        <p>Or run them all at once:</p>

        <Pre>
          <code className="language-js showLineNumbers">
            {'await Promise.all([promise1(), promise2(), promise3()])\n// do other stuff'}
          </code>
        </Pre>

        <p>
          The first approach is running them <strong>sequentially</strong>, one after another. It
          means that the next promise will start only after the previous one is resolved.
        </p>

        <p>Like this:</p>

        <CodeTitle lang="js" title="promise-hell.js showLineNumbers" />
        <Pre>
          <code className="language-js">
            {
              'promise1().then(() => {\n  promise2().then(() => {\n    promise3().then(() => {\n      // do other stuff\n    })\n  })\n})'
            }
          </code>
        </Pre>

        <p>
          The second approach is well-known as running them in <strong>"parallel"</strong>, meaning
          that all promises will start at the same time. It's useful when you don't need to wait for
          the previous promise to be resolved before starting the next one.
        </p>

        <p>
          But does it really run in parallel (or all at once)? <Twemoji emoji="thinking-face" />
        </p>

        <p>
          The answer is no. JavaScript is single-threaded programming language, so it can't run
          multiple things at the exact same time (except for some circumstances such as{' '}
          <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers">
            web workers
          </Link>
          .)
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'Promise.all()'}
          </code>{' '}
          actually runs them concurrently, not in parallel!
        </p>

        <p>What's the difference?</p>

        <h2 id="concurrent-programming-vs-parallel-programming">
          Concurrent programming vs Parallel programming
        </h2>

        <blockquote>
          <p>
            TL;DR: Concurrent programming is about dealing with a lot of things at once, while
            parallel programming is about doing a lot of things at once.
          </p>
        </blockquote>

        <p>
          See also this excellent explanation from{' '}
          <Link href="https://wiki.haskell.org/Parallelism_vs._Concurrency">Haskell wiki</Link>.
        </p>

        <p>A dead-simple example for a 9-year-old kid:</p>

        <ul>
          <li>
            <strong>Concurrency</strong>: 2 lines of customers ordering food from a single cashier
            (lines take turns ordering).
          </li>
          <li>
            <strong>Parallelism</strong>: 2 lines of customers ordering food at the same time from 2
            cashiers.
          </li>
        </ul>

        <p>
          As so, what{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'Promise.all()'}
          </code>{' '}
          does is, it adds the promises to an event loop queue and calls them all together. But it
          waits for each one to resolve before moving on.
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'Promise.all'}
          </code>{' '}
          will stop if the first promise rejects, unless you handle the error yourself (e.g. with{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'.catch()'}</code>).
        </p>

        <p>
          That's the major difference between concurrent and parallel, with{' '}
          <em>concurrent execution</em>, promises run one after another but don't have to wait for
          previous ones to end. They make progress at the same time. In contrast,{' '}
          <em>parallel execution</em> runs promises at the exact same time in separate processes.
          This allows them to progress completely separately at their own speed.
        </p>

        <h2 id="conclusion">Conclusion</h2>

        <p>
          The answer for the question in the title is:{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'Promise.all()'}
          </code>{' '}
          runs concurrently, all promises execute almost at the same time, but not in parallel.
        </p>

        <p>
          If you have a list promises that don't depend on each other, you can run them concurrently
          (or parallel-like):
        </p>

        <CodeTitle lang="js" title="concurrently.js showLineNumbers" />
        <Pre>
          <code className="language-js">
            {
              'await Promise.all([promise1(), promise2(), promise3()])\n// or\nawait Promise.all(\n  items.map(async (item) => {\n    await doSomething(item)\n  })\n)'
            }
          </code>
        </Pre>

        <p>Or sequentially:</p>

        <CodeTitle lang="js" title="sequentially.js showLineNumbers" />
        <Pre>
          <code className="language-js">
            {'for (let item of items) {\n  await doSomething(item)\n}'}
          </code>
        </Pre>

        <h2 id="references">References</h2>

        <ul>
          <li>
            <Link href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all">
              <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
                {'Promise.all()'}
              </code>{' '}
              documentation
            </Link>
          </li>
          <li>
            <Link href="https://wiki.haskell.org/Parallelism_vs._Concurrency">
              Parallelism vs. Concurrency
            </Link>
          </li>
          <li>
            <Link href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop">
              JavaScript Event Loop structure
            </Link>
          </li>
        </ul>

        <p>
          Happy promise-ing! <Twemoji emoji="clinking-beer-mugs" />
        </p>
      </PostLayout>
    </>
  )
}
