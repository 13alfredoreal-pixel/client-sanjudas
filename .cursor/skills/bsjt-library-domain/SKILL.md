---
name: bsjt-library-domain
description: >-
  Flujos de dominio biblioteca en el client SJT (catálogo, PDF, favoritos,
  reviews, admin). Usar al implementar UX de usuario/admin; el canon de datos
  vive en server-sanJudas.
---

# BSJT Client — Dominio (UI)

## Canon

Modelos y endpoints: repo **server** → `docs/API-CONTRACT.md` (prefijo **`/api/v1`**).  
As-is UI: `docs/CURRENT-STATE.md`.

Este skill cubre solo el **mapeo UI**.

## Flujos usuario

| Flujo                 | UI               | API (vía apiService bajo /api/v1)                                        |
| --------------------- | ---------------- | ------------------------------------------------------------------------ |
| Login/registro/logout | AuthPage         | `/auth/login`, `/auth/register`, `/auth/logout`                          |
| Catálogo              | LibraryPage      | `/books`, `/categories`                                                  |
| Leer libro            | BookViewerPage   | `/books/:id`, signed-url, reading-progress (+ restore desde `/users/me`) |
| Favoritos             | Library/Profile  | `/users/favorites`, toggle-favorite                                      |
| Reviews               | ReviewsSection   | `/reviews`                                                               |
| Perfil/ajustes        | Profile/Settings | `/users/me`, update, password                                            |

## Flujos admin

| Flujo              | UI        | API                            |
| ------------------ | --------- | ------------------------------ |
| Subir/borrar libro | AdminPage | POST/DELETE `/books`           |
| Ver PDF            | AdminPage | signed-url (no `pdfUrl` vacío) |
| Categorías         | AdminPage | POST/DELETE `/categories`      |
| Usuarios           | AdminPage | promote, delete, list          |
| Stats              | AdminPage | `/analytics`                   |

## Roles

- `USER_ROLE` — rutas protegidas normales.
- `ADMIN_ROLE` — `/admin` vía `AdminRoute`.
