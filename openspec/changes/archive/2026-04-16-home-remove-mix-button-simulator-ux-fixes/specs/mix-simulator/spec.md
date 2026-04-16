## MODIFIED Requirements

### Requirement: NudgeAlert — posição, animação e política de exibição
A `NudgeAlert` SHALL ser exibida no **topo** da tela do simulador, posicionada absolutamente com `top: spacing.lg`, e SHALL animar de cima para baixo: entrando com `translateY` de `-60` (acima da viewport) até `0`, e saindo de volta para `-60`. Quando novos nudges chegam enquanto um nudge está ativo, o **nudge mais recente SHALL substituir imediatamente** o nudge em exibição (política latest-wins); a fila FIFO SHALL ser eliminada. O `simulator.tsx` SHALL manter um contador `nudgeKey` (incrementado a cada novo nudge) e passá-lo como `key` para `NudgeAlert`, forçando remount e reinício limpo da animação. De um batch retornado por `generateNudges`, a prioridade de seleção SHALL ser: `warning` > `suggestion` > `info`.

#### Scenario: Nudge aparece ao adicionar primeiro ingrediente
- **WHEN** o usuário toca em um ingrediente pela primeira vez e `generateNudges` retorna ao menos 1 nudge
- **THEN** a NudgeAlert aparece descendo do topo da tela (translateY -60 → 0) em 300ms

#### Scenario: Seleção rápida de vários ingredientes substitui nudge imediatamente
- **WHEN** o usuário toca em 3 ingredientes em menos de 1 segundo enquanto um nudge está visível
- **THEN** o nudge anterior é descartado e o nudge mais recente (maior prioridade do último batch) aparece imediatamente, sem fila acumulada

#### Scenario: Nudge some automaticamente após 3 segundos
- **WHEN** um nudge aparece e nenhum novo nudge chega
- **THEN** a NudgeAlert some subindo de volta ao topo (translateY 0 → -60) após ~3 segundos e `onDismiss` é chamado

#### Scenario: Nudge de warning tem prioridade sobre info no mesmo batch
- **WHEN** `generateNudges` retorna `[{ type: 'info', ... }, { type: 'warning', ... }]`
- **THEN** o nudge de tipo `warning` é exibido
