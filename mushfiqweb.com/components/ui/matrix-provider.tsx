'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type ColorMode = 'rainbow' | 'green' | 'indigo' | 'blue' | 'red'
export type MatrixSpeed = 'slow' | 'normal' | 'fast'
export type CharSetType = 'kms' | 'binary' | 'kana'

interface MatrixContextType {
  isEnabled: boolean
  setIsEnabled: (val: boolean) => void
  opacity: number
  setOpacity: (val: number) => void
  colorMode: ColorMode
  setColorMode: (val: ColorMode) => void
  speed: MatrixSpeed
  setSpeed: (val: MatrixSpeed) => void
  charSet: CharSetType
  setCharSet: (val: CharSetType) => void
}

const MatrixContext = createContext<MatrixContextType | undefined>(undefined)

export function MatrixProvider({ children }: { children: React.ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(true)
  const [opacity, setOpacity] = useState(0.1)
  const [colorMode, setColorMode] = useState<ColorMode>('rainbow')
  const [speed, setSpeed] = useState<MatrixSpeed>('normal')
  const [charSet, setCharSet] = useState<CharSetType>('kms')
  const [mounted, setMounted] = useState(false)

  // Load from local storage after mount to prevent Next.js hydration issues
  useEffect(() => {
    try {
      const storedEnabled = localStorage.getItem('matrix-enabled')
      if (storedEnabled !== null) setIsEnabled(storedEnabled === 'true')

      const storedOpacity = localStorage.getItem('matrix-opacity')
      if (storedOpacity !== null) setOpacity(parseFloat(storedOpacity))

      const storedColor = localStorage.getItem('matrix-color')
      if (storedColor !== null) setColorMode(storedColor as ColorMode)

      const storedSpeed = localStorage.getItem('matrix-speed')
      if (storedSpeed !== null) setSpeed(storedSpeed as MatrixSpeed)

      const storedCharSet = localStorage.getItem('matrix-charset')
      if (storedCharSet !== null) setCharSet(storedCharSet as CharSetType)
    } catch (e) {
      console.warn('Could not load matrix settings from localStorage', e)
    }
    setMounted(true)
  }, [])

  // Persist settings to local storage when changed
  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem('matrix-enabled', String(isEnabled))
    } catch (e) {}
  }, [isEnabled, mounted])

  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem('matrix-opacity', String(opacity))
    } catch (e) {}
  }, [opacity, mounted])

  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem('matrix-color', colorMode)
    } catch (e) {}
  }, [colorMode, mounted])

  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem('matrix-speed', speed)
    } catch (e) {}
  }, [speed, mounted])

  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem('matrix-charset', charSet)
    } catch (e) {}
  }, [charSet, mounted])

  return (
    <MatrixContext.Provider
      value={{
        isEnabled,
        setIsEnabled,
        opacity: mounted ? opacity : 0.1, // fallback for hydration
        setOpacity,
        colorMode,
        setColorMode,
        speed,
        setSpeed,
        charSet,
        setCharSet,
      }}
    >
      {children}
    </MatrixContext.Provider>
  )
}

export function useMatrix() {
  const context = useContext(MatrixContext)
  if (!context) {
    throw new Error('useMatrix must be used within a MatrixProvider')
  }
  return context
}
