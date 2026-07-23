# client-sanjudas — Biblioteca Virtual SJT

SPA de la biblioteca digital institucional **San Judas Tadeo**.

|              |                                                                           |
| ------------ | ------------------------------------------------------------------------- |
| API hermana  | [server-sanJudas](https://github.com/13alfredoreal-pixel/server-sanJudas) |
| Agentes      | [AGENTS.md](./AGENTS.md)                                                  |
| Consumo API  | [docs/API-CONSUMER.md](./docs/API-CONSUMER.md)                            |
| Estado as-is | [docs/CURRENT-STATE.md](./docs/CURRENT-STATE.md)                          |

**Dos repos independientes** (no monorepo). Clonar ambos si desarrollas full-stack:

```bash
git clone https://github.com/13alfredoreal-pixel/client-sanjudas.git
git clone https://github.com/13alfredoreal-pixel/server-sanJudas.git
```

| Capa            | URL prod                          |
| --------------- | --------------------------------- |
| SPA (este repo) | https://biblioteca-sjt.web.app    |
| API             | https://base-rho-lyart.vercel.app |

## Stack

React 19 · Vite 7 · Tailwind CSS 4 · React Router 7 · Axios · react-pdf · Headless UI · Firebase Hosting

## Quickstart

```bash
cp .env.example .env   # VITE_API_URL=http://localhost:3000/api/v1
pnpm install
pnpm dev
```

Abre `http://localhost:5173`.

Para API local, arranca también server-sanJudas (`pnpm dev` en `:3000`).

### API URL

`src/services/apiService.js` usa `import.meta.env.VITE_API_URL` (canónico `/api/v1`).

- Local: `http://localhost:3000/api/v1`
- Prod: `/api/v1` + rewrite Firebase → Vercel

CORS del server permite `localhost:5173`.

## Scripts

| Comando             | Descripción         |
| ------------------- | ------------------- |
| `pnpm dev`          | Vite HMR            |
| `pnpm build`        | Build → `dist/`     |
| `pnpm preview`      | Preview del build   |
| `pnpm lint`         | ESLint              |
| `pnpm format`       | Prettier write      |
| `pnpm format:check` | Prettier check (CI) |

## Deploy

Firebase Hosting proyecto `biblioteca-sjt` → https://biblioteca-sjt.web.app

```bash
pnpm build
firebase deploy --only hosting
```

Detalle: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).

## Contribución

Prefijo **BSJT**. Ver [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) y [docs/GITHUB-WORKFLOW.md](./docs/GITHUB-WORKFLOW.md).

Antes de refactor: [docs/CURRENT-STATE.md](./docs/CURRENT-STATE.md). ROADMAP aún pendiente.
