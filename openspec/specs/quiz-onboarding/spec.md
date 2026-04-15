## Requirements

### Requirement: Quiz exibe perguntas sequencialmente com progresso visual
O quiz SHALL exibir 5 perguntas, uma por vez, com transição horizontal entre elas. Uma barra de progresso no topo SHALL mostrar o passo atual no formato "X de 5" e SHALL estar centralizada horizontalmente na tela.

#### Scenario: Primeira pergunta ao abrir o quiz
- **WHEN** o usuário navega para `/(onboarding)/quiz`
- **THEN** a pergunta 1 está visível, a barra de progresso mostra "1 de 5" centralizada, o botão "Próximo" está oculto e o botão "Voltar" está oculto

#### Scenario: Avançar para próxima pergunta após seleção
- **WHEN** o usuário seleciona uma opção e toca "Próximo"
- **THEN** a tela desliza horizontalmente para a pergunta seguinte e a barra de progresso incrementa

#### Scenario: Barra de progresso na pergunta final
- **WHEN** o usuário está na pergunta 5
- **THEN** a barra de progresso mostra "5 de 5" e o botão exibe "Concluir" ao invés de "Próximo"

---

### Requirement: Botões de navegação do quiz são exibidos lado a lado
Os botões "Voltar" e "Próximo" (ou "Concluir") SHALL ser exibidos em uma linha horizontal, com "Voltar" à esquerda e "Próximo" à direita, cada um com `flex: 1`. O botão "Voltar" SHALL ser exibido como botão secundário (border `primary-700`). O botão "Voltar" SHALL estar oculto na pergunta 1.

#### Scenario: Botões lado a lado nas perguntas intermediárias
- **WHEN** o usuário está em qualquer pergunta entre 2 e 5 e já selecionou uma opção
- **THEN** os botões "Voltar" e "Próximo" (ou "Concluir") são exibidos em linha, ocupando cada um metade do espaço disponível

#### Scenario: Apenas "Próximo" visível na pergunta 1
- **WHEN** o usuário está na pergunta 1 e seleciona uma opção
- **THEN** apenas o botão "Próximo" é exibido (sem botão "Voltar" ao lado)

#### Scenario: Botão "Voltar" navega para a pergunta anterior
- **WHEN** o usuário está na pergunta 3 e toca "Voltar"
- **THEN** a tela desliza para a pergunta 2 e a barra de progresso decrementa

#### Scenario: Botão "Voltar" preserva seleção anterior
- **WHEN** o usuário volta para uma pergunta que já havia respondido
- **THEN** a seleção anterior permanece marcada

---

### Requirement: Cards de opção refletem estado de seleção
Cada opção de resposta SHALL ser exibida como um card. O card selecionado SHALL ter borda `primary-700` (1.5px) e background `primary-100`. Cards não selecionados SHALL ter borda `neutral-200`.

#### Scenario: Seleção de opção única
- **WHEN** o usuário toca em um card de opção (pergunta de seleção única)
- **THEN** o card tocado fica ativo (borda primary-700, bg primary-100) e qualquer seleção anterior é desmarcada

#### Scenario: Botão Próximo aparece após seleção
- **WHEN** o usuário seleciona qualquer opção em uma pergunta de seleção única
- **THEN** o botão "Próximo" aparece com animação de fade (300ms ease-out)

---

### Requirement: Pergunta 4 suporta multi-seleção com exclusividade de "Nenhuma"
A pergunta de restrições alimentares SHALL permitir selecionar múltiplas opções. A opção "Nenhuma" SHALL ser mutuamente exclusiva com todas as outras opções.

#### Scenario: Selecionar múltiplas restrições
- **WHEN** o usuário toca "Glúten" e depois "Lactose"
- **THEN** ambos os cards ficam ativos simultaneamente

#### Scenario: Selecionar "Nenhuma" desmarca as demais
- **WHEN** o usuário já tem "Glúten" selecionado e toca "Nenhuma"
- **THEN** "Nenhuma" fica ativa e "Glúten" é desmarcado

