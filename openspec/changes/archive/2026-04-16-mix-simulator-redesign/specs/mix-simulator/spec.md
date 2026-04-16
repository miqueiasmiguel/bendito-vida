## MODIFIED Requirements

### Requirement: Lista de ingredientes scrollável horizontalmente
A lista de ingredientes SHALL exibir todos os ingredientes de `src/data/ingredients.ts` como IngredientCards em uma **grade de 3 colunas** usando `FlatList` com `numColumns={3}`. A largura de cada card SHALL ser calculada dinamicamente como `(screenWidth - paddingHorizontal * 2 - columnGap * 2) / 3` via `useWindowDimensions`. A altura de cada card SHALL ser fixa em **120px** (aumentada de 100px) para acomodar informação de origem. O nome do ingrediente SHALL ser limitado a `numberOfLines={2}` para evitar overflow. Cada card SHALL exibir: ícone SVG ilustrativo do grão (via `GrainIcon`) sobre círculo colorido de 44×44px, nome do ingrediente em SemiBold, texto de origem abreviado em caption (`neutral-700`) — exibindo "Nativo da PB" para ingredientes com `isParaibano: true` e o campo `origin` abreviado para demais. Calorias em kcal no rodapé do card. O container do card SHALL ter borda de 1px `neutral-200`, borderRadius 16, shadow suave (offset(0,1) opacity 0.06 radius 6, elevation 1), e background branco. Quando `isParaibano === true`, o card SHALL exibir um **selo circular** de 20×20px com fundo `primary-700` e ícone `Leaf` (Lucide, 10px, branco, strokeWidth 2), posicionado absolutamente no canto superior direito (`top: -6, right: -6`), com anel branco de 1.5px de borda. Quando o ingrediente tiver quantidade > 0 no mix, o card SHALL exibir um **badge de quantidade** no canto superior esquerdo (`top: -6, left: -6`) com fundo `accent-500`, texto branco bold mostrando "Xg". O container do card SHALL ter `overflow: 'visible'` para permitir que selos e badges sobreponham a borda externa. **O card NÃO SHALL ter borda `primary-700` persistente nem fundo `primary[100]` quando o ingrediente tiver quantidade > 0 no mix** — o badge de quantidade é o único indicador visual persistente de presença no mix. O card SHALL executar uma animação de flash verde transitório ao ser pressionado (ver capability `ingredient-flash-animation`).

#### Scenario: Card exibe informação de origem
- **WHEN** um ingrediente com `isParaibano: true` é renderizado
- **THEN** o card exibe "Nativo da PB" em texto caption `neutral-700` abaixo do nome do ingrediente

#### Scenario: Card de ingrediente não paraibano com origem
- **WHEN** um ingrediente com `isParaibano: false` é renderizado
- **THEN** o card exibe o texto de `origin` abreviado em caption `neutral-700` abaixo do nome

#### Scenario: Ingrediente não paraibano sem quantidade
- **WHEN** o ingrediente tem `isParaibano: false` e `grams === 0`
- **THEN** o card é exibido sem selo no canto direito e sem badge de quantidade no canto esquerdo; o ícone SVG do grão é exibido sobre o círculo colorido de 44×44px

#### Scenario: Ingrediente paraibano sem quantidade
- **WHEN** o ingrediente tem `isParaibano: true` e `grams === 0`
- **THEN** o card exibe o ícone SVG do grão sobre o círculo colorido e o selo verde com ícone de folha no canto superior direito; sem badge de quantidade

#### Scenario: Ingrediente com quantidade no mix
- **WHEN** o ingrediente tem `grams > 0` no mix
- **THEN** o card exibe badge laranja "Xg" no canto superior esquerdo, o ícone SVG do grão sobre o círculo colorido, e o selo paraibano (se aplicável) no canto superior direito; o fundo e a borda do card são idênticos ao estado sem quantidade

#### Scenario: Cards uniformes com nomes longos
- **WHEN** um ingrediente tem nome que requer 2 linhas
- **THEN** o card mantém a altura de 120px, o texto é truncado/quebrado em 2 linhas, e o card seguinte na grade alinha perfeitamente com os demais da mesma linha

