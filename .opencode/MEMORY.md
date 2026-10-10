# Memoire projet — updatePortfolio2027

## Portfolio (Next.js 16 + Tailwind v4, single-page dans app/page.tsx)
- Le theme actif est `app/globals.css` (`@theme inline`) ; `styles/globals.css` est un doublon mort (defaults shadcn) — ne pas editer pour changer le style (2026-09-13)
- Police display : layout.tsx charge Instrument Serif dans `--font-instrument-serif`, les headings l'utilisent via `font-display` (au lieu de `font-serif` = Georgia) — voir mobile-nav/responsive fixes (2026-09-13)
- `next dev` prend un lock dans `.next/dev/lock` : tuer l'instance precedente avant de relancer (2026-09-13)
- `npm run lint` a ete supprime (2026-09-13) : le script `eslint .` etait mort (eslint non-installe, pas de config) — le controle statique utile est `npx tsc --noEmit`
- Nav mobile : client component `components/landing/mobile-nav.tsx`, overlay via `createPortal(document.body)` pour echapper au `mix-blend-difference` du `<nav>` (2026-09-13)

## Sources des projets du portfolio (captures reelles pour la section Projets)
- Mada-Care (`~/Mada-care`) = "Triage medical intelligent" : Express+React, port 3000, `mada_care.db` SQLite, demo admin `admin@mada-care.mg` / `admin123`, capture publique `/public-triage` (2026-09-13)
- StaffFlow (`~/projects/staffflow`) = "Gestion RH & suivi du personnel" : FastAPI, port 8000, login `admin` / `admin123`, landing + demo statique `/demo` pour captures (2026-09-13)
- Le Flutter de `~/Projets/gestionemp` ne compile plus : erreurs de syntaxe dans `lib/main.dart` (lignes ~1645-1757) a reparer avant build (2026-09-13)