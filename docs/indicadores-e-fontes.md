# Indicadores, faixas e fontes

Todo o conteúdo desta página vem de `src/data/indicators.js`, `src/data/environments.js` e `src/logic/baseline.js`. Se mudar lá, atualize aqui.

## Indicadores monitorados

| Indicador | Unidade | Perigo do espaço relacionado | Parte do corpo no mapa |
|---|---|---|---|
| Frequência cardíaca | bpm | Gravidade alterada, radiação | Coração e vasos |
| Pressão sistólica | mmHg | Gravidade alterada (deslocamento de fluidos) | Coração e vasos |
| Temperatura corporal | °C | Ambiente fechado, radiação | Corpo todo |
| Glicemia em jejum | mg/dL | Gravidade alterada, radiação, menos atividade física | Corpo todo |
| Sono | horas | Isolamento, confinamento | Cérebro |
| Humor | escala de 1 a 5 | Isolamento, distância da Terra | Cérebro |

"Ossos e músculos" aparece no mapa só com informação, ainda sem indicador.

## Faixas de referência

| Indicador | Normal | Atenção | Contatar cirurgião de voo |
|---|---|---|---|
| Frequência cardíaca | 60 a 100 bpm | 40 a 59 ou 101 a 120 | abaixo de 40 ou acima de 120 |
| Pressão sistólica | 90 a 119 mmHg | 80 a 89 ou 120 a 180 | abaixo de 80 ou acima de 180 |
| Temperatura | 36,1 a 37,2 °C | 35,0 a 36,0 ou 37,3 a 38,0 | abaixo de 35,0 ou acima de 38,0 |
| Glicemia em jejum | 70 a 99 mg/dL | 54 a 69 ou 100 a 180 | abaixo de 54 ou acima de 180 |
| Sono | 7 a 9 h | 5 a 6,5 ou 9,5 a 11 | abaixo de 5 ou acima de 11 |
| Humor | 3 a 5 | 2 | 1 |

## Valores aceitos na entrada

Além das faixas de status, cada indicador tem uma **faixa de entrada plausível** para uma automedição feita por um astronauta consciente. Valores fora dela são quase certamente erro de digitação (por exemplo `3.7` ou `370` em vez de `37`) e são **recusados**, no formulário e no servidor, com a mesma regra (`src/logic/validate.js`). As zonas críticas sempre ficam dentro da faixa, para poderem ser registradas. **Decisão do app.**

| Indicador | Aceito | Precisão | Por que esses limites |
|---|---|---|---|
| Frequência cardíaca | 30 a 180 bpm | inteiro | Abaixo de 30 ou acima de 180 em repouso não é uma automedição realista |
| Pressão sistólica | 70 a 230 mmHg | inteiro | Abaixo de 70 a pessoa estaria em choque; acima de 230 é improvável e costuma ser erro do aparelho |
| Temperatura | 34 a 41 °C | 0,1 °C | Fora disso a pessoa não estaria em condição de se medir |
| Glicemia em jejum | 40 a 400 mg/dL | inteiro | Cobre hipoglicemia grave e hiperglicemia sem aceitar valores absurdos |
| Sono | 0 a 12 h | 0,5 h | Um período de sono acima de 12 h é improvável na rotina da missão |
| Humor | 1 a 5 | inteiro | É a própria escala |

Também são recusados textos que não sejam um número simples (por exemplo `1e2`). A vírgula decimal é aceita (`36,6`).

## O que tem fonte e o que é decisão do app

Esta separação deve aparecer na apresentação. Dizer quais limites foram escolhas do app, e que precisam de validação médica, é mais forte do que fingir que todos vêm de uma fonte.

| Indicador | Vem de fonte | Decisão do app |
|---|---|---|
| Frequência cardíaca | Normal em repouso de 60 a 100 bpm | Limites críticos de 40 e 120 bpm |
| Pressão sistólica | Normal abaixo de 120 mmHg; acima de 180 é severo | Limites inferiores de 90 e 80 mmHg |
| Temperatura | Normal de 36,1 a 37,2 °C; febre a partir de 38 °C; hipotermia abaixo de 35 °C | Nenhuma |
| Glicemia em jejum | Normal abaixo de 100 mg/dL (CDC); hipoglicemia abaixo de 70 e clinicamente significativa abaixo de 54 (ADA) | Limite crítico alto de 180 mg/dL |
| Sono | 7 a 9 h recomendadas; astronautas dormem em média cerca de 6 h em voo | Limites críticos de 5 e 11 h |
| Humor | Nenhuma | Toda a escala de 1 a 5 |

