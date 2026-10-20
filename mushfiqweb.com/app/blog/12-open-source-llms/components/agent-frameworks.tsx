'use client'

import { useState } from 'react'
import { Check, AlertCircle, ArrowRight, User, Terminal, Play, Settings } from 'lucide-react'

export default function AgentFrameworks() {
  const [activeTab, setActiveTab] = useState<'single' | 'multi'>('single')

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-gray-100 pb-4 dark:border-zinc-800 md:flex-row md:items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100">
            Single vs. Multi-Agent Systems
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Architecting agentic LLM workflows for production reliability
          </p>
        </div>
        <div className="bg-gray-150 flex rounded-lg p-1 dark:bg-zinc-800">
          <button
            onClick={() => setActiveTab('single')}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-all duration-300 ${
              activeTab === 'single'
                ? 'bg-white text-primary-600 shadow-sm dark:bg-zinc-700 dark:text-primary-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Single-Agent Setup
          </button>
          <button
            onClick={() => setActiveTab('multi')}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-all duration-300 ${
              activeTab === 'multi'
                ? 'bg-white text-primary-600 shadow-sm dark:bg-zinc-700 dark:text-primary-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Multi-Agent Team
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Side: Architectural Diagram */}
        <div className="flex flex-col justify-center rounded-xl bg-gray-50 p-6 dark:bg-zinc-800/40 lg:col-span-6">
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
            System Data Flow
          </h4>

          {activeTab === 'single' ? (
            <div className="space-y-4">
              {/* Single Agent Workflow Diagram */}
              <div className="flex flex-col items-center space-y-3">
                <div className="flex h-12 w-32 items-center justify-center rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  <User className="mr-1.5 h-4 w-4 text-gray-400" />
                  User Prompt
                </div>
                <ArrowRight className="h-4 w-4 rotate-90 text-gray-400" />
                <div className="relative flex h-16 w-44 items-center justify-center rounded-xl border border-primary-500 bg-primary-50/50 text-center text-xs font-extrabold text-primary-600 shadow-md dark:border-primary-400 dark:bg-primary-950/20 dark:text-primary-400">
                  <Terminal className="mr-1.5 h-4.5 w-4.5 text-primary-500" />
                  Reasoning Loop
                  <span className="absolute -right-1.5 -top-1.5 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-primary-500"></span>
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 rotate-90 animate-bounce text-gray-400" />
                <div className="flex gap-2">
                  <div className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-[11px] font-bold text-teal-700 dark:border-teal-900 dark:bg-teal-950/30 dark:text-teal-400">
                    File system
                  </div>
                  <div className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-[11px] font-bold text-teal-700 dark:border-teal-900 dark:bg-teal-950/30 dark:text-teal-400">
                    Bash tool
                  </div>
                  <div className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-[11px] font-bold text-teal-700 dark:border-teal-900 dark:bg-teal-950/30 dark:text-teal-400">
                    Search API
                  </div>
                </div>
              </div>
              <p className="pt-2 text-center text-xs text-gray-500 dark:text-zinc-400">
                A single loop model handles planning, tool selection, error checking, and final
                output in a single context window.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Multi Agent Workflow Diagram */}
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-10 w-28 items-center justify-center rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  <User className="mr-1 h-3.5 w-3.5 text-gray-400" />
                  Complex Task
                </div>
                <ArrowRight className="h-4 w-4 rotate-90 text-gray-400" />
                <div className="flex h-12 w-40 items-center justify-center rounded-lg border border-indigo-500 bg-indigo-50/50 text-xs font-bold text-indigo-700 shadow-sm dark:border-indigo-400 dark:bg-indigo-950/20 dark:text-indigo-400">
                  <Settings className="mr-1.5 h-4 w-4 animate-spin text-indigo-500" />
                  Router / Orchestrator
                </div>
                <div className="flex w-full items-center justify-center gap-4 py-2">
                  <div className="flex flex-col items-center">
                    <ArrowRight className="rotate-135 h-4 w-4 text-gray-400" />
                    <div className="mt-1 rounded-lg border border-amber-300 bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
                      Coder Agent
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <ArrowRight className="h-4 w-4 rotate-90 text-gray-400" />
                    <div className="mt-1 rounded-lg border border-blue-300 bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-400">
                      Searcher Agent
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <ArrowRight className="h-4 w-4 rotate-45 text-gray-400" />
                    <div className="mt-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
                      QA Tester Agent
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 rotate-90 text-gray-400" />
                <div className="flex h-10 w-28 items-center justify-center rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  Final Solution
                </div>
              </div>
              <p className="pt-2 text-center text-xs text-gray-500 dark:text-zinc-400">
                Tasks are delegated to highly specialized, isolated sub-agents that communicate via
                structured messages.
              </p>
            </div>
          )}
        </div>

        {/* Right Side: Details and Criteria */}
        <div className="flex flex-col justify-between lg:col-span-6">
          {activeTab === 'single' ? (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-gray-900 dark:text-zinc-100">
                Single-Agent Architecture
              </h4>
              <p className="text-gray-650 text-xs leading-relaxed dark:text-zinc-400">
                In a single-agent system, one reasoning agent has access to all tools. It executes a
                step, observes the result, updates its memory, and decides on the next move.
              </p>

              <div className="space-y-2.5">
                <h5 className="text-gray-505 text-xs font-extrabold uppercase tracking-wide dark:text-zinc-500">
                  Ideal Use Cases
                </h5>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-xs text-gray-700 dark:text-zinc-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>
                      <strong>Linear scripts</strong>: Writing simple scripts, running basic
                      terminal edits, or searching.
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-gray-700 dark:text-zinc-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>
                      <strong>Low context overhead</strong>: When the task is small enough to fit
                      inside a single model context.
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-gray-700 dark:text-zinc-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>
                      <strong>Cost efficiency</strong>: Minimal token usage since there are no
                      coordination agents.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-3.5 dark:border-amber-900/30 dark:bg-amber-950/10">
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                  <div>
                    <h6 className="text-xs font-bold text-amber-800 dark:text-amber-400">
                      Memory Bottleneck
                    </h6>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-amber-700 dark:text-amber-500">
                      As the loop runs longer, the prompt context size expands, causing degradation
                      in reasoning quality and higher latency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-gray-900 dark:text-zinc-100">
                Multi-Agent Architecture
              </h4>
              <p className="text-gray-650 text-xs leading-relaxed dark:text-zinc-400">
                A multi-agent system divides a complex task among multiple specialized sub-agents
                (e.g. researcher, writer, validator) coordinated by a central orchestrator.
              </p>

              <div className="space-y-2.5">
                <h5 className="text-gray-505 text-xs font-extrabold uppercase tracking-wide dark:text-zinc-500">
                  Ideal Use Cases
                </h5>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-xs text-gray-700 dark:text-zinc-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                    <span>
                      <strong>Parallel Workflows</strong>: Researching several topics in parallel or
                      building multiple microservices.
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-gray-700 dark:text-zinc-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                    <span>
                      <strong>Automated Testing & QA</strong>: One agent writes the source code
                      while another reviews and writes unit tests.
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-gray-700 dark:text-zinc-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                    <span>
                      <strong>Complex Planning</strong>: Managing long-term projects that exceed a
                      single model's planning horizon.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-3.5 dark:border-indigo-900/30 dark:bg-indigo-950/10">
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-indigo-500" />
                  <div>
                    <h6 className="text-xs font-bold text-indigo-800 dark:text-indigo-400">
                      Coordination Overhead
                    </h6>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-indigo-700 dark:text-indigo-500">
                      Adds latency and token consumption since agents must communicate, summarize,
                      and coordinate via natural language.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Core Tip */}
          <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500 dark:border-zinc-800 dark:text-zinc-400">
            <span className="font-bold text-gray-700 dark:text-zinc-300">Architect's Rule:</span>
            <span>
              Start with a single agent. Move to multi-agent only when context or reliability bounds
              are hit.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
