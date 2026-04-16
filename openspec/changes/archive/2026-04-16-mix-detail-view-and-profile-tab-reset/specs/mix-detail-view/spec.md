## ADDED Requirements

### Requirement: Exibir detalhes de um mix salvo
A rota `/(tabs)/profile/mix-detail` SHALL receber o parâmetro de query `mixId` (string), localizar o mix correspondente em `useProfileStore.mixes` e renderizar o perfil nutricional (NutrientBar) e o cartão compartilhável (RecipeCard) idênticos à tela `result.tsx`. O store SHALL ser hidratado via `fetchProfile` se `mixes` estiver vazio e `user.id` disponível.

#### Scenario: Mix encontrado no store
- **WHEN** o usuário navega para `mix-detail?mixId=<id>` e o mix existe em `useProfileStore.mixes`
- **THEN** a tela exibe o perfil nutricional com barras de Fibras, Proteínas, Ômega-3 e Calorias, seguido do `RecipeCard` com o nome e ingredientes do mix

#### Scenario: Store ainda carregando
- **WHEN** `useProfileStore.isLoading === true` ao montar a tela
- **THEN** a tela exibe um `ActivityIndicator` centralizado até o fetch concluir

#### Scenario: Mix não encontrado
- **WHEN** `isLoading === false` e `mixes.find(m => m.id === mixId)` retorna `undefined`
- **THEN** a tela exibe a mensagem "Mix não encontrado." e um botão "Voltar" que executa `router.back()`

### Requirement: Header da tela de detalhe do mix
A tela SHALL exibir um header com botão de voltar (`← Voltar`) alinhado à esquerda que executa `router.back()`, título "Detalhe do Mix" centralizado e um espaçador invisível à direita para equilíbrio visual.

#### Scenario: Botão de voltar acionado
- **WHEN** o usuário toca em "← Voltar"
- **THEN** o sistema retorna para `/(tabs)/profile/my-mixes`

### Requirement: Ação de compartilhar na tela de detalhe do mix
A tela SHALL exibir apenas um botão "Compartilhar" na área de ações inferior (sem "Salvar no perfil", pois o mix já está salvo). O botão SHALL usar `expo-sharing` para compartilhar a captura do `ViewShot` do `RecipeCard`, idêntico ao comportamento de `result.tsx`.

#### Scenario: Compartilhamento bem-sucedido
- **WHEN** o usuário toca em "Compartilhar" e `expo-sharing` está disponível
- **THEN** o sistema captura o `RecipeCard` e abre o diálogo nativo de compartilhamento com a imagem PNG

#### Scenario: Compartilhamento indisponível
- **WHEN** `Sharing.isAvailableAsync()` retorna `false`
- **THEN** o sistema exibe um `Alert` com a mensagem "Este dispositivo não suporta compartilhamento."

### Requirement: Cálculo nutricional a partir dos dados do mix salvo
A tela SHALL calcular o perfil nutricional usando `calculateNutritionFromMix` a partir dos dados do mix salvo. O tipo `Mix.nutrition` (com `calories`, `fiber`, `protein`, `omega3`) SHALL ser usado diretamente, sem recalcular via ingredientes.

#### Scenario: Nutrição exibida corretamente
- **WHEN** o mix tem `nutrition: { calories: 350, fiber: 8, protein: 12, omega3: 2 }`
- **THEN** cada `NutrientBar` exibe o valor correspondente com a unidade correta (g ou kcal)
