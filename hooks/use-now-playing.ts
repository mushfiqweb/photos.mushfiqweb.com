'use client'

import useSWR from 'swr'

export interface SpotifyNowPlayingData {
  isPlaying: boolean
  title?: string
  artist?: string
  album?: string
  albumImageUrl?: string
  songUrl?: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useNowPlaying() {
  const { data } = useSWR<SpotifyNowPlayingData>('/api/spotify', fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true,
  })
  return data || { isPlaying: false }
}
