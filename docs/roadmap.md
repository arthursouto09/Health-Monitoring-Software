# O que falta

Estado em 15 de novembro de 2026.

## Entrega (essencial)

| # | Item | Estado |
|---|---|---|
| 1 | Conferir a capitalização no Git | **Feito.** O import `./app.jsx` foi corrigido para `./App.jsx` |
| 2 | Testar `npm run build` | **Feito.** O build passa |
| 3 | Conferir as fontes primárias | Pendente. Abrir os links originais e validar os números, inclusive os da glicemia |
| 4 | Publicar o app (Vercel) | Pendente. Gera o link que o formulário do desafio pede |
| 5 | Gravar o vídeo de demonstração | Pendente. Roteiro em [apresentacao.md](apresentacao.md) |
| 6 | Completar o README | Pendente: links da demo, do vídeo, fonte primária da temperatura, licença e equipe |
| 7 | Adicionar o arquivo `LICENSE` | Pendente, se o README declarar MIT |
| 8 | Submeter no site do desafio | Pendente. Confirmar o horário limite na página do desafio |

## Melhorias de produto

| Melhoria | Estado |
|---|---|
| Glicemia (mg/dL) | **Feito** |
| Comparação com a linha de base pessoal | **Feito** |
| Lembretes para medir | **Feito** (aviso na tela e notificação com o app aberto) |
| Gamificação (sequência de dias, pontuação de prontidão) | **Feito** |
| Seletor de ambiente | **Feito** |
| Compartilhamento com o cirurgião de voo | **Parcial:** exportação CSV. O back-end e o login já existem; falta o perfil de cirurgião de voo (veja abaixo) |
| Escala de humor validada | Pendente. Precisa ser escolhida com um psicólogo |
| Entrada por imagem (câmera, ultrassom) | Pendente. Precisa de processamento de imagem para ter valor real |
| Lembretes com o app fechado | Pendente. Exigiria service worker e push |
| Back-end com login e banco | **Feito.** Funções na Vercel, Postgres, login sem cadastro, conta demo |
| Revisão antes de salvar o check-in | **Feito** (Corrigir ou Confirmar) |

## Ideias em discussão

| Ideia | Observação |
|---|---|
| Check-in parcial sem apagar o resto do dia | Hoje, salvar de novo no mesmo dia substitui a leitura inteira. A revisão já avisa o que será apagado |
| Perfil de cirurgião de voo | Uma conta que vê as leituras da tripulação, fechando o ciclo do compartilhamento seguro |

## Limitações do back-end

| Item | Detalhe |
|---|---|
| Sem limite de tentativas de login | Não há bloqueio após várias senhas erradas. Para produção real, usar rate limit (por exemplo Upstash) |
| Sessão não pode ser revogada | O cookie assinado vale 7 dias. Trocar a senha não derruba sessões já abertas; trocar o `SESSION_SECRET` derruba todas |
| Datas da conta demo fixas | Os 14 dias de demonstração são os do dia em que o banco foi criado. Para renovar, apague as tabelas (ou `docker compose down -v` no local) |
| Sem gestão de contas na interface | Criar e trocar senha só pelo `npm run create-user` |

## Correções e limpeza pendentes

| Item | Detalhe |
|---|---|
| Temperatura de exatamente 38,0 °C | O texto diz "febre (38 °C ou mais)" é crítico, mas o código classifica 38,0 como atenção (`criticalHigh: 38.0` usa "maior que") |
| Arquivo `.gitigonre` | Nome com erro de digitação; é uma cópia do `.gitignore` e pode ser apagado |
| Arquivo `src/index.html` | Cópia do `index.html` da raiz; o Vite usa só o da raiz |
| Classe `.grid` em `styles.css` | Sobra do layout antigo, não é usada |
| Selo de status no `BodyMap.jsx` | Repete o HTML do componente `StatusBadge`; pode passar a usá-lo |
