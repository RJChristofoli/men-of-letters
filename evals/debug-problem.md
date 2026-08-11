# debug-problem

## Deve ativar

- "Descubra por que este worker processa o evento duas vezes."
- "Investigue este teste intermitente sem editar o código."
- "Depois do deploy os pedidos duplicam; encontre a causa e corrija-a."

## Não deve ativar

- "Implemente este endpoint novo."
- "A causa já foi isolada no parser; implemente a correção descrita."
- "Revise o diff desta branch."
- "Pesquise bibliotecas para filas."

## Sinais de qualidade

- Separa sintomas, observações e hipóteses.
- Identifica a primeira transição incorreta ou invariante violada.
- Permanece somente leitura quando o pedido é apenas diagnóstico.
- Valida a falha original depois de uma correção autorizada.
