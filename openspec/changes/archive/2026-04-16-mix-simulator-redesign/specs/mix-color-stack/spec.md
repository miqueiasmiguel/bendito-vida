## MODIFIED Requirements

### Requirement: Cor do jarro reflete todos os ingredientes proporcionalmente
O `MixJar` SHALL aceitar uma prop `fillStops: Array<{ color: string; weight: number }>`. O componente SHALL renderizar camadas empilhadas como `<Rect>` SVG separados (um por ingrediente) dentro do `<ClipPath>` do jarro, em vez de usar `LinearGradient` contínuo. Cada Rect SHALL ter:
- Cor sólida do ingrediente (`stopColor`)
- Altura proporcional ao `weight` relativo (weight / totalWeight * fillHeight)
- Empilhamento vertical de baixo para cima (primeiro ingrediente adicionado fica na base)
- Linha separadora sutil entre camadas: Rect de 1px com cor branca e 20% opacity
- Variação de opacidade entre 0.85 e 1.0 para dar textura visual às camadas

A função `computeGradientStops` SHALL ser substituída por `computeLayerRects` que retorna array de `{ y: number; height: number; color: string; opacity: number }`. Quando `fillStops` estiver vazio ou o total for 0, nenhuma camada SHALL ser renderizada (jarro vazio). Cada Rect de camada SHALL ser animado com Reanimated 4 via `useAnimatedProps` para transição suave quando novas camadas são adicionadas.

#### Scenario: Jarro com ingrediente único
- **WHEN** o mix contém apenas 1 ingrediente com qualquer quantidade
- **THEN** uma única camada Rect com a cor sólida do ingrediente preenche toda a área de líquido

#### Scenario: Jarro com dois ingredientes
- **WHEN** o mix contém ingrediente A com 30g e ingrediente B com 60g
- **THEN** duas camadas Rect são renderizadas: A na base com ~33% da altura, B acima com ~67%; uma linha branca sutil separa as camadas

#### Scenario: Jarro com três ou mais ingredientes
- **WHEN** o mix contém N ingredientes com quantidades variadas
- **THEN** N camadas Rect empilhadas de baixo para cima, cada uma proporcional à quantidade em gramas, com linhas separadoras entre elas

#### Scenario: Jarro vazio
- **WHEN** nenhum ingrediente está no mix (totalGrams === 0)
- **THEN** nenhuma camada é renderizada; o interior do jarro está vazio (background branco visível)

#### Scenario: Nova camada adicionada com animação
- **WHEN** um novo ingrediente é adicionado ao mix
- **THEN** a nova camada Rect aparece no topo da pilha com animação de crescimento (height 0→proporcional) em 300ms, e as camadas existentes reajustam suas alturas proporcionalmente com animação simultânea
