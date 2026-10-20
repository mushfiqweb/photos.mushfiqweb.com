import { NextResponse } from 'next/server'
import { SITE_METADATA } from '~/data/site-metadata'

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate Request
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized. Missing token.' }, { status: 401 })
    }

    const tokenInput = authHeader.substring(7)
    const serverPassword = process.env.POST_PANEL_PASSWORD
    if (!serverPassword) {
      return NextResponse.json(
        { error: 'Server authentication password not configured.' },
        { status: 500 }
      )
    }

    const hashedServer = await hashPassword(serverPassword)

    if (tokenInput !== hashedServer) {
      return NextResponse.json({ error: 'Unauthorized. Invalid token.' }, { status: 401 })
    }

    // 2. Validate Payload
    const body = await request.json()
    const { title, slug, content, tags, summary, date, draft, authors } = body

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required fields.' },
        { status: 400 }
      )
    }

    const finalDate = date || new Date().toISOString().split('T')[0]
    const finalDraft = draft === undefined ? true : !!draft
    const finalTags = Array.isArray(tags) ? tags : []
    const finalAuthors = Array.isArray(authors) ? authors : ['default']
    const finalSummary = summary || ''

    // 3. Format MDX String
    const frontmatter = [
      '---',
      `title: '${title.replace(/'/g, "\\'")}'`,
      `date: '${finalDate}'`,
      `authors: [${finalAuthors.map((a) => `'${a}'`).join(', ')}]`,
      `tags: [${finalTags.map((t) => `'${t}'`).join(', ')}]`,
      `draft: ${finalDraft}`,
      `summary: '${finalSummary.replace(/'/g, "\\'")}'`,
      '---',
      '',
      content,
    ].join('\n')

    // 4. Retrieve Github Configuration
    const githubToken = process.env.GITHUB_API_TOKEN
    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub API token (GITHUB_API_TOKEN) not configured in server environment.' },
        { status: 500 }
      )
    }

    const repoUrl = SITE_METADATA.siteRepo || ''
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
    const owner = match ? match[1] : 'mushfiqweb'
    const repo = match ? match[2].replace(/\.git$/, '') : 'mushfiqweb-next'

    const gitHeaders = {
      Authorization: `token ${githubToken}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    }

    // 5. GitHub API Operations
    // Step A: Fetch base SHA of main branch
    const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/main`, {
      headers: gitHeaders,
    })
    if (!refRes.ok) {
      const err = await refRes.text()
      console.error('Fetch ref heads error:', err)
      return NextResponse.json(
        { error: `Failed to fetch main branch reference from GitHub: ${err}` },
        { status: 502 }
      )
    }
    const refData = await refRes.json()
    const mainSha = refData.object.sha

    // Step B: Create a new branch post/{slug}
    const branchName = `post/${slug}`
    const createBranchRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
      method: 'POST',
      headers: gitHeaders,
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: mainSha,
      }),
    })
    if (!createBranchRes.ok) {
      const err = await createBranchRes.text()
      console.error('Create branch error:', err)
      return NextResponse.json(
        { error: `Failed to create Git branch on GitHub: ${err}` },
        { status: 502 }
      )
    }

    // Step C: Create the file data/blog/{slug}.mdx
    // Encode content to base64 supporting unicode characters
    const encoder = new TextEncoder()
    const bytes = encoder.encode(frontmatter)
    let binaryString = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binaryString += String.fromCharCode(bytes[i])
    }
    const base64Content = btoa(binaryString)

    const filePath = `data/blog/${slug}.mdx`
    const createFileRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: gitHeaders,
        body: JSON.stringify({
          message: `feat(blog): add new post - ${title}`,
          content: base64Content,
          branch: branchName,
        }),
      }
    )
    if (!createFileRes.ok) {
      const err = await createFileRes.text()
      console.error('Create file error:', err)
      return NextResponse.json(
        { error: `Failed to commit file to GitHub branch: ${err}` },
        { status: 502 }
      )
    }

    // Step D: Open Pull Request
    const createPrRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      headers: gitHeaders,
      body: JSON.stringify({
        title: `feat(blog): add post "${title}"`,
        head: branchName,
        base: 'main',
        body: [
          "This Pull Request was generated from your blog's admin post panel.",
          '',
          '### Post Details:',
          `- **Title**: ${title}`,
          `- **Slug**: ${slug}`,
          `- **Date**: ${finalDate}`,
          `- **Tags**: ${finalTags.join(', ')}`,
          `- **Authors**: ${finalAuthors.join(', ')}`,
          `- **Draft**: ${finalDraft}`,
          `- **Summary**: ${finalSummary}`,
          '',
          `Please review the committed MDX file at [${slug}.mdx](https://github.com/${owner}/${repo}/blob/${branchName}/${filePath}) and merge when ready!`,
        ].join('\n'),
      }),
    })

    if (!createPrRes.ok) {
      const err = await createPrRes.text()
      console.error('Create Pull Request error:', err)
      return NextResponse.json(
        { error: `File committed but failed to create Pull Request: ${err}` },
        { status: 502 }
      )
    }

    const prData = await createPrRes.json()

    return NextResponse.json({
      success: true,
      prUrl: prData.html_url,
      prNumber: prData.number,
      branch: branchName,
    })
  } catch (e) {
    console.error('General post panel creation error:', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
