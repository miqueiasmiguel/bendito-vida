## ADDED Requirements

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
A tela Home SHALL exibir um card "Mapa Bioativo" contendo os 3 nutrientes prioritários derivados do `nutritionProfile` do quiz, cada um com ícone, nome e barra de progresso visual (nível relativo ao máximo do grupo).

#### Scenario: Quiz concluído com perfil gerado
- **WHEN** `useQuizStore.nutritionProfile` contém tags acumuladas
- **THEN** o card exibe exatamente 3 nutrientes com ícone Lucide, label e barra colorida

#### Scenario: Quiz não concluído
- **WHEN** `useQuizStore.nutritionProfile` está vazio ou nulo
- **THEN** o card exibe estado vazio com mensagem "Complete o quiz para ver seu Mapa Bioativo" e botão "Fazer Quiz"

---

### Requirement: Ingredientes recomendados no Mapa Bioativo
O Mapa Bioativo SHALL exibir 3 a 5 ingredientes recomendados derivados das tags do `nutritionProfile`, ordenados por número de tags em comum. Ingredientes com `isParaibano: true` SHALL exibir badge "Paraibano".

#### Scenario: Ingredientes com match de tags
- **WHEN** o perfil possui tags que coincidem com ingredientes do catálogo
- **THEN** são exibidos até 5 ingredientes com nome, ícone e badge condicional

#### Scenario: Ingrediente paraibano na lista
- **WHEN** um ingrediente recomendado tem `isParaibano: true`
- **THEN** um badge verde com texto "Paraibano" é exibido junto ao nome

---

### Requirement: CTA "Montar meu Mix"
A tela Home SHALL exibir um botão primário "Montar meu Mix" que navega para `/(tabs)/simulator`.

#### Scenario: Toque no CTA
- **WHEN** usuário toca "Montar meu Mix"
- **THEN** app navega para a tab Simulador

---

### Requirement: Card de Check-in semanal (placeholder)
A tela Home SHALL exibir um card "Check-in da semana" com UI estática indicando que o check-in está disponível. A lógica real de submissão pertence à Tela 6.

#### Scenario: Card visível na Home
- **WHEN** tela Home é exibida
- **THEN** card "Check-in da semana" aparece com CTA "Responder" (sem navegação funcional nesta iteração)

---

### Requirement: Dica do dia
A tela Home SHALL exibir uma "Dica do dia" com nome e benefício de um ingrediente selecionado deterministicamente pelo dia da semana (`Date.getDay() % ingredients.length`).

#### Scenario: Dica exibida
- **WHEN** tela Home é renderizada
- **THEN** um card pequeno exibe o nome e o `benefit` do ingrediente selecionado
