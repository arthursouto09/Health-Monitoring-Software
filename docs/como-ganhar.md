# Pesquisa de premiação (o que não está em outro doc)

> Destilado de 5 documentos de planejamento interno (apagados depois de revisados).
> Baseado em pesquisa web — confirmar o que for regra de submissão na aba **Project**
> da página oficial da equipe, que sempre prevalece.

## Referência: um vencedor real do mesmo tema

**SpaceGenes+** — um dos 10 Global Winners de 2025 (prêmio "Best Use of Science"):
dashboard interativo que cruzava **radiação + microgravidade** com risco à saúde do
astronauta. Tema quase idêntico ao nosso. Lição: ciência real e bem citada + interface
clara ganha — não precisa ser mais complexo que isso.

## ⚠️ Verificar hoje antes de gravar o vídeo

Achamos uma contradição entre duas fontes internas:
- `docs/apresentacao.md` (Arthur) tem um roteiro de **1 a 2 minutos**.
- Pesquisa anterior do time apontava a regra: **vídeo de no máximo 30 segundos OU
  no máximo 7 slides — um dos dois, não os dois.**

Nenhuma das duas fontes é a regra oficial confirmada. **Antes de gravar, confirmar na
aba Project** qual é o limite real. Se for 30s, o roteiro de 1-2 min precisa ser cortado
bem mais ou trocado por slides.

## Regras de submissão ainda não cobertas em nenhum doc do projeto

- **Declarar o uso de IA** (onde e como foi usada no projeto) — é regra de submissão,
  não sugestão. Conteúdo gerado por IA em vídeo/imagem precisa de marca d'água.
- Seção **"NASA Resources Used"** no formulário de submissão, listando os recursos
  NASA/CSA usados explicitamente (o `hazards.js` já cobre o conteúdo — falta só
  escrever essa seção para a submissão).
- Repositório **público** no GitHub com o app funcionando no link do deploy.

## O que esses documentos pediam, e o que disso ainda falta

Quase tudo que a pesquisa anterior listava como "diferencial pra ganhar" já está feito,
entre as duas branches combinadas: semáforo geral, baseline pessoal/tendência, mapa
Hazard → Indicador → Contramedida (NASA HRP), indicador ósseo/muscular (exercício),
relatório ao flight surgeon, corpo SVG melhor, e de bônus (nem eram pedidos): gamificação
e seletor de ambiente.

**Ainda falta, segundo essa pesquisa:**
- Indicador de **radiação** (ou sintomas) — nenhum dos dois lados tem.
- Narrativa explícita de **"comunicação atrasada" / Modo Marte** (seletor de missão
  com selo de delay de sinal) — existe pronta na branch `main` original (não a
  integrada), como `MissionControls.jsx`. Ficou de fora da integração por corte de
  escopo; os critérios de julgamento pesquisados sugerem que isso ajuda o critério de
  Impacto, então vale reconsiderar trazer de volta se der tempo.
