import { clsx } from 'clsx'

interface CodeBlockProps {
  language?: string
  title?: string
  children: React.ReactNode
}

export function CodeBlock({ language, title, children }: CodeBlockProps) {
  return (
    <div className="my-6">
      {title && (
        <div className="rounded-t-md border-b border-zinc-700 bg-zinc-800 px-4 py-1.5 font-mono text-sm text-zinc-200">
          {title}
        </div>
      )}
      <pre
        className={clsx(
          'overflow-x-auto bg-zinc-950 p-4 font-mono text-sm text-zinc-100',
          title ? 'rounded-b-md' : 'rounded-md'
        )}
      >
        <code className={language ? `language-${language}` : undefined}>{children}</code>
      </pre>
    </div>
  )
}
