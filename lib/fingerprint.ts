import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const FINGERPRINT_COOKIE = "anyart_fingerprint"

/** Max age: 1 year */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export async function getOrCreateFingerprint(): Promise<{ fingerprint: string; setCookie: boolean }> {
  const store = await cookies()
  const existing = store.get(FINGERPRINT_COOKIE)?.value
  if (existing) {
    return { fingerprint: existing, setCookie: false }
  }
  const fingerprint = crypto.randomUUID()
  return { fingerprint, setCookie: true }
}

export function applyFingerprintCookie(res: NextResponse, fingerprint: string, setCookie: boolean) {
  if (setCookie) {
    res.cookies.set(FINGERPRINT_COOKIE, fingerprint, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === "production",
    })
  }
}
