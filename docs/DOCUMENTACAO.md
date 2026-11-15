# Documentação do projeto: Astronaut Health Monitor

NASA Space Apps Challenge 2026 · desafio "Create Health Monitoring Software for Astronauts on Space Missions" · estado em 15 de novembro de 2026

## 1. Visão geral

O **Astronaut Health Monitor** é um painel web para astronautas em missões longas. Ele permite registrar indicadores de saúde diários, ver o estado de cada um de relance, acompanhar a evolução no tempo e receber orientações em linguagem simples sobre o que fazer, inclusive quando procurar o cirurgião de voo.

O desafio parte de um problema real: em missões longas, com atraso de comunicação com a Terra, os astronautas são em grande parte responsáveis por perceber mudanças na própria saúde. O app não presume que o usuário seja especialista, então cada medição vem com instruções e explicações.

**Estado atual:** protótipo funcional de hackathon. Roda localmente e o código já está no GitHub. Ainda faltam itens de entrega (publicação, vídeo, submissão) e melhorias opcionais.

## 2. O que foi feito

### 2.1 Tecnologias

| Tecnologia | Uso | Por que foi escolhida |
|---|---|---|
| React 18 | Interface em componentes | Facilita separar painel, corpo clicável e formulário |
| Vite | Servidor de desenvolvimento e build | Inicia rápido e a Vercel reconhece sem configuração |
| Recharts | Gráficos de tendência | Integra bem com React e permite sombrear a faixa normal |
| SVG | Figura do corpo | Permite partes clicáveis, coloridas e acessíveis pelo teclado |
| localStorage | Armazenamento das leituras | Dispensa servidor e banco de dados |

### 2.2 Estrutura de arquivos

```text
Nasa/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
├── docs/
│   └── DOCUMENTACAO.md          este arquivo
└── src/
    ├── main.jsx                 ponto de entrada
    ├── App.jsx                  painel, formulário de check-in, gráficos
    ├── styles.css               visual e layout
    ├── components/
    │   └── BodyMap.jsx          figura do corpo clicável
    ├── data/
    │   └── indicators.js        faixas, textos e fontes
    └── logic/
        └── status.js            regras de status e dados de demonstração
```

A decisão mais importante da arquitetura é **separar dados e lógica**. Todo o conteúdo médico (faixas, explicações, recomendações e fontes) fica em `indicators.js`. Corrigir uma faixa nunca exige mexer no código que calcula o status.

### 2.3 Funcionalidades implementadas

| Funcionalidade | Descrição | Pedido do desafio atendido |
|---|---|---|
| Check-in diário | Formulário com 5 indicadores e dica de como medir cada um | Coletar indicadores de saúde |
| Status por cores | Normal, atenção e contatar o cirurgião de voo, sempre com ícone e texto além da cor | Cores para interpretar de relance |
| Gráficos de tendência | Evolução ao longo do tempo, com a faixa normal sombreada | Gráficos dinâmicos |
| Corpo clicável | Cérebro, coração, corpo todo e ossos. Cada parte mostra função, risco no espaço e indicadores ligados | Figura humana interativa |
| Orientações | Explicação e ação recomendada para cada resultado | Orientar tratamentos e melhorias |
| Instruções simples | Como medir, por que importa e qual perigo do espaço se relaciona | Não presumir conhecimento do astronauta |
| Dados de demonstração | 14 dias de leituras simuladas na primeira abertura | Gráficos nunca vazios na demo |
| Persistência local | Leituras guardadas no navegador; salvar de novo no mesmo dia substitui a leitura | Uso contínuo sem servidor |

### 2.4 Indicadores monitorados

| Indicador | Unidade | Perigo do espaço relacionado |
|---|---|---|
| Frequência cardíaca | bpm | Gravidade alterada, radiação |
| Pressão sistólica | mmHg | Gravidade alterada (deslocamento de fluidos) |
| Temperatura corporal | °C | Ambiente fechado, radiação |
| Sono | horas | Isolamento, confinamento |
| Humor | escala de 1 a 5 | Isolamento, distância da Terra |

### 2.5 Como uma leitura vira um status

