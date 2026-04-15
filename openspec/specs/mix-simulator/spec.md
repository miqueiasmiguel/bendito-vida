## ADDED Requirements

### Requirement: Jarro virtual representa os ingredientes adicionados
O jarro SVG SHALL renderizar um nível de preenchimento proporcional ao total calórico do mix em relação ao teto de 600 kcal (MAX_CALORIES), clampado entre 0 e 100%. A cor de preenchimento SHALL ser a cor (`color`) do último ingrediente adicionado. A animação de mudança de nível SHALL durar 300ms com easing ease-out via Reanimated 4 `useAnimatedProps`. O líquido animado SHALL ser recortado ao interior do jarro usando `<ClipPath>` do react-native-svg — nunca vazar para fora da silhueta do jarro.

#### Scenario: Jarro vazio no início
- **WHEN** o simulador é aberto sem ingredientes selecionados
- **THEN** o jarro aparece vazio (nível 0%) com fundo branco/transparente

#### Scenario: Ingrediente adicionado
- **WHEN** o usuário toca em um IngredientCard na lista
- **THEN** o nível do jarro aumenta proporcionalmente ao valor calórico do ingrediente com animação suave de 300ms

#### Scenario: Ingrediente removido
- **WHEN** o usuário toca novamente no mesmo ingrediente (que já está no mix)
- **THEN** o nível do jarro diminui proporcionalmente e o ingrediente é removido do mix

#### Scenario: Jarro cheio (teto calórico atingido)
- **WHEN** o total de calorias ultrapassa 600 kcal
- **THEN** o jarro permanece visualmente cheio (100%) e um nudge de aviso é exibido

#### Scenario: Líquido clipado ao jarro
- **WHEN** o nível do jarro está entre 0% e 100%
- **THEN** o rect animado SHALL estar contido dentro da silhueta do jarro sem vazar para fora, garantido por `<ClipPath id="jarBodyClip">` envolvendo o path interior do jarro

---

### Requirement: Lista de ingredientes scrollável horizontalmente
A lista de ingredientes SHALL exibir todos os ingredientes de `src/data/ingredients.ts` como IngredientCards em um `ScrollView` horizontal. Cada card SHALL exibir: nome do ingrediente, círculo colorido (cor do ingrediente), e caloria em kcal. Quando `isParaibano === true`, o card SHALL exibir um **selo circular** de 20×20px com fundo `primary-700` e ícone `Leaf` (Lucide, 10px, branco, strokeWidth 2), posicionado absolutamente no canto superior direito do card (`top: -6, right: -6`), com um anel branco de 1.5px de borda para contraste. O card SHALL ter borda `primary-700` quando o ingrediente estiver selecionado no mix. Os cards SHALL ter altura fixa — garantido por `alignSelf: 'flex-start'` no estilo do card. O container do card SHALL ter `overflow: 'visible'` para permitir que o selo sobreponha a borda externa.

#### Scenario: Ingrediente não paraibano
- **WHEN** o ingrediente tem `isParaibano: false`
- **THEN** o card é exibido sem nenhum selo no canto superior direito

#### Scenario: Ingrediente paraibano
- **WHEN** o ingrediente tem `isParaibano: true`
- **THEN** o card exibe um selo circular verde (`primary-700`) com ícone de folha branco no canto superior direito, sobrepondo levemente a borda do card como um indicador de notificação

#### Scenario: Ingrediente selecionado
- **WHEN** o ingrediente está na lista `selectedIngredients` do store
- **THEN** o card exibe borda `primary-700` e o selo paraibano (se aplicável) permanece visível com anel branco de contraste

---

### Requirement: Tela do simulador foca exclusivamente na seleção
A tela do simulador SHALL exibir apenas: título, subtítulo, jarro SVG e lista de ingredientes. As barras nutricionais (Fibras, Proteínas, Ômega-3, Calorias) NÃO devem aparecer no simulador — elas são reveladas na tela de resultado após "Gerar Minha Receita". Essa separação cria um momento de descoberta nutricional impactante para a demo.

#### Scenario: Tela de seleção limpa
- **WHEN** o usuário está no simulador selecionando ingredientes
- **THEN** apenas o jarro e a lista de ingredientes são visíveis (sem barras nutricionais)

#### Scenario: Revelação nutricional
- **WHEN** o usuário toca "Gerar Minha Receita" e navega para /result
- **THEN** os valores nutricionais (Fibras, Proteínas, Ômega-3, Calorias) são exibidos pela primeira vez como barras na tela de resultado

---

### Requirement: Nudges contextuais informam o usuário
Nudges SHALL ser exibidos como toasts slide-up (animação 300ms, Reanimated 4) com auto-dismiss em 3 segundos. Apenas 1 nudge é exibido por vez (fila FIFO). Os nudges SHALL ser gerados via `generateNudges` de `src/data/nutrition-engine.ts` ao mudar o mix.

#### Scenario: Mix calórico
- **WHEN** o total de calorias ultrapassa 500 kcal
- **THEN** um nudge do tipo `warning` é exibido com cor laranja (`accent-500`)

#### Scenario: Ingrediente paraibano adicionado
- **WHEN** o último ingrediente adicionado tem `isParaibano: true`
- **THEN** um nudge do tipo `info` é exibido com cor `primary-700`

#### Scenario: Fibras baixas
- **WHEN** 2 ou mais ingredientes estão selecionados e fibras totais < 5g
- **THEN** um nudge do tipo `suggestion` é exibido sugerindo adicionar chia ou linhaça

---

### Requirement: Botão "Gerar Minha Receita" navega para o resultado
Um botão primário (accent-500) SHALL ser fixado no bottom da tela com o texto "Gerar Minha Receita". Ele SHALL estar ativo apenas se ao menos 1 ingrediente estiver selecionado. Ao tocar, navega para `/result`.

#### Scenario: Sem ingredientes
- **WHEN** nenhum ingrediente está selecionado
- **THEN** o botão está desabilitado (opacity 0.5, não responsivo ao toque)

#### Scenario: Com ingredientes
- **WHEN** ao menos 1 ingrediente está selecionado
- **THEN** o botão está ativo e ao toque navega para `/result`
