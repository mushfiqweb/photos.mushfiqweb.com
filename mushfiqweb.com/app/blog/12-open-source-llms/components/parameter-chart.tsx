'use client'

import { useState } from 'react'

type ChartDataPoint = {
  name: string
  dev: string
  x: number // percentage
  y: number // percentage
  params: string
  context: string
  color: string
}

const points: ChartDataPoint[] = [
  {
    name: 'Phi 4',
    dev: 'Microsoft',
    x: 20,
    y: 88,
    params: '3.8B',
    context: '16k',
    color: '#14b8a6',
  },
  { name: 'OLMo 2', dev: 'AI2', x: 12, y: 82, params: '7B', context: '8k', color: '#06b6d4' },
  { name: 'Gemma 4', dev: 'Google', x: 12, y: 78, params: '9B', context: '8k', color: '#3b82f6' },
  { name: 'GLM 5.1', dev: 'Zhipu', x: 60, y: 78, params: '9B', context: '128k', color: '#6366f1' },
  { name: 'Falcon 3', dev: 'TII', x: 35, y: 72, params: '7B', context: '32k', color: '#8b5cf6' },
  {
    name: 'StarCoder2',
    dev: 'BigCode',
    x: 35,
    y: 68,
    params: '15B',
    context: '32k',
    color: '#a855f7',
  },
  {
    name: 'Mistral Small 3.1',
    dev: 'Mistral',
    x: 60,
    y: 60,
    params: '22B',
    context: '128k',
    color: '#d946ef',
  },
  {
    name: 'Llama 4 Scout',
    dev: 'Meta',
    x: 60,
    y: 40,
    params: '70B',
    context: '128k',
    color: '#ec4899',
  },
  { name: 'Qwen3', dev: 'Alibaba', x: 60, y: 38, params: '72B', context: '128k', color: '#f43f5e' },
  {
    name: 'Kimi K2.6',
    dev: 'Moonshot',
    x: 70,
    y: 38,
    params: '70B',
    context: '200k',
    color: '#f97316',
  },
  {
    name: 'Nemotron 3 Super',
    dev: 'NVIDIA',
    x: 88,
    y: 24,
    params: '148B',
    context: '1M',
    color: '#eab308',
  },
  {
    name: 'DeepSeek V4',
    dev: 'DeepSeek',
    x: 88,
    y: 10,
    params: '671B',
    context: '1M',
    color: '#22c55e',
  },
]

