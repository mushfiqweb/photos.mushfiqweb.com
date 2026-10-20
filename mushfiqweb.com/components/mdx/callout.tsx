import { clsx } from 'clsx'

interface CalloutProps {
  type?: 'info' | 'warning' | 'tip' | 'danger'
  children: React.ReactNode
}

export function Callout({ type = 'info', children }: CalloutProps) {
  const styles = {
    info: 'bg-blue-50 border-blue-500 text-blue-900 dark:bg-blue-950/30 dark:border-blue-400 dark:text-blue-200',
    warning:
      'bg-amber-50 border-amber-500 text-amber-900 dark:bg-amber-950/30 dark:border-amber-400 dark:text-amber-200',
    tip: 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-400 dark:text-emerald-200',
    danger:
      'bg-red-50 border-red-500 text-red-900 dark:bg-red-950/30 dark:border-red-400 dark:text-red-200',
  }

  return <div className={clsx('my-6 rounded-r-md border-l-4 p-4', styles[type])}>{children}</div>
}
