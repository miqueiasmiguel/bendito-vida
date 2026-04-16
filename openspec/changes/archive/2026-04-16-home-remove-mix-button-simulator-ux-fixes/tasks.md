## 1. Remover botão "Montar meu Mix" da Home

- [x] 1.1 Em `src/app/(tabs)/home.tsx`, remover o bloco condicional `{topNutrients.length > 0 && <View style={styles.section}><Button variant="primary" label="Montar meu Mix" .../></View>}`
- [x] 1.2 Verificar se `router` ainda é usado em `home.tsx` após a remoção; se não, remover o import `{ router } from 'expo-router'`
- [x] 1.3 Verificar se `Button` ainda é usado em `home.tsx` após a remoção; se não, remover o import de `@/components/ui`

## 2. Reposicionar NudgeAlert para o topo com animação descendente

- [x] 2.1 Em `src/components/simulator/NudgeAlert.tsx`, alterar `translateY` inicial de `60` para `-60`
- [x] 2.2 Alterar os dois `withTiming` de saída para `withTiming(-60, ...)` (retorna para cima)
- [x] 2.3 No `StyleSheet`, alterar `bottom: 80` para `top: spacing.lg` no estilo `toast`

## 3. Implementar política latest-wins no simulador

- [x] 3.1 Em `src/app/(tabs)/simulator.tsx`, remover `nudgeQueue` (ref com array) — não será mais necessário
- [x] 3.2 Adicionar estado `nudgeKey` (`useState(0)`) para forçar remount da `NudgeAlert`
- [x] 3.3 Reescrever o `useEffect` de nudge: quando `mixEntries.length` muda, chamar `generateNudges`, selecionar o nudge de maior prioridade (`warning` > `suggestion` > `info`) do batch retornado, atualizar `currentNudge` e incrementar `nudgeKey`
- [x] 3.4 Adicionar `key={nudgeKey}` na `NudgeAlert` no JSX do simulador
- [x] 3.5 Remover a função `showNextNudge` e o callback `handleDismissNudge` que processa a fila — `onDismiss` agora apenas reseta `currentNudge` para `null`

## 4. Atualizar specs canônicas no repositório

- [x] 4.1 Em `openspec/specs/home-screen/spec.md`, remover o bloco do requirement "CTA Montar meu Mix" e seus scenarios
- [x] 4.2 Em `openspec/specs/mix-simulator/spec.md`, localizar e substituir a descrição de comportamento da `NudgeAlert` para refletir posição top, animação descendente e política latest-wins
