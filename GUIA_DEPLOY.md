# Como colocar o Prancheta EF no ar

O app já está pronto e testado (cadastro, login, filtros, plano de aula, PDF).
Falta só publicar ele num endereço de internet de verdade. Duas formas de fazer isso:

## Caminho 1 — eu publico pra você (mais simples)

Direto na nossa conversa, você pode conectar uma conta de hospedagem (Render ou
Railway são as mais simples pra esse tipo de app) e eu cuido do resto — subo o
código, configuro e te devolvo o link.

Como conectar: nas configurações de conectores do Claude, procure por **Render**
ou **Railway** e autorize o acesso. Depois é só me avisar aqui que conectou, que
eu sigo com o deploy.

Por que Render ou Railway e não outras: esse app guarda os dados (professoras
cadastradas, planos de aula) num arquivo de banco de dados. A maioria dos
serviços "grátis" mais conhecidos (como a Vercel) apaga esse arquivo a cada
tanto tempo porque não guardam disco permanente no plano simples — Render e
Railway guardam. Se um dia você quiser usar Vercel mesmo assim, dá pra trocar o
banco de arquivo por um banco de verdade (Postgres) — aviso quando/se
chegarmos nesse ponto.

## Caminho 2 — você mesmo publica

Se preferir fazer manualmente (ou repassar pra um desenvolvedor no futuro):

1. **Criar uma conta no GitHub** (github.com) — é onde o código do app fica
   guardado antes de publicar. Grátis.
2. **Criar um repositório novo** vazio (botão "New repository").
3. Subir esse projeto pra esse repositório (se tiver alguém técnico por perto,
   é o comando `git push`; senão, me chama de volta aqui que eu te ajudo nessa
   parte também assim que o repositório existir).
4. **Criar conta no Render.com** (ou Railway.app), plano pago básico (uns
   R$35–50/mês, varia com o câmbio) — o plano grátis deles não guarda os dados
   de forma permanente, o que faria você perder os cadastros de vez em quando.
5. Na Render: "New > Web Service", conecta o repositório do GitHub, e:
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm run start`
   - Adiciona um **Disk** (disco persistente) montado na pasta `data` — é onde
     o banco de dados fica salvo entre reinicializações.
   - Em "Environment", adiciona a variável `AUTH_SECRET` com um valor
     aleatório (qualquer texto longo e único serve — posso gerar um pra você
     se precisar).
6. Clica em "Deploy". Em alguns minutos o app está no ar com um link tipo
   `prancheta-ef.onrender.com`.
7. **Domínio próprio (opcional):** dá pra apontar algo como
   `app.pranchetaef.com.br` pro Render depois, se você tiver um domínio.

## Depois de publicado

- **Adicionar mais atividades:** hoje isso é feito editando o código
  (`src/lib/db.ts`, lista `SEED_ACTIVITIES`) — é só me mandar as atividades
  novas (nome, faixa etária, espaço, BNCC, descrição, materiais, dica) que eu
  atualizo o app pra você. Uma versão futura pode ganhar uma tela de admin pra
  você mesmo cadastrar sem precisar de mim.
- **Cada professora cria a própria conta** — os planos de aula de cada uma
  ficam separados e privados.
- **Funciona como app no celular:** ao abrir o link no navegador do celular,
  dá pra "Adicionar à tela inicial" e ele se comporta como um app instalado,
  sem precisar passar por loja nenhuma.
