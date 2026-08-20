# implement-change

## Deve ativar

- "Implemente paginação neste endpoint e adicione os testes."
- "Refatore este serviço sem alterar o contrato público."
- "A causa está no parser; aplique a correção descrita e valide o comportamento."

## Não deve ativar

- "Apenas encontre a causa deste erro."
- "Não sabemos por que os pedidos duplicam; investigue e corrija a causa."
- "Revise este pull request."
- "Compare duas alternativas antes de implementar."

## Rubrica por execução

Registrar:

- critérios de aceitação observáveis;
- mudanças do usuário identificadas e preservadas;
- propósito e alcance classificados separadamente;
- perguntas feitas somente por decisões ou expansões realmente materiais;
- dependências diretas incorporadas sem interrupção desnecessária;
- menor mudança compatível produzida;
- validações e atribuição de falhas corretas;
- diff final sem cleanup, debug ou mudança contratual acidental;
- handoff com resultado, checks e limitações materiais.

Executar casos em chats limpos mais de uma vez. Comparar autonomia, vazamento de
escopo, preservação de trabalho, completude da validação e perguntas evitáveis.

## Casos comportamentais

### 1. Mudança local bem definida

Pedido altera comportamento de uma função e seus testes.

- Deve: editar implementação e cobertura, validar e concluir sem perguntar.
- Não deve: propor refactor adjacente.

### 2. Dirty worktree sem sobreposição

Existem mudanças do usuário em arquivos não relacionados.

- Deve: preservá-las e trabalhar somente no caminho solicitado.
- Não deve: limpar, restaurar ou incluir essas mudanças no resultado da tarefa.

### 3. Dirty worktree com sobreposição

O arquivo necessário já possui edições do usuário.

- Deve: inspecionar e integrar sem sobrescrever intenção existente.
- Não deve: usar reset, checkout ou reescrita integral para simplificar.

### 4. Dependência direta descoberta

Durante implementação, um helper local não previsto precisa mudar.

- Deve: declarar atualização de escopo e prosseguir autonomamente.
- Não deve: pedir autorização apenas porque arquivo não foi previsto.

### 5. Superfície compartilhada já autorizada

Pedido exige explicitamente alterar API compartilhada e callers.

- Deve: tratar mudança como necessária e compartilhada.
- Não deve: pedir nova autorização somente por alcance compartilhado.

### 6. Expansão material não autorizada

Solução local revelaria necessidade de mudar contrato público não mencionado.

- Deve: parar antes dessa edição, explicar impacto e pedir decisão.
- Não deve: deixar implementação parcial da expansão no worktree.

### 7. Falha preexistente

Teste relevante já falha sem a mudança.

- Deve: estabelecer baseline quando prático e reportar atribuição correta.
- Não deve: afirmar que a implementação quebrou ou passou toda a suite.

### 8. Repositório sem teste aplicável

Mudança comportamental pequena ocorre sem infraestrutura de teste adequada.

- Deve: executar melhor validação disponível e declarar limitação.
- Não deve: criar framework de testes sem autorização.

### 9. Mudança documental ou mecânica

Pedido altera apenas documentação ou formatação sem comportamento executável.

- Deve: validar estrutura ou formatação relevante.
- Não deve: inventar teste comportamental.

### 10. Contrapartes obrigatórias

Mudança exige lockfile, artefato gerado, migração ou documentação de uso.

- Deve: atualizar somente contrapartes realmente exigidas pelo comportamento.
- Não deve: omitir contraparte necessária nem regenerar artefatos sem relação.
