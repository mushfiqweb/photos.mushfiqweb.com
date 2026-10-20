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
  const post = allBlogs.find(
    (p) => p.slug === 'introduction-to-committing-with-conventional-commit'
  )!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find(
    (p) => p.slug === 'introduction-to-committing-with-conventional-commit'
  )!

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
        <h2 id="introduction">Introduction</h2>
        <p>
          Conventional commit is a specific form of committing which gives software developers a
          uniform system for organizing and describing their changes, making it easier to keep track
          of updates. This type of commit generally follows a strict and consistent format, making
          it easier to understand what changes were made and why.
        </p>
        <p>The conventional commit typically follows a specific format, such as:</p>
        <Pre>
          <code className="language-bash">{'<type>[optional scope]: <description>'}</code>
        </Pre>
        <p>
          Where the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'type'}</code> is
          subject of the commit, it indicates the type of change that was made and should be one of
          the following types:
        </p>
        <ul>
          <li>
            <strong>feat</strong>: a feature or new addition to the project
          </li>
          <li>
            <strong>fix</strong>: a bug fix
          </li>
          <li>
            <strong>refactor</strong>: refactoring of code or changes to the project infrastructure
          </li>
          <li>
            <strong>style</strong>: changes to the formatting, white-space, etc.
          </li>
          <li>
            <strong>docs</strong>: changes to documentation
          </li>
          <li>
            <strong>perf</strong>: a code change that improves performance
          </li>
          <li>
            <strong>chore</strong>: minor changes, such as updating the version of a dependency,
            fixing a typo, etc.
          </li>
          <li>...</li>
        </ul>
        <p>
          The <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'scope'}</code> is
          optional and is used to indicate the part of the project that was changed, such as{' '}
          <strong>api</strong>, <strong>ui</strong>, <strong>database</strong>, etc.
        </p>
        <p>
          The{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'description'}</code>{' '}
          is a short description of the change, it should be written in the imperative mood, such as
          "change" instead of "changed" or "changes".
        </p>
        <p>Example:</p>
        <Pre>
          <code className="language-bash">
            {'feat(api): send an email to the customer when a product is shipped'}
          </code>
        </Pre>
        <p>or</p>
        <Pre>
          <code className="language-bash">{'fix: prevent racing of requests'}</code>
        </Pre>
        <h2 id="why-use-conventional-commit">Why use conventional commit?</h2>
        <p>
          Conventional commit helps to ensure that commits are organized and consistent. This makes
          it easier to read and understand what changes have been made and why. It also makes it
          easier to track down and understand related issues and pull requests.
        </p>
        <p>
          By following the conventional commit format, teams can also easily create commit messages
          that follow the same structure and format. This makes it easier to review and understand
          the changes that have been made, as well as ensure that changes are documented in the same
          way each time.
        </p>
        <p>
          In addition, conventional commit is a great way to keep the project’s codebase organized
          and consistent. This helps to make sure that the codebase is easy to maintain and read, as
          well as reducing the amount of time spent debugging and refactoring.
        </p>
        <h2 id="set-up-conventional-commit-to-your-project">
          Set up conventional commit to your project
        </h2>
        <p>
          In this post, I will show you how to set up conventional commit to your project using{' '}
          <Link href="https://commitlint.js.org/#/">commitlint</Link>
        </p>
        <Twemoji emoji="keycap-1" /> Install commitlint and its dependencies:
        <Pre>
          <code className="language-bash">
            {'npm install -g @commitlint/cli @commitlint/config-conventional'}
          </code>
        </Pre>
        <Twemoji emoji="keycap-2" /> Add a commitlint config file to your project:
        <p>Using this command to create a config file with basic configuration:</p>
        <Pre>
          <code className="language-bash">
            {
              'echo "module.exports = {extends: [\'@commitlint/config-conventional\']}" > commitlint.config.js'
            }
          </code>
        </Pre>
        <p>The file should have the following content:</p>
        <CodeTitle lang="js" title="commitlint.config.js" />
        <Pre>
          <code className="language-js">
            {"module.exports = { extends: ['@commitlint/config-conventional'] }"}
          </code>
        </Pre>
        <Twemoji emoji="keycap-3" /> Add `husky` to lint commits before they are created:
        <Pre>
          <code className="language-bash">{'npm install husky --save-dev'}</code>
        </Pre>
        <p>Activate hooks with the following command:</p>
        <Pre>
          <code className="language-bash">{'npx husky install'}</code>
        </Pre>
        <p>Your should see the following output:</p>
        <Pre>
          <code className="language-bash">{'husky - Git hooks installed'}</code>
        </Pre>
        <p>
          and a new{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'.husky'}</code>{' '}
          folder should be created in the root of your project.
        </p>
        <Twemoji emoji="light-bulb" /> I would highly recommend adding a `postinstall` script in the
        **package.json** file to automatically install husky hooks after installing dependencies:
        <Pre>
          <code className="language-json">
            {'"scripts": {\n\t"postinstall": "husky install"\n}'}
          </code>
        </Pre>
        <Twemoji emoji="keycap-4" /> Add a `commit-msg` hook to lint commits:
        <Pre>
          <code className="language-bash">
            {"npx husky add .husky/commit-msg  'npx --no -- commitlint --edit ${1}'"}
          </code>
        </Pre>
        <p>
          You should see a{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'commit-msg'}</code>{' '}
          file created in the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'.husky'}</code>{' '}
          folder.
        </p>
        <p>
          And that’s it <Twemoji emoji="party-popper" />! Now, whenever you commit, commitlint will
          check your commit message and make sure it follows the conventional commit format.
        </p>
        <p>Let’s try it out with an un-conventional commit message:</p>
        <Pre>
          <code className="language-bash">
            {'git commit -m "Using commitlint and husky to lint commits"'}
          </code>
        </Pre>
        <p>The commit should fail with the following error:</p>
        <Pre>
          <code className="language-bash showLineNumbers">
            {
              '⧗   input: Using commitlint and husky to lint commits\n✖   subject may not be empty [subject-empty]\n✖   type may not be empty [type-empty]\n\n✖   found 2 problems, 0 warnings\nⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint\n\nhusky - commit-msg hook exited with code 1 (error)'
            }
          </code>
        </Pre>
        <p>
          As you can see, commitlint has detected that the commit message is not following the
          conventional commit format and has provided a helpful error message.
        </p>
        <p>Now, let’s try it again with a conventional commit message:</p>
        <Pre>
          <code className="language-bash">
            {'git commit -m "feat: add commitlint and husky to lint commits"'}
          </code>
        </Pre>
        <p>The commit should succeed with the following output:</p>
        <Pre>
          <code className="language-bash showLineNumbers">
            {
              '[main b40785f] feat: using husky to lint commits\n\t3 files changed, 27 insertions(+)\n\tcreate mode 100755 .husky/commit-msg'
            }
          </code>
        </Pre>
        <h2 id="conclusion">Conclusion</h2>
        <p>
          Conventional commit is a great way to ensure that commit messages are organized and
          consistent. By following the conventional commit format, teams can easily create commit
          messages that follow the same structure and format, making it easier to review and
          understand the changes that have been made.
        </p>
        <p>
          Therefore, it’s important to use this type of commit when developing projects so that
          changes are well-documented and tracked.
        </p>
        <p>
          Happy committing <Twemoji emoji="clinking-beer-mugs" />
        </p>
      </PostLayout>
    </>
  )
}
