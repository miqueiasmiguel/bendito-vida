## 1. Remover Migration Antiga

- [x] 1.1 Deletar o arquivo `supabase/migrations/20260415_add_onboarding_completed.sql`

## 2. Criar Migration Unificada

- [x] 2.1 Criar `supabase/migrations/0001_initial_schema.sql` com a função helper `set_updated_at()` e o trigger correspondente para a tabela `profiles`
- [x] 2.2 Adicionar DDL da tabela `profiles` com colunas: `id`, `name`, `onboarding_completed`, `bioactive_profile`, `created_at`, `updated_at`
- [x] 2.3 Adicionar RLS e policies (SELECT, INSERT, UPDATE) para `profiles` com `auth.uid() = id`
- [x] 2.4 Adicionar DDL da tabela `mixes` com colunas: `id`, `user_id`, `name`, `ingredients`, `nutrition`, `created_at`
- [x] 2.5 Adicionar índice `(user_id, created_at DESC)` na tabela `mixes`
- [x] 2.6 Adicionar RLS e policies (SELECT, INSERT, DELETE) para `mixes` com `auth.uid() = user_id`
- [x] 2.7 Adicionar DDL da tabela `weekly_checkins` com colunas: `id`, `user_id`, `week`, `energy_score`, `sleep_score`, `focus_score`, `created_at`
- [x] 2.8 Adicionar constraint `UNIQUE(user_id, week)` e CHECKs de range (1–5) em `weekly_checkins`
- [x] 2.9 Adicionar RLS e policies (SELECT, INSERT) para `weekly_checkins` com `auth.uid() = user_id`

## 3. Aplicar no Supabase

- [ ] 3.1 Aplicar a migration no projeto Supabase remoto via SQL Editor (Dashboard) ou `supabase db reset` (local)
- [ ] 3.2 Verificar no Table Editor que as tabelas `profiles`, `mixes` e `weekly_checkins` foram criadas com RLS ativo
<!-- manual step: run 0001_initial_schema.sql in Supabase Dashboard → SQL Editor -->

## 4. Atualizar Tipos TypeScript

- [x] 4.1 Atualizar ou criar `src/types/database.ts` com as interfaces `Profile`, `Mix` e `WeeklyCheckin` refletindo o schema (incluindo os novos campos `name` e `bioactive_profile` em `Profile`)

## 5. Atualizar Stores Existentes

- [x] 5.1 Verificar `useAuthStore` — garantir que `markOnboardingComplete()` faz UPSERT em `profiles` usando a tabela do novo schema (sem breaking change, já funcional)
- [x] 5.2 Criar `src/stores/useProfileStore.ts` com `fetchProfile(userId)`, expondo `profile` (tipo `Profile`), `mixes` (tipo `Mix[]`), `isLoading` e `error`
- [x] 5.3 Criar `src/stores/useProgressStore.ts` com `checkins` (tipo `WeeklyCheckin[]`), `addCheckin(data)` e `getCurrentWeekCheckin()` — persistindo via Supabase na tabela `weekly_checkins`
