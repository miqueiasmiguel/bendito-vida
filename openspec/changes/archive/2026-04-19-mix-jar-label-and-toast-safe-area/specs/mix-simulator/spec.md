## MODIFIED Requirements

### Requirement: Jarro virtual representa os ingredientes adicionados
O jarro SVG SHALL ser renderizado como um mason-jar detalhado com dimensões aumentadas (largura 180px, altura 220px). A silhueta SHALL incluir: corpo arredondado com cantos suaves, pescoço mais estreito com linhas de rosca na tampa, e tampa com textura. **O jarro NÃO SHALL exibir nenhum rótulo ou texto SVG no interior do corpo do jarro.** O nível de preenchimento SHALL ser proporcional ao total calórico do mix em relação ao teto de 600 kcal (MAX_CALORIES), clampado entre 0 e 100%. O preenchimento SHALL usar camadas empilhadas (rects separados por ingrediente) conforme especificado em `mix-color-stack` modificado. A animação de mudança de nível SHALL ser sequenciada após a animação de partículas (delay de ~500ms) com duração de 300ms ease-out via Reanimated 4. O líquido animado SHALL ser recortado ao interior do jarro usando `<ClipPath>` do react-native-svg.

#### Scenario: Jarro vazio no início
- **WHEN** o simulador é aberto sem ingredientes selecionados
- **THEN** o jarro aparece vazio (nível 0%) sem nenhum texto no interior

#### Scenario: Ingrediente adicionado
- **WHEN** o usuário toca em um IngredientCard (adicionando 30g)
- **THEN** partículas caem no jarro (ver `mix-jar-grain-animation`), seguido pelo nível subindo com animação suave de 300ms, e a camada do ingrediente aparece empilhada

#### Scenario: Jarro cheio (teto calórico atingido)
- **WHEN** o total de calorias ultrapassa 600 kcal
- **THEN** o jarro permanece visualmente cheio (100%) e um nudge de aviso é exibido

#### Scenario: Líquido clipado ao jarro
- **WHEN** o nível do jarro está entre 0% e 100%
- **THEN** os rects animados de camadas SHALL estar contidos dentro da silhueta do jarro, garantido por `<ClipPath id="jarBodyClip">`

---

## MODIFIED Requirements

### Requirement: Toast de nudge respeita a safe area
O componente `NudgeAlert` SHALL posicionar o toast usando o inset superior real do dispositivo obtido via `useSafeAreaInsets` do `react-native-safe-area-context`. O offset superior SHALL ser calculado como `insets.top + spacing.sm` (inset real + 8px de padding visual). O toast SHALL permanecer completamente visível acima do conteúdo da tela em dispositivos com notch, Dynamic Island ou status bar de altura variável.

#### Scenario: Toast em dispositivo com notch
- **WHEN** um nudge é gerado em dispositivo com `insets.top > 24`
- **THEN** o toast aparece abaixo da status bar/notch, sem sobreposição, com `spacing.sm` de folga visual

#### Scenario: Toast em dispositivo sem notch
- **WHEN** um nudge é gerado em dispositivo com `insets.top === 0` ou baixo
- **THEN** o toast aparece com `spacing.sm` a partir do topo da área de conteúdo, comportamento idêntico ao atual

#### Scenario: Toast não bloqueia interação
- **WHEN** o toast está visível
- **THEN** o `pointerEvents="none"` SHALL garantir que toque passa para os elementos abaixo
