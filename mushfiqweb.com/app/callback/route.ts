import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')

  if (error) {
    return new NextResponse(
      renderHtml(`
        <h1 style="color: #ff5555;">❌ Spotify Authorization Error</h1>
        <p style="color: #ccc;">${escapeHtml(error)}</p>
      `),
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  if (!code) {
    return new NextResponse(
      renderHtml(`
        <h1 style="color: #ffaa00;">⚠️ No Authorization Code</h1>
        <p style="color: #ccc;">Please initiate authorization via Spotify.</p>
      `),
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID || '7fb54b52020244d0af2e055637895a22'
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || ''

  if (!clientSecret) {
    return new NextResponse(
      renderHtml(`
        <h1 style="color: #ff5555;">❌ Missing Client Secret</h1>
        <p style="color: #ccc;">SPOTIFY_CLIENT_SECRET is missing from your .env file.</p>
      `),
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  // Spotify requires explicit 127.0.0.1 loopback IP instead of localhost
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host
  const proto = request.headers.get('x-forwarded-proto') || 'http'
  const normalizedHost = host.replace(/^localhost(?=[:/]|$)/i, '127.0.0.1')
  const redirectUri = `${proto}://${normalizedHost}${url.pathname}`
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok || !tokenData.refresh_token) {
      return new NextResponse(
        renderHtml(`
          <h1 style="color: #ff5555;">❌ Token Exchange Failed</h1>
          <p style="color: #ccc;"><strong>Error:</strong> ${escapeHtml(tokenData.error || 'Unknown error')}</p>
          <p style="color: #888;">${escapeHtml(tokenData.error_description || '')}</p>
          <p style="color: #aaa; margin-top: 15px;">Make sure your Redirect URI in Spotify Developer Dashboard exactly matches: <code>${escapeHtml(redirectUri)}</code></p>
        `),
        { headers: { 'Content-Type': 'text/html' } }
      )
    }

    const refreshToken = tokenData.refresh_token
    process.env.SPOTIFY_REFRESH_TOKEN = refreshToken

    const envPath = path.join(process.cwd(), '.env')
    let envContent = ''
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8')
    }

    if (/^SPOTIFY_REFRESH_TOKEN=.*$/m.test(envContent)) {
      envContent = envContent.replace(/^SPOTIFY_REFRESH_TOKEN=.*$/m, `SPOTIFY_REFRESH_TOKEN=${refreshToken}`)
    } else {
      envContent += `\nSPOTIFY_REFRESH_TOKEN=${refreshToken}\n`
    }

    fs.writeFileSync(envPath, envContent, 'utf8')

    return new NextResponse(
      renderHtml(`
        <div style="font-size: 54px; margin-bottom: 12px;">🎉</div>
        <h1 style="color: #1DB954; margin: 0 0 10px;">Spotify Connected!</h1>
        <p style="color: #ddd; font-size: 16px; line-height: 1.5;">Your refresh token has been retrieved and saved to <code>.env</code> automatically.</p>
        <div style="margin: 25px 0;">
          <a href="/" style="display: inline-block; padding: 12px 28px; background: #1DB954; color: #000; font-weight: 700; text-decoration: none; border-radius: 9999px; transition: transform 0.2s;">View Homepage</a>
        </div>
      `),
      { headers: { 'Content-Type': 'text/html' } }
    )
  } catch (err: any) {
    return new NextResponse(
      renderHtml(`
        <h1 style="color: #ff5555;">❌ Server Error</h1>
        <p style="color: #ccc;">${escapeHtml(err.message)}</p>
      `),
      { headers: { 'Content-Type': 'text/html' } }
    )
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderHtml(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Spotify Connection Status</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; background:#0a0a0a; color:#fff; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width:480px; width:90%; padding:40px 30px; text-align:center; background:#141414; border:1px solid #282828; border-radius:20px; box-shadow:0 20px 40px rgba(0,0,0,0.5);">
    ${content}
  </div>
</body>
</html>`
}
