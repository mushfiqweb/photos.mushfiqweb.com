'use client'

import { useState } from 'react'
import { HardDrive, Cpu, Layers, Disc } from 'lucide-react'

type MemoryType = {
  id: string
  name: string
  capacity: string
  speed: string
  volatility: string
  backend: string
  description: string
  details: string[]
}

const MEMORIES: MemoryType[] = [
  {
    id: 'sensory',
    name: 'Sensory Memory',
    capacity: 'Immediate (Tokens processed mid-step)',
    speed: '< 1ms',
    volatility: 'Transient (Lost between operations)',
    backend: 'Attention activations & Hidden states',
    description:
      'The instant raw buffer of inputs the model processes when receiving a token sequence.',
    details: [
      'Represents immediate cognitive focus before serialization.',
      'Operates during forward-pass calculations.',
      'Cannot be modified or retrieved directly by developers.',
    ],
  },
  {
    id: 'short_term',
    name: 'Short-Term Memory',
    capacity: 'Context window limit (e.g. 128k - 2M tokens)',
    speed: '10ms - 50ms (Context dependent)',
    volatility: 'Session-only (Volatile, wiped on reset)',
    backend: 'Transformer KV Cache',
    description:
      'The active conversation log. Everything the model has seen in the current request flow.',
    details: [
      'Allows quick reference to variable declarations, recent messages, and local file diffs.',
      'Suffers from "needle-in-a-haystack" retrieval drop-offs as context window size expands.',
      'Highly expensive in token billing and memory bandwidth.',
    ],
  },
  {
    id: 'long_term',
    name: 'Long-Term Memory',
    capacity: 'Virtually Unlimited (Billions of vectors)',
    speed: '100ms - 300ms (DB fetch latency)',
    volatility: 'Persistent (Saved across restarts)',
    backend: 'Vector Databases (Milvus, Pinecone, Qdrant)',
    description:
      'Externalized semantic index. Stores past codebase commits, documentation, and user preferences.',
    details: [
      'Relies on similarity search (cosine distance) to extract relevant fragments.',
      'Requires document chunking, embedding generation, and metadata tags indexing.',
      'Enables agents to refer back to instructions established months prior.',
    ],
  },
]

export default function MemoryDashboard() {
  const [selected, setSelected] = useState<string>('short_term')
  const current = MEMORIES.find((m) => m.id === selected)!

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
      {/* Header */}
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/80">
        <h3 className="font-sans text-base font-bold text-gray-900 dark:text-zinc-100">
          Memory Layer Architecture
        </h3>
        <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">
          Select a layer to investigate capacity, latency, and system implementation details
        </p>
      </div>

      <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-zinc-800 md:grid-cols-12 md:divide-x md:divide-y-0">
        {/* Left Column: Selector buttons */}
        <div className="space-y-2 p-5 md:col-span-4">
          {MEMORIES.map((m) => {
            const isSelected = selected === m.id
            return (
              <button
                key={m.id}
                onClick={() => setSelected(m.id)}
                className={`w-full rounded-xl p-3 text-left transition-all duration-300 ${
                  isSelected
                    ? 'border border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-950/20'
                    : 'border border-transparent bg-transparent hover:bg-gray-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`rounded-lg p-1.5 ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-zinc-500'}`}
                  >
                    {m.id === 'sensory' ? (
                      <Cpu className="h-4.5 w-4.5" />
                    ) : m.id === 'short_term' ? (
                      <Layers className="h-4.5 w-4.5" />
                    ) : (
                      <HardDrive className="h-4.5 w-4.5" />
                    )}
                  </div>
                  <div>
                    <div
                      className={`text-xs font-bold ${isSelected ? 'text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-zinc-300'}`}
                    >
                      {m.name}
                    </div>
                    <span className="text-[9px] text-gray-400">{m.volatility.split(' ')[0]}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Right Column: Layer stats */}
        <div className="flex flex-col justify-between p-6 md:col-span-8">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-extrabold text-gray-900 dark:text-zinc-100">
                {current.name}
              </h4>
              <p className="text-gray-650 mt-1 text-xs leading-relaxed dark:text-zinc-400">
                {current.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                  Retrieval Latency
                </span>
                <div className="font-extrabold text-gray-800 dark:text-zinc-200">
                  {current.speed}
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                  Storage capacity
                </span>
                <div className="font-extrabold text-gray-800 dark:text-zinc-200">
                  {current.capacity}
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                  Volatility Profile
                </span>
                <div className="font-extrabold text-gray-800 dark:text-zinc-200">
                  {current.volatility}
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                  Backend storage
                </span>
                <div className="font-extrabold text-gray-800 dark:text-zinc-200">
                  {current.backend}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4 dark:border-zinc-800">
            <h5 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
              Technical Implementation:
            </h5>
            <ul className="space-y-1.5 text-xs text-gray-700 dark:text-zinc-300">
              {current.details.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 select-none font-bold text-primary-500">▪</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
