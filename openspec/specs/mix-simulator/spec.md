### Requirement: Lista de ingredientes scrollável horizontalmente
A lista de ingredientes SHALL exibir todos os ingredientes de `src/data/ingredients.ts` como IngredientCards em uma **grade de 3 colunas** usando `FlatList` com `numColumns={3}`. A largura de cada card SHALL ser calculada dinamicamente como `(screenWidth - paddingHorizontal * 2 - columnGap * 2) / 3` via `useWindowDimensions`. A altura de cada card SHALL ser fixa em **100px** para garantir alinhamento uniforme entre linhas, independentemente do comprimento do nome do ingrediente. O nome do ingrediente SHALL ser limitado a `numberOfLines={2}` para evitar overflow. Cada card SHALL exibir: nome do ingrediente, círculo colorido (cor do ingrediente), calorias em kcal. Quando `isParaibano === true`, o card SHALL exibir um **selo circular** de 20×20px com fundo `primary-700` e ícone `Leaf` (Lucide, 10px, branco, strokeWidth 2), posicionado absolutamente no canto superior direito (`top: -6, right: -6`), com anel branco de 1.5px de borda. Quando o ingrediente tiver quantidade > 0 no mix, o card SHALL exibir um **badge de quantidade** no canto superior esquerdo (`top: -6, left: -6`) com fundo `accent-500`, texto branco bold mostrando "Xg" (ex: "30g", "90g"). O container do card SHALL ter `overflow: 'visible'` para permitir que selos e badges sobreponham a borda externa. **O card NÃO SHALL ter borda `primary-700` persistente nem fundo `primary[100]` quando o ingrediente tiver quantidade > 0 no mix** — o badge de quantidade é o único indicador visual persistente de presença no mix. O card SHALL executar uma animação de flash verde transitório ao ser pressionado (ver capability `ingredient-flash-animation`).

#### Scenario: Ingrediente não paraibano sem quantidade
- **WHEN** o ingrediente tem `isParaibano: false` e `grams === 0`
- **THEN** o card é exibido sem selo no canto direito e sem badge de quantidade no canto esquerdo

#### Scenario: Ingrediente paraibano sem quantidade
- **WHEN** o ingrediente tem `isParaibano: true` e `grams === 0`
- **THEN** o card exibe o selo verde com ícone de folha no canto superior direito; sem badge de quantidade

#### Scenario: Ingrediente com quantidade no mix
- **WHEN** o ingrediente tem `grams > 0` no mix
- **THEN** o card exibe badge laranja "Xg" no canto superior esquerdo e o selo paraibano (se aplicável) no canto superior direito; o fundo e a borda do card são idênticos ao estado sem quantidade (sem destaque verde persistente)

#### Scenario: Cards uniformes com nomes longos
- **WHEN** um ingrediente tem nome que requer 2 linhas
- **THEN** o card mantém a altura de 100px, o texto é truncado/quebrado em 2 linhas, e o card seguinte na grade alinha perfeitamente com os demais da mesma linha

#### Scenario: Grade de 3 colunas
- **WHEN** a tela do simulador é exibida
- **THEN** os cards de ingredientes são organizados em linhas de exatamente 3 colunas, com scroll vertical para ver todos os ingredientes

---

### Requirement: Interação de adição incremental de gramas
Cada toque num `IngredientCard` SHALL adicionar **30g** daquele ingrediente ao mix (em vez de toggle binário). Toques repetidos no mesmo card SHALL acumular 30g adicionais por toque. O toque no **badge de quantidade** (`accent-500`, canto superior esquerdo) SHALL remover completamente aquele ingrediente do mix (zerando sua quantidade). O store SHALL modelar o mix como `mixItems: Record<string, { ingredient: Ingredient; grams: number }>` com ações `addGrams(ingredient: Ingredient, amount: number)`, `removeIngredient(id: string)` e `resetMix()`. A ação `toggleIngredient` SHALL ser removida. O cálculo nutricional SHALL escalar os valores por `(grams / 100)` pois os dados de `ingredients.ts` são por 100g. A tela do simulador SHALL exibir um botão **"Limpar Mix"** (`variant="secondary"`) acima do botão primário, visível apenas quando `hasItems === true`; ao pressionar, chama `resetMix()` zerando todos os ingredientes do mix de uma só vez.

#### Scenario: Primeiro toque em ingrediente
- **WHEN** o usuário toca pela primeira vez num card de ingrediente que tem grams === 0
- **THEN** o ingrediente entra no mix com 30g; o card exibe um flash verde transitório de 300ms e badge "30g"

