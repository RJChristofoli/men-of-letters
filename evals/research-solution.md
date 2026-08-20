# research-solution

## Deve ativar

- "Pesquise qual biblioteca atualmente atende estes requisitos."
- "Compare o suporte e o licenciamento atuais destas plataformas."
- "Verifique compatibilidade e proponha experimento se a documentação não bastar."

## Não deve ativar

- "Implemente a arquitetura já aprovada."
- "Analise o fluxo deste repositório e proponha uma solução baseada nele."
- "Encontre a causa deste teste quebrado."
- "Revise este commit."

## Rubrica por execução

Registrar:

- decisão e critérios realmente dependentes de evidência externa;
- fontes primárias ou autoritativas para claims materiais;
- versão, data e escopo aplicáveis;
- fatos documentados, medições, inferências e premissas separados;
- conflitos de fonte resolvidos ou declarados;
- menor conjunto de alternativas materialmente distintas;
- critérios comparáveis aplicados de forma equivalente;
- experimento incluído somente quando incerteza empírica exigir;
- recomendação, confiança, contraindicações e saída claras;
- pesquisa encerrada sem coleta irrelevante.

Executar casos em chats limpos mais de uma vez. Comparar qualidade das fontes,
atualidade, consistência do ranking, experimentos desnecessários e claims sem
suporte.

## Casos comportamentais

### 1. Compatibilidade documentada

Documentação oficial atual resolve compatibilidade para versão em uso.

- Deve: citar versão e recomendar sem experimento artificial.
- Não deve: criar benchmark ou prova de conceito sem necessidade.

### 2. Licenciamento atual

Decisão depende de termos atuais de licença e distribuição.

- Deve: usar fonte oficial e registrar data aplicável.
- Não deve: confiar em memória ou blog secundário quando fonte primária existe.

### 3. Claim de fornecedor

Fornecedor publica ganho de performance sem medição representativa do projeto.

- Deve: classificar como claim documentado, não resultado observado.
- Não deve: apresentar ganho numérico como garantido.

### 4. Fontes conflitantes

Documentação, issue oficial e comportamento observado divergem por versão.

- Deve: verificar contexto e identificar qual evidência controla decisão.
- Não deve: ocultar conflito ou contar fontes como votos equivalentes.

### 5. Incerteza empírica decisiva

Escolha depende de latência sob workload específico não coberto por fontes.

- Deve: definir experimento isolado, falsificável e representativo.
- Não deve: inventar benchmark ou executar contra produção.

### 6. Opção de não mudar

Solução atual ainda atende critérios e migração possui custo relevante.

- Deve: comparar no change como opção real.
- Não deve: assumir que ferramenta nova precisa vencer.

### 7. Uma única opção viável

Restrições eliminam todas menos uma alternativa.

- Deve: demonstrar eliminação sem inventar concorrentes.
- Não deve: preencher quantidade fixa de opções.

### 8. Muitas variações equivalentes

Várias opções compartilham mesmos trade-offs materiais.

- Deve: consolidá-las ou eliminar as irrelevantes.
- Não deve: produzir catálogo extenso sem impacto na decisão.

### 9. Questão respondida pelo repositório

Escolha depende principalmente do fluxo e contratos internos atuais.

- Deve: rotear para `analyze-technical-solution`.
- Não deve: iniciar pesquisa externa ampla.

### 10. Evidência insuficiente

Claim decisiva não possui fonte confiável nem teste seguro disponível.

- Deve: declarar fato pendente, impacto no ranking e menor validação necessária.
- Não deve: escolher vencedor com falsa confiança.
