## ADDED Requirements

### Requirement: Exibir scores do check-in de hoje quando disponível
O `TodayStatusCard` SHALL exibir os 3 scores do check-in do dia atual (energia, sono, foco) como indicadores visuais compactos quando `checkin` for fornecido. Cada score SHALL ser exibido com um ícone Lucide representativo, o valor numérico (1–5) e um label. O card SHALL exibir texto "Check-in de hoje realizado ✓" em cor `success`.

#### Scenario: Check-in do dia disponível
- **WHEN** o componente recebe `checkin` com `energyScore`, `sleepScore` e `focusScore`
- **THEN** o card exibe 3 colunas com ícone + valor + label para cada score, e texto de confirmação "Check-in de hoje realizado ✓"

#### Scenario: Score exibido com ícone correto
- **WHEN** o componente exibe os scores
- **THEN** energia usa ícone `<Zap />`, sono usa `<Moon />`, foco usa `<Brain />`, todos Lucide com strokeWidth 1.5

---

### Requirement: Exibir CTA quando check-in não realizado
O `TodayStatusCard` SHALL exibir um estado de chamada para ação quando `checkin` for `undefined` ou `null`. O estado SHALL mostrar ícone `<ClipboardList />`, texto "Como você está hoje?" e botão secundário "Registrar meu dia" que navega para a aba `/(tabs)/progress`.

#### Scenario: Sem check-in no dia atual
- **WHEN** o componente recebe `checkin` como `undefined` ou `null`
- **THEN** o card exibe ícone, headline "Como você está hoje?" e botão "Registrar meu dia"

#### Scenario: Toque no botão CTA
- **WHEN** o usuário toca em "Registrar meu dia"
- **THEN** o app navega para `/(tabs)/progress`

---

### Requirement: Toque no card no estado preenchido navega para Evolução
O `TodayStatusCard` no estado com check-in SHALL ser inteiramente tocável e navegar para `/(tabs)/progress` ao ser pressionado.

#### Scenario: Card tocável com check-in
- **WHEN** o usuário toca em qualquer área do `TodayStatusCard` com check-in disponível
- **THEN** o app navega para `/(tabs)/progress`

---

### Requirement: Acessibilidade do TodayStatusCard
O `TodayStatusCard` SHALL ter `accessibilityRole="button"` quando tocável, e cada score SHALL ter `accessibilityLabel` descritivo (ex: "Energia: 4 de 5").

#### Scenario: Labels de acessibilidade presentes
- **WHEN** o card é renderizado com scores
- **THEN** cada indicador de score possui `accessibilityLabel` no formato "<Dimensão>: <valor> de 5"
