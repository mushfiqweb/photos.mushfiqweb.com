import type { Blog, Snippet } from '~/types/blog'
import { Container } from '~/components/ui/container'
import type { CoreContent } from '~/types/data'
import { SocialAccounts } from '../author/social-accounts'
import { LatestPosts } from './latest-posts'
import { HeroLink } from './hero-link'

export function Home({
  posts,
  snippets,
}: {
  posts: CoreContent<Blog>[]
  snippets: CoreContent<Snippet>[]
}) {
  return (
    <Container as="div" className="pt-4 lg:pt-12">      
      <div className="w-full min-h-[30vh] md:min-h-[35vh] flex flex-col justify-center items-center py-8 md:py-12">                 
        <p className="max-w-2xl text-center text-base md:text-lg font-normal leading-normal md:leading-relaxed text-neutral-800 dark:text-neutral-200">
          While playing the role of{' '}
          <HeroLink
            href="https://www.linkedin.com/in/mushfiqweb/"
            variant="linkedin"
            delay="200ms"
          >
            CTO
          </HeroLink>{' '}
          at{' '}
          <HeroLink
            href="https://allgentech.io/"
            variant="agt"
            delay="450ms"
          >
            AGT Software Partners
          </HeroLink>
          , I have been actively involved in full-stack development, bringing over 15 years of
          experience in delivering impactful solutions across diverse industries.
        </p>
        <p className="pt-8 text-center text-base md:text-lg font-medium text-neutral-700 dark:text-neutral-300">
          Let’s be social—connect with me!
        </p>

        <div className="pt-2">
          <SocialAccounts />
        </div>
      </div>
      <LatestPosts posts={posts} snippets={snippets} />      
    </Container>
  )
}

