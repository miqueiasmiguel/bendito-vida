## MODIFIED Requirements

### Requirement: Ingredientes recomendados no Mapa Bioativo
O Mapa Bioativo SHALL exibir 3 a 5 ingredientes recomendados derivados das tags do `nutritionProfile`, ordenados por número de tags em comum. Ingredientes com `isParaibano: true` SHALL exibir um selo circular verde com ícone de folha (`<Leaf />` Lucide, size=10, strokeWidth=2, cor `neutral-50`) posicionado no canto superior direito do chip, idêntico ao padrão do `IngredientCard` no Meu Mix.

#### Scenario: Ingredientes com match de tags
- **WHEN** o perfil possui tags que coincidem com ingredientes do catálogo
- **THEN** são exibidos até 5 ingredientes com nome e selo condicional

#### Scenario: Ingrediente paraibano na lista
- **WHEN** um ingrediente recomendado tem `isParaibano: true`
- **THEN** um selo circular verde com ícone `<Leaf />` é exibido no canto superior direito do chip (sem texto "Paraibano", consistente com o padrão do Meu Mix)
