import fs from 'fs'
import path from 'path'
import { slug } from 'github-slugger'
import matter from 'gray-matter'
import readingTime from 'reading-time'

interface ReadingTimeResult {
  text: string
  minutes: number
  time: number
  words: number
}

interface TocItem {
  value: string
  url: string
  depth: number
}

const root = process.cwd()

function formatInline(text: string): string {
  // 1. Extract JSX tags (self-closing or open/close pair, allowing newlines)
  const jsxTags: string[] = []
  const tagRegex =
    /(<[A-Za-z][A-Za-z0-9]*[^>]*\/>|<[A-Za-z][A-Za-z0-9]*[^>]*>[\s\S]*?<\/[A-Za-z][A-Za-z0-9]*>)/g
  let formatted = text.replace(tagRegex, (match) => {
    const placeholder = `__JSX_PLACEHOLDER_${jsxTags.length}__`
    jsxTags.push(match)
    return placeholder
  })

  // 2. Extract inline code blocks to protect their contents
  const codeBlocks: string[] = []
  formatted = formatted.replace(/`([^`]+?)`/g, (_, code) => {
    const placeholder = `__CODE_PLACEHOLDER_${codeBlocks.length}__`
    codeBlocks.push(code)
    return placeholder
  })

  // 3. Escape HTML entities in standard text
  formatted = formatted.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // 4. Escape curly braces in standard text to prevent JSX parse errors
  formatted = formatted.replace(/\{/g, '{"{"}').replace(/\}/g, '{"}"}')

  // 5. Inline formatting replacements
  // Bold: **text**
  formatted = formatted.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')

  // Italic: *text* (lazy, not matching bold **)
  formatted = formatted.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>')

  // Italic: _text_ (using word boundaries to prevent matching underscores inside words/filenames)
  formatted = formatted.replace(/\b_([^_]+?)_\b/g, '<em>$1</em>')

  // Links: [text](url)
  formatted = formatted.replace(/\[([^\]]+?)\]\(([^)]+?)\)/g, '<Link href="$2">$1</Link>')

  // 6. Restore inline code blocks wrapped in a safe JSON string expression
  codeBlocks.forEach((code, index) => {
    const escapedCode = JSON.stringify(code)
    formatted = formatted.replace(
      `__CODE_PLACEHOLDER_${index}__`,
      `<code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{${escapedCode}}</code>`
    )
  })

  // 7. Restore JSX tags
  jsxTags.forEach((tag, index) => {
    formatted = formatted.replace(`__JSX_PLACEHOLDER_${index}__`, tag)
  })

  return formatted
}

function parseTable(lines: string[]): string {
  let html = '<TableWrapper>\n<table>\n'
  let inThead = true
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line.startsWith('|')) continue

    const cells = line
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim())
    if (cells.every((c) => /^:-*|-+:*|:-+:*$/.test(c) || c === '')) {
      inThead = false
      continue
    }

    if (inThead) {
      html += '<thead>\n<tr>\n'
      cells.forEach((cell) => {
        html += `<th>${formatInline(cell)}</th>\n`
      })
      html += '</tr>\n</thead>\n<tbody>\n'
      inThead = false
    } else {
      html += '<tr>\n'
      cells.forEach((cell) => {
        html += `<td>${formatInline(cell)}</td>\n`
      })
      html += '</tr>\n'
    }
  }
  html += '</tbody>\n</table>\n</TableWrapper>'
  return html
}

function parseList(lines: string[]): string {
  const firstLine = lines[0].trim()
  const isOrdered = /^\d+\.\s+/.test(firstLine)
  const tag = isOrdered ? 'ol' : 'ul'

  let html = `<${tag}>\n`
  for (const line of lines) {
    const cleanLine = line.trim().replace(/^(\*|-|\d+\.)\s+/, '')
    html += `<li>${formatInline(cleanLine)}</li>\n`
  }
  html += `</${tag}>`
  return html
}

const BLOCK_TAGS = new Set([
  'iframe',
  'div',
  'script',
  'style',
  'Image',
  'NextImage',
  'TableWrapper',
  'Pre',
  'CodeTitle',
  'blockquote',
  'p',
  'ul',
  'ol',
  'li',
  'table',
  'thead',
  'tbody',
  'tr',
  'td',
  'th',
])

const SELF_CLOSING_TAGS = new Set([
  'Image',
  'NextImage',
  'Twemoji',
  'img',
  'br',
  'hr',
  'link',
  'input',
  'meta',
])

function markdownToJsx(markdown: string): string {
  const lines = markdown.split('\n')
  let blocks: string[] = []

  let currentBlockType: 'paragraph' | 'code' | 'list' | 'table' | 'blockquote' | 'html' | null =
    null
  let currentBlockLines: string[] = []
  let codeLang = ''
  let codeTitle = ''
  let codeBlockMarker = ''
  let htmlBlockTag = ''

  const flushBlock = () => {
    if (currentBlockLines.length === 0) return

    if (currentBlockType === 'code') {
      const codeContent = currentBlockLines.join('\n')
      let blockHtml = ''
      if (codeTitle) {
        blockHtml += `<CodeTitle lang=${JSON.stringify(codeLang)} title=${JSON.stringify(codeTitle)} />\n`
      }
      blockHtml += `<Pre><code className=${JSON.stringify('language-' + codeLang)}>{${JSON.stringify(codeContent)}}</code></Pre>`
      blocks.push(blockHtml)
    } else if (currentBlockType === 'html') {
      const content = currentBlockLines.join('\n').trim()
      blocks.push(content)
    } else if (currentBlockType === 'list') {
      blocks.push(parseList(currentBlockLines))
    } else if (currentBlockType === 'table') {
      blocks.push(parseTable(currentBlockLines))
    } else if (currentBlockType === 'blockquote') {
      const cleanLines = currentBlockLines.map((l) => l.trim().replace(/^>\s*/, ''))
      blocks.push(`<blockquote>\n<p>\n${formatInline(cleanLines.join('\n'))}\n</p>\n</blockquote>`)
    } else if (currentBlockType === 'paragraph') {
      const content = currentBlockLines.join('\n').trim()
      if (
        content.startsWith('<Image') ||
        content.startsWith('<Twemoji') ||
        (content.startsWith('<') && content.endsWith('>'))
      ) {
        blocks.push(content)
      } else {
        blocks.push(`<p>\n${formatInline(content)}\n</p>`)
      }
    }

    currentBlockLines = []
    currentBlockType = null
    codeLang = ''
    codeTitle = ''
    htmlBlockTag = ''
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // If we are currently in an HTML block, all lines belong to it until it closes
    if (currentBlockType === 'html') {
      currentBlockLines.push(line)
      let isClosed = false
      if (SELF_CLOSING_TAGS.has(htmlBlockTag)) {
        isClosed = trimmed.includes('/>') || trimmed.endsWith('>')
      } else {
        isClosed = trimmed.includes(`</${htmlBlockTag}`)
      }
      if (isClosed) {
        flushBlock()
      }
      continue
    }

    if (!codeBlockMarker) {
      const match = trimmed.match(/^(`{3,}|~{3,})/)
      if (match) {
        flushBlock()
        codeBlockMarker = match[1]
        currentBlockType = 'code'
        const rest = trimmed.slice(codeBlockMarker.length).trim()
        const langMatch = rest.match(/^([^:]+)(?::(.+))?$/)
        if (langMatch) {
          codeLang = langMatch[1].trim()
          codeTitle = langMatch[2] ? langMatch[2].trim() : ''
        }
        continue
      }
    } else {
      if (trimmed === codeBlockMarker) {
        flushBlock()
        codeBlockMarker = ''
        continue
      }
      currentBlockLines.push(line)
      continue
    }

    if (trimmed === '') {
      flushBlock()
      continue
    }

    // Check for start of an HTML/JSX block
    const htmlStartMatch = trimmed.match(/^<([A-Za-z][A-Za-z0-9-]*)/)
    if (htmlStartMatch) {
      const tag = htmlStartMatch[1]
      // It's a block-level HTML tag if it's in BLOCK_TAGS or if it finishes as a self-closing/closing tag on the same line
      const isBlockHtml = BLOCK_TAGS.has(tag) || trimmed.endsWith('/>') || trimmed.endsWith('>')
      if (isBlockHtml) {
        flushBlock()
        currentBlockType = 'html'
        htmlBlockTag = tag
        currentBlockLines.push(line)

        let isClosed = false
        if (SELF_CLOSING_TAGS.has(htmlBlockTag)) {
          isClosed = trimmed.includes('/>') || trimmed.endsWith('>')
        } else {
          isClosed = trimmed.includes(`</${htmlBlockTag}`)
        }
        if (isClosed) {
          flushBlock()
        }
        continue
      }
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      flushBlock()
      const depth = headingMatch[1].length
      const value = headingMatch[2].trim()
      const headingSlug = slug(value.replace(/<[^>]*(>|$)/g, ''))
      blocks.push(`<h${depth} id=${JSON.stringify(headingSlug)}>${formatInline(value)}</h${depth}>`)
      continue
    }

    if (trimmed.startsWith('>')) {
      if (currentBlockType !== 'blockquote') {
        flushBlock()
        currentBlockType = 'blockquote'
      }
      currentBlockLines.push(line)
      continue
    }

    if (/^(\*|-|\d+\.)\s+/.test(trimmed)) {
      if (currentBlockType !== 'list') {
        flushBlock()
        currentBlockType = 'list'
      }
      currentBlockLines.push(line)
      continue
    }

    if (trimmed.startsWith('|')) {
      if (currentBlockType !== 'table') {
        flushBlock()
        currentBlockType = 'table'
      }
      currentBlockLines.push(line)
      continue
    }

    if (currentBlockType !== 'paragraph') {
      flushBlock()
      currentBlockType = 'paragraph'
    }
    currentBlockLines.push(line)
  }

  flushBlock()

  return blocks.join('\n\n')
}

