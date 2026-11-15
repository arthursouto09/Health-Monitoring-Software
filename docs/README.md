# Documentação interna

Documentação da equipe, em português. A apresentação pública do projeto, em inglês, é o [README da raiz](../README.md).

| Documento | Para que serve |
|---|---|
| [arquitetura.md](arquitetura.md) | Diagramas, camadas, fluxo de uma leitura, back-end (rotas, login, banco, variáveis) e estrutura de arquivos |
| [funcionalidades.md](funcionalidades.md) | O que o app faz hoje e qual pedido do desafio cada funcionalidade atende |
| [indicadores-e-fontes.md](indicadores-e-fontes.md) | Faixas de referência, o que tem fonte e o que é decisão do app, linha de base, prontidão, ambientes e fontes |
| [como-executar.md](como-executar.md) | Rodar com ou sem Docker, criar contas, build, deploy na Vercel, roteiro de teste e problemas no Windows |
| [roadmap.md](roadmap.md) | O que falta: entrega, melhorias, ideias em discussão, limitações do back-end e limpeza |
| [apresentacao.md](apresentacao.md) | Roteiro do vídeo, pontos para destacar e limitações |

**Contexto:** NASA International Space Apps Challenge 2026, desafio *Create Health Monitoring Software for Astronauts on Space Missions*. Protótipo funcional de hackathon.

**Regra para manter atualizado:** ao mudar faixas ou textos em `src/data/`, atualize [indicadores-e-fontes.md](indicadores-e-fontes.md). Ao criar arquivos em `src/`, `api/` ou `server/`, ou mudar rotas e variáveis de ambiente, atualize [arquitetura.md](arquitetura.md).
