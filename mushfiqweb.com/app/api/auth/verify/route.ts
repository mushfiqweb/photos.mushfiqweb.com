import { NextResponse } from 'next/server'

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(request: Request) {
  try {
    const { passwordHash } = await request.json()

    const serverPassword = process.env.POST_PANEL_PASSWORD
    if (!serverPassword) {
      return NextResponse.json(
        { error: 'Server authentication password not configured.' },
        { status: 500 }
      )
    }

    if (!passwordHash) {
      return NextResponse.json({ error: 'Password hash is required.' }, { status: 400 })
    }

    const hashedServer = await hashPassword(serverPassword)

    if (passwordHash === hashedServer) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
    }
  } catch (e) {
    console.error('Auth verification error:', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
