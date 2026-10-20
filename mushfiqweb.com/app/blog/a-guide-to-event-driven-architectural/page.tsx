import { PostLayout } from '~/layouts/post-layout'
import { allBlogs } from '~/data/blog-registry'
import { allAuthors } from '~/data/author-registry'
import { genPostMetadata } from '~/utils/metadata'
import type { Metadata } from 'next'

import OutboxVisualizer from './components/outbox-visualizer'
import SagaStepper from './components/saga-stepper'

export async function generateMetadata(): Promise<Metadata> {
  const post = allBlogs.find((p) => p.slug === 'a-guide-to-event-driven-architectural')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'a-guide-to-event-driven-architectural')!

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
        <h2 id="introduction">Introduction</h2>
        <p>
          Distributed systems are built out of individual services that need to communicate. The
          simplest way to achieve this is for one service to call another directly (e.g., via HTTP
          REST, gRPC) and wait for a response. While this synchronous request-response pattern works
          well for small systems and predictable workloads, it starts to crack under scale.
        </p>
        <p>
          As systems grow, synchronous calls produce tight coupling between services, fragile
          failure behavior, and latency bottlenecks at the slowest component in any chain of calls.{' '}
          <strong>Event-Driven Architecture (EDA)</strong> offers an alternative model where
          services publish events when something meaningful happens, and other services react to
          those events asynchronously.
        </p>

        <h2 id="why-synchronous-fails-at-scale">Why Synchronous Fails at Scale</h2>
        <p>
          In a synchronous architecture, a client request often triggers a cascade of sequential API
          calls. If the <em>Order Service</em> needs to write data, call the{' '}
          <em>Payment Service</em>, and wait for the <em>Inventory Service</em>, the total response
          time is the sum of all individual calls.
        </p>
        <p>
          If any service in the chain is slow or offline, the entire request fails (cascading
          failures). Furthermore, adding new consumers (e.g., a shipping notifier or an analytics
          service) requires modifying the primary Order Service to send the new API requests,
          leading to high coupling.
        </p>

        <h2 id="the-event-driven-mental-model">The Event-Driven Mental Model</h2>
        <p>
          Event-driven systems replace the concept of a <strong>Command</strong> ("go process this
          payment") with a <strong>Fact</strong> ("payment completed"). Services write changes to
          their database, publish a record of that change (the event), and exit.
        </p>
        <p>
          Brokers (like Apache Kafka, RabbitMQ, or AWS EventBridge) route the events to subscribing
          services (consumers), which process the events on their own schedule. This design isolates
          failure boundaries and decouples services, but introduces data consistency and atomic
          state coordination challenges.
        </p>

        <h2 id="interactive-transactional-outbox-visualizer">
          Interactive Transactional Outbox Visualizer
        </h2>
        <p>
          When a service updates its database and publishes an event, it faces the **"dual-write
          problem"**. If the database commit succeeds but the network call to the broker fails, the
          rest of the system never learns about the transaction. If the event is sent first but the
          database commit fails, downstream systems process phantom data.
        </p>
        <p>
          The **Transactional Outbox** pattern solves this atomically. Instead of publishing the
          event directly, the service writes the business record and the event payload to an{' '}
          <code>Outbox</code> table in the same local database transaction. A separate relay process
          (polling or reading database logs via Change Data Capture/CDC) asynchronously reads the
          Outbox table and publishes the events to the broker.
        </p>

        <OutboxVisualizer />

        <h2 id="interactive-saga-orchestration-stepper">Interactive Saga Orchestration Stepper</h2>
        <p>
          In a distributed system, a single business transaction can span multiple databases.
          Without a shared global lock, how do we guarantee consistency?
        </p>
        <p>
          The **Saga Pattern** structures a distributed transaction as a sequence of independent
          local transactions. Each service executes its own step and publishes an event. If a step
          fails, the orchestrator triggers **compensating transactions** to run in reverse, undoing
          the changes of the completed steps and restoring consistency.
        </p>

        <SagaStepper />

        <h2 id="summary-of-eda-patterns">Summary of EDA Patterns</h2>
        <p>
          Event-driven architecture is not a silver bullet. It trades instant consistency for
          eventual consistency and increases infrastructure complexity. However, by combining
          patterns like the Transactional Outbox (ensuring reliable event publishing) and Sagas
          (managing multi-step distributed logic), engineers can build highly resilient, loosely
          coupled microservices capable of scaling to massive volumes.
        </p>

        <hr className="my-8 border-gray-200 dark:border-zinc-800" />

        <p className="dark:text-zinc-450 text-xs text-gray-500">
          <em>
            Original system design topics compiled from the ByteByteGo architecture refresher
            series.
          </em>
        </p>
      </PostLayout>
    </>
  )
}
