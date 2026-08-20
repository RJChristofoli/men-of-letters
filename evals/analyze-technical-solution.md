# analyze-technical-solution

## Deve ativar

- "Analise este requisito e proponha uma solução antes do plano."
- "Investigue o fluxo atual e compare alternativas arquiteturais."
- "Consolide a decisão técnica sem implementar."

## Não deve ativar

- "Implemente a solução já aprovada."
- "Descubra por que este teste falha."
- "Pesquise o suporte atual destas bibliotecas."
- "Revise este diff."

## Rubrica por execução

Registrar:

- problema declarado separado da decisão real;
- fluxo atual sustentado por evidência do repositório;
- fatos, inferências, hipóteses e premissas sem mistura;
- somente gaps capazes de afetar decisão;
- alternativas materialmente distintas e viáveis;
- mesmos critérios decisivos aplicados às alternativas;
- recomendação, trade-offs e condições de mudança claros;
- riscos e checks de domínio somente quando relevantes;
- ausência de implementação ou plano detalhado;
- uso de um dos três status permitidos.

Executar casos em chats limpos mais de uma vez. Comparar decisão, evidência,
proporcionalidade, perguntas bloqueantes e consistência do status.

## Casos comportamentais

### 1. Mudança pequena no fluxo existente

Repositório oferece evidência suficiente e alternativa incremental é clara.

- Deve: produzir análise curta e status ready for planning.
- Não deve: preencher todas as áreas de impacto ou inventar alternativas.

### 2. Decisão de alto risco

Mudança envolve dados persistidos, compatibilidade e rollout gradual.

- Deve: detalhar migração, coexistência, validação e rollback relevantes.
- Não deve: tratar risco como checklist genérico.

### 3. Gap realmente bloqueante

Duas respostas de negócio levam a contratos incompatíveis.

- Deve: explicar impacto da resposta e terminar blocked by decision-relevant gaps.
- Não deve: escolher comportamento de produto arbitrariamente.

### 4. Gap não bloqueante

Detalhe desconhecido muda apenas nome ou mecanismo interno.

- Deve: adotar default explícito e continuar.
- Não deve: interromper análise com pergunta trivial.

### 5. Alternativa estrutural sem necessidade

Solução local atende resultado e arquitetura atual.

- Deve: preferir mudança incremental.
- Não deve: recomendar rewrite por elegância.

### 6. Nenhuma alternativa real

Contrato aceito e restrições determinam uma única solução compatível.

- Deve: explicar por que decisão está determinada.
- Não deve: inventar opções para preencher comparação.

### 7. Falha com causa desconhecida

Pedido é encontrar motivo de comportamento incorreto.

- Deve: rotear para `debug-problem`.
- Não deve: produzir alternativas arquiteturais antes da causa.

### 8. Decisão dependente de fatos externos

Ranking depende de licença, suporte ou compatibilidade atual de fornecedor.

- Deve: rotear para `research-solution`.
- Não deve: responder apenas com memória ou código local.

### 9. Refinamento iterativo

Usuário fornece resposta que invalida premissa anterior.

- Deve: atualizar somente decisões, alternativas, riscos e status afetados.
- Não deve: reiniciar análise completa.

### 10. Consolidação antes do plano

Usuário aceita solução e quer decisão final.

- Deve: consolidar escolha, trade-offs, premissas, riscos e validações.
- Não deve: gerar sequência detalhada de tarefas ou editar arquivos.
