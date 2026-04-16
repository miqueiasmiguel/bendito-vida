## 1. Atualizar RecipeCard

- [x] 1.1 Importar `MixItem` de `@/stores/useSimulatorStore` em `RecipeCard.tsx`
- [x] 1.2 Alterar a interface `RecipeCardProps`: `ingredients: Ingredient[]` → `ingredients: MixItem[]`
- [x] 1.3 Remover o subtítulo hardcoded "Ingredientes (30g cada)" e substituir por "Ingredientes"
- [x] 1.4 Na lista de ingredientes, trocar `ing` por `item` (`MixItem`) e renderizar `{item.grams}g` ao lado do nome
- [x] 1.5 Substituir `ing.nutrition.calories` pelo valor escalado: `Math.round((item.ingredient.nutrition.calories * item.grams) / 100)` + "kcal"
- [x] 1.6 Atualizar a leitura de `isParaibano` e `color` para `item.ingredient.isParaibano` / `item.ingredient.color`

## 2. Atualizar result.tsx

- [x] 2.1 Remover `ingredientList` (o `.map((item) => item.ingredient)`) de `result.tsx`
- [x] 2.2 Passar `Object.values(mixItems)` como prop `ingredients` para `RecipeCard`
- [x] 2.3 Manter `ingredientList` apenas onde for necessário (ex: `handleSave` usa `ingredientList.map((i) => i.id)` → ajustar para `Object.values(mixItems).map((item) => item.ingredient.id)`)

## 3. Atualizar testes

- [x] 3.1 Localizar testes existentes de `RecipeCard` e ajustar o mock de `ingredients` para o formato `MixItem[]`
- [x] 3.2 Adicionar cenário de teste: ingrediente com 30g exibe calorias corretas (30g × kcal_100g / 100)
- [x] 3.3 Adicionar cenário de teste: ingrediente com 60g exibe "60g" e calorias dobradas em relação a 30g
