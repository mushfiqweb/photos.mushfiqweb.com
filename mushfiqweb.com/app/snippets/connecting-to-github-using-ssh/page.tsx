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
  const snippet = allSnippets.find((p) => p.slug === 'connecting-to-github-using-ssh')!
  return genPostMetadata(snippet)
}

export default function Page() {
  const snippet = allSnippets.find((p) => p.slug === 'connecting-to-github-using-ssh')!

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
        <blockquote>
          <p>[!CAUTION] This instruction is for MacOS devices only.</p>
        </blockquote>
        <h2 id="githubs-ssh-key-fingerprints">GitHub's SSH key fingerprints</h2>
        <p>
          When try to clone a Github repo using{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'SSH'}</code>, you
          might get an error like this:
        </p>
        <Pre>
          <code className="language-bash showLineNumbers">
            {
              "$ git clone git@github.com:username/repo.git\nCloning into 'repo'...\nThe authenticity of host 'github.com (ip)' can't be established.\nRSA key fingerprint is SHA256:nThbg6kXU...ARLviKw6E5SY8.\nAre you sure you want to continue connecting (yes/no)?"
            }
          </code>
        </Pre>
        <p>
          This is because you're missing the public key fingerprints, the key can be used to
          validate a connection to Github remote server.
        </p>
        <p>
          You can add the following ssh key entries to your{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'~/.ssh/known_hosts'}
          </code>{' '}
          file to avoid manually verifying GitHub hosts.
        </p>
        <Pre>
          <code className="language-bash showLineNumbers">
            {'# Open the file in VSCode\n$ code ~/.ssh/known_hosts'}
          </code>
        </Pre>
        <p>Paste the following content to the file:</p>
        <Pre>
          <code className="language-txt showLineNumbers">
            {
              'github.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl\ngithub.com ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBEmKSENjQEezOmxkZMy7opKgwFB9nkt5YRrYMjNuG5N87uRgg6CLrbo5wAdT/y6v0mKV0U2w0WZ2YB/++Tpockg=\ngithub.com ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCj7ndNxQowgcQnjshcLrqPEiiphnt+VTTvDP6mHBL9j1aNUkY4Ue1gvwnGLVlOhGeYrnZaMgRK6+PKCUXaDbC7qtbW8gIkhL7aGCsOr/C56SJMy/BCZfxd1nWzAOxSDPgVsmerOBYfNqltV9/hWCqBywINIR+5dIg6JTJ72pcEpEjcYgXkE2YEFXV1JHnsKgbLWNlhScqb2UmyRkQyytRLtL+38TGxkxCflmO+5Z8CSSNY7GidjMIZ7Q4zMjA2n1nGrlTDkzwDCsw+wqFPGQA179cnfGWOWRVruj16z6XyvxvjJwbz0wQZ75XK5tKSb7FNyeIEs4TT4jk+S4dhPeAUC5y+bDYirYgM4GC7uEnztnZyaVWQ7B381AK4Qdrwt51ZqExKbQpTUNn+EjqoTwvqNj4kqx5QUCI0ThS/YkOxJCXmPUWZbhjpCg56i+2aB6CmK2JGhn57K5mj0MNdBXA4/WnwH6XoPWJzK5Nyu2zB3nAZp+S5hpQs+p1vN1/wsjk='
            }
          </code>
        </Pre>
        <p>
          It's the default SSH key fingerprints from{' '}
          <Link href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints">
            Github's documentation
          </Link>
          .
        </p>
        <h2 id="generating-ssh-key">Generating SSH key</h2>
        <p>Next you might get an error like this when trying to clone a repo:</p>
        <Pre>
          <code className="language-bash">{'Permission denied (publickey)'}</code>
        </Pre>
        <p>
          This is because you're missing the SSH key, you can generate a new one by following the
          steps below:
        </p>
        <ol>
          <li>Open your terminal and run the following command:</li>
        </ol>
        <Pre>
          <code className="language-bash">
            {'ssh-keygen -t ed25519 -C "<YOUR_EMAIL_ON_GITHUB>@gmail.com"'}
          </code>
        </Pre>
        <p>The system might ask you to enter a passphrase like this:</p>
        <Pre>
          <code className="language-bash showLineNumbers">
            {
              '> Enter passphrase (empty for no passphrase): [Type a passphrase]\n> Enter same passphrase again: [Type passphrase again]'
            }
          </code>
        </Pre>
        <Twemoji emoji="warning" /> Type a simple one and don't forget it since you'll need it
        later.
        <ol>
          <li>Start the SSH agent:</li>
        </ol>
        <Pre>
          <code className="language-bash showLineNumbers">
            {'$ eval "$(ssh-agent -s)"\n> Agent pid 59566'}
          </code>
        </Pre>
        <p>
          Then create the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'~/.ssh/config'}
          </code>{' '}
          file (or update the existing one):
        </p>
        <Pre>
          <code className="language-bash">
            {"$ touch ~/.ssh/config # create the file if it doesn't exist"}
          </code>
        </Pre>
        <p>Add the following content to the file:</p>
        <Pre>
          <code className="language-txt showLineNumbers">
            {
              'Host github.com\n  AddKeysToAgent yes\n  UseKeychain yes\n  IdentityFile ~/.ssh/id_ed25519'
            }
          </code>
        </Pre>
        <p>
          Then add your SSH private key to the ssh-agent and store your passphrase in the keychain:
        </p>
        <Pre>
          <code className="language-bash">
            {'$ ssh-add --apple-use-keychain ~/.ssh/id_ed25519'}
          </code>
        </Pre>
        <ol>
          <li>Add the new SSH key to your GitHub account:</li>
        </ol>
        <Pre>
          <code className="language-bash showLineNumbers">
            {'# Copy the SSH key to the clipboard\n$ pbcopy < ~/.ssh/id_ed25519.pub'}
          </code>
        </Pre>
        <p>
          Open your Github account and navigate to your{' '}
          <strong>
            <Link href="https://github.com/settings/keys">SSH and GPG keys</Link>
          </strong>{' '}
          page settings, then create a new SSH key.
        </p>
        <p>
          !<Link href="/static/images/ssh-keys.png">Github SSH keys</Link>
        </p>
        <p>
          Now you're good to go! Try to clone a Github repo using SSH to make sure everything is
          working.
        </p>
        <p>
          Happy securing! <Twemoji emoji="clinking-beer-mugs" />
        </p>
      </PostLayout>
    </>
  )
}