async function main() {
  console.log('🚀 Starting MDX to TSX Migration...')

  // 1. Migrate Author
  const authorFile = path.join(root, 'data/authors/default.mdx')
  const authorSource = fs.readFileSync(authorFile, 'utf-8')
  const authorParsed = matter(authorSource)
  const authorMetadata = authorParsed.data

  const authorRegistryContent = `import type { Author } from '~/types/blog'

export const allAuthors: Author[] = [
  {
    name: ${JSON.stringify(authorMetadata.name)},
    slug: 'default',
    avatar: ${JSON.stringify(authorMetadata.avatar)},
    occupation: ${JSON.stringify(authorMetadata.occupation)},
    company: ${JSON.stringify(authorMetadata.company)},
    email: ${JSON.stringify(authorMetadata.email)},
    twitter: ${JSON.stringify(authorMetadata.twitter)},
    linkedin: ${JSON.stringify(authorMetadata.linkedin)},
    github: ${JSON.stringify(authorMetadata.github)},
    type: 'Author'
  }
]
`
  fs.writeFileSync(path.join(root, 'data/author-registry.ts'), authorRegistryContent)
  console.log('✍️ Author registry created.')

  // 2. Migrate Blogs
  const blogsDir = path.join(root, 'data/blog')
  const blogFiles = fs.readdirSync(blogsDir).filter((f) => f.endsWith('.mdx'))
  const blogList: any[] = []

  for (const file of blogFiles) {
    const postSlug = file.replace(/\.mdx$/, '')
    const source = fs.readFileSync(path.join(blogsDir, file), 'utf-8')
    const { data: frontmatter, content } = matter(source)

    const rt = readingTime(content) as ReadingTimeResult

    const lines = content.split('\n')
    const toc: TocItem[] = []
    let inCodeBlock = false
    for (const line of lines) {
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock
        continue
      }
      if (inCodeBlock) continue
      const headingMatch = line.trim().match(/^(#{2,6})\s+(.+)$/)
      if (headingMatch) {
        const depth = headingMatch[1].length
        const value = headingMatch[2].trim().replace(/<[^>]*(>|$)/g, '')
        toc.push({
          value,
          url: '#' + slug(value),
          depth,
        })
      }
    }

    const postMetadata = {
      ...frontmatter,
      slug: postSlug,
      readingTime: rt,
      toc,
      filePath: `blog/${file}`,
      path: `blog/${postSlug}`,
      type: 'Blog',
    }
    blogList.push(postMetadata)

    const bodyJsx = markdownToJsx(content).replace(/\sclass=/g, ' className=')
    const serverPageContent = `import { PostLayout } from '~/layouts/post-layout'
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
  const post = allBlogs.find(p => p.slug === ${JSON.stringify(postSlug)})!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find(p => p.slug === ${JSON.stringify(postSlug)})!
  
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
    url: \`https://www.mushfiqweb.com/blog/\${post.slug}\`,
    author: authorDetails.map((author) => ({
      '@type': 'Person',
      name: author.name,
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostLayout content={post} authorDetails={authorDetails}>
        ${bodyJsx}
      </PostLayout>
    </>
  )
}
`
    if (!frontmatter.customPage) {
      const slugDir = path.join(root, 'app/blog', postSlug)
      fs.mkdirSync(slugDir, { recursive: true })
      fs.writeFileSync(path.join(slugDir, 'page.tsx'), serverPageContent)
    } else {
      console.log(`ℹ️ Skipping page generation for custom static page: ${postSlug}`)
    }
  }

  const blogRegistryContent = `import type { BlogPost } from '~/types/blog'

export const allBlogs: BlogPost[] = ${JSON.stringify(blogList, null, 2)}
`
  fs.writeFileSync(path.join(root, 'data/blog-registry.ts'), blogRegistryContent)
  console.log(`📝 Blog registry created with ${blogList.length} posts.`)

  // 3. Migrate Snippets
  const snippetsDir = path.join(root, 'data/snippets')
  const snippetFiles = fs.readdirSync(snippetsDir).filter((f) => f.endsWith('.mdx'))
  const snippetList: any[] = []

  for (const file of snippetFiles) {
    const postSlug = file.replace(/\.mdx$/, '')
    const source = fs.readFileSync(path.join(snippetsDir, file), 'utf-8')
    const { data: frontmatter, content } = matter(source)

    const rt = readingTime(content) as ReadingTimeResult

    const lines = content.split('\n')
    const toc: TocItem[] = []
    let inCodeBlock = false
    for (const line of lines) {
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock
        continue
      }
      if (inCodeBlock) continue
      const headingMatch = line.trim().match(/^(#{2,6})\s+(.+)$/)
      if (headingMatch) {
        const depth = headingMatch[1].length
        const value = headingMatch[2].trim().replace(/<[^>]*(>|$)/g, '')
        toc.push({
          value,
          url: '#' + slug(value),
          depth,
        })
      }
    }

    const postMetadata = {
      ...frontmatter,
      slug: postSlug,
      readingTime: rt,
      toc,
      filePath: `snippets/${file}`,
      path: `snippets/${postSlug}`,
      type: 'Snippet',
    }
    snippetList.push(postMetadata)

    const bodyJsx = markdownToJsx(content).replace(/\sclass=/g, ' className=')
    const serverSnippetContent = `import { PostLayout } from '~/layouts/post-layout'
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
  const snippet = allSnippets.find(p => p.slug === ${JSON.stringify(postSlug)})!
  return genPostMetadata(snippet)
}

export default function Page() {
  const snippet = allSnippets.find(p => p.slug === ${JSON.stringify(postSlug)})!
  
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
    url: \`https://www.mushfiqweb.com/snippets/\${snippet.slug}\`,
    author: authorDetails.map((author) => ({
      '@type': 'Person',
      name: author.name,
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostLayout content={snippet} authorDetails={authorDetails}>
        ${bodyJsx}
      </PostLayout>
    </>
  )
}
`
    const slugDir = path.join(root, 'app/snippets', postSlug)
    fs.mkdirSync(slugDir, { recursive: true })
    fs.writeFileSync(path.join(slugDir, 'page.tsx'), serverSnippetContent)
  }

  const snippetRegistryContent = `import type { Snippet } from '~/types/blog'

export const allSnippets: Snippet[] = ${JSON.stringify(snippetList, null, 2)}
`
  fs.writeFileSync(path.join(root, 'data/snippet-registry.ts'), snippetRegistryContent)
  console.log(`📝 Snippet registry created with ${snippetList.length} snippets.`)

  // 4. Generate JSON Search index and Tag Count
  const allPosts = [...blogList, ...snippetList]

  let tagCount: Record<string, number> = {}
  allPosts.forEach((file) => {
    if (file.tags && file.draft !== true) {
      file.tags.forEach((tag: string) => {
        let formattedTag = slug(tag)
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1
        } else {
          tagCount[formattedTag] = 1
        }
      })
    }
  })
  fs.writeFileSync(path.join(root, 'json/tag-data.json'), JSON.stringify(tagCount, null, 2))
  console.log('🏷️ tag-data.json generated.')

  const sortedPosts = allPosts
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  fs.writeFileSync(path.join(root, 'public/search.json'), JSON.stringify(sortedPosts, null, 2))
  console.log('🔍 search.json generated.')

  console.log('🎉 MDX to TSX Migration Completed Successfully!')
}

main().catch(console.error)
