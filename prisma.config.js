import "dotenv/config"
import path from "node:path"
import { PrismaPg } from "@prisma/adapter-pg"
import { defineConfig, env } from "prisma/config"

const runtimeProcess = globalThis.process

export default defineConfig({
  experimental: {
    adapter: true,
  },
  engine: "js",
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
  async adapter() {
    return new PrismaPg({
      connectionString: runtimeProcess?.env?.DATABASE_URL,
    })
  },
})
