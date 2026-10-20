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
  const post = allBlogs.find((p) => p.slug === 'tricky-use-case-of-array-map-in-js')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'tricky-use-case-of-array-map-in-js')!

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
          If you are familiar with{' '}
          <Link href="https://en.wikipedia.org/wiki/Functional_programming">
            functional programming
          </Link>
          , <strong>Array.prototype.map</strong> must be a <strong>function</strong> that you work
          with every day.
        </p>

        <p>
          For me, <strong>map()</strong> is a powerful function, but there might be some tricky use
          case of it that you don't know about!
        </p>

        <p>Let's walk through some basic knowledge</p>

        <blockquote>
          <p>
            The <strong>map()</strong> method creates a new array from the calling array by applying
            a provided <strong>callback function</strong> once for each element of the calling array
          </p>
        </blockquote>

        <h2 id="simple-use-cases">Simple use cases</h2>

        <p>Giving this array</p>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              "let devs = [\n  { id: '1', name: 'Leo', yob: 1995 },\n  { id: '2', name: 'Paul', yob: 1995 },\n  { id: '3', name: 'Jesse', yob: 1996 },\n  { id: '4', name: 'Ken', yob: 1997 },\n]"
            }
          </code>
        </Pre>

        <p>
          What can we do using <strong>map()</strong> function:
        </p>

        <ul>
          <li>Getting new values from array</li>
        </ul>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              'let ages = devs.map((dev) => {\n  let currentYear = new Date().getFullYear()\n  return currentYear - dev.yob\n})\n\nconsole.log(ages) // => [25, 25, 24, 23]'
            }
          </code>
        </Pre>

        <ul>
          <li>Extracting values from array of objects</li>
        </ul>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              'let names = devs.map((dev) => dev.name)\n\nconsole.log(names) // => ["Leo", "Paul", "Jesse", "Ken"]'
            }
          </code>
        </Pre>

        <ul>
          <li>Rendering list in React application</li>
        </ul>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              "import React from 'react'\n\nexport default DeveloperProfiles = ({ devs }) => {\n  return (\n    <ul>\n      {devs.map((dev) => (\n        <li key={dev.id}>{dev.name}</li>\n      ))}\n    </ul>\n  )\n}"
            }
          </code>
        </Pre>

        <h2 id="tricky-use-case">Tricky use case</h2>

        <p>
          It is common to pass the pre-defined <strong>callback</strong> function as{' '}
          <strong>map()</strong> argument like this:
        </p>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              'let extractId = (dev) => {\n  return dev.id\n}\n\nlet ids = devs.map(extractId)\n\nconsole.log(ids) // => ["1", "2", "3", "4"]'
            }
          </code>
        </Pre>

        <p>
          But this habit may lead to unexpected behaviors with <strong>functions</strong> that take
          additional <strong>arguments</strong>.
        </p>

        <p>
          Consider this case - we need to get all <strong>ids</strong> as <strong>numbers</strong>:
        </p>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              '// ids = ["1", "2", "3", "4"]\nlet idsInNumber = ids.map(parseInt)\n\nconsole.log(idsInNumber) // => ???'
            }
          </code>
        </Pre>

        <p>
          You might expect the result is{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'[1, 2, 3, 4]'}</code>
          , but the actual result is{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'[1, NaN, NaN, NaN]'}
          </code>{' '}
          <Twemoji emoji="astonished-face" />
        </p>

        <p>
          We encountered this problem at <Link href="https://coccoc.com/">Cốc Cốc</Link> recently,
          it took me a while to figure out, and here's the answer...
        </p>

        <p>
          Usually, we use <strong>map()</strong> callback with 1 <strong>argument</strong> (the
          element being traversed), but <strong>Array.prototype.map</strong> passes 3 arguments:
        </p>

        <ul>
          <li>
            the <strong>element</strong>
          </li>
          <li>
            the <strong>index</strong>
          </li>
          <li>
            the <strong>calling array</strong> (which we don't use most of the time)
          </li>
        </ul>

        <p>
          And the callback in this case -{' '}
          <Link href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt">
            parseInt
          </Link>{' '}
          is often used with 1 <strong>argument</strong> but it takes 2:
        </p>

        <Pre>
          <code className="language-js showLineNumbers">
            {'// Syntax\nparseInt(string [, radix])'}
          </code>
        </Pre>

        <ul>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'string'}</code>:
            the value to parse
          </li>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'radix'}</code>:{' '}
            <strong>[Optional]</strong>: an integer that represent the <strong>radix</strong> (the
            base in mathematical numeral systems) - usually, it's <strong>10</strong>
          </li>
        </ul>

        <p>For example:</p>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              "parseInt('10') // => 10\nparseInt('10', 10) // => 10\nparseInt('10', 2) // => 2\nparseInt('10', 4) // => 4"
            }
          </code>
        </Pre>

        <p>
          And here you can see the source of confusion <Twemoji emoji="eyes" />!
        </p>

        <p>
          The third <strong>argument</strong> of <strong>map()</strong> is ignored by{' '}
          <strong>parseInt</strong> - but{' '}
          <strong>
            <em>not</em>
          </strong>{' '}
          the second one!
        </p>

        <p>
          Hence, the <strong>iteration</strong> steps of <strong>map()</strong> look like this:
        </p>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              "// map(parseInt) => map(parseInt(value, index))\n\n/* index is 0 */ parseInt('1', 0) // => 1\n/* index is 1 */ parseInt('2', 1) // => NaN\n/* index is 2 */ parseInt('3', 2) // => NaN\n/* index is 3 */ parseInt('4', 3) // => NaN"
            }
          </code>
        </Pre>

        <h2 id="solution">Solution</h2>

        <p>
          As you've known the source of the problem, the solution is not to pass all of the{' '}
          <strong>map()</strong>'s arguments to your <strong>callback</strong> if you're not sure
          how it works
        </p>

        <ul>
          <li>Passing only the arguments that your callback needs</li>
        </ul>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              "function returnInt(element) {\n  return parseInt(element, 10)\n}\n\n;['1', '2', '3', '4'].map(returnInt)\n// => [1, 2, 3, 4]\n\n// Same as above, but using the concise arrow function syntax\n// Better use this if you don't need to re-use the callback\n;['1', '2', '3', '4'].map((numb) => parseInt(numb, 10))\n// => [1, 2, 3, 4]"
            }
          </code>
        </Pre>

        <ul>
          <li>
            A simpler way to achieve our case like{' '}
            <Link href="https://github.com/airbnb/javascript#coercion--numbers">
              Airbnb style guide
            </Link>
          </li>
        </ul>

        <Pre>
          <code className="language-js showLineNumbers">
            {";['1', '2', '3', '4'].map(Number)\n// => [1, 2, 3, 4]"}
          </code>
        </Pre>

        <p>
          And that's what I know about <strong>Array.prototype.map</strong> function, feel free to
          share your use cases in the comment section{' '}
          <Twemoji emoji="backhand-index-pointing-down" />
        </p>

        <p>Happy coding!</p>

        <h2 id="refs">Refs</h2>

        <ul>
          <li>
            <Link href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map">
              Array.prototype.map
            </Link>
          </li>
          <li>
            <Link href="https://github.com/denysdovhan/wtfjs#parseint-is-a-bad-guy">
              <strong>parseInt</strong> is a bad guy
            </Link>
          </li>
          <li>
            <Link href="http://www.wirfs-brock.com/allen/posts/166">
              A JavaScript Optional Argument Hazard
            </Link>
          </li>
          <li>
            <Link href="https://codesource.io/use-cases-of-array-map-you-should-know">
              https://codesource.io/use-cases-of-array-map-you-should-know
            </Link>
          </li>
          <li>
            <Link href="https://github.com/airbnb/javascript#coercion--numbers">
              https://github.com/airbnb/javascript#coercion--numbers
            </Link>
          </li>
        </ul>
      </PostLayout>
    </>
  )
}
