"use client"

import { DoorOpen, Footprints, MessageCircle, Shapes } from "lucide-react"
import { useEffect, useState } from "react"
import { Card, EmptyState, StatusBadge } from "@/components/admin/ui"
import { api } from "@/lib/cms/client"
import { cn } from "@/lib/utils"

const RANGES = [
  { days: 7, label: "7 días" },
  { days: 14, label: "14 días" },
  { days: 30, label: "30 días" },
]

const nf = new Intl.NumberFormat("es-ES")

function formatNumber(value) {
  return nf.format(Number(value) || 0)
}

function percentage(part, total) {
  if (!total) return 0
  return Math.round((part / total) * 100)
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "Recién"
  if (minutes < 60) return `Hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Hace ${hours} h`
  const days = Math.floor(hours / 24)
  if (days === 1) return "Ayer"
  return `Hace ${days} días`
}

function DeltaBadge({ value }) {
  if (value === null || value === undefined) {
    return <span className="text-[11px] text-cream/35">sin periodo previo</span>
  }
  const tone = value > 0 ? "text-emerald-300 bg-emerald-500/10" : value < 0 ? "text-rose-300 bg-rose-500/10" : "text-cream/50 bg-white/5"
  const arrow = value > 0 ? "▲" : value < 0 ? "▼" : "•"
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", tone)}>
      {arrow} {Math.abs(value)}%
    </span>
  )
}

function KpiCard({ icon: Icon, label, value, hint, delta, accent }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-cream/40">{label}</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-cream">{formatNumber(value)}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-cream/45">{hint}</span>
            <DeltaBadge value={delta} />
          </div>
        </div>
        <div className={cn("rounded-xl p-2.5", accent || "bg-gold-accent/10 text-gold-light")}>
          <Icon className="size-5" />
        </div>
      </div>
    </Card>
  )
}

function VisitsChart({ series }) {
  const width = 680
  const height = 216
  const pad = { left: 30, right: 10, top: 12, bottom: 28 }
  const maxValue = Math.max(4, ...series.map((day) => day.pageviews))
  const innerWidth = width - pad.left - pad.right
  const innerHeight = height - pad.top - pad.bottom
  const x = (index) => pad.left + (index / Math.max(1, series.length - 1)) * innerWidth
  const y = (value) => pad.top + innerHeight - (value / maxValue) * innerHeight

  const linePath = series
    .map((day, index) => `${index === 0 ? "M" : "L"} ${x(index).toFixed(1)} ${y(day.pageviews).toFixed(1)}`)
    .join(" ")
  const areaPath =
    `${linePath} L ${x(series.length - 1).toFixed(1)} ${(pad.top + innerHeight).toFixed(1)} L ${pad.left} ${(pad.top + innerHeight).toFixed(1)} Z`
  const uniquePath = series
    .map((day, index) => `${index === 0 ? "M" : "L"} ${x(index).toFixed(1)} ${y(day.uniqueVisits).toFixed(1)}`)
    .join(" ")

  const gridLines = [0, 0.5, 1]
  const labelStep = Math.ceil(series.length / 6)

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label="Visitas al taller por día"
    >
      <defs>
        <linearGradient id="visitsArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d9b45b" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#d9b45b" stopOpacity="0" />
        </linearGradient>
      </defs>

      {gridLines.map((ratio) => {
        const yPos = pad.top + innerHeight - ratio * innerHeight
        const value = Math.round(maxValue * ratio)
        return (
          <g key={ratio}>
            <line x1={pad.left} x2={width - pad.right} y1={yPos} y2={yPos} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x={pad.left - 8} y={yPos + 3} textAnchor="end" fontSize="10" fill="rgba(235,225,190,0.35)">
              {value}
            </text>
          </g>
        )
      })}

      <path d={areaPath} fill="url(#visitsArea)" />
      <path d={linePath} fill="none" stroke="rgba(235,225,190,0.5)" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d={uniquePath} fill="none" stroke="#e0c06a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {series.map((day, index) => {
        if (index % labelStep !== 0 && index !== series.length - 1) return null
        return (
          <text key={day.date} x={x(index)} y={height - 8} textAnchor="middle" fontSize="10" fill="rgba(235,225,190,0.4)">
            {day.label}
          </text>
        )
      })}

      {series.length > 0 && (
        <circle cx={x(series.length - 1)} cy={y(series[series.length - 1].uniqueVisits)} r="3.5" fill="#e0c06a" />
      )}
    </svg>
  )
}

