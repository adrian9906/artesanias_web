"use client"

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { EDITOR_FONTS, EDITOR_FONT_SIZES } from "@/lib/cms/constants"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function ToolbarButton({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault()
        onClick?.()
      }}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-lg text-cream/70 transition hover:bg-white/10 hover:text-cream",
        active && "bg-gold-accent/20 text-gold-light",
      )}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-white/10" aria-hidden />
}

export default function RichTextEditor({ value, onChange, placeholder = "Escribe el contenido…" }) {
  const ref = useRef(null)
  const lastHtml = useRef("")
  const [fontValue, setFontValue] = useState("")
  const [sizeValue, setSizeValue] = useState("")

  useEffect(() => {
    if (!ref.current) return
    if (value !== lastHtml.current && value !== ref.current.innerHTML) {
      ref.current.innerHTML = value || ""
      lastHtml.current = value || ""
    }
  }, [value])

  function emitChange() {
    if (!ref.current) return
    const html = ref.current.innerHTML
    lastHtml.current = html
    onChange(html)
  }

  function run(command, commandValue = null) {
    ref.current?.focus()
    document.execCommand(command, false, commandValue)
    emitChange()
  }

  function setLink() {
    const url = window.prompt("Pega aquí el enlace:", "https://")
    if (!url) return
    run("createLink", url)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#152314]">
      <div className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-white/[0.03] px-2 py-2">
        <ToolbarButton title="Negrita" onClick={() => run("bold")}>
          <Bold className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Cursiva" onClick={() => run("italic")}>
          <Italic className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Subrayado" onClick={() => run("underline")}>
          <Underline className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Tachado" onClick={() => run("strikeThrough")}>
          <Strikethrough className="size-3.5" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton title="Título 1" onClick={() => run("formatBlock", "h1")}>
          <Heading1 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Título 2" onClick={() => run("formatBlock", "h2")}>
          <Heading2 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Cita" onClick={() => run("formatBlock", "blockquote")}>
          <Quote className="size-3.5" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton title="Lista" onClick={() => run("insertUnorderedList")}>
          <List className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Lista numerada" onClick={() => run("insertOrderedList")}>
          <ListOrdered className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Enlace" onClick={setLink}>
          <Link2 className="size-3.5" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton title="Alinear izquierda" onClick={() => run("justifyLeft")}>
          <AlignLeft className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Centrar" onClick={() => run("justifyCenter")}>
          <AlignCenter className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Alinear derecha" onClick={() => run("justifyRight")}>
          <AlignRight className="size-3.5" />
        </ToolbarButton>

        <Divider />

        <Select
          value={fontValue}
          onValueChange={(v) => {
            if (v) run("fontName", v)
            setFontValue("")
          }}
        >
          <SelectTrigger className="h-8 max-w-[140px]" aria-label="Fuente">
            <SelectValue placeholder="Fuente" />
          </SelectTrigger>
          <SelectContent>
            {EDITOR_FONTS.map((font) => (
              <SelectItem key={font.id} value={font.id}>
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sizeValue}
          onValueChange={(v) => {
            if (v) run("fontSize", v)
            setSizeValue("")
          }}
        >
          <SelectTrigger className="h-8 max-w-[120px]" aria-label="Tamaño">
            <SelectValue placeholder="Tamaño" />
          </SelectTrigger>
          <SelectContent>
            {EDITOR_FONT_SIZES.map((size) => (
              <SelectItem key={size.id} value={size.id}>
                {size.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-1">
          <ToolbarButton title="Deshacer" onClick={() => run("undo")}>
            <Undo2 className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Rehacer" onClick={() => run("redo")}>
            <Redo2 className="size-3.5" />
          </ToolbarButton>
        </div>
      </div>

      <div
        ref={ref}
        role="textbox"
        aria-multiline="true"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emitChange}
        onBlur={emitChange}
        className={cn(
          "cms-editor min-h-[280px] max-h-[520px] overflow-y-auto px-5 py-4 text-sm leading-relaxed text-cream outline-none",
          "[&:empty]:before:pointer-events-none [&:empty]:before:text-cream/30 [&:empty]:before:content-[attr(data-placeholder)]",
          "[&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-semibold",
          "[&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold",
          "[&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5",
          "[&_blockquote]:border-l-2 [&_blockquote]:border-gold-accent/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-cream/70",
          "[&_a]:text-gold-light [&_a]:underline",
        )}
      />
    </div>
  )
}
