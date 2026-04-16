## Context

O simulador atual exibe ingredientes em `ScrollView` horizontal com cards de largura fixa (96px) e altura variável (`alignSelf: 'flex-start'`). A seleção é binária (toggle). O jarro usa `fillColor = lastIngredient.color`, substituindo a cor a cada mudança. O store modela a seleção como `selectedIngredients: Ingredient[]` (lista de ingredientes sem quantidade).

## Goals / Non-Goals

**Goals:**
- Grade 3 colunas com cards de tamanho idêntico (largura e altura fixas, calculadas em função da tela)
- Modelo de quantidade: cada toque soma 30g ao ingrediente; o badge no card exibe a quantidade atual
- Remoção via toque no badge de quantidade (remove toda a porção do ingrediente)
- Jarro com gradiente empilhado proporcional às gramas de cada ingrediente no mix

**Non-Goals:**
- Input numérico de gramas (slider, campo de texto)
- Drag-and-drop para reordenar
- Animação individual por segmento de cor no jarro (gradiente estático é suficiente)

## Decisions

### 1. Layout da grade

**Decisão:** `FlatList` com `numColumns={3}` + largura de card calculada: `cardWidth = (screenWidth - paddingHorizontal * 2 - columnGap * 2) / 3`.

**Alternativa considerada:** `ScrollView` com `flexWrap: 'wrap'` — descartado porque não respeita altura uniforme de forma confiável entre Android/iOS quando o conteúdo do texto varia.

**Por que FlatList:** `numColumns` garante grade fixa, `getItemLayout` permite otimização, e a altura do card é controlável com `minHeight` fixo. O card usa `numberOfLines={2}` no texto do nome para limitar a quebra de linha a exatamente 2 linhas, e `height` fixa no estilo previne variação.

**Altura fixa do card:** `height: 100` (dot 28 + margin 8 + text block 36 + calories 16 + padding 12). Calculado para acomodar nomes longos em 2 linhas sem overflow.

### 2. Modelo de quantidade no store

**Decisão:** Substituir `selectedIngredients: Ingredient[]` por `mixItems: Record<string, { ingredient: Ingredient; grams: number }>`. Adicionar ações `addGrams(ingredient, amount)` e `removeIngredient(id)`.

**Por que Record:** Acesso O(1) por id, sem duplicatas, e a quantidade é um campo explícito. Facilita cálculo nutricional: `totalNutrition = Object.values(mixItems).reduce(...)`.

**Cálculo nutricional:** Os valores em `ingredients.ts` são por 100g. Escalar: `nutrient = (ingredient.nutrition.fiber * grams) / 100`.

**Retrocompatibilidade:** `calculateNutrition` em `nutrition-engine.ts` aceita `Ingredient[]`. Criar um adaptador local no store ou na tela que converte `mixItems` → array ponderado, ou atualizar `calculateNutrition` para aceitar `Array<{ ingredient: Ingredient; grams: number }>`.

### 3. Cor do jarro — gradiente empilhado

**Decisão:** Calcular `stops` dinamicamente a partir de `mixItems`. Para cada ingrediente no mix, o segmento de cor ocupa `grams / totalGrams` da largura do gradiente.

```
stops = mixItems.map((item, i, arr) => {
  const offset = arr.slice(0, i).reduce((s, x) => s + x.grams, 0) / totalGrams;
  const end = offset + item.grams / totalGrams;
  return [{ offset, color }, { offset: end, color }];
}).flat();
```

**Por que gradiente horizontal:** O `LinearGradient` do `react-native-svg` com `x1="0" x2="1"` já está em uso no `MixJar`. Basta tornar os `<Stop>` dinâmicos em vez de hardcoded.

**Jarro vazio:** quando `totalGrams === 0`, manter `fillColor = colors.neutral[200]` com gradiente simples (estado atual).

### 4. Badge de quantidade e remoção

**Decisão:** Quando `grams > 0`, exibir um badge no canto superior esquerdo do card com o texto "Xg". O toque no badge remove toda a porção daquele ingrediente (`removeIngredient(id)`).

**Posicionamento:** `position: 'absolute', top: -6, left: -6` — simétrico ao selo paraibano no canto direito.

**Cor:** `accent-500` (laranja) para destacar a quantidade; texto branco bold.

## Risks / Trade-offs

- **Risco: `numColumns` + `FlatList` quebra em telas muito estreitas (<320px)** → Card com `minWidth: 0` e largura calculada dinamicamente via `useWindowDimensions` mitiga isso.
- **Risco: Gradiente com muitos stops** → limitado pelo número de ingredientes (≤15); sem impacto de performance.
- **Trade-off: Remoção via badge é menos descobrível** → Aceitável para MVP/demo; texto "toque no badge para remover" pode ser adicionado na subtitle.
- **Trade-off: Atualizar `calculateNutrition` vs. adaptador local** → Optou-se por adaptador local na tela para não quebrar testes existentes do nutrition-engine.
