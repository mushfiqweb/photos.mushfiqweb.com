import { clsx } from 'clsx'
import Image from 'next/image'
import TiltedGrid from '~/icons/cover-bg.jpg'

export function TiltedGridBackground({ className }: { className?: string }) {
  return (
    <div
      className={clsx([
        'absolute overflow-hidden [mask-image:linear-gradient(white,transparent)]',
        className,
      ])}
    >
      <Image
        src={TiltedGrid}
        fill
        priority
        alt=""
        className={clsx([
          'h-[160%] w-full object-cover',
          // 'absolute inset-x-0 inset-y-[-30%] skew-y-[-18deg]',
          // 'dark:fill-white/[.01] dark:stroke-white/[.025]',
          'fill-black/[0.02] stroke-black/5',
        ])}
      />
    </div>
  )
}
