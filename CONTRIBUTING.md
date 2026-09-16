# Contribuindo

## Fluxo de branches

- `main`: somente código revisado e pronto para publicação.
- `develop`: integração do próximo ciclo de entrega.
- `feature/<descricao>`: novas funcionalidades, criada a partir de `develop`.
- `release/<versao>`: preparação e estabilização de uma versão.
- `hotfix/<descricao>`: correção urgente criada a partir de `main`.

Alterações entram em `main` por pull request. A publicação é executada pelo GitHub Actions somente após um push em `main`; não faça commit de `dist/` ou de arquivos de configuração local.

## Commits

Use Conventional Commits, com mensagens curtas no imperativo:

```text
feat: adiciona filtro por canal
fix: corrige exportacao do calendario
chore: atualiza dependencias
docs: documenta fluxo de publicacao
ci: configura build do GitHub Pages
```

Antes de abrir o pull request:

1. Execute `npm ci` e `npm run build` em `marketing-planner-react`.
2. Confirme que `git status` não lista `dist/`, `node_modules/`, `.env` ou credenciais.
3. Faça rebase da branch de trabalho sobre a branch de destino e resolva conflitos localmente.