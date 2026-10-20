import { ArrowUpRight, Camera } from 'lucide-react';
import { PhotoGrid } from '~/components/gallery/photo-grid';
import { Container } from '~/components/ui/container';
import { ALL_PHOTOS } from '~/data/photos';

export default function HomePage() {
  return (
    <Container as="div" className="pt-6 sm:pt-10">
      {/* Hero Header */}
      <div className="w-full flex flex-col justify-center items-center text-center py-6 sm:py-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium mb-3">
          <Camera size={14} />
          <span>A Visual Journal</span>
          <Camera size={14} />
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white max-w-3xl">
          Moments, Light & Expressions
        </h1>

        <p className="mt-3 max-w-2xl text-sm sm:text-base font-normal leading-relaxed text-neutral-600 dark:text-neutral-300">
          A showcase of visual stories, candid portraits, concert energy, and urban architecture captured through the lens of{' '}
          <a
            href="https://www.google.com/search?q=mushfiqweb&num=10&newwindow=1"
            target="_blank"
            rel="noopener noreferrer"
            title="Search Mushfiqur Rahman Shishir on Google"
            aria-label="Search Mushfiqur Rahman Shishir on Google (opens in a new tab)"
            className="group relative inline-flex items-center gap-0.5 font-bold tracking-tight bg-gradient-to-r from-emerald-500 via-teal-400 via-sky-400 to-emerald-500 animate-shimmer-text bg-clip-text text-transparent hover:brightness-125 transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]"
          >
            <span>Mushfiqur Rahman Shishir</span>
            <ArrowUpRight
              size={15}
              className="inline-block text-emerald-500 dark:text-emerald-400 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
            />
          </a>
          .
        </p>
      </div>

      {/* Photo Showcase Gallery */}
      <PhotoGrid photos={ALL_PHOTOS} />
    </Container>
  )
}
