# Men of Letters

Uma coleção pequena de skills para ajudar no desenvolvimento de software com
mais consistência, evidência e menos desperdício de contexto.

O projeto não possui policies globais, catálogo, packs, bootstrap próprio ou
processo de governança. Cada skill é autocontida e só entra no contexto quando
o trabalho correspondente é selecionado.

## Skills

| Skill | Finalidade |
| --- | --- |
| `analyze-technical-solution` | Analisar problemas e decisões técnicas antes da implementação. |
| `implement-change` | Implementar mudanças pequenas, compatíveis e verificadas. |
| `debug-problem` | Encontrar causas raiz e corrigir falhas quando autorizado. |
| `review-change` | Revisar diffs e apontar defeitos acionáveis. |
| `research-solution` | Pesquisar e comparar alternativas técnicas com fontes confiáveis. |

## Instalação

### Com o instalador de skills

No Codex, peça:

```text
$skill-installer instale todas as skills de https://github.com/RJChristofoli/men-of-letters
```

### Manualmente para o usuário

Clone o repositório e copie as pastas para o diretório pessoal de skills:

```bash
git clone https://github.com/RJChristofoli/men-of-letters.git
cd men-of-letters
mkdir -p "$HOME/.agents/skills"
cp -R skills/. "$HOME/.agents/skills/"
```

### Somente em um repositório

Execute no repositório em que as skills devem ficar disponíveis:

```bash
mkdir -p .agents/skills
cp -R /caminho/para/men-of-letters/skills/. .agents/skills/
```

Reinicie o Codex caso uma skill recém-instalada não apareça. Use `/skills` ou
digite `$` para selecionar uma skill explicitamente.

## Uso

As skills podem ser ativadas automaticamente por uma solicitação compatível ou
explicitamente:

```text
$analyze-technical-solution analise esta decisão antes de implementar
$implement-change implemente esta alteração e valide o resultado
$debug-problem encontre a causa deste teste intermitente
$review-change revise este diff procurando regressões
$research-solution compare estas bibliotecas e recomende uma
```

## Estrutura

```text
men-of-letters/
├── .codex-plugin/plugin.json
├── skills/
│   ├── analyze-technical-solution/SKILL.md
│   ├── implement-change/SKILL.md
│   ├── debug-problem/SKILL.md
│   ├── review-change/SKILL.md
│   └── research-solution/
│       ├── SKILL.md
│       └── references/evidence-and-alternatives.md
├── evals/
├── README.md
└── LICENSE
```

## Desenvolvimento

Mantenha cada skill focada em um único trabalho. Adicione referências ou scripts
somente quando o uso real demonstrar necessidade. Os casos em `evals/` são
checklists leves para testar ativação, limites e qualidade antes de publicar uma
mudança.
