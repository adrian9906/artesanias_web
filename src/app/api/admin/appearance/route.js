import { jsonError, jsonOk } from "@/lib/cms/store"
import { getThemePresentation, updateThemeSettings } from "@/lib/theme/settings"

export const dynamic = "force-dynamic"

export async function GET() {
  const data = await getThemePresentation()
  return jsonOk(data)
}

export async function POST(request) {
  const body = await request.json().catch(() => null)

  if (!body || typeof body !== "object") {
    return jsonError("No fue posible leer la configuración de apariencia.")
  }

  const settings = await updateThemeSettings(body)
  const data = await getThemePresentation()

  return jsonOk({
    ok: true,
    message:
      settings.mode === "custom"
        ? "Paleta personalizada guardada correctamente."
        : "Paleta predefinida aplicada correctamente.",
    ...data,
  })
}
