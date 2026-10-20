'use client'

import { useState } from 'react'
import { Disc, Layers, HelpCircle, HardDrive } from 'lucide-react'

type MemoryBlock = {
  id: string
  name: string
  scope: 'Shared (Per JVM)' | 'Private (Per Thread)'
  storage: string
  purpose: string
  exampleCode: string
  mappingDetails: string
}

const BLOCKS: MemoryBlock[] = [
  {
    id: 'heap',
    name: 'Heap Area',
    scope: 'Shared (Per JVM)',
    storage: 'All dynamic class instances and arrays.',
    purpose:
      'Stores the actual data objects allocated via new keyword. Managed by the Garbage Collector.',
    exampleCode: 'User userRef = new User("Alice", 28);',
    mappingDetails:
      'The actual new User(...) object values (string data "Alice" and integer 28) are stored here in Heap memory.',
  },
  {
    id: 'method',
    name: 'Method Area (Metaspace)',
    scope: 'Shared (Per JVM)',
    storage: 'Class templates, metadata, static variables, and constant pool.',
    purpose:
      'Stores class-level structures, runtime constant pools, field data, and method bytecodes.',
    exampleCode: 'public static final String SITE = "mushfiqweb";',
    mappingDetails:
      'The byte structure of class User, the constant "mushfiqweb" and compile-time code for methods are stored here.',
  },
  {
    id: 'stack',
    name: 'JVM Stack (Per Thread)',
    scope: 'Private (Per Thread)',
    storage: 'Local variables, primitive values, and partial frame references.',
    purpose:
      'Stores local variables, parameters, and return values in individual Stack Frames as methods execute.',
    exampleCode: 'int score = 94;\nUser userRef = ...',
    mappingDetails:
      'The primitive value "94" and the reference pointer "userRef" (pointing to Heap) are stored inside the current Stack Frame.',
  },
  {
    id: 'pc',
    name: 'PC Registers (Per Thread)',
    scope: 'Private (Per Thread)',
    storage: 'Memory address of the current executing JVM instruction.',
    purpose:
      'Tracks the execution pointer. If the current method is native, the PC register is undefined.',
    exampleCode: '0: aload_0\n1: invokespecial #1',
    mappingDetails:
      'As instructions 0 and 1 execute, the PC register increments dynamically to point to the next instruction address.',
  },
]

export default function MemoryInspector() {
  const [selected, setSelected] = useState<string>('heap')
  const current = BLOCKS.find((b) => b.id === selected)!

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
      {/* Header */}
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/80">
        <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100">
          JVM Runtime Data Area Inspector
        </h3>
        <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">
          Click a memory region block below to observe allocation scope and Java code mapping
        </p>
      </div>

      {/* Interactive Grid Blocks */}
      <div className="border-b border-gray-100 bg-gray-50/30 p-5 dark:border-zinc-800 dark:bg-zinc-900/10">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-500">
          JVM Runtime Memory Layout Map
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          {BLOCKS.map((b) => {
            const isSelected = selected === b.id
            return (
              <button
                key={b.id}
                onClick={() => setSelected(b.id)}
                className={`p-4.5 rounded-xl border text-center transition-all duration-300 ${
                  isSelected
                    ? 'border-indigo-500 bg-white text-indigo-700 shadow-md dark:border-indigo-400 dark:bg-zinc-900'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-800'
                }`}
              >
                <div className="text-xs font-bold">{b.name}</div>
                <span
                  className={`py-0.2 mt-1.5 inline-block rounded-full px-1.5 text-[8px] font-bold uppercase tracking-wider ${
                    b.scope.includes('Shared')
                      ? 'bg-emerald-100/60 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'bg-indigo-100/60 text-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-400'
                  }`}
                >
                  {b.scope.split(' ')[0]}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Details Display Panel */}
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-12">
        {/* Info Column */}
        <div className="space-y-4 md:col-span-6">
          <div>
            <h4 className="dark:text-zinc-150 text-sm font-extrabold text-gray-900">
              {current.name}
            </h4>
            <div className="text-gray-450 mt-0.5 text-[9.5px] font-bold uppercase tracking-wider">
              {current.scope}
            </div>
            <p className="text-gray-650 mt-2 text-xs leading-relaxed dark:text-zinc-400">
              {current.purpose}
            </p>
          </div>

          <div className="space-y-1 text-xs">
            <div className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
              Allocated Data
            </div>
            <div className="font-semibold text-gray-800 dark:text-zinc-200">{current.storage}</div>
          </div>
        </div>

        {/* Code Mapping Column */}
        <div className="text-zinc-350 flex flex-col justify-between rounded-xl bg-zinc-950 p-4 font-mono text-[10.5px] md:col-span-6">
          <div>
            <div className="text-zinc-550 mb-2 border-b border-zinc-900 pb-1 text-[8.5px] font-bold uppercase tracking-wider">
              Java Code Context Example
            </div>
            <div className="mb-3 whitespace-pre rounded border border-zinc-800 bg-zinc-900 p-2 text-zinc-100">
              {current.exampleCode}
            </div>
          </div>

          <div className="border-t border-zinc-900 pt-3">
            <span className="mb-1 block text-[8.5px] font-bold uppercase tracking-wider text-primary-400">
              Memory Mapping Mechanics:
            </span>
            <p className="text-[10px] leading-normal text-zinc-400">{current.mappingDetails}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
