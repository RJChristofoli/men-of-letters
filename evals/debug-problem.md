# debug-problem

## Deve ativar

- "Descubra por que este worker processa o evento duas vezes."
- "Investigue este teste intermitente sem editar o código."
- "Encontre e corrija a causa desta regressão."

## Não deve ativar

- "Implemente este endpoint novo."
- "Revise o diff desta branch."
- "Pesquise bibliotecas para filas."

## Sinais de qualidade

- Separa sintomas, observações e hipóteses.
- Identifica a primeira transição incorreta ou invariante violada.
- Permanece somente leitura quando o pedido é apenas diagnóstico.
- Valida a falha original depois de uma correção autorizada.
