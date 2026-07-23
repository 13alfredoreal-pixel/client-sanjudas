---
name: bsjt-library-domain
description: >-
  Flujos de dominio biblioteca en el client SJT (catálogo, PDF, favoritos,
  reviews, admin). Usar al implementar UX de usuario/admin; el canon de datos
  vive en server-sanJudas.
---

# BSJT Client — Dominio (UI)

## Canon

Modelos y endpoints: repo **server** → `docs/API-CONTRACT.md` y skill `bsjt-library-domain` del server.  
As-is UI: `docs/CURRENT-STATE.md`. ROADMAP: stub pendiente.

Este skill cubre solo el **mapeo UI**.

## Flujos usuario

| Flujo          | UI               | API (vía apiService)                           |
| -------------- | ---------------- | ---------------------------------------------- |
| Login/registro | AuthPage         | `/auth/login`, `/auth/register`                |
| Catálogo       | LibraryPage      | `/books`, `/categories`                        |
| Leer libro     | BookViewerPage   | `/books/:id`, pdf/signed-url, reading-progress |
| Favoritos      | Library/Profile  | `/users/favorites`, toggle-favorite            |
| Reviews        | ReviewsSection   | `/reviews`                                     |
| Perfil/ajustes | Profile/Settings | `/users/me`, update, password                  |

## Flujos admin

| Flujo              | UI        | API                       |
| ------------------ | --------- | ------------------------- |
| Subir/borrar libro | AdminPage | POST/DELETE `/books`      |
| Categorías         | AdminPage | POST/DELETE `/categories` |
| Usuarios           | AdminPage | promote, delete, list     |
| Stats              | AdminPage | `/analytics`              |

## Roles

- `USER_ROLE` — rutas protegidas normales.
- `ADMIN_ROLE` — `/admin` vía `AdminRoute`.
