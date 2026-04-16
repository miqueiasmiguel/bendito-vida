## Why

A home exibe um botão "Montar meu Mix" redundante — a tab "Meu Mix" já está na barra de navegação inferior, tornando o CTA desnecessário e poluindo a tela. No simulador, a toast de nudge aparece na parte inferior (sliding up) e conflita visualmente com os botões CTA; além disso, seleções rápidas de ingredientes acumulam uma fila de toasts sequenciais que pode durar mais de 10 segundos, prejudicando a fluidez da experiência.

## What Changes

- **Remover botão "Montar meu Mix" da Home**: o CTA primário da tela Home que navega para `/(tabs)/simulator` é removido; a navegação já ocorre naturalmente pela tab bar.
- **Toast de nudge desce do topo**: a `NudgeAlert` passa a animar de cima para baixo (posição `top`, `translateY` negativo → 0), como uma notificação push nativa, em vez de subir do rodapé.
- **Nudges com substituição imediata (latest-wins)**: quando o usuário adiciona ingredientes rapidamente, novos nudges interrompem o atual imediatamente em vez de enfileirar. A queue é descartada e o nudge mais recente é exibido sem esperar a animação anterior terminar.

## Capabilities

### New Capabilities
- Nenhuma nova capability.

### Modified Capabilities
- `home-screen`: o requirement "CTA Montar meu Mix" é removido; a tela não SHALL mais exibir esse botão.
- `mix-simulator`: o comportamento da NudgeAlert é alterado — posição top, animação top-down, e política latest-wins para a fila de nudges.

## Impact

- `src/app/(tabs)/home.tsx` — remover o botão e imports relacionados
- `src/components/simulator/NudgeAlert.tsx` — alterar posição e direção de animação
- `src/app/(tabs)/simulator.tsx` — alterar lógica de fila de nudges para latest-wins
- `openspec/specs/home-screen/spec.md` — remover requirement "CTA Montar meu Mix"
- `openspec/specs/mix-simulator/spec.md` — atualizar requirement de nudge toast (posição e política de fila)
