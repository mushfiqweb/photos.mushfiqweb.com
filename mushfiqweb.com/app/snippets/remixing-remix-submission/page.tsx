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
  const snippet = allSnippets.find((p) => p.slug === 'remixing-remix-submission')!
  return genPostMetadata(snippet)
}

export default function Page() {
  const snippet = allSnippets.find((p) => p.slug === 'remixing-remix-submission')!

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
          I have been working with <Link href="https://remix.run">Remix</Link> for a while now and I
          love it. Here is a custom hook I use to handle in-route-submission in my Remix apps.
        </p>

        <CodeTitle lang="ts" title="use-route-submission.ts showLineNumbers" />
        <Pre>
          <code className="language-ts">
            {
              "import { useActionData, useNavigation, useSubmit } from '@remix-run/react'\nimport { useEffect } from 'react'\nimport { parseSubmissionData } from '~/utils/object'\nimport { useIndexRouteDetector } from './use-index-route-detector'\nimport type { RouteSubmission, RouteSubmissionInput, SubmitData } from '~/types/hooks'\n\n/**\n * Submit data to the current route from any nested element.\n * Prefer this over `useSubmitFetcher` as it allows the `actionData` from `useActionData` hook can be accessed from any nested component in the route no matter how deep it is.\n *\n * @param input - `object` - The input to use for the route submission\n * @param [input._action] - The `_action` to use for the route submission, it will be added to submit data\n * @param [input.onSubmitted] - A callback to run when the route submission is submitted\n * @returns RouteSubmission\n * @example\n * ```tsx\n * import { useRouteSubmission } from '~/hooks'\n *\n * export function MyComponent() {\n *  // An `_action` param should be added to differentiate between multiple submissions\n *  let [submit, submitting, submitData] = useRouteSubmission({ _action: 'myAction' })\n *  // or let {submit, submitting, submitData} = useRouteSubmission({ _action: 'myAction' })\n *\n *  let handleClick = () => submit({ name: 'John Doe' })\n *  let loading = submitting\n *\n *  return (\n *    <Button loading={loading} onClick={handleClick}>\n *      Submit\n *    </Button>\n *  )\n * }\n *```\n */\nexport function useRouteSubmission(input: RouteSubmissionInput): RouteSubmission {\n  let _submit = useSubmit()\n  let navigation = useNavigation()\n  let isIndexRoute = useIndexRouteDetector()\n  let actionData = useActionData()\n\n  let { _action, onSubmitted } = input || {}\n  let submitData = parseSubmissionData(navigation)\n  let isActionMatched = submitData?._action === _action\n\n  useEffect(() => {\n    if (isActionMatched && navigation.state === 'loading') {\n      onSubmitted?.(submitData, actionData)\n    }\n    // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [navigation.state])\n\n  let submit = (data: SubmitData = {}) => {\n    let actionURL = window.location.pathname\n    _submit(\n      { data: JSON.stringify({ ...data, _action }) },\n      {\n        action: isIndexRoute ? `${actionURL}?index` : actionURL,\n        method: 'post',\n        replace: true,\n      }\n    )\n  }\n  let submitting = isActionMatched && navigation.state === 'submitting'\n\n  return Object.defineProperty({ submit, submitting, submitData }, Symbol.iterator, {\n    enumerable: false,\n    value: function* () {\n      yield submit\n      yield submitting\n      yield submitData\n    },\n  }) as RouteSubmission\n}"
            }
          </code>
        </Pre>

        <p>The utils used in the hook are:</p>

        <CodeTitle lang="ts" title="object.ts showLineNumbers" />
        <Pre>
          <code className="language-ts">
            {
              "import type { useNavigation } from '@remix-run/react'\nimport type {SubmitDataWithAction} from '~/types/hooks'\n\n/**\n * Get the submitted data of a submission\n *\n * @param navigation - The current page navigation returned from `useNavigation` hook\n * @example\n * let data = parseSubmissionData(transition)\n */\nexport function parseSubmissionData(\n  navigation: ReturnType<typeof useNavigation>,\n): SubmitDataWithAction {\n  let formData = navigation?.formData\n  if (!formData) return null\n  return JSON.parse((Object.fromEntries(formData) as any).data)\n}"
            }
          </code>
        </Pre>

        <p>And</p>

        <CodeTitle lang="ts" title="use-index-route-detector.ts" />
        <Pre>
          <code className="language-ts">
            {
              "import { useLocation, useMatches } from '@remix-run/react'\n\nexport function useIndexRouteDetector() {\n  let matches = useMatches()\n  let location = useLocation()\n  let match = matches.find(({ pathname }) => pathname === location.pathname)\n  if (match) {\n    return !!match.id.match(/\\/index$/) || match.id === 'root'\n  }\n  return false\n}"
            }
          </code>
        </Pre>

        <p>And the types used in the hook are:</p>

        <CodeTitle lang="ts" title="hooks.ts showLineNumbers" />
        <Pre>
          <code className="language-ts">
            {
              'export type RouteSubmissionInput = {\n  _action: string\n  onSubmitted?: (\n    submitData: SubmitDataWithAction,\n    actionData: { [key: string]: any },\n  ) => void\n}\n\nexport type SubmitData = {\n  [key: string]: any\n}\n\nexport type SubmitDataWithAction = {\n  _action?: string\n  [key: string]: any\n}\n\ntype SubmitFunction = (data?: SubmitData) => void\n\nexport type RouteSubmission = {\n  submit: SubmitFunction\n  submitting: boolean\n  submitData: SubmitDataWithAction\n} & [SubmitFunction, boolean, SubmitDataWithAction]'
            }
          </code>
        </Pre>

        <p>Example usage:</p>

        <CodeTitle lang="tsx" title="example.tsx showLineNumbers" />
        <Pre>
          <code className="language-tsx">
            {
              "import { Button } from '~/components/button'\nimport { useRouteSubmission } from '~/hooks/use-route-submission'\n\nexport function SaveProject() {\n  // An `_action` param should be added to differentiate between multiple submissions\n  let [submit, submitting] = useRouteSubmission({ _action: 'SAVE_DATA' })\n  // or let {submit, submitting} = useRouteSubmission({ _action: 'SAVE_DATA' })\n\n  function save() {\n    submit({ name: 'John Doe' })\n  }\n\n  return (\n    <Button loading={submitting} onClick={save}>\n      Save\n    </Button>\n  )\n}"
            }
          </code>
        </Pre>

        <p>
          Happy submitting! <Twemoji emoji="clinking-beer-mugs" />
        </p>
      </PostLayout>
    </>
  )
}
