import { promises as fs } from "fs"
import path from "path"

const THEME_SETTINGS_PATH = path.join(globalThis.process.cwd(), "data", "theme-settings.json")

export const THEME_PRESETS = [
  {
    id: "bosque-rosa",
    name: "Bosque rosa",
    description: "La identidad actual de Thay Art, con verde profundo y acento coral.",
    colors: {
      primary: "#476836",
      primarySoft: "#668855",
      secondary: "#f9aca2",
      secondarySoft: "#ffd5cf",
      accentSoft: "#c8e49d",
      background: "#1b2918",
      surface: "#263b22",
      text: "#fff9f4",
      cursor: "#f9aca2",
    },
  },
  {
    id: "oceano-arcilla",
    name: "Oceano y arcilla",
    description: "Un balance entre azul petroleo, arena y detalles de terracota.",
    colors: {
      primary: "#265c63",
      primarySoft: "#4f8790",
      secondary: "#ef8f6b",
      secondarySoft: "#ffd3c3",
      accentSoft: "#c7dfd6",
      background: "#10282d",
      surface: "#18383f",
      text: "#f6f3eb",
      cursor: "#ef8f6b",
    },
  },
  {
    id: "oliva-sol",
    name: "Oliva y sol",
    description: "Un look calido con oliva, miel y crema para piezas artesanales.",
    colors: {
      primary: "#5e6c2f",
      primarySoft: "#87974d",
      secondary: "#df9a3c",
      secondarySoft: "#f5d4a4",
      accentSoft: "#dfe8b5",
      background: "#242912",
      surface: "#363d1e",
      text: "#fff8eb",
      cursor: "#df9a3c",
    },
  },
  {
    id: "noche-cobre",
    name: "Noche cobre",
    description: "Una variante más dramática con fondo oscuro y acentos cobrizos.",
    colors: {
      primary: "#3e4f63",
      primarySoft: "#6b8098",
      secondary: "#d1835f",
      secondarySoft: "#f0c0ae",
      accentSoft: "#b8d2c6",
      background: "#171b22",
      surface: "#232b36",
      text: "#f8f4ef",
      cursor: "#d1835f",
    },
  },
]

const DEFAULT_PRESET = THEME_PRESETS[0]

function normalizeHex(value, fallback) {
  const input = String(value || "").trim()
  const match = /^#([0-9a-f]{6})$/i.exec(input)
  return match ? `#${match[1].toLowerCase()}` : fallback
}

function hexToRgb(hex) {
  const value = normalizeHex(hex, "#000000").slice(1)
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  }
}

function rgbToHex({ r, g, b }) {
  const toHex = (channel) => Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, "0")
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function mixColors(left, right, ratio = 0.5) {
  const a = hexToRgb(left)
  const b = hexToRgb(right)
  const weight = Math.max(0, Math.min(1, ratio))
  return rgbToHex({
    r: a.r + (b.r - a.r) * weight,
    g: a.g + (b.g - a.g) * weight,
    b: a.b + (b.b - a.b) * weight,
  })
}

