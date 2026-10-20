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
  const post = allBlogs.find((p) => p.slug === 'render-blocking-css-and-chrome-performance-api')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'render-blocking-css-and-chrome-performance-api')!

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
          <strong>CSS</strong> is considered by browsers as one of the{' '}
          <strong>render-blocking resources</strong> - resources that your page must load before
          users can see the content.
        </p>

        <h2 id="why-should-you-avoid-render-blocking-css">
          Why should you avoid Render Blocking CSS?
        </h2>

        <ul>
          <li>
            <strong>Render blocking CSS</strong> will slow down the display of your website to
            users.
          </li>
        </ul>

        <ul>
          <li>
            Each CSS file that your website loads adds to the <strong>first-paint</strong> time of
            the page, meaning users have to wait longer to see content if your page has to load a
            lot of <strong>CSS</strong>.
          </li>
        </ul>

        <p>
          !<Link href="/static/images/render-blocking-css.png">render-blocking-css</Link>
        </p>

        <div className="pt-2 text-center italic">
          <small>CSS greatly affects page load time</small>
        </div>

        <br />

        <p>
          When starting to load a page, the <strong>browser</strong> automatically loads all{' '}
          <strong>CSS</strong> files, regardless of whether they <strong>block</strong> the
          rendering process or not!
        </p>

        <p>
          So, how can you limit <strong>render-blocking CSS</strong>?
        </p>

        <h2 id="solutions">Solutions</h2>

        <p>
          If you notice that your page has <strong>CSS</strong> that is only used in certain
          conditions, such as styles for content inside a modal that the user must click to open and
          view, content inside a tab that is not displayed first, or styles that only apply to large
          monitors or mobile devices...
        </p>

        <p>Here are some ways to help your page load faster.</p>

        <h3 id="use-the-media-attribute">Use the media attribute</h3>

        <p>
          When you want to load CSS into your web page, you will use the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'link'}</code> tag
          like this:
        </p>

        <Pre>
          <code className="language-html showLineNumbers">
            {
              '<link href="style.css" rel="stylesheet" />\n<link href="print.css" rel="stylesheet" />\n<link href="style.mobile.css" rel="stylesheet" />'
            }
          </code>
        </Pre>

        <p>
          After loading the HTML, the browser will also load these 3 CSS files and only display the
          content after all of them have loaded.
        </p>

        <p>
          However,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'print.css'}</code> is
          only used when <strong>printing</strong> a document (<strong>Ctrl/Cmd + P</strong>), and{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'style.mobile.css'}
          </code>{' '}
          is only for styles that apply on <strong>mobile devices</strong>.
        </p>

        <p>
          In this case, we can use the{' '}
          <Link href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-media">
            media attribute
          </Link>
          .
        </p>

        <Pre>
          <code className="language-html showLineNumbers">
            {
              '<link href="style.css" rel="stylesheet" />\n<link href="print.css" media="print" rel="stylesheet" />\n<link href="style.mobile.css" media="(max-width: 568px)" rel="stylesheet" />'
            }
          </code>
        </Pre>

        <p>
          Now the browser understands that it only needs to load the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'style.css'}</code>{' '}
          file to display the page content immediately to the user, without waiting for the other 2
          files to load.
        </p>

        <p>
          For links that use the <strong>media attribute</strong>:
        </p>

        <ul>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'media="print"'}
            </code>
            : the styles in this file will only apply when <strong>printing</strong> a document, so
            there is no need for rendering and it will not block the first render when loading the
            page.
          </li>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'media="(max-width: 568px)"'}
            </code>
            : these styles only apply on devices with{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'max-width=568px'}
            </code>
            , and will not block the first render when loading the page on a{' '}
            <strong>desktop/tablet</strong> device.
          </li>
        </ul>

        <p>
          Using the <strong>media attribute</strong>, we can adjust the display of the page in
          specific cases such as after rendering, adjusting screen size, changing device orientation
          (horizontal/vertical)...
        </p>

        <p>
          The value of <strong>media</strong> must be a{' '}
          <Link href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media#Description">
            media type
          </Link>{' '}
          or{' '}
          <Link href="https://developer.mozilla.org/en-US/docs/Web/CSS/Media_queries">
            media query
          </Link>
          , which is very useful when loading <strong>external stylesheets</strong> - it helps the
          browser choose the necessary CSS for the first render.
        </p>

        <h3 id="combine-css-or-inline-css">Combine css or inline css</h3>

        <p>
          One effective way is to directly place the CSS in a{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'style'}</code> tag in
          the document header if the CSS is not too large. This method improves{' '}
          <strong>performance</strong> very well as it only needs to be displayed as soon as the{' '}
          <strong>DOM</strong> is loaded.
        </p>

        <p>
          Or you can limit the loading of too many CSS files. Usually when coding, developers tend
          to separate different CSS files by component, module, etc. for easy management. However,
          loading many CSS files takes longer than loading only one file.
        </p>

        <p>
          !<Link href="/static/images/inline-css.png">inline-css</Link>
        </p>

        <div className="pt-2 text-center italic">
          <small>One of the techniques to help Gatsby site load extremely fast is Inline CSS</small>
        </div>

        <h2 id="performance-api">Performance API</h2>

        <p>
          Now let's measure <strong>page rendering time</strong> after applying some techniques to
          avoid <strong>Render Blocking CSS</strong> using the{' '}
          <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Performance">
            Chrome Perfomance API
          </Link>
          .
        </p>

        <p>
          I have provided a simple example to help you understand{' '}
          <strong>Render Blocking CSS</strong> here:{' '}
          <Link href="https://hta218.github.io/render-blocking-css-example/">
            https://hta218.github.io/render-blocking-css-example/
          </Link>
        </p>

        <p>
          In the example, I loaded two CSS files and compared the{' '}
          <strong>page rendering time</strong> on screens with <strong>device-width</strong> larger
          and smaller than{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'800px'}</code>.
        </p>

        <Pre>
          <code className="language-html showLineNumbers">
            {
              '<link rel="stylesheet" href="tailwind.css" media="(min-width: 800px)" />\n<link rel="stylesheet" href="bootstrap.css" media="(min-width: 800px)" />'
            }
          </code>
        </Pre>

        <p>
          To use the <strong>Performance API</strong>, it is important to check{' '}
          <strong>browser compatibility</strong>.
        </p>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              "if ('PerformanceObserver' in window) {\n  try {\n    // Create PerformanceObserver instance\n    let perfObsever = new PerformanceObserver((perf) => {\n      let perfEntries = perf.getEntriesByType('paint')\n      perfEntries.forEach(({ name, startTime }) => {\n        // Get the result inside this callback\n        console.log(`The time to ${name} was ${startTime} milliseconds.`)\n      })\n    })\n\n    // observe \"paint\" event\n    perfObsever.observe({ entryTypes: ['paint'] })\n  } catch (err) {\n    console.error(err)\n  }\n} else {\n  // Remember to check the browser compatibility before using this API\n  console.log(\"Performance API isn't supported!\")\n}"
            }
          </code>
        </Pre>

        <p>
          There are many different{' '}
          <Link href="https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry">
            Performance metric
          </Link>
          , and in this case, I used{' '}
          <Link href="https://developer.mozilla.org/en-US/docs/Web/API/PerformancePaintTiming">
            PerformancePaintTiming
          </Link>
          .
        </p>

        <p>
          To see the results more clearly, you can open <strong>Chrome DevTools</strong>, throttle
          the internet, and CPU speed to simulate the conditions of the user's device.
        </p>

        <p>
          For screens{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'>800px'}</code>{' '}
          (loading all CSS before the first page render),
        </p>

        <p>
          !<Link href="/static/images/css-block-render.png">css-block-render</Link>
        </p>

        <p>
          We need more than <strong>6 seconds</strong> for the <strong>first paint</strong> (after
          all CSS is loaded) - which is equivalent to the user waiting 6 seconds to see the content
          of the page.
        </p>

        <p>
          For the case where only one CSS file is needed for the first paint (the remaining files
          are still loaded but not used or needed for the first render)
        </p>

        <p>
          !<Link href="/static/images/css-not-block-render.png">css-not-block-render</Link>
        </p>

        <p>
          The user sees the content <strong>2 seconds</strong> earlier and can see the page
          rendering even when the other 2 CSS files have not finished loading.
        </p>

        <p>
          The results measured with <strong>Performance API</strong> are summarized below.
        </p>

        <p>
          !<Link href="/static/images/render-result.png">render-result</Link>
        </p>

        <p>
          Alternatively, you can use the{' '}
          <Link href="https://developer.mozilla.org/en-US/docs/Web/API/PerformancePaintTiming">
            PerformancePaintTiming API
          </Link>{' '}
          directly.
        </p>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              "if (window.performance) {\n\tlet performance = window.performance;\n\tlet perfEntries = performance.getEntriesByType('paint');\n\n\tperfEntries.forEach({ name, startTime } => {\n\t\tconsole.log(`The time to ${name} was ${startTime} milliseconds.`);\n\t});\n} else {\n\tconsole.log(\"Performance timing isn't supported.\");\n}"
            }
          </code>
        </Pre>

        <h2 id="conclusion">Conclusion</h2>

        <p>
          We can clearly see the significant difference in page rendering time, which directly
          affects the user experience when the webpage has to load too much unnecessary CSS.
          Therefore, we need to be very careful about this resource.
        </p>

        <p>
          There are many ways to avoid <strong>Render Blocking CSS</strong>, such as using{' '}
          <strong>media types</strong> or <strong>media queries</strong>,{' '}
          <strong>combining CSS</strong>, and <strong>inline CSS</strong>. These changes may seem
          small, but they have a significant impact on performance.
        </p>

        <h2 id="refs">Refs</h2>

        <ul>
          <li>
            <Link href="https://web.dev/render-blocking-resources/">
              Eliminate render-blocking resources
            </Link>
          </li>
          <li>
            <Link href="https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css">
              Render Blocking CSS
            </Link>
          </li>
          <li>
            <Link href="https://varvy.com/pagespeed/render-blocking-css.html">
              https://varvy.com/pagespeed/render-blocking-css.html
            </Link>
          </li>
          <li>
            <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Performance">
              Chrome Performance API
            </Link>
            ,{' '}
            <Link href="https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver/PerformanceObserver">
              PerformanceObserver
            </Link>
            ,{' '}
            <Link href="https://developer.mozilla.org/en-US/docs/Web/API/PerformancePaintTiming">
              PerformancePaintTiming
            </Link>
          </li>
        </ul>
      </PostLayout>
    </>
  )
}
