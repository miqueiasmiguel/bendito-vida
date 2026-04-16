## 1. Store — Modelo de quantidade

- [x] 1.1 Substituir `selectedIngredients: Ingredient[]` por `mixItems: Record<string, { ingredient: Ingredient; grams: number }>` em `useSimulatorStore.ts`
- [x] 1.2 Adicionar ação `addGrams(ingredient: Ingredient, amount: number)` que soma gramas ao item existente ou cria um novo com a quantidade fornecida
- [x] 1.3 Adicionar ação `removeIngredient(id: string)` que remove o item do record
- [x] 1.4 Remover ações `addIngredient`, `removeIngredient` (antiga), `toggleIngredient`
- [x] 1.5 Atualizar `clearMix` para resetar `mixItems` para `{}`

## 2. MixJar — Gradiente empilhado

- [x] 2.1 Atualizar interface `MixJarProps`: substituir `fillColor: string` por `fillStops: Array<{ color: string; weight: number }>`
- [x] 2.2 Implementar função utilitária `computeGradientStops(fillStops)` que converte os pesos em offsets (0–1) para os `<Stop>` do LinearGradient
- [x] 2.3 Renderizar `<Stop>` dinamicamente a partir dos stops calculados dentro do `<LinearGradient>` existente
- [x] 2.4 Tratar caso `fillStops` vazio: usar `colors.neutral[200]` como cor única

## 3. IngredientCard — Tamanho fixo e badge de quantidade

- [x] 3.1 Atualizar interface `IngredientCardProps`: substituir `selected: boolean` por `grams: number`; adicionar `onRemove: (id: string) => void`; adicionar `cardWidth: number`
- [x] 3.2 Aplicar `width: cardWidth` e `height: 100` fixo ao estilo do card para garantir uniformidade na grade
- [x] 3.3 Adicionar `numberOfLines={2}` e altura fixa ao container do `Text` do nome para evitar variação de altura
- [x] 3.4 Mostrar borda `primary-700` quando `grams > 0` (substitui lógica de `selected`)
- [x] 3.5 Adicionar badge de quantidade: `position: 'absolute', top: -6, left: -6`, bg `accent-500`, texto branco bold exibindo `Xg`, visível apenas quando `grams > 0`
- [x] 3.6 Tornar o badge de quantidade tocável (`TouchableOpacity`) para chamar `onRemove(ingredient.id)`
- [x] 3.7 Atualizar `accessibilityLabel` para incluir quantidade (ex: "Chia, 60g no mix")

## 4. Tela do Simulador — Grade e interações

- [x] 4.1 Obter `screenWidth` com `useWindowDimensions` e calcular `cardWidth = (screenWidth - 32 * 2 - 8 * 2) / 3`
- [x] 4.2 Substituir `ScrollView` horizontal por `FlatList` com `numColumns={3}`, scroll vertical, `columnWrapperStyle` com `gap: 8`
- [x] 4.3 Conectar `onPress` do `IngredientCard` a `addGrams(ingredient, 30)` do store
- [x] 4.4 Conectar `onRemove` do `IngredientCard` a `removeIngredient(id)` do store
- [x] 4.5 Computar `fillStops` a partir de `mixItems`: para cada entry, `{ color: ingredient.color, weight: grams }`
- [x] 4.6 Atualizar `fillLevel`: usar `calculateNutritionFromMix(mixItems)` (adaptador local que escala por gramas/100) em vez de `calculateNutrition(selectedIngredients)`
- [x] 4.7 Atualizar subtitle: exibir total de gramas do mix (ex: "90g no mix") quando mix não estiver vazio
- [x] 4.8 Atualizar condição do botão "Gerar Minha Receita": habilitado quando `Object.keys(mixItems).length > 0`
- [x] 4.9 Atualizar lógica de nudges para usar `Object.values(mixItems).map(i => i.ingredient)` ao chamar `generateNudges`

## 5. Cálculo nutricional escalado por gramas

- [x] 5.1 Criar função adaptadora `calculateNutritionFromMix(mixItems: Record<string, { ingredient: Ingredient; grams: number }>)` no arquivo da tela ou em `nutrition-engine.ts` que escala cada nutriente por `grams / 100`
- [x] 5.2 Garantir que `MAX_CALORIES` continua sendo 600 e o fillLevel é calculado sobre as calorias escaladas

## 6. Testes

- [x] 6.1 Atualizar testes do `IngredientCard` para usar prop `grams` em vez de `selected`, e testar renderização do badge de quantidade
- [x] 6.2 Atualizar testes do store (`useSimulatorStore`) para cobrir `addGrams`, `removeIngredient` e `clearMix`
- [x] 6.3 Adicionar teste unitário para a função `computeGradientStops` (cenário: 1 ingrediente, 2 ingredientes, vazio)
