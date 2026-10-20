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
  const snippet = allSnippets.find((p) => p.slug === 'use-async')!
  return genPostMetadata(snippet)
}

export default function Page() {
  const snippet = allSnippets.find((p) => p.slug === 'use-async')!

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
        <p>Custom hooks to use an async effect</p>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              "function useAsync(asyncCallback) {\n  let [state, dispatch] = React.useReducer(asyncReducer)\n\n  React.useEffect(() => {\n    let promise = asyncCallback()\n    if (!promise) return\n\n    dispatch({ type: 'pending' })\n    promise\n      .then((data) => dispatch({ type: 'resolved', data }))\n      .catch((error) => dispatch({ type: 'rejected', error }))\n  }, [asyncCallback])\n\n  return state\n}"
            }
          </code>
        </Pre>

        <p>Usage:</p>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              "function Component({ input }) {\n  // Remember to wrap the async job in a useCallback\n  let asyncCallback = React.useCallback(() => {\n    if (!input) return\n\n    // Run the async effect (fetch is an example)\n    return fetch(input)\n  }, [input])\n\n  let { status, data, error } = useAsync(asyncCallback)\n\n  switch (status) {\n    case 'idle':\n      return 'Waiting for the async to trigger'\n    case 'pending':\n      return 'Pending UI'\n    case 'rejected':\n      throw error\n    case 'resolved':\n      return 'Data UI'\n    default:\n      throw new Error('This should be impossible')\n  }\n}"
            }
          </code>
        </Pre>

        <p>
          How to clean the side effect (the async job start but then the component unmounted) ? -{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'useSafeDispatch'}
          </code>{' '}
          !
        </p>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              'function useSafeDispatch(dispatch) {\n  let mountedRef = React.useRef(false)\n  React.useEffect(() => {\n    mountedRef.current = true\n    return () => {\n      mountedRef.current = false\n    }\n  }, [])\n\n  return React.useCallback(\n    (...args) => {\n      if (mountedRef.current) {\n        dispatch(...args)\n      }\n    },\n    [dispatch]\n  )\n}'
            }
          </code>
        </Pre>

        <p>
          Now change the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'useAsync'}</code>{' '}
          function:
        </p>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              "function useAsync(asyncCallback) {\n  let [state, unsafeDispatch] = React.useReducer(asyncReducer)\n  let dispatch = useSafeDispatch(unsafeDispatch)\n\n  React.useEffect(() => {\n    let promise = asyncCallback()\n    if (!promise) return\n\n    dispatch({ type: 'pending' })\n    promise\n      .then((data) => dispatch({ type: 'resolved', data }))\n      .catch((error) => dispatch({ type: 'rejected', error }))\n  }, [asyncCallback])\n\n  return state\n}"
            }
          </code>
        </Pre>

        <p>
          Cheers <Twemoji emoji="clinking-beer-mugs" />
        </p>
      </PostLayout>
    </>
  )
}
