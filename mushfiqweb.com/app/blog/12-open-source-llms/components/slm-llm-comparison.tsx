'use client'

import { useState } from 'react'
import { Cpu, Zap, Eye, Scale, Briefcase } from 'lucide-react'

const dimensions = [
  {
    id: 'architecture',
    title: 'Architecture & Sizing',
    icon: Cpu,
    slm: {
      text: 'Typically under 10 Billion parameters. Highly optimized using techniques like quantization (e.g., Q4_K_M) and distillation.',
      badge: 'Lightweight & Distilled',
      stat: '< 10B Parameters',
    },
    llm: {
      text: 'Ranges from 10 Billion to hundreds of billions (or trillions in MoE). Deep neural networks with massive attention heads.',
      badge: 'Heavyweight & Dense',
      stat: '10B - 1T+ Parameters',
    },
  },
  {
    id: 'tasks',
    title: 'Task Complexity',
    icon: Zap,
    slm: {
      text: 'Excel at classification, text summarization, and single-step formatting. They struggle or hallucinate on multi-step reasoning.',
      badge: 'Specialized / Single-Task',
      stat: 'Linear Logic',
    },
    llm: {
      text: 'Capable of complex coding tasks, mathematical proofs, long-horizon planning, and orchestrating other agents.',
      badge: 'Generalist Reasoning',
      stat: 'Multi-Step / Agentic',
    },
  },
  {
    id: 'context',
    title: 'Context Recall',
    icon: Scale,
    slm: {
      text: 'Smaller context windows (typically 8k - 16k tokens). Subject to needle-in-a-haystack recall degradation over 10k tokens.',
      badge: 'Standard Context',
      stat: '8k - 16k Tokens',
    },
    llm: {
      text: 'Native support for massive contexts (128k to 1M+ tokens). Advanced RoPE scaling ensures high recall accuracy.',
      badge: 'Massive Context',
      stat: '128k - 1M+ Tokens',
    },
  },
  {
    id: 'cost',
    title: 'Latency & Sizing Costs',
    icon: Briefcase,
    slm: {
      text: 'Ultra-low time-to-first-token (TTFT). Extremely cheap to run; can be self-hosted on local devices for $0 marginal cost.',
      badge: 'High Throughput, Low Cost',
      stat: 'Local / Free',
    },
    llm: {
      text: 'Higher latency due to memory bandwidth limits. Sizable hosting costs, requiring dedicated H100/A100 server clusters.',
      badge: 'Cloud GPU Dependent',
      stat: 'Cloud Hosting Costs',
    },
  },
  {
    id: 'privacy',
    title: 'Deployment & Privacy',
    icon: Eye,
    slm: {
      text: 'Run 100% locally on laptops, smartphones, or secure edge nodes. No user data ever leaves the device.',
      badge: 'Max Sovereignty',
      stat: 'On-Device / Local',
    },
    llm: {
      text: 'Usually hosted in cloud environments or proprietary data centers. Requires robust enterprise data governance policies.',
      badge: 'Enterprise Managed',
      stat: 'Cloud API / VPC',
    },
  },
]

export default function SlmLlmComparison() {
  const [activeTab, setActiveTab] = useState<'slm' | 'llm'>('slm')
  const [hoveredDimension, setHoveredDimension] = useState<string | null>(null)

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
      {/* Header Controls */}
      <div className="flex flex-col items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/80 md:flex-row">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100">
            SLM vs. LLM Comparison Matrix
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Toggle to view production performance characteristics
          </p>
        </div>
        <div className="bg-gray-150 mt-4 flex rounded-lg p-1 dark:bg-zinc-800 md:mt-0">
          <button
            onClick={() => setActiveTab('slm')}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-all duration-300 ${
              activeTab === 'slm'
                ? 'bg-white text-primary-600 shadow-sm dark:bg-zinc-700 dark:text-primary-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Small Language Models (SLMs)
          </button>
          <button
            onClick={() => setActiveTab('llm')}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-all duration-300 ${
              activeTab === 'llm'
                ? 'bg-white text-primary-600 shadow-sm dark:bg-zinc-700 dark:text-primary-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Large Language Models (LLMs)
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-zinc-800 md:grid-cols-5 md:divide-x md:divide-y-0">
        {dimensions.map((dim) => {
          const IconComponent = dim.icon
          const content = activeTab === 'slm' ? dim.slm : dim.llm
          const isHovered = hoveredDimension === dim.id

          return (
            <div
              key={dim.id}
              onMouseEnter={() => setHoveredDimension(dim.id)}
              onMouseLeave={() => setHoveredDimension(null)}
              className={`p-5 transition-all duration-300 ${
                isHovered ? 'bg-gray-50/50 dark:bg-zinc-800/20' : 'bg-transparent'
              }`}
            >
              <div className="mb-4 flex items-center gap-2.5">
                <div
                  className={`rounded-lg p-2 transition-all duration-500 ${
                    activeTab === 'slm'
                      ? 'bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400'
                      : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400'
                  } ${isHovered ? 'scale-115 rotate-3' : ''}`}
                >
                  <IconComponent className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold leading-tight text-gray-800 dark:text-zinc-200">
                  {dim.title}
                </h4>
              </div>

              {/* Stat & Badge */}
              <div className="mb-3 space-y-1.5">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    activeTab === 'slm'
                      ? 'bg-teal-100/60 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'
                      : 'bg-indigo-100/60 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                  }`}
                >
                  {content.badge}
                </span>
                <div className="text-base font-extrabold text-gray-900 dark:text-zinc-100">
                  {content.stat}
                </div>
              </div>

              {/* Narrative description */}
              <p className="text-xs leading-relaxed text-gray-600 transition-opacity duration-300 dark:text-zinc-400">
                {content.text}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
