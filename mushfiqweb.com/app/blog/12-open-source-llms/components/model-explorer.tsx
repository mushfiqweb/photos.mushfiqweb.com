'use client'

import { useState } from 'react'
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
  Check,
  ExternalLink,
  HelpCircle,
  HardDrive,
  Shield,
  Award,
} from 'lucide-react'

type LLMModel = {
  name: string
  developer: string
  focus: 'Reasoning' | 'Coding' | 'Multimodal' | 'Edge'
  license: 'MIT' | 'Apache 2.0' | 'Restrictive'
  licenseFull: string
  context: 'Standard' | 'Large' | 'Massive'
  contextValue: string
  strength: string
  architecture: string
  bestUseCase: string
  hardwareReq: string
  benchmarks: string
}

const MODELS: LLMModel[] = [
  {
    name: 'Llama 4 Scout',
    developer: 'Meta',
    focus: 'Multimodal',
    license: 'Restrictive',
    licenseFull: 'Llama 4 License (Free for <700M monthly users)',
    context: 'Large',
    contextValue: '128k',
    strength: 'Native Multimodal (Vision & Audio)',
    architecture: 'Dense (7B and 70B variants)',
    bestUseCase: 'Real-time voice and image-based applications',
    hardwareReq: '1x RTX 4090 for 7B; Server cluster for 70B',
    benchmarks: 'Top-tier vision-language and speech benchmarks',
  },
  {
    name: 'DeepSeek V4',
    developer: 'DeepSeek',
    focus: 'Reasoning',
    license: 'MIT',
    licenseFull: 'MIT License (No commercial restrictions)',
    context: 'Massive',
    contextValue: '1M',
    strength: 'Extreme MoE Efficiency & Low Cost',
    architecture: 'Mixture-of-Experts (MoE) - 21B active / 671B total',
    bestUseCase: 'Codebase analysis and RAG over massive documents',
    hardwareReq: 'Server clusters (8x H100) or high-density FP8 cloud endpoints',
    benchmarks: 'GPQA & MATH leaderboard top performer',
  },
  {
    name: 'Qwen3',
    developer: 'Alibaba',
    focus: 'Reasoning',
    license: 'Apache 2.0',
    licenseFull: 'Apache 2.0 License',
    context: 'Large',
    contextValue: '128k',
    strength: 'Switchable Thinking/Non-Thinking Mode',
    architecture: 'Dense structure with optional auxiliary reasoning heads',
    bestUseCase: 'Advanced mathematical reasoning and complex code logic',
    hardwareReq: 'RTX 4090 or Mac Studio (Ultra) for local inference',
    benchmarks: 'Challenging coding & math leaderboards',
  },
  {
    name: 'Gemma 4',
    developer: 'Google',
    focus: 'Reasoning',
    license: 'Apache 2.0',
    licenseFull: 'Apache 2.0 License',
    context: 'Standard',
    contextValue: '8k',
    strength: 'Unmatched Multilingual Sizing & Safety',
    architecture: 'Dense, with massive training on 100+ languages',
    bestUseCase: 'Local translation and strict enterprise safety guards',
    hardwareReq: 'Consumer laptop or Mac (16GB RAM minimum)',
    benchmarks: 'MMLU-Pro top performer in small-weight class',
  },
  {
    name: 'Phi 4',
    developer: 'Microsoft',
    focus: 'Edge',
    license: 'MIT',
    licenseFull: 'MIT License',
    context: 'Large',
    contextValue: '16k',
    strength: 'Curated Synthetic Training Quality',
    architecture: 'Dense 3.8B - ultra-filtered datasets',
    bestUseCase: 'On-device, edge deployments and offline translation',
    hardwareReq: 'Smartphone, Tablet, or Raspberry Pi 5',
    benchmarks: 'Near-frontier reasoning scores on GSM8k at <4B parameters',
  },
  {
    name: 'Mistral Small 3.1',
    developer: 'Mistral AI',
    focus: 'Multimodal',
    license: 'Restrictive',
    licenseFull: 'Mistral Research License',
    context: 'Large',
    contextValue: '128k',
    strength: 'Lightweight Local Multimodal VLM',
    architecture: 'Dense VLM (Vision-Language Model)',
    bestUseCase: 'Local multimodal assistant on consumer laptops',
    hardwareReq: 'MacBook Pro (M-series) or standard gaming laptop',
    benchmarks: 'High scores on MM-MU and MathVista tests',
  },
  {
    name: 'Nemotron 3 Super',
    developer: 'NVIDIA',
    focus: 'Coding',
    license: 'Restrictive',
    licenseFull: 'NVIDIA Open Weights License',
    context: 'Massive',
    contextValue: '1M',
    strength: 'Agentic Tool Calling & Coding Loops',
    architecture: 'Hybrid Mixture-of-Experts (MoE) - 15B active / 148B total',
    bestUseCase: 'Autonomous agent pipelines and multi-tool orchestration',
    hardwareReq: '2x RTX 4500 Ada or H100 Cloud instance',
    benchmarks: 'Ranked near-frontier on agentic coding loops',
  },
  {
    name: 'GLM 5.1',
    developer: 'Zhipu AI',
    focus: 'Coding',
    license: 'MIT',
    licenseFull: 'MIT License',
    context: 'Large',
    contextValue: '128k',
    strength: 'SWE-Bench Pro Top Performer',
    architecture: 'Dense layout optimized for code generation and translation',
    bestUseCase: 'Autonomous software engineering agents and compilers',
    hardwareReq: '1x RTX 4090 (24GB VRAM) for local coding assistant',
    benchmarks: '#1 open-weight on SWE-Bench Pro (June 2026)',
  },
  {
    name: 'Kimi K2.6',
    developer: 'Moonshot AI',
    focus: 'Coding',
    license: 'Restrictive',
    licenseFull: 'Modified MIT License (Non-commercial limits)',
    context: 'Large',
    contextValue: '200k',
    strength: 'Ultra-low-cost Coding Inference',
    architecture: 'Dense model optimized for flash attention and caching',
    bestUseCase: 'High-throughput code completion engines (copilots)',
    hardwareReq: 'Cloud API or multi-GPU local rig (4x RTX 4090)',
    benchmarks: 'Competitive with GPT-4o on HumanEval',
  },
  {
    name: 'StarCoder2',
    developer: 'BigCode (Service)',
    focus: 'Coding',
    license: 'Restrictive',
    licenseFull: 'OpenRAIL-M (Responsible AI License)',
    context: 'Large',
    contextValue: '32k',
    strength: 'Full Dataset Training Transparency',
    architecture: 'Dense (3B, 7B, 15B) trained on strictly permissive code',
    bestUseCase: 'Enterprise development with strict IP compliance',
    hardwareReq: 'Single GPU (8GB VRAM) for 3B/7B; 16GB for 15B',
    benchmarks: 'Highly robust syntax accuracy across 80+ programming languages',
  },
  {
    name: 'OLMo 2',
    developer: 'AI2 (Allen Inst.)',
    focus: 'Edge',
    license: 'Apache 2.0',
    licenseFull: 'Apache 2.0 License',
    context: 'Standard',
    contextValue: '8k',
    strength: '100% Open Reproducibility',
    architecture:
      'Dense, with full access to datasets, training code, and intermediate checkpoints',
    bestUseCase: 'Academic research and custom pre-training experiments',
    hardwareReq: '1x RTX 3090/4090 for local fine-tuning',
    benchmarks: 'Standard benchmarks used for model auditability research',
  },
  {
    name: 'Falcon 3',
    developer: 'TII (Abu Dhabi)',
    focus: 'Edge',
    license: 'Apache 2.0',
    licenseFull: 'Apache 2.0 License',
    context: 'Large',
    contextValue: '32k',
    strength: 'Single GPU hosting efficiency',
    architecture: 'Dense layout optimized for low-precision inference',
    bestUseCase: 'Budget-friendly self-hosting on gaming hardware',
    hardwareReq: '1x mid-range GPU (e.g. RTX 4070 / 12GB VRAM)',
    benchmarks: 'Top performer in parameter-per-dollar efficiency',
  },
]

