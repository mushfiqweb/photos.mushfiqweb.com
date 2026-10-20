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
  const post = allBlogs.find((p) => p.slug === 'key-notes-while-working-with-git')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'key-notes-while-working-with-git')!

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
          This post is written for developers who prefer working with{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'git'}</code> via{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'command-line'}</code>{' '}
          like me. If you love GUI, hope you still can find something useful here{' '}
          <Twemoji emoji="beaming-face-with-smiling-eyes" />
        </p>
        <h2 id="git-alias">Git alias</h2>
        <blockquote>
          <p>
            Git aliases are a powerful workflow tool that create shortcuts to frequently used Git
            commands
          </p>
        </blockquote>
        <p>
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'git alias'}</code> in
          the simpleset term is creating a <em>shortcut</em> (short{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'command'}</code>) for
          the long ones, make them easier to remember and you can type it faster.
        </p>
        <h3 id="syntax">Syntax</h3>
        <Pre>
          <code className="language-bash">
            {'git config --global alias.<shortcut> <original-command>'}
          </code>
        </Pre>
        <Twemoji emoji="warning" /> Use `--global` flag to tell **git** that the alias will be used
        in all projects (otherwise, it will only work on your current working project!)
        <Twemoji emoji="warning" /> Use quotes (`''`) if the `original-command` includes space(s).
        <p>For me, I create aliases for almost all commands that I work with daily.</p>
        <Twemoji emoji="keycap-1" /> **Git status**
        <p>Check the changes before committing:</p>
        <Pre>
          <code className="language-bash">{'git config --global alias.st status'}</code>
        </Pre>
        <Pre>
          <code className="language-bash showLineNumbers">
            {
              '# Now instead of `git status`, use `git st`\ngit st\nOn branch v2\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n  (use "git restore <file>..." to discard changes in working directory)\n        modified:   components/ui/twemoji\n        modified:   css/tailwind.css\n        modified:   data/blog/git-notes.mdx\n\nno changes added to commit (use "git add" and/or "git commit -a")'
            }
          </code>
        </Pre>
        <blockquote>
          <p>
            Tip: Use{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'git st'}</code>{' '}
            with{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'--short'}</code>{' '}
            flag or <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'-s'}</code>{' '}
            to see the short-format of the changes, and... you know it - create an alias for this
            command too
          </p>
        </blockquote>
        <Pre>
          <code className="language-bash">{"git config --global alias.s 'status --short'"}</code>
        </Pre>
        <Pre>
          <code className="language-bash showLineNumbers">
            {
              '# Now instead of `git st`, use `git s`\ngit s\n  M components/Image.js\n  M data/blog/git-notes.mdx\n  ?? public/static/images/force-with-lease.jpg'
            }
          </code>
        </Pre>
        <p>
          Much clearer results and much faster typing, right?{' '}
          <Twemoji emoji="beaming-face-with-smiling-eyes" />
        </p>
        <Twemoji emoji="keycap-2" /> **Git commit**
        <Pre>
          <code className="language-bash">{"git config --global alias.cm 'commit -m'"}</code>
        </Pre>
        <p>
          Commit changes (
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'add/stage'}</code>{' '}
          changes before):
        </p>
        <Pre>
          <code className="language-bash">{'git cm "Initial commit"'}</code>
        </Pre>
        <blockquote>
          <p>
            [!TIP] If the changes are only for existing files (neither new file nor deleted file),
            use <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'--all'}</code>{' '}
            or <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'-a'}</code> flag
            so you don't have to add or stage changes before committing
          </p>
        </blockquote>
        <Pre>
          <code className="language-bash">{"git config --global alias.cam 'commit -am'"}</code>
        </Pre>
        <Pre>
          <code className="language-bash showLineNumbers">
            {
              '# Now instead of 2 git commands\ngit add style.css # `style.css` is already existed, not new file!\ngit cm "Update style"\n\n# Use only 1 command\ngit cam "Update style"'
            }
          </code>
        </Pre>
        <Twemoji emoji="keycap-3" /> **Git stash**
        <blockquote>
          <p>
            Stash the changes in a dirty working directory away{' '}
            <Twemoji emoji="grinning-face-with-sweat" />
          </p>
        </blockquote>
        <p>
          Like the definition, use{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'git stash'}</code>{' '}
          when you need to <strong>"stash"</strong> the changes before pulling new stuff from remote
          repo:
        </p>
        <Pre>
          <code className="language-bash">{'# Too short to create an alias\ngit stash'}</code>
        </Pre>
        <p>Applying the stashed changes after pulling:</p>
        <Pre>
          <code className="language-bash">{'git stash pop'}</code>
        </Pre>
        <p>Create an alias for it:</p>
        <Pre>
          <code className="language-bash showLineNumbers">
            {
              "git config --global alias.sp 'stash pop'\n\n# Now\ngit sp\n\n# Is equal\ngit stash pop"
            }
          </code>
        </Pre>
        <Twemoji emoji="keycap-4" /> **Git `pull/push`**
        <p>
          Always{' '}
          <Link href="https://www.atlassian.com/git/tutorials/merging-vs-rebasing">
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'pull rebase'}
            </code>
          </Link>{' '}
          and{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'force push'}</code>{' '}
          to have a clean commit tree!
        </p>
        <ul>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'pull rebase'}
            </code>
          </li>
        </ul>
        <Pre>
          <code className="language-bash">
            {"  git config --global alias.prb 'pull origin --rebase'"}
          </code>
        </Pre>
        <Pre>
          <code className="language-bash showLineNumbers">
            {
              '  # Now\n  git pull origin --rebase main\n\n  # Is equal\n  git prb main\n  # Or\n  git prb master'
            }
          </code>
        </Pre>
        <ul>
          <li>What if a conflict occurs after rebasing?</li>
        </ul>
        <p>
          List all the conflicts with{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'git diff'}</code> and
          create an alias for this command:
        </p>
        <Pre>
          <code className="language-bash">
            {"  git config --global alias.cf 'diff --name-only --diff-filter=U'"}
          </code>
        </Pre>
        <Pre>
          <code className="language-bash showLineNumbers">
            {
              '  # List all the conflicts\n  git cf\n\n  # Reolve all conflict then stage changes\n  git add .\n\n  # Finish rebasing\n  git rebase --continue'
            }
          </code>
        </Pre>
        <ul>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'force push'}</code>
          </li>
        </ul>
        <p>
          When you finish resolving the conflicts that occured after rebasing, we need to{' '}
          <strong>force</strong> push the changes to the remote repo:
        </p>
        <Pre>
          <code className="language-bash showLineNumbers">
            {
              "  git config --global alias.pf 'push --force-with-lease'\n\n  # Now after rebasing\n  git pf"
            }
          </code>
        </Pre>
        <p>
          <Link href="https://git-scm.com/docs/git-push#Documentation/git-push.txt---force-with-leaseltrefnamegt">
            Why not{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'--force'}</code>?
          </Link>
        </p>
        <p>
          <strong>TL;DR</strong>
        </p>
        <blockquote>
          <p>
            The{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'--force'}</code>{' '}
            flag will make git overwrite the remote repo with local changes without comparing with
            possible updates in the remote after rebasing, which can be dangerous if 2 developers
            working on the same branch. <br />{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'--force-with-lease'}
            </code>{' '}
            in the opposite way, make sure you can push only when no updates on the upstream exist.
          </p>
        </blockquote>
        <p>
          !<Link href="/static/images/force-with-lease.jpg">force-with-lease</Link>
        </p>
        <Twemoji emoji="keycap-5" /> **Git checkout**
        <Pre>
          <code className="language-bash showLineNumbers">
            {"git config --global alias.co 'checkout'\n\n# Eg\ngit co main"}
          </code>
        </Pre>
        <p>Create a new branch:</p>
        <Pre>
          <code className="language-bash showLineNumbers">
            {"git config --global alias.cob 'checkout -b'\n\n# Eg\ngit cob feature-x"}
          </code>
        </Pre>
        <blockquote>
          <p>
            [!TIP] Use{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'git co -'}</code>{' '}
            to checkout to the previous branch.
          </p>
        </blockquote>
        <p>Example:</p>
        <Pre>
          <code className="language-bash {3} showLineNumbers">
            {
              'git branch\ndev\n* feature-x-y-z__ISSUE_ID\nmain\n# The current branch is `feature-x-y-z__ISSUE_ID`\n\n# Checkout to `dev`\ngit co dev\n# Do something\n# Commit ...\n\n# Now to come back to `feature-x-y-z__ISSUE_ID` use\ngit co -\n# Instead of\ngit checkout feature-x-y-z__ISSUE_ID'
            }
          </code>
        </Pre>
        <Twemoji emoji="keycap-6" /> **Git diff**
        <p>
          Check the changes before commit (Usually, I use this to make sure no{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'debug'}</code>,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'hardcode'}</code> or{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'console.log'}</code>{' '}
          is left in my code).
        </p>
        <Pre>
          <code className="language-bash showLineNumbers">
            {"git config --global alias.d 'diff'\n\n# Eg\ngit d style.css"}
          </code>
        </Pre>
        <h3 id="note">Note</h3>
        <p>
          All your aliases can be found in{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'~/.gitconfig'}</code>{' '}
          file (MacOS). You can open this file directly and edit any alias you want.
        </p>
        <Pre>
          <code className="language-bash">{'vim ~/.gitconfig'}</code>
        </Pre>
        <CodeTitle lang="bash" title=".gitconfig showLineNumbers" />
        <Pre>
          <code className="language-bash">
            {
              '# Find the alias part in the config file\n[alias]\n  s = status --short\n  st = status\n  cm = commit -m\n  # ...'
            }
          </code>
        </Pre>
        <p>
          Prerequisite to be able to edit this file: knowing{' '}
          <Link href="https://github.com/vim/vim">
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'vim'}</code>
          </Link>{' '}
          <Twemoji emoji="face-with-tears-of-joy" />
        </p>
        <p>
          !<Link href="/static/images/vim-meme-exit.png">vim-meme</Link>
        </p>
        <h2 id="git-workflow">Git workflow</h2>
        <p>
          My daily workflow working with{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'git'}</code> (all
          aliases explained in the <Link href="#git-alias">above section</Link>)
        </p>
        <Pre>
          <code className="language-bash {5,14,26,36} showLineNumbers">
            {
              '# Stash changes\ngit stash\n\n# Update changes from upstream\ngit prb main\n\n# Apply stash changes\ngit sp\n\n# Resolve conflict if existed\n# Work\n\n# Check working status\ngit s\n\n# Check file changes (if needed)\ngit d # or git d file.ext\n\n# Stage changes\ngit add .\n\n# Commit\ngit cm "commit message"\n\n# Or skip stage changes if no new file created/deleted\ngit cam "commit message"\n\n# Update changes again\ngit prb main\n\n# If there\'re conflicts, resolve all then\ngit add file.ext\ngit rebase --continue\n\n# Force push\ngit pf\n\n# Making pull request'
            }
          </code>
        </Pre>
        <p>
          Here is my entire workflow but only the highlighted commands are the most commonly used{' '}
          <Twemoji emoji="beaming-face-with-smiling-eyes" />
        </p>
        <h2 id="gitignore-and-gitkeep">
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'.gitignore'}</code>{' '}
          and <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'.gitkeep'}</code>
        </h2>
        <Twemoji emoji="keycap-1" /> **.gitignore**
        <p>
          <Link href="https://github.com/github/gitignore">Useful ready to use templates</Link>
        </p>
        <p>Tip: ignore all files inside a directory but keep 1 specific file</p>
        <Pre>
          <code className="language-bash {5} showLineNumbers">
            {
              '# Ignore all file in a directory\nhomework/*\n\n# Keep only this file\n!homework/file-to-keep'
            }
          </code>
        </Pre>
        <Twemoji emoji="keycap-2" /> **.gitkeep**
        <p>How to push an empty directory to the remote repo?</p>
        <blockquote>
          <p>
            Create a{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'.gitkeep'}</code>{' '}
            file, put it in the empty directory, then you can push the directory to the upstream!
          </p>
        </blockquote>
        <p>
          This it not an{' '}
          <Link href="https://git-scm.com/search/results?search=.%20gitkeep">official feature</Link>{' '}
          of <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'git'}</code>{' '}
          itself! Just a convention of some random dev out there{' '}
          <Twemoji emoji="beaming-face-with-smiling-eyes" />.
        </p>
        <p>
          <strong>Explannation:</strong> the trick here is to make the directory non-empty (it has a
          file inside!). So, we can push it to the upstream. Thus,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'.gitkeep'}</code>{' '}
          could be any file that you think about (empty or not doesn't matter). Choose{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'.gitkeep'}</code>{' '}
          causes it easy to understand and remember.
        </p>
        <h2 id="wrapping-up">Wrapping up</h2>
        <p>
          Those are all my notes while working with{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'git'}</code>, how I
          understand the concepts and how I work with it faster. Would love to see your use cases in
          the comment section!
        </p>
        <p>
          Happy sharing <Twemoji emoji="clinking-beer-mugs" />
        </p>
        <h2 id="references">References</h2>
        <ul>
          <li>
            <Link href="https://www.atlassian.com/git/tutorials/git-alias">Git Alias Overview</Link>
          </li>
          <li>
            <Link href="https://www.atlassian.com/git/tutorials/merging-vs-rebasing">
              Merging vs. Rebasing
            </Link>
          </li>
          <li>
            <Link href="https://git-scm.com/docs/git-push#Documentation/git-push.txt---force-with-leaseltrefnamegt">
              Git docs: --force-with-lease
            </Link>
          </li>
        </ul>
      </PostLayout>
    </>
  )
}
