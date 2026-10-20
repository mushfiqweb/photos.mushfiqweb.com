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
  const snippet = allSnippets.find((p) => p.slug === 'verify-github-webhooks-requests')!
  return genPostMetadata(snippet)
}

export default function Page() {
  const snippet = allSnippets.find((p) => p.slug === 'verify-github-webhooks-requests')!

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
          Webhooks provide a way for apps to receive real-time information from{' '}
          <strong>Github</strong> whenever there is a new event. It is important to ensure that the
          webhook request is coming from Github and process it accordingly.
        </p>

        <p>
          This is how you can simply verify the webhook signature in a{' '}
          <Link href="https://remix.run">Remix</Link> app (or any Node.js server).
        </p>

        <CodeTitle lang="ts" title="github.ts showLineNumbers" />
        <Pre>
          <code className="language-ts">
            {
              "import type { ActionFunction } from '@remix-run/node'\nimport { json } from '@remix-run/node'\nimport crypto from 'crypto'\n\n// The `loader` function handle the GET request to the route\n// In this case, we are returning a 400 status, cause we only want to handle POST requests only\n// See more about Remix route's loader here: https://remix.run/docs/en/route/loader\nexport let loader = () => {\n  return json({ message: 'Bad request!' }, { status: 400 })\n}\n\n// The `action` function handle non-GET requests to the route\n// See more about Remix route's action here: https://remix.run/docs/en/route/action\nexport let action: ActionFunction = async ({ request }) => {\n  // Return a 405 status if the request method is not POST\n  if (request.method !== 'POST') {\n    return json({ message: 'Method not allowed' }, 405)\n  }\n\n  // Verify the webhook signature\n  let signature = request.headers.get('X-Hub-Signature-256')\n  let rawBody = await request.text()\n  let webhookSecret = process.env.GITHUB_APP_WEBHOOK_SECRET\n  let hmac = crypto.createHmac('sha256', webhookSecret)\n  hmac.update(rawBody)\n  let generatedSignature = `sha256=${hmac.digest('hex')}`\n  if (signature !== generatedSignature) {\n    return json({ message: 'Webhook must originate from GitHub!' }, 400)\n  }\n\n  let event = request.headers.get('X-GitHub-Event')\n  console.log(`✅ Github webhook verified!. Event: \"${event}\"`)\n\n  try {\n    let payload = JSON.parse(rawBody)\n    if (event === 'your_subscribed_event') {\n      let { action, sender, ...rest } = payload\n      // Do something with the payload from Github\n      // `action` is the action that triggered the event\n      // `sender` is the user that triggered the event\n    }\n    return json({ message: 'Webhook processed successfully!', event }, 200)\n  } catch (err) {\n    console.log(`❌ Error processing webhook event: ${err?.toString()}`)\n    // Return a 200 status to Github to avoid retries\n    // even if the webhook payload is not processed successfully in your app\n    return json({ message: 'Webhook processed!', event }, 200)\n  }\n}"
            }
          </code>
        </Pre>

        <p>Feel free to use this snippet in your app if you find it useful!</p>

        <p>
          Happy verifying! <Twemoji emoji="clinking-beer-mugs" />
        </p>
      </PostLayout>
    </>
  )
}