export default function ParameterChart() {
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null)

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100">
          Context Window vs. Sizing Footprint
        </h3>
        <p className="text-xs text-gray-500 dark:text-zinc-400">
          Hover over the nodes to see parameter sizes and context memory capabilities.
        </p>
      </div>

      <div className="border-gray-150 relative aspect-video w-full rounded-lg border bg-gray-50 p-6 dark:border-zinc-800 dark:bg-zinc-950/40">
        {/* SVG Wrapper */}
        <svg viewBox="0 0 500 280" className="h-full w-full overflow-visible">
          {/* Y Axis Grid lines */}
          <line
            x1="40"
            y1="20"
            x2="480"
            y2="20"
            stroke="#e4e4e7"
            strokeDasharray="3 3"
            className="dark:stroke-zinc-800"
          />
          <line
            x1="40"
            y1="70"
            x2="480"
            y2="70"
            stroke="#e4e4e7"
            strokeDasharray="3 3"
            className="dark:stroke-zinc-800"
          />
          <line
            x1="40"
            y1="120"
            x2="480"
            y2="120"
            stroke="#e4e4e7"
            strokeDasharray="3 3"
            className="dark:stroke-zinc-800"
          />
          <line
            x1="40"
            y1="170"
            x2="480"
            y2="170"
            stroke="#e4e4e7"
            strokeDasharray="3 3"
            className="dark:stroke-zinc-800"
          />
          <line
            x1="40"
            y1="220"
            x2="480"
            y2="220"
            stroke="#e4e4e7"
            strokeDasharray="3 3"
            className="dark:stroke-zinc-800"
          />

          {/* Axes */}
          <line
            x1="40"
            y1="10"
            x2="40"
            y2="240"
            stroke="#a1a1aa"
            className="dark:stroke-zinc-700"
          />
          <line
            x1="30"
            y1="240"
            x2="490"
            y2="240"
            stroke="#a1a1aa"
            className="dark:stroke-zinc-700"
          />

          {/* Axis Labels */}
          {/* Y-Axis (Logarithmic scale simulation of parameters) */}
          <text x="35" y="24" textAnchor="end" fontSize="8" fill="#71717a" className="font-mono">
            600B+
          </text>
          <text x="35" y="74" textAnchor="end" fontSize="8" fill="#71717a" className="font-mono">
            150B
          </text>
          <text x="35" y="124" textAnchor="end" fontSize="8" fill="#71717a" className="font-mono">
            70B
          </text>
          <text x="35" y="174" textAnchor="end" fontSize="8" fill="#71717a" className="font-mono">
            20B
          </text>
          <text x="35" y="224" textAnchor="end" fontSize="8" fill="#71717a" className="font-mono">
            3B
          </text>
          <text
            x="15"
            y="130"
            transform="rotate(-90,15,130)"
            textAnchor="middle"
            fontSize="9"
            fontWeight="bold"
            fill="#52525b"
            className="dark:fill-zinc-400"
          >
            Parameter Sizing Scale
          </text>

          {/* X-Axis (Context log scale) */}
          <text
            x="90"
            y="252"
            textAnchor="middle"
            fontSize="8"
            fill="#71717a"
            className="font-mono"
          >
            8k
          </text>
          <text
            x="180"
            y="252"
            textAnchor="middle"
            fontSize="8"
            fill="#71717a"
            className="font-mono"
          >
            32k
          </text>
          <text
            x="310"
            y="252"
            textAnchor="middle"
            fontSize="8"
            fill="#71717a"
            className="font-mono"
          >
            128k
          </text>
          <text
            x="440"
            y="252"
            textAnchor="middle"
            fontSize="8"
            fill="#71717a"
            className="font-mono"
          >
            1M (Native)
          </text>
          <text
            x="260"
            y="270"
            textAnchor="middle"
            fontSize="9"
            fontWeight="bold"
            fill="#52525b"
            className="dark:fill-zinc-400"
          >
            Context Window length
          </text>

          {/* Scatter dots */}
          {points.map((pt) => {
            const svgX = 40 + (pt.x / 100) * 440
            const svgY = 20 + (pt.y / 100) * 220
            const isHovered = hoveredPoint?.name === pt.name

            return (
              <g key={pt.name} className="cursor-pointer">
                {/* Glow ring */}
                <circle
                  cx={svgX}
                  cy={svgY}
                  r={isHovered ? 12 : 7}
                  fill={pt.color}
                  opacity={isHovered ? 0.35 : 0.15}
                  className="transition-all duration-300 ease-out"
                />
                {/* Core dot */}
                <circle
                  cx={svgX}
                  cy={svgY}
                  r={isHovered ? 6 : 4}
                  fill={pt.color}
                  stroke="#ffffff"
                  strokeWidth={1}
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  className="transition-all duration-300 ease-out"
                />
                {/* Label text next to dot (only show if not hovered, to prevent overlap) */}
                {!isHovered && (
                  <text
                    x={svgX + 8}
                    y={svgY + 3}
                    fontSize="7"
                    fill="#3f3f46"
                    fontWeight="600"
                    className="pointer-events-none select-none dark:fill-zinc-300"
                  >
                    {pt.name}
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        {/* Dynamic Tooltip UI Overlay */}
        {hoveredPoint && (
          <div
            className="border-gray-150 absolute z-20 rounded-lg border bg-white p-3.5 shadow-lg dark:border-zinc-800 dark:bg-zinc-900/95"
            style={{
              left: `${hoveredPoint.x - 5 > 65 ? hoveredPoint.x - 30 : hoveredPoint.x + 3}%`,
              top: `${hoveredPoint.y - 5 > 50 ? hoveredPoint.y - 30 : hoveredPoint.y + 5}%`,
            }}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
              {hoveredPoint.dev}
            </div>
            <div className="text-sm font-extrabold text-gray-900 dark:text-zinc-100">
              {hoveredPoint.name}
            </div>
            <div className="mt-2.5 space-y-1 text-xs">
              <div className="flex justify-between gap-6">
                <span className="text-gray-500 dark:text-zinc-400">Parameters:</span>
                <span className="font-extrabold text-gray-800 dark:text-zinc-200">
                  {hoveredPoint.params}
                </span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-gray-500 dark:text-zinc-400">Context Limit:</span>
                <span className="font-extrabold text-gray-800 dark:text-zinc-200">
                  {hoveredPoint.context}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
