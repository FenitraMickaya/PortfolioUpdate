"use client"

import Image from "next/image"
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PlanetSculpture } from "@/components/landing/planet-sculpture"
import { Reveal, RevealBlock } from "@/components/landing/reveal"
import { ScrollProgress } from "@/components/landing/scroll-progress"
import { MobileNav } from "@/components/landing/mobile-nav"
import { LanguageSwitcher } from "@/components/landing/language-switcher"
import { useLanguage } from "@/components/landing/language-provider"

const skillGroups = [
  {
    key: "front",
    items: ["HTML5", "CSS3", "JavaScript (ES6+)", "React 19", "Next.js 16", "TypeScript 5"],
  },
  {
    key: "back",
    items: ["Node.js", "PHP", "Python", "PostgreSQL", "SQLite"],
  },
  {
    key: "ops",
    items: ["Git & GitHub", "Figma", "Kotlin/Android"],
  },
] as const

type Project = {
  image: string
  featured?: boolean
  imageClass?: string
  frameClass?: string
  tags: string[]
  github: string
}

const projects: Project[] = [
  {
    image: "/images/projet-portfolio.png",
    featured: true,
    tags: ["Next.js", "Three.js", "TypeScript", "Tailwind"],
    github: "https://github.com/FenitraMickaya/PortfolioUpdate",
  },
  {
    image: "/images/projet-staffflow.jpg",
    imageClass: "object-contain",
    frameClass: "aspect-[9/20] bg-white md:aspect-[4/3]",
    tags: ["Kotlin", "Android", "Node.js", "SQLite"],
    github: "https://github.com/FenitraMickaya/StaffFlow",
  },
  {
    image: "/images/projet-triage-medical.png",
    tags: ["React", "TypeScript", "SQL"],
    github: "https://github.com/FenitraMickaya/Mada-care",
  },
]

