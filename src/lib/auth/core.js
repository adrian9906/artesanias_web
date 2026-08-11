export const ADMIN_SESSION_COOKIE = "thayart_admin_session"

export const SESSION_MAX_AGE = 60 * 60 * 12

const env = globalThis.process?.env || {}
const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

function encodeBase64Url(value) {
  const bytes = textEncoder.encode(value)
  let binary = ""

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return textDecoder.decode(bytes)
}

function getAuthSecret() {
  return String(env.AUTH_SECRET || "").trim()
}

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
  const left = textEncoder.encode(String(a))
  const right = textEncoder.encode(String(b))

  if (left.length !== right.length) return false

  let result = 0
  for (let index = 0; index < left.length; index += 1) {
    result |= left[index] ^ right[index]
  }

  return result === 0
}

async function createHmacSignature(value) {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(getAuthSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )

  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(value))
  const bytes = new Uint8Array(signature)
  let binary = ""

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

export function getAuthConfigStatus() {
  const missing = []

  if (!getAuthSecret()) missing.push("AUTH_SECRET")
  if (!getAdminUsername()) missing.push("ADMIN_USERNAME")

  return {
    ok: missing.length === 0,
    missing,
  }
}

export function hasEnvPasswordFallback() {
  return Boolean(getAdminPassword() || getAdminPasswordHash())
}

export async function createAdminSessionToken() {
  const payload = {
    sub: getAdminUsername(),
    role: "admin",
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  }

  const body = encodeBase64Url(JSON.stringify(payload))
  const signature = await createHmacSignature(body)
  return `${body}.${signature}`
}

export async function verifyAdminSessionToken(token) {
  if (!token || !getAuthConfigStatus().ok) return null

  const [body, signature] = String(token).split(".")
  if (!body || !signature) return null

  const expectedSignature = await createHmacSignature(body)
  if (!safeEqualText(signature, expectedSignature)) return null

  try {
    const session = JSON.parse(decodeBase64Url(body))
    if (!session?.sub || session?.role !== "admin") return null
    if (Number(session.exp) <= Date.now()) return null
    return session
  } catch {
    return null
  }
}

export async function getAdminSessionFromRequest(request) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  return verifyAdminSessionToken(token)
}
