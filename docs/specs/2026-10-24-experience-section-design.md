# Ajout de la section « Expérience » et lot de polish du portfolio

**Date :** 24 octobre 2026  
**Statut :** Validé — disposition A, cartes empilées  
**Périmètre :** Ajout d’une section éditoriale et corrections fonctionnelles ciblées de l’interface existante

## 1. Contexte

Le portfolio présente actuellement les sections Disponibilité, À propos, Projets, Compétences, Formation et Contact. Il ne comporte pas de section distincte consacrée aux expériences professionnelles.

Deux stages se déroulent simultanément en 2026 :

1. **Tynoc Tech**, du 17 octobre au 17 novembre 2026, en full remote ;
2. **UN T’ELLE SUCCÈS & ÉLITE by Dayana Ouederni**, d’octobre à décembre 2026, en full remote.

L’audit Impeccable du produit existant a par ailleurs mis en évidence sept défauts majeurs : contenu masqué sans JavaScript, gestion incomplète du focus et du scroll des surcouches, modèle clavier incomplet du sélecteur de langue, mouvement réduit incomplet, navigation fixe invalidée par une transformation, images non optimisées et Three.js chargé sur mobile.

## 2. Objectifs

- Présenter les deux stages comme deux expériences professionnelles distinctes et simultanées.
- Donner au recruteur une idée claire de l’organisation, du poste, de la période, du mode de travail et du périmètre de chaque mission.
- Conserver le système visuel monochrome et éditorial existant, sans refonte.
- Publier une version française et une version anglaise cohérentes.
- Rendre la nouvelle section accessible depuis la navigation principale.
- Corriger les défauts fonctionnels et de performance prioritaires relevés par l’audit avant publication.
- Préserver le hero et la section Disponibilité : leurs contenus, leur position et leur intention éditoriale ne sont pas modifiés.

## 3. Hors périmètre

- Refonte générale du portfolio ou modification de sa direction artistique.
- Ajout d’une illustration, d’un logo client ou d’une image de substitution pour les stages.
- Ajout d’un lien vers un site, un dépôt ou des livrables publics.
- Présentation des objectifs des cahiers des charges comme des résultats déjà réalisés.
- Publication d’un Ref ID, d’une rémunération confidentielle, d’un faux avis ou d’un résultat non réalisé.
- Réécriture du CV ou modification des métadonnées SEO globales.
- Suppression de la sculpture 3D ou changement de sa direction visuelle.

## 4. Contenu validé

### 4.1 Identification de la section

| Élément | Français | Anglais |
|---|---|---|
| Libellé | Expérience | Experience |
| Titre, ligne 1 | Expérience | Experience |
| Titre, ligne 2 | en production. | in production. |
| Compteur | (02) | (02) |
| Ancre | `#experience` | `#experience` |

Le second fragment du titre est rendu en italique avec la classe `font-display`, conformément aux titres voisins.

### 4.2 Expérience 01 — Tynoc Tech

| Élément | Français | Anglais |
|---|---|---|
| Organisation | Tynoc Tech | Tynoc Tech |
| Poste | Stagiaire ingénieur logiciel | Software Engineer Intern |
| Contexte | Stage de 4 semaines · Full remote | 4-week internship · Fully remote |
| Période | 17 Oct — 17 Nov 2026 | Oct 17 — Nov 17, 2026 |
| Statut | En cours | In progress |
| Résumé | Développement d’un MVP full-stack de création de formulaires, avec chatbot intégrable et gestion des réponses. | Development of a full-stack form-building MVP, with an embeddable chatbot and response management. |
| Technologies | Next.js, React, TypeScript, Tailwind CSS, PostgreSQL | Next.js, React, TypeScript, Tailwind CSS, PostgreSQL |

### 4.3 Expérience 02 — UN T’ELLE SUCCÈS & ÉLITE

| Élément | Français | Anglais |
|---|---|---|
| Organisation | UN T’ELLE SUCCÈS & ÉLITE by Dayana Ouederni | UN T’ELLE SUCCÈS & ÉLITE by Dayana Ouederni |
| Poste | Stagiaire développement web & SEO | Web development & SEO intern |
| Contexte | Stage de 8 semaines · Full remote | 8-week internship · Fully remote |
| Période | Oct — Déc 2026 | Oct — Dec 2026 |
| Statut | En cours | In progress |
| Résumé | Refonte premium du site WordPress, UX mobile, SEO technique et local, contenus éditoriaux et passation. | Premium WordPress website redesign, mobile UX, technical and local SEO, editorial content, and handover. |
| Technologies | WordPress, SEO, UX mobile, Google Business Profile | WordPress, SEO, Mobile UX, Google Business Profile |

