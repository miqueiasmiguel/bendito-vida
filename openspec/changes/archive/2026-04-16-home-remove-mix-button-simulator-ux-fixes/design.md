## Context

A home screen já possui navegação por tab bar para o simulador; o botão "Montar meu Mix" é duplicação de UX. A `NudgeAlert` foi implementada com animação bottom-up (snackbar style), mas o pedido é que seja top-down (notificação push nativa). O problema de latência nos nudges vem da política de fila FIFO: cada nudge aguarda 3.3s (300ms in + 2700ms hold + 300ms out) antes do próximo aparecer — com 5 seleções rápidas, o usuário fica 16s recebendo toasts defasados.

## Goals / Non-Goals

**Goals:**
- Remover o botão "Montar meu Mix" da home sem impactar outras áreas
- Reposicionar `NudgeAlert` para o topo da tela com animação descendente
- Adotar política **latest-wins** para nudges: o nudge mais recente sempre substitui o atual imediatamente, sem acúmulo de fila

**Non-Goals:**
- Não alterar o conteúdo ou lógica de geração dos nudges (`generateNudges`)
- Não redesenhar o layout geral do simulador
- Não mudar a duração de exibição de um nudge individual (3s é adequado quando não há sobreposição)

## Decisions

### D1 — Latest-wins via `key` prop (remount)

**Decisão**: Quando novos nudges chegam (independente se há um ativo), substituir `currentNudge` pelo nudge mais relevante do novo batch e incrementar um contador `nudgeKey`. Passar `key={nudgeKey}` para `NudgeAlert` força remount do componente, reiniciando a animação limpa sem precisar chamar `cancelAnimation` explicitamente.

**Alternativa considerada**: Usar `cancelAnimation` da Reanimated para interromper a sequência atual e reiniciar valores. Mais complexo: requer expor `translateY`/`opacity` via ref ou contexto, e tem edge cases de estado inconsistente entre JS e UI thread.

**Por que latest-wins em vez de fila rápida**: Fila rápida (reduzir duração quando há itens pendentes) ainda acumula delays. Latest-wins garante que o usuário sempre vê informação relevante ao estado atual do mix, não ao estado de 5 seleções atrás.

**Seleção do nudge mais relevante**: De um batch retornado por `generateNudges`, priorizar `warning` > `suggestion` > `info`. Se o batch contiver somente o nudge paraibano (`info`), mostrá-lo — é contextual ao último toque.

### D2 — NudgeAlert reposicionada no topo com SafeAreaView awareness

**Decisão**: Alterar `bottom: 80` para `top: spacing.lg` (abaixo da safe area) e inverter `translateY` de `60` para `-60` (começa acima da tela, desce para 0). Manter `pointerEvents="none"` para não bloquear a grade de ingredientes.

**Por que `top: spacing.lg`**: Posiciona abaixo da barra de status sem precisar injetar `useSafeAreaInsets` no componente; o parent `SafeAreaView` já garante o offset necessário.

### D3 — Remoção do botão na home

**Decisão**: Remover o bloco `{topNutrients.length > 0 && <Button ...>}` de `home.tsx`. Remover o import `router` de `expo-router` se não for mais usado; remover o import `Button` se não houver outro uso.

**Verificação necessária**: `home.tsx` usa `router` apenas para o botão CTA e para o `onQuizPress` de `BioactiveMap`. Checar se `BioactiveMap` recebe `onQuizPress` como callback ou usa `router` internamente antes de remover o import.

## Risks / Trade-offs

- **[Risco] Nudge perdido** → Com latest-wins, nudges intermediários nunca são exibidos. Mitigação: `generateNudges` é determinístico — o nudge gerado pelo próximo toque já reflete o estado acumulado do mix, então a informação mais relevante sempre prevalece.
- **[Trade-off] Remount vs cancelAnimation** → Remount reinicia o componente inteiro (recria shared values). É levemente mais pesado que cancelar animação, mas insignificante para um componente pequeno. Benefício: sem lógica de estado inconsistente.
- **[Risco] Import desnecessário após remoção do botão** → `router` em `home.tsx` pode ser usado em `onQuizPress`. Verificar antes de remover.
