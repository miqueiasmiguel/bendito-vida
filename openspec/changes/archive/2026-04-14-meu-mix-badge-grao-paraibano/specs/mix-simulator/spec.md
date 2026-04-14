## MODIFIED Requirements

### Requirement: Lista de ingredientes scrollável horizontalmente
A lista de ingredientes SHALL exibir todos os ingredientes de `src/data/ingredients.ts` como IngredientCards em um `ScrollView` horizontal. Cada card SHALL exibir: nome do ingrediente, círculo colorido (cor do ingrediente), e caloria em kcal. Quando `isParaibano === true`, o card SHALL exibir um **selo circular** de 20×20px com fundo `primary-700` e ícone `Leaf` (Lucide, 10px, branco, strokeWidth 2), posicionado absolutamente no canto superior esquerdo do card (`top: -6, left: -6`), com um anel branco de 1.5px de borda para contraste. O card SHALL ter borda `primary-700` quando o ingrediente estiver selecionado no mix. Os cards SHALL ter altura fixa — garantido por `alignSelf: 'flex-start'` no estilo do card. O container do card SHALL ter `overflow: 'visible'` para permitir que o selo sobreponha a borda externa.

#### Scenario: Ingrediente não paraibano
- **WHEN** o ingrediente tem `isParaibano: false`
- **THEN** o card é exibido sem nenhum selo no canto superior esquerdo

#### Scenario: Ingrediente paraibano
- **WHEN** o ingrediente tem `isParaibano: true`
- **THEN** o card exibe um selo circular verde (`primary-700`) com ícone de folha branco no canto superior esquerdo, sobrepondo levemente a borda do card como um indicador de notificação

#### Scenario: Ingrediente selecionado
- **WHEN** o ingrediente está na lista `selectedIngredients` do store
- **THEN** o card exibe borda `primary-700` e o selo paraibano (se aplicável) permanece visível com anel branco de contraste
