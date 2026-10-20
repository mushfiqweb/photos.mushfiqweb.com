import useSWR from 'swr'
import type { SpotifyNowPlayingData } from '~/types/data'
import { fetcher } from '~/utils/misc'

export function useNowPlaying() {
  let { data } = useSWR<SpotifyNowPlayingData>('/api/spotify', fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  })
  return data || { isPlaying: false }
}

