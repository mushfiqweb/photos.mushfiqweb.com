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
  const snippet = allSnippets.find(
    (p) => p.slug === 'using-spotify-api-to-display-currently-playing-track'
  )!
  return genPostMetadata(snippet)
}

export default function Page() {
  const snippet = allSnippets.find(
    (p) => p.slug === 'using-spotify-api-to-display-currently-playing-track'
  )!

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
          If you want to display your Spotify now playing track on your website, you need to get a
          token from Spotify. This token will be used to get the track information from Spotify API.
        </p>

        <h2 id="create-a-spotify-app">Create a Spotify app</h2>

        <p>
          First, you need to create a Spotify app to get the credentials in order to generate the
          token.
        </p>

        <ul>
          <li>
            Go to{' '}
            <Link href="https://developer.spotify.com/dashboard/applications">
              Spotify for Developers
            </Link>{' '}
            and login with your Spotify account.
          </li>
          <li>
            Click on <strong>Create app</strong> button.
          </li>
          <li>Fill the form and with the app name and description.</li>
          <li>
            Add a redirect URI. This URI will be used to redirect to your local app after the
            authentication. For example,{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'http://localhost:3434'}
            </code>
            .
          </li>
          <li>
            Click on <strong>Create</strong> button.
          </li>
        </ul>

        <p>
          After creating the app, navigate to the <strong>Settings</strong> page and copy the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'Client ID'}</code>{' '}
          and{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'Client secret'}
          </code>
          . We will use these values in the next step.
        </p>

        <p>
          !<Link href="/static/images/spotify-app.png">Spotify App</Link>
        </p>

        <h2 id="authentication">Authentication</h2>

        <p>
          Since we only need to generate the token once, we will use the{' '}
          <Link href="https://developer.spotify.com/documentation/web-api/concepts/authorization#authorization-code-flow">
            Authorization Code Flow
          </Link>
          . Navigate to the following URL and replace the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'CLIENT_ID'}</code>{' '}
          with your Spotify app{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'Client ID'}</code>:
        </p>

        <Pre>
          <code className="language-bash">
            {
              'https://accounts.spotify.com/authorize?client_id=CLIENT_ID&response_type=code&redirect_uri=http://localhost:3434&scope=user-read-currently-playing'
            }
          </code>
        </Pre>

        <p>
          Remember to use the same redirect URI that you added to your Spotify app. In my case, it's{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'http://localhost:3434'}
          </code>
          .
        </p>

        <p>
          !<Link href="/static/images/spotify-auth.png">Spotify auth</Link>
        </p>

        <p>
          After the authentication process, you will be redirected to the redirect URI with a{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'code'}</code> query
          parameter. The redirect URI will look like this:
        </p>

        <Pre>
          <code className="language-bash">{'http://localhost:3434/?code=a1b2c...i9j0'}</code>
        </Pre>

        <p>
          !<Link href="/static/images/spotify-code.png">Spotify code</Link>
        </p>

        <p>
          Save this{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'code'}</code> value,
          we will use it in the next step.
        </p>

        <p>
          Next step is to send a POST request to the Spotify API to get the token. We'll simply open
          a new tab in the browser and send the request using the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'fetch'}</code> API in
          the browser developer tools.
        </p>

        <p>
          Run this code in the <strong>Console</strong> tab of the browser developer tools:
        </p>

        <CodeTitle lang="js" title="spotify.js {3,18} showLineNumbers" />
        <Pre>
          <code className="language-js">
            {
              "let data = {\n  grant_type: 'authorization_code',\n  code: 'AQB....GemX',\n  redirect_uri: 'http://localhost:3434',\n}\n\nlet formData = []\nfor (let prop in data) {\n  let encodedKey = encodeURIComponent(prop)\n  let encodedValue = encodeURIComponent(data[prop])\n  formData.push(encodedKey + '=' + encodedValue)\n}\nformData = formData.join('&')\n\nfetch('https://accounts.spotify.com/api/token', {\n  method: 'POST',\n  headers: {\n    Authorization: 'Basic <base64 encoded client_id:client_secret>',\n    'Content-Type': 'application/x-www-form-urlencoded',\n  },\n  body: formData,\n})"
            }
          </code>
        </Pre>

        <p>
          Replace the code in line 3 with the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'code'}</code> value
          that you saved in the previous step.
        </p>

        <p>
          Replace the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'<base64 encoded client_id:client_secret>'}
          </code>{' '}
          in line 18 with the base64 encoded value of your Spotify app{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'Client ID'}</code>{' '}
          and{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'Client secret'}
          </code>
          . You can use this <Link href="https://www.base64encode.org/">online tool</Link> to encode
          the value.
        </p>

        <p>
          !<Link href="/static/images/spotify-base64-encode.png">Base64 encode tool</Link>
        </p>

        <p>
          The value format should be{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'client_id:client_secret'}
          </code>
        </p>

        <p>
          The request will return a response containing a{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'refresh_token'}
          </code>
          , this token is valid indefinitely unless you revoke it or you change the password of your
          Spotify account.
        </p>

        <h2 id="querying-the-nowplaying-track">Querying the nowplaying track</h2>

        <p>
          Now that we have the token, we can use it to fetch the now playing track from Spotify API.
          Use this code to fetch the now playing track in your node server:
        </p>

        <CodeTitle lang="js" title="spotify.js showLineNumbers" />
        <Pre>
          <code className="language-js">
            {
              "import fetch from 'isomorphic-unfetch'\n\nlet SPOTIFY_TOKEN_API = `https://accounts.spotify.com/api/token`\nlet SPOTIFY_NOW_PLAYING_API = `https://api.spotify.com/v1/me/player/currently-playing`\nlet SPOTIFY_TOP_TRACKS_API = `https://api.spotify.com/v1/me/top/tracks`\n\nlet {\n  SPOTIFY_CLIENT_ID: client_id,\n  SPOTIFY_CLIENT_SECRET: client_secret,\n  SPOTIFY_REFRESH_TOKEN: refresh_token,\n} = process.env\n\nlet basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')\n\nasync function getAccessToken() {\n  let response = await fetch(SPOTIFY_TOKEN_API, {\n    method: 'POST',\n    headers: {\n      Authorization: `Basic ${basic}`,\n      'Content-Type': 'application/x-www-form-urlencoded',\n    },\n    body: new URLSearchParams({\n      grant_type: 'refresh_token',\n      refresh_token,\n    }),\n  })\n\n  return response.json()\n}\n\nexport async function getNowPlaying() {\n  let { access_token } = await getAccessToken()\n  let url = new URL(SPOTIFY_NOW_PLAYING_API)\n  url.searchParams.append('additional_types', 'track,episode')\n\n  return fetch(url.toString(), {\n    headers: {\n      Authorization: `Bearer ${access_token}`,\n    },\n  })\n}"
            }
          </code>
        </Pre>

        <p>
          Remember to add the required environment variables to your{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'.env'}</code> file.
        </p>

        <CodeTitle lang="bash" title=".env showLineNumbers" />
        <Pre>
          <code className="language-bash">
            {
              'SPOTIFY_CLIENT_ID=your_spotify_client_id\nSPOTIFY_CLIENT_SECRET=your_spotify_client_secret\nSPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token'
            }
          </code>
        </Pre>

        <p>
          That's it! Now you can use the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'getNowPlaying'}
          </code>{' '}
          function to fetch the now playing track from Spotify API.
        </p>

        <p>
          Happy playing! <Twemoji emoji="clinking-beer-mugs" />
        </p>
      </PostLayout>
    </>
  )
}
