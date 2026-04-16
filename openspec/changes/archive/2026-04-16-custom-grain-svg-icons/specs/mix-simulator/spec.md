## MODIFIED Requirements

### Requirement: Lista de ingredientes scrollável horizontalmente
A lista de ingredientes SHALL exibir todos os ingredientes de `src/data/ingredients.ts` como IngredientCards em uma **grade de 3 colunas** usando `FlatList` com `numColumns={3}`. A largura de cada card SHALL ser calculada dinamicamente como `(screenWidth - paddingHorizontal * 2 - columnGap * 2) / 3` via `useWindowDimensions`. A altura de cada card SHALL ser fixa em **100px** para garantir alinhamento uniforme entre linhas, independentemente do comprimento do nome do ingrediente. O nome do ingrediente SHALL ser limitado a `numberOfLines={2}` para evitar overflow. Cada card SHALL exibir: nome do ingrediente, ícone SVG ilustrativo do grão (via `GrainIcon`), calorias em kcal. O ícone SHALL ser renderizado sobre um círculo com `backgroundColor: ingredient.color` de 40×40px — substituindo o `colorDot` de 28×28px anterior. Quando `isParaibano === true`, o card SHALL exibir um **selo circular** de 20×20px com fundo `primary-700` e ícone `Leaf` (Lucide, 10px, branco, strokeWidth 2), posicionado absolutamente no canto superior direito (`top: -6, right: -6`), com anel branco de 1.5px de borda. Quando o ingrediente tiver quantidade > 0 no mix, o card SHALL exibir um **badge de quantidade** no canto superior esquerdo (`top: -6, left: -6`) com fundo `accent-500`, texto branco bold mostrando "Xg" (ex: "30g", "90g"). O container do card SHALL ter `overflow: 'visible'` para permitir que selos e badges sobreponham a borda externa. **O card NÃO SHALL ter borda `primary-700` persistente nem fundo `primary[100]` quando o ingrediente tiver quantidade > 0 no mix** — o badge de quantidade é o único indicador visual persistente de presença no mix. O card SHALL executar uma animação de flash verde transitório ao ser pressionado (ver capability `ingredient-flash-animation`).

#### Scenario: Ingrediente não paraibano sem quantidade
- **WHEN** o ingrediente tem `isParaibano: false` e `grams === 0`
- **THEN** o card é exibido sem selo no canto direito e sem badge de quantidade no canto esquerdo; o ícone SVG do grão é exibido sobre o círculo colorido

#### Scenario: Ingrediente paraibano sem quantidade
- **WHEN** o ingrediente tem `isParaibano: true` e `grams === 0`
- **THEN** o card exibe o ícone SVG do grão sobre o círculo colorido e o selo verde com ícone de folha no canto superior direito; sem badge de quantidade

#### Scenario: Ingrediente com quantidade no mix
- **WHEN** o ingrediente tem `grams > 0` no mix
- **THEN** o card exibe badge laranja "Xg" no canto superior esquerdo, o ícone SVG do grão sobre o círculo colorido, e o selo paraibano (se aplicável) no canto superior direito; o fundo e a borda do card são idênticos ao estado sem quantidade

#### Scenario: Cards uniformes com nomes longos
- **WHEN** um ingrediente tem nome que requer 2 linhas
- **THEN** o card mantém a altura de 100px, o texto é truncado/quebrado em 2 linhas, e o card seguinte na grade alinha perfeitamente com os demais da mesma linha

#### Scenario: Grade de 3 colunas
- **WHEN** a tela do simulador é exibida
- **THEN** os cards de ingredientes são organizados em linhas de exatamente 3 colunas, com scroll vertical para ver todos os ingredientes
