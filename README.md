# Prancheta EF — app

Banco de atividades de Educação Física escolar, filtrável por faixa etária, espaço
disponível e unidade temática da BNCC. Professor(a) cria conta, monta um plano de
aula juntando atividades e exporta em PDF.

Veja `GUIA_DEPLOY.md` pra colocar isso no ar.

## Stack

- **Next.js 16** (React) — front-end e back-end no mesmo projeto.
- **SQLite embutido no Node** (`node:sqlite`) — banco de dados em arquivo, zero
  configuração. Os dados ficam em `data/app.db`. Ótimo pra validar o app agora;
  se crescer muito, dá pra migrar pra um Postgres gerenciado depois.
- **NextAuth (Auth.js)** — login por e-mail/senha, senha guardada com hash (bcrypt).
- **Tailwind CSS** — estilo, já com a paleta de marca do Prancheta EF.
- PWA — dá pra "instalar" o app na tela inicial do celular (`manifest.json` +
  ícones em `public/icons/`).

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em http://localhost:3000. O banco (`data/app.db`) e a tabela de atividades
são criados automaticamente na primeira vez que o servidor sobe, já com as
atividades de exemplo (as mesmas usadas no Instagram, mais algumas novas de
Danças, Lutas e Práticas corporais de aventura, pra mostrar o filtro por BNCC
completo).

## Estrutura

- `src/app/` — páginas (login, cadastro, atividades, plano de aula, impressão).
- `src/app/actions/` — as ações do servidor (login, cadastro, adicionar/remover
  atividade do plano).
- `src/lib/db.ts` — banco de dados e atividades de exemplo (edite `SEED_ACTIVITIES`
  pra trocar/adicionar atividades sem mexer em mais nada).
- `src/lib/activities.ts`, `src/lib/plans.ts`, `src/lib/users.ts` — as consultas
  ao banco.
- `src/components/` — peças visuais reutilizáveis (logo, ícone de quadra, card
  de atividade, filtro).

## Variáveis de ambiente

Já existe um `.env.local` com um `AUTH_SECRET` gerado — não precisa mexer pra
rodar localmente. No deploy, gere um novo (ver `GUIA_DEPLOY.md`).
