## MODIFIED Requirements

### Requirement: Exibir identidade do usuário
A tela de Perfil SHALL exibir um avatar circular com a inicial do nome do usuário, o nome completo e a data de cadastro formatada ("Membro desde mês/ano"). O avatar SHALL ser exibido no header da tela com fundo `primary-700`.

#### Scenario: Usuário autenticado com nome
- **WHEN** o usuário navega para a aba Perfil
- **THEN** o sistema exibe a inicial do nome em avatar circular com fundo `primary-700`, o nome completo e a data de cadastro no formato "Membro desde [mês] de [ano]"

#### Scenario: Nome ausente no perfil
- **WHEN** o campo `name` está vazio ou nulo
- **THEN** o sistema exibe "?" no avatar e "Usuário" como nome

---

### Requirement: Mapa Bioativo no Perfil
A tela de Perfil SHALL exibir o componente `BioactiveMap` (radar chart) com as mesmas props e comportamento da tela Home — `topNutrients`, `recommendedIngredients` e `onQuizPress`. O antigo componente `BioactiveSummary` SHALL ser removido da tela de Perfil.

#### Scenario: Quiz concluído
- **WHEN** `useQuizStore.nutritionProfile` está disponível
- **THEN** o card exibe o radar chart com nutrientes e ingredientes recomendados, idêntico ao do Home

#### Scenario: Quiz não concluído
- **WHEN** `useQuizStore.nutritionProfile` é `null` ou vazio
- **THEN** o card exibe estado vazio com mensagem "Complete o quiz para ver seu Mapa Bioativo" e botão "Fazer Quiz" que navega para `/(onboarding)/quiz`

---

### Requirement: Cards de estatísticas do usuário
A tela de Perfil SHALL exibir dois cards de estatísticas calculados localmente: (1) total de mixes criados (`mixes.length` do `useProfileStore`) e (2) dias de uso do app (calculado a partir de `user.createdAt`).

#### Scenario: Usuário com mixes e data de cadastro
- **WHEN** o usuário navega para a aba Perfil
- **THEN** dois cards lado a lado exibem "X mixes" e "Y dias" com labels descritivos abaixo dos números

#### Scenario: Store de perfil carregando
- **WHEN** o fetch de mixes ainda está em andamento
- **THEN** o card de total de mixes exibe "—" no lugar do número

---

### Requirement: Navegação para sub-telas a partir do Perfil
A tela de Perfil SHALL exibir dois itens de navegação em forma de cards/rows: "Meus Mixes" (navega para `/(tabs)/profile/my-mixes`) e "Configurações" (navega para `/(tabs)/profile/settings`). Cada item SHALL ter ícone Lucide à esquerda e chevron à direita.

#### Scenario: Toque em "Meus Mixes"
- **WHEN** o usuário toca o item "Meus Mixes"
- **THEN** o sistema navega para `/(tabs)/profile/my-mixes`

#### Scenario: Toque em "Configurações"
- **WHEN** o usuário toca o item "Configurações"
- **THEN** o sistema navega para `/(tabs)/profile/settings`

---

## REMOVED Requirements

### Requirement: Listar mixes salvos
**Reason**: A listagem de mixes foi extraída para a sub-tela dedicada `/(tabs)/profile/my-mixes` para desafogar o hub de Perfil e permitir expansão futura.
**Migration**: Usar `/(tabs)/profile/my-mixes` para acessar a lista de mixes. O `useProfileStore` continua sendo a fonte de dados.

### Requirement: Logout do usuário
**Reason**: A ação de logout foi movida para a sub-tela "Configurações" (`/(tabs)/profile/settings`), agrupada com demais ações destrutivas/de conta.
**Migration**: Usar `/(tabs)/profile/settings` para acessar o botão de logout.
