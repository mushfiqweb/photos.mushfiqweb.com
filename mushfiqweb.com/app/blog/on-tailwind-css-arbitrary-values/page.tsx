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
  const post = allBlogs.find((p) => p.slug === 'on-tailwind-css-arbitrary-values')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'on-tailwind-css-arbitrary-values')!

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
          I have been using <Link href="https://tailwindcss.com/">Tailwind CSS</Link> since 2018 and
          I super love the framework. It's so flexible, powerful, and brings so much joy writing
          CSS.
        </p>

        <p>
          Here are some of my favorite tips when using{' '}
          <strong>Tailwind CSS Arbitrary Values</strong> to write custom styles for your components.
          Some of them are covered in the official documentation, some I couldn't find (maybe they
          are their hidden gems <Twemoji emoji="grinning-face-with-sweat" />
          ), and some are just my own personal tricks.
        </p>

        <blockquote>
          <p>
            [!NOTE] All the examples below are in React since I guess Tailwind is mostly used with a
            frontend framework.
          </p>
        </blockquote>

        <h2 id="arbitrary-values">Arbitrary values</h2>

        <p>
          Arbitrary values are values that are not predefined in the Tailwind CSS configuration. We
          use the square brackets annotation{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'[]'}</code> to
          generate a class on the fly with any value:
        </p>

        <Pre>
          <code className="language-jsx">{'<div className="bg-[#f00]" />'}</code>
        </Pre>

        <p>This will output the following CSS:</p>

        <Pre>
          <code className="language-css showLineNumbers">
            {
              '.bg-\\[\\#f00\\] {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 0 0 / var(--tw-bg-opacity)) /* #ff0000 */;\n}'
            }
          </code>
        </Pre>

        <h2 id="referencing-design-tokens">Referencing design tokens</h2>

        <p>
          We can use the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'theme()'}</code>{' '}
          function to reference design tokens in{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'tailwind.config.js'}
          </code>
          :
        </p>

        <Pre>
          <code className="language-jsx">
            {'<div className="[--song-color:theme(colors.gray.200)]" />'}
          </code>
        </Pre>

        <p>Output CSS:</p>

        <Pre>
          <code className="language-css showLineNumbers">
            {'.\\[--song-color\\:theme\\(colors\\.gray\\.200\\)\\] {\n  --song-color: #e5e7eb;\n}'}
          </code>
        </Pre>

        <h2 id="with-css-variables">With CSS variables</h2>

        <p>We can also use CSS variables to generate arbitrary values:</p>

        <Pre>
          <code className="language-jsx">{'<div className="h-[var(--section-height)]" />'}</code>
        </Pre>

        <p>
          You can get rid of the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'var(...)'}</code>{' '}
          wrapper, just provide the variable name is enough:
        </p>

        <Pre>
          <code className="language-jsx">{'<div className="h-[--section-height]" />'}</code>
        </Pre>

        <p>This will output the following CSS:</p>

        <Pre>
          <code className="language-css showLineNumbers">
            {'.h-\\[var\\(--section-height\\)\\] {\n  height: var(--section-height);\n}'}
          </code>
        </Pre>

        <p>
          But for variables with fallback values to another variable, we still need to use the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'var(...)'}</code>{' '}
          wrapper:
        </p>

        <Pre>
          <code className="language-jsx">
            {'<div className="h-[var(--section-height,var(--fallback-height))]" />'}
          </code>
        </Pre>

        <p>Output CSS:</p>

        <Pre>
          <code className="language-css showLineNumbers">
            {
              '.h-\\[var\\(--section-height\\,var\\(--fallback-height\\)\\)\\] {\n  height: var(--section-height, var(--fallback-height));\n}'
            }
          </code>
        </Pre>

        <h2 id="injecting-css-variables">Injecting CSS variables</h2>

        <p>CSS variables can be injected into the DOM with inline styles like this:</p>

        <Pre>
          <code className="language-jsx">{"<div style={{ '--song-color': '#f00' }} />"}</code>
        </Pre>

        <p>But with arbitrary values, we can do this:</p>

        <Pre>
          <code className="language-jsx">{'<div className="[--song-color:#f00]" />'}</code>
        </Pre>

        <p>Which will output the same CSS variables declaration as above.</p>

        <h2 id="out-of-the-box-utilities">Out of the box utilities</h2>

        <p>
          For properties that are not supported by default in Tailwind CSS, we can also use the
          square bracket notation to write completely arbitrary CSS:
        </p>

        <Pre>
          <code className="language-jsx">
            {
              '<div className=\'[background-image:url("https://www.mushfiqweb.com/static/images/black-grit.png")]\' />'
            }
          </code>
        </Pre>

        <h2 id="handling-whitespaces">Handling whitespaces</h2>

        <p>
          We <strong>must</strong> remove whitespaces from the arbitrary classes to make them work
          or use the underscore notation{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'_'}</code> for better
          readability:
        </p>

        <Pre>
          <code className="language-jsx">
            {'<div className="shadow-[6px_6px_12px_-1px_rgba(0,_0,_0,_0.1)]" />'}
          </code>
        </Pre>

        <h2 id="resolving-namespace-collisions">Resolving namespace collisions</h2>

        <p>
          Many CSS properties share the same namespace in Tailwind CSS, for example{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'bg-red-500'}</code>{' '}
          and <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'bg-cover'}</code>
          , or{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'text-gray-900'}
          </code>{' '}
          and <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'text-2xl'}</code>
          .
        </p>

        <p>
          To avoid collisions when using arbitrary values, we can prefix a{' '}
          <Link href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Types">
            CSS data types
          </Link>
          (<code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'color:'}</code>,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'length:'}</code>,
          etc.) to the property value:
        </p>

        <Pre>
          <code className="language-jsx">{'<div className="bg-[length:100%_50%]" />'}</code>
        </Pre>

        <p>This is super useful when using with variables, for example:</p>

        <Pre>
          <code className="language-jsx showLineNumbers">
            {'<div className="bg-[color:--variable]" />\n// or just `bg-[--variable]`'}
          </code>
        </Pre>

        <p>will output CSS for background color:</p>

        <Pre>
          <code className="language-css showLineNumbers">
            {'.bg-\\[--variable\\] {\n  background-color: var(--variable);\n}'}
          </code>
        </Pre>

        <p>
          And adding a{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'length:'}</code>{' '}
          prefix will output the css for{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'background-size'}
          </code>
          :
        </p>

        <Pre>
          <code className="language-jsx">{'<div className="bg-[length:--variable]" />'}</code>
        </Pre>

        <p>Output:</p>

        <Pre>
          <code className="language-css showLineNumbers">
            {'.bg-\\[length\\:--variable\\] {\n  background-size: var(--variable);\n}'}
          </code>
        </Pre>

        <p>
          That's some of my favorite notes when using Tailwind CSS Arbitrary Values. Do you have any
          other tips? Please let me know in the comment section{' '}
          <Twemoji emoji="backhand-index-pointing-down" />
        </p>

        <p>
          Happy styling (with Tailwind CSS) <Twemoji emoji="clinking-beer-mugs" />
        </p>
      </PostLayout>
    </>
  )
}
