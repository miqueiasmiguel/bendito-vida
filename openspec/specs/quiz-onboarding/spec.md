## Requirements

### Requirement: Quiz exibe perguntas sequencialmente com progresso visual
O quiz SHALL exibir 5 perguntas, uma por vez, com transição horizontal entre elas. Uma barra de progresso no topo SHALL mostrar o passo atual no formato "X de 5".

#### Scenario: Primeira pergunta ao abrir o quiz
- **WHEN** o usuário navega para `/(onboarding)/quiz`
- **THEN** a pergunta 1 está visível, a barra de progresso mostra "1 de 5", e o botão "Próximo" está oculto

#### Scenario: Avançar para próxima pergunta após seleção
- **WHEN** o usuário seleciona uma opção e toca "Próximo"
- **THEN** a tela desliza horizontalmente para a pergunta seguinte e a barra de progresso incrementa

#### Scenario: Barra de progresso na pergunta final
- **WHEN** o usuário está na pergunta 5
- **THEN** a barra de progresso mostra "5 de 5" e o botão exibe "Concluir" ao invés de "Próximo"

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

### Requirement: Componentes do quiz respeitam acessibilidade e touch target
Todos os cards de opção e o botão "Próximo" SHALL ter área de toque mínima de 44x44px, `accessibilityRole` apropriado e `accessibilityLabel` descritivo.

#### Scenario: Card de opção acessível
- **WHEN** leitor de tela foca em um card de opção
- **THEN** o card expõe `accessibilityRole="button"`, `accessibilityLabel` com o texto da opção, e `accessibilityState={{ selected: boolean }}`

#### Scenario: Barra de progresso acessível
- **WHEN** leitor de tela foca na barra de progresso
- **THEN** o componente expõe `accessibilityRole="progressbar"` e `accessibilityValue={{ now: step, min: 1, max: 5 }}`

---

### Requirement: Navegação pós-conclusão do quiz
Ao responder a última pergunta e confirmar, o sistema SHALL navegar para `/(tabs)/home` usando `router.replace` (não `router.push`), para que o stack de navegação não permita voltar ao quiz após a conclusão.

#### Scenario: Conclusão do quiz
- **WHEN** usuário confirma a resposta da última pergunta (pergunta 5)
- **THEN** app navega para `/(tabs)/home` via `router.replace`, impedindo retorno ao quiz via botão Voltar
