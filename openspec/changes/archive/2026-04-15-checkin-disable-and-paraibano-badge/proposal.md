## Why

Dois bugs afetam a consistência visual e comportamental do app: o card de check-in diário continua habilitado após o usuário registrar o check-in (selector Zustand não-reativo), e o selo "paraibano" no Mapa Bioativo usa texto em vez do ícone de folha já consolidado no Meu Mix, quebrando a linguagem visual do design system.

## What Changes

- Corrigir selector `useProgressStore` em `progress.tsx` para assinar `checkins` diretamente, tornando `currentCheckin` reativo ao `addCheckin`
- O `WeeklyCheckinCard` em modo compact na home também deve receber `existingCheckin` e exibir estado desabilitado quando check-in do dia já foi feito
- Substituir o badge de texto "Paraibano" no `BioactiveMap` pelo mesmo selo circular com `<Leaf />` do Lucide usado no `IngredientCard`
- Atualizar testes afetados

## Capabilities

### New Capabilities

- Nenhuma nova capacidade. Ambas as mudanças são correções de bugs.

### Modified Capabilities

- `progress-dashboard`: comportamento do check-in diário muda — card e botão devem ficar desabilitados após o registro, sem necessidade de reload
- `home-screen`: o card compacto de check-in na home deve refletir o estado "já feito hoje"

## Impact

- `src/app/(tabs)/progress.tsx` — selector Zustand corrigido
- `src/app/(tabs)/home.tsx` — passar `existingCheckin` ao `WeeklyCheckinCard` compact (quando adicionado)
- `src/components/dashboard/BioactiveMap.tsx` — substituição do badge visual
- `src/components/dashboard/__tests__/` — atualização de testes de snapshot/comportamento
- Sem novas dependências externas; usa Lucide (já instalado)
