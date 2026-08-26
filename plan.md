# sudoQ — Plan d’implémentation

This document is _AI generated_

## Vision du projet

sudoQ est un projet d’apprentissage autour du Sudoku. L’objectif n’est pas de livrer rapidement une application complète, mais d’utiliser un même projet pour explorer progressivement :

- le développement frontend et l’UX d’un jeu ;
- la logique et les structures de données ;
- les algorithmes de résolution ;
- la génération procédurale de grilles ;
- les techniques de résolution humaines ;
- la construction d’un solveur explicable ;
- la reconnaissance de chiffres manuscrits ;
- éventuellement la vision par ordinateur.

Le projet doit rester progressif : chaque milestone produit une application ou une fonctionnalité utilisable, sans nécessiter d’anticiper toute l’architecture finale.

---

# Architecture cible

```text
sudoQ/
├── frontend/                # React + TypeScript + Vite
│   └── src/
│       ├── components/
│       ├── api/
│       ├── types/
│       └── ...
│
├── backend/                 # Python + FastAPI
│   ├── api/                 # Couche HTTP
│   ├── sudoku/              # Moteur indépendant
│   ├── tests/
│   └── ...
│
├── README.md
└── .gitignore
```

Principe général :

```text
React
│
├── UI et interactions
├── état local de la partie
├── sélection et affichage
└── appels aux fonctionnalités du moteur
        │
        ▼
FastAPI
        │
        ▼
Moteur Sudoku Python
├── validation
├── candidats
├── résolution
├── génération
├── analyse
└── techniques
```

Le moteur Sudoku ne doit connaître ni React ni FastAPI. FastAPI est uniquement une couche d’exposition du moteur.

---

# MILESTONE 0 — Fondation du projet

## Objectif

Mettre en place une base de développement simple.

## Étapes

- Créer le repository `sudoQ`.
- Créer `frontend/` avec Vite, React et TypeScript.
- Créer `backend/` avec Python et FastAPI.
- Ajouter un `.gitignore` commun.
- Vérifier que les deux applications se lancent.
- Créer une route FastAPI minimale.
- Appeler cette route depuis React avec `fetch`.
- Créer une petite couche `api/` côté frontend.
- Centraliser la construction des URLs du backend.

## Résultat

```text
React → API HTTP → FastAPI → réponse
```

À ce stade, aucun vrai Sudoku n’est nécessaire.

---

# MILESTONE 1 — Une grille Sudoku jouable

## Objectif

Construire l’interface fondamentale du jeu.

## Étapes

### 1.1 Représentation de la grille

- Définir un type `Grid`.
- Représenter une grille sous forme de tableau 9 × 9.
- Utiliser `null` pour une case vide.
- Préparer une grille d’exemple.

### 1.2 Affichage

- Créer un composant `Grid`.
- Créer un composant `Cell`.
- Générer les 81 cellules avec un parcours de la grille.
- Afficher les valeurs.
- Rendre la grille responsive.
- Forcer un ratio carré.
- Garantir que les cellules restent carrées.

### 1.3 Bordures Sudoku

- Bordures fines entre les cellules.
- Bordures épaisses entre les blocs 3 × 3.
- Bordure extérieure de la grille.

### 1.4 Interaction

- Cliquer sur une cellule.
- Stocker la cellule sélectionnée.
- Mettre visuellement en évidence la sélection.
- Entrer un chiffre.
- Effacer un chiffre.
- Ajouter la gestion du clavier.

### 1.5 Chiffres initiaux

- Distinguer les indices initiaux des chiffres ajoutés par le joueur.
- Empêcher la modification des indices initiaux.

## Résultat

Une grille Sudoku locale entièrement jouable, même sans validation.

---

# MILESTONE 2 — Règles et validation locale

## Objectif

Faire respecter les règles fondamentales du Sudoku.

## Étapes

### 2.1 Détection des conflits

Lorsqu’un chiffre est présent dans une cellule :

- identifier les cellules de la même ligne ;
- identifier les cellules de la même colonne ;
- identifier les cellules du même bloc 3 × 3.

Détecter les doublons.

### 2.2 Affichage des conflits

- Mettre en évidence les cellules en conflit.
- Choisir si le coup reste autorisé ou non.
- Prévoir un comportement configurable.

### 2.3 Distinction importante

Séparer deux notions :

1. **Coup en conflit avec les règles**
   - doublon dans une ligne, colonne ou bloc.

2. **Coup différent de la solution**
   - légal localement, mais faux dans la solution finale.

Le jeu peut fonctionner sans connaître la solution.

## Résultat

Une grille jouable qui détecte correctement les erreurs de règles.

