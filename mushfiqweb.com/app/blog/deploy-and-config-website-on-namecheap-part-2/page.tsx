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
  const post = allBlogs.find((p) => p.slug === 'deploy-and-config-website-on-namecheap-part-2')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'deploy-and-config-website-on-namecheap-part-2')!

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
          In the{' '}
          <Link href="/blog/deploy-and-config-website-on-name-cheap-part-1">previous part</Link>, I
          guided you through buying and connecting your <strong>domain</strong> to{' '}
          <strong>hosting</strong>, and activating the <strong>SSL Certificate</strong>.
        </p>

        <p>
          In this part, I’ll show you how to push your code to the <strong>server</strong> and get
          your website live <Twemoji emoji="rocket" />
        </p>

        <h2 id="whats-on-the-server-">
          What’s on the server <Twemoji emoji="eyes" size="base" />?
        </h2>

        <p>
          To understand the folder structure on the server, go to <strong>cPanel</strong> (I showed
          you how to access it in the previous post). Open <strong>File Manager</strong> in the{' '}
          <strong>Files</strong> section.
        </p>

        <p>
          !<Link href="/static/images/file-manager.png">cpanel file manager</Link>
        </p>

        <p>
          This is the folder structure on the server! By default, we’ll be in the{' '}
          <strong>root directory</strong>:{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'/home/<cpanel-username>'}
          </code>
          .
        </p>

        <p>
          The folder we need to focus on is{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'./public_html'}
          </code>
          , which contains all the source code (<em>html</em>, <em>css</em>, <em>js</em>) of the
          website. Our main goal is to put all the code files here.
        </p>

        <p>
          <strong>File Manager</strong> allows direct upload of files but not{' '}
          <strong>folders</strong> <Twemoji emoji="man-getting-massage" />. That’s why I use a tool{' '}
          <strong>Namecheap</strong>{' '}
          <Link href="https://www.namecheap.com/support/knowledgebase/article.aspx/1279/205/how-to-set-up-filezilla/">
            recommends
          </Link>
          , which is <Link href="https://filezilla-project.org/">FileZilla</Link>.
        </p>

        <h2 id="authorize-filezilla">Authorize FileZilla</h2>

        <p>
          <strong>FileZilla</strong> will connect and <Twemoji emoji="delivery-truck" /> push the
          code to the <strong>server</strong> by accessing the server using FTP (
          <strong>File Transfer Protocol</strong>).
        </p>

        <p>
          For a <strong>middle-man</strong>{' '}
          <Twemoji emoji="man-construction-worker-medium-light-skin-tone" /> to help us upload files
          to the <strong>server</strong>, we need to grant access to that tool =&gt; Create an{' '}
          <Link href="https://www.namecheap.com/support/knowledgebase/article.aspx/9523/205/how-to-create-an-ftp-account">
            <strong>FTP Account</strong>
          </Link>
          , and <strong>FileZilla</strong> will use this account to upload code for us.
        </p>

        <p>
          Creating an <strong>FTP Account</strong> is very simple:
        </p>

        <ul>
          <li>
            Go to <strong>cPanel</strong>, click <strong>FTP Accounts</strong> in the{' '}
            <strong>Files</strong> section.
          </li>
          <li>
            Enter the <strong>username</strong> and <strong>password</strong> (don’t forget it{' '}
            <Twemoji emoji="grinning-face-with-sweat" />
            ).
          </li>
        </ul>

        <p>
          !<Link href="/static/images/ftp.png">FTP Account</Link>
        </p>

        <p>
          <strong>
            Note <Twemoji emoji="warning" />:
          </strong>{' '}
          When creating an <strong>FTP Account</strong>, make sure to set the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'access-directory'}
          </code>{' '}
          of this account to the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'root-directory'}
          </code>
          . Otherwise, this account won’t have access to the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'./public_html'}
          </code>{' '}
          folder <Twemoji emoji="grinning-face-with-sweat" />
        </p>

        <h2 id="setup-filezilla">Setup FileZilla</h2>

        <p>
          After <Link href="https://filezilla-project.org/">downloading</Link> and installing{' '}
          <strong>FileZilla</strong>, we will connect to the server using the{' '}
          <strong>FTP Account</strong> we just created.
        </p>

        <p>
          <Link href="https://www.namecheap.com/support/knowledgebase/article.aspx/1279/205/how-to-set-up-filezilla/#quickconnect">
            Quick connect
          </Link>{' '}
          is the simplest way to connect to the server. You’ll need 4 pieces of information:
        </p>

        <ul>
          <li>
            <strong>Host name</strong>:{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'ftpes://<host-name>'}
            </code>{' '}
            (don’t forget the{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'ftpes://'}</code>{' '}
            prefix!)
          </li>
        </ul>

        <p>
          !<Link href="/static/images/hostname.png">Host name</Link>
        </p>

        <p>
          <em>
            (The host name is right at the <strong>URL</strong> in <strong>cPanel</strong>)
          </em>
          .
        </p>

        <ul>
          <li>
            <strong>Username</strong>: The <strong>FTP Account</strong> username you just created,
            in this format:{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'<ftp-account-name>@<your-domain>'}
            </code>
          </li>
          <li>
            <strong>Password</strong>
          </li>
          <li>
            <strong>Port</strong>: default is{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'21'}</code>.
          </li>
        </ul>

        <p>
          Enter all the information and click <strong>Quickconnect</strong>. You should see a{' '}
          <strong>successful</strong> signal to proceed.
        </p>

        <p>
          !<Link href="/static/images/filezilla.png">Connect to server via FileZilla</Link>
        </p>

        <p>
          _(Don’t worry if you see the <strong>port</strong> disappear, <strong>FileZilla</strong>{' '}
          does that automatically <Twemoji emoji="face-with-steam-from-nose" />
          )_
        </p>

        <h2 id="push-code-to-the-server">Push code to the server</h2>

        <p>
          The complicated part is done <Twemoji emoji="see-no-evil-monkey" />{' '}
          <Twemoji emoji="hear-no-evil-monkey" />, now it’s time to push your code to the{' '}
          <strong>server</strong>!
        </p>

        <div>
          <img src="/static/images/close.gif" alt="close" style={{ margin: '0 auto' }} />
        </div>

        <p>
          In <strong>FileZilla</strong>, there are 2 sections:
        </p>

        <ul>
          <li>
            <strong>Local site</strong>: This contains all the folders on your machine. Navigate to
            the folder containing your code (make sure it’s the built code). In my case, it’s the{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'./public'}</code>{' '}
            folder (it could be{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'./build'}</code>,{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'./dist'}</code>,{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'./public'}</code>{' '}
            ... depending on your app configuration).
          </li>
        </ul>

        <ul>
          <li>
            <strong>Remote site</strong>: This shows all the folders on the <strong>server</strong>.
            Navigate to{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'./public_html'}
            </code>
            .
          </li>
        </ul>

        <p>
          !<Link href="/static/images/filezilla2.png">Close</Link>
        </p>

        <p>
          Select all files in <strong>Local</strong> and drag them over to <strong>Remote</strong>{' '}
          ... and it’s done <Twemoji emoji="party-popper" />
        </p>

        <p>
          Now just open your site, check the results, and fix typos if any{' '}
          <Twemoji emoji="grinning-squinting-face" />
          <Twemoji emoji="grinning-squinting-face" />
          <Twemoji emoji="grinning-squinting-face" />
        </p>

        <img
          src="https://media.giphy.com/media/SfYTJuxdAbsVW/giphy.gif"
          alt="done"
          style={{ margin: '0 auto' }}
        />

        <h2 id="two-factor-authentication-optional">Two-Factor Authentication (Optional)</h2>

        <p>
          Two-Factor Authentication (<strong>2FA</strong>) is an additional security layer for your{' '}
          <strong>Namecheap</strong> account (you need to pass both layers to access your resources,
          so you won’t have to worry if your account gets compromised, since the second layer is on
          a separate device).
        </p>

        <p>
          The first layer is your <strong>username/password</strong>, and the second layer can be
          one of the following:
        </p>

        <ul>
          <li>
            <strong>U2F (Universal 2nd Factor)</strong>: Using a{' '}
            <Link href="https://www.namecheap.com/support/knowledgebase/article.aspx/10102/45/how-can-i-use-the-u2f-method-for-twofactor-authentication">
              physical device
            </Link>{' '}
            like a key to unlock the account.
          </li>
          <li>
            <strong>TOTP (Time-based One-Time Password)</strong>: Using a short-term password on
            another device via an <strong>Authentication app</strong> like:{' '}
            <Link href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&amp;hl=en">
              Google Authenticator
            </Link>
            , <Link href="https://authy.com/">Authy</Link> ...
          </li>
          <li>
            <strong>Text Message Authentication</strong>: Using SMS on your phone.
          </li>
        </ul>

        <p>
          I chose <strong>TOTP</strong> via the{' '}
          <Link href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&amp;hl=en">
            Google Authenticator
          </Link>{' '}
          app.
        </p>

        <p>
          Download the app on your phone, then go to <strong>cPanel</strong> and open{' '}
          <strong>Two-Factor Authentication</strong> in the <strong>Security</strong> section, scan
          the <strong>QR Code</strong>, and you’re done!
        </p>

        <p>
          From now on, Namecheap will ask for the <strong>TOTP</strong> code from the app whenever
          you log in to ensure security.
        </p>

        <h2 id="wrap-up">Wrap Up</h2>

        <p>
          I hope this tutorial helps you understand more about the server and how to host your own
          website.
        </p>

        <p>
          If you don’t want to buy hosting, you can use other <strong>Free Hosting Services</strong>{' '}
          like: <strong>Github Page</strong>, <strong>Heroku</strong>, <strong>Netlify</strong>,{' '}
          <strong>Vercel</strong> ... (all of them support <strong>build tools</strong> and{' '}
          <strong>configuration</strong>, so you just need to <strong>connect</strong> your source
          code and you’re good to go).
        </p>

        <p>Happy deploying!</p>

        <h2 id="references">References</h2>

        <ul>
          <li>
            <Link href="https://www.namecheap.com/resource-center/tutorials/building-your-first-website/">
              https://www.namecheap.com/resource-center/tutorials/building-your-first-website/
            </Link>
          </li>
          <li>
            <Link href="https://www.namecheap.com/support/knowledgebase/article.aspx/1279/205/how-to-set-up-filezilla/">
              https://www.namecheap.com/support/knowledgebase/article.aspx/1279/205/how-to-set-up-filezilla/
            </Link>
          </li>
          <li>
            <Link href="https://www.namecheap.com/security/2fa-two-factor-authentication/">
              https://www.namecheap.com/security/2fa-two-factor-authentication/
            </Link>
          </li>
        </ul>
      </PostLayout>
    </>
  )
}
