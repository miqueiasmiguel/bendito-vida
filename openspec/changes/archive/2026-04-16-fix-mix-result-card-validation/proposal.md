## Why

O `RecipeCard` da tela `/result` exibe informações nutricionais incorretas: o subtítulo da lista está hardcoded como "30g cada" mesmo quando o usuário adicionou quantidades diferentes (60g, 90g...), as calorias por ingrediente mostram o valor por 100g em vez das calorias reais pelas gramas adicionadas, e a interface do componente recebe apenas `Ingredient[]` sem as quantidades, descartando os dados de gramas do mix.

## What Changes

- **`RecipeCard`**: alterar prop `ingredients: Ingredient[]` para `ingredients: MixItem[]` para receber as gramas reais de cada ingrediente.
- **`RecipeCard`**: remover subtítulo hardcoded "Ingredientes (30g cada)"; mostrar gramas reais de cada ingrediente (ex: "30g", "60g") junto ao nome.
- **`RecipeCard`**: calcular e exibir as calorias reais por ingrediente (`(kcal_por_100g * grams) / 100`) em vez de `ing.nutrition.calories` (valor per-100g).
- **`result.tsx`**: passar `Object.values(mixItems)` (`MixItem[]`) para `RecipeCard` em vez de `ingredientList` (`Ingredient[]`).
- **Atualizar `RecipeCardProps`** e todos os testes que criam instâncias de `RecipeCard` para a nova interface.

## Capabilities

### New Capabilities
<!-- nenhuma nova capability — apenas correção de dados exibidos no card existente -->

### Modified Capabilities
- `recipe-card`: os requisitos de exibição de ingredientes mudam — agora SHALL mostrar as gramas reais de cada ingrediente e as calorias escaladas pelas gramas, em vez de "30g cada" hardcoded e calorias per-100g.

## Impact

- `src/components/ui/RecipeCard.tsx` — interface e renderização de ingredientes
- `src/app/result.tsx` — chamada ao `RecipeCard`
- Testes unitários de `RecipeCard` (adaptação de props)
