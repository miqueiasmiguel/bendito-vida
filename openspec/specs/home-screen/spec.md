## Requirements

### Requirement: Exibir saudação personalizada
A tela Home SHALL exibir "Olá, [Nome]!" usando o nome do usuário autenticado (`useAuthStore`). Se o nome não estiver disponível, SHALL exibir "Olá!" como fallback.

#### Scenario: Usuário autenticado com nome
- **WHEN** usuário abre a aba Home com sessão ativa e nome cadastrado
- **THEN** o topo da tela exibe "Olá, [Nome]!" com fonte H2 SemiBold

#### Scenario: Nome não disponível
- **WHEN** usuário abre a aba Home sem nome no perfil
- **THEN** o topo da tela exibe "Olá!" sem placeholder vazio

---

### Requirement: Mapa Bioativo com nutrientes prioritários
A tela Home SHALL exibir um card "Mapa Bioativo" contendo até 6 nutrientes prioritários derivados do `nutritionProfile` do quiz, visualizados como um **gráfico radar (teia de aranha)** via componente `BioactiveRadarChart`. Se o `nutritionProfile` retornar mais de 6 nutrientes, os 6 com maior score SHALL ser selecionados. Os valores de cada nutriente SHALL ser normalizados (0–100) com base no valor máximo do respectivo grupo.

#### Scenario: Quiz concluído com perfil gerado (3 a 6 nutrientes)
- **WHEN** `useQuizStore.nutritionProfile` contém entre 3 e 6 tags acumuladas
- **THEN** o card exibe o `BioactiveRadarChart` com um eixo por nutriente, área preenchida em `primary-500` (30% opacidade) e labels com nome curto de cada nutriente

#### Scenario: Quiz concluído com mais de 6 nutrientes
- **WHEN** `useQuizStore.nutritionProfile` contém mais de 6 nutrientes
- **THEN** o card exibe o `BioactiveRadarChart` com os 6 nutrientes de maior score, ignorando os demais

#### Scenario: Quiz não concluído
- **WHEN** `useQuizStore.nutritionProfile` está vazio ou nulo
- **THEN** o card exibe estado vazio com mensagem "Complete o quiz para ver seu Mapa Bioativo" e botão "Fazer Quiz"

---

### Requirement: Ingredientes recomendados no Mapa Bioativo
O Mapa Bioativo SHALL exibir 3 a 5 ingredientes recomendados derivados das tags do `nutritionProfile`, ordenados por número de tags em comum. Ingredientes com `isParaibano: true` SHALL exibir um selo circular verde com ícone de folha (`<Leaf />` Lucide, size=10, strokeWidth=2, cor `neutral-50`) posicionado no canto superior direito do chip, idêntico ao padrão do `IngredientCard` no Meu Mix.

#### Scenario: Ingredientes com match de tags
- **WHEN** o perfil possui tags que coincidem com ingredientes do catálogo
- **THEN** são exibidos até 5 ingredientes com nome e selo condicional

#### Scenario: Ingrediente paraibano na lista
- **WHEN** um ingrediente recomendado tem `isParaibano: true`
- **THEN** um selo circular verde com ícone `<Leaf />` é exibido no canto superior direito do chip (sem texto "Paraibano", consistente com o padrão do Meu Mix)

---

### Requirement: Dica do dia
A tela Home SHALL exibir uma "Dica do dia" com nome e benefício de um ingrediente selecionado deterministicamente pelo dia da semana (`Date.getDay() % ingredients.length`).

#### Scenario: Dica exibida
- **WHEN** tela Home é renderizada
- **THEN** um card pequeno exibe o nome e o `benefit` do ingrediente selecionado

---

### Requirement: Menu contextual no card Mapa Bioativo
O card Mapa Bioativo SHALL exibir um botão de menu (ícone `MoreVertical`, três pontinhos verticais) no canto superior direito do cabeçalho do card, em ambos os estados (quiz concluído e quiz não concluído). Ao tocar no botão, SHALL ser exibido um menu modal com a opção "Refazer quiz". Ao selecionar "Refazer quiz", o app SHALL navegar para `/(onboarding)/quiz`. O menu SHALL ser fechável tocando fora ou em "Cancelar".

#### Scenario: Abrir menu no estado preenchido
- **WHEN** o usuário toca nos três pontinhos no card Mapa Bioativo com perfil já preenchido
- **THEN** um modal é exibido com a opção "Refazer quiz" e um botão "Cancelar"

#### Scenario: Abrir menu no estado vazio
- **WHEN** o usuário toca nos três pontinhos no card Mapa Bioativo sem quiz concluído
- **THEN** um modal é exibido com a opção "Refazer quiz" e um botão "Cancelar"

#### Scenario: Selecionar "Refazer quiz"
- **WHEN** o usuário toca em "Refazer quiz" no menu contextual
- **THEN** o modal é fechado e o app navega para a tela do quiz `/(onboarding)/quiz`

#### Scenario: Fechar menu sem ação
- **WHEN** o usuário toca em "Cancelar" ou no overlay escuro fora do menu
- **THEN** o modal é fechado sem nenhuma navegação ou alteração de estado

---

### Requirement: Perfil bioativo reidratado do Supabase na inicialização
Ao inicializar o app com um usuário autenticado que já completou o quiz, o sistema SHALL recuperar `bioactive_profile` da tabela `profiles` e popular `useQuizStore.nutritionProfile` **antes** de renderizar a tela Home. Se `bioactive_profile` for `null` (usuário nunca completou o quiz ou fez quiz antes desta feature), o Mapa Bioativo SHALL exibir o estado vazio ("Complete o quiz para ver seu Mapa Bioativo").

#### Scenario: App reinicia com usuário que completou o quiz
- **WHEN** o usuário fecha e reabre o app estando autenticado e `profiles.bioactive_profile` é não-nulo
- **THEN** a tela Home exibe o Mapa Bioativo com os nutrientes e ingredientes do perfil salvo, sem precisar refazer o quiz

#### Scenario: App reinicia com usuário sem perfil salvo
- **WHEN** o usuário fecha e reabre o app estando autenticado e `profiles.bioactive_profile` é `null`
- **THEN** a tela Home exibe o estado vazio do Mapa Bioativo com botão "Fazer Quiz"
