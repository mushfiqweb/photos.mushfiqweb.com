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
      <div className={clsx(['absolute z-[-1]', 'bg-cover bg-center', 'grit-bg', className])} />
    </>
  )
}
