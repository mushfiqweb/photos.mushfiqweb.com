'use client'

import clsx from 'clsx'
import {
  AlertCircle,
  ArrowLeft,
  Bold,
  Calendar,
  CheckCircle,
  Code,
  Edit2,
  Eye,
  GitPullRequest,
  Image as ImageIcon,
  Italic,
  KeyRound,
  Link2,
  List,
  ListOrdered,
  Quote,
  Sparkles,
  Tag,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// Simple client-side markdown to HTML compiler for previewing posts
function parseMarkdownToHtml(md: string): string {
  if (!md) return '<p class="text-gray-400 italic">No content written yet.</p>'

  // Escape HTML tags to prevent XSS
  let html = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // Code blocks: ```js ... ```
  html = html.replace(/```(\w*)\n([\s\S]*?)\n```/g, (_, lang, code) => {
    return `<pre class="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg my-4 overflow-x-auto font-mono text-xs text-gray-800 dark:text-gray-200"><code class="language-${lang}">${code}</code></pre>`
  })

  // Inline code: `code`
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded font-mono text-xs text-indigo-600 dark:text-indigo-400">$1</code>'
  )

  // Headings
  html = html.replace(
    /^### (.*$)/gim,
    '<h3 class="text-lg font-bold mt-6 mb-2 text-gray-900 dark:text-gray-100">$1</h3>'
  )
  html = html.replace(
    /^## (.*$)/gim,
    '<h2 class="text-xl font-bold mt-8 mb-3 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-neutral-800 pb-1.5">$1</h2>'
  )
  html = html.replace(
    /^# (.*$)/gim,
    '<h1 class="text-2xl font-bold mt-10 mb-4 text-gray-900 dark:text-gray-100">$1</h1>'
  )

  // Blockquotes
  html = html.replace(
    /^\> (.*$)/gim,
    '<blockquote class="border-l-4 border-emerald-500 pl-4 py-1 italic my-4 text-gray-600 dark:text-gray-400 font-serif bg-emerald-500/5">$1</blockquote>'
  )

  // Images: ![alt](url)
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="rounded-xl my-6 max-w-full h-auto shadow-md border border-neutral-200 dark:border-neutral-800" />'
  )

  // Links: [text](url)
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-500 hover:underline">$1</a>'
  )

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

  // Italics
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>')

  // Lists
  html = html.replace(
    /^\s*-\s+(.*$)/gim,
    '<li class="ml-4 list-disc text-gray-700 dark:text-gray-300 my-1">$1</li>'
  )
  html = html.replace(
    /^\s*\d+\.\s+(.*$)/gim,
    '<li class="ml-4 list-decimal text-gray-700 dark:text-gray-300 my-1">$1</li>'
  )

  // Double linebreaks to paragraphs
  html = html
    .split(/\n\s*\n/)
    .map((para) => {
      if (
        para.trim().startsWith('<h') ||
        para.trim().startsWith('<pre') ||
        para.trim().startsWith('<blockquote') ||
        para.trim().startsWith('<li')
      ) {
        return para
      }
      return `<p class="leading-relaxed my-3 text-gray-700 dark:text-gray-300">${para}</p>`
    })
    .join('\n')

  return html
}

