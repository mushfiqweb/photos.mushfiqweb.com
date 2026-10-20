'use client'

import { useState } from 'react'
import { Play, RotateCcw, Monitor, RefreshCw, Cpu, Layers } from 'lucide-react'

type ReconstructionState = 'idle' | 'capturing' | 'parsing' | 'reconstructing' | 'complete'

export default function DomReconstructor() {
  const [state, setState] = useState<ReconstructionState>('idle')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, msg])
  }

  const runReconstruction = async () => {
    setLogs([])
    setState('capturing')
    addLog('🚀 Initiating DOM Capture on localhost:3000...')
    addLog('🖥️ Launching headless browser agent (Playwright)...')
    await wait(1500)

    setState('parsing')
    addLog('🔍 Parsing DOM Tree and computed styles:')
    addLog('   - Found node: <div class="card font-bold p-6">')
    addLog('   - CSS: computed padding=24px, display=flex, gap=16px')
    addLog('   - Found child node: <span class="title">New Releases</span>')
    await wait(1850)

    setState('reconstructing')
    addLog('⚙️ Translating DOM node objects to native Figma API schemas...')
    addLog(
      '   - Mapping <div> with flex styling to Figma Frame with Auto-Layout (Direction: Vertical)'
    )
    addLog('   - Mapping <span> node to Figma TextNode (font: Inter, weight: Bold)')
    await wait(1800)

    setState('complete')
    addLog('✅ [SUCCESS] Created Figma components and frames.')
    addLog('🎉 Mapped 14 nodes successfully. Editable layers populated in active Figma Canvas.')
  }

  const reset = () => {
    setState('idle')
    setLogs([])
  }

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-gray-100 pb-4 dark:border-zinc-800 md:flex-row md:items-center">
        <div>
          <h3 className="font-sans text-base font-bold text-gray-900 dark:text-zinc-100">
            DOM-to-Figma Reconstructor
          </h3>
          <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">
            Observe how live CSS computed layout nodes are mapped to native Figma design frames
          </p>
        </div>
        {state === 'complete' ? (
          <button
            onClick={reset}
            className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-800 transition-colors hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        ) : (
          <button
            onClick={runReconstruction}
            disabled={state !== 'idle'}
            className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-primary-500 disabled:opacity-50"
          >
            <Play className="h-4 w-4" /> Capture DOM
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Side: Mock Browser & Canvas Flow */}
        <div className="border-gray-150 flex flex-col justify-center space-y-4 rounded-xl border bg-gray-50 p-6 dark:border-zinc-800 dark:bg-zinc-950/40 lg:col-span-6">
          <div className="flex flex-col items-center justify-around gap-4 md:flex-row">
            {/* Mock Web Browser */}
            <div
              className={`flex h-20 w-32 flex-col rounded-lg border-2 bg-white p-2 text-[10px] font-bold shadow-sm transition-all duration-500 dark:bg-zinc-900 ${
                state === 'capturing' || state === 'parsing'
                  ? 'animate-pulse border-primary-500'
                  : 'border-gray-200 dark:border-zinc-800'
              }`}
            >
              <div className="mb-1.5 flex gap-1 border-b border-gray-100 pb-1 dark:border-zinc-800">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400"></span>
              </div>
              <div className="rounded border border-dashed border-gray-300 p-1 dark:border-zinc-700">
                &lt;div class="card"&gt;
                <div className="pl-2 font-normal text-gray-400">&lt;span&gt;Title&lt;/span&gt;</div>
              </div>
            </div>

            {/* Processing state indicator */}
            <div className="flex rotate-90 items-center gap-1.5 text-sm font-extrabold text-gray-300 dark:text-zinc-700 md:rotate-0">
              <RefreshCw
                className={`h-5 w-5 ${state === 'parsing' || state === 'reconstructing' ? 'animate-spin text-primary-500' : ''}`}
              />
            </div>

            {/* Mock Figma Canvas */}
            <div
              className={`flex h-20 w-32 flex-col rounded-lg border-2 bg-white p-2 text-[10px] font-bold shadow-sm transition-all duration-500 dark:bg-zinc-900 ${
                state === 'reconstructing' || state === 'complete'
                  ? 'animate-pulse border-emerald-500'
                  : 'border-gray-200 dark:border-zinc-800'
              }`}
            >
              <div className="mb-1.5 flex items-center gap-1 border-b border-gray-100 pb-1 text-gray-400 dark:border-zinc-800">
                <Layers className="h-3.5 w-3.5" /> Layers
              </div>
              <div className="dark:text-emerald-450 rounded border border-dashed border-emerald-300 bg-emerald-50/20 p-1 text-emerald-700 dark:border-emerald-900">
                # Card [Auto-layout]
                <div className="pl-2 font-normal text-zinc-400">T Title node</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Log Console */}
        <div className="text-zinc-350 flex h-56 flex-col rounded-xl bg-zinc-950 p-4 font-mono text-[10px] lg:col-span-6">
          <div className="text-zinc-550 mb-2 border-b border-zinc-800 pb-1 text-[9px] uppercase tracking-wider">
            DOM Extraction Pipeline Logs
          </div>
          <div className="scrollbar-thin flex-1 space-y-1.5 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-[9.5px] italic text-zinc-700">
                Click Capture DOM to begin mapping running app structures back to designs...
              </div>
            ) : (
              logs.map((line, idx) => {
                const isSuccess = line.startsWith('✅')
                return (
                  <div
                    key={idx}
                    className={
                      isSuccess
                        ? 'font-bold text-green-400'
                        : line.startsWith('🚀')
                          ? 'text-blue-400'
                          : 'text-zinc-350'
                    }
                  >
                    {line}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
