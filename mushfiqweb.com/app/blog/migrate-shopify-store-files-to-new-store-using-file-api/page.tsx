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
    (p) => p.slug === 'migrate-shopify-store-files-to-new-store-using-file-api'
  )!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find(
    (p) => p.slug === 'migrate-shopify-store-files-to-new-store-using-file-api'
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
          If you are a Shopify Developer and need to migrate all of your data from one store to a
          new one without the need to pay for a migration app, then I believe this is the article
          you need to read <Twemoji emoji="smiling-face-with-sunglasses" />.
        </p>
        <h2 id="problem">Problem</h2>
        <p>
          The problem has been stated above. So let's see what data we have in a store and how we
          can migrate it to another store:
        </p>
        <ul>
          <li>
            <strong>Product</strong>: You can download a <strong>CSV</strong> file containing
            product data and upload it to the new store.
          </li>
        </ul>
        <Twemoji emoji="warning" /> With **CSV** files, information about Collections will not be
        migrated, so you will need to recreate the Collection data.
        <ul>
          <li>
            <strong>Theme</strong>: Download the Zip file and upload it to the new store, and the
            data will remain the same.
          </li>
        </ul>
        <ul>
          <li>
            <strong>Blog posts &amp; custom pages</strong>: Use a free app on the Shopify store
            called{' '}
            <Link href="​​https://apps.shopify.com/exim-export-import-pages-blogs-theme-settings">
              ExIm ‑ Export / Import data
            </Link>{' '}
            to migrate.
          </li>
        </ul>
        <ul>
          <li>
            <strong>Assets</strong>: These are all the files in your store (which can be viewed in{' '}
            <strong>Admin / Settings / Files</strong>), including images, videos, and fonts. These
            are the assets used for theme settings, blog posts, and pages. (Product images and
            videos are automatically migrated when the <strong>CSV</strong> file is uploaded!)
          </li>
        </ul>
        <p>And the problem I faced when migrating this asset stack was:</p>
        <ul>
          <li>My store had around ~1000 files, and I couldn't upload them manually.</li>
          <li>
            After uploading, I had to select the settings of the theme and page to make them work.
          </li>
        </ul>
        <p>
          If done manually, this would be an exhausting task! <Twemoji emoji="flexed-biceps" />
        </p>
        <h2 id="solution">Solution</h2>
        <p>
          My solution here is to use the{' '}
          <Link href="https://shopify.dev/api/admin/graphql/reference/products-and-collections/file">
            Shopify File API
          </Link>{' '}
          in conjunction with <strong>Node.js</strong> to download all files and upload them to the
          new store.
        </p>
        <p>
          The <strong>File API</strong> is officially supported by Shopify in API version{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'2021-07'}</code>{' '}
          after the recent <strong>Shopify Unite</strong> event (information on{' '}
          <Link href="https://shopify.dev/changelog/file-api-is-now-available">
            Shopify Developer Changelog
          </Link>
          ).
        </p>
        <p>
          The following are the steps that combine manual labor and brainpower to solve these assets{' '}
          <Twemoji emoji="face-with-tears-of-joy" />
          <Twemoji emoji="face-with-tears-of-joy" />
        </p>
        <h3 id="get-all-file-urls-with-graphql">
          Get all file URLs with{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'GraphQL'}</code>
        </h3>
        <Twemoji emoji="keycap-1" /> Create a **Private App**
        <p>
          Why create a <strong>Private App</strong>? Because we need to authenticate with Shopify to{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'request'}</code>{' '}
          resources in the store. The simplest way is to use{' '}
          <Link href="https://shopify.dev/apps/auth/basic-http">Basic HTTP authentication</Link>{' '}
          with a <strong>Private App</strong>. The steps to create a <strong>Private App</strong>{' '}
          are as follows:
        </p>
        <ul>
          <li>
            Go to <strong>Store Admin / Apps</strong>
          </li>
          <li>
            Click <strong>Manage private apps</strong> (at the bottom of the page) =&gt;{' '}
            <strong>Create new private app</strong>
          </li>
          <li>
            Fill in <strong>App name</strong> and <strong>Emergency email</strong> in the{' '}
            <strong>App details</strong> section
          </li>
          <li>
            Click <strong>Show inactive Admin API permissions</strong> in the{' '}
            <strong>Admin API</strong> section, scroll to the <strong>Files</strong> section, and
            select{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'Read access'}
            </code>
            .
          </li>
          <li>
            Click =&gt; <strong>Save</strong> =&gt; <strong>Create app</strong>
          </li>
          <li>
            That's it, you have created a <strong>Private App</strong> to authenticate with Shopify.{' '}
            <Twemoji emoji="party-popper" />
          </li>
        </ul>
        <Twemoji emoji="keycap-2" /> Get the **Access Token**
        <p>
          The easiest way to send authenticated{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'requests'}</code> to
          Shopify is to add the request header{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'X-Shopify-Access-Token: {access_token}'}
          </code>
          , where{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'{access_token}'}
          </code>{' '}
          is the <strong>Admin API password</strong> of the <strong>Private App</strong> we just
          created.
        </p>
        <p>
          !<Link href="/static/images/private-app-password.png">private-app-password</Link>
        </p>
        <p>
          Copy the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'password'}</code> in
          the <strong>Admin API</strong> section of the <strong>Private App</strong> you just
          created; this is the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'access_token'}</code>{' '}
          we need for the next step.
        </p>
        <Twemoji emoji="keycap-3" /> Send a **GraphQL** request with **Postman**
        <p>
          Because we need to send multiple requests, it's convenient to use an HTTP Client to
          configure headers and copy responses (such as Postman, Postwoman, Insomnia, etc.). Here, I
          choose <strong>Postman</strong>. (Download link{' '}
          <Link href="https://www.postman.com/">here</Link>)
        </p>
        <p>
          After downloading, create a{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'POST'}</code> request
          like this:
        </p>
        <p>
          !<Link href="/static/images/postman-1.png">postman-1</Link>
        </p>
        <p>In which:</p>
        <ul>
          <li>
            Request URL:{' '}
            <code style={{ wordBreak: 'break-word' }}>
              https://your-store.myshopify.com/admin/api/unstable/graphql.json
            </code>{' '}
            with{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'unstable'}</code>{' '}
            as the API version supporting File API.
          </li>
        </ul>
        <ul>
          <li>
            <Twemoji emoji="warning" /> note: The{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'Content-Type'}
            </code>{' '}
            header must use the value{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'application/json'}
            </code>
            ,
          </li>
        </ul>
        <p>
          not{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'application/graphql'}
          </code>{' '}
          (Shopify has
          <Link href="https://shopify.dev/apps/auth/basic-http#shopify-access-token">
            note
          </Link>{' '}
          this)
        </p>
        <ul>
          <li>
            The value of the{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'X-Shopify-Access-Token'}
            </code>{' '}
            header is the{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'access_token'}
            </code>{' '}
            or{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'password'}</code>{' '}
            of the <strong>Private App</strong> you just created.
          </li>
        </ul>
        <p>
          Next, switch to the <strong>Body</strong> tab, select <strong>GraphQL</strong>
        </p>
        <p>
          !<Link href="/static/images/postman-2.png">postman-2</Link>
        </p>
        <p>
          And add the following{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'query'}</code>
        </p>
        <Pre>
          <code className="language-js showLineNumbers">
            {
              '{\n  files(first: 250) {\n    edges {\n      node {\n        ... on MediaImage {\n          image {\n            originalSrc\n          }\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n    }\n  }\n}'
            }
          </code>
        </Pre>
        <p>
          Each <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'node'}</code>{' '}
          belongs to one of two types:{' '}
          <Link href="https://shopify.dev/api/admin/graphql/reference/products-and-collections/mediaimage">
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'MediaImage'}</code>
          </Link>{' '}
          or{' '}
          <Link href="https://shopify.dev/api/admin/graphql/reference/products-and-collections/genericfile">
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'GenericFile'}
            </code>
          </Link>
          , where{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'GenericFile'}</code>{' '}
          only has a few files (mostly <strong>Fonts</strong>), so I'll focus on{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'MediaImage'}</code>{' '}
          only.
        </p>
        <Twemoji emoji="warning" /> Here are some important notes:
        <ul>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'first: 250'}</code>
            : is the maximum limit of Shopify for one{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'request'}</code>.
          </li>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'cursor'}</code>:
            because of the limit, we need to create multiple requests (for example, if my store has
            ~1000 images, I need 4 requests). The cursor here is the <strong>pagination</strong> for
            GraphQL (similar to REST, where you use{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'&page=1'}</code>,{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'&page=2'}</code>...
            to request the next page).
          </li>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'pageInfo'}</code>:
            It is added only to know if there is a next page or not.{' '}
            <Twemoji emoji="beaming-face-with-smiling-eyes" />
          </li>
        </ul>
        <p>
          The result will look like this: <Twemoji emoji="party-popper" />
        </p>
        <p>
          !<Link href="/static/images/postman-3.png">postman-3</Link>
        </p>
        <p>
          To <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'request'}</code>{' '}
          the next page, you need to add a{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'query'}</code>{' '}
          parameter named{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'after'}</code> with
          the value of the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'cursor'}</code> of
          the <strong>last element</strong> in the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'edges'}</code> array
          in the <strong>response</strong> (<Twemoji emoji="warning" /> the last element!).
        </p>
        <p>
          !<Link href="/static/images/postman-4.png">postman-4</Link>
        </p>
        <p>
          That's all <Twemoji emoji="grinning-face-with-sweat" />. With 4 requests, I already have
          1000 URLs of all the images in the old store!
        </p>
        <h3 id="download-files-with-nodejs">Download files with Node.js</h3>
        <p>Now, we need to download all these files and upload them to the new store.</p>
        <p>
          Do we need to choose the settings for this asset again when uploading to the new store{' '}
          <Twemoji emoji="thinking-face" /> ?
        </p>
        <p>The answer is no! Thanks to a very cool mechanism of Shopify!</p>
        <blockquote>
          <p>
            If you upload a file with the same name as in the old store, it will automatically
            inherit the settings of the theme/page/blog... that were migrated{' '}
            <Twemoji emoji="exploding-head" />
            <Twemoji emoji="exploding-head" />.
          </p>
        </blockquote>
        <p>
          Moreover, the URL of the file obtained with <strong>GraphQL</strong> already contains the
          file name:{' '}
          <code style={{ wordBreak: 'break-word' }}>
            https://cdn.shopify.com/s/files/1/0561/2742/2636/files/fav_icon_dark_1.png?v=1618297070
          </code>{' '}
          The file name of this file is{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
            {'fav_icon_dark_1.png'}
          </code>
          .
        </p>
        <p>
          Now we only need to download the 1000 files, save them with the extracted name from the
          URL, and upload them to the new store <Twemoji emoji="smiling-face-with-sunglasses" />
          <Twemoji emoji="smiling-face-with-sunglasses" />.
        </p>
        <p>
          With just a few lines of{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'Node.js'}</code> code
          combined with{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'regex'}</code>, we
          can extract the name and download the file:
        </p>
        <Pre>
          <code className="language-js showLineNumbers">
            {
              "let fs = require('fs')\nlet fetch = require('node-fetch')\nlet fileData = require('./data')\n\nasync function download(url, filename) {\n  let response = await fetch(url)\n  let buffer = await response.buffer()\n  await fs.writeFile(filename, buffer, () => {})\n}\n\nconsole.time('FILE_DOWNLOAD')\nPromise.all(\n  fileData.map(async ({ node }, ind) => {\n    let src = node?.image?.originalSrc\n    if (src) {\n      let filename = (src.match(/.*\\/files\\/(.*)\\?v=.*/) || [])[1]\n      if (filename) {\n        await download(src, `./download/${filename}`)\n      } else {\n        console.warn(`Couldn't get filename of: ${src} at index ${ind}`)\n      }\n    } else {\n      console.log(`No file at index: ${ind}`)\n    }\n  })\n).then(() => console.timeEnd('FILE_DOWNLOAD'))"
            }
          </code>
        </Pre>
        <p>
          Note that{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'fileData'}</code> is
          the array of{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'edges'}</code> from
          the above requests!
        </p>
        <p>
          The entire{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'script'}</code> is in
          this{' '}
          <Link href="https://github.com/hta218/shopify-file-downloader/blob/main/index.js">
            repository
          </Link>
          .
        </p>
        <p>
          !<Link href="/static/images/file-download.jpg">file-download</Link>
        </p>
        <p>
          It downloads very quickly! <Twemoji emoji="smiling-face-with-sunglasses" />
        </p>
        <h3 id="upload-to-the-new-store">Upload to the new store</h3>
        <p>
          No need to write any code for this step because doing it manually is the fastest way.{' '}
          <Twemoji emoji="grinning-squinting-face" />
        </p>
        <p>
          Go to Store <strong>Admin / Settings / Files</strong> =&gt; click{' '}
          <strong>Upload files</strong>. Shopify only allows uploading a maximum of 200 files at a
          time, so uploading a few times will complete the process!
        </p>
        <p>
          At this point, the migration process is complete <Twemoji emoji="party-popper" />
          <Twemoji emoji="party-popper" />. Check the results on the new store and good luck!
        </p>
        <p>
          Happy migrating <Twemoji emoji="clinking-beer-mugs" />.
        </p>
        <h3 id="refs">Refs</h3>
        <ul>
          <li>
            <Link href="https://shopify.dev/apps/auth/basic-http">
              https://shopify.dev/apps/auth/basic-http
            </Link>
          </li>
          <li>
            <Link href="https://www.shopify.com/partners/blog/getting-started-with-graphql">
              https://www.shopify.com/partners/blog/getting-started-with-graphql
            </Link>
          </li>
          <li>
            <Link href="https://help.shopify.com/en/manual/apps/private-apps#enable-private-app-development-from-the-shopify-admin">
              https://help.shopify.com/en/manual/apps/private-apps#enable-private-app-development-from-the-shopify-admin
            </Link>
          </li>
        </ul>
      </PostLayout>
    </>
  )
}
