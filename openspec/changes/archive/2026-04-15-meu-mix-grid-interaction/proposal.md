## Why

O simulador "Meu Mix" atualmente exibe ingredientes em scroll horizontal com cards de tamanho inconsistente, interação binária (toggle) e cor do jarro substituída a cada ingrediente. Isso prejudica a legibilidade, limita a expressividade da mistura e não comunica visualmente que múltiplos grãos compõem o mix.

## What Changes

- **Grade 3 colunas**: a lista de ingredientes passa de scroll horizontal para uma grade de 3 colunas com cards de **tamanho fixo e uniforme**, garantindo alinhamento perfeito independentemente do tamanho do nome/calorias do ingrediente.
- **Adição incremental de 30g**: cada toque num card adiciona 30g do ingrediente ao mix (em vez de toggle). Toques repetidos somam mais 30g. Um botão/indicador de quantidade no card permite remover porções.
- **Cores stackadas no jarro**: a cor de preenchimento do jarro passa a ser um **gradiente composto** por todas as cores dos ingredientes presentes no mix (proporcionais à quantidade), em vez de exibir apenas a cor do último ingrediente adicionado.

## Capabilities

### New Capabilities

- `mix-color-stack`: Lógica de composição de cor do jarro — empilha as cores dos ingredientes em proporção às suas quantidades (gramas) no mix.

### Modified Capabilities

- `mix-simulator`: A lista de ingredientes muda de scroll horizontal para grade 3 colunas com cards uniformes; a interação de seleção muda de toggle para adição incremental de 30g por toque; a renderização de cor do jarro muda para usar stack de cores.

## Impact

- `src/app/(tabs)/simulator.tsx` — layout e lógica de interação
- `src/components/simulator/IngredientCard.tsx` — dimensões fixas, indicador de quantidade
- `src/components/simulator/Jar.tsx` — gradiente de cor a partir do mix
- `src/stores/useSimulatorStore.ts` — model de quantidade (gramas) em vez de lista de selecionados binária
- `src/data/nutrition-engine.ts` — cálculos baseados em gramas (já existentes, pode precisar de ajuste)
- `openspec/specs/mix-simulator/spec.md` — requisitos atualizados
