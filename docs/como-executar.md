# Como executar e testar

## Requisitos

- [Node.js](https://nodejs.org/) 22 LTS (o `npm run create-user` precisa da 22.9 ou mais nova).
- Opcional: [Docker](https://www.docker.com/) para rodar com Postgres no seu computador.

## Desenvolvimento rápido (sem banco)

```bash
npm install        # só na primeira vez ou quando o package.json mudar
npm run dev
```

Abra o endereço do terminal (normalmente `http://localhost:5173`) e entre com a conta demo **astronaut / mars2026** (o botão "Fill in" preenche). Sem `DATABASE_URL`, o back-end grava em `.data/db.json`. Para começar do zero, apague a pasta `.data`.

O `npm run dev` sobe o front e as rotas `/api` juntos. `Ctrl + C` encerra.

Para abrir pelo celular na mesma rede Wi-Fi: `npm run dev -- --host` e use o endereço da linha `Network`.

## Desenvolvimento com Postgres (Docker)

Assim o ambiente fica igual ao da produção.

```bash
docker compose up -d                       # sobe o Postgres na porta 5432
cp .env.example .env.local                 # no Windows: copy .env.example .env.local
```

No `.env.local`, preencha:

```text
DATABASE_URL=postgres://ahm:ahm@localhost:5432/ahm
```

Depois `npm run dev`. As tabelas e a conta demo são criadas na primeira requisição.

| Comando | O que faz |
|---|---|
| `docker compose down` | Para o banco e mantém os dados |
| `docker compose down -v` | Para o banco e apaga os dados (volta à conta demo) |
| `docker compose exec db psql -U ahm -d ahm` | Abre o console SQL |

## Contas da tripulação

Não existe cadastro no app: as contas são criadas pela equipe da missão.

```bash
npm run create-user -- <usuario> "<Nome completo>" <senha>
# exemplo
npm run create-user -- arthur "Arthur Souto" senha-segura-1
```

- Usa o `DATABASE_URL` do `.env.local`; sem ele, grava em `.data/db.json`.
- Rodar de novo com o mesmo usuário **troca a senha**.
- Senha com pelo menos 8 caracteres. O usuário é salvo em minúsculas.
- Para criar contas **na produção**, coloque no `.env.local` o `DATABASE_URL` do banco da Vercel e rode o mesmo comando.

## Build de produção

```bash
npm run build
npm run preview    # também serve as rotas /api
```

Rode antes de abrir um PR: se falhar aqui, falha no deploy. O aviso "Some chunks are larger than 500 kB" é esperado (vem do Recharts).

## Deploy na Vercel

1. Importe o repositório na Vercel. Ela detecta o Vite e publica as funções da pasta `api/` sozinha, sem configuração extra.
2. Em **Storage**, crie um banco **Postgres (Neon)** e conecte ao projeto. A Vercel cria a variável `DATABASE_URL` (se ela vier com outro nome, como `POSTGRES_URL`, crie `DATABASE_URL` com o mesmo valor).
3. Em **Settings > Environment Variables**, crie `SESSION_SECRET` com um texto aleatório longo:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
4. Faça o deploy (ou um redeploy, se as variáveis foram criadas depois).
5. Abra a URL e entre com **astronaut / mars2026**. Crie as contas reais com `npm run create-user` apontando para o banco da Vercel.

## Roteiro de teste manual

| O que testar | Como | Resultado esperado |
|---|---|---|
| Login | Senha errada, depois "Fill in" e "Sign in" | Mensagem "Wrong username or password"; depois abre o painel com "Signed in as Demo astronaut" |
| Sem cadastro | Procure um link de cadastro | Não existe; só `npm run create-user` cria contas |
| Valores irreais | Digite temperatura `27`, frequência `1e2` e sono `7.25`, clique em "Review" | Não abre a revisão; cada campo mostra o erro em vermelho e a faixa aceita |
| Revisão | Preencha frequência `130` e glicemia `40`, clique em "Review today's readings" | Lista com status de cada valor (novos e "saved earlier today") e aviso de valor crítico |
| Campos em branco | Na conta demo, preencha só a temperatura (`38,5`) e confirme | Os outros indicadores continuam com os valores salvos antes; os campos mostram "Saved today: …" |
| Prévia no painel | Ainda na revisão, olhe o resto da tela | Aviso "Preview, not saved yet"; cards, alertas, corpo, gráfico, prontidão e status geral mostram os valores digitados |
| Corrigir | Clique em "Correct" | Volta ao formulário com os valores preenchidos e o painel volta ao que está salvo |
| Salvar | Corrija a glicemia, "Review" e "Confirm and save" | Cards atualizam e o formulário limpa |
| Persistência | Recarregue a página, ou entre em outro navegador ou no celular | As leituras continuam lá (vêm do servidor) |
| Sair | "Sign out" | Volta para o login; recarregar não entra de novo |
| Usuário novo | Crie uma conta com `create-user` e entre | Painel vazio com "No readings yet", aviso de check-in pendente e sequência 0 |
| Faixa e linha de base | Na conta demo, clique em "Heart rate" | Faixa verde atrás da linha e linha tracejada "your baseline" |
| Ambiente | Troque para "Mars base" e recarregue | A dica muda e a escolha continua |
| Relatório | "Export report (CSV)" | Baixa `health-report-AAAA-MM-DD.csv` |
| API sem login | `curl -i http://localhost:5173/api/entries` | `401 Not signed in` |
| Celular | `npm run dev -- --host` ou o modo celular do DevTools | Uma coluna, cards em duas colunas |

## Problemas conhecidos no Windows

| Problema | Causa | Solução |
|---|---|---|
| `npm` ou `node` não reconhecido | Terminal aberto com o PATH antigo, ou o Node não está no PATH | Adicionar `C:\Program Files\nodejs` ao PATH e reabrir o terminal, ou usar o Prompt de Comando |
| Execução de scripts desabilitada | A política padrão do PowerShell bloqueia o `npm.ps1` | `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`, ou usar `npm.cmd` |
| `package.json` inválido (JSON vazio) | Arquivos baixados chegaram com 0 bytes | Recriar os arquivos direto no disco |
| `Rename-Item` não renomeia `Data` para `data` | O Windows não diferencia maiúsculas de minúsculas | Renomear em duas etapas, passando por um nome temporário (ou `git mv`) |
| Aviso de arquivo de swap do Vim no commit | `git commit` sem `-m` abriu o Vim | Apagar `.git\.COMMIT_EDITMSG.swp` e usar `git commit -m "mensagem"` |
| Arquivo sumiu ao mover a pasta | `Remove-Item` numa pasta com conteúdo | Antes de apagar, conferir com `dir` |

**Maiúsculas e minúsculas:** no Windows tudo funciona com qualquer capitalização, mas o Git guarda o nome exato e a Vercel roda em Linux. Foi isso que quebrou o build: `main.jsx` importava `./app.jsx` e o arquivo é `App.jsx` (corrigido). Confira com `git ls-files src` sempre que renomear algo.

## `package-lock.json`

Deve ficar **versionado**: garante que todos (e a Vercel) instalem as mesmas versões. O lock atual foi gerado por um npm mais novo, que grava campos `libc` nos pacotes nativos; versões mais antigas do npm (como a 10) apagam esses campos ao rodar `npm install`, e o arquivo aparece modificado sem nenhuma dependência ter mudado. Nesse caso, descarte a alteração com `git checkout package-lock.json` em vez de commitá-la. O ideal é a equipe usar a mesma versão do npm.
