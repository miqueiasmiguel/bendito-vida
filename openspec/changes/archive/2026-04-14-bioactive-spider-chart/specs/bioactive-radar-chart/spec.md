## ADDED Requirements

### Requirement: Renderizar radar chart com eixos de nutrientes
O componente `BioactiveRadarChart` SHALL renderizar um gráfico radar SVG com entre 3 e 6 eixos, um por nutriente recebido via prop `data`. Cada eixo SHALL ser distribuído uniformemente em 360°. A área preenchida SHALL usar a cor `primary-500` com 30% de opacidade e a borda da área SHALL usar `primary-700` com espessura 2px.

#### Scenario: Renderização com 6 nutrientes
- **WHEN** `data` contém 6 itens com valores normalizados entre 0 e 1
- **THEN** o SVG exibe 6 eixos radiais, um polígono preenchido conectando os 6 pontos de valor, e labels com o nome curto de cada nutriente nas extremidades dos eixos

#### Scenario: Renderização com 3 nutrientes
- **WHEN** `data` contém 3 itens
- **THEN** o SVG exibe 3 eixos radiais formando um triângulo e o polígono preenchido com os pontos correspondentes

---

### Requirement: Animação de entrada do polígono
O componente SHALL animar o polígono de valor do tamanho 0 ao tamanho real com `withTiming` de 600ms e easing `Easing.out(Easing.cubic)` usando Reanimated 4, executando no UI thread.

#### Scenario: Mount do componente
- **WHEN** o componente é montado pela primeira vez
- **THEN** o polígono de dados cresce de scale 0 a scale 1 em 600ms com easing cúbico de saída

---

### Requirement: Labels dos eixos com fonte mínima
O componente SHALL exibir o `label` de cada eixo na extremidade do eixo com fonte Poppins tamanho 11px (mínimo do design system), truncado em 8 caracteres se necessário, na cor `neutral-700`.

#### Scenario: Label longo
- **WHEN** um nutriente tem label com mais de 8 caracteres
- **THEN** o label é truncado e exibido com "…" no final

#### Scenario: Label curto
- **WHEN** um nutriente tem label com 8 caracteres ou menos
- **THEN** o label é exibido completo

---

### Requirement: Acessibilidade do radar chart
O componente SHALL expor `accessibilityLabel` descrevendo o gráfico como "Gráfico radar dos seus nutrientes prioritários" e `accessibilityRole="image"` no elemento raiz.

#### Scenario: Leitura por screen reader
- **WHEN** um screen reader foca no componente `BioactiveRadarChart`
- **THEN** anuncia "Gráfico radar dos seus nutrientes prioritários"
