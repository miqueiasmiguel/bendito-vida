## 1. Remover rótulo do MixJar

- [x] 1.1 Em `src/components/simulator/MixJar.tsx`, remover o bloco `AnimatedSvgText` "Seu Mix Exclusivo" (linhas ~217-227)
- [x] 1.2 Remover o `useSharedValue` e `useEffect` de `labelOpacity`, e o `useAnimatedProps` de `labelProps`
- [x] 1.3 Remover o import de `AnimatedSvgText` (`const AnimatedSvgText = Animated.createAnimatedComponent(SvgText)`) e o import de `SvgText` caso não seja mais usado
- [x] 1.4 Atualizar `src/components/simulator/__tests__/MixJar.test.ts` — remover asserções que verificam o texto "Seu Mix Exclusivo" e os cenários de label fade

## 2. Corrigir posicionamento do NudgeAlert na safe area

- [x] 2.1 Em `src/components/simulator/NudgeAlert.tsx`, adicionar import de `useSafeAreaInsets` de `react-native-safe-area-context`
- [x] 2.2 Chamar `const insets = useSafeAreaInsets()` dentro do componente `NudgeAlert`
- [x] 2.3 Substituir `top: spacing.lg` no `StyleSheet` por cálculo dinâmico: mover o `top` para style inline `top: insets.top + spacing.sm` no `Animated.View`
- [x] 2.4 Remover `top` do `StyleSheet.create` para evitar conflito com o inline

## 3. Testes

- [x] 3.1 Verificar que `npm run test -- --testPathPattern="MixJar"` passa sem erros após remoção do rótulo
- [x] 3.2 Verificar que `npm run test -- --testPathPattern="NudgeAlert"` passa (ou criar teste básico se não existir)
- [x] 3.3 Executar `npm run validate` e garantir lint/typecheck limpos
