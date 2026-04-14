## MODIFIED Requirements

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

### Requirement: Barra de progresso acessível
Todos os cards de opção e os botões de navegação SHALL ter área de toque mínima de 44x44px, `accessibilityRole` apropriado e `accessibilityLabel` descritivo. A barra de progresso SHALL estar centralizada horizontalmente.

#### Scenario: Barra de progresso acessível
- **WHEN** leitor de tela foca na barra de progresso
- **THEN** o componente expõe `accessibilityRole="progressbar"` e `accessibilityValue={{ now: step, min: 1, max: 5 }}`

#### Scenario: Botão "Voltar" acessível
- **WHEN** leitor de tela foca no botão "Voltar"
- **THEN** o botão expõe `accessibilityRole="button"` e `accessibilityLabel="Voltar para a pergunta anterior"`
