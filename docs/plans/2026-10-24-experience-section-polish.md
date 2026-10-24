# Plan d’implémentation — Section Expérience et polish du portfolio

**Date :** 24 octobre 2026  
**Référence :** `docs/specs/2026-10-24-experience-section-design.md`  
**Stratégie :** TDD, changements séquentiels, vérification navigateur FR/EN.

## Structure des fichiers

- `lib/i18n.ts` : source des textes FR/EN de la navigation, du sélecteur de langue et des deux expériences.
- `app/page.tsx` : structure sémantique de la page, navigation desktop et section Expérience en disposition A.
- `components/landing/mobile-nav.tsx` : navigation mobile accessible et entrée Expérience.
- `components/landing/language-switcher.tsx` : listbox clavier accessible et i18n.
- `components/landing/reveal.tsx` : révélation progressive et mouvement réduit.
- `components/landing/scroll-progress.tsx` : progression de scroll sans rendu React par événement.
- `components/landing/planet-sculpture.tsx` : scène 3D statique sous mouvement réduit et éclairage local.
- `components/landing/desktop-planet-sculpture.tsx` : chargement conditionnel de Three.js sur desktop.
- `next.config.mjs` : validation TypeScript et optimisation des images.
- `package.json` : script `typecheck`.
- `styles/globals.css` : suppression du thème obsolète non importé.

## Tâche 1 — Contrat de contenu FR/EN

**Fichiers :** `tests/portfolio-contract.test.mjs`, `lib/i18n.ts`, `package.json`

1. Écrire un test de contrat qui vérifie :
   - `nav.experience` et les deux titres de section dans les deux langues ;
   - exactement deux expériences ;
   - l’ordre Tynoc Tech puis UN T’ELLE SUCCÈS ;
   - `(02)`, les deux statuts « En cours » ;
   - les cinq technologies Tynoc dont Tailwind CSS ;
   - l’absence d’URL dans les données d’expérience.
2. Exécuter le test et constater son échec attendu.
3. Ajouter les dictionnaires FR/EN.
4. Relancer le test jusqu’à réussite.

## Tâche 2 — Section Expérience et navigation

**Fichiers :** `app/page.tsx`, `components/landing/mobile-nav.tsx`

1. Ajouter l’ancre et les deux cartes empilées dans `app/page.tsx` entre À propos et Projets.
2. Utiliser la structure de carte B : index, statut, contexte, organisation, résumé, technologies, poste et période.
3. Ajouter l’entrée Expérience dans les navigations desktop et mobile.
4. Vérifier qu’aucun lien externe n’est rendu dans la section.
5. Exécuter le test de contrat et le typecheck.

## Tâche 3 — Menu mobile et listbox accessibles

**Fichiers :** `components/landing/mobile-nav.tsx`, `components/landing/language-switcher.tsx`, `lib/i18n.ts`

1. Écrire des scénarios Playwright ciblés pour :
   - l’ouverture du menu mobile, le focus interne, Échap et le retour du focus ;
   - le blocage du scroll de fond ;
   - ArrowDown/ArrowUp/Home/End dans la listbox ;
   - Entrée/Espace pour choisir une langue ;
   - Échap pour fermer et rendre le focus au déclencheur.
2. Constater leur échec initial.
3. Implémenter le dialogue natif mobile et le modèle clavier de listbox.
4. Relancer les scénarios.

## Tâche 4 — Visibilité progressive, mouvement réduit et structure sémantique

**Fichiers :** `components/landing/reveal.tsx`, `components/landing/planet-sculpture.tsx`, `app/page.tsx`, `app/globals.css`

1. Écrire un scénario Playwright JavaScript désactivé confirmant que les sections sont visibles.
2. Écrire un scénario `prefers-reduced-motion: reduce` confirmant l’absence de translation persistante.
3. Constater les échecs initiaux.
4. Rendre le contenu visible par défaut et hydrated seulement après validation de l’environnement.
5. Ajouter un skip link et les repères `header`, `main`, `footer`.
6. Neutraliser le mouvement spatial dans les reveals et la scène 3D.

## Tâche 5 — Performance et intégrité

**Fichiers :** `components/landing/desktop-planet-sculpture.tsx`, `components/landing/planet-sculpture.tsx`, `components/landing/scroll-progress.tsx`, `next.config.mjs`, `package.json`, `styles/globals.css`, `app/page.tsx`

1. Écrire un test de configuration confirmant que `ignoreBuildErrors` et `images.unoptimized` sont absents et que `typecheck` existe.
2. Constater son échec initial.
3. Réactiver le contrôle TypeScript et l’optimisation des images.
4. Ajouter les attributs `sizes`.
5. Charger la scène 3D via un chunk conditionnel desktop.
6. Remplacer `Environment preset="studio"` par un éclairage local.
7. Cadencer `ScrollProgress` avec `requestAnimationFrame` sans `setState`.
8. Supprimer le second fichier de thème non importé.

## Tâche 6 — Vérification finale et revue

1. Exécuter `npm run typecheck`.
2. Exécuter `npm run build`.
3. Lancer les tests de contrat et Playwright.
4. Inspecter les captures FR/EN à 1440×900, 390×844 et 320×800.
5. Vérifier les ancres, l’absence de débordement horizontal, les erreurs console et les requêtes réseau en échec.
6. Comparer le hero et la Disponibilité avec la version initiale.
7. Relancer `npx impeccable detect --json` sur les fichiers modifiés et analyser les résultats.
8. Demander une revue de conformité à la spécification, puis une revue de qualité du code.
9. Corriger les constats bloquants et vérifier à nouveau.
10. Ne publier ni commit/push sans validation explicite de la branche et des changements.
