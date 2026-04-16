## ADDED Requirements

### Requirement: Tela de resultado revela o perfil nutricional do mix
A tela `/result` SHALL exibir uma seção "Perfil Nutricional" com 4 NutrientBars (Fibras, Proteínas, Ômega-3, Calorias) calculadas do mix via `calculateNutrition`, ANTES do cartão de receita. Esta é a primeira vez que o usuário vê os valores nutricionais — momento de revelação após montar o mix no simulador. As barras SHALL aparecer fora do ViewShot (não incluídas na imagem compartilhada).

#### Scenario: Revelação nutricional ao chegar no resultado
- **WHEN** o usuário navega para /result após montar o mix
- **THEN** 4 NutrientBars são exibidas com os valores calculados do mix selecionado

#### Scenario: Cores das barras
- **WHEN** as barras são renderizadas
- **THEN** Fibras=verde (`success`), Proteínas=azul (`info`), Ômega-3=dourado (`#B8860B`), Calorias=vermelho (`error`) se > 500kcal senão `neutral-400`

---

### Requirement: Cartão de receita exibe o mix gerado
O cartão SHALL exibir: título "Mix [Objetivo] de [Nome]" (onde objetivo vem do `bioactive_profile` do quiz e nome do `useAuthStore`), lista de ingredientes com suas quantidades reais em gramas (obtidas de `MixItem.grams`), calorias reais por ingrediente calculadas como `round((ingredient.nutrition.calories * grams) / 100)`, resumo dos 4 indicadores nutricionais (calorias, fibras, proteínas, ômega-3), e badge "Contém ingredientes da biodiversidade paraibana" se houver ao menos 1 ingrediente paraibano no mix. O card SHALL usar bg white, radius 16, padding 16 e shadow (conforme design system). A prop `ingredients` do componente SHALL ser do tipo `MixItem[]` (importado de `useSimulatorStore`) em vez de `Ingredient[]`. O subtítulo da seção de ingredientes SHALL ser "Ingredientes" (sem "30g cada" hardcoded). Cada linha de ingrediente SHALL exibir as gramas reais do item (`{item.grams}g`) e as calorias reais (`round(kcal_por_100g * grams / 100) kcal`).

#### Scenario: Ingrediente adicionado uma vez (30g)
- **WHEN** o cartão é renderizado e um ingrediente tem `grams === 30`
- **THEN** a linha exibe "30g" e as calorias calculadas para 30g (ex: se 100g = 350kcal → exibe "105 kcal")

#### Scenario: Ingrediente adicionado duas vezes (60g)
- **WHEN** o cartão é renderizado e um ingrediente tem `grams === 60`
- **THEN** a linha exibe "60g" e as calorias calculadas para 60g (ex: se 100g = 350kcal → exibe "210 kcal")

#### Scenario: Mix com ingrediente paraibano
- **WHEN** o cartão é renderizado e o mix contém ao menos 1 ingrediente com `isParaibano: true`
- **THEN** o badge "Contém ingredientes da biodiversidade paraibana" é exibido com fundo `primary-100` e texto `primary-700`

#### Scenario: Mix sem ingrediente paraibano
- **WHEN** o mix não contém ingredientes paraibanos
- **THEN** o badge não é exibido

#### Scenario: Nome e objetivo no título
- **WHEN** o usuário tem nome e perfil bioativo configurados
- **THEN** o título exibe "Mix [Objetivo] de [Nome]"

#### Scenario: Usuário sem perfil de quiz
- **WHEN** o usuário não completou o quiz (sem `bioactive_profile`)
- **THEN** o título exibe "Meu Mix de [Nome]" como fallback

---

### Requirement: Botão "Compartilhar" exporta o cartão como imagem
O botão "Compartilhar" SHALL capturar o cartão de receita como imagem via `react-native-view-shot` e compartilhá-la via `expo-sharing`. Durante a captura, o botão SHALL exibir um indicador de loading. Se `expo-sharing` não estiver disponível no dispositivo, o botão SHALL ser desabilitado.

#### Scenario: Compartilhamento bem-sucedido
- **WHEN** o usuário toca "Compartilhar" e confirma o app de destino
- **THEN** a imagem do cartão é compartilhada via sheet nativa do OS

#### Scenario: Compartilhamento durante captura
- **WHEN** o usuário toca "Compartilhar"
- **THEN** o botão mostra loading até a captura completar (máx ~2s)

#### Scenario: Sharing não disponível
- **WHEN** `Sharing.isAvailableAsync()` retorna `false`
- **THEN** o botão "Compartilhar" fica desabilitado com opacity 0.5

---

### Requirement: Botão "Salvar no perfil" persiste o mix no Supabase
O botão "Salvar no perfil" SHALL fazer INSERT na tabela `mixes` com `user_id`, `name`, `ingredients` (array de IDs), `nutrition` (objeto NutritionSummary). Se o usuário não estiver autenticado, SHALL redirecionar para `/(auth)/login`. Após salvar com sucesso, exibe feedback ("Mix salvo!") e o botão muda para estado "Salvo" (desabilitado) para evitar duplicatas.

#### Scenario: Usuário autenticado salva mix
- **WHEN** o usuário autenticado toca "Salvar no perfil"
- **THEN** o mix é inserido na tabela `mixes` e o botão muda para estado "Salvo"

#### Scenario: Usuário não autenticado toca salvar
- **WHEN** o usuário não está logado e toca "Salvar no perfil"
- **THEN** é redirecionado para `/(auth)/login`

#### Scenario: Erro no salvamento
- **WHEN** a inserção no Supabase falha (ex: sem conexão)
- **THEN** uma mensagem de erro é exibida e o botão volta ao estado original

---

### Requirement: Navegação de volta ao simulador
O cartão de receita SHALL exibir um botão ou header de voltar que retorna para `/(tabs)/simulator` via `router.back()`.

#### Scenario: Voltar ao simulador
- **WHEN** o usuário toca o botão de voltar
- **THEN** o app retorna para `/(tabs)/simulator` mantendo o estado do mix
