## Why

A tela de Perfil é a última tela do MVP ainda não implementada. Ela fecha o fluxo do app ao centralizar identidade do usuário, histórico de mixes salvos, Mapa Bioativo resumido e configurações (incluindo logout), tornando o demo do edital completo e coeso.

## What Changes

- Adicionar rota `/(tabs)/profile` com a tela completa de Perfil
- Exibir avatar (inicial do nome), nome e data de cadastro do usuário
- Mostrar resumo do Mapa Bioativo (3 nutrientes prioritários do `bioactive_profile`)
- Listar mixes salvos (busca da tabela `mixes` no Supabase)
- Seção de configurações com opção de Logout (via `useAuthStore`)
- Criar store `useProfileStore` para encapsular fetch de dados do perfil e mixes

## Capabilities

### New Capabilities
- `profile-screen`: Tela de perfil com avatar, dados do usuário, mapa bioativo resumido, mixes salvos e logout

### Modified Capabilities
<!-- Nenhuma spec existente tem seus requisitos alterados -->

## Impact

- Nova rota: `src/app/(tabs)/profile.tsx`
- Novo store: `src/stores/useProfileStore.ts`
- Novo componente de domínio: `src/components/profile/` (SavedMixCard, BioactiveSummary)
- Lê dados do Supabase: tabelas `profiles` e `mixes`
- Usa `useAuthStore` para obter `user` e executar `signOut`
- Usa `useQuizStore` para exibir `bioactiveProfile`
- Dependência de dados: ingredientes já existentes em `src/data/ingredients.ts`
