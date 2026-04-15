## MODIFIED Requirements

### Requirement: Navegação pós-conclusão do quiz
Ao responder a última pergunta e confirmar, o sistema SHALL: (1) chamar `markOnboardingComplete(profile)` do `useAuthStore` para persistir `onboarding_completed = true` **e** `bioactive_profile` (objeto `NutritionProfile` serializado) na tabela `profiles` do Supabase, (2) chamar `useQuizStore.setProfile(profile)` para salvar o perfil calculado em memória, e (3) navegar para `/(tabs)/home` usando `router.replace`. A persistência SHALL ocorrer antes da navegação. Falhas na persistência não SHALL bloquear a navegação.

#### Scenario: Conclusão do quiz com persistência bem-sucedida
- **WHEN** o usuário confirma a resposta da última pergunta e a operação Supabase é bem-sucedida
- **THEN** `markOnboardingComplete(profile)` é chamado com o `NutritionProfile` calculado, `profiles.bioactive_profile` é gravado no Supabase, e o app navega para `/(tabs)/home` via `router.replace`

#### Scenario: Conclusão do quiz com falha na persistência
- **WHEN** o usuário confirma a resposta da última pergunta e a operação Supabase falha
- **THEN** o app navega para `/(tabs)/home` mesmo assim; `onboardingCompleted` permanece `false` no store local e a flag não foi gravada no Supabase

#### Scenario: Perfil salvo no Zustand antes de navegar
- **WHEN** o usuário toca "Concluir" na última pergunta
- **THEN** `useQuizStore.setProfile(profile)` é chamado antes de `router.replace`
