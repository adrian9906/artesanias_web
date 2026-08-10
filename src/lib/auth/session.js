import { Buffer } from "node:buffer"
import { scryptSync, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"
import {
  ADMIN_SESSION_COOKIE,
  SESSION_MAX_AGE,
  createAdminSessionToken,
  getAuthConfigStatus,
  verifyAdminSessionToken,
} from "@/lib/auth/core"

const env = globalThis.process?.env || {}

function getAdminUsername() {
  return String(env.ADMIN_USERNAME || "").trim()
}

function getAdminPassword() {
  return String(env.ADMIN_PASSWORD || "")
}

function getAdminPasswordHash() {
  return String(env.ADMIN_PASSWORD_HASH || "").trim()
}

function safeEqualText(a, b) {
  const left = Buffer.from(String(a))
  const right = Buffer.from(String(b))
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

function verifyPassword(password) {
  const hash = getAdminPasswordHash()

  if (hash) {
    const [algorithm, salt, storedHash] = hash.split("$")
    if (algorithm !== "scrypt" || !salt || !storedHash) return false

    const derived = scryptSync(password, salt, 64).toString("base64url")
    return safeEqualText(derived, storedHash)
  }

  const plainPassword = getAdminPassword()
  if (!plainPassword) return false
  return safeEqualText(password, plainPassword)
}

export async function getAdminSession() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value
  return verifyAdminSessionToken(token)
}

export async function setAdminSessionCookie() {
  const cookieStore = await cookies()
  const expires = new Date(Date.now() + SESSION_MAX_AGE * 1000)

  cookieStore.set(ADMIN_SESSION_COOKIE, await createAdminSessionToken(), {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
    maxAge: SESSION_MAX_AGE,
  })
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
}

export function validateAdminCredentials(username, password) {
  const config = getAuthConfigStatus()
  if (!config.ok) {
    return { ok: false, error: `Faltan variables de entorno: ${config.missing.join(", ")}` }
  }

  const userOk = safeEqualText(String(username || "").trim(), getAdminUsername())
  const passwordOk = verifyPassword(String(password || ""))

  if (!userOk || !passwordOk) {
    return { ok: false, error: "Credenciales invalidas." }
  }

  return { ok: true }
}
