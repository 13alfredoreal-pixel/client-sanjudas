# AGENTS.md — client-sanjudas

Instrucciones del repositorio **SPA Biblioteca Virtual SJT**. Léelas antes de implementar. Toda la documentación versionada vive **dentro de este repo** (o del server hermano); no hay docs en una carpeta padre.

## Proyecto

Frontend de la biblioteca digital institucional San Judas Tadeo: login/registro, catálogo, viewer PDF, favoritos, progreso, reseñas, perfil y panel admin.

**No es monorepo.** La API es otro remoto. Contrato canónico en el server (`docs/API-CONTRACT.md`); consumo local: [docs/API-CONSUMER.md](docs/API-CONSUMER.md).

**Repo hermano (API):** [server-sanJudas](https://github.com/13alfredoreal-pixel/server-sanJudas) — clone aparte; PRs separados; enlazar con `Related PR` si el cambio cruza.

### Ownership

- Editar solo este repo salvo coordinación con el server.
- Si falta un endpoint o cambia el contrato: issue/PR en server primero (o en paralelo con contrato actualizado).
- Nunca Mongo, Cloudinary SDK ni secretos de Vercel en el browser.

## Stack

| Capa    | Tecnología                   | Ruta                           |
| ------- | ---------------------------- | ------------------------------ |
| UI      | React 19, Vite 7, Tailwind 4 | `src/`                         |
| Routing | React Router 7               | `src/routes/AppRoutes.jsx`     |
| HTTP    | Axios (`withCredentials`)    | `src/services/apiService.js`   |
| PDF     | react-pdf / pdfjs-dist       | `src/pages/BookViewerPage.jsx` |
| Deploy  | Firebase Hosting             | `firebase.json`, `.firebaserc` |

**Gestor de paquetes:** solo **pnpm** (`pnpm install`). No usar npm/yarn.

## Estructura

```
src/
  pages/         Library, BookViewer, Auth, Profile, Settings, Admin
  components/    auth, layout, ui, common
  hooks/         useLibrary, useLogin, useAdmin, …
  routes/        AppRoutes.jsx
  services/      apiService.js
public/
docs/
.cursor/rules/
.cursor/skills/
.agents/skills/  → skills Firebase genéricos (sobre todo Hosting)
```

Antes de un refactor: leer [docs/CURRENT-STATE.md](docs/CURRENT-STATE.md) (invariantes + deuda).

## Comandos esenciales

```bash
pnpm install
pnpm dev           # Vite :5173
pnpm build
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
pnpm preview
```

### Calidad de código (local)

- **Husky** `pre-commit`: lint-staged (ESLint + Prettier en staged).
- **Husky** `commit-msg`: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `ci:`, …).
- Ejemplo: `fix(api): wire VITE_API_URL`

## Auth (importante)

- **No** uses Firebase Auth para sesión de app.
- Access token en `localStorage` (`token`); refresh vía cookie HttpOnly contra la API.
- Rutas: `ProtectedRoute` / `AdminRoute` (`ADMIN_ROLE`).

## Reglas de frontera

- El client **solo** habla con la API REST (`/api`).
- Nunca Mongo, Cloudinary SDK ni secretos de Vercel en el browser.
- Base URL: hoy hardcodeada en `apiService.js` a Vercel; preferir `import.meta.env.VITE_API_URL` (ver `.env.example`).

## Workflow BSJT (obligatorio)

1. Issue: `[BSJT-XXX] Descripción` en **este** repo.
2. Rama = solo el ID: `BSJT-012`.
3. PR: `[BSJT-012] …` + `Closes #<n>`.
4. Si cambia el contrato: coordinar PR en server y actualizar `API-CONSUMER.md`.

Ver [docs/GITHUB-WORKFLOW.md](docs/GITHUB-WORKFLOW.md).

## Rutas UI

| Path                                     | Acceso       |
| ---------------------------------------- | ------------ |
| `/login`                                 | Público      |
| `/`, `/libro/:id`, `/perfil`, `/ajustes` | Autenticado  |
| `/admin`                                 | `ADMIN_ROLE` |

## Índice Cursor

| Tipo   | Path                                                                                                  |
| ------ | ----------------------------------------------------------------------------------------------------- |
| Rules  | `.cursor/rules/bsjt-project.mdc`, `react-vite.mdc`, `firebase-hosting.mdc`                            |
| Skills | `.cursor/skills/bsjt-react-vite/`, `bsjt-ui-design/`, `bsjt-library-domain/`, `bsjt-github-workflow/` |
| Docs   | `docs/`                                                                                               |

Skills en `.agents/skills/` (Firebase): útiles para Hosting; no sustituyen el dominio JWT/Express.

## Convenciones

- Docs en español; código en inglés.
- Sin secretos en el diff. Preferir cambios acotados; refactor amplio solo con pedido explícito + invariantes de `CURRENT-STATE.md`.
- **ROADMAP pendiente** (stub): no priorizar por etapas B0–B6 inventadas.
