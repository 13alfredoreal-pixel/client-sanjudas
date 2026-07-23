# API Consumer — client-sanjudas

Cómo el SPA consume el contrato del server. Canon: [server API-CONTRACT](https://github.com/13alfredoreal-pixel/server-sanJudas/blob/master/docs/API-CONTRACT.md) — prefijo **`/api/v1`**.

## Cliente HTTP

Archivo: `src/services/apiService.js`

- Axios `baseURL` = `import.meta.env.VITE_API_URL` (default `/api/v1`)
- Local: `http://localhost:3000/api/v1`
- Prod (Firebase): `/api/v1` + rewrite Hosting → Vercel (same-origin cookies)
- `withCredentials: true` (refresh cookie)
- Request interceptor: `Authorization: Bearer ${localStorage.token}`
- Response interceptor: en 401 intenta `POST /auth/refresh-token` y reintenta cola

Helpers: `getImageUrl` (solo HTTPS Cloudinary), `getPdfProxyUrl`, `getSignedPdfUrl`, `logoutUser`.

## Mapa página → API

| UI               | Funciones apiService                                                                      | Endpoints                                       |
| ---------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Auth             | `loginUser`, `registerUser`, `logoutUser`                                                 | `/auth/login`, `/auth/register`, `/auth/logout` |
| Bootstrap sesión | `getProfileService`                                                                       | `/users/me`                                     |
| Library          | `getBooks`, `getCategoriesService`                                                        | `/books`, `/categories`                         |
| Viewer           | `getBookById`, `getSignedPdfUrl`, `updateReadingProgressService`, restore vía `/users/me` | books + signed-url + reading-progress           |
| Favoritos        | `getFavoritesService`, `toggleFavoriteService`                                            | favorites / toggle                              |
| Reviews          | `getReviewsService`, `addReviewService`, `deleteReviewService`                            | `/reviews`                                      |
| Profile/Settings | `updateProfileService`, `updatePasswordService`                                           | update / update-password                        |
| Admin            | `uploadBook`, `deleteBook`, categories, users, analytics, Ver PDF → signed-url            | books/categories/users/analytics                |

## Auth UX

1. Login OK → guardar `token` → navegar `/`.
2. Logout → `POST /auth/logout` + limpiar `localStorage`.
3. Sin user → `ProtectedRoute` → `/login`.
4. Admin → `AdminRoute` exige `role === 'ADMIN_ROLE'`.

## PDFs

- Nuevos libros: Supabase vía `GET /books/:id/signed-url` (no usar `book.pdfUrl` vacío).
- Progreso: body `{ bookId, page }`; al abrir, restaurar `lastPage` desde `GET /users/me`.

## Env

Ver `.env.example`. CI build usa `VITE_API_URL=…/api/v1`.

## Cambio de contrato

1. Server actualiza `API-CONTRACT.md` + API.
2. Actualizar este archivo + `apiService` / hooks.
3. Enlazar PRs (`Related PR`).
