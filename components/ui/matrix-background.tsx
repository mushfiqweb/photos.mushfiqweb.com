'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'
import { useMatrix } from '~/components/ui/matrix-provider'

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { isEnabled, opacity, colorMode, speed, charSet } = useMatrix()
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!isEnabled || opacity === 0) {
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx?.clearRect(0, 0, canvas.width, canvas.height)
      }
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const fontSize = 14
    let columns = Math.floor(width / fontSize)
    let drops: number[] = Array(columns).fill(1)

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * (height / fontSize))
    }

    const getInterval = () => {
      switch (speed) {
        case 'fast':
          return 30
        case 'slow':
          return 85
        case 'normal':
        default:
          return 50
      }
    }

    const interval = getInterval()
    let lastTime = 0
    let hue = 0

    const getChars = () => {
      switch (charSet) {
        case 'binary':
          return '01'.split('')
        case 'kana':
          return 'ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ'.split('')
        case 'kms':
        default:
          return 'KMS TECH KMS MARKETPLACE কেএমএস টেক কেএমএস মার্কেটপ্লেস كي إم إس تيك كي إم إس ماركت بليس'.split('')
      }
    }

    const characters = getChars()

    const draw = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp
      const elapsed = timestamp - lastTime

      if (elapsed >= interval) {
        lastTime = timestamp - (elapsed % interval)

        const isDark = resolvedTheme === 'dark'
        const r = isDark ? 31 : 255
        const g = isDark ? 31 : 255
        const b = isDark ? 31 : 255

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.06)`
        ctx.fillRect(0, 0, width, height)

        ctx.font = `${fontSize}px JetBrains Mono, monospace, sans-serif`

        for (let i = 0; i < drops.length; i++) {
          const x = i * fontSize
          const y = drops[i] * fontSize

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`
          ctx.fillRect(x, y, fontSize, fontSize)

          let charColor = ''
          if (colorMode === 'rainbow') {
            hue += 0.005
            const rr = Math.floor(127 * Math.sin(0.5 * hue + 0) + 128)
            const rg = Math.floor(127 * Math.sin(0.5 * hue + 2) + 128)
            const rb = Math.floor(127 * Math.sin(0.5 * hue + 4) + 128)
            charColor = `rgb(${rr}, ${rg}, ${rb})`
          } else {
            switch (colorMode) {
              case 'green':
                charColor = isDark ? '#10B981' : '#059669'
                break
              case 'indigo':
                charColor = isDark ? '#6366F1' : '#4F46E5'
                break
              case 'blue':
                charColor = isDark ? '#3B82F6' : '#2563EB'
                break
              case 'red':
                charColor = isDark ? '#EF4444' : '#DC2626'
                break
              default:
                charColor = isDark ? '#10B981' : '#059669'
            }
          }

          ctx.fillStyle = charColor
          const text = characters[Math.floor(Math.random() * characters.length)]
          ctx.fillText(text, x, y + fontSize - 2)

          drops[i]++

          if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    animationFrameId = requestAnimationFrame(draw)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      const newColumns = Math.floor(width / fontSize)

      const newDrops = Array(newColumns)
        .fill(1)
        .map((_, idx) => {
          if (idx < drops.length) return drops[idx]
          return Math.floor(Math.random() * (height / fontSize))
        })
      drops = newDrops
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [isEnabled, opacity, colorMode, speed, charSet, resolvedTheme])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[-10] transition-opacity duration-300"
      style={{ opacity: isEnabled ? opacity : 0 }}
    />
  )
}
