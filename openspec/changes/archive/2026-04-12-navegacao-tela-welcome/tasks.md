## 1. Tema Base

- [x] 1.1 Criar `src/theme/colors.ts` com todos os tokens de cor do design system (primary, accent, neutral, success, error, warning, info)
- [x] 1.2 Criar `src/theme/typography.ts` com tokens de fonte Poppins (tamanhos H1-H3, Body, Caption, Small) e pesos (SemiBold, Regular)
- [x] 1.3 Criar `src/theme/spacing.ts` com tokens xs/sm/md/lg/xl/xxl e raios de borda (card, button, input, badge)
- [x] 1.4 Criar `src/theme/index.ts` reexportando colors, typography e spacing

## 2. Componente Button

- [x] 2.1 Criar `src/components/ui/Button.tsx` com interface de props (`variant`, `label`, `onPress`, `disabled`), variantes primary/secondary, touch area ≥44x44, `accessibilityRole` e `accessibilityLabel`
- [x] 2.2 Criar `src/components/ui/index.ts` exportando Button
- [x] 2.3 Criar `src/components/ui/__tests__/Button.test.tsx` com teste de renderização primary, secondary e estado disabled

## 3. Root Layout e Providers

- [x] 3.1 Criar `src/app/_layout.tsx` com `SplashScreen.preventAutoHideAsync()`, `useFonts` para Poppins-Regular e Poppins-SemiBold, `GestureHandlerRootView` e `SafeAreaProvider` envolvendo `<Stack />`
- [x] 3.2 Verificar que `app.json` tem `"scheme"` configurado (necessário para deep links no Expo Router)

## 4. Layout dos Grupos de Rota

- [x] 4.1 Criar `src/app/(auth)/_layout.tsx` com `<Stack screenOptions={{ headerShown: false }} />`
- [x] 4.2 Criar `src/app/(onboarding)/_layout.tsx` com `<Stack screenOptions={{ headerShown: false }} />`
- [x] 4.3 Criar `src/app/(tabs)/_layout.tsx` com `<Tabs />` e as 4 abas (Home, Meu Mix, Evolução, Perfil) usando ícones Lucide e cores do tema

## 5. Telas Placeholder

- [x] 5.1 Criar `src/app/(auth)/login.tsx` — placeholder com texto "Login"
- [x] 5.2 Criar `src/app/(auth)/register.tsx` — placeholder com texto "Cadastro"
- [x] 5.3 Criar `src/app/(onboarding)/quiz.tsx` — placeholder com texto "Quiz"
- [x] 5.4 Criar `src/app/(tabs)/home.tsx` — placeholder com texto "Home"
- [x] 5.5 Criar `src/app/(tabs)/simulator.tsx` — placeholder com texto "Simulador"
- [x] 5.6 Criar `src/app/(tabs)/progress.tsx` — placeholder com texto "Evolução"
- [x] 5.7 Criar `src/app/(tabs)/profile.tsx` — placeholder com texto "Perfil"
- [x] 5.8 Criar `src/app/result.tsx` — placeholder com texto "Receita"

## 6. Tela Welcome

- [x] 6.1 Criar `src/app/index.tsx` com layout: background `colors.primary[700]`, logo centralizada (texto "Bendito Vida" Poppins SemiBold branco), tagline e os dois CTAs
- [x] 6.2 Adicionar animação de entrada com Reanimated 4: `useSharedValue` + `withSpring` para scale da logo (0→1)
- [x] 6.3 Adicionar 4 elementos decorativos animados (círculos coloridos) com `withDelay` + `withTiming` escalonados
- [x] 6.4 Conectar botão "Começar" → navegar para `/(auth)/register` + `Haptics.impactAsync`
- [x] 6.5 Conectar link "Já tenho conta" → navegar para `/(auth)/login`

## 7. Verificação Final

- [x] 7.1 Rodar `npm run lint` — zero erros
- [x] 7.2 Rodar `npm test` — todos os testes passando (incluindo Button.test.tsx)
- [x] 7.3 Rodar `npm run validate` — CI local verde
