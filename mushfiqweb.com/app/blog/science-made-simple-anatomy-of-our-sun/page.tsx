import { PostLayout } from '~/layouts/post-layout'
import { Twemoji } from '~/components/ui/twemoji'
import { Image } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import { Pre } from '~/components/mdx/pre'
import { CodeTitle } from '~/components/mdx/code-title'
import { TableWrapper } from '~/components/mdx/table-wrapper'
import { Callout } from '~/components/mdx/callout'
import { CodeBlock } from '~/components/mdx/code-block'
import { allBlogs } from '~/data/blog-registry'
import { allAuthors } from '~/data/author-registry'
import { genPostMetadata } from '~/utils/metadata'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const post = allBlogs.find((p) => p.slug === 'science-made-simple-anatomy-of-our-sun')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'science-made-simple-anatomy-of-our-sun')!

  const authorList = post.authors || ['default']
  const authorDetails = authorList.map((authorSlug) => {
    return allAuthors.find((p) => p.slug === authorSlug)!
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.lastmod || post.date,
    description: post.summary,
    image: post.images ? post.images[0] : '/static/images/logo.jpg',
    url: `https://www.mushfiqweb.com/blog/${post.slug}`,
    author: authorDetails.map((author) => ({
      '@type': 'Person',
      name: author.name,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostLayout content={post} authorDetails={authorDetails}>
        <p>🔥 The Inner Layers: The Solar Forge 🔥</p>

        <ol>
          <li>The Core: The Engine of the Solar System</li>
        </ol>

        <p>
          This is where the Sun generates its immense energy. The temperature in the core is a
          blistering 15 million degrees Celsius (27 million degrees Fahrenheit). The plasma here is
          unimaginably dense—about 150 times the density of liquid water, or nearly 10 times denser
          than solid lead.
        </p>

        <p>
          Under this crushing pressure and heat, a process called the proton-proton chain reaction
          occurs. Hydrogen nuclei are violently smashed together to fuse into helium. Every single
          second, the Sun converts 4 million tonnes of matter directly into pure energy (following
          Einstein’s famous $E=mc^2$ equation). This energy begins an incredibly slow journey toward
          the surface.
        </p>

        <ol>
          <li>The Radiative Zone: The Slow Crawl of Light</li>
        </ol>

        <p>
          Sitting just above the core, the radiative zone spans about 70% of the Sun's radius. The
          plasma here is too dense for convection (boiling) to occur. Instead, the energy generated
          in the core must diffuse slowly outward as electromagnetic radiation.
        </p>

        <p>
          Because the plasma is so tightly packed, photons (particles of light) travel only a few
          millimeters before crashing into an atom, being absorbed, and re-emitted in a random
          direction. This pinball-like trajectory is known as the "random walk." As a result, it
          takes a single photon roughly 170,000 to 200,000 years to successfully navigate through
          this zone!
        </p>

        <ol>
          <li>The Tachocline: The Magnetic Dynamo</li>
        </ol>

        <p>
          This is the critical transition boundary between the solid-body rotation of the inner
          radiative zone and the fluid, differential rotation of the outer convective zone.
        </p>

        <p>
          Below the tachocline, the Sun rotates together as a solid sphere. Above it, the plasma
          rotates at different speeds depending on its latitude (faster at the equator, slower at
          the poles). This violent change in rotation speeds creates massive shearing forces.
          Astrophysicists believe the tachocline is the birthplace of the Solar Dynamo—the engine
          that generates the Sun's massive and twisting magnetic field, ultimately dictating the
          11-year solar cycle.
        </p>

        <ol>
          <li>The Convective Zone: A Boiling Ocean of Plasma</li>
        </ol>

        <p>
          Lying between the tachocline and the visible surface, this layer is 200,000 km (124,000
          mi) deep. Because the temperature drops as you move outward, the plasma here is cool
          enough (and therefore opaque enough) to trap heat.
        </p>

        <p>
          Instead of radiating outward, the heat is carried by convection—much like a lava lamp or a
          pot of aggressively boiling soup. Vast columns of hot plasma become buoyant, rising
          rapidly to the surface, releasing their heat into space, cooling, and plunging back down
          to be reheated.
        </p>

        <p>🌬️ The Outer Atmosphere: Heat and Mystery</p>

        <ol>
          <li>The Photosphere: The "Surface"</li>
        </ol>

        <p>
          This is the visible "surface" of the Sun that we see from Earth. Almost all of the Sun's
          radiation is emitted from this incredibly thin layer (only about 400 km thick). Here, the
          plasma is finally thin enough that light can escape freely into the vacuum of space,
          taking only 8 minutes and 20 seconds to reach Earth. Temperatures here are a relatively
          cool 5,500 degrees Celsius.
        </p>

        <ol>
          <li>The Chromosphere: The Color Sphere</li>
        </ol>

        <p>
          Just above the photosphere lies the chromosphere. During a total solar eclipse, this layer
          briefly flashes as a brilliant ruby-red ring. This red glow comes from the hydrogen-alpha
          emission line. Temperatures uniquely begin to rise here—from 4,000 up to 25,000 degrees
          Celsius. Giant, grass-like spires of gas known as spicules shoot up from this layer at
          supersonic speeds, reaching heights of 10,000 km.
        </p>

        <ol>
          <li>The Transition Region: The Great Leap</li>
        </ol>

        <p>
          This is a razor-thin, irregular boundary layer separating the cooler chromosphere from the
          scorching corona. Across mere tens of kilometers, the temperature of the solar plasma
          experiences a violent and sudden spike, soaring to nearly one million degrees Celsius. In
          this region, the dynamics of the Sun shift drastically: magnetic forces entirely take
          over, dictating the movement and shape of the plasma.
        </p>

        <ol>
          <li>The Corona: The Great Mystery</li>
        </ol>

        <p>
          The Sun's outermost atmosphere, the corona, extends millions of kilometers into deep
          space. It is a pearly white halo visible only during a total eclipse (or via specialized
          instruments called coronagraphs).
        </p>

        <p>
          The corona presents one of astrophysics' greatest mysteries: the Coronal Heating Problem.
          While the Sun's surface is 5,500 °C, the corona is millions of degrees hotter (up to
          3,000,000 °C). It is like walking away from a campfire and realizing the air gets hotter
          the further you step back. Scientists believe magnetic waves (Alfvén waves) or millions of
          tiny "nanoflares" are responsible for this extreme heating. The corona is also the
          birthplace of the solar wind, a continuous stream of charged particles blowing out into
          the solar system.
        </p>

        <p>🌩️ Space Weather: Solar Phenomena</p>

        <p>
          The Sun is not a static glowing ball; it is a violently active star governed by an 11-year
          magnetic cycle.
        </p>

        <p>
          Sunspots: Temporary, dark patches on the photosphere. They appear dark simply because they
          are about 1,000 degrees cooler than the surrounding surface. They are caused by incredibly
          intense magnetic field lines punching through the surface, inhibiting the rise of hot
          plasma from below. The number of sunspots is the primary indicator of where we are in the
          11-year solar cycle.
        </p>

        <p>
          Granulation: The granular, bubbling pattern covering the entire photosphere. Each
          "granule" is the top of a convection cell—about 1,000 km wide (roughly the size of Texas).
          Hot plasma rises in the bright center, cools, and sinks down the dark outer edges. Each
          granule boils for about 20 minutes before dissipating.
        </p>

        <p>
          Prominences &amp; Filaments: Massive, looping arches of relatively cool, dense plasma
          suspended high in the hot corona by tangled magnetic field lines. When viewed against the
          dark backdrop of space, they are called prominences; when viewed directly against the
          bright face of the Sun, they appear as dark lines called filaments.
        </p>

        <p>
          Solar Flares: Sudden, violent flashes of electromagnetic radiation. Flares occur when
          tangled magnetic fields suddenly snap, reconnect, and drop into a more stable
          configuration—much like a twisted rubber band violently snapping back. They send X-rays
          and UV radiation toward Earth at the speed of light, capable of disrupting radio
          communications.
        </p>

        <p>
          Coronal Mass Ejections (CMEs): The most powerful explosions in the solar system. CMEs are
          vast eruptions of billions of tonnes of highly charged plasma and magnetic fields expelled
          from the corona. Traveling at millions of miles per hour, a direct hit on Earth can
          compress our magnetic field, triggering spectacular auroras, but also threatening
          satellite electronics, GPS arrays, and terrestrial power grids (such as the famous 1859
          Carrington Event).
        </p>

        <p>
          Source: Extensively adapted and expanded from European Space Agency (ESA) publications,
          NASA Solar Dynamics Observatory data, and modern astrophysical research.
        </p>
      </PostLayout>
    </>
  )
}
