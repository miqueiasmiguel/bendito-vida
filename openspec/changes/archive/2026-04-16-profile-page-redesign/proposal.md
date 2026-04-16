## Why

A tela de Perfil atual mistura informações demais em uma única ScrollView longa — mapa bioativo simplificado, lista de mixes e botão de logout estão empilhados sem hierarquia clara. O `BioactiveSummary` é um componente secundário que não comunica a riqueza do radar chart já existente no Home, e tanto "Meus Mixes" quanto "Configurações" ficam enterrados no scroll sem acesso rápido. A revisão reorganiza o Perfil como hub de navegação e eleva a qualidade visual do mapa bioativo.

## What Changes

- **Tela principal de Perfil (`/(tabs)/profile`)** deixa de ser uma ScrollView monolítica e passa a ser um hub de navegação com cards de acesso rápido, estatísticas resumidas e o `BioactiveMap` completo (radar chart) no lugar do `BioactiveSummary` simplificado.
- **Nova sub-tela "Meus Mixes" (`/(tabs)/profile/my-mixes`)**: lista paginada de mixes salvos com `SavedMixCard`, estado vazio e skeleton loaders — toda a lógica de listagem sai do perfil principal.
- **Nova sub-tela "Configurações" (`/(tabs)/profile/settings`)**: permite alterar o nome de exibição (campo `name` no Supabase `profiles`) com feedback de sucesso/erro, e contém o botão "Sair da conta".
- **Cards de estatísticas** no perfil principal: total de mixes criados e dias de uso do app (calculado a partir de `created_at`).
- **Remoção do `BioactiveSummary`** da tela de Perfil; substituição pelo `BioactiveMap` existente (reutilização, sem duplicação).
- **BREAKING**: O componente `BioactiveSummary` passa a não ser usado na tela de Perfil (pode ser descontinuado ou mantido para uso futuro).

## Capabilities

### New Capabilities

- `profile-my-mixes-screen`: Sub-tela de listagem de mixes do usuário, acessada pelo hub de Perfil, com suporte a paginação futura.
- `profile-settings-screen`: Sub-tela de configurações com edição de nome de exibição e logout.

### Modified Capabilities

- `profile-screen`: O hub de perfil é reformulado — novo layout com `BioactiveMap`, stats cards e navegação para sub-telas em vez de seções inline.

## Impact

- `src/app/(tabs)/profile.tsx` — refatoração completa do layout
- `src/app/(tabs)/profile/my-mixes.tsx` — arquivo novo
- `src/app/(tabs)/profile/settings.tsx` — arquivo novo
- `src/components/profile/BioactiveSummary.tsx` — passa a não ser referenciado (pode ser deletado no cleanup)
- `src/stores/useProfileStore.ts` — adicionar `updateName(name: string)` para salvar nome no Supabase
- `openspec/specs/profile-screen/spec.md` — requisitos atualizados