#### Scenario: Selecionar outra opção após "Nenhuma"
- **WHEN** o usuário tem "Nenhuma" selecionado e toca "Lactose"
- **THEN** "Lactose" fica ativa e "Nenhuma" é desmarcado

#### Scenario: Botão Próximo aparece após qualquer seleção na pergunta 4
- **WHEN** o usuário seleciona ao menos uma opção na pergunta de multi-seleção
- **THEN** o botão "Próximo" / "Concluir" torna-se visível

---

### Requirement: Algoritmo de perfil calcula nutrientes prioritários
Ao concluir o quiz, o sistema SHALL calcular um perfil nutricional a partir das respostas. O perfil SHALL conter os 3 nutrientes com maior pontuação (soma ponderada das tags) e os ingredientes paraibanos associados a esses nutrientes.

#### Scenario: Cálculo sem empate
- **WHEN** o usuário conclui o quiz com respostas mapeadas para nutrientes distintos
- **THEN** `matchProfile()` retorna `{ topNutrients: string[3], suggestedIngredients: Ingredient[] }` com os 3 maiores scores

#### Scenario: Desempate por precedência
- **WHEN** dois ou mais nutrientes têm a mesma pontuação
- **THEN** o desempate segue a ordem de precedência definida no array de nutrientes (vitaminas antes de minerais)

#### Scenario: Perfil salvo no Zustand antes de navegar
- **WHEN** o usuário toca "Concluir" na última pergunta
- **THEN** `useQuizStore.setProfile(profile)` é chamado e o router navega para `/(tabs)/home` via `router.replace`

---

### Requirement: Barra de progresso acessível
Todos os cards de opção e os botões de navegação SHALL ter área de toque mínima de 44x44px, `accessibilityRole` apropriado e `accessibilityLabel` descritivo. A barra de progresso SHALL estar centralizada horizontalmente.

#### Scenario: Card de opção acessível
- **WHEN** leitor de tela foca em um card de opção
- **THEN** o card expõe `accessibilityRole="button"`, `accessibilityLabel` com o texto da opção, e `accessibilityState={{ selected: boolean }}`

#### Scenario: Barra de progresso acessível
- **WHEN** leitor de tela foca na barra de progresso
- **THEN** o componente expõe `accessibilityRole="progressbar"` e `accessibilityValue={{ now: step, min: 1, max: 5 }}`

#### Scenario: Botão "Voltar" acessível
- **WHEN** leitor de tela foca no botão "Voltar"
- **THEN** o botão expõe `accessibilityRole="button"` e `accessibilityLabel="Voltar para a pergunta anterior"`

---

### Requirement: Navegação pós-conclusão do quiz
Ao responder a última pergunta e confirmar, o sistema SHALL: (1) chamar `markOnboardingComplete(profile)` do `useAuthStore` para persistir `onboarding_completed = true` **e** `bioactive_profile` (objeto `NutritionProfile` serializado) na tabela `profiles` do Supabase, (2) chamar `useQuizStore.setProfile(profile)` para salvar o perfil calculado em memória, e (3) navegar para `/(tabs)/home` usando `router.replace`. A persistência SHALL ocorrer antes da navegação. Falhas na persistência não SHALL bloquear a navegação.

#### Scenario: Conclusão do quiz com persistência bem-sucedida
- **WHEN** o usuário confirma a resposta da última pergunta e a operação Supabase é bem-sucedida
- **THEN** `markOnboardingComplete(profile)` é chamado com o `NutritionProfile` calculado, `profiles.bioactive_profile` é gravado no Supabase, e o app navega para `/(tabs)/home` via `router.replace`

#### Scenario: Conclusão do quiz com falha na persistência
- **WHEN** o usuário confirma a resposta da última pergunta e a operação Supabase falha
- **THEN** o app navega para `/(tabs)/home` mesmo assim; `onboardingCompleted` permanece `false` no store local e a flag não foi gravada no Supabase

#### Scenario: Perfil salvo no Zustand antes de navegar
- **WHEN** o usuário toca "Concluir" na última pergunta
- **THEN** `useQuizStore.setProfile(profile)` é chamado antes de `router.replace`
