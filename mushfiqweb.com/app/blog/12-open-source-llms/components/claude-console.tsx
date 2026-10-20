'use client'

import { useState } from 'react'
import { Terminal, Shield, Check, X, ShieldAlert, ArrowRight, Play } from 'lucide-react'

type PermissionMode = {
  id: string
  name: string
  description: string
  isSelectable: boolean
  isGated: boolean
  actions: {
    write: 'auto-approved' | 'prompt' | 'denied'
    command: 'auto-approved' | 'prompt' | 'denied'
    network: 'auto-approved' | 'prompt' | 'denied'
  }
  terminalOutput: string[]
}

const MODES: PermissionMode[] = [
  {
    id: 'plan',
    name: 'plan',
    description:
      'The model drafts a plan. Nothing executes until the user approves the entire plan.',
    isSelectable: true,
    isGated: false,
    actions: {
      write: 'prompt',
      command: 'prompt',
      network: 'prompt',
    },
    terminalOutput: [
      ' antigravity --mode plan',
      '🤖 Claude starts planning mode...',
      '📝 Created implementation_plan.md',
      '⚠️ WAITING: User approval required to execute the plan.',
      '❓ Would you like to proceed with the proposed plan? [Y/n]',
    ],
  },
  {
    id: 'default',
    name: 'default',
    description: 'Standard interactive use. Most tool calls require explicit user approval.',
    isSelectable: true,
    isGated: false,
    actions: {
      write: 'prompt',
      command: 'prompt',
      network: 'prompt',
    },
    terminalOutput: [
      ' antigravity',
      '🤖 Analyzing codebase...',
      '🛠️ Requesting permission: Read folder /src',
      '🛠️ Requesting permission: Run command "pnpm test"',
      '❓ Allow running "pnpm test"? [y/N]',
    ],
  },
  {
    id: 'acceptEdits',
    name: 'acceptEdits',
    description:
      'Edits in the working directory are auto-approved. Shell commands and network requests still prompt.',
    isSelectable: true,
    isGated: false,
    actions: {
      write: 'auto-approved',
      command: 'prompt',
      network: 'prompt',
    },
    terminalOutput: [
      ' antigravity --mode acceptEdits',
      '🤖 Modifying src/index.ts...',
      '✅ Write file "src/index.ts" (Auto-approved under acceptEdits)',
      '🛠️ Requesting permission: Run command "git commit -am \'fix\'"',
      '❓ Allow running "git commit -am \'fix\'"? [y/N]',
    ],
  },
  {
    id: 'auto',
    name: 'auto',
    description: 'An internal ML classifier decides on requests. Gated behind a feature flag.',
    isSelectable: false,
    isGated: true,
    actions: {
      write: 'auto-approved',
      command: 'prompt',
      network: 'denied',
    },
    terminalOutput: [
      ' antigravity --mode auto',
      '🤖 Analyzing command safety...',
      '🧠 ML Classifier: "npm run lint" classified as safe (auto-approved).',
      '✅ Executing "npm run lint"...',
      '❌ Denied request: "curl https://malicious.site" classified as dangerous.',
    ],
  },
  {
    id: 'dontAsk',
    name: 'dontAsk',
    description:
      'No prompts shown. Any action requiring approval is denied. Deny rules are strictly enforced.',
    isSelectable: true,
    isGated: false,
    actions: {
      write: 'auto-approved',
      command: 'denied',
      network: 'denied',
    },
    terminalOutput: [
      ' antigravity --mode dontAsk',
      '🤖 Performing refactoring task...',
      '✅ Edit file "src/utils.ts" (Safe write, auto-approved)',
      '❌ Denied: Command execution blocked under dontAsk mode.',
      '🚫 System aborted: cannot compile without bash tools.',
    ],
  },
  {
    id: 'bypassPermissions',
    name: 'bypassPermissions',
    description:
      'Most prompts are skipped. Safety-critical guards (e.g. system file edits) still apply.',
    isSelectable: true,
    isGated: false,
    actions: {
      write: 'auto-approved',
      command: 'auto-approved',
      network: 'auto-approved',
    },
    terminalOutput: [
      ' antigravity --mode bypassPermissions',
      '🤖 Initializing auto-pilot build...',
      '✅ Write file "src/app.tsx" (Bypassed)',
      '✅ Execute "pnpm build" (Bypassed)',
      '✅ Query "api.github.com" (Bypassed)',
      '🎉 Build completed successfully!',
    ],
  },
  {
    id: 'bubble',
    name: 'bubble',
    description: 'A subagent escalates its permission request to the parent. Internal only.',
    isSelectable: false,
    isGated: false,
    actions: {
      write: 'prompt',
      command: 'prompt',
      network: 'prompt',
    },
    terminalOutput: [
      ' [Subagent #41] Running in isolated workspace...',
      '🤖 Subagent wants to run command: "npm i lodash"',
      '🫧 Bubbling permission request to parent agent...',
      '❓ [Parent Approval] Allow subagent #41 to run "npm i lodash"? [y/N]',
    ],
  },
]

