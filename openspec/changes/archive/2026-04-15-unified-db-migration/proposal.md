## Why

O app Bendito Vida persiste dados via Supabase, mas atualmente só existe uma migration parcial (`20260415_add_onboarding_completed.sql`) que cria a tabela `profiles` com campos mínimos. Nenhuma das demais entidades do domínio (mixes salvos, check-ins semanais) tem tabela definida, bloqueando a implementação completa do fluxo de persistência. A migration existente deve ser unificada em um único arquivo inicial para simplificar o bootstrap do banco e garantir consistência entre ambientes.

## What Changes

- **Remover** a migration parcial `supabase/migrations/20260415_add_onboarding_completed.sql`
- **Criar** uma única migration inicial `supabase/migrations/0001_initial_schema.sql` contendo todas as tabelas do domínio
- **Adicionar** campo `name` e `bioactive_profile` à tabela `profiles`
- **Criar** tabela `mixes` para persistência de mixes salvos pelo usuário
- **Criar** tabela `weekly_checkins` para check-ins semanais do Dashboard de Evolução
- **Adicionar** RLS policies completas em todas as tabelas (select, insert, update, delete onde aplicável)
- **Adicionar** trigger `updated_at` automático para `profiles`

## Capabilities

### New Capabilities

- `database-schema`: Schema unificado do Supabase com todas as tabelas do domínio (`profiles`, `mixes`, `weekly_checkins`), RLS, índices e trigger de `updated_at`

### Modified Capabilities

- `quiz-onboarding`: A persistência do flag de onboarding passa a usar a tabela `profiles` com o campo `onboarding_completed` — sem mudança de comportamento, mas agora com schema formal
- `profile-screen`: O `useProfileStore` busca da tabela `mixes` — essa tabela agora estará definida no schema

## Impact

- **Arquivos removidos:** `supabase/migrations/20260415_add_onboarding_completed.sql`
- **Arquivos criados:** `supabase/migrations/0001_initial_schema.sql`
- **Supabase:** Requer reset e re-apply do schema no projeto Supabase (Dashboard → SQL Editor ou CLI `supabase db reset`)
- **Código existente:** Nenhum impacto — as colunas e tabelas já usadas (`profiles.onboarding_completed`) são mantidas; novos campos (`name`, `bioactive_profile`) são NULLable
- **Dependências:** Nenhuma nova dependência de pacote
