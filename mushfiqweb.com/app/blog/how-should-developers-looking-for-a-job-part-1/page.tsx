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
  const post = allBlogs.find((p) => p.slug === 'how-should-developers-looking-for-a-job-part-1')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'how-should-developers-looking-for-a-job-part-1')!

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
        <p>
          You might ~~already~~ not know, but I recently switched companies and am now working at{' '}
          <Link href="https://coccoc.com">Cốc Cốc</Link>. After two months of probation, I’m now a
          full-time employee <Twemoji emoji="party-popper" /> <Twemoji emoji="party-popper" />{' '}
          <Twemoji emoji="party-popper" />
        </p>

        <p>
          !<Link href="/static/images/congrat.gif">Congratulations</Link>
        </p>

        <p>
          To get this opportunity, I went through quite a few interviews, both good and bad. In this
          post, I want to share with you how to prepare your profile and interview to land a good
          job <Twemoji emoji="smiling-face-with-sunglasses" />
        </p>

        <p>---</p>

        <p>
          From what I see, the demand for IT jobs is currently very high. The shortage of manpower
          will continue for a long time, so as long as you have above-average programming skills,
          you can easily find many positions with decent salaries compared to other
          industries—without relying on connections or relationships.
        </p>

        <p>
          So, how can a developer find the job they want <Twemoji emoji="thinking-face" />?
        </p>

        <blockquote>
          <p>
            [!TIP] The answer lies in how you prepare your <strong>profile</strong>!
          </p>
        </blockquote>

        <h2 id="writing-a-cv">Writing a CV</h2>

        <p>
          Your <strong>CV</strong> is the minimum but extremely important document to get a job. If
          you don’t have one, just google{' '}
          <strong>software developer/software engineer CV template</strong>, and you’ll find many
          templates to refer to. However, choose a template that’s not too flashy—simple, clear
          layout, easy to read is all you need...
        </p>

        <p>How should you write your CV?</p>

        <h3 id="dos-">
          Do's <Twemoji emoji="thumbs-up" />
        </h3>

        <ul>
          <li>
            Your CV should include all the necessary content for recruiters. I believe the two most
            important sections are <strong>skills</strong> and <strong>working experience</strong>.
            List all the skills you have (remember to only include what you actually know, no
            bluffing because it’ll be embarrassing when you can’t answer questions about them{' '}
            <Twemoji emoji="beaming-face-with-smiling-eyes" />{' '}
            <Twemoji emoji="beaming-face-with-smiling-eyes" />
            ). Working experience should include the <strong>projects</strong> you’ve worked on in
            previous companies, or even university projects or large assignments.
          </li>
        </ul>

        <br />

        <p>What did you do? What role did you take? What were your accomplishments?...</p>

        <ul>
          <li>
            Organize the content in your CV logically. <strong>Skills</strong> and{' '}
            <strong>Working Experience</strong> are the most important sections, so place them at
            the top. Other sections like <strong>education</strong>, <strong>achievements</strong>,{' '}
            <strong>side projects</strong>, or <strong>hobbies</strong> should go at the bottom
            because they don’t get as much attention. I include them just to make the CV look nicer.
          </li>
        </ul>

        <ul>
          <li>
            Additional info like academic scores, achievements in competitions, or recommendations
            from <strong>ex-seniors/ex-leaders</strong> is also an advantage (though I don’t have
            any <Twemoji emoji="grinning-face-with-sweat" />
            ).
          </li>
        </ul>

        <ul>
          <li>
            If you’re comfortable, it’s best to write your CV in English. I think this is a big plus
            for developers since English is really important in this field.
          </li>
        </ul>

        <h3 id="donts-">
          Don'ts <Twemoji emoji="thumbs-down" />
        </h3>

        <ul>
          <li>
            Don’t list all the technologies you’ve come across—only include what you’ve actually
            worked with and have experience in. If you don’t understand a skill you’ve listed in
            your CV, you won’t be able to answer when asked by the recruiter.
          </li>
        </ul>

        <ul>
          <li>
            Don’t add unnecessary information: Social media accounts like <strong>Facebook</strong>{' '}
            or <strong>Instagram</strong> shouldn’t be included as they are irrelevant and can even
            seem unprofessional to recruiters. Stick to professional profiles like{' '}
            <Link href="https://github.com/hta218">Github</Link>,{' '}
            <Link href="https://www.linkedin.com/in/hta218/">LinkedIn</Link>, or work-related
            contacts like <strong>Skype</strong> or <strong>Telegram</strong>...
          </li>
        </ul>

        <ul>
          <li>
            If you include a photo, avoid casual pictures. Choose a professional one, or you can
            even skip the photo entirely. People care if you can do the job, not if you’re
            good-looking or not (except maybe your spouse <Twemoji emoji="cat-with-tears-of-joy" />
            ).
          </li>
        </ul>

        <ul>
          <li>
            HTML: <Twemoji emoji="star" />
            <Twemoji emoji="star" />
            <Twemoji emoji="star" />
            <Twemoji emoji="star" />
            <Twemoji emoji="star" />
          </li>
        </ul>

        <p>
          CSS: <Twemoji emoji="star" />
          <Twemoji emoji="star" />
          <Twemoji emoji="star" />
          <Twemoji emoji="star" />
          <Twemoji emoji="star" />
          <Twemoji emoji="star" />
          <Twemoji emoji="star" />
          <Twemoji emoji="star" />
        </p>

        <p>
          JavaScript: <Twemoji emoji="star" />
          <Twemoji emoji="star" />
          <Twemoji emoji="star" />
          <Twemoji emoji="star" />
          <Twemoji emoji="star" />
          <Twemoji emoji="star" />
          <Twemoji emoji="star" />
          <Twemoji emoji="star" />
        </p>

        <p>Progress bars or rankings to show off levels of skill are nonsense, never use them!</p>

        <p>
          If you don’t want to write it yourself, you can use <strong>CV generator tools</strong>,
          but I recommend writing it on your own so it’s easier to customize as you like.
        </p>

        <h2 id="finding-opportunities">Finding Opportunities</h2>

        <p>Once your profile is ready, it’s time to hit the job market!</p>

        <p>
          Job platforms are the easiest place to find opportunities. Create an account on some major
          platforms like:
        </p>

        <ul>
          <li>https://itviec.com</li>
          <li>https://topdev.vn</li>
          <li>https://www.vietnamworks.com</li>
        </ul>

        <p>For English platforms:</p>

        <ul>
          <li>https://www.linkedin.com</li>
          <li>https://glints.com</li>
          <li>https://www.glassdoor.com</li>
        </ul>

        <p>
          Make sure to fill out your <strong>profile</strong>, <strong>upload your CV</strong>, and
          list the jobs you’re interested in. You can enable notifications or subscribe to receive
          job updates via email.
        </p>

        <p>You’ll have recruiters reaching out to you every day in no time.</p>

        <p>
          !<Link href="/static/images/comehere.gif 'Come here babe'">Come here babe</Link>
        </p>

        <h2 id="personal-experience">Personal Experience</h2>

        <p>
          Personally, I find <strong>LinkedIn</strong> to be the most important. Make sure to have a
          good, complete profile here (you can even export a CV from your LinkedIn profile or import
          it to other platforms).
        </p>

        <p>
          Connect with as many people in the industry as possible: developers, recruiters, sales...
          Expanding your network will give you more opportunities.
        </p>

        <p>
          Enable the <strong>Open for Opportunity</strong> setting so recruiters can find you easily
          (but turn it off once you have a job because recruiters can spam messages and calls a
          lot).
        </p>

        <p>
          To be more proactive, you can{' '}
          <Link href="https://www.linkedin.com/posts/hta218_webdeveloper-nodejs-reactjs-activity-6650609183601328128-pIci">
            post on LinkedIn
          </Link>{' '}
          like I did.
        </p>

        <p>
          !<Link href="/static/images/linkedin-post.png">Linkedin post</Link>
        </p>

        <p>LinkedIn is really effective at connecting devs and recruiters.</p>

        <p>
          !<Link href="/static/images/linkedin1.png">Linkedin 1</Link>
        </p>

        <p>
          !<Link href="/static/images/linkedin2.png">Linkedin 2</Link>
        </p>

        <p>Then you’ll get tons of messages and calls from recruiters across all platforms.</p>

        <div className="flex">
          <img
            src="/static/images/linkedin3.png"
            style={{ width: '33.33%', objectFit: 'cover', height: '200px' }}
          />
          <img
            src="/static/images/linkedin4.png"
            style={{ width: '33.33%', objectFit: 'cover', height: '200px' }}
          />
          <img
            src="/static/images/linkedin5.jpg"
            style={{ width: '33.33%', objectFit: 'cover', height: '200px' }}
          />
        </div>

        <p>
          My advice is to ask recruiters for the <strong>Job Description (JD)</strong> first. Read
          it carefully to see if it matches your skills and whether the job offers the challenges
          and technologies you want to work with.
        </p>

        <p>
          Next, ask for the <strong>salary range</strong> for that position at the company. If it’s
          ~~high~~ reasonable, go ahead and apply.
        </p>

        <p>
          If you get the JD but don’t think it’s a good fit, reply to the recruiter. After all,
          they’ve made the effort to provide you with the information{' '}
          <Twemoji emoji="grinning-face-with-big-eyes" />
        </p>

        <p>
          !<Link href="/static/images/linkedin-jd.png">Linkedin JD</Link>
        </p>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <small>
            The JD I received (there are many more <Twemoji emoji="grinning-face-with-sweat" />)
          </small>
        </div>

        <p>
          You see, just by preparing a good{' '}
          <Link href="https://www.linkedin.com/in/hta218/">profile</Link> and promoting yourself a
          little, you’ll have tons of opportunities coming your way.
        </p>

        <p>
          I hope after this part, those who are considering a job change will polish their{' '}
          <strong>profile</strong> to get more opportunities. In the{' '}
          <Link href="/blog/how-should-developers-looking-for-a-job-part-2">next part</Link>, I’ll
          share about the interview process, choosing companies, salary negotiation, and finally
          starting the job!
        </p>
      </PostLayout>
    </>
  )
}
