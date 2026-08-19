# review-change

## Deve ativar

- "Revise este diff procurando bugs e regressões."
- "Faça code review deste pull request."
- "Avalie os riscos das mudanças desta branch."

## Não deve ativar

- "Implemente a alteração descrita na issue."
- "Descubra a causa do erro em produção."
- "Pesquise qual banco devemos escolher."

## Rubrica por execução

Registrar para cada caso:

- delta declarado corretamente, incluindo staged, unstaged e untracked;
- defeitos esperados encontrados;
- falsos positivos e findings duplicados;
- prioridade esperada e prioridade recebida;
- localização na menor linha ou intervalo relevante;
- presença de cenário, impacto, causa no delta e correção;
- bugs preexistentes, melhorias opcionais e riscos especulativos excluídos;
- lacunas de validação separadas dos findings;
- findings apresentados antes de qualquer resumo.

Executar cada caso em chats limpos mais de uma vez. Comparar precisão, recall,
concordância de prioridade, completude dos campos e vazamento de escopo. O texto
pode variar; decisões, evidência e classificação devem permanecer equivalentes.

## Casos comportamentais

### 1. Defeito introduzido diretamente

O delta adiciona uma dereferência comprovadamente nula em um fluxo alterado.

- Deve: reportar uma vez, localizar a linha alterada e explicar entrada, falha,
  causalidade e menor guard viável.
- Não deve: transformar estilo adjacente em finding.

### 2. Counterpart ausente fora do diff

O delta torna obrigatório um campo de API, mas um caller não alterado continua
omitindo-o.

- Deve: localizar a mudança do contrato e identificar o caller afetado.
- Não deve: rejeitar o finding somente porque a manifestação está fora do diff.

### 3. Bug preexistente

Ao seguir um caller afetado, aparece um bug que falha da mesma forma antes e depois
do delta.

- Deve: excluí-lo.
- Não deve: ampliar o review para uma auditoria do módulo.

### 4. Melhoria opcional tentadora

O delta funciona, mas inclui nome pouco expressivo ou função longa.

- Deve: produzir nenhum finding por esse motivo.
- Não deve: usar P3, `nit` ou `risk` para preferência.

### 5. Risco sem cenário sustentado

Uma falha dependeria de comportamento de serviço externo não documentado nem
observável no repositório.

- Deve: omitir o finding e, somente se material, registrar validação pendente.
- Não deve: atribuir prioridade a hipótese ou pergunta.

### 6. Mesmo root cause em vários locais

Uma mudança de normalização causa a mesma falha em vários consumidores.

- Deve: produzir um finding consolidado quando correção e causa forem iguais.
- Não deve: inflar severidade ou quantidade pela repetição dos sintomas.

### 7. Teste ausente sem defeito demonstrado

O comportamento novo está correto, mas não recebeu teste específico.

- Deve: mencionar como lacuna somente quando a validação for material.
- Não deve: tratar ausência isolada de teste como finding.

### 8. Teste alterado mascara regressão

O delta enfraquece uma asserção e permite comportamento incorreto conhecido.

- Deve: reportar o teste alterado como finding causal.
- Não deve: descrever apenas "faltou cobertura".

### 9. Working tree composto

O repositório possui mudanças staged, unstaged e arquivo untracked relevante.

- Deve: declarar e revisar as três superfícies por padrão.
- Não deve: tratar `git diff` isolado como delta completo.

### 10. Compressão concorrente

Uma skill de formato curto está ativa durante o review.

- Deve: preservar prioridade, local, cenário, impacto, causa e correção.
- Não deve: admitir nits, perguntas ou riscos especulativos como findings.

## Saída sem findings

Quando nenhum defeito material sobreviver ao gate:

- deve declarar claramente, no idioma do usuário, que nenhum defeito material foi
  encontrado;
- pode listar lacunas de validação e riscos residuais materiais;
- não deve preencher a resposta com melhorias opcionais.
