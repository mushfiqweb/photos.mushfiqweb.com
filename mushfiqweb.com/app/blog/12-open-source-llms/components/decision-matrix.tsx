'use client'

import { useState } from 'react'
import { Check, HelpCircle, ArrowRight, RotateCcw, AlertCircle } from 'lucide-react'

type QuizState = {
  hardware: string | null
  focus: string | null
  license: string | null
}

export default function DecisionMatrix() {
  const [step, setStep] = useState<number>(1)
  const [selections, setSelections] = useState<QuizState>({
    hardware: null,
    focus: null,
    license: null,
  })

  const resetQuiz = () => {
    setSelections({ hardware: null, focus: null, license: null })
    setStep(1)
  }

  const handleSelection = (field: keyof QuizState, value: string) => {
    setSelections((prev) => ({ ...prev, [field]: value }))
    setStep((prev) => prev + 1)
  }

  const getRecommendation = () => {
    const { hardware, focus, license } = selections

    // 1. Edge/On-device
    if (hardware === 'edge') {
      if (license === 'strict') {
        return {
          model: 'OLMo 2 or Falcon 3',
          reason:
            'OLMo 2 is 100% open under Apache 2.0, while Falcon 3 offers outstanding single-GPU parameter efficiency under Apache 2.0.',
          specs: 'Sizing: 7B params | Context: 8k-32k | Run locally on standard consumer GPUs.',
        }
      }
      return {
        model: 'Phi 4',
        reason:
          "Phi 4 is Microsoft's state-of-the-art 3.8B model trained almost entirely on high-quality synthetic data, making it the most capable local edge reasoning model.",
        specs: 'Sizing: 3.8B params | Context: 16k | MIT License.',
      }
    }

    // 2. Single consumer GPU
    if (hardware === 'single-gpu') {
      if (focus === 'coding') {
        if (license === 'strict') {
          return {
            model: 'GLM 5.1 or StarCoder2',
            reason:
              'GLM 5.1 (MIT) tops coding benchmarks like SWE-Bench. StarCoder2 (OpenRAIL-M) provides absolute data training transparency for enterprise IP safety.',
            specs: 'Sizing: 9B - 15B params | Context: 32k - 128k.',
          }
        }
        return {
          model: 'GLM 5.1',
          reason:
            'GLM 5.1 is the top choice for software engineering benchmarks, running comfortably on a single RTX 4090 under the MIT license.',
          specs: 'Sizing: 9B params | Context: 128k.',
        }
      }
      if (focus === 'multimodal') {
        return {
          model: 'Mistral Small 3.1 or Llama 4 Scout (7B)',
          reason:
            'Mistral Small 3.1 is highly optimized for local visual assistant tasks. Llama 4 Scout provides native vision and audio capabilities at small-weight sizes.',
          specs: 'Sizing: 7B - 22B params | Context: 128k.',
        }
      }
      // default single GPU reasoning
      return {
        model: 'Qwen3 (7B/14B) or Gemma 4',
        reason:
          'Qwen3 offers switchable thinking modes for deep reasoning, while Gemma 4 offers the widest multilingual coverage in the dense open-weight class.',
        specs: 'Sizing: 9B - 14B params | Context: 8k - 128k.',
      }
    }

    // 3. Enterprise / Server Clusters
    if (focus === 'coding') {
      if (license === 'strict') {
        return {
          model: 'GLM 5.1 or DeepSeek V4',
          reason:
            'GLM 5.1 is ideal for coding agents, while DeepSeek V4 is an ultra-efficient MoE with a native 1-million-token context window under the MIT license.',
          specs: 'Sizing: 9B - 671B params | Context: 128k - 1M | MIT License.',
        }
      }
      return {
        model: 'DeepSeek V4 or Kimi K2.6',
        reason:
          'DeepSeek V4 provides frontier-level reasoning and coding at a fraction of closed model API costs. Kimi K2.6 is highly competitive on coding output at massive volume.',
        specs: 'Sizing: MoE (671B total) / Dense | Context: 200k - 1M.',
      }
    }

    if (focus === 'multimodal') {
      return {
        model: 'Llama 4 Scout (70B)',
        reason:
          "Llama 4 Scout is Meta's flagship open-weight multimodal champion, handling visual and audio input natively with high-fidelity speech reasoning.",
        specs: 'Sizing: 70B params | Context: 128k.',
      }
    }

    // Default enterprise reasoning
    return {
      model: 'DeepSeek V4 or Nemotron 3 Super',
      reason:
        'DeepSeek V4 represents the absolute peak of open-source reasoning efficiency. Nemotron 3 Super is optimized for multi-tool agentic loops and NVIDIA hardware platforms.',
      specs: 'Sizing: MoE (671B / 148B) | Context: 1M.',
    }
  }

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900/50">
      {/* Header */}
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/80">
        <h3 className="dark:text-zinc-150 text-sm font-bold text-gray-900">
          Interactive Model Advisor
        </h3>
        <p className="text-xs text-gray-500 dark:text-zinc-400">
          Answer 3 questions to get an architect-level deployment recommendation
        </p>
      </div>

      <div className="p-6">
        {/* Progress Dots */}
        <div className="mb-6 flex justify-center gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === s
                  ? 'w-6 bg-primary-500 dark:bg-primary-400'
                  : step > s
                    ? 'w-1.5 bg-green-500 dark:bg-green-400'
                    : 'w-1.5 bg-gray-200 dark:bg-zinc-700'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Hardware Sizing */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="text-center text-sm font-bold text-gray-800 dark:text-zinc-200">
              1. What is your hardware or hosting strategy?
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                onClick={() => handleSelection('hardware', 'edge')}
                className="rounded-xl border border-gray-200 bg-white p-4 text-center hover:border-primary-500 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-primary-400"
              >
                <div className="text-sm font-bold text-gray-900 dark:text-zinc-100">Local Edge</div>
                <p className="mt-1 text-[11px] leading-relaxed text-gray-500 dark:text-zinc-400">
                  Smartphones, IoT nodes, or laptops with limited RAM
                </p>
              </button>
              <button
                onClick={() => handleSelection('hardware', 'single-gpu')}
                className="rounded-xl border border-gray-200 bg-white p-4 text-center hover:border-primary-500 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-primary-400"
              >
                <div className="text-sm font-bold text-gray-900 dark:text-zinc-100">
                  Consumer GPU
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-gray-500 dark:text-zinc-400">
                  Single local GPU (e.g. RTX 3090 / 4090, 24GB VRAM)
                </p>
              </button>
              <button
                onClick={() => handleSelection('hardware', 'server')}
                className="rounded-xl border border-gray-200 bg-white p-4 text-center hover:border-primary-500 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-primary-400"
              >
                <div className="text-sm font-bold text-gray-900 dark:text-zinc-100">
                  Enterprise Cloud
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-gray-500 dark:text-zinc-400">
                  Dedicated H100 nodes, server clusters, or API endpoints
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Task Focus */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="text-center text-sm font-bold text-gray-800 dark:text-zinc-200">
              2. What is the primary capability focus for your project?
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                onClick={() => handleSelection('focus', 'reasoning')}
                className="rounded-xl border border-gray-200 bg-white p-4 text-center hover:border-primary-500 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-primary-400"
              >
                <div className="text-sm font-bold text-gray-900 dark:text-zinc-100">
                  Deep Reasoning
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-gray-500 dark:text-zinc-400">
                  Complex math, logic puzzles, scientific evaluation
                </p>
              </button>
              <button
                onClick={() => handleSelection('focus', 'coding')}
                className="rounded-xl border border-gray-200 bg-white p-4 text-center hover:border-primary-500 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-primary-400"
              >
                <div className="text-sm font-bold text-gray-900 dark:text-zinc-100">
                  Coding / Agents
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-gray-500 dark:text-zinc-400">
                  Compilers, tool-calling pipelines, software test suites
                </p>
              </button>
              <button
                onClick={() => handleSelection('focus', 'multimodal')}
                className="rounded-xl border border-gray-200 bg-white p-4 text-center hover:border-primary-500 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-primary-400"
              >
                <div className="text-sm font-bold text-gray-900 dark:text-zinc-100">
                  Multimodal (VLM)
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-gray-500 dark:text-zinc-400">
                  Processing visual layouts, images, and audio charts
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Licensing / Compliance */}
        {step === 3 && (
          <div className="space-y-4">
            <h4 className="text-center text-sm font-bold text-gray-800 dark:text-zinc-200">
              3. Are you bounded by strict IP compliance or licensing requirements?
            </h4>
            <div className="mx-auto grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={() => handleSelection('license', 'strict')}
                className="rounded-xl border border-gray-200 bg-white p-4 text-center hover:border-primary-500 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-primary-400"
              >
                <div className="text-sm font-bold text-gray-900 dark:text-zinc-100">
                  Strictly Open Source
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-gray-500 dark:text-zinc-400">
                  Requires 100% open licenses (MIT / Apache 2.0) with zero commercial usage bounds
                </p>
              </button>
              <button
                onClick={() => handleSelection('license', 'permissive')}
                className="rounded-xl border border-gray-200 bg-white p-4 text-center hover:border-primary-500 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-primary-400"
              >
                <div className="text-sm font-bold text-gray-900 dark:text-zinc-100">
                  Open Weights (Flexible)
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-gray-500 dark:text-zinc-400">
                  Meta Llama, NVIDIA Open, or OpenRAIL weights are acceptable
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Results Display */}
        {step === 4 && (
          <div className="mx-auto max-w-xl space-y-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 p-3 dark:bg-green-950/20">
              <Check className="dark:text-green-450 h-6 w-6 text-green-500" />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-500">
                Your Top Recommendation
              </div>
              <h4 className="text-xl font-extrabold text-primary-600 dark:text-primary-400">
                {getRecommendation().model}
              </h4>
              <p className="text-gray-650 text-xs leading-relaxed dark:text-zinc-300">
                {getRecommendation().reason}
              </p>
            </div>

            <div className="border-gray-150 rounded-lg border bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-zinc-500">
                <AlertCircle className="h-4 w-4" /> Technical Specifications
              </div>
              <p className="mt-1.5 text-xs font-semibold text-gray-800 dark:text-zinc-200">
                {getRecommendation().specs}
              </p>
            </div>

            <button
              onClick={resetQuiz}
              className="mx-auto flex items-center gap-1.5 rounded-lg bg-gray-100 px-4 py-2 text-xs font-bold text-gray-800 transition-colors hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              <RotateCcw className="h-4.5 w-4.5" /> Re-evaluate Architecture
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
