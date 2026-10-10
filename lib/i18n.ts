export type Locale = "fr" | "en"

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
]

const fr = {
  htmlLang: "fr",
  nav: {
    projects: "Projets",
    about: "À propos",
    skills: "Compétences",
    contact: "Me contacter",
    menu: "Menu",
    close: "Fermer",
  },
  hero: {
    badge: "Ouvert au stage — Janvier 2027",
    role: "Développeur web full-stack",
    location: "Antsirabe · Remote",
    intro:
      "Curieux par nature, je transforme des idées en expériences simples, utiles et concrètes — du front-end aux données.",
    cta: "Explorer mon travail",
    scroll: "Scroll to explore",
  },
  availability: {
    label: "Disponibilité",
    title1: "Prêt à rejoindre",
    title2: "une belle équipe.",
    priority: "Priorité",
    alternative: "Alternative",
    card1Title: "Stage 6 mois",
    card1Text:
      "Un stage de 6 mois : à distance de janvier à mars, disponible le soir et les week-ends, puis en présentiel ou full remote à partir d'avril.",
    card1Span1: "Jan — Juin 2027",
    card1Span2: "Remote puis présentiel / remote",
    card2Title: "Stage 3 mois",
    card2Text:
      "Un stage à temps plein de 3 mois, en hybride ou full remote, pour contribuer pleinement à vos projets.",
    card2Span1: "Avr — Juin 2027",
    card2Span2: "Hybride / Full remote · Temps plein",
  },
  about: {
    label: "À propos",
    title1: "Je cherche le point de rencontre entre",
    highlight: "beauté",
    title2: "et utilité.",
    paragraph1:
      "Étudiant en informatique à l'université ASJA Antsirabe, passionné par le développement, je mets mes compétences en programmation au service de projets concrets tout en continuant à développer mon expertise technique.",
    paragraph2:
      "Participation au hackathon en interne au sein de l'Université ASJA Antsirabe dans laquelle mon rôle est le développeur back-end en avril 2026.",
    traits: ["Curieux", "Rigoureux", "Collectif"],
  },
  projects: {
    label: "Sélection",
    title1: "Projets",
    title2: "récents.",
    count: "(03)",
    source: "Code source",
    imageAlt: "Aperçu du projet",
    items: [
      {
        title: "Portfolio personnel",
        type: "Site vitrine · 3D interactif",
        description:
          "Ce portfolio : un site single-page à l'identité éditoriale soignée, avec une sculpture 3D interactive en React Three Fiber, des animations de scroll fluides et une typographie serif/mono. Développé en Next.js, TypeScript et Tailwind CSS.",
      },
      {
        title: "Stafflow",
        type: "Application mobile · Local-First",
        description:
          "Application mobile collaborative de gestion du personnel : suivi des soldes, demandes de retrait, calcul automatisé des paies et pointage par QR code. Architecture déconnectée (Local-First) avec synchronisation des données.",
      },
      {
        title: "MadaCareAi",
        type: "Application web · Projet académique",
        description:
          "Système intelligent de triage médical analysant les symptômes pour évaluer la gravité des patients, orienter vers les centres adaptés et optimiser la gestion des urgences et des ambulances.",
      },
    ],
  },
  skills: {
    label: "Savoir-faire",
    title1: "Des outils",
    title2: "pour donner forme.",
    categories: {
      front: "Front-end",
      back: "Back-end & données",
      ops: "Outils & méthodes",
    },
  },
  education: {
    label: "Formation",
    ongoing: "2024 — En cours",
    licence: "Licence en informatique",
    university: "Université ASJA · Antsirabe",
    year2024: "2024",
    bac: "Baccalauréat",
    highschool: "Lycée privée Sainte Thérèse · Mahazoarivo, Antsirabe",
  },
  contact: {
    label: "Contact",
    title1: "Construisons",
    title2: "quelque chose.",
    linkedin: "LinkedIn",
    github: "GitHub",
    email: "Email",
  },
  footer: {
    rights: "Fenitra Mickaya © 2027",
    top: "Retour en haut ↑",
  },
}

