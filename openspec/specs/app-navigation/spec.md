## ADDED Requirements

### Requirement: Root layout inicializa providers e fontes
O root layout (`src/app/_layout.tsx`) SHALL carregar a fonte Poppins via `expo-font`, segurar o splash screen com `SplashScreen.preventAutoHideAsync()` até as fontes estarem prontas, e envolver toda a aplicação com `GestureHandlerRootView` e `SafeAreaProvider`.

#### Scenario: Fontes carregam antes da UI aparecer
- **WHEN** o app inicia
- **THEN** o splash screen permanece visível até Poppins (Regular e SemiBold) estarem carregadas, e só então esconde o splash e renderiza a tela

#### Scenario: Erro no carregamento de fonte
- **WHEN** `useFonts` retorna erro
- **THEN** o app continua (não crasha) e usa fonte de sistema como fallback

---

### Requirement: Grupos de rota existem e não causam crash
Os grupos `(auth)`, `(onboarding)` e `(tabs)` SHALL ter `_layout.tsx` próprios que renderizam `<Stack />` ou `<Tabs />` respectivamente, de modo que qualquer navegação para rotas dentro desses grupos não resulte em erro de rota não encontrada. O grupo `(onboarding)` SHALL ter `_layout.tsx` com `<Stack screenOptions={{ headerShown: false }} />`.

#### Scenario: Navegação para rota de auth
- **WHEN** o usuário é direcionado para `/(auth)/login`
- **THEN** a tela renderiza sem crash (pode ser placeholder)

#### Scenario: Tabs layout renderiza 4 abas
- **WHEN** o usuário acessa qualquer rota dentro de `/(tabs)/`
- **THEN** a barra de tabs aparece com ícones: Home (House), Meu Mix (FlaskConical), Evolução (TrendingUp), Perfil (User)

#### Scenario: Cor ativa das tabs
- **WHEN** uma aba está selecionada
- **THEN** seu ícone e label usam `colors.primary[700]` (#2D6A2E); as demais usam `colors.neutral[400]`

#### Scenario: Navegação para rota de onboarding
- **WHEN** o usuário é direcionado para `/(onboarding)/quiz`
- **THEN** a tela renderiza sem crash e sem header visível

---

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

---

### Requirement: Welcome Screen navega para o quiz ao tocar "Começar"
O botão "Começar" na tela Welcome (`/`) SHALL navegar para `/(onboarding)/quiz` usando `router.push` ou `<Link>`.

#### Scenario: Toque em "Começar"
- **WHEN** o usuário toca o botão "Começar" na Welcome Screen
- **THEN** o app navega para `/(onboarding)/quiz` e a tela do quiz é exibida
