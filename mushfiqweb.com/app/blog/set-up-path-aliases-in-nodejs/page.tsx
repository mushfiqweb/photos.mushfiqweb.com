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
  const post = allBlogs.find((p) => p.slug === 'set-up-path-aliases-in-nodejs')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'set-up-path-aliases-in-nodejs')!

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
          Recently, I have been working on a pet project using <strong>Node.js</strong> on the
          backend to further my knowledge and prevent skill degradation during my free time.
          However, I encountered a frustrating issue with <strong>paths</strong> that many
          developers have likely experienced.
        </p>

        <Pre>
          <code className="language-ts showLineNumbers">
            {
              "import { saveUser } from '../../../../../models/User'\nimport homeController from '../../../../../controllers/home'"
            }
          </code>
        </Pre>

        <p>
          This code can be a headache for developers who need to determine how many folders to
          traverse to find the desired file. If you need to move a file to a different folder, you
          must update the path in all files that import the module{' '}
          <Twemoji emoji="face-with-steam-from-nose" />.
        </p>

        <p>
          But what if we could define <strong>aliases</strong> (i.e., <strong>shortcuts</strong>)
          for frequently imported modules throughout the entire project?
        </p>

        <p>For example:</p>

        <Pre>
          <code className="language-ts showLineNumbers">
            {
              "import { saveUser } from '@models/User'\nimport homeController from '@controllers/home'"
            }
          </code>
        </Pre>

        <p>In which:</p>

        <ul>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'@models'}</code> is
            equivalent to{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'./src/models/*'}
            </code>
          </li>
        </ul>

        <ul>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'@controllers'}
            </code>{' '}
            is equivalent to{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'./src/controllers/*'}
            </code>
            .
          </li>
        </ul>

        <p>
          The solution is quite simple with{' '}
          <Link href="https://www.npmjs.com/package/module-alias">module-alias</Link> and a{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'tsconfig.json'}
          </code>{' '}
          configuration. Follow these instructions to set it up:
        </p>

        <h2 id="update-tsconfigjson">
          Update{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'tsconfig.json'}
          </code>
        </h2>

        <p>
          Open the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'tsconfig.json'}
          </code>{' '}
          file and add the following configuration to the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'compilerOptions'}
          </code>{' '}
          object:
        </p>

        <CodeTitle lang="json" title="tsconfig.json showLineNumbers" />
        <Pre>
          <code className="language-json">
            {
              '"compilerOptions": {\n  // other configs...\n  "baseUrl": "./src",\n  "paths": {\n      "*": [\n          "node_modules/*",\n          "src/types/*"\n      ],\n      "@controllers/*": [\n          "controllers/*"\n      ],\n      "@models/*": [\n          "models/*"\n      ]\n  }\n}'
            }
          </code>
        </Pre>

        <p>
          Here,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'@controllers'}</code>{' '}
          and <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'@models'}</code>{' '}
          are aliases for your modules (you can use any <strong>naming convention</strong> you like,
          and it does not have to start with{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'@'}</code> — that's
          just the <strong>prefix</strong> I use to differentiate).
        </p>

        <p>
          Now you can use the configured <strong>alias</strong> in your project, but you will
          encounter a module import error:
        </p>

        <Pre>
          <code className="language-bash">{"[Node] Error: Cannot find module '@models/User'"}</code>
        </Pre>

        <h2 id="install-the-module-alias-package">
          Install the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'module-alias'}</code>{' '}
          package
        </h2>

        <p>
          This package <strong>resolves</strong> path aliases in JS files after they are compiled.
        </p>

        <ul>
          <li>Install it with:</li>
        </ul>

        <Pre>
          <code className="language-bash">
            {'  npm i --save module-alias # or yarn add module-alias'}
          </code>
        </Pre>

        <ul>
          <li>
            Configure it in{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'package.json'}
            </code>
            :
          </li>
        </ul>

        <CodeTitle lang="json" title="package.json showLineNumbers" />
        <Pre>
          <code className="language-json">
            {
              '  "_moduleAliases": {\n    "@models": "dist/models",\n    "@controllers": "dist/controllers"\n  }'
            }
          </code>
        </Pre>

        <p>
          Note that{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'dist/'}</code> is the{' '}
          <strong>folder</strong> that contains your code after it has been built (depending on your
          configuration, it could be{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'dist/'}</code>,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'build/'}</code>,
          etc.).
        </p>

        <ul>
          <li>Finally, register the module in your app:</li>
        </ul>

        <Pre>
          <code className="language-ts">{"  import 'module-alias/register'"}</code>
        </Pre>

        <p>
          Import it only once in your project's start file (such as{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'index.ts'}</code>,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'app.ts'}</code>, or{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'server.ts'}</code>
          ...).
        </p>

        <h2 id="done-">
          Done <Twemoji emoji="party popper" />
        </h2>

        <p>Now you can reload your IDE, start the project, and use aliases across your project.</p>

        <p>
          !<Link href="/static/images/vscode.png">VS Code Recommendation</Link>
        </p>

        <p>
          <strong>VS Code</strong> supports this feature by reading the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'tsconfig.json'}
          </code>{' '}
          file. Simply reload it to use the feature.
        </p>

        <p>Good luck!</p>

        <h2 id="refs">Refs</h2>

        <ul>
          <li>
            <Link href="https://medium.com/zero-equals-false/how-to-use-module-path-aliases-in-visual-studio-typescript-and-javascript-e7851df8eeaa">
              https://medium.com/zero-equals-false/how-to-use-module-path-aliases-in-visual-studio-typescript-and-javascript-e7851df8eeaa
            </Link>
          </li>
          <li>
            <Link href="https://dev.to/larswaechter/path-aliases-with-typescript-in-nodejs-4353">
              https://dev.to/larswaechter/path-aliases-with-typescript-in-nodejs-4353
            </Link>
          </li>
        </ul>
      </PostLayout>
    </>
  )
}
