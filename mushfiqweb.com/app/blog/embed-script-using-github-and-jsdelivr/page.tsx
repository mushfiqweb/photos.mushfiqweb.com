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
  const post = allBlogs.find((p) => p.slug === 'embed-script-using-github-and-jsdelivr')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'embed-script-using-github-and-jsdelivr')!

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
        <h2 id="problem">Problem</h2>

        <p>
          You want to add a feature to a webpage without having to modify the existing scripts on
          the page because it's too complicated to configure, change, and remove. You only need this
          feature for a certain period of time.
        </p>

        <p>If you have the same need, then here is a simple solution that I think you should do.</p>

        <h2 id="solution">Solution</h2>

        <ul>
          <li>
            Host your{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'script'}</code> on{' '}
            <strong>Github</strong> (which can also include{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'style'}</code>).
          </li>
        </ul>

        <p>
          Simply create a <strong>public repository</strong> on Github,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'push'}</code> your
          script and style there. (Remember to make it <strong>public</strong> so that it can be
          embedded.)
        </p>

        <ul>
          <li>
            Use <Link href="https://www.jsdelivr.com/">jsDelivr</Link> as a CDN for your script.
          </li>
        </ul>

        <p>
          <strong>jsDelivr</strong> is a simple tool used as a <strong>CDN</strong> for any{' '}
          <strong>npm</strong> package, <strong>Github</strong> repo or <strong>WordPress</strong>{' '}
          plugin.
        </p>

        <p>
          The usage instructions are available on the homepage of <strong>jsDelivr</strong>. Here's
          how to use it with a <strong>Github</strong> repo:
        </p>

        <Pre>
          <code className="language-js">
            {'https://cdn.jsdelivr.net/gh/{user}/{repo}/{directory}/{file}'}
          </code>
        </Pre>

        <p>
          This is the structure of a script/style URL hosted through <strong>jsDelivr</strong> for
          any file on <strong>Github</strong>:
        </p>

        <ul>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'{user}'}</code>:
            your <strong>username</strong> or <strong>organization</strong> on{' '}
            <strong>Github</strong>
          </li>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'{repo}'}</code>:{' '}
            <strong>repository</strong> name
          </li>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'{directory}'}
            </code>
            : <strong>folder</strong> name (optional) because your file can be placed in the root
            directory of the <strong>repo</strong>
          </li>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'{file}'}</code>:
            filename,{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'*.js'}</code> or{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'*.css'}</code>
          </li>
        </ul>

        <p>For example:</p>

        <p>
          This is one of my public repos:{' '}
          <Link href="https://github.com/Insights-Labs/minimog-badges">Minimog badges</Link>. I
          hosted 2 files on it, 1 <strong>Javascript</strong> file and 1 <strong>CSS</strong> file.
        </p>

        <p>
          !<Link href="/static/images/minimog-badges-repo.jpg">minimog-badges-repo</Link>
        </p>

        <p>
          So the URL hosted through <strong>jsDelivr</strong> for these 2 files will be:
        </p>

        <p>
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'https://cdn.jsdelivr.net/gh/Insights-Labs/minimog-menu-badges/style-v1.css'}
          </code>
        </p>

        <p>and:</p>

        <p>
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'https://cdn.jsdelivr.net/gh/Insights-Labs/minimog-badges/main-v3.js'}
          </code>
        </p>

        <p>
          Now simply <strong>embed</strong> them into your page with the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'link'}</code> tag:
        </p>

        <Pre>
          <code className="language-html showLineNumbers">
            {
              '<link\n  rel="stylesheet"\n  href="https://cdn.jsdelivr.net/gh/Insights-Labs/minimog-menu-badges/style-v1.css"\n/>'
            }
          </code>
        </Pre>

        <p>
          and the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'script'}</code> tag:
        </p>

        <Pre>
          <code className="language-html">
            {
              '<script src="https://cdn.jsdelivr.net/gh/Insights-Labs/minimog-badges/main-v3.js" async></script>'
            }
          </code>
        </Pre>

        <p>
          Now the 2 files hosted on <strong>Github</strong> are running on your page.{' '}
          <Twemoji emoji="party-popper" />
        </p>

        <h2 id="tips">Tips</h2>

        <ul>
          <li>Caching</li>
        </ul>

        <p>
          If you notice, I put the version number in the filename{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'main-v3.js'}</code>{' '}
          and{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'style-v1.css'}</code>
          . Why do you need to add this <strong>version</strong> number?
        </p>

        <p>
          The answer is because <strong>jsDelivr</strong> caches your resource. This is good for
          faster resource loading, but when you make changes, the cache is not cleared immediately,
          resulting in the old code still being loaded.
        </p>

        <p>
          To purge the cache, you need to email <strong>jsDelivr</strong>, which is quite
          inconvenient. So my simple solution is to put the version number right in the filename.
          When you make changes, create a new file with a name containing the new version number.
          For example:{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'main-v4.js'}</code>{' '}
          or{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'style-v2.css'}</code>
          , and modify the embed link, and you will have the new code immediately without waiting
          for the cache to clear.
        </p>

        <ul>
          <li>Minify</li>
        </ul>

        <p>
          If your code is not minified, simply add{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'.min'}</code> to the
          URL of the file, and <strong>jsDelivr</strong> will generate a minified version for your
          original file.
        </p>

        <p>For example:</p>

        <Pre>
          <code className="language-html">
            {
              '<script\n  src="https://cdn.jsdelivr.net/gh/Insights-Labs/minimog-badges/main-v3.min.js"\n  async\n></script>'
            }
          </code>
        </Pre>

        <h2 id="conclusion">Conclusion</h2>

        <p>I hope this tutorial can be helpful to you!</p>

        <p>
          Happy sharing <Twemoji emoji="clinking-beer-mugs" />
        </p>
      </PostLayout>
    </>
  )
}
