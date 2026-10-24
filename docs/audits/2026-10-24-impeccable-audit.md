# Audit Impeccable — Portfolio Next.js

**Date :** 24 octobre 2026  
**Périmètre :** état actuel du dépôt avant l’ajout de la section « Expérience »  
**Mode de vérification :** rendu Chromium, desktop/tablette/mobile, build de production, TypeScript, axe-core et détecteur Impeccable

## Verdict

Le portfolio possède une identité éditoriale monochrome cohérente et distinguishable : typographie serif/mono, grilles bordées, compteurs et sculpture 3D. L’audit ne remet donc pas en cause cette direction artistique.

En revanche, plusieurs défauts techniques doivent être corrigés avant une mise en production qualitativement solide : visibilité sans JavaScript, gestion du focus des deux surcouches, respect de `prefers-reduced-motion`, comportement de la navigation censée être fixe, poids des images et chargement de Three.js sur mobile.

## Audit Health Score

| # | Dimension | Score | Constat principal |
|---|---|---:|---|
| 1 | Accessibilité | 2/4 | axe ne relève aucune violation, mais les menus clavier, le scroll et le mouvement réduit ne sont pas correctement maîtrisés |
| 2 | Performance | 1/4 | 1,65 Mo transférés sur mobile, images originales non optimisées et bundle Three.js chargé même lorsque la 3D est masquée |
| 3 | Theming | 3/4 | tokens cohérents dans le CSS actif, mais un second fichier de thème contradictoire subsiste |
| 4 | Responsive Design | 3/4 | aucun débordement horizontal de 320 à 1440 px, mais header fixe cassé et header étroit à 320 px |
| 5 | Intégrité de l’implémentation | 3/4 | système produit cohérent, mais build sans contrôle TypeScript et visibilité dépendante de JavaScript |
| **Total** | | **12/20** | **Acceptable — travail significatif nécessaire** |

## Synthèse

- **Score : 12/20 — Acceptable**
- **Problèmes consolidés :** P0 : 0 · P1 : 7 · P2 : 9 · P3 : 2
- **Points positifs :** hiérarchie des titres cohérente, aucune violation axe, responsive sans scroll horizontal, tokens visuels homogènes, build et `tsc` réussis.
- **Priorité :** corriger d’abord les sept problèmes P1 avant d’ajouter ou de publier la section « Expérience ».

## Verdict d’intégrité

**PASS — système cohérent et intentionnel.**

Les reprises visuelles signalées par le détecteur — sur-titre, italique serif, labels au-dessus des titres, point pulsé — correspondent à l’identité éditoriale existante et au brief qui impose son maintien. Elles ne sont donc pas promues en défauts.

Le détecteur a également signalé un contraste de 1:1 sur la navigation. Il s’agit d’un **faux positif** : `mix-blend-difference` empêche le calcul naïf de voir le résultat réel ; les captures montrent un texte noir sur le fond clair et axe ne signale aucun contraste insuffisant.

Une exception `addEventListener` non interceptable a été observée pendant un scan de développement, mais elle n’a pas été reproduite sur huit rechargements indépendants ni sur le build de production. Elle n’est donc pas comptabilisée comme défaut confirmé.

## Constats détaillés

### P0 — Bloquant

Aucun.

### P1 — Majeur

#### 1. Le contenu disparaît sans JavaScript

- **Localisation :** `components/landing/reveal.tsx:31`, `components/landing/reveal.tsx:45-50`; usage dans `app/page.tsx:101`
- **Catégorie :** Accessibilité / Intégrité
- **Impact :** avec JavaScript désactivé ou interrompu avant l’hydratation, les sept sections restent à `opacity: 0`. Le HTML existe, mais le portfolio devient visuellement vide.
- **Standard :** robustesse progressive ; le contenu ne doit pas dépendre d’un script pour être visible.
- **Recommandation :** rendre l’état visible par défaut dans le HTML/CSS, puis n’appliquer l’état masqué qu’après hydratation réussie ; fournir un repli CSS ou `<noscript>`.
- **Commande suggérée :** `/impeccable harden`

#### 2. Le menu mobile ne confine ni le focus ni le scroll

- **Localisation :** `components/landing/mobile-nav.tsx:42-76`
- **Catégorie :** Accessibilité / Responsive
- **Impact :** à l’ouverture, le focus reste sur le bouton derrière l’overlay. Tab continue vers les liens de la page sous-jacente. La molette fait défiler le document derrière le menu. Escape ferme le menu sans restaurer explicitement le focus sur son déclencheur.
- **Standard :** WCAG 2.4.3 (ordre du focus) et 2.4.7 (focus visible), complétés par les règles de gestion de modale et de focus.
- **Recommandation :** traiter l’overlay comme une boîte de dialogue modale (`dialog` ou `role="dialog"`, `aria-modal`), traps du focus, `inert` sur le contenu, blocage du scroll, retour du focus au déclencheur.
- **Commande suggérée :** `/impeccable harden`

