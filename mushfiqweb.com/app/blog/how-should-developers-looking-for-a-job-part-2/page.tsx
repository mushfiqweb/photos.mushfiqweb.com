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
  const post = allBlogs.find((p) => p.slug === 'how-should-developers-looking-for-a-job-part-2')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'how-should-developers-looking-for-a-job-part-2')!

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
          In the{' '}
          <Link href="/blog/how-should-developers-looking-for-a-job-part-1">previous part</Link>, I
          shared how to prepare your <strong>profile</strong>, write a <strong>CV</strong>, receive
          a <strong>job description</strong>, and apply for the desired position. If you’ve been
          invited for an interview, you can refer to my interview and salary negotiation experiences
          to get a good <strong>offer</strong>.
        </p>
        <p>
          I applied for several suitable positions and received interview invitations right away.
        </p>
        <p>
          !<Link href="/static/images/interview-calendar.png">Interview Calendar</Link>
        </p>
        <div style={{ textAlign: 'center' }}>
          <small>A few interview slots</small>
        </div>
        <h2 id="preparing-and-scheduling">Preparing and Scheduling</h2>
        <ul>
          <li>
            If you have <strong>offline interviews</strong>, only schedule one interview per
            session. The time spent getting acquainted, testing, and interviewing is quite
            consuming. You can't guarantee how long it will take (1 or 2 hours), so if it takes too
            long and you’re late for the next one, it’ll be a bad impression{' '}
            <Twemoji emoji="grinning-face-with-sweat" />
          </li>
        </ul>
        <ul>
          <li>
            Since I interviewed during the quarantine period and most companies were{' '}
            <strong>working from home</strong>, all my interviews were <strong>online</strong>. If
            you’re also having online interviews, you can schedule 2 interviews in one session since
            you don’t need to spend time commuting and preparing. Just be sure to space them out to
            have enough time in between.
          </li>
        </ul>
        <ul>
          <li>
            If you have multiple interviews, it’s best to proactively note them down in a{' '}
            <strong>calendar</strong> and download an app to remind yourself, so you don’t forget.
          </li>
        </ul>
        <ul>
          <li>
            Ideally, you should schedule interviews within 1-2 weeks if you’ve already quit your
            job—because the longer you’re unemployed, the less money you have to spend :)). If
            you’re interviewing while still employed, spread them out so your current boss doesn’t
            get too upset <Twemoji emoji="grinning-face-with-sweat" />
          </li>
        </ul>
        <ul>
          <li>
            Research the company beforehand to see what products they’re working on and what
            technologies they’re using. Some companies might ask if you know what product you’ll be
            working on, so preparing will help you score points in these situations.
          </li>
        </ul>
        <h2 id="the-screening-round">The Screening Round</h2>
        <p>
          Some companies will send you a test to complete within a few days or ask you to take a
          test during the interview. My experience with this is to treat it like a regular task at
          work and ask the interviewer thoroughly to understand the <strong>requirements</strong>.
        </p>
        <p>
          Treat the interviewer like a colleague, and ask questions if you need any help. You’ll
          definitely be rated higher if you engage in discussion rather than just coding silently
          from start to finish.
        </p>
        <h2 id="round-">
          Round <Twemoji emoji="keycap-1" size="base" />
        </h2>
        <p>
          !<Link href="/static/images/round1.jpg">Round 1</Link>
        </p>
        <p>
          After passing the test, you’ll have a <strong>technical interview</strong> with a{' '}
          <strong>Senior/Team Leader/Tech Lead/CTO</strong>.
        </p>
        <p>
          Some companies will interview in Vietnamese, while others will conduct it in both
          Vietnamese and English. Typically, they’ll ask if you can do the interview in English or
          have you take an English test first. If possible, I recommend interviewing in English.
        </p>
        <p>
          I had 2 full English interviews; the rest were technical interviews in Vietnamese followed
          by an English HR interview (open-topic). Working in an English-speaking environment will
          be very beneficial for your career later on (I know this well because my current boss is
          Russian, and every day I have to communicate using ~~broken~~ English with him).
        </p>
        <p>
          !<Link href="/static/images/english.jpg">Speak english</Link>
        </p>
        <p>
          During the interview, just answer openly. Say everything you understand about the topic
          when asked, don’t bluff or waste time with "uhm" and "ah". If you don’t know the answer,
          just honestly say you don’t know.
        </p>
        <p>
          There’s usually only one technical interview round, so this is your only chance for the
          interviewer to assess your skill level. For topics you’re confident in, present your
          knowledge confidently, thoroughly, and in detail!
        </p>
        <p>
          As you see, the technical interview isn’t complicated. Just relax, and you’ll nail the
          interview <Twemoji emoji="clapping-hands" />
          <Twemoji emoji="clapping-hands" />
        </p>
        <blockquote>
          <p>
            [!CAUTION] I’m just kidding; it’s nerve-wracking{' '}
            <Twemoji emoji="grinning-face-with-sweat" /> =&gt; The more interviews you do, the more
            confident you’ll get <Twemoji emoji="smiling-face-with-sunglasses" />
          </p>
        </blockquote>
        <p>
          After this round, companies will usually let you know if you passed. If you find yourself
          waiting forever with no response, it’s likely a no-go.
        </p>
        <p>
          !<Link href="/static/images/reject.png">Rejection</Link>
        </p>
        <div style={{ textAlign: 'center' }}>
          <small>A thoughtful company will always notify candidates even if they’re rejected</small>
        </div>
        <h2 id="round-">
          Round <Twemoji emoji="keycap-2" size="base" />
        </h2>
        <p>
          If HR contacts you for a second interview, congratulations! By this point, you’re 96.69%
          of the way to getting the job.
        </p>
        <p>
          This round usually involves HR, PM, CEO, CTO, etc. (depending on the company), who will
          ask questions (not technical ones) to learn more about you, your communication skills,
          personality, and work attitude to see if you’re a good cultural fit.
        </p>
        <p>
          In this round, just respond politely, and you’ll do fine (every boss wants good employees{' '}
          <Twemoji emoji="grinning-face-with-sweat" />
          ).
        </p>
        <Twemoji emoji="glowing-star" /> **Pro tip**: During this round, you’ll often be asked about
        your expected salary. From my experience, don’t give a specific number! Instead, provide a
        range. For example, if you want $1k, say **“My expected salary is between 1k - 1k3”**.
        Usually, companies will offer you the **minimum** of your range, so be strategic!
        <p>
          Next, they’ll ask when you can start working. For me, I wouldn’t start right away but
          would take 1-2 weeks off to relax, spend time with loved ones{' '}
          <Twemoji emoji="beaming-face-with-smiling-eyes" />, and prepare before starting work. You
          should also take a break and mentally prepare before starting the new job!
        </p>
        <blockquote>
          <p>
            [!NOTE] Every company’s interview process is different, but it’s generally like what
            I’ve described above. The most important thing is to prepare your knowledge thoroughly
            for the job. Everything else is secondary but can help you stand out because engineers
            are more than just coders, right? <Twemoji emoji="beaming-face-with-smiling-eyes" />
          </p>
        </blockquote>
        <h2 id="how-to-negotiate-a-good-salary">How to negotiate a good salary?</h2>
        <ul>
          <li>
            As I mentioned before, always provide a salary <strong>range</strong> instead of a
            specific number. Companies rarely offer what you want unless you ask for too little
            (then they’ll agree immediately <Twemoji emoji="grinning-face-with-sweat" />
            ).
          </li>
        </ul>
        <ul>
          <li>
            Be ready to <strong>negotiate</strong> if the company offers less than your value. Don’t
            be afraid to say you want a higher amount, but your reason must be reasonable, like
            comparing with your previous salary or mentioning another company with a higher{' '}
            <strong>offer</strong> but expressing that you prefer to work here! You’ll likely get a
            better offer if you’re willing to <strong>negotiate</strong>!
          </li>
        </ul>
        <h2 id="how-to-find-a-good-company">How to find a good company?</h2>
        <p>Your career greatly depends on where you work. So, how do you find a good company?</p>
        <ul>
          <li>
            <strong>Read reviews</strong>: Check out company reviews on sites like{' '}
            <Link href="https://reviewcongty.com/">reviewcongty</Link>,{' '}
            <Link href="https://itviec.com/">itviec</Link>. Don’t trust them completely since some
            companies have a lot of drama, but if a place is constantly criticized, then it’s best
            to avoid it. You can also ask acquaintances working there for a more reliable opinion.
          </li>
        </ul>
        <ul>
          <li>
            <strong>Ask the interviewer</strong>: Usually, after the interview, you’ll be asked if
            you have any questions. Take this chance to ask the following:
          </li>
        </ul>
        <ul>
          <li>
            Ask for feedback from the interviewer about your performance after the interview. This
            person will likely be your boss, someone you’ll interact with daily, so you should
            observe their attitude to see if they’re a good match for you. Are they friendly,
            easy-going, and willing to help when you’re stuck? Or are they condescending and
            critical?
          </li>
        </ul>
        <p>
          The right boss is key to staying long-term in a job. If you have a boss who constantly
          nitpicks, asks you to stay late, or calls for meetings right when it’s time to leave,
          it’ll be tough to work with them.
        </p>
        <ul>
          <li>
            Ask about the company’s salary and bonus policies. Is there a 13th-month salary? What’s
            the benefit package? How many days off are there annually? Is{' '}
            <strong>remote working</strong> an option? Does the company fully pay for insurance and
            personal income tax?
          </li>
        </ul>
        <ul>
          <li>
            Ask about the team’s working hours. Do they work on Saturday mornings? Is overtime
            common? If there’s OT, how is it compensated?
          </li>
        </ul>
        <blockquote>
          <p>
            [!TIP] Recruiters will appreciate when you ask these questions because it shows your
            seriousness about the job. Make sure to understand everything clearly before accepting
            an offer!
          </p>
        </blockquote>
        <ul>
          <li>
            <strong>Evaluate based on HR</strong>: Observe how the HR team approaches you, whether
            they care about your situation, whether the <strong>JD</strong> is professional, whether
            they’re punctual, and whether they follow up after the interview. If they’ve been
            trained
          </li>
        </ul>
      </PostLayout>
    </>
  )
}
