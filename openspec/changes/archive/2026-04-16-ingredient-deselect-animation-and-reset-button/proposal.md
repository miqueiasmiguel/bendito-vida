## Why

Quando um ingrediente é adicionado ao mix, o card fica permanentemente verde — o que confunde o usuário porque parece que ele está "bloqueado" naquele estado. Além disso, não há forma de limpar o mix sem remover ingrediente por ingrediente.

## What Changes

- O estado ativo permanente (fundo verde + borda verde) do `IngredientCard` é substituído por uma animação de flash: ao tocar, o card pisca verde por ~300ms e depois retorna às cores normais. O badge de quantidade (laranja, canto superior esquerdo) continua sendo o único indicador visual persistente de que o ingrediente está no mix.
- Um botão **"Limpar Mix"** é adicionado à tela do simulador (`(tabs)/simulator.tsx`), visível apenas quando há ao menos 1 ingrediente no mix. Ao pressionar, zera todos os ingredientes do mix (`resetMix` action no store).

## Capabilities

### New Capabilities
- `ingredient-flash-animation`: Animação de flash verde transitória (300ms, Reanimated 4) ao tocar em um `IngredientCard`, sem estado ativo persistente de cor de fundo.
- `mix-reset-button`: Botão "Limpar Mix" na tela do simulador que zera todos os ingredientes do mix de uma só vez.

### Modified Capabilities
- `mix-simulator`: O requisito de exibir `backgroundColor: primary[100]` e `borderColor: primary[700]` permanente quando `grams > 0` é removido. A borda ativa é substituída pela animação flash. O badge de quantidade já sinaliza a presença do ingrediente.

## Impact

- `src/components/simulator/IngredientCard.tsx` — remover `cardActive` background/border persistente; adicionar animação Reanimated 4 no press
- `src/stores/useSimulatorStore.ts` — adicionar action `resetMix()`
- `src/app/(tabs)/simulator.tsx` — adicionar botão "Limpar Mix" condicional
- `src/components/simulator/__tests__/IngredientCard.test.tsx` — atualizar testes
- `src/stores/__tests__/useSimulatorStore.test.ts` — adicionar teste para `resetMix`
- `openspec/specs/mix-simulator/spec.md` — delta dos requisitos alterados
