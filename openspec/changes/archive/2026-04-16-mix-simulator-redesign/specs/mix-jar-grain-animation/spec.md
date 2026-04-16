## ADDED Requirements

### Requirement: Animação de partículas de grãos caindo no jarro
Ao adicionar um ingrediente ao mix, o sistema SHALL spawnar 5-8 partículas circulares (diâmetro 4-8px, variável aleatório) na cor do ingrediente (`ingredient.color`) acima da abertura do jarro. As partículas SHALL animar queda vertical (translateY de -30px acima do jarro até a posição do nível atual do líquido) com duração de 400ms, usando `withDelay` escalonado (0-200ms entre partículas) para efeito cascata. Cada partícula SHALL ter leve variação horizontal (translateX ±15px do centro) para aparência orgânica. As partículas SHALL fazer fade-out (opacity 1→0) nos últimos 100ms da queda. Toda a animação SHALL rodar na UI thread via `useAnimatedStyle` worklets do Reanimated 4. Após as partículas completarem (~500ms total), a animação de subida do nível do jarro SHALL iniciar (sequenciamento via `withDelay`). O componente de partículas SHALL ser renderizado como overlay absoluto sobre o `MixJar`, dentro do mesmo container. O sistema SHALL usar `expo-haptics` com feedback `ImpactFeedbackStyle.Light` sincronizado com o início da animação de queda.

#### Scenario: Primeiro ingrediente adicionado
- **WHEN** o usuário toca em um IngredientCard pela primeira vez (grams 0→30)
- **THEN** 5-8 partículas na cor do ingrediente caem de cima do jarro até o fundo (nível 0%), com escalonamento de 0-200ms entre partículas, seguido pela subida animada do nível do jarro

#### Scenario: Ingrediente adicionado com jarro parcialmente cheio
- **WHEN** o usuário toca em um ingrediente e o jarro já tem nível > 0%
- **THEN** as partículas caem até o nível atual do líquido (não até o fundo), e o nível sobe a partir do ponto atual

#### Scenario: Adição rápida de múltiplos ingredientes
- **WHEN** o usuário toca em 2 ingredientes em sequência rápida (< 500ms entre toques)
- **THEN** a segunda animação de partículas inicia imediatamente com a cor do segundo ingrediente, sem esperar a primeira completar; o nível do jarro acumula ambos incrementos

#### Scenario: Haptic feedback sincronizado
- **WHEN** a animação de partículas inicia
- **THEN** um feedback tátil `ImpactFeedbackStyle.Light` é disparado no início da queda

#### Scenario: Performance em UI thread
- **WHEN** a animação de partículas está rodando
- **THEN** não há re-renders React (animação roda inteiramente via worklets Reanimated), e o JS thread permanece livre para cálculo nutricional
