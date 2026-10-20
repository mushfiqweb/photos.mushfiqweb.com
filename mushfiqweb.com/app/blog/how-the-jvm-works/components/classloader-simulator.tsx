'use client'

import { useState } from 'react'
import { ArrowUp, ArrowDown, Play, RotateCcw } from 'lucide-react'

type ClassType = 'core' | 'platform' | 'app'
type LoaderState = 'idle' | 'delegate_up' | 'resolved'

export default function ClassloaderSimulator() {
  const [selectedClass, setSelectedClass] = useState<ClassType>('core')
  const [loaderState, setLoaderState] = useState<LoaderState>('idle')
  const [activeLoader, setActiveLoader] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const CLASSES = [
    {
      id: 'core',
      label: 'java.lang.String (Core)',
      desc: 'Standard runtime system library class.',
    },
    {
      id: 'platform',
      label: 'javax.xml.XMLFilter (Platform)',
      desc: 'Extension or platform interface class.',
    },
    {
      id: 'app',
      label: 'com.mushfiqweb.BlogController (App)',
      desc: 'Custom application business logic class.',
    },
  ]

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, msg])
  }

  const runSimulation = async () => {
    setLogs([])
    setLoaderState('delegate_up')

    addLog('🚀 Loading request received for: ' + CLASSES.find((c) => c.id === selectedClass)?.label)
    addLog('🔍 Step 1: Request initiated at Application/System ClassLoader...')
    setActiveLoader('app')
    await wait(1200)

    addLog('⬆️ Delegating request UP to Platform ClassLoader...')
    setActiveLoader('platform')
    await wait(1200)

    addLog('⬆️ Delegating request UP to Bootstrap ClassLoader...')
    setActiveLoader('bootstrap')
    await wait(1200)

    addLog('🧠 Bootstrap ClassLoader searches core JDK classpath (rt.jar / java.base)...')
    if (selectedClass === 'core') {
      setLoaderState('resolved')
      addLog('✅ [SUCCESS] Bootstrap ClassLoader found and loaded java.lang.String!')
      setActiveLoader('bootstrap_success')
      return
    }

    addLog('⚠️ Class not found in Bootstrap. Delegating resolution DOWN to Platform ClassLoader...')
    setActiveLoader('platform')
    await wait(1200)

    addLog('🧠 Platform ClassLoader searches platform extensions path...')
    if (selectedClass === 'platform') {
      setLoaderState('resolved')
      addLog('✅ [SUCCESS] Platform ClassLoader found and loaded javax.xml.XMLFilter!')
      setActiveLoader('platform_success')
      return
    }

    addLog(
      '⚠️ Class not found in Platform. Delegating resolution DOWN to Application ClassLoader...'
    )
    setActiveLoader('app')
    await wait(1200)

    addLog('🧠 Application ClassLoader searches local classpath / target/classes...')
    if (selectedClass === 'app') {
      setLoaderState('resolved')
      addLog('✅ [SUCCESS] Application ClassLoader found and loaded com.mushfiqweb.BlogController!')
      setActiveLoader('app_success')
      return
    }
  }

  const reset = () => {
    setLoaderState('idle')
    setActiveLoader(null)
    setLogs([])
  }

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-gray-100 pb-4 dark:border-zinc-800 md:flex-row md:items-center">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100">
            ClassLoader Parent Delegation Simulator
          </h3>
          <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">
            Select a class type and trigger loading to observe the security delegation path
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value as ClassType)}
            disabled={loaderState !== 'idle'}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold outline-none focus:border-primary-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
          >
            {CLASSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          {loaderState === 'resolved' ? (
            <button
              onClick={reset}
              className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-800 transition-colors hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          ) : (
            <button
              onClick={runSimulation}
              disabled={loaderState !== 'idle'}
              className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-primary-500 disabled:opacity-50"
            >
              <Play className="h-4 w-4" /> Load Class
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Side: ClassLoader Hierarchy Diagram */}
        <div className="relative flex flex-col items-center justify-center space-y-3 rounded-xl bg-gray-50 p-6 dark:bg-zinc-800/40 lg:col-span-6">
          {/* Bootstrap Loader Block */}
          <div
            className={`relative w-48 rounded-lg border-2 p-2.5 text-center text-xs font-bold transition-all duration-300 ${
              activeLoader === 'bootstrap'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20'
                : activeLoader === 'bootstrap_success'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20'
                  : 'border-gray-200 bg-white text-gray-400 dark:border-zinc-800 dark:bg-zinc-900'
            }`}
          >
            Bootstrap ClassLoader
            <span className="mt-0.5 block text-[8px] font-normal text-gray-400">
              Core Runtime / rt.jar
            </span>
          </div>

          <div className="flex flex-col items-center text-gray-300">
            {loaderState === 'delegate_up' ? (
              <ArrowUp className="h-4 w-4 text-indigo-400" />
            ) : (
              <ArrowDown className="text-emerald-450 h-4 w-4" />
            )}
          </div>

          {/* Platform Loader Block */}
          <div
            className={`relative w-48 rounded-lg border-2 p-2.5 text-center text-xs font-bold transition-all duration-300 ${
              activeLoader === 'platform'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20'
                : activeLoader === 'platform_success'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20'
                  : 'border-gray-200 bg-white text-gray-400 dark:border-zinc-800 dark:bg-zinc-900'
            }`}
          >
            Platform ClassLoader
            <span className="mt-0.5 block text-[8px] font-normal text-gray-400">
              Extensions / ext-path
            </span>
          </div>

          <div className="flex flex-col items-center text-gray-300">
            {loaderState === 'delegate_up' &&
            (activeLoader === 'app' || activeLoader === 'platform') ? (
              <ArrowUp className="h-4 w-4 text-indigo-400" />
            ) : (
              <ArrowDown className="text-emerald-450 h-4 w-4" />
            )}
          </div>

          {/* App Loader Block */}
          <div
            className={`relative w-48 rounded-lg border-2 p-2.5 text-center text-xs font-bold transition-all duration-300 ${
              activeLoader === 'app'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20'
                : activeLoader === 'app_success'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20'
                  : 'border-gray-200 bg-white text-gray-400 dark:border-zinc-800 dark:bg-zinc-900'
            }`}
          >
            Application ClassLoader
            <span className="mt-0.5 block text-[8px] font-normal text-gray-400">
              Local CLASSPATH
            </span>
          </div>
        </div>

        {/* Right Side: Execution Console */}
        <div className="text-zinc-350 flex h-56 flex-col rounded-xl bg-zinc-950 p-4 font-mono text-[10px] lg:col-span-6">
          <div className="text-zinc-550 mb-2 border-b border-zinc-800 pb-1 text-[9px] uppercase tracking-wider">
            Resolution Pipeline Log
          </div>
          <div className="scrollbar-thin flex-1 space-y-1.5 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-[9.5px] italic text-zinc-700">
                Select a class and click Load Class to trace delegation...
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
