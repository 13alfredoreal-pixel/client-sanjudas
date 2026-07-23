---
name: bsjt-github-workflow
description: >-
  Gestiona issues BSJT, ramas y PRs en client-sanjudas. Usar al crear tickets,
  ramas, pull requests o cuando el usuario mencione BSJT, sprint o GitHub Project.
---

# BSJT Client — GitHub Workflow

## Nomenclatura

| Elemento | Formato                       | Ejemplo                           |
| -------- | ----------------------------- | --------------------------------- |
| Issue    | `[BSJT-012] Título`           | `[BSJT-012] Viewer: persist page` |
| Rama     | `BSJT-012`                    | solo el ID                        |
| PR       | `[BSJT-012] …` + `Closes #12` |                                   |

Label sugerido: `repo:client`.

## Flujo

```bash
gh issue list --state all --limit 20 --json number,title
# También revisar IDs en server-sanJudas para secuencia BSJT global

gh issue create --title "[BSJT-012] …" --body "…"
git checkout -b BSJT-012
git push -u origin BSJT-012
gh pr create --title "[BSJT-012] …" --body "$(cat <<'EOF'
## Resumen
…

Closes #12

## Related PR
<!-- URL del PR en server-sanJudas si aplica -->
EOF
)"
```

## Cross-repo

Cambios de API → server primero (o en paralelo con contrato actualizado); enlazar PRs.

## Refs

- `docs/GITHUB-WORKFLOW.md`
- `docs/CONTRIBUTING.md`
- `.github/PULL_REQUEST_TEMPLATE.md`