#### Scenario: Grade de 3 colunas
- **WHEN** a tela do simulador é exibida
- **THEN** os cards de ingredientes são organizados em linhas de exatamente 3 colunas, com scroll vertical para ver todos os ingredientes

---

### Requirement: Jarro virtual representa os ingredientes adicionados
O jarro SVG SHALL ser redesenhado como um mason-jar detalhado com dimensões aumentadas (largura 180px, altura 220px). A silhueta SHALL incluir: corpo arredondado com cantos suaves, pescoço mais estreito com linhas de rosca na tampa, e tampa com textura. O jarro SHALL exibir um label "Seu Mix Exclusivo" como texto SVG centralizado no corpo do jarro, com fonte Poppins SemiBold 10px, cor `neutral-700`, visível quando o nível de preenchimento está abaixo de 60%. O nível de preenchimento SHALL ser proporcional ao total calórico do mix em relação ao teto de 600 kcal (MAX_CALORIES), clampado entre 0 e 100%. O preenchimento SHALL usar camadas empilhadas (rects separados por ingrediente) conforme especificado em `mix-color-stack` modificado. A animação de mudança de nível SHALL ser sequenciada após a animação de partículas (delay de ~500ms) com duração de 300ms ease-out via Reanimated 4. O líquido animado SHALL ser recortado ao interior do jarro usando `<ClipPath>` do react-native-svg.

#### Scenario: Jarro vazio no início
- **WHEN** o simulador é aberto sem ingredientes selecionados
- **THEN** o jarro aparece vazio (nível 0%) com o label "Seu Mix Exclusivo" visível no centro do corpo

#### Scenario: Ingrediente adicionado
- **WHEN** o usuário toca em um IngredientCard (adicionando 30g)
- **THEN** partículas caem no jarro (ver `mix-jar-grain-animation`), seguido pelo nível subindo com animação suave de 300ms, e a camada do ingrediente aparece empilhada

#### Scenario: Label visibilidade com preenchimento
- **WHEN** o nível de preenchimento ultrapassa 60%
- **THEN** o label "Seu Mix Exclusivo" faz fade-out para não sobrepor o conteúdo visual das camadas

#### Scenario: Jarro cheio (teto calórico atingido)
- **WHEN** o total de calorias ultrapassa 600 kcal
- **THEN** o jarro permanece visualmente cheio (100%) e um nudge de aviso é exibido

#### Scenario: Líquido clipado ao jarro
- **WHEN** o nível do jarro está entre 0% e 100%
- **THEN** os rects animados de camadas SHALL estar contidos dentro da silhueta do jarro, garantido por `<ClipPath id="jarBodyClip">`

---

### Requirement: Header e botões da tela do simulador
A tela SHALL exibir título "Simulador Meu Mix" (H2 SemiBold, `neutral-900`) e subtítulo "Monte sua mistura funcional" (caption, `neutral-400`) quando o mix estiver vazio. Quando o mix tiver ingredientes, o subtítulo SHALL mudar para "{totalGrams}g no mix". O botão primário SHALL ter label "MISTURAR & GERAR RECEITA" (uppercase) com `variant="primary"` (accent-500). O botão secundário SHALL ter label "REINICIAR" (uppercase) com `variant="secondary"`, visível apenas quando `hasItems === true`. O título "Ingredientes" acima da grade de cards SHALL ser mantido.

#### Scenario: Tela vazia
- **WHEN** o simulador é aberto sem ingredientes
- **THEN** o título "Simulador Meu Mix" e subtítulo "Monte sua mistura funcional" são exibidos; botão "MISTURAR & GERAR RECEITA" está desabilitado; botão "REINICIAR" está oculto

#### Scenario: Tela com ingredientes
- **WHEN** o mix contém ingredientes
- **THEN** o subtítulo muda para "{totalGrams}g no mix"; ambos botões são visíveis e o primário está habilitado

#### Scenario: Botão REINICIAR
- **WHEN** o usuário toca em "REINICIAR"
- **THEN** todos os ingredientes são removidos do mix via `resetMix()`; o botão "REINICIAR" desaparece
