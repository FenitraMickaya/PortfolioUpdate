"use client"

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react"
import { createPortal } from "react-dom"
import { Check, ChevronDown, Globe } from "lucide-react"
import { LOCALES, type Locale } from "@/lib/i18n"
import { useLanguage } from "./language-provider"

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [activeIndex, setActiveIndex] = useState(0)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const suppressTriggerClickRef = useRef(false)

  const currentIndex = Math.max(
    0,
    LOCALES.findIndex((item) => item.code === locale),
  )
  const current = LOCALES[currentIndex] ?? LOCALES[0]

  useEffect(() => setMounted(true), [])

  const closeListbox = useCallback((restoreFocus = true) => {
    setOpen(false)
    if (restoreFocus) triggerRef.current?.focus()
  }, [])

  const openListbox = useCallback(() => {
    setActiveIndex(currentIndex)
    setOpen(true)
  }, [currentIndex])

  const selectLocale = useCallback(
    (nextLocale: Locale) => {
      setLocale(nextLocale)
      closeListbox()
    },
    [closeListbox, setLocale],
  )

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
    optionRefs.current[activeIndex]?.focus()
  }, [activeIndex, open])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (triggerRef.current?.contains(target)) return
      if (menuRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeListbox()
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
  }, [closeListbox, open])

  const focusRelativeToTrigger = (direction: 1 | -1) => {
    const trigger = triggerRef.current
    if (!trigger) return

    const focusableElements = Array.from(
      document.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.getClientRects().length > 0)
    const triggerIndex = focusableElements.indexOf(trigger)
    const target = focusableElements[triggerIndex + direction]

    const nextTarget = target ?? trigger
    nextTarget.focus()
  }

  const handleListboxKeyDown = (event: ReactKeyboardEvent<HTMLUListElement>) => {
    let nextIndex: number | undefined

    if (event.key === "ArrowDown") {
      nextIndex = (activeIndex + 1) % LOCALES.length
    } else if (event.key === "ArrowUp") {
      nextIndex = (activeIndex - 1 + LOCALES.length) % LOCALES.length
    } else if (event.key === "Home") {
      nextIndex = 0
    } else if (event.key === "End") {
      nextIndex = LOCALES.length - 1
    } else if (event.key === "Tab") {
      event.preventDefault()
      closeListbox(false)
      focusRelativeToTrigger(event.shiftKey ? -1 : 1)
      return
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      const option = LOCALES[activeIndex]
      if (option) selectLocale(option.code)
      return
    }

    if (nextIndex !== undefined) {
      event.preventDefault()
      setActiveIndex(nextIndex)
    }
  }

  const handleListboxBlur = (event: ReactFocusEvent<HTMLUListElement>) => {
    const nextTarget = event.relatedTarget
    if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onPointerDown={() => {
          if (!open) return
          suppressTriggerClickRef.current = true
          closeListbox()
        }}
        onClick={() => {
          if (suppressTriggerClickRef.current) {
            suppressTriggerClickRef.current = false
            return
          }
          if (open) closeListbox()
          else openListbox()
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="language-listbox"
        aria-label={`${t.language.triggerPrefix} ${current.label}`}
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
            id="language-listbox"
            role="listbox"
            aria-label={t.language.label}
            onBlur={handleListboxBlur}
            onKeyDown={handleListboxKeyDown}
            className="fixed z-[80] w-[200px] overflow-hidden border border-border bg-card py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground shadow-lg"
            style={{ top: position.top, left: position.left }}
          >
            {LOCALES.map((item, index) => {
              const selected = item.code === locale
              return (
                <li key={item.code}>
                  <button
                    ref={(element) => {
                      optionRefs.current[index] = element
                    }}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    tabIndex={activeIndex === index ? 0 : -1}
                    onClick={() => selectLocale(item.code)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-primary hover:text-primary-foreground ${
                      selected ? "text-primary" : ""
                    }`}
                  >
                    <span aria-hidden className="text-sm leading-none">
                      {item.flag}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {selected && <Check className="h-3.5 w-3.5" aria-hidden />}
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
