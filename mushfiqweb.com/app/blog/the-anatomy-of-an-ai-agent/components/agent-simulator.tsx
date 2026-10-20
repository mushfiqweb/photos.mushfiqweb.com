'use client'

import { useState } from 'react'
import { Play, RotateCcw, Brain, Terminal, Server, HelpCircle } from 'lucide-react'

type LoopState = 'idle' | 'planning' | 'memory' | 'tool_call' | 'observation' | 'complete'

export default function AgentSimulator() {
  const [goal, setGoal] = useState<string>('build-ui')
  const [state, setState] = useState<LoopState>('idle')
  const [logs, setLogs] = useState<string[]>([])

  const GOALS = [
    {
      id: 'build-ui',
      label: 'Create profile card component',
      desc: 'Agent will search styles, generate JSX, and verify types.',
    },
    {
      id: 'fix-bug',
      label: 'Debug API network timeout',
      desc: 'Agent will read logs, edit endpoints, and run test suites.',
    },
  ]

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, msg])
  }

  const runAgent = async () => {
    setLogs([])

    // Step 1: Planning
    setState('planning')
    addLog('🧠 [PLANNING] Initialized goal: ' + GOALS.find((g) => g.id === goal)?.label)
    addLog('   - Subtask 1: Inspect project file structure for references.')
    addLog('   - Subtask 2: Analyze target files and apply modifications.')
    addLog('   - Subtask 3: Run compiler checks to verify types.')
    await wait(2000)

    // Step 2: Memory Retrieval
    setState('memory')
    addLog('💾 [MEMORY RETRIEVAL] Searching vector storage for context matching the task...')
    addLog('   - Query: "profile card styles Tailwind"')
    addLog(
      '   - Found: "GritBackground" at ~/components/ui/grit-background.tsx using absolute positioning.'
    )
    await wait(1800)

    // Step 3: Tool Call
    setState('tool_call')
    addLog('🛠️ [TOOL CALL] Executing system tool to read file:')
    addLog('   - Tool: `view_file` { AbsolutePath: "components/ui/grit-background.tsx" }')
    await wait(1500)

    // Step 4: Observation
    setState('observation')
    addLog('👁️ [OBSERVATION] Tool output received successfully:')
    addLog('   - File size: 2,401 bytes. Uses standard Tailwind classes and Next-theme variables.')
    await wait(1800)

    // Step 5: Planning revision & Write
    setState('tool_call')
    addLog('🧠 [RE-PLANNING] Context updated. Writing new component layout:')
    addLog('   - Tool: `write_to_file` { TargetFile: "components/profile-card.tsx" }')
    await wait(1500)

    // Step 6: Complete
    setState('complete')
    addLog('✅ [GOAL ACHIEVED] Created component "components/profile-card.tsx".')
    addLog('🎉 Compilation successful. Verification completed with zero type errors.')
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
          <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100">
            Agent Action Loop Simulator
          </h3>
          <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">
            Select a goal and observe the LLM loop on planning, tool execution, and observations
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            disabled={state !== 'idle' && state !== 'complete'}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-primary-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
          >
            {GOALS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
          {state === 'complete' ? (
            <button
              onClick={reset}
              className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-800 transition-colors hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          ) : (
            <button
              onClick={runAgent}
              disabled={state !== 'idle'}
              className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-primary-500 disabled:opacity-50"
            >
              <Play className="h-4 w-4" /> Run Loop
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Side: States diagram */}
        <div className="flex flex-col justify-center rounded-xl bg-gray-50 p-6 dark:bg-zinc-800/40 lg:col-span-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Planning State */}
            <div
              className={`p-4.5 flex flex-col items-center justify-center rounded-lg border text-center transition-all duration-300 ${
                state === 'planning'
                  ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-950/20'
                  : 'border-gray-200 bg-white text-gray-500 dark:border-zinc-800 dark:bg-zinc-900'
              }`}
            >
              <Brain className={`mb-2 h-6 w-6 ${state === 'planning' ? 'text-primary-500' : ''}`} />
              <div className="text-xs font-bold">1. Planning</div>
              <span className="mt-1 text-[9px] text-gray-400">Goal Decomposition</span>
            </div>

            {/* Memory State */}
            <div
              className={`p-4.5 flex flex-col items-center justify-center rounded-lg border text-center transition-all duration-300 ${
                state === 'memory'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950/20'
                  : 'border-gray-200 bg-white text-gray-500 dark:border-zinc-800 dark:bg-zinc-900'
              }`}
            >
              <Server className={`mb-2 h-6 w-6 ${state === 'memory' ? 'text-indigo-500' : ''}`} />
              <div className="text-xs font-bold">2. Memory Recall</div>
              <span className="mt-1 text-[9px] text-gray-400">Vector DB Lookup</span>
            </div>

            {/* Tool Execution State */}
            <div
              className={`p-4.5 flex flex-col items-center justify-center rounded-lg border text-center transition-all duration-300 ${
                state === 'tool_call'
                  ? 'border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-400 dark:bg-amber-950/20'
                  : 'border-gray-200 bg-white text-gray-500 dark:border-zinc-800 dark:bg-zinc-900'
              }`}
            >
              <Terminal
                className={`mb-2 h-6 w-6 ${state === 'tool_call' ? 'text-amber-500' : ''}`}
              />
              <div className="text-xs font-bold">3. Tool Calling</div>
              <span className="mt-1 text-[9px] text-gray-400">Bash / Write Actions</span>
            </div>

            {/* Observation State */}
            <div
              className={`p-4.5 flex flex-col items-center justify-center rounded-lg border text-center transition-all duration-300 ${
                state === 'observation'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/20'
                  : 'border-gray-200 bg-white text-gray-500 dark:border-zinc-800 dark:bg-zinc-900'
              }`}
            >
              <HelpCircle
                className={`mb-2 h-6 w-6 ${state === 'observation' ? 'text-emerald-500' : ''}`}
              />
              <div className="text-xs font-bold">4. Observation</div>
              <span className="mt-1 text-[9px] text-gray-400">Parse Output Logs</span>
            </div>
          </div>
        </div>

        {/* Right Side: Simulated Terminal Logs */}
        <div className="flex h-60 flex-col rounded-xl bg-zinc-950 p-4 font-mono text-[10.5px] text-zinc-300 lg:col-span-6">
          <div className="text-zinc-550 mb-2 border-b border-zinc-800 pb-1 text-[9.5px] uppercase tracking-wider">
            Agent Reasoning Output Console
          </div>
          <div className="flex-1 space-y-1.5 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-[10px] italic text-zinc-700">
                Click Run Loop to begin agent execution...
              </div>
            ) : (
              logs.map((line, idx) => {
                const isHeading =
                  line.startsWith('🧠') ||
                  line.startsWith('💾') ||
                  line.startsWith('🛠️') ||
                  line.startsWith('👁️') ||
                  line.startsWith('✅')
                return (
                  <div
                    key={idx}
                    className={isHeading ? 'font-bold text-zinc-100' : 'text-zinc-400'}
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
