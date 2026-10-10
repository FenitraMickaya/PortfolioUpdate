"use client"

import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"

const NAV = [
  { href: "#projets", label: "Projets" },
  { href: "#about", label: "À propos" },
  { href: "#skills", label: "Compétences" },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, close])

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        aria-label="Menu de navigation"
        className="rounded-full border border-current px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors hover:bg-background hover:text-foreground md:hidden"
      >
        Menu
      </button>
      {mounted &&
        open &&
        createPortal(
          <div
            id="mobile-nav-menu"
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8 bg-background text-foreground md:hidden"
            onClick={close}
          >
            <button
              onClick={close}
              aria-label="Fermer le menu"
              className="absolute right-6 top-6 rounded-full border border-border p-3 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors hover:border-primary"
            >
              Fermer
            </button>
            {NAV.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={close}
                className="font-mono text-xs uppercase tracking-[0.24em] transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={close}
              className="mt-4 rounded-full border border-primary px-6 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Me contacter
            </a>
          </div>,
          document.body,
        )}
    </>
  )
}