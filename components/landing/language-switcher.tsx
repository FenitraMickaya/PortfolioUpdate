"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Check, ChevronDown, Globe } from "lucide-react"
import { LOCALES } from "@/lib/i18n"
import { useLanguage } from "./language-provider"

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)

  const current = LOCALES.find((item) => item.code === locale) ?? LOCALES[0]

  useEffect(() => setMounted(true), [])

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const menuWidth = 200
    const left = Math.min(
      Math.max(8, rect.right - menuWidth),
      window.innerWidth - menuWidth - 8,
    )
    setPosition({ top: rect.bottom + 8, left })
  }, [open])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (triggerRef.current?.contains(target)) return
      if (menuRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    const onScroll = () => setOpen(false)
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    window.addEventListener("scroll", onScroll, true)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("scroll", onScroll, true)
    }
  }, [open])

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Langue : ${current.label}`}
        className="flex items-center gap-2 rounded-full border border-current px-2.5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors hover:bg-background hover:text-foreground md:px-3"
      >
        <Globe className="h-3.5 w-3.5" aria-hidden />
        <span>{current.code}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      {mounted &&
        open &&
        createPortal(
          <ul
            ref={menuRef}
            role="listbox"
            aria-label="Langue"
            className="fixed z-[80] w-[200px] overflow-hidden border border-border bg-card py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground shadow-lg"
            style={{ top: position.top, left: position.left }}
          >
            {LOCALES.map((item) => {
              const active = item.code === locale
              return (
                <li key={item.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setLocale(item.code)
                      setOpen(false)
                    }}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-primary hover:text-primary-foreground ${
                      active ? "text-primary" : ""
                    }`}
                  >
                    <span aria-hidden className="text-sm leading-none">
                      {item.flag}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {active && <Check className="h-3.5 w-3.5" aria-hidden />}
                  </button>
                </li>
              )
            })}
          </ul>,
          document.body,
        )}
    </div>
  )
}
