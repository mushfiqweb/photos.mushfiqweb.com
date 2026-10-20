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
  const snippet = allSnippets.find((p) => p.slug === 'fetch-goodreads-user-books-data')!
  return genPostMetadata(snippet)
}

export default function Page() {
  const snippet = allSnippets.find((p) => p.slug === 'fetch-goodreads-user-books-data')!

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
        <p>
          Since Goodreads no longer supports fetching user's books data via their{' '}
          <Link href="https://www.goodreads.com/api">API</Link>, I've decided to scrape user's book
          data using the RSS feed and parse it in Node.js.
        </p>

        <p>
          !<Link href="/static/images/goodreads-api.png">Goodreads API</Link>
        </p>

        <p>
          The idea here is to use the{' '}
          <Link href="https://www.npmjs.com/package/rss-parser">
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'rss-parser'}</code>
          </Link>{' '}
          package to parse the RSS feed and extract the book data.
        </p>

        <CodeTitle lang="ts" title="goodreads.ts showLineNumbers" />
        <Pre>
          <code className="language-ts">
            {
              "import Parser from 'rss-parser'\nimport type { GoodreadsBook } from '~/types'\n\nlet parser = new Parser<{ [key: string]: any }, GoodreadsBook>({\n  customFields: {\n    // Define all the custom fields you want to extract from the RSS feed\n    // Here I'm listing all the available fields from the Goodreads RSS feed\n    item: [\n      'guid',\n      'pubDate',\n      'title',\n      'link',\n      'book_id',\n      'book_image_url',\n      'book_small_image_url',\n      'book_medium_image_url',\n      'book_large_image_url',\n      'book_description',\n      'author_name',\n      'isbn',\n      'user_name',\n      'user_rating',\n      'user_read_at',\n      'user_date_added',\n      'user_date_created',\n      'user_shelves',\n      'user_review',\n      'average_rating',\n      'book_published',\n    ],\n  },\n})"
            }
          </code>
        </Pre>

        <p>
          Then you can fetch the data from the RSS feed using the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'parser'}</code>{' '}
          object, and process it as needed.
        </p>

        <CodeTitle lang="ts" title="goodreads.ts showLineNumbers" />
        <Pre>
          <code className="language-ts">
            {
              "const GOODREADS_RSS_FEED_URL = '<YOUR_GOODREADS_RSS_FEED_URL>'\n\nexport async function fetchGoodreadsBooks() {\n  if (GOODREADS_RSS_FEED_URL) {\n    try {\n      let data = await parser.parseURL(GOODREADS_RSS_FEED_URL)\n      // All the books data will be stored in the `data.items` array\n      // Use the parsed data as needed, for example, you can write it to a JSON file:\n      writeFileSync(`./json/books.json`, JSON.stringify(data.items))\n    } catch (error) {\n      console.error(`Error fetching the Goodreads RSS feed: ${error.message}`)\n    }\n  } else {\n    console.log('📚 No Goodreads RSS feed found.')\n  }\n}"
            }
          </code>
        </Pre>

        <blockquote>
          <p>
            [!NOTE] You can get a Goodreads user's RSS feed URL by going to their profile and
            navigating to the bookshelf page and copy the RSS feed URL. This is my bookshelf page
            for example: https://www.goodreads.com/review/list/179720035
          </p>
        </blockquote>

        <p>
          Now that you have the data you might need to prettify them before storing or using in your
          application since the data is stored in a raw format.
        </p>

        <CodeTitle lang="ts" title="types.ts showLineNumbers" />
        <Pre>
          <code className="language-ts">
            {
              "let data = await parser.parseURL(/* GOODREADS_RSS_FEED_URL */)\n// Loop through the `data.items` array to prettify the data\nfor (let book of data.items) {\n  book.content = book.content.replace(/\\n/g, '').replace(/\\s\\s+/g, ' ') // Remove line breaks\n  book.book_description = book.book_description\n    .replace(/<[^>]*(>|$)/g, '') // Remove HTML tags\n    .replace(/\\s\\s+/g, ' ') // Replace multiple spaces with a single space\n    .replace(/^[\"|“]|[\"|“]$/g, '') // Remove leading and trailing quotation marks\n    .replace(/\\.([a-zA-Z0-9])/g, '. $1') // Add a space after a period\n}\n// Use the parsed and prettified data as needed..."
            }
          </code>
        </Pre>

        <p>
          The{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'GoodreadsBook'}
          </code>{' '}
          type is defined here:
        </p>

        <CodeTitle lang="ts" title="types.ts showLineNumbers" />
        <Pre>
          <code className="language-ts">
            {
              'export type GoodreadsBook = {\n  guid: string\n  pubDate: string\n  title: string\n  link: string\n  book_id: string\n  book_image_url: string\n  book_small_image_url: string\n  book_medium_image_url: string\n  book_large_image_url: string\n  book_description: string\n  author_name: string\n  isbn: string\n  user_name: string\n  user_rating: string\n  user_read_at: string\n  user_date_added: string\n  user_date_created: string\n  user_shelves: string\n  user_review: string\n  average_rating: number\n  book_published: string\n  content: string\n}'
            }
          </code>
        </Pre>

        <h3 id="caveat">Caveat</h3>

        <p>
          The Goodreads RSS feed is not updated instantly if you update your books on Goodreads. You
          might need to wait for a few hours before you can fetch the latest data.
        </p>

        <p>
          Happy scraping! <Twemoji emoji="clinking-beer-mugs" />
        </p>
      </PostLayout>
    </>
  )
}
