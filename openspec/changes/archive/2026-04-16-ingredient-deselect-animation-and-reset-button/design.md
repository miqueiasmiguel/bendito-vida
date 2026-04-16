## Context

O `IngredientCard` usa `StyleSheet` estático com `cardActive` (fundo `primary[100]`, borda `primary[700]`) aplicado permanentemente quando `grams > 0`. O usuário reportou que esse estado permanente parece "travado" — visualmente confuso. O badge de quantidade laranja já sinaliza adequadamente a presença do ingrediente no mix. O objetivo é substituir o estado visual permanente por um feedback transitório de 300ms.

O `useSimulatorStore` expõe `addGrams` e `removeIngredient`, mas não tem ação de reset total. A tela do simulador não oferece atalho para limpar tudo de uma vez.

## Goals / Non-Goals

**Goals:**
- Flash verde transitório (300ms) ao tocar em qualquer `IngredientCard`, sem persistência de cor de fundo
- `resetMix()` action no store que zera todos os itens do mix
- Botão "Limpar Mix" na tela do simulador, visível apenas quando `hasItems === true`

**Non-Goals:**
- Confirmação (modal/alert) antes do reset — ação é reversível adicionando os ingredientes novamente
- Alterar o comportamento do badge de quantidade
- Reestilizar o jarro ou a tela de resultado

## Decisions

### 1. Animação com Reanimated 4 `useSharedValue` + `withTiming` + `withSequence`

O card usa `Animated.View` (Reanimated 4) com `backgroundColor` animado via `useAnimatedStyle`. No press:
```
backgroundColor: withSequence(
  withTiming(primary[100], { duration: 150 }),
  withTiming('transparent', { duration: 150 })
)
```
Isso manteia o cálculo no UI thread (zero JS bridge), consistente com o resto das animações do projeto.

**Alternativa considerada**: `Animated.View` do RN core com `useRef` + `start()` — descartado por ser incompatível com New Architecture e violar a regra de não usar `Animated` do RN.

### 2. Remover `cardActive` do StyleSheet

O estilo `cardActive` (`backgroundColor: primary[100]`, `borderColor: primary[700]`) é completamente removido. A borda ativa desaparece junto com o fundo verde permanente. O badge de quantidade é o único indicador visual persistente de presença no mix. Isso simplifica a lógica de estilo e elimina a confusão visual.

### 3. `resetMix()` como action simples no Zustand

```ts
resetMix: () => set({ mixItems: {} })
```

Sem confirmação — a ação é leve e reversível. O botão "Limpar Mix" usa `variant="secondary"` (borda `primary[700]`, sem fill laranja) para não competir com o CTA principal "Gerar Minha Receita".

### 4. Posição do botão "Limpar Mix"

Inserido no `ctaContainer`, acima do botão primário, com `marginBottom: spacing.sm`. Visível apenas quando `hasItems === true`. Evita mudar o layout da seção do jarro.

## Risks / Trade-offs

- **Perda de feedback visual de estado ativo** → Mitigação: o badge de quantidade (laranja, canto superior esquerdo) já indica claramente que o ingrediente está no mix com a quantidade em gramas. Usuários de teste confirmaram que o badge é suficiente.
- **Reset acidental** → Aceitável para MVP; não justifica adicionar um modal de confirmação que aumentaria a complexidade e travaria usuários idosos.
- **`IngredientCard` convertido para `Animated.View` (Reanimated)** → Requer importar `useAnimatedStyle`, `useSharedValue`, `withTiming`, `withSequence` de `react-native-reanimated`. Já é dependência do projeto.
