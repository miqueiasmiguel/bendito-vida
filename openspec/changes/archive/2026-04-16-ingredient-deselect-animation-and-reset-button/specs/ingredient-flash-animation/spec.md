## ADDED Requirements

### Requirement: Flash verde transitório ao tocar em IngredientCard
O `IngredientCard` SHALL exibir uma animação de flash de cor ao ser pressionado: o fundo do card anima de transparente para `primary[100]` em 150ms e retorna a transparente em mais 150ms, totalizando 300ms. A animação SHALL ser executada no UI thread via Reanimated 4 (`useSharedValue` + `withSequence` + `withTiming`). O card SHALL usar `Animated.View` (importado de `react-native-reanimated`) como container principal. A animação de flash SHALL disparar sempre que `onPress` for chamado, independentemente do estado atual de `grams`.

#### Scenario: Primeiro toque — card sem grams
- **WHEN** o usuário toca num card com `grams === 0`
- **THEN** o fundo do card anima de transparente → `primary[100]` → transparente em 300ms total e o ingrediente é adicionado com 30g

#### Scenario: Toque repetido — card com grams
- **WHEN** o usuário toca num card com `grams > 0`
- **THEN** o mesmo flash verde ocorre (300ms) e a quantidade aumenta em 30g

#### Scenario: Animação no UI thread
- **WHEN** o flash é disparado
- **THEN** a animação não bloqueia o JS thread; o `withSequence`/`withTiming` roda no UI thread via Reanimated 4

#### Scenario: Sem estado de fundo persistente
- **WHEN** a animação de flash conclui (300ms após o toque)
- **THEN** o fundo do card retorna a transparente (branco do card base), sem diferença visual entre um card com `grams > 0` e um com `grams === 0` (exceto pelo badge de quantidade)
