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
  const post = allBlogs.find((p) => p.slug === 'integrate-tailwind-css-with-react-application')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'integrate-tailwind-css-with-react-application')!

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
          <Link href="https://tailwindcss.com/">Tailwind CSS</Link> is a <strong>low-level</strong>{' '}
          CSS framework that’s highly customizable. Unlike other frameworks or UI kits that provide
          pre-designed components (buttons, cards, modals, etc.) to help you get started quickly but
          can be cumbersome to customize later, Tailwind focuses on low-level utility classes (
          <strong>utility-first</strong>), allowing you to build your own design without worrying
          about <strong>overriding</strong> existing <strong>styles</strong>.
        </p>

        <p>
          In this post, I’ll guide you on how to integrate Tailwind CSS into a React app{' '}
          <Twemoji emoji="beaming-face-with-smiling-eyes" />
        </p>

        <h2 id="create-a-react-app">Create a React App</h2>

        <p>
          The simplest way to create a React app is by using the{' '}
          <Link href="https://create-react-app.dev/docs/getting-started/">create-react-app</Link>{' '}
          script with{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'npx'}</code>
        </p>

        <Pre>
          <code className="language-bash">{'npx create-react-app my-app && cd my-app'}</code>
        </Pre>

        <p>
          Using npx lets you run the create-react-app script without needing to install the package.
        </p>

        <h2 id="adding-dependencies">Adding dependencies</h2>

        <p>Install the following devDependencies to set up Tailwind CSS</p>

        <Pre>
          <code className="language-bash showLineNumbers">
            {
              'yarn add tailwindcss postcss-cli autoprefixer -D\n## or npm install tailwindcss postcss-cli autoprefixer --save-dev'
            }
          </code>
        </Pre>

        <p>Besides Tailwind CSS, we’ll also install:</p>

        <ul>
          <li>
            <Link href="https://github.com/postcss/postcss">PostCSS</Link>: A tool for analyzing and
            transforming styling using JS plugins, which helps with CSS suggestions, supporting
            variables and mixins, compiling new CSS features, etc.
          </li>
          <li>
            <Link href="https://github.com/postcss/autoprefixer">Autoprefixer</Link>: A PostCSS
            plugin that automatically adds{' '}
            <Link href="https://www.lifewire.com/css-vendor-prefixes-3466867">vendor prefix</Link> (
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'-webkit-'}</code>,{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'-moz-'}</code>,{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'-ms-'}</code>,{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'-o-'}</code>, etc.)
            based on data from <strong>Can I Use</strong> to ensure your CSS works on multiple
            browsers.
          </li>
        </ul>

        <h2 id="configuring-postcss">Configuring PostCSS</h2>

        <p>PostCSS helps manage and configure your CSS build process.</p>

        <p>Create a config file:</p>

        <Pre>
          <code className="language-bash">{'touch postcss.config.js'}</code>
        </Pre>

        <p>Add the following config:</p>

        <CodeTitle lang="js" title="postcss.config.js showLineNumbers" />
        <Pre>
          <code className="language-js">
            {"module.exports = {\n  plugins: [require('tailwindcss'), require('autoprefixer')],\n}"}
          </code>
        </Pre>

        <p>
          This build process uses two plugins:{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'tailwindcss'}</code>{' '}
          and{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'autoprefixer'}</code>
          .
        </p>

        <h2 id="injecting-tailwind-css">Injecting Tailwind CSS</h2>

        <p>
          Create a sub-folder named{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'styles'}</code>{' '}
          inside the src folder. In the styles folder, create a file called{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'tailwind.css'}</code>
          .
        </p>

        <p>Or use the command line:</p>

        <Pre>
          <code className="language-bash">
            {'mkdir src/styles && touch src/styles/tailwind.css'}
          </code>
        </Pre>

        <p>Import the following modules from Tailwind CSS:</p>

        <CodeTitle lang="css" title="tailwind.css showLineNumbers" />
        <Pre>
          <code className="language-css">
            {'@tailwind base;\n\n@tailwind components;\n\n@tailwind utilities;'}
          </code>
        </Pre>

        <p>
          You can place the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'tailwind.css'}</code>{' '}
          file in any folder you like, such as{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'src/static'}</code>,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'src/assets'}</code>,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'src/styles'}</code>{' '}
          ...
        </p>

        <h2 id="adding-build-script">Adding build script</h2>

        <p>
          Open the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'package.json'}</code>{' '}
          file and add the following build script (inside the scripts object):
        </p>

        <Pre>
          <code className="language-json">
            {'"build:css": "postcss src/styles/tailwind.css -o src/styles/main.css"'}
          </code>
        </Pre>

        <p>
          This script uses <strong>PostCSS CLI</strong> to build the CSS based on the config in the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'tailwind.css'}</code>{' '}
          file, with the output (flag{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'-o'}</code>) as{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'main.css'}</code>.
        </p>

        <p>
          You can choose the file name and location as you like. Here, I’m putting both the input
          config file and output in the same folder:{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'src/styles'}</code>.
        </p>

        <p>Now you can manually trigger the build with the command:</p>

        <Pre>
          <code className="language-bash showLineNumbers">
            {'yarn build:css\n# or npm run build:css'}
          </code>
        </Pre>

        <p>After configuring and building, your project structure should look like this:</p>

        <p>
          !<Link href="/static/images/tailwind-project.png">Project structure</Link>
        </p>

        <p>
          To make things easier, you can integrate the{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'build:css'}</code>{' '}
          command into the start and build scripts of your project, ensuring that your CSS is always
          rebuilt with the latest updates each time you start the project:
        </p>

        <CodeTitle lang="json" title="package.json showLineNumbers" />
        <Pre>
          <code className="language-json">
            {
              '"scripts": {\n\t"start": "npm run build:css && react-scripts start",\n\t"build": "npm run build:css && react-scripts build",\n\t"test": "react-scripts test",\n\t"eject": "react-scripts eject",\n\t"build:css": "postcss src/styles/tailwind.css -o src/styles/main.css"\n}\n// more configs...'
            }
          </code>
        </Pre>

        <p>
          Now to build the CSS and start the project, you just need to run{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'yarn start'}</code>.
        </p>

        <h2 id="using-tailwind-css-in-a-react-component">
          Using Tailwind CSS in a React component
        </h2>

        <p>
          Import the built CSS into the start file of your project (mine is{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'index.js'}</code>):
        </p>

        <Pre>
          <code className="language-js">{"import './styles/main.css'"}</code>
        </Pre>

        <p>Create a basic component:</p>

        <CodeTitle lang="jsx" title="app.jsx showLineNumbers" />
        <Pre>
          <code className="language-jsx">
            {
              'import React from \'react\'\n\nfunction App() {\n  return (\n    <div className="flex justify-center pt-8">\n      <div className="w-full max-w-sm shadow-lg lg:flex lg:max-w-full">\n        <div\n          className="h-48 flex-none overflow-hidden rounded-t bg-cover text-center lg:h-auto lg:w-48 lg:rounded-l lg:rounded-t-none"\n          style={{\n            backgroundImage: `url(\'https://image-us.24h.com.vn/upload/1-2020/images/2020-02-06/kodfd-1580928361-474-width640height480.jpg\')`,\n          }}\n          title="Woman holding a mug"\n        ></div>\n        <div className="flex flex-col justify-between rounded-b border-b border-l border-r border-gray-400 bg-white p-4 leading-normal lg:rounded-b-none lg:rounded-r lg:border-l-0 lg:border-t lg:border-gray-400">\n          <div className="mb-8">\n            <p className="flex items-center text-sm text-gray-600">Latest News</p>\n            <div className="mb-2 text-xl font-bold text-gray-900">\n              Messi is moving to Manchester City\n            </div>\n            <p className="text-base text-gray-700">\n              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla!\n              Maiores et perferendis eaque, exercitationem praesentium nihil.\n            </p>\n          </div>\n          <div className="flex items-center">\n            <img\n              className="mr-4 h-10 w-10 rounded-full"\n              src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRG2WOlZ4KLuNN1ksjNOmh6oZ091IUhJiZD7w&usqp=CAU"\n              alt="Avatar of Jonathan Reinink"\n            />\n            <div className="text-sm">\n              <p className="leading-none text-gray-900">Jonathan Reinink</p>\n              <p className="text-gray-600">Aug 18</p>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  )\n}\n\nexport default App'
            }
          </code>
        </Pre>

        <p>
          Here’s the result <Twemoji emoji="party-popper" /> <Twemoji emoji="party-popper" />
        </p>

        <p>
          !<Link href="/static/images/messi.jpg">Tailwind css result</Link>
        </p>

        <h2 id="conclusion">Conclusion</h2>

        <p>
          I hope you can integrate and use Tailwind CSS in your project through this tutorial.
          Personally, I find this framework quite simple, easy to use, and of good quality.
        </p>

        <p>Leave your comments below if you have any feedback</p>

        <h2 id="references">References</h2>

        <ul>
          <li>
            <Link href="https://tailwindcss.com/docs/installation">Tailwind CSS Documentation</Link>
          </li>
          <li>
            <Link href="https://create-react-app.dev/docs/getting-started/">Create React App</Link>
          </li>
          <li>
            <Link href="https://codingthesmartway.com/using-tailwind-css-with-react/">
              https://codingthesmartway.com/using-tailwind-css-with-react/
            </Link>
          </li>
          <li>
            <Link href="https://www.smashingmagazine.com/2020/02/tailwindcss-react-project/">
              https://www.smashingmagazine.com/2020/02/tailwindcss-react-project/
            </Link>
          </li>
        </ul>
      </PostLayout>
    </>
  )
}