function withAlpha(hex, alpha) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function buildThemeTokens(baseColors) {
  const colors = {
    primary: normalizeHex(baseColors.primary, DEFAULT_PRESET.colors.primary),
    primarySoft: normalizeHex(baseColors.primarySoft, DEFAULT_PRESET.colors.primarySoft),
    secondary: normalizeHex(baseColors.secondary, DEFAULT_PRESET.colors.secondary),
    secondarySoft: normalizeHex(baseColors.secondarySoft, DEFAULT_PRESET.colors.secondarySoft),
    accentSoft: normalizeHex(baseColors.accentSoft, DEFAULT_PRESET.colors.accentSoft),
    background: normalizeHex(baseColors.background, DEFAULT_PRESET.colors.background),
    surface: normalizeHex(baseColors.surface, DEFAULT_PRESET.colors.surface),
    text: normalizeHex(baseColors.text, DEFAULT_PRESET.colors.text),
    cursor: normalizeHex(baseColors.cursor, DEFAULT_PRESET.colors.cursor),
  }

  const surfaceSoft = mixColors(colors.surface, colors.text, 0.08)
  const border = withAlpha(mixColors(colors.primary, colors.text, 0.35), 0.22)
  const input = withAlpha(mixColors(colors.surface, colors.text, 0.2), 0.24)

  return {
    ...colors,
    goldPale: mixColors(colors.secondarySoft, colors.text, 0.45),
    secondaryContainer: mixColors(colors.accentSoft, colors.text, 0.2),
    vine: colors.primary,
    leaf: colors.primarySoft,
    leafLight: mixColors(colors.primarySoft, colors.text, 0.32),
    formAccent: colors.secondary,
    card: surfaceSoft,
    popover: surfaceSoft,
    foreground: colors.text,
    primaryForeground: colors.text,
    secondaryForeground: colors.background,
    muted: colors.accentSoft,
    mutedForeground: colors.primarySoft,
    accent: colors.accentSoft,
    accentForeground: colors.background,
    border,
    input,
    ring: colors.primarySoft,
    chart1: colors.primary,
    chart2: colors.secondary,
    chart3: colors.primarySoft,
    chart4: colors.accentSoft,
    chart5: colors.cursor,
    sidebar: colors.surface,
    sidebarForeground: colors.text,
    sidebarPrimary: colors.secondary,
    sidebarPrimaryForeground: colors.background,
    sidebarAccent: colors.primary,
    sidebarAccentForeground: colors.text,
    sidebarBorder: withAlpha(colors.secondary, 0.24),
    sidebarRing: colors.accentSoft,
    glow: withAlpha(colors.secondary, 0.3),
    heroOverlayStart: withAlpha(colors.background, 0.38),
    heroOverlayEnd: withAlpha(colors.background, 0.94),
    categoryCardBorder: withAlpha(colors.secondary, 0.32),
    categoryCardStart: withAlpha(colors.primary, 0.38),
    categoryCardEnd: withAlpha(colors.background, 0.78),
    categoryCardHoverBorder: withAlpha(colors.secondary, 0.9),
    categoryCardHoverStart: withAlpha(colors.primary, 0.54),
    categoryCardHoverEnd: withAlpha(colors.background, 0.82),
    radialPrimary: withAlpha(colors.accentSoft, 0.12),
    radialSecondary: withAlpha(colors.secondary, 0.1),
  }
}

function getPresetById(id) {
  return THEME_PRESETS.find((preset) => preset.id === id) || DEFAULT_PRESET
}

function sanitizeSettings(input) {
  const mode = input?.mode === "custom" ? "custom" : "preset"
  const presetId = getPresetById(input?.presetId).id
  const sourceColors = mode === "custom" ? { ...DEFAULT_PRESET.colors, ...(input?.colors || {}) } : getPresetById(presetId).colors
  const colors = Object.fromEntries(
    Object.keys(DEFAULT_PRESET.colors).map((key) => [key, normalizeHex(sourceColors[key], DEFAULT_PRESET.colors[key])]),
  )

  return {
    mode,
    presetId,
    colors,
  }
}

async function ensureThemeSettingsFile() {
  try {
    await fs.access(THEME_SETTINGS_PATH)
  } catch {
    await fs.mkdir(path.dirname(THEME_SETTINGS_PATH), { recursive: true })
    await fs.writeFile(
      THEME_SETTINGS_PATH,
      JSON.stringify(sanitizeSettings({ mode: "preset", presetId: DEFAULT_PRESET.id }), null, 2),
      "utf8",
    )
  }
}

export async function readThemeSettings() {
  await ensureThemeSettingsFile()

  try {
    const raw = await fs.readFile(THEME_SETTINGS_PATH, "utf8")
    return sanitizeSettings(JSON.parse(raw))
  } catch {
    const fallback = sanitizeSettings({ mode: "preset", presetId: DEFAULT_PRESET.id })
    await writeThemeSettings(fallback)
    return fallback
  }
}

