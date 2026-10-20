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
  const post = allBlogs.find((p) => p.slug === 'mac-dev-essentials')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'mac-dev-essentials')!

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
          New Mac? Let's get coding quickly! This guide provides the essential setup for web
          development on a fresh macOS install. You'll be coding in about 30 minutes{' '}
          <Twemoji emoji="love-you-gesture" />.
        </p>

        <h2 id="quick-system-tweaks">Quick System Tweaks</h2>

        <ol>
          <li>
            <strong>Mouse:</strong>
          </li>
          <li>Increase tracking speed.</li>
          <li>Enable "Natural scrolling."</li>
          <li>Right-click on the right side.</li>
          <li>Enable Smart zoom.</li>
          <li>
            <strong>Keyboard:</strong>
          </li>
          <li>Set key repeat to "fast" and delay to "short".</li>
          <li>
            <strong>Appearance:</strong>
          </li>
          <li>Consider Light Mode.</li>
          <li>Enable Night Shift (Sunset to Sunrise) for eye protection.</li>
        </ol>

        <img src="/static/images/my-working-space.png" alt="My working space" />

        <h2 id="essential-apps--tools">Essential Apps &amp; Tools</h2>

        <ol>
          <li>
            <strong>Web Browser:</strong> Install{' '}
            <Link href="https://www.google.com/chrome/">Google Chrome</Link> (or your preferred
            browser).
          </li>
        </ol>

        <ol>
          <li>
            <strong>iTerm2:</strong> Download and install{' '}
            <Link href="https://iterm2.com/">iTerm2</Link> (a better terminal). Use your favorite
            theme, like{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'Solarized Light'}
            </code>
            .
          </li>
        </ol>

        <ol>
          <li>
            <strong>Homebrew:</strong> Install <Link href="https://brew.sh/">Homebrew</Link>, a
            macOS package manager:
          </li>
        </ol>

        <Pre>
          <code className="language-bash">
            {
              '    xcode-select --install\n    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"\n    brew doctor # verify installation'
            }
          </code>
        </Pre>

        <ol>
          <li>
            <strong>Git:</strong> Install and configure Git:
          </li>
        </ol>

        <Pre>
          <code className="language-bash">
            {
              '    brew install git\n    which git # verify installation\n    git config --global user.name "your-github-username"\n    git config --global user.email "your@email.com"'
            }
          </code>
        </Pre>

        <ol>
          <li>
            <strong>Visual Studio Code:</strong> Install{' '}
            <Link href="https://code.visualstudio.com/">VS Code</Link> (or your preferred IDE).
            Consider these extensions:
          </li>
        </ol>

        <ul>
          <li>
            <Link href="https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig">
              EditorConfig
            </Link>
          </li>
          <li>
            <Link href="https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker">
              Code Spell Checker
            </Link>
          </li>
          <li>
            <Link href="https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv">
              DotENV
            </Link>
          </li>
          <li>
            <Link href="https://marketplace.visualstudio.com/items?itemName=waderyan.gitblame">
              Git Blame
            </Link>
          </li>
          <li>
            <Link href="https://marketplace.visualstudio.com/items?itemName=supermaven.supermaven">
              Supermaven
            </Link>
          </li>
          <li>
            <Link href="https://marketplace.visualstudio.com/items?itemName=ChakrounAnas.turbo-console-log">
              Turbo Console Log
            </Link>
          </li>
          <li>
            <Link href="https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss">
              TailwindCSS IntelliSense
            </Link>
          </li>
        </ul>

        <img src="/static/images/vs-code-preview.png" alt="My VS Code preview" />

        <ol>
          <li>
            <strong>Python:</strong> Install Python using Pyenv:
          </li>
        </ol>

        <Pre>
          <code className="language-bash">
            {
              '    brew install pyenv\n    # Follow terminal instructions, and add `eval "$(pyenv init -)"` to .bash_profile\n    source ~/.bash_profile\n    pyenv install --list # List available versions\n    pyenv install 3.12.x # Install the latest (example)'
            }
          </code>
        </Pre>

        <ol>
          <li>
            <strong>Node.js:</strong> Install Node.js with NVM:
          </li>
        </ol>

        <Pre>
          <code className="language-bash">
            {
              '    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash\n    command -v nvm # Verify installation\n    nvm install node # Install latest\n    nvm use node # Use latest'
            }
          </code>
        </Pre>

        <p>
          Install <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'pnpm'}</code>{' '}
          for fast package management:
        </p>

        <Pre>
          <code className="language-bash">{'    npm install -g pnpm'}</code>
        </Pre>

        <ol>
          <li>
            <strong>Ruby:</strong> Install Ruby using rbenv:
          </li>
        </ol>

        <Pre>
          <code className="language-bash">
            {
              '    brew install rbenv\n    # add `eval "$(rbenv init -)"` to .bash_profile\n    source ~/.bash_profile\n     rbenv install --list\n     rbenv install 3.x.x # Replace 3.x.x with the latest'
            }
          </code>
        </Pre>

        <ol>
          <li>
            <strong>Databases:</strong>
          </li>
        </ol>

        <ul>
          <li>
            <strong>PostgreSQL:</strong>
          </li>
        </ul>

        <Pre>
          <code className="language-bash">
            {'      brew install postgresql\n      brew services start postgresql'}
          </code>
        </Pre>

        <Pre>
          <code className="language-bash">
            {
              '      # Create a new user\n      sudo -u postgres createuser -s <username>\n\n      #  Create a database\n      sudo -u postgres createdb <database-name> -O <username>\n\n      # Connect to the database to verify if it works\n      psql -d <database-name> -U <username>'
            }
          </code>
        </Pre>

        <ul>
          <li>
            <strong>Redis:</strong>
          </li>
        </ul>

        <Pre>
          <code className="language-bash">
            {
              '      brew install redis\n      brew services start redis\n       redis-cli ping # Test the connection to the server'
            }
          </code>
        </Pre>

        <ol>
          <li>
            <strong>Applications:</strong>
          </li>
        </ol>

        <ul>
          <li>
            <Link href="https://one.one.one.one/">Cloudflare WARP</Link> (faster, secure internet)
          </li>
          <li>
            <Link href="https://www.postman.com/">Postman</Link> (API testing)
          </li>
          <li>
            <Link href="https://slack.com/">Slack</Link> (team messaging)
          </li>
          <li>
            <Link href="https://monosnap.com/">Monosnap</Link> (screenshot tool)
          </li>
          <li>
            <Link href="https://www.spotify.com/">Spotify</Link> (music)
          </li>
          <li>
            <Link href="https://evkeyvn.com/">EVKey</Link> (Vietnamese typing, if applicable)
          </li>
        </ul>

        <img src="/static/images/mac-apps.png" alt="My applications" />

        <h2 id="optional-tools">Optional Tools:</h2>

        <ul>
          <li>Docker</li>
          <li>Git GUI (Sourcetree, etc)</li>
          <li>direnv</li>
        </ul>

        <p>That's it – the essentials for quick web development setup on macOS!</p>

        <p>
          Let me know if you have questions <Twemoji emoji="clinking-beer-mugs" />.
        </p>
      </PostLayout>
    </>
  )
}
