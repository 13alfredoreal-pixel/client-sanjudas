# Deployment — client-sanjudas

## Producción

| Recurso      | Valor                                                              |
| ------------ | ------------------------------------------------------------------ |
| Host         | Firebase Hosting                                                   |
| Proyecto     | `biblioteca-sjt` (`.firebaserc`)                                   |
| Build output | `dist/`                                                            |
| URL          | https://biblioteca-sjt.web.app                                     |
| API          | rewrite `/api/**` → `https://base-rho-lyart.vercel.app/api/:splat` |

## Build & deploy

```bash
# Prod build: same-origin API path
VITE_API_URL=/api/v1 pnpm build
firebase deploy --only hosting
```

Local:

```bash
cp .env.example .env   # VITE_API_URL=http://localhost:3000/api/v1
pnpm dev
```

## Checklist post-deploy

- [ ] `/login` carga
- [ ] Login + catálogo OK (`/api/v1`)
- [ ] Viewer PDF (signed-url) OK
- [ ] Admin Ver PDF / upload OK
- [ ] Logout limpia cookie refresh
- [ ] Refresh token same-origin vía rewrite

## Preview channels

Añade el origin preview al CORS allowlist del **server** antes de probar auth con cookies.