async function hashPassword(plainText: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(plainText)
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

type GitStatusType = 'idle' | 'auth' | 'branch' | 'commit' | 'pr' | 'success' | 'error'

export default function NewPostPage() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [tokenHash, setTokenHash] = useState('')
  const [authError, setAuthError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  // Editor metadata states
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [date, setDate] = useState('')
  const [tags, setTags] = useState('')
  const [authors, setAuthors] = useState('default')
  const [summary, setSummary] = useState('')
  const [draft, setDraft] = useState(true)

  // Editor content states
  const [content, setContent] = useState('')
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Workflow states
  const [gitStatus, setGitStatus] = useState<GitStatusType>('idle')
  const [gitErrorMsg, setGitErrorMsg] = useState('')
  const [createdPrUrl, setCreatedPrUrl] = useState('')
  const [createdPrNumber, setCreatedPrNumber] = useState<number | null>(null)

  // Check session storage on mount
  useEffect(() => {
    const savedHash = sessionStorage.getItem('post-panel-hash')
    if (savedHash) {
      setTokenHash(savedHash)
      setIsAuthenticated(true)
    }
    setDate(new Date().toISOString().split('T')[0])
  }, [])

  // Auto-generate slug from title
  useEffect(() => {
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // remove special chars
      .replace(/\s+/g, '-') // spaces to dashes
      .replace(/-+/g, '-') // multiple dashes to single
      .trim()
    setSlug(generated)
  }, [title])

  // Verify Admin Password
  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return

    setIsVerifying(true)
    setAuthError('')

    try {
      const hash = await hashPassword(password)
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passwordHash: hash }),
      })

      if (res.ok) {
        sessionStorage.setItem('post-panel-hash', hash)
        setTokenHash(hash)
        setIsAuthenticated(true)
      } else {
        const err = await res.json()
        setAuthError(err.error || 'Invalid password.')
        // Shake screen trigger
        const element = document.getElementById('login-card')
        element?.classList.add('animate-wiggle')
        setTimeout(() => element?.classList.remove('animate-wiggle'), 500)
      }
    } catch (err) {
      setAuthError('Connection failed.')
    } finally {
      setIsVerifying(false)
    }
  }

  // Format Text helper
  const handleFormatText = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const selected = text.substring(start, end)
    const replacement = prefix + selected + suffix

    setContent(text.substring(0, start) + replacement + text.substring(end))

    // Refocus cursor
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length)
    }, 0)
  }

  // Publish / PR trigger
  const handlePublish = async () => {
    if (!title.trim() || !slug.trim() || !content.trim()) {
      alert('Please fill out Title, Slug, and Post Content.')
      return
    }

    setGitStatus('auth')
    setGitErrorMsg('')

    try {
      // Step A: Format data
      const tagsArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
      const authorsArray = authors
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a.length > 0)

      setGitStatus('branch')

      // Step B: Submit API call
      const res = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenHash}`,
        },
        body: JSON.stringify({
          title,
          slug,
          date,
          tags: tagsArray,
          authors: authorsArray,
          summary,
          draft,
          content,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setCreatedPrUrl(data.prUrl)
        setCreatedPrNumber(data.prNumber)
        setGitStatus('success')
      } else {
        setGitErrorMsg(data.error || 'Failed to submit post PR to GitHub.')
        setGitStatus('error')
      }
    } catch (err) {
      setGitErrorMsg('Network request failed. Try again.')
      setGitStatus('error')
    }
  }

  // LOG OUT
  const handleLogout = () => {
    sessionStorage.removeItem('post-panel-hash')
    setTokenHash('')
    setPassword('')
    setIsAuthenticated(false)
  }

  // RENDER UNLOCK PANEL
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center bg-gray-50 px-4 dark:bg-dark">
        <div
          id="login-card"
          className="w-full max-w-md rounded-2xl border border-gray-200/50 bg-white/45 p-8 shadow-xl backdrop-blur-md dark:border-neutral-800/50 dark:bg-dark/45"
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-emerald-500/10 p-3 text-emerald-500 dark:bg-emerald-400/10 dark:text-emerald-400">
              <KeyRound size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Admin Post Panel</h2>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              Enter your password to unlock writing privileges.
            </p>
          </div>

          <form onSubmit={handleVerifyPassword} className="mt-6 space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter admin password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-100"
                disabled={isVerifying}
                required
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200/40 bg-red-50/50 p-3 text-xs text-red-600 dark:border-red-800/20 dark:bg-red-950/20 dark:text-red-400">
                <AlertCircle size={16} />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="flex w-full items-center justify-center rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-700"
            >
              {isVerifying ? 'Unlocking...' : 'Unlock Panel'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <ArrowLeft size={14} /> Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // RENDER WRITING WORKSPACE
  return (
    <div className="fixed inset-0 z-60 flex flex-col overflow-hidden bg-white p-4 dark:bg-dark sm:p-6">
      {/* Header Bar */}
      <div className="flex flex-none flex-col gap-4 border-b border-gray-100 pb-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:border-neutral-800 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-gray-100"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 sm:text-xl">
              Create New Blog Post
            </h1>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 sm:text-xs">
              Pre-formatted for Contentlayer2 and MDX plugins.
            </p>
          </div>
        </div>

        <div className="flex gap-2 sm:self-center">
          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-200 px-3.5 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:border-neutral-800 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-gray-100"
          >
            Lock Panel
          </button>
          <button
            onClick={handlePublish}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            <GitPullRequest size={14} /> Create Pull Request
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="mt-6 flex min-h-0 grow flex-col gap-6 overflow-hidden lg:flex-row">
        {/* Left Side: Metadata Panel */}
        <div className="max-h-40 w-full flex-none space-y-4 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50/50 p-5 pr-2 dark:border-neutral-800 dark:bg-neutral-900/30 lg:max-h-full lg:w-80">
          <h2 className="flex items-center gap-1.5 border-b border-gray-100 pb-2 text-sm font-semibold text-gray-900 dark:border-neutral-800 dark:text-gray-100">
            <Sparkles size={16} className="text-emerald-500" /> Post Metadata
          </h2>

          <div className="space-y-3.5 text-xs">
            {/* Title */}
            <div className="space-y-1">
              <label className="font-semibold text-gray-700 dark:text-gray-300">Post Title</label>
              <input
                type="text"
                placeholder="e.g. My New Amazing Tutorial"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-950 focus:border-emerald-500 focus:ring-emerald-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-100"
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-1">
              <label className="font-semibold text-gray-700 dark:text-gray-300">URL Slug</label>
              <input
                type="text"
                placeholder="e.g. my-new-amazing-tutorial"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-xs text-gray-950 focus:border-emerald-500 focus:ring-emerald-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-100"
                required
              />
            </div>

            {/* Date & Draft status */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-300">
                  <Calendar size={13} /> Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-950 focus:border-emerald-500 focus:ring-emerald-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-100"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-gray-300">Status</label>
                <div className="flex h-[34px] items-center gap-2">
                  <input
                    type="checkbox"
                    id="draft"
                    checked={draft}
                    onChange={(e) => setDraft(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 dark:border-neutral-800 dark:bg-neutral-900"
                  />
                  <label
                    htmlFor="draft"
                    className="cursor-pointer text-gray-600 dark:text-gray-400"
                  >
                    Draft
                  </label>
                </div>
              </div>
            </div>

            {/* Authors & Tags */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-300">
                  <User size={13} /> Authors (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="default"
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-950 focus:border-emerald-500 focus:ring-emerald-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-100"
                />
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-300">
                  <Tag size={13} /> Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="React, Nextjs, Tutorial"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-950 focus:border-emerald-500 focus:ring-emerald-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1">
              <label className="font-semibold text-gray-700 dark:text-gray-300">Summary</label>
              <textarea
                placeholder="A brief description of this blog post..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-950 focus:border-emerald-500 focus:ring-emerald-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Content Workspace */}
        <div className="flex min-h-0 grow flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/30">
          {/* Workspace Tabs */}
          <div className="flex flex-none items-center justify-between border-b border-gray-100 bg-gray-50/50 px-4 py-2 dark:border-neutral-800 dark:bg-neutral-900/30">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('write')}
                className={clsx(
                  'flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
                  activeTab === 'write'
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-800 dark:text-gray-100'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                )}
              >
                <Edit2 size={13} /> Write
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={clsx(
                  'flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
                  activeTab === 'preview'
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-800 dark:text-gray-100'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                )}
              >
                <Eye size={13} /> Preview
              </button>
            </div>
            <div className="text-[10px] text-gray-400 dark:text-gray-500">
              Words: {content ? content.split(/\s+/).filter(Boolean).length : 0} | Characters:{' '}
              {content.length}
            </div>
          </div>

          {/* Write Tab */}
          {activeTab === 'write' && (
            <div className="flex min-h-0 grow flex-col overflow-hidden">
              {/* Markdown Toolbar */}
              <div className="flex flex-none flex-wrap gap-1 border-b border-gray-100 bg-gray-50/20 p-2 dark:border-neutral-800">
                <button
                  type="button"
                  title="Bold"
                  onClick={() => handleFormatText('**', '**')}
                  className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-gray-100"
                >
                  <Bold size={15} />
                </button>
                <button
                  type="button"
                  title="Italic"
                  onClick={() => handleFormatText('*', '*')}
                  className="hover:text-gray-955 rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-gray-100"
                >
                  <Italic size={15} />
                </button>
                <div className="mx-1 my-1 w-px bg-gray-200 dark:bg-neutral-800" />
                <button
                  type="button"
                  title="Link"
                  onClick={() => handleFormatText('[', '](url)')}
                  className="hover:text-gray-955 rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-gray-100"
                >
                  <Link2 size={15} />
                </button>
                <button
                  type="button"
                  title="Image"
                  onClick={() => handleFormatText('![alt](', ')')}
                  className="hover:text-gray-955 rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-gray-100"
                >
                  <ImageIcon size={15} />
                </button>
                <div className="mx-1 my-1 w-px bg-gray-200 dark:bg-neutral-800" />
                <button
                  type="button"
                  title="Inline Code"
                  onClick={() => handleFormatText('`', '`')}
                  className="hover:text-gray-955 rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-gray-100"
                >
                  <Code size={15} />
                </button>
                <button
                  type="button"
                  title="Code Block"
                  onClick={() => handleFormatText('```javascript\n', '\n```')}
                  className="hover:text-gray-955 rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-gray-100"
                >
                  <Code size={15} className="scale-x-125" />
                </button>
                <button
                  type="button"
                  title="Blockquote"
                  onClick={() => handleFormatText('> ')}
                  className="hover:text-gray-955 rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-gray-100"
                >
                  <Quote size={15} />
                </button>
                <div className="mx-1 my-1 w-px bg-gray-200 dark:bg-neutral-800" />
                <button
                  type="button"
                  title="Bullet List"
                  onClick={() => handleFormatText('- ')}
                  className="hover:text-gray-955 rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-gray-100"
                >
                  <List size={15} />
                </button>
                <button
                  type="button"
                  title="Numbered List"
                  onClick={() => handleFormatText('1. ')}
                  className="hover:text-gray-955 rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-gray-100"
                >
                  <ListOrdered size={15} />
                </button>
              </div>

              {/* Editing Textarea */}
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your markdown blog post content here..."
                className="w-full grow resize-none overflow-y-auto border-0 bg-transparent px-4 py-3 font-mono text-sm leading-relaxed text-gray-900 focus:outline-none focus:ring-0 dark:text-gray-100"
              />
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div className="prose max-w-none grow overflow-y-auto px-6 py-5 dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(content) }} />
            </div>
          )}
        </div>
      </div>

      {/* GitHub Commit Status Modal Overlay */}
      {gitStatus !== 'idle' && (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-gray-100">
              <GitPullRequest size={20} className="text-emerald-500" /> GitHub Deployment Workflow
            </h3>

            <div className="mt-6 space-y-4 text-xs text-gray-600 dark:text-gray-300">
              {/* Step 1: Prep */}
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="shrink-0 text-emerald-500" />
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  Formatted metadata & compiled MDX document
                </span>
              </div>

              {/* Step 2: Branching */}
              <div className="flex items-center gap-3">
                {gitStatus === 'branch' ? (
                  <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                ) : gitStatus === 'commit' || gitStatus === 'pr' || gitStatus === 'success' ? (
                  <CheckCircle size={16} className="shrink-0 text-emerald-500" />
                ) : gitStatus === 'error' ? (
                  <AlertCircle size={16} className="shrink-0 text-red-500" />
                ) : (
                  <div className="h-4 w-4 shrink-0 rounded-full border border-gray-300 dark:border-neutral-700" />
                )}
                <span>Creating new branch post/{slug} on GitHub...</span>
              </div>

              {/* Step 3: Committing */}
              <div className="flex items-center gap-3">
                {gitStatus === 'commit' ? (
                  <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                ) : gitStatus === 'pr' || gitStatus === 'success' ? (
                  <CheckCircle size={16} className="shrink-0 text-emerald-500" />
                ) : (
                  <div className="h-4 w-4 shrink-0 rounded-full border border-gray-300 dark:border-neutral-700" />
                )}
                <span>Committing blog file data/blog/{slug}.mdx...</span>
              </div>

              {/* Step 4: PR Creation */}
              <div className="flex items-center gap-3">
                {gitStatus === 'pr' ? (
                  <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                ) : gitStatus === 'success' ? (
                  <CheckCircle size={16} className="shrink-0 text-emerald-500" />
                ) : (
                  <div className="h-4 w-4 shrink-0 rounded-full border border-gray-300 dark:border-neutral-700" />
                )}
                <span>Submitting Pull Request into main...</span>
              </div>
            </div>

            {/* Error UI */}
            {gitStatus === 'error' && (
              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-red-200/40 bg-red-50/50 p-4 text-xs text-red-600 dark:bg-red-950/20 dark:text-red-400">
                  <p className="flex items-center gap-1.5 font-bold">
                    <AlertCircle size={15} /> Deployment Failed
                  </p>
                  <p className="mt-1 break-all font-mono">{gitErrorMsg}</p>
                </div>
                <button
                  onClick={() => setGitStatus('idle')}
                  className="hover:bg-gray-150 w-full rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-700 dark:border-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-800"
                >
                  Close & Edit Post
                </button>
              </div>
            )}

            {/* Success UI */}
            {gitStatus === 'success' && (
              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-emerald-200/40 bg-emerald-50/50 p-4 text-xs text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                  <p className="flex items-center gap-1.5 font-bold">
                    <CheckCircle size={15} /> Pull Request Open
                  </p>
                  <p className="mt-1">
                    Successfully committed post! You can now review and merge the PR on GitHub.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setGitStatus('idle')
                      setTitle('')
                      setContent('')
                      setSummary('')
                      setTags('')
                    }}
                    className="flex-1 rounded-lg border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-800"
                  >
                    Write Another Post
                  </button>
                  <a
                    href={createdPrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500 py-2.5 text-xs font-semibold text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                  >
                    <GitPullRequest size={14} /> Review PR #{createdPrNumber}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
