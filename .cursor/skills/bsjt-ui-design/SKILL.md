---
name: bsjt-ui-design
description: >-
  Diseño UI de la biblioteca SJT (navbar, auth forms, catálogo, viewer PDF,
  admin). Usar al ajustar layout, Tailwind, componentes visuales o UX de lectura.
---

# BSJT — UI Design

## Superficies

| Área | Archivos clave |
|------|----------------|
| Nav | `components/layout/LibraryNavbar.jsx` |
| Auth | `LoginForm`, `RegisterForm`, `AuthPage` |
| Catálogo | `LibraryPage` + `useLibrary` |
| Lectura | `BookViewerPage` + `useBookViewer` |
| Admin | `AdminPage` + `useAdmin` |
| Reviews | `components/common/ReviewsSection.jsx` |

## Principios

- Biblioteca institucional (SJT): claridad y lectura, no dashboard genérico.
- Reutilizar Headless UI / Heroicons ya en el proyecto.
- Toasts: `react-hot-toast`.
- Mobile-friendly: catálogo y viewer usables en viewport estrecho.
- Evitar reintroducir UI de “posts” legado.

## Accesibilidad mínima

- Forms con labels; errores visibles.
- Admin solo vía `AdminRoute` (no ocultar solo con CSS).

## Refs

- `AGENTS.md`
- `.cursor/rules/react-vite.mdc`
