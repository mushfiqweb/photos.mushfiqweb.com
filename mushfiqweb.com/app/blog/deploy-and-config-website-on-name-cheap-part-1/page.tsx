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
  const post = allBlogs.find((p) => p.slug === 'deploy-and-config-website-on-name-cheap-part-1')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'deploy-and-config-website-on-name-cheap-part-1')!

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
          I’ve always wanted to have my own personal site, but due to ~~laziness~~ lack of time, I
          only got to work on it recently while staying at home during the quarantine.
        </p>

        <p>
          In this post, I’ll guide you on how to set up and configure a <strong>domain</strong> and{' '}
          <strong>web hosting</strong> that you purchased on Namecheap (assuming you already have
          your own source code <Twemoji emoji="smiling-face-with-sunglasses" />)
        </p>

        <h2 id="why-this-tutorial">Why this tutorial?</h2>

        <p>
          Even though Namecheap has a{' '}
          <Link href="https://www.namecheap.com/resource-center/tutorials/building-your-first-website/">
            detailed tutorial
          </Link>{' '}
          on building a website from scratch, swimming <Twemoji emoji="man-swimming" /> through a
          sea of documentation isn’t that easy.
        </p>

        <p>
          !<Link href="/static/images/swim.gif">Kid swimming</Link>
        </p>

        <p>
          So, I wrote this tutorial to share what I learned and did in <strong>2 days</strong> to
          ~~remind myself if I forget in the future~~ help you set up your site faster{' '}
          <Twemoji emoji="beaming-face-with-smiling-eyes" />.
        </p>

        <h2 id="what-do-you-need-for-a-complete-site">What do you need for a complete site?</h2>

        <p>
          At first, I thought I only needed to buy a <strong>domain</strong> and push my code there.
          But that’s not enough; the 3 basics to run a website are: <strong>domain name</strong>,{' '}
          <strong>hosting</strong>, and <strong>platform</strong>
        </p>

        <ul>
          <li>
            <strong>Domain name</strong> <Twemoji emoji="magnifying-glass-tilted-right" />: This is
            your website address, e.g.,{' '}
            <em>
              <Link href="http://www.thepondhub.com/">pondhub.com</Link>
            </em>
            ,{' '}
            <em>
              <Link href="https://mushfiqweb.com">mushfiqweb.com</Link>
            </em>{' '}
            ... Think of it like your home address, making it easier to find than using an IP
            address.
          </li>
          <li>
            <strong>Hosting</strong> <Twemoji emoji="house" />: This is where all your website’s
            data and information are stored.
          </li>
        </ul>

        <blockquote>
          <p>
            -- Web hosting, in simple terms, is a remote hard drive connected to your computer via
            (you guessed it) the Internet.
          </p>
        </blockquote>

        <p>If the domain is your home address, then hosting is your actual house.</p>

        <ul>
          <li>
            <strong>Platform</strong> <Twemoji emoji="laptop" />: These are the tools to build your
            website, with the source code being the main product.
          </li>
        </ul>

        <p>
          =&gt; You need to buy both <strong>domain</strong> and <strong>hosting</strong> for a
          complete site.
        </p>

        <p>
          I decided to buy both on Namecheap ~~due to lack of experience~~ for easy configuration
          and support from their team <Twemoji emoji="beaming-face-with-smiling-eyes" />
        </p>

        <p>
          Go to{' '}
          <Link href="https://www.namecheap.com/domains/">https://www.namecheap.com/domains/</Link>{' '}
          (make sure to create an account first), search for a domain, click{' '}
          <strong>Add To Cart</strong>. Namecheap will suggest buying <strong>Web Hosting</strong>{' '}
          and <strong>PositiveSSL</strong> (which is for securing your site—more on that{' '}
          <Link href="#activate-ssl-certificate">below</Link>).
        </p>

        <p>
          !<Link href="/static/images/namecheap1.png">namecheap domain search</Link>
        </p>

        <p>
          Buying on Namecheap is pretty straightforward. Just provide the required information, pay
          up <Twemoji emoji="money-with-wings" />
          <Twemoji emoji="money-with-wings" />
          <Twemoji emoji="money-with-wings" /> and you’re done.
        </p>

        <p>
          !<Link href="/static/images/bill.png">namecheap bill</Link>
        </p>

        <h2 id="how-to-connect-domain-and-hosting">How to connect domain and hosting?</h2>

        <p>
          Your house and address are obviously in one place, so why connect them{' '}
          <Twemoji emoji="eyes" />?
        </p>

        <p>
          The simple reason is that a house address (<strong>Web hosting</strong>) is actually a
          sequence of numbers (<strong>IP Address</strong>, e.g., <strong>127.0.0.1</strong>). You
          need to go to that address to access the website.
        </p>

        <p>
          =&gt; You need to connect the <strong>domain name</strong> to <strong>hosting</strong> so
          people can get to the right place using an easy-to-remember address.
        </p>

        <p>
          !<Link href="/static/images/dns.jpg">name cheap dns</Link>
        </p>

        <p>
          If you buy both <strong>domain</strong> and <strong>hosting</strong> on{' '}
          <strong>Namecheap</strong>, the configuration is quite easy:
        </p>

        <ul>
          <li>
            Go to <strong>Account / Dashboard / Domain List</strong>, click <strong>Manage</strong>{' '}
            on the domain you just bought.
          </li>
          <li>
            Select <strong>Namecheap Web Hosting DNS</strong> in the <strong>Nameservers</strong>{' '}
            section.
          </li>
          <li>
            Click save (the <Twemoji emoji="check-mark-button" /> icon at the end of the line).
          </li>
          <li>Done.</li>
        </ul>

        <p>
          Why can we access the website using ~~<strong>domain name</strong>~~ a simpler address{' '}
          <Twemoji emoji="eyes" />?
        </p>

        <p>It’s all thanks to DNS (I won’t dive into this concept).</p>

        <blockquote>
          <p>
            DNS (domain name system) is simply{' '}
            <strong>
              <em>The Phone Book of the Internet</em>
            </strong>
            . You can dial the number (IP Address) directly to call your crush (hosting), or look
            them up by name (domain) in your contact list.
          </p>
        </blockquote>

        <h2 id="activate-ssl-certificate">Activate SSL Certificate</h2>

        <p>
          If you didn’t buy <strong>PositiveSSL</strong>, you can skip this section.
        </p>

        <p>
          <strong>SSL</strong> (Secure Sockets Layer) is a security layer for your website,
          protecting it with <strong>HTTPS</strong> with two main purposes:
        </p>

        <ul>
          <li>Ensuring that the data going to and from your site is always encrypted.</li>
          <li>Verifying that the incoming and outgoing data is accurate.</li>
        </ul>

        <p>
          !<Link href="/static/images/https.png">SSL certificate</Link>
        </p>

        <p>
          Websites with <strong>SSL Certificate</strong> are marked as <strong>Secured</strong> on
          browsers, ensuring user trust.
        </p>

        <p>
          The simplest way to activate this is through <strong>cPanel</strong> on{' '}
          <strong>Namecheap</strong>:
        </p>

        <p>
          !<Link href="/static/images/cpanel.png">Go to cPanel</Link>
        </p>

        <ul>
          <li>
            Go to <strong>Account / Dashboard / Domain List</strong>, select the{' '}
            <strong>Products</strong> tab.
          </li>
          <li>
            Click <strong>Go to cPanel</strong>, log in with your <strong>Namecheap</strong>{' '}
            account.
          </li>
          <li>
            In <strong>cPanel</strong>, open <strong>Namecheap SSL</strong>.
          </li>
          <li>
            Click <strong>Activate</strong> PositiveSSL.
          </li>
        </ul>

        <p>
          Wait for about 5-10 minutes, then click <strong>sync</strong> to see if it’s been
          successfully activated (if not, wait a bit more and <strong>sync</strong> again until the
          status changes to <strong>active</strong>).
        </p>

        <p>
          !<Link href="/static/images/cpanel3.png">Go to cPanel</Link>
        </p>

        <h2 id="wrap-up">Wrap Up</h2>

        <p>
          By now, you’ve completed 90% of your website setup <Twemoji emoji="astonished-face" />, in
          the <Link href="/blog/deploy-and-config-website-on-namecheap-part-2">next part</Link>,
          I’ll guide you through the remaining ~~90%~~ 10%{' '}
          <Twemoji emoji="smiling-face-with-tear" />, including:
        </p>

        <ul>
          <li>
            Understanding the folder structure on the server (<strong>web hosting</strong>).
          </li>
          <li>
            Using <Link href="https://filezilla-project.org/">FileZilla</Link> to push code to the
            server.
          </li>
          <li>
            Setting up 2FA (<strong>Two-Factor Authentication</strong>) to enhance security.
          </li>
        </ul>

        <p>
          Thanks a lot for reading <Twemoji emoji="folded-hands" />, leave your thoughts in the
          comments below. Thank you so much!
        </p>
      </PostLayout>
    </>
  )
}
