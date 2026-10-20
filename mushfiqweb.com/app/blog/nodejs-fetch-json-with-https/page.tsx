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
  const post = allBlogs.find((p) => p.slug === 'nodejs-fetch-json-with-https')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'nodejs-fetch-json-with-https')!

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
          When working with Node.js, there are many libraries that support creating requests to
          another server, such as{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'node-fetch'}</code>,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'phin'}</code>,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'got'}</code> or{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'request'}</code>{' '}
          (deprecated)...
        </p>

        <p>
          However, if your <strong>server</strong> simply serves as an API for a client app and you
          now need to{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'request'}</code> a{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'JSON'}</code> file
          from another server or simply fetch an external API, which library should you choose to
          use? <Twemoji emoji="thinking-face" />
        </p>

        <p>
          The answer is that you don't need to add a new dependency to your{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'package.json'}</code>{' '}
          just for creating a request because Node.js has a built-in module called{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'https'}</code>.
        </p>

        <h2 id="https">HTTPS</h2>

        <p>
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'https'}</code> is a
          lightweight module that comes pre-built in Node.js and is supported in most Node.js
          versions.
        </p>

        <p>
          You can create a{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'request'}</code>{' '}
          using <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'https'}</code>{' '}
          as follows:
        </p>

        <CodeTitle lang="js" title="server.ts {8,11} showLineNumbers" />
        <Pre>
          <code className="language-js">
            {
              "let https = require('https')\n\nhttps\n  .get(url, (res) => {\n    let body = ''\n    res.on('data', (chunk) => (body += chunk))\n    res.on('end', () => {\n      try {\n        let json = JSON.parse(body)\n        // Now you can use json data...\n      } catch (err) {\n        console.error(`Failed to parse JSON data - ${err.toString()}`)\n      }\n    })\n  })\n  .on('error', (err) => {\n    console.error(`Failed to make request! Error: ${err.toString()}`)\n  })"
            }
          </code>
        </Pre>

        <p>In the code above:</p>

        <ul>
          <li>
            <strong>https</strong> is a built-in module in Node.js so you can{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'require'}</code> it
            directly without the need for installation.
          </li>
          <li>
            You can create a <strong>request</strong> using{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'https.get(url[, options][, callback])'}
            </code>
            .
          </li>
          <li>
            In the <strong>callback</strong>, you listen to the response events using{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'res.on()'}</code>.
          </li>
          <li>
            Each time{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'res.on("data")'}
            </code>{' '}
            is triggered, you add the{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'data'}</code> to
            the string{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'body'}</code>.
          </li>
          <li>
            When{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'res.on("end")'}
            </code>{' '}
            is triggered, you can simply parse the body into a JSON object using{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'JSON.parse(body)'}
            </code>
            .
          </li>
          <li>
            Lines <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'8'}</code>{' '}
            and <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'11'}</code>:
            Note that you should parse the data within a{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'try {} catch() {}'}
            </code>{' '}
            block to catch errors if the JSON cannot be parsed.
          </li>
          <li>
            If the <strong>request</strong> fails, the{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'error'}</code>{' '}
            event will be triggered.
          </li>
        </ul>

        <p>
          That's it! Now let's abstract this logic into a function that can be used anywhere in the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'server'}</code>:
        </p>

        <CodeTitle lang="js" title="fetch-json.js showLineNumbers" />
        <Pre>
          <code className="language-js">
            {
              "let https = require('https')\n\nlet fetchJSON = (url) => {\n  return new Promise((resolve, reject) => {\n    https\n      .get(url, (res) => {\n        let body = ''\n        res.on('data', (chunk) => (body += chunk))\n        res.on('end', () => {\n          try {\n            resolve(JSON.parse(body))\n          } catch (err) {\n            reject(err)\n          }\n        })\n      })\n      .on('error', reject)\n  })\n}\n\nmodule.exports = fetchJSON"
            }
          </code>
        </Pre>

        <p>And you can use it as follows:</p>

        <CodeTitle lang="js" title="index.js showLineNumbers" />
        <Pre>
          <code className="language-js">
            {'// Async context\nlet data = await fetchJSON(url)\n\n// Use the data...'}
          </code>
        </Pre>

        <p>
          Good luck! <Twemoji emoji="party-popper" />
        </p>
      </PostLayout>
    </>
  )
}
