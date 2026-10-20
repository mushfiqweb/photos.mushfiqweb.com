'use client'

import { useState } from 'react'
import { Link2, LayoutGrid, CheckCircle } from 'lucide-react'

export default function McpVisualizer() {
  const [topology, setTopology] = useState<'nxm' | 'npm'>('nxm')

  const clients = ['Claude Desktop', 'VS Code', 'Cursor IDE']
  const servers = ['GitHub API', 'Local DB', 'Slack Server', 'File System']

  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-gray-100 pb-4 dark:border-zinc-800 md:flex-row md:items-center">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100">
            Unified Protocol Integration Topology
          </h3>
          <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">
            Toggle between custom direct client integrations and the standardized Model Context
            Protocol
          </p>
        </div>
        <div className="bg-gray-150 flex rounded-lg p-1 dark:bg-zinc-800">
          <button
            onClick={() => setTopology('nxm')}
            className={`rounded-md px-3.5 py-1.5 text-xs font-bold transition-all ${
              topology === 'nxm'
                ? 'bg-white text-primary-600 shadow-sm dark:bg-zinc-700 dark:text-primary-400'
                : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Direct (N x M) Mesh
          </button>
          <button
            onClick={() => setTopology('npm')}
            className={`rounded-md px-3.5 py-1.5 text-xs font-bold transition-all ${
              topology === 'npm'
                ? 'bg-white text-primary-600 shadow-sm dark:bg-zinc-700 dark:text-primary-400'
                : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            MCP Standard (N + M) Star
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Side: SVG Network diagram */}
        <div className="flex items-center justify-center rounded-xl border border-gray-100 bg-gray-50 p-6 dark:border-zinc-800 dark:bg-zinc-950/40 lg:col-span-8">
          <svg viewBox="0 0 400 240" className="h-full w-full max-w-md overflow-visible">
            {/* Draw Mesh lines for N x M */}
            {topology === 'nxm' && (
              <>
                {/* Lines from Claude Desktop */}
                <line
                  x1="50"
                  y1="50"
                  x2="350"
                  y2="40"
                  stroke="#f43f5e"
                  strokeWidth="1.5"
                  opacity="0.45"
                />
                <line
                  x1="50"
                  y1="50"
                  x2="350"
                  y2="100"
                  stroke="#f43f5e"
                  strokeWidth="1.5"
                  opacity="0.45"
                />
                <line
                  x1="50"
                  y1="50"
                  x2="350"
                  y2="160"
                  stroke="#f43f5e"
                  strokeWidth="1.5"
                  opacity="0.45"
                />
                <line
                  x1="50"
                  y1="50"
                  x2="350"
                  y2="220"
                  stroke="#f43f5e"
                  strokeWidth="1.5"
                  opacity="0.45"
                />

                {/* Lines from VS Code */}
                <line
                  x1="50"
                  y1="120"
                  x2="350"
                  y2="40"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  opacity="0.45"
                />
                <line
                  x1="50"
                  y1="120"
                  x2="350"
                  y2="100"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  opacity="0.45"
                />
                <line
                  x1="50"
                  y1="120"
                  x2="350"
                  y2="160"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  opacity="0.45"
                />
                <line
                  x1="50"
                  y1="120"
                  x2="350"
                  y2="220"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  opacity="0.45"
                />

                {/* Lines from Cursor */}
                <line
                  x1="50"
                  y1="190"
                  x2="350"
                  y2="40"
                  stroke="#a855f7"
                  strokeWidth="1.5"
                  opacity="0.45"
                />
                <line
                  x1="50"
                  y1="190"
                  x2="350"
                  y2="100"
                  stroke="#a855f7"
                  strokeWidth="1.5"
                  opacity="0.45"
                />
                <line
                  x1="50"
                  y1="190"
                  x2="350"
                  y2="160"
                  stroke="#a855f7"
                  strokeWidth="1.5"
                  opacity="0.45"
                />
                <line
                  x1="50"
                  y1="190"
                  x2="350"
                  y2="220"
                  stroke="#a855f7"
                  strokeWidth="1.5"
                  opacity="0.45"
                />
              </>
            )}

            {/* Draw Star lines for N + M (MCP Broker) */}
            {topology === 'npm' && (
              <>
                {/* Connections to central MCP core */}
                <line x1="50" y1="50" x2="200" y2="120" stroke="#10b981" strokeWidth="2.5" />
                <line x1="50" y1="120" x2="200" y2="120" stroke="#10b981" strokeWidth="2.5" />
                <line x1="50" y1="190" x2="200" y2="120" stroke="#10b981" strokeWidth="2.5" />

                <line x1="200" y1="120" x2="350" y2="40" stroke="#10b981" strokeWidth="2.5" />
                <line x1="200" y1="120" x2="350" y2="100" stroke="#10b981" strokeWidth="2.5" />
                <line x1="200" y1="120" x2="350" y2="160" stroke="#10b981" strokeWidth="2.5" />
                <line x1="200" y1="120" x2="350" y2="220" stroke="#10b981" strokeWidth="2.5" />

                {/* Central Broker Hub */}
                <circle cx="200" cy="120" r="16" fill="#10b981" />
                <text
                  x="200"
                  y="123"
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="bold"
                  fill="#ffffff"
                >
                  MCP
                </text>
              </>
            )}

            {/* Client Nodes (Left) */}
            <circle cx="50" cy="50" r="12" fill="#71717a" />
            <circle cx="50" cy="120" r="12" fill="#71717a" />
            <circle cx="50" cy="190" r="12" fill="#71717a" />

            <text
              x="44"
              y="28"
              fontSize="7.5"
              fill="#3f3f46"
              fontWeight="bold"
              className="dark:fill-zinc-300"
            >
              Claude
            </text>
            <text
              x="44"
              y="98"
              fontSize="7.5"
              fill="#3f3f46"
              fontWeight="bold"
              className="dark:fill-zinc-300"
            >
              VS Code
            </text>
            <text
              x="44"
              y="168"
              fontSize="7.5"
              fill="#3f3f46"
              fontWeight="bold"
              className="dark:fill-zinc-300"
            >
              Cursor
            </text>

            {/* Tool Servers (Right) */}
            <circle cx="350" cy="40" r="10" fill="#a1a1aa" />
            <circle cx="350" cy="100" r="10" fill="#a1a1aa" />
            <circle cx="350" cy="160" r="10" fill="#a1a1aa" />
            <circle cx="350" cy="220" r="10" fill="#a1a1aa" />

            <text
              x="365"
              y="43"
              fontSize="7"
              fill="#52525b"
              fontWeight="semibold"
              className="dark:fill-zinc-400"
            >
              GitHub
            </text>
            <text
              x="365"
              y="103"
              fontSize="7"
              fill="#52525b"
              fontWeight="semibold"
              className="dark:fill-zinc-400"
            >
              Database
            </text>
            <text
              x="365"
              y="163"
              fontSize="7"
              fill="#52525b"
              fontWeight="semibold"
              className="dark:fill-zinc-400"
            >
              Slack
            </text>
            <text
              x="365"
              y="223"
              fontSize="7"
              fill="#52525b"
              fontWeight="semibold"
              className="dark:fill-zinc-400"
            >
              Files
            </text>

            {/* Title notes */}
            <text x="50" y="12" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#71717a">
              LLM Clients (N)
            </text>
            <text
              x="350"
              y="12"
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="bold"
              fill="#71717a"
            >
              Tool Servers (M)
            </text>
          </svg>
        </div>

        {/* Right Side: Explanatory Card */}
        <div className="flex flex-col justify-between lg:col-span-4">
          {topology === 'nxm' ? (
            <div className="space-y-3.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-500">
                <Link2 className="h-4 w-4" />
                <span>N x M Integration Mesh</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-zinc-400">
                Without a protocol standard, every AI editor/client must build custom drivers for
                every tool server (GitHub APIs, SQLite hooks, Slack webhooks).
              </p>
              <div className="rounded-lg border border-red-100 bg-red-50/50 p-3 dark:border-red-900/30 dark:bg-red-950/10">
                <h5 className="text-[10px] font-bold uppercase tracking-wide text-red-700">
                  The Scale Problem
                </h5>
                <p className="text-red-650 mt-0.5 text-[10px] leading-relaxed dark:text-red-400">
                  Adding 1 new tool server requires updating 3 separate clients. Code logic becomes
                  highly duplicated and fragile.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span>N + M Star Topology</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-zinc-400">
                The Model Context Protocol (MCP) inserts a standardized client-server interface in
                the middle. Tools declare their capabilities via a common protocol.
              </p>
              <div className="rounded-lg border border-green-100 bg-green-50/50 p-3 dark:border-green-900/30 dark:bg-green-950/10">
                <h5 className="text-[10px] font-bold uppercase tracking-wide text-green-700">
                  The Standard Win
                </h5>
                <p className="text-green-650 mt-0.5 text-[10px] leading-relaxed dark:text-green-400">
                  Adding a new tool server requires writing the MCP interface just once. Any
                  compliant client immediately gains full access to it.
                </p>
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-3 text-[10px] font-medium text-gray-400 dark:border-zinc-800 dark:text-zinc-500">
            MCP simplifies tool calling into standard resources, prompts, and tool descriptions.
          </div>
        </div>
      </div>
    </div>
  )
}
