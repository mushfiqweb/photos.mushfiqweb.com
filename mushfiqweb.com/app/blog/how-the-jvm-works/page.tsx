import { PostLayout } from '~/layouts/post-layout'
import { allBlogs } from '~/data/blog-registry'
import { allAuthors } from '~/data/author-registry'
import { genPostMetadata } from '~/utils/metadata'
import type { Metadata } from 'next'

import ClassloaderSimulator from './components/classloader-simulator'
import MemoryInspector from './components/memory-inspector'

export async function generateMetadata(): Promise<Metadata> {
  const post = allBlogs.find((p) => p.slug === 'how-the-jvm-works')!
  return genPostMetadata(post)
}

export default function Page() {
  const post = allBlogs.find((p) => p.slug === 'how-the-jvm-works')!

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
          Java's primary promise has always been: **"Write Once, Run Anywhere"** (WORA). This
          cross-platform portability is made possible by the **Java Virtual Machine (JVM)**. Instead
          of compiling code directly into machine-specific assembly instructions, Java source code
          is compiled into platform-independent intermediate **bytecode**.
        </p>
        <p>
          When you execute a Java program, the JVM loads this bytecode, links class references,
          manages memory regions dynamically, and compiles frequently executed paths into machine
          code at runtime. Let's look under the hood of the JVM architecture to see how it executes
          classes.
        </p>

        <h2 id="classloader-parent-delegation-model">ClassLoader Parent Delegation Model</h2>
        <p>
          The JVM's ClassLoader subsystem brings compiled <code>.class</code> byte files into
          runtime memory. To prevent security vulnerabilities (like an application overriding core
          classes like <code>java.lang.System</code>), Java enforces the **Parent Delegation
          Model**.
        </p>
        <p>
          When a request to load a class arrives, the current ClassLoader delegates the request up
          to its parent. Only if the parent cannot find the class does the child attempt to load it.
          The hierarchy consists of three standard ClassLoaders:{' '}
          <strong>Bootstrap ClassLoader</strong> (JDK classes),{' '}
          <strong>Platform ClassLoader</strong> (Extension APIs), and the{' '}
          <strong>Application ClassLoader</strong> (local classpath code).
        </p>

        <ClassloaderSimulator />

        <h2 id="dynamic-linking--loading-phases">Dynamic Linking & Loading Phases</h2>
        <p>
          Once a ClassLoader locates class bytes, the JVM processes it through three distinct
          phases:
        </p>
        <ul>
          <li>
            <strong>Loading:</strong> The binary data of the class is ingested and a Class object is
            created in the Method Area.
          </li>
          <li>
            <strong>Linking:</strong> Combines class references.
            <ul>
              <li>
                <em>Verify:</em> Inspects bytecode structural safety to prevent corrupted or
                malicious code.
              </li>
              <li>
                <em>Prepare:</em> Allocates memory for static fields and assigns initial default
                type values.
              </li>
              <li>
                <em>Resolve:</em> Converts symbolic names/strings in the constant pool into direct
                memory address references.
              </li>
            </ul>
          </li>
          <li>
            <strong>Initialization:</strong> Executes static initializer blocks and assigns static
            fields their actual declared values.
          </li>
        </ul>

        <h2 id="jvm-memory-allocation-architecture">JVM Memory Allocation Architecture</h2>
        <p>
          During execution, the JVM allocates memory in specific regions collectively called the
          **Runtime Data Areas**. These areas are divided into memory shared by all threads and
          memory isolated to individual threads.
        </p>
        <p>
          Understanding where variables are allocated is crucial for managing garbage collection
          profiles and avoiding stack overflow or out-of-memory errors. Investigate the interactive
          inspector below to see how Java code declarations map to memory.
        </p>

        <MemoryInspector />

        <h2 id="interactive-classloader-simulator">Interactive ClassLoader Simulator</h2>
        <p>
          <em>
            (Use the delegation simulator above to load core, platform, or app classes and trace the
            parent lookup path.)
          </em>
        </p>

        <h2 id="interactive-jvm-memory-inspector">Interactive JVM Memory Inspector</h2>
        <p>
          <em>
            (Select JVM memory blocks in the inspector above to explore scopes and see how Java
            variable references resolve between Stack and Heap.)
          </em>
        </p>

        <h2 id="jit-compilation--garbage-collection">JIT Compilation & Garbage Collection</h2>
        <p>
          To run bytecode quickly, the JVM uses an **Execution Engine** containing both an
          Interpreter and a **Just-In-Time (JIT) Compiler**. The Interpreter runs bytecode
          instructions sequentially (high start speed, low run speed).
        </p>
        <p>
          As the code runs, the JVM tracks "hot methods" that are executed frequently. The JIT
          Compiler compiles these hot paths directly into native machine code, bypassing interpreter
          loops for subsequent calls. Combined with a generational **Garbage Collector** (GC) that
          sweeps unused Heap allocations automatically, the JVM delivers compiled machine speeds
          with managed runtime memory safety.
        </p>

        <hr className="my-8 border-gray-200 dark:border-zinc-800" />

        <p className="dark:text-zinc-450 text-xs text-gray-500">
          <em>
            Original system design topics compiled from the ByteByteGo JVM architecture series.
          </em>
        </p>
      </PostLayout>
    </>
  )
}
