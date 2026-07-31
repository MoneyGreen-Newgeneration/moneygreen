# MoneyGreen2

Plateforme de microcrédit — React (frontend) + Node/Express/MongoDB/Socket.io (backend).

## Structure

```
backend/     API Express, Socket.io, modèles Mongoose
frontend/    Application React (Create React App)
```

Cette séparation reflète la structure de production (deux projets distincts,
déployés indépendamment).

## Installation

### Backend

```bash
cd backend
cp .env.example .env   # puis remplir les valeurs (Mongo, JWT, Cloudinary, email...)
npm install
npm run dev             # ou: npm start
```

### Frontend

```bash
cd frontend
cp .env.example .env   # ajuster REACT_APP_API_URL / REACT_APP_SOCKET_URL si besoin
npm install
npm start
```

Par défaut, sans fichier `.env`, le frontend pointe vers `http://localhost:5000`
et le backend autorise le CORS depuis `http://localhost:3000` — donc tout
fonctionne immédiatement en développement local sans configuration.

## Déploiement

Pour la prod, définir dans le `.env` du backend :

```
CORS_ORIGIN=https://votre-domaine-frontend.com
```

et dans le `.env` du frontend (avant `npm run build`) :

```
REACT_APP_API_URL=https://votre-domaine-backend.com/api
REACT_APP_SOCKET_URL=https://votre-domaine-backend.com
```

## Corrections apportées

- **Bug critique** : le socket du Dashboard ne transmettait pas le token JWT,
  ce qui le faisait rejeter par le serveur et empêchait la mise à jour
  temps réel du statut des prêts. Corrigé.
- **URLs en dur** : toutes les URLs `localhost` du frontend sont maintenant
  centralisées dans `frontend/src/config.js` et pilotables via
  `REACT_APP_API_URL` / `REACT_APP_SOCKET_URL`.
- **CORS backend** : configurable via `CORS_ORIGIN` (accepte une liste
  séparée par des virgules), au lieu d'être figé sur `localhost:3000`.
- **Routes de prêt non protégées** : `/prets/*` exigent maintenant une
  authentification côté frontend (cohérent avec le backend qui exige déjà
  un utilisateur connecté pour créer un prêt).
- **`package.json` manquants** : le backend et le frontend avaient chacun
  besoin d'un `package.json` propre — recréés à partir des `require`/`import`
  réellement utilisés dans le code.
- **`transaction.controller.js`** : ajout d'une vérification défensive
  (rôle admin, validité de `userId`, `type`, `amount`) en plus de la
  protection déjà assurée par les middlewares de route.
- **Nettoyage** : suppression du titre/description par défaut de
  Create React App, remplacement du test de fumée générique
  ("learn react") par un test adapté à l'application réelle.

## Points restants à votre charge

- Renseigner les vraies valeurs des `.env` (Mongo URI, secret JWT,
  identifiants Cloudinary et email) — elles ne peuvent pas être devinées.
- `react-scripts` 5.0.1 n'étant pas officiellement compatible avec React 19,
  le frontend est fixé sur React 18.3 (stable et testé avec CRA 5).