#### Scenario: Toque repetido no mesmo ingrediente
- **WHEN** o usuário toca novamente num card de ingrediente que já tem grams > 0
- **THEN** a quantidade aumenta em 30g; o badge atualiza para a nova quantidade (ex: "30g" → "60g" → "90g")

#### Scenario: Toque no badge de quantidade
- **WHEN** o usuário toca no badge de quantidade laranja no canto esquerdo do card
- **THEN** o ingrediente é removido do mix (grams → 0); card volta ao estado padrão sem badge

#### Scenario: Limpar Mix
- **WHEN** o mix tem ao menos 1 ingrediente e o usuário toca em "Limpar Mix"
- **THEN** todos os ingredientes são removidos do mix de uma só vez; o botão "Limpar Mix" desaparece

#### Scenario: Subtitle reflete total de gramas
- **WHEN** o mix contém ingredientes com quantidades
- **THEN** o subtítulo da tela exibe o total de gramas do mix (ex: "90g no mix") em vez de "X ingrediente(s) selecionado(s)"

#### Scenario: Botão "Gerar Minha Receita" habilitado com mix
- **WHEN** ao menos 1 ingrediente tem grams > 0
- **THEN** o botão "Gerar Minha Receita" está ativo; caso contrário, está desabilitado (opacity 0.5)

---

### Requirement: Jarro virtual representa os ingredientes adicionados
O jarro SVG SHALL renderizar um nível de preenchimento proporcional ao total calórico do mix em relação ao teto de 600 kcal (MAX_CALORIES), clampado entre 0 e 100%. A cor de preenchimento SHALL ser um **gradiente empilhado** composto pelas cores de todos os ingredientes do mix, cada um proporcional às suas gramas, conforme especificado em `mix-color-stack`. A animação de mudança de nível SHALL durar 300ms com easing ease-out via Reanimated 4 `useAnimatedProps`. O líquido animado SHALL ser recortado ao interior do jarro usando `<ClipPath>` do react-native-svg. A prop `fillColor: string` da interface `MixJarProps` SHALL ser substituída por `fillStops: Array<{ color: string; weight: number }>`.

#### Scenario: Jarro vazio no início
- **WHEN** o simulador é aberto sem ingredientes selecionados
- **THEN** o jarro aparece vazio (nível 0%) com gradiente neutro (`neutral-200`)

#### Scenario: Ingrediente adicionado
- **WHEN** o usuário toca em um IngredientCard (adicionando 30g)
- **THEN** o nível do jarro aumenta proporcionalmente ao valor calórico escalado pelas gramas, com animação suave de 300ms, e a cor do gradiente atualiza para incluir o novo ingrediente

#### Scenario: Jarro cheio (teto calórico atingido)
- **WHEN** o total de calorias ultrapassa 600 kcal
- **THEN** o jarro permanece visualmente cheio (100%) e um nudge de aviso é exibido

#### Scenario: Líquido clipado ao jarro
- **WHEN** o nível do jarro está entre 0% e 100%
- **THEN** o rect animado SHALL estar contido dentro da silhueta do jarro, garantido por `<ClipPath id="jarBodyClip">`

---

### Requirement: NudgeAlert — notificação toast descendente com política latest-wins
A `NudgeAlert` SHALL aparecer na **parte superior** da tela (posição `top: spacing.lg`), animando de cima para baixo (translateY de -60 → 0 na entrada, 0 → -60 na saída). O comportamento de fila é **latest-wins**: quando o usuário adiciona um ingrediente enquanto um nudge está visível, o toast atual é imediatamente substituído pelo nudge de maior prioridade do novo batch (`warning` > `suggestion` > `info`). Não há fila acumulada — apenas o nudge mais relevante do evento mais recente é exibido. O remount é forçado via `key={nudgeKey}` para garantir que a animação reinicie do topo.

#### Scenario: Nudge exibido ao adicionar ingrediente
- **WHEN** o usuário toca em um ingrediente e `generateNudges` retorna ao menos um nudge
- **THEN** o toast de maior prioridade desliza do topo para baixo em 300ms e permanece visível por ~3s antes de desaparecer para cima

#### Scenario: Seleção rápida substitui nudge anterior
- **WHEN** o usuário adiciona um segundo ingrediente enquanto o nudge anterior ainda está visível
- **THEN** o toast anterior é substituído imediatamente pelo novo nudge (latest-wins); nenhuma fila é formada

#### Scenario: Prioridade warning > suggestion > info
- **WHEN** um batch de nudges contém tipos diferentes (ex: `info` e `warning`)
- **THEN** apenas o nudge de tipo `warning` é exibido
