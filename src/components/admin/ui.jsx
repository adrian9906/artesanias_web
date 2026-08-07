import { cn } from "@/lib/utils"

export function Field({ label, children, hint, className }) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      {label && <span className="block text-sm text-cream/70">{label}</span>}
      {children}
      {hint && <span className="block text-xs text-cream/40">{hint}</span>}
    </label>
  )
}

export function TextInput({ className, ...props }) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-cream outline-none placeholder:text-cream/30 focus:border-gold-accent/40",
        className,
      )}
      {...props}
    />
  )
}

export function TextTextarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-cream outline-none placeholder:text-cream/30 focus:border-gold-accent/40",
        className,
      )}
      {...props}
    />
  )
}

export function PrimaryButton({ className, children, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gold-accent px-4 text-sm font-medium text-forest-deep transition hover:bg-gold-light disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ className, children, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-cream/80 transition hover:bg-white/10 disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function DangerButton({ className, children, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-3 text-sm text-red-200 transition hover:bg-red-500/20 disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function Card({ className, children }) {
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-white/[0.03] p-5", className)}>{children}</div>
  )
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-14 text-center">
      <p className="text-base font-medium text-cream">{title}</p>
      {description && <p className="mx-auto mt-2 max-w-md text-sm text-cream/50">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}

export function StatusBadge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-white/10 text-cream/70",
    success: "bg-emerald-500/15 text-emerald-200",
    warn: "bg-amber-500/15 text-amber-200",
    accent: "bg-gold-accent/15 text-gold-light",
  }
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide", tones[tone])}>
      {children}
    </span>
  )
}
