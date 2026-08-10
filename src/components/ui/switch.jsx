"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef(function Switch(
  { checked = false, disabled = false, onCheckedChange, className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      data-state={checked ? "checked" : "unchecked"}
      onClick={() => {
        if (!disabled) onCheckedChange?.(!checked)
      }}
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent bg-white/15 p-0.5 shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-gold-accent/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gold-accent data-[state=unchecked]:bg-white/15",
        className,
      )}
      {...props}
    >
      <span
        data-state={checked ? "checked" : "unchecked"}
        className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      />
    </button>
  )
})

export { Switch }
