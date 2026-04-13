## MODIFIED Requirements

### Requirement: Telas placeholder não bloqueiam navegação
Cada rota sem implementação real (`(auth)/login`, `(auth)/register`, `(tabs)/profile`) SHALL ter um arquivo `.tsx` mínimo que renderize ao menos um `<View>` com texto identificando a tela. As rotas `(onboarding)/quiz`, `(tabs)/home`, `(tabs)/simulator`, `(tabs)/progress` e `result` SHALL ter implementação real (não placeholder). A rota `result` SHALL ser acessível como stack screen no root layout.

#### Scenario: Rota placeholder acessada
- **WHEN** o Expo Router resolve qualquer rota de placeholder do app
- **THEN** o arquivo correspondente existe e renderiza sem erro TypeScript ou runtime

#### Scenario: Rota quiz implementada
- **WHEN** o Expo Router resolve `/(onboarding)/quiz`
- **THEN** o componente real do quiz é renderizado (não um placeholder)

#### Scenario: Rota simulator implementada
- **WHEN** o Expo Router resolve `/(tabs)/simulator`
- **THEN** o componente real do Simulador "Meu Mix" é renderizado com jarro e lista de ingredientes

#### Scenario: Rota progress implementada
- **WHEN** o Expo Router resolve `/(tabs)/progress`
- **THEN** o componente real do Dashboard de Evolução é renderizado com o WeeklyCheckinCard, EvolutionChart e InsightBanner (não um placeholder)

#### Scenario: Rota result acessível como stack
- **WHEN** o usuário navega para `/result` a partir do simulador
- **THEN** a tela do Cartão de Receita é renderizada como stack screen (sem tab bar visível)