export default function Home() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground animate-page-in">
      <ScrollProgress />

      <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 mix-blend-difference text-background md:px-10">
        <a href="#top" className="font-mono text-xs uppercase tracking-[0.24em]">
          FM<span className="text-primary">.</span>
        </a>
        <div className="hidden items-center gap-8 font-mono text-[10px] uppercase tracking-[0.18em] md:flex">
          <a href="#projets" className="transition-opacity hover:opacity-60">
            {t.nav.projects}
          </a>
          <a href="#about" className="transition-opacity hover:opacity-60">
            {t.nav.about}
          </a>
          <a href="#skills" className="transition-opacity hover:opacity-60">
            {t.nav.skills}
          </a>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <LanguageSwitcher />
          <MobileNav />
          <a
            href="#contact"
            className="rounded-full border border-current px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors hover:bg-background hover:text-foreground md:px-4 md:py-3"
          >
            {t.nav.contact}
          </a>
        </div>
      </nav>

      <Reveal
        id="top"
        className="relative flex min-h-screen flex-col justify-center px-6 pb-10 pt-28 md:px-10 md:pb-14 lg:justify-end lg:pt-32 hero-drift"
      >
        <div className="relative z-10 grid items-end gap-10 md:grid-cols-[1fr_minmax(0,32%)] md:gap-12">
          <div className="min-w-0">
            <div className="mb-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              {t.hero.badge}
            </div>
            <p className="mb-5 max-w-xl font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {t.hero.role}
              <br />
              {t.hero.location}
            </p>
            <h1 className="max-w-6xl font-display text-[18vw] leading-[0.78] tracking-[-0.07em] md:text-[15vw]">
              Fenitra
              <br />
              <span className="pl-[12vw] text-primary">
                Mickaya<span className="text-foreground">.</span>
              </span>
            </h1>
            <div className="mt-10 flex flex-col justify-between gap-8 border-t border-border pt-5 md:flex-row md:items-end">
              <p className="max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
                {t.hero.intro}
              </p>
              <a
                href="#projets"
                className="group flex items-center gap-3 font-mono text-xs uppercase tracking-[0.15em]"
              >
                {t.hero.cta}
                <ArrowDownRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
              </a>
            </div>
            <div className="mt-12 hidden items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground md:flex">
              <span className="h-10 w-px bg-border" /> {t.hero.scroll}
            </div>
          </div>
          <PlanetSculpture className="pointer-events-none relative z-10 mx-auto mt-8 hidden aspect-square w-full max-w-[240px] justify-self-center sm:max-w-[300px] md:block lg:mt-0 lg:max-w-[420px] lg:justify-self-end" />
        </div>
      </Reveal>

      <Reveal className="border-y border-border bg-card px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                {t.availability.label}
              </p>
              <h2 className="font-display text-4xl tracking-tight md:text-6xl">
                {t.availability.title1}
                <br />
                <em>{t.availability.title2}</em>
              </h2>
            </div>
            <CalendarDays className="hidden h-10 w-10 text-primary md:block" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="group border border-border bg-background p-6 transition-colors hover:border-primary">
              <div className="mb-14 flex items-start justify-between">
                <span className="rounded-full bg-primary px-3 py-1 font-mono text-[10px] uppercase text-primary-foreground">
                  {t.availability.priority}
                </span>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
              <h3 className="mb-2 text-2xl">{t.availability.card1Title}</h3>
              <p className="mb-5 text-muted-foreground">{t.availability.card1Text}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-primary">
                <span>{t.availability.card1Span1}</span>
                <span>{t.availability.card1Span2}</span>
              </div>
            </div>
            <div className="group border border-border p-6 transition-colors hover:border-primary">
              <div className="mb-14 flex items-start justify-between">
                <span className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase">
                  {t.availability.alternative}
                </span>
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-2xl">{t.availability.card2Title}</h3>
              <p className="mb-5 text-muted-foreground">{t.availability.card2Text}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <span>{t.availability.card2Span1}</span>
                <span>{t.availability.card2Span2}</span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal
        id="about"
        className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-[1fr_1.3fr] md:px-10 md:py-36"
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            {t.about.label}
          </p>
          <div className="relative mt-10 aspect-[3/4] overflow-hidden bg-primary/10 md:mt-16">
            <div className="absolute inset-0 animate-float-slow">
              <Image
                src="/images/profil-fenitra.png"
                alt="Portrait de Fenitra Mickaya"
                width={1086}
                height={1448}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </div>
        </div>
        <div className="flex flex-col justify-end">
          <h2 className="max-w-2xl font-display text-5xl leading-none tracking-tight md:text-6xl [text-wrap:balance]">
            {t.about.title1} <span className="text-primary">{t.about.highlight}</span>{" "}
            {t.about.title2}
          </h2>
          <p className="mt-10 max-w-lg text-lg leading-relaxed text-muted-foreground">
            {t.about.paragraph1}
          </p>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            {t.about.paragraph2}
          </p>
          <div className="mt-10 flex gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>{t.about.traits[0]}</span>
            <span>·</span>
            <span>{t.about.traits[1]}</span>
            <span>·</span>
            <span>{t.about.traits[2]}</span>
          </div>
        </div>
      </Reveal>

      <Reveal id="projets" className="bg-card px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex items-end justify-between">
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                {t.projects.label}
              </p>
              <h2 className="font-display text-5xl tracking-tight md:text-7xl">
                {t.projects.title1}
                <br />
                <em>{t.projects.title2}</em>
              </h2>
            </div>
            <span className="font-mono text-xs text-muted-foreground">{t.projects.count}</span>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((project, i) => {
              const copy = t.projects.items[i]
              return (
                <RevealBlock
                  key={copy.title}
                  className={project.featured ? "md:col-span-2" : ""}
                  delay={i * 120}
                  y={36}
                >
                  <article className="group h-full overflow-hidden border border-border">
                    <div className={project.featured ? "grid md:grid-cols-[1.35fr_1fr]" : ""}>
                      <div
                        className={cn(
                          project.featured
                            ? "aspect-[16/8] overflow-hidden bg-muted"
                            : "aspect-[4/3] bg-muted",
                          "frameClass" in project ? project.frameClass : "",
                        )}
                      >
                        <Image
                          src={project.image}
                          alt={`${t.projects.imageAlt} ${copy.title}`}
                          width={1200}
                          height={700}
                          className={cn(
                            "h-full w-full object-cover",
                            "imageClass" in project ? project.imageClass : "",
                          )}
                        />
                      </div>
                      <div className="flex flex-col justify-between p-6 md:p-8">
                        <div>
                          <p className="mb-4 font-mono text-[10px] uppercase tracking-wider text-primary">
                            {copy.type}
                          </p>
                          <h3 className="mb-3 text-3xl">{copy.title}</h3>
                          <p className="max-w-md leading-relaxed text-muted-foreground">
                            {copy.description}
                          </p>
                        </div>
                        <div className="mt-12 flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-primary transition-colors hover:text-primary/70"
                        >
                          <Github className="h-4 w-4" />
                          {t.projects.source}
                        </a>
                      </div>
                    </div>
                  </article>
                </RevealBlock>
              )
            })}
          </div>
        </div>
      </Reveal>

      <Reveal id="skills" className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 md:grid-cols-[0.8fr_1.5fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              {t.skills.label}
            </p>
            <h2 className="mt-10 font-display text-5xl leading-none md:text-[clamp(2.5rem,4.5vw,4.5rem)] [text-wrap:balance]">
              {t.skills.title1}
              <br />
              <em>{t.skills.title2}</em>
            </h2>
          </div>
          <div className="space-y-10">
            {skillGroups.map((group, i) => (
              <RevealBlock key={group.key} delay={i * 100} y={24}>
                <div className="border-t border-border pt-5">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg">{t.skills.categories[group.key]}</h3>
                    <span className="font-mono text-xs text-muted-foreground">
                      {group.items.length.toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="border-y border-border bg-card px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            {t.education.label}
          </p>
          <div className="mt-14 max-w-4xl border-l border-primary pl-6 md:pl-10">
            <div className="relative pb-14">
              <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-primary md:-left-[47px]" />
              <p className="mb-3 font-mono text-xs text-primary">{t.education.ongoing}</p>
              <h3 className="text-2xl md:text-3xl">{t.education.licence}</h3>
              <p className="mt-2 text-muted-foreground">{t.education.university}</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-primary md:-left-[47px]" />
              <p className="mb-3 font-mono text-xs text-muted-foreground">
                {t.education.year2024}
              </p>
              <h3 className="text-2xl md:text-3xl">{t.education.bac}</h3>
              <p className="mt-2 text-muted-foreground">{t.education.highschool}</p>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal id="contact" className="px-6 py-28 md:px-10 md:py-40">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            {t.contact.label}
          </p>
          <h2 className="mt-10 max-w-5xl font-display text-[15vw] leading-[0.95] tracking-[-0.06em] md:text-[11vw] md:leading-[0.98]">
            {t.contact.title1}
            <br />
            <span className="text-primary">{t.contact.title2}</span>
          </h2>
          <div className="mt-14 flex flex-col justify-between gap-8 border-t border-border pt-6 md:flex-row md:items-center">
            <div className="flex min-w-0 flex-col gap-3">
              <a
                href="mailto:fenitramickaya45@gmail.com"
                className="group flex items-center gap-2 overflow-hidden break-all py-1.5 text-xl transition-colors hover:text-primary md:text-2xl"
              >
                fenitramickaya45@gmail.com
                <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </a>
              <a
                href="tel:+261331528646"
                className="group flex items-center gap-2 py-1.5 text-lg text-muted-foreground transition-colors hover:text-primary md:text-xl"
              >
                <Phone className="h-5 w-5" />
                +261 33 15 286 46
              </a>
            </div>
            <div className="flex gap-3">
              <a
                aria-label="LinkedIn"
                href="https://www.linkedin.com/in/fenitra-mickaya-a024a036b"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border p-3.5 transition-colors hover:border-primary hover:text-primary"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                aria-label="GitHub"
                href="https://github.com/FenitraMickaya"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border p-3.5 transition-colors hover:border-primary hover:text-primary"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                aria-label="Email"
                href="mailto:fenitramickaya45@gmail.com"
                className="rounded-full border border-border p-3.5 transition-colors hover:border-primary hover:text-primary"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </Reveal>

      <footer className="flex flex-col justify-between gap-4 border-t border-border px-6 py-6 font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:flex-row md:px-10">
        <span>{t.footer.rights}</span>
        <a href="#top" className="hover:text-foreground">
          {t.footer.top}
        </a>
      </footer>
    </main>
  )
}
