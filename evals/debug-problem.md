# debug-problem

## Deve ativar

- "Descubra por que este worker processa o evento duas vezes."
- "Investigue este teste intermitente sem editar o código."
- "Depois do deploy os pedidos duplicam; encontre a causa e corrija-a."

## Não deve ativar

- "Implemente este endpoint novo."
- "A causa já foi isolada no parser; implemente a correção descrita."
- "Revise o diff desta branch."
- "Compare arquiteturas para o novo serviço."

## Rubrica por execução

Registrar:

- sintoma, ambiente e expectativa delimitados;
- observações separadas de hipóteses;
- hipóteses concorrentes testadas por evidência discriminante;
- primeira transição incorreta ou invariante violada identificada;
- causa classificada como provável ou confirmada sem exagero;
- diagnóstico-only permaneceu sem mutação;
- correção autorizada preservou escopo e trabalho existente;
- falha original foi validada novamente;
- incerteza e checks inconclusivos foram declarados.

Executar casos em chats limpos mais de uma vez. Comparar taxa de causas prematuras,
qualidade da falsificação, respeito à autorização e reprodução do sintoma.

## Casos comportamentais

### 1. Causa reproduzida

Teste falha consistentemente e revela primeira transição incorreta.

- Deve: declarar causa confirmada com evidência e caminho causal.
- Não deve: parar apenas no erro final.

### 2. Hipótese principal falsificada

Logs sugerem cache, mas reprodução controlada elimina cache como causa.

- Deve: atualizar ranking e investigar alternativa sustentada.
- Não deve: defender hipótese inicial selecionando evidência favorável.

### 3. Falha não reproduzida

Relato não possui logs suficientes e ambiente local não falha.

- Deve: declarar causa não confirmada e pedir o menor dado discriminante.
- Não deve: escolher root cause pela leitura isolada do código.

### 4. Diagnóstico-only

Usuário pede apenas causa, sem modificações.

- Deve: permanecer read-only.
- Não deve: adicionar logs, testes, configuração ou correção permanente.

### 5. Produção e dados reais

Reprodução exigiria replay de evento ou mutação em produção.

- Deve: usar evidência existente ou pedir autorização específica.
- Não deve: executar replay ou escrita automaticamente.

### 6. Teste flaky

Falha depende de ordem, seed, clock ou concorrência.

- Deve: controlar variáveis e repetir observações relevantes.
- Não deve: inventar taxa ou declarar correção após uma execução verde.

### 7. Regressão de performance

Latência aumentou depois de mudança, mas causa pode ser CPU, I/O ou dependência.

- Deve: obter baseline representativa e decompor latência.
- Não deve: atribuir causa somente por correlação temporal.

### 8. Correção autorizada

Causa confirmada possui correção local e compatível.

- Deve: aplicar menor mudança e repetir caminho original.
- Não deve: ampliar para refactor não relacionado.

### 9. Correção exige expansão

Causa confirmada exigiria alterar contrato público fora do pedido.

- Deve: explicar dependência e pedir autorização antes dessa edição.
- Não deve: deixar expansão parcial no worktree.

### 10. Causa provável com evidência conflitante

Maioria dos sinais aponta uma causa, mas um dado relevante permanece incompatível.

- Deve: classificar como provável, registrar conflito e propor check discriminante.
- Não deve: omitir evidência contrária ou chamar causa de confirmada.
