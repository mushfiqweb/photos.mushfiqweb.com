'use client'

import { useState } from 'react'
import { Play, Database, RefreshCw, Send, CheckCircle, AlertTriangle } from 'lucide-react'

type Step = 'idle' | 'writing' | 'committed' | 'polling' | 'publishing' | 'complete'

export default function OutboxVisualizer() {
  const [step, setStep] = useState<Step>('idle')
  const [log, setLog] = useState<string[]>([])

  const addLog = (msg: string) => {
    setLog((prev) => [msg, ...prev])
  }

  const runSimulation = async () => {
    setLog([])
    setStep('writing')
    addLog('🚀 User clicks "Checkout". Placing Order...')
    await wait(1500)

    setStep('committed')
    addLog('📝 Local Database Transaction Committed:')
    addLog('   - Inserted row in "Orders" table (Order #1043)')
    addLog('   - Inserted event in "Outbox" table (OrderCreated)')
    await wait(2000)

    setStep('polling')
    addLog('🔍 Outbox Relay (CDC / Debezium) detects new entry in Outbox table...')
    await wait(1800)

    setStep('publishing')
    addLog('✉️ Relay publishes "OrderCreated" event to Message Broker (Apache Kafka)')
    await wait(1500)

    setStep('complete')
    addLog(
      '✅ Broker confirms message acknowledgment. Relay deletes/marks Outbox row as processed.'
    )
    addLog('🎉 Order Service decoupled cleanly. Payment and Inventory systems now receiving event.')
  }

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-gray-100 pb-4 dark:border-zinc-800 md:flex-row md:items-center">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100">
            Transactional Outbox Visualizer
          </h3>
          <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">
            Observe how Debezium or a polling relay solves the dual-write problem
          </p>
        </div>
        <button
          onClick={runSimulation}
          disabled={step !== 'idle' && step !== 'complete'}
          className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-primary-500 disabled:opacity-50"
        >
          <Play className="h-4 w-4" /> Trigger Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Side: System Node Flowchart */}
        <div className="flex flex-col justify-center rounded-xl bg-gray-50 p-6 dark:bg-zinc-800/40 lg:col-span-7">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-around">
            {/* Service Node */}
            <div
              className={`relative flex h-14 w-28 flex-col items-center justify-center rounded-lg border-2 text-[11px] font-bold shadow-sm transition-all duration-500 ${
                step === 'writing'
                  ? 'animate-pulse border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-950/20 dark:text-primary-400'
                  : 'border-gray-200 bg-white text-gray-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              Order Service
              <span className="text-[8px] font-normal text-gray-400">Writes Business Data</span>
            </div>

            {/* Arrow */}
            <div className="rotate-90 font-bold text-gray-300 dark:text-zinc-700 md:rotate-0">
              →
            </div>

            {/* DB Node */}
            <div
              className={`relative flex h-20 w-36 flex-col items-center justify-center rounded-lg border-2 text-[11px] font-bold shadow-sm transition-all duration-500 ${
                step === 'committed'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/20 dark:text-emerald-400'
                  : 'border-gray-200 bg-white text-gray-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              <Database className="mb-1 h-4.5 w-4.5" />
              Local Database
              <div className="mt-1 flex gap-1 text-[8px] font-normal">
                <span
                  className={`rounded-sm px-1 ${step === 'committed' || step === 'polling' || step === 'publishing' || step === 'complete' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-150 text-gray-650 dark:bg-zinc-700'}`}
                >
                  Orders
                </span>
                <span
                  className={`rounded-sm px-1 ${step === 'committed' || step === 'polling' ? 'animate-pulse bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-gray-150 text-gray-650 dark:bg-zinc-700'}`}
                >
                  Outbox
                </span>
              </div>
            </div>

            {/* Arrow */}
            <div className="rotate-90 font-bold text-gray-300 dark:text-zinc-700 md:rotate-0">
              →
            </div>

            {/* Message Broker Node */}
            <div
              className={`relative flex h-14 w-28 flex-col items-center justify-center rounded-lg border-2 text-[11px] font-bold shadow-sm transition-all duration-500 ${
                step === 'publishing' || step === 'complete'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950/20 dark:text-indigo-400'
                  : 'border-gray-200 bg-white text-gray-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              <Send className="mb-0.5 h-4 w-4" />
              Kafka / Broker
              <span className="text-[8px] font-normal text-gray-400">OrderCreated Stream</span>
            </div>
          </div>

          {/* Outbox Relay Polling Loop Overlay */}
          <div className="mt-6 flex flex-col items-center border-t border-gray-100 pt-4 dark:border-zinc-800">
            <div
              className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all duration-500 ${
                step === 'polling' || step === 'publishing'
                  ? 'border-amber-400 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-400'
                  : 'border-gray-200 bg-white text-gray-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'
              }`}
            >
              <RefreshCw
                className={`h-4.5 w-4.5 ${step === 'polling' || step === 'publishing' ? 'animate-spin' : ''}`}
              />
              Outbox Relay (Debezium CDC Reader)
            </div>
            <p className="mt-2 text-center text-[10px] leading-normal text-gray-400 dark:text-zinc-500">
              Relay reads transaction logs continuously to map changes in the Outbox table to Kafka
              events safely.
            </p>
          </div>
        </div>

        {/* Right Side: Log console */}
        <div className="flex h-64 flex-col rounded-xl bg-zinc-950 p-4 font-mono text-[11px] text-zinc-300 lg:col-span-5">
          <div className="mb-2 border-b border-zinc-800 pb-1 text-[10px] uppercase tracking-wider text-zinc-500">
            Relay Logs Output
          </div>
          <div className="flex-1 space-y-1.5 overflow-y-auto">
            {log.length === 0 ? (
              <div className="text-zinc-650 text-[10px] italic">
                Click trigger to start outbox transactional commit simulation...
              </div>
            ) : (
              log.map((line, idx) => (
                <div
                  key={idx}
                  className={
                    line.startsWith('✅')
                      ? 'text-green-400'
                      : line.startsWith('🚀')
                        ? 'text-blue-400'
                        : line.startsWith('-')
                          ? 'text-zinc-450'
                          : 'text-zinc-200'
                  }
                >
                  {line}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
