'use client'

import { useState } from 'react'

type FigmaProp = {
  padding: string
  radius: string
  color: string
  label: string
}

export default function CodeConnector() {
  const [component, setComponent] = useState<'button' | 'card'>('button')
  const [framework, setFramework] = useState<'react' | 'vue' | 'swift'>('react')

  const buttonProps: FigmaProp = {
    padding: '12px 24px',
    radius: '8px',
    color: '#6366f1',
    label: 'Primary Button',
  }
  const cardProps: FigmaProp = {
    padding: '24px',
    radius: '16px',
    color: '#ffffff',
    label: 'Feature Card',
  }

  const currentProps = component === 'button' ? buttonProps : cardProps

  const getCodeOutput = () => {
    if (component === 'button') {
      if (framework === 'react') {
        return `// React + Tailwind Code Connect mapping
import { Button } from '~/components/ui/button'

export default function MyButton() {
  return (
    <Button 
      variant="primary" 
      className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-colors"
    >
      ${currentProps.label}
    </Button>
  )
}`
      }
      if (framework === 'vue') {
        return `<!-- Vue Code Connect mapping -->
<template>
  <button class="px-6 py-3 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all">
    ${currentProps.label}
  </button>
</template>`
      }
      return `// iOS Swift / SwiftUI Code Connect
struct PrimaryButton: View {
    var body: some View {
        Text("${currentProps.label}")
            .font(.headline)
            .padding(.horizontal, 24)
            .padding(.vertical, 12)
            .background(Color(hex: "6366f1"))
            .foregroundColor(.white)
            .cornerRadius(8)
    }
}`
    } else {
      // Card Code
      if (framework === 'react') {
        return `// React + Tailwind Code Connect Card
export default function InfoCard() {
  return (
    <div className="p-6 rounded-2xl bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 shadow-md">
      <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
        ${currentProps.label}
      </h3>
      <p className="mt-2 text-xs text-zinc-500">Design properties connected.</p>
    </div>
  )
}`
      }
      if (framework === 'vue') {
        return `<!-- Vue Code Connect Card -->
<template>
  <div class="p-6 rounded-2xl bg-white border border-zinc-200 shadow-md">
    <h3 class="text-base font-extrabold text-zinc-900">${currentProps.label}</h3>
    <p class="mt-2 text-xs text-zinc-500">Syncing design parameters.</p>
  </div>
</template>`
      }
      return `// iOS Swift / SwiftUI Card
struct InfoCard: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("${currentProps.label}")
                .font(.headline)
                .foregroundColor(.primary)
            Text("Properties connected.")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .padding(24)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(radius: 4)
    }
}`
    }
  }

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-gray-100 pb-4 dark:border-zinc-800 md:flex-row md:items-center">
        <div>
          <h3 className="font-sans text-base font-bold text-gray-900 dark:text-zinc-100">
            Figma Code Connect Simulator
          </h3>
          <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">
            Select a design component and toggle framework tabs to inspect mapped source code
            outputs
          </p>
        </div>
        <div className="flex gap-2 rounded-lg bg-gray-100 p-0.5 dark:bg-zinc-800">
          <button
            onClick={() => setComponent('button')}
            className={`rounded-md px-3.5 py-1 text-xs font-bold transition-all ${
              component === 'button'
                ? 'bg-white text-gray-900 shadow-sm dark:bg-zinc-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400'
            }`}
          >
            Button Component
          </button>
          <button
            onClick={() => setComponent('card')}
            className={`rounded-md px-3.5 py-1 text-xs font-bold transition-all ${
              component === 'card'
                ? 'bg-white text-gray-900 shadow-sm dark:bg-zinc-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400'
            }`}
          >
            Card Component
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Side: Figma Properties Panel */}
        <div className="border-gray-250 p-4.5 flex flex-col justify-between rounded-xl border bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900/30 lg:col-span-4">
          <div>
            <div className="mb-3 border-b border-gray-200 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:border-zinc-800 dark:text-zinc-500">
              Figma Properties
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Component Class</span>
                <span className="font-bold uppercase text-gray-800 dark:text-zinc-200">
                  {component}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Padding</span>
                <span className="font-mono text-gray-800 dark:text-zinc-200">
                  {currentProps.padding}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Border Radius</span>
                <span className="font-mono text-gray-800 dark:text-zinc-200">
                  {currentProps.radius}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Background Fill</span>
                <span className="font-mono uppercase text-gray-800 dark:text-zinc-200">
                  {currentProps.color}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-3 text-[10px] leading-normal text-gray-400 dark:border-zinc-800">
            Code Connect maps these Figma variables directly into React props, CSS classes, or
            SwiftUI fields.
          </div>
        </div>

        {/* Right Side: Code Output Editor */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950 lg:col-span-8">
          {/* Framework tabs */}
          <div className="flex items-center justify-between border-b border-zinc-900 bg-zinc-900/30 px-4 py-2">
            <div className="flex gap-2">
              {(['react', 'vue', 'swift'] as const).map((fw) => (
                <button
                  key={fw}
                  onClick={() => setFramework(fw)}
                  className={`rounded px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide transition-colors ${
                    framework === fw
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {fw === 'react' ? 'React / TW' : fw === 'vue' ? 'Vue.js' : 'SwiftUI'}
                </button>
              ))}
            </div>
            <span className="text-[9px] font-bold text-zinc-600">code_connect.json</span>
          </div>

          {/* Mapped Code Output */}
          <div className="p-4.5 overflow-x-auto whitespace-pre font-mono text-[10.5px] leading-normal text-zinc-300">
            {getCodeOutput()}
          </div>
        </div>
      </div>
    </div>
  )
}