#### 3. Le sélecteur de langue ne respecte pas le modèle clavier d’une listbox

- **Localisation :** `components/landing/language-switcher.tsx:56-67`, `components/landing/language-switcher.tsx:73-104`
- **Catégorie :** Accessibilité
- **Impact :** le rôle `listbox` est annoncé, mais l’ouverture ne déplace pas le focus vers les options, les flèches ne changent pas d’option et Tab quitte la liste. Les options sont insérées en fin de document par un portail : le parcours clavier normal les atteint seulement après avoir parcouru la page entière.
- **Standard :** WAI-ARIA Authoring Practices — Listbox Keyboard Interaction ; WCAG 2.1.1.
- **Recommandation :** implémenter les touches Arrow/Home/End, une navigation active unique, le focus dans la liste et le retour du focus au déclencheur à la fermeture.
- **Commande suggérée :** `/impeccable harden`

#### 4. Le mode à mouvement réduit n’est appliqué qu’aux animations CSS

- **Localisation :** `app/globals.css:124-129`, `components/landing/reveal.tsx:45-50`, `components/landing/planet-sculpture.tsx:275-323`
- **Catégorie :** Accessibilité / Performance
- **Impact :** la règle globale réduit les animations CSS, mais les transitions de révélation restent à 0,9 s et la boucle WebGL continue. Le comportement attendu par `prefers-reduced-motion` n’est donc pas respecté de bout en bout.
- **Standard :** WCAG 2.2.2 et 2.3.3 ; alternatives intentionnelles pour les animations non essentielles.
- **Recommandation :** exposer un indicateur de mouvement réduit au composant de révélation et à la scène 3D, supprimer le mouvement spatial et conserver uniquement un changement d’état discret.
- **Commande suggérée :** `/impeccable harden`

#### 5. La navigation « fixed » et la barre de progression quittent réellement le viewport

- **Localisation :** `app/page.tsx:71`, `app/page.tsx:74`, `components/landing/scroll-progress.tsx:24-31`, `app/globals.css:97-111`
- **Catégorie :** Responsive / Intégrité
- **Impact :** `main` porte une transformation persistante issue de `animate-page-in`. Un ancêtre transformé devient le containing block des descendants `fixed`; après défilement, le header est mesuré à `y = -scrollY` et disparaît. Le bouton mobile n’est donc plus accessible au milieu de la page.
- **Standard :** comportement CSS `position: fixed` attendu ; navigation persistante annoncée par le code.
- **Recommandation :** sortir la navigation et la barre de progression de l’élément transformé, ou appliquer l’animation d’entrée à un enfant qui ne contient pas ces éléments.
- **Commande suggérée :** `/impeccable adapt`

#### 6. Les images sont livrées dans leur format original

- **Localisation :** `next.config.mjs:6-8`, `app/page.tsx:201-207`, `app/page.tsx:268-277`
- **Catégorie :** Performance
- **Impact :** `images.unoptimized` désactive l’optimisation Next.js. Le portrait seul pèse 945 Ko ; les images observées au premier chargement représentent 1,13 Mo sur mobile et 1,64 Mo sur desktop.
- **Standard :** Core Web Vitals ; images dimensionnées et décodées au format appropriate.
- **Recommandation :** réactiver l’optimisation Next.js, fournir des sources WebP/AVIF, utiliser `sizes` adaptés et conserver le chargement paresseux.
- **Commande suggérée :** `/impeccable optimize`

#### 7. Three.js est chargé sur mobile alors que la sculpture est masquée

- **Localisation :** `app/page.tsx:15`, `app/page.tsx:139`, `components/landing/planet-sculpture.tsx:1-4`
- **Catégorie :** Performance
- **Impact :** l’import statique de `PlanetSculpture` force le téléchargement du chunk Three.js même à 390 px, où la scène est masquée. Le principal chunk mesuré représente 1,02 Mo décodés, soit environ 277 Ko transférés compressés.
- **Standard :** chargement conditionnel des fonctionnalités coûteuses.
- **Recommandation :** charger la scène par import dynamique uniquement à partir du breakpoint desktop et lorsque la section est proche du viewport.
- **Commande suggérée :** `/impeccable optimize`

### P2 — Mineur

#### 8. L’environnement HDR de 1,68 Mo dépend d’un service tiers à l’exécution

- **Localisation :** `components/landing/planet-sculpture.tsx:400`
- **Catégorie :** Performance / Fiabilité
- **Impact :** `Environment preset="studio"` télécharge le HDR depuis GitHub pendant le rendu desktop. Cela ajoute environ 1,68 Mo et échoue hors ligne ou si GitHub est indisponible.
- **Recommandation :** servir une version locale compressée ou remplacer l’environnement distant par un éclairage local plus léger.
- **Commande suggérée :** `/impeccable optimize`

