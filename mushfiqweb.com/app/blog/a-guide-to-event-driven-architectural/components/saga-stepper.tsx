'use client'

import { useState } from 'react'
import { Check, X, RotateCcw, AlertTriangle, ArrowRight, Play } from 'lucide-react'

type SagaPath = 'happy' | 'failure'
type StepState = 'pending' | 'active' | 'success' | 'failed' | 'compensated'

export default function SagaStepper() {
  const [path, setPath] = useState<SagaPath>('happy')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [states, setStates] = useState<StepState[]>(['pending', 'pending', 'pending'])
  const [log, setLog] = useState<string[]>([])

  const reset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setStates(['pending', 'pending', 'pending'])
    setLog([])
  }

  const addLog = (msg: string) => {
    setLog((prev) => [...prev, msg])
  }

  const runSaga = async () => {
    setIsPlaying(true)
    setLog([])

    // Step 1: Order Service
    setCurrentStep(1)
    setStates(['active', 'pending', 'pending'])
    addLog('🟢 [Step 1: Order Service] Creating Order #4933 in state PENDING...')
    await wait(1800)
    setStates(['success', 'pending', 'pending'])
    addLog('✅ [Order Service] Order created successfully.')

    // Step 2: Payment Service
    setCurrentStep(2)
    setStates(['success', 'active', 'pending'])
    addLog('🟢 [Step 2: Payment Service] Authorizing payment for $89.00...')
    await wait(1850)
    setStates(['success', 'success', 'pending'])
    addLog('✅ [Payment Service] Payment authorized and captured.')

    // Step 3: Inventory Service
    setCurrentStep(3)
    setStates(['success', 'success', 'active'])
    addLog('🟢 [Step 3: Inventory Service] Attempting to allocate stock...')
    await wait(2000)

    if (path === 'happy') {
      setStates(['success', 'success', 'success'])
      addLog('✅ [Inventory Service] Stock allocated. Items packaged.')
      addLog(
        '🎉 [Saga Complete] Order #4933 state updated to CONFIRMED. Eventual consistency achieved!'
      )
      setIsPlaying(false)
    } else {
      setStates(['success', 'success', 'failed'])
      addLog('❌ [Inventory Service] Failure: SKU Out of Stock!')
      addLog('⚠️ Triggering SAGA COMPENSATION transactions to rollback states...')
      await wait(1800)

      // Rollback Step 2: Refund Payment
      setCurrentStep(2)
      setStates(['success', 'compensated', 'failed'])
      addLog('🔄 [Compensation: Payment Service] Refunding payment authorization for $89.00...')
      await wait(1800)

      // Rollback Step 1: Cancel Order
      setCurrentStep(1)
      setStates(['compensated', 'compensated', 'failed'])
      addLog('🔄 [Compensation: Order Service] Marking Order #4933 state as CANCELLED.')
      await wait(1500)

      addLog(
        '🚫 [Saga Rollback Complete] Decoupled transactions reversed. Consistent fail-state preserved.'
      )
      setIsPlaying(false)
    }
  }

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-gray-100 pb-4 dark:border-zinc-800 md:flex-row md:items-center">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100">
            Saga Orchestrator Stepper
          </h3>
          <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">
            Toggle paths to watch eventual consistency or compensating rollbacks in action
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-gray-150 flex rounded-lg p-1 dark:bg-zinc-800">
            <button
              onClick={() => {
                setPath('happy')
                reset()
              }}
              disabled={isPlaying}
              className={`rounded-md px-3 py-1 text-[11px] font-bold transition-all ${
                path === 'happy'
                  ? 'dark:text-emerald-450 bg-white text-emerald-600 shadow-sm dark:bg-zinc-700'
                  : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              Success Path
            </button>
            <button
              onClick={() => {
                setPath('failure')
                reset()
              }}
              disabled={isPlaying}
              className={`rounded-md px-3 py-1 text-[11px] font-bold transition-all ${
                path === 'failure'
                  ? 'dark:text-red-450 bg-white text-red-600 shadow-sm dark:bg-zinc-700'
                  : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              Failure Rollback
            </button>
          </div>
          <button
            onClick={runSaga}
            disabled={isPlaying}
            className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3.5 py-1 text-xs font-bold text-white transition-colors hover:bg-primary-500 disabled:opacity-50"
          >
            <Play className="h-4 w-4" /> Start Flow
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Side: Steps Visualizer */}
        <div className="flex flex-col justify-center rounded-xl bg-gray-50 p-6 dark:bg-zinc-800/40 lg:col-span-7">
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-around">
            {/* Step 1: Order */}
            <div className="flex flex-col items-center">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-extrabold transition-all duration-500 ${
                  states[0] === 'active'
                    ? 'animate-pulse border-primary-500 bg-primary-50 text-primary-600'
                    : states[0] === 'success'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20'
                      : states[0] === 'compensated'
                        ? 'border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-950/20'
                        : 'border-gray-200 bg-white text-gray-400 dark:border-zinc-800 dark:bg-zinc-900'
                }`}
              >
                {states[0] === 'success' ? (
                  <Check className="h-5 w-5" />
                ) : states[0] === 'compensated' ? (
                  <RotateCcw className="h-4 w-4" />
                ) : (
                  '1'
                )}
              </div>
              <span className="mt-2 text-[10px] font-bold text-gray-700 dark:text-zinc-300">
                Order Service
              </span>
              <span className="text-gray-455 text-[8.5px] dark:text-zinc-500">Create Pending</span>
            </div>

            {/* Link line */}
            <ArrowRight className="hidden text-gray-300 dark:text-zinc-700 md:block" />

            {/* Step 2: Payment */}
            <div className="flex flex-col items-center">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-extrabold transition-all duration-500 ${
                  states[1] === 'active'
                    ? 'animate-pulse border-primary-500 bg-primary-50 text-primary-600'
                    : states[1] === 'success'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20'
                      : states[1] === 'compensated'
                        ? 'border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-950/20'
                        : 'border-gray-200 bg-white text-gray-400 dark:border-zinc-800 dark:bg-zinc-900'
                }`}
              >
                {states[1] === 'success' ? (
                  <Check className="h-5 w-5" />
                ) : states[1] === 'compensated' ? (
                  <RotateCcw className="h-4 w-4" />
                ) : (
                  '2'
                )}
              </div>
              <span className="mt-2 text-[10px] font-bold text-gray-700 dark:text-zinc-300">
                Payment Service
              </span>
              <span className="text-gray-455 text-[8.5px] dark:text-zinc-500">
                Authorize Payment
              </span>
            </div>

            {/* Link line */}
            <ArrowRight className="hidden text-gray-300 dark:text-zinc-700 md:block" />

            {/* Step 3: Inventory */}
            <div className="flex flex-col items-center">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-extrabold transition-all duration-500 ${
                  states[2] === 'active'
                    ? 'animate-pulse border-primary-500 bg-primary-50 text-primary-600'
                    : states[2] === 'success'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20'
                      : states[2] === 'failed'
                        ? 'border-red-500 bg-red-50 text-red-600 dark:bg-red-950/20'
                        : 'border-gray-200 bg-white text-gray-400 dark:border-zinc-800 dark:bg-zinc-900'
                }`}
              >
                {states[2] === 'success' ? (
                  <Check className="h-5 w-5" />
                ) : states[2] === 'failed' ? (
                  <X className="h-5 w-5" />
                ) : (
                  '3'
                )}
              </div>
              <span className="mt-2 text-[10px] font-bold text-gray-700 dark:text-zinc-300">
                Inventory Service
              </span>
              <span className="text-gray-455 text-[8.5px] dark:text-zinc-500">Allocate Stock</span>
            </div>
          </div>
        </div>

        {/* Right Side: Log Console */}
        <div className="text-zinc-350 flex h-56 flex-col rounded-xl bg-zinc-950 p-4 font-mono text-[10.5px] lg:col-span-5">
          <div className="text-zinc-550 mb-2 flex items-center justify-between border-b border-zinc-800 pb-1 text-[9.5px] uppercase tracking-wider">
            <span>Saga Execution Log</span>
            {path === 'failure' && currentStep > 0 && states[2] === 'failed' && (
              <span className="flex animate-pulse items-center gap-1 text-[8.5px] font-extrabold text-amber-500">
                <AlertTriangle className="h-3 w-3" /> COMPENSATION ONGOING
              </span>
            )}
          </div>
          <div className="scrollbar-thin flex-1 space-y-1.5 overflow-y-auto">
            {log.length === 0 ? (
              <div className="text-[10px] italic text-zinc-700">
                Select path and click Start Flow...
              </div>
            ) : (
              log.map((line, idx) => {
                const isSuccess = line.startsWith('✅') || line.startsWith('🎉')
                const isFailure = line.startsWith('❌')
                const isCompensation =
                  line.startsWith('🔄') || line.startsWith('⚠️') || line.startsWith('🚫')

                return (
                  <div
                    key={idx}
                    className={
                      isSuccess
                        ? 'text-green-400'
                        : isFailure
                          ? 'text-red-400'
                          : isCompensation
                            ? 'text-amber-400'
                            : 'text-zinc-300'
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
