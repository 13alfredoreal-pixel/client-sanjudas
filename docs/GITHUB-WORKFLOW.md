# GitHub Workflow — client-sanjudas

Repositorio: [13alfredoreal-pixel/client-sanjudas](https://github.com/13alfredoreal-pixel/client-sanjudas)

Prefijo: **BSJT** (secuencia global compartida con server; issues viven aquí si son de UI).

## Nomenclatura

| Elemento | Formato |
|----------|---------|
| Issue | `[BSJT-012] Descripción` |
| Rama | `BSJT-012` |
| PR | `[BSJT-012] …` + `Closes #12` |

```bash
gh issue list --repo 13alfredoreal-pixel/client-sanjudas --state all --limit 30 --json number,title
gh issue list --repo 13alfredoreal-pixel/server-sanJudas --state all --limit 30 --json number,title
```

## Labels

- `feature` / `bug` / `task`
- `repo:client`
- Áreas: `auth-ui`, `library`, `viewer`, `admin`, `docs`, `ci`

## Cross-repo

Si necesitas endpoint nuevo:

1. Issue/PR en **server** (contrato).
2. PR aquí consumiendo el contrato.
3. `Related PR: <url>` en ambos.

## Flujo

```bash
git checkout main && git pull
gh issue create --title "[BSJT-012] …"
git checkout -b BSJT-012
# …
git push -u origin BSJT-012
gh pr create --title "[BSJT-012] …" --body "Closes #N"
```

CI: `npm ci` + `lint` + `build`. Sin secretos en el diff.

## Refs

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [CURRENT-STATE.md](./CURRENT-STATE.md)
- [ROADMAP.md](./ROADMAP.md) (stub — pendiente)
- `.cursor/skills/bsjt-github-workflow/`
