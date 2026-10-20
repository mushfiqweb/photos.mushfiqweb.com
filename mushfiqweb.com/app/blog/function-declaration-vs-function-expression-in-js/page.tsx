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
  const post = allBlogs.find((p) => p.slug === 'function-declaration-vs-function-expression-in-js')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'function-declaration-vs-function-expression-in-js')!

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
          This post is just a <strong>quick note</strong> from me for developers who sometimes
          forget about the two concepts: <strong>Function Declaration</strong> and{' '}
          <strong>Function Expression</strong>, so that every time they need to remember, they can
          come here to review instead of having to Google again{' '}
          <Twemoji emoji="grinning-face-with-sweat" />.
        </p>

        <p>
          Surely, those of you who work with <strong>JavaScript</strong> every day will write many
          functions with syntaxes such as:
        </p>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              'function doSomething() {} // function declaration\n\n// or\nlet doSomething = function () {} // function expression\n\n// or\nlet doSomething = () => {} // function expression'
            }
          </code>
        </Pre>

        <p>
          The first way of writing is <strong>Function Declaration</strong>, and the next two are{' '}
          <strong>Function Expressions</strong>. So what are the differences between them, and how
          do we use them?
        </p>

        <h2 id="definition">Definition</h2>

        <p>
          The first difference is how to define a <strong>function</strong>.
        </p>

        <ul>
          <li>
            <strong>Function Declaration</strong> is declared with the{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'function'}</code>{' '}
            keyword and <strong>always</strong> includes the name of the <strong>function</strong>.
          </li>
        </ul>

        <Pre>
          <code className="language-js">{'function doSomething() {}'}</code>
        </Pre>

        <ul>
          <li>
            <strong>Function Expression</strong> is declared similarly to{' '}
            <strong>Function Declaration</strong> but is assigned to a <strong>variable</strong> and
            will run when called through that <strong>variable</strong>. The name of the{' '}
            <strong>function</strong> can be omitted (<strong>Anonymous Function</strong>).
          </li>
        </ul>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              'let doSomething = function () {}\n\n// Anonymous function in ES6 syntax\nlet doSomething = () => {}'
            }
          </code>
        </Pre>

        <h2 id="hoisting">Hoisting</h2>

        <p>
          <strong>Hoisting</strong> is a mechanism of <strong>JavaScript</strong> that brings{' '}
          <strong>functions</strong> and <strong>variables</strong> to the top of the{' '}
          <strong>scope</strong> before the code is executed.
        </p>

        <blockquote>
          <p>
            <strong>Hoisting</strong> only applies to <strong>Function Declarations</strong>, not to
            Function Expressions.
          </p>
        </blockquote>

        <p>You can understand it simply through the following example:</p>

        <Pre>
          <code className="language-js showLineNumbers">
            {'sayHello() // => "Hello"\n\nfunction sayHello() {\n  console.log(\'Hello\')\n}'}
          </code>
        </Pre>

        <p>
          You can <strong>call</strong> Function Declaration anywhere in the <strong>scope</strong>{' '}
          it initializes.
        </p>

        <p>
          However, <strong>Function Expression</strong> can only be called after it is defined.
        </p>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              "sayHello() // => Uncaught ReferenceError: Cannot access 'sayHello' before initialization\n\nlet sayHello = function () {\n  console.log('Hello')\n}"
            }
          </code>
        </Pre>

        <p>
          Depending on the habits of the developer and the rules set by the project or team leader,
          one of these two ways of defining a function can be used.
        </p>

        <p>
          However, there are some special cases where <strong>Function Expression</strong> is used.
        </p>

        <h2 id="iife">IIFE</h2>

        <p>
          <Link href="https://mariusschulz.com/blog/use-cases-for-javascripts-iifes">
            Immediately Invoked Function Expressions
          </Link>{' '}
          or an <strong>Anonymous Function</strong> that is executed immediately after
          initialization.
        </p>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              ";(function () {\n  console.log('Code runs!')\n})()\n\n// ES6\n;(() => {\n  console.log('Code runs!')\n})()"
            }
          </code>
        </Pre>

        <h2 id="callback">Callback</h2>

        <p>
          Another case where <strong>Function Expression</strong> is used is as a{' '}
          <strong>callback</strong>.
        </p>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              "buttonElement.addEventListener('click', function (e) {\n  console.log('Button is clicked!')\n})"
            }
          </code>
        </Pre>

        <p>or</p>

        <Pre>
          <code className="language-js showLineNumbers">
            {'array.map((item) => {\n  // do stuff to an item\n})'}
          </code>
        </Pre>

        <p>
          This is a common case of using <strong>Function Expression</strong> because we don't need
          to know about this <strong>function</strong> throughout the scope.
        </p>

        <p>
          In conclusion, you can use the two ways of defining a function flexibly. If you want a
          function that can be used flexibly in many places in the scope, use{' '}
          <strong>Function Declaration</strong>, and if you only need it for a limited time, use{' '}
          <strong>Function Expression</strong>.
        </p>

        <h2 id="refs">Refs</h2>

        <ul>
          <li>
            <Link href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function">
              Function Declaration
            </Link>
          </li>
          <li>
            <Link href="https://developer.mozilla.org/en-US/docs/web/JavaScript/Reference/Operators/function">
              Function Expression
            </Link>
          </li>
          <li>
            <Link href="https://www.freecodecamp.org/news/when-to-use-a-function-declarations-vs-a-function-expression-70f15152a0a0/">
              https://www.freecodecamp.org/news/when-to-use-a-function-declarations-vs-a-function-expression-70f15152a0a0/
            </Link>
          </li>
          <li>
            <Link href="https://gomakethings.com/function-expressions-vs-function-declarations/">
              https://gomakethings.com/function-expressions-vs-function-declarations/
            </Link>
          </li>
        </ul>
      </PostLayout>
    </>
  )
}
