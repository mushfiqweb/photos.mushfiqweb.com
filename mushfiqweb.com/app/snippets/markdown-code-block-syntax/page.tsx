import { PostLayout } from '~/layouts/post-layout'
import { Twemoji } from '~/components/ui/twemoji'
import { Image } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import { Pre } from '~/components/mdx/pre'
import { CodeTitle } from '~/components/mdx/code-title'
import { TableWrapper } from '~/components/mdx/table-wrapper'
import { Callout } from '~/components/mdx/callout'
import { CodeBlock } from '~/components/mdx/code-block'
import { allSnippets } from '~/data/snippet-registry'
import { allAuthors } from '~/data/author-registry'
import { genPostMetadata } from '~/utils/metadata'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const snippet = allSnippets.find((p) => p.slug === 'markdown-code-block-syntax')!
  return genPostMetadata(snippet)
}

export default function Page() {
  const snippet = allSnippets.find((p) => p.slug === 'markdown-code-block-syntax')!

  const authorList = snippet.authors || ['default']
  const authorDetails = authorList.map((authorSlug) => {
    return allAuthors.find((p) => p.slug === authorSlug)!
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CodeSnippet',
    headline: snippet.title,
    datePublished: snippet.date,
    dateModified: snippet.lastmod || snippet.date,
    description: snippet.summary,
    image: snippet.images ? snippet.images[0] : '/static/images/logo.jpg',
    url: `https://www.mushfiqweb.com/snippets/${snippet.slug}`,
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
      <PostLayout content={snippet} authorDetails={authorDetails}>
        <h2 id="basic-syntax">Basic syntax</h2>

        <p>Use triple backticks to create a code block in markdown</p>

        <Pre>
          <code className="language-">{'```language\nyour code goes here\n```'}</code>
        </Pre>

        <p>Example</p>

        <Pre>
          <code className="language-">
            {
              '```js\nfunction debounce(func, timeout = 300) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => { func.apply(this, args); }, timeout);\n  };\n}\n```'
            }
          </code>
        </Pre>

        <p>will appear as:</p>

        <Pre>
          <code className="language-js">
            {
              'function debounce(func, timeout = 300) {\n  let timer\n  return (...args) => {\n    clearTimeout(timer)\n    timer = setTimeout(() => {\n      func.apply(this, args)\n    }, timeout)\n  }\n}'
            }
          </code>
        </Pre>

        <h2 id="filename">Filename</h2>

        <p>
          Add{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {':filename.ext'}
          </code>{' '}
          after{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'language'}</code> to
          render with filename label on the top of block
        </p>

        <p>Example:</p>

        <Pre>
          <code className="language-">
            {
              '```java:GetRowValue.java\nprivate String[] getRowValue(Integer i, List<BillDetail> billDetail) {\n  String[] rowValue = new String[5];\n  rowValue[0] = (i).toString();\n  i = i - 1;\n\n  rowValue[1] = billDetail.get(i).getTenSanPham();\n  rowValue[2] = billDetail.get(i).getSoLuong().toString();\n  rowValue[3] = new DecimalFormat("#,###").format(Integer.parseInt(billDetail.get(i).getDonGiaSanPham()));\n  rowValue[4] = new DecimalFormat("#,###").format(billDetail.get(i).getThanhTien());\n  return rowValue;\n}\n```'
            }
          </code>
        </Pre>

        <p>will appear as:</p>

        <CodeTitle lang="java" title="GetRowValue.java" />
        <Pre>
          <code className="language-java">
            {
              'private String[] getRowValue(Integer i, List<BillDetail> billDetail) {\n  String[] rowValue = new String[5];\n  rowValue[0] = (i).toString();\n  i = i - 1;\n\n  rowValue[1] = billDetail.get(i).getProductName();\n  rowValue[2] = billDetail.get(i).getQuantity().toString();\n  rowValue[3] = new DecimalFormat("#,###").format(Integer.parseInt(billDetail.get(i).getProductPrice()));\n  rowValue[4] = new DecimalFormat("#,###").format(billDetail.get(i).getSubTotal());\n\n  return rowValue;\n}'
            }
          </code>
        </Pre>

        <h2 id="line-highlighting-and-line-numbers">Line highlighting and line-numbers</h2>

        <ul>
          <li>
            Add{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'{numbers}'}</code>{' '}
            property after{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'language'}</code>{' '}
            to highlight line
          </li>
          <li>
            Add{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'showLineNumbers'}
            </code>{' '}
            property after{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'language'}</code>{' '}
            to render with line numbers
          </li>
        </ul>

        <p>Example:</p>

        <Pre>
          <code className="language-">
            {
              '```html:index.html {1,4-6,10} showLineNumbers\n<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <meta http-equiv="X-UA-Compatible" content="ie=edge">\n    <title>Hello world</title>\n  </head>\n  <body>\n    <h1>Hello world</h1>\n  </body>\n</html>\n```'
            }
          </code>
        </Pre>

        <p>will appear as:</p>

        <CodeTitle lang="html" title="index.html {1,4-6,10} showLineNumbers" />
        <Pre>
          <code className="language-html">
            {
              '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <meta http-equiv="X-UA-Compatible" content="ie=edge" />\n    <title>Hello world</title>\n  </head>\n  <body>\n    <h1>Hello world</h1>\n  </body>\n</html>'
            }
          </code>
        </Pre>
      </PostLayout>
    </>
  )
}
