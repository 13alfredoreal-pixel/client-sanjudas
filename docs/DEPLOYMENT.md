# Deployment — client-sanjudas

## Producción

| Recurso      | Valor                                                                                     |
| ------------ | ----------------------------------------------------------------------------------------- |
| Host         | Firebase Hosting                                                                          |
| Proyecto     | `biblioteca-sjt` (`.firebaserc`)                                                          |
| Build output | `dist/`                                                                                   |
| URL          | https://biblioteca-sjt.web.app                                                            |
| API          | `https://server-san-judas-tau.vercel.app/api/v1` (quemado en el build vía `VITE_API_URL`) |

Hobby no usa dominio propio. El alias estable es el `*.vercel.app` del **proyecto** (hoy `server-san-judas-tau`). No usar URLs con hash de un deploy.

## Build & deploy

```bash
VITE_API_URL=https://server-san-judas-tau.vercel.app/api/v1 pnpm build
firebase deploy --only hosting
```

Local:

```bash
cp .env.example .env   # VITE_API_URL=http://localhost:3000/api/v1
pnpm dev
```

## Checklist post-deploy

- [ ] `/login` carga
- [ ] Login + catálogo OK
- [ ] Viewer PDF (signed-url) OK
- [ ] Admin Ver PDF / upload (signed upload para PDFs grandes) OK
- [ ] Logout limpia cookie refresh
