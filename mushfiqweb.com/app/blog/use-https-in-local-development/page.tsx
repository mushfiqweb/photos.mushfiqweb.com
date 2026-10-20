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
  const post = allBlogs.find((p) => p.slug === 'use-https-in-local-development')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'use-https-in-local-development')!

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
        <blockquote>
          <p>
            When do we need <strong>HTTPS</strong> in <strong>local</strong>?{' '}
            <Twemoji emoji="thinking-face" />
          </p>
        </blockquote>
        <h2 id="problem">Problem</h2>
        <p>
          In most cases, we don't need <strong>HTTPS</strong> while developing app in{' '}
          <strong>local</strong>. However, if your app has features that require{' '}
          <strong>authentication</strong> with a third parties, or listen to{' '}
          <strong>webhooks</strong> from another app... And those third parties require your app
          must adopt <strong>HTTPS</strong> in order to receive their request, then how would you
          do?
        </p>
        <p>
          Of course, it will be <strong>HTTPS</strong> in <strong>production</strong>, but how to
          have a secure connection while developing your app locally?
        </p>
        <p>
          We have several options like using <Link href="https://pagekite.net/">PageKite</Link> or{' '}
          <Link href="https://ngrok.com/">ngrok</Link> to create an <strong>HTTPS tunnel</strong>{' '}
          that points to your <strong>localhost</strong>, but these services have a few drawbacks:
        </p>
        <ul>
          <li>Limited number of tunnels/requests to use at a time on free plan.</li>
        </ul>
        <ul>
          <li>
            Unable to use a specific <strong>domain</strong>, it will be different and we have to
            re-config the app's environment variable every time developing the app.
          </li>
        </ul>
        <ul>
          <li>
            And they're ~freaking~ <strong>slowww</strong>{' '}
            <Twemoji emoji="face-with-symbols-on-mouth" /> which wastes lots of time
            developing/testing our app.
          </li>
        </ul>
        <p>
          If you're facing similar issues, here is the solution{' '}
          <Twemoji emoji="backhand-index-pointing-down" />
        </p>
        <h2 id="solution">Solution</h2>
        <p>
          The solution here is to use <Link href="https://www.openssl.org/">OpenSSL</Link> to
          generate <strong>SSL certificates</strong> and create an HTTPS server with those{' '}
          <strong>certificates</strong>.
        </p>
        <h3 id="-generate-root-ssl-certificate">
          <Twemoji emoji="keycap-1" /> Generate Root SSL Certificate
        </h3>
        <p>
          First, we need to create a{' '}
          <Link href="https://support.dnsimple.com/articles/what-is-ssl-root-certificate/">
            Root SSL Certificate
          </Link>{' '}
          to sign any certificate that we will use for <strong>localhost</strong>.
        </p>
        <p>
          Use the following command to create a{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'key'}</code> to
          generate <strong>Root SSL Certificate</strong> in the next step:
        </p>
        <Pre>
          <code className="language-bash">{'openssl genrsa -des3 -out rootCA.key 2048'}</code>
        </Pre>
        <p>
          !<Link href="/static/images/root-ca-key.png">root-ca-key</Link>
        </p>
        <p>
          You will be asked to enter a <strong>pass phrase</strong> to generate the key, just enter
          a random string and verify it.
        </p>
        <Twemoji emoji="warning" /> Remember this **pass phrase** as you will need it in the next
        steps!
        <p>
          The generated key will be saved in{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'rootCA.key'}</code>{' '}
          file, use it to generate <strong>Root SSL Certificate</strong> with the following command:
        </p>
        <Pre>
          <code className="language-bash">
            {'openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 7300 -out rootCA.pem'}
          </code>
        </Pre>
        <p>
          !<Link href="/static/images/root-ca-pem.png">root-ca-pem</Link>
        </p>
        <p>
          Fill in the required information (the <strong>pass phrase</strong> must match the one that
          was used to generate the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'rootCA.key'}</code>{' '}
          in the first step!)
        </p>
        <p>
          This certificate will be saved in{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'rootCA.pem'}</code>{' '}
          file.
        </p>
        <h3 id="-trust-the-root-ssl-certificate">
          <Twemoji emoji="keycap-2" /> Trust the Root SSL Certificate
        </h3>
        <p>
          To use the certificates generated by the <strong>Root SSL Certificate</strong> we need to
          tell the Operating System to trust the <strong>Root Certificate</strong>.
        </p>
        <p>
          Open the <strong>Keychain Access</strong> app (MacOS), select <strong>Certificate</strong>{' '}
          tab:
        </p>
        <p>
          !<Link href="/static/images/keychain-access.png">keychain-access</Link>
        </p>
        <p>
          Import{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'rootCA.pem'}</code>{' '}
          by dragging in or navigating to <strong>File / Import items...</strong>.
        </p>
        <p>
          Then <strong>Right click / Get Info</strong> (or <strong>Double click</strong>) on the
          imported certificate
        </p>
        <p>
          !<Link href="/static/images/cert-trust-setting.png">cert-trust-setting</Link>
        </p>
        <p>
          Expand the <strong>Trust</strong> tab, select <strong>Always Trust</strong> in the first
          setting, then save it.
        </p>
        <p>
          The <strong>Keychain Access</strong> will then show a message like{' '}
          <strong>"This certificate is marked as trusted for this account"</strong> which means you
          have successfully trusted the <strong>Root SSL Certificate</strong>{' '}
          <Twemoji emoji="party-popper" />.
        </p>
        <h3 id="-create-local-ssl-certificate">
          <Twemoji emoji="keycap-3" /> Create local SSL Certificate
        </h3>
        <p>
          Now, we will use the trusted <strong>Root SSL Certificate</strong> to generate an{' '}
          <strong>SSL Certificate</strong> to use in <strong>localhost</strong>.
        </p>
        <h4 id="step-1">Step 1</h4>
        <p>
          Create a config file named{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'server.csr.cnf'}
          </code>{' '}
          with the following cotent. <strong>OpenSSL</strong> will use this file to generate the{' '}
          <strong>Certificate key</strong>:
        </p>
        <CodeTitle lang="bash" title="server.csr.cnf showLineNumbers" />
        <Pre>
          <code className="language-bash">
            {
              '[req]\ndefault_bits = 2048\nprompt = no\ndefault_md = sha256\ndistinguished_name = dn\n\n[dn]\nC=US\nST=RandomState\nL=RandomCity\nO=RandomOrganization\nOU=RandomOrganizationUnit\nemailAddress=hello@example.com\nCN = localhost'
            }
          </code>
        </Pre>
        <p>
          Create a <strong>Certificate key</strong> with the above configs and save it to the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'server.key'}</code>{' '}
          file:
        </p>
        <Pre>
          <code className="language-bash">
            {
              'openssl req -new -sha256 -nodes -out server.csr -newkey rsa:2048 -keyout server.key -config <( cat server.csr.cnf )'
            }
          </code>
        </Pre>
        <p>
          !<Link href="/static/images/server-key.png">server-key</Link>
        </p>
        <h4 id="step-2">Step 2</h4>
        <p>
          Create a{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'v3.ext'}</code> file
          with the configurations below to generate the certificate:
        </p>
        <CodeTitle lang="bash" title="v3.ext showLineNumbers" />
        <Pre>
          <code className="language-bash">
            {
              'authorityKeyIdentifier=keyid,issuer\nbasicConstraints=CA:FALSE\nkeyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment\nsubjectAltName = @alt_names\n\n[alt_names]\nDNS.1 = localhost'
            }
          </code>
        </Pre>
        <p>
          Generate certificate with <strong>Root SSL Certificate</strong> and{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'v3.ext'}</code>{' '}
          config file then save to{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'server.crt'}</code>{' '}
          with this command:
        </p>
        <Pre>
          <code className="language-bash">
            {
              'openssl x509 -req -in server.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out server.crt -days 825 -sha256 -extfile v3.ext'
            }
          </code>
        </Pre>
        <Twemoji emoji="warning" /> Remember to use the same pass phrase in the steps above!
        <p>
          !<Link href="/static/images/server-cert.png">server-cert</Link>
        </p>
        <p>
          Done <Twemoji emoji="party-popper" />
          <Twemoji emoji="party-popper" />
          <Twemoji emoji="party-popper" />
        </p>
        <p>
          Now in the folder where you just created certificate will contain 2 files:{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'server.key'}</code>{' '}
          and{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'server.crt'}</code>.
          We will use these files to create an <strong>HTTPS</strong> server in the next step.
        </p>
        <p>
          !<Link href="/static/images/cert-folder.png">cert-folder</Link>
        </p>
        <h3 id="-create-https-server">
          <Twemoji emoji="keycap-4" /> Create HTTPS server
        </h3>
        <p>
          The most important work of generating{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'server.key'}</code>{' '}
          and{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'server.crt'}</code>{' '}
          is done, now let's use that certificate to create a Nodejs <strong>HTTPS</strong> server
          in localhost using <Link href="https://koajs.com/">Koa.js</Link>
          (It's almost the same in <strong>Express</strong> cause <strong>Koa</strong> is created by
          the team behind <strong>Express</strong>{' '}
          <Twemoji emoji="beaming-face-with-smiling-eyes" />
          ).
        </p>
        <p>
          Create a simple <strong>web server</strong> with <strong>Koa</strong>:
        </p>
        <CodeTitle lang="js" title="server.js showLineNumbers" />
        <Pre>
          <code className="language-js">
            {
              "let Koa = require('koa');\nlet app = new Koa();\n\napp.use(async ctx => {\n  ctx.body = 'Hello World';\n});\n\nmodule.exports = app"
            }
          </code>
        </Pre>
        <p>
          Create a directory called{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'certs/'}</code> in
          your app, then move{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'server.key'}</code>{' '}
          and{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'server.crt'}</code>{' '}
          there.
        </p>
        <p>
          Load the certificate files and create <strong>HTTPS</strong> server with{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'https'}</code>{' '}
          module:
        </p>
        <CodeTitle lang="js" title="index.js showLineNumbers" />
        <Pre>
          <code className="language-js">
            {
              "let app = require('./server')\nlet https = require('https')\nlet fs = require('fs')\nlet path = require('path')\n\nlet certOptions = null\ntry {\n  certOptions = {\n    key: fs.readFileSync(path.resolve('certs/server.key')),\n    cert: fs.readFileSync(path.resolve('certs/server.crt'))\n  }\n} catch(err) {\n  console.log('No certificate files found!')\n}\n\nlet host = process.env.APP_URL || 'localhost'\nlet isLocal = host === 'localhost'\nlet enableHTTPSInLocal = Boolean(isLocal && certOptions)\n\nlet port = enableHTTPSInLocal ? 443 : process.env.PORT || 3434\nlet protocol = (isLocal && !certOptions) ? \"http\" : \"https\"\n\nlet url = `${protocol}://${host}${isLocal ? `:${port}` : ''}`\n\nlet callback = () => {\n  console.log(`App start successfully at ${url}`)\n}\n\nif (enableHTTPSInLocal) {\n  https\n    .createServer(certOptions || {}, app.callback())\n    .listen(port, callback)\n} else {\n  app.listen(port, callback)\n}"
            }
          </code>
        </Pre>
        <p>
          The <strong>project structure</strong> should looks like this:
        </p>
        <p>
          !<Link href="/static/images/https-koa-project.png">https-koa-project</Link>
        </p>
        <p>
          Start your app with{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'npm start'}</code> (
          <Twemoji emoji="warning" /> Notice that it's{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'node index.js'}
          </code>
          , not{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'node server.js'}
          </code>
          !)
        </p>
        <p>
          !<Link href="/static/images/http-koa.png">http-koa</Link>
        </p>
        <p>
          If no <strong>certificate</strong> file exists, the app will start at normal{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'http'}</code>.
        </p>
        <p>
          !<Link href="/static/images/https-koa.png">https-koa</Link>
        </p>
        <p>
          And after moving the <strong>certificate</strong> files in, the app will start with{' '}
          <strong>https</strong> on port <strong>443</strong>.
        </p>
        <p>
          !<Link href="/static/images/localhost-443.png">localhost-443</Link>
        </p>
        <p>
          Open{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'https://localhost:443'}
          </code>{' '}
          in your browser and you will see your app running with <strong>HTTPS</strong>{' '}
          <Twemoji emoji="party-popper" /> <Twemoji emoji="party-popper" />
        </p>
        <p>
          The source code can be found in this{' '}
          <Link href="https://github.com/hta218/local-https-with-koajs">repo</Link>.
        </p>
        <h2 id="conclusion">Conclusion</h2>
        <p>
          If you're not a <strong>Node.js</strong> developer, then you can google how to create an{' '}
          <strong>HTTPS</strong> server with certificate files in your preferred technology{' '}
          <Twemoji emoji="grinning-face-with-sweat" />
        </p>
        <p>
          I hope this guide can help you while developing your app with <strong>HTTPS</strong>{' '}
          locally!
        </p>
        <p>
          Happy sharing <Twemoji emoji="clinking-beer-mugs" />
        </p>
        <h2 id="references">References</h2>
        <ul>
          <li>
            <Link href="https://github.com/openssl/openssl">
              OpenSSL - TLS/SSL and crypto library
            </Link>
          </li>
          <li>
            <Link href="https://support.dnsimple.com/articles/what-is-ssl-root-certificate/">
              What is a Root SSL Certificate?
            </Link>
          </li>
          <li>
            <Link href="https://support.apple.com/en-us/HT210176">
              Apple's Requirements for trusted certificates
            </Link>
          </li>
          <li>
            <Link href="https://en.wikipedia.org/wiki/X.509">X509 v3 certificate</Link>
          </li>
          <li>
            <Link href="https://www.clickssl.net/blog/port-443">
              Port 443 is used to secure communication travels between the client and the server
            </Link>
          </li>
        </ul>
      </PostLayout>
    </>
  )
}
