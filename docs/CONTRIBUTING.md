# Contributing — client-sanjudas

## Antes de codear

1. Leer [AGENTS.md](../AGENTS.md) y [CURRENT-STATE.md](./CURRENT-STATE.md).
2. Issue `[BSJT-XXX]` + rama `BSJT-XXX`.
3. Si consume API → [API-CONSUMER.md](./API-CONSUMER.md) y contrato del server.
4. [ROADMAP.md](./ROADMAP.md) está **pendiente** — no bloquear por etapas B*.

## Local

```bash
pnpm install
pnpm dev
pnpm lint
pnpm format:check
pnpm build
```

## PR

- Título `[BSJT-XXX] …`
- `Closes #N`
- Template `.github/PULL_REQUEST_TEMPLATE.md`
- CI verde
- Si hubo refactor de estructura: actualizar `CURRENT-STATE.md` / `AGENTS.md`

## Estilo

- **pnpm** only
- Docs ES / código EN
- Preferir cambios acotados; refactor amplio solo con pedido explícito + invariantes
- **ESLint** + **Prettier** (ver `eslint.config.js`, `.prettierrc.json`)
- Commits: **Conventional Commits** (Husky `commit-msg`). Ej.: `fix(auth): call logout endpoint`
- Antes de push: `pnpm lint && pnpm format:check`

Detalle: [GITHUB-WORKFLOW.md](./GITHUB-WORKFLOW.md).
