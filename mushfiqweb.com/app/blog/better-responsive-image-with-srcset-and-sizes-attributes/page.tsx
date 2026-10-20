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
    (p) => p.slug === 'better-responsive-image-with-srcset-and-sizes-attributes'
  )!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find(
    (p) => p.slug === 'better-responsive-image-with-srcset-and-sizes-attributes'
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
        <h2 id="introduction">Introduction</h2>

        <p>
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'srcset'}</code> and{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'sizes'}</code> are
          two HTML attributes that can be used to create responsive images. They are used to specify
          the image source and the size of the image. They are used together to create images that
          are optimized for the device they are being displayed on.
        </p>

        <p>
          In this article, I will not be going into the details of how responsive images work. I
          will be focusing on how to use the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'srcset'}</code> and{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'sizes'}</code>{' '}
          attributes.
        </p>

        <p>
          Let's take a look at the basic{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'img'}</code> element:
        </p>

        <Pre>
          <code className="language-html">{'<img src="image.jpg" alt="image" />'}</code>
        </Pre>

        <p>
          The <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'src'}</code>{' '}
          attribute is used to specify the image source. Web browsers will download the image and
          display it in all devices with the same size no matter what the device's screen size,
          pixel density, or viewport size is.
        </p>

        <p>
          So if you have a{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'2000px'}</code> wide
          image, it will be displayed as a{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'2000px'}</code> wide
          image on a 4K monitor - which is fine, but it will also be downloaded and displayed as a{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'2000px'}</code> wide
          image on a{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'320px'}</code> wide
          mobile phone screen - of course, it will fit the screen, but it's unnecessarily large and
          will take a long time to download.
        </p>

        <p>
          That's where the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'srcset'}</code> and{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'sizes'}</code>{' '}
          attributes come in. We will use them to provide different image sources/sizes for
          different devices and let the browser decide which image to download and display.
        </p>

        <Pre>
          <code className="language-html showLineNumbers">
            {
              '<img\n  src="image.jpg"\n  srcset="image-320.jpg 320w, image-640.jpg 640w, image-1280.jpg 1280w"\n  sizes="(max-width: 320px) 280px, (max-width: 640px) 640px, 1280px"\n  alt="image"\n/>'
            }
          </code>
        </Pre>

        <p>
          The <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'srcset'}</code>{' '}
          and <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'sizes'}</code>{' '}
          values look a bit complicated (and easy to forget{' '}
          <Twemoji emoji="face-with-rolling-eyes" />
          ), but they are not that hard to understand.
        </p>

        <h2 id="srcset">srcset</h2>

        <p>
          The <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'srcset'}</code>{' '}
          attribute is used to specify the image sources and their sizes. The image sources are
          separated by <strong>commas</strong>, and each image source is followed by its size in
          pixels with the following parts:
        </p>

        <ol>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'image-source'}
            </code>{' '}
            - the image's URL (e.g.{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'image-320.jpg'}
            </code>
            )
          </li>
          <li>
            A <strong>space</strong>
          </li>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'image-size'}</code>{' '}
            - the image's <strong>intrinsic size</strong> in pixels (e.g.{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'320w'}</code>) -
            notice the{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'w'}</code> at the
            end of the size instead of{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'px'}</code> to
            indicate that the size is in pixels.
          </li>
        </ol>

        <p>
          In the example above, we have three image sources:{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'image-320.jpg'}
          </code>
          ,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'image-640.jpg'}
          </code>
          , and{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'image-1280.jpg'}
          </code>
          .
        </p>

        <ul>
          <li>
            The first image source is{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'image-320.jpg'}
            </code>{' '}
            and it's{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'320px'}</code>{' '}
            wide.
          </li>
          <li>
            The second image source is{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'image-640.jpg'}
            </code>{' '}
            and it's{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'640px'}</code>{' '}
            wide.
          </li>
          <li>
            The third image source is{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'image-1280.jpg'}
            </code>{' '}
            and it's{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'1280px'}</code>{' '}
            wide.
          </li>
        </ul>

        <p>
          So now we have a set of images with different sizes, but how do we tell the browser which
          image to use <Twemoji emoji="thinking-face" />?
        </p>

        <p>
          Here comes the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'sizes'}</code>{' '}
          attribute.
        </p>

        <h2 id="sizes">sizes</h2>

        <p>
          The <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'sizes'}</code>{' '}
          attribute defines a set of media conditions and help the browser decide which image to use
          when the conditions are met.
        </p>

        <p>
          Each size is separated by <strong>commas</strong>, and being constructed with the
          following parts:
        </p>

        <ol>
          <li>
            A <strong>media condition</strong> - a set of media features and values that define the
            condition (e.g.{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'(max-width: 320px)'}
            </code>
            ).
          </li>
        </ol>

        <p>
          Notice that the condition is wrapped in parentheses, like a css media query. In this case,
          the condition is that the viewport's width is _less than or equal to{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'320px'}</code>_.
        </p>

        <ol>
          <li>
            A <strong>space</strong>
          </li>
          <li>
            A <strong>size</strong> - the size of the image to use when the condition is met (e.g.{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'280px'}</code>).
          </li>
        </ol>

        <p>And here are the steps of how the browser decides which image to use:</p>

        <ol>
          <li>Looks at the device's screen size.</li>
          <li>
            Looks at the{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'sizes'}</code>{' '}
            attribute and finds the first condition that matches the device's screen size.
          </li>
          <li>
            Uses the size defined in the condition to find the image source with the same size in
            the <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'srcset'}</code>{' '}
            attribute, if there isn't one, it will use the first image that is larger than the size
            defined in the condition.
          </li>
          <li>Load the image and display it.</li>
        </ol>

        <p>
          And that's it, we have created a responsive image <Twemoji emoji="partying-face" />.
        </p>

        <p>
          Take a look at the example above, let's say we are on a mobile phone with a screen size of{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'400px'}</code> wide.
        </p>

        <ul>
          <li>
            The first condition match that screen is{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'(max-width: 640px)'}
            </code>
            .
          </li>
          <li>
            The size defined in the condition is{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'640px'}</code>.
          </li>
          <li>
            The image source with the same size in the{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'srcset'}</code>{' '}
            attribute is{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'image-640.jpg'}
            </code>
            .
          </li>
          <li>The browser will load the image and display it.</li>
        </ul>

        <h2 id="beyond-the-basics">Beyond the basics</h2>

        <ul>
          <li>
            For the{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'sizes'}</code>{' '}
            attribute, you can use{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'vw'}</code> instead
            of <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'px'}</code> to
            define the size.
          </li>
        </ul>

        <p>
          This is useful when you want to use the viewport width as the size. For example, if you
          want to use the viewport width as the size, you can use{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'100vw'}</code> as the
          size.
        </p>

        <ul>
          <li>
            Combine{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'srcset'}</code>{' '}
            &amp;{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'sizes'}</code> with{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'loading="lazy"'}
            </code>{' '}
            to improve performance.
          </li>
        </ul>

        <p>
          When the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'loading'}</code>{' '}
          attribute is set to{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'lazy'}</code>, the
          browser will not load the image until it is visible in the viewport. This is useful when
          you have a lot of images on the page and you want to improve the page's performance.
        </p>

        <ul>
          <li>
            Better add{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'width'}</code> and{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'height'}</code>{' '}
            attributes to the{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'img'}</code>{' '}
            element.
          </li>
        </ul>

        <p>
          When the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'width'}</code> and{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'height'}</code>{' '}
          attributes are added to the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'img'}</code> element,
          the browser will reserve the space for the image before it is loaded. This is useful to
          prevent layout shifts and improve the experience to your visitors.
        </p>

        <ul>
          <li>
            And don't forget to add a fallback image with the{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'src'}</code>{' '}
            attribute.
          </li>
        </ul>

        <p>
          When the browser doesn't support the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'srcset'}</code> and{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'sizes'}</code>{' '}
          attributes, it will use the image source defined in the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'src'}</code>{' '}
          attribute.
        </p>

        <p>
          At the end, the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'img'}</code> element
          should look like this:
        </p>

        <Pre>
          <code className="language-html showLineNumbers">
            {
              '<img\n  src="image.jpg"\n  srcset="image-320.jpg 320w, image-640.jpg 640w, image-1280.jpg 1280w"\n  sizes="(max-width: 320px) 280px, (max-width: 640px) 640px, 1280px"\n  loading="lazy"\n  alt="image alt text"\n  width="1280"\n  height="720"\n/>'
            }
          </code>
        </Pre>

        <p>
          Happy coding <Twemoji emoji="clinking-beer-mugs" />.
        </p>
      </PostLayout>
    </>
  )
}
