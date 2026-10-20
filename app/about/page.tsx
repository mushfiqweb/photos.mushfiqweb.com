import { Container } from '~/components/ui/container'
import { Link } from '~/components/ui/link'
import { Camera, ExternalLink, Globe, Heart, Sliders } from 'lucide-react'
import Image from 'next/image'
import { genPageMetadata } from '~/app/seo'

export const metadata = genPageMetadata({
  title: 'About the Photography',
  description: 'Learn about the camera gear, photography philosophy, and creative journey of Mushfiqur Rahman.',
  image: '/og-image.png',
})

export default function AboutPage() {
  return (
    <Container as="div" className="pt-8 sm:pt-14 max-w-4xl">
      <div className="space-y-8 sm:space-y-12">
        {/* Intro */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-neutral-200 dark:border-neutral-800">
          <div className="relative h-28 w-28 sm:h-36 sm:w-36 shrink-0 rounded-2xl overflow-hidden ring-2 ring-emerald-500/20 shadow-xl">
            <Image
              src="/static/images/logo.jpg"
              alt="Mushfiqur Rahman"
              fill
              className="object-cover"
            />
          </div>
          <div className="text-center sm:text-left space-y-2">
            <span className="text-xs font-mono font-medium text-emerald-500 tracking-wider uppercase">
              Behind the Viewfinder
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Mushfiqur Rahman
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Full Stack Developer, CTO at AGT Software Partners, and lifelong enthusiast of visual storytelling, light manipulation, and street photography.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <Link
                href="https://mushfiqweb.com"
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
              >
                <Globe size={14} />
                <span>mushfiqweb.com</span>
                <ExternalLink size={12} />
              </Link>
              <Link
                href="https://github.com/mushfiqweb"
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
              >
                <span>GitHub</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* Philosophy */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <Heart size={20} className="text-red-500" />
            <span>The Photography Philosophy</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Photography has always been a medium to pause fleeting reality. Whether it is the electric atmosphere of a Shironamhin concert on campus, raw reflections on city pavements, or quiet human expressions that tell an untold story, each frame encapsulates a moment preserved forever.
          </p>
        </section>

        {/* Gear & Tech */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <Camera size={20} className="text-emerald-500" />
            <span>Camera Gear & Technical Setup</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
              <span className="text-xs font-mono text-neutral-400">Primary Body</span>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white mt-0.5">
                Nikon D3000 DSLR
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Classic 10.2 Megapixel CCD sensor delivering distinct color fidelity and natural tones.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
              <span className="text-xs font-mono text-neutral-400">Lenses</span>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white mt-0.5">
                AF-S DX NIKKOR 18-55mm
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Versatile focal range for street compositions, portraits, and wide panorama framing.
              </p>
            </div>
          </div>
        </section>

        {/* EXIF Engine Note */}
        <section className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
            <Sliders size={16} />
            <span>Local EXIF Engine</span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Every photo presented in this showcase has been analyzed directly from its camera raw metadata. When browsing photos in the gallery, the interactive lightbox exposes the exact aperture, shutter speed, ISO sensitivity, and focal length used for each shot.
          </p>
        </section>
      </div>
    </Container>
  )
}
