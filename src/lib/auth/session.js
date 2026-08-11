import { Buffer } from "node:buffer"
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"
import {
  ADMIN_SESSION_COOKIE,
  SESSION_MAX_AGE,
  createAdminSessionToken,
  getAuthConfigStatus,
  hasEnvPasswordFallback,
  verifyAdminSessionToken,
} from "@/lib/auth/core"
import { prisma } from "@/lib/prisma"

const env = globalThis.process?.env || {}
const ADMIN_CREDENTIAL_ID = "default"

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

function verifyPasswordHash(password, hash) {
  const [algorithm, salt, storedHash] = String(hash || "").split("$")
  if (algorithm !== "scrypt" || !salt || !storedHash) return false

  const derived = scryptSync(password, salt, 64).toString("base64url")
  return safeEqualText(derived, storedHash)
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("base64url")
  const derived = scryptSync(password, salt, 64).toString("base64url")
  return `scrypt$${salt}$${derived}`
}

async function getDatabaseCredential() {
  try {
    return await prisma.adminCredential.findUnique({
      where: { id: ADMIN_CREDENTIAL_ID },
    })
  } catch {
    return null
  }
}

export async function getAdminSecurityStatus() {
  const credential = await getDatabaseCredential()

  return {
    username: getAdminUsername(),
    storedInDatabase: Boolean(credential?.passwordHash),
    usesEnvFallback: !credential?.passwordHash && hasEnvPasswordFallback(),
  }
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

export async function validateAdminCredentials(username, password) {
  const config = getAuthConfigStatus()
  if (!config.ok) {
    return { ok: false, error: `Faltan variables de entorno: ${config.missing.join(", ")}` }
  }

  const userOk = safeEqualText(String(username || "").trim(), getAdminUsername())
  const credential = await getDatabaseCredential()
  const passwordValue = String(password || "")
  const passwordOk = credential?.passwordHash
    ? verifyPasswordHash(passwordValue, credential.passwordHash)
    : verifyPassword(passwordValue)

  if (!userOk || !passwordOk) {
    return { ok: false, error: "Credenciales invalidas." }
  }

  return { ok: true }
}

export async function updateAdminPassword(currentPassword, nextPassword) {
  const config = getAuthConfigStatus()
  if (!config.ok) {
    return { ok: false, error: `Faltan variables de entorno: ${config.missing.join(", ")}` }
  }

  const current = String(currentPassword || "")
  const next = String(nextPassword || "")

  if (!current || !next) {
    return { ok: false, error: "Debes escribir la contraseña actual y la nueva." }
  }

  if (next.length < 8) {
    return { ok: false, error: "La nueva contraseña debe tener al menos 8 caracteres." }
  }

  const credential = await getDatabaseCredential()
  const currentOk = credential?.passwordHash
    ? verifyPasswordHash(current, credential.passwordHash)
    : verifyPassword(current)

  if (!currentOk) {
    return { ok: false, error: "La contraseña actual no coincide." }
  }

  if (current === next) {
    return { ok: false, error: "La nueva contraseña debe ser diferente a la actual." }
  }

  await prisma.adminCredential.upsert({
    where: { id: ADMIN_CREDENTIAL_ID },
    update: { passwordHash: hashPassword(next) },
    create: {
      id: ADMIN_CREDENTIAL_ID,
      passwordHash: hashPassword(next),
    },
  })

  return { ok: true }
}
