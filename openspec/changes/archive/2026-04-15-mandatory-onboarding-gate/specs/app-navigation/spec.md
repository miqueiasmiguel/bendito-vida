## MODIFIED Requirements

### Requirement: Root layout inicializa providers e fontes
O root layout (`src/app/_layout.tsx`) SHALL carregar a fonte Poppins via `expo-font`, segurar o splash screen com `SplashScreen.preventAutoHideAsync()`, e envolver toda a aplicação com `GestureHandlerRootView` e `SafeAreaProvider`. O splash SHALL ser escondido apenas quando `appReady` for verdadeiro, onde: `appReady = (fontsLoaded || fontError) && sessionChecked && (user === null || onboardingChecked)`. O gate de onboarding SHALL executar em um `useEffect` separado que observa `appReady`, `user` e `onboardingCompleted`.

#### Scenario: Fontes e estado de auth carregam antes da UI aparecer
- **WHEN** o app inicia
- **THEN** o splash screen permanece visível até: Poppins carregada E `sessionChecked = true` E (`user` nulo OU `onboardingChecked = true`); só então o gate executa e o splash é escondido

#### Scenario: Erro no carregamento de fonte
- **WHEN** `useFonts` retorna erro
- **THEN** o app continua (não crasha) — `fontError` truthy satisfaz a condição de fonte em `appReady`

#### Scenario: Gate executa após app pronto
- **WHEN** `appReady` torna-se `true` e o usuário está autenticado com `onboardingCompleted = false`
- **THEN** `router.replace('/(onboarding)/quiz')` é chamado e o splash é escondido

#### Scenario: Sem usuário — splash esconde sem fetch de perfil
- **WHEN** `sessionChecked = true` e `user = null`
- **THEN** `onboardingChecked` não é esperado (condição `user === null` satisfaz `appReady`); o splash esconde imediatamente após as fontes
