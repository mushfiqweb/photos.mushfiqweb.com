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
  const post = allBlogs.find((p) => p.slug === 'how-internet-works')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'how-internet-works')!

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
          The internet is a global network of networks that connects billions of computers and
          devices. It enables browsing, email, streaming, and real‑time communication by
          coordinating layers of technologies that move data reliably and securely.
        </p>

        <h2 id="overview">Overview</h2>

        <ul>
          <li>Network of networks interconnected by routers and ISPs</li>
          <li>Data travels as small packets that may take different paths</li>
          <li>Protocols define addressing, transport, security, and application behavior</li>
          <li>DNS resolves human‑readable domains to IP addresses</li>
          <li>The Web runs on HTTP; security is provided by TLS (HTTPS)</li>
          <li>Performance is shaped by latency, bandwidth, and congestion</li>
        </ul>

        <h2 id="packets-routing-and-reliability">Packets, Routing, and Reliability</h2>

        <ul>
          <li>
            Applications break messages into packets; each packet carries source/destination IPs.
          </li>
          <li>
            Routers forward packets using routing tables; paths can change due to congestion or
            failures.
          </li>
          <li>Time To Live (TTL) prevents packets from circulating forever.</li>
          <li>
            Reliability is handled above IP: TCP reorders, detects loss, and retransmits; UDP trades
            reliability for lower latency.
          </li>
          <li>
            On the public internet, inter‑domain routing uses BGP so networks can choose economical
            and resilient paths.
          </li>
        </ul>

        <h2 id="ip-addresses-and-dns">IP Addresses and DNS</h2>

        <ul>
          <li>
            IPv4 (e.g.,{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'192.0.2.172'}
            </code>
            ) and IPv6 (e.g.,{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'2001:db8::1'}
            </code>
            ) identify devices; subnets and NAT organize local networks.
          </li>
          <li>
            DNS flow: your resolver queries root → TLD → authoritative nameserver to get records.
          </li>
          <li>Caching honors TTL to reduce latency and load.</li>
          <li>
            Common records:{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'A/AAAA'}</code> map
            names to IPs,{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'CNAME'}</code>{' '}
            aliases names,{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'MX'}</code> routes
            mail, <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'TXT'}</code>{' '}
            carries metadata (e.g., SPF/verification).
          </li>
        </ul>

        <h2 id="transport-tcp-udp-and-quic">Transport: TCP, UDP, and QUIC</h2>

        <ul>
          <li>
            TCP adds reliability via the three‑way handshake (SYN/SYN‑ACK/ACK), acknowledgments,
            sliding windows, and congestion control (e.g., slow start).
          </li>
          <li>
            UDP is connectionless and used where minimal latency matters (streaming, real‑time).
          </li>
          <li>
            QUIC (over UDP) provides transport‑level encryption and multiplexing; HTTP/3 uses QUIC
            to reduce head‑of‑line blocking.
          </li>
        </ul>

        <h2 id="http-and-the-web">HTTP and the Web</h2>

        <ul>
          <li>
            HTTP defines methods (
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'GET'}</code>,{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'POST'}</code>,
            etc.), status codes, headers, and bodies.
          </li>
          <li>
            HTTP/1.1 uses persistent connections; HTTP/2 multiplexes streams over one connection;
            HTTP/3 runs over QUIC.
          </li>
          <li>Typical page load:</li>
          <li>Resolve domain via DNS</li>
          <li>Connect/handshake (TCP or QUIC)</li>
          <li>Negotiate TLS for HTTPS</li>
          <li>Send request (method, path, headers)</li>
          <li>Receive response (status, headers, body)</li>
          <li>
            Caching uses headers like{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'Cache-Control'}
            </code>
            , <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">{'ETag'}</code>,
            and{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'Last-Modified'}
            </code>{' '}
            to avoid redundant transfers.
          </li>
        </ul>

        <h2 id="https-and-tls">HTTPS and TLS</h2>

        <ul>
          <li>HTTPS = HTTP over TLS for confidentiality, integrity, and server authentication.</li>
          <li>
            Certificates chain from a leaf to intermediates to a trusted root CA; browsers verify
            the chain and hostname (via SNI).
          </li>
          <li>
            Ephemeral key exchange enables perfect forward secrecy; OCSP/CRL check revocation; HSTS
            enforces HTTPS.
          </li>
        </ul>

        <h2 id="physical-infrastructure">Physical Infrastructure</h2>

        <ul>
          <li>
            Bits travel over fiber, copper, and radio (Wi‑Fi/cellular); last‑mile connects
            homes/offices to ISP access networks.
          </li>
          <li>
            Backbones and Internet Exchange Points (IXPs) interconnect ISPs; peering reduces cost
            and improves performance.
          </li>
          <li>CDNs place content close to users to cut round‑trip times and offload origins.</li>
        </ul>

        <h2 id="what-developers-should-optimize">What Developers Should Optimize</h2>

        <ul>
          <li>Timeouts, retries with exponential backoff, and idempotent operations.</li>
          <li>Connection reuse, HTTP/2 or HTTP/3, and gzip/brotli compression.</li>
          <li>Effective caching: far‑future caches for static assets, validators for dynamic.</li>
          <li>DNS records and TTLs aligned with deploy strategy; use CNAMEs and health checks.</li>
          <li>Observability: logs, metrics, tracing; measure latency, errors, and throughput.</li>
          <li>Security hygiene: HTTPS everywhere, strong ciphers, certificate automation.</li>
        </ul>

        <h2 id="learn-more">Learn More</h2>

        <ul>
          <li>
            Introduction:{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'https://roadmap.sh/guides/what-is-internet'}
            </code>
          </li>
          <li>
            Developer guide:{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'https://cs.fyi/guide/how-does-internet-work'}
            </code>
          </li>
          <li>
            MDN overview:{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {
                'https://developer.mozilla.org/en-US/docs/Learn/Common_questions/How_does_the_Internet_work'
              }
            </code>
          </li>
          <li>
            Short video:{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-zinc-800">
              {'https://www.youtube.com/watch?v=7_LPdttKXPc'}
            </code>
          </li>
        </ul>
      </PostLayout>
    </>
  )
}
