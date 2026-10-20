import { getNowPlaying } from './spotify'
import type { SpotifyNowPlayingData } from '~/types/data'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
}

export async function GET() {
  try {
    let response = await getNowPlaying()
    if (!response || response.status === 204 || response.status > 400) {
      return Response.json({ isPlaying: false }, { headers: NO_CACHE_HEADERS })
    }

    let data = await response.json()
    if (!data || !data.item) {
      return Response.json({ isPlaying: false }, { headers: NO_CACHE_HEADERS })
    }

    if (data.currently_playing_type === 'episode') {
      return Response.json(
        {
          isPlaying: true,
          title: data.item.name,
          songUrl: data.item.external_urls?.spotify,
        },
        { headers: NO_CACHE_HEADERS }
      )
    }

    let songData: SpotifyNowPlayingData = {
      isPlaying: Boolean(data.is_playing),
      title: data.item.name,
      artist: data.item.artists?.map((art: { name: string }) => art.name).join(', ') || '',
      album: data.item.album?.name || '',
      albumImageUrl: data.item.album?.images?.[0]?.url,
      songUrl: data.item.external_urls?.spotify,
    }

    return Response.json(songData, { headers: NO_CACHE_HEADERS })
  } catch (error) {
    console.error('Error fetching Spotify now playing:', error)
    return Response.json({ isPlaying: false }, { headers: NO_CACHE_HEADERS })
  }
}
