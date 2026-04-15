## 1. Persistir bioactive_profile ao concluir o quiz

- [x] 1.1 Atualizar `markOnboardingComplete` em `useAuthStore.ts` para aceitar `profile: NutritionProfile` e incluí-lo no `upsert` como `bioactive_profile`
- [x] 1.2 Atualizar `quiz.tsx` para passar o `profile` calculado ao chamar `markOnboardingComplete(profile)`

## 2. Reidratar nutritionProfile na inicialização

- [x] 2.1 Expandir o `select` em `onAuthStateChange` (`useAuthStore.ts`) para incluir `bioactive_profile` além de `onboarding_completed`
- [x] 2.2 Após o fetch do profile, se `bioactive_profile` for não-nulo, chamar `useQuizStore.getState().setProfile(data.bioactive_profile as NutritionProfile)`

## 3. Carregar check-ins na inicialização das tabs

- [x] 3.1 Adicionar `useEffect` em `(tabs)/_layout.tsx` que chama `fetchCheckins(user.id)` quando `user` está disponível

## 4. Atualizar testes

- [x] 4.1 Atualizar `useAuthStore.test.ts` para refletir a nova assinatura de `markOnboardingComplete(profile)` e verificar que `bioactive_profile` é incluído no upsert
- [x] 4.2 Verificar e atualizar mocks de `markOnboardingComplete` em `quiz` tests (se existirem) para passar um `NutritionProfile` dummy