1. O valor é comparado com as faixas do indicador em `indicators.js`.
2. Dentro da faixa normal: **normal**. Fora dela, mas sem passar dos limites críticos: **atenção**. Além dos limites críticos: **contatar o cirurgião de voo**.
3. O app mostra a explicação e a ação recomendada para aquele status.
4. Cada parte do corpo exibe o **pior status** entre os indicadores ligados a ela.

O status nunca depende só da cor: cada um tem ícone e texto, o que ajuda quem tem dificuldade de distinguir cores.

### 2.6 Layout

O layout foi reorganizado no formato de painel de controle (estilo cockpit), mantendo o visual escuro:

- **Barra de status geral** no topo, com o pior status entre os indicadores e a contagem de alertas.
- **Três colunas:** corpo clicável à esquerda, cartões e detalhe com gráfico no centro, alertas e check-in à direita.
- **Painel de alertas** que lista só os indicadores fora do normal, com os críticos primeiro.
- **Telas pequenas:** abaixo de cerca de 1100 px vira uma coluna, com a análise primeiro. Há ajustes para celular (alvos de toque de 44 px e campos com 16 px para evitar zoom automático no iPhone).

## 3. Faixas de referência: o que tem fonte e o que é decisão do app

Esta separação deve aparecer na apresentação. Dizer quais limites foram escolhas do app, e que precisam de validação médica, é mais forte do que fingir que todos vêm de uma fonte.

| Indicador | Vem de fonte | Decisão do app |
|---|---|---|
| Frequência cardíaca | Normal em repouso de 60 a 100 bpm | Limites críticos de 40 e 120 bpm |
| Pressão sistólica | Normal abaixo de 120 mmHg; acima de 180 é severo | Limites inferiores de 90 e 80 mmHg |
| Temperatura | Normal de 36,1 a 37,2 °C; febre a partir de 38 °C; hipotermia abaixo de 35 °C | Nenhuma |
| Sono | 7 a 9 h recomendadas; astronautas dormem em média cerca de 6 h em voo | Limites críticos de 5 e 11 h |
| Humor | Nenhuma | Toda a escala de 1 a 5 |

**Ressalvas honestas:**

- Os números vieram de resumos que citam AHA, Mayo Clinic e documentos da NASA. As páginas originais da AHA e da Mayo não puderam ser abertas, então é preciso conferir nas fontes primárias.
- Para temperatura, as fontes encontradas eram secundárias. Vale confirmar na MedlinePlus ou na Cleveland Clinic.
- As faixas valem para **adultos saudáveis em repouso**. Atletas, por exemplo, podem ter frequência cardíaca normal abaixo de 60 bpm. Um sistema real compararia cada pessoa com a própria linha de base.
- A escala de humor foi criada para o app e **não é um instrumento clínico validado**.

## 4. Como executar o projeto (Windows)

```text
cd C:\Users\arthu\OneDrive\Desktop\Nasa
npm install        (só na primeira vez)
npm run dev
```

O terminal mostra um endereço como `http://localhost:5173`. O app só funciona enquanto o servidor está ligado, e `Ctrl + C` o encerra.

Para testar a versão de produção, que é a que a Vercel gera:

```text
npm run build
npm run preview
```

Para abrir pelo celular na mesma rede Wi-Fi, inicie com `npm run dev -- --host` e use o endereço da linha `Network` que o terminal mostrar.

## 5. Problemas encontrados e como foram resolvidos

Registro útil para o README, para o vídeo e para quem for configurar o projeto depois.

| Problema | Causa | Solução |
|---|---|---|
| `npm` ou `node` não reconhecido | O terminal foi aberto com o PATH antigo, ou o Node não está no PATH | Adicionar `C:\Program Files\nodejs` ao PATH (na sessão ou de forma permanente) e reabrir o terminal; ou usar o Prompt de Comando |
| Execução de scripts desabilitada | Política padrão do PowerShell bloqueia o `npm.ps1` | `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`, ou usar `npm.cmd` |
| `package.json` inválido (JSON vazio) | Vários arquivos baixados chegaram com 0 bytes | Recriar os arquivos escrevendo direto no disco pelo PowerShell |
| `Rename-Item` recusou renomear `Data` para `data` | O Windows não diferencia maiúsculas de minúsculas | Renomear em duas etapas, passando por um nome temporário |
| Aviso de arquivo de swap do Vim no commit | `git commit` sem `-m` abriu o editor Vim | Apagar o arquivo `.git\.COMMIT_EDITMSG.swp` e usar `git commit -m "mensagem"` |
| Arquivo de documentação sumiu ao mover a pasta | `Remove-Item` numa pasta com conteúdo, sem conferir antes | Recriar o arquivo; antes de apagar, conferir com `dir` |

