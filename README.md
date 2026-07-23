# client-sanjudas — Biblioteca Virtual SJT

SPA de la biblioteca digital institucional **San Judas Tadeo**.

| | |
|--|--|
| API hermana | [server-sanJudas](https://github.com/13alfredoreal-pixel/server-sanJudas) |
| Agentes | [AGENTS.md](./AGENTS.md) |
| Consumo API | [docs/API-CONSUMER.md](./docs/API-CONSUMER.md) |
| Estado as-is | [docs/CURRENT-STATE.md](./docs/CURRENT-STATE.md) |

**Dos repos independientes** (no monorepo). Clonar ambos si desarrollas full-stack:

```bash
git clone https://github.com/13alfredoreal-pixel/client-sanjudas.git
git clone https://github.com/13alfredoreal-pixel/server-sanJudas.git
```

| Capa | URL prod |
|------|----------|
| SPA (este repo) | https://biblioteca-sjt.web.app |
| API | https://base-rho-lyart.vercel.app |

## Stack

React 19 · Vite 7 · Tailwind CSS 4 · React Router 7 · Axios · react-pdf · Headless UI · Firebase Hosting

## Quickstart

```bash
cp .env.example .env   # opcional; ver nota de API URL abajo
npm install
npm run dev
```

Abre `http://localhost:5173`.

Para API local, arranca también server-sanJudas (`npm run dev`).

### API URL

Hoy `src/services/apiService.js` apunta por defecto a producción Vercel. Para local:

1. Define `VITE_API_URL=http://localhost:3000/api` en `.env` **y**
2. Usa esa variable en `apiService` (deuda documentada en [docs/CURRENT-STATE.md](./docs/CURRENT-STATE.md)), **o**
3. Apunta temporalmente el `baseURL` al server local.

CORS del server ya permite `localhost:5173`.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Vite HMR |
| `npm run build` | Build → `dist/` |
| `npm run preview` | Preview del build |
| `npm run lint` | ESLint |

## Deploy

Firebase Hosting proyecto `biblioteca-sjt` → https://biblioteca-sjt.web.app  

```bash
npm run build
firebase deploy --only hosting
```

Detalle: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).

## Contribución

Prefijo **BSJT**. Ver [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) y [docs/GITHUB-WORKFLOW.md](./docs/GITHUB-WORKFLOW.md).

Antes de refactor: [docs/CURRENT-STATE.md](./docs/CURRENT-STATE.md). ROADMAP aún pendiente.
