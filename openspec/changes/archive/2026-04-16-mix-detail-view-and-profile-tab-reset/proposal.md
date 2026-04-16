## Why

Dois problemas de UX impedem que o usuário navegue naturalmente pelo app: (1) ao listar seus mixes salvos, não há como ver os detalhes de um mix específico; (2) ao voltar para a aba de Perfil após navegar para "Meus Mixes", o app retorna para a sub-tela em vez da tela principal do Perfil, quebrando a expectativa de que clicar em uma tab reinicia a navegação daquela aba.

## What Changes

- **SavedMixCard** passa a ser tapeável e navega para a tela de detalhes do mix selecionado.
- Nova rota `/(tabs)/profile/mix-detail` exibe o perfil nutricional e o cartão compartilhável de um mix salvo, reutilizando a UI de `result.tsx` (NutrientBar, RecipeCard, share). Lê o mix via parâmetro de rota (`mixId`) buscando no `useProfileStore`.
- A tela de detalhes remove os botões "Salvar no perfil" (já salvo) e "Voltar ao simulador" (contexto diferente), mantendo apenas "Compartilhar".
- O `_layout.tsx` da aba Profile passa a ouvir o evento `tabPress` do Expo Router e chama `router.replace('/(tabs)/profile')` para garantir que clicar na tab sempre retorne ao hub de Perfil.

## Capabilities

### New Capabilities
- `mix-detail-view`: Tela de detalhe de um mix salvo acessível a partir de "Meus Mixes", reutilizando os componentes NutrientBar e RecipeCard com dados do `useProfileStore`.

### Modified Capabilities
- `profile-my-mixes-screen`: `SavedMixCard` agora recebe `onPress` e navega para `/(tabs)/profile/mix-detail?mixId=<id>`.
- `profile-screen`: O layout da aba Profile reseta a stack para o índice quando a tab é pressionada.

## Impact

- `src/app/(tabs)/profile/mix-detail.tsx` — novo arquivo de rota
- `src/app/(tabs)/profile/_layout.tsx` — adicionar listener de `tabPress`
- `src/components/profile/SavedMixCard.tsx` — adicionar prop `onPress`
- `src/app/(tabs)/profile/my-mixes.tsx` — passar `onPress` para `SavedMixCard`
- `openspec/specs/mix-detail-view/spec.md` — nova spec
- `openspec/specs/profile-my-mixes-screen/spec.md` — delta spec (onPress em SavedMixCard)
- `openspec/specs/profile-screen/spec.md` — delta spec (tab reset behavior)
