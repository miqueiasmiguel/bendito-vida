## Context

O `RecipeCard` atualmente recebe `ingredients: Ingredient[]` (sem gramas), o que o força a usar dados hardcoded ("30g cada") e calorias per-100g por ingrediente. A tela `result.tsx` descarta as gramas ao fazer `.map((item) => item.ingredient)` antes de passar para o componente. O store `useSimulatorStore` já mantém `mixItems: Record<string, MixItem>` com gramas reais — a informação existe, mas não é propagada até o card.

## Goals / Non-Goals

**Goals:**
- Exibir as gramas reais de cada ingrediente no `RecipeCard`
- Exibir as calorias reais (escaladas pelas gramas) por ingrediente no card
- Remover o subtítulo hardcoded "30g cada"

**Non-Goals:**
- Adicionar cap máximo de gramas por ingrediente (o spec permite acumulação ilimitada por design)
- Refatorar o layout ou estilo visual do card
- Alterar a lógica de cálculo nutricional agregado (já está correto em `calculateNutritionFromMix`)

## Decisions

### Alterar a prop `ingredients` de `Ingredient[]` para `MixItem[]`

**Decisão:** `RecipeCard` passa a receber `ingredients: MixItem[]` em vez de `ingredients: Ingredient[]`.

**Rationale:** `MixItem` já contém `{ ingredient: Ingredient; grams: number }` — é o tipo exato que o card precisa para renderizar gramas e calorias reais. Criar um novo tipo intermediário seria complexidade desnecessária.

**Alternativa descartada:** Adicionar uma segunda prop `gramsMap: Record<string, number>` mantendo `ingredients: Ingredient[]`. Rejeitada por gerar dois pontos de verdade para os mesmos dados.

### Calorias por ingrediente calculadas inline no card

**Decisão:** No render de cada ingrediente, calcular `Math.round((item.ingredient.nutrition.calories * item.grams) / 100)` diretamente no JSX — sem helper externo.

**Rationale:** É uma única expressão aritmética usada uma vez. Extrair um helper seria over-engineering para este caso.

### Subtítulo dinâmico: remover "30g cada"

**Decisão:** Substituir o subtítulo estático "Ingredientes (30g cada)" por "Ingredientes" simples, e adicionar o valor de gramas (`{item.grams}g`) como texto ao lado do nome de cada ingrediente na lista.

## Risks / Trade-offs

- [Quebra de interface] Callers de `RecipeCard` que passam `Ingredient[]` vão falhar na compilação → **mitigação:** há apenas um caller (`result.tsx`); atualizado junto.
- [Testes existentes] Testes que instanciam `RecipeCard` com `Ingredient[]` vão falhar → **mitigação:** atualizar os testes na mesma tarefa.