---

# MILESTONE 3 — Expérience de jeu et candidats

## Objectif

Se rapprocher d’une expérience de Sudoku complète.

## Étapes

### 3.1 Mise en évidence

- Ligne sélectionnée.
- Colonne sélectionnée.
- Bloc sélectionné.
- Chiffres identiques.
- Conflits.

### 3.2 Notes

- Ajouter un mode notes.
- Permettre plusieurs chiffres dans une cellule.
- Ajouter ou retirer un candidat manuellement.

### 3.3 Candidats possibles

Implémenter localement le calcul :

> Quels chiffres sont encore possibles dans cette cellule selon la ligne, la colonne et le bloc ?

### 3.4 Candidats automatiques

Optionnellement :

- afficher automatiquement les candidats possibles ;
- mettre à jour les candidats lorsqu’un chiffre est placé.

Ne pas confondre :

- les candidats **mathématiquement possibles** ;
- les notes **choisies par le joueur**.

## Résultat

Une application agréable permettant de jouer réellement à un Sudoku.

---

# MILESTONE 4 — Premier moteur Sudoku Python

## Objectif

Commencer le cœur algorithmique du projet.

## Principes

Le moteur :

- ne connaît pas React ;
- ne connaît pas FastAPI ;
- peut être utilisé dans un script ou dans des tests ;
- reçoit et manipule une représentation de grille indépendante de l’interface.

## Fonctionnalités initiales

- Charger une grille.
- Vérifier sa cohérence.
- Identifier les cases vides.
- Obtenir une ligne.
- Obtenir une colonne.
- Obtenir un bloc.
- Calculer les valeurs possibles d’une cellule.
- Déterminer si la grille est complète.

## Tests

Ajouter progressivement des tests sur :

- lignes ;
- colonnes ;
- blocs ;
- candidats ;
- grilles invalides.

## Résultat

Un moteur Sudoku utilisable indépendamment de l’application web.

---

# MILESTONE 5 — Intégration frontend / moteur

## Objectif

Exposer le moteur via FastAPI.

## Étapes

Créer progressivement des endpoints pour :

- vérifier une grille ;
- calculer les candidats ;
- analyser une position.

Côté frontend :

- typer les réponses ;
- centraliser les appels API ;
- gérer les erreurs HTTP ;
- utiliser `URL` et `URLSearchParams` pour construire proprement les requêtes.

Ne pas appeler le backend pour chaque interaction simple.

Répartition recommandée :

```text
Frontend
├── état de la partie
├── sélection
├── interactions
├── affichage
└── validation immédiate simple

Backend
├── analyse
├── calcul algorithmique
├── résolution
└── génération
```

## Résultat

Le frontend sait utiliser le moteur Python pour les opérations plus complexes.

---

# MILESTONE 6 — Premier solveur

## Objectif

Pouvoir résoudre une grille sans encore connaître les techniques humaines.

## Étapes

- Choisir une stratégie de recherche.
- Essayer les valeurs possibles d’une case.
- Continuer récursivement.
- Revenir en arrière lorsqu’une contradiction apparaît.
- Retourner une solution.

## Cas à gérer

- grille valide avec solution ;
- grille invalide ;
- grille sans solution ;
- grille déjà résolue.

## Étape supplémentaire

Pouvoir compter les solutions afin de déterminer si une grille possède :

- zéro solution ;
- une solution unique ;
- plusieurs solutions.

## Résultat

Le moteur peut résoudre et analyser l’unicité d’une grille.

---

# MILESTONE 7 — Génération de grilles

## Objectif

Créer automatiquement des Sudokus.

## Étapes

### 7.1 Générer une solution complète

Créer une grille complète et valide.

### 7.2 Retirer des indices

Supprimer progressivement des chiffres.

### 7.3 Vérifier l’unicité

Après chaque suppression importante :

- demander au solveur combien de solutions existent ;
- conserver la suppression uniquement si la solution reste unique.

### 7.4 Génération utilisable

Créer une API permettant de demander une nouvelle partie.

## Première approche de difficulté

Ne pas chercher immédiatement une difficulté parfaite.

Commencer éventuellement avec :

- nombre approximatif d’indices ;
- contraintes simples de génération.

## Résultat

Un bouton « Nouvelle partie » peut produire un vrai Sudoku valide avec une solution unique.

---

# MILESTONE 8 — Gestion complète d’une partie

## Objectif

Rendre l’application confortable à utiliser sur une vraie session.

## Étapes

- Undo.
- Redo.
- Historique des actions.
- Chronomètre.
- Pause.
- Réinitialisation.
- Sauvegarde locale.
- Reprise d’une partie.
- Détection de victoire.

