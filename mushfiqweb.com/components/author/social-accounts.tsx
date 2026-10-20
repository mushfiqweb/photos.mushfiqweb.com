import { clsx } from 'clsx'
import { Instagram, Linkedin, Facebook } from 'lucide-react'
import { SiStackoverflow } from 'react-icons/si'
import { TbBrandGithub, TbBrandLastfm } from 'react-icons/tb'
import { SITE_METADATA } from '~/data/site-metadata'
import X from '~/icons/x.svg'

export function SocialAccounts({ className }: { className?: string }) {
  const commonLinkClass =
    'text-gray-400 dark:text-gray-500 transition-all duration-300 ease-out hover:scale-125 hover:-translate-y-1'

  return (
    <div className={clsx('flex select-none justify-center space-x-6 pt-7', className)}>
      <a
        href={SITE_METADATA.github}
        target="_blank"
        className={clsx(commonLinkClass, 'hover:-rotate-12 hover:text-black dark:hover:text-white')}
        rel="noopener noreferrer"
        title="GitHub"
      >
        <span className="sr-only">Github</span>
        <TbBrandGithub fontSize={25} />
      </a>

      <a
        href={SITE_METADATA.x}
        target="_blank"
        className={clsx(commonLinkClass, 'hover:rotate-12 hover:text-black dark:hover:text-white')}
        rel="noopener noreferrer"
        title="X"
      >
        <span className="sr-only">X</span>
        <X className="h-5 w-5" fill="currentColor" viewBox="0 0 1200 1227" />
      </a>

      <a
        href={SITE_METADATA.linkedin}
        target="_blank"
        className={clsx(
          commonLinkClass,
          'hover:-rotate-6 hover:text-[#0077B5] dark:hover:text-[#0077B5]'
        )}
        rel="noopener noreferrer"
        title="LinkedIn"
      >
        <span className="sr-only">Linkedin</span>
        <Linkedin strokeWidth={1.5} size={24} />
      </a>

      <a
        href={SITE_METADATA.facebook}
        target="_blank"
        className={clsx(
          commonLinkClass,
          'hover:rotate-6 hover:text-[#1877F2] dark:hover:text-[#1877F2]'
        )}
        rel="noopener noreferrer"
        title="Facebook"
      >
        <span className="sr-only">Facebook</span>
        <Facebook strokeWidth={1.5} size={24} />
      </a>

      <a
        href={SITE_METADATA.instagram}
        target="_blank"
        className={clsx(
          commonLinkClass,
          'hover:-rotate-12 hover:text-[#E1306C] dark:hover:text-[#E1306C]'
        )}
        rel="noopener noreferrer"
        title="Instagram"
      >
        <span className="sr-only">Instagram</span>
        <Instagram strokeWidth={1.5} size={24} />
      </a>

      <a
        href={SITE_METADATA.lastfm}
        target="_blank"
        className={clsx(
          commonLinkClass,
          'hover:rotate-12 hover:text-[#D51007] dark:hover:text-[#D51007]'
        )}
        rel="noopener noreferrer"
        title="LastFM"
      >
        <span className="sr-only">LastFM</span>
        <TbBrandLastfm fontSize={23} />
      </a>

      <a
        href={SITE_METADATA.stackoverflow}
        target="_blank"
        className={clsx(
          commonLinkClass,
          'hover:-rotate-6 hover:text-[#F48024] dark:hover:text-[#F48024]'
        )}
        rel="noopener noreferrer"
        title="StackOverflow"
      >
        <span className="sr-only">StackOverflow</span>
        <SiStackoverflow fontSize={23} />
      </a>
    </div>
  )
}