**Lição sobre maiúsculas e minúsculas:** no Windows tudo funciona com qualquer capitalização, mas o Git guarda o nome exato e a Vercel roda em Linux, que diferencia `Data` de `data`. Se o import diz `./data/indicators.js` e a pasta se chama `Data`, o build falha no deploy.

## 6. O que ainda falta

### 6.1 Entrega (essencial)

| # | Item | Observação |
|---|---|---|
| 1 | Conferir a capitalização no Git | `git ls-files src` deve mostrar `App.jsx` e `data/`; corrigir com `git mv` se necessário |
| 2 | Testar `npm run build` | Nunca foi confirmado que o build passa, e o deploy depende dele |
| 3 | Conferir as fontes primárias | Abrir os links originais e validar os números |
| 4 | Publicar o app | Gera o link público que o formulário do desafio pede e permite ver pelo celular |
| 5 | Gravar o vídeo de demonstração | 1 a 2 minutos; subir como "não listado" |
| 6 | Completar o README | Links da demo, do vídeo e do repositório, fonte primária da temperatura, licença e equipe |
| 7 | Adicionar o arquivo `LICENSE` | Se o README declarar MIT |
| 8 | Submeter no site do desafio | Confirmar o horário limite na página do desafio, que não foi possível verificar |

### 6.2 Melhorias de produto (opcionais)

O enunciado diz que estas ideias são sugestões, não obrigações.

| Melhoria | Valor |
|---|---|
| Glicemia (mg/dL) | O enunciado cita como exemplo de indicador |
| Comparação com a linha de base pessoal | Torna os alertas mais realistas |
| Lembretes para medir | O enunciado sugere prompts periódicos |
| Gamificação (sequência de dias, pontuação de prontidão) | Aumenta o engajamento |
| Seletor de ambiente (nave, estação, rover, base lunar ou marciana) | Adapta as dicas ao contexto |
| Escala de humor validada | Trocaria a escala criada pelo app por um questionário reconhecido, definido com um psicólogo |
| Entrada por imagem (câmera, ultrassom) | Amplia os tipos de dado aceitos |
| Compartilhamento seguro de relatórios com o cirurgião de voo | Fecha o ciclo de decisão |

## 7. Sugestão de roteiro para o vídeo (1 a 2 minutos)

1. **Problema (15 s):** missões longas e astronautas que precisam se monitorar sozinhos.
2. **Check-in (20 s):** preencher os indicadores.
3. **Status e orientação (30 s):** salvar um valor crítico, por exemplo temperatura 38,5, e mostrar o vermelho e a recomendação.
4. **Corpo clicável e gráfico (30 s).**
5. **Fechamento (15 s):** base científica, limitações e próximos passos.

## 8. Limitações e avisos

- Projeto educacional independente, **não é um produto oficial da NASA e não é dispositivo médico**. Não diagnostica nem trata nenhuma condição.
- Faixas e recomendações são para demonstração e precisam de validação por profissionais de saúde antes de qualquer uso real.
- As leituras ficam no `localStorage`, separado em cada aparelho: o celular não mostra os dados salvos no computador.
- O app compara valores com faixas gerais de adultos saudáveis, sem personalização.

## 9. Fontes consultadas

- NASA OCHMO, relatório técnico sobre acomodações de sono: https://www.nasa.gov/wp-content/uploads/2023/03/sleep-accomodations-technical-brief-ochmo.pdf
- Barger et al., sono de astronautas antes, durante e depois do voo espacial: https://pmc.ncbi.nlm.nih.gov/articles/PMC4188436
- Categorias de pressão arterial da American Heart Association, via Harvard Health: https://www.health.harvard.edu/heart-health/reading-the-current-blood-pressure-guidelines
- Frequência cardíaca em repouso, Mayo Clinic: https://www.mayoclinic.org/heart-rate/expert-answers/faq-20057979
- Temperatura corporal e hipotermia: fontes secundárias; conferir MedlinePlus ou Mayo Clinic.
- Página Resources do desafio no site do NASA Space Apps Challenge, ainda a consultar e citar.