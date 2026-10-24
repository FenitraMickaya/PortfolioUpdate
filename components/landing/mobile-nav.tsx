"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useLanguage } from "./language-provider"

export function MobileNav() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const NAV = [
    { href: "#about", label: t.nav.about },
    { href: "#experience", label: t.nav.experience },
    { href: "#projets", label: t.nav.projects },
    { href: "#skills", label: t.nav.skills },
  ]

  useEffect(() => setMounted(true), [])

  const close = useCallback(() => {
    const dialog = dialogRef.current
    if (dialog?.open) {
      dialog.close()
    } else {
      setOpen(false)
    }
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current
    if (!dialog) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    if (!dialog.open) dialog.showModal()
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      if (dialog.open) dialog.close()
    }
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        aria-label={t.nav.menu}
        className="rounded-full border border-current px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors hover:bg-background hover:text-foreground md:hidden"
      >
        {t.nav.menu}
      </button>
      {mounted &&
        open &&
        createPortal(
          <dialog
            ref={dialogRef}
            id="mobile-nav-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.mobileNavigation}
            onClose={handleClose}
            className="fixed inset-0 z-[60] m-0 h-dvh w-screen max-h-none max-w-none border-0 bg-background p-0 text-foreground md:hidden"
          >
            <div
              className="flex h-full flex-col items-center justify-center gap-8"
              onClick={(event) => {
                if (event.target === event.currentTarget) close()
              }}
            >
              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                aria-label={t.nav.close}
                className="absolute right-6 top-6 rounded-full border border-border p-3 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors hover:border-primary"
              >
                {t.nav.close}
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
                {t.nav.contact}
              </a>
            </div>
          </dialog>,
          document.body,
        )}
    </>
  )
}