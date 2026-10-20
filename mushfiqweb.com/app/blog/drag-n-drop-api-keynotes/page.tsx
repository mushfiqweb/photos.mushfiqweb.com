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
  const post = allBlogs.find((p) => p.slug === 'drag-n-drop-api-keynotes')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'drag-n-drop-api-keynotes')!

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
          I created an example about Javascript Drag-n-Drop APIs at{' '}
          <Link href="https://hta218.github.io/dnd-keynotes">
            https://hta218.github.io/dnd-keynotes
          </Link>
        </p>

        <iframe
          src="https://hta218.github.io/dnd-keynotes/"
          title="DnD Examples by Leo"
          className="hidden xl:block"
          style={{ width: '100%', height: '1000px' }}
        ></iframe>

        <p>Below are some interesting key-notes I've learned about the APIs.</p>

        <h2 id="basic-concepts">Basic concepts</h2>

        <ul>
          <li>
            A typical <strong>drag</strong> operation begins when a user selects a{' '}
            <strong>draggable</strong> element, drags the element to a <strong>dropzone</strong>,
            and then releases the dragged element.
          </li>
        </ul>

        <ul>
          <li>Events:</li>
        </ul>

        <TableWrapper>
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Fires when…</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Document/drag_event">
                    drag
                  </Link>
                </td>
                <td>…a dragged item (element or text selection) is dragged.</td>
              </tr>
              <tr>
                <td>
                  <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Document/dragend_event">
                    dragend
                  </Link>
                </td>
                <td>
                  …a drag operation ends (such as releasing a mouse button or hitting the{' '}
                  <strong>Esc</strong> key)
                </td>
              </tr>
              <tr>
                <td>
                  <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Document/dragenter_event">
                    dragenter
                  </Link>
                </td>
                <td>…a dragged item enters a valid drop target.</td>
              </tr>
              <tr>
                <td>
                  <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Document/dragexit_event">
                    dragexit
                  </Link>
                </td>
                <td>…an element is no longer the drag operation's immediate selection target.</td>
              </tr>
              <tr>
                <td>
                  <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Document/dragleave_event">
                    dragleave
                  </Link>
                </td>
                <td>…a dragged item leaves a valid drop target.</td>
              </tr>
              <tr>
                <td>
                  <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Document/dragover_event">
                    dragover
                  </Link>
                </td>
                <td>
                  …a dragged item is being dragged over a valid drop target, every few hundred
                  milliseconds.
                </td>
              </tr>
              <tr>
                <td>
                  <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Document/dragstart_event">
                    dragstart
                  </Link>
                </td>
                <td>…the user starts dragging an item.</td>
              </tr>
              <tr>
                <td>
                  <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Document/drop_event">
                    drop
                  </Link>
                </td>
                <td>…an item is dropped on a valid drop target.</td>
              </tr>
            </tbody>
          </table>
        </TableWrapper>

        <h2 id="keynotes">Keynotes</h2>

        <ul>
          <li>
            To make an element <strong>draggable</strong>, add{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'draggable="true"'}
            </code>{' '}
            attribute
          </li>
        </ul>

        <Pre>
          <code className="language-html">
            {'  <div draggable="true">This element is draggable</div>'}
          </code>
        </Pre>

        <ul>
          <li>
            <strong>dragstart</strong>
          </li>
        </ul>

        <ul>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'dragstart'}</code>{' '}
            is the first event fired when a <strong>drag operation</strong> starts on a draggable
            element
          </li>
        </ul>

        <ul>
          <li>
            use{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'e.dataTransfer.setData()'}
            </code>{' '}
            method to set any drag's data, this will stay during the <strong>drag operation</strong>
          </li>
        </ul>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              "  // The `dragstart` event fires on the `draggable` element\n  dragElem.addEventListener('dragstart', function (e) {\n    // We can set data using `e.dataTransfer.setData` method\n    e.dataTransfer.setData('text/plain', e.target.id)\n    // Use e.dataTransfer.setDragImage() to change the drag image\n    // e.dataTransfer.setDragImage(img | element, xOffset, yOffset)\n  })"
            }
          </code>
        </Pre>

        <ul>
          <li>
            If you don't want the translucent image generated from the drag target during drag, use{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'e.dataTransfer.setDragImage()'}
            </code>{' '}
            to change it
          </li>
        </ul>

        <ul>
          <li>
            The <strong>dropEffect</strong>
          </li>
        </ul>

        <ul>
          <li>
            The <strong>dropEffect</strong> property is used to control the feedback the user is
            given during a drag-and-drop operation
          </li>
        </ul>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              "  dragElem.addEventListener('dragstart', function (e) {\n    e.dataTransfer.setData('text/plain', e.target.id)\n    // The `move` value works on window, not on macOS - It might be the problem of browser along with OS\n    e.dataTransfer.dropEffect = 'move' // or \"copy\"\n  })"
            }
          </code>
        </Pre>

        <ul>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'dropEffect'}</code>{' '}
            property could be:
          </li>
        </ul>

        <ol>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'move'}</code>:
            dragged data will be moved to the dropzone.
          </li>
          <li>
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'copy'}</code>:
            dragged data will be copied to the dropzone.
          </li>
          <li>..</li>
        </ol>

        <ul>
          <li>
            The <strong>dropzone</strong>
          </li>
        </ul>

        <ul>
          <li>
            To make an element becomes a dropzone, it <strong>must</strong> have both{' '}
            <strong>dragover</strong> and <strong>drop</strong> event handler.
          </li>
        </ul>

        <ul>
          <li>
            Remember to call <strong>e.preventDefault()</strong> in{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'dragover'}</code>{' '}
            handler or the browser won't let you drop anything inside
          </li>
        </ul>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              "  dropzone.addEventListener('dragover', function handleDragOver(e) {\n    // The `dropzone` element must have both `dragover` and `drop` event\n    // Remember to preventDefault the behavior or the browser or it will not let you drop anything inside\n    e.preventDefault()\n    e.dataTransfer.dropEffect = 'move'\n  })\n  dropzone.addEventListener('drop', function handleDrop(e) {\n    // NOTE: there must be a handler for dragover to use drop event\n    e.preventDefault()\n    // Use `e.dataTransfer.getData` method to retrieve drag's data and process them\n    let data = e.dataTransfer.getData('text/plain')\n    // NOTE: Keep mind that we can only use the `dataTransfer.getData()` in the `drop-handler`\n    // `getData()` will return empty string inside handle dragover or dragenter\n  })"
            }
          </code>
        </Pre>

        <ul>
          <li>
            Keep mind that we can <strong>only</strong> use the{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'dataTransfer.getData()'}
            </code>{' '}
            in the{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'drop-handler'}
            </code>{' '}
            (it will return empty string inside <strong>dragover</strong> or{' '}
            <strong>dragenter</strong> handler)
          </li>
        </ul>

        <ul>
          <li>
            <strong>dragend</strong>
          </li>
        </ul>

        <ul>
          <li>
            The <strong>dragend</strong> event fires after a drag operation finished regardless of
            whether the drag completed or was canceled
          </li>
        </ul>

        <Pre>
          <code className="language-js showLineNumbers">
            {
              '  // The `dragend` event fired on the `draggable` element (not the dropzone element)\n  dragElem.addEventListener(\'dragend\', function handleDragEnd(e) {\n    // We can check if the drag was successful or not by checking the ʻe.dataTransfer.dropEffect` value\n    let dropEffect = e.dataTransfer.dropEffect\n    // If that fails, the value of `e.dataTransfer.dropEffect` will be "none"\n  })'
            }
          </code>
        </Pre>

        <ul>
          <li>
            If the drag operation failed, the value of{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'e.dataTransfer.dropEffect'}
            </code>{' '}
            will be{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'"none"'}</code>
          </li>
        </ul>

        <h2 id="refs">Refs</h2>

        <ul>
          <li>
            <Link href="https://www.digitalocean.com/community/tutorials/">DigitalOcean</Link>
          </li>
          <li>
            <Link href="https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API">
              MDN Documentations
            </Link>
          </li>
          <li>
            <Link href="https://web.dev/drag-and-drop/">https://web.dev/drag-and-drop/</Link>
          </li>
          <li>
            <Link href="https://html.spec.whatwg.org/multipage/dnd.html#dnd">
              https://html.spec.whatwg.org/multipage/dnd.html#dnd
            </Link>
          </li>
        </ul>
      </PostLayout>
    </>
  )
}