## Modèle d’action

Commencer à réfléchir aux actions comme :

```text
Placer un chiffre
Effacer un chiffre
Ajouter une note
Supprimer une note
```

Cela facilitera naturellement l’undo/redo.

## Résultat

Une application de Sudoku complète côté expérience de jeu.

---

# MILESTONE 9 — Apprentissage des techniques Sudoku

## Objectif

Faire évoluer le projet en même temps que la compréhension du Sudoku.

Le principe :

```text
Apprendre une technique
        ↓
Comprendre exactement sa règle
        ↓
Trouver une manière algorithmique de la détecter
        ↓
L’implémenter
        ↓
L’utiliser dans une grille réelle
```

## Ordre possible

1. Naked Single.
2. Hidden Single.
3. Locked Candidates.
4. Naked Pair.
5. Hidden Pair.
6. X-Wing.
7. Techniques plus avancées selon l’envie.

L’ordre exact peut évoluer avec ton apprentissage.

## Architecture recommandée

Chaque technique doit idéalement pouvoir répondre :

> « Est-ce que je trouve une prochaine déduction dans cette grille ? »

Et retourner une information structurée sur :

- la technique utilisée ;
- les cellules concernées ;
- les candidats concernés ;
- les éliminations ;
- éventuellement la valeur à placer.

## Résultat

Le moteur commence à raisonner de manière proche d’un joueur humain.

---

# MILESTONE 10 — Solveur explicable

## Objectif

Ne plus seulement produire une solution, mais une succession d’étapes.

Au lieu de :

```text
Voici la grille résolue.
```

Le moteur peut produire :

```text
Étape 1 : Hidden Single
Étape 2 : Naked Pair
Étape 3 : élimination de candidats
Étape 4 : nouvelle valeur
```

## Étapes

- Définir un modèle générique de « déduction ».
- Faire retourner une déduction par chaque technique.
- Créer un solveur qui cherche la prochaine technique applicable.
- Appliquer ou non la déduction.
- Répéter jusqu’à résolution ou blocage.

## Fallback

Le solveur algorithmique classique peut rester disponible pour :

- terminer une grille ;
- vérifier une solution ;
- tester l’unicité.

Mais il doit rester distinct du solveur logique.

## Résultat

Deux solveurs complémentaires :

```text
Solveur logique
→ explique comment résoudre

Solveur algorithmique
→ trouve une solution efficacement
```

---

# MILESTONE 11 — Système d’indices pédagogique

## Objectif

Utiliser le solveur explicable pour aider à apprendre.

## Niveaux d’indice

### Niveau 1

Indice vague :

> Regarde cette colonne.

### Niveau 2

Réduire la zone :

> Regarde les candidats du chiffre 7.

### Niveau 3

Mettre en évidence les cellules concernées.

### Niveau 4

Nommer la technique :

> Il s’agit d’un Hidden Single.

### Niveau 5

Expliquer la logique.

### Niveau 6

Appliquer la déduction.

## Interface

Prévoir :

- surbrillances ;
- animations ;
- mise en évidence des candidats ;
- affichage progressif du raisonnement.

## Résultat

sudoQ devient aussi un outil d’apprentissage du Sudoku.

---

# MILESTONE 12 — Analyse et difficulté

## Objectif

Évaluer une grille à partir de son raisonnement réel.

Le solveur logique analyse :

- quelles techniques ont été nécessaires ;
- combien de fois elles ont été utilisées ;
- à quel moment la grille est devenue difficile.

## Exemple de résultat

```text
Naked Singles : 28
Hidden Singles : 12
Locked Candidates : 4
Naked Pairs : 2
X-Wing : 1
```

## Système de difficulté

Construire progressivement une définition personnelle :

```text
Easy
→ techniques fondamentales

Medium
→ interactions et techniques intermédiaires

Hard
→ paires et raisonnements plus complexes

Expert
→ techniques avancées
```

Ne pas considérer le nombre d’indices comme seul indicateur de difficulté.

## Résultat

Le générateur peut progressivement produire des grilles correspondant à des niveaux de raisonnement.

---

# MILESTONE 13 — Génération basée sur la difficulté

## Objectif

Faire communiquer le générateur et le solveur logique.

Pipeline :

```text
Créer une solution
        ↓
Retirer des indices
        ↓
Vérifier l’unicité
        ↓
Analyser avec le solveur logique
        ↓
Évaluer la difficulté
        ↓
Conserver ou modifier la grille
```

## Résultat

Possibilité de demander :

- une grille facile ;
- une grille intermédiaire ;
- une grille difficile.

