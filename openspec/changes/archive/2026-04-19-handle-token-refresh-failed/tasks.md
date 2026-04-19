## 1. Implementation

- [x] 1.1 In `src/stores/useAuthStore.ts`, add a guard at the top of the `onAuthStateChange` callback: if `event === 'TOKEN_REFRESH_FAILED'`, call `supabase.auth.signOut()`, set `{ user: null, sessionChecked: true, onboardingChecked: true }`, and return early

## 2. Verification

- [ ] 2.1 Manually verify: clear AsyncStorage (or use a revoked token), relaunch the app — confirm it lands on the login/welcome screen with no red error screen
- [x] 2.2 Run the existing test suite (`npm test`) and confirm no regressions