Les résumés décrivent les missions confiées. Aucun volume, livrable ou résultat n’est présenté comme acquis avant sa réalisation et sa validation.

## 5. Direction visuelle

La section réutilise exclusivement le langage visuel existant :

- fond blanc ou ivoire selon le contexte de section, texte noir et gris, bordures grises fines ;
- aucune nouvelle couleur, aucun dégradé supplémentaire, aucun ombre portée, aucun nouveau rayon ;
- `font-display` pour le titre, la police sans-serif pour les contenus et la police monospace pour les libellés, dates, statuts et métadonnées ;
- espacements généreux et hiérarchie éditoriale comparable aux sections Projets, Compétences et Formation ;
- aucune illustration : les missions n’ont pas d’image dédiée et une image générique induirait en erreur.

La carte reste une variante de la carte Projets : panneau éditorial gauche et panneau de contenu droit.

## 6. Mise en page — disposition A

### 6.1 Structure desktop

La section est placée entre À propos et Projets.

1. En-tête de section :
   - libellé monospace `EXPÉRIENCE` ;
   - titre serif sur deux lignes, dont la seconde en italique ;
   - compteur `(02)` aligné à droite.
2. Deux cartes bordées, **empilées verticalement** et de pleine largeur :
   - panneau gauche d’environ 32 % de la largeur ;
   - grand index `01` ou `02` en typographie serif ;
   - statut `En cours` en bas du panneau avec indicateur visuel sobre ;
   - panneau droit contenant le contexte, l’organisation, le résumé, les technologies, puis le poste et la période ;
   - technologies présentées sous forme de pastilles monospace, comme celles des cartes Projets.
3. L’espacement entre les deux cartes reprend l’espacement `gap-5` utilisé par la grille Projets.

Aucun bouton ni lien externe n’est ajouté aux cartes.

### 6.2 Comportement mobile

- L’en-tête conserve la même hiérarchie et le compteur reste aligné à droite.
- Chaque carte passe sur une colonne ; les deux cartes restent empilées.
- L’ordre vertical de chaque carte est : index, statut, contexte, organisation, résumé, technologies, poste et période.
- Aucun débordement horizontal ni texte tronqué n’est accepté.
- Les technologies passent à la ligne sans réduire leur lisibilité.

## 7. Navigation

Le libellé `Expérience` / `Experience` est ajouté à la navigation desktop et à la navigation mobile.

L’ordre des entrées devient :

1. À propos ;
2. Expérience ;
3. Projets ;
4. Compétences.

Le contact reste l’action principale du header. Chaque entrée pointe vers l’ancre correspondante ; la nouvelle entrée pointe vers `#experience`.

## 8. Lot de polish associé

Le polish ne modifie pas l’identité visuelle. Il corrige les causes racines vérifiées par l’audit :

### 8.1 Robustesse et accessibilité

- Les contenus révélés au scroll sont visibles dans le HTML initial et le restent si l’hydratation JavaScript n’a pas lieu.
- Le menu mobile utilise une boîte de dialogue modale native, piège le focus, bloque le scroll de fond et rend le focus au déclencheur à la fermeture.
- Le sélecteur de langue suit le modèle clavier d’une listbox : ouverture sur l’option courante, ArrowUp/ArrowDown/Home/End, Entrée/Espace, Échap et Tab.
- Les noms accessibles du sélecteur de langue sont traduits.
- Le mouvement spatial des révélations et de la scène 3D est neutralisé avec `prefers-reduced-motion`; un changement d’état discret demeure possible.
- Un lien d’évitement et les repères `header`, `main` et `footer` sont exposés.

### 8.2 Performance

- L’optimisation Next.js des images est réactivée, avec des attributs `sizes` adaptés.
- Three.js est chargé dans un chunk distinct uniquement sur desktop et lorsque la sculpture approche du viewport.
- L’environnement HDR distant est remplacé par un éclairage local procédural.
- `will-change` n’est plus conservé au repos sur les éléments révélés.
- La barre de progression utilise `requestAnimationFrame` et écrit directement dans le DOM, sans rendu React par événement de scroll.

### 8.3 Structure et responsive

- La navigation et la barre de progression sont sorties de l’élément transformé afin de conserver un comportement réellement fixe.
- À 320 px, le libellé du contact est raccourci sans supprimer l’action ; les contrôles gagnent une hauteur minimale de 44 px.
- Le second fichier de thème contradictoire est supprimé après confirmation de son absence d’usage.
- Le build ne neutralise plus la validation TypeScript et un script `typecheck` explicite est ajouté.
- Les fins de paragraphe concernées utilisent une règle typographique adaptée.

## 9. Architecture et flux de données

### 9.1 Fichiers modifiés

