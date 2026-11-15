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
| Compartilhamento com o cirurgião de voo | **Parcial:** exportação CSV local. O compartilhamento *seguro* precisa de servidor e autenticação |
| Escala de humor validada | Pendente. Precisa ser escolhida com um psicólogo |
| Entrada por imagem (câmera, ultrassom) | Pendente. Precisa de processamento de imagem para ter valor real |
| Lembretes com o app fechado | Pendente. Exigiria service worker e push |

## Ideias em discussão

| Ideia | Observação |
|---|---|
| Confirmação antes de salvar o check-in | Mostrar um resumo dos valores com o status de cada um e pedir confirmação, principalmente quando algum valor é crítico ou incomum |
| Check-in parcial sem apagar o resto do dia | Hoje, salvar de novo no mesmo dia substitui a leitura inteira |

## Correções e limpeza pendentes

| Item | Detalhe |
|---|---|
| Temperatura de exatamente 38,0 °C | O texto diz "febre (38 °C ou mais)" é crítico, mas o código classifica 38,0 como atenção (`criticalHigh: 38.0` usa "maior que") |
| Arquivo `.gitigonre` | Nome com erro de digitação; é uma cópia do `.gitignore` e pode ser apagado |
| Arquivo `src/index.html` | Cópia do `index.html` da raiz; o Vite usa só o da raiz |
| Classe `.grid` em `styles.css` | Sobra do layout antigo, não é usada |
