## Why

O badge de texto "Paraibano" no IngredientCard ocupa espaço valioso no card compacto e compete visualmente com o nome do ingrediente. Um selo discreto no canto — como um indicador de notificação — comunica a informação de origem de forma mais elegante e alinhada à identidade visual orgânica do app.

## What Changes

- O badge "Paraibano" deixa de ser uma pílula de texto (`primary-100` bg + `primary-700` text) e passa a ser uma **bolinha verde com ícone de folha** posicionada no canto superior esquerdo do IngredientCard, sobrepondo levemente a borda do card como um selo.
- O ícone usa a folha (`Leaf`) da Lucide React Native em branco sobre fundo `primary-700`.
- O badge novo é posicionado com `position: absolute`, `top: -6`, `left: -6`, diâmetro 20px, para criar o efeito de notificação/selo.
- Nenhuma mudança funcional — ingredientes com `isParaibano: true` continuam sendo sinalizados; apenas a apresentação visual muda.

## Capabilities

### New Capabilities

_(nenhuma — mudança puramente visual em funcionalidade existente)_

### Modified Capabilities

- `mix-simulator`: O requisito de exibição do badge "Paraibano" muda — de texto-pílula para ícone-selo no canto superior esquerdo do IngredientCard.

## Impact

- `src/components/simulator/IngredientCard.tsx` — redesenho do badge visual
- `openspec/specs/mix-simulator/spec.md` — atualização dos cenários de badge paraibano
- Testes unitários do IngredientCard precisam ser atualizados para refletir o novo visual
