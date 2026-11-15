# Funcionalidades

Estado em 15 de novembro de 2026. A coluna "Pedido do desafio" liga cada funcionalidade ao enunciado do NASA Space Apps Challenge.

## Painel

| Funcionalidade | O que faz | Pedido do desafio |
|---|---|---|
| Barra de status geral | Mostra o pior status entre os indicadores e quantos precisam de atenção | Cores para interpretar de relance |
| Cards dos indicadores | Valor atual, status com cor, ícone e texto, e a marca "Unusual for you" quando foge da linha de base | Cores para interpretar de relance |
| Detalhe e gráfico | Orientação para o status atual, gráfico com a faixa normal sombreada e a linha de base tracejada, por que importa, perigo do espaço e fonte | Gráficos dinâmicos; orientar ações |
| Corpo clicável | Cérebro, coração, corpo todo e ossos. Cada parte mostra função, risco no espaço, indicadores ligados e o pior status entre eles | Figura humana interativa |
| Alertas | Lista os indicadores fora do normal, críticos primeiro, e depois os que estão normais mas incomuns para a pessoa | Orientar ações |

O status nunca depende só da cor: cada um tem ícone e texto, o que ajuda quem tem dificuldade de distinguir cores.

## Registro de dados

| Funcionalidade | O que faz | Pedido do desafio |
|---|---|---|
| Check-in diário | Formulário com os 6 indicadores e uma instrução de como medir cada um. Salvar de novo no mesmo dia **substitui** a leitura inteira | Coletar indicadores de saúde; não presumir conhecimento médico |
| Dados de demonstração | 14 dias simulados na primeira abertura, para os gráficos nunca ficarem vazios | — |
| Persistência local | Leituras e ambiente ficam no navegador | Uso contínuo sem servidor |

## Acompanhamento e engajamento

| Funcionalidade | O que faz | Pedido do desafio |
|---|---|---|
| Linha de base pessoal | Compara a leitura com as 14 anteriores da mesma pessoa e avisa quando foge mais de 2 desvios padrão | Personalização |
| Lembrete de check-in | Aviso na tela quando falta o check-in do dia. Notificação do navegador opcional, no máximo uma por dia e só com o app aberto | Prompts periódicos |
| Sequência de dias | Conta os dias seguidos com check-in. Se hoje ainda não teve, conta até ontem | Gamificação |
| Pontuação de prontidão | 0 a 100 a partir dos status atuais. Não é clínica | Gamificação |
| Seletor de ambiente | Estação, nave, rover, base lunar ou base em Marte. Muda o contexto e uma dica por indicador | Adaptar ao ambiente da missão |
| Relatório CSV | Baixa todas as leituras com status e faixa normal, para enviar ao cirurgião de voo. O arquivo é gerado no aparelho | Compartilhar com a equipe médica (parcial) |

## Layout

- **Desktop:** barra de status no topo; três colunas com corpo à esquerda, cards em grade 3×2 e detalhe no centro, alertas, check-in e relatório à direita.
- **Abaixo de cerca de 1100 px:** vira uma coluna, com a análise primeiro e o corpo por último.
- **Celular (até 600 px):** cards em duas colunas, alvos de toque de 44 px e campos com 16 px para evitar zoom automático no iPhone.

Detalhes de faixas e cálculos estão em [indicadores-e-fontes.md](indicadores-e-fontes.md).