export default function ClaudeConsole() {
  const [selectedMode, setSelectedMode] = useState<PermissionMode>(MODES[0])
  const [hasActed, setHasActed] = useState<boolean>(false)
  const [actResult, setActResult] = useState<string | null>(null)

  const handleModeSelect = (mode: PermissionMode) => {
    setSelectedMode(mode)
    setHasActed(false)
    setActResult(null)
  }

  const handleAction = (approved: boolean) => {
    setHasActed(true)
    if (approved) {
      setActResult('Action authorized. Proceeding with command execution...')
    } else {
      setActResult('Action aborted by user. Tool execution rejected.')
    }
  }

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900/50">
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-gray-500 dark:text-zinc-400" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100">
            Permission Simulator
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400"></span>
          <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
          <span className="h-3 w-3 rounded-full bg-green-400"></span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-zinc-800 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
        {/* Left Side: Modes Selector */}
        <div className="p-5 lg:col-span-4">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
            Permission Modes
          </h4>
          <div className="space-y-1">
            {MODES.map((mode) => {
              const isSelected = selectedMode.id === mode.id
              return (
                <button
                  key={mode.id}
                  onClick={() => handleModeSelect(mode)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-xs font-semibold transition-all duration-300 ${
                    isSelected
                      ? 'bg-primary-50 font-bold text-primary-700 dark:bg-primary-950/20 dark:text-primary-400'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-800/40 dark:hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>--{mode.name}</span>
                    {mode.isGated && (
                      <span className="py-0.2 rounded bg-amber-100/60 px-1 text-[8px] font-bold text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        Gated
                      </span>
                    )}
                    {!mode.isSelectable && !mode.isGated && (
                      <span className="py-0.2 rounded bg-gray-100 px-1 text-[8px] font-bold text-gray-600 dark:bg-zinc-800 dark:text-zinc-400">
                        Internal
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-4 border-t border-gray-100 pt-4 dark:border-zinc-800">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
              Description
            </h5>
            <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-zinc-400">
              {selectedMode.description}
            </p>
          </div>
        </div>

        {/* Right Side: Simulated Terminal */}
        <div className="flex flex-col bg-zinc-950 p-5 font-mono text-xs text-zinc-300 lg:col-span-8">
          <div className="flex-1 space-y-2">
            {selectedMode.terminalOutput.map((line, idx) => {
              const isCommand = line.startsWith(' ')
              const isWarning = line.includes('⚠️') || line.includes('❓')
              const isError = line.startsWith('❌') || line.startsWith('🚫')
              const isSuccess = line.startsWith('✅')

              return (
                <div
                  key={idx}
                  className={`leading-relaxed transition-all duration-300 ${
                    isCommand
                      ? 'font-bold text-zinc-100'
                      : isWarning
                        ? 'text-yellow-400'
                        : isError
                          ? 'text-red-400'
                          : isSuccess
                            ? 'text-green-400'
                            : 'text-zinc-400'
                  }`}
                >
                  {isCommand && <span className="mr-1.5 text-primary-500">$</span>}
                  {line.trim()}
                </div>
              )
            })}

            {/* Interactive prompts */}
            {selectedMode.terminalOutput[selectedMode.terminalOutput.length - 1].includes('❓') &&
              !hasActed && (
                <div className="mt-4 flex items-center gap-3 rounded-lg border border-yellow-900/50 bg-yellow-950/20 p-3">
                  <Shield className="h-5 w-5 shrink-0 text-yellow-400" />
                  <div className="flex-1">
                    <div className="text-[11px] font-bold text-yellow-300">
                      User Decision Required
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      Authorize command execution in sandbox?
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(false)}
                      className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-1 text-[10px] font-bold text-zinc-300 transition-colors hover:bg-zinc-700"
                    >
                      <X className="h-3 w-3 text-red-400" /> Reject
                    </button>
                    <button
                      onClick={() => handleAction(true)}
                      className="flex items-center gap-1 rounded bg-primary-600 px-2 py-1 text-[10px] font-bold text-white transition-colors hover:bg-primary-500"
                    >
                      <Check className="h-3 w-3 text-green-300" /> Approve
                    </button>
                  </div>
                </div>
              )}

            {/* Action Feedback */}
            {hasActed && actResult && (
              <div
                className={`mt-4 rounded-lg border p-3 ${
                  actResult.includes('authorized')
                    ? 'border-green-900/50 bg-green-950/20 text-green-400'
                    : 'border-red-900/50 bg-red-950/20 text-red-400'
                }`}
              >
                {actResult}
              </div>
            )}
          </div>

          {/* Action matrix visual badges */}
          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-zinc-800 pt-4 text-[10px] text-zinc-500">
            <span className="font-bold uppercase tracking-wider">Rights Matrix:</span>
            <div className="flex items-center gap-1">
              <span>Write:</span>
              <span
                className={`py-0.2 rounded-sm px-1 font-bold ${
                  selectedMode.actions.write === 'auto-approved'
                    ? 'bg-green-950/50 text-green-400'
                    : 'bg-yellow-950/50 text-yellow-400'
                }`}
              >
                {selectedMode.actions.write}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span>Command:</span>
              <span
                className={`py-0.2 rounded-sm px-1 font-bold ${
                  selectedMode.actions.command === 'auto-approved'
                    ? 'bg-green-950/50 text-green-400'
                    : selectedMode.actions.command === 'prompt'
                      ? 'bg-yellow-950/50 text-yellow-400'
                      : 'bg-red-950/50 text-red-400'
                }`}
              >
                {selectedMode.actions.command}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span>Network:</span>
              <span
                className={`py-0.2 rounded-sm px-1 font-bold ${
                  selectedMode.actions.network === 'auto-approved'
                    ? 'bg-green-950/50 text-green-400'
                    : selectedMode.actions.network === 'prompt'
                      ? 'bg-yellow-950/50 text-yellow-400'
                      : 'bg-red-950/50 text-red-400'
                }`}
              >
                {selectedMode.actions.network}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
