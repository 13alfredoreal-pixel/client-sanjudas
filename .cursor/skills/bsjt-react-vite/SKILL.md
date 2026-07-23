---
name: bsjt-react-vite
description: >-
  Implementa páginas, hooks, rutas y apiService en client-sanjudas (React/Vite).
  Usar al crear vistas, conectar endpoints, auth UI o el viewer PDF.
---

# BSJT — React + Vite

## Árbol útil

```
src/pages/        LibraryPage, BookViewerPage, AuthPage, AdminPage, …
src/hooks/        useLibrary, useLogin, useAdmin, useBookViewer, …
src/components/   auth (Protected/Admin/Login/Register), layout, ui
src/services/     apiService.js
src/routes/       AppRoutes.jsx
```

## Nueva pantalla

1. Page + hook si hay fetch/estado.
2. Ruta en `AppRoutes.jsx` (Protected/Admin según rol).
3. Funciones en `apiService.js` alineadas a `docs/API-CONSUMER.md`.
4. Si el endpoint no existe → issue/PR en server primero.

## Auth pattern

- Login/register → guardar token → cargar perfil.
- Interceptor refresh en `apiService.js` (cola de reintentos).

## Checklist

- [ ] `npm run lint` / `npm run build`
- [ ] Rutas protegidas correctas
- [ ] Sin secretos; `withCredentials` si usa cookies
- [ ] `CURRENT-STATE.md` / `API-CONSUMER.md` si cambió estructura o consumo

## Refs

- `AGENTS.md`
- `.cursor/rules/react-vite.mdc`
- `docs/API-CONSUMER.md`
- `docs/CURRENT-STATE.md`
