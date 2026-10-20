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
  const post = allBlogs.find(
    (p) => p.slug === 'stop-using-claude-code-for-everything-heres-what-it-actually-excels-at'
  )!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find(
    (p) => p.slug === 'stop-using-claude-code-for-everything-heres-what-it-actually-excels-at'
  )!

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
          Let me guess. You watched a demo on Twitter, fired up Claude Code in your terminal, gave
          it a massive, vague prompt to "build a full-stack SaaS app with Next.js and Postgres," and
          sat back feeling like a tech god.
        </p>

        <p>
          Then you watched it confidently write thousands of lines of code... that completely broke
          the second you tried to run{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'npm run dev'}</code>.
        </p>

        <p>Yeah. We've all been there.</p>

        <p>
          The hype around agentic AI—especially terminal-native ones like Anthropic's Claude Code—is
          absolutely deafening right now. Influencers are shouting from the rooftops that the end of
          the software engineering profession is nigh. But if you actually use this tool day-to-day
          in a production codebase, reality hits hard and fast: AI isn't a senior architect. It is
          an incredibly fast, highly capable, but dangerously overconfident junior developer that
          desperately needs adult supervision.
        </p>

        <p>
          When you use Claude Code for the right tasks, it feels like pure magic. It genuinely
          deletes entire categories of boring work. But when you use it wrong, you end up spending
          more time untangling its hallucinated spaghetti code than you would have spent just
          writing the feature yourself from scratch.
        </p>

        <p>
          After heavily utilizing Anthropic's CLI tool for months, cross-referencing my own
          headaches with real-world developer workflows, and abandoning a few doomed AI-generated
          side projects, I've mapped out exactly where this tool actually fits into a professional
          workflow.
        </p>

        <p>
          Here is the honest truth about what Claude Code is actually good at—and what you need to
          stop using it for immediately.
        </p>

        <Callout type="info">
          **Note for the uninitiated:** Claude Code isn't a web interface. It's an agentic CLI tool
          that lives directly in your terminal. It reads your file system, executes bash commands,
          runs your linters, and iterates on errors autonomously. That power is exactly why you need
          to be careful with it.
        </Callout>

        <p>---</p>

        <h2 id="the-sweet-spot-where-claude-code-is-actually-amazing">
          The Sweet Spot: Where Claude Code is Actually Amazing
        </h2>

        <p>
          If you want to get 10x value out of Claude Code, point it at tasks that are highly
          constrained, tedious, or require massive pattern recognition.
        </p>

        <h3 id="1-writing-tests-finally-relief-from-the-yak-shaving">
          1. Writing Tests (Finally, Relief from the Yak Shaving)
        </h3>

        <p>
          If there is one universal truth in software engineering, it's that writing tests is an
          absolute chore. We all know we <em>should</em> do it, but mocking out third-party APIs,
          setting up database test states, and covering obscure edge cases is mentally draining.
        </p>

        <p>
          This is arguably Claude Code's biggest superpower. Because it lives directly in your
          terminal and can parse your entire project directory, you don't have to awkwardly
          copy-paste context into a browser window.
        </p>

        <p>You can just point it to your test directory and say:</p>

        <blockquote>
          <p>
            <em>
              "Look at{' '}
              <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
                {'user_auth.py'}
              </code>
              . Write a comprehensive Pytest suite for it. Mock the Stripe API calls exactly how we
              mocked them in{' '}
              <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
                {'billing_test.py'}
              </code>
              ."
            </em>
          </p>
        </blockquote>

        <p>
          <strong>The Workflow Hack:</strong> Run a{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'git diff'}</code> and
          have Claude generate tests exclusively for the exact lines you just altered.
        </p>

        <Pre>
          <code className="language-bash">
            {
              '# A highly effective Claude Code prompt\nclaude "Review my unstaged git changes. Write unit tests to cover the new branches of logic I just added to the cart controller. Make sure they pass."'
            }
          </code>
        </Pre>

        <p>
          It cuts the time spent on testing by literally 80%, freeing you up to focus on actual
          application architecture.
        </p>

        <h3 id="2-rapid-debugging-and-stack-trace-deciphering">
          2. Rapid Debugging and Stack Trace Deciphering
        </h3>

        <p>
          When your console spits out a 50-line wall of red text stemming from some deeply nested
          Webpack or dependency issue, scanning it for the actual point of failure takes time.
        </p>

        <p>
          Claude reads stack traces orders of magnitude faster than a human. It pulls patterns from
          its massive training data to identify obscure bugs that might normally take you hours of
          digging through abandoned GitHub issues to solve.
        </p>

        <p>
          It isn't perfect—sometimes it gets stuck in an execution loop trying to fix the same error
          over and over. You'll watch it try{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'npm install'}</code>,
          fail, try a different flag, fail, and try again. But even when it fails to fix the issue
          autonomously, it usually acts as an incredible rubber duck. It gets you 90% of the way
          there, isolates the failing file and line number, and explains the root cause so you can
          take over.
        </p>

        <h3 id="3-the-claudemd-magic-enforcing-team-alignment">
          3. The{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'CLAUDE.md'}</code>{' '}
          Magic (Enforcing Team Alignment)
        </h3>

        <p>
          Because Claude Code runs locally, it automatically looks for a{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'CLAUDE.md'}</code>{' '}
          file in your project root. This file is a game-changer. It acts as your project's
          constitution for the AI.
        </p>

        <p>
          Without it, Claude will just guess your preferences. With it, you constrain its behavior
          to match your team's exact standards.
        </p>

        <CodeBlock language="markdown" title="Example CLAUDE.md">
          # Project AI Guidelines - **Package Manager:** We strictly use `pnpm`. Never use `npm` or
          `yarn`. - **Styling:** Tailwind CSS only. Do not write custom CSS or use inline styles. -
          **Database:** Never write bare SQL queries. Always use the Prisma ORM. - **Tone:** Do not
          apologize or give lengthy explanations. Just output the code or the terminal command.
        </CodeBlock>

        <p>
          By hardcoding your stack rules, you prevent the AI from drifting off into its own weird
          architectural decisions. It stops hallucinating outdated React patterns and starts
          actually coding like a member of your team.
        </p>

        <h3 id="4-codebase-onboarding-and-legacy-deciphering">
          4. Codebase Onboarding and Legacy Deciphering
        </h3>

        <p>
          Ever been dropped into a massive, undocumented legacy codebase written by a developer who
          quit three years ago? It's terrifying.
        </p>

        <p>
          Claude Code is the ultimate digital archaeologist. You can drop it into a folder with 30
          cryptic files and ask it to explain how the data flows.
        </p>

        <ul>
          <li>
            <em>"Where does the user session actually get validated in this middleware mess?"</em>
          </li>
          <li>
            <em>"Map out the dependencies for this specific cron job."</em>
          </li>
          <li>
            <em>
              "Write a{' '}
              <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
                {'README.md'}
              </code>{' '}
              that explains how to spin up this local environment, based on the Dockerfile and
              package.json."
            </em>
          </li>
        </ul>

        <p>
          It will scan hundreds of files in seconds and give you a coherent map of how things
          connect.
        </p>

        <h3 id="5-bash-scripting-and-terminal-chores">5. Bash Scripting and Terminal Chores</h3>

        <p>
          We all pretend we know how to write complex bash scripts, but in reality, most of us are
          just Googling "how to extract substring in bash" every single time.
        </p>

        <p>
          Claude Code is phenomenal at terminal chores. Need to write a script that finds all{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'.jpg'}</code> files
          recursively, converts them to{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'.webp'}</code>, and
          logs the size savings to a CSV? Just ask Claude to do it. Need to do a complex interactive
          rebase? Ask Claude for the exact git commands. It's a massive friction reducer.
        </p>

        <p>---</p>

        <h2 id="the-danger-zone-what-you-need-to-stop-doing">
          The Danger Zone: What You Need to Stop Doing
        </h2>

        <p>
          This is where the hype train derails. If you lean on Claude for the following tasks, you
          are injecting technical debt into your project at an unprecedented speed.
        </p>

        <h3 id="1-expecting-it-to-design-complex-architecture">
          1. Expecting It to Design Complex Architecture
        </h3>

        <p>
          Claude has a dangerous "works is enough" mentality. It doesn't care about the N+1 query
          problem it just introduced. It rarely considers long-term performance implications, memory
          leaks, or how the code will scale when your database hits 10 million rows.
        </p>

        <p>
          If you ask it to build a complex, multi-currency aggregation system from scratch, it will
          give you a naive, synchronous implementation that will absolutely crash under heavy load.
          It optimizes for <em>passing the immediate test</em>, not for surviving production.
        </p>

        <p>
          <strong>The Rule of Thumb:</strong> You must remain the architect. You design the data
          models. You define the system boundaries and API contracts. Let Claude write the
          boilerplate to connect the pieces you designed.
        </p>

        <h3 id="2-large-scale-refactoring-the-illusion-of-context">
          2. Large-Scale Refactoring (The Illusion of Context)
        </h3>

        <p>
          Claude Code has a massive context window (200k+ tokens). That sounds great on paper, but
          just because it <em>can</em> load your whole repository into memory doesn't mean it{' '}
          <em>understands</em> the nuanced business logic behind why a certain variable is handled a
          specific way.
        </p>

        <p>
          LLMs suffer from the "lost in the middle" phenomenon. If you tell it to "refactor the
          entire billing module to use the new webhook system," you are playing with fire. It will
          inevitably drop subtle error-handling logic, hallucinate variables, or silently delete an
          important edge case that wasn't explicitly covered by a test.
        </p>

        <p>
          <strong>The Fix:</strong> Break tasks down into bite-sized, heavily constrained chunks.
          Don't ask it to refactor a module; ask it to extract one specific function, and verify it
          before moving to the next.
        </p>

        <h3 id="3-blindly-trusting-its-dependency-management">
          3. Blindly Trusting Its Dependency Management
        </h3>

        <p>
          Claude Code loves to hallucinate npm packages or Python libraries that sound incredibly
          plausible but don't actually exist. Or worse, it will pull in a massive, bloated, and
          potentially insecure third-party library to solve a problem that could have been fixed
          with three lines of native code.
        </p>

        <Callout type="warning">
          **Security Risk:** Because Claude Code can execute commands, it can theoretically run `npm
          install malicious-package`. Always review what it is trying to install, and never run
          Claude Code with elevated (`sudo`) privileges.
        </Callout>

        <h3 id="4-letting-it-write-final-human-facing-documentation">
          4. Letting It Write Final Human-Facing Documentation
        </h3>

        <p>
          While Claude is great at <em>reading</em> code and telling you what it does technically,
          it is a terrible writer for human consumption. LLMs love to use 50 words when 10 would do.
        </p>

        <p>
          If you use it to write your user-facing docs or API guides, they will be noisy,
          repetitive, and sound exactly like a robot wrote them. It will include unnecessary details
          about implementation rather than focusing on developer experience (DX). Use Claude to
          create the rough first draft and extract the technical parameters, but rewrite the actual
          prose yourself so it's succinct and readable.
        </p>

        <p>---</p>

        <h2 id="the-verdict-reframe-your-relationship-with-ai">
          The Verdict: Reframe Your Relationship with AI
        </h2>

        <p>
          Stop treating Claude Code like a replacement for your brain. It is not an autonomous
          engineer; it is an incredibly fancy, context-aware exoskeleton for your keyboard.
        </p>

        <p>
          The developers getting the most out of this tool aren't the ones trying to automate their
          entire job away so they can play video games. The 10x developers are using it as a
          surgical instrument. They are automating the soul-crushing boilerplate, the endless mock
          generation, the linting fixes, and the stack trace analysis.
        </p>

        <p>
          By offloading the friction, they are preserving their mental energy for what actually
          matters: hard logic, system design, security, and user experience.
        </p>

        <p>If you want to survive the AI coding era:</p>

        <ol>
          <li>
            <strong>
              Write the{' '}
              <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
                {'CLAUDE.md'}
              </code>{' '}
              file immediately.
            </strong>
          </li>
          <li>
            <strong>Keep your prompts narrow and hyper-specific.</strong>
          </li>
          <li>
            <strong>Never let the AI make an architectural decision.</strong>
          </li>
          <li>
            <strong>For the love of god, read the code before you commit it.</strong>
          </li>
        </ol>

        <p>
          Code generation is essentially free now. Code <em>maintainability</em> is about to become
          the most valuable skill in the industry. Act accordingly.
        </p>
      </PostLayout>
    </>
  )
}
