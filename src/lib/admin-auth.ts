import { cookies }    from 'next/headers'
import { createHmac, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'kap_admin'
const TTL_MS      = 24 * 60 * 60 * 1000

function sign(payload: string): string {
  return createHmac('sha256', process.env.ADMIN_SESSION_SECRET!)
    .update(payload).digest('hex')
}

export function createToken(): string {
  const expires = (Date.now() + TTL_MS).toString()
  return `${expires}.${sign(expires)}`
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false
  const [expires, sig] = token.split('.')
  if (!expires || !sig) return false
  if (Date.now() > parseInt(expires, 10)) return false
  try {
    return timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(sign(expires), 'hex'))
  } catch { return false }
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies()
  return verifyToken(store.get(COOKIE_NAME)?.value)
}

export { COOKIE_NAME }
