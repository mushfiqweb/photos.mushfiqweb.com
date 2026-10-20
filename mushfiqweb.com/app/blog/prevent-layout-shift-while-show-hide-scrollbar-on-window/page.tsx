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
    (p) => p.slug === 'prevent-layout-shift-while-show-hide-scrollbar-on-window'
  )!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find(
    (p) => p.slug === 'prevent-layout-shift-while-show-hide-scrollbar-on-window'
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
        <p>When will the scrollbar toggle? For example:</p>

        <ul>
          <li>
            Open a{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'Modal'}</code>,{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'Popup'}</code>, or{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'Drawer'}</code>{' '}
            with a lot of content and prevent the user from scrolling the{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'Window'}</code>.
          </li>
          <li>
            Toggle an{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'Accordion'}</code>{' '}
            or a <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'Tab'}</code>{' '}
            which expands the document height that leads to shows up the scrollbar.
          </li>
          <li>...</li>
        </ul>

        <p>
          On <strong>Window</strong> devices, these cases will cause the layout shift. This is
          because the scrollbar is added to the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'Window'}</code> which
          makes the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'Window'}</code>'s
          width smaller. This experience is not good for the user.
        </p>

        <p>So let's prevent this layout shift with CSS.</p>

        <h2 id="the-classic-fix">The classic fix</h2>

        <CodeTitle lang="css" title="global.css showLineNumbers" />
        <Pre>
          <code className="language-css">{'html {\n  overflow-y: scroll;\n}'}</code>
        </Pre>

        <p>
          The classic fix is to add the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'overflow-y: scroll'}
          </code>{' '}
          to the <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'html'}</code>{' '}
          element. This will always show the scrollbar on the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'Window'}</code> (even
          if the content's height is smaller than the viewport's height).
        </p>

        <p>
          The scrollbar in this case will always be visible. And its background turns to gray (if
          the <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'Window'}</code>{' '}
          isn't scrollable).
        </p>

        <p>
          And of course, I don't recommend this solution{' '}
          <Twemoji emoji="grinning-face-with-sweat" /> cause I think it looks bad as the original
          problem.
        </p>

        <h2 id="using-view-width">Using view width</h2>

        <p>
          A better solution is to add an invisible{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'margin-left'}</code>{' '}
          to the <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'html'}</code>{' '}
          element with the same width as the scrollbar. This{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'margin-left'}</code>{' '}
          will be visible when the scrollbar is added to the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'Window'}</code> and
          invisible when the scrollbar is removed from the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'Window'}</code>.
        </p>

        <p>
          But how to get the scrollbar's width <Twemoji emoji="thinking-face" />?
        </p>

        <p>
          The answer is to use the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'vw'}</code> unit.
        </p>

        <p>
          If you don't know yet,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'vw'}</code> or{' '}
          <Link href="https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#relative_length_units">
            view width
          </Link>{' '}
          is a <strong>CSS</strong> unit just like{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'px'}</code>,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'%'}</code>, or{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'rem'}</code> but it's
          relative to the viewport's width.
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'100vw'}</code> is
          equivalent to{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'100%'}</code> of the
          viewport's width (including the scrollbar), and{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'100%'}</code> width
          (for the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'html'}</code>{' '}
          element) is equivalent to 100% of the viewport's width (without the scrollbar){' '}
          <Twemoji emoji="exploding-head" />
        </p>

        <p>
          So, we can calculate the width of the scrollbar by subtracting the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'100%'}</code> width
          from the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'100vw'}</code> width
          with the CSS's{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'calc()'}</code>{' '}
          function like this:
        </p>

        <CodeTitle lang="css" title="global.css showLineNumbers" />
        <Pre>
          <code className="language-css">{'html {\n  margin-left: calc(100vw - 100%);\n}'}</code>
        </Pre>

        <p>
          The{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'margin-left'}</code>{' '}
          value will equal{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'0'}</code> when the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'Window'}</code> isn't
          scrollable and equal to the scrollbar's width when the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'Window'}</code> is
          scrollable.
        </p>

        <blockquote>
          <p>
            [!NOTE] If you use this way to prevent layout shift and your application has a{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'fixed'}</code>'s
            element (like a <strong>Popup</strong> or a <strong>Modal</strong>) which prevents
            Window scroll with the{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'overflow-y: hidden'}
            </code>{' '}
            style when it's open, then you should also add the{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'margin-left'}
            </code>{' '}
            to the{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'fixed'}</code>{' '}
            element as well.
          </p>
        </blockquote>

        <p>For example:</p>

        <CodeTitle lang="css" title="global.css showLineNumbers" />
        <Pre>
          <code className="language-css">
            {'html,\n.popup-overlay,\n.modal-overlay {\n  margin-left: calc(100vw - 100%);\n}'}
          </code>
        </Pre>

        <p>
          Another solution is to set the width of the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'html'}</code> element
          to <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'100vw'}</code> and
          prevent horizontal scroll:
        </p>

        <CodeTitle lang="css" title="global.css showLineNumbers" />
        <Pre>
          <code className="language-css">
            {'html {\n  width: 100vw;\n  overflow-x: hidden;\n}'}
          </code>
        </Pre>

        <p>
          This solution only makes sense if your application doesn't have to scroll horizontally
          (like a blog or a documentation website). And I'm using this in my blog, you can open the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'devtool'}</code> and
          check the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'html'}</code> styles
          to see it <Twemoji emoji="beaming-face-with-smiling-eyes" />.
        </p>

        <h2 id="the-no-code-way-">
          The no-code way <Twemoji emoji="star-struck" size="base" />
        </h2>

        <p>There are 2 ways to prevent layout shift without writing any CSS code:</p>

        <ul>
          <li>
            The first one is to tell your users not to use <strong>Window</strong> device and to use
            a <strong>Mac</strong> or a <strong>Linux</strong> device instead{' '}
            <Twemoji emoji="grinning-squinting-face" />
          </li>
        </ul>

        <ul>
          <li>
            The second one is to just... leave it as it is, sometimes it's not a big deal, and your
            user doesn't actually care about that <Twemoji emoji="man-shrugging" />
          </li>
        </ul>

        <p>If you have any other solutions, please let me know in the comments below.</p>

        <p>
          Happy styling <Twemoji emoji="clinking-beer-mugs" />
        </p>
      </PostLayout>
    </>
  )
}
