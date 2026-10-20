const SPOTIFY_TOKEN_API = `https://accounts.spotify.com/api/token`
const SPOTIFY_NOW_PLAYING_API = `https://api.spotify.com/v1/me/player/currently-playing`

function getSpotifyCredentials() {
  const client_id = process.env.SPOTIFY_CLIENT_ID || ''
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET || ''
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN || ''
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')
  return { client_id, client_secret, refresh_token, basic }
}

async function getAccessToken() {
  const { refresh_token, basic } = getSpotifyCredentials()
  if (!refresh_token || !basic) {
    return { access_token: undefined }
  }

  try {
    let response = await fetch(SPOTIFY_TOKEN_API, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      cache: 'no-store',
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
      }),
    })

    return response.json()
  } catch {
    return { access_token: undefined }
  }
}

export async function getNowPlaying() {
  let tokenData = await getAccessToken()
  let access_token = tokenData?.access_token

  if (!access_token) {
    return null
  }

  let url = new URL(SPOTIFY_NOW_PLAYING_API)
  url.searchParams.append('additional_types', 'track,episode')

  return fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: 'no-store',
  })
}
