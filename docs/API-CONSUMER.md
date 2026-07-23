# API Consumer — client-sanjudas

Cómo el SPA consume el contrato del server. Canon de endpoints: [server API-CONTRACT](https://github.com/13alfredoreal-pixel/server-sanJudas/blob/master/docs/API-CONTRACT.md).

## Cliente HTTP

Archivo: `src/services/apiService.js`

- Axios `baseURL` → API `/api`
- `withCredentials: true` (refresh cookie)
- Request interceptor: `Authorization: Bearer ${localStorage.token}`
- Response interceptor: en 401 intenta `POST /auth/refresh-token` y reintenta cola

Helpers: `getImageUrl`, `getPdfUrl`, `getPdfProxyUrl`, `getSignedPdfUrl`.

## Mapa página → API

| UI               | Funciones apiService                                                 | Endpoints                                           |
| ---------------- | -------------------------------------------------------------------- | --------------------------------------------------- |
| Auth             | `loginUser`, `registerUser`                                          | `/auth/login`, `/auth/register`                     |
| Bootstrap sesión | `getProfileService`                                                  | `/users/me`                                         |
| Library          | `getBooks`, `getCategoriesService`                                   | `/books`, `/categories`                             |
| Viewer           | `getBookById`, `getSignedPdfUrl`, `updateReadingProgressService`     | `/books/:id`, signed-url, `/users/reading-progress` |
| Favoritos        | `getFavoritesService`, `toggleFavoriteService`                       | `/users/favorites`, toggle                          |
| Reviews          | `getReviewsService`, `addReviewService`, `deleteReviewService`       | `/reviews`                                          |
| Profile/Settings | `updateProfileService`, `updatePasswordService`                      | `/users/update`, `/users/update-password`           |
| Admin            | `uploadBook`, `deleteBook`, categories, users, `getAnalyticsService` | books/categories/users/analytics                    |

## Auth UX

1. Login OK → guardar `token` → navegar `/`.
2. Sin user → `ProtectedRoute` → `/login`.
3. Admin → `AdminRoute` exige `role === 'ADMIN_ROLE'`.

## Errores

- Toast con `react-hot-toast` en hooks.
- 401 tras fallo de refresh → limpiar sesión y mandar a login.

## Env

Preferir `import.meta.env.VITE_API_URL` (ver `.env.example`). Hoy el default puede seguir hardcodeado a Vercel — ver [CURRENT-STATE.md](./CURRENT-STATE.md).

## Cambio de contrato

1. Server actualiza `API-CONTRACT.md` + API.
2. Actualizar este archivo + `apiService` / hooks.
3. Enlazar PRs (`Related PR`).

ROADMAP de producto: stub pendiente; no usarlo como guía.
