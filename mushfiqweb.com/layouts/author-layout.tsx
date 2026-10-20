import type { Author } from '~/types/blog'
import type { ReactNode } from 'react'
import { Container } from '~/components/ui/container'
import { Image } from '~/components/ui/image'
import { PageHeader } from '~/components/ui/page-header'
import { Mail, Linkedin } from 'lucide-react'
import { TbBrandGithub } from 'react-icons/tb'
import X from '~/icons/x.svg'

interface Props {
  children?: ReactNode
  content: Omit<Author, '_id' | '_raw' | 'body'>
}

export function AuthorLayout({ children, content }: Props) {
  let { name, avatar, occupation, company, email, twitter, linkedin, github } = content

  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title="About"
        description="A bit of background on who I am, what I do, and why I started this blog. Nothing too serious, just a little intro to the person typing away behind the scenes."
        className="border-b border-gray-200 dark:border-gray-700"
      />
      <div className="items-start space-y-12 py-8 md:grid md:grid-cols-3 md:gap-x-12 md:space-y-0 lg:gap-x-16">
        {/* Left column: Profile card */}
        <div className="flex flex-col items-center space-y-4 md:col-span-1">
          {avatar && (
            <div className="relative h-48 w-48 overflow-hidden rounded-full border border-gray-200 shadow-md dark:border-zinc-800">
              <Image
                src={avatar}
                alt={name}
                width={192}
                height={192}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-2xl font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-100">
              {name}
            </h2>
            <div className="text-gray-500 dark:text-gray-400">{occupation}</div>
            {company && (
              <div className="font-medium text-gray-500 dark:text-gray-400">{company}</div>
            )}
          </div>
          {/* Social links */}
          <div className="flex select-none items-center space-x-4 pt-4">
            {email && (
              <a
                href={`mailto:${email}`}
                className="text-gray-400 transition-colors duration-200 hover:text-zinc-800 dark:hover:text-white"
                title="Email"
              >
                <Mail size={22} strokeWidth={1.5} />
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors duration-200 hover:text-zinc-800 dark:hover:text-white"
                title="GitHub"
              >
                <TbBrandGithub fontSize={23} />
              </a>
            )}
            {twitter && (
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors duration-200 hover:text-zinc-800 dark:hover:text-white"
                title="X"
              >
                <X className="h-5 w-5" fill="currentColor" viewBox="0 0 1200 1227" />
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors duration-200 hover:text-zinc-800 dark:hover:text-white"
                title="LinkedIn"
              >
                <Linkedin size={22} strokeWidth={1.5} />
              </a>
            )}
          </div>
        </div>

        {/* Right column: Biography Content */}
        <div className="prose max-w-none pb-8 dark:prose-invert lg:prose-lg md:col-span-2">
          {children}
        </div>
      </div>
    </Container>
  )
}
