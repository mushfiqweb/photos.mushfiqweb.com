import { clsx } from 'clsx'

const blackGrit = '/static/images/black-grit.png'
const whiteGrit = '/static/images/white-grit.png'

export function GritBackground({ className }: { className?: string }) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .grit-bg {
          background-image: url("${blackGrit}");
        }
        .dark .grit-bg {
          background-image: url("${whiteGrit}");
        }
      `,
        }}
      />
      <div className={clsx('pointer-events-none absolute inset-0 z-[-2] bg-cover bg-center grit-bg opacity-30 dark:opacity-20', className)} />
    </>
  )
}
