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
    (p) => p.slug === 'sync-react-component-state-with-local-storage'
  )!
  return genPostMetadata(snippet)
}

export default function Page() {
  const snippet = allSnippets.find(
    (p) => p.slug === 'sync-react-component-state-with-local-storage'
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
        <p>Simple custom hook to synchronize component state with local storage.</p>

        <CodeTitle lang="ts" title="use-local-storage-state.ts showLineNumbers" />
        <Pre>
          <code className="language-ts">
            {
              "import { useState, useEffect } from 'react'\n\nexport function useLocalStorageState<T = { [key: string]: any }>(key: string, defaultValue?: T) {\n  let [state, setState] = useState<T>(() => {\n    let storage = localStorage.getItem(key)\n    if (storage) {\n      return JSON.parse(storage)\n    }\n    return defaultValue || {}\n  })\n\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(state))\n  }, [state])\n\n  // Using `as const` to ensure the type of the returned array is correct\n  return [state, setState] as const\n}"
            }
          </code>
        </Pre>

        <p>
          In some cases, you might need to check for browser environment, cause local storage is
          available only in the client side.
        </p>

        <CodeTitle lang="ts" title="use-local-storage-state.ts showLineNumbers {3,7-12}" />
        <Pre>
          <code className="language-ts">
            {
              "import { useState, useEffect } from 'react'\n\nlet isBrowser = typeof window !== 'undefined' // Check for browser/client environment\n\nexport function useLocalStorageState<T = { [key: string]: any }>(key: string, defaultValue?: T) {\n  let [state, setState] = useState<T>(() => {\n    if (isBrowser) {\n      let storage = localStorage.getItem(key)\n      if (storage) {\n        return JSON.parse(storage)\n      }\n    }\n    return defaultValue || {}\n  })\n\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(state))\n  }, [state])\n\n  return [state, setState] as const\n}"
            }
          </code>
        </Pre>

        <h2 id="usage">Usage</h2>

        <p>
          A simple example of using the hook to synchronize component state with local storage is
          shown below:
        </p>

        <CodeTitle lang="tsx" title="theme-switcher.tsx showLineNumbers" />
        <Pre>
          <code className="language-tsx">
            {
              "function ThemeSwitcher() {\n  let [theme, setTheme] = useLocalStorageState<'dark' | 'light'>('theme', 'light')\n\n  return (\n    <select onChange={ev => setTheme(ev.target.value)}>\n      <option value=\"dark\">Dark</option>\n      <option value=\"light\">Light</option>\n    </select>\n  )\n}"
            }
          </code>
        </Pre>
      </PostLayout>
    </>
  )
}