#### 9. `will-change` reste actif sur tous les éléments révélés

- **Localisation :** `components/landing/reveal.tsx:45-50`
- **Catégorie :** Performance
- **Impact :** chaque section et bloc conserve `will-change: opacity, transform` au repos, pouvant maintenir de nombreuses couches de composition.
- **Recommandation :** poser l’indice juste avant la révélation et le retirer à la fin, ou ne l’utiliser que pendant la transition.
- **Commande suggérée :** `/impeccable optimize`

#### 10. `ScrollProgress` déclenche un rendu React à chaque événement de scroll

- **Localisation :** `components/landing/scroll-progress.tsx:14-17`
- **Catégorie :** Performance
- **Impact :** un `setState` non cadence est appelé à chaque événement de scroll.
- **Recommandation :** throttle via `requestAnimationFrame`, écrire une variable CSS ou utiliser une transformation pilotée hors de React.
- **Commande suggérée :** `/impeccable optimize`

#### 11. Les micro-libellés fonctionnels sont majoritairement sous 11 px

- **Localisation :** représentatif : `app/page.tsx:78`, `app/page.tsx:107`, `app/page.tsx:147`, `app/page.tsx:281`, `app/page.tsx:303`; `components/landing/language-switcher.tsx:63`; `components/landing/mobile-nav.tsx:38`
- **Catégorie :** Accessibilité / Qualité
- **Impact :** le détecteur recense 28 textes fonctionnels à 9 ou 10 px. Ils restent techniquement visibles, mais deviennent difficiles à lire sur mobile et sur écran dense.
- **Standard :** SC 2.5.8 est satisfaite pour la taille, mais le seuil de 11 px est un garde-fou qualité pertinent.
- **Recommandation :** fixer un plancher de 11 px pour les libellés fonctionnels, sans modifier la hiérarchie serif/display.
- **Commande suggérée :** `/impeccable typeset`

#### 12. Les noms accessibles du sélecteur de langue restent en français en mode anglais

- **Localisation :** `components/landing/language-switcher.tsx:62`, `components/landing/language-switcher.tsx:76`
- **Catégorie :** Accessibilité / i18n
- **Impact :** en anglais, le bouton est encore annoncé « Langue : English » et la liste « Langue ».
- **Recommandation :** traduire `Langue` et le préfixe du nom accessible dans les deux dictionnaires.
- **Commande suggérée :** `/impeccable harden`

#### 13. Le header se replie awkwardly à 320 px et les cibles restent sous 44 px

- **Localisation :** `app/page.tsx:74-99`, `components/landing/language-switcher.tsx:56-68`, `components/landing/mobile-nav.tsx:33-41`
- **Catégorie :** Responsive
- **Impact :** à 320 px, « Me contacter » passe sur deux lignes et le header atteint 92 px de haut. Les boutons mesurent 33 à 41 px de hauteur : ils respectent le minimum WCAG de 24 px, mais pas la cible recommandée de 44 px.
- **Recommandation :** raccourcir le libellé à très petite largeur ou réduire la composition du header ; porter les contrôles à au moins 44 px sans modifier leur aspect.
- **Commande suggérée :** `/impeccable adapt`

#### 14. Un second fichier de thème contradictoire subsiste

- **Localisation :** `styles/globals.css:6-40`, `styles/globals.css:77-101`; système actif dans `app/globals.css:6-45`
- **Catégorie :** Theming / Intégrité
- **Impact :** le fichier inutilisé décrit un fond blanc pur, Geist, un rayon de 0,625 rem et un thème sombre, tandis que le CSS actif utilise un fond ivoire, Instrument Sans/Serif et un rayon de 0,25 rem. Une future importation accidentelle créerait une divergence visuelle majeure.
- **Recommandation :** supprimer le fichier obsolète ou le fusionner explicitement avec le système actif après vérification de son absence d’usage.
- **Commande suggérée :** `/impeccable harden`

#### 15. Le build neutralise la validation TypeScript

- **Localisation :** `next.config.mjs:3-5`
- **Catégorie :** Intégrité
- **Impact :** `npm run build` annonce « Skipping validation of types ». Le contrôle manuel `npx tsc --noEmit` passe actuellement, mais une future erreur TypeScript ne bloquera pas le build.
- **Recommandation :** supprimer `ignoreBuildErrors` et ajouter un script `typecheck` exécuté par la CI.
- **Commande suggérée :** `/impeccable harden`

#### 16. Les repères ne sont pas exposés comme dans un site complet

