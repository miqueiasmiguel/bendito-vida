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
Os grupos `(auth)`, `(onboarding)` e `(tabs)` SHALL ter `_layout.tsx` próprios que renderizam `<Stack />` ou `<Tabs />` respectivamente, de modo que qualquer navegação para rotas dentro desses grupos não resulte em erro de rota não encontrada.

#### Scenario: Navegação para rota de auth
- **WHEN** o usuário é direcionado para `/(auth)/login`
- **THEN** a tela renderiza sem crash (pode ser placeholder)

#### Scenario: Tabs layout renderiza 4 abas
- **WHEN** o usuário acessa qualquer rota dentro de `/(tabs)/`
- **THEN** a barra de tabs aparece com ícones: Home (House), Meu Mix (FlaskConical), Evolução (TrendingUp), Perfil (User)

#### Scenario: Cor ativa das tabs
- **WHEN** uma aba está selecionada
- **THEN** seu ícone e label usam `colors.primary[700]` (#2D6A2E); as demais usam `colors.neutral[400]`

---

### Requirement: Telas placeholder não bloqueiam navegação
Cada rota sem implementação real (`(auth)/login`, `(auth)/register`, `(onboarding)/quiz`, `(tabs)/home`, `(tabs)/simulator`, `(tabs)/progress`, `(tabs)/profile`, `result`) SHALL ter um arquivo `.tsx` mínimo que renderize ao menos um `<View>` com texto identificando a tela.

#### Scenario: Rota placeholder acessada
- **WHEN** o Expo Router resolve qualquer rota do app
- **THEN** o arquivo correspondente existe e renderiza sem erro TypeScript ou runtime
