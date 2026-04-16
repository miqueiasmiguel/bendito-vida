## MODIFIED Requirements

### Requirement: Cartão de receita exibe o mix gerado
O cartão SHALL exibir: título "Mix [Objetivo] de [Nome]" (onde objetivo vem do `bioactive_profile` do quiz e nome do `useAuthStore`), lista de ingredientes com suas quantidades reais em gramas (obtidas de `MixItem.grams`), calorias reais por ingrediente calculadas como `round((ingredient.nutrition.calories * grams) / 100)`, resumo dos 4 indicadores nutricionais (calorias, fibras, proteínas, ômega-3), e badge "Contém ingredientes da biodiversidade paraibana" se houver ao menos 1 ingrediente paraibano no mix. O card SHALL usar bg white, radius 16, padding 16 e shadow (conforme design system). A prop `ingredients` do componente SHALL ser do tipo `MixItem[]` (importado de `useSimulatorStore`) em vez de `Ingredient[]`. O subtítulo da seção de ingredientes SHALL ser "Ingredientes" (sem "30g cada" hardcoded). Cada linha de ingrediente SHALL exibir as gramas reais do item (`{item.grams}g`) e as calorias reais (`round(kcal_por_100g * grams / 100) kcal`).

#### Scenario: Ingrediente adicionado uma vez (30g)
- **WHEN** o cartão é renderizado e um ingrediente tem `grams === 30`
- **THEN** a linha exibe "30g" e as calorias calculadas para 30g (ex: se 100g = 350kcal → exibe "105 kcal")

#### Scenario: Ingrediente adicionado duas vezes (60g)
- **WHEN** o cartão é renderizado e um ingrediente tem `grams === 60`
- **THEN** a linha exibe "60g" e as calorias calculadas para 60g (ex: se 100g = 350kcal → exibe "210 kcal")

#### Scenario: Mix com ingrediente paraibano
- **WHEN** o cartão é renderizado e o mix contém ao menos 1 ingrediente com `isParaibano: true`
- **THEN** o badge "Contém ingredientes da biodiversidade paraibana" é exibido com fundo `primary-100` e texto `primary-700`

#### Scenario: Mix sem ingrediente paraibano
- **WHEN** o mix não contém ingredientes paraibanos
- **THEN** o badge não é exibido

#### Scenario: Nome e objetivo no título
- **WHEN** o usuário tem nome e perfil bioativo configurados
- **THEN** o título exibe "Mix [Objetivo] de [Nome]"

#### Scenario: Usuário sem perfil de quiz
- **WHEN** o usuário não completou o quiz (sem `bioactive_profile`)
- **THEN** o título exibe "Meu Mix de [Nome]" como fallback
