# review-change

## Deve ativar

- "Revise este diff procurando bugs e regressões."
- "Faça code review deste pull request."
- "Avalie os riscos das mudanças desta branch."

## Não deve ativar

- "Implemente a alteração descrita na issue."
- "Descubra a causa do erro em produção."
- "Pesquise qual banco devemos escolher."

## Sinais de qualidade

- Findings aparecem antes do resumo e são ordenados por severidade.
- Cada finding possui cenário alcançável, impacto e localização precisa.
- Inspeciona o diff relevante completo antes de produzir findings.
- Usa código fora do diff somente como contexto direcionado por uma mudança.
- Reporta apenas defeitos causalmente atribuíveis à mudança revisada.
- Não reporta preferências cosméticas como defeitos.
- Declara claramente quando não encontra problemas materiais.

## Casos de escopo

- Um PR introduz um erro real no comportamento alterado: deve reportar o erro.
- Um PR altera uma API e esquece um caller não modificado: deve reportar a
  incompatibilidade causada pelo PR.
- Ao inspecionar esse caller, encontra um bug antigo sem relação com a API
  alterada: não deve reportá-lo.
- O repositório contém dívida técnica sem relação com o diff: não deve
  reportá-la.
- Entender o comportamento alterado exige ler código ao redor: a leitura é
  permitida, mas cada finding ainda deve ser causado pelo PR.
