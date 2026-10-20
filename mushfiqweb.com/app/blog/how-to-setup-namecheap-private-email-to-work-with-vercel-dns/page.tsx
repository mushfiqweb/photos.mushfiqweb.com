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
    (p) => p.slug === 'how-to-setup-namecheap-private-email-to-work-with-vercel-dns'
  )!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find(
    (p) => p.slug === 'how-to-setup-namecheap-private-email-to-work-with-vercel-dns'
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
        <p>
          I have own a Namecheap domain for my personal website at{' '}
          <Link href="https://mushfiqweb.com">mushfiqweb.com</Link> and using{' '}
          <strong>Vercel</strong> to manage my website deployments. In my case, I have to config my
          domain nameservers to point to <strong>Vercel's DNS</strong> servers. The configuration on
          Namecheap is as follows:
        </p>

        <p>
          !<Link href="/static/images/site-nameservers.png">Namecheap DNS</Link>
        </p>

        <p>
          If you use{' '}
          <Link href="https://toolbox.googleapps.com/apps/dig/#NS/">Google Admin Toolbox</Link> to
          check, then the result should look like this
        </p>

        <p>
          !<Link href="/static/images/dns-lookup.png">DNS lookup</Link>
        </p>

        <p>
          Now I've just bought a private email from Namecheap and don't know how to configure it to
          work with Vercel DNS. Namecheap has provided a{' '}
          <Link href="https://www.namecheap.com/support/knowledgebase/article.aspx/1055/2176/how-do-i-set-up-my-private-email-to-work/">
            guide
          </Link>{' '}
          on how to do it, but it's not working for me. So if you have the same problem, here's how
          to do it.
        </p>

        <h2 id="get-dns-records-from-namecheap">Get DNS records from Namecheap</h2>

        <p>
          Namecheap will provide you a list of essential DNS records that you need to configure. You
          can find it under <strong>Account / Dashboard / Private Email</strong> panel:
        </p>

        <p>
          !<Link href="/static/images/dns-records.png">DNS records</Link>
        </p>

        <p>
          In addition to those, you also need a record for DKIM (DomainKeys Identified Mail). Scroll
          to the <strong>Email Security</strong> section and click <strong>Add DKIM record</strong>{' '}
          (or <strong>Show DKIM</strong> to see the existing records).
        </p>

        <p>
          !<Link href="/static/images/dkim-record.png">DKIM record</Link>
        </p>

        <p>That's all the DNS records (4 in total) you need to configure.</p>

        <h2 id="add-dns-records-to-vercel">Add DNS records to Vercel</h2>

        <p>
          Login to your Vercel account and navigate to <strong>Domains</strong> page. Your managed
          domains should be listed there.
        </p>

        <p>
          !<Link href="/static/images/vercel-domains.png">Vercel domains</Link>
        </p>

        <p>
          Click on the domain you want to add DNS records, and on the first section, you will see a
          form to add your DNS records here:
        </p>

        <p>
          !<Link href="/static/images/vercel-dns-records-form.png">Add DNS records</Link>
        </p>

        <p>
          Now add all the 4 DNS records you got from Namecheap here. Please keep in my that for the
          record for DKIM, the <strong>Name</strong> should be{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'default._domainkey'}
          </code>
          , and the <strong>Value</strong> is this part of the record:
        </p>

        <Pre>
          <code className="language-txt">{'default._domainkey IN TXT ("<DKIM_VALUE>");'}</code>
        </Pre>

        <p>
          After you've added all the DNS records, they should be listed in the table right below the
          form:
        </p>

        <p>
          !<Link href="/static/images/vercel-dns-records.png">DNS records</Link>
        </p>

        <p>
          That's it! Namecheap said that you need to wait for 1-2 hours for the DNS records to
          propagate, but it should be done in a few minutes.
        </p>

        <p>
          Now you can try send a mail to your private email address and see if it works by logging
          into your account through <Link href="https://privateemail.com/">Webmail</Link>. You
          should see the mails in your inbox.
        </p>

        <p>
          !<Link href="/static/images/private-email.png">Webmail</Link>
        </p>

        <h2 id="bonus-setting-up-gmail-as-your-email-client">
          Bonus: Setting up Gmail as your Email Client
        </h2>

        <p>
          You might notice that the Private Email UI is not very user-friendly. So I would highly
          recommend you to set up Gmail as your email client to make it easier to manage your
          emails. Compose your emails, send them, and check them in your Gmail inbox would be much
          more convenient since you must be more familiar with Gmail.
        </p>

        <p>
          Namecheap has provided a{' '}
          <Link href="https://www.namecheap.com/support/knowledgebase/article.aspx/9188/2175/gmail-fetcher-setup-for-namecheap-private-email/">
            detailed guide
          </Link>{' '}
          on how to do it. You can just follow the steps and you should be good to go.
        </p>

        <p>
          One thing to note is that you should tick the <strong>"Label incoming messages"</strong>{' '}
          checkbox in the Email Settings step to make it easier to manage your emails.
        </p>

        <p>
          !<Link href="/static/images/gmail-conf.png">Gmail fetcher</Link>
        </p>

        <p>
          Your mails should be fetched automatically and you can find them under the{' '}
          <strong>Labels</strong> section in your Gmail inbox.
        </p>

        <p>
          !<Link href="/static/images/gmail-labels.png">Gmail labels</Link>
        </p>

        <p>
          When composing your emails, make sure to select the correct email address from the{' '}
          <strong>From</strong> field.
        </p>

        <p>
          !<Link href="/static/images/gmail-compose-new-mail.png">Gmail compose</Link>
        </p>

        <p>
          Happy emailing! <Twemoji emoji="clinking-beer-mugs" />
        </p>
      </PostLayout>
    </>
  )
}