- `lib/i18n.ts`
  - ajout de `nav.experience` et des libellés accessibles du sélecteur de langue ;
  - ajout d’un objet `experience` contenant deux entrées dans les dictionnaires français et anglais ;
  - conservation de `Dict = typeof fr`, afin que TypeScript impose la parité des deux langues.

- `app/page.tsx`
  - ajout du lien de navigation desktop ;
  - ajout de la section entre les blocs `about` et `projets` ;
  - lecture de tous les textes visibles via `t.experience` ;
  - restructuration des repères sémantiques sans changer l’ordre des sections.

- `components/landing/mobile-nav.tsx`
  - ajout de l’entrée `Expérience` / `Experience` et de l’ancre `#experience` ;
  - implémentation du comportement modal accessible.

- `components/landing/language-switcher.tsx`
  - implémentation du modèle clavier de listbox ;
  - traduction des noms accessibles.

- `components/landing/reveal.tsx`
  - rendu progressif visible par défaut ;
  - respect du mouvement réduit ;
  - suppression du `will-change` permanent.

- `components/landing/scroll-progress.tsx`
  - cadence `requestAnimationFrame` et écriture DOM directe.

- `components/landing/planet-sculpture.tsx`
  - prise en compte du mouvement réduit ;
  - remplacement de l’environnement HDR distant par un éclairage local.

- `components/landing/desktop-planet-sculpture.tsx`
  - nouveau seuil léger contrôlant le chargement conditionnel de Three.js.

- `next.config.mjs`
  - validation TypeScript réactivée ;
  - optimisation des images réactivée.

- `package.json`
  - ajout du script `typecheck`.

- `styles/globals.css`
  - suppression du fichier de thème obsolète et non importé.

### 9.2 Source de vérité

Les textes visibles des expériences sont centralisés dans `lib/i18n.ts`. `app/page.tsx` ne contient que la structure visuelle. Aucun chargement réseau, CMS, état global ou nouvelle dépendance runtime n’est introduit.

### 9.3 Données statiques et états

La section ne dépend d’aucune API. Elle possède un seul état de contenu : deux expériences en cours. Il n’y a donc pas de chargement, retry, erreur réseau, état vide ou logique conditionnelle à gérer.

## 10. Stratégie de vérification

1. Exécuter le test d’acceptation Playwright avant implémentation et constater son échec attendu sur l’absence de la section.
2. Exécuter `npm run typecheck` et `npm run build` sans neutralisation des erreurs TypeScript.
3. Vérifier l’ancre `#experience` depuis la navigation desktop et mobile.
4. Vérifier l’affichage complet en français puis en anglais.
5. Inspecter la section à 1440×900 et 390×844, avec un contrôle supplémentaire à 320 px.
6. Contrôler l’absence de débordement horizontal, de texte tronqué et d’erreurs console.
7. Vérifier que la section contient exactement deux expériences, aucune URL externe et cinq technologies Tynoc incluant Tailwind CSS.
8. Vérifier le hero et le contenu de Disponibilité par rapport à la version initiale.
9. Vérifier les interactions clavier du menu mobile et du sélecteur de langue.
10. Vérifier la visibilité sans JavaScript et le comportement sous `prefers-reduced-motion`.
11. Relancer le détecteur Impeccable sur les fichiers modifiés et examiner les résultats dans leur contexte.

## 11. Critères d’acceptation

- Une section « Expérience » apparaît entre À propos et Projets avec deux cartes empilées.
- Le compteur `(02)`, l’ordre Tynoc Tech puis UN T’ELLE SUCCÈS et le statut « En cours » sont visibles dans les deux langues.
- La carte Tynoc Tech affiche Next.js, React, TypeScript, Tailwind CSS et PostgreSQL.
- Aucun résultat non réalisé n’est présenté comme acquis.
- Aucun lien externe, nouvelle illustration ou nouvelle identité visuelle n’est ajouté aux expériences.
- « Expérience » apparaît dans les navigations desktop et mobile et conduit à la bonne ancre.
- Le menu mobile et le sélecteur de langue sont utilisables au clavier, avec focus et scroll correctement gérés.
- Le contenu principal reste visible sans JavaScript.
- La navigation reste fixe après défilement.
- Three.js n’est pas chargé sur mobile et l’environnement HDR distant n’est plus requis.
- Les images passent par l’optimiseur Next.js.
- Le build, le typecheck et les vérifications navigateur réussissent sans erreur console ni débordement horizontal.

## 12. Stratégie de modification retenue

L’intégration reste directe dans les structures existantes afin de produire un diff minimal et de garantir la cohérence visuelle. Les corrections de polish sont traitées à leur cause et dans des fichiers ciblés, sans transformation générale du produit. Les changements sont réalisés séquentiellement : contenu et traductions, section et navigation, surcouches accessibles, révélations et motion, performance, puis vérification complète.
