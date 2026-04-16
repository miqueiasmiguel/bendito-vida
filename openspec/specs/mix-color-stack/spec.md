## ADDED Requirements

### Requirement: Cor do jarro reflete todos os ingredientes proporcionalmente
O `MixJar` SHALL aceitar uma prop `fillStops: Array<{ color: string; weight: number }>` em vez de `fillColor: string`. O componente SHALL calcular os offsets do `LinearGradient` dinamicamente, com cada cor ocupando um segmento proporcional ao seu `weight` em relação à soma total dos weights. Quando `fillStops` estiver vazio ou o total for 0, o gradiente SHALL usar `colors.neutral[200]` como cor única. A interface `MixJarProps` SHALL ser atualizada para substituir `fillColor` por `fillStops`.

#### Scenario: Jarro com ingrediente único
- **WHEN** o mix contém apenas 1 ingrediente com qualquer quantidade
- **THEN** o gradiente do jarro exibe somente a cor desse ingrediente em toda a extensão (0% a 100%)

#### Scenario: Jarro com dois ingredientes
- **WHEN** o mix contém ingrediente A com 30g e ingrediente B com 60g
- **THEN** o gradiente exibe a cor de A nos primeiros ~33% da largura e a cor de B nos ~67% restantes

#### Scenario: Jarro com três ou mais ingredientes
- **WHEN** o mix contém N ingredientes com quantidades variadas
- **THEN** o gradiente exibe N segmentos de cor, cada um proporcional à quantidade em gramas de seu ingrediente em relação ao total de gramas do mix

#### Scenario: Jarro vazio
- **WHEN** nenhum ingrediente está no mix (totalGrams === 0)
- **THEN** o gradiente usa `colors.neutral[200]` como única cor (sem segmentos de ingredientes)
