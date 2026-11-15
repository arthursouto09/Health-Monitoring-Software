# Como executar e testar

## Requisitos

[Node.js](https://nodejs.org/) LTS (testado com Node 22).

## Desenvolvimento

```bash
npm install        # só na primeira vez ou quando o package.json mudar
npm run dev
```

Abra o endereço que o terminal mostrar (normalmente `http://localhost:5173`). O app só funciona enquanto o servidor está ligado; `Ctrl + C` encerra.

Para abrir pelo celular na mesma rede Wi-Fi: `npm run dev -- --host` e use o endereço da linha `Network`.

## Build de produção

É o que a Vercel gera. Rode antes de abrir um PR: se falhar aqui, falha no deploy.

```bash
npm run build
npm run preview
```

O aviso "Some chunks are larger than 500 kB" é esperado (vem do Recharts) e não impede o build.

## Roteiro de teste manual

| O que testar | Como | Resultado esperado |
|---|---|---|
| Status crítico | No check-in, digite glicemia `40` e salve | Card vermelho, item no topo dos alertas, prontidão cai |
| Faixa e linha de base | Clique em "Heart rate" | Faixa verde atrás da linha e linha tracejada "your baseline". Nos dados de demonstração, a frequência cardíaca aparece como "Unusual for you" |
| Ambiente | Troque para "Mars base" e recarregue | A dica "In this environment" muda e a escolha continua após recarregar |
| Relatório | Clique em "Export report (CSV)" | Baixa `health-report-AAAA-MM-DD.csv` |
| Corpo clicável | Clique nas partes ou use Tab e Enter | Painel da parte muda; "View trend" seleciona o indicador |
| Celular | `npm run dev -- --host` ou o modo celular do DevTools | Uma coluna, cards em duas colunas |

**Forçar o lembrete:** os dados de demonstração já incluem hoje, então o aviso não aparece de início. Cole no console do navegador (F12) e recarregue:

```js
const d = new Date(); d.setDate(d.getDate() - 1);
localStorage.setItem("astro-health-entries", JSON.stringify([{ date: d.toLocaleDateString("sv"), values: { heartRate: 70 } }]));
```

Deve aparecer o aviso e a sequência fica em 1.

**Voltar aos dados de demonstração:** `localStorage.clear()` no console e recarregar.

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