export type Dict = typeof fr

const en: Dict = {
  htmlLang: "en",
  nav: {
    projects: "Projects",
    about: "About",
    skills: "Skills",
    contact: "Contact me",
    menu: "Menu",
    close: "Close",
  },
  hero: {
    badge: "Open to internship — January 2027",
    role: "Full-stack web developer",
    location: "Antsirabe · Remote",
    intro:
      "Curious by nature, I turn ideas into simple, useful and concrete experiences — from front-end to data.",
    cta: "Explore my work",
    scroll: "Scroll to explore",
  },
  availability: {
    label: "Availability",
    title1: "Ready to join",
    title2: "a great team.",
    priority: "Priority",
    alternative: "Alternative",
    card1Title: "6-month internship",
    card1Text:
      "A 6-month internship: remote from January to March, available in the evenings and on weekends, then on-site or fully remote from April.",
    card1Span1: "Jan — Jun 2027",
    card1Span2: "Remote, then on-site / remote",
    card2Title: "3-month internship",
    card2Text:
      "A full-time 3-month internship, hybrid or fully remote, to contribute fully to your projects.",
    card2Span1: "Apr — Jun 2027",
    card2Span2: "Hybrid / Fully remote · Full-time",
  },
  about: {
    label: "About",
    title1: "I'm looking for the meeting point between",
    highlight: "beauty",
    title2: "and usefulness.",
    paragraph1:
      "Computer science student at ASJA University in Antsirabe, passionate about development, I put my programming skills at the service of concrete projects while continuing to build my technical expertise.",
    paragraph2:
      "Took part in the internal hackathon at ASJA University in April 2026, where I worked as the back-end developer.",
    traits: ["Curious", "Rigorous", "Team player"],
  },
  projects: {
    label: "Selection",
    title1: "Recent",
    title2: "projects.",
    count: "(03)",
    source: "Source code",
    imageAlt: "Project preview",
    items: [
      {
        title: "Personal portfolio",
        type: "Showcase site · Interactive 3D",
        description:
          "This portfolio: a single-page site with a careful editorial identity, an interactive 3D sculpture built with React Three Fiber, smooth scroll animations and a serif/mono typography. Built with Next.js, TypeScript and Tailwind CSS.",
      },
      {
        title: "Stafflow",
        type: "Mobile app · Local-First",
        description:
          "Collaborative mobile app for HR management: balance tracking, withdrawal requests, automated payroll calculation and QR code attendance. Offline architecture (Local-First) with data synchronization.",
      },
      {
        title: "MadaCareAi",
        type: "Web app · Academic project",
        description:
          "Smart medical triage system analyzing symptoms to assess patient severity, route them to the right centers and optimize emergency and ambulance management.",
      },
    ],
  },
  skills: {
    label: "Expertise",
    title1: "Tools",
    title2: "to give shape.",
    categories: {
      front: "Front-end",
      back: "Back-end & data",
      ops: "Tools & methods",
    },
  },
  education: {
    label: "Education",
    ongoing: "2024 — Present",
    licence: "Bachelor's degree in Computer Science",
    university: "ASJA University · Antsirabe",
    year2024: "2024",
    bac: "High school diploma",
    highschool: "Sainte Thérèse private high school · Mahazoarivo, Antsirabe",
  },
  contact: {
    label: "Contact",
    title1: "Let's build",
    title2: "something.",
    linkedin: "LinkedIn",
    github: "GitHub",
    email: "Email",
  },
  footer: {
    rights: "Fenitra Mickaya © 2027",
    top: "Back to top ↑",
  },
}

export const dict: Record<Locale, Dict> = { fr, en }

export function isLocale(value: unknown): value is Locale {
  return value === "fr" || value === "en"
}