function ConversationsChart({ series }) {
  const width = 320
  const height = 200
  const pad = { left: 8, right: 8, top: 18, bottom: 26 }
  const maxValue = Math.max(1, ...series.map((day) => day.clicks))
  const innerHeight = height - pad.top - pad.bottom
  const slot = (width - pad.left - pad.right) / series.length
  const barWidth = Math.min(18, slot * 0.55)
  const labelStep = Math.ceil(series.length / 4)

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label="Conversaciones iniciadas por WhatsApp por día"
    >
      {series.map((day, index) => {
        const barHeight = Math.max(day.clicks === 0 ? 2 : 3, (day.clicks / maxValue) * innerHeight)
        const cx = pad.left + slot * index + slot / 2
        const isCurrent = index === series.length - 1
        return (
          <g key={day.date}>
            <rect
              x={cx - barWidth / 2}
              y={pad.top + innerHeight - barHeight}
              width={barWidth}
              height={barHeight}
              rx="4"
              fill={isCurrent ? "#e0c06a" : "rgba(224,192,106,0.35)"}
            />
            {index % labelStep === 0 && (
              <text x={cx} y={height - 8} textAnchor="middle" fontSize="9" fill="rgba(235,225,190,0.4)">
                {day.label}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function pageTitle(path) {
  if (!path || path === "/") return "Portada"
  const cleaned = path.replace(/^\//, "").replace(/\/$/, "")
  const segments = cleaned.split("/")
  const last = segments[segments.length - 1] || cleaned
  const readable = last.replace(/[-_]+/g, " ")
  if (segments.length > 1) return `${readable} · ${segments[0] === "blog" ? "blog" : segments[0]}`
  if (!readable) return "Portada"
  return readable.charAt(0).toUpperCase() + readable.slice(1)
}

export default function EstadisticasPage() {
  const [range, setRange] = useState(30)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let alive = true
    api(`/api/admin/analytics?range=${range}`)
      .then((result) => {
        if (alive) setData(result)
      })
      .catch((err) => {
        if (alive) setError(err.message)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [range])

  if (loading && !data) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-cream/50">Leyendo el movimiento del taller…</p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        title="No se pudieron leer las estadísticas"
        description={error}
        action={
          <button
            type="button"
            onClick={() => setRange((value) => value)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-cream/80 transition hover:bg-white/10"
          >
            Reintentar
          </button>
        }
      />
    )
  }

  if (!data) return null

  const today = data.series[data.series.length - 1]
  const totalClicks = data.totals.whatsappClicks
  const hasData = data.totals.pageviews > 0 || data.totals.whatsappClicks > 0
  const maxProductClicks = Math.max(1, ...data.topProducts.map((entry) => entry.count))

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-medium text-cream">Estadísticas</h2>
          <p className="mt-1 max-w-2xl text-sm text-cream/55">
            El movimiento del taller: quién entra, qué piezas despiertan interés y desde dónde llegan.
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
          {RANGES.map((option) => (
            <button
              key={option.days}
              type="button"
              onClick={() => setRange(option.days)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                range === option.days
                  ? "bg-gold-accent/15 text-gold-light ring-1 ring-gold-accent/30"
                  : "text-cream/55 hover:text-cream",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {!hasData ? (
        <EmptyState
          title="El taller todavía no tiene movimiento registrado"
          description="Desde que se publica esta versión, el sitio contabiliza cada visita y cada conversación iniciada por WhatsApp. Los números aparecerán aquí automáticamente."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              icon={DoorOpen}
              label="Visitas al taller"
              value={data.totals.pageviews}
              hint={`Hoy: ${formatNumber(today?.pageviews || 0)}`}
              delta={data.deltas.pageviews}
            />
            <KpiCard
              icon={Footprints}
              label="Visitantes únicos"
              value={data.totals.uniqueVisits}
              hint="En el periodo"
              delta={data.deltas.uniqueVisits}
              accent="bg-emerald-500/10 text-emerald-200"
            />
            <KpiCard
              icon={MessageCircle}
              label="Conversaciones abiertas"
              value={data.totals.whatsappClicks}
              hint={`Piezas consultadas: ${formatNumber(data.totals.consultedProducts)}`}
              delta={data.deltas.whatsappClicks}
            />
            <KpiCard
              icon={Shapes}
              label="Piezas consultadas"
              value={data.totals.consultedProducts}
              hint="Vía WhatsApp"
              delta={null}
              accent="bg-gold-accent/15 text-gold-light"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-medium text-cream">El ritmo del taller</h3>
                <div className="flex items-center gap-4 text-[11px] text-cream/45">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-gold-accent" /> Únicos
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-0.5 w-4 rounded bg-cream/50" /> Visitas
                  </span>
                </div>
              </div>
              <VisitsChart series={data.series} />
            </Card>

            <Card>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-medium text-cream">Conversaciones por día</h3>
                <StatusBadge tone="accent">{formatNumber(totalClicks)}</StatusBadge>
              </div>
              {totalClicks === 0 ? (
                <p className="py-10 text-center text-sm text-cream/40">
                  Aún no se abren conversaciones desde el catálogo.
                </p>
              ) : (
                <ConversationsChart series={data.whatsappSeries} />
              )}
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-cream">La vitrina del taller</h3>
                  <p className="mt-0.5 text-xs text-cream/40">
                    Las piezas que más conversaciones han iniciado en el periodo.
                  </p>
                </div>
                <StatusBadge tone="accent">{formatNumber(data.topProducts.length)} piezas</StatusBadge>
              </div>

              {data.topProducts.length === 0 ? (
                <p className="py-10 text-center text-sm text-cream/40">
                  Ninguna pieza ha sido consultada por WhatsApp todavía.
                </p>
              ) : (
                <ol className="space-y-2.5">
                  {data.topProducts.map((entry, index) => {
                    const share = percentage(entry.count, totalClicks)
                    return (
                      <li
                        key={`${entry.productId}-${entry.product}-${index}`}
                        className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5"
                      >
                        <span className="w-7 shrink-0 text-right font-mono text-xs text-gold-light/50">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {entry.photo ? (
                          <img
                            src={entry.photo}
                            alt={entry.name}
                            className="size-12 shrink-0 rounded-lg border border-white/10 bg-forest-dark object-contain"
                          />
                        ) : (
                          <span className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-gold-accent/10 font-display text-lg text-gold-light/70">
                            {entry.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-3">
                            <p className="truncate text-sm text-cream">{entry.name}</p>
                            <p className="shrink-0 text-sm font-semibold tabular-nums text-gold-light">
                              {formatNumber(entry.count)}
                              <span className="ml-1.5 text-[11px] font-normal text-cream/35">{share}%</span>
                            </p>
                          </div>
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-gold-accent/50 to-gold-light transition-all duration-500"
                              style={{ width: `${(entry.count / maxProductClicks) * 100}%` }}
                            />
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              )}
            </Card>

            <div className="space-y-6">
              <Card>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-medium text-cream">Páginas más visitadas</h3>
                  <StatusBadge>{formatNumber(data.topPages.length)}</StatusBadge>
                </div>
                <ul className="space-y-2.5">
                  {data.topPages.length === 0 && (
                    <li className="text-sm text-cream/40">Sin visitas registradas.</li>
                  )}
                  {data.topPages.map((entry, index) => (
                    <li key={`${entry.path}-${index}`} className="flex items-center gap-3">
                      <span className="font-mono text-xs text-cream/30">{String(index + 1).padStart(2, "0")}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-cream/85">{pageTitle(entry.path)}</p>
                        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-gold-accent/40"
                            style={{ width: `${Math.max(8, (entry.count / Math.max(1, data.topPages[0].count)) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className="shrink-0 text-sm tabular-nums text-cream/60">{formatNumber(entry.count)}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card>
                <div className="mb-4">
                  <h3 className="text-base font-medium text-cream">De dónde llegan</h3>
                  <p className="mt-0.5 text-xs text-cream/40">Origen de las visitas en el periodo.</p>
                </div>
                {data.topReferrers.length === 0 ? (
                  <p className="text-sm text-cream/40">Aún sin datos de origen.</p>
                ) : (
                  <ul className="space-y-2.5">
                    {data.topReferrers.map((entry) => (
                      <li key={entry.referrer} className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm text-cream/85">{entry.referrer}</span>
                        <span className="shrink-0 text-sm tabular-nums text-cream/60">{formatNumber(entry.count)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>
          </div>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-medium text-cream">Actividad reciente</h3>
              <StatusBadge tone="accent">últimos eventos</StatusBadge>
            </div>
            <ul className="grid gap-2 md:grid-cols-2">
              {data.recent.map((event, index) => (
                <li
                  key={`${event.createdAt}-${index}`}
                  className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5"
                >
                  {event.kind === "whatsapp" ? (
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-gold-accent/15 text-gold-light">
                      <MessageCircle className="size-3.5" />
                    </span>
                  ) : (
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-cream/50">
                      <DoorOpen className="size-3.5" />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-cream">
                      {event.kind === "whatsapp" ? (event.product || "Pieza sin nombre") : pageTitle(event.path)}
                    </p>
                    <p className="text-[11px] text-cream/40">
                      {event.kind === "whatsapp" ? "Conversación iniciada" : "Visita"} · {timeAgo(event.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </div>
  )
}