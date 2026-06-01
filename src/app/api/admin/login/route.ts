import { NextRequest, NextResponse } from 'next/server'
import { createToken, COOKIE_NAME }  from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD env var not set.' }, { status: 500 })
  }
  if (password.trim() !== process.env.ADMIN_PASSWORD.trim()) {
    await new Promise(r => setTimeout(r, 500))
    return NextResponse.json({ error: 'Incorrect passcode.' }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, createToken(), {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path:     '/',
    maxAge:   24 * 60 * 60,
  })
  return res
}