- **Localisation :** `app/page.tsx:71-99`, `app/page.tsx:439-445`
- **Catégorie :** Accessibilité / Sémantique
- **Impact :** il n’existe pas de lien d’évitement. Le `footer` est imbriqué dans `main` : selon la façon dont l’arbre d’accessibilité l’expose, il ne fournit pas le repère `contentinfo` attendu pour le contenu du site.
- **Recommandation :** placer la navigation dans un `header`, le footer hors de `main` et ajouter un lien « Aller au contenu » visible au focus.
- **Commande suggérée :** `/impeccable harden`

### P3 — Polish

#### 17. Deux fins de paragraphe laissent un mot isolé

- **Localisation :** `app/page.tsx:111-114`, `app/page.tsx:217-225`
- **Catégorie :** Qualité typographique
- **Impact :** « Antsirabe » et « technique. » se retrouvent isolés sur leur dernière ligne selon la largeur.
- **Recommandation :** utiliser `text-wrap: pretty/balance` ou ajuster la formulation sans changer le sens.
- **Commande suggérée :** `/impeccable typeset`

#### 18. Le mapping de compatibilité navigateur est obsolète

- **Localisation :** dépendance transitive `baseline-browser-mapping` signalée par Next.js
- **Catégorie :** Performance / Outillage
- **Impact :** le build et le serveur de développement avertissent que la base de données de compatibilité a plus de deux mois.
- **Recommandation :** mettre à jour la dépendance vers sa version récente lors du prochain lot de dépendances.
- **Commande suggérée :** `/impeccable harden`

## Motifs systémiques

1. **Les composants client appliquent l’état avant de garantir l’hydratation.** Les reveals masquent le contenu avant que JavaScript ne confirme son fonctionnement.
2. **Les surcouches utilisent le rôle visuel sans les garanties de dialogue.** Les menus et listes ont une apparence correcte, mais pas de confinement du focus, de restauration du focus ou de gestion du scroll.
3. **La 3D est coûteuse avant d’être conditionnée à son affichage.** Le coût JS est payé sur mobile et l’environnement HDR est téléchargé depuis un tiers.
4. **Les images contournent l’optimisation Next.js.** Les dimensions et attributs de dimensions sont corrects, mais cela ne compense pas la désactivation de `images.unoptimized`.
5. **La navigation est visée comme fixe, mais le contexte de transformation invalide ce comportement.**

## Points positifs à conserver

- Hiérarchie `h1` → `h2` → `h3` cohérente et sans saut.
- **Zéro violation axe-core** aux largeurs 1440, 768 et 390 px.
- Aucun débordement horizontal mesuré à 320, 360, 390, 768, 1024 et 1440 px.
- Les images possèdent des dimensions intrinsèques et un `alt` utile.
- Les icônes interactives ont des noms accessibles et les liens externes utilisent `rel="noreferrer"`.
- Le système monochrome repose presque entièrement sur des tokens sémantiques cohérents.
- Les polices sont auto-hébergées et chargées au format WOFF2.
- `npm run build` réussit et `npx tsc --noEmit` réussit.
- La direction éditoriale noir et blanc, serif/mono est cohérente et spécifique au portfolio.

## Actions recommandées

1. **[P1] `/impeccable harden`** : visibilité sans JavaScript, focus et scroll des surcouches, listbox clavier, mouvement réduit, i18n accessible, validation TypeScript.
2. **[P1] `/impeccable optimize`** : images optimisées, import conditionnel de Three.js, HDR local, `will-change`, cadence du scroll.
3. **[P1] `/impeccable adapt`** : corriger le contexte `fixed`, le header à 320 px et les cibles tactiles.
4. **[P2] `/impeccable typeset`** : plancher de 11 px pour les textes fonctionnels et fins de ligne.
5. **[P3] `/impeccable polish`** : dernière passe visuelle après les corrections fonctionnelles.

## Méthode et preuves

- Captures et mesures : Chromium, 1440×900, 768×1024, 390×844, plus contrôles 320/360/1024 px.
- Axe-core 4.10.2 : **0 violation** sur les trois viewports principaux.
- Impeccable detector : 40 résultats bruts sur mobile, dont 28 occurrences du même problème de micro-texte ; les résultats ont été regroupés et vérifiés dans leur contexte.
- Build de production : réussi.
- TypeScript : `npx tsc --noEmit` réussi.
- Transfert mesuré au premier chargement : environ **1,65 Mo sur mobile** et **2,16 Mo sur desktop**, avant le chargement conditionnel du HDR distant.
- Le statut Git du code produit n’a pas été modifié par cet audit.

> Vous pouvez me demander d’exécuter ces commandes une par une, toutes ensemble ou dans l’ordre de votre choix.
>
> Relancez `/impeccable audit` après les corrections pour mesurer la progression du score.
