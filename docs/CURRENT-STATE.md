# Current state — client-sanjudas

Inventario **as-is** para refactor. Actualizar cuando cambie la estructura real.

## Layout actual

```
src/
  pages/          Library, BookViewer, Auth, Profile, Settings, Admin, NotFound
  components/     auth, layout, ui, common
  hooks/          useLibrary, useLogin, useAdmin, useBookViewer, …
  routes/         AppRoutes.jsx
  services/       apiService.js
  assets/img/
public/
firebase.json
.firebaserc       → proyecto biblioteca-sjt
```

## Rutas UI

| Path | Guard |
|------|--------|
| `/login` | Público |
| `/`, `/libro/:id`, `/perfil`, `/ajustes` | `ProtectedRoute` |
| `/admin` | `AdminRoute` (`ADMIN_ROLE`) |

## Deuda / leftovers conocidos

| Ítem | Notas |
|------|-------|
| `hooks/usePosts.js`, `useCreatePost.js`, `usePostDetail.js` | Legado posts; sin UI activa |
| `package.json` script `repair` | Apunta a `src/components/posts` (carpeta inexistente) |
| `apiService.js` `baseURL` | Hardcode a Vercel; `.env.example` define `VITE_API_URL` aún no cableada |
| Skills `.agents/skills/` Firebase | Genéricos; auth real es JWT Express, no Firebase Auth |
| Timeout uploads | 120s en Axios (necesario para PDFs grandes) |

## Invariantes a preservar en un refactor

1. Frontera: solo HTTP vía `apiService` (o sucesor); sin Mongo/Cloudinary en browser.
2. Auth: access en `localStorage` + refresh cookie (`withCredentials`); no Firebase Auth de sesión.
3. Guards `ProtectedRoute` / `AdminRoute`.
4. Consumo alineado a [API-CONSUMER.md](./API-CONSUMER.md) / contrato del server.
5. Firebase Hosting build → `dist/`; rewrite `/api/**` si se mantiene.
6. npm.

## Qué puede cambiar libremente (con PR BSJT)

- Estructura folders (features, capas), TypeScript, state management.
- Sustituir hardcode por `import.meta.env.VITE_API_URL`.
- Borrar hooks/scripts posts.
- Design system / Tailwind tokens.
- Tests, lint stricter, CI.

Tras cambios de rutas o contrato de consumo, actualizar `AGENTS.md`, rules/skills y este documento.
