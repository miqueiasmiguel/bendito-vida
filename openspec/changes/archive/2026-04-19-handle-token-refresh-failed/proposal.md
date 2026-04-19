## Why

When a stored refresh token is expired or revoked (e.g. after a Supabase project pause or long inactivity), the Supabase client throws an unhandled `AuthApiError` on app startup, crashing the app with a red screen instead of gracefully redirecting the user to login.

## What Changes

- The `onAuthStateChange` listener in `useAuthStore` will handle the `TOKEN_REFRESH_FAILED` event explicitly, calling `supabase.auth.signOut()` to clear the stale token from AsyncStorage and setting auth state to unauthenticated.

## Capabilities

### New Capabilities

- `auth-token-refresh-error-handling`: Graceful handling of invalid/expired refresh tokens on app startup — clears stale session and redirects to login without crashing.

### Modified Capabilities

<!-- None — no existing spec-level behavior changes -->

## Impact

- `src/stores/useAuthStore.ts` — add one conditional branch in `onAuthStateChange`
- No API, dependency, or schema changes required