**Ressalvas:**

- Os números vieram de resumos que citam AHA, Mayo Clinic, CDC, ADA e documentos da NASA. É preciso conferir nas fontes primárias.
- Para temperatura, as fontes encontradas eram secundárias. Vale confirmar na MedlinePlus ou na Cleveland Clinic.
- As faixas valem para **adultos saudáveis em repouso**. Atletas, por exemplo, podem ter frequência cardíaca normal abaixo de 60 bpm.
- A escala de humor foi criada para o app e **não é um instrumento clínico validado**.
- **Inconsistência conhecida:** o texto de orientação crítica da temperatura diz "febre (38 °C ou mais)", mas o código só considera crítico acima de 38,0. Uma leitura de exatamente 38,0 °C aparece como atenção. Veja o [roadmap](roadmap.md).

## Linha de base pessoal

As faixas acima dizem se um valor é saudável para adultos em geral. A linha de base diz se ele é **incomum para aquela pessoa**. Todos os parâmetros são decisões do app (`src/logic/baseline.js`):

| Parâmetro | Valor |
|---|---|
| Janela | As 14 leituras anteriores à leitura avaliada |
| Mínimo para calcular | 5 leituras |
| "Incomum para você" | Mais de 2 desvios padrão da média pessoal |
| Desvio padrão mínimo | Um passo do campo (por exemplo 0,1 °C), para dados muito estáveis não gerarem alarme por diferenças mínimas |

A linha de base **não muda o status** (normal, atenção, crítico). Ela adiciona a marca "Unusual for you" no card, uma linha tracejada no gráfico e uma lista "Different from your baseline" nos alertas, só para indicadores que estão normais pela faixa geral.

## Pontuação de prontidão

Decisão do app, **não é uma pontuação clínica** (`src/logic/engagement.js`): cada indicador com valor vale 100 (normal), 50 (atenção) ou 0 (crítico), e a pontuação é a média. Indicadores sem valor ficam de fora. A cor segue: 85 ou mais verde, 60 a 84 amarelo, abaixo de 60 vermelho.

## Ambientes da missão

O seletor no topo adapta uma dica por indicador e mostra o contexto do ambiente. O conteúdo está em `src/data/environments.js` e é educacional.

| Ambiente | Contexto resumido |
|---|---|
| Estação espacial (órbita baixa) | Microgravidade, cerca de 16 nasceres do sol por dia, contato quase em tempo real |
| Nave em trânsito | Cabine pequena, pouco espaço para exercício, mais radiação fora do campo magnético da Terra |
| Rover pressurizado | Cabine apertada, carga de trabalho alta, longe do habitat |
| Base lunar | Um sexto da gravidade da Terra, poeira abrasiva, cerca de duas semanas de dia e duas de noite |
| Base em Marte | Cerca de três oitavos da gravidade, atraso de comunicação de até cerca de 22 minutos em cada sentido |

## Fontes consultadas

- NASA OCHMO, relatório técnico sobre acomodações de sono: https://www.nasa.gov/wp-content/uploads/2023/03/sleep-accomodations-technical-brief-ochmo.pdf
- Barger et al., sono de astronautas antes, durante e depois do voo espacial (The Lancet Neurology, 2014): https://pmc.ncbi.nlm.nih.gov/articles/PMC4188436
- Categorias de pressão arterial da American Heart Association, via Harvard Health: https://www.health.harvard.edu/heart-health/reading-the-current-blood-pressure-guidelines
- Frequência cardíaca em repouso, Mayo Clinic: https://www.mayoclinic.org/heart-rate/expert-answers/faq-20057979
- Glicemia em jejum, CDC (diabetes testing): https://www.cdc.gov/diabetes/diabetes-testing/
- Níveis de hipoglicemia, American Diabetes Association, Standards of Care in Diabetes (seção de metas glicêmicas e hipoglicemia). Link a conferir.
- Temperatura corporal e hipotermia: fontes secundárias; conferir MedlinePlus ou Mayo Clinic.
- Página Resources do desafio no site do NASA Space Apps Challenge, ainda a consultar e citar.
