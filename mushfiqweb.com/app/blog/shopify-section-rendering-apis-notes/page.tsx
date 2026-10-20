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
  const post = allBlogs.find((p) => p.slug === 'shopify-section-rendering-apis-notes')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'shopify-section-rendering-apis-notes')!

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
          <strong>Section Rendering APIs</strong> is a powerful <strong>AJAX API</strong> from
          Shopify that can be used on the storefront to request <strong>HTML</strong> for any
          section of your choosing. The biggest advantage of this API is that it allows you to
          update page content without having to reload the page.
        </p>

        <p>For example, you can use it to:</p>

        <ul>
          <li>Update the cart drawer</li>
          <li>Update collection filters (pagination, infinite loading...)</li>
          <li>Request multiple sections</li>
        </ul>

        <h2 id="request-multiple-sections">Request multiple sections</h2>

        <p>
          To request the markup of multiple sections, we will fetch a request with the URL of the
          current storefront and add the parameter{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'?sections={sectionIds}'}
          </code>
          .
        </p>

        <p>
          Here,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'sectionIds'}</code>{' '}
          are the <strong>filenames</strong> of the sections in your <strong>theme</strong>,
          separated by commas.
        </p>

        <p>For example:</p>

        <Pre>
          <code className="language-js">{"fetch('/?sections=header,footer')"}</code>
        </Pre>

        <p>The result will look like this:</p>

        <Pre>
          <code className="language-json showLineNumbers">
            {
              '{\n  "header": "<div id=\\"shopify-section-header\\" className=\\"shopify-section\\">\\n<!-- section content -->\\n</div>",\n  "footer": "<div id=\\"shopify-section-footer\\" className=\\"shopify-section\\">\\n<!-- section content -->\\n</div>"\n}'
            }
          </code>
        </Pre>

        <p>
          You can combine this with the <strong>AJAX Cart APIs</strong> by adding the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'sections'}</code>{' '}
          parameter to the request body:
        </p>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              'items: [\n  {\n   id: 36110175633573,\n   quantity: 2\n  }\n],\nsections: "cart-items,cart-header,cart-footer"'
            }
          </code>
        </Pre>

        <p>
          The endpoints of the <strong>AJAX Cart APIs</strong> that can be combined with the query
          sections are:
        </p>

        <ul>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'/cart/add'}</code>
          </li>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'/cart/change'}
            </code>
          </li>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'/cart/clear'}
            </code>
          </li>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'/cart/update'}
            </code>
          </li>
        </ul>

        <h2 id="request-1-section">Request 1 section</h2>

        <p>
          To request only one section, we can use the API for requesting multiple sections and pass
          one{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'sectionId'}</code>,
          and the result will be a <strong>JSON</strong> object.
        </p>

        <p>
          An alternative way is to use the parameter{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'?section_id={sectionId}'}
          </code>{' '}
          to request only one section, and the result will be the markup text of that section.
        </p>

        <p>
          Here,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'sectionId'}</code> is
          the filename of the section.
        </p>

        <h2 id="tips">Tips</h2>

        <h4 id="-static-vs-dynamic-section">
          <Twemoji emoji="keycap-1" /> Static vs dynamic section
        </h4>

        <p>
          To request a <strong>static</strong> section (a section that has no settings schema,
          content will always be fixed unless we change the source code of that section), the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'sectionId'}</code>{' '}
          that needs to be passed is the <strong>filename</strong> of that section.
        </p>

        <p>
          However, with <strong>dynamic</strong> sections (sections that have{' '}
          <strong>settings schema</strong>), if we use the <strong>filename</strong> as the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'sectionId'}</code>,
          we will only request the markup corresponding to the <strong>default settings</strong> of
          that section, not the markup corresponding to the current settings.
        </p>

        <p>
          To request the markup of these <strong>dynamic</strong> sections, we need to use dynamic{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'sectionId'}</code>.
          In <strong>Liquid</strong>, it is{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'{{ section.id }}'}
          </code>
          .
        </p>

        <p>For example:</p>

        <CodeTitle lang="html" title="section-type.liquid showLineNumbers" />
        <Pre>
          <code className="language-html">
            {
              '<div data-section-id="{{ section.id }}" data-section-type="section-type">\n  <!-- section content -->\n</div>'
            }
          </code>
        </Pre>

        <p>
          The dynamic <strong>generated</strong> ID will look like this:{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'template--14908088647850__16322847419ca50f50'}
          </code>
        </p>

        <p>To request dynamic section markup:</p>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              "// Async context\nlet section = document.querySelector('[data-section-type=\"section-type\"]')\nlet id = section.dataset.id\n// Eg: template--14908088647850__16322847419ca50f50\n\nlet markup = await (await fetch(`?section_id=${id}}`)).text()\nconsole.log(markup)\n// Example markup: '<div id=\\\"template--14908088647850__16322847419ca50f50\\\">\\n<!-- section content -->\\n</div>''"
            }
          </code>
        </Pre>

        <h4 id="-including-product-context">
          <Twemoji emoji="keycap-2" /> Including product context
        </h4>

        <p>
          With the URL above, we can only query the markup of sections on the homepage corresponding
          to the respective settings. But what if we want to query the section of a{' '}
          <strong>product</strong> page or <strong>collection</strong> page (markup will not include
          information about that product or collection)?
        </p>

        <p>
          The most common example is querying 1 <strong>product card</strong> data from the{' '}
          <strong>product recommendations</strong> / <strong>recently viewed product</strong>{' '}
          section or querying <strong>collection filter</strong> data for{' '}
          <strong>AJAX loadmore</strong> or <strong>pagination</strong>.
        </p>

        <p>
          To add product/collection context, simply add to the query URL:{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'/products/product-handle'}
          </code>{' '}
          or{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'/collections/collection-handle'}
          </code>
        </p>

        <p>Example:</p>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              "// Async context\n\nlet collectionMarkup = await await fetch(\n  `/collections/fashion/xs?section_id=template--15128665981118__main`\n).text()\nconsole.log(collectionMarkup)\n// Example markup: '<div id=\\\"shopify-section-template--15128665981118__main\\\">\\n<!-- section content -->\\n</div>''\n\nlet productMarkup = await await fetch(\n  `/products/adidas-classic-backpack?section_id=product-json`\n).text()\nconsole.log(productMarkup)\n// Example markup: '<div id=\\\"shopify-section-template--15128665981118__main\\\">\\n<!-- section content -->\\n</div>''"
            }
          </code>
        </Pre>

        <h2 id="conclusion">Conclusion</h2>

        <p>
          Some of you may know an old way to <strong>AJAX query markup</strong> using{' '}
          <Link href="https://www.shopify.com/partners/blog/shopify-alternate-templates">
            alternate template
          </Link>
          .
        </p>

        <p>
          However, this method has a disadvantage of having to create multiple templates
          corresponding to the markup you want to render, and in the{' '}
          <strong>Theme Customization</strong> of <strong>Online Store 2.0</strong>, these templates
          will all appear (while the customer doesn't care - the theme will look quite messy).
        </p>

        <p>
          !<Link href="/static/images/alternate-template-os-2.png">alternate-template-os-2</Link>
        </p>

        <p>
          With the <strong>Section rendering API</strong>, customers will not need to care about
          those sections, the sections will be rendered with <strong>product/collection</strong>{' '}
          context or corresponding <strong>settings</strong> (just need to pass the correct{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'sectionId'}</code>).
        </p>

        <p>
          The above is the entire way to use <strong>Section Rendering APIs</strong> and tips that I
          have learned, hope it will be useful to you.
        </p>

        <p>
          Happy sharing <Twemoji emoji="clinking-beer-mugs" />
        </p>
      </PostLayout>
    </>
  )
}