export async function writeThemeSettings(input) {
  const safeSettings = sanitizeSettings(input)
  await fs.mkdir(path.dirname(THEME_SETTINGS_PATH), { recursive: true })
  await fs.writeFile(THEME_SETTINGS_PATH, JSON.stringify(safeSettings, null, 2), "utf8")
  return safeSettings
}

export async function updateThemeSettings(input) {
  return writeThemeSettings(input)
}

export async function getThemePresentation() {
  const settings = await readThemeSettings()
  const tokens = buildThemeTokens(settings.colors)

  return {
    settings,
    presets: THEME_PRESETS,
    tokens,
  }
}

export function themeTokensToCssVariables(tokens) {
  return {
    "--theme-forest-deep": tokens.background,
    "--theme-forest-dark": tokens.surface,
    "--theme-forest-mid": tokens.primary,
    "--theme-forest-light": tokens.primarySoft,
    "--theme-gold-accent": tokens.secondary,
    "--theme-gold-light": tokens.secondarySoft,
    "--theme-gold-pale": tokens.goldPale,
    "--theme-cream": tokens.text,
    "--theme-secondary-fixed": tokens.accentSoft,
    "--theme-secondary": tokens.primarySoft,
    "--theme-secondary-container": tokens.secondaryContainer,
    "--theme-coral": tokens.cursor,
    "--theme-cursor": tokens.cursor,
    "--theme-forest-vine": tokens.vine,
    "--theme-forest-leaf": tokens.leaf,
    "--theme-forest-leaf-light": tokens.leafLight,
    "--theme-form-accent": tokens.formAccent,
    "--background": tokens.background,
    "--foreground": tokens.foreground,
    "--card": tokens.card,
    "--card-foreground": tokens.foreground,
    "--popover": tokens.popover,
    "--popover-foreground": tokens.foreground,
    "--primary": tokens.primary,
    "--primary-foreground": tokens.primaryForeground,
    "--secondary": tokens.secondary,
    "--secondary-foreground": tokens.secondaryForeground,
    "--muted": tokens.muted,
    "--muted-foreground": tokens.mutedForeground,
    "--accent": tokens.accent,
    "--accent-foreground": tokens.accentForeground,
    "--destructive": tokens.cursor,
    "--border": tokens.border,
    "--input": tokens.input,
    "--ring": tokens.ring,
    "--chart-1": tokens.chart1,
    "--chart-2": tokens.chart2,
    "--chart-3": tokens.chart3,
    "--chart-4": tokens.chart4,
    "--chart-5": tokens.chart5,
    "--sidebar": tokens.sidebar,
    "--sidebar-foreground": tokens.sidebarForeground,
    "--sidebar-primary": tokens.sidebarPrimary,
    "--sidebar-primary-foreground": tokens.sidebarPrimaryForeground,
    "--sidebar-accent": tokens.sidebarAccent,
    "--sidebar-accent-foreground": tokens.sidebarAccentForeground,
    "--sidebar-border": tokens.sidebarBorder,
    "--sidebar-ring": tokens.sidebarRing,
    "--theme-glow": tokens.glow,
    "--theme-hero-overlay-start": tokens.heroOverlayStart,
    "--theme-hero-overlay-end": tokens.heroOverlayEnd,
    "--theme-category-card-border": tokens.categoryCardBorder,
    "--theme-category-card-start": tokens.categoryCardStart,
    "--theme-category-card-end": tokens.categoryCardEnd,
    "--theme-category-card-hover-border": tokens.categoryCardHoverBorder,
    "--theme-category-card-hover-start": tokens.categoryCardHoverStart,
    "--theme-category-card-hover-end": tokens.categoryCardHoverEnd,
    "--theme-radial-primary": tokens.radialPrimary,
    "--theme-radial-secondary": tokens.radialSecondary,
  }
}
