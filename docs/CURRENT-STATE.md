# Current state — client-sanjudas

Inventario **as-is** tras BSJT-008 (pnpm/tooling) + BSJT-007 (alineación API).

## Layout actual

```
src/
  pages/          Library, BookViewer, Auth, Profile, Settings, Admin, NotFound
  components/     auth, layout, ui, common
  hooks/          useLibrary, useLogin, useAdmin, useBookViewer, …
  routes/         AppRoutes.jsx
  services/       apiService.js  → VITE_API_URL (/api/v1)
public/
firebase.json     rewrite /api/** → Vercel + SPA fallback
pnpm-lock.yaml
```

## Tooling

- pnpm + ESLint + Prettier + Husky (lint-staged / commitlint)
- CI: lint + format:check + build

## Invariantes

1. Frontera: solo HTTP vía `apiService`; sin Mongo/Cloudinary SDK en browser.
2. Auth: access `localStorage` + refresh cookie; logout llama API; **no** Firebase Auth de sesión.
3. Guards `ProtectedRoute` / `AdminRoute`.
4. Prefijo API canónico **`/api/v1`** (contrato server).
5. PDFs: signed-url / proxy; avatares = URL Cloudinary absoluta.
6. Firebase Hosting `dist/` + rewrite `/api/**`.
7. **pnpm** only.

## Deuda restante

| Ítem                              | Notas                   |
| --------------------------------- | ----------------------- |
| Skills `.agents/skills/` Firebase | Ruido; auth real es JWT |
| Deploy Vercel server              | Aplazado en server      |
| Worker PDF unpkg                  | CDN externo             |

Auth real = JWT Express (skills Firebase no sustituyen el dominio).
