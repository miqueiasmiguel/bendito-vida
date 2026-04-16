## 1. Store — action resetMix

- [x] 1.1 Adicionar action `resetMix: () => void` à interface do `useSimulatorStore` em `src/stores/useSimulatorStore.ts`
- [x] 1.2 Implementar `resetMix: () => set({ mixItems: {} })` no store Zustand
- [x] 1.3 Adicionar testes para `resetMix` em `src/stores/__tests__/useSimulatorStore.test.ts`: mix com itens → vazio; mix vazio → idempotente

## 2. IngredientCard — animação flash Reanimated 4

- [x] 2.1 Converter o container principal de `TouchableOpacity` para `Animated.View` (Reanimated 4) wrappando um `TouchableOpacity`; importar `useSharedValue`, `useAnimatedStyle`, `withSequence`, `withTiming` de `react-native-reanimated`
- [x] 2.2 Criar `flashAnim = useSharedValue(0)` e `animatedStyle` que interpola `backgroundColor` de `transparent` → `colors.primary[100]` → `transparent`
- [x] 2.3 No handler de `onPress`, disparar `flashAnim.value = withSequence(withTiming(1, { duration: 150 }), withTiming(0, { duration: 150 }))` antes de chamar `onPress(ingredient)`
- [x] 2.4 Remover o estilo `cardActive` do `StyleSheet` (background e borda verdes persistentes)
- [x] 2.5 Remover a referência a `cardActive` na prop `style` do card
- [x] 2.6 Atualizar testes em `src/components/simulator/__tests__/IngredientCard.test.tsx` para verificar ausência do estado ativo persistente e presença do badge de quantidade

## 3. Tela do Simulador — botão "Limpar Mix"

- [x] 3.1 Importar `resetMix` do `useSimulatorStore` em `src/app/(tabs)/simulator.tsx`
- [x] 3.2 Adicionar handler `handleReset` que chama `resetMix()`
- [x] 3.3 Renderizar `<Button variant="secondary" label="Limpar Mix" onPress={handleReset} />` dentro do `ctaContainer`, acima do botão primário, condicionado a `hasItems`
- [x] 3.4 Adicionar `marginBottom: spacing.sm` ao botão secundário para separação visual do botão primário

## 4. Spec do Simulador — atualizar openspec

- [x] 4.1 Confirmar que `openspec/specs/mix-simulator/spec.md` reflete o requisito atualizado (sem borda/fundo persistente) após o archive da mudança