export default function ModelExplorer() {
  const [focusFilter, setFocusFilter] = useState<string>('All')
  const [licenseFilter, setLicenseFilter] = useState<string>('All')
  const [contextFilter, setContextFilter] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [expandedModel, setExpandedModel] = useState<string | null>(null)

  const toggleExpand = (name: string) => {
    setExpandedModel(expandedModel === name ? null : name)
  }

  // Filter Logic
  const filteredModels = MODELS.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.strength.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFocus = focusFilter === 'All' || model.focus === focusFilter
    const matchesLicense = licenseFilter === 'All' || model.license === licenseFilter
    const matchesContext = contextFilter === 'All' || model.context === contextFilter

    return matchesSearch && matchesFocus && matchesLicense && matchesContext
  })

  return (
    <div className="my-8">
      {/* Search & Filter bar */}
      <div className="border-gray-150 mb-6 space-y-4 rounded-xl border bg-gray-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search by model, creator, or strength..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-primary-400"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-zinc-400">
            <SlidersHorizontal className="h-4 w-4" />
            <span>FILTERS</span>
          </div>
        </div>

        {/* Categories toggles */}
        <div className="flex flex-wrap gap-4 text-xs">
          {/* Focus Group */}
          <div className="space-y-1.5">
            <div className="font-bold text-gray-400 dark:text-zinc-500">Capability Focus</div>
            <div className="flex flex-wrap gap-1 rounded-lg bg-gray-100 p-0.5 dark:bg-zinc-800/60">
              {['All', 'Reasoning', 'Coding', 'Multimodal', 'Edge'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFocusFilter(f)}
                  className={`rounded-md px-2.5 py-1 font-semibold transition-all ${
                    focusFilter === f
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-zinc-700 dark:text-white'
                      : 'text-gray-500 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* License Group */}
          <div className="space-y-1.5">
            <div className="font-bold text-gray-400 dark:text-zinc-500">License Type</div>
            <div className="flex flex-wrap gap-1 rounded-lg bg-gray-100 p-0.5 dark:bg-zinc-800/60">
              {['All', 'MIT', 'Apache 2.0', 'Restrictive'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLicenseFilter(l)}
                  className={`rounded-md px-2.5 py-1 font-semibold transition-all ${
                    licenseFilter === l
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-zinc-700 dark:text-white'
                      : 'text-gray-500 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  {l === 'All' ? 'All' : l}
                </button>
              ))}
            </div>
          </div>

          {/* Context Group */}
          <div className="space-y-1.5">
            <div className="font-bold text-gray-400 dark:text-zinc-500">Context Window</div>
            <div className="flex flex-wrap gap-1 rounded-lg bg-gray-100 p-0.5 dark:bg-zinc-800/60">
              {['All', 'Standard', 'Large', 'Massive'].map((c) => (
                <button
                  key={c}
                  onClick={() => setContextFilter(c)}
                  className={`rounded-md px-2.5 py-1 font-semibold transition-all ${
                    contextFilter === c
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-zinc-700 dark:text-white'
                      : 'text-gray-500 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  {c === 'All'
                    ? 'All'
                    : c === 'Standard'
                      ? 'Standard (<=32k)'
                      : c === 'Large'
                        ? 'Large (128k+)'
                        : 'Massive (1M)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredModels.map((model) => {
          const isExpanded = expandedModel === model.name
          return (
            <div
              key={model.name}
              className={`p-4.5 group flex flex-col justify-between overflow-hidden rounded-xl border bg-white transition-all duration-300 ${
                isExpanded
                  ? 'col-span-1 border-primary-500 shadow-md dark:border-primary-400 sm:col-span-2 lg:col-span-3'
                  : 'border-gray-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                      {model.developer}
                    </span>
                    <h4 className="dark:text-zinc-150 text-base font-extrabold text-gray-900">
                      {model.name}
                    </h4>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${
                      model.focus === 'Reasoning'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-300'
                        : model.focus === 'Coding'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-300'
                          : model.focus === 'Multimodal'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300'
                            : 'bg-teal-100 text-teal-800 dark:bg-teal-950/30 dark:text-teal-300'
                    }`}
                  >
                    {model.focus}
                  </span>
                </div>

                <div className="text-gray-650 text-xs leading-relaxed dark:text-zinc-400">
                  <span className="font-bold text-gray-900 dark:text-zinc-200">Key Strength:</span>{' '}
                  {model.strength}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold text-gray-600 dark:bg-zinc-800 dark:text-zinc-400">
                    Context: {model.contextValue}
                  </span>
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold text-gray-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {model.license}
                  </span>
                </div>

                {/* Expanded Details section */}
                {isExpanded && (
                  <div className="mt-4 grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 dark:border-zinc-800 md:grid-cols-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wide text-gray-400 dark:text-zinc-500">
                        <Award className="h-3.5 w-3.5" /> Architecture
                      </div>
                      <p className="text-xs text-gray-800 dark:text-zinc-300">
                        {model.architecture}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wide text-gray-400 dark:text-zinc-500">
                        <HardDrive className="h-3.5 w-3.5" /> Hardware / Sizing
                      </div>
                      <p className="text-xs text-gray-800 dark:text-zinc-300">
                        {model.hardwareReq}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wide text-gray-400 dark:text-zinc-500">
                        <Shield className="h-3.5 w-3.5" /> License & Scope
                      </div>
                      <p className="text-xs text-gray-800 dark:text-zinc-300">
                        {model.licenseFull}
                      </p>
                    </div>
                    <div className="col-span-1 space-y-1 md:col-span-3">
                      <div className="text-[10px] font-extrabold uppercase tracking-wide text-gray-400 dark:text-zinc-500">
                        Best Production Use Case
                      </div>
                      <p className="rounded-lg border border-gray-100 bg-gray-50 p-2 text-xs text-gray-800 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-300">
                        {model.bestUseCase}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-end border-t border-gray-100 pt-3 dark:border-zinc-800">
                <button
                  onClick={() => toggleExpand(model.name)}
                  className="flex items-center gap-1 text-[11px] font-bold text-primary-500 hover:text-primary-600 dark:text-primary-400"
                >
                  {isExpanded ? 'Show Less' : 'Inspect Specifications'}
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>
            </div>
          )
        })}

        {filteredModels.length === 0 && (
          <div className="col-span-full py-8 text-center text-xs text-gray-500 dark:text-zinc-400">
            No models match the selected filter criteria. Try resetting.
          </div>
        )}
      </div>
    </div>
  )
}
