## REMOVED Requirements

### Requirement: Check-in semanal compacto na Home
**Reason:** Duplicação com a aba Evolução — o `WeeklyCheckinCard` com prop `compact` apenas redireciona para Progress sem agregar valor; o `TodayStatusCard` substitui com uma visualização mais informativa e sem duplicar lógica.
**Migration:** O check-in diário completo permanece na aba Evolução (`/(tabs)/progress`). O `TodayStatusCard` na Home exibe o status do dia e redireciona para Evolução quando necessário.

---

## ADDED Requirements

### Requirement: SimulatorCtaCard exibido na Home como segundo elemento
A tela Home SHALL exibir o `SimulatorCtaCard` imediatamente após a saudação personalizada, antes do `BioactiveMap`.

#### Scenario: Posição do SimulatorCtaCard
- **WHEN** o usuário abre a aba Home
- **THEN** o `SimulatorCtaCard` aparece na segunda posição (após a saudação), visível sem scroll na maioria dos dispositivos 5"–6.7"

---

### Requirement: TodayStatusCard exibido na Home após o BioactiveMap
A tela Home SHALL exibir o `TodayStatusCard` após o `BioactiveMap` e antes da `DailyTip`.

#### Scenario: Posição do TodayStatusCard
- **WHEN** o usuário rola a Home
- **THEN** o `TodayStatusCard` aparece entre o `BioactiveMap` e a `DailyTip`

---

## MODIFIED Requirements

### Requirement: Exibir saudação personalizada
A tela Home SHALL exibir "Olá, [Nome]!" usando o nome do usuário autenticado (`useAuthStore`). Se o nome não estiver disponível, SHALL exibir "Olá!" como fallback. O subtítulo SHALL ser atualizado para "Veja o que preparamos para você hoje." para refletir o novo layout orientado ao dia.

#### Scenario: Usuário autenticado com nome
- **WHEN** usuário abre a aba Home com sessão ativa e nome cadastrado
- **THEN** o topo da tela exibe "Olá, [Nome]!" com fonte H1 SemiBold

#### Scenario: Nome não disponível
- **WHEN** usuário abre a aba Home sem nome no perfil
- **THEN** o topo da tela exibe "Olá!" sem placeholder vazio

#### Scenario: Subtítulo atualizado
- **WHEN** a tela Home é renderizada
- **THEN** o subtítulo abaixo da saudação exibe "Veja o que preparamos para você hoje."
