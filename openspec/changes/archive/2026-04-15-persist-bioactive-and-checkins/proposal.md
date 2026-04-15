## Why

After completing the quiz, the bioactive profile and daily check-in history exist only in memory — reloading the app wipes both. Users must redo the quiz and see an empty evolution chart, breaking core engagement flows.

## What Changes

- `markOnboardingComplete` now accepts the `NutritionProfile` and persists it to `profiles.bioactive_profile` in Supabase
- `onAuthStateChange` fetches both `onboarding_completed` and `bioactive_profile`, then hydrates `useQuizStore` if profile exists
- `(tabs)/_layout.tsx` calls `fetchCheckins(user.id)` on mount so check-in history loads before any tab renders

## Capabilities

### New Capabilities

_(none — all affected behavior belongs to existing capabilities)_

### Modified Capabilities

- `quiz-onboarding`: quiz completion must now persist the calculated nutrition profile to Supabase
- `home-screen`: bioactive map must load from persisted profile on app start, not only from in-session quiz state
- `progress-dashboard`: check-in history must be fetched from Supabase on app start so the chart and check-in state reflect real data

## Impact

- `src/stores/useAuthStore.ts` — signature change on `markOnboardingComplete`, expanded Supabase select, new `useQuizStore.setProfile` call
- `src/app/(onboarding)/quiz.tsx` — pass profile to `markOnboardingComplete`
- `src/app/(tabs)/_layout.tsx` — add `useEffect` boot for `fetchCheckins`
- `src/stores/__tests__/useAuthStore.test.ts` — update tests for new signature
- `src/app/(onboarding)/__tests__/quiz.test.tsx` (if exists) — update mock for new signature
