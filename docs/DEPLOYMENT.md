# Deployment — client-sanjudas

## Producción

| Recurso | Valor |
|---------|-------|
| Host | Firebase Hosting |
| Proyecto | `biblioteca-sjt` (`.firebaserc`) |
| Build output | `dist/` |
| URL | https://biblioteca-sjt.web.app |

## Build & deploy

```bash
npm ci
npm run build
firebase deploy --only hosting
```

## Rewrites

`firebase.json` reescribe `/api/**` hacia `https://base-rho-lyart.vercel.app/api/:splat`.

El SPA también llama la API por URL absoluta en `apiService.js` (hoy Vercel directo).

## Checklist post-deploy

- [ ] `/login` carga
- [ ] Login + catálogo OK
- [ ] Viewer PDF OK
- [ ] Admin upload OK (timeouts largos)
- [ ] Cookies/CORS desde el dominio Firebase

## Preview channels

Si usas canales preview de Firebase, añade el origin al CORS allowlist del **server** antes de probar auth con cookies.
