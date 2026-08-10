import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis
const runtimeProcess = globalThis.process
const connectionString = runtimeProcess?.env?.DATABASE_URL
const adapter = new PrismaPg({ connectionString })

export const prisma =
  globalForPrisma.__artesaniasPrisma ??
  new PrismaClient({
    adapter,
    log: runtimeProcess?.env?.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  })

if (runtimeProcess?.env?.NODE_ENV !== "production") {
  globalForPrisma.__artesaniasPrisma = prisma
}
