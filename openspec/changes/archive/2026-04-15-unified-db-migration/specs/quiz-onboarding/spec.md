## MODIFIED Requirements

### Requirement: Navegação pós-conclusão do quiz
Ao responder a última pergunta e confirmar, o sistema SHALL: (1) chamar `markOnboardingComplete()` do `useAuthStore` para persistir a flag `onboarding_completed = true` na tabela `profiles` do Supabase, (2) chamar `useQuizStore.setProfile(profile)` para salvar o perfil calculado, e (3) navegar para `/(tabs)/home` usando `router.replace` (não `router.push`), para que o stack de navegação não permita voltar ao quiz após a conclusão. A persistência da flag SHALL ocorrer antes da navegação. A tabela `profiles` utilizada é a definida em `0001_initial_schema.sql` — que inclui os campos `onboarding_completed`, `name` e `bioactive_profile`.

#### Scenario: Conclusão do quiz com persistência bem-sucedida
- **WHEN** o usuário confirma a resposta da última pergunta (pergunta 5) e a operação Supabase é bem-sucedida
- **THEN** `markOnboardingComplete()` é chamado, o perfil é salvo no Zustand, e o app navega para `/(tabs)/home` via `router.replace`, impedindo retorno ao quiz via botão Voltar

#### Scenario: Conclusão do quiz com falha na persistência
- **WHEN** o usuário confirma a resposta da última pergunta e a operação Supabase falha
- **THEN** o app navega para `/(tabs)/home` mesmo assim; `onboardingCompleted` permanece `false` no store local e a flag não foi gravada no Supabase

#### Scenario: Perfil salvo no Zustand antes de navegar
- **WHEN** o usuário toca "Concluir" na última pergunta
- **THEN** `useQuizStore.setProfile(profile)` é chamado antes de `router.replace`