La difficulté repose progressivement sur le raisonnement réellement nécessaire.

---

# MILESTONE 14 — Dessin de chiffres

## Objectif

Permettre à l’utilisateur de dessiner un chiffre.

## Frontend

- Créer une zone de dessin.
- Gérer souris et tactile.
- Transformer le dessin en image ou données exploitables.

## Backend

Pipeline initial :

```text
Dessin
  ↓
Prétraitement
  ↓
Normalisation
  ↓
Modèle de reconnaissance
  ↓
Chiffre prédit
  ↓
Score de confiance
```

## Étapes d’apprentissage possibles

1. Utiliser un modèle existant.
2. Comprendre le format d’entrée.
3. Prétraiter les images.
4. Utiliser un dataset classique.
5. Entraîner un modèle.
6. Créer progressivement un dataset personnel.

## Résultat

L’utilisateur peut dessiner un chiffre pour le placer dans la grille.

---

# MILESTONE 15 — Reconnaissance de l’écriture personnelle

## Objectif

Aller plus loin que la simple reconnaissance générique.

## Idée

Collecter des exemples :

```text
0 → plusieurs dessins
1 → plusieurs dessins
2 → plusieurs dessins
...
9 → plusieurs dessins
```

Puis :

- constituer un dataset ;
- entraîner ou ajuster un modèle ;
- comparer les performances avec un modèle générique.

## Questions intéressantes

- Combien d’exemples sont nécessaires ?
- Quelles transformations améliorent la reconnaissance ?
- Quelles confusions sont fréquentes ?
- Un modèle générique reconnaît-il mieux ou moins bien l’écriture personnelle ?

## Résultat

Une exploration complète de machine learning appliquée à une fonctionnalité concrète.

---

# MILESTONE 16 — Import d’un Sudoku à partir d’une image

## Objectif

Reconstruire une grille à partir d’une photo ou d’un scan.

Pipeline :

```text
Image
  ↓
Détection de la grille
  ↓
Correction de perspective
  ↓
Extraction du carré Sudoku
  ↓
Découpage en 81 cellules
  ↓
Détection / reconnaissance des chiffres
  ↓
Reconstruction de la grille
```

## Sujets à explorer

- traitement d’image ;
- contours ;
- transformations géométriques ;
- correction de perspective ;
- segmentation ;
- reconnaissance de chiffres.

## Validation avec le moteur

Le moteur Sudoku peut aider à détecter les erreurs de reconnaissance :

- conflit évident ;
- grille impossible ;
- candidat peu probable.

## Résultat

Une photo devient une grille importable dans sudoQ.

---

# MILESTONE 17 — Raffinement et expérimentation

Cette milestone n’a pas forcément de fin précise.

Pistes possibles :

- statistiques de jeu ;
- historique des techniques utilisées ;
- visualisation du raisonnement ;
- comparaison entre solveur humain et solveur algorithmique ;
- benchmark des solveurs ;
- optimisation avec bitmasks ;
- exploration d’autres algorithmes ;
- exact cover ;
- Algorithm X ;
- Dancing Links ;
- génération avec contraintes spécifiques ;
- interface mobile ;
- thèmes ;
- animations ;
- partage ou export de grilles.

---

# Vue d’ensemble

```text
M0  Fondation
│
M1  Grille jouable
│
M2  Validation des règles
│
M3  Notes et candidats
│
M4  Moteur Python
│
M5  API React ↔ moteur
│
M6  Solveur algorithmique
│
M7  Générateur
│
M8  Expérience de jeu complète
│
M9  Techniques Sudoku
│
M10 Solveur explicable
│
M11 Indices pédagogiques
│
M12 Analyse de difficulté
│
M13 Génération par difficulté
│
M14 Dessin de chiffres
│
M15 Reconnaissance personnalisée
│
M16 Import depuis une image
│
M17 Expérimentation et approfondissement
```

# Priorité actuelle

L’objectif immédiat est de terminer **MILESTONE 1** :

- terminer l’affichage de la grille ;
- finaliser les bordures des blocs 3 × 3 ;
- définir proprement le composant `Cell` ;
- gérer la sélection ;
- stocker la grille dans un state ;
- permettre l’entrée et l’effacement des chiffres ;
- distinguer les indices initiaux des chiffres du joueur.

Ne pas anticiper l’architecture des techniques avancées ou de la reconnaissance d’image. Les besoins réels du projet apparaîtront progressivement.

Le principe directeur de sudoQ :

> Chaque nouvelle fonctionnalité doit être l’occasion d’apprendre un nouveau concept, tout en laissant le projet fonctionnel à chaque milestone.
