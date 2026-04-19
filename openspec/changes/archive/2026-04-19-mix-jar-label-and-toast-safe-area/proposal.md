## Why

O rótulo "Seu Mix Exclusivo" dentro do pote polui o visual quando há ingredientes e fica redundante com o contexto da tela. Além disso, os toasts de nudge usam `top: spacing.lg` fixo, sobrepondo a status bar em dispositivos com notch ou dynamic island.

## What Changes

- Remoção completa do rótulo SVG "Seu Mix Exclusivo" do componente `MixJar` (incluindo lógica de fade animado)
- Toast de nudge passa a respeitar a safe area superior, usando `useSafeAreaInsets` para calcular o offset correto

## Capabilities

### New Capabilities

- Nenhuma capability nova

### Modified Capabilities

- `mix-simulator`: comportamento visual do `MixJar` (sem rótulo) e posicionamento do `NudgeAlert` (safe area)

## Impact

- `src/components/simulator/MixJar.tsx` — remoção de `AnimatedSvgText` e estado `labelOpacity`/`labelProps`
- `src/components/simulator/NudgeAlert.tsx` — toast passa a usar `useSafeAreaInsets` para offset superior
- `src/components/simulator/__tests__/MixJar.test.ts` — atualizar snapshot/asserções que verificam label
- `src/components/simulator/__tests__/NudgeAlert.test.tsx` (se existir) — verificar cobertura
